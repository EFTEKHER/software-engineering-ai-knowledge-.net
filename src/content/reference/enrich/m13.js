// Module 13 AWS Cloud: easy story, plain theory, steps, mistakes, interview, 2028 tip, hands-on practice.
import { sh, file, cs } from "./helpers";

export default {
  "EC2": {
    s: ["Renting a flat instead of building a house: you choose the size, move in within minutes, and stop paying when you leave. EC2 rents you virtual servers in Amazon's data centres.", "বাড়ি না বানিয়ে flat ভাড়া: আকার বাছেন, কয়েক মিনিটে উঠে যান, ছেড়ে দিলে ভাড়া বন্ধ। EC2 Amazon-এর data centre-এ virtual server ভাড়া দেয়।"],
    t: ["An EC2 instance is a virtual machine defined by an AMI (OS image), instance type (CPU/RAM, e.g., t4g.small, m7g.large), subnet (network placement), security groups (firewall) and an IAM role (permissions). Pricing: on-demand, savings plans/reserved (cheaper with commitment) and spot (very cheap, can be reclaimed). EBS volumes provide disks; user data scripts bootstrap the machine.", "EC2 instance হলো virtual machine, যা AMI (OS image), instance type (CPU/RAM, যেমন t4g.small, m7g.large), subnet (network-এ অবস্থান), security group (firewall) ও IAM role (অনুমতি) দিয়ে সংজ্ঞায়িত। দাম: on-demand, savings plan/reserved (প্রতিশ্রুতিতে সস্তা) ও spot (খুব সস্তা, ফেরত নেওয়া যায়)। EBS volume disk দেয়; user data script machine প্রস্তুত করে।"],
    p: [["Choose a region near users (ap-south-1 Mumbai or ap-southeast-1 Singapore for Bangladesh).", "User-এর কাছের region বাছুন (বাংলাদেশের জন্য ap-south-1 Mumbai বা ap-southeast-1 Singapore)।"], ["Launch with a small instance type, an IAM role and a locked-down security group.", "ছোট instance type, IAM role ও কঠোর security group দিয়ে চালু করুন।"], ["Connect with SSM Session Manager instead of open SSH.", "খোলা SSH-এর বদলে SSM Session Manager দিয়ে যুক্ত হন।"], ["Tag the instance (owner, env, cost-center) and set a budget alert.", "Instance-এ tag দিন (owner, env, cost-center) এবং budget alert ঠিক করুন।"]],
    m: ["Opening port 22 to 0.0.0.0/0; storing AWS keys on the instance instead of using an IAM role; forgetting to stop test instances (surprise bills); single-instance production with no backups.", "0.0.0.0/0-এর জন্য port 22 খোলা; IAM role-এর বদলে instance-এ AWS key রাখা; test instance বন্ধ করতে ভুলে যাওয়া (অপ্রত্যাশিত bill); backup ছাড়া একক-instance production।"],
    q: ["Q: When would you choose EC2 over containers or Lambda? A: When you need full OS control, special software/drivers (GPUs), long-running stateful processes, or lift-and-shift of existing apps.", "প্রশ্ন: Container বা Lambda-র বদলে কখন EC2? উত্তর: পূর্ণ OS নিয়ন্ত্রণ, বিশেষ software/driver (GPU), দীর্ঘ stateful process, বা বিদ্যমান app হুবহু সরাতে হলে।"],
    f: ["GPU instances for AI are expensive and scarce. Learn spot instances, auto-stop schedules and right-sizing; cost awareness is a core cloud skill.", "AI-এর GPU instance ব্যয়বহুল ও দুর্লভ। Spot instance, স্বয়ংক্রিয় বন্ধের সময়সূচি ও সঠিক মাপ শিখুন; খরচ সচেতনতা মূল cloud দক্ষতা।"],
    x: [sh("Launch, tag and connect without SSH keys · SSH key ছাড়া চালু ও যুক্ত", `aws ec2 run-instances --region ap-south-1 \\
  --image-id resolve:ssm:/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-arm64 \\
  --instance-type t4g.small --iam-instance-profile Name=ssm-basic \\
  --security-group-ids sg-0abc1234 --subnet-id subnet-0def5678 \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=shop-dev},{Key=owner,Value=asha}]' \\
  --query 'Instances[0].InstanceId' --output text
aws ssm start-session --target i-0123456789abcdef0
aws ec2 stop-instances --instance-ids i-0123456789abcdef0 --query 'StoppingInstances[0].CurrentState.Name'`, `i-0123456789abcdef0
Starting session with SessionId: asha-0a1b2c3d4e5f
sh-5.2$ exit
"stopping"`)],
  },
  "S3": {
    s: ["A giant, secure warehouse where every box has a unique label and is copied to several buildings automatically. S3 stores files (objects) by key, practically without limit.", "বিশাল, নিরাপদ গুদাম, যেখানে প্রতিটি বাক্সের অনন্য label এবং স্বয়ংক্রিয়ভাবে কয়েকটি ভবনে কপি হয়। S3 key দিয়ে file (object) রাখে, প্রায় সীমাহীনভাবে।"],
    t: ["S3 buckets hold objects up to 5 TB with 11 nines of durability. Keep buckets private (Block Public Access on), encrypt by default, use IAM policies or bucket policies for access, pre-signed URLs for temporary sharing, versioning to recover overwritten files, and lifecycle rules to move old data to cheaper classes (Infrequent Access, Glacier). Serve public assets through CloudFront.", "S3 bucket ৫ TB পর্যন্ত object রাখে, ১১টি নয়ের টেকসইতাসহ। Bucket private রাখুন (Block Public Access চালু), ডিফল্টভাবে encrypt, access-এর জন্য IAM বা bucket policy, অস্থায়ী শেয়ারে pre-signed URL, overwrite হওয়া file ফেরাতে versioning, আর পুরনো data সস্তা শ্রেণিতে নিতে lifecycle নিয়ম (Infrequent Access, Glacier) দিন। Public asset CloudFront দিয়ে দিন।"],
    p: [["Create a private bucket with versioning and encryption.", "Versioning ও encryption-সহ private bucket বানান।"], ["Upload with the CLI or SDK (PutObject).", "CLI বা SDK দিয়ে upload করুন (PutObject)।"], ["Share temporarily with a pre-signed URL.", "Pre-signed URL দিয়ে অস্থায়ীভাবে শেয়ার করুন।"], ["Add lifecycle rules for old objects.", "পুরনো object-এর জন্য lifecycle নিয়ম দিন।"]],
    m: ["Public buckets leaking data; using S3 like a file system with millions of tiny files and heavy listing; forgetting lifecycle rules, so costs grow forever.", "Public bucket-এ data ফাঁস; লক্ষ লক্ষ ছোট file ও ভারী তালিকা-সহ S3-কে file system-এর মতো ব্যবহার; lifecycle নিয়ম ভুলে খরচ চিরকাল বাড়া।"],
    q: ["Q: How do users upload large files directly to S3 safely? A: Your API returns a pre-signed PUT URL (or multipart upload) limited to one key and a few minutes; the browser uploads directly.", "প্রশ্ন: User কীভাবে নিরাপদে সরাসরি S3-এ বড় file upload করবে? উত্তর: আপনার API একটি key ও কয়েক মিনিটে সীমিত pre-signed PUT URL (বা multipart upload) দেয়; browser সরাসরি upload করে।"],
    f: ["S3 is the backbone of data lakes and AI document stores (with S3 Vectors and event notifications to trigger embedding pipelines).", "S3 data lake ও AI document store-এর মেরুদণ্ড (S3 Vectors ও embedding pipeline চালুর event notification-সহ)।"],
    x: [sh("Private bucket, upload and a pre-signed link · private bucket ও pre-signed link", `aws s3api create-bucket --bucket shop-invoices-dev-1042 --region ap-south-1 \\
  --create-bucket-configuration LocationConstraint=ap-south-1 >/dev/null
aws s3api put-bucket-versioning --bucket shop-invoices-dev-1042 --versioning-configuration Status=Enabled
aws s3 cp invoice-A-7.pdf s3://shop-invoices-dev-1042/2026/11/invoice-A-7.pdf
aws s3 presign s3://shop-invoices-dev-1042/2026/11/invoice-A-7.pdf --expires-in 600`, `upload: ./invoice-A-7.pdf to s3://shop-invoices-dev-1042/2026/11/invoice-A-7.pdf
https://shop-invoices-dev-1042.s3.ap-south-1.amazonaws.com/2026/11/invoice-A-7.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=600&...`)],
  },
  "IAM": {
    s: ["An office building's access-card system: each card opens only certain doors, cards can be cancelled instantly, and every swipe is recorded. IAM controls who can do what in your AWS account.", "অফিস ভবনের access-card ব্যবস্থা: প্রতিটি কার্ড শুধু নির্দিষ্ট দরজা খোলে, কার্ড সাথে সাথে বাতিল করা যায়, প্রতিটি swipe রেকর্ড হয়। IAM ঠিক করে আপনার AWS account-এ কে কী করতে পারে।"],
    t: ["IAM has users (people, ideally via SSO/Identity Center), roles (assumed by services, CI and federated identities with temporary credentials) and policies (JSON allow/deny statements on actions and resources). Best practices: no root usage, MFA everywhere, roles instead of access keys, least privilege, permission boundaries/SCPs for guardrails, and CloudTrail for auditing.", "IAM-এ user (মানুষ, ভালো হয় SSO/Identity Center দিয়ে), role (service, CI ও federated identity অস্থায়ী credential-সহ ধারণ করে) ও policy (action ও resource-এ JSON allow/deny বিবৃতি) থাকে। ভালো অভ্যাস: root ব্যবহার নয়, সব জায়গায় MFA, access key-র বদলে role, least privilege, সুরক্ষার জন্য permission boundary/SCP, আর audit-এর জন্য CloudTrail।"],
    p: [["Enable MFA on root and lock it away.", "Root-এ MFA চালু করে সরিয়ে রাখুন।"], ["Use IAM Identity Center for people.", "মানুষের জন্য IAM Identity Center ব্যবহার করুন।"], ["Give each app/CI its own role with a minimal policy.", "প্রতিটি app/CI-কে ন্যূনতম policy-সহ নিজস্ব role দিন।"], ["Review with IAM Access Analyzer and CloudTrail.", "IAM Access Analyzer ও CloudTrail দিয়ে review করুন।"]],
    m: ["Long-lived access keys in code or CI; AdministratorAccess for apps; sharing one IAM user across people; never rotating or reviewing permissions.", "Code বা CI-তে দীর্ঘস্থায়ী access key; app-এ AdministratorAccess; কয়েকজনের মধ্যে একটি IAM user শেয়ার; কখনো অনুমতি বদলানো বা review না করা।"],
    q: ["Q: How does an ECS task or Lambda get AWS permissions without keys? A: It runs with an IAM role; the SDK automatically fetches temporary credentials from the runtime environment.", "প্রশ্ন: ECS task বা Lambda key ছাড়া AWS অনুমতি কীভাবে পায়? উত্তর: এটি IAM role নিয়ে চলে; SDK runtime environment থেকে স্বয়ংক্রিয়ভাবে অস্থায়ী credential আনে।"],
    f: ["Agentic AI systems that call AWS (via MCP or tools) must run with dedicated, narrow roles and session policies. IAM design is now an AI safety skill too.", "AWS ডাকা agentic AI system (MCP বা tool দিয়ে) নিবেদিত, সংকীর্ণ role ও session policy নিয়ে চলতেই হবে। IAM design এখন AI নিরাপত্তারও দক্ষতা।"],
    x: [file("json", "Trust policy: GitHub Actions assumes a role via OIDC · OIDC trust policy", `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com" },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
        "StringLike": { "token.actions.githubusercontent.com:sub": "repo:EFTEKHER/shop:ref:refs/heads/main" }
      }
    }
  ]
}
// Only workflows on main of this repo can assume the deploy role. No stored AWS keys.`, undefined, "IAM trust policy")],
  },
  "RDS": {
    s: ["Hiring a building manager for your apartment: plumbing, repairs and security are handled, you just live there. RDS runs PostgreSQL, MySQL or SQL Server for you, with backups and patching managed.", "Apartment-এর জন্য building manager নিয়োগ: plumbing, মেরামত ও নিরাপত্তা তিনি সামলান, আপনি শুধু থাকেন। RDS আপনার হয়ে PostgreSQL, MySQL বা SQL Server চালায়, backup ও patching পরিচালনাসহ।"],
    t: ["RDS provides managed relational databases: automated backups with point-in-time recovery, Multi-AZ standby for automatic failover, read replicas for read scaling, storage autoscaling, encryption and Performance Insights. Aurora is AWS's cloud-native engine with faster replication. Place databases in private subnets, allow access only from app security groups, and use IAM auth or Secrets Manager rotation.", "RDS managed relational database দেয়: point-in-time recovery-সহ স্বয়ংক্রিয় backup, স্বয়ংক্রিয় failover-এর জন্য Multi-AZ standby, পড়া বাড়াতে read replica, storage autoscaling, encryption ও Performance Insights। Aurora হলো দ্রুত replication-সহ AWS-এর cloud-native engine। Database private subnet-এ রাখুন, শুধু app security group থেকে access দিন, আর IAM auth বা Secrets Manager rotation ব্যবহার করুন।"],
    p: [["Create the DB in private subnets with Multi-AZ for production.", "Production-এ Multi-AZ-সহ private subnet-এ DB বানান।"], ["Store credentials in Secrets Manager with rotation.", "Rotation-সহ Secrets Manager-এ credential রাখুন।"], ["Allow inbound 5432 only from the app's security group.", "শুধু app-এর security group থেকে inbound 5432 অনুমতি দিন।"], ["Test point-in-time restore.", "Point-in-time restore test করুন।"]],
    m: ["Publicly accessible databases; single-AZ production; never testing restores; huge instance sizes instead of fixing slow queries.", "Public-ভাবে পৌঁছানো যায় এমন database; single-AZ production; কখনো restore test না করা; ধীর query ঠিক না করে বিশাল instance।"],
    q: ["Q: Multi-AZ vs read replica? A: Multi-AZ is a synchronous standby for availability (not for reads in classic RDS); read replicas are asynchronous copies for scaling reads and can be promoted.", "প্রশ্ন: Multi-AZ বনাম read replica? উত্তর: Multi-AZ availability-র জন্য synchronous standby (classic RDS-এ পড়ার জন্য নয়); read replica পড়া বাড়ানোর asynchronous কপি এবং promote করা যায়।"],
    f: ["PostgreSQL with pgvector on RDS/Aurora lets you keep embeddings next to relational data, a popular choice for AI features in .NET apps.", "RDS/Aurora-য় pgvector-সহ PostgreSQL embedding-কে relational data-র পাশে রাখতে দেয়, .NET app-এর AI feature-এ জনপ্রিয় পছন্দ।"],
    x: [sh("Production-grade PostgreSQL on RDS · production-মানের RDS PostgreSQL", `aws rds create-db-instance --db-instance-identifier shop-prod \\
  --engine postgres --engine-version 17 --db-instance-class db.m7g.large \\
  --allocated-storage 100 --max-allocated-storage 500 --storage-encrypted \\
  --multi-az --no-publicly-accessible --manage-master-user-password \\
  --master-username shop_admin --vpc-security-group-ids sg-0db123 --db-subnet-group-name private-db \\
  --backup-retention-period 14 --query 'DBInstance.DBInstanceStatus' --output text
aws rds describe-db-instances --db-instance-identifier shop-prod --query 'DBInstances[0].[MultiAZ,PubliclyAccessible,MasterUserSecret.SecretArn]'`, `creating
[
    true,
    false,
    "arn:aws:secretsmanager:ap-south-1:123456789012:secret:rds!db-3f2a..."
]`)],
  },
  "Route 53": {
    s: ["The phone directory of the internet: you look up 'shop.example.com' and get the address to call. Route 53 is AWS's DNS service, and it can also send callers to the nearest or healthiest office.", "Internet-এর ফোন directory: 'shop.example.com' খুঁজে ফোন করার ঠিকানা পান। Route 53 হলো AWS-এর DNS service, যা কাছের বা সবচেয়ে সুস্থ অফিসেও পাঠাতে পারে।"],
    t: ["Route 53 hosts DNS zones and records: A/AAAA (IP), CNAME (alias name), alias records (to CloudFront, ALB, S3 at the zone apex), MX and TXT (email, verification). Routing policies: simple, weighted (canary), latency-based, geolocation and failover with health checks. TTLs control how long resolvers cache answers.", "Route 53 DNS zone ও record রাখে: A/AAAA (IP), CNAME (alias নাম), alias record (zone apex-এ CloudFront, ALB, S3-এর দিকে), MX ও TXT (email, যাচাই)। Routing নীতি: simple, weighted (canary), latency-ভিত্তিক, geolocation আর health check-সহ failover। TTL ঠিক করে resolver কতক্ষণ উত্তর cache করবে।"],
    p: [["Create a hosted zone and update the registrar's name servers.", "Hosted zone বানিয়ে registrar-এর name server আপডেট করুন।"], ["Add an alias A record to your load balancer or CloudFront.", "Load balancer বা CloudFront-এর দিকে alias A record দিন।"], ["Lower TTL before migrations; raise it after.", "Migration-এর আগে TTL কমান; পরে বাড়ান।"], ["Add health-checked failover for critical endpoints.", "জরুরি endpoint-এ health-check-সহ failover দিন।"]],
    m: ["Forgetting to change name servers at the registrar; CNAME at the zone apex (use alias); long TTLs during a migration; dangling records pointing to deleted resources (subdomain takeover).", "Registrar-এ name server বদলাতে ভুলে যাওয়া; zone apex-এ CNAME (alias দিন); migration-এর সময় দীর্ঘ TTL; মুছে ফেলা resource-এর দিকে ঝুলন্ত record (subdomain takeover)।"],
    q: ["Q: How do you shift 10% of traffic to a new stack using DNS? A: Weighted records: 90 to the old load balancer and 10 to the new one, with health checks; adjust weights as confidence grows.", "প্রশ্ন: DNS দিয়ে ১০% traffic নতুন stack-এ কীভাবে নেবেন? উত্তর: Weighted record: পুরনো load balancer-এ ৯০, নতুনটায় ১০, health check-সহ; আস্থা বাড়লে weight বদলান।"],
    f: ["DNS is often the slowest lever to change because of caching. Plan TTLs ahead of migrations and know that edge platforms increasingly handle routing below DNS.", "Caching-এর কারণে DNS প্রায়ই সবচেয়ে ধীরে বদলানো যায়। Migration-এর আগে TTL পরিকল্পনা করুন এবং জানুন edge platform ক্রমশ DNS-এর নিচে routing সামলায়।"],
    x: [sh("Create an alias record and verify resolution · alias record ও যাচাই", `cat > change.json <<'EOF'
{"Changes":[{"Action":"UPSERT","ResourceRecordSet":{"Name":"api.shop.example.com","Type":"A",
 "AliasTarget":{"HostedZoneId":"ZP97RAFLXTNZK","DNSName":"shop-alb-123.ap-south-1.elb.amazonaws.com","EvaluateTargetHealth":true}}}]}
EOF
aws route53 change-resource-record-sets --hosted-zone-id Z0123456ABC --change-batch file://change.json --query 'ChangeInfo.Status'
dig +short api.shop.example.com`, `"PENDING"
13.234.10.21
65.0.44.190`)],
  },
  "VPC": {
    s: ["A gated housing society: public roads lead to the main gate, guests visit the front houses (public subnets), private homes are deeper inside (private subnets), and guards check everyone. A VPC is your private network in AWS.", "সুরক্ষিত আবাসিক এলাকা: public রাস্তা প্রধান গেটে যায়, অতিথিরা সামনের বাড়িতে যান (public subnet), ব্যক্তিগত বাড়ি আরও ভিতরে (private subnet), আর প্রহরী সবাইকে যাচাই করেন। VPC হলো AWS-এ আপনার private network।"],
    t: ["A VPC has a CIDR range split into subnets per availability zone. Public subnets route to an Internet Gateway (load balancers, NAT); private subnets reach the internet only outbound through a NAT Gateway (app servers); isolated subnets have no internet (databases). Security groups are stateful instance firewalls; NACLs are stateless subnet filters. VPC endpoints let private resources reach S3 and other services without the internet.", "VPC-র একটি CIDR পরিসর availability zone অনুযায়ী subnet-এ ভাগ হয়। Public subnet Internet Gateway-তে যায় (load balancer, NAT); private subnet শুধু বাইরের দিকে NAT Gateway দিয়ে internet-এ যায় (app server); isolated subnet-এ internet নেই (database)। Security group stateful instance firewall; NACL stateless subnet filter। VPC endpoint private resource-কে internet ছাড়াই S3 ও অন্য service-এ পৌঁছাতে দেয়।"],
    p: [["Plan CIDR blocks that will not overlap with other networks.", "অন্য network-এর সাথে মিলবে না এমন CIDR block পরিকল্পনা করুন।"], ["Create public, private and database subnets in 2-3 AZs.", "২-৩টি AZ-এ public, private ও database subnet বানান।"], ["Reference security groups instead of IP ranges.", "IP পরিসরের বদলে security group উল্লেখ করুন।"], ["Add VPC endpoints for S3 and ECR to cut NAT costs.", "NAT খরচ কমাতে S3 ও ECR-এর VPC endpoint দিন।"]],
    m: ["Databases in public subnets; 0.0.0.0/0 inbound rules; one AZ only; huge NAT Gateway bills from pulling images through NAT.", "Public subnet-এ database; 0.0.0.0/0 inbound নিয়ম; শুধু একটি AZ; NAT দিয়ে image টানায় বিশাল NAT Gateway bill।"],
    q: ["Q: A private EC2 instance cannot reach the internet to install packages. Why? A: Its subnet route table lacks a route to a NAT Gateway (or the NAT is in a subnet without an Internet Gateway route).", "প্রশ্ন: Private EC2 instance package install করতে internet-এ যেতে পারে না। কেন? উত্তর: এর subnet route table-এ NAT Gateway-এর route নেই (বা NAT এমন subnet-এ যার Internet Gateway route নেই)।"],
    f: ["Private connectivity to AI services (PrivateLink to Bedrock) keeps prompts off the public internet, an increasingly common compliance requirement.", "AI service-এ private সংযোগ (Bedrock-এ PrivateLink) prompt-কে public internet থেকে দূরে রাখে, যা ক্রমশ প্রচলিত compliance চাহিদা।"],
    x: [cs("Plan subnets from a VPC CIDR · VPC CIDR থেকে subnet পরিকল্পনা", `// VPC 10.20.0.0/16 split into /20 subnets (4,096 addresses each)
string[] tiers = ["public", "private-app", "private-db"];
string[] zones = ["ap-south-1a", "ap-south-1b"];
int index = 0;
foreach (var tier in tiers)
    foreach (var zone in zones)
    {
        int third = index * 16;                           // each /20 spans 16 values of the third octet
        Console.WriteLine($"{tier,-12} {zone}  10.20.{third}.0/20  ({4096 - 5} usable)");
        index++;
    }
Console.WriteLine($"used {index} of 16 possible /20 subnets; room to grow");`, "public       ap-south-1a  10.20.0.0/20  (4091 usable)\npublic       ap-south-1b  10.20.16.0/20  (4091 usable)\nprivate-app  ap-south-1a  10.20.32.0/20  (4091 usable)\nprivate-app  ap-south-1b  10.20.48.0/20  (4091 usable)\nprivate-db   ap-south-1a  10.20.64.0/20  (4091 usable)\nprivate-db   ap-south-1b  10.20.80.0/20  (4091 usable)\nused 6 of 16 possible /20 subnets; room to grow")],
  },
  "Lambda": {
    s: ["A taxi you call only when needed and pay per trip, instead of owning a car that sits in the garage. Lambda runs your code only when an event arrives and charges per request and millisecond.", "দরকার হলেই ডাকা ও প্রতি যাত্রায় টাকা দেওয়া taxi, garage-এ বসে থাকা নিজের গাড়ির বদলে। Lambda শুধু event এলে আপনার code চালায় এবং request ও millisecond অনুযায়ী টাকা নেয়।"],
    t: ["Lambda functions are triggered by events: API Gateway/function URLs, S3 uploads, SQS messages, EventBridge schedules. They scale automatically, have a max duration of 15 minutes, and may experience cold starts. For .NET, use Native AOT or SnapStart to cut cold starts. Design functions to be stateless and idempotent, and watch concurrency limits on downstream databases.", "Lambda function event দিয়ে চালু হয়: API Gateway/function URL, S3 upload, SQS বার্তা, EventBridge সময়সূচি। স্বয়ংক্রিয়ভাবে বাড়ে, সর্বোচ্চ ১৫ মিনিট চলে এবং cold start হতে পারে। .NET-এ cold start কমাতে Native AOT বা SnapStart ব্যবহার করুন। Function stateless ও idempotent design করুন, আর downstream database-এ concurrency সীমা নজরে রাখুন।"],
    p: [["Pick the trigger (SQS, S3, schedule, HTTP).", "Trigger বাছুন (SQS, S3, schedule, HTTP)।"], ["Write a small handler and deploy with SAM/CDK/Terraform.", "ছোট handler লিখে SAM/CDK/Terraform দিয়ে deploy করুন।"], ["Set memory, timeout, reserved concurrency and a DLQ.", "Memory, timeout, reserved concurrency ও DLQ ঠিক করুন।"], ["Monitor errors, duration and throttles in CloudWatch.", "CloudWatch-এ error, সময় ও throttle দেখুন।"]],
    m: ["Opening a new database connection per invocation at high concurrency (use RDS Proxy); long-running jobs beyond 15 minutes; heavy initialisation inside the handler instead of outside.", "বেশি concurrency-তে প্রতি invocation-এ নতুন database connection (RDS Proxy দিন); ১৫ মিনিটের বেশি দীর্ঘ কাজ; handler-এর বাইরে না রেখে ভিতরে ভারী initialisation।"],
    q: ["Q: When is Lambda a poor fit? A: Constant high traffic (containers are cheaper), long-running or stateful work, very latency-sensitive paths affected by cold starts, or workloads needing GPUs.", "প্রশ্ন: কখন Lambda ভালো মানায় না? উত্তর: সারাক্ষণ বেশি traffic (container সস্তা), দীর্ঘ বা stateful কাজ, cold start-এ প্রভাবিত খুব latency-সংবেদনশীল পথ, বা GPU লাগা workload।"],
    f: ["Event-driven functions are ideal glue for AI pipelines: an S3 upload triggers a Lambda that chunks a document and queues embedding jobs.", "AI pipeline-এর জন্য event-চালিত function আদর্শ সংযোগ: S3 upload একটি Lambda চালু করে, যা document chunk করে embedding job queue-তে দেয়।"],
    x: [file("csharp", ".NET Lambda handler for SQS messages · SQS বার্তার .NET Lambda", `using Amazon.Lambda.Core;
using Amazon.Lambda.SQSEvents;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

public class Function
{
    // Created once per execution environment and reused across invocations
    private static readonly HttpClient http = new() { Timeout = TimeSpan.FromSeconds(10) };

    public async Task<SQSBatchResponse> Handler(SQSEvent evt, ILambdaContext ctx)
    {
        var failures = new List<SQSBatchResponse.BatchItemFailure>();
        foreach (var msg in evt.Records)
        {
            try
            {
                ctx.Logger.LogInformation($"processing order {msg.Body}");
                await http.PostAsync($"https://api.example.com/receipts/{msg.Body}", null);
            }
            catch (Exception e)
            {
                ctx.Logger.LogError(e.Message);
                failures.Add(new SQSBatchResponse.BatchItemFailure { ItemIdentifier = msg.MessageId });  // retry only this one
            }
        }
        return new SQSBatchResponse(failures);
    }
}`, undefined, "AWS Lambda function (reference)")],
  },
  "CloudFront": {
    s: ["A courier company with branches in every city keeps copies of popular parcels locally, so delivery is quick everywhere. CloudFront is AWS's CDN, caching your content at edge locations worldwide.", "প্রতিটি শহরে শাখা থাকা courier কোম্পানি জনপ্রিয় parcel-এর কপি স্থানীয়ভাবে রাখে, তাই সব জায়গায় দ্রুত delivery। CloudFront হলো AWS-এর CDN, বিশ্বজুড়ে edge location-এ আপনার content cache করে।"],
    t: ["A CloudFront distribution has origins (S3 bucket, ALB, API) and behaviours (path patterns with cache policies, allowed methods and origin request policies). Use Origin Access Control so S3 stays private, attach ACM certificates for HTTPS on custom domains, use AWS WAF for protection, and invalidate paths when needed (prefer versioned file names). CloudFront Functions/Lambda@Edge run code at the edge.", "CloudFront distribution-এ origin (S3 bucket, ALB, API) ও behaviour (cache policy, অনুমোদিত method ও origin request policy-সহ path pattern) থাকে। S3 private রাখতে Origin Access Control দিন, custom domain-এ HTTPS-এর জন্য ACM certificate যুক্ত করুন, সুরক্ষায় AWS WAF দিন, আর দরকারে path invalidate করুন (version-যুক্ত file নাম ভালো)। CloudFront Functions/Lambda@Edge edge-এ code চালায়।"],
    p: [["Create a distribution with S3 (static) and ALB (/api/*) origins.", "S3 (static) ও ALB (/api/*) origin-সহ distribution বানান।"], ["Use Origin Access Control for S3.", "S3-এর জন্য Origin Access Control দিন।"], ["Attach an ACM certificate (us-east-1) and a custom domain.", "ACM certificate (us-east-1) ও custom domain যুক্ত করুন।"], ["Cache static assets long; do not cache private API responses.", "Static asset দীর্ঘ cache করুন; private API response cache করবেন না।"]],
    m: ["Public S3 buckets behind CloudFront (bypass); caching authenticated responses; forgetting the certificate must be in us-east-1; invalidating '/*' on every deploy (costly and slow).", "CloudFront-এর পিছনে public S3 bucket (এড়িয়ে যাওয়া যায়); authenticated response cache; certificate us-east-1-এ থাকতে হবে ভুলে যাওয়া; প্রতি deploy-এ '/*' invalidate (ব্যয়বহুল ও ধীর)।"],
    q: ["Q: Users still see the old JavaScript after deploy. Fix? A: Use content-hashed file names and short-cache index.html; then only index.html needs to refresh, without invalidations.", "প্রশ্ন: Deploy-এর পরেও user পুরনো JavaScript দেখে। সমাধান? উত্তর: Content-hash-যুক্ত file নাম ও অল্পক্ষণ cache-এর index.html দিন; তাহলে invalidation ছাড়াই শুধু index.html refresh হলেই চলে।"],
    f: ["Edge caching of AI-generated content (summaries, translations) that is the same for everyone saves both latency and model cost.", "সবার জন্য একই এমন AI-তৈরি content (সারাংশ, অনুবাদ) edge-এ cache করলে latency ও model-এর খরচ দুটোই বাঁচে।"],
    x: [sh("Deploy a React build to S3 + CloudFront · React build deploy", `npm run build
aws s3 sync dist/ s3://shop-web-prod/ --delete \\
  --cache-control "public,max-age=31536000,immutable" --exclude index.html
aws s3 cp dist/index.html s3://shop-web-prod/index.html --cache-control "no-cache"
aws cloudfront create-invalidation --distribution-id E2ABCDEF12345 --paths /index.html --query 'Invalidation.Status'`, `upload: dist/assets/index-3f2a9c1d.js to s3://shop-web-prod/assets/index-3f2a9c1d.js
upload: dist/assets/index-8b7c6d5e.css to s3://shop-web-prod/assets/index-8b7c6d5e.css
upload: dist/index.html to s3://shop-web-prod/index.html
"InProgress"`)],
  },
  "Load Balancer": {
    s: ["A restaurant host at the entrance who seats each new group at the table with a free waiter, and stops seating people at a table whose waiter is sick. An Application Load Balancer does this for HTTP traffic.", "প্রবেশপথে রেস্তোরাঁর host, যিনি প্রতিটি নতুন দলকে খালি ওয়েটারের টেবিলে বসান, আর অসুস্থ ওয়েটারের টেবিলে বসানো বন্ধ করেন। Application Load Balancer HTTP traffic-এর জন্য এটা করে।"],
    t: ["Elastic Load Balancing offers ALB (layer 7: HTTP routing by host/path, HTTPS termination with ACM, WebSockets, gRPC, authentication), NLB (layer 4: TCP/UDP, static IPs, extreme throughput) and GWLB (appliances). Target groups hold EC2 instances, IPs (ECS/EKS) or Lambdas and are health-checked. Enable cross-zone load balancing, access logs and deregistration delay for graceful deploys.", "Elastic Load Balancing দেয় ALB (layer 7: host/path দিয়ে HTTP routing, ACM-সহ HTTPS termination, WebSocket, gRPC, authentication), NLB (layer 4: TCP/UDP, static IP, চরম throughput) ও GWLB (appliance)। Target group EC2 instance, IP (ECS/EKS) বা Lambda রাখে এবং health-check হয়। Cross-zone load balancing, access log ও graceful deploy-এর জন্য deregistration delay চালু করুন।"],
    p: [["Create an ALB in public subnets with an HTTPS listener (ACM certificate).", "Public subnet-এ HTTPS listener (ACM certificate)-সহ ALB বানান।"], ["Create a target group with a /health check.", "/health check-সহ target group বানান।"], ["Add path rules (/api -> api targets).", "Path নিয়ম দিন (/api -> api target)।"], ["Redirect HTTP to HTTPS and enable access logs.", "HTTP-কে HTTPS-এ redirect করুন এবং access log চালু করুন।"]],
    m: ["Health checks hitting endpoints that depend on every downstream service (cascading removals); targets in private subnets without correct security group rules; no HTTPS redirect.", "প্রতিটি downstream service-এর উপর নির্ভরশীল endpoint-এ health check (ধারাবাহিক বাদ পড়া); সঠিক security group নিয়ম ছাড়া private subnet-এ target; HTTPS redirect নেই।"],
    q: ["Q: ALB vs NLB? A: ALB for HTTP features (routing, auth, WAF); NLB for raw TCP/UDP performance, static IPs and preserving client IPs at very high throughput.", "প্রশ্ন: ALB বনাম NLB? উত্তর: HTTP feature-এর (routing, auth, WAF) জন্য ALB; কাঁচা TCP/UDP performance, static IP আর খুব বেশি throughput-এ client IP রাখতে NLB।"],
    f: ["Weighted target groups on an ALB enable blue/green and canary releases without DNS changes, useful for testing new model-backed endpoints safely.", "ALB-তে weighted target group DNS পরিবর্তন ছাড়াই blue/green ও canary release সম্ভব করে, নতুন model-চালিত endpoint নিরাপদে test-এ কাজের।"],
    x: [sh("Check target health and shift traffic gradually · target-এর স্বাস্থ্য ও ধীরে traffic সরানো", `aws elbv2 describe-target-health --target-group-arn $TG_BLUE \\
  --query 'TargetHealthDescriptions[].[Target.Id,TargetHealth.State]' --output text
aws elbv2 modify-listener --listener-arn $LISTENER --default-actions \\
  '[{"Type":"forward","ForwardConfig":{"TargetGroups":[{"TargetGroupArn":"'$TG_BLUE'","Weight":90},{"TargetGroupArn":"'$TG_GREEN'","Weight":10}]}}]' \\
  --query 'Listeners[0].DefaultActions[0].ForwardConfig.TargetGroups[].Weight'`, `10.20.32.14	healthy
10.20.48.22	healthy
[
    90,
    10
]`)],
  },
  "Auto Scaling": {
    s: ["A bus company that adds buses during office hours and festivals, and parks them at night, based on how full the buses are. Auto Scaling adds or removes servers automatically based on load.", "অফিস সময় ও উৎসবে বাস বাড়ানো, রাতে পার্ক করা, বাস কতটা ভরা তার ভিত্তিতে, এমন বাস কোম্পানি। Auto Scaling load অনুযায়ী স্বয়ংক্রিয়ভাবে server যোগ বা বাদ দেয়।"],
    t: ["An Auto Scaling Group keeps between min and max instances, launched from a launch template across AZs, and replaces unhealthy ones. Target tracking policies (e.g., keep average CPU at 50% or ALB requests per target at 1,000) are the simplest. Scheduled scaling handles known peaks; predictive scaling uses history. ECS and Lambda have their own scaling; EKS uses Karpenter or Cluster Autoscaler.", "Auto Scaling Group min ও max-এর মধ্যে instance রাখে, AZ জুড়ে launch template থেকে চালু করে, এবং অসুস্থগুলো বদলায়। Target tracking নীতি (যেমন গড় CPU ৫০% বা target-প্রতি ALB request ১,০০০-এ রাখা) সবচেয়ে সহজ। Scheduled scaling জানা peak সামলায়; predictive scaling ইতিহাস ব্যবহার করে। ECS ও Lambda-র নিজস্ব scaling আছে; EKS Karpenter বা Cluster Autoscaler ব্যবহার করে।"],
    p: [["Create a launch template with your AMI/user data.", "আপনার AMI/user data-সহ launch template বানান।"], ["Create an ASG across 2-3 AZs with min/max/desired.", "২-৩টি AZ জুড়ে min/max/desired-সহ ASG বানান।"], ["Add a target tracking policy.", "Target tracking নীতি দিন।"], ["Load test and watch scaling activity.", "Load test করে scaling কার্যক্রম দেখুন।"]],
    m: ["Max too low (cannot handle peaks) or too high (runaway costs); slow boot times making scaling useless for spikes; scaling on CPU when the bottleneck is the database.", "Max খুব কম (peak সামলাতে পারে না) বা খুব বেশি (খরচ নিয়ন্ত্রণহীন); ধীর boot-এ হঠাৎ ভিড়ে scaling অকেজো; bottleneck database হলেও CPU-তে scaling।"],
    q: ["Q: Traffic spikes in 30 seconds but new instances take 4 minutes. What do you do? A: Keep warm capacity (higher min), use scheduled/predictive scaling, faster images (pre-baked AMIs, containers), and queue or shed load during the gap.", "প্রশ্ন: ৩০ সেকেন্ডে traffic বাড়ে কিন্তু নতুন instance-এ ৪ মিনিট লাগে। কী করবেন? উত্তর: গরম ক্ষমতা রাখুন (বেশি min), scheduled/predictive scaling, দ্রুত image (আগে-বানানো AMI, container), আর ফাঁকের সময় load queue বা shed করুন।"],
    f: ["Scaling AI inference on GPUs is slow and costly; queue-based scaling with warm pools is the typical pattern. Understanding the basics here prepares you for it.", "GPU-তে AI inference scaling ধীর ও ব্যয়বহুল; warm pool-সহ queue-ভিত্তিক scaling প্রচলিত pattern। এখানে মৌলিক বিষয় বুঝলে সেজন্য প্রস্তুত হবেন।"],
    x: [cs("Target tracking: how many instances are needed? · কত instance লাগবে", `int targetRequestsPerInstance = 1000, min = 2, max = 12;
int[] requestsPerMinute = [800, 3500, 9000, 15000, 4000];
foreach (int rpm in requestsPerMinute)
{
    int needed = (int)Math.Ceiling(rpm / (double)targetRequestsPerInstance);
    int desired = Math.Clamp(needed, min, max);
    string note = needed > max ? "  <- capped at max: add caching or raise max" : "";
    Console.WriteLine($"{rpm,6} req/min -> {desired,2} instances{note}");
}`, "   800 req/min ->  2 instances\n  3500 req/min ->  4 instances\n  9000 req/min ->  9 instances\n 15000 req/min -> 12 instances  <- capped at max: add caching or raise max\n  4000 req/min ->  4 instances")],
  },
  "SNS": {
    s: ["A school's announcement system that sends the same message by SMS, email and app notification to everyone subscribed. SNS publishes one message to many subscribers.", "স্কুলের ঘোষণা ব্যবস্থা, যা subscribe করা সবাইকে SMS, email ও app notification-এ একই বার্তা পাঠায়। SNS একটি বার্তা অনেক subscriber-কে প্রকাশ করে।"],
    t: ["SNS topics fan out messages to subscribers: SQS queues, Lambda functions, HTTPS endpoints, email and SMS/mobile push. The common pattern is SNS -> multiple SQS queues so each consumer processes independently with retries. Message filtering policies let subscribers receive only relevant messages. FIFO topics preserve order with deduplication.", "SNS topic subscriber-দের কাছে বার্তা ছড়ায়: SQS queue, Lambda function, HTTPS endpoint, email ও SMS/mobile push। প্রচলিত pattern SNS -> একাধিক SQS queue, যাতে প্রতিটি consumer retry-সহ স্বাধীনভাবে প্রক্রিয়া করে। Message filtering নীতি subscriber-কে শুধু প্রাসঙ্গিক বার্তা পেতে দেয়। FIFO topic deduplication-সহ ক্রম রাখে।"],
    p: [["Create a topic (order-events).", "Topic বানান (order-events)।"], ["Subscribe SQS queues for each consumer.", "প্রতিটি consumer-এর জন্য SQS queue subscribe করুন।"], ["Add filter policies by event type.", "Event-এর ধরন অনুযায়ী filter নীতি দিন।"], ["Publish from your app after committing data.", "Data commit-এর পরে app থেকে প্রকাশ করুন।"]],
    m: ["Subscribing Lambdas directly without DLQs; giant messages (limit 256 KB; store payloads in S3); assuming exactly-once delivery.", "DLQ ছাড়া সরাসরি Lambda subscribe; বিশাল বার্তা (সীমা ২৫৬ KB; payload S3-এ রাখুন); exactly-once delivery ধরে নেওয়া।"],
    q: ["Q: Why SNS -> SQS instead of SNS -> Lambda directly? A: The queue buffers spikes, enables retries with visibility timeouts and DLQs, and lets the consumer control its processing rate.", "প্রশ্ন: সরাসরি SNS -> Lambda-র বদলে কেন SNS -> SQS? উত্তর: Queue হঠাৎ ভিড় buffer করে, visibility timeout ও DLQ-সহ retry সম্ভব করে, আর consumer-কে প্রক্রিয়ার গতি নিয়ন্ত্রণ করতে দেয়।"],
    f: ["EventBridge offers richer event routing (schemas, many AWS sources). Know when SNS fan-out is enough and when an event bus fits better.", "EventBridge সমৃদ্ধ event routing দেয় (schema, অনেক AWS উৎস)। কখন SNS fan-out যথেষ্ট আর কখন event bus ভালো মানায় জানুন।"],
    x: [sh("Fan out one event to several queues · এক event একাধিক queue-তে", `TOPIC=$(aws sns create-topic --name order-events --query TopicArn --output text)
aws sns subscribe --topic-arn $TOPIC --protocol sqs --notification-endpoint $EMAIL_QUEUE_ARN \\
  --attributes '{"FilterPolicy":"{\\"type\\":[\\"OrderPlaced\\"]}","RawMessageDelivery":"true"}' >/dev/null
aws sns publish --topic-arn $TOPIC --message '{"orderId":"A-7"}' \\
  --message-attributes '{"type":{"DataType":"String","StringValue":"OrderPlaced"}}' --query MessageId
aws sqs receive-message --queue-url $EMAIL_QUEUE_URL --query 'Messages[0].Body'`, `"3f2a9c1d-0b8e-5c11-9a4f-7e6d5c4b3a21"
"{\\"orderId\\":\\"A-7\\"}"`)],
  },
  "SQS": {
    s: ["A ticket queue at a bank: customers take numbers, tellers call them one by one, and if a teller drops a ticket, it goes back into the pile. SQS is a managed queue that holds messages until a worker processes them.", "ব্যাংকের টিকিটের লাইন: ক্রেতারা নম্বর নেন, teller একে একে ডাকেন, আর teller টিকিট ফেলে দিলে তা আবার গাদায় ফেরে। SQS হলো managed queue, যা worker প্রক্রিয়া না করা পর্যন্ত বার্তা রাখে।"],
    t: ["Standard queues give at-least-once delivery and nearly unlimited throughput; FIFO queues add ordering and deduplication per message group. A consumer receives a message, which becomes invisible for the visibility timeout; it deletes the message after success, otherwise it reappears. After maxReceiveCount failures, it moves to a dead-letter queue. Use long polling to reduce cost.", "Standard queue at-least-once delivery ও প্রায় সীমাহীন throughput দেয়; FIFO queue message group অনুযায়ী ক্রম ও deduplication যোগ করে। Consumer বার্তা পেলে তা visibility timeout পর্যন্ত অদৃশ্য থাকে; সফল হলে মুছে দেয়, নয়তো আবার দেখা দেয়। maxReceiveCount ব্যর্থতার পরে dead-letter queue-তে যায়। খরচ কমাতে long polling দিন।"],
    p: [["Create a queue and a DLQ with a redrive policy.", "Redrive নীতিসহ একটি queue ও DLQ বানান।"], ["Set visibility timeout longer than processing time.", "প্রক্রিয়ার সময়ের চেয়ে বড় visibility timeout দিন।"], ["Process idempotently and delete on success.", "Idempotent-ভাবে প্রক্রিয়া করে সফল হলে মুছুন।"], ["Alarm on DLQ depth and oldest message age.", "DLQ-র গভীরতা ও সবচেয়ে পুরনো বার্তার বয়সে alarm দিন।"]],
    m: ["Visibility timeout shorter than processing (duplicates); forgetting to delete messages; no DLQ so poison messages loop forever; short polling burning money.", "প্রক্রিয়ার চেয়ে ছোট visibility timeout (duplicate); বার্তা মুছতে ভুলে যাওয়া; DLQ নেই, তাই poison message চিরকাল ঘোরে; short polling-এ টাকা নষ্ট।"],
    q: ["Q: A message is processed twice. Possible reasons? A: Processing exceeded the visibility timeout, the delete failed, or standard-queue at-least-once delivery. Make the consumer idempotent.", "প্রশ্ন: একটি বার্তা দুবার প্রক্রিয়া হয়েছে। সম্ভাব্য কারণ? উত্তর: প্রক্রিয়া visibility timeout ছাড়িয়েছে, মোছা ব্যর্থ হয়েছে, বা standard queue-র at-least-once delivery। Consumer idempotent করুন।"],
    f: ["Queues decouple bursty AI workloads (document ingestion, batch inference) from user-facing APIs; SQS + autoscaled workers is a dependable pattern.", "Queue আকস্মিক AI workload (document ingestion, batch inference)-কে user-মুখী API থেকে আলাদা করে; SQS + autoscale-করা worker নির্ভরযোগ্য pattern।"],
    x: [cs("Visibility timeout, retries and DLQ simulated · visibility timeout, retry ও DLQ", `var queue = new Queue<(string Id, int Receives)>([("msg-ok", 0), ("msg-poison", 0)]);
var dlq = new List<string>();
const int MaxReceives = 3;

while (queue.TryDequeue(out var m))
{
    int receives = m.Receives + 1;
    bool success = m.Id != "msg-poison";
    if (success) { Console.WriteLine($"{m.Id}: processed on receive {receives}, deleted"); continue; }
    if (receives >= MaxReceives) { dlq.Add(m.Id); Console.WriteLine($"{m.Id}: failed {receives}x -> moved to DLQ"); continue; }
    Console.WriteLine($"{m.Id}: failed (receive {receives}), visible again after timeout");
    queue.Enqueue((m.Id, receives));
}
Console.WriteLine($"DLQ: {string.Join(", ", dlq)}");`, "msg-ok: processed on receive 1, deleted\nmsg-poison: failed (receive 1), visible again after timeout\nmsg-poison: failed (receive 2), visible again after timeout\nmsg-poison: failed 3x -> moved to DLQ\nDLQ: msg-poison")],
  },
  "DynamoDB": {
    s: ["A huge set of labelled lockers where you open a locker instantly if you know its number and section, but searching all lockers for 'blue bags' is slow and expensive. DynamoDB is extremely fast for known keys and requires designing for your queries.", "লেবেলযুক্ত locker-এর বিশাল সারি, নম্বর ও বিভাগ জানলে সাথে সাথে খোলা যায়, কিন্তু 'নীল ব্যাগ' খুঁজতে সব locker দেখা ধীর ও ব্যয়বহুল। DynamoDB জানা key-তে অত্যন্ত দ্রুত এবং query অনুযায়ী design লাগে।"],
    t: ["DynamoDB is a serverless key-value/document database with single-digit millisecond reads at any scale. Items are addressed by a partition key (and optional sort key). Query reads one partition efficiently; Scan reads everything (avoid). Global secondary indexes add alternate access patterns. Design starts from access patterns, often with single-table design. Capacity is on-demand or provisioned.", "DynamoDB serverless key-value/document database, যেকোনো মাপে এক অঙ্কের millisecond-এ পড়া দেয়। Item partition key (ও ঐচ্ছিক sort key) দিয়ে ঠিকানা পায়। Query একটি partition দক্ষভাবে পড়ে; Scan সব পড়ে (এড়ান)। Global secondary index বিকল্প access pattern যোগ করে। Design শুরু হয় access pattern থেকে, প্রায়ই single-table design-এ। ক্ষমতা on-demand বা provisioned।"],
    p: [["List access patterns first (get order by id, list orders by customer).", "আগে access pattern তালিকা করুন (id দিয়ে order, customer অনুযায়ী order তালিকা)।"], ["Choose PK/SK to serve them (PK=CUSTOMER#id, SK=ORDER#date).", "সেগুলো মেটাতে PK/SK বাছুন (PK=CUSTOMER#id, SK=ORDER#date)।"], ["Add GSIs for other patterns.", "অন্য pattern-এর জন্য GSI দিন।"], ["Use conditional writes for idempotency.", "Idempotency-র জন্য conditional write দিন।"]],
    m: ["Designing tables like SQL and then scanning; hot partitions from low-cardinality keys; large items (400 KB limit); needing ad-hoc joins and reports (use analytics exports).", "SQL-এর মতো table design করে তারপর scan; কম-বৈচিত্র্যের key থেকে hot partition; বড় item (৪০০ KB সীমা); অস্থায়ী join ও report লাগা (analytics export দিন)।"],
    q: ["Q: How do you fetch a customer's latest 10 orders? A: Query PK = CUSTOMER#42 with SK begins_with ORDER#, ScanIndexForward=false and Limit=10.", "প্রশ্ন: একজন customer-এর সর্বশেষ ১০টি order কীভাবে আনবেন? উত্তর: PK = CUSTOMER#42, SK begins_with ORDER#, ScanIndexForward=false ও Limit=10 দিয়ে Query।"],
    f: ["DynamoDB is a common store for AI chat histories and agent state (session -> messages), where access patterns are simple and scale is large.", "AI chat history ও agent state (session -> message)-এর প্রচলিত store DynamoDB, যেখানে access pattern সহজ ও মাপ বড়।"],
    x: [file("json", "Single-table items for orders by customer · customer অনুযায়ী order", `[
  { "PK": "CUSTOMER#42", "SK": "PROFILE",                 "name": "Asha", "city": "Dhaka" },
  { "PK": "CUSTOMER#42", "SK": "ORDER#2026-11-10#A-7",    "total": 2400, "status": "DELIVERED" },
  { "PK": "CUSTOMER#42", "SK": "ORDER#2026-11-12#A-9",    "total": 650,  "status": "PLACED",
    "GSI1PK": "STATUS#PLACED", "GSI1SK": "2026-11-12#A-9" }
]
// Latest orders:  Query PK = "CUSTOMER#42" AND begins_with(SK, "ORDER#"), ScanIndexForward = false, Limit = 10
// Open orders:    Query GSI1 where GSI1PK = "STATUS#PLACED"
// Idempotent put: PutItem with ConditionExpression "attribute_not_exists(SK)"`, undefined, "DynamoDB data model")],
  },
  "API Gateway": {
    s: ["A front desk for many offices that checks ID cards, limits how many requests each visitor makes, and directs them to the right department. Amazon API Gateway is that front desk for your APIs.", "অনেক অফিসের সামনের desk, যা ID card যাচাই করে, প্রত্যেক দর্শনার্থী কতগুলো অনুরোধ করতে পারবে সীমা দেয়, এবং সঠিক বিভাগে পাঠায়। Amazon API Gateway আপনার API-র সেই সামনের desk।"],
    t: ["API Gateway offers HTTP APIs (simple, cheaper, fast) and REST APIs (more features: usage plans, API keys, request validation, caching) plus WebSocket APIs. It integrates with Lambda, ALB/VPC links, and AWS services directly, and supports JWT/Cognito authorizers, throttling, custom domains and stages. For containers on ECS/EKS, an ALB alone may be enough.", "API Gateway HTTP API (সহজ, সস্তা, দ্রুত) ও REST API (বেশি feature: usage plan, API key, request যাচাই, caching) আর WebSocket API দেয়। এটি Lambda, ALB/VPC link ও সরাসরি AWS service-এর সাথে যুক্ত হয়, এবং JWT/Cognito authorizer, throttling, custom domain ও stage সমর্থন করে। ECS/EKS-এ container-এর জন্য শুধু ALB-ই যথেষ্ট হতে পারে।"],
    p: [["Create an HTTP API with a Lambda or VPC link integration.", "Lambda বা VPC link integration-সহ HTTP API বানান।"], ["Add a JWT authorizer (Cognito or your IdP).", "JWT authorizer দিন (Cognito বা আপনার IdP)।"], ["Set throttling limits per route.", "Route অনুযায়ী throttling সীমা দিন।"], ["Map a custom domain with an ACM certificate.", "ACM certificate-সহ custom domain map করুন।"]],
    m: ["Using REST APIs when HTTP APIs suffice (cost); no throttling; 29-second integration timeout surprises for long tasks (use async jobs).", "HTTP API যথেষ্ট হলেও REST API (খরচ); throttling নেই; দীর্ঘ কাজে ২৯-সেকেন্ড integration timeout-এ অবাক হওয়া (async job দিন)।"],
    q: ["Q: Your endpoint generates a report taking 2 minutes behind API Gateway. Design? A: Return 202 with a job ID, process in SQS + worker/Step Functions, and let the client poll or receive a WebSocket/notification.", "প্রশ্ন: API Gateway-এর পিছনে আপনার endpoint ২ মিনিটে report বানায়। Design? উত্তর: Job ID-সহ 202 দিন, SQS + worker/Step Functions-এ প্রক্রিয়া করুন, আর client-কে poll বা WebSocket/notification পেতে দিন।"],
    f: ["Streaming AI responses need gateways that support streaming (Lambda response streaming, ALB, or WebSockets). Check this early when designing AI APIs on AWS.", "Streaming AI response-এর জন্য streaming সমর্থনকারী gateway লাগে (Lambda response streaming, ALB বা WebSocket)। AWS-এ AI API design করার শুরুতেই এটি দেখুন।"],
    x: [sh("Create an HTTP API with throttling · throttling-সহ HTTP API", `API=$(aws apigatewayv2 create-api --name shop-http --protocol-type HTTP --target $LAMBDA_ARN --query ApiId --output text)
aws apigatewayv2 update-stage --api-id $API --stage-name '$default' \\
  --default-route-settings 'ThrottlingBurstLimit=100,ThrottlingRateLimit=50' >/dev/null
curl -s https://$API.execute-api.ap-south-1.amazonaws.com/health
for i in $(seq 1 200); do curl -s -o /dev/null -w "%{http_code}\\n" https://$API.execute-api.ap-south-1.amazonaws.com/health & done | sort | uniq -c`, `{"status":"Healthy"}
    142 200
     58 429`)],
  },
  "Secrets Manager": {
    s: ["A bank vault for keys: staff request a key when they need it, every access is logged, and locks are changed regularly without anyone memorising them. Secrets Manager stores and rotates passwords and API keys.", "চাবির জন্য ব্যাংকের ভল্ট: কর্মীরা দরকারে চাবি চান, প্রতিটি access লেখা হয়, আর কারও মুখস্থ না থাকলেও নিয়মিত তালা বদলানো হয়। Secrets Manager password ও API key রাখে এবং বদলায়।"],
    t: ["Secrets Manager stores secrets encrypted with KMS, controls access with IAM, logs reads in CloudTrail, and can rotate database credentials automatically with Lambda. Apps fetch secrets at startup (and cache them) via the SDK or the AWS configuration provider for .NET; ECS and EKS can inject them as environment variables or files. Parameter Store is a cheaper option for config and simple secrets.", "Secrets Manager KMS দিয়ে encrypt করে secret রাখে, IAM দিয়ে access নিয়ন্ত্রণ করে, CloudTrail-এ পড়া লেখে, এবং Lambda দিয়ে স্বয়ংক্রিয়ভাবে database credential বদলাতে পারে। App startup-এ SDK বা .NET-এর AWS configuration provider দিয়ে secret আনে (ও cache করে); ECS ও EKS এগুলো environment variable বা file হিসেবে দিতে পারে। Config ও সাধারণ secret-এর জন্য Parameter Store সস্তা বিকল্প।"],
    p: [["Create the secret (JSON with username/password).", "Secret বানান (username/password-সহ JSON)।"], ["Grant the app role secretsmanager:GetSecretValue on that ARN only.", "App role-কে শুধু সেই ARN-এ secretsmanager:GetSecretValue দিন।"], ["Load it into configuration at startup and cache.", "Startup-এ configuration-এ load করে cache করুন।"], ["Enable rotation and test that the app picks up new values.", "Rotation চালু করে app নতুন মান নেয় test করুন।"]],
    m: ["Fetching the secret on every request (slow, costly); broad secretsmanager:* permissions; printing secrets in logs; rotation that breaks long-lived connections.", "প্রতি request-এ secret আনা (ধীর, ব্যয়বহুল); বিস্তৃত secretsmanager:* অনুমতি; log-এ secret print; দীর্ঘস্থায়ী connection ভাঙা rotation।"],
    q: ["Q: How do you rotate a DB password without downtime? A: Use the alternating-users strategy (two DB users, rotate the inactive one) or ensure the app re-reads the secret and reconnects on auth failures.", "প্রশ্ন: Downtime ছাড়া DB password কীভাবে বদলাবেন? উত্তর: পালাক্রমে-user কৌশল (দুটি DB user, নিষ্ক্রিয়টা বদলান) দিন, বা auth ব্যর্থ হলে app secret আবার পড়ে পুনরায় যুক্ত হয় নিশ্চিত করুন।"],
    f: ["AI provider keys belong here too, with per-environment secrets and spending alerts; leaked AI keys are a fast-growing source of incidents.", "AI provider-এর key-ও এখানে থাকবে, পরিবেশ-ভিত্তিক secret ও খরচের alert-সহ; ফাঁস হওয়া AI key দ্রুত বাড়তে থাকা incident-এর উৎস।"],
    x: [sh("Store, grant and read a secret · secret রাখা, অনুমতি ও পড়া", `aws secretsmanager create-secret --name shop/prod/ai-key --secret-string '{"key":"sk-..."}' --query ARN --output text
aws secretsmanager get-secret-value --secret-id shop/prod/ai-key --query SecretString --output text | jq -r '.key | .[0:5] + "..."'
aws secretsmanager rotate-secret --secret-id shop/prod/db --query 'VersionId' --output text
# .NET: builder.Configuration.AddSecretsManager(configurator: o => o.SecretFilter = s => s.Name.StartsWith("shop/prod/"));`, `arn:aws:secretsmanager:ap-south-1:123456789012:secret:shop/prod/ai-key-AbC123
sk-..
6f1e2d3c-4b5a-6978-8a9b-0c1d2e3f4a5b`)],
  },
  "CloudWatch": {
    s: ["A hospital's monitoring room: heart-rate screens (metrics), nurses' notes (logs) and alarms that ring when numbers go bad. CloudWatch is AWS's monitoring room.", "হাসপাতালের পর্যবেক্ষণ কক্ষ: heart-rate পর্দা (metric), নার্সের নোট (log), আর সংখ্যা খারাপ হলে বাজা alarm। CloudWatch হলো AWS-এর পর্যবেক্ষণ কক্ষ।"],
    t: ["CloudWatch collects metrics (CPU, latency, custom app metrics), logs (Logs Insights queries), alarms (notify via SNS, trigger scaling), dashboards and traces (X-Ray / OpenTelemetry via ADOT). Use structured JSON logs, metric filters to turn log patterns into metrics, alarms on symptoms (error rate, p99 latency) and retention policies to control cost.", "CloudWatch metric (CPU, latency, custom app metric), log (Logs Insights query), alarm (SNS দিয়ে জানানো, scaling চালু), dashboard ও trace (X-Ray / ADOT দিয়ে OpenTelemetry) সংগ্রহ করে। Structured JSON log, log pattern-কে metric বানাতে metric filter, উপসর্গে alarm (error হার, p99 latency) আর খরচ নিয়ন্ত্রণে retention নীতি ব্যবহার করুন।"],
    p: [["Send structured logs from your app.", "App থেকে structured log পাঠান।"], ["Query with Logs Insights.", "Logs Insights দিয়ে query করুন।"], ["Create alarms on 5xx rate and p99 latency.", "5xx হার ও p99 latency-তে alarm বানান।"], ["Set log retention (e.g., 30 days).", "Log retention ঠিক করুন (যেমন ৩০ দিন)।"]],
    m: ["Infinite log retention (big bills); alarms on CPU only; no dashboards for the on-call engineer; high-cardinality custom metrics exploding costs.", "অনন্ত log retention (বড় bill); শুধু CPU-তে alarm; on-call engineer-এর জন্য dashboard নেই; বেশি-বৈচিত্র্যের custom metric-এ খরচ বিস্ফোরণ।"],
    q: ["Q: How do you find the slowest endpoints from logs? A: Logs Insights: filter by request logs, stats pct(duration, 99) by path, sort descending.", "প্রশ্ন: Log থেকে সবচেয়ে ধীর endpoint কীভাবে খুঁজবেন? উত্তর: Logs Insights: request log দিয়ে filter, path অনুযায়ী stats pct(duration, 99), নিচের দিকে sort।"],
    f: ["Track AI usage as custom metrics (tokens, cost, model, feature) alongside latency and errors, and alarm on daily spend.", "Latency ও error-এর পাশাপাশি AI ব্যবহার custom metric হিসেবে রাখুন (token, খরচ, model, feature), আর দৈনিক খরচে alarm দিন।"],
    x: [sh("Query logs and create an error alarm · log query ও error alarm", `aws logs start-query --log-group-name /ecs/shop-api --start-time $(date -d '1 hour ago' +%s) --end-time $(date +%s) \\
  --query-string 'fields path, duration | stats count(*) as n, pct(duration, 99) as p99 by path | sort p99 desc | limit 3'
aws cloudwatch put-metric-alarm --alarm-name shop-api-5xx --namespace AWS/ApplicationELB --metric-name HTTPCode_Target_5XX_Count \\
  --dimensions Name=LoadBalancer,Value=app/shop-alb/abc123 --statistic Sum --period 60 --evaluation-periods 3 \\
  --threshold 25 --comparison-operator GreaterThanThreshold --alarm-actions $ONCALL_TOPIC`, `{ "queryId": "a1b2c3d4-..." }
# get-query-results:
path               n      p99
/api/search        8421   1840
/api/orders        12093  410
/api/products      40211  95`)],
  },
  "ECS": {
    s: ["A ship company that loads your containers and manages the ship's crew, routes and repairs. You just hand over the containers. ECS runs and manages your Docker containers on AWS.", "Shipping কোম্পানি, যা আপনার container তোলে এবং জাহাজের কর্মী, পথ ও মেরামত সামলায়। আপনি শুধু container দেন। ECS AWS-এ আপনার Docker container চালায় ও পরিচালনা করে।"],
    t: ["ECS concepts: a task definition (image, CPU/memory, env, secrets, logging, IAM task role), a service (desired count, load balancer, deployment strategy, autoscaling) and a cluster. Fargate runs tasks without managing servers; EC2 capacity providers are cheaper at scale. Rolling or blue/green deployments with circuit breakers roll back failed releases automatically.", "ECS-এর ধারণা: task definition (image, CPU/memory, env, secret, logging, IAM task role), service (desired সংখ্যা, load balancer, deployment কৌশল, autoscaling) ও cluster। Fargate server পরিচালনা ছাড়াই task চালায়; বড় মাপে EC2 capacity provider সস্তা। Circuit breaker-সহ rolling বা blue/green deployment ব্যর্থ release স্বয়ংক্রিয়ভাবে ফেরায়।"],
    p: [["Push the image to ECR.", "Image ECR-এ push করুন।"], ["Register a task definition with a task role and log configuration.", "Task role ও log configuration-সহ task definition register করুন।"], ["Create a Fargate service behind an ALB.", "ALB-এর পিছনে Fargate service বানান।"], ["Enable the deployment circuit breaker and autoscaling.", "Deployment circuit breaker ও autoscaling চালু করুন।"]],
    m: ["Using the execution role for app permissions (use the task role); secrets as plain env vars in task definitions; no health check grace period for slow-starting apps.", "App-এর অনুমতিতে execution role (task role দিন); task definition-এ সাধারণ env var হিসেবে secret; ধীরে শুরু হওয়া app-এ health check grace period নেই।"],
    q: ["Q: ECS task role vs execution role? A: The execution role lets ECS pull the image and read secrets/logs on your behalf; the task role is what your application code uses to call AWS services.", "প্রশ্ন: ECS task role বনাম execution role? উত্তর: Execution role ECS-কে আপনার হয়ে image pull ও secret/log পড়তে দেয়; task role হলো যা আপনার application code AWS service ডাকতে ব্যবহার করে।"],
    f: ["ECS on Fargate is a simple, low-ops choice for .NET APIs and AI gateway services; many teams prefer it over Kubernetes until they truly need Kubernetes features.", ".NET API ও AI gateway service-এর জন্য Fargate-এ ECS সহজ, কম-পরিচালনার পছন্দ; অনেক দল সত্যিই Kubernetes feature না লাগা পর্যন্ত এটিকে পছন্দ করে।"],
    x: [file("json", "Fargate task definition for an ASP.NET Core API · Fargate task definition", `{
  "family": "shop-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512", "memory": "1024",
  "runtimePlatform": { "cpuArchitecture": "ARM64", "operatingSystemFamily": "LINUX" },
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/shop-api-task",
  "containerDefinitions": [{
    "name": "api",
    "image": "123456789012.dkr.ecr.ap-south-1.amazonaws.com/shop-api:1.4.0",
    "portMappings": [{ "containerPort": 8080 }],
    "environment": [{ "name": "ASPNETCORE_ENVIRONMENT", "value": "Production" }],
    "secrets": [{ "name": "ConnectionStrings__Shop", "valueFrom": "arn:aws:secretsmanager:ap-south-1:123456789012:secret:shop/prod/db" }],
    "healthCheck": { "command": ["CMD-SHELL", "wget -qO- http://localhost:8080/health || exit 1"], "interval": 15, "retries": 3 },
    "logConfiguration": { "logDriver": "awslogs", "options": { "awslogs-group": "/ecs/shop-api", "awslogs-region": "ap-south-1", "awslogs-stream-prefix": "api" } }
  }]
}`, undefined, "ECS task definition")],
  },
  "EKS": {
    s: ["Renting a fully staffed Kubernetes control tower from Amazon, while you still decide which planes (pods) fly and where. EKS is managed Kubernetes on AWS.", "Amazon থেকে কর্মীসহ Kubernetes control tower ভাড়া, অথচ কোন বিমান (pod) কোথায় উড়বে তা আপনিই ঠিক করেন। EKS হলো AWS-এ managed Kubernetes।"],
    t: ["EKS runs the Kubernetes control plane for you; you choose node options (managed node groups, Karpenter for fast, cost-aware autoscaling, or Fargate). Key integrations: IAM roles for service accounts / EKS Pod Identity (per-pod AWS permissions), AWS Load Balancer Controller (ALB/NLB from Ingress/Service), EBS/EFS CSI drivers, and CloudWatch/ADOT for observability. Upgrades are your responsibility on a regular cadence.", "EKS আপনার হয়ে Kubernetes control plane চালায়; node-এর বিকল্প আপনি বাছেন (managed node group, দ্রুত ও খরচ-সচেতন autoscaling-এর জন্য Karpenter, বা Fargate)। মূল integration: service account-এর IAM role / EKS Pod Identity (pod-প্রতি AWS অনুমতি), AWS Load Balancer Controller (Ingress/Service থেকে ALB/NLB), EBS/EFS CSI driver, আর observability-র জন্য CloudWatch/ADOT। নিয়মিত upgrade আপনার দায়িত্ব।"],
    p: [["Create a cluster with eksctl or Terraform.", "eksctl বা Terraform দিয়ে cluster বানান।"], ["Install the AWS Load Balancer Controller and Karpenter.", "AWS Load Balancer Controller ও Karpenter install করুন।"], ["Give pods AWS access with Pod Identity, not node roles.", "Node role নয়, Pod Identity দিয়ে pod-কে AWS access দিন।"], ["Plan Kubernetes version upgrades every few months.", "কয়েক মাস পরপর Kubernetes version upgrade পরিকল্পনা করুন।"]],
    m: ["Giving all pods the node's IAM role; falling far behind on Kubernetes versions (extended support costs); running EKS for a single small app.", "সব pod-কে node-এর IAM role দেওয়া; Kubernetes version-এ অনেক পিছিয়ে পড়া (extended support খরচ); একটি ছোট app-এর জন্য EKS চালানো।"],
    q: ["Q: ECS or EKS for a new team with three .NET services? A: Often ECS (less to manage); choose EKS if you need Kubernetes tooling, portability, or already have Kubernetes skills and platform support.", "প্রশ্ন: তিনটি .NET service-সহ নতুন দলের জন্য ECS নাকি EKS? উত্তর: প্রায়ই ECS (পরিচালনা কম); Kubernetes tooling, বহনযোগ্যতা লাগলে বা আগে থেকেই Kubernetes দক্ষতা ও platform সহায়তা থাকলে EKS।"],
    f: ["EKS with GPU node pools and Karpenter is a common platform for self-hosted model serving (vLLM, Triton). Kubernetes plus AI is a strong 2028 skill combination.", "GPU node pool ও Karpenter-সহ EKS self-hosted model serving (vLLM, Triton)-এর প্রচলিত platform। Kubernetes ও AI ২০২৮-এর শক্তিশালী দক্ষতার মিশ্রণ।"],
    x: [sh("Create a cluster and give a pod AWS access · cluster ও pod-কে AWS access", `eksctl create cluster --name shop --region ap-south-1 --version 1.33 \\
  --nodegroup-name default --node-type m7g.large --nodes 2 --managed
aws eks update-kubeconfig --name shop --region ap-south-1
aws eks create-pod-identity-association --cluster-name shop --namespace shop \\
  --service-account api --role-arn arn:aws:iam::123456789012:role/shop-api-s3-read --query 'association.associationId'
kubectl get nodes`, `2026-11-12 10:20:01 [✔]  EKS cluster "shop" in "ap-south-1" region is ready
Updated context arn:aws:eks:ap-south-1:123456789012:cluster/shop in /home/you/.kube/config
"a-0abc1234def567890"
NAME                                          STATUS   ROLES    AGE   VERSION
ip-10-20-33-14.ap-south-1.compute.internal    Ready    <none>   4m    v1.33.2-eks
ip-10-20-49-22.ap-south-1.compute.internal    Ready    <none>   4m    v1.33.2-eks`)],
  },
  "ECR": {
    s: ["A private, guarded storeroom for your company's packed lunch boxes (images), next to the kitchen where they will be served. ECR is AWS's private container registry.", "আপনার কোম্পানির টিফিন বক্সের (image) জন্য ব্যক্তিগত, প্রহরীযুক্ত গুদাম, পরিবেশনের রান্নাঘরের পাশেই। ECR হলো AWS-এর private container registry।"],
    t: ["ECR stores container images (and OCI artifacts like Helm charts) per repository, integrated with IAM. Enable image scanning (basic or Inspector enhanced), tag immutability to prevent overwrites, lifecycle policies to delete old images, and replication to other regions. ECS/EKS pull from ECR fast within the region; use VPC endpoints to avoid NAT costs.", "ECR repository অনুযায়ী container image (ও Helm chart-এর মতো OCI artifact) রাখে, IAM-এর সাথে যুক্ত। Image scanning (basic বা Inspector enhanced), overwrite আটকাতে tag-এর অপরিবর্তনীয়তা, পুরনো image মুছতে lifecycle policy, আর অন্য region-এ replication চালু করুন। ECS/EKS region-এর ভিতরে দ্রুত ECR থেকে pull করে; NAT খরচ এড়াতে VPC endpoint দিন।"],
    p: [["Create a repository with scan-on-push and immutable tags.", "Scan-on-push ও অপরিবর্তনীয় tag-সহ repository বানান।"], ["Log in with aws ecr get-login-password.", "aws ecr get-login-password দিয়ে login করুন।"], ["Push images from CI using OIDC credentials.", "OIDC credential দিয়ে CI থেকে image push করুন।"], ["Add a lifecycle policy to keep the last N images.", "শেষ N image রাখতে lifecycle policy দিন।"]],
    m: ["Mutable tags so 'v1.4.0' can change; never cleaning old images; ignoring scan findings; pulling through NAT gateways.", "পরিবর্তনশীল tag, ফলে 'v1.4.0' বদলাতে পারে; কখনো পুরনো image পরিষ্কার না করা; scan-এর ফল উপেক্ষা; NAT gateway দিয়ে pull।"],
    q: ["Q: Why enable tag immutability? A: It guarantees a tag always points to the same image, so deployments and rollbacks are predictable and tampering is harder.", "প্রশ্ন: Tag-এর অপরিবর্তনীয়তা কেন চালু করবেন? উত্তর: এটি নিশ্চিত করে একটি tag সবসময় একই image-এর দিকে থাকে, তাই deployment ও rollback অনুমানযোগ্য এবং কারসাজি কঠিন।"],
    f: ["Registries increasingly store signatures and SBOMs next to images; deployment admission policies verify them before running.", "Registry ক্রমশ image-এর পাশে স্বাক্ষর ও SBOM রাখছে; deployment admission নীতি চালানোর আগে সেগুলো যাচাই করে।"],
    x: [sh("Secure ECR repository with lifecycle policy · lifecycle policy-সহ নিরাপদ ECR", `aws ecr create-repository --repository-name shop-api --image-tag-mutability IMMUTABLE \\
  --image-scanning-configuration scanOnPush=true --query 'repository.repositoryUri' --output text
aws ecr put-lifecycle-policy --repository-name shop-api --lifecycle-policy-text \\
  '{"rules":[{"rulePriority":1,"description":"keep last 20","selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":20},"action":{"type":"expire"}}]}' >/dev/null
aws ecr describe-image-scan-findings --repository-name shop-api --image-id imageTag=1.4.0 --query 'imageScanFindings.findingSeverityCounts'`, `123456789012.dkr.ecr.ap-south-1.amazonaws.com/shop-api
{
    "LOW": 2,
    "MEDIUM": 1
}`)],
  },
  "CloudFormation": {
    s: ["A building blueprint that a construction company follows exactly, every time, in any city. Change the blueprint and they update the building to match. CloudFormation builds AWS resources from templates.", "একটি ভবনের নকশা, যা নির্মাণ কোম্পানি প্রতিবার, যেকোনো শহরে হুবহু মানে। নকশা বদলালে ভবন সেই অনুযায়ী আপডেট করে। CloudFormation template থেকে AWS resource বানায়।"],
    t: ["CloudFormation is AWS's infrastructure as code: templates (YAML/JSON) declare resources, parameters and outputs; stacks are deployed instances. Change sets preview updates; drift detection finds manual changes; rollback undoes failed deployments. AWS CDK lets you write the same in C#/TypeScript and synthesises CloudFormation. Terraform is the popular multi-cloud alternative.", "CloudFormation AWS-এর infrastructure as code: template (YAML/JSON) resource, parameter ও output ঘোষণা করে; stack হলো deploy করা instance। Change set আপডেট আগে দেখায়; drift detection হাতে করা পরিবর্তন খোঁজে; rollback ব্যর্থ deployment ফেরায়। AWS CDK একই জিনিস C#/TypeScript-এ লিখতে দেয় এবং CloudFormation তৈরি করে। Terraform জনপ্রিয় multi-cloud বিকল্প।"],
    p: [["Write a template or a CDK app in C#.", "Template বা C#-এ CDK app লিখুন।"], ["Create a change set and review it.", "Change set বানিয়ে review করুন।"], ["Deploy through CI with a deploy role.", "Deploy role দিয়ে CI-তে deploy করুন।"], ["Run drift detection regularly.", "নিয়মিত drift detection চালান।"]],
    m: ["Editing resources in the console after deploying with IaC (drift); deleting stacks that contain databases without DeletionPolicy: Retain/Snapshot; giant monolithic stacks.", "IaC দিয়ে deploy করার পরে console-এ resource সম্পাদনা (drift); DeletionPolicy: Retain/Snapshot ছাড়া database-যুক্ত stack মোছা; বিশাল একক stack।"],
    q: ["Q: Why use change sets? A: They show exactly which resources will be added, modified or replaced before you apply, preventing surprises like a database being replaced.", "প্রশ্ন: Change set কেন? উত্তর: প্রয়োগের আগে ঠিক কোন resource যোগ, পরিবর্তন বা প্রতিস্থাপিত হবে দেখায়, database প্রতিস্থাপনের মতো বিস্ময় আটকায়।"],
    f: ["AI assistants generate IaC quickly; always review the plan/change set, because one wrong property can replace a production resource.", "AI assistant দ্রুত IaC তৈরি করে; সবসময় plan/change set review করুন, কারণ একটি ভুল property production resource প্রতিস্থাপন করতে পারে।"],
    x: [file("yaml", "Template: private S3 bucket + SQS with DLQ · S3 ও DLQ-সহ SQS", `AWSTemplateFormatVersion: "2010-09-09"
Description: Shop storage and queues
Parameters:
  Env: { Type: String, AllowedValues: [dev, prod] }
Resources:
  InvoicesBucket:
    Type: AWS::S3::Bucket
    DeletionPolicy: Retain
    Properties:
      BucketName: !Sub shop-invoices-\${Env}-\${AWS::AccountId}
      VersioningConfiguration: { Status: Enabled }
      PublicAccessBlockConfiguration:
        { BlockPublicAcls: true, BlockPublicPolicy: true, IgnorePublicAcls: true, RestrictPublicBuckets: true }
  OrdersDlq:
    Type: AWS::SQS::Queue
  OrdersQueue:
    Type: AWS::SQS::Queue
    Properties:
      VisibilityTimeout: 120
      RedrivePolicy: { deadLetterTargetArn: !GetAtt OrdersDlq.Arn, maxReceiveCount: 5 }
Outputs:
  QueueUrl: { Value: !Ref OrdersQueue }
# aws cloudformation deploy --template-file shop.yaml --stack-name shop-dev --parameter-overrides Env=dev`, undefined, "CloudFormation template")],
  },
};
