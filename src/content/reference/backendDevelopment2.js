// Backend Development module, lessons 11-20: extra story, theory, steps,
// mistakes and runnable examples (English + Bangla).
import { consoleEx, webEx } from "./aspnetHelpers";

export const moreBackendDevelopment = {
  "Database Indexing": {
    storyEn:
      "Finding 'Rahman' in a 900-page book without an index means reading every page. The index at the back is sorted, so you jump straight to page 612. A database index is that sorted list for a column.",
    storyBn:
      "সূচি ছাড়া ৯০০ পাতার বইয়ে 'Rahman' খুঁজতে প্রতিটি পাতা পড়তে হয়। পেছনের সূচি সাজানো, তাই সরাসরি ৬১২ পাতায় যাওয়া যায়। Database index হলো কোনো column-এর সেই সাজানো তালিকা।",
    theoryEn:
      "Without an index the database scans every row (O(n)). A B-tree index keeps column values sorted with pointers to rows, so lookups, range filters and ORDER BY become O(log n). The trade-off: every INSERT/UPDATE must also update the index, and indexes use disk. Index columns you filter or join on often; a composite index (Status, CreatedAt) helps queries that filter by the first column.",
    theoryBn:
      "Index না থাকলে database প্রতিটি row scan করে (O(n))। B-tree index column-এর মান সাজিয়ে row-এর pointer রাখে, ফলে খোঁজা, range filter ও ORDER BY হয় O(log n)। বিনিময়: প্রতিটি INSERT/UPDATE-এ index-ও বদলাতে হয়, আর disk লাগে। যে column দিয়ে প্রায়ই filter বা join হয় সেগুলোতে index দিন; composite index (Status, CreatedAt) প্রথম column দিয়ে filter করা query-তে কাজে লাগে।",
    steps: [
      ["Find slow queries (logs, EXPLAIN / execution plan).", "ধীর query খুঁজুন (log, EXPLAIN বা execution plan)।"],
      ["Add HasIndex for columns in WHERE, JOIN and ORDER BY.", "WHERE, JOIN ও ORDER BY-এর column-এ HasIndex দিন।"],
      ["Use IsUnique for natural keys such as Email.", "Email-এর মতো স্বাভাবিক key-তে IsUnique দিন।"],
      ["Measure again; drop indexes nobody uses.", "আবার মাপুন; অব্যবহৃত index সরান।"],
    ],
    mistakesEn:
      "Indexing every column, wrapping the indexed column in a function (WHERE LOWER(Email) = ...) so the index cannot be used, wrong column order in composite indexes, and leading wildcards (LIKE '%rahman').",
    mistakesBn:
      "প্রতিটি column-এ index, index-করা column-কে function-এ মোড়া (WHERE LOWER(Email) = ...) ফলে index ব্যবহার হয় না, composite index-এ ভুল column ক্রম, আর শুরুতে wildcard (LIKE '%rahman')।",
    examples: [
      consoleEx(
        "Scan vs index, counted · scan বনাম index",
        `var emails = Enumerable.Range(1, 1_000_000).Select(i => $"user{i}@mail.com").ToList();
var index = emails.Select((e, i) => (e, i)).OrderBy(x => x.e, StringComparer.Ordinal).ToList();

int scanSteps = 0;
foreach (var e in emails) { scanSteps++; if (e == "user999999@mail.com") break; }

int lo = 0, hi = index.Count - 1, treeSteps = 0;
while (lo <= hi)
{
    treeSteps++;
    int mid = (lo + hi) / 2;
    int cmp = string.CompareOrdinal(index[mid].e, "user999999@mail.com");
    if (cmp == 0) break;
    if (cmp < 0) lo = mid + 1; else hi = mid - 1;
}
Console.WriteLine($"Full scan steps: {scanSteps}");
Console.WriteLine($"Index steps: {treeSteps} (log2 of 1,000,000 is about 20)");`,
        "Full scan steps: 999999\nIndex steps: 19 (log2 of 1,000,000 is about 20)",
      ),
      webEx(
        "Indexes in EF Core + query plan · EF Core-এ index",
        `using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ShopDb>(o => o.UseSqlite("Data Source=index.db"));
var app = builder.Build();
using (var s = app.Services.CreateScope())
{
    var db = s.ServiceProvider.GetRequiredService<ShopDb>();
    if (db.Database.EnsureCreated())
    {
        db.Orders.AddRange(Enumerable.Range(1, 5000).Select(i => new Order { Email = $"c{i}@mail.com", Status = i % 3 == 0 ? "Paid" : "New", CreatedAt = DateTime.UtcNow.AddMinutes(-i) }));
        db.SaveChanges();
    }
}
app.MapGet("/plan", async (ShopDb db) =>
{
    var conn = db.Database.GetDbConnection();
    await conn.OpenAsync();
    using var cmd = conn.CreateCommand();
    cmd.CommandText = "EXPLAIN QUERY PLAN SELECT * FROM Orders WHERE Status = 'Paid' ORDER BY CreatedAt DESC";
    using var r = await cmd.ExecuteReaderAsync();
    var lines = new List<string>();
    while (await r.ReadAsync()) lines.Add(r.GetString(3));
    return lines;      // shows: SEARCH Orders USING INDEX IX_Orders_Status_CreatedAt
});
app.Run();

public class Order { public int Id { get; set; } public string Email { get; set; } = ""; public string Status { get; set; } = ""; public DateTime CreatedAt { get; set; } }
public class ShopDb(DbContextOptions<ShopDb> o) : DbContext(o)
{
    public DbSet<Order> Orders => Set<Order>();
    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Order>().HasIndex(x => x.Email).IsUnique();
        b.Entity<Order>().HasIndex(x => new { x.Status, x.CreatedAt });
    }
}`,
        "curl -k https://localhost:5001/plan",
        ["Microsoft.EntityFrameworkCore.Sqlite"],
      ),
    ],
  },

  "Transactions and ACID": {
    storyEn:
      "Sending money with bKash: your balance goes down and your friend's goes up. If the app crashed in the middle and only the first half happened, money would vanish. A transaction promises both happen, or neither.",
    storyBn:
      "bKash-এ টাকা পাঠালে আপনার balance কমে, বন্ধুর বাড়ে। মাঝপথে app crash করে শুধু প্রথম অর্ধেক হলে টাকা উধাও হয়ে যেত। Transaction প্রতিশ্রুতি দেয়: দুটোই হবে, নয়তো কোনোটাই না।",
    theoryEn:
      "ACID: Atomic (all or nothing), Consistent (rules like 'balance >= 0' always hold), Isolated (concurrent transactions do not see each other's half-done work), Durable (once committed, it survives a crash). EF Core wraps a single SaveChangesAsync in a transaction automatically; for several saves use BeginTransactionAsync, then CommitAsync, and roll back on error. Use optimistic concurrency (a RowVersion) to stop two users overwriting each other.",
    theoryBn:
      "ACID: Atomic (সব বা কিছুই না), Consistent ('balance >= 0'-এর মতো নিয়ম সবসময় ঠিক), Isolated (একসাথে চলা transaction একে অপরের অর্ধেক কাজ দেখে না), Durable (commit হলে crash-এও টিকে থাকে)। EF Core একটি SaveChangesAsync-কে নিজে transaction-এ মোড়ে; একাধিক save-এ BeginTransactionAsync, তারপর CommitAsync, ভুলে rollback। দুই user যেন একে অপরের লেখা মুছে না দেয়, তার জন্য optimistic concurrency (RowVersion)।",
    steps: [
      ["Group the changes that must succeed together.", "যে পরিবর্তনগুলো একসাথে সফল হতে হবে সেগুলো একত্র করুন।"],
      ["Use one SaveChangesAsync, or BeginTransactionAsync for several.", "একটি SaveChangesAsync, বা একাধিকের জন্য BeginTransactionAsync।"],
      ["Validate business rules before committing.", "Commit-এর আগে business rule যাচাই করুন।"],
      ["Add a concurrency token and handle DbUpdateConcurrencyException.", "Concurrency token দিয়ে DbUpdateConcurrencyException সামলান।"],
    ],
    mistakesEn:
      "Calling an external API (payment, email) inside a long database transaction, holding a transaction open while waiting for user input, catching exceptions and still committing, and ignoring concurrent edits.",
    mistakesBn:
      "লম্বা database transaction-এর ভেতরে বাইরের API (payment, email) ডাকা, user input-এর অপেক্ষায় transaction খোলা রাখা, exception ধরে তবুও commit, আর একসাথে edit উপেক্ষা করা।",
    examples: [
      consoleEx(
        "All or nothing with a real transaction · আসল transaction",
        `using Microsoft.Data.Sqlite;

using var c = new SqliteConnection("Data Source=:memory:");
c.Open();
Exec("CREATE TABLE Accounts(Name TEXT PRIMARY KEY, Balance INT CHECK(Balance >= 0)); INSERT INTO Accounts VALUES('Asha',500),('Rafi',100);");

void Exec(string sql, SqliteTransaction? t = null) { using var cmd = c.CreateCommand(); cmd.Transaction = t; cmd.CommandText = sql; cmd.ExecuteNonQuery(); }
string Balances() { using var cmd = c.CreateCommand(); cmd.CommandText = "SELECT group_concat(Name || '=' || Balance, ' ') FROM Accounts"; return (string)cmd.ExecuteScalar()!; }

void Transfer(int amount)
{
    using var t = c.BeginTransaction();
    try
    {
        Exec($"UPDATE Accounts SET Balance = Balance + {amount} WHERE Name='Rafi'", t);
        Exec($"UPDATE Accounts SET Balance = Balance - {amount} WHERE Name='Asha'", t);   // CHECK may fail
        t.Commit();
        Console.WriteLine($"Sent {amount}: {Balances()}");
    }
    catch (SqliteException)
    {
        t.Rollback();
        Console.WriteLine($"Failed {amount}, rolled back: {Balances()}");
    }
}
Transfer(200);
Transfer(900);`,
        "Sent 200: Asha=300 Rafi=300\nFailed 900, rolled back: Asha=300 Rafi=300",
        ["Microsoft.Data.Sqlite"],
      ),
      webEx(
        "Transfer endpoint with EF Core transaction · EF Core transaction",
        `using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<BankDb>(o => o.UseSqlite("Data Source=bank.db"));
var app = builder.Build();
using (var s = app.Services.CreateScope())
{
    var db = s.ServiceProvider.GetRequiredService<BankDb>();
    if (db.Database.EnsureCreated()) { db.Accounts.AddRange(new Account { Name = "Asha", Balance = 500 }, new Account { Name = "Rafi", Balance = 100 }); db.SaveChanges(); }
}

app.MapPost("/transfer", async (TransferDto t, BankDb db) =>
{
    if (t.Amount <= 0) return Results.BadRequest("Amount must be positive");
    await using var tx = await db.Database.BeginTransactionAsync();
    var from = await db.Accounts.SingleOrDefaultAsync(a => a.Name == t.From);
    var to = await db.Accounts.SingleOrDefaultAsync(a => a.Name == t.To);
    if (from is null || to is null) return Results.NotFound();
    if (from.Balance < t.Amount) return Results.Conflict("Insufficient balance");   // tx disposed -> rolled back
    from.Balance -= t.Amount;
    to.Balance += t.Amount;
    await db.SaveChangesAsync();
    await tx.CommitAsync();
    return Results.Ok(new { from = from.Balance, to = to.Balance });
});
app.MapGet("/accounts", async (BankDb db) => await db.Accounts.ToListAsync());
app.Run();

public record TransferDto(string From, string To, decimal Amount);
public class Account { public int Id { get; set; } public string Name { get; set; } = ""; public decimal Balance { get; set; } }
public class BankDb(DbContextOptions<BankDb> o) : DbContext(o) { public DbSet<Account> Accounts => Set<Account>(); }`,
        'curl -k -X POST https://localhost:5001/transfer -H "Content-Type: application/json" -d "{\\"from\\":\\"Asha\\",\\"to\\":\\"Rafi\\",\\"amount\\":200}"\ncurl -k -i -X POST https://localhost:5001/transfer -H "Content-Type: application/json" -d "{\\"from\\":\\"Asha\\",\\"to\\":\\"Rafi\\",\\"amount\\":5000}"   # 409, nothing changed',
        ["Microsoft.EntityFrameworkCore.Sqlite"],
      ),
    ],
  },

  "File Uploads to S3": {
    storyEn:
      "A tailor does not keep customers' cloth in the shop's tiny drawer; he sends it to a big warehouse and writes only the shelf number in his order book. Your database is the order book; S3 (or Azure Blob) is the warehouse.",
    storyBn:
      "দর্জি ক্রেতার কাপড় দোকানের ছোট ড্রয়ারে রাখেন না; বড় গুদামে পাঠিয়ে খাতায় শুধু তাকের নম্বর লেখেন। Database হলো সেই খাতা; S3 (বা Azure Blob) হলো গুদাম।",
    theoryEn:
      "Files do not belong in database rows or the web server's disk (servers are replaced and scaled out). Store them in object storage and save only the key and metadata in the database. Validate size, extension and content type; generate your own random file name; never trust the client's name. For large files, let the browser upload directly with a short-lived pre-signed URL so your API does not carry the bytes.",
    theoryBn:
      "File database row-এ বা web server-এর disk-এ রাখা উচিত নয় (server বদলায় ও বাড়ে)। Object storage-এ রেখে database-এ শুধু key ও metadata রাখুন। আকার, extension ও content type যাচাই করুন; নিজের random file নাম দিন; client-এর নাম বিশ্বাস করবেন না। বড় file-এ ছোট মেয়াদের pre-signed URL দিয়ে browser সরাসরি upload করুক, যাতে API-কে byte বহন করতে না হয়।",
    steps: [
      ["Accept IFormFile and check length and extension.", "IFormFile নিন, আকার ও extension যাচাই করুন।"],
      ["Create a random key like uploads/2026/11/<guid>.png.", "uploads/2026/11/<guid>.png-এর মতো random key বানান।"],
      ["PutObject to S3 (or save locally while learning).", "S3-এ PutObject করুন (শেখার সময় local-এ রাখুন)।"],
      ["Store key, size and owner in the database; serve via pre-signed URL.", "Database-এ key, আকার ও মালিক রাখুন; pre-signed URL দিয়ে দিন।"],
    ],
    mistakesEn:
      "Using the uploaded file name as the path (path traversal), no size limit, public buckets, committing AWS keys, and reading the whole file into memory for big uploads.",
    mistakesBn:
      "Upload-এর file নামকে path হিসেবে ব্যবহার (path traversal), আকারের সীমা না রাখা, public bucket, AWS key commit করা, আর বড় upload পুরোটা memory-তে পড়া।",
    examples: [
      consoleEx(
        "Safe file names and checks · নিরাপদ file নাম ও যাচাই",
        `var allowed = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { ".png", ".jpg", ".pdf" };
const long MaxBytes = 2 * 1024 * 1024;

string Check(string clientName, long size)
{
    var ext = Path.GetExtension(clientName);
    if (!allowed.Contains(ext)) return $"{clientName}: rejected (type {ext})";
    if (size > MaxBytes) return $"{clientName}: rejected (too large)";
    var key = $"uploads/2026/11/{Guid.Empty.ToString()[..8]}{ext.ToLowerInvariant()}";   // use Guid.NewGuid() in real code
    return $"{clientName}: ok -> {key}";
}
Console.WriteLine(Check("photo.PNG", 300_000));
Console.WriteLine(Check("../../etc/passwd", 10));
Console.WriteLine(Check("movie.mp4", 50_000_000));
Console.WriteLine(Check("cv.pdf", 5_000_000));`,
        "photo.PNG: ok -> uploads/2026/11/00000000.png\n../../etc/passwd: rejected (type )\nmovie.mp4: rejected (type .mp4)\ncv.pdf: rejected (too large)",
      ),
      webEx(
        "Upload API with an S3 or local store · S3 বা local store",
        `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<IFileStore, LocalFileStore>();   // swap for an S3FileStore using AWSSDK.S3 PutObjectAsync
var app = builder.Build();
var allowed = new[] { ".png", ".jpg", ".pdf" };

app.MapPost("/files", async (IFormFile file, IFileStore store) =>
{
    var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
    if (!allowed.Contains(ext)) return Results.BadRequest("Only png, jpg, pdf");
    if (file.Length is 0 or > 2 * 1024 * 1024) return Results.BadRequest("1 byte to 2 MB only");
    var key = $"uploads/{DateTime.UtcNow:yyyy/MM}/{Guid.NewGuid()}{ext}";
    await using var stream = file.OpenReadStream();
    await store.SaveAsync(key, stream, file.ContentType);
    return Results.Created($"/files/{key}", new { key, file.Length, file.ContentType });
}).DisableAntiforgery();

app.MapGet("/files/{**key}", (string key, IFileStore store) => store.Open(key) is { } s ? Results.Stream(s) : Results.NotFound());
app.Run();

public interface IFileStore { Task SaveAsync(string key, Stream data, string contentType); Stream? Open(string key); }

public class LocalFileStore : IFileStore
{
    private readonly string root = Path.Combine(AppContext.BaseDirectory, "storage");
    private string PathFor(string key) => Path.Combine(root, key.Replace('/', Path.DirectorySeparatorChar));
    public async Task SaveAsync(string key, Stream data, string contentType)
    {
        Directory.CreateDirectory(Path.GetDirectoryName(PathFor(key))!);
        await using var f = File.Create(PathFor(key));
        await data.CopyToAsync(f);
    }
    public Stream? Open(string key) => key.Contains("..") || !File.Exists(PathFor(key)) ? null : File.OpenRead(PathFor(key));
}

// S3 version (AWSSDK.S3): await s3.PutObjectAsync(new PutObjectRequest { BucketName = "my-bucket", Key = key, InputStream = data, ContentType = contentType });
// Download link: s3.GetPreSignedURL(new GetPreSignedUrlRequest { BucketName = "my-bucket", Key = key, Expires = DateTime.UtcNow.AddMinutes(10) });`,
        'curl -k -F "file=@photo.png" https://localhost:5001/files\ncurl -k -o copy.png https://localhost:5001/files/uploads/<year>/<month>/<guid>.png',
      ),
    ],
  },

  "Unit and Integration Tests": {
    storyEn:
      "A car factory tests each brake on a bench (unit test) and then drives the finished car around the track (integration test). Bench tests are fast and pinpoint the broken part; the track proves the parts work together.",
    storyBn:
      "গাড়ির কারখানা প্রতিটি brake আলাদা টেবিলে পরীক্ষা করে (unit test), তারপর পুরো গাড়ি ট্র্যাকে চালায় (integration test)। টেবিলের পরীক্ষা দ্রুত ও ঠিক কোন অংশ ভাঙা দেখায়; ট্র্যাক প্রমাণ করে অংশগুলো একসাথে কাজ করে।",
    theoryEn:
      "A unit test checks one class in isolation with fake dependencies, follows Arrange-Act-Assert, and runs in milliseconds. An integration test starts the real ASP.NET Core pipeline in memory with WebApplicationFactory and sends real HTTP requests, often against an in-memory SQLite or a test container. Aim for many unit tests, fewer integration tests, and test both the happy path and the failures (400, 404, 403).",
    theoryBn:
      "Unit test একটি class-কে fake dependency দিয়ে আলাদাভাবে পরীক্ষা করে, Arrange-Act-Assert মানে, millisecond-এ চলে। Integration test WebApplicationFactory দিয়ে আসল ASP.NET Core pipeline memory-তে চালু করে আসল HTTP request পাঠায়, প্রায়ই in-memory SQLite বা test container-এ। অনেক unit test, কম integration test রাখুন, এবং সফল পথ ও ব্যর্থতা (400, 404, 403) দুটোই পরীক্ষা করুন।",
    steps: [
      ["dotnet new xunit -n Shop.Tests and reference the API project.", "dotnet new xunit -n Shop.Tests বানিয়ে API project reference দিন।"],
      ["Write unit tests for services with fake repositories.", "Fake repository দিয়ে service-এর unit test লিখুন।"],
      ["Add Microsoft.AspNetCore.Mvc.Testing for WebApplicationFactory.", "WebApplicationFactory-এর জন্য Microsoft.AspNetCore.Mvc.Testing দিন।"],
      ["Run dotnet test locally and in CI on every push.", "Local-এ ও প্রতি push-এ CI-তে dotnet test চালান।"],
    ],
    mistakesEn:
      "Tests that depend on each other's order, hitting real external services, asserting on too much (brittle tests), only testing happy paths, and forgetting public partial class Program for WebApplicationFactory with top-level statements.",
    mistakesBn:
      "একে অপরের ক্রমের উপর নির্ভরশীল test, আসল বাইরের service ডাকা, খুব বেশি জিনিস assert করা (ভঙ্গুর test), শুধু সফল পথ পরীক্ষা, আর top-level statement-এ WebApplicationFactory-র জন্য public partial class Program ভুলে যাওয়া।",
    examples: [
      consoleEx(
        "Arrange, Act, Assert without a framework · framework ছাড়া AAA",
        `int passed = 0, failed = 0;
void Test(string name, Action body)
{
    try { body(); passed++; Console.WriteLine($"PASS {name}"); }
    catch (Exception e) { failed++; Console.WriteLine($"FAIL {name}: {e.Message}"); }
}
void Equal<T>(T expected, T actual) { if (!Equals(expected, actual)) throw new Exception($"expected {expected}, got {actual}"); }

Test("discount 10% on 1000", () => { var calc = new PriceCalculator(); var total = calc.Total(1000m, 10); Equal(900m, total); });
Test("negative price rejected", () =>
{
    try { new PriceCalculator().Total(-1m, 0); throw new Exception("no exception"); }
    catch (ArgumentOutOfRangeException) { }
});
Test("discount capped at 50%", () => Equal(500m, new PriceCalculator().Total(1000m, 80)));
Console.WriteLine($"{passed} passed, {failed} failed");

public class PriceCalculator
{
    public decimal Total(decimal price, int discountPercent)
    {
        if (price < 0) throw new ArgumentOutOfRangeException(nameof(price));
        var d = Math.Min(discountPercent, 50);
        return price - price * d / 100;
    }
}`,
        "PASS discount 10% on 1000\nPASS negative price rejected\nPASS discount capped at 50%\n3 passed, 0 failed",
      ),
      {
        title: "xUnit unit + integration tests · xUnit test",
        kind: "Test project (reference)",
        language: "csharp",
        setupEn:
          "Create the test project next to the API: dotnet new xunit -n Shop.Tests, dotnet add Shop.Tests reference Shop.Api, dotnet add Shop.Tests package Microsoft.AspNetCore.Mvc.Testing, then dotnet test. Add 'public partial class Program { }' at the end of the API's Program.cs.",
        setupBn:
          "API-র পাশে test project বানান: dotnet new xunit -n Shop.Tests, dotnet add Shop.Tests reference Shop.Api, dotnet add Shop.Tests package Microsoft.AspNetCore.Mvc.Testing, তারপর dotnet test। API-র Program.cs-এর শেষে 'public partial class Program { }' দিন।",
        commands:
          "dotnet new xunit -n Shop.Tests\ndotnet add Shop.Tests reference Shop.Api\ndotnet add Shop.Tests package Microsoft.AspNetCore.Mvc.Testing\ndotnet test",
        code: `using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

public class PriceCalculatorTests
{
    [Theory]
    [InlineData(1000, 10, 900)]
    [InlineData(1000, 80, 500)]   // capped at 50%
    public void Total_applies_capped_discount(decimal price, int percent, decimal expected)
    {
        var calc = new PriceCalculator();                 // Arrange
        var total = calc.Total(price, percent);            // Act
        Assert.Equal(expected, total);                     // Assert
    }
}

public class BooksApiTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task Get_unknown_book_returns_404()
    {
        var client = factory.CreateClient();
        var response = await client.GetAsync("/api/books/999");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Post_then_get_returns_the_book()
    {
        var client = factory.CreateClient();
        var created = await client.PostAsJsonAsync("/api/books", new { title = "Testing", price = 100 });
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        var again = await client.GetAsync(created.Headers.Location);
        Assert.Equal(HttpStatusCode.OK, again.StatusCode);
    }
}`,
      },
    ],
  },

  "Caching with Redis": {
    storyEn:
      "A tea stall keeps a flask of ready tea. Most customers get a cup from the flask in seconds; only when it is empty does the owner brew a new pot. The flask is the cache, the kitchen is the database, and the flask is refilled every 10 minutes so the tea never gets too old.",
    storyBn:
      "চায়ের দোকানে এক ফ্লাস্ক তৈরি চা থাকে। বেশিরভাগ ক্রেতা কয়েক সেকেন্ডে ফ্লাস্ক থেকে চা পান; ফ্লাস্ক খালি হলেই দোকানি নতুন চা বানান। ফ্লাস্ক হলো cache, রান্নাঘর হলো database, আর চা যেন বেশি পুরনো না হয় তাই প্রতি ১০ মিনিটে ফ্লাস্ক ভরা হয়।",
    theoryEn:
      "Cache-aside: look in the cache first; on a miss, load from the database, store it with an expiry (TTL), and return it. When data changes, remove the cache entry. IMemoryCache lives inside one server; Redis (IDistributedCache or HybridCache) is shared by all servers and survives restarts of your app. Cache data that is read often and changes rarely, and always set an expiry.",
    theoryBn:
      "Cache-aside: আগে cache-এ দেখুন; না পেলে database থেকে এনে মেয়াদসহ (TTL) cache-এ রেখে ফেরত দিন। Data বদলালে cache entry মুছুন। IMemoryCache একটি server-এর ভেতরে থাকে; Redis (IDistributedCache বা HybridCache) সব server ভাগ করে এবং app restart-এও থাকে। যা প্রায়ই পড়া হয় কিন্তু কম বদলায় তা cache করুন, এবং সবসময় মেয়াদ দিন।",
    steps: [
      ["Pick data that is read often and changes rarely.", "প্রায়ই পড়া হয় কিন্তু কম বদলায় এমন data বাছুন।"],
      ["Implement get-or-create with a TTL.", "TTL সহ get-or-create বানান।"],
      ["Invalidate (remove) the key when the data is updated.", "Data আপডেট হলে key মুছে দিন।"],
      ["Move from IMemoryCache to Redis when you run several servers.", "একাধিক server হলে IMemoryCache থেকে Redis-এ যান।"],
    ],
    mistakesEn:
      "No expiry (stale data forever), forgetting to invalidate after updates, caching per-user private data under a shared key, and cache stampede (thousands of misses at once hitting the database).",
    mistakesBn:
      "মেয়াদ না দেওয়া (চিরকাল পুরনো data), আপডেটের পর invalidate ভুলে যাওয়া, এক user-এর ব্যক্তিগত data সবার key-তে cache করা, আর cache stampede (একসাথে হাজারো miss database-এ আঘাত)।",
    examples: [
      consoleEx(
        "Cache-aside with hits and misses · hit ও miss",
        `using Microsoft.Extensions.Caching.Memory;

var cache = new MemoryCache(new MemoryCacheOptions());
int dbCalls = 0;
string LoadFromDb(int id) { dbCalls++; return $"Product {id}"; }

string Get(int id) => cache.GetOrCreate($"product:{id}", e =>
{
    e.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);
    return LoadFromDb(id);
})!;

foreach (var id in new[] { 1, 1, 2, 1, 2, 2 }) Get(id);
Console.WriteLine($"6 reads, {dbCalls} database calls");
cache.Remove("product:1");                 // product 1 was updated
Get(1);
Console.WriteLine($"After invalidation: {dbCalls} database calls");`,
        "6 reads, 2 database calls\nAfter invalidation: 3 database calls",
        ["Microsoft.Extensions.Caching.Memory"],
      ),
      webEx(
        "Redis-backed cache with HybridCache · Redis cache",
        `using Microsoft.Extensions.Caching.Hybrid;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddStackExchangeRedisCache(o => o.Configuration = builder.Configuration["Redis"] ?? "localhost:6379");
builder.Services.AddHybridCache(o => o.DefaultEntryOptions = new() { Expiration = TimeSpan.FromMinutes(10), LocalCacheExpiration = TimeSpan.FromMinutes(1) });
var app = builder.Build();
var products = new Dictionary<int, string> { [1] = "Tea", [2] = "Coffee" };

app.MapGet("/products/{id:int}", async (int id, HybridCache cache) =>
{
    var name = await cache.GetOrCreateAsync($"product:{id}", async ct =>
    {
        await Task.Delay(500, ct);                      // pretend slow database
        return products.GetValueOrDefault(id);
    });
    return name is null ? Results.NotFound() : Results.Ok(new { id, name });
});

app.MapPut("/products/{id:int}", async (int id, string name, HybridCache cache) =>
{
    products[id] = name;
    await cache.RemoveAsync($"product:{id}");           // invalidate after update
    return Results.NoContent();
});
app.Run();`,
        'docker run -d -p 6379:6379 redis\ntime curl -k https://localhost:5001/products/1   # ~500 ms (miss)\ntime curl -k https://localhost:5001/products/1   # a few ms (hit)\ncurl -k -X PUT "https://localhost:5001/products/1?name=Green%20Tea"',
        ["Microsoft.Extensions.Caching.StackExchangeRedis", "Microsoft.Extensions.Caching.Hybrid"],
      ),
    ],
  },

  "Rate Limiting": {
    storyEn:
      "A ration shop gives each card holder 5 kg of rice per week. Without that rule, one person could take the whole stock and others go hungry. Rate limiting gives each client a fair share of your API.",
    storyBn:
      "রেশন দোকান প্রতি কার্ডধারীকে সপ্তাহে ৫ কেজি চাল দেয়। এই নিয়ম না থাকলে একজনই পুরো মজুদ নিয়ে যেতে পারত, বাকিরা না খেয়ে থাকত। Rate limiting প্রতিটি client-কে API-র ন্যায্য ভাগ দেয়।",
    theoryEn:
      "A rate limiter counts requests per key (IP, user id, API key) in a time window and answers 429 Too Many Requests when the limit is passed, ideally with a Retry-After header. Algorithms: fixed window (simple), sliding window (smoother), token bucket (allows short bursts). ASP.NET Core has AddRateLimiter built in. Protect login and expensive endpoints more strictly.",
    theoryBn:
      "Rate limiter একটি সময়-জানালায় প্রতি key (IP, user id, API key) অনুযায়ী request গোনে, সীমা পেরোলে 429 Too Many Requests দেয়, সাথে Retry-After header ভালো। Algorithm: fixed window (সহজ), sliding window (মসৃণ), token bucket (ছোট burst চলে)। ASP.NET Core-এ AddRateLimiter built-in আছে। Login ও ব্যয়বহুল endpoint আরও কঠোরভাবে রক্ষা করুন।",
    steps: [
      ["Choose the partition key: user id when logged in, else IP.", "Partition key বাছুন: login থাকলে user id, নইলে IP।"],
      ["Pick an algorithm and limits per policy.", "প্রতি policy-তে algorithm ও সীমা বাছুন।"],
      ["Set RejectionStatusCode = 429 and add Retry-After.", "RejectionStatusCode = 429 দিন, Retry-After যোগ করুন।"],
      ["Apply RequireRateLimiting to endpoints.", "Endpoint-এ RequireRateLimiting দিন।"],
    ],
    mistakesEn:
      "Limiting only per server instance when you have many (use a shared store or gateway), one global limit for everyone, returning 500 instead of 429, and limiting by IP for users behind one office NAT.",
    mistakesBn:
      "অনেক server থাকলে শুধু প্রতি instance-এ সীমা (shared store বা gateway ব্যবহার করুন), সবার জন্য একটি global সীমা, 429-এর বদলে 500, আর এক অফিস NAT-এর পিছনের user-দের IP দিয়ে সীমা।",
    examples: [
      consoleEx(
        "Token bucket by hand · হাতে token bucket",
        `var bucket = new TokenBucket(capacity: 3, refillPerSecond: 1);
var t = 0.0;
foreach (var at in new[] { 0.0, 0.1, 0.2, 0.3, 1.4, 1.5 })
{
    t = at;
    Console.WriteLine($"t={at:0.0}s -> {(bucket.TryTake(t) ? "200" : "429")}");
}

public class TokenBucket(int capacity, double refillPerSecond)
{
    private double tokens = capacity, last = 0;
    public bool TryTake(double now)
    {
        tokens = Math.Min(capacity, tokens + (now - last) * refillPerSecond);
        last = now;
        if (tokens < 1) return false;
        tokens -= 1;
        return true;
    }
}`,
        "t=0.0s -> 200\nt=0.1s -> 200\nt=0.2s -> 200\nt=0.3s -> 429\nt=1.4s -> 200\nt=1.5s -> 429",
      ),
      webEx(
        "Built-in rate limiter with per-user policy · built-in rate limiter",
        `using System.Security.Claims;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    o.OnRejected = (ctx, _) =>
    {
        ctx.HttpContext.Response.Headers.RetryAfter = "10";
        return ValueTask.CompletedTask;
    };
    o.AddPolicy("per-user", http => RateLimitPartition.GetFixedWindowLimiter(
        http.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? http.Connection.RemoteIpAddress?.ToString() ?? "anon",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 5, Window = TimeSpan.FromSeconds(10) }));
    o.AddPolicy("login", http => RateLimitPartition.GetSlidingWindowLimiter(
        http.Connection.RemoteIpAddress?.ToString() ?? "anon",
        _ => new SlidingWindowRateLimiterOptions { PermitLimit = 3, Window = TimeSpan.FromMinutes(1), SegmentsPerWindow = 3 }));
});
var app = builder.Build();
app.UseRateLimiter();

app.MapGet("/api/search", (string q) => new { q, results = 3 }).RequireRateLimiting("per-user");
app.MapPost("/login", () => Results.Unauthorized()).RequireRateLimiting("login");
app.Run();`,
        'for i in 1 2 3 4 5 6 7; do curl -k -s -o /dev/null -w "%{http_code} " "https://localhost:5001/api/search?q=tea"; done\n# 200 200 200 200 200 429 429',
      ),
    ],
  },

  "WebSockets": {
    storyEn:
      "Normal HTTP is like sending letters: you ask, they reply, the envelope is closed. A WebSocket is a phone call: once connected, both sides can speak at any moment until someone hangs up. Perfect for chat, live scores and notifications.",
    storyBn:
      "সাধারণ HTTP চিঠি পাঠানোর মতো: আপনি জিজ্ঞেস করেন, তারা উত্তর দেয়, খাম বন্ধ। WebSocket হলো ফোন কল: একবার সংযোগ হলে কেউ ফোন না রাখা পর্যন্ত দুই পক্ষ যেকোনো সময় কথা বলতে পারে। Chat, live score ও notification-এর জন্য আদর্শ।",
    theoryEn:
      "A WebSocket starts as an HTTP request with Upgrade: websocket; the server answers 101 Switching Protocols and the same TCP connection stays open for two-way messages. In ASP.NET Core call app.UseWebSockets() and AcceptWebSocketAsync(). For real apps, SignalR adds reconnection, groups, fallbacks and scale-out with Redis, so you usually use SignalR rather than raw sockets.",
    theoryBn:
      "WebSocket শুরু হয় Upgrade: websocket সহ একটি HTTP request দিয়ে; server 101 Switching Protocols দেয় এবং একই TCP connection দুই দিকের বার্তার জন্য খোলা থাকে। ASP.NET Core-এ app.UseWebSockets() ও AcceptWebSocketAsync() ডাকুন। আসল app-এ SignalR reconnection, group, fallback ও Redis দিয়ে scale-out দেয়, তাই সাধারণত কাঁচা socket নয়, SignalR ব্যবহার করা হয়।",
    steps: [
      ["Enable app.UseWebSockets().", "app.UseWebSockets() চালু করুন।"],
      ["Accept the socket on a /ws endpoint.", "/ws endpoint-এ socket accept করুন।"],
      ["Loop: receive a message, then send a reply or broadcast.", "Loop: বার্তা নিন, তারপর উত্তর বা broadcast পাঠান।"],
      ["Move to SignalR for groups, auth and reconnection.", "Group, auth ও reconnection-এর জন্য SignalR-এ যান।"],
    ],
    mistakesEn:
      "Opening a socket for data that changes once an hour (just poll), no authentication on the hub, not handling disconnects, and keeping connection lists in memory when you run several servers.",
    mistakesBn:
      "ঘণ্টায় একবার বদলায় এমন data-র জন্য socket খোলা (poll যথেষ্ট), hub-এ authentication না রাখা, disconnect না সামলানো, আর একাধিক server-এ connection তালিকা memory-তে রাখা।",
    examples: [
      consoleEx(
        "Broadcast to connected clients · সংযুক্ত client-দের broadcast",
        `var room = new ChatRoom();
var asha = room.Join("Asha");
var rafi = room.Join("Rafi");
room.Send("Asha", "Hello!");
room.Leave("Rafi");
room.Send("Asha", "Anyone there?");
Console.WriteLine($"Asha inbox: {string.Join(" | ", asha)}");
Console.WriteLine($"Rafi inbox: {string.Join(" | ", rafi)}");

public class ChatRoom
{
    private readonly Dictionary<string, List<string>> clients = new();
    public List<string> Join(string name) => clients[name] = new List<string>();
    public void Leave(string name) => clients.Remove(name);
    public void Send(string from, string text)
    {
        foreach (var inbox in clients.Values) inbox.Add($"{from}: {text}");
    }
}`,
        "Asha inbox: Asha: Hello! | Asha: Anyone there?\nRafi inbox: Asha: Hello!",
      ),
      webEx(
        "Real-time chat with SignalR · SignalR দিয়ে live chat",
        `using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();
var app = builder.Build();

app.MapHub<ChatHub>("/hubs/chat");
app.MapGet("/", () => Results.Content("""
<!doctype html><html><body>
<input id="m" placeholder="message"><button onclick="send()">Send</button><ul id="log"></ul>
<script src="https://cdn.jsdelivr.net/npm/@microsoft/signalr@8/dist/browser/signalr.min.js"></script>
<script>
  const c = new signalR.HubConnectionBuilder().withUrl("/hubs/chat").withAutomaticReconnect().build();
  c.on("message", (who, text) => { const li = document.createElement("li"); li.textContent = who + ": " + text; log.appendChild(li); });
  c.start();
  function send() { c.invoke("Send", "guest", m.value); m.value = ""; }
</script></body></html>
""", "text/html"));
app.Run();

public class ChatHub : Hub
{
    public Task Send(string user, string text) => Clients.All.SendAsync("message", user, text);
    public override Task OnConnectedAsync() => Clients.Others.SendAsync("message", "system", "someone joined");
}`,
        "# Open https://localhost:5001 in two browser tabs and chat between them",
      ),
    ],
  },

  "Background Jobs": {
    storyEn:
      "At a restaurant the waiter takes your order and immediately says 'coming soon' instead of standing in the kitchen until the food is cooked. The cooking happens in the background; the waiter serves other tables.",
    storyBn:
      "রেস্তোরাঁয় ওয়েটার অর্ডার নিয়ে সাথে সাথে বলেন 'আসছে', রান্না শেষ না হওয়া পর্যন্ত রান্নাঘরে দাঁড়িয়ে থাকেন না। রান্না পিছনে চলে; ওয়েটার অন্য টেবিল সামলান।",
    theoryEn:
      "Slow work (emails, PDF reports, image resizing) should not block the HTTP request. The endpoint records the job and returns 202 Accepted; a BackgroundService reads jobs from a queue (Channel<T> in memory, or a durable queue/database) and processes them. Scheduled work runs on a timer (PeriodicTimer) or with Hangfire/Quartz. Jobs must be safe to retry, and long-running services must honour the cancellation token for graceful shutdown.",
    theoryBn:
      "ধীর কাজ (email, PDF report, ছবি ছোট করা) HTTP request আটকে রাখবে না। Endpoint job লিখে 202 Accepted দেয়; একটি BackgroundService queue থেকে job পড়ে (memory-তে Channel<T>, বা টেকসই queue/database) এবং প্রক্রিয়া করে। নির্ধারিত কাজ timer (PeriodicTimer) বা Hangfire/Quartz দিয়ে চলে। Job বারবার চালালেও নিরাপদ হতে হবে, এবং সুন্দরভাবে বন্ধ হওয়ার জন্য cancellation token মানতে হবে।",
    steps: [
      ["Create a Channel<T> as an in-memory job queue.", "In-memory job queue হিসেবে Channel<T> বানান।"],
      ["Endpoint writes the job and returns 202 with a job id.", "Endpoint job লিখে job id সহ 202 দেয়।"],
      ["A BackgroundService reads and processes jobs.", "একটি BackgroundService job পড়ে প্রক্রিয়া করে।"],
      ["Use Hangfire or a database queue when jobs must survive restarts.", "Restart-এও job টিকতে হলে Hangfire বা database queue।"],
    ],
    mistakesEn:
      "Task.Run fire-and-forget inside a controller (lost on restart, exceptions swallowed), injecting a scoped DbContext straight into a singleton BackgroundService (create a scope instead), and jobs that are not idempotent.",
    mistakesBn:
      "Controller-এ Task.Run দিয়ে ছেড়ে দেওয়া (restart-এ হারায়, exception চাপা পড়ে), singleton BackgroundService-এ সরাসরি scoped DbContext inject (scope বানান), আর idempotent নয় এমন job।",
    examples: [
      consoleEx(
        "Producer and consumer with Channel · Channel দিয়ে producer-consumer",
        `using System.Threading.Channels;

var queue = Channel.CreateUnbounded<string>();
var worker = Task.Run(async () =>
{
    await foreach (var job in queue.Reader.ReadAllAsync())
    {
        await Task.Delay(50);                         // pretend slow work
        Console.WriteLine($"Done: {job}");
    }
});

foreach (var email in new[] { "welcome:asha", "invoice:rafi", "reset:mina" })
{
    await queue.Writer.WriteAsync(email);
    Console.WriteLine($"Accepted: {email}");      // request returns immediately
}
queue.Writer.Complete();
await worker;`,
        "Accepted: welcome:asha\nAccepted: invoice:rafi\nAccepted: reset:mina\nDone: welcome:asha\nDone: invoice:rafi\nDone: reset:mina",
      ),
      webEx(
        "202 Accepted + BackgroundService worker · BackgroundService",
        `using System.Collections.Concurrent;
using System.Threading.Channels;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton(Channel.CreateUnbounded<ReportJob>());
builder.Services.AddSingleton<ConcurrentDictionary<Guid, string>>();
builder.Services.AddHostedService<ReportWorker>();
var app = builder.Build();

app.MapPost("/reports", async (Channel<ReportJob> q, ConcurrentDictionary<Guid, string> status) =>
{
    var job = new ReportJob(Guid.NewGuid(), DateTime.UtcNow);
    status[job.Id] = "queued";
    await q.Writer.WriteAsync(job);
    return Results.Accepted($"/reports/{job.Id}", new { job.Id, state = "queued" });
});
app.MapGet("/reports/{id:guid}", (Guid id, ConcurrentDictionary<Guid, string> status) =>
    status.TryGetValue(id, out var s) ? Results.Ok(new { id, state = s }) : Results.NotFound());
app.Run();

public record ReportJob(Guid Id, DateTime RequestedAt);

public class ReportWorker(Channel<ReportJob> queue, ConcurrentDictionary<Guid, string> status, ILogger<ReportWorker> log) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stop)
    {
        await foreach (var job in queue.Reader.ReadAllAsync(stop))
        {
            status[job.Id] = "running";
            try
            {
                await Task.Delay(TimeSpan.FromSeconds(5), stop);    // build the PDF here
                status[job.Id] = "done";
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                log.LogError(ex, "Report {Id} failed", job.Id);
                status[job.Id] = "failed";
            }
        }
    }
}`,
        "curl -k -i -X POST https://localhost:5001/reports       # 202 + Location\ncurl -k https://localhost:5001/reports/<id>             # queued -> running -> done",
      ),
    ],
  },

  "Message Queues": {
    storyEn:
      "A post box lets you drop a letter even when the post office is closed; the postman collects it later. The sender and the receiver never need to be awake at the same time. A message queue (RabbitMQ, Azure Service Bus, SQS) is that post box for services.",
    storyBn:
      "ডাকবাক্সে পোস্ট অফিস বন্ধ থাকলেও চিঠি ফেলা যায়; ডাকপিয়ন পরে নিয়ে যান। প্রেরক ও প্রাপকের একই সময়ে জেগে থাকার দরকার নেই। Message queue (RabbitMQ, Azure Service Bus, SQS) হলো service-দের সেই ডাকবাক্স।",
    theoryEn:
      "A producer publishes a message (OrderPlaced) to a queue or topic; one or more consumers process it later. This decouples services, absorbs traffic spikes and lets a consumer be down for a while. Delivery is usually at-least-once, so consumers must be idempotent (remember processed message ids). Failed messages are retried and then moved to a dead-letter queue for inspection. Use the outbox pattern so a database change and its message are never out of sync.",
    theoryBn:
      "Producer একটি বার্তা (OrderPlaced) queue বা topic-এ প্রকাশ করে; এক বা একাধিক consumer পরে প্রক্রিয়া করে। এতে service আলাদা থাকে, হঠাৎ ভিড় সামলায়, আর consumer কিছুক্ষণ বন্ধ থাকতে পারে। Delivery সাধারণত at-least-once, তাই consumer idempotent হতে হবে (প্রক্রিয়া করা message id মনে রাখুন)। ব্যর্থ বার্তা পুনরায় চেষ্টা করে dead-letter queue-তে যায়। Outbox pattern ব্যবহার করুন যাতে database পরিবর্তন ও তার বার্তা কখনো অমিল না হয়।",
    steps: [
      ["Define a message contract (record OrderPlaced).", "Message contract বানান (record OrderPlaced)।"],
      ["Publish after the database change commits (outbox).", "Database পরিবর্তন commit হওয়ার পর publish করুন (outbox)।"],
      ["Consume, process idempotently, then acknowledge.", "Consume করে idempotent-ভাবে প্রক্রিয়া, তারপর acknowledge।"],
      ["Configure retries and a dead-letter queue.", "Retry ও dead-letter queue ঠিক করুন।"],
    ],
    mistakesEn:
      "Assuming exactly-once delivery, publishing before the database commit (ghost events), huge messages instead of ids, no dead-letter handling, and consumers that throw forever on a bad message (poison message).",
    mistakesBn:
      "Exactly-once delivery ধরে নেওয়া, database commit-এর আগে publish (ভূতুড়ে event), id-র বদলে বিশাল বার্তা, dead-letter না সামলানো, আর খারাপ বার্তায় চিরকাল exception দেওয়া consumer (poison message)।",
    examples: [
      consoleEx(
        "At-least-once delivery and idempotency · idempotent consumer",
        `var queue = new Queue<Message>(new[]
{
    new Message("m1", "Order 1 placed"),
    new Message("m2", "Order 2 placed"),
    new Message("m1", "Order 1 placed"),          // duplicate delivery
    new Message("m3", "BAD"),                      // poison message
});
var processed = new HashSet<string>();
var deadLetter = new List<string>();

while (queue.Count > 0)
{
    var msg = queue.Dequeue();
    if (!processed.Add(msg.Id)) { Console.WriteLine($"Skip duplicate {msg.Id}"); continue; }
    if (msg.Body == "BAD") { deadLetter.Add(msg.Id); Console.WriteLine($"Dead-letter {msg.Id}"); continue; }
    Console.WriteLine($"Processed {msg.Id}: {msg.Body}");
}
Console.WriteLine($"Dead-letter queue: {string.Join(",", deadLetter)}");

public record Message(string Id, string Body);`,
        "Processed m1: Order 1 placed\nProcessed m2: Order 2 placed\nSkip duplicate m1\nDead-letter m3\nDead-letter queue: m3",
      ),
      webEx(
        "Publish and consume with RabbitMQ · RabbitMQ",
        `using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

var builder = WebApplication.CreateBuilder(args);
var factory = new ConnectionFactory { HostName = "localhost" };
var connection = await factory.CreateConnectionAsync();
var channel = await connection.CreateChannelAsync();
await channel.QueueDeclareAsync("orders", durable: true, exclusive: false, autoDelete: false);
builder.Services.AddSingleton(channel);
builder.Services.AddHostedService<OrderConsumer>();
var app = builder.Build();

app.MapPost("/orders", async (OrderPlaced order, IChannel ch) =>
{
    var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(order));
    await ch.BasicPublishAsync("", "orders", true, new BasicProperties { Persistent = true, MessageId = order.OrderId.ToString() }, body);
    return Results.Accepted();
});
app.Run();

public record OrderPlaced(Guid OrderId, string Customer, decimal Total);

public class OrderConsumer(IChannel channel, ILogger<OrderConsumer> log) : BackgroundService
{
    private readonly HashSet<string> seen = new();
    protected override async Task ExecuteAsync(CancellationToken stop)
    {
        var consumer = new AsyncEventingBasicConsumer(channel);
        consumer.ReceivedAsync += async (_, ea) =>
        {
            var id = ea.BasicProperties.MessageId ?? "";
            if (seen.Add(id))
            {
                var order = JsonSerializer.Deserialize<OrderPlaced>(ea.Body.Span)!;
                log.LogInformation("Sending receipt for {Order} to {Customer}", order.OrderId, order.Customer);
            }
            await channel.BasicAckAsync(ea.DeliveryTag, multiple: false);
        };
        await channel.BasicConsumeAsync("orders", autoAck: false, consumer, stop);
        await Task.Delay(Timeout.Infinite, stop);
    }
}`,
        'docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:3-management\ncurl -k -X POST https://localhost:5001/orders -H "Content-Type: application/json" -d "{\\"orderId\\":\\"3fa85f64-5717-4562-b3fc-2c963f66afa6\\",\\"customer\\":\\"Asha\\",\\"total\\":1200}"\n# watch the console log, and http://localhost:15672 (guest/guest)',
        ["RabbitMQ.Client"],
      ),
    ],
  },

  "Logging and Monitoring": {
    storyEn:
      "A ship keeps a logbook (logs), watches gauges for speed and fuel (metrics), and tracks the route port by port (traces). When something goes wrong at sea, the captain reads all three to understand what happened.",
    storyBn:
      "জাহাজে logbook থাকে (log), গতি ও জ্বালানির মিটার দেখা হয় (metric), আর বন্দর থেকে বন্দরে পথ চিহ্নিত হয় (trace)। সমুদ্রে কিছু ভুল হলে ক্যাপ্টেন তিনটিই পড়ে বোঝেন কী ঘটেছে।",
    theoryEn:
      "Logs say what happened (with levels: Trace, Debug, Information, Warning, Error, Critical). Use structured logging with placeholders, log.LogInformation(\"Order {OrderId} paid\", id), so tools can search by OrderId. Metrics are numbers over time (requests per second, error rate, latency). Traces follow one request across services with a trace id. Health checks (/health) let load balancers and Kubernetes know if the app is alive. OpenTelemetry exports all of this to tools like Grafana, Seq or Application Insights.",
    theoryBn:
      "Log বলে কী ঘটেছে (level: Trace, Debug, Information, Warning, Error, Critical)। Placeholder সহ structured logging ব্যবহার করুন, log.LogInformation(\"Order {OrderId} paid\", id), যাতে tool OrderId দিয়ে খুঁজতে পারে। Metric হলো সময়ের সাথে সংখ্যা (প্রতি সেকেন্ডে request, error হার, latency)। Trace একটি request-কে trace id দিয়ে service থেকে service অনুসরণ করে। Health check (/health) load balancer ও Kubernetes-কে বলে app বেঁচে আছে কি না। OpenTelemetry এগুলো Grafana, Seq বা Application Insights-এ পাঠায়।",
    steps: [
      ["Inject ILogger<T> and log with message templates.", "ILogger<T> inject করে message template দিয়ে log করুন।"],
      ["Set levels per category in appsettings.json.", "appsettings.json-এ category অনুযায়ী level দিন।"],
      ["Add health checks at /health.", "/health-এ health check যোগ করুন।"],
      ["Export logs, metrics and traces with OpenTelemetry and alert on errors.", "OpenTelemetry দিয়ে log, metric, trace পাঠান এবং error-এ alert দিন।"],
    ],
    mistakesEn:
      "String interpolation in log calls (loses structure), logging passwords, tokens or full card numbers, logging everything at Information in production, and having no alert so nobody notices errors.",
    mistakesBn:
      "Log call-এ string interpolation (structure হারায়), password, token বা পুরো card নম্বর log করা, production-এ সবকিছু Information-এ log, আর কোনো alert না থাকায় কেউ error টের পায় না।",
    examples: [
      consoleEx(
        "Structured logs as JSON · JSON-এ structured log",
        `using Microsoft.Extensions.Logging;

using var factory = LoggerFactory.Create(b => b
    .AddJsonConsole(o => o.JsonWriterOptions = new() { Indented = false })
    .SetMinimumLevel(LogLevel.Information));
var log = factory.CreateLogger("Orders");

log.LogDebug("This debug line is filtered out");
log.LogInformation("Order {OrderId} paid by {Customer} amount {Amount}", 1042, "Asha", 1200);
log.LogWarning("Stock low for {Item}: {Left} left", "Tea", 2);`,
        '{"EventId":0,"LogLevel":"Information","Category":"Orders","Message":"Order 1042 paid by Asha amount 1200","State":{"OrderId":1042,"Customer":"Asha","Amount":1200,"{OriginalFormat}":"Order {OrderId} paid by {Customer} amount {Amount}"}}\n{"EventId":0,"LogLevel":"Warning","Category":"Orders","Message":"Stock low for Tea: 2 left","State":{"Item":"Tea","Left":2,"{OriginalFormat}":"Stock low for {Item}: {Left} left"}}',
        ["Microsoft.Extensions.Logging.Console"],
      ),
      webEx(
        "Logs, health checks and request timing · log ও health check",
        `using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders().AddJsonConsole();
builder.Services.AddHealthChecks()
    .AddCheck("disk", () => new DriveInfo("/").AvailableFreeSpace > 500_000_000
        ? Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Healthy()
        : Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Degraded("Low disk"));
var app = builder.Build();

app.Use(async (ctx, next) =>                         // request timing middleware
{
    var sw = Stopwatch.StartNew();
    await next();
    app.Logger.LogInformation("{Method} {Path} -> {Status} in {Ms} ms",
        ctx.Request.Method, ctx.Request.Path, ctx.Response.StatusCode, sw.ElapsedMilliseconds);
});

app.MapHealthChecks("/health");
app.MapGet("/orders/{id:int}", (int id, ILogger<Program> log) =>
{
    if (id > 100)
    {
        log.LogWarning("Order {OrderId} not found", id);
        return Results.NotFound();
    }
    log.LogInformation("Order {OrderId} served", id);
    return Results.Ok(new { id });
});
app.Run();`,
        "curl -k https://localhost:5001/health          # Healthy\ncurl -k https://localhost:5001/orders/7\ncurl -k -i https://localhost:5001/orders/700   # 404 + a Warning log with OrderId=700",
      ),
    ],
  },
};
