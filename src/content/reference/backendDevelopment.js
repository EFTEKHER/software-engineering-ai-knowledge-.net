// Extra depth for the Backend Development module (module 06): a tiny story,
// plain-language theory, four steps, common mistakes and two more runnable
// examples per lesson, in English and Bangla.
import { consoleEx, webEx } from "./aspnetHelpers";
import { moreBackendDevelopment } from "./backendDevelopment2";

const partOne = {
  "REST APIs": {
    storyEn:
      "A library has shelves with addresses (/books/42). You do not shout 'give me book 42 and also delete it'. You walk to the address and say one clear verb: look (GET), add (POST), replace (PUT) or remove (DELETE). The librarian answers with a short code: found, created, not here.",
    storyBn:
      "লাইব্রেরির তাকের ঠিকানা আছে (/books/42)। আপনি চিৎকার করে 'বই ৪২ দাও আর মুছেও দাও' বলেন না। ঠিকানায় গিয়ে একটি পরিষ্কার কাজ বলেন: দেখা (GET), যোগ (POST), বদল (PUT) বা সরানো (DELETE)। লাইব্রেরিয়ান ছোট code-এ উত্তর দেন: পাওয়া গেছে, তৈরি হয়েছে, নেই।",
    theoryEn:
      "REST means you design your API around nouns (resources) such as /products and /orders/7, and you use the HTTP method as the verb. Each request carries everything the server needs (stateless), so any server instance can answer it. GET must not change data and can be cached; PUT and DELETE are idempotent, meaning repeating them gives the same result; POST creates something new each time.",
    theoryBn:
      "REST মানে API-কে বিশেষ্য (resource) ঘিরে বানানো, যেমন /products, /orders/7, আর HTTP method হলো ক্রিয়া। প্রতিটি request-এ server-এর দরকারি সব তথ্য থাকে (stateless), তাই যেকোনো server instance উত্তর দিতে পারে। GET data বদলাবে না এবং cache করা যায়; PUT ও DELETE idempotent, মানে বারবার করলেও ফল একই; POST প্রতিবার নতুন কিছু তৈরি করে।",
    steps: [
      ["Name resources with plural nouns: /products, /products/{id}.", "Plural বিশেষ্য দিয়ে resource নাম দিন: /products, /products/{id}।"],
      ["Map verbs: GET read, POST create, PUT replace, DELETE remove.", "Verb মেলান: GET পড়া, POST তৈরি, PUT বদল, DELETE মুছা।"],
      ["Return the right status: 200, 201, 204, 400, 404.", "সঠিক status দিন: 200, 201, 204, 400, 404।"],
      ["Test each endpoint with curl or Swagger.", "curl বা Swagger দিয়ে প্রতিটি endpoint পরীক্ষা করুন।"],
    ],
    mistakesEn:
      "Verbs in URLs (/getProducts, /deleteProduct?id=5), using GET to change data, returning 200 with an error message inside, and returning different JSON shapes from similar endpoints.",
    mistakesBn:
      "URL-এ ক্রিয়া (/getProducts, /deleteProduct?id=5), GET দিয়ে data বদলানো, ভেতরে error বার্তা রেখে 200 দেওয়া, আর একই রকম endpoint থেকে ভিন্ন আকারের JSON দেওয়া।",
    examples: [
      consoleEx(
        "Idempotency you can see · idempotency চোখে দেখা",
        `var store = new Dictionary<int, string>();
int nextId = 1;
int Post(string name) { store[nextId] = name; return nextId++; }
void Put(int id, string name) => store[id] = name;
void Delete(int id) => store.Remove(id);

Post("Tea"); Post("Tea");                 // POST twice -> two products
Console.WriteLine($"After 2 POST: {store.Count}");
Put(1, "Green Tea"); Put(1, "Green Tea"); // PUT twice -> same result
Console.WriteLine($"After 2 PUT: {store[1]}, count {store.Count}");
Delete(2); Delete(2);                     // DELETE twice -> same result
Console.WriteLine($"After 2 DELETE: count {store.Count}");`,
        "After 2 POST: 2\nAfter 2 PUT: Green Tea, count 2\nAfter 2 DELETE: count 1",
      ),
      webEx(
        "Full resource with all five verbs · পাঁচ verb সহ resource",
        `var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
var books = new Dictionary<int, Book> { [1] = new(1, "C# Basics", 300) };

var api = app.MapGroup("/api/books");
api.MapGet("/", () => books.Values);
api.MapGet("/{id:int}", (int id) => books.TryGetValue(id, out var b) ? Results.Ok(b) : Results.NotFound());
api.MapPost("/", (BookInput input) =>
{
    var id = books.Count == 0 ? 1 : books.Keys.Max() + 1;
    var book = new Book(id, input.Title, input.Price);
    books[id] = book;
    return Results.Created($"/api/books/{id}", book);
});
api.MapPut("/{id:int}", (int id, BookInput input) =>
{
    if (!books.ContainsKey(id)) return Results.NotFound();
    books[id] = new Book(id, input.Title, input.Price);
    return Results.NoContent();
});
api.MapDelete("/{id:int}", (int id) => books.Remove(id) ? Results.NoContent() : Results.NotFound());
app.Run();

public record Book(int Id, string Title, decimal Price);
public record BookInput(string Title, decimal Price);`,
        'curl -k https://localhost:5001/api/books\ncurl -k -X POST https://localhost:5001/api/books -H "Content-Type: application/json" -d "{\\"title\\":\\"EF Core\\",\\"price\\":450}"\ncurl -k -i -X DELETE https://localhost:5001/api/books/1   # 204',
      ),
    ],
  },

  "HTTP and Status Codes": {
    storyEn:
      "A courier always writes a short code on the receipt: delivered (200), new parcel registered (201), wrong address (400), not allowed into the building (403), house not found (404), courier office on fire (500). You understand what happened without opening the parcel.",
    storyBn:
      "Courier রসিদে সবসময় একটি ছোট code লেখে: পৌঁছেছে (200), নতুন পার্সেল নিবন্ধিত (201), ভুল ঠিকানা (400), ভবনে ঢোকার অনুমতি নেই (403), বাড়ি পাওয়া যায়নি (404), courier অফিসে আগুন (500)। পার্সেল না খুলেই বোঝা যায় কী হয়েছে।",
    theoryEn:
      "An HTTP response has a status line, headers and a body. The first digit of the status tells the family: 2xx success, 3xx redirect, 4xx the client made a mistake, 5xx the server failed. Clients, browsers, proxies and monitoring tools all make decisions from that number, so choose it carefully: never hide an error behind 200.",
    theoryBn:
      "HTTP response-এ থাকে status line, header ও body। Status-এর প্রথম অঙ্ক পরিবার বলে: 2xx সফল, 3xx redirect, 4xx client-এর ভুল, 5xx server-এর ব্যর্থতা। Client, browser, proxy ও monitoring সবাই এই সংখ্যা দেখে সিদ্ধান্ত নেয়, তাই সাবধানে বাছুন: error-কে কখনো 200-এর পিছনে লুকাবেন না।",
    steps: [
      ["Decide success code: 200 read, 201 create, 204 no body.", "সফলতার code ঠিক করুন: 200 পড়া, 201 তৈরি, 204 body ছাড়া।"],
      ["Decide client errors: 400 invalid, 401 no login, 403 no permission, 404 missing, 409 conflict.", "Client error: 400 ভুল, 401 login নেই, 403 অনুমতি নেই, 404 নেই, 409 সংঘর্ষ।"],
      ["Let unexpected failures become 500 via a global handler.", "অপ্রত্যাশিত ব্যর্থতা global handler দিয়ে 500 হতে দিন।"],
      ["Inspect real responses with curl -i.", "curl -i দিয়ে আসল response দেখুন।"],
    ],
    mistakesEn:
      "Returning 200 with { success: false }, confusing 401 (who are you?) with 403 (I know you, but no), using 500 for validation errors, and forgetting the Location header on 201.",
    mistakesBn:
      "{ success: false } সহ 200 দেওয়া, 401 (তুমি কে?) আর 403 (চিনি, কিন্তু না) গুলিয়ে ফেলা, validation error-এ 500 দেওয়া, আর 201-এ Location header ভুলে যাওয়া।",
    examples: [
      consoleEx(
        "Classify any status code · যেকোনো status বোঝা",
        `string Family(int code) => (code / 100) switch
{
    2 => "success",
    3 => "redirect",
    4 => "client mistake",
    5 => "server failure",
    _ => "informational",
};
foreach (var code in new[] { 200, 201, 204, 304, 400, 401, 403, 404, 409, 500 })
    Console.WriteLine($"{code} {(System.Net.HttpStatusCode)code,-20} {Family(code)}");`,
        "200 OK                   success\n201 Created              success\n204 NoContent            success\n304 NotModified          redirect\n400 BadRequest           client mistake\n401 Unauthorized         client mistake\n403 Forbidden            client mistake\n404 NotFound             client mistake\n409 Conflict             client mistake\n500 InternalServerError  server failure",
      ),
      webEx(
        "One endpoint, many honest answers · এক endpoint, সৎ উত্তর",
        `var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
var stock = new Dictionary<string, int> { ["tea"] = 5 };

app.MapPost("/orders", (OrderInput o, HttpRequest req) =>
{
    if (o.Quantity <= 0) return Results.BadRequest(new { error = "Quantity must be positive" });   // 400
    if (!req.Headers.ContainsKey("X-User")) return Results.Unauthorized();                        // 401
    if (!stock.TryGetValue(o.Item, out var left)) return Results.NotFound();                       // 404
    if (left < o.Quantity) return Results.Conflict(new { error = $"Only {left} left" });          // 409
    stock[o.Item] = left - o.Quantity;
    return Results.Created($"/orders/{Guid.NewGuid()}", o);                                        // 201
});
app.Run();

public record OrderInput(string Item, int Quantity);`,
        'curl -k -i -X POST https://localhost:5001/orders -H "Content-Type: application/json" -d "{\\"item\\":\\"tea\\",\\"quantity\\":0}"   # 400\ncurl -k -i -X POST https://localhost:5001/orders -H "X-User: asha" -H "Content-Type: application/json" -d "{\\"item\\":\\"tea\\",\\"quantity\\":9}"   # 409\ncurl -k -i -X POST https://localhost:5001/orders -H "X-User: asha" -H "Content-Type: application/json" -d "{\\"item\\":\\"tea\\",\\"quantity\\":2}"   # 201',
      ),
    ],
  },

  "Input Validation": {
    storyEn:
      "A bank teller checks your form before money moves: name filled, amount positive, account number has the right length. Checking at the counter is cheap; fixing a wrong transfer later is expensive.",
    storyBn:
      "টাকা নড়ার আগে ব্যাংকের teller ফর্ম যাচাই করেন: নাম আছে, টাকার অঙ্ক ধনাত্মক, account নম্বরের দৈর্ঘ্য ঠিক। কাউন্টারে যাচাই সস্তা; পরে ভুল transfer ঠিক করা ব্যয়বহুল।",
    theoryEn:
      "Never trust input: it can be missing, too long, the wrong type or malicious. Validate at the edge of your system, as soon as the request arrives. In ASP.NET Core put DataAnnotations on DTOs ([Required], [StringLength], [Range], [EmailAddress]); with [ApiController] invalid models return 400 automatically. Business rules that need the database (email already used) are checked in the service.",
    theoryBn:
      "Input কখনো বিশ্বাস করবেন না: অনুপস্থিত, খুব লম্বা, ভুল type বা ক্ষতিকর হতে পারে। System-এর প্রান্তে, request আসামাত্র যাচাই করুন। ASP.NET Core-এ DTO-তে DataAnnotations দিন ([Required], [StringLength], [Range], [EmailAddress]); [ApiController] থাকলে ভুল model-এ নিজে 400 আসে। Database লাগে এমন নিয়ম (email আগে ব্যবহৃত) service-এ যাচাই হয়।",
    steps: [
      ["Create a DTO for the request body.", "Request body-র জন্য DTO বানান।"],
      ["Add validation attributes to each property.", "প্রতিটি property-তে validation attribute দিন।"],
      ["Use [ApiController] or check ModelState in MVC.", "[ApiController] ব্যবহার করুন বা MVC-তে ModelState দেখুন।"],
      ["Check database rules in the service and return 409.", "Database-নির্ভর নিয়ম service-এ দেখে 409 দিন।"],
    ],
    mistakesEn:
      "Validating only in JavaScript (attackers skip the browser), trusting hidden form fields, building SQL from input strings, and returning raw exception messages for bad input.",
    mistakesBn:
      "শুধু JavaScript-এ যাচাই (attacker browser এড়িয়ে যায়), লুকানো form field বিশ্বাস করা, input string থেকে SQL বানানো, আর ভুল input-এ কাঁচা exception বার্তা দেখানো।",
    examples: [
      consoleEx(
        "Validate many fields at once · একসাথে অনেক field যাচাই",
        `using System.ComponentModel.DataAnnotations;

var input = new SignupDto { Name = "", Age = 12, Email = "asha@" };
var errors = new List<ValidationResult>();
Validator.TryValidateObject(input, new ValidationContext(input), errors, true);
foreach (var e in errors) Console.WriteLine($"{string.Join(",", e.MemberNames)}: {e.ErrorMessage}");

public class SignupDto
{
    [Required(ErrorMessage = "Name is required")] public string Name { get; set; } = "";
    [Range(18, 120, ErrorMessage = "Age must be 18-120")] public int Age { get; set; }
    [EmailAddress(ErrorMessage = "Email is not valid")] public string Email { get; set; } = "";
}`,
        "Name: Name is required\nAge: Age must be 18-120\nEmail: Email is not valid",
      ),
      webEx(
        "Attribute rules plus a database rule · attribute ও database নিয়ম",
        `using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
var app = builder.Build();
app.MapControllers();
app.Run();

public class SignupDto
{
    [Required, StringLength(40, MinimumLength = 2)] public string Name { get; set; } = "";
    [Required, EmailAddress] public string Email { get; set; } = "";
    [Required, MinLength(8)] public string Password { get; set; } = "";
}

[ApiController, Route("api/users")]
public class UsersController : ControllerBase
{
    private static readonly HashSet<string> Emails = new(StringComparer.OrdinalIgnoreCase) { "asha@example.com" };

    [HttpPost]
    public IActionResult Signup(SignupDto dto)                    // attributes already checked -> 400 if bad
    {
        if (Emails.Contains(dto.Email)) return Conflict(new { error = "Email already registered" });
        Emails.Add(dto.Email);
        return Created($"api/users/{dto.Email}", new { dto.Name, dto.Email });
    }
}`,
        'curl -k -i -X POST https://localhost:5001/api/users -H "Content-Type: application/json" -d "{\\"name\\":\\"A\\",\\"email\\":\\"x\\",\\"password\\":\\"1\\"}"   # 400 with 3 errors\ncurl -k -i -X POST https://localhost:5001/api/users -H "Content-Type: application/json" -d "{\\"name\\":\\"Asha\\",\\"email\\":\\"asha@example.com\\",\\"password\\":\\"secret123\\"}"   # 409',
      ),
    ],
  },

  "Pagination": {
    storyEn:
      "A phone book has thousands of names, but you read one page at a time and the page number tells you where you are. An API that returns every row at once is like photocopying the whole book for one phone number.",
    storyBn:
      "ফোন বুকে হাজারো নাম, কিন্তু আপনি একবারে একটি পাতা পড়েন, পাতার নম্বর বলে আপনি কোথায়। সব row একসাথে দেওয়া API মানে একটি নম্বরের জন্য পুরো বই ফটোকপি করা।",
    theoryEn:
      "Offset pagination uses page and pageSize: Skip((page-1)*size).Take(size). It is simple and lets users jump to page 7, but it gets slow on huge tables and can skip or repeat rows when data changes. Keyset (cursor) pagination says 'give me 20 rows after id 1040' using WHERE Id > @lastId ORDER BY Id; it stays fast and stable. Always order by a unique column and cap pageSize.",
    theoryBn:
      "Offset pagination-এ page ও pageSize: Skip((page-1)*size).Take(size)। সহজ, পাতা ৭-এ লাফানো যায়, কিন্তু বিশাল table-এ ধীর এবং data বদলালে row বাদ পড়তে বা দুবার আসতে পারে। Keyset (cursor) pagination বলে 'id 1040-এর পরের ২০টি দাও', WHERE Id > @lastId ORDER BY Id দিয়ে; দ্রুত ও স্থির থাকে। সবসময় unique column দিয়ে order করুন এবং pageSize-এর সীমা দিন।",
    steps: [
      ["Accept page and pageSize (or after) query parameters.", "page ও pageSize (বা after) query parameter নিন।"],
      ["Clamp pageSize to a maximum such as 100.", "pageSize-কে সর্বোচ্চ ১০০-এর মতো সীমায় রাখুন।"],
      ["Order by a unique key before Skip/Take.", "Skip/Take-এর আগে unique key দিয়ে order করুন।"],
      ["Return items plus total or nextCursor.", "Items-এর সাথে total বা nextCursor দিন।"],
    ],
    mistakesEn:
      "Skip/Take without OrderBy (random pages), no maximum page size (a client asks for 1,000,000 rows), counting the whole table on every request of a huge list, and 0-based vs 1-based page confusion.",
    mistakesBn:
      "OrderBy ছাড়া Skip/Take (এলোমেলো পাতা), সর্বোচ্চ page size না রাখা (client ১০,০০,০০০ row চায়), বিশাল list-এ প্রতি request-এ পুরো table গোনা, আর ০ না ১ থেকে পাতা শুরু তা নিয়ে বিভ্রান্তি।",
    examples: [
      consoleEx(
        "Offset and keyset side by side · offset ও keyset পাশাপাশি",
        `var rows = Enumerable.Range(1, 23).Select(i => new Row(i, $"Item {i}")).ToList();

PagedResult<Row> Offset(int page, int size)
{
    size = Math.Clamp(size, 1, 10);
    var items = rows.OrderBy(r => r.Id).Skip((page - 1) * size).Take(size).ToList();
    return new(items, rows.Count, page, (int)Math.Ceiling(rows.Count / (double)size));
}
List<Row> After(int lastId, int size) => rows.Where(r => r.Id > lastId).OrderBy(r => r.Id).Take(size).ToList();

var p3 = Offset(3, 10);
Console.WriteLine($"Page {p3.Page}/{p3.TotalPages}: ids {string.Join(",", p3.Items.Select(r => r.Id))}");
Console.WriteLine($"Asked 500, got {Offset(1, 500).Items.Count} (clamped)");
Console.WriteLine($"After 20: ids {string.Join(",", After(20, 10).Select(r => r.Id))}");

public record Row(int Id, string Name);
public record PagedResult<T>(List<T> Items, int Total, int Page, int TotalPages);`,
        "Page 3/3: ids 21,22,23\nAsked 500, got 10 (clamped)\nAfter 20: ids 21,22,23",
      ),
      webEx(
        "Paged API with EF Core-style query · paged API",
        `var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
var products = Enumerable.Range(1, 95).Select(i => new Product(i, $"Product {i}", i * 10m)).ToList();

app.MapGet("/api/products", (int page = 1, int pageSize = 20) =>
{
    page = Math.Max(1, page);
    pageSize = Math.Clamp(pageSize, 1, 50);
    var query = products.AsQueryable().OrderBy(p => p.Id);          // same shape as an EF Core IQueryable
    var total = query.Count();
    var items = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();
    return Results.Ok(new { page, pageSize, total, totalPages = (total + pageSize - 1) / pageSize, items });
});

app.MapGet("/api/products/feed", (int after = 0, int size = 20) =>
{
    var items = products.Where(p => p.Id > after).OrderBy(p => p.Id).Take(Math.Clamp(size, 1, 50)).ToList();
    return Results.Ok(new { items, nextCursor = items.Count > 0 ? items[^1].Id : (int?)null });
});
app.Run();

public record Product(int Id, string Name, decimal Price);`,
        'curl -k "https://localhost:5001/api/products?page=5&pageSize=20"\ncurl -k "https://localhost:5001/api/products/feed?after=40&size=5"',
      ),
    ],
  },

  "API Versioning": {
    storyEn:
      "A phone charger maker changes the plug shape. If they stop selling the old cable overnight, every old phone breaks. So they sell 'Cable v1' and 'Cable v2' side by side for a while and announce when v1 will stop.",
    storyBn:
      "চার্জার কোম্পানি plug-এর আকার বদলায়। রাতারাতি পুরনো cable বিক্রি বন্ধ করলে সব পুরনো ফোন অচল। তাই কিছুদিন 'Cable v1' ও 'Cable v2' পাশাপাশি বিক্রি করে এবং v1 কবে বন্ধ হবে জানিয়ে দেয়।",
    theoryEn:
      "Once mobile apps or partners use your API, you cannot change a response shape without breaking them. Adding a field is usually safe; renaming or removing one is a breaking change. Versioning lets v1 and v2 live together: in the URL (/api/v1/orders), a query string (?api-version=2.0) or a header. Announce deprecation with a date and the Deprecation/Sunset headers.",
    theoryBn:
      "Mobile app বা partner API ব্যবহার শুরু করলে response-এর আকার বদলালে তারা ভেঙে যায়। নতুন field যোগ সাধারণত নিরাপদ; নাম বদলানো বা সরানো breaking change। Versioning-এ v1 ও v2 একসাথে থাকে: URL-এ (/api/v1/orders), query string-এ (?api-version=2.0) বা header-এ। তারিখসহ deprecation জানান, Deprecation/Sunset header দিয়ে।",
    steps: [
      ["Decide the scheme: URL segment is the easiest to see.", "পদ্ধতি বাছুন: URL segment সবচেয়ে সহজে দেখা যায়।"],
      ["Keep v1 code untouched; add v2 next to it.", "v1 কোড অক্ষত রাখুন; পাশে v2 যোগ করুন।"],
      ["Share business logic; only the DTO mapping differs.", "Business logic একই, শুধু DTO mapping ভিন্ন।"],
      ["Mark v1 deprecated with a sunset date.", "v1-কে sunset তারিখসহ deprecated চিহ্নিত করুন।"],
    ],
    mistakesEn:
      "Renaming fields in place, versioning every tiny change (v1..v17), copying the whole service per version instead of only the mapping, and never removing old versions.",
    mistakesBn:
      "জায়গায় field-এর নাম বদলানো, প্রতিটি ছোট পরিবর্তনে নতুন version (v1..v17), শুধু mapping না করে প্রতি version-এ পুরো service কপি, আর পুরনো version কখনো না সরানো।",
    examples: [
      consoleEx(
        "Breaking or not? · breaking কি না?",
        `var v1 = new HashSet<string> { "id", "name", "price" };
string Check(HashSet<string> next)
{
    var removed = v1.Except(next).ToList();
    var added = next.Except(v1).ToList();
    return removed.Count > 0 ? $"BREAKING (removed: {string.Join(",", removed)})" : $"safe (added: {string.Join(",", added)})";
}
Console.WriteLine(Check(new() { "id", "name", "price", "currency" }));
Console.WriteLine(Check(new() { "id", "title", "price" }));`,
        "safe (added: currency)\nBREAKING (removed: name)",
      ),
      webEx(
        "v1 and v2 side by side · v1 ও v2 পাশাপাশি",
        `var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
var orders = new List<Order> { new(1, "Asha", 1200m, "BDT") };

var v1 = app.MapGroup("/api/v1/orders");
v1.MapGet("/", (HttpResponse res) =>
{
    res.Headers["Deprecation"] = "true";
    res.Headers["Sunset"] = "Wed, 31 Dec 2026 23:59:59 GMT";
    return orders.Select(o => new { o.Id, customer = o.Customer, total = o.Amount });   // old shape
});

var v2 = app.MapGroup("/api/v2/orders");
v2.MapGet("/", () => orders.Select(o => new
{
    o.Id,
    customer = new { name = o.Customer },
    total = new { amount = o.Amount, currency = o.Currency },                           // new shape
}));
app.Run();

public record Order(int Id, string Customer, decimal Amount, string Currency);`,
        "curl -k -i https://localhost:5001/api/v1/orders   # note Deprecation and Sunset headers\ncurl -k https://localhost:5001/api/v2/orders",
      ),
    ],
  },

  "Sessions and Cookies": {
    storyEn:
      "At a coat check you hand over your coat and get a small numbered ticket. The ticket is the cookie; the coat on the rack is the session data. Lose the ticket and you cannot prove which coat is yours; the coat itself never leaves the counter.",
    storyBn:
      "Coat check-এ কোট দিলে একটি ছোট নম্বরযুক্ত টিকিট পান। টিকিট হলো cookie; তাকে ঝোলানো কোট হলো session data। টিকিট হারালে কোন কোট আপনার প্রমাণ করতে পারবেন না; কোট নিজে কখনো কাউন্টার ছাড়ে না।",
    theoryEn:
      "HTTP forgets you between requests. A cookie is a small value the server asks the browser to store and send back on every request to that site. A session keeps data on the server and puts only a random session id in the cookie. Cookie flags matter: HttpOnly (JavaScript cannot read it), Secure (HTTPS only), SameSite (limits cross-site sending), and an expiry.",
    theoryBn:
      "HTTP প্রতি request-এর মধ্যে আপনাকে ভুলে যায়। Cookie হলো ছোট একটি মান যা server browser-কে রাখতে বলে এবং সেই site-এ প্রতি request-এ ফেরত পাঠাতে বলে। Session data server-এ রাখে, cookie-তে শুধু একটি random session id। Cookie flag জরুরি: HttpOnly (JavaScript পড়তে পারে না), Secure (শুধু HTTPS), SameSite (অন্য site থেকে পাঠানো সীমিত), আর মেয়াদ।",
    steps: [
      ["Register AddDistributedMemoryCache and AddSession.", "AddDistributedMemoryCache ও AddSession register করুন।"],
      ["Call app.UseSession() before endpoints.", "Endpoint-এর আগে app.UseSession() দিন।"],
      ["Read and write with HttpContext.Session.GetString/SetString.", "HttpContext.Session.GetString/SetString দিয়ে পড়ুন ও লিখুন।"],
      ["Set HttpOnly, Secure, SameSite and IdleTimeout.", "HttpOnly, Secure, SameSite ও IdleTimeout দিন।"],
    ],
    mistakesEn:
      "Storing passwords or roles directly in a readable cookie, forgetting UseSession, keeping sessions in memory on multiple servers (users lose the cart when the load balancer switches server), and making session cookies readable by JavaScript.",
    mistakesBn:
      "পড়া যায় এমন cookie-তে password বা role রাখা, UseSession ভুলে যাওয়া, একাধিক server-এ memory-তে session রাখা (load balancer server বদলালে cart হারায়), আর session cookie JavaScript-কে পড়তে দেওয়া।",
    examples: [
      consoleEx(
        "What a session store really is · session store আসলে কী",
        `using System.Security.Cryptography;

var sessions = new Dictionary<string, Dictionary<string, string>>();
string NewSession() { var id = Convert.ToHexString(RandomNumberGenerator.GetBytes(16)); sessions[id] = new(); return id; }

var cookieValue = NewSession();                  // only this random id goes to the browser
sessions[cookieValue]["cart"] = "tea,biscuit";   // data stays on the server

Console.WriteLine($"Cookie length: {cookieValue.Length} hex chars");
Console.WriteLine($"Cart for this cookie: {sessions[cookieValue]["cart"]}");
Console.WriteLine($"Guessing a cookie works? {sessions.ContainsKey("0000")}");`,
        "Cookie length: 32 hex chars\nCart for this cookie: tea,biscuit\nGuessing a cookie works? False",
      ),
      webEx(
        "Shopping cart in a session · session-এ shopping cart",
        `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDistributedMemoryCache();          // use Redis/SQL in production with many servers
builder.Services.AddSession(o =>
{
    o.IdleTimeout = TimeSpan.FromMinutes(20);
    o.Cookie.HttpOnly = true;
    o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    o.Cookie.SameSite = SameSiteMode.Lax;
    o.Cookie.IsEssential = true;
});
var app = builder.Build();
app.UseSession();

app.MapPost("/cart/{item}", (string item, HttpContext http) =>
{
    var cart = http.Session.GetString("cart");
    cart = string.IsNullOrEmpty(cart) ? item : cart + "," + item;
    http.Session.SetString("cart", cart);
    return Results.Ok(cart.Split(','));
});
app.MapGet("/cart", (HttpContext http) => (http.Session.GetString("cart") ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries));
app.MapDelete("/cart", (HttpContext http) => { http.Session.Clear(); return Results.NoContent(); });
app.Run();`,
        "curl -k -c jar -b jar -X POST https://localhost:5001/cart/tea\ncurl -k -c jar -b jar -X POST https://localhost:5001/cart/biscuit\ncurl -k -b jar https://localhost:5001/cart     # [\"tea\",\"biscuit\"]",
      ),
    ],
  },

  "Authentication with JWT": {
    storyEn:
      "A festival gives you a stamped wristband at the gate. Every stall checks the stamp instead of calling the gate office. If someone draws a fake stamp, the special ink (signature) does not match and the stall refuses them.",
    storyBn:
      "উৎসবের গেটে সিলমোহর দেওয়া wristband দেওয়া হয়। প্রতিটি দোকান গেট অফিসে ফোন না করে সিল দেখে। কেউ নকল সিল আঁকলে বিশেষ কালি (signature) মেলে না, দোকান ফিরিয়ে দেয়।",
    theoryEn:
      "After login the server creates a JSON Web Token: header.payload.signature. The payload holds claims (user id, role, expiry). The signature is computed with a secret key, so any change to the payload is detected. The client sends it as Authorization: Bearer <token>; the JwtBearer middleware validates it on every request without a database lookup. The payload is readable by anyone, so never put secrets in it.",
    theoryBn:
      "Login-এর পর server একটি JSON Web Token বানায়: header.payload.signature। Payload-এ claim থাকে (user id, role, মেয়াদ)। Signature গোপন key দিয়ে হিসাব হয়, তাই payload-এর যেকোনো পরিবর্তন ধরা পড়ে। Client Authorization: Bearer <token> হিসেবে পাঠায়; JwtBearer middleware প্রতি request-এ database ছাড়াই যাচাই করে। Payload যে কেউ পড়তে পারে, তাই গোপন তথ্য রাখবেন না।",
    steps: [
      ["Verify the password, then build claims (id, email, role).", "Password যাচাই করে claim বানান (id, email, role)।"],
      ["Sign with a 32+ byte key from configuration; set a short expiry.", "Config-এর ৩২+ byte key দিয়ে sign; ছোট মেয়াদ দিন।"],
      ["AddAuthentication().AddJwtBearer with full validation.", "সম্পূর্ণ validation সহ AddAuthentication().AddJwtBearer।"],
      ["Protect endpoints with [Authorize] or RequireAuthorization().", "[Authorize] বা RequireAuthorization() দিয়ে সুরক্ষা।"],
    ],
    mistakesEn:
      "Hard-coding the key, ValidateLifetime = false, very long expiry with no refresh strategy, storing tokens in localStorage on sites with XSS risk, and forgetting app.UseAuthentication().",
    mistakesBn:
      "Key code-এ লিখে রাখা, ValidateLifetime = false, refresh ছাড়া খুব লম্বা মেয়াদ, XSS ঝুঁকির site-এ localStorage-এ token রাখা, আর app.UseAuthentication() ভুলে যাওয়া।",
    examples: [
      consoleEx(
        "Tampering breaks the signature · বদলালে signature ভাঙে",
        `using System.Security.Cryptography;
using System.Text;

byte[] key = Encoding.UTF8.GetBytes("a-very-long-learning-secret-key-32b!");
string B64(byte[] b) => Convert.ToBase64String(b).TrimEnd('=').Replace('+', '-').Replace('/', '_');
string Sign(string data) => B64(HMACSHA256.HashData(key, Encoding.UTF8.GetBytes(data)));

string header = B64(Encoding.UTF8.GetBytes("{\\"alg\\":\\"HS256\\",\\"typ\\":\\"JWT\\"}"));
string payload = B64(Encoding.UTF8.GetBytes("{\\"sub\\":\\"7\\",\\"role\\":\\"User\\"}"));
string token = $"{header}.{payload}.{Sign(header + "." + payload)}";

bool Valid(string t) { var p = t.Split('.'); return Sign(p[0] + "." + p[1]) == p[2]; }
string forgedPayload = B64(Encoding.UTF8.GetBytes("{\\"sub\\":\\"7\\",\\"role\\":\\"Admin\\"}"));
string forged = $"{header}.{forgedPayload}.{token.Split('.')[2]}";

Console.WriteLine($"Original valid: {Valid(token)}");
Console.WriteLine($"Role changed to Admin valid: {Valid(forged)}");`,
        "Original valid: True\nRole changed to Admin valid: False",
      ),
      webEx(
        "Login, token, protected profile · login, token, সুরক্ষিত profile",
        `using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("a-very-long-learning-secret-key-32b!"));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o => o.TokenValidationParameters = new()
    {
        ValidateIssuer = true, ValidIssuer = "learn-api",
        ValidateAudience = true, ValidAudience = "learn-clients",
        ValidateLifetime = true, ValidateIssuerSigningKey = true, IssuerSigningKey = key,
    });
builder.Services.AddAuthorization();
var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/login", (Login l) =>
{
    if (l.Email != "asha@example.com" || l.Password != "secret123") return Results.Unauthorized();
    var jwt = new JwtSecurityToken("learn-api", "learn-clients",
        new[] { new Claim(ClaimTypes.NameIdentifier, "7"), new Claim(ClaimTypes.Email, l.Email), new Claim(ClaimTypes.Role, "User") },
        expires: DateTime.UtcNow.AddMinutes(15), signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));
    return Results.Ok(new { access_token = new JwtSecurityTokenHandler().WriteToken(jwt), expires_in = 900 });
});
app.MapGet("/profile", (ClaimsPrincipal u) => new
{
    id = u.FindFirstValue(ClaimTypes.NameIdentifier),
    email = u.FindFirstValue(ClaimTypes.Email),
    role = u.FindFirstValue(ClaimTypes.Role),
}).RequireAuthorization();
app.Run();

public record Login(string Email, string Password);`,
        'curl -k -X POST https://localhost:5001/login -H "Content-Type: application/json" -d "{\\"email\\":\\"asha@example.com\\",\\"password\\":\\"secret123\\"}"\ncurl -k -i https://localhost:5001/profile                                    # 401\ncurl -k https://localhost:5001/profile -H "Authorization: Bearer <token>"     # 200',
        ["Microsoft.AspNetCore.Authentication.JwtBearer"],
      ),
    ],
  },

  "OAuth 2.0": {
    storyEn:
      "A hotel valet key starts the car and parks it but cannot open the boot. You never give the valet your house keys. OAuth is the valet key: an app gets a limited, revocable token from Google or GitHub instead of your password.",
    storyBn:
      "হোটেলের valet key গাড়ি চালু ও পার্ক করতে পারে কিন্তু ডিকি খুলতে পারে না। আপনি valet-কে বাড়ির চাবি দেন না। OAuth হলো valet key: app আপনার password-এর বদলে Google বা GitHub থেকে সীমিত, বাতিলযোগ্য token পায়।",
    theoryEn:
      "OAuth 2.0 is about delegated authorization: the user lets a client app access some resource with limited scopes. In the Authorization Code flow with PKCE, the app redirects the user to the provider, the user logs in and consents, the provider redirects back with a one-time code, and the app exchanges the code (plus the PKCE verifier) for tokens. OpenID Connect adds an ID token on top so the app also learns who the user is.",
    theoryBn:
      "OAuth 2.0 হলো অনুমতি ভাগ করা: user কোনো client app-কে সীমিত scope-এ resource ব্যবহারের অনুমতি দেয়। PKCE সহ Authorization Code flow-এ app user-কে provider-এর কাছে পাঠায়, user login করে সম্মতি দেয়, provider এককালীন code সহ ফেরত পাঠায়, আর app code (ও PKCE verifier) দিয়ে token নেয়। OpenID Connect উপরে ID token যোগ করে, ফলে app জানে user কে।",
    steps: [
      ["Register your app with the provider; get client id and secret.", "Provider-এ app register করে client id ও secret নিন।"],
      ["Configure the redirect URI exactly (https://.../signin-oidc).", "Redirect URI হুবহু দিন (https://.../signin-oidc)।"],
      ["Use AddOpenIdConnect or AddGoogle; request minimal scopes.", "AddOpenIdConnect বা AddGoogle; ন্যূনতম scope চান।"],
      ["Map the external identity to your own user record.", "বাইরের পরিচয়কে নিজের user record-এর সাথে মেলান।"],
    ],
    mistakesEn:
      "Using the implicit flow, skipping state/PKCE (allows code injection), requesting every scope, committing the client secret, and trusting an access token meant for another API.",
    mistakesBn:
      "Implicit flow ব্যবহার, state/PKCE বাদ দেওয়া (code injection সম্ভব), সব scope চাওয়া, client secret commit করা, আর অন্য API-র জন্য বানানো access token বিশ্বাস করা।",
    examples: [
      consoleEx(
        "PKCE verifier and challenge · PKCE verifier ও challenge",
        `using System.Security.Cryptography;
using System.Text;

string B64Url(byte[] b) => Convert.ToBase64String(b).TrimEnd('=').Replace('+', '-').Replace('/', '_');

string verifier = B64Url(RandomNumberGenerator.GetBytes(32));             // kept secret by the app
string challenge = B64Url(SHA256.HashData(Encoding.ASCII.GetBytes(verifier))); // sent in the redirect

bool ProviderCheck(string sentVerifier) =>
    B64Url(SHA256.HashData(Encoding.ASCII.GetBytes(sentVerifier))) == challenge;

Console.WriteLine($"Verifier length: {verifier.Length}");
Console.WriteLine($"Real app exchange ok: {ProviderCheck(verifier)}");
Console.WriteLine($"Stolen code without verifier ok: {ProviderCheck("guess")}");`,
        "Verifier length: 43\nReal app exchange ok: True\nStolen code without verifier ok: False",
      ),
      webEx(
        "Sign in with GitHub (OAuth) · GitHub দিয়ে login",
        `using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAuthentication(o =>
{
    o.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    o.DefaultChallengeScheme = "GitHub";
})
.AddCookie()
.AddOAuth("GitHub", o =>
{
    o.ClientId = builder.Configuration["GitHub:ClientId"]!;          // dotnet user-secrets set GitHub:ClientId ...
    o.ClientSecret = builder.Configuration["GitHub:ClientSecret"]!;
    o.CallbackPath = "/signin-github";
    o.AuthorizationEndpoint = "https://github.com/login/oauth/authorize";
    o.TokenEndpoint = "https://github.com/login/oauth/access_token";
    o.UserInformationEndpoint = "https://api.github.com/user";
    o.UsePkce = true;
    o.Scope.Add("read:user");
    o.ClaimActions.MapJsonKey(ClaimTypes.Name, "login");
    o.Events.OnCreatingTicket = async ctx =>
    {
        using var req = new HttpRequestMessage(HttpMethod.Get, ctx.Options.UserInformationEndpoint);
        req.Headers.Authorization = new("Bearer", ctx.AccessToken);
        req.Headers.UserAgent.ParseAdd("learn-app");
        using var res = await ctx.Backchannel.SendAsync(req);
        using var json = System.Text.Json.JsonDocument.Parse(await res.Content.ReadAsStringAsync());
        ctx.RunClaimActions(json.RootElement);
    };
});
builder.Services.AddAuthorization();
var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();
app.MapGet("/", (ClaimsPrincipal u) => $"Hello {u.Identity!.Name} from GitHub").RequireAuthorization();
app.MapGet("/logout", async (HttpContext h) => { await h.SignOutAsync(); return "Signed out"; });
app.Run();`,
        "# 1. Create an OAuth app at github.com/settings/developers with callback https://localhost:5001/signin-github\n# 2. dotnet user-secrets init && dotnet user-secrets set GitHub:ClientId <id> && dotnet user-secrets set GitHub:ClientSecret <secret>\n# 3. Open https://localhost:5001 in a browser: you are redirected to GitHub and back",
      ),
    ],
  },

  "SQL vs NoSQL": {
    storyEn:
      "A school register (SQL) has fixed columns: roll, name, class, and every row follows them. A scrapbook (NoSQL document) lets each page hold whatever you paste. The register is great for exact reports; the scrapbook is great when every page is different.",
    storyBn:
      "স্কুলের হাজিরা খাতা (SQL)-তে নির্দিষ্ট column: রোল, নাম, শ্রেণি, প্রতিটি row তা মানে। Scrapbook (NoSQL document)-এ প্রতিটি পাতায় যা খুশি লাগানো যায়। নির্ভুল report-এ খাতা ভালো; প্রতিটি পাতা ভিন্ন হলে scrapbook ভালো।",
    theoryEn:
      "Relational databases (SQL Server, PostgreSQL) store rows in tables with a fixed schema, join tables with foreign keys and give ACID transactions: ideal for orders, money and anything with relationships. Document databases (MongoDB, Cosmos DB) store JSON documents that can differ, scale out easily and fit data you always read together. Many systems use both: SQL for the core truth, NoSQL or a cache for fast, flexible reads.",
    theoryBn:
      "Relational database (SQL Server, PostgreSQL) নির্দিষ্ট schema-র table-এ row রাখে, foreign key দিয়ে join করে এবং ACID transaction দেয়: order, টাকা ও সম্পর্কযুক্ত data-র জন্য আদর্শ। Document database (MongoDB, Cosmos DB) JSON document রাখে যা ভিন্ন হতে পারে, সহজে scale করে এবং একসাথে পড়া data-য় মানায়। অনেক system দুটোই ব্যবহার করে: মূল সত্যের জন্য SQL, দ্রুত নমনীয় পড়ার জন্য NoSQL বা cache।",
    steps: [
      ["List how the data will be queried, not just stored.", "Data কীভাবে query হবে তা লিখুন, শুধু কীভাবে রাখা হবে তা নয়।"],
      ["If you need joins, constraints and transactions, start with SQL.", "Join, constraint ও transaction লাগলে SQL দিয়ে শুরু করুন।"],
      ["If each record is self-contained and varies, consider documents.", "প্রতিটি record স্বয়ংসম্পূর্ণ ও ভিন্ন হলে document ভাবুন।"],
      ["Measure with real queries before choosing for scale.", "Scale-এর জন্য বাছার আগে আসল query দিয়ে মাপুন।"],
    ],
    mistakesEn:
      "Choosing NoSQL 'because it scales' for small relational data, embedding unbounded arrays in one document, storing money as floating point, and duplicating data without a plan to keep copies in sync.",
    mistakesBn:
      "ছোট সম্পর্কযুক্ত data-য় 'scale করে বলে' NoSQL বাছা, এক document-এ সীমাহীন array রাখা, টাকা floating point-এ রাখা, আর সমন্বয়ের পরিকল্পনা ছাড়া data-র কপি রাখা।",
    examples: [
      consoleEx(
        "Same order, two models · একই order, দুই model",
        `using System.Text.Json;

// Relational: two tables linked by OrderId
var orders = new[] { new { Id = 1, Customer = "Asha" } };
var lines = new[] { new { OrderId = 1, Item = "Tea", Qty = 2 }, new { OrderId = 1, Item = "Cake", Qty = 1 } };
var joined = from o in orders join l in lines on o.Id equals l.OrderId select $"{o.Customer}:{l.Item}x{l.Qty}";
Console.WriteLine("SQL join -> " + string.Join(" ", joined));

// Document: one self-contained JSON document
var doc = new { id = 1, customer = "Asha", lines = new[] { new { item = "Tea", qty = 2 }, new { item = "Cake", qty = 1 } } };
Console.WriteLine("Document -> " + JsonSerializer.Serialize(doc));`,
        "SQL join -> Asha:Teax2 Asha:Cakex1\nDocument -> {\"id\":1,\"customer\":\"Asha\",\"lines\":[{\"item\":\"Tea\",\"qty\":2},{\"item\":\"Cake\",\"qty\":1}]}",
      ),
      webEx(
        "Relational store with EF Core + JSON column · EF Core ও JSON column",
        `using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ShopDb>(o => o.UseSqlite("Data Source=shop.db"));
var app = builder.Build();
using (var s = app.Services.CreateScope()) s.ServiceProvider.GetRequiredService<ShopDb>().Database.EnsureCreated();

app.MapPost("/orders", async (ShopDb db, Order o) => { db.Orders.Add(o); await db.SaveChangesAsync(); return Results.Created($"/orders/{o.Id}", o); });
app.MapGet("/orders", async (ShopDb db) => await db.Orders.Include(o => o.Lines).ToListAsync());
app.Run();

public class Order
{
    public int Id { get; set; }
    public string Customer { get; set; } = "";
    public List<OrderLine> Lines { get; set; } = new();          // relational child table
    public Dictionary<string, string> Extra { get; set; } = new(); // flexible, document-like field
}
public class OrderLine { public int Id { get; set; } public string Item { get; set; } = ""; public int Qty { get; set; } }

public class ShopDb(DbContextOptions<ShopDb> o) : DbContext(o)
{
    public DbSet<Order> Orders => Set<Order>();
    protected override void OnModelCreating(ModelBuilder b) =>
        b.Entity<Order>().Property(x => x.Extra).HasConversion(
            v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
            v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(v, (System.Text.Json.JsonSerializerOptions?)null)!);
}`,
        'curl -k -X POST https://localhost:5001/orders -H "Content-Type: application/json" -d "{\\"customer\\":\\"Asha\\",\\"lines\\":[{\\"item\\":\\"Tea\\",\\"qty\\":2}],\\"extra\\":{\\"gift\\":\\"yes\\"}}"\ncurl -k https://localhost:5001/orders',
        ["Microsoft.EntityFrameworkCore.Sqlite"],
      ),
    ],
  },

  "ORM and Migrations": {
    storyEn:
      "An interpreter lets you speak Bangla to a guest who only knows French. An ORM is that interpreter between C# objects and SQL tables. Migrations are the interpreter's notebook of every change to the shared vocabulary, so tomorrow's interpreter speaks the same way.",
    storyBn:
      "দোভাষী থাকলে শুধু ফরাসি জানা অতিথির সাথে বাংলায় কথা বলা যায়। ORM হলো C# object আর SQL table-এর মাঝের সেই দোভাষী। Migration হলো দোভাষীর খাতা, যেখানে শব্দভান্ডারের প্রতিটি পরিবর্তন লেখা, যাতে কালকের দোভাষীও একইভাবে বলে।",
    theoryEn:
      "Entity Framework Core maps classes to tables and LINQ to SQL. You change your C# model, run dotnet ef migrations add Name, and EF writes a migration with Up and Down methods. dotnet ef database update applies the pending ones and records them in __EFMigrationsHistory. Use AsNoTracking for read-only queries, Include for related data, and look at the generated SQL when performance matters.",
    theoryBn:
      "Entity Framework Core class-কে table আর LINQ-কে SQL-এ রূপান্তর করে। C# model বদলে dotnet ef migrations add Name চালালে EF Up ও Down সহ migration লেখে। dotnet ef database update বাকিগুলো চালিয়ে __EFMigrationsHistory-তে লিখে রাখে। শুধু পড়ার query-তে AsNoTracking, সম্পর্কিত data-য় Include, আর performance জরুরি হলে তৈরি SQL দেখুন।",
    steps: [
      ["Install EF Core provider and tools; create DbContext.", "EF Core provider ও tool install করে DbContext বানান।"],
      ["Change the model and run migrations add.", "Model বদলে migrations add চালান।"],
      ["Review the migration file, then database update.", "Migration file দেখে তারপর database update।"],
      ["Log or print SQL with ToQueryString() to learn.", "শেখার জন্য ToQueryString() দিয়ে SQL দেখুন।"],
    ],
    mistakesEn:
      "N+1 queries (loading children in a loop), forgetting SaveChangesAsync, editing the database by hand without a migration, and renaming properties without checking that the migration does not drop data.",
    mistakesBn:
      "N+1 query (loop-এ child load), SaveChangesAsync ভুলে যাওয়া, migration ছাড়া হাতে database বদলানো, আর migration data মুছে দিচ্ছে কি না না দেখে property rename।",
    examples: [
      consoleEx(
        "See the SQL EF writes · EF কী SQL লেখে দেখুন",
        `using Microsoft.EntityFrameworkCore;

using var db = new Db();
var query = db.Students.Where(s => s.Marks >= 80).OrderByDescending(s => s.Marks).Select(s => s.Name);
Console.WriteLine(query.ToQueryString());

public class Student { public int Id { get; set; } public string Name { get; set; } = ""; public int Marks { get; set; } }
public class Db : DbContext
{
    public DbSet<Student> Students => Set<Student>();
    protected override void OnConfiguring(DbContextOptionsBuilder o) => o.UseSqlite("Data Source=:memory:");
}`,
        'SELECT "s"."Name"\nFROM "Students" AS "s"\nWHERE "s"."Marks" >= 80\nORDER BY "s"."Marks" DESC',
        ["Microsoft.EntityFrameworkCore.Sqlite"],
      ),
      webEx(
        "Avoid N+1 with Include and projection · N+1 এড়ান",
        `using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<SchoolDb>(o => o.UseSqlite("Data Source=school.db").LogTo(Console.WriteLine, LogLevel.Information));
var app = builder.Build();
using (var s = app.Services.CreateScope())
{
    var db = s.ServiceProvider.GetRequiredService<SchoolDb>();
    if (db.Database.EnsureCreated())
    {
        db.Classes.Add(new ClassRoom { Name = "Ten", Students = { new() { Name = "Asha" }, new() { Name = "Rafi" } } });
        db.SaveChanges();
    }
}
// One SQL query with a JOIN instead of 1 + N queries
app.MapGet("/classes", async (SchoolDb db) => await db.Classes.AsNoTracking()
    .Select(c => new { c.Name, Students = c.Students.Select(s => s.Name) })
    .ToListAsync());
app.Run();

public class ClassRoom { public int Id { get; set; } public string Name { get; set; } = ""; public List<Student> Students { get; set; } = new(); }
public class Student { public int Id { get; set; } public string Name { get; set; } = ""; public int ClassRoomId { get; set; } }
public class SchoolDb(DbContextOptions<SchoolDb> o) : DbContext(o)
{
    public DbSet<ClassRoom> Classes => Set<ClassRoom>();
}`,
        "curl -k https://localhost:5001/classes\n# watch the console: one SELECT ... LEFT JOIN ... instead of one query per class",
        ["Microsoft.EntityFrameworkCore.Sqlite"],
      ),
    ],
  },
};

export const backendDevelopmentExtras = { ...partOne, ...moreBackendDevelopment };

export function enhanceBackendDevelopment(lesson, chapter) {
  const x = backendDevelopmentExtras[lesson.topic];
  if (!x) return chapter;
  return {
    ...chapter,
    extraSections: [
      ...(chapter.extraSections || []),
      { id: "easy-story", title: "A tiny tea-shop story · অতি সহজ তুলনা", en: x.storyEn, bn: x.storyBn },
      { id: "simple-theory", title: "Theory in plain words · সহজ ভাষায় তত্ত্ব", en: x.theoryEn, bn: x.theoryBn },
      {
        id: "dotnet-steps",
        title: "Follow the C# flow · C#-এর ধাপ ধরে পড়ুন",
        en: "Do these four steps in order. Then run the small console example to see the idea alone, and the ASP.NET Core program to see it working behind real HTTP requests.",
        bn: "এই চারটি ধাপ ক্রমানুসারে করুন। তারপর ছোট console উদাহরণে ধারণাটি আলাদাভাবে, আর ASP.NET Core program-এ আসল HTTP request-এর পিছনে কাজ করতে দেখুন।",
        steps: x.steps.map(([en, bn]) => ({ en, bn })),
      },
      { id: "common-mistakes", title: "Common mistakes and fixes · সাধারণ ভুল ও সমাধান", en: x.mistakesEn, bn: x.mistakesBn },
    ],
    examples: [...x.examples, ...chapter.examples],
  };
}
