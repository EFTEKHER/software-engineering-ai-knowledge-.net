// Module 08 High-Level Design: easy story, plain theory, steps, mistakes, interview, 2028 tip, runnable simulation.
import { cs, file } from "./helpers";

export default {
  "Scalability": {
    s: ["A tea stall gets famous. The owner can buy a bigger kettle (scale up) or open three more stalls with more staff (scale out). Bigger kettles have a limit; more stalls need coordination. That is the scalability choice.", "একটি চায়ের দোকান বিখ্যাত হলো। মালিক বড় কেটলি কিনতে পারেন (scale up) বা আরও তিনটি দোকান ও কর্মী নিতে পারেন (scale out)। বড় কেটলির সীমা আছে; বেশি দোকানে সমন্বয় লাগে। এটাই scalability-র পছন্দ।"],
    t: ["Vertical scaling adds CPU/RAM to one machine: simple, but limited and a single point of failure. Horizontal scaling adds more machines behind a load balancer: needs stateless app servers (sessions in Redis, files in blob storage) and a data layer that scales (read replicas, caching, sharding). Measure first: find the bottleneck (CPU, DB, network) before adding servers.", "Vertical scaling একটি machine-এ CPU/RAM বাড়ায়: সহজ, কিন্তু সীমিত ও single point of failure। Horizontal scaling load balancer-এর পিছনে আরও machine যোগ করে: stateless app server (session Redis-এ, file blob storage-এ) ও বাড়তে পারে এমন data স্তর (read replica, caching, sharding) লাগে। আগে মাপুন: server বাড়ানোর আগে bottleneck (CPU, DB, network) খুঁজুন।"],
    p: [["Measure current load and find the bottleneck.", "বর্তমান load মেপে bottleneck খুঁজুন।"], ["Make app servers stateless.", "App server stateless করুন।"], ["Add instances behind a load balancer with autoscaling.", "Autoscaling-সহ load balancer-এর পিছনে instance যোগ করুন।"], ["Scale the data layer: cache, replicas, then shard.", "Data স্তর বাড়ান: cache, replica, তারপর shard।"]],
    m: ["Adding servers when the database is the bottleneck; storing sessions in server memory; scaling before measuring; forgetting that more servers means more DB connections.", "Database bottleneck হলেও server বাড়ানো; server-এর memory-তে session রাখা; না মেপেই scale; বেশি server মানে বেশি DB connection তা ভুলে যাওয়া।"],
    q: ["Q: Your API handles 1,000 RPS and needs 10,000 RPS. Where do you start? A: Load test to find the bottleneck, make the API stateless and scale out, add caching for hot reads, move slow work to queues, then scale the database (replicas, sharding) based on read/write mix.", "প্রশ্ন: আপনার API ১,০০০ RPS সামলায়, লাগবে ১০,০০০ RPS। কোথা থেকে শুরু? উত্তর: Load test করে bottleneck খুঁজুন, API stateless করে scale out, ঘন ঘন পড়ার জন্য caching, ধীর কাজ queue-তে, তারপর পড়া/লেখার অনুপাত দেখে database বাড়ান (replica, sharding)।"],
    f: ["AI inference adds a new scaling dimension: GPU capacity and provider rate limits. Design queues, caching and fallbacks for model calls the same way you do for databases.", "AI inference নতুন scaling মাত্রা আনে: GPU ক্ষমতা ও provider-এর rate limit। Model call-এর জন্যও database-এর মতো queue, caching ও fallback design করুন।"],
    x: [cs("Throughput with more servers until the DB caps it · server বাড়লে throughput", `const int PerServerRps = 400;     // what one app server can handle
const int DatabaseMaxRps = 2_000; // shared database limit

foreach (int servers in new[] { 1, 2, 4, 8 })
{
    int app = servers * PerServerRps;
    int effective = Math.Min(app, DatabaseMaxRps);
    string bottleneck = app > DatabaseMaxRps ? "database" : "app servers";
    Console.WriteLine($"{servers} server(s): {effective,5} RPS  (bottleneck: {bottleneck})");
}
Console.WriteLine("Lesson: after 5 servers, add caching/replicas instead of more servers.");`, "1 server(s):   400 RPS  (bottleneck: app servers)\n2 server(s):   800 RPS  (bottleneck: app servers)\n4 server(s):  1600 RPS  (bottleneck: app servers)\n8 server(s):  2000 RPS  (bottleneck: database)\nLesson: after 5 servers, add caching/replicas instead of more servers.")],
  },
  "Load Balancing": {
    s: ["A bank with five counters and a token machine that sends each customer to the next free counter. Nobody crowds one counter while others sit idle. A load balancer is that token machine for servers.", "পাঁচটি কাউন্টার ও একটি token machine-সহ ব্যাংক, যা প্রত্যেক ক্রেতাকে পরের খালি কাউন্টারে পাঠায়। অন্যরা বসে থাকতে কেউ একটি কাউন্টারে ভিড় করে না। Load balancer হলো server-এর জন্য সেই token machine।"],
    t: ["A load balancer spreads requests across healthy servers. Algorithms: round robin, weighted, least connections, and hashing (IP or key) for stickiness. Health checks remove failed servers. Layer 4 balances TCP connections; layer 7 understands HTTP (paths, headers, TLS termination). Examples: Nginx, HAProxy, AWS ALB, Azure Front Door, Kubernetes Services.", "Load balancer সুস্থ server-গুলোর মধ্যে request ভাগ করে। Algorithm: round robin, weighted, least connections আর stickiness-এর জন্য hashing (IP বা key)। Health check ব্যর্থ server সরায়। Layer 4 TCP connection ভাগ করে; layer 7 HTTP বোঝে (path, header, TLS termination)। উদাহরণ: Nginx, HAProxy, AWS ALB, Azure Front Door, Kubernetes Service।"],
    p: [["Expose a /health endpoint on every instance.", "প্রতিটি instance-এ /health endpoint দিন।"], ["Choose an algorithm (least connections is a good default for uneven requests).", "Algorithm বাছুন (অসম request-এ least connections ভালো ডিফল্ট)।"], ["Terminate TLS at the balancer or pass it through deliberately.", "Balancer-এ TLS শেষ করুন বা সচেতনভাবে এগিয়ে দিন।"], ["Run at least two balancers or use a managed one.", "অন্তত দুটি balancer চালান বা managed ব্যবহার করুন।"]],
    m: ["A single load balancer as a new single point of failure; sticky sessions that unbalance traffic; health checks that only test 'process alive', not dependencies.", "একটি load balancer নতুন single point of failure; traffic অসম করা sticky session; শুধু 'process জীবিত' পরীক্ষা করা health check, dependency নয়।"],
    q: ["Q: Round robin vs least connections? A: Round robin assumes equal requests; least connections sends new work to the server with the fewest active requests, which handles slow or uneven requests better.", "প্রশ্ন: Round robin বনাম least connections? উত্তর: Round robin সমান request ধরে নেয়; least connections নতুন কাজ সবচেয়ে কম সক্রিয় request-এর server-এ পাঠায়, যা ধীর বা অসম request ভালো সামলায়।"],
    f: ["LLM gateways load-balance across model deployments and regions, often by remaining token quota rather than request count. Same idea, new metric.", "LLM gateway model deployment ও region-এর মধ্যে load-balance করে, প্রায়ই request সংখ্যার বদলে বাকি token quota দেখে। একই ধারণা, নতুন মাপকাঠি।"],
    x: [cs("Round robin vs least connections · দুই algorithm তুলনা", `int[] durations = [5, 1, 1, 5, 1, 1, 5, 1];   // seconds each request takes
int Simulate(string algo)
{
    var busyUntil = new int[3];                      // when each server becomes free
    int rr = 0, maxFinish = 0;
    for (int t = 0; t < durations.Length; t++)       // one request arrives per second
    {
        int s = algo == "round-robin" ? rr++ % 3
              : Enumerable.Range(0, 3).OrderBy(i => Math.Max(busyUntil[i] - t, 0)).First();
        busyUntil[s] = Math.Max(busyUntil[s], t) + durations[t];
        maxFinish = Math.Max(maxFinish, busyUntil[s]);
    }
    return maxFinish;
}
Console.WriteLine($"round robin finishes at t={Simulate("round-robin")}s");
Console.WriteLine($"least connections finishes at t={Simulate("least-conn")}s");`, "round robin finishes at t=15s\nleast connections finishes at t=11s")],
  },
  "Caching": {
    s: ["Keeping the most-used spices on the kitchen counter instead of the storeroom. You still restock from the storeroom, but most cooking is faster. A cache keeps hot data close to where it is needed.", "সবচেয়ে বেশি ব্যবহৃত মশলা গুদামঘরে না রেখে রান্নাঘরের তাকে রাখা। গুদাম থেকে আবার ভরতে হয়, কিন্তু বেশিরভাগ রান্না দ্রুত হয়। Cache দরকারি জায়গার কাছে গরম data রাখে।"],
    t: ["Caches exist at many layers: browser, CDN, reverse proxy, application memory, distributed cache (Redis) and database buffer. Patterns: cache-aside (app reads cache, falls back to DB), write-through and write-behind. Key decisions: what to cache, TTL, invalidation on writes, eviction policy (LRU) and protection against stampedes (single-flight, jittered TTLs).", "Cache অনেক স্তরে থাকে: browser, CDN, reverse proxy, application memory, distributed cache (Redis) ও database buffer। Pattern: cache-aside (app cache পড়ে, না পেলে DB), write-through ও write-behind। মূল সিদ্ধান্ত: কী cache, TTL, লেখার সময় invalidation, eviction নীতি (LRU) আর stampede থেকে সুরক্ষা (single-flight, jitter-যুক্ত TTL)।"],
    p: [["Measure which reads are hot and slow.", "কোন পড়া ঘন ঘন ও ধীর মাপুন।"], ["Add cache-aside with a TTL.", "TTL-সহ cache-aside দিন।"], ["Invalidate or update on writes.", "লেখার সময় invalidate বা update করুন।"], ["Track hit ratio and latency.", "Hit ratio ও latency দেখুন।"]],
    m: ["Caching everything forever; serving stale prices or stock; no plan for a cold cache after restarts; caching per-user data under shared keys.", "সবকিছু চিরকাল cache; পুরনো দাম বা stock দেখানো; restart-এর পরে ঠান্ডা cache-এর পরিকল্পনা নেই; শেয়ার key-তে user-ভিত্তিক data cache।"],
    q: ["Q: What is a cache stampede and how do you prevent it? A: Many requests miss the same expired key at once and all hit the database. Prevent with single-flight locking, early refresh and random TTL jitter.", "প্রশ্ন: Cache stampede কী এবং কীভাবে আটকাবেন? উত্তর: একই মেয়াদোত্তীর্ণ key-তে একসাথে অনেক request miss করে সবাই database-এ আঘাত করে। Single-flight locking, আগেভাগে refresh ও random TTL jitter দিয়ে আটকান।"],
    f: ["Prompt caching and semantic caching cut AI costs dramatically. The same TTL, invalidation and scoping rules apply to cached model responses.", "Prompt caching ও semantic caching AI-এর খরচ নাটকীয়ভাবে কমায়। Cache করা model response-এও একই TTL, invalidation ও scoping নিয়ম প্রযোজ্য।"],
    x: [cs("LRU cache with a fixed capacity · নির্দিষ্ট ক্ষমতার LRU cache", `var cache = new LruCache(capacity: 3);
foreach (var key in new[] { "rice", "oil", "salt", "rice", "sugar", "oil", "rice" })
    Console.WriteLine($"{key,-6} {(cache.Get(key) ? "HIT " : "MISS")}  [{cache}]");

class LruCache(int capacity)
{
    private readonly LinkedList<string> order = new();              // most recent at the front
    private readonly Dictionary<string, LinkedListNode<string>> map = new();
    public bool Get(string key)
    {
        if (map.TryGetValue(key, out var node)) { order.Remove(node); order.AddFirst(node); return true; }
        if (map.Count == capacity) { map.Remove(order.Last!.Value); order.RemoveLast(); }   // evict least recent
        map[key] = order.AddFirst(key);
        return false;
    }
    public override string ToString() => string.Join(",", order);
}`, "rice   MISS  [rice]\noil    MISS  [oil,rice]\nsalt   MISS  [salt,oil,rice]\nrice   HIT   [rice,salt,oil]\nsugar  MISS  [sugar,rice,salt]\noil    MISS  [oil,sugar,rice]\nrice   HIT   [rice,oil,sugar]")],
  },
  "CDN": {
    s: ["A bakery in Dhaka opens small outlets in Chattogram, Sylhet and Rajshahi stocked with its most popular bread. Customers buy from the nearest outlet instead of travelling to Dhaka. A CDN puts copies of your content near users.", "ঢাকার একটি bakery চট্টগ্রাম, সিলেট ও রাজশাহীতে জনপ্রিয় রুটিসহ ছোট outlet খোলে। ক্রেতারা ঢাকায় না গিয়ে কাছের outlet থেকে কেনে। CDN আপনার content-এর কপি user-এর কাছে রাখে।"],
    t: ["A content delivery network caches responses at edge locations worldwide. Static files (JS, CSS, images, video) are ideal; APIs can be cached when responses are public. Cache-Control headers decide what and how long; versioned file names (app.3f2a.js) allow long caching with instant updates. CDNs also absorb DDoS traffic and terminate TLS close to users.", "Content delivery network বিশ্বজুড়ে edge location-এ response cache করে। Static file (JS, CSS, ছবি, video) আদর্শ; response public হলে API-ও cache করা যায়। Cache-Control header ঠিক করে কী ও কতক্ষণ; version-যুক্ত file নাম (app.3f2a.js) দীর্ঘ caching-এর সাথে তাৎক্ষণিক আপডেট দেয়। CDN DDoS traffic শোষণ করে এবং user-এর কাছেই TLS শেষ করে।"],
    p: [["Serve static assets with fingerprinted names.", "Fingerprint-যুক্ত নামে static asset দিন।"], ["Set Cache-Control: public, max-age=31536000, immutable for them.", "তাদের জন্য Cache-Control: public, max-age=31536000, immutable দিন।"], ["Use short or no caching for HTML and private API responses.", "HTML ও private API response-এ ছোট বা কোনো caching নয়।"], ["Purge or version on deploy; watch the CDN hit ratio.", "Deploy-এ purge বা version; CDN hit ratio দেখুন।"]],
    m: ["Caching personalised pages at the edge (users see each other's data); forgetting to vary on language or encoding; long cache on index.html so new deploys do not appear.", "Edge-এ ব্যক্তিগত page cache (user একে অপরের data দেখে); ভাষা বা encoding অনুযায়ী vary ভুলে যাওয়া; index.html-এ দীর্ঘ cache থাকায় নতুন deploy দেখা যায় না।"],
    q: ["Q: How do you update a cached CSS file instantly? A: Change its file name (content hash) and reference the new name from HTML, which is cached briefly. No purge needed.", "প্রশ্ন: Cache করা CSS file তাৎক্ষণিক কীভাবে আপডেট করবেন? উত্তর: File-এর নাম বদলান (content hash) এবং অল্পক্ষণ cache হওয়া HTML থেকে নতুন নাম দিন। Purge লাগে না।"],
    f: ["Edge platforms now run code and even small AI models close to users. Understanding caching headers is the foundation for using them well.", "Edge platform এখন user-এর কাছেই code, এমনকি ছোট AI model চালায়। ভালোভাবে ব্যবহারে caching header বোঝা ভিত্তি।"],
    x: [cs("Pick the right Cache-Control per file · প্রতিটি file-এর সঠিক Cache-Control", `string Policy(string path) => path switch
{
    _ when path.StartsWith("/api/me") => "private, no-store",
    _ when path.StartsWith("/api/") => "public, max-age=60, stale-while-revalidate=30",
    _ when path.EndsWith(".html") || path == "/" => "no-cache",
    _ when System.Text.RegularExpressions.Regex.IsMatch(path, @"\\.[0-9a-f]{8}\\.(js|css|woff2|png)$") => "public, max-age=31536000, immutable",
    _ => "public, max-age=3600",
};

foreach (var p in new[] { "/", "/assets/app.3f2a9c1d.js", "/logo.png", "/api/products", "/api/me/orders" })
    Console.WriteLine($"{p,-26} {Policy(p)}");`, "/                          no-cache\n/assets/app.3f2a9c1d.js    public, max-age=31536000, immutable\n/logo.png                  public, max-age=3600\n/api/products              public, max-age=60, stale-while-revalidate=30\n/api/me/orders             private, no-store")],
  },
  "Blob Storage": {
    s: ["A huge, cheap warehouse with numbered shelves where you can store any box of any size, forever, and fetch it by its label. Blob storage (S3, Azure Blob) stores files by key, not in folders on a server.", "বিশাল, সস্তা গুদাম, নম্বর দেওয়া তাকসহ, যেখানে যেকোনো আকারের বাক্স চিরকাল রাখা যায় এবং label দিয়ে আনা যায়। Blob storage (S3, Azure Blob) server-এর folder-এ নয়, key দিয়ে file রাখে।"],
    t: ["Object storage keeps immutable objects (bytes + metadata) under keys in buckets/containers. It is highly durable (multiple copies), cheap, and scales without limits, but it is not a file system: no in-place edits and listing is slower. Best practices: store metadata in your database, upload/download directly with pre-signed URLs, use lifecycle rules to move old data to cheaper tiers, and keep buckets private.", "Object storage bucket/container-এ key-এর অধীনে অপরিবর্তনীয় object (bytes + metadata) রাখে। এটি খুব টেকসই (একাধিক কপি), সস্তা এবং সীমা ছাড়া বাড়ে, কিন্তু file system নয়: জায়গায় সম্পাদনা নেই এবং তালিকা ধীর। ভালো অভ্যাস: metadata database-এ রাখুন, pre-signed URL দিয়ে সরাসরি upload/download, পুরনো data সস্তা স্তরে নিতে lifecycle নিয়ম, আর bucket private রাখুন।"],
    p: [["Design keys: tenant/yyyy/mm/guid.ext.", "Key design করুন: tenant/yyyy/mm/guid.ext।"], ["Save key + size + owner in your DB.", "Key + আকার + মালিক DB-তে রাখুন।"], ["Issue short-lived pre-signed URLs for upload and download.", "Upload ও download-এর জন্য স্বল্পমেয়াদি pre-signed URL দিন।"], ["Add lifecycle rules (archive after 90 days, delete after N years).", "Lifecycle নিয়ম দিন (৯০ দিন পরে archive, N বছর পরে মোছা)।"]],
    m: ["Public buckets; storing files in the database or on app servers; using user file names as keys; no virus scanning for uploads.", "Public bucket; database বা app server-এ file রাখা; user-এর file নাম key হিসেবে; upload-এ virus scan না করা।"],
    q: ["Q: Why upload directly from the browser to S3 with a pre-signed URL? A: Large files bypass your API servers (less bandwidth and memory), uploads are faster, and permissions stay limited to one key for a few minutes.", "প্রশ্ন: Pre-signed URL দিয়ে browser থেকে সরাসরি S3-এ কেন upload? উত্তর: বড় file API server এড়ায় (কম bandwidth ও memory), upload দ্রুত হয়, আর অনুমতি কয়েক মিনিটের জন্য একটি key-তে সীমিত থাকে।"],
    f: ["Data lakes for analytics and document stores for AI retrieval are built on object storage. Good key design and metadata make later RAG indexing much easier.", "Analytics-এর data lake ও AI retrieval-এর document store object storage-এর উপর তৈরি। ভালো key design ও metadata পরে RAG indexing অনেক সহজ করে।"],
    x: [cs("Key design and lifecycle tiers · key design ও lifecycle স্তর", `string Key(string tenant, DateOnly day, Guid id, string fileName) =>
    $"{tenant}/{day:yyyy/MM}/{id:N}{Path.GetExtension(fileName).ToLowerInvariant()}";

var id = Guid.Parse("3f2a9c1d-0000-4000-8000-000000000001");
Console.WriteLine(Key("shop-42", new DateOnly(2026, 11, 12), id, "Invoice NOV.PDF"));

string Tier(int ageDays) => ageDays switch
{
    < 30 => "Hot (frequent access)",
    < 180 => "Cool (cheaper storage, small read fee)",
    < 2555 => "Archive (cheapest, hours to restore)",
    _ => "Delete (retention ended)",
};
foreach (int age in new[] { 3, 90, 400, 3000 }) Console.WriteLine($"{age,4} days -> {Tier(age)}");`, "shop-42/2026/11/3f2a9c1d000040008000000000000001.pdf\n   3 days -> Hot (frequent access)\n  90 days -> Cool (cheaper storage, small read fee)\n 400 days -> Archive (cheapest, hours to restore)\n3000 days -> Delete (retention ended)")],
  },
  "API Gateway": {
    s: ["A big office building's reception desk: visitors sign in once, get a badge, and are directed to the right department. Departments do not each run their own security desk. An API gateway is the single front door for many backend services.", "বড় অফিস ভবনের অভ্যর্থনা desk: দর্শনার্থী একবার sign in করে badge পান এবং সঠিক বিভাগে যান। প্রতিটি বিভাগ নিজের নিরাপত্তা desk চালায় না। API gateway অনেক backend service-এর একক সামনের দরজা।"],
    t: ["A gateway handles cross-cutting concerns at the edge: routing (/orders -> order service), authentication, rate limiting, request/response transformation, caching, TLS and observability. It can also aggregate several service calls into one response (backend-for-frontend). Options: YARP in .NET, Kong, Nginx, AWS API Gateway, Azure API Management. Keep business logic out of it.", "Gateway edge-এ সাধারণ বিষয় সামলায়: routing (/orders -> order service), authentication, rate limiting, request/response রূপান্তর, caching, TLS ও observability। কয়েকটি service call একটি response-এ মেলাতেও পারে (backend-for-frontend)। বিকল্প: .NET-এ YARP, Kong, Nginx, AWS API Gateway, Azure API Management। Business যুক্তি এর বাইরে রাখুন।"],
    p: [["List public routes and which service owns each.", "Public route ও প্রতিটির মালিক service তালিকা করুন।"], ["Configure routing and authentication at the gateway.", "Gateway-তে routing ও authentication ঠিক করুন।"], ["Add rate limits and request size limits.", "Rate limit ও request-আকারের সীমা যোগ করুন।"], ["Forward a correlation ID for tracing.", "Tracing-এর জন্য correlation ID এগিয়ে দিন।"]],
    m: ["Putting business rules in the gateway; one gateway shared by everything becoming a bottleneck; skipping authorization in services because 'the gateway checked'.", "Gateway-তে business নিয়ম রাখা; সবকিছুর শেয়ার করা একটি gateway bottleneck হয়ে যাওয়া; 'gateway যাচাই করেছে' ভেবে service-এ authorization বাদ।"],
    q: ["Q: Gateway vs load balancer? A: A load balancer spreads traffic across copies of one service; a gateway routes to different services and applies policies like auth and rate limits. They are often used together.", "প্রশ্ন: Gateway বনাম load balancer? উত্তর: Load balancer একটি service-এর কপিগুলোর মধ্যে traffic ভাগ করে; gateway ভিন্ন service-এ route করে এবং auth ও rate limit-এর মতো নীতি প্রয়োগ করে। প্রায়ই একসাথে ব্যবহৃত হয়।"],
    f: ["AI gateways extend this idea for model traffic: routing between providers, enforcing token budgets, caching and redacting prompts.", "AI gateway model traffic-এর জন্য এই ধারণা বাড়ায়: provider-এর মধ্যে routing, token budget প্রয়োগ, caching ও prompt থেকে তথ্য মোছা।"],
    x: [file("json", "YARP reverse proxy routes in appsettings.json · YARP route", `{
  "ReverseProxy": {
    "Routes": {
      "orders": {
        "ClusterId": "orders",
        "AuthorizationPolicy": "default",
        "RateLimiterPolicy": "per-user",
        "Match": { "Path": "/api/orders/{**rest}" }
      },
      "catalog": {
        "ClusterId": "catalog",
        "Match": { "Path": "/api/products/{**rest}" }
      }
    },
    "Clusters": {
      "orders": {
        "LoadBalancingPolicy": "LeastRequests",
        "HealthCheck": { "Active": { "Enabled": true, "Path": "/health" } },
        "Destinations": {
          "o1": { "Address": "http://orders-1:8080/" },
          "o2": { "Address": "http://orders-2:8080/" }
        }
      },
      "catalog": {
        "Destinations": { "c1": { "Address": "http://catalog:8080/" } }
      }
    }
  }
}
// Program.cs: builder.Services.AddReverseProxy().LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
//             app.MapReverseProxy();`, undefined, "Gateway configuration")],
  },
  "Replication": {
    s: ["A school keeps the official register in the office and photocopies in each classroom. Teachers read the copies; only the office writes changes, then sends new copies. Database replication keeps copies of data on several servers.", "স্কুল অফিসে মূল register রাখে আর প্রতিটি classroom-এ photocopy। শিক্ষক কপি পড়েন; শুধু অফিস পরিবর্তন লেখে, তারপর নতুন কপি পাঠায়। Database replication কয়েকটি server-এ data-র কপি রাখে।"],
    t: ["Leader-follower (primary-replica) replication sends writes to the primary and copies them to replicas, which serve reads and act as standbys. Synchronous replication waits for replicas (safer, slower); asynchronous does not (faster, but replicas lag and a failover can lose recent writes). Multi-leader and leaderless designs allow writes in several places but need conflict resolution.", "Leader-follower (primary-replica) replication লেখা primary-তে পাঠায় এবং replica-তে কপি করে, যারা পড়া সামলায় ও standby থাকে। Synchronous replication replica-র অপেক্ষা করে (নিরাপদ, ধীর); asynchronous করে না (দ্রুত, কিন্তু replica পিছিয়ে থাকে এবং failover-এ সাম্প্রতিক লেখা হারাতে পারে)। Multi-leader ও leaderless design কয়েক জায়গায় লেখা দেয়, কিন্তু conflict সমাধান লাগে।"],
    p: [["Send writes to the primary and reads to replicas.", "লেখা primary-তে, পড়া replica-তে পাঠান।"], ["Read your own writes from the primary when freshness matters.", "Freshness জরুরি হলে নিজের লেখা primary থেকে পড়ুন।"], ["Monitor replication lag.", "Replication lag নজরে রাখুন।"], ["Test failover regularly.", "নিয়মিত failover test করুন।"]],
    m: ["Showing a user stale data right after they saved (read-after-write problem); treating replicas as backups (deletes replicate too); never testing failover.", "Save করার ঠিক পরে user-কে পুরনো data দেখানো (read-after-write সমস্যা); replica-কে backup ভাবা (মোছাও replicate হয়); কখনো failover test না করা।"],
    q: ["Q: A user updates their profile and immediately sees the old name. Why and how to fix? A: The read went to a lagging replica. Route the user's reads to the primary for a short time after writes, or read using a version/timestamp check.", "প্রশ্ন: User profile আপডেট করে সাথে সাথে পুরনো নাম দেখে। কেন এবং কীভাবে ঠিক করবেন? উত্তর: পড়া পিছিয়ে থাকা replica-তে গেছে। লেখার পরে কিছুক্ষণ সেই user-এর পড়া primary-তে পাঠান, বা version/timestamp যাচাই দিয়ে পড়ুন।"],
    f: ["Cloud databases make replicas a checkbox, but the trade-offs (lag, consistency, failover data loss) remain your design responsibility.", "Cloud database replica-কে একটি checkbox বানায়, কিন্তু trade-off (lag, consistency, failover-এ data হারানো) এখনো আপনার design-এর দায়িত্ব।"],
    x: [cs("Replication lag and read-your-writes · replication lag ও নিজের লেখা পড়া", `var primary = new Dictionary<string, string> { ["asha.name"] = "Asha" };
var replica = new Dictionary<string, string>(primary);
var pending = new Queue<(int ApplyAt, string Key, string Value)>();
int clock = 0;

void Write(string k, string v) { primary[k] = v; pending.Enqueue((clock + 2, k, v)); }   // async copy, 2 ticks lag
void Tick() { clock++; while (pending.Count > 0 && pending.Peek().ApplyAt <= clock) { var p = pending.Dequeue(); replica[p.Key] = p.Value; } }
string Read(string k, bool fromPrimary) => (fromPrimary ? primary : replica)[k];

Write("asha.name", "Asha Rahman");
Console.WriteLine($"t={clock} replica: {Read("asha.name", false)}  (stale)");
Console.WriteLine($"t={clock} primary: {Read("asha.name", true)}  (read-your-writes)");
Tick(); Tick();
Console.WriteLine($"t={clock} replica: {Read("asha.name", false)}  (caught up)");`, "t=0 replica: Asha  (stale)\nt=0 primary: Asha Rahman  (read-your-writes)\nt=2 replica: Asha Rahman  (caught up)")],
  },
  "Database Sharding": {
    s: ["A national library too big for one building splits books by author surname: A-F in building 1, G-M in building 2, and so on. Each building handles fewer visitors. Sharding splits one database into many by a key.", "এক ভবনে আঁটে না এমন জাতীয় library লেখকের পদবি অনুযায়ী বই ভাগ করে: A-F ১ নম্বর ভবনে, G-M ২ নম্বরে, এভাবে। প্রতিটি ভবনে কম দর্শনার্থী। Sharding একটি key দিয়ে এক database-কে অনেকগুলোতে ভাগ করে।"],
    t: ["Each shard holds a subset of rows chosen by a shard key (customer ID, tenant ID). Range sharding keeps ranges together (good for range queries, risk of hot spots); hash sharding spreads evenly; directory sharding uses a lookup table. Costs: cross-shard queries and transactions are hard, rebalancing is work, and a bad key creates hot shards. Shard only after caching, replicas and indexing are exhausted.", "প্রতিটি shard shard key (customer ID, tenant ID) দিয়ে বাছাই করা row-এর একটি অংশ রাখে। Range sharding পরিসর একসাথে রাখে (range query-তে ভালো, hot spot-এর ঝুঁকি); hash sharding সমানভাবে ছড়ায়; directory sharding lookup table ব্যবহার করে। খরচ: shard-এর মধ্যে query ও transaction কঠিন, rebalancing পরিশ্রমের, আর খারাপ key hot shard বানায়। Caching, replica ও indexing শেষ হওয়ার পরেই shard করুন।"],
    p: [["Pick a shard key that appears in most queries and spreads load.", "বেশিরভাগ query-তে থাকে ও load ছড়ায় এমন shard key বাছুন।"], ["Route each request to the shard by that key.", "সেই key দিয়ে প্রতিটি request shard-এ পাঠান।"], ["Keep related data on the same shard.", "সম্পর্কিত data একই shard-এ রাখুন।"], ["Plan rebalancing (consistent hashing or many logical shards).", "Rebalancing পরিকল্পনা করুন (consistent hashing বা অনেক logical shard)।"]],
    m: ["Sharding by date (all new writes hit one shard); using a key absent from most queries (scatter-gather everywhere); hash % N that remaps almost everything when N changes.", "তারিখ দিয়ে sharding (সব নতুন লেখা এক shard-এ); বেশিরভাগ query-তে নেই এমন key (সব জায়গায় scatter-gather); hash % N, যা N বদলালে প্রায় সব নতুন জায়গায় পাঠায়।"],
    q: ["Q: Why is hash(userId) % N painful when adding a shard? A: Most keys map to a different shard when N changes, forcing mass data movement. Consistent hashing or a fixed number of virtual shards limits movement.", "প্রশ্ন: Shard যোগ করলে hash(userId) % N কেন কষ্টকর? উত্তর: N বদলালে বেশিরভাগ key ভিন্ন shard-এ যায়, বিপুল data সরাতে হয়। Consistent hashing বা নির্দিষ্ট সংখ্যক virtual shard সরানো সীমিত রাখে।"],
    f: ["Multi-tenant SaaS (including AI SaaS with per-tenant vector stores) often shards by tenant. It also simplifies data residency and per-customer deletion.", "Multi-tenant SaaS (tenant-ভিত্তিক vector store-সহ AI SaaS) প্রায়ই tenant দিয়ে shard করে। Data residency ও customer-ভিত্তিক মোছাও সহজ করে।"],
    x: [cs("How many keys move when you add a shard? · shard যোগে কত key সরে", `uint Hash(string s) { uint h = 2166136261; foreach (char c in s) { h ^= c; h *= 16777619; } return h; }   // FNV-1a
var keys = Enumerable.Range(1, 10_000).Select(i => $"user-{i}").ToList();

int Moved(int from, int to) => keys.Count(k => Hash(k) % from != Hash(k) % to);
Console.WriteLine($"mod sharding 4 -> 5 shards: {Moved(4, 5) * 100 / keys.Count}% of keys move");

// Fixed 64 logical shards mapped to physical servers: only reassigned logical shards move
int Logical(string k) => (int)(Hash(k) % 64);
int Physical(int logical, int servers) => logical % servers;
int movedLogical = keys.Count(k => Physical(Logical(k), 4) != Physical(Logical(k), 5));
Console.WriteLine($"naive remap of logical shards: {movedLogical * 100 / keys.Count}%  (use a directory to move only ~1/5)");`, "mod sharding 4 -> 5 shards: 80% of keys move\nnaive remap of logical shards: 74%  (use a directory to move only ~1/5)")],
  },
  "Consistent Hashing": {
    s: ["Seats arranged around a round table. Each guest sits at the next empty chair clockwise from where their name card lands. Add a chair, and only the guests near it shift. Consistent hashing places servers and keys on a ring so few keys move when servers change.", "গোল টেবিলের চারপাশে চেয়ার। প্রতিটি অতিথি নিজের নামের কার্ড যেখানে পড়ে তার পরের খালি চেয়ারে ঘড়ির কাঁটার দিকে বসে। একটি চেয়ার যোগ করলে শুধু কাছের অতিথিরা সরে। Consistent hashing server ও key একটি বৃত্তে রাখে, তাই server বদলালে অল্প key সরে।"],
    t: ["Hash servers and keys onto the same ring (0..2^32). A key belongs to the first server clockwise. Adding a server only takes keys from its neighbour (about 1/N of keys move). Virtual nodes (each server appears many times on the ring) smooth out uneven distribution. Used in distributed caches, Cassandra/DynamoDB partitioning and load balancers.", "Server ও key একই বৃত্তে (0..2^32) hash করুন। একটি key ঘড়ির কাঁটার দিকে প্রথম server-এর। Server যোগ করলে শুধু প্রতিবেশীর key নেয় (প্রায় 1/N key সরে)। Virtual node (প্রতিটি server বৃত্তে অনেকবার) অসম বিতরণ মসৃণ করে। Distributed cache, Cassandra/DynamoDB partitioning ও load balancer-এ ব্যবহৃত।"],
    p: [["Hash each server name many times (virtual nodes) onto a sorted ring.", "প্রতিটি server-এর নাম অনেকবার (virtual node) sorted বৃত্তে hash করুন।"], ["For a key, binary-search the first ring point >= hash(key).", "Key-এর জন্য hash(key)-এর সমান বা বড় প্রথম বিন্দু binary-search করুন।"], ["Wrap around to the start at the end of the ring.", "বৃত্তের শেষে শুরুতে ফিরুন।"], ["Measure distribution and movement when servers change.", "Server বদলালে বিতরণ ও সরানো মাপুন।"]],
    m: ["Too few virtual nodes (uneven load); a weak hash function; forgetting replication to the next N nodes for durability.", "খুব কম virtual node (অসম load); দুর্বল hash function; টেকসইতার জন্য পরের N node-এ replication ভুলে যাওয়া।"],
    q: ["Q: With 4 servers and consistent hashing, roughly what fraction of keys move when a 5th is added? A: About 1/5 (the new server's share), compared with about 80% for hash % N.", "প্রশ্ন: ৪টি server ও consistent hashing-এ ৫ম যোগ করলে মোটামুটি কত ভাগ key সরে? উত্তর: প্রায় 1/5 (নতুন server-এর ভাগ), hash % N-এ যেখানে প্রায় ৮০%।"],
    f: ["Sharded vector indexes and distributed AI caches use the same ring idea to place embeddings and route queries.", "Shard করা vector index ও distributed AI cache embedding রাখতে ও query পাঠাতে একই বৃত্তের ধারণা ব্যবহার করে।"],
    x: [cs("Hash ring with virtual nodes · virtual node-সহ hash ring", `uint Hash(string s) { uint h = 2166136261; foreach (char c in s) { h ^= c; h *= 16777619; } h ^= h >> 15; h *= 2246822519; h ^= h >> 13; return h; }

SortedDictionary<uint, string> BuildRing(IEnumerable<string> servers, int vnodes = 100)
{
    var ring = new SortedDictionary<uint, string>();
    foreach (var s in servers) for (int v = 0; v < vnodes; v++) ring[Hash($"{s}#{v}")] = s;
    return ring;
}
string Owner(SortedDictionary<uint, string> ring, string key)
{
    uint h = Hash(key);
    foreach (var (point, server) in ring) if (point >= h) return server;   // first point clockwise
    return ring.First().Value;                                             // wrap around
}

var keys = Enumerable.Range(1, 2000).Select(i => $"cart-{i}").ToList();
var ring4 = BuildRing(["A", "B", "C", "D"]);
var ring5 = BuildRing(["A", "B", "C", "D", "E"]);
int moved = keys.Count(k => Owner(ring4, k) != Owner(ring5, k));
Console.WriteLine($"keys moved after adding E: {moved * 100 / keys.Count}% (ideal ~20%)");
Console.WriteLine($"moved keys all went to E: {keys.Where(k => Owner(ring4, k) != Owner(ring5, k)).All(k => Owner(ring5, k) == "E")}");`, "keys moved after adding E: 17% (ideal ~20%)\nmoved keys all went to E: True")],
  },
  "Kafka and Pub / Sub": {
    s: ["A newspaper is printed once and delivered to every subscriber; each reads at their own pace, and the archive keeps old editions. Kafka is a durable newspaper for events: producers publish, many consumer groups read independently.", "সংবাদপত্র একবার ছাপা হয়ে প্রত্যেক গ্রাহকের কাছে যায়; প্রত্যেকে নিজের গতিতে পড়ে, আর archive-এ পুরনো সংখ্যা থাকে। Kafka হলো event-এর টেকসই সংবাদপত্র: producer প্রকাশ করে, অনেক consumer group স্বাধীনভাবে পড়ে।"],
    t: ["Kafka stores events in topics split into partitions; each partition is an append-only, ordered log kept for a retention period. Producers choose the partition by key, so events for one key stay ordered. Consumer groups share partitions among their members, and each group tracks its own offset. This enables replay, many independent subscribers and very high throughput.", "Kafka event-কে partition-এ ভাগ করা topic-এ রাখে; প্রতিটি partition একটি শুধু-যোগ, ক্রমানুসারী log, যা নির্দিষ্ট সময় রাখা হয়। Producer key দিয়ে partition বাছে, তাই এক key-এর event ক্রমে থাকে। Consumer group তাদের সদস্যদের মধ্যে partition ভাগ করে, আর প্রতিটি group নিজের offset রাখে। এতে replay, অনেক স্বাধীন subscriber ও খুব বেশি throughput সম্ভব।"],
    p: [["Name topics after facts (order-placed).", "ঘটনার নামে topic রাখুন (order-placed)।"], ["Choose a key that needs ordering (orderId).", "যেটায় ক্রম লাগে সেই key বাছুন (orderId)।"], ["Make consumers idempotent; commit offsets after processing.", "Consumer idempotent করুন; প্রক্রিয়ার পরে offset commit করুন।"], ["Set retention and a dead-letter strategy.", "Retention ও dead-letter কৌশল ঠিক করুন।"]],
    m: ["Expecting global ordering across partitions; more consumers than partitions (extra ones sit idle); committing offsets before processing (data loss on crash).", "Partition জুড়ে global ক্রম আশা করা; partition-এর চেয়ে বেশি consumer (বাড়তিরা বসে থাকে); প্রক্রিয়ার আগে offset commit (crash-এ data হারানো)।"],
    q: ["Q: Queue vs pub/sub? A: In a queue, each message is processed by one worker; in pub/sub, every subscriber group receives every message. Kafka does both via consumer groups.", "প্রশ্ন: Queue বনাম pub/sub? উত্তর: Queue-তে প্রতিটি বার্তা একজন worker প্রক্রিয়া করে; pub/sub-এ প্রতিটি subscriber group প্রতিটি বার্তা পায়। Kafka consumer group দিয়ে দুটোই করে।"],
    f: ["Event streams feed real-time analytics, search indexes and AI pipelines (re-embedding documents when they change). Event-driven skills are increasingly central.", "Event stream real-time analytics, search index ও AI pipeline (document বদলালে আবার embedding) চালায়। Event-চালিত দক্ষতা ক্রমশ কেন্দ্রীয় হচ্ছে।"],
    x: [cs("Partitions keep per-key order; groups read independently · partition ও consumer group", `const int Partitions = 3;
var log = Enumerable.Range(0, Partitions).Select(_ => new List<string>()).ToArray();
int PartitionFor(string key) => Math.Abs(key.Sum(c => c)) % Partitions;

foreach (var (key, ev) in new[] { ("A-1", "placed"), ("A-2", "placed"), ("A-1", "paid"), ("A-1", "shipped"), ("A-2", "cancelled") })
    log[PartitionFor(key)].Add($"{key}:{ev}");

for (int p = 0; p < Partitions; p++) Console.WriteLine($"partition {p}: {string.Join(" | ", log[p])}");

// Two consumer groups each keep their own offsets and see every event
var offsets = new Dictionary<string, int[]> { ["email"] = new int[Partitions], ["analytics"] = new int[Partitions] };
offsets["email"][PartitionFor("A-1")] = 1;   // email group processed 1 event so far in that partition
Console.WriteLine($"email group lag: {Enumerable.Range(0, Partitions).Sum(p => log[p].Count - offsets["email"][p])} events");
Console.WriteLine($"analytics group lag: {Enumerable.Range(0, Partitions).Sum(p => log[p].Count - offsets["analytics"][p])} events");`, "partition 0: A-1:placed | A-1:paid | A-1:shipped\npartition 1: A-2:placed | A-2:cancelled\npartition 2: \nemail group lag: 4 events\nanalytics group lag: 5 events")],
  },
  "Event-Driven Architecture": {
    s: ["When a baby is born, the hospital announces it once. The family celebrates, the registry office records it, and the vaccination centre schedules shots, each on their own. Nobody calls each office in turn. Event-driven systems announce facts and let interested services react.", "শিশু জন্ম নিলে হাসপাতাল একবার ঘোষণা করে। পরিবার উদ্‌যাপন করে, নিবন্ধন অফিস লেখে, টিকাকেন্দ্র টিকার সময় ঠিক করে, প্রত্যেকে নিজে নিজে। কেউ পালা করে প্রতিটি অফিসে ফোন করে না। Event-চালিত system ঘটনা ঘোষণা করে এবং আগ্রহী service সাড়া দেয়।"],
    t: ["Services publish events (OrderPlaced) after committing their own change; other services subscribe and react asynchronously. Benefits: loose coupling, independent scaling, easy addition of new consumers. Costs: eventual consistency, harder debugging, duplicate/out-of-order events. Use the outbox pattern to publish reliably, idempotent consumers, correlation IDs and schema versioning.", "Service নিজের পরিবর্তন commit করার পরে event (OrderPlaced) প্রকাশ করে; অন্য service subscribe করে asynchronous-ভাবে সাড়া দেয়। সুবিধা: ঢিলা সংযোগ, স্বাধীন scaling, নতুন consumer সহজে যোগ। খরচ: eventual consistency, কঠিন debugging, duplicate/ক্রমহীন event। নির্ভরযোগ্যভাবে প্রকাশে outbox pattern, idempotent consumer, correlation ID ও schema versioning ব্যবহার করুন।"],
    p: [["Save the business change and an outbox row in one transaction.", "এক transaction-এ ব্যবসার পরিবর্তন ও একটি outbox row রাখুন।"], ["A relay publishes outbox rows to the broker.", "একটি relay outbox row broker-এ প্রকাশ করে।"], ["Consumers process idempotently by event ID.", "Consumer event ID দিয়ে idempotent-ভাবে প্রক্রিয়া করে।"], ["Version event schemas and keep them backward compatible.", "Event schema-র version দিন এবং পেছনের সাথে সামঞ্জস্য রাখুন।"]],
    m: ["Publishing before the DB commit (ghost events) or after a crash-prone gap (lost events); events carrying commands ('SendEmail') instead of facts; no tracing across services.", "DB commit-এর আগে প্রকাশ (ভূতুড়ে event) বা crash-প্রবণ ফাঁকের পরে (হারানো event); ঘটনার বদলে আদেশ বহন করা event ('SendEmail'); service জুড়ে tracing নেই।"],
    q: ["Q: What does the outbox pattern solve? A: The dual-write problem: saving to the database and publishing a message cannot be atomic, so you save the message in the same transaction and publish it afterwards with retries.", "প্রশ্ন: Outbox pattern কী সমাধান করে? উত্তর: Dual-write সমস্যা: database-এ রাখা ও বার্তা প্রকাশ atomic হতে পারে না, তাই একই transaction-এ বার্তা রেখে পরে retry-সহ প্রকাশ করা হয়।"],
    f: ["AI agents increasingly subscribe to business events (new ticket, failed payment) and act. A clean event model makes adding such agents safe and easy.", "AI agent ক্রমশ ব্যবসার event-এ (নতুন ticket, ব্যর্থ payment) subscribe করে কাজ করছে। পরিষ্কার event model এমন agent যোগ নিরাপদ ও সহজ করে।"],
    x: [cs("Transactional outbox with a relay · outbox ও relay", `var orders = new List<string>();
var outbox = new List<(Guid Id, string Type, string Data, bool Sent)>();
var processed = new HashSet<Guid>();

void PlaceOrder(string id)
{
    // In a real DB both inserts share one transaction
    orders.Add(id);
    outbox.Add((Guid.NewGuid(), "OrderPlaced", id, false));
}
void Relay(bool crashAfterPublish)
{
    for (int i = 0; i < outbox.Count; i++)
    {
        if (outbox[i].Sent) continue;
        Deliver(outbox[i].Id, outbox[i].Type, outbox[i].Data);
        if (crashAfterPublish) { Console.WriteLine("relay crashed before marking sent"); return; }
        outbox[i] = outbox[i] with { Sent = true };
    }
}
void Deliver(Guid id, string type, string data)
{
    if (!processed.Add(id)) { Console.WriteLine($"consumer: duplicate {type} {data} ignored"); return; }
    Console.WriteLine($"consumer: {type} {data} -> send receipt");
}

PlaceOrder("A-7");
Relay(crashAfterPublish: true);   // at-least-once: will be re-sent
Relay(crashAfterPublish: false);
Console.WriteLine($"orders={orders.Count}, unsent outbox rows={outbox.Count(o => !o.Sent)}");`, "consumer: OrderPlaced A-7 -> send receipt\nrelay crashed before marking sent\nconsumer: duplicate OrderPlaced A-7 ignored\norders=1, unsent outbox rows=0")],
  },
  "Microservices": {
    s: ["A big restaurant splits into stations: grill, bakery, desserts, each with its own staff and fridge. One station can be renovated without closing the restaurant. Microservices split a system into small services owned by small teams.", "বড় রেস্তোরাঁ স্টেশনে ভাগ হয়: grill, bakery, dessert, প্রত্যেকের নিজস্ব কর্মী ও ফ্রিজ। রেস্তোরাঁ বন্ধ না করেই একটি স্টেশন সংস্কার করা যায়। Microservice একটি system-কে ছোট দলের মালিকানাধীন ছোট service-এ ভাগ করে।"],
    t: ["Each microservice owns a business capability and its own data, deploys independently and communicates via APIs or events. Benefits: team autonomy, independent scaling and deployment. Costs: network failures, distributed data consistency, more infrastructure (service discovery, tracing, CI/CD per service). Many teams start with a modular monolith and extract services when boundaries and scale justify it.", "প্রতিটি microservice একটি ব্যবসায়িক সক্ষমতা ও নিজের data-র মালিক, স্বাধীনভাবে deploy হয় এবং API বা event দিয়ে যোগাযোগ করে। সুবিধা: দলের স্বাধীনতা, স্বাধীন scaling ও deployment। খরচ: network ব্যর্থতা, distributed data-র consistency, বেশি infrastructure (service discovery, tracing, service-প্রতি CI/CD)। অনেক দল modular monolith দিয়ে শুরু করে এবং সীমানা ও scale যৌক্তিক হলে service আলাদা করে।"],
    p: [["Find boundaries using business capabilities (orders, payments, catalog).", "ব্যবসায়িক সক্ষমতা দিয়ে সীমানা খুঁজুন (order, payment, catalog)।"], ["Start as modules in one deployable with separate schemas.", "আলাদা schema-সহ এক deployable-এ module হিসেবে শুরু করুন।"], ["Extract a service only when it needs independent scaling or release.", "স্বাধীন scaling বা release লাগলেই service আলাদা করুন।"], ["Add timeouts, retries, circuit breakers and tracing from day one.", "প্রথম দিন থেকেই timeout, retry, circuit breaker ও tracing দিন।"]],
    m: ["Shared database across services (hidden coupling); chatty synchronous calls in long chains; splitting too early with a tiny team; no observability.", "Service-এর মধ্যে শেয়ার database (লুকানো সংযোগ); লম্বা শৃঙ্খলে বাচাল synchronous call; ছোট দলে খুব আগে ভাগ করা; observability নেই।"],
    q: ["Q: When would you NOT use microservices? A: Small team, unclear domain, early product. A modular monolith is faster to build and change; extract services later when there is real need.", "প্রশ্ন: কখন microservice ব্যবহার করবেন না? উত্তর: ছোট দল, অস্পষ্ট domain, প্রাথমিক product। Modular monolith বানাতে ও বদলাতে দ্রুত; সত্যিকারের দরকার হলে পরে service আলাদা করুন।"],
    f: ["AI capabilities are often added as separate services (embedding service, model gateway, agent runner) because they scale and fail differently. .NET Aspire helps run such multi-service apps locally.", "AI সক্ষমতা প্রায়ই আলাদা service হিসেবে যোগ হয় (embedding service, model gateway, agent runner), কারণ তারা ভিন্নভাবে বাড়ে ও ব্যর্থ হয়। .NET Aspire এমন multi-service app local-এ চালাতে সাহায্য করে।"],
    x: [cs("Availability of a synchronous call chain · synchronous শৃঙ্খলের availability", `double[] services = [0.999, 0.999, 0.995, 0.999];   // gateway, orders, payments, inventory
double chain = services.Aggregate(1.0, (a, b) => a * b);
Console.WriteLine($"each service up {services.Min() * 100:0.0}%..{services.Max() * 100:0.0}%");
Console.WriteLine($"whole synchronous chain up: {chain * 100:0.00}%");
Console.WriteLine($"downtime per month: {(1 - chain) * 30 * 24 * 60:0} minutes");
Console.WriteLine("Fix: make payments/inventory async (queue) or cache them, so one failure does not fail the request.");`, "each service up 99.5%..99.9%\nwhole synchronous chain up: 99.20%\ndowntime per month: 345 minutes\nFix: make payments/inventory async (queue) or cache them, so one failure does not fail the request.")],
  },
  "Rate Limiter Design": {
    s: ["A water tank with a tap that refills it slowly. You can draw a few buckets quickly, but if you keep drawing, you must wait for it to refill. A token-bucket rate limiter works exactly like that.", "ধীরে ভরতে থাকা কলসহ একটি পানির ট্যাংক। দ্রুত কয়েক বালতি তোলা যায়, কিন্তু তুলতে থাকলে ভরার জন্য অপেক্ষা করতে হয়। Token-bucket rate limiter ঠিক এভাবে কাজ করে।"],
    t: ["Designing a distributed rate limiter: choose the algorithm (token bucket for bursts, sliding window for accuracy, fixed window for simplicity), the key (user, API key, IP), and where it runs (gateway or service). Across many servers, store counters in Redis and update atomically (Lua script or INCR with expiry). Return 429 with Retry-After, and fail open or closed deliberately if Redis is down.", "Distributed rate limiter design: algorithm বাছুন (burst-এর জন্য token bucket, নির্ভুলতায় sliding window, সরলতায় fixed window), key (user, API key, IP) আর কোথায় চলবে (gateway বা service)। অনেক server-এ counter Redis-এ রাখুন এবং atomic-ভাবে আপডেট করুন (Lua script বা মেয়াদসহ INCR)। Retry-After-সহ 429 দিন, আর Redis বন্ধ হলে সচেতনভাবে fail open বা closed ঠিক করুন।"],
    p: [["Define limits per plan (free 60/min, pro 600/min).", "Plan অনুযায়ী সীমা ঠিক করুন (free 60/min, pro 600/min)।"], ["Pick the algorithm and the key.", "Algorithm ও key বাছুন।"], ["Implement atomically in a shared store.", "শেয়ার store-এ atomic-ভাবে বাস্তবায়ন করুন।"], ["Expose headers (X-RateLimit-Remaining) and metrics.", "Header (X-RateLimit-Remaining) ও metric দেখান।"]],
    m: ["Read-then-write race conditions in Redis; per-instance memory limits behind a load balancer; fixed windows allowing double bursts at the boundary.", "Redis-এ পড়ে-তারপর-লেখার race condition; load balancer-এর পিছনে instance-ভিত্তিক memory সীমা; fixed window-এ সীমানায় দ্বিগুণ burst।"],
    q: ["Q: Fixed window's weakness? A: A user can send the full limit at 10:00:59 and again at 10:01:00, doubling the rate briefly. Sliding windows or token buckets smooth this.", "প্রশ্ন: Fixed window-এর দুর্বলতা? উত্তর: User 10:00:59-এ পুরো সীমা আর 10:01:00-এ আবার পাঠাতে পারে, অল্পক্ষণে দ্বিগুণ হার। Sliding window বা token bucket এটি মসৃণ করে।"],
    f: ["AI APIs are limited by tokens per minute as well as requests per minute. Design limiters that count weighted cost, not just calls.", "AI API request-প্রতি-মিনিটের পাশাপাশি token-প্রতি-মিনিটে সীমিত। শুধু call নয়, ভারযুক্ত খরচ গোনে এমন limiter design করুন।"],
    x: [cs("Fixed window boundary burst vs sliding log · fixed window বনাম sliding", `int limit = 5;
int[] times = [55, 56, 57, 58, 59, 60, 61, 62, 63, 64];   // seconds: a burst across the minute boundary

int fixedAllowed = 0; var windowCounts = new Dictionary<int, int>();
foreach (int t in times)
{
    int w = t / 60;
    if (windowCounts.GetValueOrDefault(w) < limit) { windowCounts[w] = windowCounts.GetValueOrDefault(w) + 1; fixedAllowed++; }
}

int slidingAllowed = 0; var log = new Queue<int>();
foreach (int t in times)
{
    while (log.Count > 0 && t - log.Peek() >= 60) log.Dequeue();
    if (log.Count < limit) { log.Enqueue(t); slidingAllowed++; }
}
Console.WriteLine($"limit {limit}/minute, 10 requests in 10 seconds");
Console.WriteLine($"fixed window allowed:  {fixedAllowed}  (burst across the boundary)");
Console.WriteLine($"sliding window allowed: {slidingAllowed}");`, "limit 5/minute, 10 requests in 10 seconds\nfixed window allowed:  10  (burst across the boundary)\nsliding window allowed: 5")],
  },
  "CAP Theorem": {
    s: ["Two branch offices share one booking ledger by phone. If the phone line breaks, each branch must choose: stop taking bookings (stay consistent) or keep booking and risk double-booking (stay available). CAP describes that choice.", "দুটি শাখা অফিস ফোনে একটি booking খাতা শেয়ার করে। ফোন লাইন কেটে গেলে প্রতিটি শাখাকে বাছতে হয়: booking বন্ধ রাখা (consistent থাকা) নাকি booking চালিয়ে দুবার booking-এর ঝুঁকি (available থাকা)। CAP সেই পছন্দ বর্ণনা করে।"],
    t: ["During a network partition (P), a distributed system must choose between consistency (C: every read sees the latest write or an error) and availability (A: every request gets a non-error response, possibly stale). Partitions are unavoidable in real networks, so the real choice is CP or AP behaviour during failures. Banking balances lean CP; social feeds and shopping carts often lean AP.", "Network partition (P)-এর সময় distributed system-কে consistency (C: প্রতিটি পড়া সর্বশেষ লেখা দেখে বা error দেয়) ও availability (A: প্রতিটি request error ছাড়া উত্তর পায়, হয়তো পুরনো)-এর মধ্যে বাছতে হয়। বাস্তব network-এ partition অনিবার্য, তাই আসল পছন্দ ব্যর্থতার সময় CP বা AP আচরণ। ব্যাংকের balance CP-র দিকে; social feed ও shopping cart প্রায়ই AP-র দিকে।"],
    p: [["List the data types in your system.", "আপনার system-এর data-র ধরন তালিকা করুন।"], ["For each, ask: is a stale or conflicting value acceptable briefly?", "প্রতিটির জন্য জিজ্ঞেস করুন: অল্পক্ষণ পুরনো বা বিরোধী মান কি গ্রহণযোগ্য?"], ["Choose CP (reject/err) or AP (serve and reconcile).", "CP (প্রত্যাখ্যান/error) বা AP (দেওয়া ও পরে মেলানো) বাছুন।"], ["Design reconciliation for AP data.", "AP data-র জন্য মেলানোর ব্যবস্থা design করুন।"]],
    m: ["Thinking you can 'pick two' and ignore partitions; applying one choice to the whole system; confusing CAP consistency with ACID consistency.", "'দুটি বাছা' যায় ভেবে partition উপেক্ষা; পুরো system-এ একটি পছন্দ প্রয়োগ; CAP-এর consistency-কে ACID-এর consistency-র সাথে গুলিয়ে ফেলা।"],
    q: ["Q: Is a single-node PostgreSQL CA? A: CAP is about distributed systems under partition; a single node simply is not partition-tolerant. Once you add replicas, you choose CP or AP behaviour during failures.", "প্রশ্ন: একক-node PostgreSQL কি CA? উত্তর: CAP partition-এর মধ্যে distributed system নিয়ে; একক node partition-সহনশীল নয়। Replica যোগ করলেই ব্যর্থতার সময় CP বা AP আচরণ বাছেন।"],
    f: ["Offline-first mobile apps and edge AI make AP-style designs common. Know conflict resolution techniques (last-write-wins, CRDTs, merges) to handle them.", "Offline-first mobile app ও edge AI AP-ধরনের design প্রচলিত করছে। এগুলো সামলাতে conflict সমাধানের কৌশল (last-write-wins, CRDT, merge) জানুন।"],
    x: [cs("CP vs AP during a partition · partition-এর সময় CP বনাম AP", `int stockOnA = 1, stockOnB = 1;   // two replicas of the last ticket
bool partition = true;

string BuyCp(string node) => partition ? $"{node}: 503 try later (cannot confirm with other replica)" : $"{node}: sold";
string BuyAp(string node)
{
    if (node == "A" && stockOnA > 0) { stockOnA--; return "A: sold (local copy)"; }
    if (node == "B" && stockOnB > 0) { stockOnB--; return "B: sold (local copy)"; }
    return $"{node}: sold out";
}

Console.WriteLine("CP choice:");
Console.WriteLine("  " + BuyCp("A")); Console.WriteLine("  " + BuyCp("B"));
Console.WriteLine("AP choice:");
Console.WriteLine("  " + BuyAp("A")); Console.WriteLine("  " + BuyAp("B"));
partition = false;
Console.WriteLine($"after the partition heals, AP sold {2 - stockOnA - stockOnB + 0} of 1 ticket -> overbooked by {1 - stockOnA - stockOnB}, needs reconciliation");`, "CP choice:\n  A: 503 try later (cannot confirm with other replica)\n  B: 503 try later (cannot confirm with other replica)\nAP choice:\n  A: sold (local copy)\n  B: sold (local copy)\nafter the partition heals, AP sold 2 of 1 ticket -> overbooked by 1, needs reconciliation")],
  },
  "PACELC Theorem": {
    s: ["Even on a normal day with no broken phone lines, the two branch offices must choose: phone the other branch before every booking (slower but certain) or book immediately and sync later (faster). PACELC adds that everyday choice to CAP.", "ফোন লাইন না কাটা সাধারণ দিনেও দুটি শাখা অফিসকে বাছতে হয়: প্রতিটি booking-এর আগে অন্য শাখায় ফোন (ধীর কিন্তু নিশ্চিত) নাকি সাথে সাথে booking করে পরে মেলানো (দ্রুত)। PACELC CAP-এর সাথে সেই প্রতিদিনের পছন্দ যোগ করে।"],
    t: ["PACELC: if Partition, choose Availability or Consistency; Else (normal operation), choose Latency or Consistency. Synchronous replication across regions gives consistency but adds round-trip latency to every write; asynchronous replication is fast but readers may see stale data. Databases expose this as tunable consistency (e.g., quorum reads/writes).", "PACELC: Partition হলে Availability বা Consistency বাছুন; নয়তো (সাধারণ সময়ে) Latency বা Consistency। Region জুড়ে synchronous replication consistency দেয় কিন্তু প্রতিটি লেখায় round-trip latency যোগ করে; asynchronous replication দ্রুত কিন্তু পাঠক পুরনো data দেখতে পারে। Database এটিকে সমন্বয়যোগ্য consistency হিসেবে দেয় (যেমন quorum read/write)।"],
    p: [["Measure the round trip between your regions.", "Region-এর মধ্যে round trip মাপুন।"], ["Decide per operation whether that latency is acceptable.", "প্রতিটি কাজে সেই latency গ্রহণযোগ্য কি না ঠিক করুন।"], ["Use synchronous/quorum writes for critical data.", "জরুরি data-য় synchronous/quorum লেখা দিন।"], ["Use async replication and caches for the rest.", "বাকিগুলোতে async replication ও cache দিন।"]],
    m: ["Ignoring latency costs of strong consistency across continents; promising 'strongly consistent and 10 ms globally'; one setting for all data.", "মহাদেশ জুড়ে শক্তিশালী consistency-র latency খরচ উপেক্ষা; 'শক্তিশালী consistent ও বিশ্বজুড়ে ১০ ms' প্রতিশ্রুতি; সব data-য় একটি setting।"],
    q: ["Q: With N=3 replicas, what R and W give strong reads? A: R + W > N, for example W=2 and R=2, so every read overlaps the latest write.", "প্রশ্ন: N=3 replica-তে কোন R ও W শক্তিশালী পড়া দেয়? উত্তর: R + W > N, যেমন W=2 ও R=2, ফলে প্রতিটি পড়া সর্বশেষ লেখার সাথে মেলে।"],
    f: ["Global apps serving users in Bangladesh and abroad face this daily. Knowing PACELC helps you explain latency trade-offs to product teams with numbers.", "বাংলাদেশ ও বিদেশের user-কে সেবা দেওয়া global app প্রতিদিন এর মুখোমুখি হয়। PACELC জানলে product দলকে সংখ্যাসহ latency-র trade-off বোঝাতে পারবেন।"],
    x: [cs("Write latency: async vs sync vs quorum · লেখার latency তুলনা", `int[] replicaRttMs = [2, 45, 180];   // local, Singapore, Frankfurt from Dhaka (illustrative)
int Async() => 0 + replicaRttMs[0];                         // ack after local write
int Sync() => replicaRttMs.Max();                           // wait for all replicas
int Quorum(int w) => replicaRttMs.OrderBy(x => x).ElementAt(w - 1);   // wait for the w fastest

Console.WriteLine($"async (fast, may lose recent writes): {Async()} ms");
Console.WriteLine($"quorum W=2 of 3 (balanced):           {Quorum(2)} ms");
Console.WriteLine($"sync all replicas (strongest):        {Sync()} ms");
Console.WriteLine($"quorum strong reads need R + W > N: R=2, W=2, N=3 -> {2 + 2 > 3}");`, "async (fast, may lose recent writes): 2 ms\nquorum W=2 of 3 (balanced):           45 ms\nsync all replicas (strongest):        180 ms\nquorum strong reads need R + W > N: R=2, W=2, N=3 -> True")],
  },
  "Consistency Models": {
    s: ["Group chat on a weak network: sometimes you see replies before the question, or a friend sees your edited message later than others. Consistency models describe exactly which of these surprises a system allows.", "দুর্বল network-এ group chat: কখনো প্রশ্নের আগে উত্তর দেখেন, বা এক বন্ধু অন্যদের পরে আপনার সম্পাদিত বার্তা দেখে। Consistency model ঠিক কোন বিস্ময় একটি system অনুমোদন করে তা বর্ণনা করে।"],
    t: ["From strongest to weakest: linearizable (behaves like one copy, real-time order), sequential, causal (cause before effect is preserved: replies after questions), read-your-writes and monotonic reads (session guarantees), and eventual consistency (replicas converge if writes stop). Stronger models are easier to reason about but cost latency and availability.", "সবচেয়ে শক্তিশালী থেকে দুর্বল: linearizable (একটি কপির মতো আচরণ, real-time ক্রম), sequential, causal (কারণ ফলের আগে থাকে: প্রশ্নের পরে উত্তর), read-your-writes ও monotonic read (session-এর নিশ্চয়তা), আর eventual consistency (লেখা থামলে replica মিলে যায়)। শক্তিশালী model বোঝা সহজ কিন্তু latency ও availability-র খরচ আছে।"],
    p: [["Write the user-visible guarantee you need in plain words.", "দরকারি user-দৃশ্যমান নিশ্চয়তা সহজ ভাষায় লিখুন।"], ["Map it to a model (often read-your-writes is enough).", "একটি model-এর সাথে মেলান (প্রায়ই read-your-writes যথেষ্ট)।"], ["Implement with sticky sessions, versions or primary reads.", "Sticky session, version বা primary read দিয়ে বাস্তবায়ন করুন।"], ["Test with injected replication lag.", "কৃত্রিম replication lag দিয়ে test করুন।"]],
    m: ["Assuming 'eventually' means seconds (it can be minutes during incidents); using eventual consistency for money or inventory limits; forgetting monotonic reads (data appearing then disappearing).", "'eventually' মানে কয়েক সেকেন্ড ধরে নেওয়া (সমস্যার সময় মিনিট হতে পারে); টাকা বা inventory-র সীমায় eventual consistency; monotonic read ভুলে যাওয়া (data দেখা দিয়ে আবার উধাও)।"],
    q: ["Q: A user refreshes and their new comment disappears, then reappears. Which guarantee is missing? A: Monotonic reads (and read-your-writes): consecutive reads hit replicas at different lag. Pin the session to one replica or read from the primary.", "প্রশ্ন: User refresh করলে নতুন comment উধাও হয়, তারপর আবার দেখা দেয়। কোন নিশ্চয়তা নেই? উত্তর: Monotonic read (ও read-your-writes): পরপর পড়া ভিন্ন lag-এর replica-তে যায়। Session এক replica-তে বাঁধুন বা primary থেকে পড়ুন।"],
    f: ["Collaborative apps (docs, whiteboards) rely on causal consistency and CRDTs. These ideas also apply to multi-agent AI systems sharing memory.", "সহযোগিতামূলক app (doc, whiteboard) causal consistency ও CRDT-র উপর নির্ভর করে। এই ধারণা শেয়ার memory-সহ multi-agent AI system-এও প্রযোজ্য।"],
    x: [cs("Monotonic reads break with random replicas · random replica-তে monotonic read ভাঙে", `int[] replicaVersion = [3, 1, 2];        // how many comments each replica has applied
int[] readOrderRandom = [0, 1, 2];       // a load balancer sending reads to different replicas
int pinned = 0;

Console.Write("random replicas sees comment counts: ");
Console.WriteLine(string.Join(" -> ", readOrderRandom.Select(r => replicaVersion[r])));
Console.Write("pinned to one replica sees:          ");
Console.WriteLine(string.Join(" -> ", readOrderRandom.Select(_ => replicaVersion[pinned])));

int lastSeen = 0;
var fixedReads = readOrderRandom.Select(r =>
{
    int v = Math.Max(replicaVersion[r], lastSeen);   // version-aware read: never go backwards
    lastSeen = v; return v;
});
Console.WriteLine("version-aware client sees:           " + string.Join(" -> ", fixedReads));`, "random replicas sees comment counts: 3 -> 1 -> 2\npinned to one replica sees:          3 -> 3 -> 3\nversion-aware client sees:           3 -> 3 -> 3")],
  },
  "Bloom Filter": {
    s: ["A club bouncer with a fuzzy memory: if he says 'never seen you', he is always right; if he says 'maybe I have', he might be mistaken. A Bloom filter answers 'definitely not' or 'probably yes' using very little memory.", "ঝাপসা স্মৃতির club-এর প্রহরী: 'আপনাকে কখনো দেখিনি' বললে সবসময় ঠিক; 'হয়তো দেখেছি' বললে ভুল হতে পারে। Bloom filter খুব কম memory-তে 'অবশ্যই না' বা 'সম্ভবত হ্যাঁ' উত্তর দেয়।"],
    t: ["A Bloom filter is a bit array plus k hash functions. Adding an item sets k bits; checking an item tests those k bits. If any bit is 0, the item was never added (no false negatives). If all are 1, it was probably added (false positives possible, tunable by size and k). Uses: avoid disk/database lookups for missing keys, username availability, crawler URL dedup, and LSM-tree databases.", "Bloom filter হলো একটি bit array ও k-টি hash function। Item যোগ করলে k-টি bit সেট হয়; যাচাইয়ে সেই k-টি bit দেখা হয়। কোনো bit 0 হলে item কখনো যোগ হয়নি (false negative নেই)। সব 1 হলে সম্ভবত যোগ হয়েছে (false positive সম্ভব, আকার ও k দিয়ে নিয়ন্ত্রণযোগ্য)। ব্যবহার: অনুপস্থিত key-র জন্য disk/database খোঁজা এড়ানো, username পাওয়া যায় কি না, crawler-এর URL dedup ও LSM-tree database।"],
    p: [["Estimate items n and acceptable false-positive rate p.", "Item n ও গ্রহণযোগ্য false-positive হার p অনুমান করুন।"], ["Size bits m = -n·ln(p)/(ln 2)² and k = (m/n)·ln 2.", "Bit m = -n·ln(p)/(ln 2)² ও k = (m/n)·ln 2 মাপ দিন।"], ["Use it as a fast pre-check before the real lookup.", "আসল খোঁজার আগে দ্রুত প্রাক-পরীক্ষা হিসেবে ব্যবহার করুন।"], ["Rebuild when items are deleted (standard filters cannot delete).", "Item মুছলে আবার বানান (সাধারণ filter মুছতে পারে না)।"]],
    m: ["Trusting 'probably yes' as a definite yes; undersizing so the false-positive rate explodes; trying to delete items.", "'সম্ভবত হ্যাঁ'-কে নিশ্চিত হ্যাঁ ধরা; ছোট আকার দেওয়ায় false-positive হার বেড়ে যাওয়া; item মোছার চেষ্টা।"],
    q: ["Q: Why can a Bloom filter never give a false negative? A: Adding an item sets all its bits to 1 and bits are never cleared, so checking that item always finds all 1s.", "প্রশ্ন: Bloom filter কেন কখনো false negative দেয় না? উত্তর: Item যোগে তার সব bit 1 হয় এবং bit কখনো মোছা হয় না, তাই সেই item যাচাইয়ে সবসময় সব 1 পাওয়া যায়।"],
    f: ["Probabilistic data structures (Bloom filters, HyperLogLog, Count-Min Sketch) let you answer questions about billions of events cheaply, common in analytics and AI data pipelines.", "Probabilistic data structure (Bloom filter, HyperLogLog, Count-Min Sketch) সস্তায় কোটি কোটি event সম্পর্কে প্রশ্নের উত্তর দেয়, যা analytics ও AI data pipeline-এ প্রচলিত।"],
    x: [cs("A small Bloom filter and its false-positive rate · ছোট Bloom filter", `var bits = new System.Collections.BitArray(10_000);
const int K = 4;
IEnumerable<int> Positions(string s)
{
    uint h1 = 2166136261, h2 = 5381;
    foreach (char c in s) { h1 = (h1 ^ c) * 16777619; h2 = h2 * 33 + c; }
    for (int i = 0; i < K; i++) yield return (int)((h1 + (uint)i * h2) % (uint)bits.Length);
}
void Add(string s) { foreach (int p in Positions(s)) bits[p] = true; }
bool MightContain(string s) => Positions(s).All(p => bits[p]);

for (int i = 0; i < 1000; i++) Add($"user{i}");
Console.WriteLine($"user42 (added): {MightContain("user42")}");
Console.WriteLine($"all 1000 added found: {Enumerable.Range(0, 1000).All(i => MightContain($"user{i}"))}");
int falsePositives = Enumerable.Range(1000, 10_000).Count(i => MightContain($"user{i}"));
Console.WriteLine($"false positives on 10,000 unseen names: {falsePositives / 100.0:0.0}% (memory: {bits.Length / 8} bytes)");`, "user42 (added): True\nall 1000 added found: True\nfalse positives on 10,000 unseen names: 2.6% (memory: 1250 bytes)")],
  },
  "Circuit Breaker": {
    s: ["A home's electrical breaker trips when there is a fault, cutting power before the wiring burns. After a while you try switching it on again. A circuit breaker in code stops calling a failing service so it can recover and your app stays fast.", "বাড়ির বৈদ্যুতিক breaker ত্রুটি হলে trip করে, তার পুড়ে যাওয়ার আগে বিদ্যুৎ কাটে। কিছুক্ষণ পরে আবার চালু করার চেষ্টা করেন। Code-এর circuit breaker ব্যর্থ service ডাকা বন্ধ রাখে, যাতে সেটি সেরে ওঠে আর আপনার app দ্রুত থাকে।"],
    t: ["States: Closed (calls pass; failures counted), Open (calls fail fast for a break duration), Half-open (a few trial calls; success closes, failure opens again). It prevents piling up slow requests and threads on a dead dependency (cascading failure). In .NET, Polly and Microsoft.Extensions.Http.Resilience provide circuit breakers, retries and timeouts as a pipeline.", "অবস্থা: Closed (call যায়; ব্যর্থতা গোনা হয়), Open (বিরতির সময় call দ্রুত ব্যর্থ), Half-open (কয়েকটি পরীক্ষামূলক call; সফল হলে closed, ব্যর্থ হলে আবার open)। মৃত dependency-তে ধীর request ও thread জমে যাওয়া (cascading failure) আটকায়। .NET-এ Polly ও Microsoft.Extensions.Http.Resilience pipeline হিসেবে circuit breaker, retry ও timeout দেয়।"],
    p: [["Wrap outbound calls with timeout + retry + circuit breaker.", "বাইরের call-কে timeout + retry + circuit breaker দিয়ে মোড়ান।"], ["Set thresholds (failure ratio, minimum throughput, break duration).", "সীমা ঠিক করুন (ব্যর্থতার অনুপাত, ন্যূনতম throughput, বিরতির সময়)।"], ["Return a fallback (cached data, friendly error) when open.", "Open থাকলে fallback দিন (cache করা data, বন্ধুসুলভ error)।"], ["Log and alert on state changes.", "অবস্থার পরিবর্তনে log ও alert দিন।"]],
    m: ["Retrying forever without a breaker (retry storms); one breaker shared by unrelated endpoints; no timeout, so the breaker never sees failures quickly.", "Breaker ছাড়া চিরকাল retry (retry storm); অসম্পর্কিত endpoint-এ একটি শেয়ার breaker; timeout নেই, তাই breaker দ্রুত ব্যর্থতা দেখে না।"],
    q: ["Q: Why combine retries with a circuit breaker? A: Retries handle brief glitches; the breaker stops retries from hammering a service that is truly down and lets it recover.", "প্রশ্ন: Retry-এর সাথে circuit breaker কেন? উত্তর: Retry ক্ষণস্থায়ী গোলমাল সামলায়; breaker সত্যিই বন্ধ service-এ retry-এর আঘাত থামিয়ে তাকে সেরে উঠতে দেয়।"],
    f: ["Model providers have outages and rate limits. A breaker plus fallback to another model or a cached answer keeps AI features usable during incidents.", "Model provider-এর বিভ্রাট ও rate limit হয়। Breaker ও অন্য model বা cache করা উত্তরে fallback সমস্যার সময়ও AI feature ব্যবহারযোগ্য রাখে।"],
    x: [cs("Closed, open and half-open states · তিন অবস্থা", `var breaker = new Breaker(failureThreshold: 3, openSeconds: 10);
bool[] upstreamOk = [true, false, false, false, false, false, true, true];
int[] at = [0, 1, 2, 3, 4, 8, 14, 15];

for (int i = 0; i < at.Length; i++)
    Console.WriteLine($"t={at[i],2}s {breaker.Call(at[i], upstreamOk[i])}");

class Breaker(int failureThreshold, int openSeconds)
{
    private int failures, openedAt = -1;
    private string state = "closed";
    public string Call(int now, bool upstreamOk)
    {
        if (state == "open" && now - openedAt >= openSeconds) state = "half-open";
        if (state == "open") return "OPEN -> fail fast (fallback used)";
        if (upstreamOk) { state = "closed"; failures = 0; return "ok (closed)"; }
        failures++;
        if (state == "half-open" || failures >= failureThreshold) { state = "open"; openedAt = now; return "failed -> breaker OPENS"; }
        return $"failed ({failures}/{failureThreshold})";
    }
}`, "t= 0s ok (closed)\nt= 1s failed (1/3)\nt= 2s failed (2/3)\nt= 3s failed -> breaker OPENS\nt= 4s OPEN -> fail fast (fallback used)\nt= 8s OPEN -> fail fast (fallback used)\nt=14s ok (closed)\nt=15s ok (closed)")],
  },
  "Saga Pattern": {
    s: ["Booking a holiday: flight, hotel and car from three companies. If the car booking fails, you cancel the hotel and flight you already booked. A saga runs a business transaction as steps with an 'undo' for each.", "ছুটির booking: তিনটি কোম্পানি থেকে বিমান, hotel ও গাড়ি। গাড়ির booking ব্যর্থ হলে আগে করা hotel ও বিমান বাতিল করেন। Saga একটি ব্যবসায়িক transaction-কে ধাপে ধাপে চালায়, প্রতিটির একটি 'undo' থাকে।"],
    t: ["Across microservices you cannot use one database transaction. A saga executes local transactions in order; if a step fails, it runs compensating actions for completed steps in reverse. Orchestration uses a central coordinator (easier to follow); choreography uses events between services (looser coupling). Steps and compensations must be idempotent, and state must be persisted.", "Microservice জুড়ে একটি database transaction ব্যবহার করা যায় না। Saga ক্রমানুসারে local transaction চালায়; কোনো ধাপ ব্যর্থ হলে শেষ হওয়া ধাপগুলোর জন্য উল্টো ক্রমে compensating action চালায়। Orchestration কেন্দ্রীয় coordinator ব্যবহার করে (অনুসরণ সহজ); choreography service-এর মধ্যে event ব্যবহার করে (ঢিলা সংযোগ)। ধাপ ও compensation idempotent হতে হবে এবং অবস্থা সংরক্ষিত থাকতে হবে।"],
    p: [["List the steps and the compensation for each.", "ধাপ ও প্রতিটির compensation তালিকা করুন।"], ["Choose orchestration or choreography.", "Orchestration বা choreography বাছুন।"], ["Persist saga state after every step.", "প্রতিটি ধাপের পরে saga-র অবস্থা সংরক্ষণ করুন।"], ["On failure, compensate completed steps in reverse order.", "ব্যর্থ হলে শেষ হওয়া ধাপ উল্টো ক্রমে compensate করুন।"]],
    m: ["Compensations that cannot actually undo (emails already sent: send a follow-up instead); not persisting state so a crash leaves money taken and no order; non-idempotent steps retried twice.", "এমন compensation যা আসলে ফেরাতে পারে না (email আগেই গেছে: তার বদলে পরবর্তী email দিন); অবস্থা সংরক্ষণ না করায় crash-এ টাকা কাটা কিন্তু order নেই; non-idempotent ধাপ দুবার retry।"],
    q: ["Q: Orchestration vs choreography? A: Orchestration: one service tells others what to do, easy to see the flow. Choreography: services react to each other's events, fewer central points but harder to trace.", "প্রশ্ন: Orchestration বনাম choreography? উত্তর: Orchestration: একটি service অন্যদের কী করতে হবে বলে, প্রবাহ দেখা সহজ। Choreography: service একে অপরের event-এ সাড়া দেয়, কম কেন্দ্রীয় বিন্দু কিন্তু trace করা কঠিন।"],
    f: ["Durable workflow engines (Temporal, Dapr workflows, Azure Durable Functions) implement sagas reliably, and the same engines now orchestrate long-running AI agent tasks.", "Durable workflow engine (Temporal, Dapr workflow, Azure Durable Functions) নির্ভরযোগ্যভাবে saga বাস্তবায়ন করে, আর একই engine এখন দীর্ঘ AI agent-এর কাজ পরিচালনা করে।"],
    x: [cs("Orchestrated saga with compensation · compensation-সহ saga", `var steps = new List<(string Name, Func<bool> Do, Action Undo)>
{
    ("reserve stock", () => true, () => Console.WriteLine("  undo: release stock")),
    ("charge payment", () => true, () => Console.WriteLine("  undo: refund payment")),
    ("book courier", () => false, () => Console.WriteLine("  undo: cancel courier")),   // fails
    ("send confirmation", () => true, () => { }),
};

var done = new Stack<(string Name, Action Undo)>();
foreach (var (name, doStep, undo) in steps)
{
    if (doStep()) { Console.WriteLine($"ok:   {name}"); done.Push((name, undo)); continue; }
    Console.WriteLine($"FAIL: {name} -> compensating");
    while (done.TryPop(out var s)) s.Undo();
    Console.WriteLine("order status: cancelled, customer notified");
    break;
}`, "ok:   reserve stock\nok:   charge payment\nFAIL: book courier -> compensating\n  undo: refund payment\n  undo: release stock\norder status: cancelled, customer notified")],
  },
  "Back-of-the-Envelope Estimation": {
    s: ["Before a wedding you estimate: 400 guests, about 1.5 plates each, so roughly 600 plates of biryani. Quick, rough numbers guide big decisions. System design estimation does the same for traffic, storage and bandwidth.", "বিয়ের আগে হিসাব করেন: ৪০০ অতিথি, প্রত্যেকে প্রায় দেড় প্লেট, মোটামুটি ৬০০ প্লেট বিরিয়ানি। দ্রুত, মোটা দাগের সংখ্যা বড় সিদ্ধান্ত দেখায়। System design-এর হিসাব traffic, storage ও bandwidth-এর জন্য একই কাজ করে।"],
    t: ["Start from users: daily active users × actions per user ÷ 86,400 seconds = average requests per second; multiply by 2-10 for peak. Storage = items per day × size × retention, plus replicas. Bandwidth = RPS × response size. Useful constants: 1 day ≈ 10^5 seconds, memory access ~100 ns, SSD read ~100 µs, same-region network round trip ~0.5 ms, cross-continent ~150 ms.", "User থেকে শুরু করুন: দৈনিক সক্রিয় user × user-প্রতি কাজ ÷ ৮৬,৪০০ সেকেন্ড = গড় request-প্রতি-সেকেন্ড; peak-এর জন্য ২-১০ দিয়ে গুণ। Storage = দিনে item × আকার × রাখার সময়, সাথে replica। Bandwidth = RPS × response-এর আকার। দরকারি ধ্রুবক: ১ দিন ≈ 10^5 সেকেন্ড, memory access ~১০০ ns, SSD পড়া ~১০০ µs, একই region-এ network round trip ~০.৫ ms, মহাদেশ পার ~১৫০ ms।"],
    p: [["Write assumptions clearly (DAU, actions, sizes).", "অনুমান স্পষ্ট লিখুন (DAU, কাজ, আকার)।"], ["Compute average and peak QPS.", "গড় ও peak QPS হিসাব করুন।"], ["Compute storage per year and bandwidth.", "বছরে storage ও bandwidth হিসাব করুন।"], ["Use the numbers to choose cache, DB and number of servers.", "সংখ্যা দিয়ে cache, DB ও server-এর সংখ্যা বাছুন।"]],
    m: ["Over-precise numbers that hide assumptions; forgetting peaks; mixing bits and bytes; forgetting replication and indexes in storage.", "অনুমান লুকানো অতি-নির্ভুল সংখ্যা; peak ভুলে যাওয়া; bit ও byte গুলিয়ে ফেলা; storage-এ replication ও index ভুলে যাওয়া।"],
    q: ["Q: 10 million DAU each post 2 photos of 500 KB per day. Storage per year? A: 20M × 0.5 MB = 10 TB/day ≈ 3.65 PB/year, before replication and thumbnails.", "প্রশ্ন: ১ কোটি DAU প্রত্যেকে দিনে ৫০০ KB-র ২টি ছবি দেয়। বছরে storage? উত্তর: ২ কোটি × ০.৫ MB = দিনে ১০ TB ≈ বছরে ৩.৬৫ PB, replication ও thumbnail বাদে।"],
    f: ["Estimate AI costs the same way: requests × tokens per request × price per token. Doing this before building saves teams from surprise bills.", "AI-এর খরচও একইভাবে হিসাব করুন: request × request-প্রতি token × token-প্রতি দাম। বানানোর আগে এটি করলে দল অপ্রত্যাশিত bill থেকে বাঁচে।"],
    x: [cs("Estimate a food-delivery app · food-delivery app-এর হিসাব", `long dau = 2_000_000;             // daily active users
int ordersPerUser = 1, viewsPerOrder = 30;
int peakFactor = 5;

double avgReadQps = dau * ordersPerUser * viewsPerOrder / 86_400.0;
double avgWriteQps = dau * ordersPerUser / 86_400.0;
Console.WriteLine($"reads:  avg {avgReadQps:0} QPS, peak {avgReadQps * peakFactor:0} QPS");
Console.WriteLine($"writes: avg {avgWriteQps:0} QPS, peak {avgWriteQps * peakFactor:0} QPS");

double orderKb = 2;               // order row + items + status history
double storageGbYear = dau * ordersPerUser * orderKb * 365 / 1_000_000;
Console.WriteLine($"order storage: ~{storageGbYear:0} GB/year (x3 with replicas = {storageGbYear * 3:0} GB)");

double menuResponseKb = 40;
Console.WriteLine($"peak egress for menu reads: ~{avgReadQps * peakFactor * menuResponseKb * 8 / 1000:0} Mbps -> put menus/images on a CDN");`, "reads:  avg 694 QPS, peak 3472 QPS\nwrites: avg 23 QPS, peak 116 QPS\norder storage: ~1460 GB/year (x3 with replicas = 4380 GB)\npeak egress for menu reads: ~1111 Mbps -> put menus/images on a CDN")],
  },
};
