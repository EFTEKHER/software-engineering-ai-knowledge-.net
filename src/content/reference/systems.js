const data = {};
function add(key, en, bn, a, b, de, db) {
  data[key] = {
    en,
    bn,
    decisionEn: de,
    decisionBn: db,
    examples: [
      {
        title: "Worked system model · সিস্টেমের হিসাব ও code",
        language: "csharp",
        code: a,
        kind: "Teaching model",
      },
      {
        title: "Design alternative · বিকল্প ও ফল যাচাই",
        language: "csharp",
        code: b,
        kind: "Teaching model",
      },
    ],
  };
}
add(
  "Scalability",
  "Capacity is constrained by the narrowest stage, not by the number of API servers alone. Stateless request handling makes replicas easier to replace, but sessions, caches, database connections, and background work still impose shared limits. Vertical scaling changes one machine’s ceiling; horizontal scaling adds coordination and load-distribution requirements. Measure throughput within a latency/error goal.",
  "শুধু API server গুনে capacity নয়; সবচেয়ে সংকীর্ণ ধাপ সীমা দেয়। Stateless replica সহজ, কিন্তু session, cache, connection ও worker-এর shared সীমা থাকে। লক্ষ্য latency/error-এর মধ্যে throughput মাপুন।",
  `int replicas=4;
int perReplicaQps=250;
int databaseQps=700;
int apiCapacity=replicas*perReplicaQps;
int systemCapacity=Math.Min(apiCapacity,databaseQps);
Console.WriteLine($"API={apiCapacity}, system={systemCapacity}");
for(int n=1;n<=6;n++)
    Console.WriteLine($"{n} replicas -> {Math.Min(n*perReplicaQps,databaseQps)} qps");`,
  `double serialFraction=0.2;
for(int workers=1;workers<=8;workers*=2) {
    double idealSpeedup=1/(serialFraction+(1-serialFraction)/workers);
    Console.WriteLine($"Workers={workers}, ideal speedup={idealSpeedup:F2}");
}
// Amdahl-style model: coordination and I/O costs can lower real speedup.
// These are assumptions, not measured server capacity.`,
  "Scale the layer the evidence identifies. Removing a serial bottleneck or expensive query can outperform adding replicas and reduce operational cost.",
  "প্রমাণে ধরা বাধার স্তর বাড়ান। Serial কাজ বা খারাপ query ঠিক করা replica বাড়ানোর চেয়ে লাভজনক হতে পারে।",
);
add(
  "Load Balancing",
  "Selection policy and health policy are different responsibilities. Round robin distributes counts, not equal work; least-connections helps when connection lifetimes differ. Retries can amplify load and duplicate non-idempotent actions. Draining should stop new assignments while allowing existing work to finish within a deadline.",
  "কাকে পাঠাবেন ও কে healthy—দুই নিয়ম। Round robin সংখ্যা ভাগ করে, কাজের খরচ সমান নয়। Retry চাপ ও duplicate বাড়াতে পারে। Drain-এ নতুন কাজ বন্ধ করে পুরোনোকে সময় দিন।",
  `var nodes=new[]{new Node("a",true),new Node("b",false),new Node("c",true)};
var healthy=nodes.Where(n=>n.Healthy).ToArray();
if(healthy.Length==0)throw new InvalidOperationException("No healthy backend");
for(int request=0;request<8;request++)
    Console.WriteLine($"Request {request} -> {healthy[request%healthy.Length].Name}");
record Node(string Name,bool Healthy);`,
  `var active=new Dictionary<string,int>{{"a",5},{"b",2},{"c",7}};
for(int i=0;i<6;i++) {
    string selected=active.OrderBy(p=>p.Value).ThenBy(p=>p.Key).First().Key;
    active[selected]++;
    Console.WriteLine($"Assign -> {selected}, active={active[selected]}");
}
// Completion would decrement the count; synchronize real shared updates.`,
  "Health checks must reflect useful serving ability without depending on every optional downstream service. Overly broad health failures can remove all backends at once.",
  "Health check-এ আসল serving ক্ষমতা দেখুন, সব optional dependency নয়। বেশি কড়া check-এ সবাই একসাথে বাদ পড়তে পারে।",
);
add(
  "Caching",
  "Cache design chooses authority, key shape, freshness, invalidation, and miss behavior. Hit ratio alone can hide expensive misses or stale-data bugs. The key must include every input that changes the cached response, especially tenant and permission scope. Eviction is normal and must not destroy authoritative business state.",
  "Authority, key, freshness, invalidation ও miss policy ঠিক করুন। শুধু hit ratio সব বলে না। Tenant বা permission-এ response বদলালে key-তেও ধরুন। Eviction স্বাভাবিক; cache-এ আসল একমাত্র record নয়।",
  `var cache=new Dictionary<string,(string Value,DateTimeOffset Expires)>();
string key="tenant:1:product:42";
DateTimeOffset now=DateTimeOffset.UtcNow;
cache[key]=("Tea",now.AddSeconds(30));
bool Hit(string k,DateTimeOffset time,out string? value) {
    if(cache.TryGetValue(k,out var entry)&&entry.Expires>time){value=entry.Value;return true;}
    value=null;return false;
}
Console.WriteLine(Hit(key,now,out var current));
Console.WriteLine(Hit(key,now.AddMinutes(1),out _));`,
  `int requests=1000,hits=900;
double cacheMs=1,originMs=80;
double mean=(hits*cacheMs+(requests-hits)*(cacheMs+originMs))/requests;
Console.WriteLine($"Hit ratio={(double)hits/requests:P0}, model mean={mean:F1}ms");
Console.WriteLine("A p99 request may still pay the full origin cost.");
// Measure tail latency and source amplification, not only average hit rate.`,
  "Use TTL as a bounded-staleness mechanism only when its assumptions hold. Strict post-write freshness needs stronger coordination or bypass/version rules.",
  "TTL-এর সীমার ধারণা ঠিক থাকলেই staleness বোঝায়। Write-এর পরে কঠোর freshness-এ version/bypass বা coordination লাগে।",
);
add(
  "CDN",
  "An edge cache’s key and cache policy decide which users can share a response. Versioned immutable assets are easier to cache safely than personalized API output. A purge propagates through a provider mechanism and is not a universal instantaneous deletion guarantee. Origin protection prevents clients bypassing edge controls to overload private storage or servers.",
  "Cache key ও policy ঠিক করে কারা একই response ভাগ করবে। Versioned static asset ব্যক্তিগত API-এর চেয়ে সহজ। Purge সব জায়গায় তৎক্ষণাৎ মুছার নিশ্চয়তা নয়। Origin bypass ঠেকানোও দরকার।",
  `string BuildAssetUrl(string contentHash,string file)=>$"/assets/{contentHash}/{file}";
string oldUrl=BuildAssetUrl("a1b2","app.js");
string newUrl=BuildAssetUrl("c3d4","app.js");
Console.WriteLine(oldUrl);
Console.WriteLine(newUrl);
Console.WriteLine(oldUrl==newUrl);
// New content gets a new URL; older clients can still fetch their old bundle.`,
  `// ASP.NET Core cache-header integration fragment for immutable public assets.
app.MapGet("/assets/v1/guide.txt",(HttpContext context)=>{
    context.Response.Headers.CacheControl="public,max-age=31536000,immutable";
    return Results.Text("Version 1 public guide");
});
// Do not use this policy for private responses or mutable same-URL content.
// Deploy referenced assets before publishing the HTML that names them.`,
  "Coordinate HTML cache lifetime with asset retention. Deleting old hashed assets immediately can break visitors using an older cached page.",
  "HTML cache ও asset retention মিলান। পুরোনো hashed asset সঙ্গে মুছলে cached page-এর visitor ভাঙতে পারে।",
);
add(
  "Blob Storage",
  "Objects are addressed by keys and carry metadata; they are not mutable blocks in a local filesystem. Large uploads may need multipart lifecycle management and cleanup. A database record can track object ownership and validation state, but object storage and database writes are usually not one atomic transaction. Plan orphaned-object reconciliation.",
  "Object key ও metadata দিয়ে থাকে, local filesystem-এর block নয়। বড় upload-এ multipart cleanup লাগে। DB ownership রাখে, কিন্তু DB ও object write এক atomic transaction নয়; orphan মিলানোর কাজ রাখুন।",
  `record StoredObject(string Key,long Bytes,string Owner,string State);
var pending=new StoredObject($"uploads/{Guid.NewGuid():N}",2048,"user-1","Pending");
Console.WriteLine(pending);
var ready=pending with {State="Verified"};
bool DownloadAllowed(StoredObject item,string user)=>item.Owner==user&&item.State=="Verified";
Console.WriteLine(DownloadAllowed(ready,"user-1"));
Console.WriteLine(DownloadAllowed(ready,"user-2"));`,
  `var objectKeys=new HashSet<string>{"a","b","c"};
var referencedKeys=new HashSet<string>{"a","b"};
var candidates=objectKeys.Except(referencedKeys).ToArray();
Console.WriteLine(string.Join(",",candidates));
// Reconciliation must also check age, active uploads, and retention policy.
// Never delete immediately from one eventually incomplete listing.`,
  "Use generated keys, content validation, and least-privilege access. Do not assume that a random-looking key is an authorization mechanism.",
  "Generated key, validation ও permission দিন। Random key-ই authorization নয়।",
);
add(
  "API Gateway",
  "Gateways centralize routing and selected cross-cutting edge policies while services retain domain authorization and business rules. Timeouts should shrink along the call path rather than allowing each hop to wait forever. A gateway needs its own availability/capacity design and safe handling of forwarded identity/header information.",
  "Gateway route ও edge policy রাখে, business rule service-এ। Call path-এ timeout budget ভাগ করুন। Gateway-এর নিজস্ব availability ও forwarded identity/header trust-এর নিয়ম দরকার।",
  `var routes=new Dictionary<string,Uri> {
    ["orders"]=new("https://orders.example.com"),
    ["catalog"]=new("https://catalog.example.com")
};
Uri Resolve(string service,string relativePath) {
    if(!routes.TryGetValue(service,out var origin))throw new ArgumentException("Service");
    if(!relativePath.StartsWith('/'))throw new ArgumentException("Path");
    return new Uri(origin,relativePath);
}
Console.WriteLine(Resolve("orders","/orders/42"));`,
  `TimeSpan requestBudget=TimeSpan.FromSeconds(2);
TimeSpan gatewayOverhead=TimeSpan.FromMilliseconds(50);
TimeSpan downstreamBudget=requestBudget-gatewayOverhead;
Console.WriteLine(downstreamBudget);
using var deadline=new CancellationTokenSource(downstreamBudget);
await Task.Delay(10,deadline.Token);
// Real reverse proxies must propagate cancellation and sanitize trusted headers.`,
  "Do not let a generic route resolver become an arbitrary URL fetch proxy. Use a maintained reverse proxy and constrained route configuration in production.",
  "Route resolver-কে arbitrary URL proxy বানাবেন না। Production-এ maintained reverse proxy ও সীমিত config নিন।",
);
add(
  "Replication",
  "Replicas replay changes through a protocol with a particular acknowledgment and visibility policy. Read replicas increase capacity only for queries that can tolerate their visibility guarantees. Failover needs leadership/fencing to prevent two writers believing they are primary. Backups preserve recovery points that replication alone does not provide.",
  "Replica protocol অনুযায়ী change কপি করে। Lag মানতে পারা read-এ replica সুবিধা। Failover-এ দুই primary ঠেকাতে leadership/fencing লাগে। Replication ভুল delete-ও ছড়ায়, তাই backup আলাদা।",
  `long primaryVersion=100,replicaVersion=97;
long requiredVersion=99;
string ChooseRead()=>replicaVersion>=requiredVersion?"replica":"primary";
Console.WriteLine(ChooseRead());
replicaVersion=100;
Console.WriteLine(ChooseRead());
// Version-aware routing is a model, not a universal provider feature.`,
  `var nodes=new[]{("zone-a",true), ("zone-b",false), ("zone-c",true)};
int quorum=nodes.Length/2+1;
int reachable=nodes.Count(n=>n.Item2);
Console.WriteLine($"reachable={reachable}, quorum={quorum}");
Console.WriteLine(reachable>=quorum?"Quorum possible":"Refuse unsafe write");
// Actual consensus includes terms, logs, and fencing, not just counting nodes.`,
  "Read-after-write behavior must be designed. Sending a user immediately to a lagging replica can appear to lose a successful update.",
  "Write-এর পরে lagging replica-এ পাঠালে সফল কাজ হারিয়েছে মনে হতে পারে। Read-your-writes rule দিন।",
);
add(
  "Database Sharding",
  "A shard key determines locality, load distribution, and cross-shard work. Tenant-based keys simplify tenant-local transactions but can create a hot large tenant. Hashing spreads keys but complicates range queries. Resharding requires routing version, data movement, duplicate/missing-write handling, and a cutover plan.",
  "Shard key locality ও চাপ ঠিক করে। Tenant key-তে local transaction সহজ, বড় tenant hot হতে পারে। Hash ছড়ায় কিন্তু range query কঠিন। Reshard-এ route version, data move ও cutover চাই।",
  `int ShardFor(long tenant,int count) {
    if(tenant<0||count<=0)throw new ArgumentOutOfRangeException();
    return (int)(tenant%count);
}
long[] tenants={1,2,3,4,1001};
foreach(long t in tenants)
    Console.WriteLine($"Tenant {t} -> {ShardFor(t,4)}");
Console.WriteLine($"Changing 4 to 5 remaps tenant 4: {ShardFor(4,5)}");`,
  `var directory=new Dictionary<long,string>{{1,"shard-a"},{2,"shard-a"},{1001,"shard-b"}};
string Locate(long tenant)=>directory.TryGetValue(tenant,out var shard)?shard:throw new KeyNotFoundException();
Console.WriteLine(Locate(1001));
directory[1001]="shard-c";
Console.WriteLine(Locate(1001));
// Directory update alone is not data migration; coordinate copying and writes.`,
  "Shard after simpler query/index/capacity approaches are evaluated. Cross-shard uniqueness, transactions, joins, and restore are ongoing costs.",
  "সহজ index/query/capacity উপায় দেখে তারপর shard। Cross-shard join, unique ও restore-এর খরচ স্থায়ী।",
);
add(
  "Consistent Hashing",
  "A hash ring maps each key to a clockwise owner. Adding a node changes ownership only for ranges that now reach it first. Virtual nodes improve distribution across unequal positions. Stable hashing must be specified across processes and versions; runtime-randomized string hashes are unsuitable for persisted routing.",
  "Ring-এ key থেকে পরের owner নিন। নতুন node-এ পাশের কিছু range বদলায়। Virtual node balance বাড়ায়। Process ও version-এ একই hash চাই; runtime string hash স্থায়ী routing নয়।",
  `using System.Security.Cryptography;
using System.Text;
ulong Hash(string text)=>System.Buffers.Binary.BinaryPrimitives.ReadUInt64BigEndian(SHA256.HashData(Encoding.UTF8.GetBytes(text)));
var ring=new SortedDictionary<ulong,string>();
foreach(string node in new[]{"a","b","c"})
    for(int v=0;v<4;v++)ring[Hash($"{node}:{v}")]=node;
string Owner(string key) {
    ulong h=Hash(key);
    foreach(var point in ring)if(point.Key>=h)return point.Value;
    return ring.First().Value;
}
foreach(string key in new[]{"tea","milk","rice"})Console.WriteLine($"{key} -> {Owner(key)}");`,
  `int[] positions={20,50,90};
int Owner(int key)=>positions.FirstOrDefault(p=>p>=key,positions[0]);
foreach(int key in new[]{5,25,60,95})Console.WriteLine($"{key} -> {Owner(key)}");
positions=new[]{20,50,70,90};
Console.WriteLine($"60 after adding 70 -> {Owner(60)}");
// A real change also transfers data and preserves replica/consistency rules.`,
  "Virtual nodes do not eliminate hot keys. Membership changes need a versioned operational protocol, not merely replacing an in-memory node array.",
  "Virtual node hot key সরায় না। Membership বদলাতে data ও version-এর বাস্তব protocol দরকার।",
);
add(
  "Kafka and Pub / Sub",
  "Kafka retains records in ordered partitions. A consumer group assigns each partition to a group member at a time, while another group reads independently. Ordering is partition-local; key choice influences it. Offsets are progress markers, and committing before versus after effects changes loss/duplication risk. Retention is independent from ordinary consumption.",
  "Kafka partition-এ ক্রম রাখে। একটি group-এর partition ভাগ হয়, অন্য group আলাদা পড়ে। Key ordering scope ঠিক করে। Offset effect-এর আগে না পরে commit করবেন তাতে loss/duplicate বদলায়। Consume করলেই log মুছে না।",
  `var records=new[]{new Event("order-1","Created"),new Event("order-2","Created"),new Event("order-1","Paid")};
var partitions=new Dictionary<int,List<Event>>{{0,new()},{1,new()}};
int Partition(string key)=>key.EndsWith("1")?0:1;
foreach(var e in records)partitions[Partition(e.Key)].Add(e);
foreach(var p in partitions) {
    Console.WriteLine($"Partition {p.Key}");
    foreach(var e in p.Value)Console.WriteLine($"{e.Key}:{e.Kind}");
}
record Event(string Key,string Kind);`,
  `long committedOffset=10;
var processed=new HashSet<long>();
foreach(long offset in new long[]{11,12,12,13}) {
    if(processed.Add(offset))Console.WriteLine($"Effect for {offset}");
    committedOffset=Math.Max(committedOffset,offset);
}
Console.WriteLine(committedOffset);
// Model only; real offsets are per partition and effects need durable dedup.`,
  "A consumer rebalance changes ownership and can expose in-flight work races. Keep processing, offset policy, and graceful shutdown coordinated.",
  "Rebalance-এ ownership বদলে চলমান কাজের race হতে পারে। Processing, offset ও shutdown একসাথে সামলান।",
);
add(
  "Event-Driven Architecture",
  "Events describe completed facts and should carry enough identity/version information for independent consumers. An outbox records the business update and pending publication atomically in one database. A dispatcher later publishes and may repeat, so consumers still need idempotency. Schema evolution must preserve consumer meaning, not merely JSON parse success.",
  "Event ঘটে যাওয়া সত্য; id ও version দিয়ে বোঝা যায়। Outbox business update ও প্রকাশের record একই DB transaction-এ রাখে। Dispatcher আবার পাঠাতে পারে, তাই consumer-এ idempotency। JSON parse হলেই semantic compatibility নয়।",
  `record OrderPlaced(Guid EventId,Guid OrderId,int Version,DateTimeOffset At);
var orderId=Guid.NewGuid();
var evt=new OrderPlaced(Guid.NewGuid(),orderId,1,DateTimeOffset.UtcNow);
string payload=System.Text.Json.JsonSerializer.Serialize(evt);
Console.WriteLine(payload);
// Integration: save order + payload in one database transaction.
// A separate publisher claims unsent outbox rows in bounded batches.`,
  `var consumed=new HashSet<Guid>();
Guid id=Guid.NewGuid();
foreach(Guid eventId in new[]{id,id,Guid.NewGuid()}) {
    if(!consumed.Add(eventId)){Console.WriteLine("Duplicate");continue;}
    Console.WriteLine("Update projection");
}
// Durable consumers commit dedup identity and projection change together.
// Events should use past-tense facts, not arbitrary executable instructions.`,
  "Avoid circular event chains and invisible synchronous assumptions. Document which views are eventually consistent and how users observe completion.",
  "Circular event chain ও লুকানো synchronous ধারণা নয়। কোন view পরে মেলে ও user কীভাবে completion জানবে লিখুন।",
);
add(
  "Microservices",
  "A service boundary should align with a business capability and data ownership, not one database table. Independence requires deployable contracts, compatible changes, and operational ownership. Network calls introduce latency, timeouts, partial failure, and uncertain outcomes. A modular monolith may provide the same code separation with fewer distributed costs.",
  "Service boundary table অনুযায়ী নয়, business capability ও data ownership অনুযায়ী। Network-এ latency, timeout ও partial failure আসে। শুধু code আলাদা চাইলে modular monolith কম খরচে হতে পারে।",
  `using var client=new HttpClient {BaseAddress=new Uri("https://catalog.example.com"),Timeout=TimeSpan.FromSeconds(2)};
using var stop=new CancellationTokenSource(TimeSpan.FromSeconds(1));
try {
    using var response=await client.GetAsync("/products/42",stop.Token);
    Console.WriteLine((int)response.StatusCode);
} catch(OperationCanceledException) {
    Console.WriteLine("Deadline reached; remote outcome may be unknown");
}
// ASP.NET Core services should configure IHttpClientFactory and resilience.`,
  `record Contract(string Service,string Owner,string Data,string Version);
var contracts=new[]{new Contract("Orders","Checkout team","orders","v1"),new Contract("Catalog","Catalog team","products","v1")};
foreach(var c in contracts)Console.WriteLine(c);
// Do not join service-owned databases directly as an undocumented shortcut.
// Define API/events and an explicit consistency requirement instead.
Console.WriteLine("Ownership and compatibility are part of the boundary");`,
  "Avoid distributed transactions unless their cost is justified. Use local invariants, outbox events, and carefully designed compensation for cross-service workflows.",
  "যথার্থ দরকার ছাড়া distributed transaction নয়। Local invariant, outbox ও compensation দিয়ে সীমা বোঝান।",
);
add(
  "Rate Limiter Design",
  "Fixed windows can allow a burst at both sides of a boundary. Sliding logs are precise but retain per-request timestamps. Token buckets combine a refill rate with bounded burst capacity. The state transition must be atomic per partition and clocks must be handled consistently. Identity cardinality itself can become a memory attack.",
  "Fixed window-এর দুই প্রান্তে burst হতে পারে। Sliding log timestamp রাখে। Token bucket refill ও burst আলাদা দেয়। Per-key update atomic চাই; অগণিত identity-ও memory খরচ বাড়ায়।",
  `double tokens=0,capacity=5,rate=2,last=0;
bool Allow(double now) {
    tokens=Math.Min(capacity,tokens+Math.Max(0,now-last)*rate);last=now;
    if(tokens<1)return false;
    tokens--;return true;
}
foreach(double at in new[]{0.0,0.5,0.5,1.0,4.0,4.0})
    Console.WriteLine($"t={at}: {Allow(at)}");
// Sequential simulation: protect the entire update atomically in real code.`,
  `var timestamps=new Queue<double>();
int limit=3;double window=10;
bool Allow(double now) {
    while(timestamps.Count>0&&timestamps.Peek()<=now-window)timestamps.Dequeue();
    if(timestamps.Count>=limit)return false;
    timestamps.Enqueue(now);return true;
}
foreach(double t in new[]{0.0,1.0,2.0,3.0,10.1})Console.WriteLine($"{t}: {Allow(t)}");`,
  "Choose quota-store failure behavior intentionally. Fail-open preserves availability but can exceed budget; fail-closed protects capacity but can deny healthy users.",
  "Quota store fail-এ open নাকি closed ঠিক করুন। প্রথমটি budget ছাড়ায়, দ্বিতীয়টি ভাল user আটকাতে পারে।",
);
add(
  "CAP Theorem",
  "CAP concerns a partitioned distributed system under precise definitions of consistency and availability. Linearizable consistency requires operations to appear in one real-time-respecting order. During partition some nodes cannot coordinate; accepting all operations can violate that guarantee, while rejecting some operations violates CAP availability. This is not a general monthly uptime ranking.",
  "CAP বিশেষ সংজ্ঞায় partition-এর সময়ের সীমা। Linearizability-তে real-time মেনে এক order লাগে। বিচ্ছিন্ন node coordinate না করতে পারলে সব কাজ নিলে সেই নিশ্চয়তা ভাঙে, কিছু না নিলে CAP availability ভাঙে।",
  `bool reachableMajority=false;
string DecideWrite(bool requireLinearizable)=>
    requireLinearizable&&!reachableMajority?"Reject/timeout":"Accept locally with weaker guarantee";
Console.WriteLine(DecideWrite(true));
Console.WriteLine(DecideWrite(false));
// Policy illustration; actual replication/consensus protocols do more than this check.`,
  `var replicaA=new Dictionary<string,int>{{"stock",1}};
var replicaB=new Dictionary<string,int>{{"stock",1}};
replicaA["stock"]--;replicaB["stock"]--;
Console.WriteLine($"A={replicaA["stock"]}, B={replicaB["stock"]}");
Console.WriteLine("Both sold the same last item during isolation.");
// Identical final counters do not prove the business invariant was preserved.`,
  "State which operation and consistency model are under discussion. A system can make different choices for inventory writes and recommendation reads.",
  "কোন operation ও consistency নিয়ে কথা তা বলুন। Stock write ও recommendation read-এ আলাদা সিদ্ধান্ত হতে পারে।",
);
add(
  "PACELC Theorem",
  "PACELC highlights normal-operation trade-offs as well as partitions. Even without failure, coordinating distant replicas can increase latency to strengthen consistency. Local reads may be fast but stale; quorum reads have costs that depend on placement, protocol, and failure state. Product requirements determine which guarantee is useful.",
  "Partition না থাকলেও দূরের কপি মিলিয়ে উত্তর দিতে latency বাড়ে। Local read দ্রুত কিন্তু পুরোনো হতে পারে। Quorum-এর খরচ অবস্থান ও protocol-নির্ভর। Product কোন নিশ্চয়তা চায়, তা আগে বলুন।",
  `double localMs=2,regionalRttMs=30;
double coordinatedMs=localMs+regionalRttMs;
Console.WriteLine($"Local model={localMs}ms");
Console.WriteLine($"Coordinated model={coordinatedMs}ms");
Console.WriteLine("Numbers are explicit assumptions, not service benchmarks.");`,
  `record ReadPolicy(string Name,bool MayBeStale,double AssumedMs);
var policies=new[]{new ReadPolicy("Local",true,2),new ReadPolicy("Coordinated",false,32)};
foreach(var p in policies)Console.WriteLine(p);
// 'false' is the intended contract in this toy comparison, not a proof.
// Verify the provider's real consistency mode and failure semantics.`,
  "Do not assign one latency/consistency label to every operation of a database product. Configuration and request-level options can change behavior.",
  "এক database product-এর সব কাজকে একই label দেবেন না। Config ও request option-এ চুক্তি বদলাতে পারে।",
);
add(
  "Consistency Models",
  "Different models constrain observable histories differently. Read-your-writes ensures a client can see its successful update; monotonic reads prevent that client moving backward. Eventual consistency alone need not guarantee either in every request path. Linearizability is stronger than simply reading a replica that looks recent by wall-clock timestamp.",
  "Read-your-writes নিজের write দেখা, monotonic read আগের চেয়ে পিছিয়ে না যাওয়া। Eventual একা দুটো নিশ্চয়তা সবসময় দেয় না। সাম্প্রতিক timestamp দেখেই linearizable বলা যায় না।",
  `long lastSeen=5;
long[] replicaVersions={4,6,5,7};
foreach(long version in replicaVersions) {
    if(version<lastSeen){Console.WriteLine($"Reject stale {version}");continue;}
    lastSeen=version;Console.WriteLine($"Accept {version}");
}
// A version-token model for monotonic observation.`,
  `long successfulWrite=12;
var replicas=new[]{(Name:"near",Version:10),(Name:"far",Version:12)};
var eligible=replicas.Where(r=>r.Version>=successfulWrite).ToArray();
foreach(var replica in eligible)Console.WriteLine($"Read from {replica.Name}");
// Real storage must provide a meaningful version/visibility token.
// Client timestamps alone are not a safe substitute.`,
  "Define guarantees by user workflow, not vague strong/weak labels. Test stale reads during failover and cross-region routing.",
  "Strong/weak-এর অস্পষ্ট নাম নয়, user workflow অনুযায়ী rule দিন। Failover ও region বদলে stale read test করুন।",
);
add(
  "Bloom Filter",
  "A Bloom filter sets several bit positions per inserted item. If any required bit is zero, the item is definitely absent; if all are one, it may be present. False-positive rate grows with saturation. Standard filters cannot delete by clearing shared bits without risking false negatives. Always consult authoritative storage on a possible hit when correctness matters.",
  "প্রতি item কয়েক bit set করে। একটি bit শূন্য হলে নেই নিশ্চিত; সব এক হলে থাকতে পারে। বেশি ভরলে false positive বাড়ে। Shared bit মুছে delete করলে ভুল না আসে; সম্ভবত আছে বললে আসল store দেখুন।",
  `using System.Collections;
var bits=new BitArray(64);
int H1(int x)=>(int)((uint)x%64);
int H2(int x)=>(int)(((uint)x*17u+7u)%64);
void Add(int x){bits[H1(x)]=true;bits[H2(x)]=true;}
bool Maybe(int x)=>bits[H1(x)]&&bits[H2(x)];
Add(42);Add(7);
Console.WriteLine(Maybe(42));
Console.WriteLine(Maybe(106)); // collision in this deliberately tiny example
// Production filters use validated hash choices and sizing.`,
  `double m=10000,n=1000,k=7;
double estimatedFalsePositive=Math.Pow(1-Math.Exp(-k*n/m),k);
Console.WriteLine($"Estimated rate: {estimatedFalsePositive:P3}");
double nearOptimalK=(m/n)*Math.Log(2);
Console.WriteLine($"Near-optimal hash count: {nearOptimalK:F2}");
// Model assumes suitable independent uniform hashes.`,
  "A false positive is acceptable only when the follow-up check preserves correctness. Never use a Bloom maybe-result alone to grant access or skip a required write.",
  "Follow-up যাচাই correctness রাখলেই false positive মানা যায়। Maybe ফল দিয়ে permission বা জরুরি write বাদ নয়।",
);
add(
  "Circuit Breaker",
  "A breaker tracks recent dependency health and rejects calls while open. Half-open probes determine whether recovery is credible. Thresholds can use ratios and sampling windows rather than one fixed count. A breaker is separate from timeout, retry, and bulkhead policy; ordering them changes observed failures and load.",
  "Breaker dependency health দেখে, open-এ call ফিরিয়ে দেয়। Half-open probe recovery দেখে। Timeout, retry ও bulkhead আলাদা; তাদের ক্রমে failure count ও চাপ বদলায়।",
  `int failures=0;DateTimeOffset? openUntil=null;
bool CanCall(DateTimeOffset now)=>openUntil is null||now>=openUntil;
void Failed(DateTimeOffset now){if(++failures>=3)openUntil=now.AddSeconds(30);}
var now=DateTimeOffset.UtcNow;
Failed(now);Failed(now);Failed(now);
Console.WriteLine(CanCall(now));
Console.WriteLine(CanCall(now.AddSeconds(31)));
// Simplified timing model: production also coordinates half-open probe concurrency.`,
  `int originalRequests=100,retries=3;
int worstCaseAttempts=originalRequests*(1+retries);
Console.WriteLine($"Potential calls without a breaker: {worstCaseAttempts}");
int admittedBeforeOpen=20;
Console.WriteLine($"Fast-rejected after open: {originalRequests-admittedBeforeOpen}");
// Use measured failure windows and a maintained resilience implementation.`,
  "Do not repeatedly probe with every waiting request. Limit half-open attempts and observe recovery without turning the outage into a synchronized retry storm.",
  "সব অপেক্ষমান request দিয়ে probe নয়। Half-open সীমা ও jitter দিয়ে recovery দেখুন, retry storm নয়।",
);
add(
  "Saga Pattern",
  "A saga records progress across local transactions and invokes compensation when later work fails. Compensation is a business action such as refunding, not rolling time backward. It can itself fail and need retries or manual intervention. Persistent correlation, step identity, and idempotency are necessary for recovery after a coordinator crash.",
  "Saga স্থানীয় transaction-এর progress রাখে। Compensation refund-এর মতো নতুন কাজ, সময় উল্টানো নয়। সেটিও ব্যর্থ হয়, retry/manual recovery লাগে। Correlation, step id ও durable state crash-এর পর কাজ ধরতে সাহায্য করে।",
  `var completed=new Stack<string>();
var compensation=new Dictionary<string,string>{{"reserve","release stock"},{"charge","refund payment"}};
try {
    foreach(string step in new[]{"reserve","charge","confirm"}) {
        if(step=="confirm")throw new Exception("Confirmation unavailable");
        completed.Push(step);Console.WriteLine($"Done {step}");
    }
} catch(Exception) {
    while(completed.TryPop(out string? step))Console.WriteLine(compensation[step]);
}
// Persist real progress and compensation outcomes; this stack is memory only.`,
  `record SagaStep(Guid SagaId,string Name,string Status,int Attempt);
Guid id=Guid.NewGuid();
var steps=new[]{new SagaStep(id,"reserve","Succeeded",1),new SagaStep(id,"charge","Compensating",2)};
foreach(var step in steps)Console.WriteLine(step);
Console.WriteLine("A failed compensation remains visible for retry/review.");
// Recovery must not silently label an incomplete saga as successful.`,
  "Choose orchestration for explicit coordination or choreography for decoupled reactions, while accounting for observability and circular-event risks.",
  "Orchestration-এ কেন্দ্রের progress স্পষ্ট, choreography-তে event আলাদা। দুইটির observability ও cycle ঝুঁকি ভাবুন।",
);
add(
  "Back-of-the-Envelope Estimation",
  "Estimation begins with named assumptions and units. Convert active users and actions into average/peak request rates; multiply write volume by record size, retention, replicas, and index overhead. Little’s law estimates concurrent work for a stable system from rate times response time. These models guide testing rather than replacing load measurements.",
  "ধারণা ও unit লিখে শুরু করুন। User ও কাজ থেকে average/peak QPS; record size, retention, replica ও index দিয়ে storage। Stable অবস্থায় rate×সময় concurrency। এই হিসাব test বাছতে সাহায্য করে, মাপার বিকল্প নয়।",
  `double users=1_000_000,actions=20,peakFactor=6;
double averageQps=users*actions/86400;
double peakQps=averageQps*peakFactor;
double responseSeconds=0.2;
double concurrent=peakQps*responseSeconds;
Console.WriteLine($"Average={averageQps:F0}, peak={peakQps:F0} qps");
Console.WriteLine($"Stable average in-flight at peak assumption={concurrent:F0}");`,
  `double writesPerDay=2_000_000,bytesPerRecord=1024,days=30;
double replicas=3,indexFactor=1.5;
double total=writesPerDay*bytesPerRecord*days*replicas*indexFactor;
Console.WriteLine($"Storage model: {total/Math.Pow(1024,4):F2} TiB");
Console.WriteLine($"Average write bandwidth: {writesPerDay*bytesPerRecord/86400:F0} bytes/s");
// Add backups, compaction, retention bursts, and safe operating headroom.`,
  "Avoid false precision. Show a range and sensitivity to the largest assumptions, then validate the risky stage with a representative load test.",
  "অতিরিক্ত নির্ভুল সংখ্যা নয়। বড় ধারণা বদলালে range কী হয় দেখান, তারপর ঝুঁকির ধাপে load test।",
);
export default data;
