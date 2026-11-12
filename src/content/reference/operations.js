const data = {};
function add(key, en, bn, a, la, b, lb, de, db) {
  data[key] = {
    en,
    bn,
    decisionEn: de,
    decisionBn: db,
    examples: [
      {
        title: "Working configuration · পূর্ণ config উদাহরণ",
        language: la,
        code: a,
        kind: "Configuration reference",
      },
      {
        title: "Operate and verify · চালানো ও পরীক্ষা",
        language: lb,
        code: b,
        kind: "Reference workflow",
      },
    ],
  };
}
add(
  "Linux and Bash",
  "A shell script is a program with data boundaries, errors, and side effects. Expansion and quoting happen before the target program receives arguments. Arrays preserve argument boundaries more reliably than concatenated command strings. Strict options help but have context-dependent behavior; explicitly handle important failures and create temporary files safely.",
  "Shell script-ও program। Target-এর আগে expansion ও quote কাজ করে। Argument জোড়া text না বানিয়ে array নিন। Strict mode সাহায্য করলেও গুরুত্বপূর্ণ failure নিজে সামলান; temporary path নিরাপদ করুন।",
  `#!/usr/bin/env bash
set -euo pipefail
scratch_dir=$(mktemp -d)
trap 'rm -rf -- "$scratch_dir"' EXIT
project_dir="./My Project"
args=(build "$project_dir/App.csproj" --configuration Release)
printf 'Running dotnet with %s arguments\n' "\${#args[@]}"
dotnet "\${args[@]}"
printf 'Build completed\n'`,
  "bash",
  `bash -n build.sh
# If ShellCheck is installed:
shellcheck build.sh
bash build.sh
# Test paths containing spaces and a deliberately failing build.
# Confirm the trap only removes the newly created scratch directory.`,
  "bash",
  "Never use eval for untrusted command text. Failures in pipelines, conditionals, and subshells deserve explicit tests, even with set -e.",
  "Untrusted text-এ eval নয়। set -e থাকলেও pipeline, conditional ও subshell failure test করুন।",
);
add(
  "Networking Basics",
  "Connectivity investigation should isolate DNS, route, transport, TLS, HTTP routing, authentication, and application behavior. A 403 is useful evidence that a server responded, unlike connection refusal. Proxy settings and certificate trust can change the observed path. Preserve the precise host, port, method, status, and timing before changing firewall rules.",
  "DNS থেকে app পর্যন্ত স্তর আলাদা পরীক্ষা। 403-এ server উত্তর দিয়েছে, connection refused আলাদা। Proxy ও certificate trust পথ বদলায়। Firewall বদলের আগে host, port, status ও সময় লিখুন।",
  `getent hosts example.com
curl --connect-timeout 3 --max-time 10 -I https://example.com
curl --connect-timeout 3 --max-time 10 -sS -o /dev/null -w 'status=%{http_code} total=%{time_total}\n' https://example.com
ss -ltn
ip route`,
  "bash",
  `using var handler=new SocketsHttpHandler{ConnectTimeout=TimeSpan.FromSeconds(2)};
using var client=new HttpClient(handler){Timeout=TimeSpan.FromSeconds(5)};
try {
    using var response=await client.GetAsync("https://example.com");
    Console.WriteLine($"HTTP {(int)response.StatusCode}");
} catch(HttpRequestException e) {Console.WriteLine(e.HttpRequestError);}
catch(TaskCanceledException){Console.WriteLine("Request deadline");}`,
  "csharp",
  "Do not disable TLS verification or open all ports as a diagnostic shortcut. Fix the failing boundary and retest the same request.",
  "TLS বন্ধ বা সব port খুলে shortcut নয়। ব্যর্থ boundary ঠিক করে একই request আবার দেখুন।",
);
add(
  "Git and GitHub",
  "A team workflow combines local commits with hosted review and automated checks. Small coherent branches reduce review and merge risk. Branch protection defines merge authority and required evidence; pushing a branch does not imply that checks passed or production changed. Tags and release artifacts should identify exactly what was reviewed.",
  "Local commit, hosted review ও automated check মিলে team workflow। ছোট coherent branch review সহজ করে। Push মানেই test পাস বা production বদল নয়। Release tag/artifact-এর সাথে reviewed source মিলতে হবে।",
  `git switch -c feature/order-validation
git status --short
git add -p -- src/Orders.cs
git diff --staged
git commit -m "Reject invalid order quantities"
git push -u origin feature/order-validation`,
  "bash",
  `git fetch origin
git log --oneline origin/main..HEAD
git diff --check origin/main...HEAD
git diff --stat origin/main...HEAD
# Open a pull request using your approved hosting workflow.
# Merge only after required review and checks pass.`,
  "bash",
  "Protect CI secrets from untrusted pull-request code. A reviewer approving prose does not authorize arbitrary production actions hidden in a workflow change.",
  "অবিশ্বস্ত PR code-এ CI secret নয়। Review অনুমতি মানে workflow-এ লুকানো production action-এর অনুমতি নয়।",
);
add(
  "Docker",
  "A multi-stage build separates compilation tools from runtime content. Copying project files before source can improve restore-layer reuse, while a narrow context avoids accidental secrets. The final image needs a deliberate user, listening port, health behavior, and patch policy. Use the same tested artifact through release stages instead of rebuilding from moving inputs.",
  "Multi-stage-এ SDK ও runtime আলাদা। Project file আগে দিলে restore cache কাজে লাগে। Context ছোট ও secret বাদ রাখুন। Final image-এ user, port, health ও patch policy স্পষ্ট। Tested artifact-ই এগিয়ে দিন।",
  `FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY App.csproj ./
RUN dotnet restore App.csproj
COPY . ./
RUN dotnet publish App.csproj -c Release -o /publish --no-restore
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /publish ./
USER app
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "App.dll"]`,
  "dockerfile",
  `printf 'bin/\nobj/\n.git/\n.env*\n' > .dockerignore
docker build -t app:review .
docker run --rm -p 127.0.0.1:8080:8080 app:review
docker image history app:review
# Use currently supported, reviewed image versions/digests in a real release.`,
  "bash",
  "The example assumes App.csproj at the context root and an ASP.NET Core application. Match assembly names and current runtime support before deployment.",
  "উদাহরণে root-এ App.csproj ও ASP.NET Core ধরা। বাস্তবে assembly নাম ও বর্তমান runtime support মেলান।",
);
add(
  "Docker Compose",
  "Compose expresses local multi-service relationships and persistent storage. Health checks support readiness conditions, but applications still need retry behavior during later dependency failures. A named volume survives ordinary container replacement. Do not hard-code production credentials into the Compose file or confuse a developer topology with a multi-host orchestrator.",
  "Compose-এ service সম্পর্ক ও volume থাকে। Health check শুরুতে সাহায্য করে, পরে dependency fail-এর retry app-এ লাগে। Named volume থাকে। Production secret file-এ নয়; local topology multi-host orchestration নয়।",
  `services:
  web:
    image: mcr.microsoft.com/dotnet/samples:aspnetapp
    ports: ["127.0.0.1:8080:8080"]
  cache:
    image: redis:7-alpine
    command: ["redis-server", "--appendonly", "yes"]
    volumes: ["cache-data:/data"]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
volumes:
  cache-data: {}`,
  "yaml",
  `docker compose config --services
docker compose up -d
docker compose ps
docker compose logs --tail 50
docker compose down
docker volume ls
# The public sample web app is independent; it does not use Redis automatically.`,
  "bash",
  "Declaring two services does not wire application code to the cache. Configure the application’s actual connection and behavior explicitly.",
  "দুই service লেখা মানেই app cache ব্যবহার করে না। Connection ও application code আলাদা যুক্ত করুন।",
);
add(
  "Kubernetes",
  "A deployable workload needs replica policy, selectors, image identity, resource requests/limits, probes, and graceful termination. Readiness controls traffic eligibility; liveness requests restart; startup probes protect slow initialization. Probe endpoints should be designed so optional downstream failures do not restart every healthy process at once.",
  "Workload-এ replica, selector, image, resource, probe ও termination দরকার। Readiness traffic, liveness restart, startup ধীর শুরুর সুযোগ দেয়। Optional dependency fail-এ সবাই restart নয়।",
  `apiVersion: apps/v1
kind: Deployment
metadata: {name: api}
spec:
  replicas: 2
  selector: {matchLabels: {app: api}}
  template:
    metadata: {labels: {app: api}}
    spec:
      terminationGracePeriodSeconds: 30
      containers:
        - name: api
          image: your-registry/app:reviewed-version
          ports: [{containerPort: 8080}]
          resources:
            requests: {cpu: "100m", memory: "128Mi"}
            limits: {cpu: "500m", memory: "256Mi"}
          readinessProbe:
            httpGet: {path: /health/ready, port: 8080}
            initialDelaySeconds: 5
            periodSeconds: 5`,
  "yaml",
  `kubectl apply --dry-run=server -f deployment.yaml -n learning
kubectl diff -f deployment.yaml -n learning
kubectl apply -f deployment.yaml -n learning
kubectl rollout status deployment/api -n learning --timeout=120s
kubectl get pods -n learning -l app=api -o wide
# The app must implement the configured /health/ready endpoint.`,
  "bash",
  "Resource numbers are teaching defaults, not universal production recommendations. Measure memory, CPU throttling, startup, and disruption behavior.",
  "Resource মান শেখার উদাহরণ। বাস্তবে memory, throttling, startup ও disruption মেপে দিন।",
);
add(
  "Helm",
  "Charts separate reusable Kubernetes templates from environment values. Rendered manifests are the real resources the API receives. Quote types carefully in YAML and avoid exposing secrets through values exports. A release can render correctly but still fail readiness, admission, or image access. Version the chart and image independently when their lifecycles differ.",
  "Chart template ও environment value আলাদা করে। শেষ manifest-ই API পায়। YAML type ও quote খেয়াল করুন, values-এ secret leak নয়। Render সফল হলেও readiness বা image fail হতে পারে।",
  `# values.yaml
replicaCount: 2
image:
  repository: your-registry/app
  tag: reviewed-version
service:
  port: 80
  targetPort: 8080
resources:
  requests: {cpu: "100m", memory: "128Mi"}`,
  "yaml",
  `helm lint ./chart
helm template api ./chart --values values.yaml > rendered.yaml
kubectl apply --dry-run=server -f rendered.yaml -n learning
helm list -n learning
helm history api -n learning
# Review the full chart templates and changes before upgrade/install.`,
  "bash",
  "Chart values alone are not a complete chart. Keep Chart.yaml and templates under review, and use a real secret provider instead of committed secret values.",
  "Values একা chart নয়। Chart.yaml ও template review করুন; secret-এর আসল provider নিন।",
);
add(
  "CI/CD Pipelines",
  "A delivery pipeline should identify source, resolve controlled inputs, build once, test relevant contracts, publish an artifact, and release with recovery evidence. Separate untrusted change validation from production credential use. A deployment success signal is only one boundary; smoke checks and observability verify the resulting user flow.",
  "Source, dependency, build, test, artifact ও recovery মিলে pipeline। Untrusted validation ও production secret আলাদা। Deployment success এক boundary; user flow smoke test ও metric দেখুন।",
  `set -euo pipefail
dotnet restore App.sln --locked-mode
dotnet build App.sln -c Release --no-restore
dotnet test App.sln -c Release --no-build
dotnet publish src/App/App.csproj -c Release --no-build -o artifacts/app
# Package/sign the reviewed artifact and retain its source commit identity.`,
  "bash",
  `record ReleaseEvidence(string Commit,bool TestsPassed,string ArtifactDigest);
var evidence=new ReleaseEvidence("reviewed-commit",true,"sha256:real-digest-required");
bool Ready(ReleaseEvidence r)=>r.TestsPassed&&!string.IsNullOrWhiteSpace(r.ArtifactDigest);
Console.WriteLine(Ready(evidence));
// Enforce real evidence in the pipeline; a boolean in a file is not trust.
// Production permissions belong only to protected release steps.`,
  "csharp",
  "Do not rebuild from floating dependencies at each environment promotion. Promote the same tested bytes and document which changes need data migration.",
  "প্রতি environment-এ বদলানো dependency দিয়ে আবার build নয়। একই tested bytes promote করুন ও migration আলাদা লিখুন।",
);
add(
  "GitHub Actions",
  "Workflow event choice, permissions, runner environment, actions, caches, and artifact boundaries all affect security and reproducibility. Pin executable actions to reviewed commits. Read-only validation should not receive deployment credentials. Pull-request workflows run contributor-controlled code and therefore require a stronger trust distinction than ordinary build scripts.",
  "Event, permission, runner, action ও artifact মিলে workflow। Executable action reviewed commit-এ pin করুন। Read-only test-এ deploy credential নয়। PR code contributor চালায়, তাই trust boundary আলাদা।",
  `name: Verify .NET
on: [push, pull_request]
permissions:
  contents: read
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683
      - run: dotnet --info
      - run: dotnet restore App.sln
      - run: dotnet build App.sln --no-restore -c Release
      - run: dotnet test App.sln --no-build -c Release`,
  "yaml",
  `git diff -- .github/workflows/verify.yml
git status --short
# Confirm the runner provides the required supported SDK.
# Add a reviewed pinned SDK setup action when the runner does not.
# Use protected environments for a separate production release job.
# Never expose production secrets to untrusted fork code.`,
  "bash",
  "The sample relies on an SDK already installed on the runner; verify that assumption or provision a pinned supported version.",
  "Runner-এ SDK আছে ধরে উদাহরণ। বাস্তবে যাচাই করুন বা pinned supported SDK setup দিন।",
);
add(
  "Terraform",
  "Terraform compares declared configuration with tracked state and provider observations. A saved plan captures proposed changes for review, but state can include sensitive values. Remote state locking and version constraints reduce concurrency and reproducibility problems. Replacement of a stateful resource is a data-migration decision, not an ordinary cosmetic diff.",
  "Terraform config, state ও provider-এর দেখা অবস্থা মেলায়। Plan review করা যায়, state-এ secret-ও থাকে। Remote lock ও version pin দরকার। Stateful resource replace মানে data migration-এর সিদ্ধান্ত।",
  `terraform {
  required_version = ">= 1.4.0"
}
variable "environment" {
  type = string
  default = "learning"
}
resource "terraform_data" "settings" {
  input = { environment = var.environment, replicas = 2 }
}
output "settings" {
  value = terraform_data.settings.output
}`,
  "hcl",
  `terraform fmt -check
terraform init
terraform validate
terraform plan -out=tfplan
terraform show tfplan
# Review before apply; protect state/plan files as potentially sensitive.`,
  "bash",
  "This local built-in resource teaches the lifecycle without provisioning a paid cloud resource. Add a real provider only with explicit account and target review.",
  "এই built-in local resource cloud খরচ করে না। আসল provider-এ account ও target review করে যান।",
);
add(
  "Ansible",
  "Idempotent modules describe a desired host state and report whether a change was required. Inventory selects targets; privilege escalation and connection settings define authority. Check mode estimates supported changes but cannot guarantee every task’s runtime behavior. Handlers coordinate dependent restarts so they happen only after meaningful changes.",
  "Idempotent module কাঙ্ক্ষিত state রাখে ও বদল লাগল কি না জানায়। Inventory target, privilege ক্ষমতা ঠিক করে। Check mode সব runtime অনুকরণ করে না। Handler দরকারি বদলের পরে restart করে।",
  `- name: Configure a disposable learning directory
  hosts: learning
  gather_facts: false
  tasks:
    - name: Create the directory
      ansible.builtin.file:
        path: /tmp/mastery-config
        state: directory
        mode: "0700"
    - name: Write non-secret sample configuration
      ansible.builtin.copy:
        dest: /tmp/mastery-config/app.conf
        content: "environment=learning\n"
        mode: "0600"`,
  "yaml",
  `ansible-inventory -i inventory.ini --list
ansible learning -i inventory.ini -m ping
ansible-playbook -i inventory.ini configure.yml --check --diff
ansible-playbook -i inventory.ini configure.yml
ansible-playbook -i inventory.ini configure.yml --check
# The second check should show convergence for supported tasks.`,
  "bash",
  "A shell task is not automatically idempotent. Prefer a module with explicit state and avoid diff output for tasks carrying secrets.",
  "Shell task নিজে idempotent নয়। State-সহ module নিন; secret task-এর diff log দেবেন না।",
);
add(
  "Nginx Reverse Proxy",
  "A reverse proxy forwards to an upstream while controlling connection and HTTP behavior. Correct host, forwarding headers, body limits, timeouts, buffering, and TLS settings matter. WebSocket upgrades and streaming may need different handling. The backend must trust forwarded information only from the actual approved proxy path.",
  "Proxy upstream-এ পাঠায়। Host, forwarded header, size, timeout ও TLS ঠিক দরকার। WebSocket/streaming-এ config ভিন্ন। Backend শুধু approved proxy-এর header বিশ্বাস করবে।",
  `server {
    listen 8080;
    server_name localhost;
    client_max_body_size 1m;
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 3s;
        proxy_read_timeout 30s;
    }
}`,
  "nginx",
  `nginx -t
curl --connect-timeout 2 --max-time 5 -i http://127.0.0.1:8080/health
curl --connect-timeout 2 --max-time 5 -i http://127.0.0.1:5000/health
# Compare proxy and upstream responses before altering application code.
# Add real TLS termination before internet production use.`,
  "bash",
  "The localhost HTTP sample is not a hardened public virtual host. Add domain/TLS validation and deliberate trust configuration for production.",
  "Local HTTP sample public production config নয়। Domain, TLS ও trust rule যোগ করুন।",
);
add(
  "Prometheus",
  "Prometheus time series are identified by metric names and complete label sets. Counters increase until reset; gauges represent current values; histograms summarize distributions. Rates must account for counter resets, while percentile calculations require the correct aggregation. Unbounded labels such as raw user IDs can overwhelm storage and query systems.",
  "Metric name ও সব label মিলে series। Counter বাড়ে, gauge বর্তমান মান, histogram distribution। Reset মাথায় রেখে rate; percentile-এ ঠিক aggregation। User id-এর অগণিত label resource শেষ করে।",
  `using System.Diagnostics.Metrics;
using var meter=new Meter("Mastery.Api");
var requests=meter.CreateCounter<long>("api.requests");
var duration=meter.CreateHistogram<double>("api.duration","ms");
requests.Add(1,new KeyValuePair<string,object?>("route","/products/{id}"));
duration.Record(42,new KeyValuePair<string,object?>("route","/products/{id}"));
Console.WriteLine("Measurements recorded; configure a listener/exporter.");`,
  "csharp",
  `# PromQL examples; adapt names to your exporter conventions.
rate(http_requests_total[5m])
sum by (route) (rate(http_requests_total[5m]))
histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))
# Verify units and labels; these queries require actual matching metrics.`,
  "promql",
  "A percentile is not an average, and averaging per-instance percentiles is generally invalid. Aggregate compatible histogram buckets first.",
  "Percentile average নয়। Instance-এর percentile গড় করলে সাধারণত ভুল; compatible bucket আগে যোগ করুন।",
);
add(
  "Grafana",
  "A useful dashboard begins with a diagnostic question and correct units. Panels should show traffic, latency, errors, saturation, and relevant deployment context. Query transformations can hide missing data or distort aggregation. Dashboards need controlled sharing because data sources can expose sensitive operational or tenant information.",
  "Dashboard প্রশ্ন ও unit দিয়ে শুরু। Traffic, latency, error, saturation ও deployment context দেখান। Transformation missing data লুকাতে পারে। Data source-এ sensitive তথ্য থাকলে sharing সীমিত রাখুন।",
  `{
  "title": "API overview",
  "schemaVersion": 39,
  "panels": [
    {
      "id": 1,
      "type": "timeseries",
      "title": "Request rate",
      "gridPos": {"h": 8, "w": 12, "x": 0, "y": 0},
      "targets": [{"expr": "sum(rate(http_requests_total[5m]))", "refId": "A"}]
    }
  ]
}`,
  "json",
  `# Validate the underlying PromQL in your configured data source.
sum(rate(http_requests_total[5m]))
sum(rate(http_requests_total{status=~"5.."}[5m]))
# Configure the imported panel's actual datasource UID.
# Add units, thresholds, and a runbook appropriate to the service SLO.`,
  "promql",
  "A dashboard import is only a starting point. Confirm actual data source, metric names, units, and permissions before trusting the panels.",
  "Import করলেই শেষ নয়। Data source, metric, unit ও permission মিলিয়ে panel বিশ্বাস করুন।",
);
add(
  "ELK Logging",
  "A log pipeline parses, enriches, ships, indexes, and retains events. Structured JSON reduces ambiguous text extraction, but mappings and field cardinality still need limits. Backpressure can delay or drop events; ingestion design should not block business requests indefinitely. Logs require retention and access controls because they can contain personal or operational data.",
  "Log pipeline parse, enrich, ship, index ও retain করে। JSON স্পষ্ট হলেও mapping ও field-এর সীমা দরকার। Backpressure-এ দেরি/হারানো হয়; business request অনন্ত আটকে নয়। Retention ও access দিন।",
  `var entry=new {
    Timestamp=DateTimeOffset.UtcNow,
    Level="Information",
    Event="OrderAccepted",
    OrderId=42,
    TraceId="demo-correlation"
};
Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(entry));
// Emit structured events to an approved collector, not raw secret payloads.`,
  "csharp",
  `input {
  stdin { codec => json }
}
filter {
  mutate { add_field => { "environment" => "learning" } }
}
output {
  stdout { codec => rubydebug }
}
# Logstash local parsing example; secure remote outputs separately.`,
  "logstash",
  "Do not use logs as the sole durable transaction ledger. Build an audit record with the necessary integrity and retention guarantees when that is required.",
  "Log-কে একমাত্র transaction ledger নয়। দরকারে integrity ও retention-সহ আলাদা audit record দিন।",
);
add(
  "Blue Green Deploys",
  "Blue/green releases keep a known environment serving while another is validated. Traffic switching is only safe when data schema, sessions, caches, and external contracts support the overlap. Rollback must point to a compatible retained version and include a decision window based on actual error/latency signals.",
  "পুরোনো পরিবেশ চলার সময় নতুনটি যাচাই হয়। Data schema, session ও cache overlap-এ compatible চাই। Rollback-এর version retained ও compatible হতে হবে; error/latency দেখে সিদ্ধান্ত নিন।",
  `record EnvironmentState(string Name,string Version,bool Healthy);
var blue=new EnvironmentState("blue","v1",true);
var green=new EnvironmentState("green","v2",false);
EnvironmentState active=blue;
if(green.Healthy)active=green;
Console.WriteLine(active);
green=green with {Healthy=true};
active=green;Console.WriteLine(active);
// Real traffic changes need a controlled gateway/platform operation.`,
  "csharp",
  `var stages=new[]{"Expand schema","Deploy compatible v2","Validate","Switch traffic","Observe","Contract later"};
foreach(string stage in stages)Console.WriteLine(stage);
bool safeRollback=true;
Console.WriteLine(safeRollback?"Retain v1 artifact and compatible schema":"Migration blocks rollback");
// Contract/destructive schema changes wait until the rollback window closes.`,
  "csharp",
  "Do not delete the old environment or old assets immediately after the first successful request. Observe a representative workload within the planned window.",
  "প্রথম success-এই পুরোনো environment/asset মুছবেন না। নির্ধারিত সময়ে প্রতিনিধি workload দেখুন।",
);
export default data;
