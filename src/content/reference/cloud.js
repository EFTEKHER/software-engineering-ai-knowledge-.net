const data = {};
function add(key, en, bn, a, b, de, db) {
  data[key] = {
    en,
    bn,
    decisionEn: de,
    decisionBn: db,
    examples: [
      {
        title: "AWS inspection workflow · account ও resource যাচাই",
        language: "bash",
        code: a,
        kind: "CLI reference",
      },
      {
        title: ".NET integration or configuration · বড় integration উদাহরণ",
        language: "csharp",
        code: b,
        kind: "Integration fragment",
      },
    ],
  };
}
add(
  "EC2",
  "An instance combines an AMI, instance type, network interfaces, security groups, storage, and an IAM role. Stopping versus terminating affects lifecycle and attached storage differently. Application health, patching, startup supervision, and backup remain your responsibilities. Use metadata credentials through supported SDK providers rather than embedding long-lived keys on the machine.",
  "Instance-এ AMI, type, network, storage ও IAM role মিলে। Stop ও terminate আলাদা প্রভাব ফেলে। OS patch, startup, app health ও backup আপনার কাজ। Machine-এ স্থায়ী key না রেখে SDK provider দিয়ে role নিন।",
  `aws sts get-caller-identity
aws ec2 describe-instances --region ap-south-1 --query 'Reservations[].Instances[].{Id:InstanceId,State:State.Name,Type:InstanceType}'
aws ec2 describe-instance-status --include-all-instances --region ap-south-1
aws ec2 describe-security-groups --region ap-south-1
# Inspect before any start/stop/terminate operation.`,
  `using Amazon.EC2;
using Amazon.EC2.Model;
using var ec2=new AmazonEC2Client(Amazon.RegionEndpoint.APSouth1);
var response=await ec2.DescribeInstancesAsync(new DescribeInstancesRequest());
foreach(var reservation in response.Reservations)
    foreach(var instance in reservation.Instances)
        Console.WriteLine($"{instance.InstanceId}: {instance.State.Name}");
// AWSSDK.EC2; default credential chain; restrict IAM to required reads.`,
  "Choose a scaling group/service when replacement and health automation matter. An individual VM is not an availability strategy.",
  "Replacement ও health automation লাগলে group/service নিন। এক VM high availability নয়।",
);
add(
  "S3",
  "Buckets contain keyed objects with metadata and optional versions. Access can be controlled by identity policies, resource policies, and public-access protections. Versioning helps recover overwritten/deleted versions but increases storage and needs lifecycle rules. Uploading an object and writing ownership metadata to a database require a reconciliation plan.",
  "Bucket-এ key ও version-সহ object থাকে। Identity/resource policy ও public-access protection মিলিয়ে অনুমতি। Versioning recovery সাহায্য করে, খরচও বাড়ায়। Object ও DB metadata এক transaction নয়।",
  `aws sts get-caller-identity
aws s3api get-bucket-location --bucket your-bucket
aws s3api get-public-access-block --bucket your-bucket
aws s3api get-bucket-versioning --bucket your-bucket
aws s3api list-objects-v2 --bucket your-bucket --max-keys 5`,
  `using Amazon.S3;
using Amazon.S3.Model;
using var s3=new AmazonS3Client(Amazon.RegionEndpoint.APSouth1);
var page=await s3.ListObjectsV2Async(new ListObjectsV2Request {
    BucketName="your-bucket",Prefix="uploads/",MaxKeys=5
});
foreach(var item in page.S3Objects)Console.WriteLine($"{item.Key}: {item.Size}");
// AWSSDK.S3; use pagination tokens for a complete inventory.`,
  "A prefix is not a filesystem directory. Never infer authorization from a hidden/random object key alone.",
  "Prefix filesystem-এর directory নয়। গোপন/random key একা permission-এর বিকল্প নয়।",
);
add(
  "IAM",
  "Policy evaluation considers identity, resource, action, conditions, and explicit denies, with organization/account boundaries adding constraints. Roles are assumed for temporary credentials; users and root credentials are different identities. Trust policy controls who can assume a role, while permissions policy controls what the assumed role may do.",
  "Policy-তে identity, resource, action, condition ও deny মেলে। Trust policy কে role নেবে, permission policy role কী করবে। Root, IAM user ও assumed role আলাদা পরিচয়। স্বল্পমেয়াদি credential ভালো।",
  `aws sts get-caller-identity
aws iam list-roles --max-items 5
aws iam get-role --role-name YourLearningRole
aws iam list-attached-role-policies --role-name YourLearningRole
# Inspect trust and permission documents separately.`,
  `using Amazon.SecurityToken;
using Amazon.SecurityToken.Model;
using var sts=new AmazonSecurityTokenServiceClient();
var identity=await sts.GetCallerIdentityAsync(new GetCallerIdentityRequest());
Console.WriteLine(identity.Account);
Console.WriteLine(identity.Arn);
// AWSSDK.SecurityToken; identity metadata is not the secret key.
// Avoid printing credentials returned by any assume-role operation.`,
  "Least privilege includes resource and condition scope, not only an action list. Review unused and cross-account access regularly.",
  "Action কমালেই শেষ নয়; resource ও condition scope-ও সীমিত করুন। Cross-account access review করুন।",
);
add(
  "RDS",
  "Managed relational hosting handles parts of patching, backup, and failover, while schema/query design and application access remain yours. Multi-AZ deployment and read replicas serve different goals. Connection storms can overwhelm a healthy database during scaling or restart. Recovery point and recovery time requirements need tested restore procedures.",
  "RDS কিছু hosting কাজ সামলায়, schema/query ও access আপনার। Multi-AZ availability, read replica read capacity—এক নয়। Restart বা scale-এ connection storm হয়। Backup থাকলেই restore-এর সময় নিশ্চিত নয়।",
  `aws rds describe-db-instances --region ap-south-1
aws rds describe-db-snapshots --db-instance-identifier your-db --region ap-south-1
aws rds describe-events --source-type db-instance --duration 60 --region ap-south-1
aws rds describe-db-parameters --db-parameter-group-name your-parameter-group --region ap-south-1`,
  `// ADO.NET provider fragment; obtain the connection string from secure config.
await using var connection=new Npgsql.NpgsqlConnection(connectionString);
await connection.OpenAsync(cancellationToken);
await using var command=new Npgsql.NpgsqlCommand("SELECT 1",connection);
command.CommandTimeout=3;
object? value=await command.ExecuteScalarAsync(cancellationToken);
Console.WriteLine(value);
// Configure bounded pooling and network/IAM/TLS according to the engine.`,
  "Do not route every consistency-sensitive read to a replica. Read-after-write and transaction semantics must be deliberate.",
  "সব read replica-তে নয়। Write-এর পরের read ও transaction-এর চুক্তি বুঝে route করুন।",
);
add(
  "Route 53",
  "DNS maps names through cached records to endpoints. Hosted zones, registrar delegation, and application hosting are separate. Routing policies can choose answers by health or location, but recursive/client caches affect change visibility. DNS failover cannot instantly move existing TCP connections or repair application-level incompatibility.",
  "DNS-এ cached record দিয়ে ঠিকানা আসে। Registrar, hosted zone ও hosting আলাদা। Health/location policy থাকলেও cache-এ পুরোনো উত্তর থাকে। DNS বদল পুরোনো TCP connection সরায় না।",
  `aws route53 list-hosted-zones --max-items 5
aws route53 list-resource-record-sets --hosted-zone-id YOUR_ZONE_ID --max-items 10
aws route53 list-health-checks --max-items 5
# Compare delegation and the intended zone before changing records.`,
  `using System.Net;
string host="example.com";
IPAddress[] addresses=await Dns.GetHostAddressesAsync(host);
foreach(var address in addresses)Console.WriteLine(address);
// Local resolution is a client observation, not the authoritative zone file.
// Capture resolver location and TTL context during DNS investigations.`,
  "Plan certificate names and domain ownership alongside DNS. A correct address does not guarantee the server accepts the hostname over TLS.",
  "DNS-এর সাথে certificate নাম ও domain ownership মিলান। IP ঠিক হলেও TLS hostname ভুল হতে পারে।",
);
add(
  "VPC",
  "A VPC divides address space into subnets with routing and filtering controls. A route selects a next hop; security groups permit stateful flows; network ACLs apply separate stateless rules. Private endpoints can avoid public paths for supported services. NAT allows outbound connections but is not an inbound application gateway.",
  "VPC-তে subnet, route ও filter। Route পথ বাছে, security group stateful permission দেয়, ACL আলাদা stateless। NAT outbound দেয়, inbound gateway নয়। Supported service-এ private endpoint কাজে লাগে।",
  `aws ec2 describe-vpcs --region ap-south-1
aws ec2 describe-subnets --region ap-south-1
aws ec2 describe-route-tables --region ap-south-1
aws ec2 describe-security-groups --region ap-south-1
aws ec2 describe-vpc-endpoints --region ap-south-1`,
  `record NetworkCheck(string Layer,string Question);
var checks=new[]{
    new NetworkCheck("Route","Is there a valid next hop?"),
    new NetworkCheck("Security group","Is the required port allowed?"),
    new NetworkCheck("Application","Is it listening on the expected interface?")
};
foreach(var check in checks)Console.WriteLine($"{check.Layer}: {check.Question}");`,
  "Avoid broad 0.0.0.0/0 rules as a generic connectivity fix. Diagnose route, identity, listener, and policy separately.",
  "সংযোগ ঠিক করতে অন্ধভাবে সব IP-র permission নয়। Route, listener, identity ও filter আলাদা দেখুন।",
);
add(
  "Lambda",
  "Functions run within platform-managed execution environments. Warm reuse can improve latency, but in-memory data is not guaranteed durable across invocations. Trigger type controls retry and acknowledgment behavior. Reserved concurrency, timeouts, payload limits, and downstream capacity shape safe throughput; a function scaling quickly can overload a fixed database.",
  "Warm environment reuse হতে পারে, কিন্তু memory স্থায়ী নয়। Trigger অনুযায়ী retry/ack বদলায়। Concurrency, timeout ও downstream সীমা দিন; দ্রুত scale হওয়া function DB ডুবিয়ে দিতে পারে।",
  `aws lambda list-functions --region ap-south-1 --max-items 5
aws lambda get-function-configuration --function-name your-function --region ap-south-1
aws lambda get-function-concurrency --function-name your-function --region ap-south-1
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/ --region ap-south-1`,
  `// Handler shape illustration; use the appropriate AWS .NET Lambda template.
public class Function {
    public string Handler(Request input) {
        if(string.IsNullOrWhiteSpace(input.Name))throw new ArgumentException("Name");
        return $"Hello {input.Name.Trim()}";
    }
}
public record Request(string Name);
// Serialization, runtime bootstrap, permissions, and deployment are template-specific.`,
  "Use idempotency for retryable triggers. Cold-start tuning should follow measurements; Native AOT has dependency and reflection constraints.",
  "Retryable trigger-এ idempotency দিন। Cold-start মেপে tune করুন; Native AOT-এ reflection-এর সীমা আছে।",
);
add(
  "CloudFront",
  "A distribution connects edge behavior, cache policy, origin request policy, TLS configuration, and origin access. Forwarding a header to origin and including it in a cache key are separate choices. Personalized data can leak when origin behavior varies on an unkeyed input. Versioned assets reduce invalidation complexity.",
  "Distribution-এ edge, cache key, origin request, TLS ও access মেলে। Header origin-এ পাঠানো ও key-তে রাখা আলাদা। Unkeyed input-এ ফল বদলালে data leak। Versioned asset purge সহজ করে।",
  `aws cloudfront list-distributions --max-items 5
aws cloudfront get-distribution-config --id YOUR_DISTRIBUTION
aws cloudfront list-invalidations --distribution-id YOUR_DISTRIBUTION
aws cloudfront list-cache-policies --type custom
# Review cache-key and origin-access rules before changing behavior.`,
  `string AssetUrl(string digest,string file)=>$"https://cdn.example.com/assets/{digest}/{file}";
Console.WriteLine(AssetUrl("v1hash","app.js"));
Console.WriteLine(AssetUrl("v2hash","app.js"));
var policy=new{Public=true,MaxAgeSeconds=31536000,Immutable=true};
Console.WriteLine(policy);
// Only apply immutable caching to genuinely immutable public URLs.`,
  "Origin access control and private bucket policies prevent bypassing the CDN for protected object origins. Keep viewer and origin permissions distinct.",
  "Private origin bypass ঠেকাতে origin access policy দিন। Viewer-এর অনুমতি ও origin-এর permission আলাদা।",
);
add(
  "Load Balancer",
  "AWS load balancers attach listeners and routing rules to target groups. Target health, application readiness, draining, and cross-zone distribution influence behavior. ALB and NLB operate at different protocol layers and suit different workloads. A healthy listener with an empty or unhealthy target group still cannot serve the application.",
  "Listener ও rule target group-এ যায়। Health, readiness, draining ও zone প্রভাব ফেলে। ALB ও NLB আলাদা স্তরের কাজ। Listener ঠিক কিন্তু target নেই বা unhealthy হলে app চলে না।",
  `aws elbv2 describe-load-balancers --region ap-south-1
aws elbv2 describe-listeners --load-balancer-arn YOUR_ALB_ARN --region ap-south-1
aws elbv2 describe-target-groups --region ap-south-1
aws elbv2 describe-target-health --target-group-arn YOUR_TARGET_GROUP_ARN --region ap-south-1`,
  `var targets=new[]{new Target("a",true,5),new Target("b",false,0),new Target("c",true,2)};
var selected=targets.Where(t=>t.Healthy).OrderBy(t=>t.Active).FirstOrDefault();
Console.WriteLine(selected?.Name??"No healthy target");
record Target(string Name,bool Healthy,int Active);
// Illustrates health-aware selection, not an AWS routing implementation.
// Match the real balancer's algorithm and protocol when diagnosing behavior.`,
  "Set health checks to meaningful inexpensive readiness endpoints. Ensure security groups and the target listening port allow the balancer path.",
  "হালকা কিন্তু অর্থপূর্ণ readiness endpoint দিন। Balancer থেকে target port-এর network permission-ও ঠিক করুন।",
);
add(
  "Auto Scaling",
  "A scaling group maintains desired capacity and can adjust it through policies. Warm-up, cooldown, instance health, metric selection, and safe scale-in all matter. CPU is not always a good proxy for queue or I/O-bound demand. Minimums and maximums are safety controls for availability, downstream saturation, and budget.",
  "Scaling group desired capacity রাখে। Warm-up, health, metric ও scale-in ভাবুন। I/O বা queue workload-এ CPU যথেষ্ট সংকেত নয়। Min/max availability ও budget-এর সুরক্ষা।",
  `aws autoscaling describe-auto-scaling-groups --region ap-south-1
aws autoscaling describe-policies --region ap-south-1
aws autoscaling describe-scaling-activities --auto-scaling-group-name YOUR_GROUP --region ap-south-1
aws cloudwatch describe-alarms --region ap-south-1`,
  `int minimum=2,maximum=10;
int pendingJobs=120,desiredJobsPerWorker=20;
int requested=(int)Math.Ceiling((double)pendingJobs/desiredJobsPerWorker);
int desired=Math.Clamp(requested,minimum,maximum);
Console.WriteLine($"Desired workers={desired}");
// A static teaching decision; real policies need dampening and startup delay.`,
  "Test scale-in draining and persistent state handling. Faster scale-out does not justify unlimited downstream connections.",
  "Scale-in-এ চলমান কাজ ও data রক্ষা test করুন। Unlimited downstream connection দেবেন না।",
);
add(
  "SNS",
  "SNS distributes notifications to independent subscriptions. Filtering can reduce irrelevant deliveries, while each subscription type has its own retries and failure behavior. Fanout to independent queues allows each consumer to buffer and recover separately. Message schemas, authenticity, and subscription permissions remain application responsibilities.",
  "SNS এক খবর বিভিন্ন subscriber-কে দেয়। Filter অপ্রাসঙ্গিক delivery কমায়। আলাদা queue-এ fanout করলে প্রতিটি consumer নিজে retry/buffer সামলায়। Schema ও permission আপনার কাজ।",
  `aws sns list-topics --region ap-south-1
aws sns list-subscriptions-by-topic --topic-arn YOUR_TOPIC_ARN --region ap-south-1
aws sns get-topic-attributes --topic-arn YOUR_TOPIC_ARN --region ap-south-1
# Publishing changes external state; use only an authorized test topic.`,
  `using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;
using var sns=new AmazonSimpleNotificationServiceClient(Amazon.RegionEndpoint.APSouth1);
var request=new PublishRequest {
    TopicArn="YOUR_TEST_TOPIC_ARN",
    Message=System.Text.Json.JsonSerializer.Serialize(new{EventId=Guid.NewGuid(),Kind="OrderPlaced"})
};
// await sns.PublishAsync(request); // Explicitly enable only in a test account.
Console.WriteLine(request.Message);`,
  "A notification topic is not the same as a worker queue with independent acknowledgment. Design fanout durability and dead-letter handling per subscriber.",
  "Topic worker queue-এর ack নয়। প্রতি subscriber-এর durable buffering ও dead-letter নকশা দিন।",
);
add(
  "SQS",
  "Receive gives a visibility lease, not permanent removal. Delete acknowledges successful handling. A crash after an effect but before delete can cause redelivery. Long polling reduces empty receives, while visibility extension supports long work. Standard and FIFO queues differ in ordering/deduplication scope and throughput characteristics.",
  "Receive সাময়িক lease দেয়, delete কাজ শেষ জানায়। Effect-এর পরে delete-এর আগে crash হলে আবার আসে। Long polling ফাঁকা call কমায়। Standard/FIFO-এর ordering ও throughput আলাদা।",
  `aws sqs list-queues --region ap-south-1
aws sqs get-queue-attributes --queue-url YOUR_QUEUE_URL --attribute-names All --region ap-south-1
# Receive changes visibility; inspect only your disposable learning queue.
# aws sqs receive-message --queue-url YOUR_QUEUE_URL --wait-time-seconds 10 --max-number-of-messages 1`,
  `using Amazon.SQS;
using Amazon.SQS.Model;
using var sqs=new AmazonSQSClient(Amazon.RegionEndpoint.APSouth1);
var batch=await sqs.ReceiveMessageAsync(new ReceiveMessageRequest {
    QueueUrl="YOUR_TEST_QUEUE_URL",WaitTimeSeconds=10,MaxNumberOfMessages=1
});
foreach(var message in batch.Messages) {
    Console.WriteLine(message.MessageId); // Avoid printing sensitive body data.
    // Process durably, then DeleteMessage with its receipt handle.
}`,
  "Do not delete before the effect commits. Make the business operation idempotent and bound retries with dead-letter/manual recovery.",
  "Effect commit-এর আগে delete নয়। Idempotent কাজ ও bounded retry/dead-letter দিন।",
);
add(
  "DynamoDB",
  "Partition and sort keys encode the primary access patterns. Conditional writes can enforce item-local invariants; transactions add further guarantees within supported boundaries. Secondary indexes have their own costs and consistency behavior. A table scan is not a substitute for an access-pattern design and can become expensive under growth.",
  "Partition/sort key-তে access pattern ধরা থাকে। Conditional write item-এর invariant রাখতে পারে। Secondary index-এর খরচ ও consistency আলাদা। Data বাড়লে scan দিয়ে ভুল design ঢাকবেন না।",
  `aws dynamodb list-tables --region ap-south-1
aws dynamodb describe-table --table-name YOUR_TABLE --region ap-south-1
aws dynamodb describe-time-to-live --table-name YOUR_TABLE --region ap-south-1
aws dynamodb describe-continuous-backups --table-name YOUR_TABLE --region ap-south-1`,
  `using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using var db=new AmazonDynamoDBClient(Amazon.RegionEndpoint.APSouth1);
var request=new GetItemRequest {
    TableName="YOUR_TABLE",ConsistentRead=true,
    Key=new Dictionary<string,AttributeValue>{{"pk",new AttributeValue{S="order#42"}}}
};
var result=await db.GetItemAsync(request);
Console.WriteLine(result.IsItemSet);`,
  "Avoid a single hot partition key for all traffic. Clarify strong/eventual read support for the specific table/index operation.",
  "সব traffic এক hot key-তে নয়। কোন table/index read-এ strong বা eventual কী আছে, তা দেখুন।",
);
add(
  "API Gateway",
  "Managed API Gateway provides routes, integration, authentication options, throttling, and deployment stages with service-specific constraints. It is not identical to a self-hosted reverse proxy. Payload, timeout, protocol, and pricing limits affect backend design. Keep service-side authorization and idempotency even when an edge authorizer validates identity.",
  "Managed gateway-এ route, integration, auth ও stage আছে, তবে নিজস্ব limit ও খরচ। Self-hosted proxy-এর ঠিক একই নয়। Edge-এ identity যাচাই হলেও service-এর resource permission ও idempotency লাগে।",
  `aws apigatewayv2 get-apis --region ap-south-1
aws apigatewayv2 get-routes --api-id YOUR_API_ID --region ap-south-1
aws apigatewayv2 get-integrations --api-id YOUR_API_ID --region ap-south-1
aws apigatewayv2 get-stages --api-id YOUR_API_ID --region ap-south-1`,
  `record ApiRoute(string Method,string Path,string Integration,bool Protected);
var routes=new[]{new ApiRoute("GET","/products/{id}","catalog",true),new ApiRoute("GET","/health","status",false)};
foreach(var route in routes)Console.WriteLine(route);
// Match HTTP API versus REST API tooling and the selected authorization mode.
// Deploy/test the intended stage rather than assuming route edits are live.`,
  "Check whether a request failed at routing, authorization, integration, or the application. Preserve correlation IDs through those layers.",
  "Routing, auth, integration নাকি app—কোন স্তরে fail দেখুন। Correlation id সব স্তরে রাখুন।",
);
add(
  "Secrets Manager",
  "Secrets Manager stores secret versions and supports rotation workflows. Retrieval permission and decrypt permission may both matter. Caching reduces retrieval overhead but must respect rotation and expiry policy. A configuration provider or SDK should deliver values only to authorized server-side code; browser bundles cannot keep them private.",
  "Secret-এর version ও rotation থাকে। Read ও decrypt permission দুটো লাগতে পারে। Cache overhead কমায়, কিন্তু rotation মানতে হবে। Value শুধু authorized server-এ; browser bundle-এ private থাকে না।",
  `aws secretsmanager list-secrets --max-results 5 --region ap-south-1
aws secretsmanager describe-secret --secret-id YOUR_SECRET_ID --region ap-south-1
aws secretsmanager list-secret-version-ids --secret-id YOUR_SECRET_ID --region ap-south-1
# Do not print secret values during an inventory check.`,
  `using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;
using var manager=new AmazonSecretsManagerClient(Amazon.RegionEndpoint.APSouth1);
var response=await manager.GetSecretValueAsync(new GetSecretValueRequest{SecretId="YOUR_SECRET_ID"});
string value=response.SecretString;
if(string.IsNullOrEmpty(value))throw new InvalidOperationException("Missing secret");
Console.WriteLine("Secret retrieved without logging its value");
// Parse/consume only for the authorized purpose and never return it to a browser.`,
  "Rotation needs the consuming application to adopt the new value safely. Updating the store alone does not guarantee all long-lived connections refreshed credentials.",
  "Store-এ rotate করলেই সব connection নতুন credential নেয় না। Consumer refresh ও old/new overlap পরিকল্পনা করুন।",
);
add(
  "CloudWatch",
  "Metrics, logs, and alarms are distinct signal types. A metric alarm evaluates a statistic over periods with a missing-data policy. Logging retention and dimensions affect cost. An alert needs a service owner and a concrete response path; a graph that looks busy is not itself an actionable health objective.",
  "Metric, log ও alarm আলাদা। Alarm period, statistic ও missing-data rule মানে। Retention ও dimension-এ খরচ। Alert-এর owner ও করণীয় না থাকলে graph-ই শুধু থাকে।",
  `aws cloudwatch describe-alarms --region ap-south-1 --max-records 10
aws logs describe-log-groups --region ap-south-1 --limit 10
aws cloudwatch list-metrics --namespace AWS/Lambda --region ap-south-1
# Review retention, dimensions, and alarm missing-data behavior.`,
  `using Amazon.CloudWatch;
using Amazon.CloudWatch.Model;
using var cw=new AmazonCloudWatchClient(Amazon.RegionEndpoint.APSouth1);
var alarms=await cw.DescribeAlarmsAsync(new DescribeAlarmsRequest{MaxRecords=10});
foreach(var alarm in alarms.MetricAlarms)
    Console.WriteLine($"{alarm.AlarmName}: {alarm.StateValue}");
// AWSSDK.CloudWatch; this is inventory, not proof of end-user health.`,
  "Choose latency/error/availability signals tied to user impact, and add diagnostics that explain them. Avoid one alarm per noisy log event.",
  "User-এর latency/error/availability অনুযায়ী alert দিন। প্রতিটি noisy log-এ alarm নয়।",
);
add(
  "ECS",
  "Task definitions specify a container workload; services maintain desired tasks and deployments. Execution roles support platform tasks such as image pulling, while task roles grant application permissions. Network mode, health checks, capacity providers, and startup/shutdown behavior determine actual reliability. Fargate and EC2 differ in host responsibility and control.",
  "Task definition workload-এর নকশা, Service কপি রাখে। Execution role image pull-এর মতো platform কাজ, task role অ্যাপের অধিকার। Network, health ও shutdown reliability ঠিক করে। Fargate/EC2-তে host-এর দায় আলাদা।",
  `aws ecs list-clusters --region ap-south-1
aws ecs list-services --cluster YOUR_CLUSTER --region ap-south-1
aws ecs describe-services --cluster YOUR_CLUSTER --services YOUR_SERVICE --region ap-south-1
aws ecs list-tasks --cluster YOUR_CLUSTER --service-name YOUR_SERVICE --region ap-south-1`,
  `using Amazon.ECS;
using Amazon.ECS.Model;
using var ecs=new AmazonECSClient(Amazon.RegionEndpoint.APSouth1);
var response=await ecs.DescribeServicesAsync(new DescribeServicesRequest {
    Cluster="YOUR_CLUSTER",Services=new List<string>{"YOUR_SERVICE"}
});
foreach(var service in response.Services)
    Console.WriteLine($"{service.ServiceName}: desired={service.DesiredCount}, running={service.RunningCount}");`,
  "Inspect service events for placement, image, and health problems. Desired count alone is not evidence of serving capacity.",
  "Placement, image ও health সমস্যা service event-এ দেখুন। Desired count-ই serving capacity নয়।",
);
add(
  "EKS",
  "EKS manages the Kubernetes control plane but cluster access, workload identities, nodes/capacity, networking, policies, and version upgrades still require ownership. Kubernetes RBAC and AWS IAM interact but solve different authorization boundaries. A managed control plane does not make application manifests production-ready by default.",
  "Control plane managed হলেও node, workload identity, policy, network ও upgrade-এর দায় থাকে। Kubernetes RBAC ও AWS IAM আলাদা সীমার অনুমতি। Managed control plane মানেই manifest production-ready নয়।",
  `aws eks list-clusters --region ap-south-1
aws eks describe-cluster --name YOUR_CLUSTER --region ap-south-1
aws eks list-nodegroups --cluster-name YOUR_CLUSTER --region ap-south-1
aws eks list-addons --cluster-name YOUR_CLUSTER --region ap-south-1`,
  `using Amazon.EKS;
using Amazon.EKS.Model;
using var eks=new AmazonEKSClient(Amazon.RegionEndpoint.APSouth1);
var result=await eks.DescribeClusterAsync(new DescribeClusterRequest{Name="YOUR_CLUSTER"});
Console.WriteLine(result.Cluster.Name);
Console.WriteLine(result.Cluster.Status);
Console.WriteLine(result.Cluster.Version);
// Do not print certificate/credential material when recording inventory.`,
  "Choose Kubernetes only when its capabilities justify operational complexity. Plan upgrades and workload compatibility before support deadlines.",
  "ক্ষমতার দরকার থাকলেই Kubernetes-এর জটিলতা নিন। Support শেষের আগে upgrade ও workload compatibility পরিকল্পনা করুন।",
);
add(
  "ECR",
  "A repository stores manifests and layers indexed by tags and digests. Scanning, lifecycle policies, immutable tags, and scoped push/pull rights protect distribution. The runtime needs permission to pull, independent of the builder’s publish rights. Deleting an image still referenced by a deployment can break future scale-out or disaster recovery.",
  "Repository-তে tag/digest-এ image থাকে। Scan, lifecycle ও সীমিত push/pull দরকার। Builder-এর publish ও runtime-এর pull অধিকার আলাদা। Deployed image মুছলে পরে scale বা recovery ভাঙতে পারে।",
  `aws ecr describe-repositories --region ap-south-1
aws ecr list-images --repository-name YOUR_REPOSITORY --region ap-south-1
aws ecr describe-images --repository-name YOUR_REPOSITORY --region ap-south-1
aws ecr get-lifecycle-policy --repository-name YOUR_REPOSITORY --region ap-south-1`,
  `using Amazon.ECR;
using Amazon.ECR.Model;
using var ecr=new AmazonECRClient(Amazon.RegionEndpoint.APSouth1);
var images=await ecr.DescribeImagesAsync(new DescribeImagesRequest{RepositoryName="YOUR_REPOSITORY"});
foreach(var image in images.ImageDetails)
    Console.WriteLine($"{image.ImageDigest}: {string.Join(",",image.ImageTags??new List<string>())}");
// Retain exact deployed/rollback digests and paginate large inventories.`,
  "A successful push is artifact publication, not an application rollout or passing security audit. Keep those release gates explicit.",
  "Push artifact প্রকাশ, app rollout বা নিরাপত্তার পূর্ণ ছাড়পত্র নয়। Release gate আলাদা রাখুন।",
);
add(
  "CloudFormation",
  "A stack reconciles a template into resource operations. Change sets reveal whether an update modifies, replaces, or deletes resources. Rollback can also fail when dependencies or external changes interfere. Stateful resource retention and drift detection require deliberate configuration and periodic review. Infrastructure declarations still execute consequential changes.",
  "Stack নকশা থেকে resource বদলায়। Change set modify/replace/delete দেখায়। Rollback-ও fail হতে পারে। Stateful retention ও drift review দরকার। Infrastructure code-ও আসল পরিবর্তন চালায়।",
  `aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE --region ap-south-1
aws cloudformation describe-stacks --stack-name YOUR_STACK --region ap-south-1
aws cloudformation describe-stack-events --stack-name YOUR_STACK --region ap-south-1
aws cloudformation list-change-sets --stack-name YOUR_STACK --region ap-south-1`,
  `using Amazon.CloudFormation;
using Amazon.CloudFormation.Model;
using var cf=new AmazonCloudFormationClient(Amazon.RegionEndpoint.APSouth1);
var result=await cf.DescribeStacksAsync(new DescribeStacksRequest{StackName="YOUR_STACK"});
foreach(var stack in result.Stacks)
    Console.WriteLine($"{stack.StackName}: {stack.StackStatus}");
// Review change sets before ExecuteChangeSet; reads do not authorize mutations.`,
  "Do not assume a replaced database retains its data. Review deletion/update-replacement policies, backups, and migration approach before execution.",
  "Database replacement-এ data থাকে ধরে নেবেন না। Retention, backup ও migration review করুন।",
);
data["AWS Cloud"] = {
  en: "Cloud architecture starts with account/identity, region, network, data, runtime, observability, and recovery decisions. Managed services reduce selected operational tasks but preserve shared responsibility. Compare one simple deployment with a failure-tolerant design and price both before adding containers or multiple regions. Use a separate learning scope and cost controls for experiments.",
  bn: "Cloud-এ আগে account, identity, region, network, data, runtime ও recovery ঠিক করুন। Managed মানে সব দায় provider-এর নয়। সহজ নকশা ও resilient নকশার খরচ তুলুন, তারপর জটিলতা বাড়ান। শেখার scope ও budget আলাদা রাখুন।",
  decisionEn:
    "Select services from access patterns and service goals, not from the number of AWS icons in a diagram. Record who owns each operational responsibility.",
  decisionBn:
    "Diagram-এ AWS icon বাড়ানো নয়; কাজ ও লক্ষ্য দেখে service বাছুন। কোন দায় কে নেবে লিখুন।",
  examples: [data.IAM.examples[0], data.S3.examples[1]],
};
export default data;
