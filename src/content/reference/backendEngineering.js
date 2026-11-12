// Used only by module 7. Shared canonical chapters remain unchanged.
const lessons = {};
function add(
  topic,
  en,
  bn,
  storyEn,
  storyBn,
  steps,
  consoleCode,
  apiCode,
  practiceCode,
  expected,
  options = {},
) {
  const consoleSetup = {
    kind: "Console example",
    language: "csharp",
    setupEn:
      "Create a console project, replace Program.cs with this complete example, then run it. Implicit usings are enabled by the template.",
    setupBn:
      "Console project বানান। Program.cs-এর লেখা এই উদাহরণ দিয়ে বদলে চালান। Template-এর implicit usings চালু থাকবে।",
    commands:
      "dotnet new console -n LearnBackend\n# Replace LearnBackend/Program.cs with the example.\ndotnet run --project LearnBackend",
  };
  lessons[topic] = {
    en,
    bn,
    storyEn,
    storyBn,
    steps: steps.map(([en, bn]) => ({ en, bn })),
    examples: [
      {
        ...consoleSetup,
        title: "1. Understand it in plain C# · ছোট C# দিয়ে বুঝুন",
        code: consoleCode,
        expectedOutput: expected,
      },
      {
        title: "2. Use it in ASP.NET Core · API-তে ব্যবহার করুন",
        kind: options.apiKind || "ASP.NET Core program",
        language: "csharp",
        code: apiCode,
        setupEn:
          options.apiSetupEn ||
          "Create an empty ASP.NET Core project and replace Program.cs. Run locally, then use the port printed by the host. This is a learning app, with deliberately small in-memory state.",
        setupBn:
          options.apiSetupBn ||
          "খালি ASP.NET Core project বানিয়ে Program.cs বদলান। Host যে port দেখাবে সেটি ব্যবহার করুন। শেখার অ্যাপের memory state স্থায়ী database নয়।",
        commands:
          options.apiCommands ||
          "dotnet new web -n TeaApi\n# Replace TeaApi/Program.cs with the example.\ndotnet run --project TeaApi",
        tryRequest: options.tryRequest || "GET /demo",
        smoke: options.smoke || { path: "/demo", status: 200 },
      },
      {
        ...consoleSetup,
        title: "3. Check your understanding · নিজে যাচাই করুন",
        code: practiceCode,
        expectedOutput: options.practiceExpected || "All checks passed",
      },
    ],
  };
}
add(
  "All Data Structures",
  "A backend stores and finds information all day. In C#, use List<T> when you need an ordered collection, Dictionary<TKey,TValue> when you know an identifier, HashSet<T> when duplicates must be rejected, and Queue<T> when work must keep arrival order. Think about the question you ask most often before choosing the container. The API below uses a catalog lookup; it does not scan every product for every request.",
  "Backend সারাদিন তথ্য রাখে ও খোঁজে। ক্রমসহ তালিকায় List, id দিয়ে খুঁজতে Dictionary, duplicate বাদ দিতে HashSet, আর আগে আসা কাজ আগে করতে Queue নিন। সবচেয়ে বেশি কোন প্রশ্ন করবেন তা আগে ভাবুন। নিচের API id দিয়ে সরাসরি চা খোঁজে।",
  "A tea shop has a menu list, a drawer labeled by product code, and a line of waiting orders. These are three different ways to organize the same business.",
  "চায়ের দোকানের মেনুর তালিকা, product code লেখা ড্রয়ার ও অপেক্ষার অর্ডারের লাইন—তিন কাজে তিন রকম গঠন লাগে।",
  [
    ["Create products with an Id and Name.", "Id ও Name-সহ product তৈরি করুন।"],
    [
      "Put products into a Dictionary keyed by Id.",
      "Id key দিয়ে Dictionary-তে রাখুন।",
    ],
    [
      "Use TryGetValue so a missing product is handled normally.",
      "নেই এমন id-তে exception নয়, TryGetValue-এর false সামলান।",
    ],
    [
      "Return 200 for a match and 404 for a missing product.",
      "পেলে ২০০, না পেলে ৪০৪ ফেরত দিন।",
    ],
  ],
  `var menu = new List<Product> {
    new(1, "Tea", 20m), new(2, "Milk", 50m)
};
var byId = menu.ToDictionary(p => p.Id);
var orderedIds = new Queue<int>();
orderedIds.Enqueue(2);
orderedIds.Enqueue(1);
var seen = new HashSet<int>();
while (orderedIds.TryDequeue(out int id)) {
    if (seen.Add(id) && byId.TryGetValue(id, out var product))
        Console.WriteLine($"{product.Name}: {product.Price}");
}
record Product(int Id, string Name, decimal Price);`,
  `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<Catalog>();
var app = builder.Build();
app.MapGet("/demo", () => "Catalog ready");
app.MapGet("/products/{id:int}", (int id, Catalog catalog) =>
    catalog.Find(id) is { } p ? Results.Ok(p) : Results.NotFound());
app.Run();
record Product(int Id, string Name, decimal Price);
class Catalog {
    private readonly Dictionary<int, Product> products = new() {
        [1] = new(1, "Tea", 20m), [2] = new(2, "Milk", 50m)
    };
    public Product? Find(int id) => products.GetValueOrDefault(id);
    // This demo dictionary is initialized once and never mutated.
}`,
  `var quantities = new Dictionary<int, int>();
foreach (int id in new[] { 1, 1, 2 }) {
    quantities.TryGetValue(id, out int old);
    quantities[id] = old + 1;
}
if (quantities[1] != 2 || quantities[2] != 1)
    throw new Exception("Counting failed");
if (quantities.ContainsKey(99)) throw new Exception("Unexpected product");
Console.WriteLine("All checks passed");`,
  "Milk: 50\nTea: 20",
  { tryRequest: "GET /products/1 returns Tea; GET /products/99 returns 404" },
);
add(
  "Advanced Algorithms",
  "For a backend beginner, an advanced algorithm often means avoiding repeated work. Build a prefix total once when many range-total requests use unchanged data. Use sorting and binary search for repeated ordered lookups. Include the cost of preparing the index, and rebuild or update it when the source changes. The complete example turns daily tea sales into instant range sums.",
  "শুরুতে advanced algorithm মানে অনেক সময় একই কাজ বারবার না করা। একই data-তে অনেক range-total চাইলে একবার prefix total বানান। Data বদলালে সেটিও update দরকার। নিচের উদাহরণে প্রতিদিনের চা বিক্রির মোট একবার রেখে পরে বিয়োগে উত্তর আসে।",
  "Instead of adding every day’s sales again for each customer report, keep the total up to each day in a notebook.",
  "প্রতিটি রিপোর্টে সব দিনের বিক্রি আবার যোগ না করে প্রতিদিন পর্যন্ত মোট খাতায় রাখুন।",
  [
    ["Read the daily sales into an array.", "প্রতিদিনের বিক্রি array-এ নিন।"],
    [
      "Build prefix[i+1] from prefix[i] and today’s sale.",
      "আগের মোটের সাথে আজকের বিক্রি যোগ করুন।",
    ],
    [
      "Validate the requested half-open range [from,to).",
      "[from,to) range-এর সীমা যাচাই করুন।",
    ],
    [
      "Subtract two prefix totals and return the result.",
      "দুই prefix total বিয়োগ করে ফল দিন।",
    ],
  ],
  `int[] sales = { 100, 200, 150, 50 };
long[] prefix = new long[sales.Length + 1];
for (int i = 0; i < sales.Length; i++)
    prefix[i + 1] = prefix[i] + sales[i];
long Total(int from, int to) {
    if (from < 0 || to < from || to > sales.Length)
        throw new ArgumentOutOfRangeException();
    return prefix[to] - prefix[from];
}
Console.WriteLine(Total(1, 4)); // 200+150+50
Console.WriteLine(Total(0, 0)); // empty range`,
  `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<SalesReport>();
var app = builder.Build();
app.MapGet("/demo", () => "Sales report ready");
app.MapGet("/sales", (int from, int to, SalesReport report) => {
    if (from < 0 || to < from || to > report.Days) return Results.BadRequest("Invalid range");
    return Results.Ok(new { Total = report.Total(from, to) });
});
app.Run();
class SalesReport {
    private readonly long[] prefix = { 0, 100, 300, 450, 500 };
    public int Days => prefix.Length - 1;
    public long Total(int from, int to) => prefix[to] - prefix[from];
}`,
  `int[] values = { 10, 20, 20, 40 };
int LowerBound(int target) {
    int low = 0, high = values.Length;
    while (low < high) {
        int middle = low + (high - low) / 2;
        if (values[middle] < target) low = middle + 1; else high = middle;
    }
    return low;
}
if (LowerBound(20) != 1 || LowerBound(30) != 3 || LowerBound(99) != 4)
    throw new Exception("Boundary search failed");
Console.WriteLine("All checks passed");`,
  "400\n0",
  { tryRequest: "GET /sales?from=1&to=4 returns total 400" },
);
add(
  "High-Level Design",
  "High-level design becomes easier when you follow one request through real C# objects. A client asks an endpoint; a service applies a rule; a repository supplies data; a DTO becomes JSON. Start with these boundaries inside one ASP.NET Core application. Add separate servers, caches, and queues only when a measured requirement needs them. A box in a diagram should have a concrete responsibility.",
  "একটি request-এর C# পথ ধরলে HLD সহজ। Endpoint নেয়, service নিয়ম চালায়, repository data দেয়, DTO JSON হয়। আগে একটি ASP.NET Core অ্যাপেই এই সীমাগুলো বানান। দরকার প্রমাণ হলে আলাদা server/cache/queue যোগ করুন।",
  "The waiter receives the request, the kitchen checks the menu, and the customer receives a small receipt rather than the entire kitchen inventory.",
  "ওয়েটার অর্ডার নেন, রান্নাঘর মেনু দেখে, ক্রেতা ছোট receipt পান—পুরো গুদামের তথ্য নয়।",
  [
    ["The route extracts a product id.", "Route থেকে product id আসে।"],
    [
      "The service requests a domain object from the repository.",
      "Service repository থেকে product চায়।",
    ],
    [
      "The service creates a response DTO with only useful fields.",
      "Service দরকারি field দিয়ে response DTO বানায়।",
    ],
    [
      "ASP.NET Core serializes the DTO into JSON.",
      "ASP.NET Core DTO-কে JSON করে পাঠায়।",
    ],
  ],
  `var repository = new MenuRepository();
var service = new MenuService(repository);
Console.WriteLine(service.Get(1));
Console.WriteLine(service.Get(99) is null);
record Product(int Id, string Name, decimal Price);
record MenuView(string Name, decimal Price);
class MenuRepository {
    public Product? Find(int id) => id == 1 ? new(1, "Tea", 20m) : null;
}
class MenuService(MenuRepository repository) {
    public MenuView? Get(int id) => repository.Find(id) is { } p ? new(p.Name, p.Price) : null;
}`,
  `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<MenuRepository>();
builder.Services.AddScoped<MenuService>();
var app = builder.Build();
app.MapGet("/demo", () => "Endpoint -> Service -> Repository -> DTO");
app.MapGet("/menu/{id:int}", (int id, MenuService service) =>
    service.Get(id) is { } item ? Results.Ok(item) : Results.NotFound());
app.Run();
record MenuView(string Name, decimal Price);
class MenuRepository { public decimal? FindPrice(int id) => id == 1 ? 20m : null; }
class MenuService(MenuRepository repository) {
    public MenuView? Get(int id) => repository.FindPrice(id) is { } price ? new("Tea", price) : null;
}`,
  `int requestsPerSecond = 100;
double averageSeconds = 0.05;
double inFlight = requestsPerSecond * averageSeconds;
if (inFlight != 5) throw new Exception("Unit conversion error");
string[] flow = { "Endpoint", "Service", "Repository", "DTO" };
if (flow.First() != "Endpoint" || flow.Last() != "DTO") throw new Exception("Flow error");
Console.WriteLine("All checks passed");
// Capacity math is a teaching assumption, not a benchmark.`,
  "MenuView { Name = Tea, Price = 20 }\nTrue",
  { tryRequest: "GET /menu/1 returns a small MenuView JSON object" },
);
add(
  "Low-Level Design Basics",
  "Low-level design decides which class owns a rule and which contract another class uses. Keep the first version small: one input record, one service, and one replaceable policy. Constructor injection makes dependencies visible. A good class prevents invalid state instead of letting every endpoint repeat the same checks. Test the rule without starting the web server.",
  "LLD-তে কোন class কোন নিয়ম রাখবে ঠিক করেন। শুরুতে input record, service ও বদলানো যায় এমন policy যথেষ্ট। Constructor injection-এ নির্ভরতা দেখা যায়। একই validation সব endpoint-এ না লিখে service-এ রাখুন।",
  "The cashier asks a pricing rule for a total; the cashier should not need to know how every discount is calculated.",
  "ক্যাশিয়ার pricing rule-কে মোট দাম জিজ্ঞেস করেন; সব discount-এর ভিতরের হিসাব তার জানা লাগে না।",
  [
    ["Define an IPriceRule interface.", "IPriceRule চুক্তি লিখুন।"],
    ["Implement the tea price in one class.", "এক class-এ চায়ের দাম রাখুন।"],
    ["Inject the rule into Checkout.", "Checkout-এ rule inject করুন।"],
    [
      "Validate quantity before calculating the total.",
      "মোট করার আগে quantity যাচাই করুন।",
    ],
  ],
  `var checkout = new Checkout(new TeaPrice());
Console.WriteLine(checkout.Total(3));
interface IPriceRule { decimal UnitPrice { get; } }
class TeaPrice : IPriceRule { public decimal UnitPrice => 20m; }
class Checkout(IPriceRule price) {
    public decimal Total(int quantity) {
        if (quantity is < 1 or > 100) throw new ArgumentOutOfRangeException(nameof(quantity));
        return price.UnitPrice * quantity;
    }
}`,
  `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<IPriceRule, TeaPrice>();
builder.Services.AddScoped<Checkout>();
var app = builder.Build();
app.MapGet("/demo", () => "Checkout uses an injected price rule");
app.MapGet("/quote", (int quantity, Checkout checkout) =>
    quantity is < 1 or > 100 ? Results.BadRequest("Quantity must be 1-100") : Results.Ok(new { Total = checkout.Total(quantity) }));
app.Run();
interface IPriceRule { decimal UnitPrice { get; } }
class TeaPrice : IPriceRule { public decimal UnitPrice => 20m; }
class Checkout(IPriceRule rule) { public decimal Total(int quantity) => rule.UnitPrice * quantity; }`,
  `decimal Total(decimal unitPrice, int quantity) {
    if (quantity <= 0) throw new ArgumentOutOfRangeException(nameof(quantity));
    return unitPrice * quantity;
}
if (Total(20m, 3) != 60m) throw new Exception("Wrong total");
bool rejected = false;
try { Total(20m, 0); } catch (ArgumentOutOfRangeException) { rejected = true; }
if (!rejected) throw new Exception("Invalid quantity accepted");
Console.WriteLine("All checks passed");`,
  "60",
  {
    tryRequest:
      "GET /quote?quantity=3 returns total 60; quantity=0 returns 400",
  },
);
add(
  "System Design Fundamentals",
  "Begin system design with a precise promise: what operation succeeds, what data must be saved, and what happens when it fails. In .NET, represent these promises with request/response records and explicit outcomes. Return a conflict when a business rule rejects a request, and never call an in-memory demonstration durable. Design is easier when the HTTP behavior can be tested.",
  "আগে প্রতিশ্রুতি লিখুন: কোন কাজ হবে, কী data থাকবে, fail হলে কী হবে। .NET-এ request/response record ও স্পষ্ট ফল ব্যবহার করুন। Business rule-এ reject হলে উপযুক্ত status দিন। Memory demo-কে durable বলবেন না।",
  "A shop with five cups must never sell a sixth cup even when customers arrive together.",
  "দোকানে পাঁচ কাপ থাকলে একসাথে ক্রেতা এলেও ষষ্ঠ কাপ বিক্রি হওয়া চলবে না।",
  [
    ["Write the stock invariant first.", "Stock-এর অবশ্যই ঠিক থাকার নিয়ম লিখুন।"],
    [
      "Protect check-and-decrement as one operation.",
      "Check ও decrement একসাথে রক্ষা করুন।",
    ],
    ["Return success or conflict explicitly.", "Success বা conflict স্পষ্ট দিন।"],
    [
      "Move the invariant into atomic durable storage when scaling.",
      "Scale করলে atomic durable storage-এ নিয়মটি রাখুন।",
    ],
  ],
  `var stock = new Stock(5);
Console.WriteLine(stock.TryBuy(3));
Console.WriteLine(stock.TryBuy(3));
Console.WriteLine(stock.Remaining);
class Stock(int opening) {
    private readonly object gate = new();
    private int count = opening;
    public int Remaining { get { lock (gate) return count; } }
    public bool TryBuy(int amount) {
        lock (gate) { if (amount <= 0 || amount > count) return false; count -= amount; return true; }
    }
}`,
  `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<Stock>();
var app = builder.Build();
app.MapGet("/demo", (Stock s) => new { Remaining = s.Remaining });
app.MapPost("/buy", (Buy request, Stock s) => request.Quantity <= 0
    ? Results.BadRequest("Quantity must be positive")
    : s.TryBuy(request.Quantity) ? Results.Ok(new { s.Remaining }) : Results.Conflict("Not enough stock"));
app.Run();
record Buy(int Quantity);
class Stock {
    private readonly object gate = new(); private int count = 5;
    public int Remaining { get { lock (gate) return count; } }
    public bool TryBuy(int n) { lock (gate) { if (n <= 0 || n > count) return false; count -= n; return true; } }
}`,
  `int stock = 5, sold = 0;
var gate = new object();
Parallel.For(0, 20, _ => {
    lock (gate) { if (stock > 0) { stock--; sold++; } }
});
if (sold != 5 || stock != 0) throw new Exception("Stock invariant broken");
Console.WriteLine("All checks passed");`,
  "True\nFalse\n2",
  { tryRequest: 'GET /demo; POST /buy with JSON {"quantity":3}' },
);
add(
  "Distributed Systems",
  "A network timeout does not tell you whether the other server finished its work. Give an important operation a request id so a retry can ask for the same result. In C#, store the request fingerprint and the result together. The teaching API below uses Lazy<T> to create one result per key inside one process. A real payment system needs the equivalent atomic rule in durable shared storage.",
  "Network timeout মানে অন্য server কাজ করেনি নয়। গুরুত্বপূর্ণ কাজে request id দিন, retry-তে একই ফল পাবেন। Request-এর তথ্য ও ফল একসাথে রাখুন। নিচের Lazy একটি process-এ এক key-তে একবার ফল তৈরি করে; আসল payment-এ durable shared storage লাগে।",
  "The cashier writes a receipt number. If the customer asks again, the cashier shows the same receipt instead of charging again.",
  "ক্যাশিয়ার receipt number লেখেন। ক্রেতা আবার জিজ্ঞেস করলে নতুন টাকা না কেটে আগের receipt দেখান।",
  [
    ["Read and validate Idempotency-Key.", "Idempotency-Key পড়ে যাচাই করুন।"],
    [
      "Remember the quantity used with that key.",
      "সেই key-এর quantity মনে রাখুন।",
    ],
    [
      "Create the result once and reuse it for retries.",
      "একবার ফল বানিয়ে retry-তে সেটিই দিন।",
    ],
    [
      "Reject the same key with different input.",
      "এক key-তে ভিন্ন input হলে conflict দিন।",
    ],
  ],
  `var receipts = new Dictionary<string, Receipt>();
Receipt Place(string key, int quantity) {
    if (receipts.TryGetValue(key, out var existing)) {
        if (existing.Quantity != quantity) throw new InvalidOperationException("Key reused with different input");
        return existing;
    }
    var receipt = new Receipt(Guid.NewGuid(), quantity);
    receipts.Add(key, receipt);
    return receipt;
}
var first = Place("request-1", 2);
var retry = Place("request-1", 2);
Console.WriteLine(first.Id == retry.Id);
Console.WriteLine(receipts.Count);
record Receipt(Guid Id, int Quantity);`,
  `using System.Collections.Concurrent;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<ReceiptStore>();
var app = builder.Build();
app.MapGet("/demo", () => "Use Idempotency-Key when posting an order");
app.MapPost("/orders", (OrderInput input, HttpContext context, ReceiptStore store) => {
    string key = context.Request.Headers["Idempotency-Key"].ToString();
    if (string.IsNullOrWhiteSpace(key) || key.Length > 80 || input.Quantity is < 1 or > 100)
        return Results.BadRequest("A short idempotency key and quantity 1-100 are required");
    var entry = store.Items.GetOrAdd(key, _ => new Entry(input.Quantity,
        new Lazy<Receipt>(() => new Receipt(Guid.NewGuid(), input.Quantity))));
    return entry.Quantity != input.Quantity ? Results.Conflict("Key/input mismatch") : Results.Ok(entry.Result.Value);
});
app.Run();
record OrderInput(int Quantity);
record Receipt(Guid Id, int Quantity);
record Entry(int Quantity, Lazy<Receipt> Result);
class ReceiptStore { public ConcurrentDictionary<string, Entry> Items { get; } = new(); }
// Learning store: restart loses keys; add retention and durable atomic storage in production.`,
  `var handled = new HashSet<Guid>();
int charged = 0;
Guid request = Guid.NewGuid();
foreach (Guid id in new[] { request, request, Guid.NewGuid() })
    if (handled.Add(id)) charged++;
if (charged != 2) throw new Exception("Duplicate effect");
Console.WriteLine("All checks passed");
// This is only a sequential local model, not a durable guarantee.`,
  "True\n1",
  {
    tryRequest:
      'POST /orders with header Idempotency-Key: demo-1 and JSON {"quantity":2}; repeat the same request',
  },
);
add(
  "Database Internals",
  "An ORM does not write a row as soon as you change a C# property. EF Core tracks the object and sends SQL when SaveChangesAsync runs. A transaction groups database changes into one commit boundary. Underneath, the database manages pages, indexes, logging, and visibility. Start by observing the difference between the object in memory and the committed record.",
  "C# property বদলালেই database row লেখা হয় না। EF Core object track করে; SaveChangesAsync-এ SQL যায়। Transaction কয়েক change-এর এক commit boundary। নিচে database page, index ও log সামলায়। আগে memory object আর committed record-এর পার্থক্য বুঝুন।",
  "Editing a form on the counter is not the same as writing the final entry into the shop ledger.",
  "কাউন্টারের ফর্মে edit করা আর দোকানের স্থায়ী খাতায় লেখা এক নয়।",
  [
    ["Load a product through a DbContext.", "DbContext দিয়ে product পড়ুন।"],
    ["Change its Price property in memory.", "Memory-তে Price বদলান।"],
    [
      "Save inside a transaction and commit.",
      "Transaction-এ save করে commit করুন।",
    ],
    [
      "Read a fresh no-tracking projection to see stored state.",
      "নতুন no-tracking query-তে সংরক্ষিত মান দেখুন।",
    ],
  ],
  `var stored = new Product(1, "Tea", 20m);
var edited = stored with { Price = 25m };
Console.WriteLine($"Stored: {stored.Price}");
Console.WriteLine($"Edited: {edited.Price}");
stored = edited; // Simulates an explicit commit boundary.
Console.WriteLine($"After commit: {stored.Price}");
record Product(int Id, string Name, decimal Price);
// A real database commits through its engine, not this assignment.`,
  `using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<TeaDb>(o => o.UseSqlite("Data Source=tea-learning.db"));
var app = builder.Build();
await using (var scope = app.Services.CreateAsyncScope()) {
    var db = scope.ServiceProvider.GetRequiredService<TeaDb>();
    await db.Database.EnsureCreatedAsync();
    if (!await db.Products.AnyAsync()) { db.Products.Add(new Product { Name = "Tea", Price = 20m }); await db.SaveChangesAsync(); }
}
app.MapGet("/demo", async (TeaDb db) => await db.Products.AsNoTracking().OrderBy(p => p.Id).ToListAsync());
app.MapPost("/products/{id:int}/price", async (int id, PriceInput input, TeaDb db) => {
    if (input.Price < 0) return Results.BadRequest("Negative price");
    await using var transaction = await db.Database.BeginTransactionAsync();
    var product = await db.Products.FindAsync(id);
    if (product is null) return Results.NotFound();
    product.Price = input.Price;
    await db.SaveChangesAsync(); await transaction.CommitAsync();
    return Results.Ok(new { product.Id, product.Price });
});
app.Run();
record PriceInput(decimal Price);
class Product { public int Id { get; set; } public string Name { get; set; } = ""; public decimal Price { get; set; } }
class TeaDb(DbContextOptions<TeaDb> options) : DbContext(options) { public DbSet<Product> Products => Set<Product>(); }
// EnsureCreated is for this fresh learning database; use reviewed migrations for evolving production schemas.`,
  `var versions = new[] { (From: 1, Until: (int?)4, Price: 20m), (From: 4, Until: (int?)null, Price: 25m) };
decimal ReadAt(int snapshot) => versions.Single(v => v.From <= snapshot && (v.Until is null || snapshot < v.Until)).Price;
if (ReadAt(3) != 20m || ReadAt(5) != 25m) throw new Exception("Visibility rule failed");
Console.WriteLine("All checks passed");
// Tiny MVCC teaching model: providers implement actual visibility differently.`,
  "Stored: 20\nEdited: 25\nAfter commit: 25",
  {
    apiKind: "EF Core SQLite program",
    apiSetupEn:
      "Create a web project and install the matching EF Core SQLite provider. This complete example creates a local tea-learning.db file. Use a disposable learning directory.",
    apiSetupBn:
      "Web project-এ EF Core SQLite package যোগ করুন। উদাহরণটি local tea-learning.db বানায়। শেখার আলাদা folder নিন।",
    apiCommands:
      "dotnet new web -n TeaApi\ndotnet add TeaApi package Microsoft.EntityFrameworkCore.Sqlite --version 8.0.22\n# Replace TeaApi/Program.cs with the example.\ndotnet run --project TeaApi",
    tryRequest: 'GET /demo; POST /products/1/price with JSON {"price":25}',
  },
);
add(
  "Operating Systems",
  "Your .NET application is a process. Its threads share memory, and the operating system decides when they run. The managed heap is only part of the process memory: native buffers, stacks, libraries, and caches also exist. Learn to read a few counters before changing GC or thread settings. Async waiting is useful because a thread need not sit blocked while an I/O operation finishes.",
  ".NET অ্যাপ একটি process। Thread-গুলো memory ভাগ করে, OS সময় দেয়। Managed heap পুরো memory নয়; stack ও native buffer-ও আছে। GC বা thread tune করার আগে কয়েকটি counter বোঝুন। Async অপেক্ষায় পুরো thread আটকে থাকতে হয় না।",
  "A shop worker can take another order while the kettle heats, rather than standing still and watching it.",
  "কেটলির পানি গরম হওয়ার সময় কর্মী দাঁড়িয়ে না থেকে আরেকটি অর্ডার নিতে পারেন।",
  [
    [
      "Read process and managed-heap counters separately.",
      "Process ও managed heap আলাদা মাপুন।",
    ],
    [
      "Create a short-lived byte buffer and observe allocation.",
      "ছোট byte buffer তৈরি করে allocation দেখুন।",
    ],
    [
      "Use await for a wait instead of Thread.Sleep in a request.",
      "Request-এর অপেক্ষায় Thread.Sleep-এর বদলে await ব্যবহার করুন।",
    ],
    [
      "Treat counters as clues, not a complete diagnosis.",
      "Counter সংকেত, পূর্ণ diagnosis নয়।",
    ],
  ],
  `using System.Diagnostics;
using var process = Process.GetCurrentProcess();
long before = GC.GetTotalMemory(false);
byte[] buffer = new byte[1024 * 1024];
buffer[0] = 1;
long after = GC.GetTotalMemory(false);
Console.WriteLine($"Managed before: {before}");
Console.WriteLine($"Managed after: {after}");
Console.WriteLine($"Process working set: {process.WorkingSet64}");
GC.KeepAlive(buffer); // Keep the teaching buffer alive until this point.
// Exact numbers depend on runtime and environment.`,
  `var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.MapGet("/demo", async (CancellationToken cancellation) => {
    await Task.Delay(20, cancellation); // Simulated asynchronous wait.
    return Results.Ok(new { Message = "The wait completed without Thread.Sleep", ManagedBytes = GC.GetTotalMemory(false) });
});
app.Run();
// Restrict detailed diagnostic endpoints in real deployments.
// Do not force GC.Collect on every request.`,
  `int completed = 0;
async Task WaitAndCount() { await Task.Delay(5); Interlocked.Increment(ref completed); }
await Task.WhenAll(Enumerable.Range(0, 10).Select(_ => WaitAndCount()));
if (completed != 10) throw new Exception("Work missing");
Console.WriteLine("All checks passed");
// Ten tasks do not imply ten dedicated threads.`,
  "Runtime-dependent memory counters; the process working set differs from the managed heap.",
);
add(
  "Computer Networks",
  "An HTTP call has several boundaries: name lookup, connection, TLS, request, and response. In .NET, use HttpClient with a time budget and pass cancellation through. IHttpClientFactory manages reusable handler lifetimes in ASP.NET Core. A non-success status is different from a connection exception. Do not let a caller supply an arbitrary URL for a privileged server to fetch.",
  "HTTP call-এ DNS, connection, TLS, request ও response আলাদা। .NET-এ timeout ও cancellation দিন। ASP.NET Core-এ IHttpClientFactory handler সামলায়। HTTP error ও connection exception আলাদা। User-এর যেকোনো URL server দিয়ে fetch করাবেন না।",
  "A phone call can fail because the number is wrong, the line is down, or the person answers but says no. Those are different failures.",
  "নম্বর ভুল, লাইন বন্ধ বা ফোন ধরে না বলা—তিন ব্যর্থতা আলাদা। HTTP-তেও একইভাবে স্তর ধরুন।",
  [
    [
      "Configure a named client for one approved upstream.",
      "এক অনুমোদিত upstream-এর named client দিন।",
    ],
    ["Set a small total timeout.", "মোট অপেক্ষার সময় বাঁধুন।"],
    [
      "Pass the request cancellation token into the HTTP call.",
      "Request cancellation HTTP call-এ পাঠান।",
    ],
    [
      "Map downstream failure into a clear API response.",
      "দূরের failure-কে স্পষ্ট API ফলে দেখান।",
    ],
  ],
  `var uri = new Uri("https://example.com:443/products/1");
Console.WriteLine(uri.Scheme);
Console.WriteLine(uri.Host);
Console.WriteLine(uri.Port);
Console.WriteLine(uri.AbsolutePath);
byte[] message = System.Text.Encoding.UTF8.GetBytes("Tea");
Console.WriteLine($"Bytes to send: {message.Length}");
// A real TCP stream may return partial reads; HTTP libraries handle its framing.`,
  `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient("catalog", client => {
    client.BaseAddress = new Uri("http://127.0.0.1:5050");
    client.Timeout = TimeSpan.FromSeconds(2);
});
var app = builder.Build();
app.MapGet("/demo", () => "Named client configured for the local learning catalog");
app.MapGet("/catalog-status", async (IHttpClientFactory factory, CancellationToken ct) => {
    try {
        using var response = await factory.CreateClient("catalog").GetAsync("/health", ct);
        return response.IsSuccessStatusCode ? Results.Ok("Catalog reachable") : Results.Problem("Catalog returned an error", statusCode: 502);
    } catch (HttpRequestException) { return Results.Problem("Catalog connection failed", statusCode: 502); }
    catch (OperationCanceledException) when (!ct.IsCancellationRequested) { return Results.Problem("Catalog timed out", statusCode: 504); }
});
app.Run();
// Run a separate authorized local catalog on port 5050 to test the outgoing call.`,
  `bool Allowed(Uri uri) => uri.Scheme == "https" && uri.Host == "catalog.example.com" && uri.Port == 443;
if (!Allowed(new Uri("https://catalog.example.com/products"))) throw new Exception("Allowed host rejected");
if (Allowed(new Uri("https://catalog.example.com.evil.invalid/"))) throw new Exception("Wrong host accepted");
if (Allowed(new Uri("http://catalog.example.com/"))) throw new Exception("Wrong scheme accepted");
Console.WriteLine("All checks passed");
// This allowlist test alone is not complete SSRF protection.`,
  "https\nexample.com\n443\n/products/1\nBytes to send: 3",
);
add(
  "Concurrency & Multithreading",
  "Concurrency means several operations are in progress. Parallelism means work executes simultaneously on available processors. Task.WhenAll waits for tasks; it does not limit how many start. Use SemaphoreSlim to bound active asynchronous work, release it in finally, and pass cancellation. Shared counters need atomic updates or a lock around the complete invariant.",
  "Concurrency-তে কয়েক কাজ চলছে; parallelism-এ একই সময়ে CPU-তে কাজ। Task.WhenAll সংখ্যা সীমা দেয় না। SemaphoreSlim দিয়ে active async কাজ বাঁধুন, finally-তে release ও cancellation দিন। Shared counter-এ atomic update দরকার।",
  "A shop may accept ten orders but have only two kettles. Orders can wait; only two batches heat at a time.",
  "দশটি অর্ডার নেওয়া যায়, কিন্তু কেটলি দুটি হলে একসাথে দুই batch গরম হবে।",
  [
    ["Create a gate with two permits.", "দুই permit-এর gate বানান।"],
    [
      "Wait asynchronously before entering the expensive operation.",
      "ভারী কাজের আগে async অপেক্ষা করুন।",
    ],
    [
      "Release the permit even if the operation fails.",
      "Fail হলেও permit ফেরত দিন।",
    ],
    [
      "Wait for all callers and verify the final result.",
      "সব caller শেষ হলে ফল যাচাই করুন।",
    ],
  ],
  `using var gate = new SemaphoreSlim(2);
int active = 0, maximum = 0;
object sync = new();
async Task<int> Work(int number) {
    await gate.WaitAsync();
    try {
        lock (sync) { active++; maximum = Math.Max(maximum, active); }
        await Task.Delay(10);
        return number * number;
    } finally { lock (sync) active--; gate.Release(); }
}
int[] values = await Task.WhenAll(Enumerable.Range(1, 4).Select(Work));
Console.WriteLine(string.Join(",", values));
Console.WriteLine($"Maximum active: {maximum}");`,
  `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<WorkLimiter>();
var app = builder.Build();
app.MapGet("/demo", async (WorkLimiter limiter, CancellationToken ct) => {
    int[] values = await Task.WhenAll(Enumerable.Range(1, 4).Select(n => limiter.Square(n, ct)));
    return Results.Ok(values);
});
app.Run();
class WorkLimiter : IDisposable {
    private readonly SemaphoreSlim gate = new(2);
    public async Task<int> Square(int n, CancellationToken ct) {
        await gate.WaitAsync(ct);
        try { await Task.Delay(20, ct); return n * n; }
        finally { gate.Release(); }
    }
    public void Dispose() => gate.Dispose();
}`,
  `int count = 0;
Parallel.For(0, 1000, _ => Interlocked.Increment(ref count));
if (count != 1000) throw new Exception("Lost updates");
using var gate = new SemaphoreSlim(1);
await gate.WaitAsync();
try { if (gate.CurrentCount != 0) throw new Exception("Permit not acquired"); }
finally { gate.Release(); }
if (gate.CurrentCount != 1) throw new Exception("Permit leaked");
Console.WriteLine("All checks passed");`,
  "1,4,9,16\nMaximum active: 2",
  { smoke: { path: "/demo", status: 200, contains: "[1,4,9,16]" } },
);
add(
  "Backend Architecture",
  "An ASP.NET Core endpoint should translate HTTP into a use case, not contain every database and business detail. Put the rule in an application service and depend on a small storage interface. Register the real storage adapter with dependency injection. You can then test the service with an in-memory substitute without starting a server. Architecture is useful when it makes these changes easier, not when it creates more folders.",
  "Endpoint HTTP থেকে use case-এ অনুবাদ করবে; সব business/database code সেখানে নয়। Service-এ নিয়ম, ছোট interface-এ storage-এর চুক্তি দিন। DI-তে adapter বসান। Fake storage দিয়ে server ছাড়াই service test করা যায়। Folder বাড়ানোই architecture নয়।",
  "The cashier knows how to accept an order; the filing cabinet knows how to store it. Neither needs to perform the other’s job.",
  "ক্যাশিয়ার অর্ডার নেন, খাতার ব্যবস্থা তা রাখে। দুজনের কাজ আলাদা হলে বদলানো সহজ।",
  [
    ["Represent the request with a record.", "Request record-এ ধরুন।"],
    ["Validate quantity in the use case.", "Use case-এ quantity যাচাই করুন।"],
    [
      "Depend on IOrderStore instead of concrete database code.",
      "নির্দিষ্ট DB নয়, IOrderStore-এর উপর নির্ভর করুন।",
    ],
    [
      "Swap adapters at the composition root.",
      "অ্যাপ শুরুর registration-এ adapter বদলান।",
    ],
  ],
  `var store = new MemoryStore();
var place = new PlaceOrder(store);
place.Execute("Tea", 2);
Console.WriteLine(store.Rows.Count);
Console.WriteLine(store.Rows[0].Quantity);
record Order(string Product, int Quantity);
interface IOrderStore { void Save(Order order); }
class MemoryStore : IOrderStore {
    public List<Order> Rows { get; } = new();
    public void Save(Order order) => Rows.Add(order);
}
class PlaceOrder(IOrderStore store) {
    public void Execute(string product, int quantity) {
        if (quantity <= 0) throw new ArgumentException("Quantity");
        store.Save(new Order(product, quantity));
    }
}`,
  `using System.Collections.Concurrent;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<IOrderStore, MemoryOrderStore>();
builder.Services.AddScoped<PlaceOrder>();
var app = builder.Build();
app.MapGet("/demo", () => "Endpoint -> Use case -> Storage contract");
app.MapPost("/orders", (OrderInput input, PlaceOrder useCase) => {
    if (input.Quantity is < 1 or > 100) return Results.BadRequest("Quantity must be 1-100");
    var order = useCase.Execute(input.Quantity);
    return Results.Created($"/orders/{order.Id}", order);
});
app.Run();
record OrderInput(int Quantity);
record Order(Guid Id, int Quantity);
interface IOrderStore { void Save(Order order); }
class MemoryOrderStore : IOrderStore {
    private readonly ConcurrentDictionary<Guid, Order> rows = new();
    public void Save(Order order) => rows[order.Id] = order;
}
class PlaceOrder(IOrderStore store) {
    public Order Execute(int quantity) { var order = new Order(Guid.NewGuid(), quantity); store.Save(order); return order; }
}`,
  `var fake = new RecordingStore();
var service = new Service(fake);
service.Place(2);
if (fake.Saved != 2) throw new Exception("Adapter not called");
bool rejected = false;
try { service.Place(0); } catch (ArgumentException) { rejected = true; }
if (!rejected || fake.Saved != 2) throw new Exception("Invalid input reached storage");
Console.WriteLine("All checks passed");
interface IStore { void Save(int quantity); }
class RecordingStore : IStore { public int Saved; public void Save(int quantity) => Saved = quantity; }
class Service(IStore store) { public void Place(int n) { if (n <= 0) throw new ArgumentException(); store.Save(n); } }`,
  "1\n2",
  {
    tryRequest:
      'POST /orders with JSON {"quantity":2}; inspect the 201 response and Location header',
  },
);
add(
  "API Design",
  "A good API tells the caller what happened. Use 201 and Location for a new resource, 400 for invalid input, and 404 when a resource is absent. Return small named DTOs rather than leaking every entity property. Keep money units, identifiers, and error meaning explicit. The sample is deliberately an in-memory learning API; real applications need authorization and durable storage.",
  "ভালো API ফল পরিষ্কার বলে: নতুন resource-এ ২০১ ও Location, ভুল input-এ ৪০০, না থাকলে ৪০৪। Entity-এর সব তথ্য না দিয়ে ছোট DTO দিন। টাকা, id ও error-এর অর্থ স্পষ্ট রাখুন। নিচের memory API শেখার জন্য, বাস্তবে permission ও database চাই।",
  "A receipt should say whether the order was accepted, what its number is, and how much it costs.",
  "Receipt-এ অর্ডার নেওয়া হয়েছে কি না, নম্বর ও দাম স্পষ্ট থাকবে।",
  [
    [
      "Define request and response records separately.",
      "Request ও response record আলাদা করুন।",
    ],
    ["Validate before changing state.", "State বদলানোর আগে validation করুন।"],
    [
      "Use typed results with meaningful HTTP statuses.",
      "অর্থপূর্ণ HTTP status-এ ফল দিন।",
    ],
    [
      "Keep response field names and units stable.",
      "Response field ও unit-এর চুক্তি স্থির রাখুন।",
    ],
  ],
  `var response = new OrderResponse(42, 3, 60m, "BDT");
string json = System.Text.Json.JsonSerializer.Serialize(response);
Console.WriteLine(json);
var error = new ApiError("invalid_quantity", "Quantity must be 1-100");
Console.WriteLine(error.Code);
record OrderResponse(int Id, int Quantity, decimal Total, string Currency);
record ApiError(string Code, string Message);
// A client handles Code; Message can be translated.`,
  `using System.Collections.Concurrent;
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
var orders = new ConcurrentDictionary<Guid, OrderView>();
app.MapGet("/demo", () => "Create an order, then read its Location");
app.MapPost("/orders", (CreateOrder request) => {
    if (request.Quantity is < 1 or > 100)
        return Results.ValidationProblem(new Dictionary<string, string[]> { ["quantity"] = ["Use 1-100"] });
    var order = new OrderView(Guid.NewGuid(), request.Quantity, request.Quantity * 20m, "BDT");
    orders[order.Id] = order;
    return Results.Created($"/orders/{order.Id}", order);
});
app.MapGet("/orders/{id:guid}", (Guid id) => orders.TryGetValue(id, out var order) ? Results.Ok(order) : Results.NotFound());
app.Run();
record CreateOrder(int Quantity);
record OrderView(Guid Id, int Quantity, decimal Total, string Currency);`,
  `string json = """{"id":42,"amountMinor":6000,"currency":"BDT"}""";
using var document = System.Text.Json.JsonDocument.Parse(json);
var root = document.RootElement;
if (root.GetProperty("amountMinor").GetInt32() != 6000) throw new Exception("Units changed");
if (root.GetProperty("currency").GetString() != "BDT") throw new Exception("Currency changed");
Console.WriteLine("All checks passed");
// Consumer contract tests detect accidental field/meaning changes.`,
  '{"Id":42,"Quantity":3,"Total":60,"Currency":"BDT"}\ninvalid_quantity',
  {
    tryRequest:
      'POST /orders with {"quantity":3}; then GET the URL in Location',
  },
);
add(
  "Database Design & Optimization",
  "In C#, model the data rule before tuning the query. A product SKU can be unique, a price must follow its business constraints, and a listing should fetch only fields needed by the screen. EF Core projection and AsNoTracking help read-only queries. Use a stable ordering and a page limit. An index supports an access pattern; it does not justify returning an entire large table.",
  "আগে data rule: SKU unique কি না, price-এর সীমা কী। Screen-এর দরকারি field-ই query করুন। EF Core projection ও AsNoTracking read-only কাজে লাগে। Stable order ও page limit দিন। Index আছে বলে পুরো table ফেরাবেন না।",
  "A menu card needs the product name and price, not every supplier note stored in the warehouse ledger.",
  "মেনুতে নাম ও দাম লাগে, গুদামের সব supplier note নয়।",
  [
    [
      "Give each product an Id and a unique SKU.",
      "Id ও unique SKU নির্ধারণ করুন।",
    ],
    [
      "Configure the uniqueness rule in the model/database.",
      "Model/database-এ uniqueness দিন।",
    ],
    [
      "Filter and project before ToListAsync.",
      "ToListAsync-এর আগে filter ও projection দিন।",
    ],
    [
      "Take a bounded page in a deterministic order.",
      "স্থির ক্রমে সীমিত page নিন।",
    ],
  ],
  `var products = new[] {
    new Product(1, "TEA-1", "Tea", 20m), new Product(2, "MILK-1", "Milk", 50m)
};
var page = products.Where(p => p.Id > 0).OrderBy(p => p.Id)
    .Select(p => new MenuItem(p.Id, p.Name, p.Price)).Take(1).ToArray();
foreach (var item in page) Console.WriteLine($"{item.Name}: {item.Price}");
Console.WriteLine(products.Select(p => p.Sku).Distinct().Count() == products.Length);
record Product(int Id, string Sku, string Name, decimal Price);
record MenuItem(int Id, string Name, decimal Price);`,
  `using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<TeaDb>(o => o.UseSqlite("Data Source=tea-catalog.db"));
var app = builder.Build();
await using (var scope = app.Services.CreateAsyncScope()) {
    var db = scope.ServiceProvider.GetRequiredService<TeaDb>();
    await db.Database.EnsureCreatedAsync();
    if (!await db.Products.AnyAsync()) { db.Products.Add(new Product { Sku = "TEA-1", Name = "Tea", Price = 20m }); await db.SaveChangesAsync(); }
}
app.MapGet("/demo", async (TeaDb db, CancellationToken ct) => await db.Products
    .AsNoTracking().OrderBy(p => p.Id).Select(p => new { p.Id, p.Name, p.Price }).Take(20).ToListAsync(ct));
app.MapGet("/products", async (int? after, TeaDb db, CancellationToken ct) =>
    await db.Products.AsNoTracking().Where(p => p.Id > (after ?? 0)).OrderBy(p => p.Id)
        .Select(p => new { p.Id, p.Name, p.Price }).Take(20).ToListAsync(ct));
app.Run();
class Product { public int Id { get; set; } public string Sku { get; set; } = ""; public string Name { get; set; } = ""; public decimal Price { get; set; } }
class TeaDb(DbContextOptions<TeaDb> options) : DbContext(options) {
    public DbSet<Product> Products => Set<Product>();
    protected override void OnModelCreating(ModelBuilder model) => model.Entity<Product>().HasIndex(p => p.Sku).IsUnique();
}`,
  `int entities = 100, roundTripMs = 5;
int nPlusOne = (1 + entities) * roundTripMs;
int twoQueries = 2 * roundTripMs;
if (nPlusOne != 505 || twoQueries != 10) throw new Exception("Calculation failed");
Console.WriteLine("All checks passed");
// A model of network round-trip overhead, not a real database benchmark.
// Measure actual SQL plans, row counts, and transfer size in your project.`,
  "Tea: 20\nTrue",
  {
    apiKind: "EF Core SQLite program",
    apiSetupEn:
      "Install EF Core SQLite in a new web project. The example creates a fresh local tea-catalog.db and a unique SKU index. It is a small learning database, not a production migration procedure.",
    apiSetupBn:
      "নতুন web project-এ EF Core SQLite দিন। Local tea-catalog.db ও unique SKU index তৈরি হবে। Production schema evolution-এ reviewed migration লাগে।",
    apiCommands:
      "dotnet new web -n TeaApi\ndotnet add TeaApi package Microsoft.EntityFrameworkCore.Sqlite --version 8.0.22\n# Replace TeaApi/Program.cs with the example.\ndotnet run --project TeaApi",
    tryRequest: "GET /products?after=0 returns at most 20 projected rows",
  },
);
add(
  "Caching Strategies",
  "Caching means remembering a result for a while. Start with IMemoryCache inside one ASP.NET Core process. On a miss, load the source; on a hit, reuse the value. Give the entry a lifetime and evict it after a source update. This local example does not provide a shared Redis cache or strict consistency across servers. Learn the flow before adding distributed coordination.",
  "Caching হলো কিছু সময়ের জন্য ফল মনে রাখা। আগে এক ASP.NET Core process-এর IMemoryCache দিয়ে শিখুন। না পেলে source, পেলে পুরোনো ফল ব্যবহার। মেয়াদ দিন, source বদলালে evict করুন। এটি বহু server-এর shared Redis বা strict consistency নয়।",
  "Keep today’s menu near the counter; replace it when the kitchen changes a price.",
  "আজকের মেনু কাউন্টারে রাখুন; রান্নাঘরে দাম বদলালে সেটি পাল্টান।",
  [
    ["Build a namespaced cache key.", "আলাদা namespace-সহ key নিন।"],
    [
      "Look in the cache before reading the source.",
      "Source পড়ার আগে cache দেখুন।",
    ],
    ["Set a short absolute expiry after loading.", "এনে absolute expiry দিন।"],
    [
      "Evict on a source change and measure misses.",
      "Source বদলালে key সরান ও miss মাপুন।",
    ],
  ],
  `var source = new Dictionary<int, string> { [1] = "Tea" };
var cache = new Dictionary<int, string>();
int loads = 0;
string Get(int id) {
    if (cache.TryGetValue(id, out var value)) return value;
    loads++; value = source[id]; cache[id] = value; return value;
}
Console.WriteLine(Get(1));
Console.WriteLine(Get(1));
Console.WriteLine($"Source loads: {loads}");
// A sequential demonstration; Dictionary is not a concurrent cache.`,
  `using Microsoft.Extensions.Caching.Memory;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddMemoryCache();
builder.Services.AddSingleton<MenuSource>();
var app = builder.Build();
app.MapGet("/demo", () => "GET /menu/1 twice, then inspect sourceLoads");
app.MapGet("/menu/{id:int}", (int id, IMemoryCache cache, MenuSource source) => {
    if (id != 1) return Results.NotFound();
    string key = $"menu:{id}";
    string value = cache.GetOrCreate(key, entry => {
        entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30);
        return source.Load();
    })!;
    return Results.Ok(new { Value = value, SourceLoads = source.Loads });
});
app.MapPost("/menu/1/refresh", (IMemoryCache cache) => { cache.Remove("menu:1"); return Results.NoContent(); });
app.Run();
class MenuSource { private int loads; public int Loads => Volatile.Read(ref loads); public string Load() { Interlocked.Increment(ref loads); return "Tea"; } }
// GetOrCreate can run the factory concurrently; add appropriate per-key single-flight when required.`,
  `var cache = new Dictionary<string, string> { ["menu:1"] = "Old price" };
cache.Remove("menu:1");
if (cache.ContainsKey("menu:1")) throw new Exception("Invalidation failed");
cache["menu:1"] = "New price";
if (cache["menu:1"] != "New price") throw new Exception("Reload failed");
Console.WriteLine("All checks passed");`,
  "Tea\nTea\nSource loads: 1",
  { tryRequest: "GET /menu/1 twice; POST /menu/1/refresh; GET /menu/1 again" },
);
add(
  "Message Queues & Event-Driven Architecture",
  "A queue lets the request finish before a worker completes slow work. In .NET, Channel<T> is a useful first lesson: the writer submits a message, a BackgroundService reads it, and a result store records progress. A bounded channel creates backpressure. It is in-memory and not durable. A real broker still needs idempotent consumers and acknowledgment after safe completion.",
  "Queue-তে request শেষের পরে worker ধীর কাজ করে। .NET Channel-এ writer message দেয়, BackgroundService পড়ে, status store ফল রাখে। Bounded channel চাপ সীমিত করে। Memory channel restart-এ হারায়; আসল broker-এও idempotency ও ঠিক ack লাগে।",
  "The cashier gives an order number; the kitchen prepares the tea while the next customer is served.",
  "ক্যাশিয়ার order number দেন, রান্নাঘর চা বানায়; ততক্ষণে পরের ক্রেতার কাজ হয়।",
  [
    ["Accept a small typed message.", "ছোট typed message নিন।"],
    ["Enqueue it with a bounded capacity.", "সীমিত capacity-র queue-তে দিন।"],
    ["Return 202 and a progress address.", "২০২ ও progress-এর ঠিকানা দিন।"],
    [
      "Have the worker mark the job complete after processing.",
      "Worker কাজের পরে status complete করুক।",
    ],
  ],
  `using System.Threading.Channels;
var queue = Channel.CreateBounded<int>(2);
var producer = Task.Run(async () => {
    for (int id = 1; id <= 3; id++) await queue.Writer.WriteAsync(id);
    queue.Writer.Complete();
});
await foreach (int id in queue.Reader.ReadAllAsync()) {
    Console.WriteLine($"Preparing order {id}");
    await Task.Delay(5);
}
await producer;`,
  `using System.Collections.Concurrent;
using System.Threading.Channels;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<JobQueue>();
builder.Services.AddHostedService<TeaWorker>();
var app = builder.Build();
app.MapGet("/demo", () => "POST /jobs, then GET the returned progress URL");
app.MapPost("/jobs", async (JobQueue queue, CancellationToken ct) => {
    var id = Guid.NewGuid(); queue.Status[id] = "Queued";
    await queue.Items.Writer.WriteAsync(id, ct);
    return Results.Accepted($"/jobs/{id}", new { Id = id });
});
app.MapGet("/jobs/{id:guid}", (Guid id, JobQueue queue) =>
    queue.Status.TryGetValue(id, out var status) ? Results.Ok(new { Id = id, Status = status }) : Results.NotFound());
app.Run();
class JobQueue {
    public Channel<Guid> Items { get; } = Channel.CreateBounded<Guid>(10);
    public ConcurrentDictionary<Guid, string> Status { get; } = new();
}
class TeaWorker(JobQueue queue) : BackgroundService {
    protected override async Task ExecuteAsync(CancellationToken stop) {
        try {
            await foreach (Guid id in queue.Items.Reader.ReadAllAsync(stop)) {
                queue.Status[id] = "Running";
                await Task.Delay(20, stop);
                queue.Status[id] = "Completed";
            }
        } catch (OperationCanceledException) when (stop.IsCancellationRequested) { }
    }
}
// Add durable storage, cleanup, retry and failure states for real jobs.`,
  `var processed = new HashSet<string>();
int emails = 0;
foreach (string id in new[] { "event-1", "event-1", "event-2" })
    if (processed.Add(id)) emails++;
if (emails != 2) throw new Exception("Duplicate message effect");
Console.WriteLine("All checks passed");
// Durable consumer deduplication and its effect belong in an atomic boundary.`,
  "Preparing order 1\nPreparing order 2\nPreparing order 3",
  {
    tryRequest:
      "POST /jobs returns 202 and Location; GET that Location until Completed",
  },
);
add(
  "Microservices Architecture",
  "A microservice is still an ordinary .NET application, but its boundary is a network instead of a method call. Use a typed response contract, a configured HttpClient, cancellation, and a deadline. The caller must handle the catalog being unavailable. Start with two local applications only after you understand the same boundaries inside one application; separate deployment adds real operational work.",
  "Microservice-ও সাধারণ .NET অ্যাপ, তবে method call-এর জায়গায় network। Typed DTO, configured HttpClient, cancellation ও deadline দিন। Catalog বন্ধ থাকলে caller কী করবে ঠিক করুন। আগে এক অ্যাপের boundary বুঝুন, তারপর আলাদা deploy-এর খরচ নিন।",
  "Two shops can cooperate by phone, but one shop must handle the other being closed instead of waiting forever.",
  "দুটি দোকান ফোনে মিলে কাজ করলে অন্যটি বন্ধ থাকলেও অনন্ত অপেক্ষা না করে উত্তর দিতে হবে।",
  [
    ["Define the product JSON contract.", "Product-এর JSON চুক্তি লিখুন।"],
    [
      "Keep the catalog address in server configuration.",
      "Catalog-এর ঠিকানা server config-এ রাখুন।",
    ],
    [
      "Call it through IHttpClientFactory with a timeout.",
      "IHttpClientFactory ও timeout দিয়ে call করুন।",
    ],
    [
      "Return a clear failure when the dependency is unavailable.",
      "Dependency না চললে পরিষ্কার failure দিন।",
    ],
  ],
  `string json = """{"id":1,"name":"Tea","price":20}""";
var product = System.Text.Json.JsonSerializer.Deserialize<Product>(json,
    new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true });
if (product is null || product.Price < 0) throw new Exception("Invalid contract");
Console.WriteLine($"{product.Name}: {product.Price}");
record Product(int Id, string Name, decimal Price);
// The same record shape can describe a response from a separate service.`,
  `using System.Net.Http.Json;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient("catalog", client => {
    client.BaseAddress = new Uri(builder.Configuration["Catalog:BaseUrl"] ?? "http://127.0.0.1:5050");
    client.Timeout = TimeSpan.FromSeconds(2);
});
var app = builder.Build();
app.MapGet("/demo", () => "Quote service configured; run an authorized catalog separately");
app.MapGet("/quote/{quantity:int}", async (int quantity, IHttpClientFactory factory, CancellationToken ct) => {
    if (quantity is < 1 or > 100) return Results.BadRequest("Quantity must be 1-100");
    try {
        var product = await factory.CreateClient("catalog").GetFromJsonAsync<Product>("/products/1", ct);
        return product is null ? Results.Problem("Missing catalog response", statusCode: 502)
            : Results.Ok(new { product.Name, Quantity = quantity, Total = quantity * product.Price });
    } catch (HttpRequestException) { return Results.Problem("Catalog unavailable", statusCode: 503); }
    catch (OperationCanceledException) when (!ct.IsCancellationRequested) { return Results.Problem("Catalog deadline reached", statusCode: 504); }
});
app.Run();
record Product(int Id, string Name, decimal Price);
// A local catalog can expose GET /products/1 => { id: 1, name: "Tea", price: 20 }.`,
  `record Product(int Id, string Name, decimal Price);
decimal Quote(Product product, int quantity) {
    if (quantity <= 0 || product.Price < 0) throw new ArgumentException("Invalid quote");
    return product.Price * quantity;
}
if (Quote(new Product(1, "Tea", 20m), 3) != 60m) throw new Exception("Contract calculation changed");
bool rejected = false;
try { Quote(new Product(1, "Tea", -1m), 3); } catch (ArgumentException) { rejected = true; }
if (!rejected) throw new Exception("Bad downstream value accepted");
Console.WriteLine("All checks passed");`,
  "Tea: 20",
  {
    tryRequest:
      "GET /quote/3; without a running local catalog this returns a controlled 503, not a successful quote",
  },
);
add(
  "Security & Authentication",
  "Authentication asks who is calling; authorization asks whether that caller may perform this operation on this resource. In .NET, ClaimsPrincipal describes identity and policies protect endpoints. An authenticated user must still be restricted to the correct order or tenant. The API example deliberately contains no fake production login: protected routes reject anonymous requests until a real identity flow is connected.",
  "Authentication বলে কে, authorization বলে নির্দিষ্ট resource-এ কী করতে পারবেন। .NET-এ ClaimsPrincipal ও policy ব্যবহার করুন। Login থাকলেও অন্যের order পড়া যাবে না। নিচের API-তে ভুয়া production login নেই; আসল identity যোগ না করা পর্যন্ত protected route anonymous-কে ফেরায়।",
  "An ID card identifies a customer; it does not let that customer collect somebody else’s order.",
  "পরিচয়পত্রে ক্রেতা চেনা যায়, কিন্তু তাতে অন্যের অর্ডার নিয়ে যাওয়ার অধিকার হয় না।",
  [
    [
      "Create or validate an authenticated identity through a real provider.",
      "আসল provider দিয়ে পরিচয় যাচাই করুন।",
    ],
    [
      "Require authentication at the endpoint.",
      "Endpoint-এ authentication বাধ্যতামূলক করুন।",
    ],
    [
      "Filter the requested record by its owner.",
      "চাওয়া record owner অনুযায়ী বাছুন।",
    ],
    [
      "Test both permitted and denied cases.",
      "অনুমোদিত ও নিষিদ্ধ দুই case test করুন।",
    ],
  ],
  `using System.Security.Claims;
var user = new ClaimsPrincipal(new ClaimsIdentity(new[] {
    new Claim(ClaimTypes.NameIdentifier, "user-1"),
    new Claim(ClaimTypes.Role, "staff")
}, "local-teaching-identity"));
bool Owns(string owner) => user.Identity?.IsAuthenticated == true &&
    user.FindFirst(ClaimTypes.NameIdentifier)?.Value == owner;
Console.WriteLine(Owns("user-1"));
Console.WriteLine(Owns("user-2"));
// Claims must come from a validated identity flow in a real application.`,
  `using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDataProtection().UseEphemeralDataProtectionProvider(); // Learning-only keys; configure protected shared keys for real cookie auth.
builder.Services.AddAuthentication("app").AddCookie("app", options => {
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Events.OnRedirectToLogin = context => { context.Response.StatusCode = 401; return Task.CompletedTask; };
    options.Events.OnRedirectToAccessDenied = context => { context.Response.StatusCode = 403; return Task.CompletedTask; };
});
builder.Services.AddAuthorization(options => options.AddPolicy("Staff", p => p.RequireAuthenticatedUser().RequireRole("staff")));
var app = builder.Build();
app.UseAuthentication(); app.UseAuthorization();
app.MapGet("/demo", () => "Public learning endpoint; /private requires validated authentication");
app.MapGet("/private", () => "Staff data").RequireAuthorization("Staff");
app.Run();
// Integrate a maintained real sign-in/identity provider. No hard-coded login is provided.`,
  `bool CanRead(string actor, string tenant, string owner, string resourceTenant) =>
    actor == owner && tenant == resourceTenant;
if (!CanRead("u1", "t1", "u1", "t1")) throw new Exception("Owner blocked");
if (CanRead("u1", "t1", "u2", "t1")) throw new Exception("Other owner allowed");
if (CanRead("u1", "t1", "u1", "t2")) throw new Exception("Cross-tenant access");
Console.WriteLine("All checks passed");`,
  "True\nFalse",
  {
    tryRequest:
      "GET /demo returns 200; GET /private without an authenticated cookie returns 401",
  },
);
add(
  "Cloud Computing",
  "The same ASP.NET Core code can run on a laptop or a cloud host when configuration is separate from source. Use typed options for non-secret settings, validate them at startup, and read secrets only on the server from approved providers. Add health checks so the host can see whether the application is alive. A cloud role or managed identity is different from embedding an access key in React.",
  "Config source থেকে আলাদা হলে একই ASP.NET Core code laptop ও cloud-এ চলে। Non-secret setting typed option-এ নিন, startup-এ validate করুন। Secret শুধু server-এর অনুমোদিত provider থেকে। Host-এর জন্য health check দিন; React-এ access key নয়।",
  "A shop keeps its recipe the same but writes each branch’s address and opening hours on a separate settings sheet.",
  "রেসিপি একই থাকে, কিন্তু শাখার ঠিকানা ও সময় আলাদা settings পাতায় থাকে।",
  [
    ["Define a small options class.", "ছোট options class লিখুন।"],
    ["Bind it to a configuration section.", "Config section-এর সাথে bind করুন।"],
    [
      "Validate settings before serving requests.",
      "Request নেওয়ার আগে settings যাচাই করুন।",
    ],
    [
      "Expose safe health/config metadata, never credentials.",
      "নিরাপদ health তথ্য দিন, credential নয়।",
    ],
  ],
  `string json = """{"region":"ap-south-1","pageSize":20}""";
var settings = System.Text.Json.JsonSerializer.Deserialize<Settings>(json,
    new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
if (settings.PageSize is < 1 or > 100) throw new ArgumentException("Page size");
Console.WriteLine(settings.Region);
Console.WriteLine(settings.PageSize);
record Settings(string Region, int PageSize);
// API keys/passwords are not part of this public sample.`,
  `using Microsoft.Extensions.Options;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOptions<CatalogOptions>().Bind(builder.Configuration.GetSection("Catalog"))
    .Validate(o => o.PageSize is >= 1 and <= 100, "PageSize must be 1-100")
    .ValidateOnStart();
builder.Services.AddHealthChecks();
var app = builder.Build();
app.MapGet("/demo", (IOptions<CatalogOptions> options, IHostEnvironment env) =>
    new { options.Value.Region, options.Value.PageSize, Environment = env.EnvironmentName });
app.MapHealthChecks("/health");
app.Run();
class CatalogOptions {
    public string Region { get; set; } = "ap-south-1";
    public int PageSize { get; set; } = 20;
}
// Override with environment variable Catalog__PageSize=30; do not expose secrets.`,
  `bool Valid(int pageSize) => pageSize is >= 1 and <= 100;
foreach (var sample in new[] { (Value: 0, Expected: false), (Value: 1, Expected: true), (Value: 100, Expected: true), (Value: 101, Expected: false) })
    if (Valid(sample.Value) != sample.Expected) throw new Exception("Configuration bound changed");
Console.WriteLine("All checks passed");
// Fail fast on invalid required settings instead of serving broken requests.`,
  "ap-south-1\n20",
  { tryRequest: "GET /demo shows safe options; GET /health returns Healthy" },
);
add(
  "DevOps & CI/CD",
  "For a .NET backend, delivery starts with restore, build, tests, and publish. Keep the identity of the tested source and artifact. Add a health endpoint and a safe version endpoint so a smoke test can verify what actually runs after deployment. Promoting the same tested artifact is easier to reason about than rebuilding from changing inputs in every environment.",
  ".NET backend-এ restore, build, test ও publish মূল ধাপ। Tested source ও artifact-এর পরিচয় রাখুন। Deploy-এর পরে কী চলছে জানতে health ও safe version endpoint দিন। প্রতিটি environment-এ নতুন করে build-এর বদলে একই tested artifact এগিয়ে দিন।",
  "A delivery label identifies the exact batch of tea, not just the name of the shop that packed it.",
  "Delivery label-এ কোন batch তা থাকে, শুধু দোকানের নাম নয়। Release-এও exact পরিচয় দরকার।",
  [
    [
      "Restore and build the same solution.",
      "একই solution restore ও build করুন।",
    ],
    ["Run tests before publishing.", "Publish-এর আগে test চালান।"],
    [
      "Keep commit and artifact identity with the release.",
      "Release-এর সাথে commit ও artifact identity রাখুন।",
    ],
    [
      "Check health and version after deployment.",
      "Deploy-এর পরে health ও version দেখুন।",
    ],
  ],
  `using System.Security.Cryptography;
using System.Text;
byte[] artifact = Encoding.UTF8.GetBytes("demo compiled artifact bytes");
string digest = Convert.ToHexString(SHA256.HashData(artifact));
var release = new Release("reviewed-commit", digest, true);
Console.WriteLine(release.Digest.Length);
Console.WriteLine(release.TestsPassed);
record Release(string Commit, string Digest, bool TestsPassed);
// Hash the real built artifact in your pipeline, not this demo text.`,
  `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHealthChecks();
var app = builder.Build();
string version = builder.Configuration["APP_VERSION"] ?? "local-learning";
app.MapGet("/demo", () => new { Version = version, Runtime = Environment.Version.ToString() });
app.MapGet("/version", () => new { Version = version });
app.MapHealthChecks("/health");
app.Run();
// CI example commands:
// dotnet restore App.sln
// dotnet build App.sln -c Release --no-restore
// dotnet test App.sln -c Release --no-build
// dotnet publish src/App/App.csproj -c Release --no-build -o artifacts/app`,
  `bool CanPromote(bool build, bool tests, bool smoke, bool reviewed) => build && tests && smoke && reviewed;
if (!CanPromote(true, true, true, true)) throw new Exception("Valid release blocked");
if (CanPromote(true, false, true, true)) throw new Exception("Failed tests ignored");
if (CanPromote(true, true, false, true)) throw new Exception("Failed smoke ignored");
Console.WriteLine("All checks passed");
// The pipeline must obtain these signals from real checks, not model statements.`,
  "64\nTrue",
  {
    tryRequest:
      "GET /health and GET /version after starting the published artifact",
  },
);
add(
  "Docker & Kubernetes",
  "Containers run your .NET process; Kubernetes decides where instances run and when to send traffic. Write the application side first: listen on the configured port, provide a readiness endpoint, and stop background work when the host requests shutdown. Readiness and liveness are different questions. An external dependency failing does not always mean the process should be restarted.",
  "Container .NET process চালায়, Kubernetes instance বসায় ও traffic দেয়। আগে app-এর কাজ লিখুন: port মানা, readiness endpoint, shutdown-এ background কাজ বন্ধ। Readiness ও liveness আলাদা। বাইরের dependency fail হলেই process restart দরকার নয়।",
  "Before opening the shop, put up a ready sign. When closing, remove that sign before stopping work already in progress.",
  "দোকান প্রস্তুত হলে ready sign দিন। বন্ধের সময় আগে sign নামান, তারপর চলমান কাজ গুছিয়ে শেষ করুন।",
  [
    [
      "Use the host lifetime instead of an endless unmanaged thread.",
      "অনিয়ন্ত্রিত thread নয়, host lifetime ব্যবহার করুন।",
    ],
    [
      "Publish a lightweight readiness endpoint.",
      "হালকা readiness endpoint দিন।",
    ],
    [
      "Pass the stopping token into background waits.",
      "Background অপেক্ষায় stopping token দিন।",
    ],
    [
      "Let the orchestrator drain traffic before forced termination.",
      "Force stop-এর আগে traffic drain-এর সময় দিন।",
    ],
  ],
  `using var stop = new CancellationTokenSource();
async Task Worker(CancellationToken token) {
    try {
        while (true) { await Task.Delay(10, token); }
    } catch (OperationCanceledException) when (token.IsCancellationRequested) {
        Console.WriteLine("Worker stopped safely");
    }
}
Task running = Worker(stop.Token);
stop.Cancel();
await running;`,
  `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHostedService<Heartbeat>();
builder.Services.AddHealthChecks();
var app = builder.Build();
bool ready = false;
app.Lifetime.ApplicationStarted.Register(() => Volatile.Write(ref ready, true));
app.Lifetime.ApplicationStopping.Register(() => Volatile.Write(ref ready, false));
app.MapGet("/demo", () => "Use /ready for traffic eligibility and /health for a simple host check");
app.MapGet("/ready", () => Volatile.Read(ref ready) ? Results.Ok("Ready") : Results.StatusCode(503));
app.MapHealthChecks("/health");
app.Run();
class Heartbeat(ILogger<Heartbeat> logger) : BackgroundService {
    protected override async Task ExecuteAsync(CancellationToken stop) {
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(10));
        try { while (await timer.WaitForNextTickAsync(stop)) logger.LogInformation("Learning worker heartbeat"); }
        catch (OperationCanceledException) when (stop.IsCancellationRequested) { }
    }
}
// Configure container ports and a graceful termination budget in the hosting manifest.`,
  `using var stop = new CancellationTokenSource();
stop.Cancel();
bool observed = false;
try { await Task.Delay(100, stop.Token); }
catch (OperationCanceledException) { observed = true; }
if (!observed) throw new Exception("Cancellation ignored");
Console.WriteLine("All checks passed");`,
  "Worker stopped safely",
  {
    tryRequest:
      "GET /ready returns Ready after startup; stopping the host cancels the worker",
  },
);

export function enhanceBackendEngineering(lesson, original) {
  const part = lessons[lesson.topic];
  if (!part)
    throw new Error("Missing Backend Engineering .NET lesson: " + lesson.topic);
  return {
    ...original,
    en: part.en + " " + original.en,
    bn: part.bn + " " + original.bn,
    beginnerDotNet: true,
    extraSections: [
      {
        id: "easy-story",
        title: "A tiny tea-shop story · অতি সহজ তুলনা",
        en: part.storyEn,
        bn: part.storyBn,
      },
      {
        id: "dotnet-steps",
        title: "Follow the C# flow · C#-এর ধাপ ধরে পড়ুন",
        en: "Read these four steps before the larger program. The console example isolates the idea; the ASP.NET Core example puts it behind HTTP. The exercise checks one important rule without starting a server.",
        bn: "বড় program-এর আগে এই চার ধাপ পড়ুন। Console উদাহরণে ধারণাটি আলাদা, ASP.NET Core-তে HTTP-এর পিছনে সেই কাজ। Exercise server ছাড়াই একটি দরকারি rule পরীক্ষা করে।",
        steps: part.steps,
      },
    ],
    examples: [...part.examples, ...original.examples],
  };
}
export default lessons;
