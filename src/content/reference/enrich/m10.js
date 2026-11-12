// Module 10 Production Problem Solving: diagnose -> fix -> prevent, with runnable demos.
import { cs, sh } from "./helpers";

export default {
  "Slow APIs": {
    s: ["A customer complains the restaurant is slow. A good manager does not guess; they time each step: taking the order, cooking, plating, delivery. Then they fix the slowest step. Debugging a slow API works the same way.", "ক্রেতা অভিযোগ করেন রেস্তোরাঁ ধীর। ভালো ম্যানেজার অনুমান করেন না; প্রতিটি ধাপের সময় মাপেন: অর্ডার নেওয়া, রান্না, সাজানো, পরিবেশন। তারপর সবচেয়ে ধীর ধাপ ঠিক করেন। ধীর API debug একইভাবে হয়।"],
    t: ["Measure before changing anything: p50/p95/p99 latency per endpoint, then a trace showing time spent in database calls, external HTTP calls, serialization and your code. Common causes: N+1 queries, missing indexes, sequential calls that could be parallel, large payloads, sync-over-async thread starvation, and cold caches. Fix the biggest slice first and re-measure.", "কিছু বদলানোর আগে মাপুন: endpoint-প্রতি p50/p95/p99 latency, তারপর trace, যা database call, বাইরের HTTP call, serialization ও আপনার code-এ সময় দেখায়। প্রচলিত কারণ: N+1 query, অনুপস্থিত index, parallel করা যেত এমন ক্রমিক call, বড় payload, sync-over-async thread starvation ও ঠান্ডা cache। সবচেয়ে বড় অংশ আগে ঠিক করে আবার মাপুন।"],
    p: [["Find the slow endpoint and its p95/p99 in metrics.", "Metric-এ ধীর endpoint ও তার p95/p99 খুঁজুন।"], ["Open a slow trace and find the biggest span.", "একটি ধীর trace খুলে সবচেয়ে বড় span খুঁজুন।"], ["Fix that cause (query, parallelism, caching, payload).", "সেই কারণ ঠিক করুন (query, parallelism, caching, payload)।"], ["Load test and compare before/after.", "Load test করে আগে/পরে তুলনা করুন।"]],
    m: ["Optimising code that is 2% of the time; looking only at averages; adding caching before understanding the cause; using .Result/.Wait() in ASP.NET Core.", "সময়ের ২% নেওয়া code optimise; শুধু গড় দেখা; কারণ না বুঝে caching; ASP.NET Core-এ .Result/.Wait() ব্যবহার।"],
    q: ["Q: p50 is 80 ms but p99 is 4 s. What do you check? A: Outliers: lock contention, GC pauses, cold cache misses, retries on a flaky dependency, or a few heavy users/queries. Look at traces of the slowest requests specifically.", "প্রশ্ন: p50 ৮০ ms কিন্তু p99 ৪ s। কী দেখবেন? উত্তর: ব্যতিক্রম: lock contention, GC বিরতি, ঠান্ডা cache miss, অস্থির dependency-তে retry, বা কয়েকজন ভারী user/query। বিশেষভাবে সবচেয়ে ধীর request-এর trace দেখুন।"],
    f: ["AI calls are often the slowest span in modern APIs. Stream responses, run model calls in parallel with retrieval when possible, and cache results.", "আধুনিক API-তে AI call প্রায়ই সবচেয়ে ধীর span। Response stream করুন, সম্ভব হলে retrieval-এর সাথে parallel-এ model call চালান এবং ফল cache করুন।"],
    x: [cs("Sequential vs parallel independent calls · ক্রমিক বনাম parallel call", `using System.Diagnostics;

async Task<string> Fetch(string name, int ms) { await Task.Delay(ms); return name; }

var sw = Stopwatch.StartNew();
await Fetch("profile", 200); await Fetch("orders", 300); await Fetch("offers", 250);
long sequential = sw.ElapsedMilliseconds;

sw.Restart();
await Task.WhenAll(Fetch("profile", 200), Fetch("orders", 300), Fetch("offers", 250));
long parallel = sw.ElapsedMilliseconds;

Console.WriteLine($"sequential ~{sequential / 100 * 100} ms (sum of calls)");
Console.WriteLine($"parallel   ~{parallel / 100 * 100} ms (slowest call)");
Console.WriteLine($"faster by at least 2x: {sequential >= parallel * 2}");`, "sequential ~700 ms (sum of calls)\nparallel   ~300 ms (slowest call)\nfaster by at least 2x: True")],
  },
  "Slow queries": {
    s: ["Looking for one receipt in a box of 100,000 unsorted receipts takes forever; in a sorted folder it takes seconds. Most slow queries are 'unsorted box' problems.", "এক লাখ অগোছালো রসিদের বাক্সে একটি রসিদ খুঁজতে অনেক সময় লাগে; সাজানো folder-এ কয়েক সেকেন্ড। বেশিরভাগ ধীর query হলো 'অগোছালো বাক্স' সমস্যা।"],
    t: ["Find slow queries with the database's slow-query log or Query Store, then read the execution plan (EXPLAIN ANALYZE). Look for sequential scans on big tables, wrong row estimates, sorts spilling to disk and nested loops over many rows. Fixes: indexes matching WHERE/JOIN/ORDER BY, rewriting queries, selecting fewer columns, pagination, and updating statistics.", "Database-এর slow-query log বা Query Store দিয়ে ধীর query খুঁজুন, তারপর execution plan পড়ুন (EXPLAIN ANALYZE)। বড় table-এ sequential scan, ভুল row অনুমান, disk-এ ছড়িয়ে পড়া sort আর অনেক row-এর উপর nested loop দেখুন। সমাধান: WHERE/JOIN/ORDER BY-এর সাথে মেলা index, query আবার লেখা, কম column বাছা, pagination ও statistics আপডেট।"],
    p: [["Enable slow-query logging (e.g., > 200 ms).", "Slow-query logging চালু করুন (যেমন > ২০০ ms)।"], ["Run EXPLAIN ANALYZE on the worst query.", "সবচেয়ে খারাপ query-তে EXPLAIN ANALYZE চালান।"], ["Add or adjust an index; rewrite if needed.", "Index যোগ বা ঠিক করুন; দরকারে আবার লিখুন।"], ["Re-run EXPLAIN and compare timings.", "আবার EXPLAIN চালিয়ে সময় তুলনা করুন।"]],
    m: ["Testing on a tiny local database; adding indexes blindly; functions on indexed columns; SELECT * with large text columns.", "ছোট local database-এ test; অন্ধভাবে index যোগ; index-করা column-এ function; বড় text column-সহ SELECT *।"],
    q: ["Q: A query is fast in development but slow in production. Why? A: Different data volume and distribution, missing indexes in production, stale statistics or parameter sniffing choosing a bad plan.", "প্রশ্ন: Development-এ query দ্রুত কিন্তু production-এ ধীর। কেন? উত্তর: ভিন্ন data-র পরিমাণ ও বিতরণ, production-এ অনুপস্থিত index, পুরনো statistics বা parameter sniffing খারাপ plan বাছে।"],
    f: ["AI assistants can explain execution plans well. Paste the plan (without sensitive data) and ask for likely causes, then verify by measuring.", "AI assistant execution plan ভালো ব্যাখ্যা করতে পারে। Plan paste করুন (সংবেদনশীল data ছাড়া) এবং সম্ভাব্য কারণ জিজ্ঞেস করুন, তারপর মেপে যাচাই করুন।"],
    x: [cs("Measure a query before and after an index · index-এর আগে ও পরে মাপা", `using System.Diagnostics;
using Microsoft.Data.Sqlite;

using var db = new SqliteConnection("Data Source=:memory:");
db.Open();
Exec("CREATE TABLE Orders(Id INTEGER PRIMARY KEY, CustomerId INT, Total REAL)");
using (var tx = db.BeginTransaction())
{
    var ins = db.CreateCommand(); ins.Transaction = tx;
    ins.CommandText = "INSERT INTO Orders(CustomerId, Total) VALUES ($c, $t)";
    var c = ins.Parameters.Add("$c", SqliteType.Integer); var t = ins.Parameters.Add("$t", SqliteType.Real);
    for (int i = 0; i < 200_000; i++) { c.Value = i % 20_000; t.Value = i % 977; ins.ExecuteNonQuery(); }
    tx.Commit();
}
string Plan() { var cmd = db.CreateCommand(); cmd.CommandText = "EXPLAIN QUERY PLAN SELECT SUM(Total) FROM Orders WHERE CustomerId = 42"; using var r = cmd.ExecuteReader(); r.Read(); return r.GetString(3); }
double Time() { var sw = Stopwatch.StartNew(); for (int i = 0; i < 50; i++) { var cmd = db.CreateCommand(); cmd.CommandText = "SELECT SUM(Total) FROM Orders WHERE CustomerId = 42"; cmd.ExecuteScalar(); } return sw.Elapsed.TotalMilliseconds; }

double before = Time(); Console.WriteLine($"before: {Plan()}");
Exec("CREATE INDEX IX_Orders_Customer ON Orders(CustomerId)");
double after = Time(); Console.WriteLine($"after:  {Plan()}");
Console.WriteLine($"at least 10x faster: {before > after * 10}");

void Exec(string sql) { var c = db.CreateCommand(); c.CommandText = sql; c.ExecuteNonQuery(); }`, "before: SCAN Orders\nafter:  SEARCH Orders USING INDEX IX_Orders_Customer (CustomerId=?)\nat least 10x faster: True", ["Microsoft.Data.Sqlite"])],
  },
  "Slow reads": {
    s: ["A popular library book has a waiting list of 50 students. The library buys extra copies and keeps a summary sheet at the desk. Read-heavy slowness is fixed with copies (replicas) and summaries (caches).", "Library-র জনপ্রিয় বইয়ের জন্য ৫০ জন ছাত্রের অপেক্ষার তালিকা। Library বাড়তি কপি কেনে এবং desk-এ সারাংশ রাখে। পড়া-ভারী ধীরতা কপি (replica) ও সারাংশ (cache) দিয়ে ঠিক হয়।"],
    t: ["When reads dominate, reduce work per read and spread reads: cache hot results (Redis, output caching), add read replicas, denormalize or precompute views for complex pages, paginate, and use CDN for public content. Choose freshness per feature: product prices may tolerate 30 seconds, balances may not.", "পড়া বেশি হলে পড়া-প্রতি কাজ কমান ও পড়া ছড়িয়ে দিন: গরম ফল cache (Redis, output caching), read replica যোগ, জটিল page-এর জন্য denormalize বা আগে থেকে view বানানো, pagination আর public content-এ CDN। Feature অনুযায়ী freshness বাছুন: পণ্যের দামে ৩০ সেকেন্ড চলতে পারে, balance-এ নয়।"],
    p: [["Rank endpoints by read volume and latency.", "পড়ার পরিমাণ ও latency অনুযায়ী endpoint সাজান।"], ["Cache the top ones with sensible TTLs.", "শীর্ষগুলো যৌক্তিক TTL-সহ cache করুন।"], ["Route remaining heavy reads to replicas.", "বাকি ভারী পড়া replica-তে পাঠান।"], ["Precompute expensive aggregates on a schedule or via events.", "ব্যয়বহুল aggregate নিয়মিত সময়ে বা event দিয়ে আগেই হিসাব করুন।"]],
    m: ["Reading from replicas right after writes; caching without invalidation; computing dashboards live from raw tables on every request.", "লেখার ঠিক পরে replica থেকে পড়া; invalidation ছাড়া caching; প্রতি request-এ কাঁচা table থেকে সরাসরি dashboard হিসাব।"],
    q: ["Q: A dashboard query takes 8 seconds and is opened 500 times an hour. Fix? A: Precompute it into a summary table every minute (or update incrementally from events) and serve that; optionally cache for 60 seconds.", "প্রশ্ন: একটি dashboard query ৮ সেকেন্ড নেয় এবং ঘণ্টায় ৫০০ বার খোলা হয়। সমাধান? উত্তর: প্রতি মিনিটে summary table-এ আগে হিসাব করুন (বা event থেকে ধাপে ধাপে আপডেট) এবং সেটা দিন; দরকারে ৬০ সেকেন্ড cache।"],
    f: ["Precomputed summaries are also great inputs for AI reporting features: smaller, cleaner context means cheaper and more accurate answers.", "আগে হিসাব করা সারাংশ AI reporting feature-এর জন্যও দারুণ input: ছোট, পরিষ্কার context মানে সস্তা ও বেশি নির্ভুল উত্তর।"],
    x: [cs("Output caching for a hot endpoint · গরম endpoint-এ output caching", `int dbCalls = 0;
var cache = new Dictionary<string, (string Value, DateTime Expires)>();
var now = new DateTime(2026, 11, 12, 10, 0, 0);

string TopProducts()
{
    if (cache.TryGetValue("top", out var c) && c.Expires > now) return c.Value;
    dbCalls++;                                          // the expensive query
    var value = "rice, oil, sugar";
    cache["top"] = (value, now.AddSeconds(30));
    return value;
}

for (int second = 0; second < 90; second += 2) { now = new DateTime(2026, 11, 12, 10, 0, 0).AddSeconds(second); TopProducts(); }
Console.WriteLine($"45 requests over 90 s -> {dbCalls} database queries (TTL 30 s)");`, "45 requests over 90 s -> 3 database queries (TTL 30 s)")],
  },
  "Slow file loads": {
    s: ["Sending a whole wedding album by post when the guest only wanted one photo. Slow file loads often come from sending too much, too far, from the wrong place.", "অতিথি শুধু একটি ছবি চাইলেও পুরো বিয়ের album ডাকে পাঠানো। ধীর file load প্রায়ই ভুল জায়গা থেকে, অনেক দূরে, অনেক বেশি পাঠানো থেকে হয়।"],
    t: ["Serve files from object storage through a CDN, not through your API. Resize and compress images (WebP/AVIF, multiple sizes with srcset), enable gzip/brotli for text, stream large files instead of loading them into memory, support HTTP range requests for video and resumable downloads, and lazy-load images below the fold.", "File আপনার API দিয়ে নয়, CDN-এর মাধ্যমে object storage থেকে দিন। ছবি ছোট ও compress করুন (WebP/AVIF, srcset-সহ একাধিক আকার), text-এ gzip/brotli চালু করুন, বড় file memory-তে না এনে stream করুন, video ও resumable download-এ HTTP range request সমর্থন করুন, আর পর্দার নিচের ছবি lazy-load করুন।"],
    p: [["Check file sizes and where they are served from.", "File-এর আকার ও কোথা থেকে দেওয়া হচ্ছে দেখুন।"], ["Move files to blob storage + CDN.", "File blob storage + CDN-এ সরান।"], ["Generate optimized variants at upload time.", "Upload-এর সময় optimize করা variant বানান।"], ["Stream large downloads and enable range requests.", "বড় download stream করুন এবং range request চালু করুন।"]],
    m: ["Reading whole files into byte arrays in the API; serving 4 MB phone photos as thumbnails; no compression; files behind auth served without caching headers.", "API-তে পুরো file byte array-তে পড়া; thumbnail হিসেবে ৪ MB-র ফোনের ছবি; compression নেই; auth-এর পিছনের file caching header ছাড়া দেওয়া।"],
    q: ["Q: Users on mobile data complain the product page is slow. First checks? A: Page weight (images), whether images are resized and modern formats, CDN usage, compression, and lazy loading.", "প্রশ্ন: Mobile data-র user বলেন product page ধীর। প্রথমে কী দেখবেন? উত্তর: Page-এর ওজন (ছবি), ছবি ছোট ও আধুনিক format-এ কি না, CDN ব্যবহার, compression ও lazy loading।"],
    f: ["Many users in Bangladesh browse on mid-range phones and mobile data. Designing for small payloads is both good engineering and good business.", "বাংলাদেশের অনেক user মাঝারি মানের ফোন ও mobile data-য় browse করেন। ছোট payload-এর জন্য design ভালো engineering ও ভালো ব্যবসা দুটোই।"],
    x: [cs("Compression savings for a JSON payload · JSON payload-এ compression", `using System.IO.Compression;
using System.Text;
using System.Text.Json;

var products = Enumerable.Range(1, 500).Select(i => new { id = i, name = $"Product {i}", category = "groceries", price = 100 + i % 50, inStock = true });
byte[] json = JsonSerializer.SerializeToUtf8Bytes(products);

byte[] Compress(byte[] data, bool brotli)
{
    using var ms = new MemoryStream();
    using (Stream z = brotli ? new BrotliStream(ms, CompressionLevel.Optimal) : new GZipStream(ms, CompressionLevel.Optimal)) z.Write(data);
    return ms.ToArray();
}
int gzip = Compress(json, false).Length, br = Compress(json, true).Length;
Console.WriteLine($"raw JSON: {json.Length / 1024} KB");
Console.WriteLine($"gzip smaller than 20% of raw: {gzip < json.Length / 5}");
Console.WriteLine($"brotli smaller than gzip: {br < gzip}");
// ASP.NET Core: builder.Services.AddResponseCompression(o => o.EnableForHttps = true);`, "raw JSON: 39 KB\ngzip smaller than 20% of raw: True\nbrotli smaller than gzip: True")],
  },
  "Growing traffic": {
    s: ["A small shop growing into a supermarket: you do not knock down the building on day one. You add counters, then a storeroom, then a second floor, planning one step ahead of the crowd.", "ছোট দোকান supermarket হচ্ছে: প্রথম দিনেই ভবন ভাঙেন না। কাউন্টার যোগ করেন, তারপর গুদাম, তারপর দোতলা, ভিড়ের এক ধাপ আগে পরিকল্পনা করে।"],
    t: ["Plan capacity from trends: graph requests, CPU, memory, DB connections and storage growth; forecast when each hits ~70%. Scale in steps: stateless app tier with autoscaling, caching, read replicas, queues for heavy work, then partitioning. Load-test to find the next bottleneck before users find it.", "প্রবণতা থেকে ক্ষমতা পরিকল্পনা করুন: request, CPU, memory, DB connection ও storage বৃদ্ধির graph দেখুন; প্রতিটি কবে ~৭০%-এ পৌঁছাবে অনুমান করুন। ধাপে ধাপে বাড়ান: autoscaling-সহ stateless app স্তর, caching, read replica, ভারী কাজের জন্য queue, তারপর partitioning। User খোঁজার আগেই পরের bottleneck খুঁজতে load test করুন।"],
    p: [["Track weekly growth of key metrics.", "মূল metric-এর সাপ্তাহিক বৃদ্ধি দেখুন।"], ["Forecast when you will reach 70% of capacity.", "কবে ক্ষমতার ৭০%-এ পৌঁছাবেন অনুমান করুন।"], ["Load test at 2x expected peak.", "প্রত্যাশিত peak-এর ২ গুণে load test করুন।"], ["Schedule the next scaling step before the deadline.", "সময়সীমার আগে পরের scaling ধাপ ঠিক করুন।"]],
    m: ["Waiting for an outage to scale; rewriting everything for hypothetical 100x growth; ignoring database and third-party limits.", "Scale করতে বিভ্রাটের অপেক্ষা; কাল্পনিক ১০০ গুণ বৃদ্ধির জন্য সব নতুন করে লেখা; database ও third-party সীমা উপেক্ষা।"],
    q: ["Q: Traffic grows 15% per month. When does a system at 40% capacity hit 70%? A: 0.4 × 1.15^n = 0.7 → n ≈ 4 months. Plan the next step within 3 months.", "প্রশ্ন: মাসে ১৫% traffic বাড়ে। ৪০% ক্ষমতায় থাকা system কবে ৭০%-এ পৌঁছায়? উত্তর: 0.4 × 1.15^n = 0.7 → n ≈ ৪ মাস। ৩ মাসের মধ্যে পরের ধাপ পরিকল্পনা করুন।"],
    f: ["AI features can change traffic shape suddenly (one launch doubles backend calls). Include AI feature launches in capacity planning.", "AI feature হঠাৎ traffic-এর ধরন বদলাতে পারে (একটি launch backend call দ্বিগুণ করে)। ক্ষমতা পরিকল্পনায় AI feature launch অন্তর্ভুক্ত করুন।"],
    x: [cs("Forecast when capacity runs out · ক্ষমতা কবে শেষ হবে", `double usage = 0.40, monthlyGrowth = 0.15;
for (int month = 0; month <= 7; month++)
{
    string flag = usage >= 0.9 ? "  <- outage risk" : usage >= 0.7 ? "  <- act now" : "";
    Console.WriteLine($"month {month}: {usage * 100,5:0.0}% of capacity{flag}");
    usage *= 1 + monthlyGrowth;
}`, "month 0:  40.0% of capacity\nmonth 1:  46.0% of capacity\nmonth 2:  52.9% of capacity\nmonth 3:  60.8% of capacity\nmonth 4:  70.0% of capacity\nmonth 5:  80.5% of capacity  <- act now\nmonth 6:  92.5% of capacity  <- outage risk\nmonth 7: 106.4% of capacity  <- outage risk")],
  },
  "Too much traffic": {
    s: ["On Eid eve, every bus terminal is overwhelmed. Good terminals add buses, open extra counters, and when full, politely tell people the next departure time instead of letting the crowd crush the gate.", "ঈদের আগের রাতে প্রতিটি বাস টার্মিনালে ভিড় উপচে পড়ে। ভালো টার্মিনাল বাস বাড়ায়, বাড়তি কাউন্টার খোলে, আর ভরে গেলে ভিড়কে গেট ভাঙতে না দিয়ে ভদ্রভাবে পরের ছাড়ার সময় জানায়।"],
    t: ["During a spike: protect the core (rate limit, shed non-critical work, return 429/503 with Retry-After), serve from caches/CDN, turn off expensive features with flags, scale out quickly, and use queues to absorb writes. Graceful degradation (show cached data, hide recommendations) beats a total outage.", "হঠাৎ ভিড়ে: মূল অংশ রক্ষা করুন (rate limit, অপ্রয়োজনীয় কাজ বাদ, Retry-After-সহ 429/503), cache/CDN থেকে দিন, flag দিয়ে ব্যয়বহুল feature বন্ধ করুন, দ্রুত scale out করুন আর লেখা শোষণে queue ব্যবহার করুন। মার্জিত অবনমন (cache-করা data দেখানো, recommendation লুকানো) সম্পূর্ণ বিভ্রাটের চেয়ে ভালো।"],
    p: [["Identify critical paths (login, checkout) vs optional ones.", "জরুরি পথ (login, checkout) বনাম ঐচ্ছিক চিহ্নিত করুন।"], ["Add load shedding and feature flags for optional ones.", "ঐচ্ছিকগুলোর জন্য load shedding ও feature flag দিন।"], ["Pre-scale before known events.", "জানা event-এর আগে আগেভাগে scale করুন।"], ["Practise with load tests (game days).", "Load test দিয়ে অনুশীলন করুন (game day)।"]],
    m: ["Letting every feature compete for the same resources; autoscaling that reacts too slowly for sudden spikes; retries from clients making the storm worse.", "সব feature-কে একই resource-এর জন্য প্রতিযোগিতা করতে দেওয়া; হঠাৎ ভিড়ে খুব ধীরে সাড়া দেওয়া autoscaling; client-এর retry ঝড় আরও খারাপ করে।"],
    q: ["Q: A flash sale starts at 8 PM. What do you do at 7 PM? A: Pre-scale app and DB capacity, warm caches, enable a waiting room or queue for checkout, disable non-essential features, and have dashboards and on-call ready.", "প্রশ্ন: রাত ৮টায় flash sale শুরু। সন্ধ্যা ৭টায় কী করবেন? উত্তর: App ও DB ক্ষমতা আগেভাগে বাড়ান, cache গরম করুন, checkout-এ waiting room বা queue চালু করুন, অপ্রয়োজনীয় feature বন্ধ করুন, আর dashboard ও on-call প্রস্তুত রাখুন।"],
    f: ["Feature flags are also how teams safely roll out AI features: start with 1% of users and turn them off instantly if costs or errors spike.", "Feature flag দিয়েই দল নিরাপদে AI feature চালু করে: ১% user দিয়ে শুরু, খরচ বা error বাড়লে সাথে সাথে বন্ধ।"],
    x: [cs("Priority-based load shedding · অগ্রাধিকার অনুযায়ী load shedding", `int capacity = 100;
var incoming = new (string Path, int Priority, int Count)[]
{
    ("/checkout", 1, 40), ("/login", 1, 20), ("/products", 2, 50), ("/recommendations", 3, 60),
};
int remaining = capacity;
foreach (var r in incoming.OrderBy(r => r.Priority))
{
    int served = Math.Min(r.Count, remaining);
    remaining -= served;
    string rest = r.Count > served ? $", {r.Count - served} get 503 + Retry-After" : "";
    Console.WriteLine($"{r.Path,-17} served {served,3}/{r.Count}{rest}");
}`, "/checkout         served  40/40\n/login            served  20/20\n/products         served  40/50, 10 get 503 + Retry-After\n/recommendations  served   0/60, 60 get 503 + Retry-After")],
  },
  "Too many requests": {
    s: ["One customer keeps ringing the shop's bell every second, so others cannot get attention. The shopkeeper politely limits how often one person can ask. Rate limiting stops one client from overwhelming everyone else.", "এক ক্রেতা প্রতি সেকেন্ডে দোকানের ঘণ্টা বাজাচ্ছেন, ফলে অন্যরা মনোযোগ পান না। দোকানি ভদ্রভাবে সীমা দেন একজন কতবার জিজ্ঞেস করতে পারবেন। Rate limiting একজন client-কে বাকি সবাইকে অভিভূত করা থেকে থামায়।"],
    t: ["Identify who is sending the requests (logs by user, API key, IP, user agent). Distinguish bugs (a client retry loop), abuse (scraping, credential stuffing) and legitimate growth. Apply per-client limits with 429 and Retry-After, fix buggy clients (exponential backoff with jitter), block abusive sources at the WAF, and offer bulk endpoints or webhooks for legitimate heavy users.", "কে request পাঠাচ্ছে চিহ্নিত করুন (user, API key, IP, user agent অনুযায়ী log)। Bug (client-এর retry loop), অপব্যবহার (scraping, credential stuffing) ও বৈধ বৃদ্ধি আলাদা করুন। 429 ও Retry-After-সহ client-ভিত্তিক সীমা দিন, ত্রুটিপূর্ণ client ঠিক করুন (jitter-সহ exponential backoff), WAF-এ অপব্যবহারী উৎস আটকান, আর বৈধ ভারী user-কে bulk endpoint বা webhook দিন।"],
    p: [["Group request logs by client and find the top talkers.", "Client অনুযায়ী request log ভাগ করে সবচেয়ে বেশি পাঠানো খুঁজুন।"], ["Classify: bug, abuse or real demand.", "শ্রেণিবিভাগ: bug, অপব্যবহার নাকি আসল চাহিদা।"], ["Apply limits and fix or block the source.", "সীমা দিন এবং উৎস ঠিক করুন বা আটকান।"], ["Publish limits in API docs.", "API docs-এ সীমা প্রকাশ করুন।"]],
    m: ["Blocking whole mobile carriers by IP; retrying immediately without backoff; returning 500 instead of 429.", "IP দিয়ে পুরো mobile carrier আটকানো; backoff ছাড়া সাথে সাথে retry; 429-এর বদলে 500।"],
    q: ["Q: Why add jitter to exponential backoff? A: Without randomness, thousands of clients retry at the same moments and create synchronized waves; jitter spreads retries out.", "প্রশ্ন: Exponential backoff-এ jitter কেন? উত্তর: এলোমেলোতা ছাড়া হাজারো client একই মুহূর্তে retry করে এক তালে ঢেউ বানায়; jitter retry ছড়িয়ে দেয়।"],
    f: ["AI agents can call your API in tight loops. Publish clear limits, return machine-readable errors and consider an MCP server with built-in quotas for agent access.", "AI agent আপনার API দ্রুত loop-এ ডাকতে পারে। স্পষ্ট সীমা প্রকাশ করুন, machine-পাঠযোগ্য error দিন, আর agent-এর জন্য built-in quota-সহ MCP server বিবেচনা করুন।"],
    x: [sh("Find the top talkers in access logs · সবচেয়ে বেশি request কারা", `# Last 10 minutes of access logs: client key in field 3, path in field 7
tail -n 200000 /var/log/nginx/access.log | awk '{print $3}' | sort | uniq -c | sort -rn | head -3
# What is the top client calling?
grep "apikey=ak_9f2" /var/log/nginx/access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -2
# Response: rate-limit that key and contact the owner about a retry loop`, `  48211 ak_9f2
   1204 ak_13c
    988 ak_77a
  48190 /api/orders/status?id=A-1042
     21 /api/orders
# One client polls one order 80 times per second: a retry bug, not real demand`)],
  },
  "Read-heavy DB": {
    s: ["A notice board read by 1,000 students but updated by one teacher once a day. You make many photocopies of the notice instead of sending everyone to the one board. Read-heavy databases scale with copies and caches.", "একটি notice board ১,০০০ ছাত্র পড়ে কিন্তু একজন শিক্ষক দিনে একবার আপডেট করেন। সবাইকে একটি board-এ না পাঠিয়ে notice-এর অনেক photocopy করেন। পড়া-ভারী database কপি ও cache দিয়ে বাড়ে।"],
    t: ["With a 100:1 read/write ratio, add read replicas and route queries there, cache hot objects, use covering indexes, and create read models (denormalized tables or materialized views) shaped for each screen. CQRS formalizes separate write and read models. Watch replication lag and keep read-your-writes where users expect it.", "১০০:১ পড়া/লেখার অনুপাতে read replica যোগ করে query সেখানে পাঠান, গরম object cache করুন, covering index দিন, আর প্রতিটি screen-এর আকারে read model (denormalized table বা materialized view) বানান। CQRS আলাদা write ও read model আনুষ্ঠানিক করে। Replication lag নজরে রাখুন এবং user যেখানে আশা করে সেখানে read-your-writes রাখুন।"],
    p: [["Measure the read/write ratio and top read queries.", "পড়া/লেখার অনুপাত ও শীর্ষ পড়ার query মাপুন।"], ["Add a read replica and a read-only connection string.", "Read replica ও read-only connection string যোগ করুন।"], ["Cache hot entities.", "গরম entity cache করুন।"], ["Build read models for expensive screens.", "ব্যয়বহুল screen-এর জন্য read model বানান।"]],
    m: ["Sending all queries to the primary; replicas without monitoring lag; read models without a rebuild plan.", "সব query primary-তে পাঠানো; lag নজর ছাড়া replica; আবার বানানোর পরিকল্পনা ছাড়া read model।"],
    q: ["Q: How do you use replicas in EF Core? A: Register two DbContexts (or connection strings): a writable one for commands and a read-only one with NoTracking for queries; route by use case.", "প্রশ্ন: EF Core-এ replica কীভাবে ব্যবহার করবেন? উত্তর: দুটি DbContext (বা connection string) register করুন: command-এর জন্য লেখার যোগ্য আর query-র জন্য NoTracking-সহ read-only; ব্যবহার অনুযায়ী পাঠান।"],
    f: ["RAG systems are extremely read-heavy (millions of retrievals, few document updates). The same replica and caching techniques apply to vector stores.", "RAG system অত্যন্ত পড়া-ভারী (লক্ষ লক্ষ retrieval, অল্প document আপডেট)। Vector store-এও একই replica ও caching কৌশল প্রযোজ্য।"],
    x: [cs("Route reads and writes to different databases · পড়া ও লেখা আলাদা database-এ", `var router = new DbRouter(primary: "Host=db-primary", replicas: ["Host=db-replica-1", "Host=db-replica-2"]);
foreach (var (op, recentWrite) in new[] { ("SELECT products", false), ("UPDATE stock", false), ("SELECT my order", true), ("SELECT products", false) })
    Console.WriteLine($"{op,-16} -> {router.For(op, recentWrite)}");

class DbRouter(string primary, string[] replicas)
{
    private int next;
    public string For(string sql, bool userWroteRecently) =>
        !sql.StartsWith("SELECT") || userWroteRecently ? primary : replicas[next++ % replicas.Length];
}`, "SELECT products  -> Host=db-replica-1\nUPDATE stock     -> Host=db-primary\nSELECT my order  -> Host=db-primary\nSELECT products  -> Host=db-replica-2")],
  },
  "Write-heavy DB": {
    s: ["A toll plaza where thousands of cars pass per minute: writing each car in a paper ledger one by one would stop traffic. Instead, sensors count in batches and send summaries. Write-heavy systems batch, buffer and partition writes.", "Toll plaza, যেখানে মিনিটে হাজারো গাড়ি যায়: একে একে কাগজের খাতায় লিখলে traffic থেমে যেত। তার বদলে sensor batch-এ গুনে সারাংশ পাঠায়। লেখা-ভারী system লেখা batch, buffer ও partition করে।"],
    t: ["Techniques: batch inserts and bulk copy, queues to smooth bursts, fewer indexes on hot tables, append-only designs (event logs), partitioning tables by time, aggregating counters in memory or Redis and flushing periodically, and sharding by key when one primary cannot keep up. Use databases built for writes (time-series, wide-column) for telemetry-like data.", "কৌশল: batch insert ও bulk copy, হঠাৎ ভিড় মসৃণ করতে queue, গরম table-এ কম index, শুধু-যোগ design (event log), সময় অনুযায়ী table partition, memory বা Redis-এ counter জমিয়ে নিয়মিত flush, আর এক primary না পারলে key দিয়ে sharding। Telemetry-র মতো data-য় লেখার জন্য বানানো database (time-series, wide-column) ব্যবহার করুন।"],
    p: [["Measure writes per second and the slowest write path.", "সেকেন্ডে লেখা ও সবচেয়ে ধীর লেখার পথ মাপুন।"], ["Batch writes and wrap them in transactions.", "লেখা batch করে transaction-এ মোড়ান।"], ["Buffer bursts with a queue.", "Queue দিয়ে হঠাৎ ভিড় buffer করুন।"], ["Partition or shard hot tables.", "গরম table partition বা shard করুন।"]],
    m: ["One transaction per row; incrementing a single 'views' row from every request (lock contention); many indexes on an insert-heavy table.", "প্রতি row-এ একটি transaction; প্রতি request থেকে একটি 'views' row বাড়ানো (lock contention); insert-ভারী table-এ অনেক index।"],
    q: ["Q: A page-view counter row becomes a hotspot. Fix? A: Count in memory or Redis (INCR) and flush to the database every few seconds, or write append-only events and aggregate asynchronously.", "প্রশ্ন: Page-view counter row hotspot হয়ে গেছে। সমাধান? উত্তর: Memory বা Redis-এ (INCR) গুনে কয়েক সেকেন্ড পরপর database-এ flush করুন, বা শুধু-যোগ event লিখে asynchronous-ভাবে aggregate করুন।"],
    f: ["AI telemetry (token usage, traces, feedback) is write-heavy. Store it in a system built for that instead of your main OLTP database.", "AI telemetry (token ব্যবহার, trace, feedback) লেখা-ভারী। মূল OLTP database-এর বদলে এর জন্য বানানো system-এ রাখুন।"],
    x: [cs("Row-by-row vs batched transaction · একে একে বনাম batch", `using System.Diagnostics;
using Microsoft.Data.Sqlite;

using var db = new SqliteConnection("Data Source=file:demo?mode=memory&cache=shared");
db.Open();
new SqliteCommand("CREATE TABLE Events(Id INTEGER PRIMARY KEY, Name TEXT)", db).ExecuteNonQuery();

double Insert(int n, bool batched)
{
    var sw = Stopwatch.StartNew();
    SqliteTransaction? tx = batched ? db.BeginTransaction() : null;
    var cmd = new SqliteCommand("INSERT INTO Events(Name) VALUES ($n)", db, tx);
    var p = cmd.Parameters.Add("$n", SqliteType.Text);
    for (int i = 0; i < n; i++)
    {
        if (!batched) { using var t = db.BeginTransaction(); cmd.Transaction = t; p.Value = $"e{i}"; cmd.ExecuteNonQuery(); t.Commit(); }
        else { p.Value = $"e{i}"; cmd.ExecuteNonQuery(); }
    }
    tx?.Commit();
    return sw.Elapsed.TotalMilliseconds;
}
double single = Insert(20_000, batched: false), batch = Insert(20_000, batched: true);
Console.WriteLine($"rows: {new SqliteCommand("SELECT COUNT(*) FROM Events", db).ExecuteScalar()}");
Console.WriteLine($"batched is faster: {batch < single}");`, "rows: 40000\nbatched is faster: True", ["Microsoft.Data.Sqlite"])],
  },
  "Large payloads / high bandwidth": {
    s: ["Moving house by carrying every item yourself, one trip each, versus packing boxes and hiring a truck. Large responses need packing (compression), only the needed boxes (fields) and the right truck (streaming/CDN).", "প্রতিটি জিনিস নিজে একবারে একটি করে বয়ে বাসা বদল বনাম বাক্সে ভরে truck ভাড়া। বড় response-এ প্যাকিং (compression), শুধু দরকারি বাক্স (field) ও সঠিক truck (streaming/CDN) লাগে।"],
    t: ["Reduce bytes: return only needed fields (DTOs, sparse fieldsets), paginate lists, compress (Brotli/gzip), use efficient formats (protobuf/gRPC for service-to-service), stream large results (IAsyncEnumerable), offload files to blob storage + CDN, and use ETags/If-None-Match so unchanged data returns 304.", "Byte কমান: শুধু দরকারি field দিন (DTO, sparse fieldset), তালিকা paginate করুন, compress করুন (Brotli/gzip), দক্ষ format ব্যবহার করুন (service-থেকে-service-এ protobuf/gRPC), বড় ফল stream করুন (IAsyncEnumerable), file blob storage + CDN-এ দিন, আর ETag/If-None-Match ব্যবহার করুন যাতে অপরিবর্তিত data 304 দেয়।"],
    p: [["Measure response sizes per endpoint.", "Endpoint-প্রতি response-এর আকার মাপুন।"], ["Trim fields with DTOs and paginate.", "DTO দিয়ে field ছাঁটুন এবং paginate করুন।"], ["Enable response compression.", "Response compression চালু করুন।"], ["Add ETags and stream big exports.", "ETag যোগ করুন এবং বড় export stream করুন।"]],
    m: ["Returning entire entities with navigation properties; base64 files inside JSON; no pagination on admin exports.", "Navigation property-সহ পুরো entity ফেরত; JSON-এর ভিতরে base64 file; admin export-এ pagination নেই।"],
    q: ["Q: How does an ETag save bandwidth? A: The server sends a version tag; the client sends it back in If-None-Match; if nothing changed, the server returns 304 with no body.", "প্রশ্ন: ETag কীভাবে bandwidth বাঁচায়? উত্তর: Server একটি version tag পাঠায়; client If-None-Match-এ ফেরত পাঠায়; কিছু না বদলালে server body ছাড়া 304 দেয়।"],
    f: ["AI context windows are a bandwidth problem too: send models only the fields they need. Smaller prompts are cheaper, faster and often more accurate.", "AI context window-ও bandwidth সমস্যা: model-কে শুধু দরকারি field পাঠান। ছোট prompt সস্তা, দ্রুত এবং প্রায়ই বেশি নির্ভুল।"],
    x: [cs("DTO trimming and ETag 304 · DTO ছাঁটা ও ETag", `using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

var full = new { id = 7, name = "Rice 5kg", description = new string('x', 2000), supplierNotes = new string('y', 1500), price = 520, stock = 33 };
var dto = new { full.id, full.name, full.price, full.stock };
int fullBytes = JsonSerializer.SerializeToUtf8Bytes(full).Length, dtoBytes = JsonSerializer.SerializeToUtf8Bytes(dto).Length;
Console.WriteLine($"full entity: {fullBytes} bytes, DTO: {dtoBytes} bytes");

string ETag(object o) => "\\"" + Convert.ToHexString(SHA256.HashData(JsonSerializer.SerializeToUtf8Bytes(o)))[..12] + "\\"";
string etag = ETag(dto);
string Get(string? ifNoneMatch) => ifNoneMatch == ETag(dto) ? "304 Not Modified (0 bytes)" : $"200 OK ({dtoBytes} bytes) ETag {etag}";
Console.WriteLine("first request:  " + Get(null).Split(" ETag")[0]);
Console.WriteLine("second request: " + Get(etag));`, "full entity: 3585 bytes, DTO: 49 bytes\nfirst request:  200 OK (49 bytes)\nsecond request: 304 Not Modified (0 bytes)")],
  },
  "Long-running tasks": {
    s: ["You drop clothes at a laundry and get a receipt; you do not stand at the counter for two hours. Long-running work should return a receipt (job ID) immediately and finish in the background.", "Laundry-তে কাপড় দিয়ে রসিদ নেন; দুই ঘণ্টা কাউন্টারে দাঁড়িয়ে থাকেন না। দীর্ঘ কাজ সাথে সাথে রসিদ (job ID) দিয়ে পিছনে শেষ হওয়া উচিত।"],
    t: ["HTTP requests should finish in seconds. For reports, video processing, imports or AI batch jobs: accept with 202 and a job ID, enqueue the work, process in a background worker, store progress, and let clients poll a status endpoint, receive a webhook, or get a push notification. Make jobs idempotent, resumable and cancellable.", "HTTP request কয়েক সেকেন্ডে শেষ হওয়া উচিত। Report, video processing, import বা AI batch job-এ: job ID-সহ 202 দিয়ে গ্রহণ করুন, কাজ queue-তে দিন, background worker-এ প্রক্রিয়া করুন, অগ্রগতি রাখুন, আর client-কে status endpoint poll, webhook বা push notification পেতে দিন। Job idempotent, পুনরায় শুরুযোগ্য ও বাতিলযোগ্য করুন।"],
    p: [["Return 202 Accepted with a status URL.", "Status URL-সহ 202 Accepted দিন।"], ["Persist the job and enqueue it.", "Job সংরক্ষণ করে queue-তে দিন।"], ["Process in a worker, updating progress.", "Worker-এ প্রক্রিয়া করুন, অগ্রগতি আপডেট করুন।"], ["Notify on completion; clean up old jobs.", "শেষ হলে জানান; পুরনো job পরিষ্কার করুন।"]],
    m: ["Increasing HTTP timeouts to 10 minutes; running jobs inside the web process with Task.Run; no progress or retry; losing jobs on deploy.", "HTTP timeout ১০ মিনিটে বাড়ানো; web process-এর ভিতরে Task.Run দিয়ে job চালানো; অগ্রগতি বা retry নেই; deploy-এ job হারানো।"],
    q: ["Q: How do you make a long import resumable? A: Process in chunks, record the last completed chunk in the job state, and on restart continue from there; make each chunk idempotent.", "প্রশ্ন: দীর্ঘ import কীভাবে পুনরায় শুরুযোগ্য করবেন? উত্তর: Chunk-এ প্রক্রিয়া করুন, job state-এ শেষ সম্পন্ন chunk লিখুন, আর restart-এ সেখান থেকে চালান; প্রতিটি chunk idempotent রাখুন।"],
    f: ["AI agents that take minutes (research, code changes) follow this same job pattern with progress streaming and human approval steps.", "কয়েক মিনিট নেওয়া AI agent (গবেষণা, code পরিবর্তন) অগ্রগতি streaming ও মানুষের অনুমোদনের ধাপসহ একই job pattern মানে।"],
    x: [cs("Resumable chunked job with progress · অগ্রগতিসহ পুনরায় শুরুযোগ্য job", `var job = new Job("import-customers", TotalChunks: 5);
void Run(Job j, int crashAt)
{
    for (int chunk = j.Done + 1; chunk <= j.TotalChunks; chunk++)
    {
        if (chunk == crashAt) { Console.WriteLine($"  worker crashed at chunk {chunk}"); return; }
        j.Done = chunk;                                   // persisted after each chunk
        Console.WriteLine($"  chunk {chunk} done ({j.Done * 100 / j.TotalChunks}%)");
    }
    Console.WriteLine($"  {j.Name} completed");
}
Console.WriteLine("POST /imports -> 202 Accepted, Location: /jobs/import-customers");
Run(job, crashAt: 3);
Console.WriteLine("worker restarted, resuming from saved progress:");
Run(job, crashAt: -1);

record Job(string Name, int TotalChunks) { public int Done { get; set; } }`, "POST /imports -> 202 Accepted, Location: /jobs/import-customers\n  chunk 1 done (20%)\n  chunk 2 done (40%)\n  worker crashed at chunk 3\nworker restarted, resuming from saved progress:\n  chunk 3 done (60%)\n  chunk 4 done (80%)\n  chunk 5 done (100%)\n  import-customers completed")],
  },
  "Temporary failures": {
    s: ["You call a friend and the line is busy. You do not give up forever, and you do not redial 100 times a second. You wait a bit, try again, wait longer, and stop after a few tries. That is retry with backoff.", "বন্ধুকে ফোন করলেন, লাইন ব্যস্ত। চিরকালের জন্য হাল ছাড়েন না, আবার সেকেন্ডে ১০০ বার ফোনও করেন না। একটু অপেক্ষা করে আবার চেষ্টা, আরও বেশি অপেক্ষা, কয়েকবার পরে থামা। এটাই backoff-সহ retry।"],
    t: ["Transient failures (timeouts, 503, 429, connection resets, deadlocks) often succeed on retry. Retry only safe operations (GET, or writes with idempotency keys), use exponential backoff with jitter, cap attempts and total time, respect Retry-After, and combine with timeouts and circuit breakers. In .NET use Microsoft.Extensions.Http.Resilience (AddStandardResilienceHandler) or Polly.", "ক্ষণস্থায়ী ব্যর্থতা (timeout, 503, 429, connection reset, deadlock) retry-এ প্রায়ই সফল হয়। শুধু নিরাপদ কাজ retry করুন (GET, বা idempotency key-সহ লেখা), jitter-সহ exponential backoff দিন, চেষ্টা ও মোট সময় সীমিত করুন, Retry-After মানুন, আর timeout ও circuit breaker-এর সাথে মেলান। .NET-এ Microsoft.Extensions.Http.Resilience (AddStandardResilienceHandler) বা Polly ব্যবহার করুন।"],
    p: [["Classify errors as transient or permanent.", "Error-কে ক্ষণস্থায়ী বা স্থায়ী শ্রেণিতে ফেলুন।"], ["Retry transient ones with backoff + jitter.", "ক্ষণস্থায়ীগুলো backoff + jitter দিয়ে retry করুন।"], ["Cap attempts and total duration.", "চেষ্টা ও মোট সময় সীমিত করুন।"], ["Log retries and alert if they spike.", "Retry log করুন এবং বাড়লে alert দিন।"]],
    m: ["Retrying 400 errors or non-idempotent POSTs; retries at every layer multiplying load (client × gateway × service); no jitter.", "400 error বা non-idempotent POST retry; প্রতিটি স্তরে retry load গুণ করে (client × gateway × service); jitter নেই।"],
    q: ["Q: Why can retries make an outage worse? A: A struggling service receives the original traffic plus retries; with 3 layers retrying 3 times, load can grow 27x. Use budgets, backoff and circuit breakers.", "প্রশ্ন: Retry কেন বিভ্রাট আরও খারাপ করতে পারে? উত্তর: কষ্টে থাকা service মূল traffic ও retry দুটোই পায়; ৩ স্তরে ৩ বার retry হলে load ২৭ গুণ হতে পারে। Budget, backoff ও circuit breaker দিন।"],
    f: ["Model APIs regularly return 429 and 5xx during peak hours. Production AI code always wraps calls with retries, timeouts and fallbacks.", "Model API ব্যস্ত সময়ে নিয়মিত 429 ও 5xx দেয়। Production AI code সবসময় call-কে retry, timeout ও fallback দিয়ে মোড়ায়।"],
    x: [cs("Exponential backoff with jitter and a cap · jitter ও সীমাসহ backoff", `var rng = new Random(7);
int calls = 0;
Task<string> Flaky() => ++calls < 4 ? throw new HttpRequestException("503 Service Unavailable") : Task.FromResult("200 OK");

async Task<string> WithRetry(Func<Task<string>> op, int maxAttempts = 5, int baseMs = 100)
{
    for (int attempt = 1; ; attempt++)
    {
        try { return await op(); }
        catch (HttpRequestException e) when (attempt < maxAttempts)
        {
            int capped = Math.Min(baseMs * (1 << (attempt - 1)), 2000);
            int delay = rng.Next(capped / 2, capped + 1);      // jitter
            Console.WriteLine($"attempt {attempt} failed ({e.Message}); waiting {delay >= capped / 2} ~{capped} ms");
            await Task.Delay(delay / 10);                       // shortened for the demo
        }
    }
}
Console.WriteLine(await WithRetry(Flaky));
Console.WriteLine($"total calls: {calls}");`, "attempt 1 failed (503 Service Unavailable); waiting True ~100 ms\nattempt 2 failed (503 Service Unavailable); waiting True ~200 ms\nattempt 3 failed (503 Service Unavailable); waiting True ~400 ms\n200 OK\ntotal calls: 4")],
  },
  "Duplicate requests": {
    s: ["You press the lift button five times; the lift still comes once. Payment buttons should work the same way: pressing 'Pay' twice must charge once. That property is idempotency.", "Lift-এর বোতাম পাঁচবার চাপলেও lift একবারই আসে। Payment বোতামও এমন হওয়া উচিত: 'Pay' দুবার চাপলে একবারই টাকা কাটবে। এই গুণটি idempotency।"],
    t: ["Duplicates come from double clicks, client retries after timeouts and at-least-once message delivery. The client sends an Idempotency-Key header (a UUID per logical operation); the server stores the key with the result and returns the same result for repeats. Unique constraints in the database are the final safety net. Consumers of queues deduplicate by message ID.", "Duplicate আসে double click, timeout-এর পরে client retry ও at-least-once message delivery থেকে। Client একটি Idempotency-Key header পাঠায় (প্রতি যৌক্তিক কাজে একটি UUID); server key ও ফল রাখে এবং পুনরাবৃত্তিতে একই ফল দেয়। Database-এর unique constraint শেষ নিরাপত্তা জাল। Queue-র consumer message ID দিয়ে duplicate বাদ দেয়।"],
    p: [["Generate an idempotency key on the client per operation.", "Client-এ প্রতি কাজে idempotency key বানান।"], ["Store key -> result on the server with a TTL.", "Server-এ TTL-সহ key -> ফল রাখুন।"], ["Return the stored result for repeats.", "পুনরাবৃত্তিতে সংরক্ষিত ফল দিন।"], ["Add unique constraints on business keys.", "Business key-তে unique constraint দিন।"]],
    m: ["Generating a new key on every retry (defeats the purpose); checking then inserting without a transaction (race); disabling the button as the only protection.", "প্রতি retry-এ নতুন key বানানো (উদ্দেশ্য ব্যর্থ); transaction ছাড়া যাচাই তারপর insert (race); একমাত্র সুরক্ষা হিসেবে বোতাম বন্ধ করা।"],
    q: ["Q: The client timed out waiting for 'create order'. Is it safe to retry? A: Only with the same idempotency key; then the server either finishes the first attempt's result or returns it, never creating a second order.", "প্রশ্ন: 'Create order'-এর অপেক্ষায় client-এর timeout হয়েছে। Retry নিরাপদ? উত্তর: শুধু একই idempotency key-সহ; তাহলে server হয় প্রথম চেষ্টার ফল শেষ করে বা ফেরত দেয়, কখনো দ্বিতীয় order বানায় না।"],
    f: ["AI agents retry tool calls when they are unsure. Make every tool that changes data idempotent, or agents will create duplicates.", "AI agent অনিশ্চিত হলে tool call retry করে। Data বদলানো প্রতিটি tool idempotent করুন, নইলে agent duplicate বানাবে।"],
    x: [cs("Idempotency keys for payments · payment-এ idempotency key", `var results = new Dictionary<string, string>();
int charges = 0;
string Pay(string idempotencyKey, decimal amount)
{
    lock (results)
    {
        if (results.TryGetValue(idempotencyKey, out var previous)) return previous + " (replayed)";
        charges++;
        var result = $"charged {amount} BDT, payment #{charges}";
        results[idempotencyKey] = result;
        return result;
    }
}
string key = "7d1f6c1e-checkout-A-7";                 // same key for every retry of this checkout
Console.WriteLine(Pay(key, 2400));
Console.WriteLine(Pay(key, 2400));                    // double click
Console.WriteLine(Pay(key, 2400));                    // retry after timeout
Console.WriteLine(Pay("9a0b-checkout-A-8", 650));
Console.WriteLine($"actual charges: {charges}");`, "charged 2400 BDT, payment #1\ncharged 2400 BDT, payment #1 (replayed)\ncharged 2400 BDT, payment #1 (replayed)\ncharged 650 BDT, payment #2\nactual charges: 2")],
  },
  "Failing services": {
    s: ["When the kitchen's oven breaks, a smart restaurant still serves salads and drinks and tells customers pizza is unavailable, instead of closing completely. Systems should degrade gracefully when a dependency fails.", "রান্নাঘরের oven ভাঙলে বুদ্ধিমান রেস্তোরাঁ পুরোপুরি বন্ধ না করে salad ও পানীয় পরিবেশন করে এবং জানায় pizza নেই। Dependency ব্যর্থ হলে system মার্জিতভাবে অবনমিত হওয়া উচিত।"],
    t: ["Protect against failing dependencies with timeouts (never wait forever), retries for transient errors, circuit breakers to fail fast, bulkheads (separate pools so one dependency cannot consume all threads/connections), and fallbacks (cached data, default values, queued work). Monitor dependency health separately and show clear partial-failure UI.", "ব্যর্থ dependency থেকে রক্ষায় timeout (কখনো অনন্ত অপেক্ষা নয়), ক্ষণস্থায়ী error-এ retry, দ্রুত ব্যর্থ হতে circuit breaker, bulkhead (আলাদা pool, যাতে একটি dependency সব thread/connection না খায়) আর fallback (cache-করা data, ডিফল্ট মান, queue-তে কাজ) দিন। Dependency-র স্বাস্থ্য আলাদাভাবে নজরে রাখুন এবং স্পষ্ট আংশিক-ব্যর্থতার UI দেখান।"],
    p: [["List dependencies and what happens if each fails.", "Dependency-র তালিকা ও প্রতিটি ব্যর্থ হলে কী হয় লিখুন।"], ["Add timeouts and circuit breakers to each client.", "প্রতিটি client-এ timeout ও circuit breaker দিন।"], ["Define a fallback per feature.", "প্রতি feature-এর জন্য fallback ঠিক করুন।"], ["Test by injecting failures (chaos testing).", "ব্যর্থতা ঢুকিয়ে test করুন (chaos testing)।"]],
    m: ["Default HttpClient timeout of 100 seconds; the whole page failing because recommendations failed; shared connection pools exhausted by one slow dependency.", "HttpClient-এর ডিফল্ট ১০০ সেকেন্ড timeout; recommendation ব্যর্থ হওয়ায় পুরো page ব্যর্থ; একটি ধীর dependency শেয়ার connection pool শেষ করে।"],
    q: ["Q: What is a bulkhead? A: Isolating resources per dependency (separate thread or connection limits) so a slow dependency can only exhaust its own share, like watertight compartments in a ship.", "প্রশ্ন: Bulkhead কী? উত্তর: Dependency অনুযায়ী resource আলাদা রাখা (আলাদা thread বা connection সীমা), যাতে ধীর dependency শুধু নিজের ভাগই শেষ করতে পারে, জাহাজের জলরোধী কক্ষের মতো।"],
    f: ["Treat AI providers as unreliable dependencies: timeouts, fallbacks to smaller models or cached answers, and a 'try again later' UI.", "AI provider-কে অনির্ভরযোগ্য dependency হিসেবে দেখুন: timeout, ছোট model বা cache-করা উত্তরে fallback, আর 'পরে আবার চেষ্টা করুন' UI।"],
    x: [cs("Timeout + fallback keeps the page working · timeout ও fallback-এ page চালু", `async Task<string> WithFallback(string name, Func<CancellationToken, Task<string>> call, string fallback, int timeoutMs)
{
    using var cts = new CancellationTokenSource(timeoutMs);
    try { return await call(cts.Token); }
    catch (Exception e) when (e is OperationCanceledException or HttpRequestException)
    {
        return $"{fallback} (fallback: {name} {(e is OperationCanceledException ? "timed out" : "failed")})";
    }
}

var page = await Task.WhenAll(
    WithFallback("prices", async ct => { await Task.Delay(50, ct); return "live prices"; }, "cached prices", 500),
    WithFallback("recommendations", async ct => { await Task.Delay(5000, ct); return "personal picks"; }, "popular items", 300),
    WithFallback("reviews", _ => throw new HttpRequestException("503"), "reviews hidden", 300));
foreach (var part in page) Console.WriteLine(part);`, "live prices\npopular items (fallback: recommendations timed out)\nreviews hidden (fallback: reviews failed)")],
  },
  "Single point of failure": {
    s: ["A building with one staircase: if it is blocked, nobody can leave. Fire codes require two. Any component without a backup is a single point of failure.", "একটি সিঁড়িসহ ভবন: বন্ধ হলে কেউ বের হতে পারে না। অগ্নি-নিয়মে দুটি লাগে। Backup ছাড়া যেকোনো অংশ single point of failure।"],
    t: ["Walk the request path and ask 'what if this dies?' for each box: DNS, load balancer, app servers, database, cache, queue, third-party APIs, the person with the only admin password. Add redundancy (multiple instances across availability zones), automatic failover, backups with tested restores, and documentation so people are not SPOFs either.", "Request-এর পথ ধরে প্রতিটি বাক্সে জিজ্ঞেস করুন 'এটি মরলে কী হবে?': DNS, load balancer, app server, database, cache, queue, third-party API, একমাত্র admin password-জানা মানুষ। Redundancy (availability zone জুড়ে একাধিক instance), স্বয়ংক্রিয় failover, পরীক্ষিত restore-সহ backup আর documentation দিন, যাতে মানুষও SPOF না হয়।"],
    p: [["Draw the architecture and mark each component.", "Architecture এঁকে প্রতিটি অংশ চিহ্নিত করুন।"], ["For each, list the failure impact and recovery.", "প্রতিটির ব্যর্থতার প্রভাব ও পুনরুদ্ধার লিখুন।"], ["Add redundancy for high-impact ones first.", "বেশি প্রভাবেরগুলোতে আগে redundancy দিন।"], ["Run failover drills.", "Failover অনুশীলন করুন।"]],
    m: ["Two app servers but one database; replicas in the same zone; a single deploy pipeline or person who knows production.", "দুটি app server কিন্তু একটি database; একই zone-এ replica; production জানা একমাত্র deploy pipeline বা মানুষ।"],
    q: ["Q: Your app runs on 3 servers in one data center. Is it highly available? A: Not against data-center failures; spread across at least two availability zones and make the database and load balancer redundant too.", "প্রশ্ন: আপনার app একটি data center-এ ৩টি server-এ চলে। এটি কি highly available? উত্তর: Data center ব্যর্থতার বিরুদ্ধে নয়; অন্তত দুটি availability zone-এ ছড়িয়ে দিন এবং database ও load balancer-ও redundant করুন।"],
    f: ["Depending on a single AI provider is a SPOF. Abstractions like IChatClient make a secondary provider realistic.", "একটি AI provider-এর উপর নির্ভরতা SPOF। IChatClient-এর মতো abstraction দ্বিতীয় provider বাস্তবসম্মত করে।"],
    x: [cs("Availability with and without redundancy · redundancy-সহ ও ছাড়া availability", `double one = 0.99;                               // one instance up 99% of the time
double Redundant(double a, int copies) => 1 - Math.Pow(1 - a, copies);
double MinutesDown(double a) => (1 - a) * 30 * 24 * 60;

foreach (int n in new[] { 1, 2, 3 })
{
    double a = Redundant(one, n);
    Console.WriteLine($"{n} instance(s): {a * 100:0.0000}% up, ~{MinutesDown(a):0.0} min down/month");
}
Console.WriteLine("(assumes failures are independent: put copies in different zones)");`, "1 instance(s): 99.0000% up, ~432.0 min down/month\n2 instance(s): 99.9900% up, ~4.3 min down/month\n3 instance(s): 99.9999% up, ~0.0 min down/month\n(assumes failures are independent: put copies in different zones)")],
  },
  "Too many DB connections": {
    s: ["A bank branch has 20 counters. If 500 customers each insist on their own counter, chaos. They should queue and reuse counters. Database connections are counters: limited and expensive.", "একটি ব্যাংক শাখায় ২০টি কাউন্টার। ৫০০ ক্রেতা প্রত্যেকে নিজের কাউন্টার চাইলে বিশৃঙ্খলা। তাদের লাইনে দাঁড়িয়ে কাউন্টার পুনর্ব্যবহার করা উচিত। Database connection হলো কাউন্টার: সীমিত ও ব্যয়বহুল।"],
    t: ["Each database has a maximum number of connections, and each connection uses memory. Errors like 'too many connections' or pool timeouts come from leaks (not disposing DbContext/connections), long transactions, too many app instances × pool size, or slow queries holding connections. Fixes: always dispose (using / DI scopes), keep transactions short, size pools deliberately, and use a pooler like PgBouncer for many instances or serverless functions.", "প্রতিটি database-এর সর্বোচ্চ connection সংখ্যা থাকে, আর প্রতিটি connection memory নেয়। 'too many connections' বা pool timeout-এর মতো error আসে leak (DbContext/connection dispose না করা), দীর্ঘ transaction, অনেক app instance × pool-এর আকার, বা connection ধরে রাখা ধীর query থেকে। সমাধান: সবসময় dispose (using / DI scope), transaction ছোট রাখা, সচেতনভাবে pool-এর আকার, আর অনেক instance বা serverless function-এ PgBouncer-এর মতো pooler।"],
    p: [["Check active connections and who holds them.", "সক্রিয় connection ও কে ধরে রেখেছে দেখুন।"], ["Find leaks: connections not disposed or long transactions.", "Leak খুঁজুন: dispose না করা connection বা দীর্ঘ transaction।"], ["Compute instances × pool size vs DB max.", "Instance × pool-এর আকার বনাম DB-র সর্বোচ্চ হিসাব করুন।"], ["Add a pooler and alerts on connection usage.", "Pooler ও connection ব্যবহারে alert দিন।"]],
    m: ["Creating DbContext manually without disposing; a singleton DbContext; autoscaling app servers to 50 instances with pool size 100 each against a DB limit of 500.", "Dispose ছাড়া হাতে DbContext বানানো; singleton DbContext; DB-র ৫০০ সীমার বিরুদ্ধে ১০০ pool-আকারের ৫০টি instance-এ autoscale।"],
    q: ["Q: 20 app instances, max pool 100 each, DB max_connections 300. Risk? A: Up to 2,000 connections could be requested; lower pool size per instance (e.g., 10-15) or put PgBouncer in front.", "প্রশ্ন: ২০টি app instance, প্রতিটিতে সর্বোচ্চ pool ১০০, DB max_connections ৩০০। ঝুঁকি? উত্তর: ২,০০০ পর্যন্ত connection চাওয়া হতে পারে; instance-প্রতি pool কমান (যেমন ১০-১৫) বা সামনে PgBouncer দিন।"],
    f: ["Serverless and AI agent workloads can spawn many short-lived workers. Connection poolers and data APIs are essential patterns for them.", "Serverless ও AI agent workload অনেক স্বল্পজীবী worker তৈরি করতে পারে। তাদের জন্য connection pooler ও data API অপরিহার্য pattern।"],
    x: [cs("Connection budget across instances · instance জুড়ে connection budget", `int dbMax = 300, reservedForAdmin = 20;
foreach (int instances in new[] { 4, 10, 20 })
{
    int perInstance = (dbMax - reservedForAdmin) / instances;
    string verdict = perInstance < 5 ? "too small -> add PgBouncer" : "ok";
    Console.WriteLine($"{instances,2} instances -> Max Pool Size={perInstance,3} each ({verdict})");
}
Console.WriteLine("Connection string: Host=db;Database=shop;Maximum Pool Size=14;Timeout=5;Command Timeout=30");`, " 4 instances -> Max Pool Size= 70 each (ok)\n10 instances -> Max Pool Size= 28 each (ok)\n20 instances -> Max Pool Size= 14 each (ok)\nConnection string: Host=db;Database=shop;Maximum Pool Size=14;Timeout=5;Command Timeout=30")],
  },
  "Slow search": {
    s: ["Finding every book that mentions 'monsoon' by reading every page in the library, versus checking the library's subject index. Slow search usually means the system is reading everything.", "Library-র প্রতিটি পাতা পড়ে 'বর্ষা' উল্লেখ থাকা সব বই খোঁজা, বনাম library-র বিষয়-সূচি দেখা। ধীর search মানে সাধারণত system সবকিছু পড়ছে।"],
    t: ["LIKE '%term%' scans every row and cannot rank results. Use full-text search (PostgreSQL tsvector + GIN index, SQL Server full-text) or a search engine (Elasticsearch/OpenSearch, Meilisearch) for relevance ranking, stemming, typo tolerance and facets. Keep the index updated via events or change data capture. For meaning-based search, add vector search (hybrid).", "LIKE '%term%' প্রতিটি row scan করে এবং ফল rank করতে পারে না। প্রাসঙ্গিকতা ranking, stemming, typo সহনশীলতা ও facet-এর জন্য full-text search (PostgreSQL tsvector + GIN index, SQL Server full-text) বা search engine (Elasticsearch/OpenSearch, Meilisearch) ব্যবহার করুন। Event বা change data capture দিয়ে index হালনাগাদ রাখুন। অর্থভিত্তিক search-এর জন্য vector search যোগ করুন (hybrid)।"],
    p: [["Measure the current search query and plan.", "বর্তমান search query ও plan মাপুন।"], ["Add a full-text index (or a search engine).", "Full-text index (বা search engine) যোগ করুন।"], ["Rank by relevance; add filters/facets.", "প্রাসঙ্গিকতায় rank করুন; filter/facet দিন।"], ["Sync the index from writes asynchronously.", "লেখা থেকে asynchronous-ভাবে index sync করুন।"]],
    m: ["Leading-wildcard LIKE on millions of rows; searching on every keystroke without debouncing; letting the search index drift out of sync silently.", "লক্ষ লক্ষ row-এ শুরুর wildcard-সহ LIKE; debounce ছাড়া প্রতিটি keystroke-এ search; search index নীরবে অমিল হতে দেওয়া।"],
    q: ["Q: How do you keep Elasticsearch in sync with the database? A: Publish change events (outbox or CDC like Debezium) and have an indexer update documents; run periodic reconciliation for safety.", "প্রশ্ন: Elasticsearch-কে database-এর সাথে কীভাবে মিলিয়ে রাখবেন? উত্তর: পরিবর্তনের event প্রকাশ করুন (outbox বা Debezium-এর মতো CDC) এবং indexer document আপডেট করুক; নিরাপত্তার জন্য নিয়মিত মেলানো চালান।"],
    f: ["Search is becoming 'ask a question'. Hybrid keyword + vector search, plus an AI answer with citations, is the modern search experience.", "Search হয়ে উঠছে 'প্রশ্ন করা'। Hybrid keyword + vector search, সাথে উৎসসহ AI উত্তর, আধুনিক search অভিজ্ঞতা।"],
    x: [cs("Inverted index vs scanning everything · inverted index বনাম পুরো scan", `string[] docs =
[
    "monsoon rain floods dhaka streets",
    "winter fog delays flights",
    "heavy monsoon rain in sylhet",
    "summer heat wave in rajshahi",
];
int scanned = 0;
var scanHits = docs.Where((d, i) => { scanned++; return d.Contains("monsoon"); }).ToList();

var index = new Dictionary<string, List<int>>();
for (int i = 0; i < docs.Length; i++)
    foreach (var w in docs[i].Split(' ')) (index.TryGetValue(w, out var l) ? l : index[w] = []).Add(i);

var both = index["monsoon"].Intersect(index["rain"]).ToList();
Console.WriteLine($"scan: read {scanned} documents, found {scanHits.Count}");
Console.WriteLine($"index: 'monsoon' -> docs [{string.Join(",", index["monsoon"])}] without reading text");
Console.WriteLine($"index: 'monsoon AND rain' -> docs [{string.Join(",", both)}]");`, "scan: read 4 documents, found 2\nindex: 'monsoon' -> docs [0,2] without reading text\nindex: 'monsoon AND rain' -> docs [0,2]")],
  },
  "Users far away": {
    s: ["A pizza shop in Dhaka delivering to customers in London: no matter how fast the cook, the pizza is cold. Distance itself adds time. For far-away users, you bring the kitchen closer.", "ঢাকার pizza দোকান London-এর ক্রেতাকে পৌঁছে দিচ্ছে: রাঁধুনি যত দ্রুতই হোক, pizza ঠান্ডা। দূরত্ব নিজেই সময় যোগ করে। দূরের user-এর জন্য রান্নাঘর কাছে আনেন।"],
    t: ["Light in fibre covers about 200 km per millisecond, so Dhaka to Europe adds ~150 ms per round trip, and a page needing 10 sequential round trips feels slow. Fixes: CDN for static content and cacheable APIs, edge TLS termination, fewer round trips (batch APIs, HTTP/2/3), regional deployments with geo-routing, and read replicas near users. Writes may still go to a home region.", "Fibre-এ আলো প্রতি millisecond-এ প্রায় ২০০ km যায়, তাই ঢাকা থেকে ইউরোপ প্রতি round trip-এ ~১৫০ ms যোগ করে, আর ১০টি ক্রমিক round trip লাগা page ধীর লাগে। সমাধান: static content ও cache-যোগ্য API-তে CDN, edge-এ TLS শেষ, কম round trip (batch API, HTTP/2/3), geo-routing-সহ regional deployment আর user-এর কাছে read replica। লেখা এখনো home region-এ যেতে পারে।"],
    p: [["Measure latency by country (RUM data).", "দেশ অনুযায়ী latency মাপুন (RUM data)।"], ["Put static assets and cacheable APIs on a CDN.", "Static asset ও cache-যোগ্য API CDN-এ দিন।"], ["Reduce round trips per page.", "Page-প্রতি round trip কমান।"], ["Deploy read paths in a second region if needed.", "দরকারে দ্বিতীয় region-এ পড়ার পথ deploy করুন।"]],
    m: ["Optimising server code while network latency dominates; chatty APIs with many small calls; multi-region writes without a conflict strategy.", "Network latency প্রধান হলেও server code optimise; অনেক ছোট call-সহ বাচাল API; conflict কৌশল ছাড়া multi-region লেখা।"],
    q: ["Q: A page makes 8 API calls one after another; users in the US see 2.5 s load times. Quick win? A: Combine into one aggregated call (BFF) or run them in parallel, and cache static parts at the edge.", "প্রশ্ন: একটি page একের পর এক ৮টি API call করে; US-এর user ২.৫ s load time দেখে। দ্রুত সমাধান? উত্তর: একটি aggregate call-এ মেলান (BFF) বা parallel-এ চালান, আর static অংশ edge-এ cache করুন।"],
    f: ["Bangladeshi startups increasingly serve global users. Latency budgets per region and edge deployment are practical, valuable skills.", "বাংলাদেশি startup ক্রমশ বিশ্বজুড়ে user-কে সেবা দিচ্ছে। Region-প্রতি latency budget ও edge deployment ব্যবহারিক, মূল্যবান দক্ষতা।"],
    x: [cs("Round trips dominate far-away latency · দূরে round trip-ই প্রধান", `var regions = new Dictionary<string, int> { ["Dhaka"] = 10, ["Singapore"] = 60, ["Frankfurt"] = 150, ["Virginia"] = 230 };   // RTT ms from server in Dhaka
int serverWorkMs = 40;
foreach (var (city, rtt) in regions)
{
    int chatty = 8 * rtt + serverWorkMs;        // 8 sequential calls
    int batched = 1 * rtt + serverWorkMs;       // one aggregated call
    int edge = 1 * 20 + serverWorkMs;           // served from a nearby edge/region
    Console.WriteLine($"{city,-9} chatty {chatty,4} ms | batched {batched,3} ms | nearby region {edge} ms");
}`, "Dhaka     chatty  120 ms | batched  50 ms | nearby region 60 ms\nSingapore chatty  520 ms | batched 100 ms | nearby region 60 ms\nFrankfurt chatty 1240 ms | batched 190 ms | nearby region 60 ms\nVirginia  chatty 1880 ms | batched 270 ms | nearby region 60 ms")],
  },
  "Data loss risk": {
    s: ["Keeping your only copy of family photos on one phone. One drop in the river and they are gone. Real protection is copies in different places that you have actually checked you can restore.", "পারিবারিক ছবির একমাত্র কপি একটি ফোনে রাখা। নদীতে একবার পড়লেই শেষ। আসল সুরক্ষা হলো ভিন্ন জায়গায় কপি, যা সত্যিই ফেরানো যায় বলে আপনি যাচাই করেছেন।"],
    t: ["Follow 3-2-1: three copies, two different media/services, one off-site (another region or account). Use automated backups plus point-in-time recovery, encrypt backups, protect them from deletion (immutability, separate credentials), and test restores regularly. Define RPO/RTO. Also prevent logical loss: soft deletes, migrations reviewed and reversible, and least-privilege access.", "3-2-1 মানুন: তিনটি কপি, দুটি ভিন্ন মাধ্যম/service, একটি অন্য জায়গায় (অন্য region বা account)। স্বয়ংক্রিয় backup ও point-in-time recovery দিন, backup encrypt করুন, মোছা থেকে রক্ষা করুন (immutability, আলাদা credential), আর নিয়মিত restore test করুন। RPO/RTO ঠিক করুন। যৌক্তিক ক্ষতিও আটকান: soft delete, review করা ও ফেরানো যায় এমন migration, আর least-privilege access।"],
    p: [["Enable automated backups and point-in-time recovery.", "স্বয়ংক্রিয় backup ও point-in-time recovery চালু করুন।"], ["Copy backups to another region/account.", "Backup অন্য region/account-এ কপি করুন।"], ["Restore into a test environment monthly.", "প্রতি মাসে test environment-এ restore করুন।"], ["Protect production from destructive commands.", "ধ্বংসাত্মক command থেকে production রক্ষা করুন।"]],
    m: ["Backups never restored; backups in the same account an attacker can delete; relying on replicas as backups; running migrations without a rollback plan.", "কখনো restore না করা backup; আক্রমণকারী মুছতে পারে এমন একই account-এ backup; replica-কে backup ভাবা; rollback পরিকল্পনা ছাড়া migration।"],
    q: ["Q: Someone ran DELETE without WHERE at 14:05. How do you recover? A: Point-in-time restore to 14:04 into a new database, export the deleted rows, re-insert them into production, then add safeguards.", "প্রশ্ন: কেউ ১৪:০৫-এ WHERE ছাড়া DELETE চালিয়েছে। কীভাবে ফেরাবেন? উত্তর: নতুন database-এ ১৪:০৪-এ point-in-time restore, মুছে যাওয়া row export, production-এ আবার insert, তারপর সুরক্ষা যোগ।"],
    f: ["AI agents with database access raise data-loss risk. Give them read-only roles, require approval for writes, and keep backups out of their reach.", "Database access-সহ AI agent data হারানোর ঝুঁকি বাড়ায়। তাদের read-only role দিন, লেখায় অনুমোদন লাগুক, আর backup তাদের নাগালের বাইরে রাখুন।"],
    x: [sh("Back up, restore and verify PostgreSQL · backup, restore ও যাচাই", `# Nightly logical backup (compressed, custom format)
pg_dump -Fc -d shop -f shop_$(date +%F).dump
# Copy off-site to another account/region (immutable bucket)
aws s3 cp shop_$(date +%F).dump s3://shop-backups-dr/ --storage-class STANDARD_IA
# Monthly drill: restore into a scratch database and check row counts
createdb shop_restore_test && pg_restore -d shop_restore_test shop_$(date +%F).dump
psql -d shop_restore_test -tAc "SELECT count(*) FROM orders"`, `upload: ./shop_2026-11-12.dump to s3://shop-backups-dr/shop_2026-11-12.dump
184233
# Matches production's order count from last night: the backup is usable`)],
  },
  "Production issues": {
    s: ["A hospital emergency: one doctor leads, others have clear roles, they stabilise the patient first and investigate the cause after. Incident response follows the same calm structure.", "হাসপাতালের জরুরি অবস্থা: একজন ডাক্তার নেতৃত্ব দেন, অন্যদের স্পষ্ট ভূমিকা, আগে রোগীকে স্থিতিশীল করেন, কারণ পরে খোঁজেন। Incident response একই শান্ত কাঠামো মানে।"],
    t: ["During an incident: declare it, assign an incident commander, communicate status regularly, mitigate first (roll back, disable a feature flag, scale up, fail over) and debug second. Use dashboards, logs and traces to narrow down what changed. Afterwards write a blameless postmortem: timeline, impact, root cause, what went well, and action items with owners.", "Incident-এর সময়: ঘোষণা করুন, একজন incident commander ঠিক করুন, নিয়মিত অবস্থা জানান, আগে প্রশমন (roll back, feature flag বন্ধ, scale up, fail over) আর পরে debug। কী বদলেছে সংকীর্ণ করতে dashboard, log ও trace ব্যবহার করুন। পরে দোষারোপহীন postmortem লিখুন: সময়রেখা, প্রভাব, মূল কারণ, কী ভালো হয়েছে, আর মালিকসহ করণীয়।"],
    p: [["Detect: alerts on symptoms users feel (errors, latency).", "শনাক্ত: user যে উপসর্গ অনুভব করে তাতে alert (error, latency)।"], ["Mitigate: roll back or disable the change.", "প্রশমন: পরিবর্তন roll back বা বন্ধ করুন।"], ["Communicate: status updates every 15-30 minutes.", "যোগাযোগ: প্রতি ১৫-৩০ মিনিটে অবস্থার আপডেট।"], ["Learn: blameless postmortem with action items.", "শিক্ষা: করণীয়-সহ দোষারোপহীন postmortem।"]],
    m: ["Debugging for an hour before rolling back; many people changing things at once; blaming individuals; no follow-up on action items.", "Roll back-এর আগে এক ঘণ্টা debug; একসাথে অনেকে জিনিস বদলানো; ব্যক্তিকে দোষারোপ; করণীয়ের অনুসরণ নেই।"],
    q: ["Q: Error rate jumped right after a deploy. First action? A: Roll back (or turn off the feature flag) to restore service, then investigate the diff and logs calmly.", "প্রশ্ন: Deploy-এর ঠিক পরে error হার বেড়ে গেছে। প্রথম কাজ? উত্তর: Service ফেরাতে roll back (বা feature flag বন্ধ), তারপর শান্তভাবে diff ও log তদন্ত।"],
    f: ["AI assistants now help summarise logs and draft postmortems during incidents. Use them to speed up analysis, but keep humans making the decisions.", "AI assistant এখন incident-এর সময় log সংক্ষেপ ও postmortem-এর খসড়ায় সাহায্য করে। বিশ্লেষণ দ্রুত করতে ব্যবহার করুন, কিন্তু সিদ্ধান্ত মানুষই নেবে।"],
    x: [cs("Detect a spike with an error-rate SLO alert · SLO alert দিয়ে spike ধরা", `var minutes = new (string Time, int Requests, int Errors)[]
{
    ("14:00", 6000, 6), ("14:01", 6100, 5), ("14:02", 5900, 7), ("14:03", 6050, 410), ("14:04", 6000, 520),
};
const double SloErrorRate = 0.01;     // alert if more than 1% of requests fail
foreach (var m in minutes)
{
    double rate = (double)m.Errors / m.Requests;
    string action = rate > SloErrorRate ? "PAGE ON-CALL -> roll back deploy 14:02" : "ok";
    Console.WriteLine($"{m.Time} error rate {rate * 100,5:0.00}%  {action}");
}`, "14:00 error rate  0.10%  ok\n14:01 error rate  0.08%  ok\n14:02 error rate  0.12%  ok\n14:03 error rate  6.78%  PAGE ON-CALL -> roll back deploy 14:02\n14:04 error rate  8.67%  PAGE ON-CALL -> roll back deploy 14:02")],
  },
};
