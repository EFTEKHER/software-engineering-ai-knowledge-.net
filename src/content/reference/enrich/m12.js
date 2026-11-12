// Module 12 Kubernetes: easy story, plain theory, steps, mistakes, interview, 2028 tip, hands-on practice.
import { sh, file } from "./helpers";

export default {
  "get pods": {
    s: ["A school principal checking the attendance board: which classes are running, which teacher is absent, which room had a problem. kubectl get pods is the attendance board of your cluster.", "প্রধান শিক্ষক হাজিরা বোর্ড দেখছেন: কোন class চলছে, কোন শিক্ষক অনুপস্থিত, কোন ঘরে সমস্যা। kubectl get pods আপনার cluster-এর হাজিরা বোর্ড।"],
    t: ["A pod is the smallest deployable unit: one or more containers sharing network and storage. get pods shows READY (containers ready/total), STATUS (Running, Pending, CrashLoopBackOff, ImagePullBackOff, OOMKilled), RESTARTS and AGE. Use -n for a namespace, -A for all, -o wide for node and IP, -l to filter by label, and -w to watch changes live.", "Pod সবচেয়ে ছোট deploy-যোগ্য একক: network ও storage শেয়ার করা এক বা একাধিক container। get pods দেখায় READY (প্রস্তুত/মোট container), STATUS (Running, Pending, CrashLoopBackOff, ImagePullBackOff, OOMKilled), RESTARTS ও AGE। Namespace-এর জন্য -n, সবকিছুর জন্য -A, node ও IP-র জন্য -o wide, label দিয়ে filter-এ -l আর সরাসরি পরিবর্তন দেখতে -w দিন।"],
    p: [["List pods in your namespace: kubectl get pods -n shop.", "আপনার namespace-এর pod: kubectl get pods -n shop।"], ["Spot non-Running statuses and high RESTARTS.", "Running নয় এমন status ও বেশি RESTARTS খুঁজুন।"], ["Filter by app label: -l app=api.", "App label দিয়ে filter: -l app=api।"], ["Investigate with describe and logs.", "describe ও logs দিয়ে তদন্ত করুন।"]],
    m: ["Looking in the default namespace and thinking pods are missing; ignoring RESTARTS; deleting pods to 'fix' errors without understanding them.", "Default namespace-এ খুঁজে pod নেই ভাবা; RESTARTS উপেক্ষা; না বুঝে error 'ঠিক' করতে pod মোছা।"],
    q: ["Q: What do CrashLoopBackOff and ImagePullBackOff mean? A: CrashLoopBackOff: the container starts and keeps crashing, so Kubernetes waits longer between restarts; check logs --previous. ImagePullBackOff: the node cannot pull the image (wrong name/tag or missing registry credentials).", "প্রশ্ন: CrashLoopBackOff ও ImagePullBackOff মানে কী? উত্তর: CrashLoopBackOff: container চালু হয়ে বারবার crash করে, তাই Kubernetes restart-এর মাঝে বেশি অপেক্ষা করে; logs --previous দেখুন। ImagePullBackOff: node image pull করতে পারে না (ভুল নাম/tag বা registry credential নেই)।"],
    f: ["Kubernetes is the common runtime for APIs, workers and AI inference servers. Reading pod status fluently is a baseline skill for backend and platform roles.", "API, worker ও AI inference server-এর প্রচলিত runtime Kubernetes। সাবলীলভাবে pod status পড়া backend ও platform ভূমিকার মৌলিক দক্ষতা।"],
    x: [sh("Read pod status like an on-call engineer · on-call engineer-এর মতো pod পড়া", `kubectl get pods -n shop -o wide
kubectl get pods -n shop -l app=api --field-selector=status.phase!=Running
kubectl get pods -A | grep -E "CrashLoop|ImagePull|Error" | head`, `NAME                     READY   STATUS             RESTARTS      AGE   IP           NODE
api-7d9f8c6b5-2xk4p      1/1     Running            0             2d    10.1.2.14    node-a
api-7d9f8c6b5-9qz7m      1/1     Running            0             2d    10.1.3.22    node-b
worker-5c6d7f8b9-hm2lp   0/1     CrashLoopBackOff   7 (40s ago)   15m   10.1.2.31    node-a
No resources found in shop namespace.
shop          worker-5c6d7f8b9-hm2lp   0/1   CrashLoopBackOff   7 (40s ago)   15m`)],
  },
  "get svc": {
    s: ["A company's reception phone number stays the same even when the employee answering changes every shift. A Service gives pods a stable name and address, even as pods come and go.", "কোম্পানির অভ্যর্থনার ফোন নম্বর একই থাকে, যদিও প্রতি shift-এ উত্তর দেওয়া কর্মী বদলায়। Service pod-কে স্থির নাম ও ঠিকানা দেয়, pod আসা-যাওয়া করলেও।"],
    t: ["A Service selects pods by labels and load-balances to them. Types: ClusterIP (internal only, default), NodePort (port on every node), LoadBalancer (cloud load balancer) and ExternalName (DNS alias). Inside the cluster, other pods reach it as http://api.shop.svc.cluster.local or just http://api in the same namespace. Ingress or Gateway API exposes HTTP routes externally.", "Service label দিয়ে pod বাছে এবং তাদের মধ্যে load-balance করে। ধরন: ClusterIP (শুধু ভিতরে, ডিফল্ট), NodePort (প্রতিটি node-এ port), LoadBalancer (cloud load balancer) ও ExternalName (DNS alias)। Cluster-এর ভিতরে অন্য pod http://api.shop.svc.cluster.local বা একই namespace-এ শুধু http://api দিয়ে পৌঁছায়। Ingress বা Gateway API বাইরে HTTP route প্রকাশ করে।"],
    p: [["List services: kubectl get svc -n shop.", "Service-এর তালিকা: kubectl get svc -n shop।"], ["Check endpoints: kubectl get endpointslices -l kubernetes.io/service-name=api.", "Endpoint দেখুন: kubectl get endpointslices -l kubernetes.io/service-name=api।"], ["Make sure selector labels match pod labels.", "Selector label pod label-এর সাথে মেলে নিশ্চিত করুন।"], ["Test from inside with a temporary curl pod.", "অস্থায়ী curl pod দিয়ে ভিতর থেকে test করুন।"]],
    m: ["Selector typos so the service has no endpoints; exposing databases with LoadBalancer; mismatched targetPort and container port.", "Selector-এ টাইপো, ফলে service-এর কোনো endpoint নেই; LoadBalancer দিয়ে database প্রকাশ; targetPort ও container port না মেলা।"],
    q: ["Q: The service exists but requests time out. First check? A: Endpoints: if empty, the selector does not match ready pods (labels or failing readiness probes); then check targetPort.", "প্রশ্ন: Service আছে কিন্তু request timeout হয়। প্রথম কী দেখবেন? উত্তর: Endpoint: খালি হলে selector প্রস্তুত pod-এর সাথে মেলে না (label বা ব্যর্থ readiness probe); তারপর targetPort দেখুন।"],
    f: ["The Gateway API is replacing Ingress for richer routing (traffic splitting, headers). Learn it for canary releases, including of new AI model versions.", "সমৃদ্ধ routing-এর (traffic ভাগ, header) জন্য Gateway API Ingress-এর জায়গা নিচ্ছে। নতুন AI model version-সহ canary release-এর জন্য শিখুন।"],
    x: [sh("Check a service and its endpoints · service ও endpoint যাচাই", `kubectl get svc -n shop
kubectl get endpointslices -n shop -l kubernetes.io/service-name=api -o custom-columns=ENDPOINTS:.endpoints[*].addresses[0]
kubectl run tmp -n shop --rm -it --image=curlimages/curl --restart=Never -- curl -s http://api/health`, `NAME    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
api     ClusterIP   10.96.41.12    <none>        80/TCP     12d
redis   ClusterIP   10.96.77.201   <none>        6379/TCP   12d
ENDPOINTS
10.1.2.14,10.1.3.22
Healthy
pod "tmp" deleted`)],
  },
  "get deploy": {
    s: ["A factory manager's instruction: 'always keep 3 workers at the packing table'. If one leaves, another is hired automatically. A Deployment keeps the desired number of identical pods running and handles updates.", "কারখানার ম্যানেজারের নির্দেশ: 'packing টেবিলে সবসময় ৩ জন কর্মী রাখো'। একজন চলে গেলে স্বয়ংক্রিয়ভাবে আরেকজন নিয়োগ। Deployment কাঙ্ক্ষিত সংখ্যক একই রকম pod চালু রাখে এবং আপডেট সামলায়।"],
    t: ["A Deployment manages ReplicaSets, which manage pods. You declare replicas, the pod template (image, env, resources, probes) and an update strategy (RollingUpdate with maxSurge/maxUnavailable). get deploy shows READY, UP-TO-DATE and AVAILABLE counts, so you can see whether a rollout has finished.", "Deployment ReplicaSet পরিচালনা করে, যারা pod পরিচালনা করে। আপনি replica, pod template (image, env, resource, probe) ও আপডেট কৌশল (maxSurge/maxUnavailable-সহ RollingUpdate) ঘোষণা করেন। get deploy READY, UP-TO-DATE ও AVAILABLE সংখ্যা দেখায়, তাই rollout শেষ হয়েছে কি না দেখা যায়।"],
    p: [["List deployments: kubectl get deploy -n shop.", "Deployment-এর তালিকা: kubectl get deploy -n shop।"], ["Compare READY with desired replicas.", "কাঙ্ক্ষিত replica-র সাথে READY তুলনা করুন।"], ["Check the image: -o jsonpath on containers[0].image.", "Image দেখুন: containers[0].image-এ -o jsonpath।"], ["See ReplicaSets history: kubectl get rs.", "ReplicaSet-এর ইতিহাস: kubectl get rs।"]],
    m: ["Editing pods directly (the Deployment recreates them); no resource requests/limits; no readiness probe, so traffic hits pods before they are ready.", "সরাসরি pod সম্পাদনা (Deployment আবার বানায়); resource request/limit নেই; readiness probe নেই, তাই প্রস্তুতের আগে traffic pod-এ যায়।"],
    q: ["Q: Deployment vs StatefulSet? A: Deployments run interchangeable stateless pods; StatefulSets give stable names and storage per pod for databases and queues.", "প্রশ্ন: Deployment বনাম StatefulSet? উত্তর: Deployment বিনিময়যোগ্য stateless pod চালায়; StatefulSet database ও queue-র জন্য প্রতিটি pod-কে স্থির নাম ও storage দেয়।"],
    f: ["Declarative manifests in Git (GitOps with Argo CD or Flux) are how most teams deploy now; kubectl is for inspection and emergencies.", "Git-এ declarative manifest (Argo CD বা Flux-সহ GitOps) দিয়েই এখন বেশিরভাগ দল deploy করে; kubectl পরীক্ষা ও জরুরি অবস্থার জন্য।"],
    x: [file("yaml", "A production-ready Deployment manifest · production-উপযোগী Deployment", `apiVersion: apps/v1
kind: Deployment
metadata: { name: api, namespace: shop, labels: { app: api } }
spec:
  replicas: 3
  selector: { matchLabels: { app: api } }
  strategy: { type: RollingUpdate, rollingUpdate: { maxSurge: 1, maxUnavailable: 0 } }
  template:
    metadata: { labels: { app: api } }
    spec:
      securityContext: { runAsNonRoot: true }
      containers:
        - name: api
          image: ghcr.io/eftekher/shop-api:1.4.0
          ports: [{ containerPort: 8080 }]
          env: [{ name: ASPNETCORE_ENVIRONMENT, value: Production }]
          resources:
            requests: { cpu: 100m, memory: 128Mi }
            limits: { memory: 256Mi }
          readinessProbe: { httpGet: { path: /health/ready, port: 8080 }, periodSeconds: 5 }
          livenessProbe: { httpGet: { path: /health/live, port: 8080 }, periodSeconds: 10 }
# kubectl get deploy api -n shop   ->   api   3/3   3   3   5m`, undefined, "Kubernetes manifest")],
  },
  "get nodes": {
    s: ["A delivery company's garage: how many vans are available, which are in repair, how much space each has left. Nodes are the machines (vans) your pods ride on.", "Delivery কোম্পানির গ্যারেজ: কয়টি van পাওয়া যায়, কোনগুলো মেরামতে, প্রতিটিতে কত জায়গা বাকি। Node হলো machine (van), যাতে আপনার pod চড়ে।"],
    t: ["get nodes shows each node's status (Ready, NotReady), roles, age and Kubernetes version; -o wide adds IPs, OS and container runtime. Nodes have allocatable CPU and memory; the scheduler places pods based on requests. Conditions like MemoryPressure or DiskPressure trigger evictions. Cluster autoscalers add or remove nodes.", "get nodes প্রতিটি node-এর status (Ready, NotReady), ভূমিকা, বয়স ও Kubernetes version দেখায়; -o wide IP, OS ও container runtime যোগ করে। Node-এর বরাদ্দযোগ্য CPU ও memory থাকে; scheduler request অনুযায়ী pod বসায়। MemoryPressure বা DiskPressure-এর মতো অবস্থা eviction ঘটায়। Cluster autoscaler node যোগ বা বাদ দেয়।"],
    p: [["List nodes: kubectl get nodes -o wide.", "Node-এর তালিকা: kubectl get nodes -o wide।"], ["Check usage: kubectl top nodes.", "ব্যবহার দেখুন: kubectl top nodes।"], ["Inspect conditions: kubectl describe node <name>.", "অবস্থা দেখুন: kubectl describe node <name>।"], ["Drain before maintenance: kubectl drain <node> --ignore-daemonsets.", "রক্ষণাবেক্ষণের আগে drain: kubectl drain <node> --ignore-daemonsets।"]],
    m: ["Ignoring NotReady nodes; pods without requests so the scheduler overpacks nodes; draining without PodDisruptionBudgets and causing downtime.", "NotReady node উপেক্ষা; request ছাড়া pod, ফলে scheduler node-এ বেশি ভরে; PodDisruptionBudget ছাড়া drain করে downtime।"],
    q: ["Q: Pods are Pending with 'Insufficient memory'. Fixes? A: Lower requests if they are oversized, add nodes (or enable cluster autoscaler), or remove unused workloads.", "প্রশ্ন: 'Insufficient memory'-সহ pod Pending। সমাধান? উত্তর: বড় হলে request কমান, node যোগ করুন (বা cluster autoscaler চালু করুন), বা অব্যবহৃত workload সরান।"],
    f: ["GPU nodes for AI inference are expensive. Node labels, taints and autoscaling decide which pods may use them and when they scale to zero.", "AI inference-এর GPU node ব্যয়বহুল। Node label, taint ও autoscaling ঠিক করে কোন pod সেগুলো ব্যবহার করবে এবং কখন শূন্যে নামবে।"],
    x: [sh("Check node health and capacity · node-এর স্বাস্থ্য ও ক্ষমতা", `kubectl get nodes -o wide | awk '{print $1, $2, $5, $6}'
kubectl top nodes
kubectl describe node node-b | grep -A6 "Allocated resources"`, `NAME STATUS VERSION INTERNAL-IP
node-a Ready v1.33.2 10.0.1.11
node-b Ready v1.33.2 10.0.1.12
NAME     CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
node-a   420m         21%    2810Mi          37%
node-b   1650m        82%    6120Mi          81%
Allocated resources:
  Resource           Requests      Limits
  --------           --------      ------
  cpu                1800m (90%)   3 (150%)
  memory             6Gi (80%)     8Gi (106%)`)],
  },
  "describe pod": {
    s: ["A doctor's detailed chart for one patient, including a timeline of events: admitted, test done, fever spiked, medicine given. kubectl describe pod shows a pod's full details and recent events.", "একজন রোগীর জন্য ডাক্তারের বিস্তারিত chart, ঘটনার সময়রেখাসহ: ভর্তি, পরীক্ষা, জ্বর বাড়ল, ওষুধ দেওয়া হলো। kubectl describe pod একটি pod-এর পূর্ণ বিস্তারিত ও সাম্প্রতিক event দেখায়।"],
    t: ["describe shows the pod's node, IP, labels, containers (image, state, last termination reason and exit code), probes, mounts, conditions and the Events section at the bottom. Events explain most problems: FailedScheduling, Failed to pull image, Back-off restarting, Liveness probe failed, OOMKilled.", "describe pod-এর node, IP, label, container (image, অবস্থা, শেষ বন্ধের কারণ ও exit code), probe, mount, অবস্থা আর নিচে Events অংশ দেখায়। বেশিরভাগ সমস্যা Events ব্যাখ্যা করে: FailedScheduling, Failed to pull image, Back-off restarting, Liveness probe failed, OOMKilled।"],
    p: [["Run kubectl describe pod <name> -n shop.", "kubectl describe pod <name> -n shop চালান।"], ["Read 'Last State' for reason and exit code.", "কারণ ও exit code-এর জন্য 'Last State' পড়ুন।"], ["Read Events from the bottom up.", "নিচ থেকে উপরে Events পড়ুন।"], ["Fix the cause in the manifest and re-apply.", "Manifest-এ কারণ ঠিক করে আবার apply করুন।"]],
    m: ["Skipping the Events section; missing that the pod was OOMKilled because you only checked logs; describing the wrong namespace.", "Events অংশ বাদ দেওয়া; শুধু log দেখায় pod OOMKilled হয়েছিল তা না দেখা; ভুল namespace describe।"],
    q: ["Q: Exit code 137 and reason OOMKilled. What next? A: The container exceeded its memory limit. Check memory usage trends, fix leaks or raise the limit, and ensure requests reflect real usage.", "প্রশ্ন: Exit code 137 ও কারণ OOMKilled। এরপর? উত্তর: Container memory সীমা ছাড়িয়েছে। Memory ব্যবহারের প্রবণতা দেখুন, leak ঠিক করুন বা সীমা বাড়ান, এবং request আসল ব্যবহার প্রতিফলিত করে নিশ্চিত করুন।"],
    f: ["AI assistants with cluster access can summarise describe output, but restrict them to read-only RBAC; diagnosis should never require write permissions.", "Cluster access-সহ AI assistant describe output সংক্ষেপ করতে পারে, কিন্তু তাদের read-only RBAC-এ সীমিত রাখুন; রোগ নির্ণয়ে কখনো লেখার অনুমতি লাগা উচিত নয়।"],
    x: [sh("Diagnose a crashing pod from its events · event থেকে crash নির্ণয়", `kubectl describe pod worker-5c6d7f8b9-hm2lp -n shop | sed -n '/Last State/,/Restart Count/p'
kubectl describe pod worker-5c6d7f8b9-hm2lp -n shop | tail -4`, `    Last State:     Terminated
      Reason:       OOMKilled
      Exit Code:    137
      Started:      Thu, 12 Nov 2026 10:02:11 +0600
      Finished:     Thu, 12 Nov 2026 10:03:40 +0600
    Ready:          False
    Restart Count:  7
  Normal   Pulled     3m (x8 over 15m)   kubelet  Container image "shop-worker:1.4.0" already present
  Normal   Created    3m (x8 over 15m)   kubelet  Created container worker
  Warning  BackOff    20s (x60 over 15m) kubelet  Back-off restarting failed container worker`)],
  },
  "logs -f": {
    s: ["Listening to a radio commentary live during a cricket match instead of reading the newspaper report the next day. kubectl logs -f streams a container's output as it happens.", "পরদিন পত্রিকার খবর না পড়ে ক্রিকেট ম্যাচের সময় সরাসরি রেডিও ধারাভাষ্য শোনা। kubectl logs -f container-এর output ঘটার সাথে সাথে দেখায়।"],
    t: ["kubectl logs pod shows stdout/stderr of a container; -f follows, --tail and --since limit output, -c picks a container in multi-container pods, --previous shows logs from the last crashed instance, and -l app=api with --prefix shows logs from all matching pods. For history beyond the node's rotation, use central logging.", "kubectl logs pod container-এর stdout/stderr দেখায়; -f অনুসরণ করে, --tail ও --since output সীমিত করে, -c multi-container pod-এ container বাছে, --previous শেষ crash হওয়া instance-এর log দেখায়, আর --prefix-সহ -l app=api সব মেলা pod-এর log দেখায়। Node-এর rotation-এর বাইরের ইতিহাসে কেন্দ্রীয় logging ব্যবহার করুন।"],
    p: [["Follow one pod: kubectl logs -f deploy/api -n shop.", "একটি pod অনুসরণ: kubectl logs -f deploy/api -n shop।"], ["See why it crashed: kubectl logs <pod> --previous.", "কেন crash: kubectl logs <pod> --previous।"], ["All replicas: kubectl logs -l app=api --prefix --since=10m.", "সব replica: kubectl logs -l app=api --prefix --since=10m।"], ["Filter: pipe to grep for errors or a trace ID.", "Filter: error বা trace ID-র জন্য grep-এ পাঠান।"]],
    m: ["Looking at the new container's logs instead of --previous after a crash; only checking one replica; no central logging so evidence disappears.", "Crash-এর পরে --previous-এর বদলে নতুন container-এর log দেখা; শুধু একটি replica দেখা; কেন্দ্রীয় logging নেই, তাই প্রমাণ হারায়।"],
    q: ["Q: How do you follow one user's request across 5 pods? A: Search central logs by a correlation/trace ID that every service logs, rather than tailing pods one by one.", "প্রশ্ন: ৫টি pod জুড়ে একজন user-এর request কীভাবে অনুসরণ করবেন? উত্তর: একে একে pod tail না করে, প্রতিটি service log করে এমন correlation/trace ID দিয়ে কেন্দ্রীয় log-এ খুঁজুন।"],
    f: ["Tools like stern or k9s make multi-pod log tailing easier, and observability platforms now offer natural-language log search powered by AI.", "stern বা k9s-এর মতো tool একাধিক pod-এর log দেখা সহজ করে, আর observability platform এখন AI-চালিত সাধারণ-ভাষার log search দেয়।"],
    x: [sh("Logs from the crashed container and all replicas · crash ও সব replica-র log", `kubectl logs worker-5c6d7f8b9-hm2lp -n shop --previous --tail=2
kubectl logs -n shop -l app=api --prefix --since=5m | grep -i "error" | head -2`, `info: Worker[0] Loading 2,000,000 product embeddings into memory...
Unhandled exception. System.OutOfMemoryException: Exception of type 'System.OutOfMemoryException' was thrown.
[pod/api-7d9f8c6b5-2xk4p/api] fail: Orders[0] Payment gateway timeout (trace 4bf92f3577b34da6)
[pod/api-7d9f8c6b5-9qz7m/api] fail: Orders[0] Payment gateway timeout (trace 00f067aa0ba902b7)`)],
  },
  "exec -it": {
    s: ["Stepping inside a delivery van to check the cargo while it is parked. kubectl exec runs a command inside a running container in a pod.", "পার্ক করা delivery van-এর ভিতরে ঢুকে মাল দেখা। kubectl exec pod-এর চলমান container-এর ভিতরে command চালায়।"],
    t: ["kubectl exec -it pod -- sh opens an interactive shell; add -c for a specific container. Use it to check environment, files, DNS and connectivity from the pod's point of view. Minimal images may lack a shell; use kubectl debug to attach an ephemeral debug container with tools. RBAC should restrict exec in production because it is powerful.", "kubectl exec -it pod -- sh interactive shell খোলে; নির্দিষ্ট container-এর জন্য -c দিন। Pod-এর দৃষ্টিকোণ থেকে environment, file, DNS ও সংযোগ দেখতে ব্যবহার করুন। ছোট image-এ shell না-ও থাকতে পারে; tool-সহ অস্থায়ী debug container যুক্ত করতে kubectl debug ব্যবহার করুন। শক্তিশালী বলে production-এ RBAC দিয়ে exec সীমিত রাখা উচিত।"],
    p: [["Open a shell: kubectl exec -it deploy/api -n shop -- sh.", "Shell খুলুন: kubectl exec -it deploy/api -n shop -- sh।"], ["Check DNS and connectivity: nslookup db; wget -qO- http://redis:6379.", "DNS ও সংযোগ দেখুন: nslookup db; wget -qO- http://redis:6379।"], ["Use kubectl debug when there is no shell.", "Shell না থাকলে kubectl debug ব্যবহার করুন।"], ["Record findings; fix via manifests, not by hand.", "যা পেলেন লিখুন; হাতে নয়, manifest দিয়ে ঠিক করুন।"]],
    m: ["Changing files in production pods; giving developers exec on production by default; forgetting the -- separator before the command.", "Production pod-এ file বদলানো; ডিফল্টভাবে developer-দের production-এ exec দেওয়া; command-এর আগে -- বিভাজক ভুলে যাওয়া।"],
    q: ["Q: The API cannot reach the database. What do you test from inside the pod? A: DNS resolution of the DB host, TCP connectivity to the port, the environment variable/connection string, and NetworkPolicies that might block traffic.", "প্রশ্ন: API database-এ পৌঁছাতে পারে না। Pod-এর ভিতর থেকে কী test করবেন? উত্তর: DB host-এর DNS resolution, port-এ TCP সংযোগ, environment variable/connection string, আর traffic আটকাতে পারে এমন NetworkPolicy।"],
    f: ["Ephemeral debug containers keep production images minimal and secure while still allowing deep debugging when needed.", "অস্থায়ী debug container production image ছোট ও নিরাপদ রাখে, অথচ দরকারে গভীর debugging সম্ভব করে।"],
    x: [sh("Test DNS and connectivity from inside a pod · pod-এর ভিতর থেকে DNS ও সংযোগ", `kubectl exec -n shop deploy/api -- printenv ConnectionStrings__Shop | sed 's/Password=[^;]*/Password=***/'
kubectl debug -n shop -it deploy/api --image=busybox:1.36 --target=api -- sh -c 'nslookup db.shop.svc.cluster.local | tail -2; nc -zv db 5432'`, `Host=db;Database=shop;Username=app;Password=***
Name:	db.shop.svc.cluster.local
Address: 10.96.12.40
db (10.96.12.40:5432) open`)],
  },
  "apply -f": {
    s: ["Giving an architect the updated blueprint: they compare it with the current building and only change what is different. kubectl apply makes the cluster match the files you give it.", "স্থপতিকে আপডেট করা নকশা দেওয়া: তিনি বর্তমান ভবনের সাথে তুলনা করে শুধু যা আলাদা তাই বদলান। kubectl apply cluster-কে আপনার দেওয়া file-এর মতো করে।"],
    t: ["apply is declarative: you describe desired state in YAML, and Kubernetes creates or updates objects to match. Applying the same file twice is safe (idempotent). Use kubectl diff -f to preview changes and --dry-run=server to validate. Server-side apply tracks field ownership. Keep manifests in Git and apply through CI/GitOps.", "apply declarative: YAML-এ কাঙ্ক্ষিত অবস্থা বর্ণনা করেন, আর Kubernetes মেলাতে object বানায় বা আপডেট করে। একই file দুবার apply নিরাপদ (idempotent)। পরিবর্তন আগে দেখতে kubectl diff -f আর যাচাইয়ে --dry-run=server দিন। Server-side apply field-এর মালিকানা track করে। Manifest Git-এ রাখুন এবং CI/GitOps দিয়ে apply করুন।"],
    p: [["Edit the YAML in Git.", "Git-এ YAML সম্পাদনা করুন।"], ["Preview: kubectl diff -f k8s/.", "আগে দেখুন: kubectl diff -f k8s/।"], ["Apply: kubectl apply -f k8s/.", "Apply করুন: kubectl apply -f k8s/।"], ["Watch the rollout and verify.", "Rollout দেখুন ও যাচাই করুন।"]],
    m: ["Mixing kubectl edit and apply so changes get lost; applying to the wrong context/cluster; secrets in plain YAML committed to Git.", "kubectl edit ও apply মিশিয়ে পরিবর্তন হারানো; ভুল context/cluster-এ apply; Git-এ commit করা সাধারণ YAML-এ secret।"],
    q: ["Q: apply vs create? A: create fails if the object exists and is imperative; apply creates or updates to match the file and is safe to repeat, which suits automation.", "প্রশ্ন: apply বনাম create? উত্তর: object থাকলে create ব্যর্থ হয় এবং imperative; apply file-এর সাথে মেলাতে বানায় বা আপডেট করে এবং বারবার নিরাপদ, যা automation-এর জন্য উপযুক্ত।"],
    f: ["GitOps (Argo CD, Flux) runs apply continuously from Git. AI-generated manifests should go through the same pull request and diff review.", "GitOps (Argo CD, Flux) Git থেকে ধারাবাহিকভাবে apply চালায়। AI-তৈরি manifest-ও একই pull request ও diff review পার হওয়া উচিত।"],
    x: [sh("Preview, apply and confirm · আগে দেখা, apply ও নিশ্চিতকরণ", `kubectl config current-context
kubectl diff -f k8s/deployment.yaml
kubectl apply -f k8s/
kubectl apply -f k8s/   # second time: nothing changes`, `prod-dhaka
-          image: ghcr.io/eftekher/shop-api:1.3.0
+          image: ghcr.io/eftekher/shop-api:1.4.0
deployment.apps/api configured
service/api unchanged
deployment.apps/api unchanged
service/api unchanged`)],
  },
  "delete -f": {
    s: ["Demolishing exactly the buildings listed on a permit, nothing more. kubectl delete -f removes the objects described in the given files.", "অনুমতিপত্রে তালিকাভুক্ত ঠিক সেই ভবনগুলো ভাঙা, এর বেশি নয়। kubectl delete -f দেওয়া file-এ বর্ণিত object মুছে ফেলে।"],
    t: ["delete -f removes the objects defined in the files; deleting a Deployment removes its ReplicaSets and pods; deleting a namespace removes everything inside it. PersistentVolumeClaims may keep or delete data depending on the reclaim policy. Pods get a grace period to shut down. Use --dry-run=client first in scripts.", "delete -f file-এ সংজ্ঞায়িত object মুছে ফেলে; Deployment মুছলে তার ReplicaSet ও pod মোছে; namespace মুছলে ভিতরের সবকিছু মোছে। PersistentVolumeClaim reclaim নীতি অনুযায়ী data রাখতে বা মুছতে পারে। Pod বন্ধ হতে grace period পায়। Script-এ আগে --dry-run=client দিন।"],
    p: [["Confirm the context and namespace.", "Context ও namespace নিশ্চিত করুন।"], ["Preview: kubectl delete -f file.yaml --dry-run=client.", "আগে দেখুন: kubectl delete -f file.yaml --dry-run=client।"], ["Delete and watch pods terminate.", "মুছে pod বন্ধ হওয়া দেখুন।"], ["Check PVCs/PVs if data was involved.", "Data জড়িত থাকলে PVC/PV দেখুন।"]],
    m: ["Deleting a namespace in the wrong cluster; deleting PVCs with Delete reclaim policy and losing databases; deleting pods managed by a Deployment and wondering why they come back.", "ভুল cluster-এ namespace মোছা; Delete reclaim নীতির PVC মুছে database হারানো; Deployment-পরিচালিত pod মুছে অবাক হওয়া কেন ফিরে আসে।"],
    q: ["Q: You deleted a pod and it came back. Why? A: Its Deployment/ReplicaSet maintains the desired replica count and recreated it; scale or delete the Deployment instead.", "প্রশ্ন: Pod মুছলেন আর তা ফিরে এল। কেন? উত্তর: এর Deployment/ReplicaSet কাঙ্ক্ষিত replica সংখ্যা রক্ষা করে আবার বানিয়েছে; তার বদলে Deployment scale বা মুছুন।"],
    f: ["Protect production with RBAC so only pipelines can delete resources, and require approvals for destructive changes, especially if AI agents can propose manifests.", "RBAC দিয়ে production রক্ষা করুন যাতে শুধু pipeline resource মুছতে পারে, এবং ধ্বংসাত্মক পরিবর্তনে অনুমোদন বাধ্যতামূলক করুন, বিশেষত AI agent manifest প্রস্তাব করতে পারলে।"],
    x: [sh("Dry run, then delete with care · আগে dry run, তারপর সাবধানে মোছা", `kubectl config current-context
kubectl delete -f k8s/demo-feature.yaml --dry-run=client
kubectl delete -f k8s/demo-feature.yaml
kubectl get pvc -n shop`, `staging
deployment.apps "demo-feature" deleted (dry run)
service "demo-feature" deleted (dry run)
deployment.apps "demo-feature" deleted
service "demo-feature" deleted
NAME     STATUS   VOLUME        CAPACITY   ACCESS MODES   AGE
pgdata   Bound    pvc-3f2a...   20Gi       RWO            40d`)],
  },
  "create ns": {
    s: ["Dividing a big office into departments with their own rooms, budgets and access cards. Namespaces divide one cluster into isolated areas for teams or environments.", "বড় অফিসকে নিজস্ব ঘর, বাজেট ও access card-সহ বিভাগে ভাগ করা। Namespace একটি cluster-কে দল বা পরিবেশের জন্য আলাদা এলাকায় ভাগ করে।"],
    t: ["Namespaces scope names, RBAC permissions, resource quotas, limit ranges and network policies. Use them per team or per app/environment (shop-dev, shop-staging). They are not a hard security boundary on their own; combine with RBAC and NetworkPolicies. Set a default namespace in your kube context to avoid mistakes.", "Namespace নাম, RBAC অনুমতি, resource quota, limit range ও network policy-র পরিধি ঠিক করে। দল বা app/পরিবেশ অনুযায়ী ব্যবহার করুন (shop-dev, shop-staging)। একা এটি কঠিন নিরাপত্তা সীমা নয়; RBAC ও NetworkPolicy-র সাথে মেলান। ভুল এড়াতে kube context-এ ডিফল্ট namespace দিন।"],
    p: [["Create: kubectl create ns shop-staging.", "বানান: kubectl create ns shop-staging।"], ["Add a ResourceQuota and LimitRange.", "ResourceQuota ও LimitRange যোগ করুন।"], ["Bind team roles with RoleBindings.", "RoleBinding দিয়ে দলের role যুক্ত করুন।"], ["Set it as default: kubectl config set-context --current --namespace=shop-staging.", "ডিফল্ট করুন: kubectl config set-context --current --namespace=shop-staging।"]],
    m: ["Everything in 'default'; no quotas so one team starves others; assuming namespaces block network traffic (they do not without NetworkPolicies).", "সবকিছু 'default'-এ; quota নেই, ফলে এক দল অন্যদের বঞ্চিত করে; namespace network traffic আটকায় ধরে নেওয়া (NetworkPolicy ছাড়া আটকায় না)।"],
    q: ["Q: Can a pod in namespace A call a service in namespace B? A: Yes, by default, using b-service.namespace-b.svc.cluster.local, unless NetworkPolicies deny it.", "প্রশ্ন: Namespace A-এর pod কি namespace B-এর service ডাকতে পারে? উত্তর: হ্যাঁ, ডিফল্টভাবে b-service.namespace-b.svc.cluster.local দিয়ে, যদি না NetworkPolicy নিষেধ করে।"],
    f: ["Per-team namespaces with quotas are how platforms share expensive resources like GPUs fairly between AI and product teams.", "Quota-সহ দলভিত্তিক namespace দিয়েই platform AI ও product দলের মধ্যে GPU-র মতো ব্যয়বহুল resource ন্যায্যভাবে ভাগ করে।"],
    x: [file("yaml", "Namespace with quota and default limits · quota-সহ namespace", `apiVersion: v1
kind: Namespace
metadata: { name: shop-staging, labels: { team: shop, env: staging } }
---
apiVersion: v1
kind: ResourceQuota
metadata: { name: quota, namespace: shop-staging }
spec:
  hard: { requests.cpu: "4", requests.memory: 8Gi, limits.memory: 16Gi, pods: "30" }
---
apiVersion: v1
kind: LimitRange
metadata: { name: defaults, namespace: shop-staging }
spec:
  limits:
    - type: Container
      defaultRequest: { cpu: 100m, memory: 128Mi }
      default: { memory: 256Mi }
# kubectl apply -f namespace.yaml && kubectl describe quota -n shop-staging`, undefined, "Kubernetes manifest")],
  },
  "scale": {
    s: ["Opening more checkout counters when the supermarket queue grows, and closing them at night. kubectl scale changes how many pod replicas run.", "Supermarket-এর লাইন লম্বা হলে আরও checkout কাউন্টার খোলা, রাতে বন্ধ করা। kubectl scale কতগুলো pod replica চলবে তা বদলায়।"],
    t: ["kubectl scale deploy/api --replicas=5 changes the desired count immediately; the Deployment creates or removes pods. For automatic scaling use a HorizontalPodAutoscaler (CPU, memory or custom metrics like queue length via KEDA). Manual scaling is overwritten if an HPA or GitOps tool manages replicas.", "kubectl scale deploy/api --replicas=5 সাথে সাথে কাঙ্ক্ষিত সংখ্যা বদলায়; Deployment pod বানায় বা সরায়। স্বয়ংক্রিয় scaling-এর জন্য HorizontalPodAutoscaler দিন (CPU, memory বা KEDA দিয়ে queue দৈর্ঘ্যের মতো custom metric)। HPA বা GitOps tool replica পরিচালনা করলে হাতে করা scaling overwrite হয়।"],
    p: [["Scale manually for a quick test: kubectl scale deploy/api --replicas=5.", "দ্রুত test-এ হাতে scale: kubectl scale deploy/api --replicas=5।"], ["Create an HPA: kubectl autoscale deploy/api --min=2 --max=10 --cpu-percent=70.", "HPA বানান: kubectl autoscale deploy/api --min=2 --max=10 --cpu-percent=70।"], ["Watch: kubectl get hpa -w.", "দেখুন: kubectl get hpa -w।"], ["Make sure pods have CPU requests (HPA needs them).", "Pod-এ CPU request আছে নিশ্চিত করুন (HPA-র লাগে)।"]],
    m: ["HPA without resource requests (no metrics); scaling a stateful database like a stateless API; max replicas higher than the database can handle connections for.", "Resource request ছাড়া HPA (metric নেই); stateless API-র মতো stateful database scale; database যত connection সামলাতে পারে তার চেয়ে বেশি max replica।"],
    q: ["Q: How would you scale a queue worker? A: Use KEDA to scale on queue depth (e.g., RabbitMQ or SQS messages), possibly down to zero when idle.", "প্রশ্ন: Queue worker কীভাবে scale করবেন? উত্তর: Queue-র গভীরতায় (যেমন RabbitMQ বা SQS-এর বার্তা) scale করতে KEDA দিন, অলস হলে শূন্যেও নামতে পারে।"],
    f: ["Scale-to-zero for GPU inference workers saves large costs; event-driven autoscaling is a key 2028 platform skill.", "GPU inference worker-কে শূন্যে নামানো বড় খরচ বাঁচায়; event-চালিত autoscaling ২০২৮-এর মূল platform দক্ষতা।"],
    x: [sh("Manual scale and an autoscaler · হাতে scale ও autoscaler", `kubectl scale deploy/api -n shop --replicas=5
kubectl get deploy api -n shop
kubectl autoscale deploy/api -n shop --min=2 --max=10 --cpu-percent=70
kubectl get hpa -n shop`, `deployment.apps/api scaled
NAME   READY   UP-TO-DATE   AVAILABLE   AGE
api    5/5     5            5           12d
horizontalpodautoscaler.autoscaling/api autoscaled
NAME   REFERENCE        TARGETS       MINPODS   MAXPODS   REPLICAS   AGE
api    Deployment/api   cpu: 34%/70%  2         10        5          10s`)],
  },
  "rollout status": {
    s: ["Replacing old buses with new ones one at a time, so passengers always have a bus. rollout status tells you whether the replacement finished or got stuck.", "পুরনো বাস একে একে নতুন বাসে বদলানো, যাতে যাত্রীরা সবসময় বাস পায়। rollout status জানায় প্রতিস্থাপন শেষ হয়েছে নাকি আটকে আছে।"],
    t: ["A rolling update creates new pods with the new template and removes old ones as new ones become ready (controlled by maxSurge/maxUnavailable and readiness probes). kubectl rollout status waits until all replicas are updated and available, or reports a timeout (progressDeadlineSeconds). Use it in CI to fail a deploy that does not become healthy.", "Rolling update নতুন template দিয়ে নতুন pod বানায় এবং নতুনগুলো প্রস্তুত হলে পুরনোগুলো সরায় (maxSurge/maxUnavailable ও readiness probe নিয়ন্ত্রণ করে)। kubectl rollout status সব replica আপডেট ও available হওয়া পর্যন্ত অপেক্ষা করে, নয়তো timeout জানায় (progressDeadlineSeconds)। সুস্থ হয় না এমন deploy ব্যর্থ করতে CI-তে ব্যবহার করুন।"],
    p: [["Update the image (apply or set image).", "Image আপডেট করুন (apply বা set image)।"], ["Run kubectl rollout status deploy/api --timeout=5m.", "kubectl rollout status deploy/api --timeout=5m চালান।"], ["If it stalls, describe new pods and check readiness.", "আটকে গেলে নতুন pod describe করে readiness দেখুন।"], ["Undo if it fails.", "ব্যর্থ হলে undo করুন।"]],
    m: ["No readiness probe, so broken pods receive traffic; maxUnavailable too high causing capacity drops; CI pipelines that do not wait for rollout status.", "Readiness probe নেই, তাই ভাঙা pod traffic পায়; বেশি maxUnavailable-এ ক্ষমতা কমে যাওয়া; rollout status-এর অপেক্ষা করে না এমন CI pipeline।"],
    q: ["Q: A rollout is stuck at 1 of 3 new replicas. Likely causes? A: New pods fail readiness (bad config, missing secret, migration not applied) or cannot be scheduled (resources). Describe the new pods and read events and logs.", "প্রশ্ন: Rollout ৩টির মধ্যে ১টি নতুন replica-তে আটকে আছে। সম্ভাব্য কারণ? উত্তর: নতুন pod readiness-এ ব্যর্থ (খারাপ config, অনুপস্থিত secret, migration হয়নি) বা schedule হতে পারে না (resource)। নতুন pod describe করে event ও log পড়ুন।"],
    f: ["Progressive delivery tools (Argo Rollouts, Flagger) automate canaries with metric checks and automatic rollback, increasingly used for risky releases like new model versions.", "Progressive delivery tool (Argo Rollouts, Flagger) metric যাচাই ও স্বয়ংক্রিয় rollback-সহ canary স্বয়ংক্রিয় করে, নতুন model version-এর মতো ঝুঁকিপূর্ণ release-এ ক্রমশ ব্যবহৃত।"],
    x: [sh("Deploy a new image and wait for it · নতুন image deploy ও অপেক্ষা", `kubectl set image deploy/api -n shop api=ghcr.io/eftekher/shop-api:1.4.1
kubectl rollout status deploy/api -n shop --timeout=5m
kubectl get rs -n shop -l app=api`, `deployment.apps/api image updated
Waiting for deployment "api" rollout to finish: 1 out of 3 new replicas have been updated...
Waiting for deployment "api" rollout to finish: 2 out of 3 new replicas have been updated...
Waiting for deployment "api" rollout to finish: 1 old replicas are pending termination...
deployment "api" successfully rolled out
NAME             DESIRED   CURRENT   READY   AGE
api-6b8c9d7f4    3         3         3       90s
api-7d9f8c6b5    0         0         0       12d`)],
  },
  "rollout undo": {
    s: ["A new cook's recipe gets complaints, so the restaurant returns to yesterday's recipe within minutes. rollout undo switches a Deployment back to its previous version.", "নতুন রাঁধুনির recipe-তে অভিযোগ, তাই রেস্তোরাঁ কয়েক মিনিটে গতকালের recipe-তে ফেরে। rollout undo একটি Deployment-কে আগের version-এ ফেরায়।"],
    t: ["Kubernetes keeps old ReplicaSets (revisionHistoryLimit). rollout undo scales the previous ReplicaSet back up using the same rolling strategy; --to-revision picks a specific one. rollout history shows revisions (add the kubernetes.io/change-cause annotation to make it readable). Database migrations are not undone, so keep schema changes backward compatible.", "Kubernetes পুরনো ReplicaSet রাখে (revisionHistoryLimit)। rollout undo একই rolling কৌশলে আগের ReplicaSet আবার বাড়ায়; --to-revision নির্দিষ্ট একটি বাছে। rollout history revision দেখায় (পড়ার মতো করতে kubernetes.io/change-cause annotation দিন)। Database migration undo হয় না, তাই schema পরিবর্তন পেছনের সাথে সামঞ্জস্যপূর্ণ রাখুন।"],
    p: [["See history: kubectl rollout history deploy/api.", "ইতিহাস: kubectl rollout history deploy/api।"], ["Undo: kubectl rollout undo deploy/api.", "ফিরিয়ে নিন: kubectl rollout undo deploy/api।"], ["Wait: kubectl rollout status deploy/api.", "অপেক্ষা: kubectl rollout status deploy/api।"], ["Update Git to the good version so GitOps does not re-deploy the bad one.", "Git-এ ভালো version দিন, যাতে GitOps খারাপটা আবার deploy না করে।"]],
    m: ["Undoing in the cluster while GitOps re-applies the bad version; destructive DB migrations that make rollback impossible; no change-cause so you cannot tell revisions apart.", "Cluster-এ undo, অথচ GitOps খারাপ version আবার apply করে; rollback অসম্ভব করা ধ্বংসাত্মক DB migration; change-cause নেই, তাই revision আলাদা করা যায় না।"],
    q: ["Q: Why must migrations be backward compatible for safe rollbacks? A: After undo, the old code runs against the new schema. Expand-and-contract (add columns first, remove later) keeps both versions working.", "প্রশ্ন: নিরাপদ rollback-এর জন্য migration কেন পেছনের সাথে সামঞ্জস্যপূর্ণ হতে হবে? উত্তর: Undo-র পরে পুরনো code নতুন schema-য় চলে। Expand-and-contract (আগে column যোগ, পরে মোছা) দুই version-ই চালু রাখে।"],
    f: ["Fast, boring rollbacks are a sign of a healthy team. Practise them on staging regularly, including rollbacks of AI prompt/model configuration.", "দ্রুত, একঘেয়ে rollback সুস্থ দলের লক্ষণ। Staging-এ নিয়মিত অনুশীলন করুন, AI prompt/model configuration-এর rollback-সহ।"],
    x: [sh("Roll back a bad release · খারাপ release ফেরানো", `kubectl rollout history deploy/api -n shop
kubectl rollout undo deploy/api -n shop
kubectl rollout status deploy/api -n shop
kubectl get deploy api -n shop -o jsonpath='{.spec.template.spec.containers[0].image}{"\\n"}'`, `REVISION  CHANGE-CAUSE
4         release 1.4.0
5         release 1.4.1 (new checkout flow)
deployment.apps/api rolled back
deployment "api" successfully rolled out
ghcr.io/eftekher/shop-api:1.4.0`)],
  },
  "port-forward": {
    s: ["A temporary private tunnel from your house straight into one room of an office building, without opening the front door to the public. port-forward connects your laptop to a pod or service inside the cluster.", "আপনার বাড়ি থেকে অফিস ভবনের একটি ঘরে সরাসরি অস্থায়ী গোপন সুড়ঙ্গ, জনসাধারণের জন্য সামনের দরজা না খুলে। port-forward আপনার laptop-কে cluster-এর ভিতরের pod বা service-এর সাথে যুক্ত করে।"],
    t: ["kubectl port-forward svc/api 8080:80 -n shop forwards localhost:8080 to the service through the Kubernetes API server, using your credentials. It is ideal for debugging internal services, admin UIs and databases without exposing them publicly. It lasts only while the command runs and is not for production traffic.", "kubectl port-forward svc/api 8080:80 -n shop আপনার credential দিয়ে Kubernetes API server-এর মাধ্যমে localhost:8080-কে service-এ পাঠায়। Public না করে ভিতরের service, admin UI ও database debug-এ আদর্শ। Command চলার সময়ই থাকে এবং production traffic-এর জন্য নয়।"],
    p: [["Forward a service: kubectl port-forward svc/api 8080:80 -n shop.", "Service যুক্ত করুন: kubectl port-forward svc/api 8080:80 -n shop।"], ["Call it locally: curl localhost:8080/health.", "Local-এ ডাকুন: curl localhost:8080/health।"], ["Forward a database for a quick query (read-only user).", "দ্রুত query-র জন্য database forward (read-only user)।"], ["Stop with Ctrl+C when done.", "শেষ হলে Ctrl+C দিয়ে থামান।"]],
    m: ["Using port-forward as a permanent way to expose apps; forwarding production databases with admin credentials; port conflicts with local services.", "App প্রকাশের স্থায়ী উপায় হিসেবে port-forward; admin credential দিয়ে production database forward; local service-এর সাথে port conflict।"],
    q: ["Q: How do you open an internal Grafana without an Ingress? A: kubectl port-forward svc/grafana 3000:80 -n monitoring and browse http://localhost:3000; access stays limited to people with cluster credentials.", "প্রশ্ন: Ingress ছাড়া ভিতরের Grafana কীভাবে খুলবেন? উত্তর: kubectl port-forward svc/grafana 3000:80 -n monitoring চালিয়ে http://localhost:3000 খুলুন; access cluster credential-ধারীদের মধ্যেই সীমিত থাকে।"],
    f: ["Local AI tooling (MCP servers, evaluation dashboards) can reach in-cluster services through port-forward during development without public exposure.", "Development-এ local AI tooling (MCP server, evaluation dashboard) public না করেই port-forward দিয়ে cluster-এর service-এ পৌঁছাতে পারে।"],
    x: [sh("Reach an internal service from your laptop · laptop থেকে ভিতরের service", `kubectl port-forward -n shop svc/api 8080:80 &
sleep 2 && curl -s http://localhost:8080/health
kubectl port-forward -n shop svc/db 15432:5432 &
sleep 2 && psql "host=localhost port=15432 user=readonly dbname=shop" -tAc "select count(*) from orders"
kill %1 %2`, `Forwarding from 127.0.0.1:8080 -> 8080
Healthy
Forwarding from 127.0.0.1:15432 -> 5432
184233`)],
  },
  "top pod": {
    s: ["Checking each worker's energy meter on a factory floor to see who is overloaded. kubectl top pod shows live CPU and memory usage of pods.", "কারখানায় প্রতিটি কর্মীর শক্তি-মিটার দেখে কে অতিরিক্ত চাপে আছে বোঝা। kubectl top pod pod-এর সরাসরি CPU ও memory ব্যবহার দেখায়।"],
    t: ["kubectl top requires metrics-server. top pod shows current CPU (millicores) and memory per pod; --containers splits by container; --sort-by=memory ranks them. Compare usage with requests and limits: usage near the memory limit risks OOMKill; CPU near the limit causes throttling and latency. Use dashboards for history.", "kubectl top-এর জন্য metrics-server লাগে। top pod pod-প্রতি বর্তমান CPU (millicore) ও memory দেখায়; --containers container অনুযায়ী ভাগ করে; --sort-by=memory সাজায়। Request ও limit-এর সাথে ব্যবহার তুলনা করুন: memory limit-এর কাছে থাকলে OOMKill-এর ঝুঁকি; CPU limit-এর কাছে থাকলে throttling ও latency। ইতিহাসের জন্য dashboard ব্যবহার করুন।"],
    p: [["kubectl top pod -n shop --sort-by=memory.", "memory অনুযায়ী সাজান: kubectl top pod -n shop --sort-by=memory।"], ["Compare with requests/limits in the manifest.", "Manifest-এর request/limit-এর সাথে তুলনা করুন।"], ["Right-size requests from real usage.", "আসল ব্যবহার থেকে request ঠিক করুন।"], ["Alert on memory > 85% of limit.", "Limit-এর ৮৫%-এর বেশি memory-তে alert দিন।"]],
    m: ["Setting requests far above usage (wasted nodes) or far below (noisy neighbours); tight CPU limits causing throttling; reading one snapshot as a trend.", "ব্যবহারের অনেক উপরে request (node নষ্ট) বা অনেক নিচে (গোলমেলে প্রতিবেশী); কঠোর CPU limit-এ throttling; একটি snapshot-কে প্রবণতা ভাবা।"],
    q: ["Q: Latency spikes but CPU shows only 60%. What could it be? A: CPU throttling from limits in short bursts; check container_cpu_cfs_throttled metrics and consider removing CPU limits while keeping requests.", "প্রশ্ন: Latency বাড়ে কিন্তু CPU মাত্র ৬০% দেখায়। কী হতে পারে? উত্তর: ছোট burst-এ limit থেকে CPU throttling; container_cpu_cfs_throttled metric দেখুন এবং request রেখে CPU limit সরানোর কথা ভাবুন।"],
    f: ["Right-sizing (and tools like the Vertical Pod Autoscaler) cut cloud bills significantly. FinOps awareness is an expected skill for senior engineers.", "সঠিক মাপ (আর Vertical Pod Autoscaler-এর মতো tool) cloud bill উল্লেখযোগ্যভাবে কমায়। FinOps সচেতনতা senior engineer-দের প্রত্যাশিত দক্ষতা।"],
    x: [sh("Find the hungriest pods · সবচেয়ে বেশি খরচের pod", `# needs metrics-server installed in the cluster
kubectl top pod -n shop --sort-by=memory
kubectl get deploy worker -n shop -o jsonpath='{.spec.template.spec.containers[0].resources}{"\\n"}'`, `NAME                     CPU(cores)   MEMORY(bytes)
worker-5c6d7f8b9-hm2lp   180m         498Mi
api-7d9f8c6b5-2xk4p      65m          142Mi
api-7d9f8c6b5-9qz7m      58m          139Mi
redis-0                  12m          23Mi
{"limits":{"memory":"512Mi"},"requests":{"cpu":"100m","memory":"256Mi"}}
# worker at 498Mi of a 512Mi limit: OOMKill risk -> fix the leak or raise the limit`)],
  },
  "edit": {
    s: ["Correcting a notice on the board with a marker instead of printing a new one: quick, but the original file in the office still has the old text. kubectl edit changes a live object directly.", "নতুন ছাপানোর বদলে marker দিয়ে board-এর notice সংশোধন: দ্রুত, কিন্তু অফিসের মূল file-এ পুরনো লেখা থেকে যায়। kubectl edit সরাসরি চলমান object বদলায়।"],
    t: ["kubectl edit opens the live object's YAML in your editor and applies changes when you save. It is handy for emergencies and experiments, but it creates drift: the cluster no longer matches Git, and the next apply or GitOps sync overwrites your change. Prefer changing manifests in Git; if you edit live, update Git right after.", "kubectl edit চলমান object-এর YAML আপনার editor-এ খোলে এবং save করলে পরিবর্তন প্রয়োগ করে। জরুরি অবস্থা ও পরীক্ষায় সুবিধাজনক, কিন্তু drift তৈরি করে: cluster আর Git-এর সাথে মেলে না, আর পরের apply বা GitOps sync আপনার পরিবর্তন overwrite করে। Git-এ manifest বদলানো পছন্দ করুন; সরাসরি edit করলে সাথে সাথে Git আপডেট করুন।"],
    p: [["Use KUBE_EDITOR=nano kubectl edit deploy/api -n shop for emergencies only.", "শুধু জরুরি অবস্থায় KUBE_EDITOR=nano kubectl edit deploy/api -n shop।"], ["Make the smallest change and save.", "সবচেয়ে ছোট পরিবর্তন করে save করুন।"], ["Verify with rollout status.", "rollout status দিয়ে যাচাই করুন।"], ["Copy the change into Git immediately.", "সাথে সাথে পরিবর্তন Git-এ কপি করুন।"]],
    m: ["Long-term configuration living only in the cluster; editing fields that are immutable (selector) and getting errors; forgetting GitOps will revert it.", "দীর্ঘমেয়াদি configuration শুধু cluster-এ; অপরিবর্তনীয় field (selector) edit করে error; GitOps ফিরিয়ে দেবে তা ভুলে যাওয়া।"],
    q: ["Q: Someone edited a deployment live and an hour later it reverted. Why? A: Argo CD/Flux (or a pipeline) re-applied the Git version. Make the change in Git.", "প্রশ্ন: কেউ সরাসরি deployment edit করেছিল আর এক ঘণ্টা পরে তা ফিরে গেছে। কেন? উত্তর: Argo CD/Flux (বা pipeline) Git-এর version আবার apply করেছে। Git-এ পরিবর্তন করুন।"],
    f: ["Drift detection is built into GitOps tools. Treat any manual change as a temporary incident action that must be codified.", "Drift শনাক্তকরণ GitOps tool-এ built-in। যেকোনো হাতে করা পরিবর্তনকে অস্থায়ী incident পদক্ষেপ হিসেবে দেখুন, যা code-এ লিখতে হবে।"],
    x: [sh("Emergency edit, then codify it · জরুরি edit, তারপর code-এ লেখা", `kubectl patch deploy/worker -n shop --type=json \\
  -p='[{"op":"replace","path":"/spec/template/spec/containers/0/resources/limits/memory","value":"768Mi"}]'
kubectl rollout status deploy/worker -n shop
kubectl diff -f k8s/worker.yaml | grep memory
# now change k8s/worker.yaml in Git to 768Mi and open a PR`, `deployment.apps/worker patched
deployment "worker" successfully rolled out
-              memory: 768Mi
+              memory: 512Mi
# diff shows Git still says 512Mi: the cluster has drifted until the PR merges`)],
  },
  "label": {
    s: ["Colour stickers on files in an office: red for urgent, blue for finance, green for archived. Anyone can quickly find all blue files. Labels are key=value stickers on Kubernetes objects.", "অফিসের file-এ রঙিন sticker: জরুরিতে লাল, অর্থে নীল, archive-এ সবুজ। যে কেউ দ্রুত সব নীল file খুঁজে পায়। Label হলো Kubernetes object-এর key=value sticker।"],
    t: ["Labels identify and group objects (app=api, tier=backend, env=prod, version=1.4.0). Services and Deployments select pods by labels; kubectl uses -l to filter; NetworkPolicies and node selectors use them too. Annotations store non-identifying metadata (change cause, owner contact). Use the recommended app.kubernetes.io/* labels for consistency.", "Label object চিহ্নিত ও দলবদ্ধ করে (app=api, tier=backend, env=prod, version=1.4.0)। Service ও Deployment label দিয়ে pod বাছে; kubectl filter করতে -l ব্যবহার করে; NetworkPolicy ও node selector-ও ব্যবহার করে। Annotation চিহ্নিতকরণের নয় এমন metadata রাখে (change cause, মালিকের যোগাযোগ)। সামঞ্জস্যের জন্য প্রস্তাবিত app.kubernetes.io/* label ব্যবহার করুন।"],
    p: [["Add: kubectl label pod <pod> debug=true.", "যোগ করুন: kubectl label pod <pod> debug=true।"], ["Filter: kubectl get pods -l app=api,env=prod.", "ছাঁকুন: kubectl get pods -l app=api,env=prod।"], ["Remove: kubectl label pod <pod> debug-.", "সরান: kubectl label pod <pod> debug-।"], ["Standardise labels in manifests.", "Manifest-এ label মানক করুন।"]],
    m: ["Changing a pod's labels so it falls out of its Service (traffic stops); inconsistent label names across teams; putting long text in labels instead of annotations.", "Pod-এর label বদলে Service থেকে বের হয়ে যাওয়া (traffic থামে); দলের মধ্যে অসামঞ্জস্যপূর্ণ label নাম; annotation-এর বদলে label-এ লম্বা লেখা।"],
    q: ["Q: How can you remove a misbehaving pod from load balancing without killing it (to debug)? A: Change its app label so the Service selector no longer matches; the ReplicaSet creates a replacement and you debug the isolated pod.", "প্রশ্ন: Debug করতে misbehaving pod-কে না মেরে load balancing থেকে কীভাবে সরাবেন? উত্তর: এর app label বদলান যাতে Service selector আর না মেলে; ReplicaSet বদলি বানায় আর আপনি আলাদা করা pod debug করেন।"],
    f: ["Cost allocation (team, product, feature such as ai-assistant) relies on consistent labels. FinOps reports are only as good as your labelling.", "খরচ বরাদ্দ (দল, product, ai-assistant-এর মতো feature) সামঞ্জস্যপূর্ণ label-এর উপর নির্ভর করে। FinOps report আপনার labelling-এর মতোই ভালো।"],
    x: [sh("Isolate a pod for debugging with labels · label দিয়ে pod আলাদা করা", `kubectl get pods -n shop -l app=api --show-labels | awk '{print $1, $NF}'
kubectl label pod api-7d9f8c6b5-2xk4p -n shop app=api-debug --overwrite
kubectl get pods -n shop -l app=api
kubectl get pods -n shop -l app=api-debug`, `NAME LABELS
api-7d9f8c6b5-2xk4p app=api,pod-template-hash=7d9f8c6b5
api-7d9f8c6b5-9qz7m app=api,pod-template-hash=7d9f8c6b5
pod/api-7d9f8c6b5-2xk4p labeled
NAME                  READY   STATUS              RESTARTS   AGE
api-7d9f8c6b5-9qz7m   1/1     Running             0          2d
api-7d9f8c6b5-xw8rn   0/1     ContainerCreating   0          2s
NAME                  READY   STATUS    RESTARTS   AGE
api-7d9f8c6b5-2xk4p   1/1     Running   0          2d`)],
  },
  "cp": {
    s: ["Passing a document through the window of a moving train: possible, but not the normal way to deliver mail. kubectl cp copies files between your laptop and a pod.", "চলন্ত ট্রেনের জানালা দিয়ে কাগজ দেওয়া: সম্ভব, কিন্তু চিঠি পাঠানোর স্বাভাবিক উপায় নয়। kubectl cp আপনার laptop ও pod-এর মধ্যে file কপি করে।"],
    t: ["kubectl cp namespace/pod:/path ./local copies out (and the reverse copies in). It uses tar inside the container, so the image must include tar. It is useful for grabbing a heap dump, a log file or a generated report during debugging. Files copied into a pod disappear when it is replaced, so never use cp to configure apps; use ConfigMaps and Secrets.", "kubectl cp namespace/pod:/path ./local বাইরে কপি করে (উল্টোটা ভিতরে)। এটি container-এর ভিতরে tar ব্যবহার করে, তাই image-এ tar থাকতে হবে। Debugging-এর সময় heap dump, log file বা তৈরি report নিতে কাজের। Pod-এ কপি করা file pod বদলালে হারায়, তাই app configure করতে কখনো cp নয়; ConfigMap ও Secret ব্যবহার করুন।"],
    p: [["Create the file inside the pod (e.g., dotnet-dump).", "Pod-এর ভিতরে file বানান (যেমন dotnet-dump)।"], ["Copy out: kubectl cp shop/<pod>:/tmp/dump.dmp ./dump.dmp.", "বাইরে কপি: kubectl cp shop/<pod>:/tmp/dump.dmp ./dump.dmp।"], ["Analyse locally.", "Local-এ বিশ্লেষণ করুন।"], ["Delete sensitive files afterwards.", "পরে সংবেদনশীল file মুছুন।"]],
    m: ["Copying config into pods instead of using ConfigMaps; leaving memory dumps with customer data on laptops; failing because the image has no tar.", "ConfigMap-এর বদলে pod-এ config কপি; laptop-এ customer data-সহ memory dump রেখে দেওয়া; image-এ tar না থাকায় ব্যর্থ।"],
    q: ["Q: How do you get a memory dump of a .NET pod that is leaking? A: Use an ephemeral debug container with dotnet-dump (or dotnet-monitor sidecar), write the dump to a shared path, then kubectl cp it out and analyse with dotnet-dump analyze.", "প্রশ্ন: Leak করা .NET pod-এর memory dump কীভাবে নেবেন? উত্তর: dotnet-dump-সহ অস্থায়ী debug container (বা dotnet-monitor sidecar) দিন, dump শেয়ার path-এ লিখুন, তারপর kubectl cp দিয়ে বের করে dotnet-dump analyze দিয়ে বিশ্লেষণ করুন।"],
    f: ["dotnet-monitor exposes dumps, traces and metrics over HTTP in Kubernetes, reducing the need for manual cp, and works well with automated diagnostics.", "dotnet-monitor Kubernetes-এ HTTP দিয়ে dump, trace ও metric দেয়, হাতে cp-এর দরকার কমায় এবং স্বয়ংক্রিয় diagnostics-এর সাথে ভালো কাজ করে।"],
    x: [sh("Copy a report out of a pod · pod থেকে report কপি", `kubectl exec -n shop deploy/worker -- sh -c 'echo "orders,184233" > /tmp/report.csv'
POD=$(kubectl get pod -n shop -l app=worker -o jsonpath='{.items[0].metadata.name}')
kubectl cp shop/$POD:/tmp/report.csv ./report.csv
cat report.csv`, `orders,184233`)],
  },
  "config view": {
    s: ["A keyring with labels for each building you can enter: home, office, gym. kubectl config shows which clusters you can reach, as which user, and which one you are 'standing in' now.", "প্রতিটি ভবনের label-সহ চাবির গোছা: বাড়ি, অফিস, gym। kubectl config দেখায় কোন cluster-এ পৌঁছাতে পারেন, কোন user হিসেবে, আর এখন কোনটায় 'দাঁড়িয়ে' আছেন।"],
    t: ["kubeconfig (~/.kube/config) holds clusters (API server + CA), users (credentials or exec plugins) and contexts (cluster + user + default namespace). config view prints it with secrets redacted; get-contexts lists contexts; use-context switches; current-context shows the active one. Mistakes happen when you think you are on staging but are on production.", "kubeconfig (~/.kube/config) cluster (API server + CA), user (credential বা exec plugin) ও context (cluster + user + ডিফল্ট namespace) রাখে। config view secret লুকিয়ে দেখায়; get-contexts context-এর তালিকা দেয়; use-context বদলায়; current-context সক্রিয়টা দেখায়। আপনি staging-এ আছেন ভাবলেও production-এ থাকলে ভুল হয়।"],
    p: [["List contexts: kubectl config get-contexts.", "Context-এর তালিকা: kubectl config get-contexts।"], ["Switch: kubectl config use-context staging.", "বদলান: kubectl config use-context staging।"], ["Show your prompt's context (kube-ps1) to avoid mistakes.", "ভুল এড়াতে prompt-এ context দেখান (kube-ps1)।"], ["Keep production contexts read-only by default.", "Production context ডিফল্টভাবে read-only রাখুন।"]],
    m: ["Running commands against production by accident; sharing kubeconfig files with embedded admin tokens; very long-lived credentials.", "ভুলে production-এ command চালানো; embedded admin token-সহ kubeconfig file শেয়ার; খুব দীর্ঘস্থায়ী credential।"],
    q: ["Q: How do cloud providers authenticate kubectl without static tokens? A: Exec credential plugins (aws eks get-token, kubelogin for Azure) fetch short-lived tokens using your cloud/SSO identity.", "প্রশ্ন: Static token ছাড়া cloud provider kubectl-এর authentication কীভাবে করে? উত্তর: Exec credential plugin (aws eks get-token, Azure-এর জন্য kubelogin) আপনার cloud/SSO identity দিয়ে স্বল্পমেয়াদি token আনে।"],
    f: ["Give AI agents and CI their own kubeconfig with narrow RBAC, never your personal admin context.", "AI agent ও CI-কে সংকীর্ণ RBAC-সহ নিজস্ব kubeconfig দিন, কখনো আপনার ব্যক্তিগত admin context নয়।"],
    x: [sh("Know exactly where your commands go · command কোথায় যায় জানা", `kubectl config get-contexts
kubectl config use-context staging
kubectl config view --minify -o jsonpath='{.contexts[0].context.namespace}{"\\n"}'
kubectl auth can-i delete deployments -n shop`, `CURRENT   NAME         CLUSTER      AUTHINFO        NAMESPACE
*         prod-dhaka   prod-dhaka   sso-readonly    shop
          staging      staging      sso-developer   shop
Switched to context "staging".
shop
yes`)],
  },
  "cluster-info": {
    s: ["Checking the building's main electricity panel and water pump before starting work: are the essentials running? cluster-info shows where the control plane and core services are.", "কাজ শুরুর আগে ভবনের প্রধান বিদ্যুৎ panel ও পানির pump দেখা: মূল জিনিসগুলো চলছে? cluster-info control plane ও মূল service কোথায় তা দেখায়।"],
    t: ["kubectl cluster-info prints the API server URL and core services like CoreDNS. Combine with kubectl version (client/server skew), kubectl get --raw='/readyz?verbose' (API health), kubectl get pods -n kube-system (system pods) and kubectl api-resources. cluster-info dump collects diagnostics for support.", "kubectl cluster-info API server-এর URL ও CoreDNS-এর মতো মূল service দেখায়। kubectl version (client/server পার্থক্য), kubectl get --raw='/readyz?verbose' (API-র স্বাস্থ্য), kubectl get pods -n kube-system (system pod) ও kubectl api-resources-এর সাথে মেলান। cluster-info dump support-এর জন্য diagnostics সংগ্রহ করে।"],
    p: [["Run kubectl cluster-info.", "kubectl cluster-info চালান।"], ["Check versions: kubectl version.", "Version দেখুন: kubectl version।"], ["Check API readiness: kubectl get --raw='/readyz'.", "API প্রস্তুতি: kubectl get --raw='/readyz'।"], ["Check system pods in kube-system.", "kube-system-এ system pod দেখুন।"]],
    m: ["Ignoring large client/server version skew; assuming DNS works when CoreDNS pods are failing; sharing cluster-info dump output containing secrets.", "বড় client/server version পার্থক্য উপেক্ষা; CoreDNS pod ব্যর্থ হলেও DNS কাজ করে ধরে নেওয়া; secret-সহ cluster-info dump output শেয়ার।"],
    q: ["Q: Every pod suddenly fails to resolve service names. Where do you look? A: CoreDNS pods in kube-system (status, logs, resource limits) and recent NetworkPolicy changes affecting DNS on port 53.", "প্রশ্ন: হঠাৎ প্রতিটি pod service-এর নাম resolve করতে ব্যর্থ। কোথায় দেখবেন? উত্তর: kube-system-এ CoreDNS pod (status, log, resource limit) আর port 53-এ DNS প্রভাবিত করা সাম্প্রতিক NetworkPolicy পরিবর্তন।"],
    f: ["Managed Kubernetes (EKS, AKS, GKE) runs the control plane for you, but knowing how to check its health is still essential when things break.", "Managed Kubernetes (EKS, AKS, GKE) control plane আপনার হয়ে চালায়, কিন্তু কিছু ভাঙলে তার স্বাস্থ্য দেখতে জানা এখনো অপরিহার্য।"],
    x: [sh("Quick cluster health check · দ্রুত cluster-এর স্বাস্থ্য", `kubectl cluster-info
kubectl version | head -2
kubectl get --raw='/readyz'; echo
kubectl get pods -n kube-system -l k8s-app=kube-dns`, `Kubernetes control plane is running at https://203.0.113.20:6443
CoreDNS is running at https://203.0.113.20:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
Client Version: v1.33.2
Server Version: v1.33.1
ok
NAME                       READY   STATUS    RESTARTS   AGE
coredns-7db6d8ff4d-4kq2n   1/1     Running   0          40d
coredns-7db6d8ff4d-xm9tz   1/1     Running   0          40d`)],
  },
};
