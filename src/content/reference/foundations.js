const data = {};
function add(key, en, bn, a, b, de, db) {
  data[key] = {
    en,
    bn,
    decisionEn: de,
    decisionBn: db,
    examples: [
      {
        title: "Engineering example · বড় engineering উদাহরণ",
        language: "csharp",
        code: a,
        kind: "Console example",
      },
      {
        title: "Compare and verify · বিকল্প তুলনা ও যাচাই",
        language: "csharp",
        code: b,
        kind: "Console example",
      },
    ],
  };
}
add(
  "All Data Structures",
  "Select a structure by its dominant operations and required invariants. Lists offer compact indexed storage; dictionaries offer expected keyed lookup; sorted sets support ordered uniqueness; queues preserve arrival order. The same application can use several structures for different purposes. Big-O ignores constants, locality, and allocation, which can dominate small or memory-sensitive workloads.",
  "কোন কাজ বেশি ও কী invariant চাই তা দেখে structure নিন। List index, dictionary key, sorted set ordered unique, queue আগমনের ক্রম দেয়। এক অ্যাপেই কয়েকটি লাগে। Big-O-র বাইরে locality ও allocation-ও মাপুন।",
  `var byId=new Dictionary<int,string>{{1,"Tea"},{2,"Milk"}};
var arrival=new Queue<int>();arrival.Enqueue(2);arrival.Enqueue(1);
var served=new HashSet<int>();
while(arrival.TryDequeue(out int id)) {
    if(served.Add(id)&&byId.TryGetValue(id,out string? name))Console.WriteLine(name);
}
Console.WriteLine($"Distinct served={served.Count}");`,
  `var values=new List<int>{5,2,5,1};
var ordered=new SortedSet<int>(values);
Console.WriteLine(string.Join(",",ordered));
Console.WriteLine(ordered.Contains(2));
Console.WriteLine(values[0]);
// SortedSet uniqueness and List position are distinct contracts.
Console.WriteLine($"List={values.Count}, set={ordered.Count}");`,
  "Benchmark the real mix of reads, inserts, and deletes with realistic data. A structure optimized for one operation may make another expensive.",
  "বাস্তব read/insert/delete অনুপাত দিয়ে benchmark করুন। এক কাজে ভালো structure অন্য কাজে খরচ বাড়াতে পারে।",
);
add(
  "Advanced Algorithms",
  "Algorithm design begins with constraints and correctness, then chooses exact, approximate, online, or offline strategies. Preprocessing can trade extra memory and initial work for faster repeated queries. Amortized bounds describe total sequence cost rather than one worst operation. Counterexamples and a brute-force oracle are valuable when developing an optimized solution.",
  "সীমা ও সঠিকতা আগে। Preprocessing প্রথমে খরচ দিয়ে পরের query দ্রুত করে। Amortized মোট sequence-এর হিসাব। Optimized algorithm-এর আগে ছোট brute-force oracle দিয়ে মিলিয়ে দেখুন।",
  `int BruteMax(int[] a,int k) {
    int best=int.MinValue;
    for(int i=0;i+k<=a.Length;i++) {
        int sum=0;for(int j=0;j<k;j++)sum+=a[i+j];
        best=Math.Max(best,sum);
    }
    return best;
}
Console.WriteLine(BruteMax(new[]{2,1,5,1,3},3));`,
  `int[] values={5,1,3,2,4};
int[] sorted=values.OrderBy(x=>x).ToArray();
foreach(int target in new[]{1,3,6}) {
    bool baseline=values.Contains(target);
    bool optimized=Array.BinarySearch(sorted,target)>=0;
    if(baseline!=optimized)throw new Exception("Mismatch");
}
Console.WriteLine("Oracle comparisons passed");`,
  "Compare complexity including preprocessing and output size. A faster single query may not justify an index used only once.",
  "Preprocessing ও output-এর খরচও ধরুন। একবারের query-তে বড় index বানানো লাভ নাও দিতে পারে।",
);
add(
  "System Design Fundamentals",
  "Write the requirements, invariants, traffic assumptions, failure tolerance, and cost constraints before naming technologies. Trace a write and a read through the smallest coherent design. Every cache, replica, queue, and service should answer a named problem. Define measurable success with latency, error, availability, and recovery targets.",
  "Technology নামের আগে চাহিদা, invariant, traffic, failure ও খরচ লিখুন। ছোট নকশায় এক write ও read-এর পথ দেখান। প্রতিটি cache/queue কেন লাগবে বলুন। মাপা যায় এমন latency ও recovery লক্ষ্য দিন।",
  `record Requirement(string Name,string Target);
var requirements=new[]{new Requirement("Read latency","p95 < 200ms"),new Requirement("Write correctness","No duplicate payment"),new Requirement("Recovery","Tested restore path")};
foreach(var r in requirements)Console.WriteLine($"{r.Name}: {r.Target}");
double rate=500,averageSeconds=0.1;
Console.WriteLine($"Stable in-flight estimate: {rate*averageSeconds}");`,
  `var stages=new[]{("API",1000), ("Database",600), ("External service",300)};
var limiting=stages.MinBy(x=>x.Item2);
Console.WriteLine($"Bottleneck model: {limiting.Item1}, {limiting.Item2} ops/s");
Console.WriteLine("Verify with representative load before adding infrastructure.");
// Each stage's capacity is an explicit assumption for this exercise.
// Add failure and recovery paths to the same diagram.`,
  "A diagram without data ownership and failure semantics is incomplete. Explain which state is authoritative and what a timed-out caller may safely do next.",
  "Data owner ও failure semantics ছাড়া diagram অসম্পূর্ণ। Timeout-এর পরে caller কী নিরাপদে করবে বলুন।",
);
add(
  "Distributed Systems",
  "The network does not provide a perfect failure detector. A missing response can mean slow service, lost message, partition, or completed work with lost acknowledgment. Exactly-once effects require a carefully defined boundary. Idempotency, deadlines, conditional writes, and durable progress are common tools, each with a cost and limited guarantee.",
  "উত্তর না এলে ধীর, message হারানো, partition বা কাজ শেষ কিন্তু reply হারানো—সব সম্ভব। Exactly-once-এর boundary স্পষ্ট চাই। Idempotency, deadline ও durable state আলাদা সীমার নিশ্চয়তা দেয়।",
  `var results=new Dictionary<string,string>();
string Process(string id) {
    if(results.TryGetValue(id,out string? old))return old;
    string outcome=$"accepted:{id}";
    results[id]=outcome;return outcome;
}
Console.WriteLine(Process("request-1"));
Console.WriteLine(Process("request-1"));
// Local dedup model; durable concurrent processing requires atomic storage.`,
  `using var stop=new CancellationTokenSource(TimeSpan.FromMilliseconds(30));
try {await Task.Delay(100,stop.Token);}
catch(OperationCanceledException){Console.WriteLine("Deadline reached");}
Console.WriteLine("A timeout alone does not prove a remote side effect did not happen.");
// Resolve uncertain outcomes by request ID or a status endpoint.
// Retry only under an idempotent operation contract.`,
  "Use clocks for appropriate purposes: elapsed timing differs from global ordering. Wall-clock timestamps alone do not establish causality or leadership.",
  "Elapsed time আর global order আলাদা। Wall-clock দিয়েই causality বা leader ঠিক হয়েছে বলবেন না।",
);
add(
  "Database Internals",
  "A storage engine combines page/cache management, indexes, write-ahead logging, and concurrency visibility. The log must reach the required durability boundary before acknowledging certain commits. MVCC can let readers see a consistent older version while writers proceed, but obsolete versions need cleanup. Query planning is a separate layer from physical recovery.",
  "Engine page/cache, index, WAL ও visibility সামলায়। Commit স্বীকারের আগে দরকারমতো log durable হওয়া লাগে। MVCC পুরোনো version পড়তে দেয়, পরে cleanup লাগে। Query plan আর recovery আলাদা স্তর।",
  `record LogEntry(long Sequence,string Transaction,string Operation);
var wal=new List<LogEntry>();
wal.Add(new(1,"tx1","BEGIN"));
wal.Add(new(2,"tx1","SET account=90"));
wal.Add(new(3,"tx1","COMMIT"));
var committed=wal.Where(x=>x.Operation=="COMMIT").Select(x=>x.Transaction).ToHashSet();
foreach(var e in wal.Where(x=>committed.Contains(x.Transaction)))Console.WriteLine(e);`,
  `record Versioned(long CreatedAt,long? DeletedAt,string Value);
var versions=new[]{new Versioned(1,4,"old"),new Versioned(4,null,"new")};
string Read(long snapshot)=>versions.Single(v=>v.CreatedAt<=snapshot&&(v.DeletedAt is null||v.DeletedAt>snapshot)).Value;
Console.WriteLine(Read(3));
Console.WriteLine(Read(5));
// A tiny MVCC visibility model, not a database implementation.`,
  "Do not infer crash durability from successful in-memory tests. Engine guarantees depend on flush policy, filesystem, hardware, and replication configuration.",
  "Memory test পাস মানেই crash durability নয়। Flush, filesystem, hardware ও replication config দেখতে হয়।",
);
add(
  "Operating Systems",
  "Processes provide address-space and permission boundaries; threads share a process’s memory. Scheduling, context switching, virtual memory, paging, descriptors, and I/O completion influence application performance. Managed memory is only part of a .NET process footprint. Diagnose CPU, memory, I/O, and thread starvation as different resource problems.",
  "Process-এর memory/permission boundary আলাদা, thread একই process-এর memory ভাগ করে। Scheduler, paging ও I/O app-এর গতি বদলায়। .NET managed heap পুরো process memory নয়। CPU, memory ও starvation আলাদা সমস্যা।",
  `using System.Diagnostics;
using var process=Process.GetCurrentProcess();
Console.WriteLine($"PID={process.Id}");
Console.WriteLine($"WorkingSet={process.WorkingSet64}");
Console.WriteLine($"ManagedApprox={GC.GetTotalMemory(false)}");
Console.WriteLine($"Threads={process.Threads.Count}");
Console.WriteLine($"CPU={process.TotalProcessorTime}");`,
  `ThreadPool.GetAvailableThreads(out int workers,out int io);
ThreadPool.GetMaxThreads(out int maxWorkers,out int maxIo);
Console.WriteLine($"Available worker={workers}/{maxWorkers}");
Console.WriteLine($"Available IO={io}/{maxIo}");
await Task.Delay(10);
Console.WriteLine("An async wait need not occupy one blocked thread throughout.");
// These counters are observations, not a standalone diagnosis.`,
  "A high working set is not automatically a managed leak. Correlate heap trends, native allocations, caches, paging, and workload before tuning GC or thread settings.",
  "Working set বেশি মানেই managed leak নয়। Heap, native, cache ও workload মিলিয়ে তারপর GC/thread tune করুন।",
);
add(
  "Computer Networks",
  "Address resolution, routing, transport, TLS, and application protocols are separate boundaries. TCP supplies an ordered byte stream without application message framing. HTTP versions change multiplexing and connection behavior. Timeouts should distinguish connection setup from overall request deadlines, and retries should respect operation semantics.",
  "DNS, route, transport, TLS ও HTTP আলাদা boundary। TCP byte stream দেয়, নিজে message ভাগ করে না। HTTP version-এ multiplexing বদলায়। Connect timeout ও মোট deadline আলাদা ভাবুন।",
  `var handler=new SocketsHttpHandler {
    ConnectTimeout=TimeSpan.FromSeconds(2),
    PooledConnectionLifetime=TimeSpan.FromMinutes(5)
};
using var client=new HttpClient(handler){Timeout=TimeSpan.FromSeconds(5)};
using var response=await client.GetAsync("https://example.com",HttpCompletionOption.ResponseHeadersRead);
Console.WriteLine(response.Version);
Console.WriteLine((int)response.StatusCode);`,
  `byte[] message=System.Text.Encoding.UTF8.GetBytes("hello");
byte[] frame=new byte[4+message.Length];
System.Buffers.Binary.BinaryPrimitives.WriteInt32BigEndian(frame.AsSpan(0,4),message.Length);
message.CopyTo(frame,4);
int length=System.Buffers.Binary.BinaryPrimitives.ReadInt32BigEndian(frame.AsSpan(0,4));
Console.WriteLine(System.Text.Encoding.UTF8.GetString(frame,4,length));
// Network readers must loop for partial reads and enforce a maximum length.`,
  "A single stream read may return fewer bytes than requested. Treat framing, size limits, cancellation, and half-closed connections deliberately.",
  "এক read-এ পুরো data নাও আসতে পারে। Framing, size limit ও partial read সামলান।",
);
add(
  "Concurrency & Multithreading",
  "Async work overlaps waits; parallel CPU work uses simultaneous execution capacity. Task.WhenAll coordinates completion but does not bound concurrency by itself. Large fanout can exhaust sockets, database pools, or downstream quotas. Bounded asynchronous parallelism combines cancellation with a maximum number of active operations.",
  "Async অপেক্ষা overlap করে, parallel CPU একসাথে চালায়। Task.WhenAll নিজে concurrency সীমা দেয় না। বড় fanout socket বা DB pool শেষ করে। Max active কাজ ও cancellation একসাথে দিন।",
  `var input=Enumerable.Range(1,10);
using var gate=new SemaphoreSlim(3);
async Task<int> Work(int id) {
    await gate.WaitAsync();
    try {await Task.Delay(10);return id*id;}
    finally {gate.Release();}
}
int[] results=await Task.WhenAll(input.Select(Work));
Console.WriteLine(string.Join(",",results));`,
  `using var stop=new CancellationTokenSource();
int sum=0;
await Parallel.ForEachAsync(Enumerable.Range(1,10),new ParallelOptions {
    MaxDegreeOfParallelism=2,CancellationToken=stop.Token
},async(value,token)=>{
    await Task.Delay(5,token);
    Interlocked.Add(ref sum,value);
});
Console.WriteLine(sum);`,
  "Use parallelism for suitable independent work and measure resource saturation. Increasing task count is not the same as increasing useful throughput.",
  "স্বাধীন উপযুক্ত কাজেই parallelism। Task সংখ্যা বাড়া মানেই দরকারি throughput বাড়া নয়।",
);
add(
  "Backend Architecture",
  "Architecture makes dependency direction and ownership explicit. A use case should express business intent without requiring HTTP or database details in every rule. Ports/interfaces isolate external capabilities; adapters implement them. Vertical slices organize by change/use case, while layers organize by responsibility; both can be valid within a modular monolith.",
  "Architecture dependency ও ownership স্পষ্ট করে। Use case-এ business intent, HTTP/DB detail সর্বত্র নয়। Port চুক্তি, adapter বাস্তব কাজ। Vertical slice পরিবর্তন অনুযায়ী, layer দায়িত্ব অনুযায়ী সাজায়।",
  `var store=new MemoryStore();
var useCase=new PlaceOrder(store);
await useCase.ExecuteAsync("Tea",2);
Console.WriteLine(store.Orders.Count);
record Order(string Product,int Quantity);
interface IOrderStore {Task SaveAsync(Order order);}
class MemoryStore:IOrderStore {public List<Order> Orders{get;}=new();public Task SaveAsync(Order o){Orders.Add(o);return Task.CompletedTask;}}
class PlaceOrder(IOrderStore store) {public Task ExecuteAsync(string product,int quantity){if(quantity<=0)throw new ArgumentException("Quantity");return store.SaveAsync(new(product,quantity));}}`,
  `var dependencies=new[]{("Web","Application"),("Application","Domain"),("Infrastructure","Application")};
foreach(var (from,to) in dependencies)Console.WriteLine($"{from} -> {to}");
bool Forbidden(string from,string to)=>from=="Domain"&&to=="Web";
Console.WriteLine(Forbidden("Domain","Web"));
// Enforce important boundaries with project references and architecture tests.
// Folder names alone do not prevent forbidden dependencies.`,
  "Do not introduce remote service boundaries merely to achieve code organization. Start with explicit modules and extract when deployment/data ownership needs justify it.",
  "Code গোছাতে শুধু remote service নয়। আগে module, পরে স্বাধীন deploy/data-এর দরকারে extract করুন।",
);
add(
  "API Design",
  "An API includes naming, representations, validation, authorization, pagination, error semantics, idempotency, and compatibility. Contracts should make ambiguity visible, such as money units and timestamp timezone. A stable machine error code lets clients handle failures without parsing a translated human sentence. Test representative consumers before changing shape or meaning.",
  "API-তে নাম ছাড়াও validation, permission, error, idempotency ও compatibility। টাকার unit ও সময়ের timezone স্পষ্ট দিন। Machine error code স্থায়ী রাখুন, client যেন অনুবাদ করা বাক্য parse না করে।",
  `var response=new OrderView(42,10000,"BDT",DateTimeOffset.UtcNow);
string json=System.Text.Json.JsonSerializer.Serialize(response);
Console.WriteLine(json);
record OrderView(int Id,long AmountMinor,string Currency,DateTimeOffset CreatedAt);
// Units and offset are visible in the contract.
// Add compatibility tests before changing field names or types.`,
  `var error=new ApiError("quantity_out_of_range","Quantity must be 1–100","trace-demo");
Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(error));
record ApiError(string Code,string Message,string TraceId);
// A client switches on Code, not on translated Message.
// Logs retain internal diagnostics under TraceId without exposing them.
Console.WriteLine(error.Code=="quantity_out_of_range");`,
  "Use explicit idempotency keys for costly retryable creation when required. Keep the stored request fingerprint and outcome associated atomically.",
  "দরকারে costly create-এ idempotency key দিন। Request fingerprint ও outcome atomicভাবে রাখুন।",
);
add(
  "Database Design & Optimization",
  "Model keys, constraints, relationships, and transaction invariants before indexing. Normalization reduces duplicated facts but may require joins; denormalized views move work to writes and reconciliation. Optimization begins with actual query plans and workload distribution. N+1 request patterns can dominate latency even when each individual query is indexed.",
  "আগে key, constraint, সম্পর্ক ও transaction rule। Normalization duplicate কমায়, join বাড়তে পারে। Denormalization-এ write/reconciliation দায় আসে। Plan ও workload দেখে tune করুন; indexed হলেও N+1 ধীর।",
  `var customers=new[]{(Id:1,Name:"Ayesha"),(Id:2,Name:"Rahim")};
var orders=new[]{(Id:10,CustomerId:1,Total:50m),(Id:11,CustomerId:1,Total:70m)};
var totals=orders.GroupBy(o=>o.CustomerId).ToDictionary(g=>g.Key,g=>g.Sum(x=>x.Total));
foreach(var customer in customers) {
    totals.TryGetValue(customer.Id,out decimal total);
    Console.WriteLine($"{customer.Name}: {total}");
}
// A precomputed lookup avoids repeatedly scanning every order.`,
  `int customers=100;
int nPlusOneQueries=1+customers;
int batchedQueries=2;
int networkMs=5;
Console.WriteLine($"Sequential round-trip floor: {nPlusOneQueries*networkMs}ms");
Console.WriteLine($"Batched floor: {batchedQueries*networkMs}ms");
// Model only; query work and transfer also matter.
// Use projection, joins, or bounded batching based on the access pattern.`,
  "A faster query that returns unauthorized or inconsistent rows is not an improvement. Preserve tenant/ownership filters while tuning.",
  "Unauthorized বা inconsistent row দ্রুত আনা উন্নতি নয়। Tuning-এ tenant/ownership filter রাখুন।",
);
add(
  "Docker & Kubernetes",
  "Packaging and scheduling are different layers. A container image identifies application bits; a workload manifest defines how those bits run with resources, configuration, health, and identity. Immutable image references simplify reproducible replacement. Runtime secrets and environment configuration should not be baked into a shared public image.",
  "Image অ্যাপের bits, manifest কীভাবে চলবে বলে। Resource, health, config ও identity runtime-এর বিষয়। Immutable image-এ replacement পুনরাবৃত্তিযোগ্য। Secret public image-এ bake নয়।",
  `record Release(string ImageDigest,int Replicas,int MemoryMiB);
var release=new Release("registry.example.com/app@sha256:REPLACE_WITH_REAL_DIGEST",3,256);
Console.WriteLine(release);
bool Valid(Release r)=>r.Replicas>0&&r.MemoryMiB>=64&&r.ImageDigest.Contains("@sha256:");
Console.WriteLine(Valid(release));
// Syntax-level model only: verify a real digest and registry access separately.`,
  `var phases=new[]{"Build","Test","Publish image","Deploy manifest","Wait for readiness","Smoke test"};
for(int i=0;i<phases.Length;i++)Console.WriteLine($"{i+1}. {phases[i]}");
Console.WriteLine("Rollback needs a retained image and compatible data.");
// Container startup is not the same event as application readiness.
// Scheduling may fail even while the control plane is healthy.`,
  "Use probes and graceful termination aligned with the application. A liveness probe that depends on a transient database outage can restart all healthy processes unnecessarily.",
  "Probe app-এর আচরণ অনুযায়ী দিন। সাময়িক DB fail-এ সব process restart করানো liveness check খারাপ হতে পারে।",
);
add(
  "Design Patterns",
  "Patterns describe recurring forces and consequences, not mandatory class templates. Strategy varies a policy, Factory varies creation, Decorator wraps behavior, and Observer publishes changes. A design can use small functions or records to express the same intent. The best pattern is one whose cost is justified by real variation and tested boundaries.",
  "Pattern বাধ্যতামূলক class template নয়। Strategy policy, Factory creation, Decorator wrapper, Observer খবর দেয়। ছোট function-ও একই উদ্দেশ্য মেটায়। আসল পরিবর্তনের সুবিধা খরচের চেয়ে বেশি হলেই pattern নিন।",
  `Func<decimal,decimal> regular=x=>x;
Func<decimal,decimal> member=x=>x*0.9m;
var policies=new Dictionary<string,Func<decimal,decimal>>{{"regular",regular},{"member",member}};
Console.WriteLine(policies["member"](100m));
// Strategy expressed as a function, not a class hierarchy.
var factory=()=>new List<string>();
Console.WriteLine(ReferenceEquals(factory(),factory()));`,
  `var considerations=new[]{("Strategy","Algorithm varies"),("Factory","Creation varies"),("Decorator","Behavior wraps"),("Observer","Listeners vary")};
foreach(var (pattern,force) in considerations)Console.WriteLine($"{pattern}: {force}");
Console.WriteLine("Name the change before selecting the pattern.");
// A stable two-line rule may need no pattern at all.
// Review coupling, lifecycle, and testability after any abstraction.`,
  "Do not measure design quality by number of patterns used. Favor a clear domain vocabulary and small coherent contracts.",
  "Pattern গুনে design-এর মান নয়। Domain-এর পরিষ্কার ভাষা ও ছোট coherent contract ভালো।",
);
export default data;
