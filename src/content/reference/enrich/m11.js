// Module 11 Docker: easy story, plain theory, steps, mistakes, interview, 2028 tip, hands-on practice.
import { sh, file } from "./helpers";

export default {
  "docker run": {
    s: ["A packed lunch box: rice, curry and a spoon all together, so you can eat anywhere without a kitchen. A container packs your app with everything it needs, and docker run opens the box and starts it.", "টিফিন বক্স: ভাত, তরকারি ও চামচ একসাথে, তাই রান্নাঘর ছাড়াই যেকোনো জায়গায় খাওয়া যায়। Container আপনার app-কে দরকারি সবকিছুসহ বাঁধে, আর docker run বাক্স খুলে চালু করে।"],
    t: ["docker run creates a container from an image and starts it. Key flags: -d (background), --name, -p host:container (publish ports), -e (environment variables), -v (mount volumes), --rm (delete on exit), --restart unless-stopped, and resource limits (--memory, --cpus). The image is read-only; each container gets its own writable layer.", "docker run একটি image থেকে container বানিয়ে চালু করে। মূল flag: -d (পিছনে), --name, -p host:container (port প্রকাশ), -e (environment variable), -v (volume mount), --rm (বের হলে মুছে ফেলা), --restart unless-stopped, আর resource সীমা (--memory, --cpus)। Image শুধু-পড়ার; প্রতিটি container নিজস্ব লেখার স্তর পায়।"],
    p: [["Pull or build the image.", "Image pull বা build করুন।"], ["Run with a name, port and environment variables.", "নাম, port ও environment variable দিয়ে চালান।"], ["Check it with docker ps and curl.", "docker ps ও curl দিয়ে দেখুন।"], ["Add memory/CPU limits for production-like tests.", "Production-এর মতো test-এ memory/CPU সীমা দিন।"]],
    m: ["Forgetting -p so the app is unreachable; storing data inside the container (lost on removal); passing secrets with -e in shell history; running as root.", "-p ভুলে app-এ পৌঁছানো যায় না; container-এর ভিতরে data রাখা (মুছলে হারায়); shell history-তে -e দিয়ে secret; root হিসেবে চালানো।"],
    q: ["Q: Image vs container? A: An image is a read-only template (like a class); a container is a running instance with its own writable layer (like an object).", "প্রশ্ন: Image বনাম container? উত্তর: Image শুধু-পড়ার template (class-এর মতো); container নিজস্ব লেখার স্তরসহ চলমান instance (object-এর মতো)।"],
    f: ["Containers are the standard unit of deployment, including for AI services (model gateways, vector databases, local LLMs). Being fluent with docker run is a daily skill.", "Container deployment-এর মানক একক, AI service-এর জন্যও (model gateway, vector database, local LLM)। docker run-এ দক্ষতা প্রতিদিনের দক্ষতা।"],
    x: [sh("Run an ASP.NET Core sample with port, env and limits · port, env ও সীমাসহ চালানো", `docker run -d --name hello-api \\
  -p 8080:8080 \\
  -e ASPNETCORE_ENVIRONMENT=Development \\
  --memory 256m --cpus 0.5 --restart unless-stopped \\
  mcr.microsoft.com/dotnet/samples:aspnetapp
docker ps --filter name=hello-api --format "{{.Names}}  {{.Status}}  {{.Ports}}"
curl -s -o /dev/null -w "%{http_code}\\n" http://localhost:8080`, `5f2c9b1a7d3e...
hello-api  Up 3 seconds  0.0.0.0:8080->8080/tcp
200`)],
  },
  "docker ps": {
    s: ["A hotel's room board showing which rooms are occupied, by whom and since when. docker ps shows which containers are running.", "Hotel-এর room board, কোন রুমে কে কখন থেকে আছে দেখায়। docker ps দেখায় কোন container চলছে।"],
    t: ["docker ps lists running containers with ID, image, command, created time, status (including health) and ports. -a includes stopped containers, -q prints only IDs (useful in scripts), --filter narrows results, and --format makes tables you choose. Status 'Exited (137)' means killed (often out of memory).", "docker ps চলমান container দেখায়: ID, image, command, তৈরির সময়, status (health-সহ) ও port। -a বন্ধ container-ও দেখায়, -q শুধু ID (script-এ কাজের), --filter ফল ছোট করে, আর --format নিজের বাছা table বানায়। Status 'Exited (137)' মানে kill করা হয়েছে (প্রায়ই memory শেষ)।"],
    p: [["List running: docker ps.", "চলমান তালিকা: docker ps।"], ["Include stopped: docker ps -a.", "বন্ধসহ: docker ps -a।"], ["Filter: --filter status=exited.", "ছাঁকুন: --filter status=exited।"], ["Custom table: --format \"table {{.Names}}\\t{{.Status}}\".", "নিজের table: --format \"table {{.Names}}\\t{{.Status}}\"।"]],
    m: ["Missing crashed containers because you forgot -a; ignoring health status; confusing container ID prefixes.", "-a ভুলে crash হওয়া container না দেখা; health status উপেক্ষা; container ID-র শুরুর অংশ গুলিয়ে ফেলা।"],
    q: ["Q: A container shows 'Exited (137)'. What happened? A: It received SIGKILL, commonly from the out-of-memory killer; check docker inspect for OOMKilled and raise memory or fix the leak.", "প্রশ্ন: একটি container 'Exited (137)' দেখায়। কী হয়েছে? উত্তর: SIGKILL পেয়েছে, প্রায়ই out-of-memory killer থেকে; docker inspect-এ OOMKilled দেখে memory বাড়ান বা leak ঠিক করুন।"],
    f: ["Add HEALTHCHECK to images so docker ps (and orchestrators) can show 'healthy' vs 'unhealthy', not just 'running'.", "Image-এ HEALTHCHECK দিন, যাতে docker ps (ও orchestrator) শুধু 'running' নয়, 'healthy' বনাম 'unhealthy' দেখাতে পারে।"],
    x: [sh("Find running, crashed and unhealthy containers · চলমান, crash ও অসুস্থ container", `# all containers, including stopped ones
docker ps -a --format "table {{.Names}}\\t{{.Image}}\\t{{.Status}}"
docker ps -a --filter status=exited -q | wc -l
docker inspect --format '{{.State.OOMKilled}} {{.State.ExitCode}}' worker`, `NAMES       IMAGE                STATUS
hello-api   shop-api:1.4.0       Up 2 hours (healthy)
redis       redis:7              Up 2 hours
worker      shop-worker:1.4.0    Exited (137) 5 minutes ago
1
true 137`)],
  },
  "docker images": {
    s: ["A recipe shelf: each recipe card (image) can be used to cook many dishes (containers). docker images lists the recipe cards you have stored.", "Recipe-র তাক: প্রতিটি recipe কার্ড (image) দিয়ে অনেক পদ (container) রাঁধা যায়। docker images আপনার রাখা recipe কার্ডের তালিকা দেয়।"],
    t: ["docker images (docker image ls) lists local images with repository, tag, image ID, age and size. Images are built from layers shared between images, so total disk use is less than the sum of sizes. Dangling images (<none>) are leftovers from rebuilds. Smaller images download faster and have fewer vulnerabilities.", "docker images (docker image ls) local image-এর তালিকা দেয়: repository, tag, image ID, বয়স ও আকার। Image স্তর দিয়ে তৈরি, যা image-গুলোর মধ্যে শেয়ার হয়, তাই মোট disk ব্যবহার আকারের যোগফলের চেয়ে কম। Dangling image (<none>) আবার build-এর অবশিষ্ট। ছোট image দ্রুত নামে এবং কম দুর্বলতা থাকে।"],
    p: [["List images: docker images.", "Image-এর তালিকা: docker images।"], ["See layers: docker history <image>.", "স্তর দেখুন: docker history <image>।"], ["Compare base images (sdk vs aspnet vs chiseled).", "Base image তুলনা করুন (sdk বনাম aspnet বনাম chiseled)।"], ["Remove dangling ones: docker image prune.", "Dangling-গুলো সরান: docker image prune।"]],
    m: ["Shipping the SDK image (huge) instead of the runtime image; relying on 'latest'; never cleaning old images on build servers.", "Runtime image-এর বদলে SDK image (বিশাল) পাঠানো; 'latest'-এর উপর নির্ভর; build server-এ কখনো পুরনো image পরিষ্কার না করা।"],
    q: ["Q: Why is the .NET SDK image much bigger than the runtime image? A: The SDK contains compilers and build tools; production only needs the runtime, so use a multi-stage build that copies published output into the aspnet (or chiseled) image.", "প্রশ্ন: .NET SDK image কেন runtime image-এর চেয়ে অনেক বড়? উত্তর: SDK-তে compiler ও build tool থাকে; production-এ শুধু runtime লাগে, তাই multi-stage build দিয়ে publish করা output aspnet (বা chiseled) image-এ কপি করুন।"],
    f: ["Chiseled / distroless .NET images are tiny and have almost no OS packages, reducing vulnerability scan findings. They are becoming the default for production.", "Chiseled / distroless .NET image খুব ছোট এবং প্রায় কোনো OS package নেই, তাই vulnerability scan-এর ফল কমে। এগুলো production-এর ডিফল্ট হয়ে উঠছে।"],
    x: [sh("Compare .NET image sizes · .NET image-এর আকার তুলনা", `docker pull -q mcr.microsoft.com/dotnet/sdk:9.0
docker pull -q mcr.microsoft.com/dotnet/aspnet:9.0
docker pull -q mcr.microsoft.com/dotnet/aspnet:9.0-noble-chiseled
docker images --format "table {{.Repository}}:{{.Tag}}\\t{{.Size}}" | grep dotnet`, `mcr.microsoft.com/dotnet/sdk:9.0                   ~850MB
mcr.microsoft.com/dotnet/aspnet:9.0                ~220MB
mcr.microsoft.com/dotnet/aspnet:9.0-noble-chiseled ~110MB
# Build with sdk, ship on aspnet or chiseled (sizes vary by version)`)],
  },
  "docker pull": {
    s: ["Ordering a book from an online store: you choose the exact edition (tag), it arrives and sits on your shelf ready to read. docker pull downloads an image from a registry.", "অনলাইন দোকান থেকে বই অর্ডার: সঠিক সংস্করণ (tag) বাছেন, তা এসে তাকে পড়ার জন্য প্রস্তুত থাকে। docker pull registry থেকে image নামায়।"],
    t: ["docker pull name:tag downloads only the layers you do not already have. Tags are movable labels (latest, 9.0); a digest (name@sha256:...) is immutable and guarantees the exact same image. Registries include Docker Hub, GitHub Container Registry, AWS ECR and Azure ACR. Private registries need docker login.", "docker pull name:tag শুধু সেই স্তর নামায় যা আপনার কাছে নেই। Tag চলমান label (latest, 9.0); digest (name@sha256:...) অপরিবর্তনীয় এবং ঠিক একই image নিশ্চিত করে। Registry-র উদাহরণ Docker Hub, GitHub Container Registry, AWS ECR ও Azure ACR। Private registry-তে docker login লাগে।"],
    p: [["Pull a specific tag, not latest.", "latest নয়, নির্দিষ্ট tag pull করুন।"], ["Note the digest printed.", "দেখানো digest লিখে রাখুন।"], ["Pin production deployments to the digest.", "Production deployment digest-এ বাঁধুন।"], ["Use trusted, official images.", "বিশ্বস্ত, অফিসিয়াল image ব্যবহার করুন।"]],
    m: ["Using :latest in production (changes silently); pulling random images from unknown publishers; hitting Docker Hub rate limits in CI without a mirror or login.", "Production-এ :latest (নীরবে বদলায়); অজানা প্রকাশকের এলোমেলো image pull; mirror বা login ছাড়া CI-তে Docker Hub-এর rate limit-এ পড়া।"],
    q: ["Q: Why pin by digest? A: Tags can be re-pointed to new images; a digest identifies exact content, making deployments reproducible and protecting against tampered tags.", "প্রশ্ন: Digest দিয়ে কেন বাঁধবেন? উত্তর: Tag নতুন image-এ সরানো যায়; digest সঠিক content চিহ্নিত করে, deployment পুনরাবৃত্তিযোগ্য করে এবং পরিবর্তিত tag থেকে রক্ষা করে।"],
    f: ["Supply-chain security (signed images, SBOMs, provenance) is becoming mandatory in many companies. Learn cosign/notation basics alongside docker pull.", "Supply-chain নিরাপত্তা (signed image, SBOM, provenance) অনেক কোম্পানিতে বাধ্যতামূলক হচ্ছে। docker pull-এর সাথে cosign/notation-এর মূল বিষয় শিখুন।"],
    x: [sh("Pull by tag, then pin by digest · tag দিয়ে pull, digest দিয়ে বাঁধা", `docker pull redis:7.4
docker inspect --format '{{index .RepoDigests 0}}' redis:7.4
# Use the digest in production manifests:
echo "image: redis@sha256:<digest-from-above>"
docker pull redis:7.4   # second time: nothing new to download`, `7.4: Pulling from library/redis
Digest: sha256:3f1c...
Status: Downloaded newer image for redis:7.4
redis@sha256:3f1c...
image: redis@sha256:<digest-from-above>
Status: Image is up to date for redis:7.4`)],
  },
  "docker build": {
    s: ["A recipe card turned into a ready-made frozen meal: follow the steps once in the factory, then everyone gets the identical meal. A Dockerfile is the recipe; docker build produces the image.", "Recipe কার্ড থেকে তৈরি frozen খাবার: কারখানায় একবার ধাপগুলো মানুন, তারপর সবাই একই খাবার পায়। Dockerfile হলো recipe; docker build image বানায়।"],
    t: ["Each Dockerfile instruction creates a cached layer. Order instructions from least to most frequently changing (restore packages before copying source) to reuse cache. Multi-stage builds compile in an SDK stage and copy only the published output into a small runtime stage. Use .dockerignore, a non-root user, and pinned base image tags.", "Dockerfile-এর প্রতিটি instruction cache-করা স্তর বানায়। কম থেকে বেশি বদলানো ক্রমে instruction সাজান (source কপির আগে package restore), যাতে cache পুনর্ব্যবহার হয়। Multi-stage build SDK stage-এ compile করে শুধু publish করা output ছোট runtime stage-এ কপি করে। .dockerignore, non-root user ও নির্দিষ্ট base image tag ব্যবহার করুন।"],
    p: [["Write a multi-stage Dockerfile.", "Multi-stage Dockerfile লিখুন।"], ["Add .dockerignore (bin, obj, .git, secrets).", ".dockerignore দিন (bin, obj, .git, secret)।"], ["Build with a version tag: docker build -t shop-api:1.4.0 .", "Version tag দিয়ে build: docker build -t shop-api:1.4.0 ."], ["Run it and scan it before pushing.", "Push-এর আগে চালিয়ে scan করুন।"]],
    m: ["COPY . . before restore (cache busts on every change); secrets in build args or layers; huge build context without .dockerignore; running as root.", "Restore-এর আগে COPY . . (প্রতিটি পরিবর্তনে cache ভাঙে); build arg বা স্তরে secret; .dockerignore ছাড়া বিশাল build context; root হিসেবে চালানো।"],
    q: ["Q: Why copy the .csproj and restore before copying the rest? A: Package restore is slow and changes rarely; keeping it in its own layer means code changes reuse the cached restore layer.", "প্রশ্ন: বাকিটা কপির আগে কেন .csproj কপি করে restore? উত্তর: Package restore ধীর ও কম বদলায়; নিজের স্তরে রাখলে code বদলালেও cache-করা restore স্তর পুনর্ব্যবহার হয়।"],
    f: ["'dotnet publish /t:PublishContainer' can build images without a Dockerfile, and BuildKit caches speed up CI. Know both approaches.", "'dotnet publish /t:PublishContainer' Dockerfile ছাড়াই image বানাতে পারে, আর BuildKit cache CI দ্রুত করে। দুটো পদ্ধতিই জানুন।"],
    x: [file("dockerfile", "Production multi-stage Dockerfile for ASP.NET Core · multi-stage Dockerfile", `# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY Shop.Api/Shop.Api.csproj Shop.Api/
RUN dotnet restore Shop.Api/Shop.Api.csproj          # cached until the csproj changes
COPY . .
RUN dotnet publish Shop.Api/Shop.Api.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0-noble-chiseled AS final
WORKDIR /app
COPY --from=build /app .
USER app                                             # non-root
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "Shop.Api.dll"]
# Build: docker build -t shop-api:1.4.0 .`, undefined, "Dockerfile")],
  },
  "docker exec -it": {
    s: ["Entering a running shop through the back door to check the storeroom while customers keep shopping. docker exec runs a command inside a running container.", "ক্রেতারা কেনাকাটা চালিয়ে যাওয়ার সময় পিছনের দরজা দিয়ে চলমান দোকানে ঢুকে গুদাম দেখা। docker exec চলমান container-এর ভিতরে command চালায়।"],
    t: ["docker exec -it <container> sh opens an interactive shell (-i keeps input open, -t allocates a terminal). Without -it you can run one-off commands (docker exec redis redis-cli ping). Minimal or chiseled images may have no shell; use docker debug or an ephemeral debug container instead. Changes made inside are lost when the container is replaced.", "docker exec -it <container> sh interactive shell খোলে (-i input খোলা রাখে, -t terminal দেয়)। -it ছাড়া এককালীন command চালানো যায় (docker exec redis redis-cli ping)। ছোট বা chiseled image-এ shell না-ও থাকতে পারে; তখন docker debug বা অস্থায়ী debug container ব্যবহার করুন। ভিতরে করা পরিবর্তন container বদলালে হারিয়ে যায়।"],
    p: [["Find the container name with docker ps.", "docker ps দিয়ে container-এর নাম খুঁজুন।"], ["Open a shell: docker exec -it name sh (or bash).", "Shell খুলুন: docker exec -it name sh (বা bash)।"], ["Inspect env, files and network (env, ls, wget).", "Env, file ও network দেখুন (env, ls, wget)।"], ["Fix the image or config, not the running container.", "চলমান container নয়, image বা config ঠিক করুন।"]],
    m: ["Hot-fixing files inside production containers; leaving debugging tools in production images; running exec as root by default without need.", "Production container-এর ভিতরে file hot-fix; production image-এ debugging tool রেখে দেওয়া; দরকার ছাড়া ডিফল্ট root হিসেবে exec।"],
    q: ["Q: You exec into a container and edit appsettings.json; it works. Is the issue fixed? A: No. The next deploy or restart recreates the container from the image; fix the configuration source and redeploy.", "প্রশ্ন: Container-এ exec করে appsettings.json সম্পাদনা করলেন; কাজ করছে। সমস্যা কি ঠিক হলো? উত্তর: না। পরের deploy বা restart image থেকে container আবার বানায়; configuration-এর উৎস ঠিক করে আবার deploy করুন।"],
    f: ["Use exec to diagnose, then encode the fix in code or config. Immutable infrastructure is how reliable teams work.", "Exec দিয়ে রোগ নির্ণয় করুন, তারপর সমাধান code বা config-এ লিখুন। নির্ভরযোগ্য দল এভাবে অপরিবর্তনীয় infrastructure-এ কাজ করে।"],
    x: [sh("Debug inside a running container · চলমান container-এর ভিতরে debug", `docker exec redis redis-cli ping
docker exec -it hello-api sh -c 'printenv ASPNETCORE_ENVIRONMENT; ls /app | head -3'
docker exec -it hello-api sh -c 'wget -qO- http://localhost:8080/health'
# No shell in chiseled images? Use: docker debug hello-api`, `PONG
Development
appsettings.json
aspnetapp.dll
aspnetapp.deps.json
Healthy`)],
  },
  "docker logs": {
    s: ["Reading a ship's logbook to understand what happened on the voyage. docker logs shows what your containerised app wrote to stdout and stderr.", "যাত্রায় কী ঘটেছে বুঝতে জাহাজের logbook পড়া। docker logs আপনার container-এ থাকা app stdout ও stderr-এ যা লিখেছে তা দেখায়।"],
    t: ["Containers should log to stdout/stderr; Docker captures it with a logging driver. Useful flags: -f (follow), --tail 100, --since 10m, -t (timestamps). In production, ship logs to a central system (Loki, ELK, CloudWatch, Azure Monitor) because local logs disappear with the container and can fill disks without rotation.", "Container-এর উচিত stdout/stderr-এ log করা; Docker logging driver দিয়ে তা ধরে। দরকারি flag: -f (অনুসরণ), --tail 100, --since 10m, -t (সময়)। Production-এ log কেন্দ্রীয় system-এ (Loki, ELK, CloudWatch, Azure Monitor) পাঠান, কারণ local log container-এর সাথে হারায় এবং rotation ছাড়া disk ভরাতে পারে।"],
    p: [["See recent logs: docker logs --tail 50 name.", "সাম্প্রতিক log: docker logs --tail 50 name।"], ["Follow live: docker logs -f --since 5m name.", "সরাসরি অনুসরণ: docker logs -f --since 5m name।"], ["Filter: docker logs name 2>&1 | grep -i error.", "ছাঁকুন: docker logs name 2>&1 | grep -i error।"], ["Configure log rotation (max-size, max-file).", "Log rotation ঠিক করুন (max-size, max-file)।"]],
    m: ["Writing logs to files inside the container; no rotation, so json logs fill the disk; logging secrets.", "Container-এর ভিতরে file-এ log লেখা; rotation নেই, তাই json log disk ভরায়; secret log করা।"],
    q: ["Q: A container restarts every minute. How do you see why? A: docker logs --previous is for Kubernetes; in Docker use docker logs (it keeps logs across restarts of the same container) and docker inspect for the exit code.", "প্রশ্ন: একটি container প্রতি মিনিটে restart হয়। কেন দেখবেন কীভাবে? উত্তর: docker logs --previous Kubernetes-এর; Docker-এ docker logs (একই container-এর restart জুড়ে log রাখে) ও exit code-এর জন্য docker inspect দেখুন।"],
    f: ["Structured JSON logs (with trace IDs) make central search and AI-assisted log analysis far more effective.", "Structured JSON log (trace ID-সহ) কেন্দ্রীয় search ও AI-সহায়িত log বিশ্লেষণ অনেক বেশি কার্যকর করে।"],
    x: [sh("Tail, follow and filter container logs · log দেখা ও filter", `docker logs --tail 3 -t hello-api
docker logs --since 10m hello-api 2>&1 | grep -ci "error"
# daemon.json log rotation:
cat /etc/docker/daemon.json`, `2026-11-12T10:00:01.120Z info: Microsoft.Hosting.Lifetime[14] Now listening on: http://[::]:8080
2026-11-12T10:00:01.130Z info: Microsoft.Hosting.Lifetime[0] Application started.
2026-11-12T10:05:44.512Z fail: Shop.Api.Orders[0] Payment gateway timeout for order A-1042
1
{ "log-driver": "json-file", "log-opts": { "max-size": "10m", "max-file": "3" } }`)],
  },
  "docker stop": {
    s: ["Asking a shopkeeper to close for the day: they finish serving the current customer, lock the till and then leave. docker stop asks a container to shut down gracefully.", "দোকানিকে দিনের জন্য বন্ধ করতে বলা: বর্তমান ক্রেতাকে শেষ করে, ক্যাশ তালাবদ্ধ করে, তারপর যান। docker stop container-কে ভদ্রভাবে বন্ধ হতে বলে।"],
    t: ["docker stop sends SIGTERM to the main process, waits (default 10 seconds, change with -t), then sends SIGKILL. ASP.NET Core handles SIGTERM: it stops accepting new requests and finishes in-flight ones (HostOptions.ShutdownTimeout). Your app must run as PID 1 or use an init so signals arrive. docker kill sends SIGKILL immediately.", "docker stop প্রধান process-এ SIGTERM পাঠায়, অপেক্ষা করে (ডিফল্ট ১০ সেকেন্ড, -t দিয়ে বদলান), তারপর SIGKILL। ASP.NET Core SIGTERM সামলায়: নতুন request নেওয়া বন্ধ করে চলমানগুলো শেষ করে (HostOptions.ShutdownTimeout)। Signal পৌঁছাতে app-কে PID 1 হিসেবে চলতে হবে বা init ব্যবহার করতে হবে। docker kill সাথে সাথে SIGKILL পাঠায়।"],
    p: [["Stop gracefully: docker stop name.", "ভদ্রভাবে বন্ধ: docker stop name।"], ["Give long jobs more time: docker stop -t 30 name.", "দীর্ঘ কাজে বেশি সময়: docker stop -t 30 name।"], ["Check exit code is 0 (graceful) not 137 (killed).", "Exit code ০ (ভদ্র) কি না দেখুন, ১৩৭ (kill) নয়।"], ["Use exec-form ENTRYPOINT so signals reach the app.", "Signal app-এ পৌঁছাতে exec-form ENTRYPOINT দিন।"]],
    m: ["Shell-form ENTRYPOINT (sh -c) swallowing SIGTERM; always using docker kill; background workers that ignore cancellation tokens.", "Shell-form ENTRYPOINT (sh -c) SIGTERM গিলে ফেলে; সবসময় docker kill; cancellation token উপেক্ষা করা background worker।"],
    q: ["Q: Why does my container always take 10 seconds to stop? A: The process is not receiving SIGTERM (shell-form entrypoint) or ignores it, so Docker waits the full timeout and then kills it.", "প্রশ্ন: আমার container বন্ধ হতে সবসময় ১০ সেকেন্ড লাগে কেন? উত্তর: Process SIGTERM পায় না (shell-form entrypoint) বা উপেক্ষা করে, তাই Docker পুরো timeout অপেক্ষা করে তারপর kill করে।"],
    f: ["Graceful shutdown is essential for zero-downtime deploys and for AI workers that must finish or checkpoint a long job before stopping.", "Zero-downtime deploy-এর জন্য এবং বন্ধের আগে দীর্ঘ কাজ শেষ বা checkpoint করতে হয় এমন AI worker-এর জন্য graceful shutdown অপরিহার্য।"],
    x: [sh("Graceful stop and its exit code · ভদ্র বন্ধ ও exit code", `# SIGTERM first, SIGKILL only after the timeout
time docker stop hello-api
docker inspect --format '{{.State.ExitCode}}' hello-api
docker logs --tail 2 hello-api`, `hello-api
real	0m0.84s
0
info: Microsoft.Hosting.Lifetime[0] Application is shutting down...
# Fast stop + exit code 0 = SIGTERM handled correctly`)],
  },
  "docker start": {
    s: ["Reopening a shop the next morning with the same shelves and stock as yesterday. docker start restarts an existing stopped container with its configuration and writable layer intact.", "পরদিন সকালে গতকালের একই তাক ও মালসহ দোকান আবার খোলা। docker start একটি বন্ধ container-কে তার configuration ও লেখার স্তর অক্ষত রেখে আবার চালু করে।"],
    t: ["docker start reuses an existing container; docker run creates a new one. Start keeps the same ID, name, port mappings and any files written inside. Use -a to attach and see output. In practice, containers are treated as disposable: you more often run a fresh container from a new image than start an old one.", "docker start বিদ্যমান container পুনর্ব্যবহার করে; docker run নতুন বানায়। Start একই ID, নাম, port mapping ও ভিতরে লেখা file রাখে। Output দেখতে -a দিন। বাস্তবে container ফেলে দেওয়ার মতো ধরা হয়: পুরনো চালু করার চেয়ে প্রায়ই নতুন image থেকে নতুন container চালান।"],
    p: [["List stopped containers: docker ps -a.", "বন্ধ container-এর তালিকা: docker ps -a।"], ["Start one: docker start name.", "একটি চালু করুন: docker start name।"], ["Restart quickly: docker restart name.", "দ্রুত restart: docker restart name।"], ["Prefer recreating from images for updates.", "আপডেটে image থেকে আবার বানানো পছন্দ করুন।"]],
    m: ["Expecting docker start to pick up a new image (it does not); relying on files inside old containers; port conflicts because another container now uses the port.", "docker start নতুন image নেবে আশা করা (নেয় না); পুরনো container-এর ভিতরের file-এর উপর নির্ভর; port conflict, কারণ অন্য container এখন port ব্যবহার করছে।"],
    q: ["Q: I rebuilt the image but docker start shows the old version. Why? A: The container was created from the old image; remove it and docker run a new container from the new image (or use compose up).", "প্রশ্ন: Image আবার build করলাম কিন্তু docker start পুরনো version দেখায়। কেন? উত্তর: Container পুরনো image থেকে তৈরি; সেটি সরিয়ে নতুন image থেকে docker run দিয়ে নতুন container চালান (বা compose up)।"],
    f: ["Think 'cattle, not pets': containers are replaceable. This mindset makes scaling, deployments and recovery simple.", "'পোষা প্রাণী নয়, গবাদি পশু' ভাবুন: container বদলযোগ্য। এই মানসিকতা scaling, deployment ও পুনরুদ্ধার সহজ করে।"],
    x: [sh("Start vs run: same container vs new one · একই বনাম নতুন container", `docker start hello-api
docker ps --filter name=hello-api --format "{{.ID}} {{.Image}} {{.Status}}"
docker build -t aspnetapp:2 . -q >/dev/null
docker rm -f hello-api && docker run -d --name hello-api -p 8080:8080 aspnetapp:2 >/dev/null
docker ps --filter name=hello-api --format "{{.ID}} {{.Image}} {{.Status}}"`, `hello-api
5f2c9b1a7d3e mcr.microsoft.com/dotnet/samples:aspnetapp Up 1 second
hello-api
8a7b6c5d4e3f aspnetapp:2 Up 1 second`)],
  },
  "docker rm": {
    s: ["Clearing away an empty tiffin box after lunch so the table stays tidy. docker rm deletes containers you no longer need.", "দুপুরের খাবারের পরে খালি টিফিন বক্স সরিয়ে টেবিল পরিষ্কার রাখা। docker rm অপ্রয়োজনীয় container মুছে ফেলে।"],
    t: ["docker rm removes stopped containers (and their writable layer). -f forces removal of a running container (SIGKILL). -v also removes anonymous volumes. Named volumes are kept, so data survives. Use --rm on docker run for throwaway containers so they clean up automatically.", "docker rm বন্ধ container (ও তাদের লেখার স্তর) মুছে ফেলে। -f চলমান container জোর করে সরায় (SIGKILL)। -v anonymous volume-ও সরায়। নামযুক্ত volume থেকে যায়, তাই data টিকে থাকে। ফেলে দেওয়ার container-এ docker run-এ --rm দিন, যাতে নিজে থেকেই পরিষ্কার হয়।"],
    p: [["List stopped containers.", "বন্ধ container-এর তালিকা দেখুন।"], ["Remove one: docker rm name.", "একটি সরান: docker rm name।"], ["Remove all stopped: docker container prune.", "সব বন্ধ সরান: docker container prune।"], ["Use --rm for one-off runs.", "এককালীন চালানোয় --rm দিন।"]],
    m: ["Using -f on databases without stopping them cleanly; deleting containers that hold data not stored in volumes; scripts that remove all containers on shared machines.", "পরিষ্কারভাবে বন্ধ না করে database-এ -f; volume-এ রাখা হয়নি এমন data-সহ container মোছা; শেয়ার machine-এ সব container সরানো script।"],
    q: ["Q: After docker rm, is my PostgreSQL data gone? A: Only if it lived in the container's writable layer or an anonymous volume removed with -v. Data in a named volume or bind mount remains.", "প্রশ্ন: docker rm-এর পরে আমার PostgreSQL data কি হারিয়ে গেছে? উত্তর: শুধু যদি container-এর লেখার স্তরে বা -v দিয়ে মোছা anonymous volume-এ থাকত। নামযুক্ত volume বা bind mount-এর data থাকে।"],
    f: ["Ephemeral containers plus external state (volumes, managed databases, object storage) is the pattern behind every modern platform, including AI workloads.", "অস্থায়ী container ও বাইরের state (volume, managed database, object storage)-ই প্রতিটি আধুনিক platform-এর pattern, AI workload-সহ।"],
    x: [sh("Remove containers safely · নিরাপদে container মোছা", `docker run --rm alpine echo "temporary task done"
docker ps -a --filter status=exited --format "{{.Names}}"
docker container prune -f
docker volume ls --format "{{.Name}}" | grep pgdata`, `temporary task done
worker
old-test
Deleted Containers:
3c4d...
9e8f...
Total reclaimed space: 12.4MB
pgdata`)],
  },
  "docker rmi": {
    s: ["Throwing out old recipe cards you will never cook again, but only if no dish on the table still uses them. docker rmi removes images not used by containers.", "আর কখনো রাঁধবেন না এমন পুরনো recipe কার্ড ফেলে দেওয়া, তবে শুধু যদি টেবিলের কোনো পদ এখনো তা ব্যবহার না করে। docker rmi container ব্যবহার করে না এমন image সরায়।"],
    t: ["docker rmi image removes an image (tag) if no container uses it. If several tags point to the same image ID, removing one only untags. docker image prune removes dangling images; -a removes all unused images. Build servers and laptops fill up quickly, so prune regularly.", "docker rmi image একটি image (tag) সরায়, যদি কোনো container তা ব্যবহার না করে। একাধিক tag একই image ID-তে থাকলে একটি সরালে শুধু tag সরে। docker image prune dangling image সরায়; -a সব অব্যবহৃত image সরায়। Build server ও laptop দ্রুত ভরে যায়, তাই নিয়মিত prune করুন।"],
    p: [["List images and sizes.", "Image ও আকারের তালিকা দেখুন।"], ["Remove a specific tag: docker rmi shop-api:1.2.0.", "নির্দিষ্ট tag সরান: docker rmi shop-api:1.2.0।"], ["Remove dangling images: docker image prune -f.", "Dangling image সরান: docker image prune -f।"], ["Check space: docker system df.", "জায়গা দেখুন: docker system df।"]],
    m: ["Trying to remove images used by stopped containers (remove containers first); pruning -a on a machine that needs cached images for fast deploys.", "বন্ধ container ব্যবহার করা image সরানোর চেষ্টা (আগে container সরান); দ্রুত deploy-এর জন্য cache-করা image লাগে এমন machine-এ prune -a।"],
    q: ["Q: docker rmi says 'image is being used by stopped container'. What now? A: Remove that container (docker rm) first, or use -f knowing the container becomes unusable.", "প্রশ্ন: docker rmi বলে 'image is being used by stopped container'। এখন? উত্তর: আগে সেই container সরান (docker rm), বা container অব্যবহারযোগ্য হবে জেনে -f দিন।"],
    f: ["AI images (CUDA, model weights) can be many gigabytes. Disciplined image cleanup and small base images save real money on CI and servers.", "AI image (CUDA, model weight) অনেক গিগাবাইটের হতে পারে। শৃঙ্খলাবদ্ধ image পরিষ্কার ও ছোট base image CI ও server-এ আসল টাকা বাঁচায়।"],
    x: [sh("Clean up old image versions · পুরনো image version পরিষ্কার", `docker images shop-api --format "{{.Tag}} {{.Size}}"
docker rmi shop-api:1.2.0 shop-api:1.3.0
docker image prune -f
docker system df --format "{{.Type}}: {{.Size}} (reclaimable {{.Reclaimable}})" | head -1`, `1.4.0 118MB
1.3.0 118MB
1.2.0 117MB
Untagged: shop-api:1.2.0
Deleted: sha256:aa11...
Untagged: shop-api:1.3.0
Deleted: sha256:bb22...
Total reclaimed space: 0B
Images: 1.2GB (reclaimable 310MB (25%))`)],
  },
  "docker inspect": {
    s: ["The full medical report of a patient: blood group, history, medicines, allergies. docker inspect prints every detail Docker knows about a container, image, network or volume.", "রোগীর পূর্ণ medical report: রক্তের গ্রুপ, ইতিহাস, ওষুধ, allergy। docker inspect একটি container, image, network বা volume সম্পর্কে Docker যা জানে সব বিস্তারিত দেখায়।"],
    t: ["docker inspect returns JSON: state (running, exit code, OOMKilled, health), config (env, command, user), network settings (IP, ports), mounts and image digest. Use --format with Go templates to extract one field, or pipe to jq. It is the first tool when a container behaves unexpectedly.", "docker inspect JSON দেয়: অবস্থা (চলমান, exit code, OOMKilled, health), config (env, command, user), network setting (IP, port), mount ও image digest। একটি field বের করতে Go template-সহ --format দিন, বা jq-তে পাঠান। Container অপ্রত্যাশিত আচরণ করলে এটিই প্রথম tool।"],
    p: [["Inspect state: --format '{{json .State}}'.", "অবস্থা দেখুন: --format '{{json .State}}'।"], ["Check environment and command.", "Environment ও command দেখুন।"], ["Check mounts and ports.", "Mount ও port দেখুন।"], ["Check health check results.", "Health check-এর ফল দেখুন।"]],
    m: ["Reading the whole JSON by eye instead of formatting; printing environment variables that contain secrets into shared logs.", "Format না করে পুরো JSON চোখে পড়া; secret-যুক্ত environment variable শেয়ার log-এ print।"],
    q: ["Q: How do you get a container's IP and health status quickly? A: docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}} {{.State.Health.Status}}' name.", "প্রশ্ন: Container-এর IP ও health status দ্রুত কীভাবে পাবেন? উত্তর: docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}} {{.State.Health.Status}}' name।"],
    f: ["kubectl describe and cloud consoles show the same kinds of fields. Learning to read inspect output transfers directly to Kubernetes debugging.", "kubectl describe ও cloud console একই ধরনের field দেখায়। Inspect output পড়া শিখলে সরাসরি Kubernetes debugging-এ কাজে লাগে।"],
    x: [sh("Extract exactly what you need · ঠিক যা দরকার বের করা", `docker inspect -f '{{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}}' hello-api
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' hello-api
docker inspect -f '{{json .HostConfig.PortBindings}}' hello-api
docker inspect -f '{{.State.Health.Status}}' hello-api`, `running exit=0 oom=false
172.17.0.3
{"8080/tcp":[{"HostIp":"","HostPort":"8080"}]}
healthy`)],
  },
  "docker network ls": {
    s: ["Phone networks in a building: departments on the same internal line can call each other by extension name; outsiders cannot. Docker networks let containers talk to each other by name.", "ভবনের ফোন network: একই ভিতরের লাইনের বিভাগ extension-এর নাম ধরে একে অপরকে ডাকতে পারে; বাইরের কেউ পারে না। Docker network container-কে নাম ধরে একে অপরের সাথে কথা বলতে দেয়।"],
    t: ["Docker creates bridge (default), host and none networks. User-defined bridge networks provide automatic DNS: containers reach each other by container name (api -> db:5432). Only published ports (-p) are reachable from the host. Compose creates a network per project automatically. Separate networks isolate tiers (frontend, backend).", "Docker bridge (ডিফল্ট), host ও none network বানায়। নিজে বানানো bridge network স্বয়ংক্রিয় DNS দেয়: container নাম ধরে একে অপরকে পায় (api -> db:5432)। শুধু প্রকাশিত port (-p) host থেকে পৌঁছানো যায়। Compose প্রতিটি project-এর জন্য স্বয়ংক্রিয়ভাবে network বানায়। আলাদা network স্তর আলাদা রাখে (frontend, backend)।"],
    p: [["Create a network: docker network create shop-net.", "Network বানান: docker network create shop-net।"], ["Run containers with --network shop-net.", "--network shop-net দিয়ে container চালান।"], ["Connect by name (Host=db).", "নাম ধরে যুক্ত হন (Host=db)।"], ["Inspect: docker network inspect shop-net.", "দেখুন: docker network inspect shop-net।"]],
    m: ["Using localhost inside a container to reach another container (localhost is the container itself); publishing database ports to the internet; relying on the default bridge (no DNS by name).", "অন্য container-এ পৌঁছাতে container-এর ভিতরে localhost (localhost হলো container নিজেই); database port internet-এ প্রকাশ; ডিফল্ট bridge-এর উপর নির্ভর (নামে DNS নেই)।"],
    q: ["Q: My API container cannot connect to 'localhost:5432'. Why? A: localhost refers to the API container itself. Put both on one user-defined network and use the database container's name as host.", "প্রশ্ন: আমার API container 'localhost:5432'-এ যুক্ত হতে পারে না। কেন? উত্তর: localhost মানে API container নিজেই। দুটোকে এক নিজে-বানানো network-এ দিন এবং host হিসেবে database container-এর নাম দিন।"],
    f: ["Service-to-service networking by name is the foundation of Kubernetes Services and service meshes. Docker networks are the friendly first step.", "নাম ধরে service-থেকে-service networking Kubernetes Service ও service mesh-এর ভিত্তি। Docker network বন্ধুসুলভ প্রথম ধাপ।"],
    x: [sh("Containers talking by name on a network · নাম ধরে container-এর যোগাযোগ", `docker network create shop-net
docker run -d --name db --network shop-net -e POSTGRES_PASSWORD=dev postgres:17
docker run --rm --network shop-net postgres:17 sh -c 'sleep 3; pg_isready -h db -p 5432'
docker network ls --format "{{.Name}} {{.Driver}}" | grep -E "bridge|shop"`, `7e3c1f...
4b9a2d...
db:5432 - accepting connections
bridge bridge
shop-net bridge`)],
  },
  "docker volume ls": {
    s: ["A safe-deposit box at the bank: you can change houses (containers) many times, but your valuables stay in the box. Volumes keep data outside the container's life.", "ব্যাংকের লকার: অনেকবার বাড়ি (container) বদলাতে পারেন, কিন্তু মূল্যবান জিনিস লকারে থাকে। Volume container-এর জীবনের বাইরে data রাখে।"],
    t: ["Named volumes are managed by Docker and survive container removal; mount them with -v name:/path. Bind mounts map a host folder (-v $(pwd):/app), great for development. tmpfs mounts live in memory. docker volume ls lists volumes; inspect shows where they live; back up volumes with a temporary container and tar.", "Named volume Docker পরিচালনা করে এবং container মুছলেও টিকে থাকে; -v name:/path দিয়ে mount করুন। Bind mount host-এর folder মেলায় (-v $(pwd):/app), development-এ দারুণ। tmpfs mount memory-তে থাকে। docker volume ls volume-এর তালিকা দেয়; inspect কোথায় আছে দেখায়; অস্থায়ী container ও tar দিয়ে volume backup করুন।"],
    p: [["Create: docker volume create pgdata.", "বানান: docker volume create pgdata।"], ["Mount: -v pgdata:/var/lib/postgresql/data.", "Mount করুন: -v pgdata:/var/lib/postgresql/data।"], ["List and inspect volumes.", "Volume-এর তালিকা ও বিস্তারিত দেখুন।"], ["Back up with a tar container.", "Tar container দিয়ে backup করুন।"]],
    m: ["Losing data by not using a volume; deleting volumes with docker volume prune by accident; bind-mounting over folders that the image needs.", "Volume না দিয়ে data হারানো; ভুলে docker volume prune দিয়ে volume মোছা; image-এর দরকারি folder-এর উপর bind-mount।"],
    q: ["Q: Volume vs bind mount? A: A volume is managed by Docker, portable and best for production data; a bind mount maps a specific host path, best for development source code.", "প্রশ্ন: Volume বনাম bind mount? উত্তর: Volume Docker পরিচালনা করে, বহনযোগ্য এবং production data-র জন্য সেরা; bind mount নির্দিষ্ট host path মেলায়, development-এর source code-এর জন্য সেরা।"],
    f: ["Local vector databases and model caches (Ollama models) are stored in volumes too. Name them clearly and back them up like any data.", "Local vector database ও model cache (Ollama model)-ও volume-এ থাকে। স্পষ্ট নাম দিন এবং অন্য যেকোনো data-র মতো backup করুন।"],
    x: [sh("Persist and back up a database volume · database volume রাখা ও backup", `docker volume create pgdata
docker run -d --name db -e POSTGRES_PASSWORD=dev -v pgdata:/var/lib/postgresql/data postgres:17
docker rm -f db && docker volume ls --format "{{.Name}}" | grep pgdata
docker run --rm -v pgdata:/data -v "$(pwd)":/backup alpine tar czf /backup/pgdata.tgz -C /data .
ls -lh pgdata.tgz | awk '{print $5, $9}'`, `pgdata
3d2c...
db
pgdata
39M pgdata.tgz`)],
  },
  "docker tag": {
    s: ["Putting a new label on a parcel with the destination address before posting. docker tag gives an image another name that includes the registry and version.", "পাঠানোর আগে parcel-এ গন্তব্যের ঠিকানাসহ নতুন label লাগানো। docker tag image-কে আরেকটি নাম দেয়, যাতে registry ও version থাকে।"],
    t: ["A full image name is registry/namespace/repository:tag (ghcr.io/eftekher/shop-api:1.4.0). docker tag source target adds a name without copying data. Use semantic versions plus the git commit SHA for traceability; avoid relying on latest. Tags are mutable; digests are not.", "পূর্ণ image নাম হলো registry/namespace/repository:tag (ghcr.io/eftekher/shop-api:1.4.0)। docker tag source target data কপি না করে একটি নাম যোগ করে। খুঁজে পেতে semantic version ও git commit SHA দিন; latest-এর উপর নির্ভর করবেন না। Tag পরিবর্তনশীল; digest নয়।"],
    p: [["Build with a local name.", "Local নামে build করুন।"], ["Tag for the registry with version and SHA.", "Version ও SHA-সহ registry-র জন্য tag দিন।"], ["Verify both names share one image ID.", "দুটি নাম একই image ID শেয়ার করে যাচাই করুন।"], ["Push the tags.", "Tag push করুন।"]],
    m: ["Overwriting a release tag with different content; only tagging latest; typos in registry hostnames.", "ভিন্ন content দিয়ে release tag overwrite; শুধু latest tag; registry hostname-এ টাইপো।"],
    q: ["Q: Why tag images with the git SHA? A: It links a running container back to the exact commit, making debugging and rollbacks precise.", "প্রশ্ন: Git SHA দিয়ে image tag কেন? উত্তর: চলমান container-কে সঠিক commit-এর সাথে যুক্ত করে, debugging ও rollback নির্ভুল করে।"],
    f: ["Automate tagging in CI (version + SHA + branch). Humans should never hand-tag production images in 2028-era pipelines.", "CI-তে tagging স্বয়ংক্রিয় করুন (version + SHA + branch)। ২০২৮-যুগের pipeline-এ মানুষ কখনো হাতে production image tag করবে না।"],
    x: [sh("Tag with version and commit SHA · version ও commit SHA দিয়ে tag", `SHA=$(git rev-parse --short HEAD)
docker tag shop-api:1.4.0 ghcr.io/eftekher/shop-api:1.4.0
docker tag shop-api:1.4.0 ghcr.io/eftekher/shop-api:sha-$SHA
docker images --format "{{.Repository}}:{{.Tag}} {{.ID}}" | grep shop-api`, `shop-api:1.4.0 8a7b6c5d4e3f
ghcr.io/eftekher/shop-api:1.4.0 8a7b6c5d4e3f
ghcr.io/eftekher/shop-api:sha-7c9e2d1 8a7b6c5d4e3f
# Same ID: tags are just names for one image`)],
  },
  "docker push": {
    s: ["Uploading a finished video to YouTube so anyone with the link can watch it. docker push uploads your image to a registry so servers and teammates can pull it.", "শেষ করা video YouTube-এ upload করা, যাতে link-ধারী যে কেউ দেখতে পারে। docker push আপনার image registry-তে upload করে, যাতে server ও সহকর্মী pull করতে পারে।"],
    t: ["docker push uploads layers the registry does not already have, then the manifest. You must be logged in and the image must be tagged with the registry name. Registries can scan images, enforce immutability of tags, and replicate to regions. CI usually builds, scans and pushes on every merge to main.", "docker push registry-তে না থাকা স্তর upload করে, তারপর manifest। আপনাকে login থাকতে হবে এবং image registry-র নামে tag করা থাকতে হবে। Registry image scan করতে, tag-এর অপরিবর্তনীয়তা প্রয়োগ করতে ও region-এ replicate করতে পারে। CI সাধারণত main-এ প্রতিটি merge-এ build, scan ও push করে।"],
    p: [["docker login to the registry.", "Registry-তে docker login করুন।"], ["Tag with the registry path.", "Registry path দিয়ে tag দিন।"], ["docker push each tag.", "প্রতিটি tag docker push করুন।"], ["Verify the digest and scan results in the registry.", "Registry-তে digest ও scan-এর ফল যাচাই করুন।"]],
    m: ["Pushing images with secrets baked in; pushing from laptops instead of CI; public repositories by mistake.", "ভিতরে secret-সহ image push; CI-এর বদলে laptop থেকে push; ভুলে public repository।"],
    q: ["Q: 'denied: requested access to the resource is denied' on push. Causes? A: Not logged in, wrong registry name/namespace in the tag, or the token lacks write permission (e.g., packages:write on GHCR).", "প্রশ্ন: Push-এ 'denied: requested access to the resource is denied'। কারণ? উত্তর: Login নেই, tag-এ ভুল registry নাম/namespace, বা token-এ লেখার অনুমতি নেই (যেমন GHCR-এ packages:write)।"],
    f: ["Sign images on push (cosign) and attach an SBOM; deployment platforms increasingly verify signatures before running containers.", "Push-এর সময় image sign করুন (cosign) এবং SBOM যুক্ত করুন; deployment platform ক্রমশ container চালানোর আগে স্বাক্ষর যাচাই করে।"],
    x: [sh("Push to GitHub Container Registry · GHCR-এ push", `# CI usually does this after build + scan
echo "$GITHUB_TOKEN" | docker login ghcr.io -u eftekher --password-stdin
docker push ghcr.io/eftekher/shop-api:1.4.0
docker push ghcr.io/eftekher/shop-api:sha-7c9e2d1`, `Login Succeeded
The push refers to repository [ghcr.io/eftekher/shop-api]
5f70bf18a086: Pushed
a3ed95caeb02: Layer already exists
1.4.0: digest: sha256:9c1d... size: 1789
sha-7c9e2d1: digest: sha256:9c1d... size: 1789`)],
  },
  "docker login": {
    s: ["Showing your membership card at a private library before borrowing books. docker login stores credentials so Docker can pull and push private images.", "বই ধার নেওয়ার আগে private library-তে সদস্য কার্ড দেখানো। docker login credential রাখে, যাতে Docker private image pull ও push করতে পারে।"],
    t: ["docker login registry authenticates and stores credentials in ~/.docker/config.json, ideally via a credential helper (OS keychain) rather than plain base64. Use --password-stdin to avoid passwords in shell history. In CI, use short-lived tokens or OIDC (GitHub Actions to AWS/Azure) instead of long-lived passwords.", "docker login registry authentication করে এবং credential ~/.docker/config.json-এ রাখে, ভালো হয় সাধারণ base64-এর বদলে credential helper (OS keychain) দিয়ে। Shell history-তে password এড়াতে --password-stdin দিন। CI-তে দীর্ঘস্থায়ী password-এর বদলে স্বল্পমেয়াদি token বা OIDC (GitHub Actions থেকে AWS/Azure) ব্যবহার করুন।"],
    p: [["Create a token with the minimum scopes.", "ন্যূনতম scope-সহ token বানান।"], ["Log in with --password-stdin.", "--password-stdin দিয়ে login করুন।"], ["Use a credential helper on laptops.", "Laptop-এ credential helper ব্যবহার করুন।"], ["Log out on shared machines: docker logout.", "শেয়ার machine-এ logout: docker logout।"]],
    m: ["docker login -p password (visible in history and process list); personal passwords in CI; tokens with admin scope.", "docker login -p password (history ও process তালিকায় দেখা যায়); CI-তে ব্যক্তিগত password; admin scope-সহ token।"],
    q: ["Q: How should GitHub Actions push to AWS ECR without stored keys? A: Use OIDC: the workflow assumes an IAM role via aws-actions/configure-aws-credentials, then logs in to ECR with a temporary token.", "প্রশ্ন: সংরক্ষিত key ছাড়া GitHub Actions কীভাবে AWS ECR-এ push করবে? উত্তর: OIDC দিন: workflow aws-actions/configure-aws-credentials দিয়ে IAM role নেয়, তারপর অস্থায়ী token দিয়ে ECR-এ login করে।"],
    f: ["Keyless authentication (OIDC, workload identity) is now standard. Expect interviewers to ask how your pipeline authenticates without secrets.", "Keyless authentication (OIDC, workload identity) এখন মানক। Secret ছাড়া আপনার pipeline কীভাবে authentication করে interviewer জিজ্ঞেস করবেন আশা করুন।"],
    x: [sh("Safe login patterns · নিরাপদ login-এর ধরন", `# Never: docker login -u me -p MyPassword
echo "$GHCR_TOKEN" | docker login ghcr.io -u eftekher --password-stdin
# AWS ECR with a temporary token
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.ap-south-1.amazonaws.com
docker logout ghcr.io`, `Login Succeeded
Login Succeeded
Removing login credentials for ghcr.io`)],
  },
  "compose up -d": {
    s: ["Hosting a dinner where one host invites the cook, the waiter and the musician with one phone call, each knowing where to stand. Docker Compose starts your whole app stack (API, database, cache) with one command.", "একটি নৈশভোজ, যেখানে একজন আয়োজক এক ফোনে রাঁধুনি, ওয়েটার ও সংগীতশিল্পীকে ডাকেন, প্রত্যেকে জানে কোথায় দাঁড়াবে। Docker Compose একটি command-এ আপনার পুরো app stack (API, database, cache) চালু করে।"],
    t: ["compose.yaml declares services, images or builds, ports, environment, volumes, networks, health checks and dependencies. docker compose up -d builds if needed, creates a project network and starts everything in the background. depends_on with condition: service_healthy waits for the database to be ready. Use .env files for local settings and profiles for optional services.", "compose.yaml service, image বা build, port, environment, volume, network, health check ও dependency ঘোষণা করে। docker compose up -d দরকারে build করে, project network বানায় এবং সব পিছনে চালু করে। condition: service_healthy-সহ depends_on database প্রস্তুত হওয়া পর্যন্ত অপেক্ষা করে। Local setting-এর জন্য .env file আর ঐচ্ছিক service-এর জন্য profile ব্যবহার করুন।"],
    p: [["Write compose.yaml with api, db and cache.", "api, db ও cache-সহ compose.yaml লিখুন।"], ["Add health checks and depends_on conditions.", "Health check ও depends_on শর্ত দিন।"], ["docker compose up -d --build.", "চালু করুন: docker compose up -d --build।"], ["Check docker compose ps and logs.", "docker compose ps ও logs দেখুন।"]],
    m: ["Hard-coding secrets in compose.yaml committed to Git; depends_on without health checks (app starts before DB is ready); using compose files as production orchestration for large systems.", "Git-এ commit করা compose.yaml-এ secret; health check ছাড়া depends_on (DB প্রস্তুতের আগে app চালু); বড় system-এ production orchestration হিসেবে compose file।"],
    q: ["Q: The API crashes on startup because Postgres is not ready. Fix? A: Add a healthcheck to the db service and depends_on: db: condition: service_healthy; also add retry logic in the app.", "প্রশ্ন: Postgres প্রস্তুত না থাকায় API startup-এ crash করে। সমাধান? উত্তর: db service-এ healthcheck ও depends_on: db: condition: service_healthy দিন; app-এও retry যুক্তি যোগ করুন।"],
    f: ["Compose is the fastest way to run a local AI stack: API + Postgres/pgvector + Redis + Ollama. .NET Aspire offers a C#-first alternative for the same job.", "Local AI stack চালানোর দ্রুততম উপায় Compose: API + Postgres/pgvector + Redis + Ollama। একই কাজের জন্য .NET Aspire C#-প্রথম বিকল্প দেয়।"],
    x: [file("yaml", "API + Postgres + Redis + Ollama stack · compose stack", `services:
  api:
    build: ./Shop.Api
    ports: ["8080:8080"]
    environment:
      ConnectionStrings__Shop: Host=db;Database=shop;Username=app;Password=\${DB_PASSWORD}
      Redis: cache:6379
      Ai__OllamaUrl: http://ollama:11434
    depends_on:
      db: { condition: service_healthy }
      cache: { condition: service_started }
  db:
    image: pgvector/pgvector:pg17
    environment: { POSTGRES_DB: shop, POSTGRES_USER: app, POSTGRES_PASSWORD: \${DB_PASSWORD} }
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d shop"]
      interval: 5s
      retries: 10
  cache:
    image: redis:7.4
  ollama:
    image: ollama/ollama
    volumes: [ollama:/root/.ollama]
    profiles: ["ai"]          # start with: docker compose --profile ai up -d
volumes:
  pgdata:
  ollama:`, undefined, "compose.yaml")],
  },
  "compose down": {
    s: ["After the dinner, the host thanks everyone and they go home, but the pantry stays stocked for next time unless you say 'empty the pantry too'. compose down stops and removes the stack; volumes stay unless you add -v.", "নৈশভোজের পরে আয়োজক সবাইকে ধন্যবাদ দেন, সবাই বাড়ি যায়, কিন্তু ভাঁড়ার পরের বারের জন্য ভরা থাকে, যদি না বলেন 'ভাঁড়ারও খালি করো'। compose down stack থামিয়ে সরায়; -v না দিলে volume থাকে।"],
    t: ["docker compose down stops and removes containers and the project network. Named volumes are kept by default (data safe); -v removes them; --rmi local removes images built by compose. docker compose stop only stops containers without removing them. Use down -v for a clean reset of test data, never on data you need.", "docker compose down container ও project network থামিয়ে সরায়। Named volume ডিফল্টভাবে থাকে (data নিরাপদ); -v সেগুলো সরায়; --rmi local compose-এর বানানো image সরায়। docker compose stop শুধু container থামায়, সরায় না। Test data পরিষ্কার reset-এ down -v দিন, দরকারি data-য় কখনো নয়।"],
    p: [["Stop and remove: docker compose down.", "থামিয়ে সরান: docker compose down।"], ["Confirm volumes still exist.", "Volume এখনো আছে নিশ্চিত করুন।"], ["Reset test data: docker compose down -v.", "Test data নতুন করে শুরু: docker compose down -v।"], ["Start again: docker compose up -d.", "আবার চালু: docker compose up -d।"]],
    m: ["Running down -v and losing a local database you cared about; confusing stop with down; leaving orphan containers from renamed services (use --remove-orphans).", "down -v চালিয়ে দরকারি local database হারানো; stop ও down গুলিয়ে ফেলা; নাম বদলানো service-এর orphan container রেখে দেওয়া (--remove-orphans দিন)।"],
    q: ["Q: How do you give every integration test run a clean database with compose? A: docker compose -p test-$RUN up -d before tests and docker compose -p test-$RUN down -v after, so each run has isolated volumes.", "প্রশ্ন: Compose দিয়ে প্রতিটি integration test-কে কীভাবে পরিষ্কার database দেবেন? উত্তর: Test-এর আগে docker compose -p test-$RUN up -d আর পরে docker compose -p test-$RUN down -v, যাতে প্রতিটি run-এর আলাদা volume থাকে।"],
    f: ["Testcontainers for .NET automates this pattern from inside tests (spin up Postgres per test class). It is widely used for reliable integration tests.", "Testcontainers for .NET test-এর ভিতর থেকেই এই pattern স্বয়ংক্রিয় করে (test class-প্রতি Postgres চালু)। নির্ভরযোগ্য integration test-এ ব্যাপকভাবে ব্যবহৃত।"],
    x: [sh("Down keeps volumes; down -v removes them · down বনাম down -v", `docker compose down
docker volume ls --format "{{.Name}}" | grep pgdata
docker compose up -d && docker compose down -v --remove-orphans
docker volume ls --format "{{.Name}}" | grep -c pgdata`, ` Container shop-api-1  Removed
 Container shop-db-1   Removed
 Network shop_default  Removed
shop_pgdata
 Volume shop_pgdata  Removed
0`)],
  },
  "system prune": {
    s: ["Spring cleaning: throwing out broken chairs, empty boxes and old newspapers that pile up in the storeroom. docker system prune clears unused containers, networks, images and build cache.", "বসন্তকালীন পরিষ্কার: গুদামে জমা ভাঙা চেয়ার, খালি বাক্স ও পুরনো পত্রিকা ফেলে দেওয়া। docker system prune অব্যবহৃত container, network, image ও build cache পরিষ্কার করে।"],
    t: ["docker system df shows disk usage by images, containers, volumes and build cache. docker system prune removes stopped containers, unused networks, dangling images and dangling build cache. -a also removes all unused images; --volumes also removes unused volumes (data!). Add --filter until=168h to keep recent items. Automate on CI runners.", "docker system df image, container, volume ও build cache অনুযায়ী disk ব্যবহার দেখায়। docker system prune বন্ধ container, অব্যবহৃত network, dangling image ও dangling build cache সরায়। -a সব অব্যবহৃত image-ও সরায়; --volumes অব্যবহৃত volume-ও সরায় (data!)। সাম্প্রতিক জিনিস রাখতে --filter until=168h দিন। CI runner-এ স্বয়ংক্রিয় করুন।"],
    p: [["Check usage: docker system df.", "ব্যবহার দেখুন: docker system df।"], ["Safe cleanup: docker system prune -f.", "নিরাপদ পরিষ্কার: docker system prune -f।"], ["Deeper cleanup: add -a with a time filter.", "গভীর পরিষ্কার: সময়ের filter-সহ -a দিন।"], ["Only use --volumes when you are sure.", "নিশ্চিত হলেই শুধু --volumes দিন।"]],
    m: ["Running prune -a --volumes on a machine with important local databases; pruning on production hosts during deploys; never pruning CI runners until disks fill.", "গুরুত্বপূর্ণ local database-সহ machine-এ prune -a --volumes; deploy-এর সময় production host-এ prune; disk না ভরা পর্যন্ত CI runner-এ কখনো prune না করা।"],
    q: ["Q: Disk is 95% full on a build server. Steps? A: docker system df to see what is large, docker builder prune for build cache, docker image prune -a --filter until=72h, then add a scheduled cleanup job.", "প্রশ্ন: Build server-এ disk ৯৫% ভরা। ধাপ? উত্তর: কী বড় দেখতে docker system df, build cache-এর জন্য docker builder prune, docker image prune -a --filter until=72h, তারপর নির্ধারিত পরিষ্কারের job যোগ।"],
    f: ["Model and GPU images are huge, so disciplined cleanup policies on AI build machines save significant cost and avoid failed builds.", "Model ও GPU image বিশাল, তাই AI build machine-এ শৃঙ্খলাবদ্ধ পরিষ্কার নীতি উল্লেখযোগ্য খরচ বাঁচায় এবং ব্যর্থ build এড়ায়।"],
    x: [sh("Measure, then prune safely · মেপে নিরাপদে prune", `docker system df
docker system prune -f --filter "until=168h"
docker builder prune -f --filter "until=72h" | tail -1
docker system df --format "{{.Type}} {{.Size}}" | head -2`, `TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          34        6         14.2GB    10.9GB (76%)
Containers      9         3         120MB     88MB (73%)
Local Volumes   5         3         2.1GB     400MB (19%)
Build Cache     212       0         6.8GB     6.8GB
Total reclaimed space: 1.9GB
Total:	5.3GB
Images 12.3GB
Containers 32MB`)],
  },
};
