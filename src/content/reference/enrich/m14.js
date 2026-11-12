// Module 14 DevOps & CI/CD: easy story, plain theory, steps, mistakes, interview, 2028 tip, hands-on practice.
import { sh, file } from "./helpers";

export default {
  "Linux and Bash": {
    s: ["A kitchen helper who follows a written checklist every morning: wash, chop, boil, plate. A Bash script is that checklist for a computer, so routine work happens the same way every time.", "রান্নাঘরের সহকারী, যিনি প্রতিদিন সকালে লেখা checklist মানেন: ধোয়া, কাটা, সেদ্ধ, সাজানো। Bash script কম্পিউটারের জন্য সেই checklist, তাই নিয়মিত কাজ প্রতিবার একইভাবে হয়।"],
    t: ["DevOps automation starts with Bash: variables, conditionals, loops, functions, exit codes and pipes. Start scripts with set -euo pipefail so errors stop the script, quote variables, check required tools and inputs, and log what happens. Keep scripts idempotent so they can be re-run safely; move complex logic to a real language.", "DevOps automation Bash দিয়ে শুরু হয়: variable, শর্ত, loop, function, exit code ও pipe। Error-এ script থামাতে set -euo pipefail দিয়ে শুরু করুন, variable quote করুন, দরকারি tool ও input যাচাই করুন, আর কী ঘটছে log করুন। Script idempotent রাখুন যাতে নিরাপদে আবার চালানো যায়; জটিল যুক্তি আসল ভাষায় সরান।"],
    p: [["Start with #!/usr/bin/env bash and set -euo pipefail.", "#!/usr/bin/env bash ও set -euo pipefail দিয়ে শুরু করুন।"], ["Validate arguments and required commands.", "Argument ও দরকারি command যাচাই করুন।"], ["Use functions and clear log messages.", "Function ও স্পষ্ট log message ব্যবহার করুন।"], ["Run shellcheck and test on a clean machine/container.", "shellcheck চালান এবং পরিষ্কার machine/container-এ test করুন।"]],
    m: ["Unquoted variables breaking on spaces; ignoring exit codes; hard-coded paths and secrets; scripts that only work on the author's laptop.", "Quote ছাড়া variable space-এ ভাঙে; exit code উপেক্ষা; hard-coded path ও secret; শুধু লেখকের laptop-এ চলা script।"],
    q: ["Q: What does set -euo pipefail do? A: -e exits on errors, -u errors on undefined variables, -o pipefail makes a pipeline fail if any command in it fails.", "প্রশ্ন: set -euo pipefail কী করে? উত্তর: -e error-এ বের হয়, -u অসংজ্ঞায়িত variable-এ error দেয়, -o pipefail pipeline-এর কোনো command ব্যর্থ হলে পুরো pipeline ব্যর্থ করে।"],
    f: ["AI assistants write Bash quickly; shellcheck and running scripts in a disposable container are your safety net before trusting them in CI.", "AI assistant দ্রুত Bash লেখে; CI-তে বিশ্বাসের আগে shellcheck ও ফেলে দেওয়া container-এ script চালানো আপনার নিরাপত্তা জাল।"],
    x: [file("bash", "A safe, reusable deploy helper script · নিরাপদ deploy script", `#!/usr/bin/env bash
set -euo pipefail

log() { echo "[$(date +%H:%M:%S)] $*"; }
need() { command -v "$1" >/dev/null || { echo "missing: $1" >&2; exit 1; }; }

ENV="\${1:?usage: deploy.sh <dev|prod> <version>}"
VERSION="\${2:?usage: deploy.sh <dev|prod> <version>}"
[[ "$ENV" =~ ^(dev|prod)$ ]] || { echo "env must be dev or prod" >&2; exit 2; }
need kubectl; need curl

log "deploying shop-api:$VERSION to $ENV"
kubectl --context "$ENV" -n shop set image deploy/api api="ghcr.io/eftekher/shop-api:$VERSION"
kubectl --context "$ENV" -n shop rollout status deploy/api --timeout=5m
curl -fsS "https://$ENV.shop.example.com/health" >/dev/null && log "health check passed"
# ./deploy.sh dev 1.4.1`, `[10:00:01] deploying shop-api:1.4.1 to dev
deployment.apps/api image updated
deployment "api" successfully rolled out
[10:01:12] health check passed`, "Bash script")],
  },
  "Networking Basics": {
    s: ["Sending a letter: the address (IP), the flat number (port), the post office routes (routing), the directory that turns names into addresses (DNS), and the gate guard (firewall). Every network request follows these steps.", "চিঠি পাঠানো: ঠিকানা (IP), flat নম্বর (port), ডাকঘরের পথ (routing), নামকে ঠিকানায় রূপ দেওয়া directory (DNS), আর গেটের প্রহরী (firewall)। প্রতিটি network request এই ধাপ মানে।"],
    t: ["Key ideas: IP addresses and CIDR ranges (10.0.0.0/16), ports (443 HTTPS, 5432 Postgres), TCP (reliable) vs UDP (fast), DNS resolution, NAT, routing, firewalls/security groups, and TLS. Debug with ping, dig/nslookup, curl -v, nc -zv (port open?), traceroute and ss -tulpn (what is listening). Most 'it cannot connect' issues are DNS, firewall or wrong port.", "মূল ধারণা: IP ঠিকানা ও CIDR পরিসর (10.0.0.0/16), port (443 HTTPS, 5432 Postgres), TCP (নির্ভরযোগ্য) বনাম UDP (দ্রুত), DNS resolution, NAT, routing, firewall/security group ও TLS। ping, dig/nslookup, curl -v, nc -zv (port খোলা?), traceroute ও ss -tulpn (কে শুনছে) দিয়ে debug করুন। বেশিরভাগ 'যুক্ত হতে পারছে না' সমস্যা DNS, firewall বা ভুল port।"],
    p: [["Resolve the name: dig +short host.", "নাম resolve করুন: dig +short host।"], ["Check the port: nc -zv host 5432.", "Port দেখুন: nc -zv host 5432।"], ["Check the service is listening: ss -tulpn.", "Service শুনছে কি না: ss -tulpn।"], ["Test HTTP/TLS: curl -v https://host/health.", "HTTP/TLS পরীক্ষা: curl -v https://host/health।"]],
    m: ["Apps listening on 127.0.0.1 inside containers (unreachable from outside; bind 0.0.0.0); overlapping CIDR ranges between VPCs; forgetting DNS caching after changes.", "Container-এর ভিতরে 127.0.0.1-এ শোনা app (বাইরে থেকে পৌঁছানো যায় না; 0.0.0.0-এ bind করুন); VPC-র মধ্যে মিলে যাওয়া CIDR পরিসর; পরিবর্তনের পরে DNS caching ভুলে যাওয়া।"],
    q: ["Q: What happens when you type a URL in a browser? A: DNS resolves the name, TCP connects to the IP and port, TLS handshake verifies the certificate, the HTTP request is sent, the server responds, and the browser renders and fetches more resources.", "প্রশ্ন: Browser-এ URL টাইপ করলে কী হয়? উত্তর: DNS নাম resolve করে, TCP IP ও port-এ যুক্ত হয়, TLS handshake certificate যাচাই করে, HTTP request যায়, server উত্তর দেয়, আর browser দেখায় ও আরও resource আনে।"],
    f: ["Zero-trust networking (identity-based access instead of trusted networks) is the modern direction. Understanding the basics makes those tools make sense.", "Zero-trust networking (বিশ্বস্ত network-এর বদলে identity-ভিত্তিক access) আধুনিক দিক। মৌলিক বিষয় বুঝলে সেই tool বোঝা সহজ হয়।"],
    x: [sh("Debug 'cannot connect' step by step · 'যুক্ত হতে পারছে না' ধাপে ধাপে", `dig +short db.internal.example.com
nc -zv db.internal.example.com 5432
ss -tulpn | grep 8080
curl -sv https://api.example.com/health 2>&1 | grep -E "Connected to|SSL connection|HTTP/2 200"`, `10.20.64.15
Connection to db.internal.example.com (10.20.64.15) 5432 port [tcp/postgresql] succeeded!
tcp   LISTEN 0  512  0.0.0.0:8080  0.0.0.0:*  users:(("dotnet",pid=4242,fd=210))
* Connected to api.example.com (13.234.10.21) port 443
* SSL connection using TLSv1.3 / TLS_AES_128_GCM_SHA256
< HTTP/2 200`)],
  },
  "Git and GitHub": {
    s: ["A shared recipe book where every change is signed and dated, cooks propose changes on separate pages, and the head chef approves before they go into the main book. GitHub adds that review process on top of Git.", "শেয়ার করা recipe বই, যেখানে প্রতিটি পরিবর্তন স্বাক্ষর ও তারিখসহ, রাঁধুনিরা আলাদা পাতায় পরিবর্তন প্রস্তাব করেন, আর মূল বইয়ে যাওয়ার আগে প্রধান রাঁধুনি অনুমোদন দেন। GitHub Git-এর উপর সেই review প্রক্রিয়া যোগ করে।"],
    t: ["A DevOps-friendly GitHub setup: protected main branch (required reviews, required status checks, no force pushes), short-lived feature branches, pull request templates, CODEOWNERS for critical paths, Dependabot for updates, secret scanning and push protection, and conventional commit messages that drive changelogs. Every merge to main should be deployable.", "DevOps-বান্ধব GitHub ব্যবস্থা: সুরক্ষিত main branch (বাধ্যতামূলক review, বাধ্যতামূলক status check, force push নয়), স্বল্পায়ু feature branch, pull request template, গুরুত্বপূর্ণ path-এর জন্য CODEOWNERS, আপডেটের জন্য Dependabot, secret scanning ও push protection, আর changelog চালানো conventional commit message। Main-এ প্রতিটি merge deploy-যোগ্য হওয়া উচিত।"],
    p: [["Protect main with rulesets.", "Ruleset দিয়ে main রক্ষা করুন।"], ["Require CI checks and one review.", "CI check ও একটি review বাধ্যতামূলক করুন।"], ["Add CODEOWNERS and a PR template.", "CODEOWNERS ও PR template যোগ করুন।"], ["Enable Dependabot and secret scanning.", "Dependabot ও secret scanning চালু করুন।"]],
    m: ["Admins bypassing protections routinely; giant PRs nobody can review; long-lived release branches drifting from main; secrets in Actions logs.", "Admin-দের নিয়মিত সুরক্ষা এড়ানো; কেউ review করতে পারে না এমন বিশাল PR; main থেকে সরে যাওয়া দীর্ঘজীবী release branch; Actions log-এ secret।"],
    q: ["Q: What makes a good pull request? A: Small and focused, a clear description of why, tests included, screenshots for UI changes, linked issue, and green CI before review.", "প্রশ্ন: ভালো pull request কেমন? উত্তর: ছোট ও নির্দিষ্ট, কেন তার স্পষ্ট বিবরণ, test-সহ, UI পরিবর্তনে screenshot, যুক্ত issue, আর review-এর আগে সবুজ CI।"],
    f: ["AI coding agents open pull requests too. The same branch protections, required checks and human review keep their contributions safe.", "AI coding agent-ও pull request খোলে। একই branch সুরক্ষা, বাধ্যতামূলক check ও মানুষের review তাদের অবদান নিরাপদ রাখে।"],
    x: [file("markdown", "CODEOWNERS and pull request template · CODEOWNERS ও PR template", `# .github/CODEOWNERS
/infra/            @EFTEKHER/platform
/src/Payments/     @EFTEKHER/payments
*.tf               @EFTEKHER/platform

# .github/pull_request_template.md
## What and why
<!-- one paragraph: the problem and the solution -->

## How to test
- [ ] dotnet test passes
- [ ] tried locally / screenshots attached

## Risk
- [ ] DB migration (backward compatible?)
- [ ] feature flag used for risky changes
- [ ] AI-assisted: I reviewed every line`, undefined, "Repository configuration")],
  },
  "Docker": {
    s: ["Shipping goods in standard containers: any ship, train or truck can carry them without unpacking. Docker packages apps in standard containers that run the same on a laptop, CI server or cloud.", "মানক container-এ মাল পাঠানো: যেকোনো জাহাজ, ট্রেন বা truck খোলা ছাড়াই বহন করতে পারে। Docker app-কে মানক container-এ বাঁধে, যা laptop, CI server বা cloud-এ একইভাবে চলে।"],
    t: ["In a DevOps pipeline, Docker gives reproducible builds and identical artifacts across environments: build once, tag with the commit SHA, scan, push to a registry, then promote the same image from dev to staging to production by changing only configuration. Keep images small, non-root and pinned; use BuildKit caching in CI.", "DevOps pipeline-এ Docker পুনরাবৃত্তিযোগ্য build ও পরিবেশ জুড়ে একই artifact দেয়: একবার build, commit SHA দিয়ে tag, scan, registry-তে push, তারপর শুধু configuration বদলে একই image dev থেকে staging থেকে production-এ উন্নীত। Image ছোট, non-root ও নির্দিষ্ট রাখুন; CI-তে BuildKit caching ব্যবহার করুন।"],
    p: [["Write a multi-stage Dockerfile.", "Multi-stage Dockerfile লিখুন।"], ["Build in CI with cache and tag with the SHA.", "Cache-সহ CI-তে build করে SHA দিয়ে tag দিন।"], ["Scan the image and fail on critical issues.", "Image scan করে critical সমস্যায় ব্যর্থ করুন।"], ["Promote the same image across environments.", "একই image পরিবেশ জুড়ে উন্নীত করুন।"]],
    m: ["Rebuilding separately for each environment (not the same artifact); baking environment-specific config into images; latest tags in deployments.", "প্রতিটি পরিবেশে আলাদা rebuild (একই artifact নয়); image-এ পরিবেশ-নির্দিষ্ট config ঢোকানো; deployment-এ latest tag।"],
    q: ["Q: Why 'build once, deploy many'? A: The exact artifact tested in staging is what runs in production, eliminating 'works on staging' differences caused by rebuilds.", "প্রশ্ন: কেন 'একবার build, বহুবার deploy'? উত্তর: Staging-এ test করা হুবহু artifact-ই production-এ চলে, rebuild-জনিত 'staging-এ চলে' পার্থক্য দূর করে।"],
    f: ["Container images are also how AI models and inference servers are shipped. The same build-once, scan, promote discipline applies.", "AI model ও inference server-ও container image হিসেবে পাঠানো হয়। একই build-once, scan, promote শৃঙ্খলা প্রযোজ্য।"],
    x: [sh("Build once with cache, tag with SHA, scan · cache-সহ build, SHA tag, scan", `SHA=$(git rev-parse --short HEAD)
docker buildx build --cache-from type=gha --cache-to type=gha,mode=max \\
  -t ghcr.io/eftekher/shop-api:sha-$SHA --push .
trivy image --exit-code 1 --severity CRITICAL ghcr.io/eftekher/shop-api:sha-$SHA
echo "promote sha-$SHA to staging, then prod (same image, different config)"`, `#12 exporting to image
#12 pushing layers 2.1s done
#12 pushing manifest for ghcr.io/eftekher/shop-api:sha-7c9e2d1 done
Total: 0 (CRITICAL: 0)
promote sha-7c9e2d1 to staging, then prod (same image, different config)`)],
  },
  "Docker Compose": {
    s: ["A one-page plan for a picnic listing who brings what and when to arrive, so the whole group shows up ready. Compose describes all your app's services in one file.", "পিকনিকের এক পাতার পরিকল্পনা, কে কী আনবে আর কখন আসবে লেখা, যাতে পুরো দল প্রস্তুত হয়ে আসে। Compose আপনার app-এর সব service এক file-এ বর্ণনা করে।"],
    t: ["In DevOps, Compose provides consistent local environments and CI integration-test environments: start dependencies (Postgres, Redis, RabbitMQ) with health checks, run tests against them, and tear them down. Use profiles for optional services, override files for CI, and a .env file for local variables. For production, use orchestrators (ECS, Kubernetes).", "DevOps-এ Compose সামঞ্জস্যপূর্ণ local পরিবেশ ও CI integration-test পরিবেশ দেয়: health check-সহ dependency (Postgres, Redis, RabbitMQ) চালু, সেগুলোর বিরুদ্ধে test, তারপর বন্ধ। ঐচ্ছিক service-এর জন্য profile, CI-এর জন্য override file আর local variable-এর জন্য .env file ব্যবহার করুন। Production-এ orchestrator (ECS, Kubernetes) দিন।"],
    p: [["Define dependencies with health checks.", "Health check-সহ dependency সংজ্ঞায়িত করুন।"], ["Start them in CI: docker compose up -d --wait.", "CI-তে চালু করুন: docker compose up -d --wait।"], ["Run integration tests.", "Integration test চালান।"], ["Always tear down: docker compose down -v.", "সবসময় বন্ধ করুন: docker compose down -v।"]],
    m: ["Tests starting before databases are ready; fixed host ports clashing on CI runners; leaving containers running between CI jobs.", "Database প্রস্তুতের আগে test শুরু; CI runner-এ নির্দিষ্ট host port-এর সংঘাত; CI job-এর মাঝে container চালু রেখে দেওয়া।"],
    q: ["Q: How do you make integration tests reliable in CI? A: Health checks plus --wait, isolated project names per run, migrations applied before tests, and teardown with -v.", "প্রশ্ন: CI-তে integration test কীভাবে নির্ভরযোগ্য করবেন? উত্তর: Health check ও --wait, run-প্রতি আলাদা project নাম, test-এর আগে migration, আর -v দিয়ে বন্ধ।"],
    f: ["A compose file with your API, pgvector, Redis and a local model gives every developer an AI-ready environment in one command.", "আপনার API, pgvector, Redis ও local model-সহ একটি compose file প্রতিটি developer-কে এক command-এ AI-প্রস্তুত পরিবেশ দেয়।"],
    x: [sh("Integration tests against real dependencies in CI · CI-তে আসল dependency", `docker compose -p ci-$GITHUB_RUN_ID -f compose.yaml -f compose.ci.yaml up -d --wait db cache
dotnet test tests/Shop.IntegrationTests --logger "console;verbosity=minimal"
docker compose -p ci-$GITHUB_RUN_ID down -v`, ` ✔ Container ci-1042-db-1     Healthy
 ✔ Container ci-1042-cache-1  Started
Passed!  - Failed: 0, Passed: 38, Skipped: 0, Total: 38
 ✔ Container ci-1042-db-1     Removed
 ✔ Volume ci-1042_pgdata      Removed`)],
  },
  "Kubernetes": {
    s: ["An airport control tower that decides where each plane parks, sends replacement planes when one breaks, and adds flights when demand rises. Kubernetes is the control tower for containers.", "বিমানবন্দরের control tower, যা ঠিক করে প্রতিটি বিমান কোথায় থামবে, একটি নষ্ট হলে বদলি পাঠায়, চাহিদা বাড়লে ফ্লাইট বাড়ায়। Kubernetes container-এর control tower।"],
    t: ["From a DevOps view, Kubernetes provides declarative deployments, self-healing, service discovery, autoscaling and rolling updates. You manage YAML (often via Helm or Kustomize) in Git, deploy with GitOps, observe with Prometheus/Grafana, and secure with RBAC, NetworkPolicies, Pod Security Standards and image policies.", "DevOps দৃষ্টিতে Kubernetes declarative deployment, স্ব-নিরাময়, service discovery, autoscaling ও rolling update দেয়। আপনি Git-এ YAML পরিচালনা করেন (প্রায়ই Helm বা Kustomize দিয়ে), GitOps দিয়ে deploy, Prometheus/Grafana দিয়ে পর্যবেক্ষণ, আর RBAC, NetworkPolicy, Pod Security Standard ও image policy দিয়ে সুরক্ষা।"],
    p: [["Containerise the app with health endpoints.", "Health endpoint-সহ app container-এ রূপ দিন।"], ["Write Deployment, Service and Ingress manifests.", "Deployment, Service ও Ingress manifest লিখুন।"], ["Package with Helm/Kustomize per environment.", "পরিবেশ অনুযায়ী Helm/Kustomize দিয়ে package করুন।"], ["Deploy through GitOps and monitor.", "GitOps দিয়ে deploy করে পর্যবেক্ষণ করুন।"]],
    m: ["Adopting Kubernetes before you need it; no resource requests/limits; no readiness probes; secrets as plain ConfigMaps.", "দরকারের আগে Kubernetes গ্রহণ; resource request/limit নেই; readiness probe নেই; সাধারণ ConfigMap হিসেবে secret।"],
    q: ["Q: Liveness vs readiness probe? A: Readiness decides whether a pod receives traffic; liveness decides whether Kubernetes restarts it. A failing dependency should affect readiness, not liveness.", "প্রশ্ন: Liveness বনাম readiness probe? উত্তর: Readiness ঠিক করে pod traffic পাবে কি না; liveness ঠিক করে Kubernetes restart করবে কি না। ব্যর্থ dependency readiness-কে প্রভাবিত করা উচিত, liveness নয়।"],
    f: ["Platform engineering teams build internal developer platforms on Kubernetes so app teams (and AI agents) can deploy safely through templates and guardrails.", "Platform engineering দল Kubernetes-এর উপর ভিতরের developer platform বানায়, যাতে app দল (ও AI agent) template ও সুরক্ষা দিয়ে নিরাপদে deploy করতে পারে।"],
    x: [file("yaml", "Kustomize overlay for production · production-এর জন্য Kustomize", `# k8s/base/kustomization.yaml
resources: [deployment.yaml, service.yaml]

# k8s/overlays/prod/kustomization.yaml
resources: [../../base]
namespace: shop
images:
  - name: ghcr.io/eftekher/shop-api
    newTag: sha-7c9e2d1
replicas:
  - name: api
    count: 4
patches:
  - target: { kind: Deployment, name: api }
    patch: |-
      - op: replace
        path: /spec/template/spec/containers/0/resources/limits/memory
        value: 512Mi
# kubectl kustomize k8s/overlays/prod | kubectl diff -f -`, undefined, "Kustomize configuration")],
  },
  "Helm": {
    s: ["A furniture kit with instructions and options: choose colour and size on the order form, and the same kit produces your custom wardrobe. Helm charts are templated Kubernetes packages with values you choose.", "নির্দেশনা ও বিকল্পসহ আসবাবের kit: অর্ডার form-এ রং ও আকার বাছুন, একই kit আপনার নিজস্ব আলমারি বানায়। Helm chart হলো আপনার বাছা value-সহ template-যুক্ত Kubernetes package।"],
    t: ["A chart contains templates (Go templating), default values.yaml and metadata. helm install/upgrade renders templates with values (per environment files) and tracks releases with history, enabling helm rollback. Use helm template and helm lint in CI, pin chart versions, store charts in OCI registries, and keep logic in templates simple.", "Chart-এ template (Go templating), ডিফল্ট values.yaml ও metadata থাকে। helm install/upgrade value দিয়ে template render করে (পরিবেশ-ভিত্তিক file) এবং ইতিহাসসহ release track করে, helm rollback সম্ভব করে। CI-তে helm template ও helm lint দিন, chart version নির্দিষ্ট করুন, OCI registry-তে chart রাখুন, আর template-এর যুক্তি সহজ রাখুন।"],
    p: [["Create a chart: helm create shop-api.", "Chart বানান: helm create shop-api।"], ["Move environment differences into values-dev.yaml / values-prod.yaml.", "পরিবেশের পার্থক্য values-dev.yaml / values-prod.yaml-এ সরান।"], ["Validate: helm lint and helm template | kubectl apply --dry-run=server -f -.", "যাচাই: helm lint ও helm template | kubectl apply --dry-run=server -f -।"], ["Deploy: helm upgrade --install with --atomic.", "Deploy: --atomic-সহ helm upgrade --install।"]],
    m: ["Overly clever templates nobody can read; secrets in values files committed to Git; not using --atomic, leaving half-failed releases.", "কেউ পড়তে পারে না এমন অতি-চতুর template; Git-এ commit করা values file-এ secret; --atomic না দেওয়ায় অর্ধেক-ব্যর্থ release থেকে যাওয়া।"],
    q: ["Q: helm upgrade --install --atomic: why --atomic? A: If the upgrade fails (pods not ready within the timeout), Helm automatically rolls back to the previous release.", "প্রশ্ন: helm upgrade --install --atomic: কেন --atomic? উত্তর: আপগ্রেড ব্যর্থ হলে (timeout-এর মধ্যে pod প্রস্তুত না হলে) Helm স্বয়ংক্রিয়ভাবে আগের release-এ ফেরে।"],
    f: ["Most third-party software (Prometheus, ingress controllers, vector databases) ships as Helm charts; reading and customising charts is an everyday platform skill.", "বেশিরভাগ third-party software (Prometheus, ingress controller, vector database) Helm chart হিসেবে আসে; chart পড়া ও সাজানো প্রতিদিনের platform দক্ষতা।"],
    x: [sh("Lint, render and deploy atomically · lint, render ও atomic deploy", `helm lint charts/shop-api -f charts/shop-api/values-prod.yaml
helm upgrade --install shop-api charts/shop-api -n shop \\
  -f charts/shop-api/values-prod.yaml --set image.tag=sha-7c9e2d1 --atomic --timeout 5m
helm history shop-api -n shop --max 3`, `==> Linting charts/shop-api
1 chart(s) linted, 0 chart(s) failed
Release "shop-api" has been upgraded. Happy Helming!
REVISION  STATUS      CHART           APP VERSION  DESCRIPTION
11        superseded  shop-api-0.9.0  1.4.0        Upgrade complete
12        deployed    shop-api-0.9.1  1.4.1        Upgrade complete`)],
  },
  "CI/CD Pipelines": {
    s: ["A car factory assembly line: every car passes the same stations (welding, painting, testing) in order, and a car that fails inspection never leaves the factory. A CI/CD pipeline is the assembly line for code.", "গাড়ির কারখানার assembly line: প্রতিটি গাড়ি ক্রমানুসারে একই স্টেশন পার হয় (welding, রং, পরীক্ষা), আর পরিদর্শনে ব্যর্থ গাড়ি কখনো কারখানা ছাড়ে না। CI/CD pipeline হলো code-এর assembly line।"],
    t: ["Continuous integration builds and tests every change automatically (restore, build, unit tests, linters, security scans). Continuous delivery packages a versioned artifact and deploys it to environments, with automated checks and approvals for production. Good pipelines are fast (<10 minutes), reliable (no flaky tests), secure (least-privilege, OIDC) and give quick feedback.", "Continuous integration প্রতিটি পরিবর্তন স্বয়ংক্রিয়ভাবে build ও test করে (restore, build, unit test, linter, security scan)। Continuous delivery version-যুক্ত artifact package করে পরিবেশে deploy করে, production-এ স্বয়ংক্রিয় পরীক্ষা ও অনুমোদনসহ। ভালো pipeline দ্রুত (<১০ মিনিট), নির্ভরযোগ্য (flaky test নেই), নিরাপদ (least-privilege, OIDC) এবং দ্রুত প্রতিক্রিয়া দেয়।"],
    p: [["Stage 1 CI: build, test, lint, scan on every PR.", "Stage 1 CI: প্রতি PR-এ build, test, lint, scan।"], ["Stage 2: build and push the image on main.", "Stage 2: main-এ image build ও push।"], ["Stage 3: deploy to staging automatically and run smoke tests.", "Stage 3: স্বয়ংক্রিয়ভাবে staging-এ deploy করে smoke test চালান।"], ["Stage 4: production with approval or progressive rollout.", "Stage 4: অনুমোদন বা ধাপে ধাপে rollout-সহ production।"]],
    m: ["Slow pipelines people bypass; flaky tests that get ignored; deploying from laptops; storing cloud keys as long-lived CI secrets.", "মানুষ এড়িয়ে যায় এমন ধীর pipeline; উপেক্ষিত flaky test; laptop থেকে deploy; দীর্ঘস্থায়ী CI secret হিসেবে cloud key রাখা।"],
    q: ["Q: Continuous delivery vs continuous deployment? A: Delivery: every change is ready to deploy, with a manual approval to production. Deployment: every change that passes the pipeline goes to production automatically.", "প্রশ্ন: Continuous delivery বনাম continuous deployment? উত্তর: Delivery: প্রতিটি পরিবর্তন deploy-এর জন্য প্রস্তুত, production-এ হাতে অনুমোদন। Deployment: pipeline পার হওয়া প্রতিটি পরিবর্তন স্বয়ংক্রিয়ভাবে production-এ যায়।"],
    f: ["Add AI eval gates to pipelines for AI features: if the eval score drops, the deployment stops, just like a failing unit test.", "AI feature-এর pipeline-এ AI eval gate দিন: eval score কমলে deployment থামে, ব্যর্থ unit test-এর মতোই।"],
    x: [file("markdown", "Pipeline stages and quality gates · pipeline-এর ধাপ ও মানের gate", "```mermaid\nflowchart LR\n  PR[Pull request] --> CI[Build + unit tests + lint]\n  CI --> SEC[SAST + dependency scan]\n  SEC --> MERGE{Review + green checks}\n  MERGE --> IMG[Build image sha-xxxx + scan + push]\n  IMG --> STG[Deploy staging + smoke tests + AI evals]\n  STG --> APPROVE{Approval or canary metrics OK}\n  APPROVE --> PROD[Deploy production]\n  PROD --> MON[Monitor SLOs; auto-rollback on alerts]\n```", undefined, "Pipeline diagram")],
  },
  "GitHub Actions": {
    s: ["A robot assistant in your GitHub repository that wakes up when something happens (a push, a pull request) and follows your written instructions. GitHub Actions runs workflows on events.", "আপনার GitHub repository-তে একজন robot সহকারী, যে কিছু ঘটলে (push, pull request) জেগে ওঠে এবং আপনার লেখা নির্দেশনা মানে। GitHub Actions event-এ workflow চালায়।"],
    t: ["Workflows (.github/workflows/*.yml) define triggers (on: push, pull_request, schedule, workflow_dispatch), jobs that run on runners, and steps using actions (actions/checkout, setup-dotnet) or shell commands. Use caching, matrix builds, environments with protection rules, OIDC for cloud access, least-privilege permissions, and pin third-party actions to commit SHAs.", "Workflow (.github/workflows/*.yml) trigger (on: push, pull_request, schedule, workflow_dispatch), runner-এ চলা job আর action (actions/checkout, setup-dotnet) বা shell command-সহ step সংজ্ঞায়িত করে। Caching, matrix build, সুরক্ষা নিয়মসহ environment, cloud access-এ OIDC, least-privilege অনুমতি ব্যবহার করুন, আর third-party action commit SHA-তে নির্দিষ্ট করুন।"],
    p: [["Create .github/workflows/ci.yml for PRs.", "PR-এর জন্য .github/workflows/ci.yml বানান।"], ["Set permissions: contents: read by default.", "Permission দিন: ডিফল্ট contents: read।"], ["Cache NuGet packages.", "NuGet package cache করুন।"], ["Add a deploy job with environment protection and OIDC.", "Environment সুরক্ষা ও OIDC-সহ deploy job যোগ করুন।"]],
    m: ["pull_request_target workflows that run untrusted code with secrets; unpinned third-party actions; write-all permissions; printing secrets in logs.", "Secret-সহ অবিশ্বস্ত code চালানো pull_request_target workflow; নির্দিষ্ট না করা third-party action; write-all অনুমতি; log-এ secret print।"],
    q: ["Q: How do you deploy to AWS from Actions without storing keys? A: permissions: id-token: write, then aws-actions/configure-aws-credentials with role-to-assume (OIDC trust on the IAM role).", "প্রশ্ন: Key না রেখে Actions থেকে AWS-এ কীভাবে deploy করবেন? উত্তর: permissions: id-token: write, তারপর role-to-assume-সহ aws-actions/configure-aws-credentials (IAM role-এ OIDC trust)।"],
    f: ["AI coding agents can run inside Actions (triggered by issues or comments). Treat them like any workflow: limited permissions and human-reviewed PRs.", "AI coding agent Actions-এর ভিতরে চলতে পারে (issue বা comment দিয়ে চালু)। যেকোনো workflow-এর মতো দেখুন: সীমিত অনুমতি ও মানুষের review করা PR।"],
    x: [file("yaml", "CI + deploy workflow for a .NET API · .NET API-র CI ও deploy", `name: ci-cd
on:
  pull_request:
  push: { branches: [main] }
permissions: { contents: read }
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with: { dotnet-version: "9.0.x", cache: true, cache-dependency-path: "**/packages.lock.json" }
      - run: dotnet restore --locked-mode
      - run: dotnet build --no-restore -c Release
      - run: dotnet test --no-build -c Release --logger "trx" --collect "XPlat Code Coverage"
  deploy:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    environment: production            # protection rules: required reviewers
    permissions: { contents: read, id-token: write, packages: write }
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with: { role-to-assume: arn:aws:iam::123456789012:role/gh-deploy, aws-region: ap-south-1 }
      - run: ./scripts/deploy.sh prod sha-\${GITHUB_SHA::7}`, undefined, "GitHub Actions workflow")],
  },
  "AWS Cloud": {
    s: ["Renting electricity from the grid instead of building your own power plant: you pay for what you use and scale up instantly. AWS rents computing, storage and services the same way.", "নিজের বিদ্যুৎকেন্দ্র না বানিয়ে grid থেকে বিদ্যুৎ নেওয়া: যা ব্যবহার করেন তার টাকা দেন এবং সাথে সাথে বাড়ান। AWS একইভাবে computing, storage ও service ভাড়া দেয়।"],
    t: ["A DevOps-ready AWS setup uses multiple accounts (dev, staging, prod) under AWS Organizations, SSO for people, roles for CI, infrastructure as code (Terraform/CDK), tagging for cost, CloudTrail and Config for audit, budgets and alerts, and a standard network (VPC with private subnets). The Well-Architected Framework (security, reliability, performance, cost, operations, sustainability) guides reviews.", "DevOps-প্রস্তুত AWS ব্যবস্থা AWS Organizations-এর অধীনে একাধিক account (dev, staging, prod), মানুষের জন্য SSO, CI-এর জন্য role, infrastructure as code (Terraform/CDK), খরচের জন্য tagging, audit-এর জন্য CloudTrail ও Config, budget ও alert, আর একটি মানক network (private subnet-সহ VPC) ব্যবহার করে। Well-Architected Framework (নিরাপত্তা, নির্ভরযোগ্যতা, performance, খরচ, পরিচালনা, টেকসইতা) review-এ পথ দেখায়।"],
    p: [["Separate accounts per environment.", "পরিবেশ অনুযায়ী আলাদা account।"], ["Use SSO for people and OIDC roles for CI.", "মানুষের জন্য SSO ও CI-এর জন্য OIDC role।"], ["Define everything in IaC and tag resources.", "সব IaC-তে সংজ্ঞায়িত করে resource-এ tag দিন।"], ["Set budgets, alerts and audit logging.", "Budget, alert ও audit logging ঠিক করুন।"]],
    m: ["Everything in one account; click-ops changes nobody can reproduce; no budget alerts; root account used daily.", "সব একটি account-এ; কেউ পুনরাবৃত্তি করতে পারে না এমন click-ops পরিবর্তন; budget alert নেই; প্রতিদিন root account ব্যবহার।"],
    q: ["Q: Why use separate AWS accounts for dev and prod? A: Strong isolation of permissions, blast radius, quotas and billing; a mistake in dev cannot touch production.", "প্রশ্ন: Dev ও prod-এর জন্য আলাদা AWS account কেন? উত্তর: অনুমতি, ক্ষতির পরিধি, quota ও billing-এর শক্তিশালী বিচ্ছিন্নতা; dev-এর ভুল production ছুঁতে পারে না।"],
    f: ["Managed AI services (Bedrock) sit inside the same account structure, so account boundaries, IAM and budgets also govern AI usage.", "Managed AI service (Bedrock) একই account কাঠামোর ভিতরে থাকে, তাই account-এর সীমা, IAM ও budget AI ব্যবহারও নিয়ন্ত্রণ করে।"],
    x: [sh("Budget alert so surprises never happen · অপ্রত্যাশিত খরচ এড়াতে budget alert", `aws budgets create-budget --account-id 123456789012 --budget '{
  "BudgetName": "shop-dev-monthly", "BudgetLimit": {"Amount": "50", "Unit": "USD"},
  "TimeUnit": "MONTHLY", "BudgetType": "COST"}' --notifications-with-subscribers '[{
  "Notification": {"NotificationType": "ACTUAL", "ComparisonOperator": "GREATER_THAN", "Threshold": 80},
  "Subscribers": [{"SubscriptionType": "EMAIL", "Address": "team@example.com"}]}]'
aws ce get-cost-and-usage --time-period Start=2026-11-01,End=2026-11-12 --granularity MONTHLY \\
  --metrics UnblendedCost --group-by Type=TAG,Key=service --query 'ResultsByTime[0].Groups[].[Keys[0],Metrics.UnblendedCost.Amount]' --output text`, `service$shop-api	11.42
service$shop-db	18.10
service$ai-gateway	9.87`)],
  },
  "Terraform": {
    s: ["A shopping list that you hand to a helper: they check what is already in the fridge and buy only what is missing. Terraform compares your desired infrastructure with what exists and changes only the difference.", "সহকারীকে দেওয়া বাজারের তালিকা: তিনি ফ্রিজে কী আছে দেখে শুধু যা নেই তাই কেনেন। Terraform আপনার কাঙ্ক্ষিত infrastructure-এর সাথে বিদ্যমানটা তুলনা করে শুধু পার্থক্যটুকু বদলায়।"],
    t: ["Terraform uses HCL to declare resources across providers (AWS, Azure, Kubernetes, GitHub). terraform plan shows the changes; apply executes them; state records what exists (store it remotely with locking, e.g., S3 + DynamoDB or Terraform Cloud). Use modules for reuse, variables per environment, and run plan in CI on pull requests.", "Terraform HCL দিয়ে provider জুড়ে resource ঘোষণা করে (AWS, Azure, Kubernetes, GitHub)। terraform plan পরিবর্তন দেখায়; apply সেগুলো চালায়; state কী আছে তা লেখে (locking-সহ দূরে রাখুন, যেমন S3 + DynamoDB বা Terraform Cloud)। পুনর্ব্যবহারে module, পরিবেশ অনুযায়ী variable দিন, আর pull request-এ CI-তে plan চালান।"],
    p: [["Write resources and variables in .tf files.", ".tf file-এ resource ও variable লিখুন।"], ["Configure a remote backend with locking.", "Locking-সহ remote backend ঠিক করুন।"], ["terraform plan in CI; review the plan in the PR.", "CI-তে terraform plan; PR-এ plan review করুন।"], ["terraform apply on merge with a deploy role.", "Merge-এ deploy role দিয়ে terraform apply।"]],
    m: ["Local state files lost or committed to Git; applying without reviewing the plan; manual console changes causing drift; secrets in state without encryption.", "Local state file হারানো বা Git-এ commit; plan review না করে apply; console-এ হাতে পরিবর্তনে drift; encryption ছাড়া state-এ secret।"],
    q: ["Q: What is Terraform state and why lock it? A: State maps your configuration to real resource IDs; locking prevents two people or pipelines from applying at the same time and corrupting it.", "প্রশ্ন: Terraform state কী এবং কেন lock করবেন? উত্তর: State আপনার configuration-কে আসল resource ID-র সাথে মেলায়; locking দুজন মানুষ বা pipeline-কে একসাথে apply করে তা নষ্ট করা থেকে আটকায়।"],
    f: ["Policy as code (OPA, Sentinel, Checkov) checks Terraform plans automatically, which matters more as AI generates more infrastructure code.", "Policy as code (OPA, Sentinel, Checkov) স্বয়ংক্রিয়ভাবে Terraform plan যাচাই করে, যা আরও গুরুত্বপূর্ণ যখন AI বেশি infrastructure code তৈরি করে।"],
    x: [file("hcl", "S3 bucket + SQS queue with remote state · remote state-সহ S3 ও SQS", `terraform {
  required_providers { aws = { source = "hashicorp/aws", version = "~> 6.0" } }
  backend "s3" {
    bucket       = "shop-terraform-state"
    key          = "shop/dev/terraform.tfstate"
    region       = "ap-south-1"
    use_lockfile = true          # state locking
    encrypt      = true
  }
}

variable "env" { type = string }

resource "aws_s3_bucket" "invoices" {
  bucket = "shop-invoices-\${var.env}"
  tags   = { service = "shop-api", env = var.env }
}

resource "aws_sqs_queue" "orders_dlq" { name = "orders-dlq-\${var.env}" }
resource "aws_sqs_queue" "orders" {
  name                       = "orders-\${var.env}"
  visibility_timeout_seconds = 120
  redrive_policy = jsonencode({ deadLetterTargetArn = aws_sqs_queue.orders_dlq.arn, maxReceiveCount = 5 })
}

output "queue_url" { value = aws_sqs_queue.orders.url }
# terraform init && terraform plan -var env=dev   ->   Plan: 3 to add, 0 to change, 0 to destroy.`, undefined, "Terraform configuration")],
  },
  "Ansible": {
    s: ["A head teacher sending the same checklist to 50 classrooms at once: 'turn off fans, close windows, lock doors'. Each class reports back done or failed. Ansible runs the same configuration steps on many servers over SSH.", "প্রধান শিক্ষক একসাথে ৫০টি classroom-এ একই checklist পাঠান: 'পাখা বন্ধ, জানালা বন্ধ, দরজা তালা'। প্রতিটি class জানায় হয়েছে নাকি ব্যর্থ। Ansible SSH দিয়ে অনেক server-এ একই configuration ধাপ চালায়।"],
    t: ["Ansible is agentless configuration management: an inventory lists hosts, playbooks (YAML) contain tasks using modules (apt, copy, template, service, user), and handlers restart services when configs change. Modules are idempotent: running twice makes no extra changes. Use roles for structure, ansible-vault for secrets, and --check --diff for dry runs.", "Ansible agentless configuration management: inventory host-এর তালিকা দেয়, playbook (YAML)-এ module (apt, copy, template, service, user) ব্যবহার করা task থাকে, আর config বদলালে handler service restart করে। Module idempotent: দুবার চালালে বাড়তি পরিবর্তন হয় না। কাঠামোর জন্য role, secret-এর জন্য ansible-vault, আর dry run-এ --check --diff দিন।"],
    p: [["Write an inventory of servers.", "Server-এর inventory লিখুন।"], ["Write a playbook with idempotent modules.", "Idempotent module-সহ playbook লিখুন।"], ["Dry run with --check --diff.", "--check --diff দিয়ে dry run করুন।"], ["Run for real and re-run to confirm 'changed=0'.", "আসলে চালিয়ে আবার চালান, 'changed=0' নিশ্চিত করুন।"]],
    m: ["Using shell/command modules for everything (not idempotent); plain-text secrets in playbooks; running against all hosts without --limit while testing.", "সবকিছুতে shell/command module (idempotent নয়); playbook-এ সাধারণ লেখায় secret; test-এর সময় --limit ছাড়া সব host-এ চালানো।"],
    q: ["Q: Terraform vs Ansible? A: Terraform provisions infrastructure (create servers, networks, databases); Ansible configures what runs on servers (packages, files, services). They complement each other.", "প্রশ্ন: Terraform বনাম Ansible? উত্তর: Terraform infrastructure তৈরি করে (server, network, database); Ansible server-এ কী চলে configure করে (package, file, service)। একে অপরের পরিপূরক।"],
    f: ["With containers and immutable images, Ansible is used less for apps but remains common for VMs, network devices and on-prem servers, still common in Bangladeshi enterprises.", "Container ও অপরিবর্তনীয় image-এর যুগে app-এ Ansible কম ব্যবহৃত হয়, কিন্তু VM, network device ও on-prem server-এ প্রচলিত থাকে, যা বাংলাদেশি enterprise-এ এখনো সাধারণ।"],
    x: [file("yaml", "Playbook: install Nginx and deploy config idempotently · Nginx playbook", `# inventory.ini
# [web]
# web1.example.com
# web2.example.com

- name: Configure web servers
  hosts: web
  become: true
  tasks:
    - name: Install nginx
      ansible.builtin.apt: { name: nginx, state: present, update_cache: true }
    - name: Deploy site config
      ansible.builtin.template: { src: shop.conf.j2, dest: /etc/nginx/sites-enabled/shop.conf, mode: "0644" }
      notify: Reload nginx
    - name: Ensure nginx is running
      ansible.builtin.service: { name: nginx, state: started, enabled: true }
  handlers:
    - name: Reload nginx
      ansible.builtin.service: { name: nginx, state: reloaded }
# ansible-playbook -i inventory.ini site.yml --check --diff
# second real run: web1 ok=4 changed=0   web2 ok=4 changed=0`, undefined, "Ansible playbook")],
  },
  "Nginx Reverse Proxy": {
    s: ["A receptionist who receives every visitor at the building entrance, checks them, and walks them to the right office, so visitors never wander the corridors. Nginx as a reverse proxy sits in front of your apps.", "অভ্যর্থনাকারী, যিনি ভবনের প্রবেশপথে প্রতিটি দর্শনার্থীকে নেন, যাচাই করেন এবং সঠিক অফিসে নিয়ে যান, তাই দর্শনার্থীরা করিডোরে ঘোরেন না। Reverse proxy হিসেবে Nginx আপনার app-এর সামনে বসে।"],
    t: ["Nginx terminates TLS, serves static files, compresses responses, buffers slow clients, routes by host/path to upstream apps (Kestrel), load-balances between upstreams, and adds headers and rate limits. Forward X-Forwarded-For/Proto so ASP.NET Core knows the real client IP and scheme (UseForwardedHeaders). Configure timeouts and body size limits.", "Nginx TLS শেষ করে, static file দেয়, response compress করে, ধীর client buffer করে, host/path অনুযায়ী upstream app-এ (Kestrel) পাঠায়, upstream-এর মধ্যে load-balance করে এবং header ও rate limit যোগ করে। X-Forwarded-For/Proto এগিয়ে দিন যাতে ASP.NET Core আসল client IP ও scheme জানে (UseForwardedHeaders)। Timeout ও body-আকারের সীমা ঠিক করুন।"],
    p: [["Run your app on localhost:5000 (Kestrel).", "আপনার app localhost:5000-এ চালান (Kestrel)।"], ["Write a server block with proxy_pass and forwarded headers.", "proxy_pass ও forwarded header-সহ server block লিখুন।"], ["Add TLS (certbot) and HTTP->HTTPS redirect.", "TLS (certbot) ও HTTP->HTTPS redirect যোগ করুন।"], ["nginx -t, then reload.", "nginx -t, তারপর reload।"]],
    m: ["Missing forwarded headers (wrong client IPs, redirect loops); default 1 MB body limit breaking uploads; proxy timeouts shorter than slow endpoints; forgetting WebSocket upgrade headers.", "Forwarded header নেই (ভুল client IP, redirect loop); ডিফল্ট ১ MB body সীমা upload ভাঙে; ধীর endpoint-এর চেয়ে ছোট proxy timeout; WebSocket upgrade header ভুলে যাওয়া।"],
    q: ["Q: Why does ASP.NET Core think every request is HTTP behind Nginx? A: TLS ends at Nginx; enable ForwardedHeaders middleware and send X-Forwarded-Proto so the app sees the original scheme.", "প্রশ্ন: Nginx-এর পিছনে ASP.NET Core কেন প্রতিটি request HTTP ভাবে? উত্তর: TLS Nginx-এ শেষ হয়; ForwardedHeaders middleware চালু করে X-Forwarded-Proto পাঠান, যাতে app মূল scheme দেখে।"],
    f: ["For streaming AI responses through Nginx, disable proxy buffering for that location (proxy_buffering off) or users will see text only at the end.", "Nginx দিয়ে AI response stream করতে সেই location-এ proxy buffering বন্ধ করুন (proxy_buffering off), নইলে user শুধু শেষে লেখা দেখবে।"],
    x: [file("nginx", "Reverse proxy for ASP.NET Core with SSE support · SSE-সহ reverse proxy", `upstream shop_api { server 127.0.0.1:5000; server 127.0.0.1:5001; keepalive 32; }

server {
  listen 80;
  server_name shop.example.com;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name shop.example.com;
  ssl_certificate     /etc/letsencrypt/live/shop.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/shop.example.com/privkey.pem;
  client_max_body_size 20m;
  gzip on; gzip_types application/json text/css application/javascript;

  location / {
    proxy_pass http://shop_api;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;
  }
  location /chat/stream {                 # Server-Sent Events for AI streaming
    proxy_pass http://shop_api;
    proxy_buffering off;
    proxy_read_timeout 300s;
  }
}
# sudo nginx -t && sudo systemctl reload nginx`, undefined, "Nginx configuration")],
  },
  "Load Balancers": {
    s: ["A wedding caterer with several serving counters and a coordinator who sends guests to the shortest line and closes a counter whose stove broke. A load balancer spreads traffic and routes around failures.", "কয়েকটি পরিবেশন কাউন্টারসহ বিয়ের caterer এবং একজন সমন্বয়কারী, যিনি অতিথিদের সবচেয়ে ছোট লাইনে পাঠান এবং চুলা নষ্ট হওয়া কাউন্টার বন্ধ করেন। Load balancer traffic ছড়ায় এবং ব্যর্থতা এড়িয়ে পাঠায়।"],
    t: ["DevOps concerns for load balancers: health checks that reflect readiness, connection draining during deploys (deregistration delay), TLS certificates and renewal, access logs for debugging, sticky sessions only when unavoidable, cross-zone balancing, and weighted routing for canary releases. They are also a key place for WAF rules and rate limits.", "Load balancer-এর DevOps বিষয়: প্রস্তুতি প্রতিফলিত করা health check, deploy-এর সময় connection draining (deregistration delay), TLS certificate ও নবায়ন, debugging-এর জন্য access log, এড়ানো না গেলেই শুধু sticky session, cross-zone balancing, আর canary release-এর জন্য weighted routing। WAF নিয়ম ও rate limit-এরও মূল জায়গা।"],
    p: [["Configure health checks on /health/ready.", "/health/ready-এ health check ঠিক করুন।"], ["Set deregistration delay longer than your longest request.", "সবচেয়ে দীর্ঘ request-এর চেয়ে বড় deregistration delay দিন।"], ["Enable access logs to S3/central logging.", "S3/কেন্দ্রীয় logging-এ access log চালু করুন।"], ["Use weighted target groups for canaries.", "Canary-র জন্য weighted target group দিন।"]],
    m: ["Health checks that fail when a non-critical dependency fails (all targets removed); no draining, so deploys drop requests; expired certificates.", "অপ্রয়োজনীয় dependency ব্যর্থ হলে ব্যর্থ health check (সব target সরে যায়); draining নেই, তাই deploy-এ request হারায়; মেয়াদোত্তীর্ণ certificate।"],
    q: ["Q: Users see 502 errors during every deploy. Why? A: Old instances stop before the load balancer stops sending traffic. Add connection draining, graceful shutdown and readiness checks so new targets are healthy first.", "প্রশ্ন: প্রতিটি deploy-এ user 502 error দেখে। কেন? উত্তর: Load balancer traffic পাঠানো থামানোর আগেই পুরনো instance বন্ধ হয়। Connection draining, graceful shutdown ও readiness check দিন, যাতে নতুন target আগে সুস্থ হয়।"],
    f: ["Canary releases controlled by metrics (error rate, latency, AI eval scores) at the load balancer are the safest way to ship risky changes.", "Load balancer-এ metric (error হার, latency, AI eval score) দিয়ে নিয়ন্ত্রিত canary release ঝুঁকিপূর্ণ পরিবর্তন পাঠানোর সবচেয়ে নিরাপদ উপায়।"],
    x: [sh("Zero-downtime deploy checklist on an ALB · ALB-তে zero-downtime deploy", `aws elbv2 modify-target-group-attributes --target-group-arn $TG \\
  --attributes Key=deregistration_delay.timeout_seconds,Value=60 >/dev/null
aws elbv2 modify-target-group --target-group-arn $TG --health-check-path /health/ready \\
  --healthy-threshold-count 2 --health-check-interval-seconds 10 --query 'TargetGroups[0].HealthCheckPath'
# app side: builder.Services.Configure<HostOptions>(o => o.ShutdownTimeout = TimeSpan.FromSeconds(45));
for i in $(seq 1 300); do curl -s -o /dev/null -w "%{http_code}\\n" https://api.example.com/health; done | sort | uniq -c`, `"/health/ready"
    300 200
# 300 requests during a rolling deploy, zero 502s`)],
  },
  "Prometheus": {
    s: ["A nurse who visits every patient every 15 seconds and writes down pulse and temperature in a chart, so doctors can see trends and get alerted. Prometheus scrapes metrics from your apps on a schedule.", "একজন নার্স, যিনি প্রতি ১৫ সেকেন্ডে প্রতিটি রোগীর কাছে গিয়ে chart-এ নাড়ি ও তাপমাত্রা লেখেন, যাতে ডাক্তার প্রবণতা দেখেন ও সতর্কতা পান। Prometheus সময়মতো আপনার app থেকে metric সংগ্রহ করে।"],
    t: ["Prometheus pulls metrics from /metrics endpoints, stores time series with labels, and evaluates PromQL queries and alerting rules (sent through Alertmanager). Metric types: counters (requests_total), gauges (memory), histograms (request duration buckets for p95/p99). In .NET, use OpenTelemetry with the Prometheus exporter. Avoid high-cardinality labels (user IDs).", "Prometheus /metrics endpoint থেকে metric টানে, label-সহ time series রাখে, আর PromQL query ও alerting নিয়ম মূল্যায়ন করে (Alertmanager দিয়ে পাঠায়)। Metric-এর ধরন: counter (requests_total), gauge (memory), histogram (p95/p99-এর জন্য request সময়ের bucket)। .NET-এ Prometheus exporter-সহ OpenTelemetry ব্যবহার করুন। বেশি-বৈচিত্র্যের label (user ID) এড়ান।"],
    p: [["Expose /metrics with OpenTelemetry in your app.", "App-এ OpenTelemetry দিয়ে /metrics প্রকাশ করুন।"], ["Add a scrape config or ServiceMonitor.", "Scrape config বা ServiceMonitor দিন।"], ["Write PromQL for rate, errors and duration (RED).", "Rate, error ও duration (RED)-এর জন্য PromQL লিখুন।"], ["Create alerts on SLO burn rates.", "SLO burn rate-এ alert বানান।"]],
    m: ["User IDs or URLs with IDs as labels (millions of series); alerting on every small spike (alert fatigue); averages instead of percentiles for latency.", "Label হিসেবে user ID বা ID-সহ URL (লক্ষ লক্ষ series); প্রতিটি ছোট বৃদ্ধিতে alert (alert ক্লান্তি); latency-তে percentile-এর বদলে গড়।"],
    q: ["Q: How do you compute p99 latency in PromQL? A: histogram_quantile(0.99, sum by (le) (rate(http_server_request_duration_seconds_bucket[5m]))).", "প্রশ্ন: PromQL-এ p99 latency কীভাবে হিসাব করবেন? উত্তর: histogram_quantile(0.99, sum by (le) (rate(http_server_request_duration_seconds_bucket[5m])))।"],
    f: ["Track AI metrics in Prometheus too: tokens per minute, model latency, cost per hour and eval pass rate, with alerts on sudden changes.", "Prometheus-এ AI metric-ও রাখুন: প্রতি মিনিটে token, model latency, ঘণ্টায় খরচ ও eval পাসের হার, হঠাৎ পরিবর্তনে alert-সহ।"],
    x: [file("promql", "RED metrics and an SLO alert in PromQL · RED metric ও SLO alert", `# Rate: requests per second by route
sum by (http_route) (rate(http_server_request_duration_seconds_count{service="shop-api"}[5m]))

# Errors: percentage of 5xx responses
100 * sum(rate(http_server_request_duration_seconds_count{service="shop-api",http_response_status_code=~"5.."}[5m]))
    / sum(rate(http_server_request_duration_seconds_count{service="shop-api"}[5m]))

# Duration: p99 latency in seconds
histogram_quantile(0.99, sum by (le) (rate(http_server_request_duration_seconds_bucket{service="shop-api"}[5m])))

# Alert rule (rules.yml): page if more than 2% errors for 10 minutes
# - alert: ShopApiHighErrorRate
#   expr: <errors query above> > 2
#   for: 10m
#   labels: { severity: page }`, undefined, "PromQL queries")],
  },
  "Grafana": {
    s: ["The dashboard of a car: speed, fuel and engine warnings in one glance, so the driver can react quickly. Grafana turns metrics, logs and traces into dashboards.", "গাড়ির dashboard: গতি, জ্বালানি ও ইঞ্জিনের সতর্কতা এক নজরে, তাই চালক দ্রুত সাড়া দিতে পারেন। Grafana metric, log ও trace-কে dashboard-এ রূপ দেয়।"],
    t: ["Grafana connects to data sources (Prometheus, Loki, Tempo, CloudWatch, PostgreSQL) and builds dashboards with panels, variables (environment, service) and alerts. Good dashboards follow a story: top row shows user impact (RED/SLOs), then saturation (CPU, memory, DB connections), then dependencies. Store dashboards as code (JSON in Git, provisioning).", "Grafana data source-এর সাথে যুক্ত হয় (Prometheus, Loki, Tempo, CloudWatch, PostgreSQL) এবং panel, variable (পরিবেশ, service) ও alert দিয়ে dashboard বানায়। ভালো dashboard একটি গল্প মানে: উপরের সারি user-এর প্রভাব (RED/SLO), তারপর saturation (CPU, memory, DB connection), তারপর dependency। Dashboard code হিসেবে রাখুন (Git-এ JSON, provisioning)।"],
    p: [["Add Prometheus/Loki data sources.", "Prometheus/Loki data source যোগ করুন।"], ["Build a service overview: rate, errors, p99, saturation.", "Service-এর সারাংশ বানান: rate, error, p99, saturation।"], ["Add variables for environment and service.", "পরিবেশ ও service-এর জন্য variable দিন।"], ["Provision dashboards from Git.", "Git থেকে dashboard provision করুন।"]],
    m: ["Dashboards with 60 panels nobody reads; no links from alerts to dashboards; manual dashboard changes lost on upgrades.", "কেউ পড়ে না এমন ৬০ panel-এর dashboard; alert থেকে dashboard-এ link নেই; upgrade-এ হাতে করা dashboard পরিবর্তন হারানো।"],
    q: ["Q: What goes on the first row of a service dashboard? A: What users feel: request rate, error rate, latency percentiles and SLO status. Infrastructure details go below.", "প্রশ্ন: Service dashboard-এর প্রথম সারিতে কী থাকে? উত্তর: User যা অনুভব করে: request হার, error হার, latency percentile ও SLO অবস্থা। Infrastructure-এর বিস্তারিত নিচে।"],
    f: ["Add an 'AI' row to service dashboards: tokens, cost, model latency, cache hit rate and eval scores. Visibility keeps AI features affordable and reliable.", "Service dashboard-এ একটি 'AI' সারি যোগ করুন: token, খরচ, model latency, cache hit হার ও eval score। দৃশ্যমানতা AI feature সাশ্রয়ী ও নির্ভরযোগ্য রাখে।"],
    x: [file("json", "Dashboard panel as code (excerpt) · code হিসেবে dashboard panel", `{
  "title": "Shop API overview",
  "templating": { "list": [{ "name": "env", "type": "custom", "query": "dev,staging,prod", "current": { "value": "prod" } }] },
  "panels": [
    { "type": "stat", "title": "Error rate %", "gridPos": { "x": 0, "y": 0, "w": 6, "h": 4 },
      "targets": [{ "expr": "100*sum(rate(http_server_request_duration_seconds_count{env=\\"$env\\",http_response_status_code=~\\"5..\\"}[5m]))/sum(rate(http_server_request_duration_seconds_count{env=\\"$env\\"}[5m]))" }],
      "fieldConfig": { "defaults": { "thresholds": { "steps": [{ "color": "green", "value": null }, { "color": "red", "value": 2 }] } } } },
    { "type": "timeseries", "title": "p99 latency (s)", "gridPos": { "x": 6, "y": 0, "w": 9, "h": 8 },
      "targets": [{ "expr": "histogram_quantile(0.99, sum by (le) (rate(http_server_request_duration_seconds_bucket{env=\\"$env\\"}[5m])))" }] },
    { "type": "timeseries", "title": "AI tokens per minute", "gridPos": { "x": 15, "y": 0, "w": 9, "h": 8 },
      "targets": [{ "expr": "sum(rate(gen_ai_client_token_usage_sum{env=\\"$env\\"}[1m]))*60" }] }
  ]
}`, undefined, "Grafana dashboard JSON")],
  },
  "ELK Logging": {
    s: ["A national library where every page written by every author is indexed, so you can search 'payment failed on Tuesday' across millions of pages in seconds. ELK (Elasticsearch, Logstash, Kibana) collects and searches logs.", "জাতীয় library, যেখানে প্রতিটি লেখকের প্রতিটি পাতা index করা, তাই কোটি পাতায় 'মঙ্গলবারে payment ব্যর্থ' কয়েক সেকেন্ডে খোঁজা যায়। ELK (Elasticsearch, Logstash, Kibana) log সংগ্রহ ও অনুসন্ধান করে।"],
    t: ["Apps write structured JSON logs to stdout; shippers (Filebeat, Fluent Bit, OpenTelemetry Collector) send them to Logstash or directly to Elasticsearch/OpenSearch, where they are indexed; Kibana searches and visualises them. Include timestamp, level, service, environment, trace_id and message fields. Use index lifecycle policies to delete or archive old logs. Loki is a lighter alternative.", "App stdout-এ structured JSON log লেখে; shipper (Filebeat, Fluent Bit, OpenTelemetry Collector) সেগুলো Logstash বা সরাসরি Elasticsearch/OpenSearch-এ পাঠায়, যেখানে index হয়; Kibana অনুসন্ধান ও দৃশ্যায়ন করে। Timestamp, level, service, environment, trace_id ও message field দিন। পুরনো log মুছতে বা archive করতে index lifecycle policy দিন। হালকা বিকল্প Loki।"],
    p: [["Log JSON with consistent fields and a trace ID.", "সামঞ্জস্যপূর্ণ field ও trace ID-সহ JSON log দিন।"], ["Ship logs with Fluent Bit or the OTel Collector.", "Fluent Bit বা OTel Collector দিয়ে log পাঠান।"], ["Search in Kibana by service, level and trace_id.", "Kibana-য় service, level ও trace_id দিয়ে খুঁজুন।"], ["Set retention (e.g., 14 days hot, 90 days archived).", "Retention ঠিক করুন (যেমন ১৪ দিন গরম, ৯০ দিন archive)।"]],
    m: ["Unstructured text logs that are hard to search; logging personal data and secrets; unlimited retention costs; no trace IDs to connect services.", "খোঁজা কঠিন এমন অগোছালো লেখার log; ব্যক্তিগত data ও secret log; সীমাহীন retention-এর খরচ; service যুক্ত করতে trace ID নেই।"],
    q: ["Q: How do you find all logs for one failed checkout across services? A: Search by the trace_id (from the error response or traces) which every service includes in its logs.", "প্রশ্ন: Service জুড়ে একটি ব্যর্থ checkout-এর সব log কীভাবে খুঁজবেন? উত্তর: trace_id (error response বা trace থেকে) দিয়ে খুঁজুন, যা প্রতিটি service তার log-এ রাখে।"],
    f: ["AI-assisted log analysis works best on structured logs. Clean fields today make tomorrow's 'explain this incident' tools far more accurate.", "Structured log-এ AI-সহায়িত log বিশ্লেষণ সবচেয়ে ভালো কাজ করে। আজকের পরিষ্কার field আগামীর 'এই incident ব্যাখ্যা করো' tool অনেক বেশি নির্ভুল করে।"],
    x: [file("logstash", "Logstash pipeline: parse JSON logs and route by environment · Logstash pipeline", `input {
  beats { port => 5044 }
}
filter {
  json { source => "message" target => "app" }
  date { match => ["[app][timestamp]", "ISO8601"] }
  mutate {
    rename => { "[app][trace_id]" => "trace_id" "[app][level]" => "level" "[app][service]" => "service" }
    remove_field => ["[app][password]", "[app][token]"]      # never index secrets
  }
}
output {
  elasticsearch {
    hosts => ["https://es.internal:9200"]
    index => "logs-%{service}-%{+YYYY.MM.dd}"
    ilm_enabled => true
    ilm_policy => "logs-14d-hot-90d-delete"
  }
}
# Kibana query: service:"shop-api" AND level:"Error" AND trace_id:"4bf92f3577b34da6"`, undefined, "Logstash configuration")],
  },
  "Blue Green Deploys": {
    s: ["A theatre with two identical stages: tonight's show runs on the blue stage while the crew prepares the next show on the green stage. At curtain time, the audience is simply turned towards the green stage. If something is wrong, turn them back.", "দুটি একই রকম মঞ্চসহ থিয়েটার: আজকের অনুষ্ঠান নীল মঞ্চে চলে, কর্মীরা সবুজ মঞ্চে পরেরটা প্রস্তুত করেন। পর্দা ওঠার সময় দর্শকদের শুধু সবুজ মঞ্চের দিকে ঘোরানো হয়। কিছু ভুল হলে আবার ফেরানো হয়।"],
    t: ["Blue/green runs two production environments. Deploy the new version to the idle one (green), run smoke tests, then switch traffic (load balancer target group, DNS, Kubernetes Service selector) in one step. Rollback is switching back. Costs: double capacity during the switch and care with database changes, which must work for both versions (expand/contract migrations).", "Blue/green দুটি production পরিবেশ চালায়। অলসটায় (green) নতুন version deploy করুন, smoke test চালান, তারপর এক ধাপে traffic বদলান (load balancer target group, DNS, Kubernetes Service selector)। Rollback মানে আবার ফেরানো। খরচ: বদলের সময় দ্বিগুণ ক্ষমতা আর database পরিবর্তনে সাবধানতা, যা দুই version-এই কাজ করতে হবে (expand/contract migration)।"],
    p: [["Deploy the new version to green.", "নতুন version green-এ deploy করুন।"], ["Run smoke and health checks against green.", "Green-এ smoke ও health check চালান।"], ["Switch traffic to green.", "Traffic green-এ বদলান।"], ["Keep blue for quick rollback, then retire it.", "দ্রুত rollback-এর জন্য blue রাখুন, পরে বন্ধ করুন।"]],
    m: ["Breaking database migrations that blue cannot handle; forgetting background workers also run in both colours (double processing); no smoke tests before switching.", "Blue সামলাতে পারে না এমন ভাঙা database migration; background worker-ও দুই রঙে চলে ভুলে যাওয়া (দ্বিগুণ প্রক্রিয়া); বদলের আগে smoke test নেই।"],
    q: ["Q: Blue/green vs canary? A: Blue/green switches all traffic at once with instant rollback; canary shifts a small percentage first and increases it while watching metrics.", "প্রশ্ন: Blue/green বনাম canary? উত্তর: Blue/green তাৎক্ষণিক rollback-সহ একবারে সব traffic বদলায়; canary প্রথমে অল্প শতাংশ সরায় এবং metric দেখে বাড়ায়।"],
    f: ["Blue/green also works for AI prompt or model changes: run both configurations, switch traffic, and switch back if quality metrics drop.", "AI prompt বা model পরিবর্তনেও blue/green কাজ করে: দুটি configuration চালান, traffic বদলান, মান কমলে ফিরিয়ে আনুন।"],
    x: [sh("Blue/green switch with a Kubernetes Service selector · Service selector দিয়ে blue/green", `kubectl apply -f k8s/api-green.yaml               # Deployment labelled color=green, new image
kubectl rollout status deploy/api-green -n shop
kubectl run smoke -n shop --rm -i --image=curlimages/curl --restart=Never -- curl -fsS http://api-green/health
kubectl patch svc api -n shop -p '{"spec":{"selector":{"app":"api","color":"green"}}}'
kubectl get svc api -n shop -o jsonpath='{.spec.selector.color}{"\\n"}'
# rollback: kubectl patch svc api -n shop -p '{"spec":{"selector":{"app":"api","color":"blue"}}}'`, `deployment.apps/api-green created
deployment "api-green" successfully rolled out
Healthy
pod "smoke" deleted
service/api patched
green`)],
  },
  "Auto Scaling": {
    s: ["A call centre that brings in extra staff when the phone queue grows and sends them home when it is quiet, following clear rules. Auto scaling adds and removes capacity automatically.", "Call centre, যা ফোনের লাইন বাড়লে বাড়তি কর্মী আনে এবং শান্ত হলে বাড়ি পাঠায়, স্পষ্ট নিয়ম মেনে। Auto scaling স্বয়ংক্রিয়ভাবে ক্ষমতা যোগ ও বাদ দেয়।"],
    t: ["Scale on the signal closest to user pain: requests per target, latency, or queue depth, not just CPU. Set sensible min (for availability) and max (for cost and downstream limits), cooldowns to avoid flapping, and pre-scale for known events. In Kubernetes, combine HPA (pods) with Karpenter/Cluster Autoscaler (nodes); KEDA scales on events.", "User-এর কষ্টের সবচেয়ে কাছের সংকেতে scale করুন: target-প্রতি request, latency, বা queue-র গভীরতা, শুধু CPU নয়। যৌক্তিক min (availability-র জন্য) ও max (খরচ ও downstream সীমার জন্য), দোলাচল এড়াতে cooldown, আর জানা event-এর আগে আগেভাগে scale দিন। Kubernetes-এ HPA (pod)-কে Karpenter/Cluster Autoscaler (node)-এর সাথে মেলান; KEDA event-এ scale করে।"],
    p: [["Pick the scaling metric (RPS, latency, queue depth).", "Scaling metric বাছুন (RPS, latency, queue-র গভীরতা)।"], ["Set min, max and target values.", "Min, max ও target মান দিন।"], ["Load test to verify scale-out speed.", "Scale-out-এর গতি যাচাইয়ে load test করুন।"], ["Alert when max is reached.", "Max-এ পৌঁছালে alert দিন।"]],
    m: ["Max replicas exceeding database connection limits; scaling on CPU for I/O-bound apps; scale-in that kills pods mid-request without graceful shutdown.", "Database connection সীমা ছাড়ানো max replica; I/O-নির্ভর app-এ CPU-তে scaling; graceful shutdown ছাড়া request-এর মাঝে pod মারা scale-in।"],
    q: ["Q: Your HPA scales from 3 to 20 pods and the database falls over. Lesson? A: Autoscaling moves the bottleneck; cap max replicas by downstream capacity, add connection pooling and caching, and scale the database tier too.", "প্রশ্ন: আপনার HPA ৩ থেকে ২০ pod-এ বাড়ে আর database পড়ে যায়। শিক্ষা? উত্তর: Autoscaling bottleneck সরায়; downstream ক্ষমতা অনুযায়ী max replica সীমিত করুন, connection pooling ও caching দিন, আর database স্তরও বাড়ান।"],
    f: ["KEDA scaling AI workers on queue length (and to zero when idle) is a cost-saving pattern every platform engineer should know.", "Queue দৈর্ঘ্যে (আর অলস হলে শূন্যে) AI worker scale করা KEDA খরচ বাঁচানোর pattern, যা প্রতিটি platform engineer-এর জানা উচিত।"],
    x: [file("yaml", "KEDA: scale workers on RabbitMQ queue length · queue দৈর্ঘ্যে worker scale", `apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata: { name: embedding-worker, namespace: shop }
spec:
  scaleTargetRef: { name: embedding-worker }     # a Deployment
  minReplicaCount: 0                             # scale to zero when idle
  maxReplicaCount: 15                            # capped by model API rate limits
  cooldownPeriod: 120
  triggers:
    - type: rabbitmq
      metadata:
        queueName: documents-to-embed
        mode: QueueLength
        value: "50"                              # ~50 messages per worker
      authenticationRef: { name: rabbitmq-auth }
# kubectl get scaledobject -n shop   ->   embedding-worker  READY True  ACTIVE True`, undefined, "KEDA ScaledObject")],
  },
  "Secrets Management": {
    s: ["Keys to the bank vault are never left under the doormat or written on the wall. They are kept in a guarded key box, handed out when needed, and changed regularly. That is secrets management for software.", "ব্যাংক ভল্টের চাবি কখনো পাপোশের নিচে রাখা বা দেয়ালে লেখা হয় না। প্রহরীযুক্ত চাবির বাক্সে থাকে, দরকারে দেওয়া হয় এবং নিয়মিত বদলানো হয়। Software-এর জন্য এটাই secrets management।"],
    t: ["In a DevOps pipeline, secrets live in a manager (Vault, AWS Secrets Manager, Azure Key Vault), CI uses OIDC instead of stored cloud keys, Kubernetes pulls secrets via External Secrets Operator or CSI drivers, encryption at rest is enabled for Kubernetes Secrets, and repositories have secret scanning with push protection. Rotate regularly and audit access.", "DevOps pipeline-এ secret ম্যানেজারে থাকে (Vault, AWS Secrets Manager, Azure Key Vault), CI সংরক্ষিত cloud key-র বদলে OIDC ব্যবহার করে, Kubernetes External Secrets Operator বা CSI driver দিয়ে secret টানে, Kubernetes Secret-এর জন্য encryption at rest চালু থাকে, আর repository-তে push protection-সহ secret scanning থাকে। নিয়মিত বদলান ও access audit করুন।"],
    p: [["Inventory all secrets and where they are used.", "সব secret ও কোথায় ব্যবহৃত তালিকা করুন।"], ["Move them into a secrets manager.", "সেগুলো secret manager-এ সরান।"], ["Sync to Kubernetes with External Secrets Operator.", "External Secrets Operator দিয়ে Kubernetes-এ sync করুন।"], ["Enable rotation and secret scanning.", "Rotation ও secret scanning চালু করুন।"]],
    m: ["Base64 in Kubernetes Secret YAML committed to Git (base64 is not encryption); long-lived cloud keys in CI; sharing secrets in chat; never rotating after people leave.", "Git-এ commit করা Kubernetes Secret YAML-এ base64 (base64 encryption নয়); CI-তে দীর্ঘস্থায়ী cloud key; chat-এ secret শেয়ার; মানুষ চলে গেলেও কখনো না বদলানো।"],
    q: ["Q: Is a Kubernetes Secret secure by default? A: Only base64-encoded; enable etcd encryption at rest, restrict RBAC access, and source values from an external secrets manager.", "প্রশ্ন: Kubernetes Secret কি ডিফল্টভাবে নিরাপদ? উত্তর: শুধু base64-encoded; etcd-তে encryption at rest চালু করুন, RBAC access সীমিত করুন, আর মান বাইরের secret manager থেকে আনুন।"],
    f: ["Secrets are increasingly replaced by workload identities (no secret at all). Where secrets remain, like third-party AI keys, centralise and monitor them.", "Secret ক্রমশ workload identity দিয়ে প্রতিস্থাপিত হচ্ছে (কোনো secret-ই নেই)। যেখানে secret থাকে, যেমন third-party AI key, সেগুলো কেন্দ্রীভূত করে নজরে রাখুন।"],
    x: [file("yaml", "External Secrets: sync AWS secrets into Kubernetes · ExternalSecret", `apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata: { name: shop-api-secrets, namespace: shop }
spec:
  refreshInterval: 1h                      # picks up rotated values
  secretStoreRef: { name: aws-secrets-manager, kind: ClusterSecretStore }
  target: { name: shop-api-secrets }       # Kubernetes Secret created and kept in sync
  data:
    - secretKey: ConnectionStrings__Shop
      remoteRef: { key: shop/prod/db, property: connectionString }
    - secretKey: Ai__Key
      remoteRef: { key: shop/prod/ai-key, property: key }
# Deployment: envFrom: [{ secretRef: { name: shop-api-secrets } }]
# Nothing secret is stored in Git; IAM decides which pods can read which secrets.`, undefined, "Kubernetes manifest")],
  },
};
