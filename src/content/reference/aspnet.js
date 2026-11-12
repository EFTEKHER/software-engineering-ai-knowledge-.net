// Deep chapters for the ASP.NET Core backend track (module 7, lessons 21+).
// Sources: the "ASP.NET Core Web API Notebook" (EN/BN) and the
// "ASP.NET MVC Cookie Auth Tutorial", extended with role- and policy-based
// authorization, refresh tokens and production practices.
import { partTwo } from "./aspnetPart2";
import { consoleEx, webEx, refEx } from "./aspnetHelpers";

const partOne = {
  "ASP.NET Core Web API Setup": {
    en: "When you run a Web API, Kestrel (the built-in web server) opens a port. Each HTTP request becomes an HttpContext object that travels through middleware in order: HTTPS redirection, authentication, authorization, and finally routing to your controller. The controller returns an object, ASP.NET Core serialises it to JSON, and the response travels back out through the same middleware.",
    bn: "Web API চালালে Kestrel (built-in web server) একটি port খোলে। প্রতিটি request একটি HttpContext হয়ে ক্রমানুসারে middleware পার হয়: HTTPS redirect, authentication, authorization, তারপর routing হয়ে controller-এ পৌঁছায়। Controller যে object ফেরত দেয় ASP.NET Core সেটিকে JSON বানিয়ে একই পথে ফেরত পাঠায়।",
    theoryEn:
      "Think of Program.cs as a restaurant opening plan. Part one, builder.Services, is hiring staff: database context, controllers, authentication, your own services. Part two, after builder.Build(), is the route each customer walks: door security (HTTPS), ID check (UseAuthentication), permission check (UseAuthorization), then the table (MapControllers). A request that fails a step never reaches the next one.",
    theoryBn:
      "Program.cs-কে রেস্তোরাঁ খোলার পরিকল্পনা ভাবুন। প্রথম ভাগ builder.Services মানে কর্মী নিয়োগ: database context, controller, authentication, নিজের service। দ্বিতীয় ভাগ builder.Build()-এর পরে, প্রতিটি অতিথি যে পথে হাঁটে: দরজার নিরাপত্তা (HTTPS), পরিচয় যাচাই (UseAuthentication), অনুমতি যাচাই (UseAuthorization), তারপর টেবিল (MapControllers)। কোনো ধাপে আটকালে পরের ধাপে যায় না।",
    storyEn:
      "A tea shop opens at 8 am. Before opening, the owner hires a cashier and a cook (services). After opening, every customer walks the same line: door, token counter, cashier, cook. If the owner tries to hire after the doors are open, it is too late for today.",
    storyBn:
      "একটি চায়ের দোকান সকাল ৮টায় খোলে। খোলার আগে মালিক cashier ও রাঁধুনি নিয়োগ দেন (service)। খোলার পর প্রত্যেক ক্রেতা একই লাইনে হাঁটে: দরজা, token counter, cashier, রাঁধুনি। দোকান খোলার পর নিয়োগ দিলে আজকের জন্য দেরি হয়ে গেছে।",
    steps: [
      ["Create the project with dotnet new webapi.", "dotnet new webapi দিয়ে project বানান।"],
      ["Register services before builder.Build().", "builder.Build()-এর আগে service register করুন।"],
      ["Add middleware in the right order.", "সঠিক ক্রমে middleware যোগ করুন।"],
      ["Run and open /swagger to test endpoints.", "চালিয়ে /swagger খুলে endpoint পরীক্ষা করুন।"],
    ],
    mistakesEn:
      "Common slips: registering a service after builder.Build(); putting UseAuthorization before UseAuthentication; forgetting MapControllers so every URL returns 404; and leaving Swagger enabled in production.",
    mistakesBn:
      "সাধারণ ভুল: builder.Build()-এর পরে service register; UseAuthentication-এর আগে UseAuthorization; MapControllers ভুলে যাওয়া, ফলে সব URL 404; আর production-এ Swagger খোলা রাখা।",
    decisionEn:
      "Controllers suit larger APIs with filters, conventions and many endpoints; minimal APIs (app.MapGet) suit small services. Both share the same pipeline, DI and authentication. Keep environment-specific settings in appsettings.{Environment}.json and secrets in user-secrets or environment variables.",
    decisionBn:
      "বড় API, filter ও অনেক endpoint থাকলে controller ভালো; ছোট service-এ minimal API (app.MapGet)। দুটোই একই pipeline, DI ও authentication ব্যবহার করে। Environment-ভিত্তিক setting appsettings.{Environment}.json-এ আর secret user-secrets বা environment variable-এ রাখুন।",
    examples: [
      consoleEx(
        "1. Middleware order in plain C# · সাধারণ C#-এ middleware ক্রম",
        `var pipeline = new List<Func<string, string?>>
{
    req => req.StartsWith("http://") ? "301 redirect to https" : null,
    req => req.Contains("token=") ? null : "401 Unauthorized",
    req => req.Contains("role=admin") ? null : "403 Forbidden",
};
string Handle(string request)
{
    foreach (var step in pipeline)
    {
        var stop = step(request);
        if (stop is not null) return stop;   // short-circuit
    }
    return "200 OK from controller";
}
Console.WriteLine(Handle("http://api/orders"));
Console.WriteLine(Handle("https://api/orders"));
Console.WriteLine(Handle("https://api/orders?token=abc"));
Console.WriteLine(Handle("https://api/orders?token=abc&role=admin"));`,
        "301 redirect to https\n401 Unauthorized\n403 Forbidden\n200 OK from controller",
      ),
      webEx(
        "2. A complete minimal Web API · সম্পূর্ণ ছোট Web API",
        `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddSingleton<List<string>>(_ => new() { "Asha", "Rafi" });
var app = builder.Build();

app.UseHttpsRedirection();
app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "healthy", time = DateTime.UtcNow }));
app.MapGet("/api/names", (List<string> names) => names);
app.MapPost("/api/names", (List<string> names, NameRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.Name)) return Results.BadRequest("Name is required");
    names.Add(req.Name);
    return Results.Created($"/api/names/{names.Count - 1}", req);
});
app.Run();

public record NameRequest(string Name);`,
        'curl -k https://localhost:5001/health\ncurl -k https://localhost:5001/api/names\ncurl -k -X POST https://localhost:5001/api/names -H "Content-Type: application/json" -d "{\\"name\\":\\"Mina\\"}"',
      ),
      refEx(
        "3. Program.cs used by the notebook project · নোটবুকের Program.cs",
        `using Microsoft.EntityFrameworkCore;
using MyFirstApi.Data;
using MyFirstApi.Services;

var builder = WebApplication.CreateBuilder(args);

// 1) Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();

var app = builder.Build();

// 2) Middleware pipeline (order matters)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();`,
        "Shape of a real Program.cs. It needs the Data and Services folders from the next lessons, so read it as the map you are building towards.",
        "আসল Program.cs-এর গঠন। পরের lesson-এর Data ও Services folder লাগবে, তাই এটিকে যে মানচিত্রের দিকে এগোচ্ছেন হিসেবে পড়ুন।",
      ),
    ],
  },

  "EF Core Entities & DbContext": {
    en: "EF Core is an ORM: it maps C# classes to tables and LINQ queries to SQL. The model is discovered from the DbSet properties on your DbContext. By convention a property named Id or <Class>Id becomes the primary key, string becomes nvarchar, Guid becomes uniqueidentifier, and a nullable C# type becomes a nullable column.",
    bn: "EF Core একটি ORM: C# class-কে table এবং LINQ-কে SQL-এ রূপান্তর করে। DbContext-এর DbSet property থেকে model খুঁজে নেয়। নিয়ম অনুযায়ী Id বা <Class>Id নামের property primary key, string হয় nvarchar, Guid হয় uniqueidentifier, আর nullable C# type হয় nullable column।",
    theoryEn:
      "An entity is the noun of your app: Employee, Product, AccountUser. The DbContext is a unit of work: it remembers which objects you loaded or added (the change tracker) and, when you call SaveChangesAsync, writes all those changes in one transaction. Its options (which database, which connection string) are given from outside through dependency injection, so the same context can point to SQL Server in production and SQLite in tests.",
    theoryBn:
      "Entity হলো app-এর বিশেষ্য: Employee, Product, AccountUser। DbContext একটি unit of work: কোন object load বা add হয়েছে মনে রাখে (change tracker), আর SaveChangesAsync ডাকলে সব পরিবর্তন এক transaction-এ লেখে। কোন database বা connection string, তা বাইরে থেকে DI দিয়ে আসে, তাই production-এ SQL Server আর test-এ SQLite ব্যবহার করা যায়।",
    storyEn:
      "The DbContext is a shop's notebook. You write 'sold 2 teas' and 'new customer Rina' during the day, but the accountant (the database) only receives the page when you hand it over with SaveChanges.",
    storyBn:
      "DbContext হলো দোকানের খাতা। সারাদিন 'দুই কাপ চা বিক্রি' বা 'নতুন ক্রেতা রিনা' লেখা হয়, কিন্তু হিসাবরক্ষক (database) পাতাটা পান তখনই যখন SaveChanges দিয়ে হাতে দেন।",
    steps: [
      ["Install Microsoft.EntityFrameworkCore.SqlServer and .Tools.", "EF Core SqlServer ও Tools package install করুন।"],
      ["Create entity classes in a Models or Entities folder.", "Models বা Entities folder-এ entity class বানান।"],
      ["Create AppDbContext with a DbSet per table.", "প্রতিটি table-এর জন্য DbSet সহ AppDbContext বানান।"],
      ["Register AddDbContext with the connection string.", "Connection string দিয়ে AddDbContext register করুন।"],
    ],
    mistakesEn:
      "Typical errors: a missing constructor that accepts DbContextOptions (AddDbContext cannot create the context); a typo in the connection string name so GetConnectionString returns null; and non-nullable string properties without a default, which produce CS8618 warnings.",
    mistakesBn:
      "সাধারণ ভুল: DbContextOptions নেওয়া constructor না থাকা; connection string-এর নামে ভুল, ফলে GetConnectionString null দেয়; আর default ছাড়া non-nullable string property, যা CS8618 warning দেয়।",
    decisionEn:
      "Use data annotations ([MaxLength], [Required]) for simple rules and OnModelCreating with the Fluent API for indexes, relationships and precision. Add a unique index on Email so duplicates are blocked by the database, not just by code.",
    decisionBn:
      "সহজ নিয়মে data annotation ([MaxLength], [Required]), আর index, সম্পর্ক ও precision-এর জন্য OnModelCreating-এ Fluent API। Email-এ unique index দিন যাতে duplicate শুধু code নয়, database-ও আটকায়।",
    examples: [
      consoleEx(
        "1. Entities and DbContext with in-memory SQLite · SQLite দিয়ে চালান",
        `using Microsoft.EntityFrameworkCore;

using var db = new AppDbContext();
db.Database.EnsureDeleted();
db.Database.EnsureCreated();
db.Employees.Add(new Employee { Name = "Asha", Email = "asha@example.com", Salary = 50000 });
db.Employees.Add(new Employee { Name = "Rafi", Email = "rafi@example.com", Salary = 42000 });
db.SaveChanges();
foreach (var e in db.Employees.OrderBy(e => e.Name))
    Console.WriteLine($"{e.Name} <{e.Email}> {e.Salary}");
Console.WriteLine($"Total: {db.Employees.Count()}");

public class Employee
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal Salary { get; set; }
}

public class AppDbContext : DbContext
{
    public DbSet<Employee> Employees => Set<Employee>();
    protected override void OnConfiguring(DbContextOptionsBuilder o) =>
        o.UseSqlite("Data Source=learn.db");
    protected override void OnModelCreating(ModelBuilder b) =>
        b.Entity<Employee>().HasIndex(e => e.Email).IsUnique();
}`,
        "Asha <asha@example.com> 50000\nRafi <rafi@example.com> 42000\nTotal: 2",
        ["Microsoft.EntityFrameworkCore.Sqlite"],
      ),
      webEx(
        "2. DbContext through dependency injection · DI দিয়ে DbContext",
        `using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlite("Data Source=api.db"));
var app = builder.Build();

using (var scope = app.Services.CreateScope())
    scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.EnsureCreated();

app.MapGet("/employees", async (AppDbContext db) => await db.Employees.ToListAsync());
app.MapPost("/employees", async (AppDbContext db, Employee e) =>
{
    db.Employees.Add(e);
    await db.SaveChangesAsync();
    return Results.Created($"/employees/{e.Id}", e);
});
app.Run();

public class Employee
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Employee> Employees => Set<Employee>();
}`,
        'curl -k -X POST https://localhost:5001/employees -H "Content-Type: application/json" -d "{\\"name\\":\\"Asha\\"}"\ncurl -k https://localhost:5001/employees',
        ["Microsoft.EntityFrameworkCore.Sqlite"],
      ),
      refEx(
        "3. Notebook entities and context · নোটবুকের entity ও context",
        `namespace MyFirstApi.Entities;

public class AccountUser
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty; // stores the HASH
    public string Role { get; set; } = "User";
}

public class Employee
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string EmailAddress { get; set; } = string.Empty;
    public string? Department { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? LastModifiedDate { get; set; }
}

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<AccountUser> AccountUsers => Set<AccountUser>();
    public DbSet<Employee> Employees => Set<Employee>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<AccountUser>().HasIndex(u => u.Email).IsUnique();
        b.Entity<Employee>().HasIndex(e => e.EmailAddress).IsUnique();
    }
}`,
        "Entities/ and Data/ files for the Employee API. The Role column is added for role-based authorization later in this track.",
        "Employee API-এর Entities/ ও Data/ file। পরে role-based authorization-এর জন্য Role column যোগ করা হয়েছে।",
      ),
    ],
  },

  "EF Core Migrations": {
    en: "EF Core keeps a model snapshot file. When you run migrations add, it compares your current classes with the snapshot and writes an Up method (apply the change) and a Down method (undo it). database update runs every migration not yet listed in the __EFMigrationsHistory table, so each database knows exactly which version it is on.",
    bn: "EF Core একটি model snapshot file রাখে। migrations add চালালে বর্তমান class-কে snapshot-এর সাথে তুলনা করে Up (পরিবর্তন) ও Down (ফেরত) method লেখে। database update সেই migration-গুলো চালায় যেগুলো __EFMigrationsHistory table-এ নেই, তাই প্রতিটি database জানে সে কোন version-এ আছে।",
    theoryEn:
      "Migrations are version control for your database schema. Your C# model is the source of truth; each migration is one commit describing a change. Teammates and servers replay the same commits, in the same order, so everyone ends up with the same tables. Never edit the database by hand and then forget a migration: the next migration will not know about your manual change.",
    theoryBn:
      "Migration হলো database schema-র version control। C# model হলো আসল সত্য; প্রতিটি migration একটি commit যা একটি পরিবর্তন বলে। সহকর্মী ও server একই ক্রমে সেই commit চালায়, ফলে সবার table একই থাকে। হাতে database বদলে migration ভুলে গেলে পরের migration সেই পরিবর্তন জানবে না।",
    storyEn:
      "A building has a renovation diary. Page 1: build two rooms. Page 2: add a window. A new contractor reads the diary from page 1 and builds the same house; he never guesses.",
    storyBn:
      "একটি বাড়ির সংস্কারের ডায়েরি আছে। পাতা ১: দুটি ঘর। পাতা ২: একটি জানালা। নতুন ঠিকাদার প্রথম পাতা থেকে পড়ে একই বাড়ি বানায়, অনুমান করে না।",
    steps: [
      ["Change or add an entity property.", "Entity property বদলান বা যোগ করুন।"],
      ["Run dotnet ef migrations add <Name>.", "dotnet ef migrations add <Name> চালান।"],
      ["Open the generated file and read Up and Down.", "তৈরি file খুলে Up ও Down পড়ুন।"],
      ["Run dotnet ef database update and check the table.", "dotnet ef database update চালিয়ে table দেখুন।"],
    ],
    mistakesEn:
      "'No project was found' means you are in the wrong folder; pass --project. 'Unable to create a DbContext' means the design-time tool cannot build your context; make sure Program.cs registers it or add an IDesignTimeDbContextFactory. Renaming a property without checking the migration may drop a column with data.",
    mistakesBn:
      "'No project was found' মানে ভুল folder-এ আছেন, --project দিন। 'Unable to create a DbContext' মানে design-time tool context বানাতে পারছে না; Program.cs-এ register আছে কি না দেখুন। Migration না দেখে property rename করলে data-সহ column মুছে যেতে পারে।",
    decisionEn:
      "Development: database update is fine. Production: generate an idempotent SQL script (migrations script --idempotent), review it, and run it as a deployment step, or use migration bundles. Avoid calling Database.Migrate() on startup when several instances start at once.",
    decisionBn:
      "Development-এ database update ঠিক আছে। Production-এ idempotent SQL script বানিয়ে পর্যালোচনা করে deployment ধাপে চালান, বা migration bundle ব্যবহার করুন। একাধিক instance একসাথে চালু হলে startup-এ Database.Migrate() এড়িয়ে চলুন।",
    examples: [
      refEx(
        "1. The everyday migration workflow · প্রতিদিনের migration ধাপ",
        `# one time
dotnet tool install --global dotnet-ef
dotnet add package Microsoft.EntityFrameworkCore.Design

# create the database for the first time
dotnet ef migrations add InitialCreate
dotnet ef database update

# later: you added Employee.Department
dotnet ef migrations add AddEmployeeDepartment
dotnet ef database update

# see what exists and what is applied
dotnet ef migrations list

# production: reviewable SQL
dotnet ef migrations script --idempotent -o deploy.sql`,
        "Run from the project folder that contains the .csproj.",
        ".csproj যে folder-এ আছে সেখান থেকে চালান।",
        "bash",
      ),
      refEx(
        "2. What a generated migration looks like · তৈরি migration দেখতে কেমন",
        `public partial class AddEmployeeDepartment : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "Department",
            table: "Employees",
            type: "nvarchar(max)",
            nullable: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(name: "Department", table: "Employees");
    }
}`,
        "Generated in the Migrations folder. Up applies the change, Down reverses it.",
        "Migrations folder-এ তৈরি হয়। Up পরিবর্তন করে, Down ফিরিয়ে আনে।",
      ),
      consoleEx(
        "3. Simulate the history table · history table-এর অনুকরণ",
        `var all = new[] { "20240101_InitialCreate", "20240205_AddEmployeeDepartment", "20240310_AddUserRole" };
var applied = new HashSet<string> { "20240101_InitialCreate" };

foreach (var m in all.Where(m => !applied.Contains(m)))
{
    Console.WriteLine($"Applying {m}");
    applied.Add(m);
}
Console.WriteLine($"Database is at {applied.Max()}");`,
        "Applying 20240205_AddEmployeeDepartment\nApplying 20240310_AddUserRole\nDatabase is at 20240310_AddUserRole",
      ),
    ],
  },

  "Controllers & Routing": {
    en: "Attribute routing combines the controller's [Route] with each action's [HttpGet], [HttpPost], [HttpPut] or [HttpDelete] template. Model binding then fills the action's parameters: route values and query strings for simple types, the JSON body for complex types when [ApiController] is present. The action's IActionResult picks the status code and body.",
    bn: "Attribute routing controller-এর [Route] আর action-এর [HttpGet], [HttpPost], [HttpPut], [HttpDelete] template জোড়া দেয়। তারপর model binding parameter ভরে: সাধারণ type-এ route ও query string, [ApiController] থাকলে complex type-এ JSON body। IActionResult status code ও body ঠিক করে।",
    theoryEn:
      "A URL is an address and the HTTP verb is the intention. GET reads, POST creates, PUT replaces, PATCH changes part, DELETE removes. A good controller action is short: read input, call a service, translate the result into a status code. Ok() is 200, Created() is 201, NoContent() is 204, BadRequest() is 400, Unauthorized() is 401, Forbid() is 403, NotFound() is 404, Conflict() is 409.",
    theoryBn:
      "URL হলো ঠিকানা, HTTP verb হলো উদ্দেশ্য। GET পড়ে, POST তৈরি করে, PUT বদলে দেয়, PATCH আংশিক বদলায়, DELETE মুছে। ভালো action ছোট হয়: input পড়া, service ডাকা, ফলকে status code-এ রূপান্তর। Ok() 200, Created() 201, NoContent() 204, BadRequest() 400, Unauthorized() 401, Forbid() 403, NotFound() 404, Conflict() 409।",
    storyEn:
      "A post office sorts letters by address (route) and by stamp colour (verb). The red stamp means 'deliver', the blue one means 'return'. The same address with a different stamp goes to a different desk.",
    storyBn:
      "ডাকঘর চিঠি বাছাই করে ঠিকানা (route) আর স্ট্যাম্পের রঙ (verb) দেখে। লাল মানে 'পৌঁছে দাও', নীল মানে 'ফেরত দাও'। একই ঠিকানা, ভিন্ন স্ট্যাম্প হলে ভিন্ন টেবিলে যায়।",
    steps: [
      ["Add [ApiController] and [Route(\"api/[controller]\")].", "[ApiController] ও [Route(\"api/[controller]\")] দিন।"],
      ["Choose the verb attribute for each action.", "প্রতিটি action-এর verb attribute বাছুন।"],
      ["Add route constraints such as {id:guid}.", "{id:guid}-এর মতো route constraint দিন।"],
      ["Return the right IActionResult for each case.", "প্রতিটি অবস্থায় সঠিক IActionResult দিন।"],
    ],
    mistakesEn:
      "Two actions with the same verb and template cause AmbiguousMatchException. Writing {Guid:id} instead of {id:guid} breaks the route. Returning Ok(null) instead of NotFound() hides missing data from the client.",
    mistakesBn:
      "একই verb ও template-এ দুটি action থাকলে AmbiguousMatchException। {id:guid}-এর বদলে {Guid:id} লিখলে route ভাঙে। NotFound()-এর বদলে Ok(null) দিলে client বোঝে না data নেই।",
    decisionEn:
      "Use ActionResult<T> when an action returns data so Swagger knows the response type. Prefer nouns in routes (api/employees/{id}) and let the verb carry the action. Keep controllers thin; anything that needs a database or business rule belongs in a service.",
    decisionBn:
      "Data ফেরত দিলে ActionResult<T> ব্যবহার করুন যাতে Swagger type জানে। Route-এ বিশেষ্য রাখুন (api/employees/{id}), কাজ বোঝাবে verb। Controller পাতলা রাখুন; database বা business rule service-এ থাকবে।",
    examples: [
      webEx(
        "1. Full CRUD controller with status codes · status code সহ CRUD controller",
        `using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
var app = builder.Build();
app.MapControllers();
app.Run();

public record EmployeeDto(Guid Id, string Name);
public record CreateEmployeeDto(string Name);

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private static readonly List<EmployeeDto> Store = new();

    [HttpGet]
    public ActionResult<IEnumerable<EmployeeDto>> GetAll() => Ok(Store);

    [HttpGet("{id:guid}")]
    public ActionResult<EmployeeDto> GetById(Guid id)
    {
        var e = Store.FirstOrDefault(x => x.Id == id);
        return e is null ? NotFound() : Ok(e);
    }

    [HttpPost]
    public ActionResult<EmployeeDto> Create(CreateEmployeeDto dto)
    {
        if (Store.Any(x => x.Name == dto.Name)) return Conflict("Name already exists");
        var e = new EmployeeDto(Guid.NewGuid(), dto.Name);
        Store.Add(e);
        return CreatedAtAction(nameof(GetById), new { id = e.Id }, e);
    }

    [HttpDelete("{id:guid}")]
    public IActionResult Delete(Guid id) =>
        Store.RemoveAll(x => x.Id == id) == 0 ? NotFound() : NoContent();
}`,
        'curl -k -X POST https://localhost:5001/api/employees -H "Content-Type: application/json" -d "{\\"name\\":\\"Asha\\"}"\ncurl -k https://localhost:5001/api/employees\ncurl -k -i https://localhost:5001/api/employees/00000000-0000-0000-0000-000000000001',
      ),
      consoleEx(
        "2. How routing picks an action · routing কীভাবে action বাছে",
        `var routes = new (string Verb, string Template, string Action)[]
{
    ("GET", "api/employees", "GetAll"),
    ("GET", "api/employees/{id}", "GetById"),
    ("POST", "api/employees", "Create"),
    ("DELETE", "api/employees/{id}", "Delete"),
};
string Match(string verb, string path)
{
    var parts = path.Split('/');
    foreach (var r in routes.Where(r => r.Verb == verb))
    {
        var t = r.Template.Split('/');
        if (t.Length == parts.Length && t.Zip(parts).All(p => p.First.StartsWith("{") || p.First == p.Second))
            return r.Action;
    }
    return "404 Not Found";
}
Console.WriteLine(Match("GET", "api/employees"));
Console.WriteLine(Match("GET", "api/employees/7"));
Console.WriteLine(Match("DELETE", "api/employees/7"));
Console.WriteLine(Match("PUT", "api/employees/7"));`,
        "GetAll\nGetById\nDelete\n404 Not Found",
      ),
      refEx(
        "3. Status code cheat sheet · status code সংক্ষেপ",
        `return Ok(data);                 // 200 read succeeded
return CreatedAtAction(...);      // 201 new resource + Location header
return NoContent();               // 204 update/delete succeeded, no body
return BadRequest(errors);        // 400 client sent invalid data
return Unauthorized();            // 401 not logged in / bad token
return Forbid();                  // 403 logged in but not allowed
return NotFound();                // 404 id does not exist
return Conflict("duplicate");     // 409 violates a uniqueness rule
return Problem(statusCode: 500);  // 500 unexpected server error`,
        "Keep this next to you while writing actions.",
        "Action লেখার সময় এটি পাশে রাখুন।",
      ),
    ],
  },

  "Services, Interfaces & DI": {
    en: "The DI container is a registry of 'when someone asks for X, give them Y'. At startup you register pairs with a lifetime. When ASP.NET Core creates a controller, it reads the constructor, finds each parameter type in the registry, builds the dependencies (and their dependencies) and passes them in. You never write new EmployeeService(...) yourself.",
    bn: "DI container একটি তালিকা: 'কেউ X চাইলে Y দাও'। Startup-এ lifetime সহ জোড়া register করা হয়। Controller বানানোর সময় ASP.NET Core constructor পড়ে, প্রতিটি parameter type তালিকায় খোঁজে, dependency (এবং তাদের dependency) বানিয়ে দেয়। new EmployeeService(...) নিজে লিখতে হয় না।",
    theoryEn:
      "An interface is a promise: IEmployeeService promises GetAllAsync, CreateAsync and so on. The controller depends on the promise, not on the concrete class. That gives three wins: you can swap the implementation (SQL today, an external API tomorrow), you can test the controller with a fake service, and each class has one job. The notebook's services return tuples like (int code, string message); an enum or a result object is easier to read.",
    theoryBn:
      "Interface হলো প্রতিশ্রুতি: IEmployeeService বলে GetAllAsync, CreateAsync ইত্যাদি থাকবে। Controller প্রতিশ্রুতির উপর নির্ভর করে, নির্দিষ্ট class-এর উপর নয়। লাভ তিনটি: implementation বদলানো যায়, fake service দিয়ে test করা যায়, আর প্রতিটি class-এর একটাই কাজ। নোটবুকের service (int code, string message) tuple দেয়; enum বা result object পড়তে সহজ।",
    storyEn:
      "A restaurant manager says 'I need a cook', not 'I need Karim'. The staffing agency (DI) sends whichever cook is registered today. The menu (interface) stays the same.",
    storyBn:
      "রেস্তোরাঁর ম্যানেজার বলেন 'একজন রাঁধুনি লাগবে', 'করিমকে লাগবে' নয়। Staffing agency (DI) আজ যাকে register করা আছে তাকে পাঠায়। মেনু (interface) একই থাকে।",
    steps: [
      ["Write the interface with the operations.", "কাজগুলো নিয়ে interface লিখুন।"],
      ["Implement it in a service class that uses AppDbContext.", "AppDbContext ব্যবহার করে service class-এ বাস্তবায়ন করুন।"],
      ["Register with AddScoped<IService, Service>().", "AddScoped<IService, Service>() দিয়ে register করুন।"],
      ["Inject the interface into the controller constructor.", "Controller constructor-এ interface inject করুন।"],
    ],
    mistakesEn:
      "Forgetting the registration gives 'Unable to resolve service' at runtime. Injecting a Scoped DbContext into a Singleton causes 'Cannot consume scoped service from singleton'. Creating services with new inside controllers defeats DI and makes testing hard.",
    mistakesBn:
      "Register ভুলে গেলে runtime-এ 'Unable to resolve service'। Singleton-এ Scoped DbContext inject করলে 'Cannot consume scoped service from singleton'। Controller-এ new দিয়ে service বানালে DI-র সুবিধা হারায়, test কঠিন হয়।",
    decisionEn:
      "Default to Scoped for services that touch the database. Use Singleton only for stateless or thread-safe things (configuration wrappers, caches), and Transient for lightweight stateless helpers. Replace magic tuple codes with an enum such as ServiceStatus { Ok, NotFound, Duplicate }.",
    decisionBn:
      "Database ছোঁয়া service-এ default Scoped। Singleton শুধু stateless বা thread-safe জিনিসে (configuration, cache), হালকা helper-এ Transient। Tuple-এর জাদুকরি সংখ্যার বদলে ServiceStatus { Ok, NotFound, Duplicate }-এর মতো enum।",
    examples: [
      consoleEx(
        "1. Lifetimes you can see · lifetime চোখে দেখা",
        `using Microsoft.Extensions.DependencyInjection;

var services = new ServiceCollection();
services.AddSingleton<SingletonCounter>();
services.AddScoped<ScopedCounter>();
services.AddTransient<TransientCounter>();
var root = services.BuildServiceProvider();

for (int request = 1; request <= 2; request++)
{
    using var scope = root.CreateScope();
    var sp = scope.ServiceProvider;
    Console.WriteLine($"Request {request}: singleton={sp.GetRequiredService<SingletonCounter>().Id} " +
        $"scoped={sp.GetRequiredService<ScopedCounter>().Id}/{sp.GetRequiredService<ScopedCounter>().Id} " +
        $"transient={sp.GetRequiredService<TransientCounter>().Id}/{sp.GetRequiredService<TransientCounter>().Id}");
}

public class Counter { static int next; public int Id { get; } = ++next; }
public class SingletonCounter : Counter { }
public class ScopedCounter : Counter { }
public class TransientCounter : Counter { }`,
        "Request 1: singleton=1 scoped=2/2 transient=3/4\nRequest 2: singleton=1 scoped=5/5 transient=6/7",
        ["Microsoft.Extensions.DependencyInjection"],
      ),
      webEx(
        "2. Controller, interface and service · controller, interface ও service",
        `using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddScoped<IEmployeeService, InMemoryEmployeeService>();
var app = builder.Build();
app.MapControllers();
app.Run();

public enum ServiceStatus { Ok, NotFound, Duplicate }

public interface IEmployeeService
{
    Task<IReadOnlyList<string>> GetAllAsync();
    Task<ServiceStatus> CreateAsync(string name);
}

public class InMemoryEmployeeService : IEmployeeService
{
    private static readonly List<string> Names = new() { "Asha" };
    public Task<IReadOnlyList<string>> GetAllAsync() => Task.FromResult<IReadOnlyList<string>>(Names);
    public Task<ServiceStatus> CreateAsync(string name)
    {
        if (Names.Contains(name)) return Task.FromResult(ServiceStatus.Duplicate);
        Names.Add(name);
        return Task.FromResult(ServiceStatus.Ok);
    }
}

[ApiController]
[Route("api/[controller]")]
public class EmployeeController(IEmployeeService service) : ControllerBase
{
    [HttpGet] public async Task<IActionResult> Get() => Ok(await service.GetAllAsync());

    [HttpPost("{name}")]
    public async Task<IActionResult> Create(string name) => await service.CreateAsync(name) switch
    {
        ServiceStatus.Duplicate => Conflict($"{name} already exists"),
        _ => Created($"api/employee/{name}", name),
    };
}`,
        "curl -k https://localhost:5001/api/employee\ncurl -k -X POST https://localhost:5001/api/employee/Rafi\ncurl -k -i -X POST https://localhost:5001/api/employee/Rafi",
      ),
      consoleEx(
        "3. Why interfaces make testing easy · interface দিয়ে সহজ test",
        `var fake = new FakeEmployeeService(new[] { "Asha", "Rafi" });
var report = new Report(fake);
Console.WriteLine(report.Headline());

public interface IEmployeeService { IReadOnlyList<string> GetAll(); }
public class FakeEmployeeService(string[] names) : IEmployeeService
{
    public IReadOnlyList<string> GetAll() => names;
}
public class Report(IEmployeeService service)
{
    public string Headline() => $"{service.GetAll().Count} employees: {string.Join(", ", service.GetAll())}";
}`,
        "2 employees: Asha, Rafi",
      ),
    ],
  },

  "DTOs & Model Validation": {
    en: "Model binding converts the JSON body into your DTO. With [ApiController], ASP.NET Core then runs every validation attribute and, if any fails, short-circuits with 400 Bad Request and a ValidationProblemDetails body listing each field error. Your action only runs when ModelState is valid.",
    bn: "Model binding JSON body-কে DTO-তে রূপান্তর করে। [ApiController] থাকলে ASP.NET Core সব validation attribute চালায়; কোনোটি ব্যর্থ হলে 400 Bad Request আর প্রতিটি field-এর error সহ ValidationProblemDetails দেয়। ModelState valid হলেই action চলে।",
    theoryEn:
      "Never accept or return entities directly. If the client posts an AccountUser entity, they can set Role = \"Admin\" themselves (over-posting). If you return it, you leak the password hash. A DTO is a separate, small class: RegisterDto has Email and Password; EmployeeDto has Id, Name and Email. Validation on the DTO stops garbage at the door, so services can trust their input.",
    theoryBn:
      "Entity সরাসরি নেবেন না বা দেবেন না। Client AccountUser entity পাঠালে নিজেই Role = \"Admin\" বসাতে পারে (over-posting)। ফেরত দিলে password hash ফাঁস হয়। DTO আলাদা ছোট class: RegisterDto-তে Email ও Password; EmployeeDto-তে Id, Name, Email। DTO-তে validation দরজায় আবর্জনা আটকায়, ফলে service input-এ ভরসা করতে পারে।",
    storyEn:
      "A bank form has only the boxes the customer may fill in. There is no box called 'approve my own loan'. The clerk rejects the form at the counter if the phone number box is empty.",
    storyBn:
      "ব্যাংকের ফর্মে শুধু সেই ঘর থাকে যা গ্রাহক পূরণ করতে পারেন। 'নিজের ঋণ নিজে অনুমোদন' নামে কোনো ঘর নেই। ফোন নম্বর ফাঁকা থাকলে কাউন্টারেই ফর্ম ফেরত।",
    steps: [
      ["Create input and output DTOs per use case.", "প্রতিটি কাজের জন্য input ও output DTO বানান।"],
      ["Add [Required], [EmailAddress], [MinLength], [Range].", "[Required], [EmailAddress], [MinLength], [Range] দিন।"],
      ["Map DTO to entity in the service.", "Service-এ DTO থেকে entity-তে map করুন।"],
      ["Return output DTOs, never entities.", "Entity নয়, output DTO ফেরত দিন।"],
    ],
    mistakesEn:
      "Returning AccountUser leaks the hash. Non-nullable strings without = string.Empty trigger CS8618. Validating with if statements inside every action duplicates code that attributes already handle.",
    mistakesBn:
      "AccountUser ফেরত দিলে hash ফাঁস হয়। = string.Empty ছাড়া non-nullable string-এ CS8618। Attribute যা করে, প্রতিটি action-এ if দিয়ে তা আবার লেখা অপ্রয়োজনীয়।",
    decisionEn:
      "Attributes are perfect for shape rules. For cross-field or async rules (email must be unique) use FluentValidation or service checks that return 409. Use records for simple immutable DTOs.",
    decisionBn:
      "আকারের নিয়মে attribute যথেষ্ট। একাধিক field বা async নিয়মে (email unique) FluentValidation বা service check যা 409 দেয়। সহজ immutable DTO-তে record ব্যবহার করুন।",
    examples: [
      consoleEx(
        "1. Run validation attributes yourself · নিজে validation চালান",
        `using System.ComponentModel.DataAnnotations;

var dto = new RegisterDto { Email = "not-an-email", Password = "123" };
var results = new List<ValidationResult>();
bool ok = Validator.TryValidateObject(dto, new ValidationContext(dto), results, validateAllProperties: true);
Console.WriteLine($"Valid: {ok}");
foreach (var r in results) Console.WriteLine($"- {r.ErrorMessage}");

public class RegisterDto
{
    [Required, EmailAddress(ErrorMessage = "Email format is wrong")]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6, ErrorMessage = "Password needs 6+ characters")]
    public string Password { get; set; } = string.Empty;
}`,
        "Valid: False\n- Email format is wrong\n- Password needs 6+ characters",
      ),
      webEx(
        "2. Automatic 400 from [ApiController] · স্বয়ংক্রিয় 400",
        `using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
var app = builder.Build();
app.MapControllers();
app.Run();

public class CreateEmployeeDto
{
    [Required, StringLength(50, MinimumLength = 2)] public string Name { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    [Range(10000, 500000)] public decimal Salary { get; set; }
}
public record EmployeeDto(Guid Id, string Name, string Email);

[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    [HttpPost]
    public ActionResult<EmployeeDto> Create(CreateEmployeeDto dto) =>
        Created("", new EmployeeDto(Guid.NewGuid(), dto.Name, dto.Email));
}`,
        'curl -k -i -X POST https://localhost:5001/api/employee -H "Content-Type: application/json" -d "{\\"name\\":\\"A\\",\\"email\\":\\"bad\\",\\"salary\\":5}"\n# 400 with errors for Name, Email and Salary',
      ),
      refEx(
        "3. Entity to DTO mapping · entity থেকে DTO",
        `public static class EmployeeMapping
{
    public static EmployeeDto ToDto(this Employee e) =>
        new(e.Id, e.Name, e.EmailAddress);

    public static Employee ToEntity(this CreateEmployeeDto d) => new()
    {
        Id = Guid.NewGuid(),
        Name = d.Name.Trim(),
        EmailAddress = d.Email.Trim().ToLowerInvariant(),
        CreatedDate = DateTime.UtcNow,
    };
}

// in the service
var list = await db.Employees.AsNoTracking()
    .Select(e => new EmployeeDto(e.Id, e.Name, e.EmailAddress))
    .ToListAsync();`,
        "Manual mapping is explicit and fast. Projecting with Select also makes the SQL read only the needed columns.",
        "হাতে map করা স্পষ্ট ও দ্রুত। Select দিয়ে projection করলে SQL শুধু দরকারি column পড়ে।",
      ),
    ],
  },

  "Generic Response Model": {
    en: "A generic type has a placeholder T that is filled in at the call site. ResponseResult<string>, ResponseResult<List<EmployeeDto>> and ResponseResult<TokenDto> are three real types created from one template. Static factory methods Success and Failure build the object so every endpoint returns { data, message, status } in the same shape.",
    bn: "Generic type-এ T একটি জায়গা-রাখা নাম, ব্যবহারের সময় পূরণ হয়। ResponseResult<string>, ResponseResult<List<EmployeeDto>> ও ResponseResult<TokenDto> একই ছাঁচ থেকে তিনটি আসল type। Static factory Success ও Failure object বানায়, ফলে প্রতিটি endpoint { data, message, status } একই আকারে দেয়।",
    theoryEn:
      "You already use generics: List<int> and List<string> are the same list code with different element types. ResponseResult<T> applies the idea to API responses. Status defaults to false, meaning 'failed unless proven otherwise'. Static methods are called on the type (ResponseResult<string>.Failure(...)), so you do not need new every time. The class itself must not be static, because it has instance properties.",
    theoryBn:
      "Generic আপনি আগেই ব্যবহার করেন: List<int> আর List<string> একই কোড, শুধু element type ভিন্ন। ResponseResult<T> সেই ধারণা API response-এ আনে। Status default false, মানে 'প্রমাণ না হলে ব্যর্থ'। Static method type দিয়ে ডাকা হয় (ResponseResult<string>.Failure(...)), তাই বারবার new লাগে না। Class নিজে static হবে না, কারণ এতে instance property আছে।",
    storyEn:
      "Every parcel from a courier comes in the same box with a label: contents, note, delivered yes or no. Sometimes the box holds a book, sometimes a phone, but the receiver always knows where to look.",
    storyBn:
      "Courier-এর প্রতিটি পার্সেল একই বাক্সে আসে, লেবেলে: ভেতরে কী, নোট, পৌঁছেছে কি না। কখনো বই, কখনো ফোন, কিন্তু প্রাপক জানেন কোথায় দেখতে হবে।",
    steps: [
      ["Create GenericResponse/ResponseResult.cs.", "GenericResponse/ResponseResult.cs বানান।"],
      ["Add Data, Message and Status properties.", "Data, Message, Status property দিন।"],
      ["Add static Success and Failure factories.", "Static Success ও Failure factory দিন।"],
      ["Wrap every action's body in ResponseResult<T>.", "প্রতিটি action-এর body ResponseResult<T>-এ মুড়ে দিন।"],
    ],
    mistakesEn:
      "From the notebook: making the class static (7 compile errors); returning Failure even when data exists so status is false; and returning a message about duplicates from a successful register.",
    mistakesBn:
      "নোটবুক থেকে: class static করা (৭টি compile error); data থাকলেও Failure দেওয়া, ফলে status false; সফল register-এ duplicate-এর বার্তা দেওয়া।",
    decisionEn:
      "An envelope is helpful for front ends, but keep correct HTTP status codes too: tools, proxies and monitoring read them. For errors, ProblemDetails is the web standard; you can include it inside your envelope or use it directly for 4xx and 5xx.",
    decisionBn:
      "Front end-এর জন্য খাম উপকারী, তবে সঠিক HTTP status code-ও দিন: tool, proxy ও monitoring সেগুলো পড়ে। Error-এর মানদণ্ড ProblemDetails; খামের ভেতরে রাখতে পারেন বা 4xx ও 5xx-এ সরাসরি দিতে পারেন।",
    examples: [
      consoleEx(
        "1. One template, many types · এক ছাঁচ, অনেক type",
        `using System.Text.Json;

var opts = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
Console.WriteLine(JsonSerializer.Serialize(ResponseResult<string>.Failure("This User Not Exist, Please Login"), opts));
Console.WriteLine(JsonSerializer.Serialize(ResponseResult<List<string>>.Success(new() { "Asha", "Rafi" }, "Data Found"), opts));
Console.WriteLine(JsonSerializer.Serialize(ResponseResult<TokenDto>.Success(new TokenDto("eyJ..."), "Login Successful"), opts));

public record TokenDto(string Token);

public class ResponseResult<T>
{
    public T? Data { get; set; }
    public string? Message { get; set; }
    public bool Status { get; set; }

    public static ResponseResult<T> Success(T? data, string message) =>
        new() { Data = data, Message = message, Status = true };

    public static ResponseResult<T> Failure(string message, T? data = default) =>
        new() { Data = data, Message = message, Status = false };
}`,
        '{"data":null,"message":"This User Not Exist, Please Login","status":false}\n{"data":["Asha","Rafi"],"message":"Data Found","status":true}\n{"data":{"token":"eyJ..."},"message":"Login Successful","status":true}',
      ),
      webEx(
        "2. Same envelope from every endpoint · প্রতিটি endpoint-এ একই খাম",
        `var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
var names = new List<string> { "Asha" };

app.MapGet("/api/employees", () =>
    Results.Ok(ResponseResult<List<string>>.Success(names, "Data Found")));

app.MapGet("/api/employees/{index:int}", (int index) =>
    index < names.Count
        ? Results.Ok(ResponseResult<string>.Success(names[index], "Data Found"))
        : Results.NotFound(ResponseResult<string>.Failure("Data Not Found")));
app.Run();

public class ResponseResult<T>
{
    public T? Data { get; set; }
    public string? Message { get; set; }
    public bool Status { get; set; }
    public static ResponseResult<T> Success(T? data, string message) => new() { Data = data, Message = message, Status = true };
    public static ResponseResult<T> Failure(string message) => new() { Message = message };
}`,
        "curl -k https://localhost:5001/api/employees\ncurl -k -i https://localhost:5001/api/employees/5",
      ),
      refEx(
        "3. Controller using the envelope · খাম ব্যবহার করা controller",
        `[HttpPost("Login")]
public async Task<IActionResult> Login(UserDto userDto)
{
    var (code, message, token) = await _authService.LoginUser(userDto);
    return code switch
    {
        LoginStatus.NotFound => NotFound(ResponseResult<string>.Failure(message)),
        LoginStatus.BadPassword => Unauthorized(ResponseResult<string>.Failure(message)),
        _ => Ok(ResponseResult<TokenDto>.Success(token, message)),
    };
}

public enum LoginStatus { NotFound, BadPassword, Ok }`,
        "The enum replaces the 0/1/2 tuple codes recommended in the notebook's best-practice chapter.",
        "নোটবুকের best-practice অধ্যায়ের মতো ০/১/২ tuple code-এর বদলে enum।",
      ),
    ],
  },

  "Register & Password Hashing": {
    en: "A password hash function turns 'secret123' into a fixed-length fingerprint. A random salt is mixed in, so two users with the same password get different hashes, and many iterations make guessing slow. PasswordHasher<T> stores version, algorithm, iteration count, salt and hash together in one Base64 string that starts with AQAAAA.",
    bn: "Password hash function 'secret123'-কে নির্দিষ্ট দৈর্ঘ্যের ছাপে পরিণত করে। Random salt মেশানো হয়, তাই একই password-এর দুই user ভিন্ন hash পায়; অনেকবার iteration অনুমান ধীর করে। PasswordHasher<T> version, algorithm, iteration, salt ও hash একসাথে একটি Base64 string-এ রাখে যা AQAAAA দিয়ে শুরু।",
    theoryEn:
      "Encryption can be reversed with a key; hashing cannot. If your database leaks, attackers get only hashes, and with salt plus slow PBKDF2 each guess costs real time. Register flow: check the email is free, hash the password, save the user with the default role User. Login flow: find the user by email, VerifyHashedPassword, then issue a token or cookie.",
    theoryBn:
      "Encryption key দিয়ে উল্টানো যায়; hashing যায় না। Database ফাঁস হলে attacker শুধু hash পায়, salt আর ধীর PBKDF2-এর কারণে প্রতিটি অনুমানে সময় লাগে। Register: email খালি কি না দেখা, password hash, default role User সহ save। Login: email দিয়ে user খোঁজা, VerifyHashedPassword, তারপর token বা cookie।",
    storyEn:
      "A bakery never writes your secret cake recipe in the order book. It writes the cake's weight after baking. To check a claim later, it bakes again with your recipe and compares the weight. Nobody can get the recipe back from the weight.",
    storyBn:
      "বেকারি আপনার গোপন কেকের রেসিপি খাতায় লেখে না, লেখে বেক করার পর ওজন। পরে যাচাই করতে আবার রেসিপি দিয়ে বেক করে ওজন মেলায়। ওজন থেকে কেউ রেসিপি ফেরত পায় না।",
    steps: [
      ["Reject the request if the email already exists (409).", "Email আগে থেকে থাকলে বাতিল (409)।"],
      ["Hash the password with PasswordHasher<AccountUser>.", "PasswordHasher<AccountUser> দিয়ে hash করুন।"],
      ["Save the user with Role = \"User\".", "Role = \"User\" সহ user save করুন।"],
      ["At login, VerifyHashedPassword and handle SuccessRehashNeeded.", "Login-এ VerifyHashedPassword ও SuccessRehashNeeded সামলান।"],
    ],
    mistakesEn:
      "Comparing user.Password == dto.Password after hashing always fails. Calling SaveChanges() synchronously inside async code blocks a thread. Users created before hashing was added cannot log in, because their stored value is plain text.",
    mistakesBn:
      "Hash করার পর user.Password == dto.Password তুলনা সবসময় ব্যর্থ। Async কোডে synchronous SaveChanges() thread আটকায়। Hashing-এর আগে তৈরি user login করতে পারবে না, কারণ তাদের মান plain text।",
    decisionEn:
      "For real products consider ASP.NET Core Identity: it adds lockout, email confirmation, 2FA and role tables on top of the same hasher. Never let the client choose its role during registration; promote users to Admin through a protected admin endpoint or a seed.",
    decisionBn:
      "আসল product-এ ASP.NET Core Identity ভাবুন: একই hasher-এর উপর lockout, email confirmation, 2FA ও role table দেয়। Register-এ client-কে role বাছতে দেবেন না; Admin বানানো হবে সুরক্ষিত admin endpoint বা seed দিয়ে।",
    examples: [
      consoleEx(
        "1. Hash, verify, and see the salt · hash, যাচাই ও salt",
        `using Microsoft.AspNetCore.Identity;

var hasher = new PasswordHasher<User>();
var user = new User { Email = "asha@example.com" };
string h1 = hasher.HashPassword(user, "secret123");
string h2 = hasher.HashPassword(user, "secret123");

Console.WriteLine($"Starts with AQAAAA: {h1.StartsWith("AQAAAA")}");
Console.WriteLine($"Same password, same hash? {h1 == h2}");
Console.WriteLine(hasher.VerifyHashedPassword(user, h1, "secret123"));
Console.WriteLine(hasher.VerifyHashedPassword(user, h1, "wrong"));

public class User { public string Email { get; set; } = ""; }`,
        "Starts with AQAAAA: True\nSame password, same hash? False\nSuccess\nFailed",
        ["Microsoft.Extensions.Identity.Core"],
      ),
      webEx(
        "2. Register and login endpoints · register ও login endpoint",
        `using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<IPasswordHasher<AccountUser>, PasswordHasher<AccountUser>>();
var app = builder.Build();
var users = new List<AccountUser>();

app.MapPost("/api/auth/register", (UserDto dto, IPasswordHasher<AccountUser> hasher) =>
{
    if (users.Any(u => u.Email == dto.Email)) return Results.Conflict("Email already registered");
    var user = new AccountUser { Email = dto.Email, Role = "User" };
    user.Password = hasher.HashPassword(user, dto.Password);
    users.Add(user);
    return Results.Ok(new { message = "User Registered Successfully!", storedValue = user.Password[..12] + "..." });
});

app.MapPost("/api/auth/login", (UserDto dto, IPasswordHasher<AccountUser> hasher) =>
{
    var user = users.FirstOrDefault(u => u.Email == dto.Email);
    if (user is null || hasher.VerifyHashedPassword(user, user.Password, dto.Password) == PasswordVerificationResult.Failed)
        return Results.Unauthorized();   // same answer for both cases
    return Results.Ok(new { message = "Login Successful", user.Role });
});
app.Run();

public record UserDto(string Email, string Password);
public class AccountUser
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
    public string Role { get; set; } = "User";
}`,
        'curl -k -X POST https://localhost:5001/api/auth/register -H "Content-Type: application/json" -d "{\\"email\\":\\"asha@example.com\\",\\"password\\":\\"secret123\\"}"\ncurl -k -X POST https://localhost:5001/api/auth/login -H "Content-Type: application/json" -d "{\\"email\\":\\"asha@example.com\\",\\"password\\":\\"secret123\\"}"',
        ["Microsoft.Extensions.Identity.Core"],
      ),
      refEx(
        "3. AuthService.RegisterUser and LoginUser · AuthService",
        `public async Task<(int, string)> RegisterUser(UserDto dto)
{
    if (await _db.AccountUsers.AnyAsync(u => u.Email == dto.Email))
        return (0, "User Already Exist");

    var user = new AccountUser { Id = Guid.NewGuid(), Email = dto.Email, Name = dto.Name, Role = "User" };
    user.Password = new PasswordHasher<AccountUser>().HashPassword(user, dto.Password);
    await _db.AccountUsers.AddAsync(user);
    await _db.SaveChangesAsync();
    return (1, "User Registered Successfully!");
}

public async Task<(int, string, TokenDto?)> LoginUser(UserDto dto)
{
    var user = await _db.AccountUsers.FirstOrDefaultAsync(u => u.Email == dto.Email);
    if (user is null) return (0, "Invalid email or password", null);

    var hasher = new PasswordHasher<AccountUser>();
    var result = hasher.VerifyHashedPassword(user, user.Password, dto.Password);
    if (result == PasswordVerificationResult.Failed) return (2, "Invalid email or password", null);

    if (result == PasswordVerificationResult.SuccessRehashNeeded)
    {
        user.Password = hasher.HashPassword(user, dto.Password);
        await _db.SaveChangesAsync();   // async, fixed from the notebook
    }
    return (1, "Login Successful", new TokenDto { Token = GetJwtToken(user) });
}`,
        "Fixed version of the notebook's AuthService: correct success message, async save, and one shared message for unknown user and wrong password.",
        "নোটবুকের AuthService-এর সংশোধিত রূপ: সঠিক সফল বার্তা, async save, আর অজানা user ও ভুল password-এ একই বার্তা।",
      ),
    ],
  },

  "CRUD with EF Core": {
    en: "EF Core's change tracker remembers the original values of every entity it loaded. When you change a property and call SaveChangesAsync, it compares old and new values and sends only an UPDATE for changed columns. Add marks an entity Added (INSERT), Remove marks it Deleted (DELETE). Nothing touches the database until SaveChangesAsync.",
    bn: "EF Core-এর change tracker load করা প্রতিটি entity-র আসল মান মনে রাখে। Property বদলে SaveChangesAsync ডাকলে পুরনো ও নতুন মান তুলনা করে শুধু বদলানো column-এর UPDATE পাঠায়। Add মানে Added (INSERT), Remove মানে Deleted (DELETE)। SaveChangesAsync-এর আগে database-এ কিছুই যায় না।",
    theoryEn:
      "The Employee service in the notebook follows a pattern worth memorising. Create: check duplicate, map DTO to entity, Add, Save. Read all: AsNoTracking, project to DTO. Read one: FindAsync or FirstOrDefaultAsync, 404 if null. Update: load by Id, change fields, set LastModifiedDate, Save. Delete: load, Remove, Save. Every database call is async so the web server thread is free while SQL Server works.",
    theoryBn:
      "নোটবুকের Employee service-এর একটি ধরন মনে রাখার মতো। Create: duplicate দেখা, DTO থেকে entity, Add, Save। সব পড়া: AsNoTracking, DTO-তে projection। একটি পড়া: FindAsync বা FirstOrDefaultAsync, null হলে 404। Update: Id দিয়ে load, field বদল, LastModifiedDate, Save। Delete: load, Remove, Save। প্রতিটি database call async, যাতে SQL Server কাজ করার সময় server thread মুক্ত থাকে।",
    storyEn:
      "A librarian edits a book card with a pencil: she takes the card out (load), erases and rewrites the title (modify), and puts it back (save). If she wrote a brand new card instead, the catalogue would have two cards for one book.",
    storyBn:
      "লাইব্রেরিয়ান পেন্সিল দিয়ে বইয়ের কার্ড সংশোধন করেন: কার্ড বের করেন (load), নাম মুছে আবার লেখেন (modify), ফেরত রাখেন (save)। নতুন কার্ড লিখলে এক বইয়ের দুটি কার্ড হয়ে যেত।",
    steps: [
      ["Create: check duplicates, Add, SaveChangesAsync.", "Create: duplicate দেখা, Add, SaveChangesAsync।"],
      ["Read: AsNoTracking and Select into DTOs.", "Read: AsNoTracking ও DTO-তে Select।"],
      ["Update: FindAsync by Id, modify, SaveChangesAsync.", "Update: Id দিয়ে FindAsync, বদল, SaveChangesAsync।"],
      ["Delete: FindAsync, Remove, SaveChangesAsync; 404 if missing.", "Delete: FindAsync, Remove, Save; না থাকলে 404।"],
    ],
    mistakesEn:
      "Notebook bugs: Update first called AddAsync (inserted duplicates); GetAll returned Failure while data existed; Delete returned code 0 on success; GetById used int instead of Guid and said 'Data Not Found' on success. Each one is a reminder to test the happy path and the failure path.",
    mistakesBn:
      "নোটবুকের bug: Update-এ AddAsync (duplicate ঢুকেছে); data থাকা সত্ত্বেও GetAll Failure দিয়েছে; Delete সফল হলেও code 0; GetById-এ Guid-এর বদলে int এবং সফল হলে 'Data Not Found'। প্রতিটি মনে করিয়ে দেয়: সফল ও ব্যর্থ দুই পথই test করুন।",
    decisionEn:
      "Add paging (Skip/Take) before lists grow. For 'update without loading' use ExecuteUpdateAsync / ExecuteDeleteAsync (EF Core 7+), which run one SQL statement. Consider soft delete (IsDeleted flag plus a global query filter) when records must be recoverable.",
    decisionBn:
      "List বড় হওয়ার আগে paging (Skip/Take) দিন। Load ছাড়া update-এ ExecuteUpdateAsync / ExecuteDeleteAsync (EF Core 7+) এক SQL-এ চলে। Record ফেরত আনার দরকার হলে soft delete (IsDeleted ও global query filter)।",
    examples: [
      consoleEx(
        "1. Watch the change tracker · change tracker দেখুন",
        `using Microsoft.EntityFrameworkCore;

using var db = new Ctx();
db.Database.EnsureDeleted(); db.Database.EnsureCreated();

var e = new Employee { Name = "Asha" };
db.Employees.Add(e);
Console.WriteLine($"After Add: {db.Entry(e).State}");
await db.SaveChangesAsync();
Console.WriteLine($"After Save: {db.Entry(e).State}");
e.Name = "Asha Rahman";
db.ChangeTracker.DetectChanges();
Console.WriteLine($"After edit: {db.Entry(e).State}");
await db.SaveChangesAsync();
db.Employees.Remove(e);
Console.WriteLine($"After Remove: {db.Entry(e).State}");
await db.SaveChangesAsync();
Console.WriteLine($"Rows left: {await db.Employees.CountAsync()}");

public class Employee { public int Id { get; set; } public string Name { get; set; } = ""; }
public class Ctx : DbContext
{
    public DbSet<Employee> Employees => Set<Employee>();
    protected override void OnConfiguring(DbContextOptionsBuilder o) => o.UseSqlite("Data Source=crud.db");
}`,
        "After Add: Added\nAfter Save: Unchanged\nAfter edit: Modified\nAfter Remove: Deleted\nRows left: 0",
        ["Microsoft.EntityFrameworkCore.Sqlite"],
      ),
      webEx(
        "2. Complete CRUD API with SQLite · SQLite সহ সম্পূর্ণ CRUD",
        `using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDb>(o => o.UseSqlite("Data Source=employees.db"));
var app = builder.Build();
using (var s = app.Services.CreateScope()) s.ServiceProvider.GetRequiredService<AppDb>().Database.EnsureCreated();

var api = app.MapGroup("/api/employees");
api.MapGet("/", async (AppDb db) => await db.Employees.AsNoTracking().ToListAsync());
api.MapGet("/{id:guid}", async (Guid id, AppDb db) =>
    await db.Employees.FindAsync(id) is { } e ? Results.Ok(e) : Results.NotFound());
api.MapPost("/", async (EmployeeInput input, AppDb db) =>
{
    if (await db.Employees.AnyAsync(x => x.Email == input.Email)) return Results.Conflict("Email exists");
    var e = new Employee { Id = Guid.NewGuid(), Name = input.Name, Email = input.Email };
    db.Employees.Add(e);
    await db.SaveChangesAsync();
    return Results.Created($"/api/employees/{e.Id}", e);
});
api.MapPut("/{id:guid}", async (Guid id, EmployeeInput input, AppDb db) =>
{
    var e = await db.Employees.FindAsync(id);
    if (e is null) return Results.NotFound();
    e.Name = input.Name; e.Email = input.Email; e.LastModifiedDate = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.NoContent();
});
api.MapDelete("/{id:guid}", async (Guid id, AppDb db) =>
    await db.Employees.Where(x => x.Id == id).ExecuteDeleteAsync() == 0 ? Results.NotFound() : Results.NoContent());
app.Run();

public record EmployeeInput(string Name, string Email);
public class Employee
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public DateTime? LastModifiedDate { get; set; }
}
public class AppDb(DbContextOptions<AppDb> o) : DbContext(o)
{
    public DbSet<Employee> Employees => Set<Employee>();
}`,
        'curl -k -X POST https://localhost:5001/api/employees -H "Content-Type: application/json" -d "{\\"name\\":\\"Asha\\",\\"email\\":\\"asha@example.com\\"}"\ncurl -k https://localhost:5001/api/employees\n# copy an id, then PUT and DELETE it',
        ["Microsoft.EntityFrameworkCore.Sqlite"],
      ),
      refEx(
        "3. EmployeeService (fixed notebook version) · সংশোধিত EmployeeService",
        `public async Task<(int, string)> UpdateEmployee(Guid id, EmployeeDto dto)
{
    var employee = await _db.Employees.FindAsync(id);          // load, never AddAsync
    if (employee is null) return (0, "Employee Not Found");

    employee.Name = dto.Name;
    employee.EmailAddress = dto.EmailAddress;
    employee.Department = dto.Department;
    employee.LastModifiedDate = DateTime.UtcNow;
    await _db.SaveChangesAsync();
    return (1, "Employee Updated Successfully");
}

public async Task<(int, string)> DeleteEmployee(Guid id)
{
    var employee = await _db.Employees.FindAsync(id);
    if (employee is null) return (0, "Employee Not Found");
    _db.Employees.Remove(employee);
    await _db.SaveChangesAsync();
    return (1, "Employee Deleted Successfully");               // 1 = success
}

public async Task<(int, string, EmployeeDto?)> GetEmployeeById(Guid id)
{
    var e = await _db.Employees.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
    return e is null ? (0, "Data Not Found", null) : (1, "Data Found", e.ToDto());
}`,
        "The notebook's service after the fixes listed in its Bugs & Best Practices chapter.",
        "নোটবুকের Bugs & Best Practices অধ্যায়ের সংশোধনের পর service।",
      ),
    ],
  },
};

const raw = { ...partOne, ...partTwo };

function normalise(topic, c) {
  return {
    en: c.en,
    bn: c.bn,
    decisionEn: c.decisionEn,
    decisionBn: c.decisionBn,
    beginnerDotNet: true,
    group: "aspnet",
    canonicalKey: topic,
    extraSections: [
      {
        id: "easy-story",
        title: "A tiny tea-shop story · অতি সহজ তুলনা",
        en: c.storyEn,
        bn: c.storyBn,
      },
      {
        id: "simple-theory",
        title: "Theory in plain words · সহজ ভাষায় তত্ত্ব",
        en: c.theoryEn,
        bn: c.theoryBn,
      },
      {
        id: "dotnet-steps",
        title: "Follow the C# flow · C#-এর ধাপ ধরে পড়ুন",
        en: "Do these four steps in order. Then run the console example to see the idea in isolation, the ASP.NET Core program to see it behind HTTP, and read the project file to see how it fits a real codebase.",
        bn: "এই চারটি ধাপ ক্রমানুসারে করুন। তারপর console উদাহরণে ধারণাটি আলাদাভাবে, ASP.NET Core program-এ HTTP-এর পিছনে, আর project file-এ আসল codebase-এ কীভাবে বসে তা দেখুন।",
        steps: c.steps.map(([en, bn]) => ({ en, bn })),
      },
      {
        id: "common-mistakes",
        title: "Common mistakes and fixes · সাধারণ ভুল ও সমাধান",
        en: c.mistakesEn,
        bn: c.mistakesBn,
      },
    ],
    examples: c.examples,
  };
}

export const aspnetChapters = Object.fromEntries(
  Object.entries(raw).map(([k, v]) => [k, normalise(k, v)]),
);

export function buildAspnetChapter(lesson) {
  const chapter = aspnetChapters[lesson.topic];
  if (!chapter) throw new Error("Missing ASP.NET chapter: " + lesson.topic);
  return chapter;
}

// Extra depth for the existing Backend Engineering lessons.
const bonus = {
  "Security & Authentication": {
    section: {
      id: "role-bonus",
      title: "Go further: roles and policies · আরও এগিয়ে: role ও policy",
      en: "Authentication proves identity; authorization decides access. In ASP.NET Core put the user's role in a claim at login, protect endpoints with [Authorize(Roles = \"Admin\")] for simple cases, and move to named policies when a rule needs claims or data. Expect 401 when no identity exists and 403 when the identity lacks permission. See the new lessons 'Role-Based Authorization' and 'Policy & Claims Authorization' in this module.",
      bn: "Authentication পরিচয় প্রমাণ করে; authorization অনুমতি ঠিক করে। Login-এ user-এর role claim-এ রাখুন, সহজ ক্ষেত্রে [Authorize(Roles = \"Admin\")], আর নিয়মে claim বা data লাগলে নামযুক্ত policy। পরিচয় না থাকলে 401, অনুমতি না থাকলে 403। এই module-এর নতুন lesson 'Role-Based Authorization' ও 'Policy & Claims Authorization' দেখুন।",
    },
    topic: "Role-Based Authorization",
  },
  "API Design": {
    section: {
      id: "envelope-bonus",
      title: "Go further: a consistent response envelope · একই রকম response",
      en: "Clients are happier when every endpoint answers with the same JSON shape. A generic ResponseResult<T> with Data, Message and Status, built through static Success and Failure factories, keeps responses predictable while HTTP status codes still describe the outcome. See the new lesson 'Generic Response Model'.",
      bn: "প্রতিটি endpoint একই আকারের JSON দিলে client খুশি থাকে। Data, Message, Status সহ generic ResponseResult<T>, static Success ও Failure factory দিয়ে বানানো, response অনুমেয় রাখে, আর HTTP status code ফলাফল বলে। নতুন lesson 'Generic Response Model' দেখুন।",
    },
    topic: "Generic Response Model",
  },
  "Backend Architecture": {
    section: {
      id: "layers-bonus",
      title: "Go further: the layered ASP.NET Core project · স্তরভিত্তিক project",
      en: "A beginner-friendly structure: Controllers (HTTP only), DTOs (shapes on the wire), Services behind interfaces (business rules), Data with AppDbContext and Entities (persistence), and a GenericResponse folder. Dependency injection wires the layers so each can be tested alone. The new lessons from 'ASP.NET Core Web API Setup' to 'CRUD with EF Core' build exactly this project.",
      bn: "নতুনদের জন্য সহজ গঠন: Controllers (শুধু HTTP), DTOs (তারের উপর data-র আকার), interface-এর পিছনে Services (business rule), AppDbContext ও Entities সহ Data (সংরক্ষণ), আর GenericResponse folder। DI স্তরগুলো জোড়ে, ফলে প্রতিটি আলাদাভাবে test করা যায়। 'ASP.NET Core Web API Setup' থেকে 'CRUD with EF Core' পর্যন্ত নতুন lesson ঠিক এই project বানায়।",
    },
    topic: "Services, Interfaces & DI",
  },
};

export function enrichExisting(lesson, chapter) {
  const extra = bonus[lesson.topic];
  if (!extra) return chapter;
  const linked = aspnetChapters[extra.topic];
  return {
    ...chapter,
    extraSections: [...(chapter.extraSections || []), extra.section],
    examples: [...chapter.examples, ...(linked ? linked.examples.slice(1, 2) : [])],
  };
}
