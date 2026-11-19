// Module 20 — APIs & Microservices Deep Dive (topics not covered elsewhere on the site).
const cs = String.raw;

export const microserviceRows = [
  {
    topic: "Request, Response & Headers",
    en: "Every HTTP call is a request and a response. The request has a method (GET, POST, PUT, PATCH, DELETE), a path, headers and an optional body. The response has a status code, headers and an optional body. Headers are small key-value notes about the message: Content-Type says the body is JSON, Authorization carries a token, Accept-Language asks for a language, Cache-Control says whether to cache. In ASP.NET Core you read them from HttpRequest.Headers and write them to HttpResponse.Headers.",
    bn: "প্রতিটি HTTP call-এ একটি request ও একটি response। Request-এ method (GET, POST...), path, header ও body থাকে। Response-এ status code, header ও body। Header হলো বার্তার ছোট নোট: Content-Type বলে body JSON, Authorization-এ token, Cache-Control বলে cache হবে কি না। ASP.NET Core-এ HttpRequest.Headers থেকে পড়ুন, HttpResponse.Headers-এ লিখুন।",
    analogy: [
      "A request is a parcel: the label on the outside (headers) says who it is from, what is inside and how to handle it; the box content is the body. The reply parcel comes back with its own label and a stamp: delivered (200) or address not found (404).",
      "Request একটি পার্সেলের মতো: বাইরের লেবেল (header) বলে কে পাঠাল, ভেতরে কী, কীভাবে সামলাতে হবে; ভেতরের জিনিস হলো body। ফেরত পার্সেলে নিজের লেবেল ও সিল: পৌঁছেছে (200) বা ঠিকানা নেই (404)।",
    ],
    flow: ["Method + path", "Request headers", "Request body", "Endpoint runs", "Status + response headers + body"],
    code: cs`var app = WebApplication.CreateBuilder(args).Build(); ~~ Minimal ASP.NET Core app / ছোট ASP.NET Core app
app.MapPost("/echo", async (HttpRequest req, HttpResponse res) => ~~ Ask for the raw request and response / raw request ও response নিন
{
    string method = req.Method; ~~ GET, POST, PUT, PATCH or DELETE / কোন method
    string contentType = req.ContentType ?? "none"; ~~ Header: what kind of body was sent / কী ধরনের body এসেছে
    string language = req.Headers.AcceptLanguage.ToString(); ~~ Header: preferred language / পছন্দের ভাষা
    using var reader = new StreamReader(req.Body); ~~ The body is a stream / body একটি stream
    string body = await reader.ReadToEndAsync(); ~~ Read the body text / body পড়ুন
    res.Headers["X-Request-Id"] = Guid.NewGuid().ToString(); ~~ Custom response header for tracing / tracing-এর জন্য নিজস্ব header
    res.Headers.CacheControl = "no-store"; ~~ Tell browsers not to cache / cache না করতে বলুন
    return Results.Ok(new { method, contentType, language, body }); ~~ 200 OK with a JSON body / JSON body-সহ 200
});
app.Run(); ~~ Start listening / শোনা শুরু`,
    output: `$ curl -i -X POST http://localhost:5000/echo -H "Content-Type: text/plain" -H "Accept-Language: bn-BD" -d "hello"
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: no-store
X-Request-Id: 3f2a...

{"method":"POST","contentType":"text/plain","language":"bn-BD","body":"hello"}`,
    kind: "ASP.NET Core program",
    caution:
      "Headers are not secret — never put passwords in custom headers over plain HTTP. GET and DELETE should not need a body. Use the correct method: GET reads (safe), PUT replaces (idempotent), POST creates (not idempotent), PATCH changes part.",
    exercise: "Return 415 Unsupported Media Type when Content-Type is not text/plain or application/json.",
    interview: [
      "Q: Difference between PUT and PATCH? A: PUT replaces the whole resource and is idempotent; PATCH changes only the given fields.",
      "প্রশ্ন: PUT আর PATCH-এর পার্থক্য? উত্তর: PUT পুরো resource বদলায় (idempotent), PATCH শুধু দেওয়া অংশ বদলায়।",
    ],
  },
  {
    topic: "Query & Path Parameters",
    en: "Path parameters are part of the URL path and identify one specific resource: /customers/7. Query parameters come after ? and filter, sort or page a list: /customers?city=Dhaka&page=2. In ASP.NET Core, route values like {id:int} bind to method parameters (with a type constraint), and other simple parameters bind from the query string automatically. Always map them to parameterized SQL — never build SQL by joining strings.",
    bn: "Path parameter URL-এর অংশ এবং একটি নির্দিষ্ট resource চেনায়: /customers/7। Query parameter ? এর পরে আসে এবং তালিকা filter, sort বা page করে: /customers?city=Dhaka&page=2। ASP.NET Core-এ {id:int} route থেকে আসে, বাকি সাধারণ parameter query string থেকে। SQL-এ সবসময় parameter ব্যবহার করুন, string জোড়া দিয়ে নয়।",
    analogy: [
      "Path parameter is the exact flat number: 'Flat 7'. Query parameters are search filters on a property website: 'city = Dhaka, page 2, 20 per page'.",
      "Path parameter হলো নির্দিষ্ট ফ্ল্যাট নম্বর: 'ফ্ল্যাট ৭'। Query parameter হলো বাড়ি খোঁজার ওয়েবসাইটের filter: 'শহর = ঢাকা, পাতা ২, প্রতি পাতায় ২০'।",
    ],
    flow: ["URL arrives", "Route template matches", "Path value binds id", "Query string binds filters", "Parameterized SQL"],
    code: cs`var app = WebApplication.CreateBuilder(args).Build(); ~~ Minimal API host / ছোট API host
app.MapGet("/customers/{id:int}", (int id) => ~~ Path parameter with an int constraint: ONE resource / path parameter: একটি resource
    Results.Ok(new { Id = id, Name = "Customer " + id })); ~~ Return that single item / সেই একটি জিনিস ফেরত
app.MapGet("/customers", (string? city, int page = 1, int size = 20) => ~~ Query parameters: filter and page a LIST / query parameter: তালিকা filter ও page
{
    size = Math.Clamp(size, 1, 100); ~~ Never let clients ask for a million rows / অসীম সারি চাওয়া আটকান
    return Results.Ok(new { City = city ?? "any", Page = page, Size = size }); ~~ Echo what was bound / কী bind হলো দেখান
});
app.Run(); ~~ Start the server / server চালু`,
    output: `GET /customers/7                  -> {"id":7,"name":"Customer 7"}
GET /customers?city=Dhaka&page=2  -> {"city":"Dhaka","page":2,"size":20}
GET /customers?size=5000          -> {"city":"any","page":1,"size":100}
GET /customers/abc                -> 404 Not Found (int constraint failed)`,
    kind: "ASP.NET Core program",
    sql: `-- The same filters as a safe, parameterized SQL Server query
CREATE OR ALTER PROCEDURE dbo.SearchCustomers
    @City nvarchar(50) = NULL,
    @Page int = 1,
    @Size int = 20
AS
SELECT CustomerId, Name, City
FROM dbo.Customers
WHERE (@City IS NULL OR City = @City)
ORDER BY CustomerId
OFFSET (@Page - 1) * @Size ROWS FETCH NEXT @Size ROWS ONLY;
GO
EXEC dbo.SearchCustomers @City = N'Dhaka', @Page = 2;`,
    caution:
      "Validate and clamp page and size. Use path parameters for identity and query parameters for optional filters. Concatenating query values into SQL causes SQL injection — use SqlParameter, Dapper parameters or EF Core LINQ.",
    exercise: "Add a sort query parameter that only accepts 'name' or 'city' and returns 400 for anything else.",
  },
  {
    topic: "API Keys",
    en: "An API key is a long secret string that identifies a calling application (not a person). The client sends it in a header such as X-Api-Key on every request over HTTPS; the server checks it and rejects missing or wrong keys with 401. Keys are simple and good for server-to-server calls or partner integrations, but they do not carry user identity or expiry the way JWT/OAuth does. Store only a hash of each key in SQL Server, give each client its own key, and support rotation.",
    bn: "API key হলো একটি লম্বা গোপন string যা একটি application-কে চেনায় (মানুষকে নয়)। Client প্রতিটি request-এ X-Api-Key header-এ HTTPS দিয়ে পাঠায়, server যাচাই করে, ভুল হলে 401। Server-to-server বা partner integration-এর জন্য সহজ, কিন্তু JWT/OAuth-এর মতো user পরিচয় বহন করে না। SQL Server-এ key-এর hash রাখুন, প্রতিটি client-কে আলাদা key দিন।",
    analogy: [
      "An API key is the gate pass a company gives to a delivery van. The guard checks the pass, not who is driving. If a pass is lost, cancel that pass and issue a new one.",
      "API key হলো কোম্পানির দেওয়া ডেলিভারি ভ্যানের গেট পাস। গার্ড পাস দেখে, কে চালাচ্ছে তা নয়। পাস হারালে সেটা বাতিল করে নতুন দিন।",
    ],
    flow: ["Client sends X-Api-Key", "Middleware reads header", "Hash and compare", "Valid: continue", "Invalid: 401"],
    code: cs`using System.Security.Cryptography; ~~ SHA256 and constant-time compare / SHA256 ও নিরাপদ তুলনা
using System.Text; ~~ Encoding / লেখা থেকে byte বানানোর class
var app = WebApplication.CreateBuilder(args).Build(); ~~ Minimal API / ছোট API
byte[] storedHash = SHA256.HashData(Encoding.UTF8.GetBytes("demo-key-123")); ~~ Demo: in real life load hashes from the database / demo: আসলে database থেকে hash আনুন
app.Use(async (ctx, next) => ~~ Middleware runs before every endpoint / প্রতিটি endpoint-এর আগে চলে
{
    string presented = ctx.Request.Headers["X-Api-Key"].ToString(); ~~ Read the key header / key header পড়ুন
    byte[] presentedHash = SHA256.HashData(Encoding.UTF8.GetBytes(presented)); ~~ Hash what the client sent / client যা পাঠাল তার hash
    if (!CryptographicOperations.FixedTimeEquals(presentedHash, storedHash)) ~~ Constant-time compare avoids timing attacks / timing attack থেকে বাঁচায়
    {
        ctx.Response.StatusCode = StatusCodes.Status401Unauthorized; ~~ Reject / প্রত্যাখ্যান
        await ctx.Response.WriteAsync("Missing or invalid API key"); ~~ Short message, no hints / ছোট বার্তা
        return; ~~ Stop the pipeline here / এখানেই থামুন
    }
    await next(); ~~ Key is fine: continue to the endpoint / ঠিক আছে: endpoint-এ যান
});
app.MapGet("/rates", () => new { Usd = 122.5 }); ~~ Protected endpoint / সুরক্ষিত endpoint
app.Run(); ~~ Start / শুরু`,
    output: `$ curl http://localhost:5000/rates
Missing or invalid API key            (401)
$ curl -H "X-Api-Key: demo-key-123" http://localhost:5000/rates
{"usd":122.5}                         (200)`,
    kind: "ASP.NET Core program",
    sql: `CREATE TABLE dbo.ApiClients (
    ClientId   int IDENTITY PRIMARY KEY,
    Name       nvarchar(100) NOT NULL,
    KeyHash    varbinary(32) NOT NULL UNIQUE,   -- SHA-256 of the key; never store the key itself
    IsActive   bit NOT NULL DEFAULT 1,
    ExpiresAt  datetime2 NULL,
    CreatedAt  datetime2 NOT NULL DEFAULT SYSUTCDATETIME());
GO
-- C# computes SHA256 of the presented key and passes it as @KeyHash
DECLARE @KeyHash varbinary(32) = HASHBYTES('SHA2_256', CAST('demo-key-123' AS varchar(100)));
SELECT ClientId, Name
FROM dbo.ApiClients
WHERE KeyHash = @KeyHash AND IsActive = 1
  AND (ExpiresAt IS NULL OR ExpiresAt > SYSUTCDATETIME());`,
    caution:
      "Never put API keys in URLs (they end up in logs), in frontend JavaScript, or in Git. An API key alone is not user authentication — use JWT/OAuth for users. Combine keys with rate limiting per client.",
    exercise: "Let two clients have different keys and add the client's name to the response so you know who called.",
  },
  {
    topic: "Service Boundaries (DDD)",
    en: "Domain-Driven Design (DDD) helps decide where one microservice ends and another begins. A bounded context is a part of the business with its own language and model: in Sales a 'customer' has a credit limit; in Shipping the same person is just a recipient with an address. Each service owns one bounded context, its own code and its own database, and shares only IDs and events with others. Good boundaries mean a change in one service rarely forces changes in another.",
    bn: "Domain-Driven Design (DDD) ঠিক করতে সাহায্য করে কোন microservice কোথায় শেষ। Bounded context হলো ব্যবসার একটি অংশ যার নিজস্ব ভাষা ও model: Sales-এ customer-এর credit limit আছে, Shipping-এ একই মানুষ শুধু ঠিকানাসহ প্রাপক। প্রতিটি service একটি context-এর মালিক, নিজের database রাখে, অন্যের সাথে শুধু ID ও event ভাগ করে।",
    analogy: [
      "A hospital: the billing department and the pharmacy both deal with 'the patient', but billing cares about payments and pharmacy cares about medicines. Each has its own files and staff, and they share only the patient ID.",
      "হাসপাতালে বিলিং ও ফার্মেসি দুই বিভাগই 'রোগী' নিয়ে কাজ করে, কিন্তু বিলিং দেখে টাকা, ফার্মেসি দেখে ওষুধ। প্রত্যেকের নিজস্ব ফাইল ও কর্মী, ভাগ করে শুধু রোগীর ID।",
    ],
    flow: ["Business area", "Find its own language", "Bounded context", "One service owns it", "Share IDs and events only"],
    code: cs`var buyer = new Sales.Customer(1, "Rahim Traders", 50000m); ~~ Sales view of customer 1 / Sales-এর চোখে customer ১
var parcel = new Shipping.Recipient(1, "Mirpur 10, Dhaka", "01700000000"); ~~ Shipping view of the same person / Shipping-এর চোখে একই মানুষ
Console.WriteLine($"Sales sees: {buyer.Name}, credit {buyer.CreditLimit}"); ~~ Only what Sales needs / Sales-এর যা দরকার
Console.WriteLine($"Shipping sees: {parcel.Address}"); ~~ Only what Shipping needs / Shipping-এর যা দরকার
Console.WriteLine("Shared between services: CustomerId = 1 and events like OrderPlaced"); ~~ The contract between them / দুই service-এর চুক্তি
namespace Sales ~~ Bounded context 1: its own model / context ১
{
    public record Customer(int Id, string Name, decimal CreditLimit); ~~ Sales language: buyer with credit / Sales-এর ভাষা
}
namespace Shipping ~~ Bounded context 2: a different model / context ২
{
    public record Recipient(int CustomerId, string Address, string Phone); ~~ Shipping language: where to deliver / কোথায় পৌঁছাতে হবে
}`,
    output: `Sales sees: Rahim Traders, credit 50000
Shipping sees: Mirpur 10, Dhaka
Shared between services: CustomerId = 1 and events like OrderPlaced`,
    caution:
      "Splitting by technical layer (a 'database service', a 'validation service') is a common mistake — split by business capability. If two services must always be deployed together, the boundary is probably wrong. Start with a modular monolith if the domain is not clear yet.",
    exercise: "List the bounded contexts of a food delivery app (for example Ordering, Restaurant, Delivery, Payment) and what 'order' means in each.",
  },
  {
    topic: "Sync vs Async Communication",
    en: "Services talk in two ways. Synchronous: the caller sends a request (HTTP or gRPC) and waits for the answer — simple, but if the other service is slow or down, the caller is too. Asynchronous: the caller publishes a message or event to a queue or broker (RabbitMQ, Kafka, Azure Service Bus) and continues; the other service processes it later. Use sync when you need the answer right now (check stock before payment); use async for things that can happen after (send email, update reports).",
    bn: "Service দুইভাবে কথা বলে। Synchronous: request পাঠিয়ে উত্তরের অপেক্ষা (HTTP/gRPC) — সহজ, কিন্তু অন্য service ধীর বা বন্ধ হলে caller-ও আটকে যায়। Asynchronous: queue/broker-এ বার্তা রেখে কাজ চালিয়ে যাওয়া, অন্য service পরে করে। এখনই উত্তর লাগলে sync, পরে হলেও চলে (email, report) এমন কাজে async।",
    analogy: [
      "Sync is a phone call: you wait on the line until the other person answers. Async is a WhatsApp message: you send it and continue your work; they reply when they can.",
      "Sync হলো ফোন কল: উত্তর না পাওয়া পর্যন্ত লাইনে অপেক্ষা। Async হলো WhatsApp বার্তা: পাঠিয়ে নিজের কাজ করুন, তিনি সময়মতো উত্তর দেবেন।",
    ],
    flow: ["Order service", "Sync: call Stock and wait", "Async: publish OrderPlaced", "Return 202 immediately", "Email service handles later"],
    code: cs`using System.Threading.Channels; ~~ An in-memory queue to imitate a broker / broker-এর মতো in-memory queue
async Task<bool> CheckStockAsync(string sku) { await Task.Delay(50); return true; } ~~ Pretend HTTP call to the Stock service / Stock service-এ নকল HTTP call
bool inStock = await CheckStockAsync("TEA-1"); ~~ SYNC: we wait for the answer / SYNC: উত্তরের অপেক্ষা
Console.WriteLine($"Sync: order service waited and got inStock={inStock}"); ~~ Needed before we continue / এগোনোর আগে দরকার
var bus = Channel.CreateUnbounded<string>(); ~~ The 'message broker' / বার্তার broker
var emailService = Task.Run(async () => ~~ Another service listening in the background / পেছনে শুনছে অন্য service
{
    await foreach (var evt in bus.Reader.ReadAllAsync()) ~~ Process messages as they arrive / বার্তা এলে কাজ
        Console.WriteLine($"Async: email service handled '{evt}'"); ~~ Happens later / পরে ঘটে
});
await bus.Writer.WriteAsync("OrderPlaced #1001"); ~~ ASYNC: publish and do not wait / ASYNC: পাঠান, অপেক্ষা নয়
Console.WriteLine("Order service returned 202 Accepted"); ~~ The user gets a fast response / user দ্রুত উত্তর পায়
bus.Writer.Complete(); ~~ No more messages (demo only) / আর বার্তা নেই
await emailService; ~~ Let the demo finish / demo শেষ হোক`,
    output: `Sync: order service waited and got inStock=True
Order service returned 202 Accepted
Async: email service handled 'OrderPlaced #1001'
(the last two lines may swap: async work runs independently)`,
    caution:
      "Long chains of sync calls (A calls B calls C calls D) multiply latency and failure risk. Async messaging needs idempotent consumers, retries, a dead-letter queue and the transactional outbox so a message is not lost if the app crashes after saving to SQL Server.",
    exercise: "Make CheckStockAsync throw an exception and see how the sync caller fails, while the async email path is unaffected.",
  },
  {
    topic: "REST vs gRPC",
    en: "REST sends JSON over HTTP and is readable, cache-friendly and works from every browser and tool — the best default for public APIs. gRPC sends compact binary Protobuf messages over HTTP/2, uses a .proto contract that generates strongly typed C# client and server code, and supports streaming — usually faster and great for internal service-to-service calls. ASP.NET Core supports both: Minimal APIs/controllers for REST and the Grpc.AspNetCore package for gRPC.",
    bn: "REST HTTP-তে JSON পাঠায় — পড়া সহজ, cache করা যায়, সব browser ও tool-এ চলে; public API-র জন্য সেরা। gRPC HTTP/2-তে ছোট binary Protobuf পাঠায়, .proto চুক্তি থেকে C# client-server কোড বানায়, streaming সমর্থন করে — সাধারণত দ্রুত, ভেতরের service-to-service call-এর জন্য ভালো।",
    analogy: [
      "REST is a letter written in plain language that anyone can read. gRPC is a pre-printed form with numbered boxes that both offices agreed on: faster to fill and process, but you need the same form.",
      "REST হলো সাধারণ ভাষায় লেখা চিঠি, যে কেউ পড়তে পারে। gRPC হলো দুই অফিসের আগে থেকে ঠিক করা নম্বরযুক্ত ছাপানো ফর্ম: দ্রুত পূরণ ও প্রক্রিয়া হয়, কিন্তু একই ফর্ম লাগে।",
    ],
    flow: ["Write .proto contract", "Generate C# code", "Server implements base class", "Client calls typed method", "Binary over HTTP/2"],
    code: cs`// orders.proto (the contract both services share): ~~ gRPC is contract-first / gRPC আগে চুক্তি লেখে
// service Orders { rpc GetOrder (OrderRequest) returns (OrderReply); } ~~ One remote method / একটি remote method
// message OrderRequest { int32 id = 1; } ~~ Field numbers, not names, go on the wire / নাম নয়, নম্বর যায়
// message OrderReply { int32 id = 1; double total = 2; } ~~ Compact binary response / ছোট binary উত্তর
public class OrdersService : Orders.OrdersBase ~~ Base class generated from the .proto / .proto থেকে তৈরি base class
{
    public override Task<OrderReply> GetOrder(OrderRequest request, ServerCallContext context) ~~ Implement the method / method লিখুন
        => Task.FromResult(new OrderReply { Id = request.Id, Total = 1250.50 }); ~~ Typed response, no JSON parsing / typed উত্তর
}
// Client: var client = new Orders.OrdersClient(GrpcChannel.ForAddress("https://localhost:7001")); ~~ Typed client / টাইপ-নিরাপদ client
// var reply = await client.GetOrderAsync(new OrderRequest { Id = 7 }); ~~ Looks like a local method call / local method-এর মতো
// REST version: app.MapGet("/orders/{id}", (int id) => new { id, total = 1250.50 }); ~~ Same thing as JSON over HTTP / একই কাজ JSON-এ`,
    output: `REST:  GET /orders/7       -> {"id":7,"total":1250.5}   (readable JSON, ~25 bytes)
gRPC:  Orders.GetOrder(7)  -> OrderReply{Id=7,Total=1250.5} (binary Protobuf, ~11 bytes)`,
    kind: "Reference example",
    setup:
      "Create the server with 'dotnet new grpc -n OrdersGrpc', put the message and service definitions in Protos/orders.proto, and add the client package Grpc.Net.Client plus Google.Protobuf and Grpc.Tools in the caller.",
    caution:
      "Browsers cannot call gRPC directly (use gRPC-Web or JSON transcoding). gRPC needs HTTP/2 end to end, so check load balancers and proxies. Never reuse or renumber Protobuf field numbers after release.",
    exercise: "List three of your APIs and decide REST or gRPC for each: public mobile API, internal price calculator called 1000 times per second, partner webhook.",
  },
  {
    topic: "Service Discovery",
    en: "In microservices, instances start, stop and move all the time, so hard-coding IP addresses breaks. Service discovery lets a caller ask for a service by name ('catalog') and get a healthy address. It can be client-side (the caller asks a registry like Consul and picks an instance) or server-side (the caller hits a load balancer or Kubernetes Service, which picks for it). In Kubernetes, http://catalog just works through DNS; in .NET Aspire, Microsoft.Extensions.ServiceDiscovery resolves names like https+http://catalog.",
    bn: "Microservice-এ instance চালু-বন্ধ-স্থানান্তর হয়, তাই IP hard-code করলে ভাঙে। Service discovery-তে নাম দিয়ে ('catalog') জিজ্ঞেস করলে একটি সুস্থ address পাওয়া যায়। Client-side (registry যেমন Consul থেকে নিজে বাছাই) বা server-side (load balancer/Kubernetes Service বাছে)। Kubernetes-এ http://catalog DNS দিয়েই কাজ করে।",
    analogy: [
      "Instead of memorising which doctor sits in which room today, you ask the hospital reception 'cardiology please' and they send you to a doctor who is available right now.",
      "আজ কোন ডাক্তার কোন রুমে বসেছেন মুখস্থ না করে রিসেপশনে বলেন 'হৃদরোগ বিভাগ', তারা এখন খালি এমন ডাক্তারের কাছে পাঠায়।",
    ],
    flow: ["Instance starts", "Registers name + address", "Caller asks by name", "Registry returns healthy instance", "Dead instances removed"],
    code: cs`var registry = new Dictionary<string, List<string>>(); ~~ Service name to live addresses / নাম থেকে চালু address
void Register(string name, string url) ~~ Called when an instance starts / instance চালু হলে
{
    if (!registry.ContainsKey(name)) registry[name] = new List<string>(); ~~ First instance of this service / এই service-এর প্রথম instance
    registry[name].Add(url); ~~ Add the address / address যোগ
}
Register("catalog", "http://10.0.1.5:8080"); ~~ Instance 1 / instance ১
Register("catalog", "http://10.0.1.6:8080"); ~~ Instance 2 / instance ২
int counter = 0; ~~ For round-robin choice / পালাক্রমে বাছাইয়ের জন্য
string Resolve(string name) ~~ Caller asks by name, not IP / caller নাম দিয়ে চায়
{
    var list = registry[name]; ~~ All known instances / সব জানা instance
    return list[counter++ % list.Count]; ~~ Spread calls across instances / instance-গুলোতে ভাগ
}
for (int i = 1; i <= 3; i++) ~~ Three calls / তিনটি call
    Console.WriteLine($"call {i}: catalog -> {Resolve("catalog")}"); ~~ See which instance answered / কোন instance পেল
registry["catalog"].Remove("http://10.0.1.5:8080"); ~~ Health check failed: remove it / health check ব্যর্থ: বাদ
Console.WriteLine($"after failure: catalog -> {Resolve("catalog")}"); ~~ Only healthy ones are returned / শুধু সুস্থগুলো`,
    output: `call 1: catalog -> http://10.0.1.5:8080
call 2: catalog -> http://10.0.1.6:8080
call 3: catalog -> http://10.0.1.5:8080
after failure: catalog -> http://10.0.1.6:8080`,
    bash: `# Kubernetes gives every Service a DNS name — service discovery for free:
kubectl get svc catalog                 # stable virtual IP for all catalog pods
kubectl get endpoints catalog           # the real pod IPs behind it (only Ready pods)
# From any pod: curl http://catalog.shop.svc.cluster.local/health`,
    caution:
      "The registry must remove dead instances quickly (health checks or heartbeats); otherwise callers keep hitting them. Cache lookups briefly but not forever. Do not reinvent this in production — use Kubernetes Services, Consul or .NET Aspire service discovery.",
    exercise: "Add a heartbeat timestamp per instance and make Resolve skip instances not seen in the last 10 seconds.",
  },
  {
    topic: "Database per Service",
    en: "In microservices each service owns its data: the Orders service has OrdersDb, the Customers service has CustomersDb, and no service reads another's tables directly. This keeps services independent — you can change a schema without breaking others. The cost: no cross-database JOINs or foreign keys between services. To show an order with a customer name, either call the Customers API, or keep a small local copy (snapshot) of customer names updated by CustomerUpdated events.",
    bn: "Microservice-এ প্রতিটি service নিজের data-র মালিক: Orders-এর OrdersDb, Customers-এর CustomersDb; কেউ অন্যের table সরাসরি পড়ে না। এতে service স্বাধীন থাকে। খরচ: service-এর মধ্যে JOIN বা foreign key নেই। Order-এর সাথে customer-এর নাম দেখাতে Customers API ডাকুন, অথবা event দিয়ে আপডেট হওয়া একটি ছোট local copy রাখুন।",
    analogy: [
      "Each shop in a market keeps its own account book. The tea shop does not open the grocery shop's book; if it needs something, it asks the grocer or keeps its own note of what the grocer told it.",
      "বাজারের প্রতিটি দোকানের নিজের হিসাবের খাতা। চায়ের দোকান মুদির খাতা খোলে না; দরকার হলে মুদিকে জিজ্ঞেস করে বা যা জেনেছে নিজের খাতায় লিখে রাখে।",
    ],
    flow: ["Orders service + OrdersDb", "Customers service + CustomersDb", "No cross-DB JOIN", "Call API or listen to events", "Local snapshot for reads"],
    code: cs`var customersDb = new Dictionary<int, string> { [1] = "Karim", [2] = "Salma" }; ~~ Private to the Customers service / Customers service-এর নিজস্ব
var ordersDb = new List<(int OrderId, int CustomerId, decimal Total)> ~~ Private to the Orders service / Orders service-এর নিজস্ব
{
    (1001, 1, 950m), ~~ Orders store only the CustomerId / শুধু CustomerId রাখে
    (1002, 2, 120m), ~~ Another order of customer 2 / ২ নম্বর customer-এর আরেকটি order
};
string GetCustomerName(int id) => customersDb[id]; ~~ In real life: HTTP or gRPC call to the Customers API / আসলে Customers API call
foreach (var o in ordersDb) ~~ Build the screen by combining in code / কোডে জোড়া দিয়ে screen বানান
    Console.WriteLine($"Order {o.OrderId}: {GetCustomerName(o.CustomerId)} paid {o.Total}"); ~~ Show the combined result / মিলিত ফল
Console.WriteLine("No cross-database JOIN: ask the owner service or keep a local copy updated by events."); ~~ The rule / নিয়ম`,
    output: `Order 1001: Karim paid 950
Order 1002: Salma paid 120
No cross-database JOIN: ask the owner service or keep a local copy updated by events.`,
    sql: `-- Each service gets its own database (and its own SQL login with access only to it)
CREATE DATABASE OrdersDb;
CREATE DATABASE CustomersDb;
GO
USE OrdersDb;
CREATE TABLE dbo.Orders (
    OrderId    int PRIMARY KEY,
    CustomerId int NOT NULL,          -- just an ID: no FOREIGN KEY into CustomersDb
    Total      decimal(12,2) NOT NULL);
-- Optional local read copy, filled by CustomerUpdated events
CREATE TABLE dbo.CustomerSnapshot (
    CustomerId int PRIMARY KEY,
    Name       nvarchar(100) NOT NULL,
    UpdatedAt  datetime2 NOT NULL);
-- Fast screen query stays inside OrdersDb
SELECT o.OrderId, s.Name, o.Total
FROM dbo.Orders AS o
LEFT JOIN dbo.CustomerSnapshot AS s ON s.CustomerId = o.CustomerId;`,
    caution:
      "Sharing one database between services ('integration database') silently couples them. Separate databases can still live on the same SQL Server instance at first — the rule is ownership, not hardware. Expect eventual consistency in local copies.",
    exercise: "Write the SQL MERGE that applies a CustomerUpdated event (CustomerId, Name, UpdatedAt) to CustomerSnapshot, ignoring older events.",
  },
  {
    topic: "CQRS",
    en: "CQRS (Command Query Responsibility Segregation) separates writes from reads. Commands change state (PlaceOrder) and enforce business rules on a normalized write model. Queries only read (GetSalesForCustomer) from a read model shaped exactly for the screen — a view, a denormalized table, or even a different database. The read model is updated after each write, often through events. It helps when reads and writes have very different needs; for simple CRUD it is unnecessary.",
    bn: "CQRS লেখা ও পড়া আলাদা করে। Command অবস্থা বদলায় (PlaceOrder) এবং normalized write model-এ ব্যবসার নিয়ম মানে। Query শুধু পড়ে, screen-এর মতো করে সাজানো read model থেকে (view বা আলাদা table)। প্রতিটি লেখার পরে read model আপডেট হয়, প্রায়ই event দিয়ে। পড়া ও লেখার চাহিদা খুব আলাদা হলে কাজে লাগে; সাধারণ CRUD-এ দরকার নেই।",
    analogy: [
      "A restaurant kitchen takes orders on detailed tickets (commands, write model), while the front display board shows only 'Order 42 ready' (read model) — built for customers to read quickly.",
      "রেস্টুরেন্টের রান্নাঘর বিস্তারিত টিকিটে অর্ডার নেয় (command, write model), আর সামনের বোর্ডে শুধু '৪২ নম্বর অর্ডার তৈরি' (read model) — দ্রুত পড়ার জন্য।",
    ],
    flow: ["Command PlaceOrder", "Validate + write model", "Event OrderPlaced", "Update read model", "Query reads read model"],
    code: cs`var orders = new List<(int Id, string Customer, decimal Total)>(); ~~ WRITE model: every order, normalized / লেখার model: প্রতিটি order
var salesByCustomer = new Dictionary<string, decimal>(); ~~ READ model: totals ready for the dashboard / পড়ার model: আগে থেকে হিসাব করা মোট
void PlaceOrder(int id, string customer, decimal total) ~~ COMMAND: changes state / COMMAND: অবস্থা বদলায়
{
    if (total <= 0) throw new ArgumentException("Total must be positive"); ~~ Business rule lives on the write side / নিয়ম লেখার দিকে
    orders.Add((id, customer, total)); ~~ Save to the write model / write model-এ রাখুন
    salesByCustomer[customer] = salesByCustomer.GetValueOrDefault(customer) + total; ~~ Update the read side (often via an event) / read দিক আপডেট
}
decimal GetSales(string customer) => salesByCustomer.GetValueOrDefault(customer); ~~ QUERY: read only, no side effects / QUERY: শুধু পড়ে
PlaceOrder(1, "Rahim", 500m); ~~ Command 1 / command ১
PlaceOrder(2, "Rahim", 250m); ~~ Command 2 / command ২
PlaceOrder(3, "Karim", 100m); ~~ Command 3 / command ৩
Console.WriteLine($"Rahim total: {GetSales("Rahim")}"); ~~ Query: no SUM at read time / query: পড়ার সময় SUM লাগে না
Console.WriteLine($"Karim total: {GetSales("Karim")}"); ~~ Query again / আবার query`,
    output: `Rahim total: 750
Karim total: 100`,
    sql: `-- Write model
CREATE TABLE dbo.Orders (
    OrderId  int PRIMARY KEY,
    Customer nvarchar(50) NOT NULL,
    Total    decimal(12,2) NOT NULL);
GO
-- Read model: an indexed view that SQL Server keeps up to date on every write
CREATE VIEW dbo.vCustomerSales WITH SCHEMABINDING AS
SELECT Customer, SUM(Total) AS Sales, COUNT_BIG(*) AS OrderCount
FROM dbo.Orders
GROUP BY Customer;
GO
CREATE UNIQUE CLUSTERED INDEX IX_vCustomerSales ON dbo.vCustomerSales (Customer);
GO
-- Query side
SELECT Customer, Sales FROM dbo.vCustomerSales WITH (NOEXPAND) WHERE Customer = N'Rahim';`,
    caution:
      "When the read model is updated asynchronously, users may not see their own change for a moment (eventual consistency) — design the UI for it. CQRS does not require MediatR or event sourcing; those are separate choices.",
    exercise: "Add a second read model: number of orders per customer. Update it in PlaceOrder and add a query for it.",
  },
  {
    topic: "Event Sourcing",
    en: "Normally a table stores only the current state (Balance = 750). With event sourcing you store every change as an event in an append-only log (AccountOpened, Deposited 1000, Withdrawn 300, Deposited 50) and calculate the current state by replaying them. You get a full audit history and can rebuild any past state or new read models. Events are never updated or deleted; mistakes are fixed with new correcting events. Snapshots avoid replaying very long histories.",
    bn: "সাধারণত table-এ শুধু বর্তমান অবস্থা থাকে (Balance = 750)। Event sourcing-এ প্রতিটি পরিবর্তন event হিসেবে append-only log-এ রাখা হয় (Deposited 1000, Withdrawn 300...) এবং সেগুলো আবার চালিয়ে (replay) বর্তমান অবস্থা বের করা হয়। পুরো audit ইতিহাস পাওয়া যায়। Event কখনো update/delete হয় না; ভুল ঠিক করতে নতুন সংশোধনী event।",
    analogy: [
      "A bank passbook: it does not just show today's balance, it lists every deposit and withdrawal. You can always recompute the balance, and a mistake is fixed by a new correcting line, not by erasing ink.",
      "ব্যাংকের পাসবই: শুধু আজকের balance নয়, প্রতিটি জমা ও উত্তোলন লেখা থাকে। যেকোনো সময় balance আবার হিসাব করা যায়, ভুল হলে মুছে নয়, নতুন সংশোধনী লাইন দিয়ে ঠিক করা হয়।",
    ],
    flow: ["Command Withdraw 300", "Validate on replayed state", "Append event", "Replay events", "Current state or read model"],
    code: cs`var events = new List<(string Type, decimal Amount)>(); ~~ Append-only event store / শুধু যোগ করা যায় এমন store
events.Add(("AccountOpened", 0m)); ~~ Event 1 / event ১
events.Add(("Deposited", 1000m)); ~~ Event 2 / event ২
events.Add(("Withdrawn", 300m)); ~~ Event 3 / event ৩
events.Add(("Deposited", 50m)); ~~ Event 4 / event ৪
decimal balance = 0; ~~ Start from nothing / শূন্য থেকে শুরু
foreach (var e in events) ~~ Replay history in order / ক্রমমতো ইতিহাস চালান
    balance = e.Type switch ~~ Apply each event to the state / প্রতিটি event প্রয়োগ
    {
        "Deposited" => balance + e.Amount, ~~ Money in / টাকা জমা
        "Withdrawn" => balance - e.Amount, ~~ Money out / টাকা তোলা
        _ => balance, ~~ Other events do not change the balance / অন্য event-এ পরিবর্তন নেই
    };
Console.WriteLine($"Events stored: {events.Count}"); ~~ Full history kept / পুরো ইতিহাস
Console.WriteLine($"Current balance (replayed): {balance}"); ~~ State is derived, not stored / অবস্থা হিসাব করে পাওয়া`,
    output: `Events stored: 4
Current balance (replayed): 750`,
    sql: `CREATE TABLE dbo.AccountEvents (
    AccountId  int          NOT NULL,
    Version    int          NOT NULL,   -- 1, 2, 3 ... per account
    EventType  varchar(50)  NOT NULL,
    Amount     decimal(12,2) NOT NULL,
    OccurredAt datetime2    NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_AccountEvents PRIMARY KEY (AccountId, Version)  -- same Version twice = concurrency conflict
);
INSERT dbo.AccountEvents (AccountId, Version, EventType, Amount) VALUES
    (1, 1, 'AccountOpened', 0), (1, 2, 'Deposited', 1000), (1, 3, 'Withdrawn', 300), (1, 4, 'Deposited', 50);
-- Replay in SQL: current balance
SELECT SUM(CASE EventType WHEN 'Deposited' THEN Amount WHEN 'Withdrawn' THEN -Amount ELSE 0 END) AS Balance
FROM dbo.AccountEvents
WHERE AccountId = 1;
-- Balance as it was after version 3 (time travel)
SELECT SUM(CASE EventType WHEN 'Deposited' THEN Amount WHEN 'Withdrawn' THEN -Amount ELSE 0 END)
FROM dbo.AccountEvents WHERE AccountId = 1 AND Version <= 3;`,
    caution:
      "Event sourcing adds real complexity (versioning event schemas, snapshots, projections). Use it where history is the business (banking, ledgers, audit), not for every table. The (AccountId, Version) primary key gives optimistic concurrency for free.",
    exercise: "Add a rule: reject a Withdrawn event if the replayed balance would go below zero.",
  },
  {
    topic: "Distributed Transactions",
    en: "A distributed transaction updates data in more than one database or service and wants all-or-nothing. Two-phase commit (2PC) uses a coordinator: phase 1 asks every participant to prepare and lock, phase 2 tells all to commit (or all to roll back). It is strongly consistent but slow, blocking and fragile across microservices. The Saga pattern instead runs a sequence of local transactions; if a step fails, it runs compensating actions for the steps already done (refund the payment). SQL Server supports 2PC via MSDTC; microservices usually use sagas.",
    bn: "Distributed transaction একাধিক database বা service-এ data বদলায় এবং সব-অথবা-কিছুই-না চায়। Two-phase commit (2PC)-এ coordinator প্রথমে সবাইকে prepare ও lock করতে বলে, তারপর সবাইকে commit বা rollback করতে বলে — নির্ভুল কিন্তু ধীর ও আটকে যায়। Saga ধাপে ধাপে local transaction চালায়; কোনো ধাপ ব্যর্থ হলে আগের ধাপগুলোর উল্টো কাজ (compensation) করে, যেমন টাকা ফেরত।",
    analogy: [
      "2PC is a wedding: the officiant asks both 'do you agree?' and only when both say yes is it final. A saga is booking a trip step by step: book flight, book hotel; if the hotel is full, cancel the flight you already booked.",
      "2PC হলো বিয়ে: কাজী দুজনকেই জিজ্ঞেস করেন 'রাজি?', দুজন হ্যাঁ বললে তবেই চূড়ান্ত। Saga হলো ধাপে ধাপে ভ্রমণ বুকিং: প্লেন, তারপর হোটেল; হোটেল না পেলে আগের প্লেন টিকিট বাতিল।",
    ],
    flow: ["Step 1 local tx: reserve payment", "Step 2 local tx: reserve stock", "Step 2 fails", "Compensate step 1: refund", "Saga ends consistent"],
    code: cs`var log = new List<string>(); ~~ What happened, in order / যা ঘটল, ক্রমমতো
bool ReservePayment() { log.Add("Payment reserved (local transaction in PaymentsDb)"); return true; } ~~ Step 1 succeeds / ধাপ ১ সফল
bool ReserveStock() { log.Add("Stock reservation FAILED (out of stock)"); return false; } ~~ Step 2 fails / ধাপ ২ ব্যর্থ
void RefundPayment() => log.Add("COMPENSATE: payment refunded"); ~~ Undo for step 1 / ধাপ ১-এর উল্টো কাজ
if (ReservePayment()) ~~ Run step 1 / ধাপ ১ চালান
{
    if (!ReserveStock()) RefundPayment(); ~~ Step 2 failed: compensate earlier steps in reverse / ব্যর্থ: আগের ধাপ উল্টান
}
log.ForEach(Console.WriteLine); ~~ Print the story / ঘটনা দেখান
Console.WriteLine("2PC alternative: a coordinator locks both databases until all vote YES"); ~~ Strong but slow and blocking / নির্ভুল কিন্তু ধীর`,
    output: `Payment reserved (local transaction in PaymentsDb)
Stock reservation FAILED (out of stock)
COMPENSATE: payment refunded
2PC alternative: a coordinator locks both databases until all vote YES`,
    sql: `-- 2PC in SQL Server: MSDTC coordinates two servers (linked server WAREHOUSE-SRV)
BEGIN DISTRIBUTED TRANSACTION;
    UPDATE PaymentsDb.dbo.Payments SET Status = 'Reserved' WHERE PaymentId = 1;
    UPDATE [WAREHOUSE-SRV].InventoryDb.dbo.Stock SET Qty = Qty - 1 WHERE Sku = 'TEA-1';
COMMIT TRANSACTION;   -- both commit, or both roll back

-- Saga style: each service only runs a LOCAL transaction ...
BEGIN TRAN;
    UPDATE dbo.Payments SET Status = 'Reserved' WHERE PaymentId = 1;
COMMIT;
-- ... and, if a later step fails, a LOCAL compensating transaction
BEGIN TRAN;
    UPDATE dbo.Payments SET Status = 'Refunded' WHERE PaymentId = 1 AND Status = 'Reserved';
COMMIT;`,
    caution:
      "Compensations must be idempotent (safe to run twice) because messages can be delivered more than once. Between steps the system is temporarily inconsistent — show states like 'Pending' in the UI. Avoid MSDTC across cloud microservices; many managed databases do not support it.",
    exercise: "Add a third step (ArrangeDelivery) that fails. Which compensations run, and in what order?",
    interview: [
      "Q: 2PC vs Saga? A: 2PC gives atomic commit with locks and a coordinator (blocking); Saga uses local transactions plus compensations (available, eventually consistent).",
      "প্রশ্ন: 2PC বনাম Saga? উত্তর: 2PC lock ও coordinator দিয়ে একসাথে commit (আটকে যায়); Saga local transaction ও compensation দিয়ে (ধীরে ধীরে consistent)।",
    ],
  },
  {
    topic: "Service Mesh",
    en: "A service mesh (Istio, Linkerd) adds a small proxy, called a sidecar, next to every service instance. All traffic between services goes through these proxies, which handle mutual TLS encryption, retries, timeouts, traffic splitting for canary releases, and metrics — without changing your C# code. The control plane configures all the sidecars from central rules. It is powerful for many services on Kubernetes but adds operational complexity and some latency.",
    bn: "Service mesh (Istio, Linkerd) প্রতিটি service-এর পাশে একটি ছোট proxy (sidecar) বসায়। Service-গুলোর মধ্যে সব traffic এই proxy দিয়ে যায়, যা mTLS encryption, retry, timeout, canary release-এর জন্য traffic ভাগ এবং metrics সামলায় — আপনার C# কোড না বদলেই। Control plane কেন্দ্রীয় নিয়ম দিয়ে সব sidecar চালায়।",
    analogy: [
      "Every employee gets a personal assistant who handles security checks, re-sends lost letters and logs every call. The employee just does the real work; the head office sets the rules for all assistants.",
      "প্রতিটি কর্মীর একজন ব্যক্তিগত সহকারী, যে নিরাপত্তা যাচাই করে, হারানো চিঠি আবার পাঠায়, প্রতিটি কল লিখে রাখে। কর্মী শুধু আসল কাজ করেন; সব সহকারীর নিয়ম ঠিক করে প্রধান অফিস।",
    ],
    flow: ["App calls http://payments", "Local sidecar intercepts", "mTLS + retry + timeout", "Remote sidecar", "Payments app"],
    code: cs`using System.Diagnostics; ~~ Stopwatch for the latency metric / latency মাপার Stopwatch
int calls = 0; ~~ Counts attempts so the first one can fail / প্রথমটি ব্যর্থ করানোর জন্য গণনা
async Task<string> AppCallAsync() { await Task.Delay(10); return ++calls == 1 ? "503" : "200 OK"; } ~~ Plain app call: no retry or TLS code here / সাধারণ app call
async Task<string> SidecarAsync(Func<Task<string>> call) ~~ What the sidecar proxy (Envoy) adds around EVERY call / sidecar যা যোগ করে
{
    Console.WriteLine("sidecar: mTLS encrypt and verify identity of 'payments'"); ~~ Security without app code / কোড ছাড়াই নিরাপত্তা
    for (int attempt = 1; attempt <= 3; attempt++) ~~ Retry policy from central config / কেন্দ্রীয় retry নিয়ম
    {
        var sw = Stopwatch.StartNew(); ~~ Measure each attempt / প্রতিটি চেষ্টা মাপুন
        string result = await call(); ~~ Forward the real request / আসল request পাঠান
        Console.WriteLine($"sidecar: attempt {attempt} -> {result}, latency metric {sw.ElapsedMilliseconds} ms"); ~~ Metrics for dashboards / dashboard-এর metric
        if (result.StartsWith("200")) return result; ~~ Success: stop retrying / সফল: থামুন
    }
    return "503 after retries"; ~~ Give up / হাল ছাড়ুন
}
Console.WriteLine($"app got: {await SidecarAsync(AppCallAsync)}"); ~~ The app only sees the final answer / app শুধু চূড়ান্ত উত্তর দেখে`,
    output: `sidecar: mTLS encrypt and verify identity of 'payments'
sidecar: attempt 1 -> 503, latency metric 11 ms
sidecar: attempt 2 -> 200 OK, latency metric 10 ms
app got: 200 OK`,
    bash: `# Istio: turn on sidecar injection for a namespace, then every new pod gets an Envoy proxy
kubectl label namespace shop istio-injection=enabled
kubectl rollout restart deployment -n shop
kubectl get pods -n shop      # READY shows 2/2: your app + the sidecar`,
    caution:
      "Do not retry in both your code (Polly) and the mesh — retries multiply. A mesh is rarely worth it for 3-5 services; start with ASP.NET Core resilience handlers and OpenTelemetry, and adopt a mesh when you have many teams and services.",
    exercise: "Make the first two attempts fail. What does the app receive? What if all three fail?",
  },
  {
    topic: "Distributed Tracing",
    en: "One user click may pass through the gateway, Orders, Payments and SQL Server. Distributed tracing follows that single request across all of them. Every request gets a trace ID; each step inside it is a span with a start, duration and parent span. The trace ID travels between services in the W3C traceparent HTTP header. In .NET, System.Diagnostics.Activity creates spans, and OpenTelemetry automatically records ASP.NET Core, HttpClient and SqlClient spans and exports them to Jaeger, Zipkin, Grafana Tempo or Azure Monitor.",
    bn: "একটি click gateway, Orders, Payments ও SQL Server পেরিয়ে যেতে পারে। Distributed tracing এই একটি request-কে সব জায়গায় অনুসরণ করে। প্রতিটি request-এর একটি trace ID, ভেতরের প্রতিটি ধাপ একটি span (শুরু, সময়, parent)। Trace ID service থেকে service-এ traceparent header-এ যায়। .NET-এ Activity দিয়ে span তৈরি হয়, OpenTelemetry স্বয়ংক্রিয়ভাবে ASP.NET Core, HttpClient ও SqlClient-এর span রেকর্ড করে।",
    analogy: [
      "A parcel tracking number: the same number is scanned at the shop, the sorting centre, the truck and your door, so you can see exactly where the time was spent.",
      "পার্সেলের tracking নম্বর: দোকান, বাছাই কেন্দ্র, ট্রাক ও আপনার দরজায় একই নম্বর স্ক্যান হয়, তাই কোথায় কত সময় গেল দেখা যায়।",
    ],
    flow: ["Request gets trace ID", "Span: POST /orders", "Child span: call payments", "Child span: SQL INSERT", "Export to tracing UI"],
    code: cs`using System.Diagnostics; ~~ Activity and ActivitySource are built into .NET / .NET-এ built-in
var source = new ActivitySource("Shop.Orders"); ~~ A named source of spans for this service / এই service-এর span-এর উৎস
ActivitySource.AddActivityListener(new ActivityListener ~~ OpenTelemetry does this for you; here we print spans ourselves / নিজেই span print করছি
{
    ShouldListenTo = _ => true, ~~ Listen to every source / সব উৎস শুনুন
    Sample = (ref ActivityCreationOptions<ActivityContext> _) => ActivitySamplingResult.AllDataAndRecorded, ~~ Record everything (demo) / সব রেকর্ড
    ActivityStopped = a => Console.WriteLine( ~~ Called when a span ends / span শেষ হলে
        $"span {a.DisplayName,-14} trace={a.TraceId.ToString()[..8]} parent={a.ParentSpanId.ToString()[..4]} {a.Duration.TotalMilliseconds:F0} ms"), ~~ Same trace, different spans / একই trace, আলাদা span
});
using (var request = source.StartActivity("POST /orders")) ~~ Root span: the whole request / মূল span
{
    using (source.StartActivity("call payments")) { await Task.Delay(30); } ~~ Child span: HTTP call to another service / child span: অন্য service
    using (source.StartActivity("SQL INSERT")) { await Task.Delay(10); } ~~ Child span: database work / child span: database-এর কাজ
    Console.WriteLine($"traceparent header sent onward: {request?.Id}"); ~~ W3C header that carries the trace to the next service / পরের service-এ যায়
}`,
    output: `span call payments  trace=4bf92f35 parent=00f0 31 ms
span SQL INSERT     trace=4bf92f35 parent=00f0 11 ms
traceparent header sent onward: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
span POST /orders   trace=4bf92f35 parent=0000 43 ms
(IDs are random each run; all spans share one trace ID)`,
    bash: `# Real setup in an ASP.NET Core project (OpenTelemetry):
dotnet add package OpenTelemetry.Extensions.Hosting
dotnet add package OpenTelemetry.Instrumentation.AspNetCore
dotnet add package OpenTelemetry.Instrumentation.Http
dotnet add package OpenTelemetry.Instrumentation.SqlClient
dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol
# Program.cs:
#   builder.Services.AddOpenTelemetry().WithTracing(t => t
#       .AddAspNetCoreInstrumentation().AddHttpClientInstrumentation()
#       .AddSqlClientInstrumentation().AddOtlpExporter());
docker run -d -p 16686:16686 -p 4317:4317 jaegertracing/all-in-one   # UI at http://localhost:16686`,
    caution:
      "Sample in production (for example 10 percent plus all errors) — recording every span is expensive. Never put passwords, tokens or full SQL parameter values in span tags. Put the trace ID in your logs so logs and traces can be linked.",
    exercise: "Add a third child span 'publish OrderPlaced' and make 'call payments' a parent of a nested 'fraud check' span. How do the parent IDs change?",
  },
];
