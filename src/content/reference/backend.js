const data = {};
function add(key, en, bn, a, b, de, db, kind = "ASP.NET Core program") {
  data[key] = {
    en,
    bn,
    decisionEn: de,
    decisionBn: db,
    examples: [
      {
        title: "Application implementation · অ্যাপের বড় উদাহরণ",
        language: "csharp",
        code: a,
        kind,
      },
      {
        title: "Companion pattern and verification · অন্য দিক ও যাচাই",
        language: "csharp",
        code: b,
        kind: "Reference example",
      },
    ],
  };
}
add(
  "REST APIs",
  "A resource-oriented API separates the identity of a resource from the operation performed on it. The server validates input and returns a status whose semantics clients can rely on. Creation should expose the new resource location. In-memory examples make request flow visible, but restart survival and cross-instance access require actual persistence.",
  "Resource-এর পরিচয় URL-এ, কাজ method-এ। Server input যাচাই করে অর্থপূর্ণ status দেয়। Create হলে নতুন resource-এর location দিন। Memory store-এ restart বা অন্য server-এ data থাকে না; বাস্তবে persistence আলাদা।",
  `using System.Collections.Concurrent;
var builder=WebApplication.CreateBuilder(args);
var app=builder.Build();
var products=new ConcurrentDictionary<Guid,Product>();
app.MapPost("/products",(CreateProduct input)=>{
    if(string.IsNullOrWhiteSpace(input.Name))return Results.BadRequest("Name required");
    var product=new Product(Guid.NewGuid(),input.Name.Trim());
    products[product.Id]=product;
    return Results.Created($"/products/{product.Id}",product);
});
app.MapGet("/products/{id:guid}",(Guid id)=>products.TryGetValue(id,out var p)?Results.Ok(p):Results.NotFound());
app.Run();
record CreateProduct(string Name);
record Product(Guid Id,string Name);`,
  `using var client=new HttpClient {BaseAddress=new Uri("http://localhost:5000")};
using var request=new HttpRequestMessage(HttpMethod.Get,"/products/00000000-0000-0000-0000-000000000001");
request.Headers.Accept.ParseAdd("application/json");
using var response=await client.SendAsync(request);
Console.WriteLine((int)response.StatusCode);
Console.WriteLine(await response.Content.ReadAsStringAsync());
// Set the address to the port printed by your running server.`,
  "Idempotency is about observable operation semantics, not whether every response is byte-identical. Treat POST retries explicitly when duplicate creation is costly.",
  "Idempotency মানে বারবার করলে effect-এর নিয়ম, একই response text নয়। Duplicate create ব্যয়বহুল হলে POST retry আলাদা সামলান।",
);
add(
  "HTTP and Status Codes",
  "Status codes help clients distinguish validation failures, missing resources, authentication challenges, permission denials, conflicts, throttling, and server errors. A stable structured problem body supplies a machine-readable code and safe human detail. Returning stack traces or raw exception messages to clients leaks implementation details.",
  "Status client-কে validation, missing, login, permission, conflict ও overload আলাদা করতে দেয়। Structured problem-এ স্থায়ী code ও নিরাপদ বার্তা দিন। Raw exception বা stack trace বাইরে নয়।",
  `var builder=WebApplication.CreateBuilder(args);
builder.Services.AddProblemDetails();
var app=builder.Build();
app.UseExceptionHandler();
app.MapGet("/orders/{id:int}",(int id)=>id<1
    ? Results.Problem(title:"Invalid order id",statusCode:400,extensions:new Dictionary<string,object?>{{"code","invalid_id"}})
    : Results.NotFound());
app.MapPost("/conflict",()=>Results.Conflict(new {Code="version_conflict"}));
app.Run();`,
  `using var client=new HttpClient();
using var response=await client.GetAsync("https://example.com/missing");
int status=(int)response.StatusCode;
if(status==404)Console.WriteLine("Resource missing");
else if(status==429)Console.WriteLine("Respect Retry-After and a bounded retry policy");
else if(status>=500)Console.WriteLine("Server failure; retry only when safe");
else Console.WriteLine($"Status {status}");`,
  "Use 409 for a state conflict rather than a generic 500 when the client can resolve it. Keep internal diagnostic detail in protected logs with a correlation identifier.",
  "Client মেটাতে পারে এমন state conflict-এ 409 উপযোগী। ভিতরের detail protected log-এ correlation id-সহ রাখুন।",
);
add(
  "Input Validation",
  "Validation has layers: transport parsing, field constraints, cross-field rules, domain invariants, and database constraints. Normalize only when the business meaning permits it. Validation errors should identify fields and rules without echoing sensitive input. A previously valid request can still fail at commit time due to a concurrent change.",
  "Parsing, field, cross-field, domain ও database—validation-এর স্তর আছে। অর্থ ঠিক থাকলেই normalize করুন। Error-এ field জানান, sensitive input নয়। আগে valid হলেও concurrent update-এ save ব্যর্থ হতে পারে।",
  `var builder=WebApplication.CreateBuilder(args);
var app=builder.Build();
app.MapPost("/bookings",(Booking b)=>{
    var errors=new Dictionary<string,string[]>();
    if(string.IsNullOrWhiteSpace(b.Name))errors["name"]=["Name is required"];
    if(b.End<=b.Start)errors["end"]=["End must be after start"];
    if(b.Guests is <1 or >10)errors["guests"]=["Guests must be 1–10"];
    return errors.Count>0?Results.ValidationProblem(errors):Results.Ok(new {Name=b.Name.Trim(),b.Guests});
});
app.Run();
record Booking(string Name,DateTime Start,DateTime End,int Guests);`,
  `bool ValidRange(DateTime start,DateTime end)=>end>start;
var cases=new[] {
    (Start:new DateTime(2026,1,1),End:new DateTime(2026,1,2),Expected:true),
    (Start:new DateTime(2026,1,1),End:new DateTime(2026,1,1),Expected:false)
};
foreach(var c in cases) {
    if(ValidRange(c.Start,c.End)!=c.Expected)throw new Exception("Boundary test failed");
}
Console.WriteLine("Range cases passed");`,
  "Validation does not establish ownership or permission. Enforce both domain constraints and authorization at the write boundary.",
  "Input ঠিক থাকা অনুমতি নয়। Write boundary-তে domain rule ও authorization দুটোই দিন।",
);
add(
  "Pagination",
  "Pagination needs a stable total order, bounded result size, and a continuation contract. Keyset pagination compares the compound ordering tuple, not just one nonunique field. A timestamp-plus-ID cursor preserves ties. Do not promise a consistent snapshot across pages unless the storage/query approach actually provides it.",
  "Stable ordering, সীমিত size ও continuation দরকার। একই timestamp-এ কয়েক row থাকলে timestamp+id cursor দিন। এক field-এ cursor দিলে row বাদ বা repeat হতে পারে। Snapshot-এর নিশ্চয়তা আলাদা চুক্তি।",
  `var builder=WebApplication.CreateBuilder(args);
var app=builder.Build();
var rows=Enumerable.Range(1,50).Select(id=>new Row(id,$"Item {id}")).ToArray();
app.MapGet("/items",(int? after,int? size)=>{
    int limit=Math.Clamp(size??10,1,20);
    var page=rows.Where(r=>r.Id>(after??0)).OrderBy(r=>r.Id).Take(limit).ToArray();
    int? next=page.Length==0?null:page[^1].Id;
    return Results.Ok(new {Items=page,NextCursor=next});
});
app.Run();
record Row(int Id,string Name);`,
  `// EF Core integration fragment: CreatedAt + Id form one ordering tuple.
var page=await db.Orders.AsNoTracking()
    .Where(o=>o.CreatedAt>cursorTime || (o.CreatedAt==cursorTime && o.Id>cursorId))
    .OrderBy(o=>o.CreatedAt).ThenBy(o=>o.Id)
    .Take(Math.Clamp(requestedSize,1,100))
    .Select(o=>new {o.Id,o.CreatedAt,o.Total})
    .ToListAsync(cancellationToken);
// Encode and validate both cursor fields; protect tenant filters too.`,
  "Treat a cursor as untrusted input. Bind it to the relevant filter/tenant context so it cannot change the authorization scope.",
  "Cursor অবিশ্বস্ত input। Filter ও tenant-এর context ঠিক রাখুন, যেন permission-এর সীমা না বদলায়।",
);
add(
  "API Versioning",
  "Compatibility is defined by consumer expectations, including field types, required properties, error codes, and behavioral meaning. Adding an optional field is often compatible; changing units under the same field name is not. Versioning needs a deprecation and migration policy, contract tests, and observed usage before retirement.",
  "Compatibility শুধু URL নয়; type, required field, error code ও অর্থও চুক্তি। Optional field যোগ হতে পারে, একই field-এর unit বদলানো ভাঙে। Version-এর সাথে migration, deprecation ও consumer test লাগবে।",
  `var builder=WebApplication.CreateBuilder(args);
var app=builder.Build();
var v1=app.MapGroup("/api/v1");
var v2=app.MapGroup("/api/v2");
v1.MapGet("/price",()=>new {Amount=100});
v2.MapGet("/price",()=>new {AmountMinor=10000,Currency="BDT"});
app.Run();
// Explicit groups illustrate contract separation without extra packages.`,
  `string json="{\"amountMinor\":10000,\"currency\":\"BDT\"}";
using var document=System.Text.Json.JsonDocument.Parse(json);
var root=document.RootElement;
if(!root.TryGetProperty("amountMinor",out var amount)||!amount.TryGetInt32(out _))
    throw new Exception("Contract changed");
if(root.GetProperty("currency").GetString()!="BDT")throw new Exception("Currency contract");
Console.WriteLine("Consumer contract shape accepted");`,
  "Changing v1 behavior silently is still breaking even when v2 exists. Observe actual client migration instead of assuming documentation alone retired a version.",
  "V2 থাকলেও v1-এর অর্থ চুপে বদলাবেন না। Documentation লিখেই client migrate হয়েছে ধরে নেবেন না।",
);
add(
  "Sessions and Cookies",
  "The cookie transport scope determines when a browser sends an identifier. Server-side session storage determines where state lives and how long it survives. Idle timeout, absolute expiry, identity rotation, and distributed-store availability are distinct concerns. Session data is usually ephemeral convenience state, not the sole durable record of a payment or order.",
  "Cookie scope ঠিক করে browser কখন id পাঠাবে। Session store state কোথায় ও কতদিন থাকে তা ঠিক করে। Idle timeout, absolute expiry ও store outage আলাদা। Order বা payment-এর একমাত্র record session-এ রাখবেন না।",
  `var builder=WebApplication.CreateBuilder(args);
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(o=>{
    o.IdleTimeout=TimeSpan.FromMinutes(20);
    o.Cookie.HttpOnly=true;
    o.Cookie.SecurePolicy=CookieSecurePolicy.Always;
    o.Cookie.SameSite=SameSiteMode.Lax;
});
var app=builder.Build();app.UseSession();
app.MapGet("/counter",(HttpContext c)=>{int n=(c.Session.GetInt32("count")??0)+1;c.Session.SetInt32("count",n);return new {Count=n};});
app.Run();
// Use HTTPS; the secure cookie is not sent over ordinary HTTP.`,
  `// Configure a shared distributed store for multiple production instances.
// This fragment shows cookie deletion at an explicit logout boundary.
app.MapPost("/clear-demo",(HttpContext context)=>{
    context.Session.Clear();
    context.Response.Cookies.Delete(".AspNetCore.Session");
    return Results.NoContent();
});
// Framework authentication logout is a separate operation.`,
  "The sample counter is not an atomic distributed counter. Simultaneous session requests can overwrite state; use a real atomic store for business invariants.",
  "Session counter atomic নয়। একসাথে request-এ মান overwrite হতে পারে; গুরুত্বপূর্ণ হিসাবের জন্য atomic store নিন।",
);
add(
  "Authentication with JWT",
  "A trusted issuer signs claims; an API validates them and then authorizes the requested action. Issuer, audience, signature algorithm/key, expiry, and key rollover need coordinated configuration. Claims are untrusted until validation succeeds. Decoding a token for display does not establish identity, and access tokens should not be treated as encrypted private storage.",
  "Issuer সই করে, API সই ও claim যাচাই করে, তারপর কাজের অনুমতি দেখে। Issuer, audience, key, মেয়াদ ও rollover ঠিক লাগবে। Decode করলেই বিশ্বাস নয়; token-এ গোপন data রাখার ভাণ্ডার ভাববেন না।",
  `// Integration fragment: Microsoft.AspNetCore.Authentication.JwtBearer required.
builder.Services.AddAuthentication("Bearer").AddJwtBearer(o=>{
    o.Authority="https://identity.example.com";
    o.Audience="orders-api";
    o.RequireHttpsMetadata=true;
});
builder.Services.AddAuthorization(o=>o.AddPolicy("OrdersRead",p=>p.RequireClaim("scope","orders.read")));
app.UseAuthentication();
app.UseAuthorization();
app.MapGet("/orders",()=>Results.Ok()).RequireAuthorization("OrdersRead");`,
  `// Resource authorization must also bind the authenticated caller to data.
app.MapGet("/orders/{id:int}",async(int id,HttpContext context,OrdersDb db)=>{
    string? userId=context.User.FindFirst("sub")?.Value;
    if(userId is null)return Results.Unauthorized();
    var order=await db.Orders.SingleOrDefaultAsync(o=>o.Id==id&&o.OwnerId==userId);
    return order is null?Results.NotFound():Results.Ok(order);
}).RequireAuthorization();
// Supply a configured EF Core context and your actual claim mapping.`,
  "Scope claim formats vary by issuer; a space-delimited scope string needs correct parsing rather than assuming one claim value per scope.",
  "Issuer অনুযায়ী scope format বদলায়। একটি string-এ space দিয়ে কয়েক scope থাকলে সঠিক parsing লাগবে।",
  "Integration fragment",
);
add(
  "OAuth 2.0",
  "Authorization Code with PKCE binds a short-lived code exchange to the client that initiated it. State correlates the browser flow and helps prevent request confusion. Redirect URI matching, code expiry, one-time use, and secure token handling are protocol requirements. OpenID Connect adds identity validation; OAuth itself is delegated authorization.",
  "PKCE code exchange-কে শুরু করা client-এর সাথে বাঁধে। State browser flow মেলায়। Redirect URI, code-এর মেয়াদ ও একবারের ব্যবহার ঠিক চাই। OAuth permission দেয়; identity-এর জন্য OIDC যোগ হয়।",
  `using System.Security.Cryptography;
using System.Text;
string Url(byte[] value)=>Convert.ToBase64String(value).TrimEnd('=').Replace('+','-').Replace('/','_');
string verifier=Url(RandomNumberGenerator.GetBytes(32));
string challenge=Url(SHA256.HashData(Encoding.ASCII.GetBytes(verifier)));
string state=Url(RandomNumberGenerator.GetBytes(32));
Console.WriteLine($"Verifier length: {verifier.Length}");
Console.WriteLine($"Challenge length: {challenge.Length}");
Console.WriteLine($"State length: {state.Length}");
// Persist verifier/state securely for one correlated short-lived flow.`,
  `// ASP.NET Core OIDC integration fragment; configure a maintained provider.
builder.Services.AddAuthentication(o=>{
    o.DefaultScheme="Cookies";o.DefaultChallengeScheme="oidc";
}).AddCookie("Cookies").AddOpenIdConnect("oidc",o=>{
    o.Authority=configuration["Identity:Authority"];
    o.ClientId=configuration["Identity:ClientId"];
    o.ResponseType="code";
    o.UsePkce=true;
});
// Supply provider-specific registration, HTTPS callbacks, and secrets externally.`,
  "Use a maintained OAuth/OIDC library instead of composing the whole browser flow manually. Never place a confidential client secret in a React client.",
  "পুরো flow হাতে না বানিয়ে maintained library নিন। React-এ confidential client secret রাখবেন না।",
  "Console example",
);
add(
  "SQL vs NoSQL",
  "Data models optimize different access patterns. Relational constraints and joins suit cross-entity invariants and flexible queries. Document models can co-locate an aggregate for one bounded read/write. Key-value access favors known-key retrieval. Every model still has a schema, consistency semantics, indexing choices, and operational costs.",
  "Relational-এ সম্পর্ক ও constraint, document-এ একটি aggregate একসাথে, key-value-তে পরিচিত key দিয়ে কাজ সুবিধা পায়। যেটাই নিন schema, consistency, index ও পরিচালনার খরচ থাকে।",
  `var order=new Order(1,"Ayesha",new[]{new Line("Tea",2,20m),new Line("Milk",1,50m)});
string json=System.Text.Json.JsonSerializer.Serialize(order);
Console.WriteLine(json);
Console.WriteLine(order.Lines.Sum(x=>x.Quantity*x.UnitPrice));
record Order(int Id,string Customer,Line[] Lines);
record Line(string Product,int Quantity,decimal UnitPrice);`,
  `var customers=new[]{(Id:1,Name:"Ayesha")};
var orders=new[]{(Id:10,CustomerId:1,Total:90m)};
var joined=from o in orders join c in customers on o.CustomerId equals c.Id
           select new{o.Id,Customer=c.Name,o.Total};
foreach(var row in joined)Console.WriteLine(row);
// In memory this illustrates normalized relationships, not persistence.`,
  "Choose from query/invariant requirements, not a claim that one category is always faster. Denormalization adds duplicate-data update and recovery obligations.",
  "একটি category সবসময় দ্রুত—এভাবে নয়; query ও invariant দেখে বাছুন। Duplicate data আপডেটের দায় যোগ হয়।",
  "Console example",
);
add(
  "ORM and Migrations",
  "Tracking associates entity identity and original values with a unit of work. SaveChanges converts pending state into database operations. Read-only queries often benefit from no tracking and narrow projection. Migrations describe schema evolution, but data backfill, mixed-version compatibility, locking, and rollback need an operational plan beyond generating a file.",
  "Tracking entity-এর পরিচয় ও পুরোনো মান রাখে। SaveChanges pending কাজ SQL-এ পাঠায়। Read-only-তে projection ও no-tracking ভালো। Migration file ছাড়াও backfill, lock ও mixed-version চলার পরিকল্পনা দরকার।",
  `// EF Core integration fragment: configure AppDb and Product first.
await using var db=new AppDb(options);
var product=await db.Products.SingleAsync(p=>p.Id==id,cancellationToken);
product.Name="Updated tea";
await db.SaveChangesAsync(cancellationToken);
var view=await db.Products.AsNoTracking()
    .Where(p=>p.Id==id)
    .Select(p=>new {p.Id,p.Name})
    .SingleAsync(cancellationToken);`,
  `// Migration workflow commands, represented here as comments:
// dotnet ef migrations add AddProductSku
// dotnet ef migrations script --idempotent --output migration.sql
// Review SQL, lock implications, and data backfill before applying.
// Expand: add nullable column and compatible application code.
// Backfill: populate existing rows in bounded batches.
// Contract: enforce the final constraint after all writers migrate.`,
  "No-tracking changes identity resolution and mutation behavior; do not edit a detached projection expecting SaveChanges to persist it.",
  "No-tracking projection edit করলেই SaveChanges লিখবে না। Tracking-এর চুক্তি বুঝুন।",
  "Integration fragment",
);
add(
  "Database Indexing",
  "An index is a maintained access path. Equality prefixes, range predicates, sort order, and selected columns determine whether it helps a query. Extra indexes increase write amplification and space. Selectivity and data distribution affect plans, so measure realistic row counts and inspect the provider’s execution plan.",
  "Index রক্ষণাবেক্ষণ করা access path। Equality prefix, range, sort ও selected column দেখে সুবিধা হয়। বেশি index-এ write ও জায়গার খরচ বাড়ে। ছোট demo নয়, আসল data distribution ও plan দেখুন।",
  `// EF Core OnModelCreating fragment.
modelBuilder.Entity<Order>()
    .HasIndex(o=>new {o.TenantId,o.CreatedAt,o.Id});
var rows=await db.Orders.AsNoTracking()
    .Where(o=>o.TenantId==tenantId&&o.CreatedAt>=from)
    .OrderBy(o=>o.CreatedAt).ThenBy(o=>o.Id)
    .Select(o=>new {o.Id,o.CreatedAt,o.Total})
    .Take(50).ToListAsync(cancellationToken);`,
  `// PostgreSQL inspection examples (run with the correct provider/tool):
// EXPLAIN (ANALYZE, BUFFERS)
// SELECT id, created_at, total FROM orders
// WHERE tenant_id = 42 AND created_at >= TIMESTAMP '2026-01-01'
// ORDER BY created_at, id LIMIT 50;
// ANALYZE executes the query; assess production load and permissions.
// Compare estimated/actual rows, reads, sort work, and total time.`,
  "A missing index can be a symptom of a query that reads too much. First bound the result and avoid N+1 queries; then optimize the access path.",
  "Index না থাকার পাশাপাশি query-ই বেশি data চাইতে পারে। আগে result সীমা ও N+1 ঠিক করুন।",
  "Integration fragment",
);
add(
  "Transactions and ACID",
  "A transaction’s atomicity prevents a partial set of database writes from committing. Isolation controls concurrent visibility and interference, not merely whether statements are grouped. Optimistic concurrency detects a stale writer through a version token. Cross-service effects need an outbox or compensation, because a database rollback cannot unsend a message already delivered elsewhere.",
  "Atomicity-তে কিছু write আলাদা commit হয় না। Isolation একইসাথে কাজের দেখা ও হস্তক্ষেপ নিয়ন্ত্রণ করে। Version token stale writer ধরে। বাইরে পাঠানো message database rollback ফেরায় না; outbox/compensation লাগে।",
  `// EF Core integration fragment: Account.RowVersion is a concurrency token.
await using var tx=await db.Database.BeginTransactionAsync(cancellationToken);
var from=await db.Accounts.SingleAsync(x=>x.Id==fromId,cancellationToken);
var to=await db.Accounts.SingleAsync(x=>x.Id==toId,cancellationToken);
if(amount<=0||from.Balance<amount)throw new InvalidOperationException("Funds");
from.Balance-=amount;to.Balance+=amount;
db.Outbox.Add(new OutboxMessage(Guid.NewGuid(),"TransferCompleted"));
await db.SaveChangesAsync(cancellationToken);
await tx.CommitAsync(cancellationToken);`,
  `// Model configuration fragment for SQL Server rowversion.
modelBuilder.Entity<Account>().Property(a=>a.RowVersion).IsRowVersion();
try {await db.SaveChangesAsync(cancellationToken);}
catch(Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException) {
    // Reload/recompute or return 409; do not blindly overwrite.
    throw new InvalidOperationException("The account changed; retry the use case safely");
}
// Provider-specific token choices differ outside SQL Server.`,
  "Retry the whole logical transaction only under an explicit policy. A stale balance or duplicate external effect cannot be fixed by retrying one random statement.",
  "সম্পূর্ণ logical transaction নিরাপদ policy-তে retry করুন। শুধু যেকোনো একটি statement আবার চালানো যথেষ্ট নয়।",
  "Integration fragment",
);
add(
  "File Uploads to S3",
  "An upload boundary should enforce size, accepted content policy, authorization, and a server-generated key. Streaming bounds application memory but does not make an unlimited input safe. Presigned uploads move traffic off the API while still requiring short expiry, scope restrictions, and post-upload validation. Store metadata and ownership separately from object bytes.",
  "Upload-এ size, content, permission ও server-generated key লাগবে। Stream memory কমায়, unlimited input নিরাপদ করে না। Presigned-এ API-এর traffic কমে, কিন্তু scope, মেয়াদ ও পরে validation লাগে।",
  `// AWSSDK.S3 integration fragment with an injected IAmazonS3.
if(file.Length==0||file.Length>5*1024*1024)throw new ArgumentException("Size");
string key=$"users/{authorizedUserId}/{Guid.NewGuid():N}.bin";
await using var input=file.OpenReadStream();
var request=new Amazon.S3.Model.PutObjectRequest {
    BucketName=bucket,Key=key,InputStream=input,ContentType="application/octet-stream"
};
await s3.PutObjectAsync(request,cancellationToken);
// Persist key, owner, expected size, and validation state in your database.`,
  `// A separate lifecycle protects downstream consumers.
record UploadState(string Key,long Bytes,string Owner,bool Verified);
var pending=new UploadState("users/1/demo.bin",1024,"1",false);
bool MayPublish(UploadState item,string caller)=>item.Verified&&item.Owner==caller;
Console.WriteLine(MayPublish(pending,"1"));
var verified=pending with {Verified=true};
Console.WriteLine(MayPublish(verified,"1"));
// Replace the demo flag with real server-side scanning/content checks.`,
  "Content-Type and filename supplied by a client are not proof of file contents. Plan orphan cleanup if object upload succeeds but metadata persistence fails.",
  "Client-এর Content-Type আসল content-এর প্রমাণ নয়। Upload সফল, metadata save ব্যর্থ হলে orphan cleanup দিন।",
  "Integration fragment",
);
add(
  "Unit and Integration Tests",
  "A valuable test checks an observable contract against actual application behavior. Unit tests isolate deterministic rules; integration tests cross framework or storage boundaries. Arrange minimal relevant state, act once, and assert outcomes and invariants. Use real providers for behavior such as SQL NULL handling or transaction isolation that substitutes do not reproduce.",
  "Test আসল application behavior-এর চুক্তি পরীক্ষা করবে। Unit-এ rule আলাদা, integration-এ framework/storage পেরোয়। SQL NULL বা isolation fake provider-এ একরকম নাও চলতে পারে।",
  `// xUnit test-project example; add xunit and the test SDK.
public static class Pricing {
    public static decimal Total(decimal price,int quantity) {
        if(price<0||quantity<=0)throw new ArgumentOutOfRangeException();
        return price*quantity;
    }
}
public class PricingTests {
    [Xunit.Theory]
    [Xunit.InlineData(20,3,60)]
    [Xunit.InlineData(0,1,0)]
    public void ComputesTotal(int price,int quantity,int expected)=>Xunit.Assert.Equal((decimal)expected,Pricing.Total(price,quantity));
}`,
  `// WebApplicationFactory integration fragment with a real application factory.
using var client=factory.CreateClient();
using var response=await client.PostAsJsonAsync("/bookings",new {
    Name="Ayesha",Start="2026-01-02",End="2026-01-01",Guests=2
});
Xunit.Assert.Equal(System.Net.HttpStatusCode.BadRequest,response.StatusCode);
string json=await response.Content.ReadAsStringAsync();
Xunit.Assert.Contains("end",json);
// Test fixtures own isolated data and must not target production.`,
  "Do not test a copy of the implementation expression. Test boundary cases, failures, and invariants through the real callable entry point.",
  "Implementation-এর copy test নয়। আসল entry দিয়ে boundary, failure ও invariant পরীক্ষা করুন।",
  "Test project",
);
add(
  "Caching with Redis",
  "Cache-aside separates cache lookup from source loading. The write path needs an invalidation policy so stale entries do not outlive product expectations. Concurrent misses can multiply source work. TTL jitter, single-flight loading, bounded negative caching, and outage behavior address different failure modes; no single TTL setting solves them all.",
  "Cache-aside-এ আগে cache, miss হলে source। Write-এর পরে invalidation না থাকলে পুরোনো ফল থাকে। একসাথে miss database-এ চাপ বাড়ায়। TTL jitter, single-flight ও outage policy আলাদা সমস্যা মেটায়।",
  `// IDistributedCache integration fragment; configure a Redis provider.
string key=$"product:{id}";
string? json=await cache.GetStringAsync(key,cancellationToken);
if(json is null) {
    var product=await db.Products.AsNoTracking().SingleOrDefaultAsync(p=>p.Id==id,cancellationToken);
    if(product is null)return Results.NotFound();
    json=System.Text.Json.JsonSerializer.Serialize(product);
    var ttl=TimeSpan.FromSeconds(300+Random.Shared.Next(0,31));
    await cache.SetStringAsync(key,json,new DistributedCacheEntryOptions{AbsoluteExpirationRelativeToNow=ttl},cancellationToken);
}
return Results.Content(json,"application/json");`,
  `// Invalidation fragment: commit the source change before evicting the cache.
product.Name=newName;
await db.SaveChangesAsync(cancellationToken);
await cache.RemoveAsync($"product:{product.Id}",cancellationToken);
// Consider the race: another reader may cache old data before commit/eviction.
// Use versioned keys or a coordinated policy when strict freshness is required.
// Never treat cache loss as loss of the authoritative record.`,
  "Do not lock all product keys behind one global gate. Coordinate per key, bound lock cardinality, and recognize that a local lock does not coordinate every server.",
  "সব key এক global lock-এ নয়। Per-key coordination সীমিত রাখুন; local lock সব server-এ কাজ করে না।",
  "Integration fragment",
);
add(
  "Rate Limiting",
  "A limiter partitions requests by an identity and applies an algorithm with a time/capacity budget. User identifiers, API keys, and IP addresses have different fairness and cardinality properties. NAT can put many users behind one IP. Queueing consumes resources and changes latency, so reject and queue policies should match the service goal.",
  "Limiter পরিচয় অনুযায়ী ভাগ করে quota দেয়। User, API key ও IP-তে fairness আলাদা; NAT-এ অনেক user এক IP। Queue করলেও resource ও latency বাড়ে, তাই policy স্পষ্ট।",
  `using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
var builder=WebApplication.CreateBuilder(args);
builder.Services.AddRateLimiter(o=>{
    o.RejectionStatusCode=429;
    o.AddPolicy("per-client",ctx=>RateLimitPartition.GetFixedWindowLimiter(
        ctx.User.Identity?.Name??ctx.Connection.RemoteIpAddress?.ToString()??"unknown",
        _=>new FixedWindowRateLimiterOptions {PermitLimit=10,Window=TimeSpan.FromMinutes(1),QueueLimit=0}));
});
var app=builder.Build();app.UseRateLimiter();
app.MapGet("/limited",()=>"OK").RequireRateLimiting("per-client");
app.Run();`,
  `double capacity=5,tokens=0,refillPerSecond=2;
foreach(double elapsed in new[]{0.1,0.2,1.0,3.0}) {
    tokens=Math.Min(capacity,tokens+elapsed*refillPerSecond);
    bool accepted=tokens>=1;
    if(accepted)tokens--;
    Console.WriteLine($"elapsed={elapsed}, accepted={accepted}, tokens={tokens:F1}");
}
// Sequential token-bucket model; real concurrent checks must be atomic.`,
  "In-memory policy state is per application instance. A global quota needs a consistent shared limiter/gateway and a deliberate failure policy.",
  "Memory quota প্রতি instance-এ আলাদা। Global সীমায় shared atomic store বা gateway ও outage policy দরকার।",
);
add(
  "WebSockets",
  "Persistent connections consume server resources for their full lifetime. Authentication at connection establishment must be combined with authorization for each action/group. Reconnects and intermittent clients need message identity and catch-up logic when missing updates matters. Broadcasting to every connection is useful for a demo but usually violates real tenant boundaries.",
  "Connection সারাজীবন resource ধরে। Connect-এর login-এর পাশাপাশি কাজ ও group-এর অনুমতি লাগে। Reconnect-এ missed update চাইলে message id ও catch-up দিন। Demo-র Clients.All বাস্তবে tenant boundary ভাঙতে পারে।",
  `using Microsoft.AspNetCore.SignalR;
var builder=WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();
var app=builder.Build();
app.MapHub<ChatHub>("/chat");
app.Run();
public class ChatHub:Hub {
    public async Task Send(string text) {
        if(string.IsNullOrWhiteSpace(text)||text.Length>500)throw new HubException("Invalid message");
        await Clients.Caller.SendAsync("message",text.Trim());
    }
}`,
  `// JavaScript client reference; install @microsoft/signalr in a real client.
// const connection = new signalR.HubConnectionBuilder()
//   .withUrl('/chat').withAutomaticReconnect().build();
// connection.on('message', text => console.log(text));
// await connection.start();
// await connection.invoke('Send', 'Hello');
// Render user text as text, never untrusted HTML.
// Add server-authorized groups before supporting private rooms.`,
  "Scale-out requires a backplane or managed service and a plan for connection affinity where applicable. Durable delivery is not implied by a successful send call.",
  "বহু server-এ backplane/managed service লাগে। Send সফল মানেই durable delivery নয়।",
);
add(
  "Background Jobs",
  "Workers need ownership of scope, concurrency, cancellation, retry, and completion state. A hosted service participates in host lifecycle but ordinary in-memory queues lose work on process failure. A durable job state machine distinguishes queued, running, succeeded, failed, and retriable states rather than treating an exception log as a completion record.",
  "Worker-এ scope, concurrency, cancel, retry ও completion সামলান। Hosted service host-এর lifecycle মানে, কিন্তু memory queue crash-এ হারায়। Queued, running, succeeded ও failed state আলাদা রাখুন।",
  `var builder=Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService<Heartbeat>();
await builder.Build().RunAsync();
class Heartbeat(ILogger<Heartbeat> logger):BackgroundService {
    protected override async Task ExecuteAsync(CancellationToken stop) {
        using var timer=new PeriodicTimer(TimeSpan.FromSeconds(5));
        try {while(await timer.WaitForNextTickAsync(stop))logger.LogInformation("Heartbeat at {Time}",DateTime.UtcNow);}
        catch(OperationCanceledException) when(stop.IsCancellationRequested) { }
    }
}`,
  `// Scope-per-job integration fragment inside a hosted worker.
await using var scope=scopeFactory.CreateAsyncScope();
var handler=scope.ServiceProvider.GetRequiredService<IJobHandler>();
await handler.HandleAsync(job,cancellationToken);
// Acknowledge durable work only after its side effects are committed.
// Retry with bounded attempts and a dead-letter/manual-recovery path.
// A request-scoped DbContext must not be retained after its request ends.`,
  "Use bounded concurrency and poison-message policy. An endlessly retried invalid job can consume the worker pool and delay valid work.",
  "Concurrency সীমা ও poison-message policy দিন। ভুল job অনন্ত retry-তে সব worker আটকে দিতে পারে।",
  "Worker/hosting program",
);
add(
  "Message Queues",
  "Queues decouple timing but introduce delivery semantics. A broker may redeliver after a worker completes an effect but crashes before acknowledgment. A transactionally recorded message ID lets the consumer suppress duplicate effects. Retry delays, visibility leases, ordering scope, backpressure, and dead-letter handling must be designed together.",
  "Queue timing আলাদা করে, কিন্তু duplicate আসতে পারে। কাজ শেষে ack-এর আগে crash হলে আবার আসে। Message id ও effect এক transaction-এ রাখলে duplicate effect ঠেকানো যায়। Retry, lease, ordering ও dead-letter একসাথে ভাবুন।",
  `using System.Threading.Channels;
var channel=Channel.CreateBounded<int>(new BoundedChannelOptions(2){FullMode=BoundedChannelFullMode.Wait});
var producer=Task.Run(async()=>{
    for(int i=1;i<=5;i++)await channel.Writer.WriteAsync(i);
    channel.Writer.Complete();
});
await foreach(int item in channel.Reader.ReadAllAsync()) {
    Console.WriteLine($"Processing {item}");
    await Task.Delay(10);
}
await producer;`,
  `var processed=new HashSet<Guid>();
int effects=0;
Guid id=Guid.NewGuid();
foreach(Guid messageId in new[]{id,id,Guid.NewGuid()}) {
    if(!processed.Add(messageId)){Console.WriteLine("Duplicate skipped");continue;}
    effects++;Console.WriteLine("Effect applied");
}
Console.WriteLine(effects);
// Teaching dedup only: a durable implementation commits ID+effect atomically.`,
  "Exactly-once business effects usually require more than a broker setting. Trace the entire boundary from delivery through external effects and acknowledgment.",
  "Broker setting-ই exactly-once business effect নয়। Delivery, side effect ও ack-এর পুরো সীমা পরীক্ষা করুন।",
  "Console example",
);
add(
  "Logging and Monitoring",
  "Observability connects symptoms to operations through structured logs, metrics, and distributed traces. Correlation IDs and spans tie request work together; counters and histograms show aggregate behavior. High-cardinality tags can make metrics unusable. Logging more raw data can create privacy risks and costs without adding useful diagnosis.",
  "Structured log, metric ও trace দিয়ে সমস্যা থেকে কাজের পথ বোঝা যায়। Span ও correlation id সম্পর্ক মেলায়। অগণিত label metric-কে ব্যয়বহুল করে; raw data বেশি log মানেই ভালো diagnosis নয়।",
  `using System.Diagnostics;
using System.Diagnostics.Metrics;
using var source=new ActivitySource("Mastery.Orders");
using var meter=new Meter("Mastery.Orders");
var duration=meter.CreateHistogram<double>("order.duration","ms");
var timer=Stopwatch.StartNew();
using(var span=source.StartActivity("order.validate")) {
    span?.SetTag("order.operation","validate");
    await Task.Delay(10);
}
duration.Record(timer.Elapsed.TotalMilliseconds);
Console.WriteLine($"Elapsed={timer.Elapsed.TotalMilliseconds:F2}ms");`,
  `// ASP.NET Core structured logging fragment.
app.MapGet("/products/{id:int}",(int id,ILogger<Program> log)=>{
    using var scope=log.BeginScope(new Dictionary<string,object>{{"ProductId",id}});
    log.LogInformation("Loading product {ProductId}",id);
    return Results.Ok(new {Id=id});
});
// Configure OpenTelemetry listeners/exporters separately.
// Avoid user IDs as unbounded metric labels and secrets in log scopes.`,
  "Instrument the actual user-facing flow and alert on symptoms, not every isolated log line. A span without a configured listener/exporter may never leave the process.",
  "আসল user flow-তে instrumentation দিন। Listener/exporter না থাকলে span process-এর বাইরে যায় না।",
  "Console example",
);
data["ORM and Migrations"].examples[1] = {
  title: "Migration review workflow · migration যাচাই",
  language: "bash",
  kind: "CLI reference",
  code: `dotnet ef migrations add AddProductSku
dotnet ef migrations script --idempotent --output migration.sql
dotnet ef migrations list
# Review the SQL and backfill/compatibility plan before applying.
# dotnet ef database update`,
};
data["Database Indexing"].examples[1] = {
  title: "Inspect a PostgreSQL plan · query plan দেখুন",
  language: "sql-reference",
  kind: "Provider-specific SQL",
  code: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, created_at, total
FROM orders
WHERE tenant_id = 42
  AND created_at >= TIMESTAMP '2026-01-01'
ORDER BY created_at, id
LIMIT 50;
-- ANALYZE executes the query; use a reviewed learning database.`,
};
data.WebSockets.examples[1] = {
  title: "SignalR client · browser-এ সংযোগ",
  language: "javascript",
  kind: "Client integration fragment",
  code: `import * as signalR from '@microsoft/signalr';
const connection = new signalR.HubConnectionBuilder()
  .withUrl('/chat').withAutomaticReconnect().build();
connection.on('message', text => console.log(text));
await connection.start();
await connection.invoke('Send', 'Hello');
// Install the package and run against the matching authorized server.`,
};
export default data;
