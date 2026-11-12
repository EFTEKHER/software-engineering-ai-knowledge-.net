// Module 09 System Design Practice: interview-style practice for each building block.
import { cs } from "./helpers";

const outline = (title, code) => ({ title, kind: "Interview answer outline", language: "markdown", code });

export default {
  "Load Balancer": {
    s: ["A football coach rotating fresh players so nobody collapses from exhaustion, and pulling injured players off the field immediately. A load balancer rotates work across healthy servers.", "Football coach নতুন খেলোয়াড় ঘুরিয়ে নামান যাতে কেউ ক্লান্তিতে না পড়ে, আর আহত খেলোয়াড়কে সাথে সাথে মাঠ থেকে তোলেন। Load balancer সুস্থ server-এর মধ্যে কাজ ঘোরায়।"],
    t: ["In interviews, mention: where the balancer sits (DNS, L4, L7), algorithm choice, health checks, TLS termination, session handling (stateless servers or shared session store), and high availability of the balancer itself (pairs, managed services, anycast). Tie choices to the traffic numbers you estimated.", "Interview-এ বলুন: balancer কোথায় বসে (DNS, L4, L7), algorithm বাছাই, health check, TLS termination, session সামলানো (stateless server বা শেয়ার session store), আর balancer-এর নিজের high availability (জোড়া, managed service, anycast)। আপনার অনুমিত traffic সংখ্যার সাথে পছন্দ যুক্ত করুন।"],
    p: [["Draw clients -> LB -> app servers -> DB.", "আঁকুন: client -> LB -> app server -> DB।"], ["State the algorithm and why.", "Algorithm ও কারণ বলুন।"], ["Explain health checks and what happens when a server dies.", "Health check ও server মরে গেলে কী হয় ব্যাখ্যা করুন।"], ["Remove the LB as a single point of failure.", "LB-কে single point of failure থেকে মুক্ত করুন।"]],
    m: ["Drawing one LB box and moving on; sticky sessions without explaining the trade-off; ignoring connection draining during deploys.", "একটি LB বাক্স এঁকে এগিয়ে যাওয়া; trade-off না বলে sticky session; deploy-এর সময় connection draining উপেক্ষা।"],
    q: ["Practice: 'Design the traffic layer for an e-commerce site with 50k peak RPS across two regions.' Cover DNS/geo routing, regional L7 balancers, autoscaling groups, health checks and failover between regions.", "অনুশীলন: 'দুই region জুড়ে ৫০ হাজার peak RPS-এর e-commerce site-এর traffic স্তর design করুন।' DNS/geo routing, region-ভিত্তিক L7 balancer, autoscaling group, health check ও region-এর মধ্যে failover বলুন।"],
    f: ["Interviewers increasingly ask how you would route AI inference traffic. Mention balancing across model deployments by capacity and falling back between providers.", "Interviewer ক্রমশ জিজ্ঞেস করেন AI inference traffic কীভাবে route করবেন। ক্ষমতা অনুযায়ী model deployment-এর মধ্যে balance ও provider-এর মধ্যে fallback উল্লেখ করুন।"],
    x: [outline("Answer outline: traffic layer · উত্তরের কাঠামো: traffic স্তর", "1. Requirements: 50k peak RPS, 2 regions, 99.95% availability\n2. Global: GeoDNS / anycast -> nearest healthy region\n3. Regional: managed L7 LB (TLS termination, path routing)\n4. App tier: stateless containers, autoscale on CPU + RPS\n5. Health: /health/ready checks DB + cache; drain connections on deploy\n6. Failure: region down -> DNS failover (TTL 30-60s); LB pairs per region\n7. Trade-offs: sticky sessions avoided; sessions in Redis")],
  },
  "Caching": {
    s: ["A student keeps a cheat-sheet of the formulas used most, instead of opening the textbook every time. Caching keeps frequently used answers close at hand.", "একজন ছাত্র সবচেয়ে বেশি ব্যবহৃত সূত্রের cheat-sheet রাখে, প্রতিবার পাঠ্যবই খোলে না। Caching ঘন ঘন ব্যবহৃত উত্তর হাতের কাছে রাখে।"],
    t: ["In a design answer, say what you cache (hot reads), where (CDN, Redis, local memory), the pattern (cache-aside), TTL and invalidation on writes, eviction (LRU), expected hit ratio, and how you avoid stampedes and stale reads for critical data. Quantify: '90% hit ratio cuts DB reads from 10k to 1k QPS'.", "Design উত্তরে বলুন কী cache করবেন (গরম পড়া), কোথায় (CDN, Redis, local memory), pattern (cache-aside), TTL ও লেখার সময় invalidation, eviction (LRU), প্রত্যাশিত hit ratio, আর জরুরি data-য় stampede ও পুরনো পড়া কীভাবে এড়াবেন। সংখ্যায় বলুন: '৯০% hit ratio DB পড়া ১০ হাজার থেকে ১ হাজার QPS-এ নামায়'।"],
    p: [["Identify the hottest read path from your estimates.", "আপনার হিসাব থেকে সবচেয়ে গরম পড়ার পথ চিহ্নিত করুন।"], ["Place the cache and choose cache-aside + TTL.", "Cache বসিয়ে cache-aside + TTL বাছুন।"], ["Explain invalidation when data changes.", "Data বদলালে invalidation ব্যাখ্যা করুন।"], ["Estimate memory: keys × value size.", "Memory হিসাব করুন: key × value-এর আকার।"]],
    m: ["Saying 'add Redis' without TTL or invalidation; caching data that must be strongly consistent (balances); not sizing the cache.", "TTL বা invalidation ছাড়া 'Redis যোগ করুন' বলা; শক্তিশালী consistent হতে হবে এমন data cache (balance); cache-এর আকার না মাপা।"],
    q: ["Practice: 'Cache product pages for a flash sale with 1M visitors in 10 minutes.' Discuss CDN for static parts, short TTL for price/stock, request coalescing, and pre-warming before the sale.", "অনুশীলন: '১০ মিনিটে ১০ লাখ দর্শনার্থীর flash sale-এ product page cache করুন।' Static অংশে CDN, দাম/stock-এ ছোট TTL, request coalescing ও sale-এর আগে pre-warming আলোচনা করুন।"],
    f: ["Mention semantic and prompt caching when the design includes an AI assistant; it is a strong signal of current knowledge.", "Design-এ AI assistant থাকলে semantic ও prompt caching উল্লেখ করুন; এটি হালনাগাদ জ্ঞানের শক্ত সংকেত।"],
    x: [cs("Quantify the effect of a cache hit ratio · hit ratio-র প্রভাব মাপা", `int readQps = 10_000;
double dbLatencyMs = 20, cacheLatencyMs = 1;
foreach (double hit in new[] { 0.0, 0.5, 0.9, 0.99 })
{
    double dbQps = readQps * (1 - hit);
    double avgLatency = hit * cacheLatencyMs + (1 - hit) * dbLatencyMs;
    Console.WriteLine($"hit {hit * 100,3:0}% -> DB {dbQps,6:0} QPS, avg latency {avgLatency,5:0.0} ms");
}`, "hit   0% -> DB  10000 QPS, avg latency  20.0 ms\nhit  50% -> DB   5000 QPS, avg latency  10.5 ms\nhit  90% -> DB   1000 QPS, avg latency   2.9 ms\nhit  99% -> DB    100 QPS, avg latency   1.2 ms")],
  },
  "CDN": {
    s: ["A newspaper printed in Dhaka and trucked overnight to local agents in every district, so readers get it at dawn. A CDN pre-positions your content near your users.", "ঢাকায় ছাপা সংবাদপত্র রাতারাতি প্রতিটি জেলার স্থানীয় এজেন্টের কাছে ট্রাকে যায়, তাই পাঠক ভোরেই পান। CDN আপনার content আগেভাগেই user-এর কাছে রাখে।"],
    t: ["Explain what goes to the CDN (static assets, images, video segments, public API responses), cache keys and headers, versioned URLs, purging, origin shielding, and security (WAF, signed URLs for private media). Estimate the bandwidth the CDN saves from your origin.", "ব্যাখ্যা করুন কী CDN-এ যাবে (static asset, ছবি, video segment, public API response), cache key ও header, version-যুক্ত URL, purging, origin shielding আর নিরাপত্তা (WAF, private media-র signed URL)। CDN origin থেকে কত bandwidth বাঁচায় হিসাব করুন।"],
    p: [["List cacheable content and its TTL.", "Cache-যোগ্য content ও তার TTL তালিকা করুন।"], ["Use versioned URLs for assets.", "Asset-এ version-যুক্ত URL দিন।"], ["Protect private files with signed URLs.", "Private file signed URL দিয়ে রক্ষা করুন।"], ["Estimate origin egress before and after.", "আগে ও পরে origin egress হিসাব করুন।"]],
    m: ["Caching personalised responses; forgetting video needs segment-level caching; no plan for cache invalidation on emergencies.", "ব্যক্তিগত response cache; video-তে segment-স্তরের caching লাগে ভুলে যাওয়া; জরুরি অবস্থায় cache invalidation-এর পরিকল্পনা নেই।"],
    q: ["Practice: 'Design image delivery for a social app with 100M image views/day.' Cover upload to object storage, resizing into variants, CDN with long TTLs, signed URLs for private images and WebP/AVIF formats.", "অনুশীলন: 'দিনে ১০ কোটি ছবি দেখার social app-এর image delivery design করুন।' Object storage-এ upload, variant-এ resize, দীর্ঘ TTL-সহ CDN, private ছবির signed URL ও WebP/AVIF format বলুন।"],
    f: ["Edge compute lets you resize images or run personalization at the CDN. Mention it as an option, with its cost and debugging trade-offs.", "Edge compute CDN-এই ছবি resize বা personalization চালাতে দেয়। খরচ ও debugging-এর trade-off-সহ বিকল্প হিসেবে উল্লেখ করুন।"],
    x: [cs("Origin egress saved by a CDN · CDN-এ বাঁচানো egress", `long viewsPerDay = 100_000_000;
double avgImageKb = 120;
foreach (double hit in new[] { 0.80, 0.95, 0.99 })
{
    double originTb = viewsPerDay * (1 - hit) * avgImageKb / 1_000_000_000;
    Console.WriteLine($"CDN hit {hit * 100:0}% -> origin serves {originTb:0.00} TB/day");
}
Console.WriteLine($"without CDN: {viewsPerDay * avgImageKb / 1_000_000_000:0.00} TB/day from origin");`, "CDN hit 80% -> origin serves 2.40 TB/day\nCDN hit 95% -> origin serves 0.60 TB/day\nCDN hit 99% -> origin serves 0.12 TB/day\nwithout CDN: 12.00 TB/day from origin")],
  },
  "Sharding": {
    s: ["An exam hall too small for all students: the school splits them by roll number into several halls. Each hall's invigilator handles only their students. Sharding splits data across databases by a key.", "সব ছাত্রের জন্য ছোট পরীক্ষার হল: স্কুল roll নম্বর অনুযায়ী কয়েকটি হলে ভাগ করে। প্রতিটি হলের পরিদর্শক শুধু তার ছাত্রদের দেখেন। Sharding একটি key দিয়ে data কয়েকটি database-এ ভাগ করে।"],
    t: ["When you propose sharding, justify it with numbers (data size or write QPS beyond one node), choose the shard key from the main access pattern, describe routing (lookup service or hash), handling of cross-shard queries (fan-out, denormalized views), resharding strategy, and hot-key mitigation.", "Sharding প্রস্তাবে সংখ্যা দিয়ে যৌক্তিকতা দিন (একটি node-এর বেশি data বা লেখার QPS), মূল access pattern থেকে shard key বাছুন, routing (lookup service বা hash), shard জুড়ে query সামলানো (fan-out, denormalized view), resharding কৌশল আর hot-key প্রশমন বর্ণনা করুন।"],
    p: [["Show why one database is not enough.", "একটি database কেন যথেষ্ট নয় দেখান।"], ["Pick the shard key from the dominant query.", "প্রধান query থেকে shard key বাছুন।"], ["Explain routing and cross-shard queries.", "Routing ও shard-জোড়া query ব্যাখ্যা করুন।"], ["Plan resharding and hot keys.", "Resharding ও hot key পরিকল্পনা করুন।"]],
    m: ["Sharding prematurely; choosing a key that causes hot shards (celebrity users); ignoring global queries like 'top products'.", "আগেভাগে sharding; hot shard তৈরি করা key বাছা (তারকা user); 'শীর্ষ পণ্য'-এর মতো global query উপেক্ষা।"],
    q: ["Practice: 'Shard the messages table of a chat app with 5B messages.' Shard by conversation ID so a chat's messages stay together, and keep a separate per-user inbox index for listing conversations.", "অনুশীলন: '৫০০ কোটি বার্তার chat app-এর messages table shard করুন।' Conversation ID দিয়ে shard করুন যাতে একটি chat-এর বার্তা একসাথে থাকে, আর conversation তালিকার জন্য আলাদা user-ভিত্তিক inbox index রাখুন।"],
    f: ["Vector databases shard embeddings too. The same key-choice questions (by tenant? by document?) appear in AI retrieval design interviews.", "Vector database-ও embedding shard করে। একই key-বাছাইয়ের প্রশ্ন (tenant দিয়ে? document দিয়ে?) AI retrieval design interview-এ আসে।"],
    x: [cs("Detect a hot shard from key distribution · hot shard খোঁজা", `var writes = new List<string>();
for (int i = 0; i < 9000; i++) writes.Add($"user-{i % 3000}");
for (int i = 0; i < 9000; i++) writes.Add("user-celebrity");        // one very popular key

int Shard(string key) => key.Sum(c => c) % 4;
var perShard = writes.GroupBy(Shard).OrderBy(g => g.Key).Select(g => (Shard: g.Key, Count: g.Count())).ToList();
foreach (var (shard, count) in perShard) Console.WriteLine($"shard {shard}: {count,5} writes{(count > writes.Count / 2 ? "  <- HOT" : "")}");
Console.WriteLine("Fix: split the hot key (user-celebrity#0..#7) or give it a dedicated shard.");`, "shard 0:  2247 writes\nshard 1:  2247 writes\nshard 2:  2253 writes\nshard 3: 11253 writes  <- HOT\nFix: split the hot key (user-celebrity#0..#7) or give it a dedicated shard.")],
  },
  "Replication": {
    s: ["A bank keeps the same records in its head office and a backup branch in another city. If the head office floods, the backup takes over. Replication keeps copies so data survives failures and reads scale.", "ব্যাংক প্রধান কার্যালয় ও অন্য শহরের backup শাখায় একই record রাখে। প্রধান কার্যালয়ে বন্যা হলে backup দায়িত্ব নেয়। Replication কপি রাখে, যাতে ব্যর্থতায় data টিকে থাকে এবং পড়া বাড়ানো যায়।"],
    t: ["In a design, specify: primary-replica topology, sync vs async per region, read routing and read-your-writes, failover (automatic with health checks, fencing to avoid two primaries), RPO (how much data you may lose) and RTO (how fast you recover). Backups are still needed because replicas copy mistakes.", "Design-এ নির্দিষ্ট করুন: primary-replica topology, region অনুযায়ী sync বনাম async, পড়ার routing ও read-your-writes, failover (health check-সহ স্বয়ংক্রিয়, দুটি primary এড়াতে fencing), RPO (কতটা data হারানো যায়) ও RTO (কত দ্রুত সেরে ওঠা)। Replica ভুলও কপি করে, তাই backup তবুও লাগে।"],
    p: [["State RPO and RTO targets.", "RPO ও RTO লক্ষ্য বলুন।"], ["Pick topology and sync/async.", "Topology ও sync/async বাছুন।"], ["Describe failover and split-brain protection.", "Failover ও split-brain সুরক্ষা বর্ণনা করুন।"], ["Add backups and restore tests.", "Backup ও restore test যোগ করুন।"]],
    m: ["Calling replicas backups; ignoring split-brain; not mentioning replication lag in user-facing flows.", "Replica-কে backup বলা; split-brain উপেক্ষা; user-মুখী প্রবাহে replication lag উল্লেখ না করা।"],
    q: ["Practice: 'A payment service must lose zero confirmed payments even if a region fails.' Use synchronous replication to a second availability zone (RPO 0), async to another region for disaster recovery, and idempotent payment IDs for retries.", "অনুশীলন: 'Region ব্যর্থ হলেও payment service কোনো নিশ্চিত payment হারাবে না।' দ্বিতীয় availability zone-এ synchronous replication (RPO 0), disaster recovery-র জন্য অন্য region-এ async, আর retry-এর জন্য idempotent payment ID দিন।"],
    f: ["Knowing RPO/RTO vocabulary shows production maturity. Also mention that AI vector stores and model caches need their own recovery plans.", "RPO/RTO শব্দভান্ডার জানা production পরিপক্বতা দেখায়। AI vector store ও model cache-এরও নিজস্ব recovery পরিকল্পনা লাগে উল্লেখ করুন।"],
    x: [outline("Answer outline: replicated payments DB · উত্তরের কাঠামো", "1. Targets: RPO = 0 for confirmed payments, RTO < 5 minutes\n2. Topology: primary (AZ-a) + sync standby (AZ-b) + async replica (other region)\n3. Writes: commit only when standby acknowledges\n4. Reads: dashboards from async replica; user receipts from primary\n5. Failover: managed automatic failover; old primary fenced\n6. Backups: daily snapshots + point-in-time recovery; monthly restore drill\n7. Retries: idempotency key per payment prevents double charges")],
  },
  "CAP Theorem": {
    s: ["Two shopkeepers share a stock list by phone. When the phone line breaks, they must either stop selling (consistent) or keep selling and risk selling the same item twice (available).", "দুজন দোকানি ফোনে stock তালিকা শেয়ার করেন। ফোন লাইন কাটলে হয় বিক্রি বন্ধ (consistent), নয়তো বিক্রি চালিয়ে একই জিনিস দুবার বিক্রির ঝুঁকি (available)।"],
    t: ["Use CAP in interviews per feature, not for the whole system: checkout and inventory reservation lean CP; product reviews, likes and feeds lean AP. Explain what the user sees during a partition (error vs stale data) and how you reconcile afterwards.", "Interview-এ পুরো system নয়, feature অনুযায়ী CAP ব্যবহার করুন: checkout ও inventory reservation CP-র দিকে; product review, like ও feed AP-র দিকে। Partition-এর সময় user কী দেখে (error বনাম পুরনো data) এবং পরে কীভাবে মেলান ব্যাখ্যা করুন।"],
    p: [["List features and their data.", "Feature ও তাদের data তালিকা করুন।"], ["Classify each as CP or AP with a reason.", "কারণসহ প্রতিটিকে CP বা AP শ্রেণিতে ফেলুন।"], ["Describe user experience during a partition.", "Partition-এর সময় user-এর অভিজ্ঞতা বর্ণনা করুন।"], ["Describe reconciliation for AP data.", "AP data-র জন্য মেলানোর ব্যবস্থা বর্ণনা করুন।"]],
    m: ["Saying 'we choose CA'; one global choice; not linking the choice to business impact.", "'আমরা CA বাছি' বলা; একটি global পছন্দ; পছন্দকে ব্যবসার প্রভাবের সাথে যুক্ত না করা।"],
    q: ["Practice: 'For a ride-sharing app, which data is CP and which is AP?' Trip assignment and payments CP (no double assignment or charge); driver locations and ETAs AP (slightly stale is fine).", "অনুশীলন: 'Ride-sharing app-এ কোন data CP আর কোনটি AP?' Trip বরাদ্দ ও payment CP (দুবার বরাদ্দ বা charge নয়); driver-এর অবস্থান ও ETA AP (সামান্য পুরনো চলবে)।"],
    f: ["Explaining trade-offs in business language ('we show a slightly old like count, never a wrong balance') is what senior interviews reward.", "Trade-off ব্যবসার ভাষায় বলা ('আমরা সামান্য পুরনো like সংখ্যা দেখাই, কখনো ভুল balance নয়') senior interview-এ পুরস্কৃত হয়।"],
    x: [outline("Answer outline: CAP per feature · feature অনুযায়ী CAP", "| Feature            | Choice | During a partition                    |\n|--------------------|--------|---------------------------------------|\n| Checkout / payment | CP     | show 'try again', never double-charge |\n| Seat / stock hold  | CP     | reject holds that cannot be confirmed |\n| Product reviews    | AP     | show cached reviews, sync later       |\n| Likes / views      | AP     | count locally, merge counters after   |\n| Shopping cart      | AP     | merge carts (union) after healing     |")],
  },
  "Consistent Hashing": {
    s: ["Students sit around a circular table; each student serves the plates that land between them and the previous student. If a new student joins, they take over only a small slice. Consistent hashing keeps reshuffling small.", "ছাত্ররা গোল টেবিলে বসে; প্রত্যেকে তার ও আগের ছাত্রের মাঝে পড়া প্লেট পরিবেশন করে। নতুন ছাত্র যোগ দিলে শুধু ছোট একটি অংশ নেয়। Consistent hashing পুনর্বিন্যাস ছোট রাখে।"],
    t: ["Use consistent hashing when nodes join and leave (cache clusters, partitioned stores). In an answer: ring of hash values, keys map clockwise, virtual nodes for balance, replication to the next N distinct nodes, and about 1/N keys move when a node is added. Compare with modulo hashing to show the benefit.", "Node যোগ ও বিদায় হলে consistent hashing ব্যবহার করুন (cache cluster, partition-করা store)। উত্তরে: hash মানের বৃত্ত, key ঘড়ির কাঁটার দিকে মেলে, ভারসাম্যের জন্য virtual node, পরের N আলাদা node-এ replication, আর node যোগে প্রায় 1/N key সরে। সুবিধা দেখাতে modulo hashing-এর সাথে তুলনা করুন।"],
    p: [["Draw the ring with 3 nodes.", "৩টি node-সহ বৃত্ত আঁকুন।"], ["Place a few keys and show their owners.", "কয়েকটি key বসিয়ে মালিক দেখান।"], ["Add a node and show what moves.", "Node যোগ করে কী সরে দেখান।"], ["Add virtual nodes and replication.", "Virtual node ও replication যোগ করুন।"]],
    m: ["Forgetting virtual nodes; claiming zero keys move; ignoring hot keys (hashing does not fix popularity).", "Virtual node ভুলে যাওয়া; কোনো key সরে না দাবি; hot key উপেক্ষা (hashing জনপ্রিয়তা ঠিক করে না)।"],
    q: ["Practice: 'Design a distributed cache that can add nodes without a big miss spike.' Consistent hashing with virtual nodes, gradual warm-up of the new node, and replication for hot keys.", "অনুশীলন: 'বড় miss বৃদ্ধি ছাড়াই node যোগ করা যায় এমন distributed cache design করুন।' Virtual node-সহ consistent hashing, নতুন node-এর ধীরে warm-up, আর hot key-র জন্য replication।"],
    f: ["Consistent hashing also routes requests to stateful AI workers that hold a user's conversation or KV cache, improving latency.", "Consistent hashing user-এর কথোপকথন বা KV cache রাখা stateful AI worker-এও request পাঠায়, latency উন্নত করে।"],
    x: [outline("Answer outline: distributed cache ring · উত্তরের কাঠামো", "1. Ring: hash(node#v) for v in 0..199 (virtual nodes)\n2. Lookup: first ring point >= hash(key), wrap around\n3. Replication: store on the next 2 distinct physical nodes\n4. Add node: ~1/N keys move; warm new node by copying its range first\n5. Remove node: neighbours take its range; replicas avoid misses\n6. Hot keys: replicate to more nodes or add a local L1 cache")],
  },
  "Rate Limiter": {
    s: ["A metro gate lets one passenger through per tap and refuses a second tap within a second. A rate limiter protects services from too many requests.", "Metro gate প্রতি tap-এ একজন যাত্রী ঢুকতে দেয় এবং এক সেকেন্ডে দ্বিতীয় tap প্রত্যাখ্যান করে। Rate limiter অতিরিক্ত request থেকে service রক্ষা করে।"],
    t: ["The classic interview: design a rate limiter for an API. Cover requirements (per user/IP/key, limits per plan), algorithm (token bucket recommended), storage (Redis with atomic Lua), placement (gateway), response (429, headers), failure mode when Redis is down, and multi-region (local limits with periodic sync).", "প্রচলিত interview: একটি API-র rate limiter design করুন। Requirement (user/IP/key অনুযায়ী, plan অনুযায়ী সীমা), algorithm (token bucket প্রস্তাবিত), storage (atomic Lua-সহ Redis), অবস্থান (gateway), response (429, header), Redis বন্ধ হলে ব্যর্থতার আচরণ আর multi-region (নিয়মিত sync-সহ local সীমা) বলুন।"],
    p: [["Clarify limits and keys.", "সীমা ও key স্পষ্ট করুন।"], ["Choose the algorithm and justify it.", "Algorithm বেছে যৌক্তিকতা দিন।"], ["Show the Redis data model and atomic update.", "Redis data model ও atomic আপডেট দেখান।"], ["Discuss failure modes and monitoring.", "ব্যর্থতার ধরন ও নজরদারি আলোচনা করুন।"]],
    m: ["Non-atomic read-modify-write; no answer for Redis outages; forgetting to return Retry-After.", "Non-atomic পড়া-বদল-লেখা; Redis বিভ্রাটের উত্তর নেই; Retry-After দিতে ভুলে যাওয়া।"],
    q: ["Practice: 'Rate-limit an AI chat API by both requests and tokens per minute.' Use two buckets per user (requests and tokens); deduct estimated tokens before the call and adjust after the actual usage is known.", "অনুশীলন: 'Request ও প্রতি মিনিটে token দুটো দিয়ে AI chat API-র rate-limit করুন।' User-প্রতি দুটি bucket (request ও token); call-এর আগে অনুমিত token কাটুন এবং আসল ব্যবহার জানার পরে সমন্বয় করুন।"],
    f: ["Token-aware limiting is now a common interview twist. Practise explaining it with the two-bucket approach.", "Token-সচেতন সীমা এখন interview-এর প্রচলিত মোড়। দুই-bucket পদ্ধতিতে ব্যাখ্যা অনুশীলন করুন।"],
    x: [cs("Two buckets: requests and tokens · দুটি bucket: request ও token", `var requests = new Bucket(capacity: 5);
var tokens = new Bucket(capacity: 4000);
int[] promptTokens = [800, 1500, 1200, 900, 300];

foreach (int need in promptTokens)
{
    if (!requests.TryTake(1)) { Console.WriteLine("429: too many requests"); continue; }
    if (!tokens.TryTake(need)) { requests.Give(1); Console.WriteLine($"429: token budget exceeded (needed {need}, left {tokens.Left})"); continue; }
    Console.WriteLine($"200: used {need} tokens, left {tokens.Left}");
}

class Bucket(int capacity)
{
    public int Left { get; private set; } = capacity;
    public bool TryTake(int n) { if (Left < n) return false; Left -= n; return true; }
    public void Give(int n) => Left = Math.Min(capacity, Left + n);
}`, "200: used 800 tokens, left 3200\n200: used 1500 tokens, left 1700\n200: used 1200 tokens, left 500\n429: token budget exceeded (needed 900, left 500)\n200: used 300 tokens, left 200")],
  },
  "Message Queue": {
    s: ["A restaurant's order rail: waiters clip order slips, cooks take them one by one. Even if ten orders arrive at once, nothing is lost; the kitchen works through them at its own pace.", "রেস্তোরাঁর order রেল: ওয়েটার স্লিপ আটকান, রাঁধুনি একে একে নেন। একসাথে দশটি order এলেও কিছু হারায় না; রান্নাঘর নিজের গতিতে শেষ করে।"],
    t: ["In designs, a queue decouples producers from consumers, absorbs spikes and enables retries. Mention: delivery guarantees (at-least-once), idempotent consumers, ordering needs, visibility timeout, dead-letter queues, backpressure and scaling consumers by queue depth.", "Design-এ queue producer ও consumer আলাদা করে, হঠাৎ ভিড় শোষণ করে এবং retry সম্ভব করে। উল্লেখ করুন: delivery নিশ্চয়তা (at-least-once), idempotent consumer, ক্রমের দরকার, visibility timeout, dead-letter queue, backpressure আর queue-র গভীরতা অনুযায়ী consumer বাড়ানো।"],
    p: [["Identify slow or spiky work to move off the request path.", "Request-পথ থেকে সরানোর মতো ধীর বা আকস্মিক কাজ চিহ্নিত করুন।"], ["Define the message and idempotency key.", "Message ও idempotency key ঠিক করুন।"], ["Configure retries and a dead-letter queue.", "Retry ও dead-letter queue ঠিক করুন।"], ["Autoscale consumers on queue depth.", "Queue-র গভীরতায় consumer autoscale করুন।"]],
    m: ["Assuming exactly-once; no DLQ; putting huge payloads in messages instead of references.", "Exactly-once ধরে নেওয়া; DLQ নেই; reference-এর বদলে বার্তায় বিশাল payload।"],
    q: ["Practice: 'Design order confirmation emails that never block checkout.' Checkout writes an outbox event; a worker sends emails from a queue with retries; failures go to a DLQ and an alert.", "অনুশীলন: 'Checkout কখনো আটকায় না এমন order নিশ্চিতকরণ email design করুন।' Checkout outbox event লেখে; worker retry-সহ queue থেকে email পাঠায়; ব্যর্থতা DLQ-তে যায় ও alert হয়।"],
    f: ["AI jobs (document embedding, batch summarisation) are queue workloads. Show how you scale GPU or API-bound workers by queue depth and cost.", "AI-এর কাজ (document embedding, batch সারাংশ) queue workload। Queue-র গভীরতা ও খরচ অনুযায়ী GPU বা API-নির্ভর worker কীভাবে বাড়াবেন দেখান।"],
    x: [cs("Queue depth drives worker autoscaling · queue-র গভীরতায় worker", `int arrivalsPerMin = 600, perWorkerPerMin = 50, maxWorkers = 20;
int depth = 0, workers = 2;
for (int minute = 1; minute <= 5; minute++)
{
    depth += arrivalsPerMin;
    depth -= Math.Min(depth, workers * perWorkerPerMin);
    int target = Math.Clamp((int)Math.Ceiling((depth + arrivalsPerMin) / (double)perWorkerPerMin), 2, maxWorkers);
    Console.WriteLine($"min {minute}: workers {workers,2}, backlog {depth,4} -> scale to {target}");
    workers = target;
}`, "min 1: workers  2, backlog  500 -> scale to 20\nmin 2: workers 20, backlog  100 -> scale to 14\nmin 3: workers 14, backlog    0 -> scale to 12\nmin 4: workers 12, backlog    0 -> scale to 12\nmin 5: workers 12, backlog    0 -> scale to 12")],
  },
  "Pub / Sub": {
    s: ["A school announcement over loudspeakers: one message, every classroom hears it, and each class reacts in its own way. Pub/sub broadcasts events to all interested subscribers.", "Loudspeaker-এ স্কুলের ঘোষণা: একটি বার্তা, প্রতিটি classroom শোনে, আর প্রতিটি class নিজের মতো সাড়া দেয়। Pub/sub আগ্রহী সব subscriber-কে event পাঠায়।"],
    t: ["Pub/sub lets you add consumers without changing producers. In designs, describe topics, fan-out to independent subscriptions, ordering per key, retention and replay, schema evolution, and how subscribers stay idempotent. Contrast with point-to-point queues.", "Pub/sub producer না বদলে consumer যোগ করতে দেয়। Design-এ topic, স্বাধীন subscription-এ fan-out, key অনুযায়ী ক্রম, retention ও replay, schema-র বিবর্তন আর subscriber কীভাবে idempotent থাকে বর্ণনা করুন। Point-to-point queue-র সাথে তুলনা করুন।"],
    p: [["Name the event as a fact (PaymentSucceeded).", "Event-কে ঘটনা হিসেবে নাম দিন (PaymentSucceeded)।"], ["List subscribers and what each does.", "Subscriber ও প্রত্যেকে কী করে তালিকা করুন।"], ["Choose ordering key and retention.", "ক্রমের key ও retention বাছুন।"], ["Version the schema.", "Schema-র version দিন।"]],
    m: ["Events that carry too little data (every subscriber calls back the producer); breaking schema changes; subscribers depending on each other's timing.", "খুব কম data বহনকারী event (প্রতিটি subscriber producer-কে আবার ডাকে); ভাঙা schema পরিবর্তন; একে অপরের সময়ের উপর নির্ভরশীল subscriber।"],
    q: ["Practice: 'When a payment succeeds, update the order, send a receipt, award loyalty points and update analytics.' One PaymentSucceeded topic with four subscriptions, each retrying independently.", "অনুশীলন: 'Payment সফল হলে order আপডেট, receipt পাঠানো, loyalty point দেওয়া ও analytics আপডেট করুন।' চারটি subscription-সহ একটি PaymentSucceeded topic, প্রত্যেকে স্বাধীনভাবে retry করে।"],
    f: ["Mention adding an AI subscriber (fraud scoring, support follow-up) as an easy extension; pub/sub makes such additions low-risk.", "AI subscriber (fraud scoring, support follow-up) যোগকে সহজ বিস্তার হিসেবে উল্লেখ করুন; pub/sub এমন সংযোজন কম ঝুঁকির করে।"],
    x: [cs("One event, many independent subscribers · এক event, অনেক subscriber", `var subscribers = new Dictionary<string, Func<string, bool>>
{
    ["orders"] = id => { Console.WriteLine($"orders: mark {id} paid"); return true; },
    ["email"] = id => { Console.WriteLine($"email: receipt for {id} (SMTP down)"); return false; },
    ["loyalty"] = id => { Console.WriteLine($"loyalty: +50 points for {id}"); return true; },
};

var retryQueue = new List<string>();
foreach (var (name, handle) in subscribers)
    if (!handle("A-7")) retryQueue.Add(name);          // failure in one subscriber does not affect others

Console.WriteLine($"to retry later: {string.Join(", ", retryQueue)}");`, "orders: mark A-7 paid\nemail: receipt for A-7 (SMTP down)\nloyalty: +50 points for A-7\nto retry later: email")],
  },
  "API Gateway": {
    s: ["A hotel concierge desk: guests ask one person for taxis, restaurants and tours, and the concierge calls the right partners. Guests do not need everyone's phone number.", "Hotel-এর concierge desk: অতিথিরা taxi, রেস্তোরাঁ ও tour-এর জন্য একজনকে বলেন, concierge সঠিক অংশীদারকে ফোন করেন। অতিথিদের সবার ফোন নম্বর জানতে হয় না।"],
    t: ["In an answer, place the gateway at the edge for routing, auth, rate limiting, request validation and aggregation (backend-for-frontend for mobile vs web). Discuss its availability, latency overhead, and keeping business logic in services. Mention a service mesh for internal service-to-service concerns.", "উত্তরে gateway-কে edge-এ routing, auth, rate limiting, request যাচাই ও aggregation-এর (mobile বনাম web-এর জন্য backend-for-frontend) জন্য বসান। এর availability, latency-র বাড়তি সময় আর business যুক্তি service-এ রাখার কথা বলুন। ভিতরের service-থেকে-service বিষয়ের জন্য service mesh উল্লেখ করুন।"],
    p: [["List client types and their needs.", "Client-এর ধরন ও তাদের চাহিদা তালিকা করুন।"], ["Map routes to services.", "Route-কে service-এর সাথে মেলান।"], ["Add auth, rate limits, validation at the gateway.", "Gateway-তে auth, rate limit, যাচাই দিন।"], ["Consider a BFF for mobile.", "Mobile-এর জন্য BFF বিবেচনা করুন।"]],
    m: ["Gateway as a monolith with business logic; no caching for aggregated calls; ignoring timeouts to downstream services.", "Business যুক্তিসহ monolith gateway; aggregate call-এ caching নেই; downstream service-এ timeout উপেক্ষা।"],
    q: ["Practice: 'The mobile home screen needs data from 5 services and is slow.' Add a BFF endpoint at the gateway that calls services in parallel with timeouts and returns one tailored response.", "অনুশীলন: 'Mobile home screen ৫টি service-এর data চায় এবং ধীর।' Gateway-তে একটি BFF endpoint দিন, যা timeout-সহ service-গুলো parallel-এ ডাকে ও একটি মানানসই response দেয়।"],
    f: ["Parallel aggregation with timeouts is a strong practical skill; show it with Task.WhenAll and partial results.", "Timeout-সহ parallel aggregation শক্ত ব্যবহারিক দক্ষতা; Task.WhenAll ও আংশিক ফল দিয়ে দেখান।"],
    x: [cs("BFF aggregation with per-call timeouts · timeout-সহ BFF aggregation", `async Task<string> Call(string name, int ms, int timeoutMs)
{
    var work = Task.Delay(ms).ContinueWith(_ => $"{name}: ok");
    var done = await Task.WhenAny(work, Task.Delay(timeoutMs));
    return done == work ? await work : $"{name}: skipped (timeout)";
}

var sw = System.Diagnostics.Stopwatch.StartNew();
var parts = await Task.WhenAll(
    Call("profile", 50, 300), Call("cart", 80, 300), Call("offers", 120, 300),
    Call("recommendations", 900, 300), Call("notifications", 60, 300));
foreach (var p in parts) Console.WriteLine(p);
Console.WriteLine($"home screen built in under 500 ms: {sw.ElapsedMilliseconds < 500}");`, "profile: ok\ncart: ok\noffers: ok\nrecommendations: skipped (timeout)\nnotifications: ok\nhome screen built in under 500 ms: True")],
  },
  "Microservices": {
    s: ["A food court: each stall runs independently with its own kitchen and staff, but they share seating and payment. One stall closing does not shut the food court. Microservices are independent stalls for software.", "Food court: প্রতিটি দোকান নিজস্ব রান্নাঘর ও কর্মী নিয়ে স্বাধীনভাবে চলে, কিন্তু বসার জায়গা ও payment শেয়ার করে। একটি দোকান বন্ধ হলে food court বন্ধ হয় না। Microservice হলো software-এর স্বাধীন দোকান।"],
    t: ["Interviewers want boundaries and trade-offs: split by business capability, each service owns its data, communicate with APIs for queries and events for changes, handle failures (timeouts, retries, circuit breakers), and invest in observability and CI/CD. Be ready to argue for a modular monolith when appropriate.", "Interviewer সীমানা ও trade-off চান: ব্যবসায়িক সক্ষমতা অনুযায়ী ভাগ, প্রতিটি service নিজের data-র মালিক, query-তে API আর পরিবর্তনে event দিয়ে যোগাযোগ, ব্যর্থতা সামলানো (timeout, retry, circuit breaker), আর observability ও CI/CD-তে বিনিয়োগ। উপযুক্ত হলে modular monolith-এর পক্ষে যুক্তি দিতে প্রস্তুত থাকুন।"],
    p: [["Identify 4-6 bounded contexts.", "৪-৬টি bounded context চিহ্নিত করুন।"], ["Assign data ownership.", "Data-র মালিকানা দিন।"], ["Choose sync vs async interactions.", "Sync বনাম async যোগাযোগ বাছুন।"], ["Describe resilience and observability.", "Resilience ও observability বর্ণনা করুন।"]],
    m: ["Too many tiny services; shared databases; synchronous chains five services deep.", "অনেক খুব ছোট service; শেয়ার database; পাঁচ service গভীর synchronous শৃঙ্খল।"],
    q: ["Practice: 'Split a food-delivery monolith.' Orders, Restaurants/Menu, Delivery/Dispatch, Payments, Notifications; events like OrderPlaced and RiderAssigned connect them.", "অনুশীলন: 'একটি food-delivery monolith ভাগ করুন।' Orders, Restaurants/Menu, Delivery/Dispatch, Payments, Notifications; OrderPlaced ও RiderAssigned-এর মতো event তাদের যুক্ত করে।"],
    f: ["Mention platform tooling (.NET Aspire, OpenTelemetry, service templates) as how teams keep many services manageable.", "অনেক service পরিচালনাযোগ্য রাখতে দল কীভাবে platform tooling (.NET Aspire, OpenTelemetry, service template) ব্যবহার করে উল্লেখ করুন।"],
    x: [outline("Answer outline: food-delivery services · উত্তরের কাঠামো", "Services (each owns its DB):\n- Orders: place/cancel, order state machine -> emits OrderPlaced, OrderCancelled\n- Menu: restaurants, items, prices (read-heavy, cached, CDN for images)\n- Payments: charges/refunds, idempotency keys -> emits PaymentSucceeded/Failed\n- Dispatch: rider matching (geo index) -> emits RiderAssigned\n- Notifications: subscribes to all events, sends SMS/push\nSync calls: client -> gateway -> Orders/Menu only\nAsync: everything else via events; saga for order -> payment -> dispatch")],
  },
  "SQL vs NoSQL": {
    s: ["A filing cabinet with fixed labelled folders (SQL) versus labelled boxes where you can throw in any document shape (document NoSQL). Each is better for different paperwork.", "নির্দিষ্ট লেবেলযুক্ত folder-সহ file cabinet (SQL) বনাম লেবেলযুক্ত বাক্স যেখানে যেকোনো আকারের document রাখা যায় (document NoSQL)। ভিন্ন কাগজপত্রে প্রত্যেকে ভালো।"],
    t: ["Choose by access patterns and guarantees: relational databases give joins, transactions and flexible queries (orders, payments). NoSQL families: key-value (sessions, caches), document (catalogs with varying attributes), wide-column (huge write-heavy time series), graph (relationships). Many systems use both (polyglot persistence). Modern PostgreSQL with JSONB covers many document needs.", "Access pattern ও নিশ্চয়তা দেখে বাছুন: relational database join, transaction ও নমনীয় query দেয় (order, payment)। NoSQL পরিবার: key-value (session, cache), document (ভিন্ন বৈশিষ্ট্যের catalog), wide-column (বিশাল লেখা-ভারী time series), graph (সম্পর্ক)। অনেক system দুটোই ব্যবহার করে (polyglot persistence)। JSONB-সহ আধুনিক PostgreSQL অনেক document চাহিদা মেটায়।"],
    p: [["List the main queries and write rates.", "প্রধান query ও লেখার হার তালিকা করুন।"], ["Mark which data needs transactions.", "কোন data-য় transaction লাগে চিহ্নিত করুন।"], ["Pick a store per data type.", "Data-র ধরন অনুযায়ী store বাছুন।"], ["Explain consistency and scaling of each.", "প্রতিটির consistency ও scaling ব্যাখ্যা করুন।"]],
    m: ["Choosing NoSQL 'because it scales' without access patterns; losing transactions for money; too many databases for a small team.", "Access pattern ছাড়া 'scale করে' বলে NoSQL বাছা; টাকার ক্ষেত্রে transaction হারানো; ছোট দলের জন্য অনেক database।"],
    q: ["Practice: 'Store data for an e-commerce app.' Orders/payments in PostgreSQL, catalog in PostgreSQL JSONB or a document DB, sessions/cart in Redis, search in Elasticsearch/OpenSearch, analytics events in a column store.", "অনুশীলন: 'E-commerce app-এর data রাখুন।' Order/payment PostgreSQL-এ, catalog PostgreSQL JSONB বা document DB-তে, session/cart Redis-এ, search Elasticsearch/OpenSearch-এ, analytics event column store-এ।"],
    f: ["Add a vector store (or pgvector) for AI search to your polyglot picture, and explain why keeping vectors next to relational data can simplify permissions.", "AI search-এর জন্য polyglot চিত্রে একটি vector store (বা pgvector) যোগ করুন, আর relational data-র পাশে vector রাখলে কেন অনুমতি সহজ হয় ব্যাখ্যা করুন।"],
    x: [outline("Answer outline: polyglot persistence · উত্তরের কাঠামো", "| Data              | Store                    | Why                                   |\n|-------------------|--------------------------|---------------------------------------|\n| Orders, payments  | PostgreSQL               | ACID transactions, joins, reporting   |\n| Product catalog   | PostgreSQL JSONB         | flexible attributes, still queryable  |\n| Cart, sessions    | Redis                    | fast key-value, TTL                   |\n| Product search    | OpenSearch               | full-text, facets, typo tolerance     |\n| AI semantic search| pgvector                 | embeddings next to permissions data   |\n| Click events      | ClickHouse / BigQuery    | huge append-only analytics            |")],
  },
  "Indexing": {
    s: ["A dictionary is sorted alphabetically so you can find any word in seconds. Without that order, you would read every page. Indexes give databases that sorted shortcut.", "অভিধান বর্ণানুক্রমে সাজানো, তাই যেকোনো শব্দ কয়েক সেকেন্ডে পাওয়া যায়। সেই ক্রম না থাকলে প্রতিটি পাতা পড়তে হতো। Index database-কে সেই সাজানো শর্টকাট দেয়।"],
    t: ["In design answers, name the indexes for your main queries: primary keys, foreign keys, composite indexes matching WHERE + ORDER BY, covering indexes to avoid table lookups, and full-text or geo indexes when needed. Mention the write cost and how you verify with EXPLAIN.", "Design উত্তরে প্রধান query-র index-এর নাম বলুন: primary key, foreign key, WHERE + ORDER BY-এর সাথে মেলা composite index, table খোঁজা এড়াতে covering index, আর দরকারে full-text বা geo index। লেখার খরচ ও EXPLAIN দিয়ে যাচাই উল্লেখ করুন।"],
    p: [["Write the top 3 queries.", "শীর্ষ ৩টি query লিখুন।"], ["Design one index per query pattern.", "প্রতি query pattern-এ একটি index design করুন।"], ["Order composite columns: equality first, then range/sort.", "Composite column-এর ক্রম: আগে সমতা, তারপর range/sort।"], ["Mention write overhead.", "লেখার বাড়তি খরচ উল্লেখ করুন।"]],
    m: ["Indexing low-cardinality columns alone (status); wrong composite order; forgetting the feed query needs (user_id, created_at DESC).", "একা কম-বৈচিত্র্যের column-এ index (status); ভুল composite ক্রম; feed query-তে (user_id, created_at DESC) লাগে ভুলে যাওয়া।"],
    q: ["Practice: 'Index a feed: latest 20 posts of people I follow.' Index posts(author_id, created_at DESC); for scale, precompute per-user timelines (fan-out on write) for normal users and merge celebrity posts at read time.", "অনুশীলন: 'Feed-এর index: আমি যাদের follow করি তাদের সর্বশেষ ২০টি post।' posts(author_id, created_at DESC)-এ index; বড় মাপে সাধারণ user-এর জন্য user-ভিত্তিক timeline আগে বানান (লেখায় fan-out) আর তারকাদের post পড়ার সময় মেলান।"],
    f: ["Vector indexes (HNSW) have their own tuning knobs (ef, M). Mention recall vs latency trade-offs when your design includes semantic search.", "Vector index (HNSW)-এর নিজস্ব tuning (ef, M) আছে। Design-এ semantic search থাকলে recall বনাম latency-র trade-off উল্লেখ করুন।"],
    x: [outline("Answer outline: indexes for a feed · উত্তরের কাঠামো", "Queries -> indexes\n1. Post page:    SELECT * FROM posts WHERE id = ?               -> PK(id)\n2. Profile list: WHERE author_id = ? ORDER BY created_at DESC     -> IX(author_id, created_at DESC)\n3. Comments:     WHERE post_id = ? ORDER BY created_at            -> IX(post_id, created_at)\n4. Search:       full-text on title/body                          -> GIN / OpenSearch\nWrite cost: each post insert updates 2 indexes (acceptable: reads >> writes)\nVerify: EXPLAIN ANALYZE in staging with production-sized data")],
  },
  "SOLID": {
    s: ["Building furniture from IKEA parts: each piece has one job, fits standard connectors, and you can swap a drawer without rebuilding the cabinet. SOLID keeps code modular in the same way.", "IKEA অংশ দিয়ে আসবাব বানানো: প্রতিটি টুকরোর একটি কাজ, মানক সংযোগে লাগে, আর cabinet না ভেঙে drawer বদলানো যায়। SOLID একইভাবে code modular রাখে।"],
    t: ["In low-level design rounds, show SOLID through code: small classes with single responsibilities, interfaces for extension points (payment methods, pricing rules), substitutable implementations, focused interfaces and constructor injection. Explain each principle with your own code rather than definitions.", "Low-level design round-এ code দিয়ে SOLID দেখান: একক দায়িত্বের ছোট class, বিস্তারের জায়গায় interface (payment পদ্ধতি, pricing নিয়ম), প্রতিস্থাপনযোগ্য বাস্তবায়ন, নির্দিষ্ট interface ও constructor injection। সংজ্ঞা নয়, নিজের code দিয়ে প্রতিটি নীতি ব্যাখ্যা করুন।"],
    p: [["Sketch classes for the problem.", "সমস্যার জন্য class আঁকুন।"], ["Spot extension points and add interfaces.", "বিস্তারের জায়গা খুঁজে interface দিন।"], ["Inject dependencies.", "Dependency inject করুন।"], ["Point out where each principle appears.", "প্রতিটি নীতি কোথায় আছে দেখান।"]],
    m: ["Reciting definitions without examples; over-abstracting a 50-line problem; interfaces with one method used once.", "উদাহরণ ছাড়া সংজ্ঞা মুখস্থ বলা; ৫০ লাইনের সমস্যায় অতিরিক্ত abstraction; একবার ব্যবহৃত এক-method-এর interface।"],
    q: ["Practice: 'Design a notification system supporting email, SMS and push, easy to add WhatsApp later.' INotificationChannel interface, one class per channel, a dispatcher that takes channels via DI (open/closed + dependency inversion).", "অনুশীলন: 'Email, SMS ও push সমর্থনকারী notification system design করুন, পরে WhatsApp যোগ সহজ হবে।' INotificationChannel interface, প্রতি channel-এ একটি class, DI দিয়ে channel নেওয়া dispatcher (open/closed + dependency inversion)।"],
    f: ["Clear interfaces also make code easier for AI tools to extend correctly; mention testability and AI-assisted refactoring as benefits.", "স্পষ্ট interface AI tool-এর জন্যও code সঠিকভাবে বাড়ানো সহজ করে; সুবিধা হিসেবে testability ও AI-সহায়িত refactoring উল্লেখ করুন।"],
    x: [cs("Add a channel without touching the dispatcher · dispatcher না বদলে channel যোগ", `var dispatcher = new Dispatcher([new Email(), new Sms(), new WhatsApp()]);
dispatcher.Notify("Order A-7 delivered", prefers: ["whatsapp", "sms"]);

interface INotificationChannel { string Name { get; } void Send(string msg); }
class Email : INotificationChannel { public string Name => "email"; public void Send(string m) => Console.WriteLine($"email: {m}"); }
class Sms : INotificationChannel { public string Name => "sms"; public void Send(string m) => Console.WriteLine($"sms: {m}"); }
class WhatsApp : INotificationChannel { public string Name => "whatsapp"; public void Send(string m) => Console.WriteLine($"whatsapp: {m}"); }   // added later

class Dispatcher(IEnumerable<INotificationChannel> channels)
{
    public void Notify(string msg, string[] prefers)
    {
        foreach (var c in channels.Where(c => prefers.Contains(c.Name))) c.Send(msg);
    }
}`, "sms: Order A-7 delivered\nwhatsapp: Order A-7 delivered")],
  },
  "Singleton": {
    s: ["A building has one main electricity meter shared by everyone. Installing a second 'main' meter would cause billing chaos. Some objects should exist once per application.", "একটি ভবনে সবার শেয়ার করা একটি প্রধান বিদ্যুৎ মিটার। দ্বিতীয় 'প্রধান' মিটার বসালে bill-এ বিশৃঙ্খলা। কিছু object application-এ একবারই থাকা উচিত।"],
    t: ["Interview angle: explain when one instance is right (configuration, caches, connection pools, HttpClient handlers), how to make it thread-safe (Lazy<T>), and why DI-registered singletons beat static singletons for testing. Also explain lifetime pitfalls: a singleton must not capture scoped services.", "Interview-এর দিক: কখন একটি instance ঠিক (configuration, cache, connection pool, HttpClient handler), কীভাবে thread-safe (Lazy<T>), আর test-এর জন্য static singleton-এর চেয়ে DI-registered singleton কেন ভালো ব্যাখ্যা করুন। Lifetime-এর ফাঁদও বলুন: singleton scoped service ধরে রাখবে না।"],
    p: [["Justify why one instance is needed.", "একটি instance কেন লাগে যৌক্তিকতা দিন।"], ["Show Lazy<T> or AddSingleton.", "Lazy<T> বা AddSingleton দেখান।"], ["Discuss thread safety of its state.", "এর অবস্থার thread safety আলোচনা করুন।"], ["Mention testability and lifetimes.", "Testability ও lifetime উল্লেখ করুন।"]],
    m: ["Double-checked locking written incorrectly; mutable global state; singleton DbContext.", "ভুলভাবে লেখা double-checked locking; পরিবর্তনশীল global অবস্থা; singleton DbContext।"],
    q: ["Practice: 'Why should HttpClient not be created per request, and how do you share it?' Creating many causes socket exhaustion; use IHttpClientFactory (pooled handlers) or a long-lived singleton with PooledConnectionLifetime for DNS changes.", "অনুশীলন: 'HttpClient কেন request-প্রতি বানানো উচিত নয়, আর কীভাবে শেয়ার করবেন?' অনেক বানালে socket শেষ হয়; IHttpClientFactory (pool-করা handler) বা DNS পরিবর্তনের জন্য PooledConnectionLifetime-সহ দীর্ঘজীবী singleton ব্যবহার করুন।"],
    f: ["AI SDK clients are usually designed as long-lived singletons too. Same reasoning: connection reuse and shared configuration.", "AI SDK client-ও সাধারণত দীর্ঘজীবী singleton হিসেবে design করা। একই যুক্তি: connection পুনর্ব্যবহার ও শেয়ার configuration।"],
    x: [cs("Lifetimes: singleton vs scoped vs transient · তিন lifetime", `using Microsoft.Extensions.DependencyInjection;

var services = new ServiceCollection();
services.AddSingleton<Counter>(_ => new Counter("singleton"));
services.AddScoped<Scoped>();
services.AddTransient<Transient>();
using var provider = services.BuildServiceProvider();

for (int request = 1; request <= 2; request++)
{
    using var scope = provider.CreateScope();
    var sp = scope.ServiceProvider;
    bool sameScoped = ReferenceEquals(sp.GetRequiredService<Scoped>(), sp.GetRequiredService<Scoped>());
    bool sameTransient = ReferenceEquals(sp.GetRequiredService<Transient>(), sp.GetRequiredService<Transient>());
    Console.WriteLine($"request {request}: singleton id={sp.GetRequiredService<Counter>().Id}, scoped same within request={sameScoped}, transient same={sameTransient}");
}

class Counter(string name) { public string Id { get; } = name + "-1"; }
class Scoped { }
class Transient { }`, "request 1: singleton id=singleton-1, scoped same within request=True, transient same=False\nrequest 2: singleton id=singleton-1, scoped same within request=True, transient same=False", ["Microsoft.Extensions.DependencyInjection"])],
  },
  "Factory": {
    s: ["A car showroom: you say 'family car, automatic', and the showroom gives you the right model without you visiting the factory floor. A factory hides how objects are built.", "Car showroom: আপনি বলেন 'পারিবারিক গাড়ি, automatic', আর showroom কারখানায় না গিয়েই সঠিক model দেয়। Factory object কীভাবে বানানো হয় তা লুকায়।"],
    t: ["Use factories in LLD answers when creation depends on input or configuration (payment provider by country, parser by file type). Show a Create method returning an interface, registration via DI (keyed services in .NET 8+), and how adding a new type touches one place.", "LLD উত্তরে factory ব্যবহার করুন যখন তৈরি input বা configuration-এর উপর নির্ভর করে (দেশ অনুযায়ী payment provider, file-এর ধরন অনুযায়ী parser)। Interface ফেরত দেওয়া Create method, DI দিয়ে registration (.NET 8+-এ keyed service), আর নতুন ধরন যোগে এক জায়গাই বদলায় দেখান।"],
    p: [["Identify the varying creation decision.", "পরিবর্তনশীল তৈরির সিদ্ধান্ত চিহ্নিত করুন।"], ["Define the product interface.", "Product interface ঠিক করুন।"], ["Implement the factory (or keyed DI).", "Factory (বা keyed DI) বাস্তবায়ন করুন।"], ["Show adding a new product.", "নতুন product যোগ দেখান।"]],
    m: ["Factories everywhere for simple objects; returning concrete classes; switch statements duplicated outside the factory.", "সাধারণ object-এর জন্য সব জায়গায় factory; নির্দিষ্ট class ফেরত দেওয়া; factory-র বাইরে switch পুনরাবৃত্তি।"],
    q: ["Practice: 'Choose a payment gateway by country: BD -> bKash, IN -> Razorpay, others -> Stripe.' Keyed services or a factory keyed by country code returning IPaymentGateway.", "অনুশীলন: 'দেশ অনুযায়ী payment gateway বাছুন: BD -> bKash, IN -> Razorpay, বাকি -> Stripe।' দেশের code দিয়ে keyed service বা factory, যা IPaymentGateway ফেরত দেয়।"],
    f: ["Keyed services are the modern .NET way to implement simple factories; mentioning them shows up-to-date knowledge.", "Keyed service সাধারণ factory বাস্তবায়নের আধুনিক .NET উপায়; উল্লেখ করলে হালনাগাদ জ্ঞান দেখায়।"],
    x: [cs("Keyed services as a factory · keyed service দিয়ে factory", `using Microsoft.Extensions.DependencyInjection;

var services = new ServiceCollection();
services.AddKeyedSingleton<IPaymentGateway, BKash>("BD");
services.AddKeyedSingleton<IPaymentGateway, Razorpay>("IN");
services.AddKeyedSingleton<IPaymentGateway, Stripe>("default");
using var sp = services.BuildServiceProvider();

IPaymentGateway For(string country) =>
    sp.GetKeyedService<IPaymentGateway>(country) ?? sp.GetRequiredKeyedService<IPaymentGateway>("default");

foreach (var c in new[] { "BD", "IN", "US" }) Console.WriteLine($"{c}: {For(c).Charge(500m)}");

interface IPaymentGateway { string Charge(decimal amount); }
class BKash : IPaymentGateway { public string Charge(decimal a) => $"bKash charged {a} BDT"; }
class Razorpay : IPaymentGateway { public string Charge(decimal a) => $"Razorpay charged {a}"; }
class Stripe : IPaymentGateway { public string Charge(decimal a) => $"Stripe charged {a}"; }`, "BD: bKash charged 500 BDT\nIN: Razorpay charged 500\nUS: Stripe charged 500", ["Microsoft.Extensions.DependencyInjection"])],
  },
  "Observer": {
    s: ["Weather alerts on your phone: you subscribe to your district, and when a cyclone warning is issued, you get notified automatically. Observer lets objects react to changes they care about.", "ফোনে আবহাওয়ার সতর্কতা: আপনার জেলায় subscribe করেন, ঘূর্ণিঝড়ের সতর্কতা জারি হলে স্বয়ংক্রিয়ভাবে খবর পান। Observer object-কে তাদের আগ্রহের পরিবর্তনে সাড়া দিতে দেয়।"],
    t: ["In LLD rounds, observer appears in stock tickers, notification systems and UI state. Show subscribe/unsubscribe, notifying with event data, error isolation between observers, and thread safety. Then explain how the same idea scales to pub/sub across services.", "LLD round-এ observer stock ticker, notification system ও UI state-এ আসে। Subscribe/unsubscribe, event data-সহ জানানো, observer-এর মধ্যে error আলাদা রাখা ও thread safety দেখান। তারপর ব্যাখ্যা করুন একই ধারণা কীভাবে service জুড়ে pub/sub-এ বড় হয়।"],
    p: [["Define the subject and the event payload.", "Subject ও event payload ঠিক করুন।"], ["Implement subscribe and unsubscribe.", "Subscribe ও unsubscribe বাস্তবায়ন করুন।"], ["Notify each observer and isolate failures.", "প্রতিটি observer-কে জানান এবং ব্যর্থতা আলাদা রাখুন।"], ["Discuss scaling to a message broker.", "Message broker-এ বড় করা আলোচনা করুন।"]],
    m: ["One failing observer breaking all others; memory leaks from forgotten subscriptions; synchronous slow observers blocking the subject.", "একটি ব্যর্থ observer বাকিদের ভাঙা; ভুলে যাওয়া subscription থেকে memory leak; ধীর synchronous observer subject আটকায়।"],
    q: ["Practice: 'Design a stock price alert service.' Subject per symbol, observers with thresholds, notify when price crosses, and at scale move to a stream (Kafka) with consumer groups.", "অনুশীলন: 'Stock-এর দামের alert service design করুন।' Symbol-প্রতি subject, সীমাসহ observer, দাম পার হলে জানানো, আর বড় মাপে consumer group-সহ stream (Kafka)-এ যাওয়া।"],
    f: ["Reactive patterns power real-time dashboards and AI monitoring (alerting when eval scores drop). Show you can connect the LLD pattern to these systems.", "Reactive pattern real-time dashboard ও AI monitoring চালায় (eval score কমলে alert)। LLD pattern-কে এসব system-এর সাথে যুক্ত করতে পারেন দেখান।"],
    x: [cs("Price alerts with error isolation · error আলাদা রেখে দামের alert", `var ticker = new Ticker();
ticker.Subscribe(new Alert("Asha", above: 105));
ticker.Subscribe(new BrokenAlert());
ticker.Subscribe(new Alert("Rafi", above: 110));
foreach (decimal price in new[] { 100m, 106m, 112m }) ticker.Publish("GP", price);

interface IObserver { void OnPrice(string symbol, decimal price); }
class Alert(string user, decimal above) : IObserver
{
    public void OnPrice(string s, decimal p) { if (p > above) Console.WriteLine($"  {user}: {s} crossed {above} at {p}"); }
}
class BrokenAlert : IObserver { public void OnPrice(string s, decimal p) => throw new Exception("bug"); }
class Ticker
{
    private readonly List<IObserver> observers = [];
    public void Subscribe(IObserver o) => observers.Add(o);
    public void Publish(string symbol, decimal price)
    {
        Console.WriteLine($"{symbol} = {price}");
        foreach (var o in observers)
            try { o.OnPrice(symbol, price); } catch { Console.WriteLine("  (one observer failed, others continue)"); }
    }
}`, "GP = 100\n  (one observer failed, others continue)\nGP = 106\n  Asha: GP crossed 105 at 106\n  (one observer failed, others continue)\nGP = 112\n  Asha: GP crossed 105 at 112\n  (one observer failed, others continue)\n  Rafi: GP crossed 110 at 112")],
  },
  "Strategy": {
    s: ["A delivery app choosing the route: shortest distance on normal days, avoiding flooded roads in monsoon, fastest highway at night. Same goal, different strategy.", "Delivery app পথ বাছে: সাধারণ দিনে সবচেয়ে ছোট দূরত্ব, বর্ষায় ডুবে যাওয়া রাস্তা এড়িয়ে, রাতে দ্রুততম highway। একই লক্ষ্য, ভিন্ন strategy।"],
    t: ["In LLD answers, strategy cleanly handles variants: pricing (surge, discount), sorting, routing, retry policies. Show an interface, several implementations, and selection by configuration or context. Mention that strategies are independently testable and can be A/B tested.", "LLD উত্তরে strategy বিভিন্ন রূপ পরিষ্কারভাবে সামলায়: pricing (surge, discount), sorting, routing, retry নীতি। একটি interface, কয়েকটি বাস্তবায়ন, আর configuration বা প্রসঙ্গ দিয়ে বাছাই দেখান। Strategy আলাদাভাবে test-যোগ্য এবং A/B test করা যায় উল্লেখ করুন।"],
    p: [["Find the algorithm that varies.", "যে algorithm বদলায় খুঁজুন।"], ["Create an interface and implementations.", "Interface ও বাস্তবায়ন বানান।"], ["Select by context (time, region, plan).", "প্রসঙ্গ দিয়ে বাছুন (সময়, region, plan)।"], ["Test each in isolation.", "প্রতিটি আলাদাভাবে test করুন।"]],
    m: ["Giant switch statements; strategies that depend on the context class internals; no default strategy.", "বিশাল switch statement; context class-এর ভিতরের উপর নির্ভরশীল strategy; কোনো ডিফল্ট strategy নেই।"],
    q: ["Practice: 'Ride fare calculation with normal, surge and promo pricing.' IFareStrategy with Calculate(trip); a selector picks surge when demand/supply > 1.5, promo for eligible users, otherwise normal.", "অনুশীলন: 'সাধারণ, surge ও promo pricing-সহ ride-এর ভাড়া হিসাব।' Calculate(trip)-সহ IFareStrategy; চাহিদা/সরবরাহ > ১.৫ হলে selector surge বাছে, যোগ্য user-এ promo, নয়তো সাধারণ।"],
    f: ["Model routing (cheap vs powerful model) is a strategy decision; mention evaluating strategies with real metrics before rollout.", "Model routing (সস্তা বনাম শক্তিশালী model) একটি strategy সিদ্ধান্ত; চালুর আগে আসল metric দিয়ে strategy মূল্যায়ন উল্লেখ করুন।"],
    x: [cs("Fare strategies selected by context · প্রসঙ্গ অনুযায়ী ভাড়ার strategy", `IFare Select(double demandRatio, bool promoUser) =>
    promoUser ? new Promo() : demandRatio > 1.5 ? new Surge(demandRatio) : new Normal();

var trip = new Trip(Km: 8, Minutes: 25);
foreach (var (ratio, promo) in new[] { (1.0, false), (2.0, false), (2.0, true) })
{
    var s = Select(ratio, promo);
    Console.WriteLine($"demand {ratio:0.0}, promo {promo,-5} -> {s.GetType().Name,-6} {s.Calculate(trip),6:0} BDT");
}

record Trip(double Km, double Minutes);
interface IFare { double Calculate(Trip t); }
class Normal : IFare { public double Calculate(Trip t) => 50 + t.Km * 20 + t.Minutes * 2; }
class Surge(double ratio) : IFare { public double Calculate(Trip t) => new Normal().Calculate(t) * Math.Min(ratio, 2.5); }
class Promo : IFare { public double Calculate(Trip t) => new Normal().Calculate(t) * 0.8; }`, "demand 1.0, promo False -> Normal    260 BDT\ndemand 2.0, promo False -> Surge     520 BDT\ndemand 2.0, promo True  -> Promo     208 BDT")],
  },
  "Design Patterns": {
    s: ["Recipes passed down in a family: proven ways to cook common dishes. You do not reinvent biryani; you adapt the recipe. Design patterns are proven solutions to common design problems.", "পরিবারে প্রজন্ম ধরে চলা রান্নার পদ্ধতি: প্রচলিত পদ রান্নার প্রমাণিত উপায়। বিরিয়ানি নতুন করে আবিষ্কার করেন না; পদ্ধতি মানিয়ে নেন। Design pattern প্রচলিত design সমস্যার প্রমাণিত সমাধান।"],
    t: ["Patterns give a shared vocabulary: creational (factory, builder, singleton), structural (adapter, decorator, facade, proxy) and behavioural (strategy, observer, command, state). In interviews, name a pattern only when it solves a stated problem, and explain the trade-off. Also know modern equivalents: DI containers, middleware pipelines, events and records.", "Pattern একটি শেয়ার শব্দভান্ডার দেয়: creational (factory, builder, singleton), structural (adapter, decorator, facade, proxy) ও behavioural (strategy, observer, command, state)। Interview-এ শুধু তখনই pattern-এর নাম বলুন যখন তা উল্লেখিত সমস্যা সমাধান করে, আর trade-off ব্যাখ্যা করুন। আধুনিক সমতুল্যও জানুন: DI container, middleware pipeline, event ও record।"],
    p: [["State the problem in one sentence.", "এক বাক্যে সমস্যা বলুন।"], ["Pick the pattern that fits and say why.", "মানানসই pattern বেছে কারণ বলুন।"], ["Sketch the classes or code.", "Class বা code আঁকুন।"], ["Mention one downside or alternative.", "একটি অসুবিধা বা বিকল্প উল্লেখ করুন।"]],
    m: ["Pattern-matching every problem to a pattern; using names incorrectly (calling a facade an adapter); adding patterns that increase complexity without benefit.", "প্রতিটি সমস্যাকে কোনো pattern-এ মেলানো; নাম ভুলভাবে ব্যবহার (facade-কে adapter বলা); সুবিধা ছাড়া জটিলতা বাড়ানো pattern যোগ।"],
    q: ["Practice: 'Which patterns would you use for a document editor with undo, plugins and autosave?' Command (undo/redo), strategy or plugin interfaces (extensions), observer (autosave on changes), memento (snapshots).", "অনুশীলন: 'Undo, plugin ও autosave-সহ document editor-এ কোন pattern ব্যবহার করবেন?' Command (undo/redo), strategy বা plugin interface (বিস্তার), observer (পরিবর্তনে autosave), memento (snapshot)।"],
    f: ["AI frameworks are built from these patterns (adapters for providers, decorators for middleware, commands for tool calls). Recognising them lets you learn new AI SDKs quickly.", "AI framework এই pattern দিয়েই তৈরি (provider-এর জন্য adapter, middleware-এর জন্য decorator, tool call-এর জন্য command)। চিনতে পারলে নতুন AI SDK দ্রুত শিখতে পারবেন।"],
    x: [outline("Pattern cheat-sheet: problem -> pattern · সমস্যা থেকে pattern", "| Problem                                  | Pattern        | .NET example                         |\n|------------------------------------------|----------------|--------------------------------------|\n| Create the right object from config      | Factory        | keyed services                       |\n| Many optional settings                   | Builder        | WebApplication.CreateBuilder         |\n| Fit a vendor SDK to your interface       | Adapter        | AsIChatClient()                      |\n| Add logging/caching around a service     | Decorator      | DelegatingHandler, middleware        |\n| Simple front to a complex subsystem      | Facade         | application service                  |\n| Control access / lazy load               | Proxy          | EF Core lazy-loading proxies         |\n| React to changes                         | Observer       | events, IObservable<T>               |\n| Swap algorithms                          | Strategy       | IComparer<T>, pricing rules          |\n| Undo / queue actions                     | Command        | MediatR requests, tool calls         |\n| Behaviour depends on status              | State          | order state machine                  |")],
  },
};
