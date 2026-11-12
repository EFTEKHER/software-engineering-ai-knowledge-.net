// ASP.NET Core backend track (Web API + MVC cookie auth + authorization).
// Each lesson line uses "code ~~ English / বাংলা" so the reader can annotate it.
export const aspnetTopics = [
  "ASP.NET Core Web API Setup",
  "EF Core Entities & DbContext",
  "EF Core Migrations",
  "Controllers & Routing",
  "Services, Interfaces & DI",
  "DTOs & Model Validation",
  "Generic Response Model",
  "Register & Password Hashing",
  "CRUD with EF Core",
  "JWT Authentication (Web API)",
  "Role-Based Authorization",
  "Policy & Claims Authorization",
  "MVC Pattern & Razor Views",
  "JWT in Cookie (MVC)",
  "Built-in Cookie Authentication",
  "CSRF & Secure Cookies",
  "Global Error Handling",
  "Refresh Tokens & Logout",
];

export const aspnetConcepts = {};
function add(name, en, bn, code, flow, caution, deep) {
  aspnetConcepts[name] = {
    en,
    bn,
    code,
    flow: flow.split(" > "),
    caution,
    deep,
    aspnet: true,
  };
}

add(
  "ASP.NET Core Web API Setup",
  "An ASP.NET Core Web API is a program that listens for HTTP requests and answers with JSON. Program.cs has two halves: first you register services (things the app needs), then you build the middleware pipeline (the steps every request walks through).",
  "Web API হলো এমন একটি program যা HTTP request শোনে আর JSON-এ উত্তর দেয়। Program.cs-এর দুই ভাগ: আগে service register (app-এর যা লাগবে), তারপর middleware pipeline (প্রতিটি request যে ধাপগুলো পার হয়)।",
  `var builder = WebApplication.CreateBuilder(args); ~~ Create the host with config, logging and DI. / Config, logging ও DI সহ host তৈরি।
builder.Services.AddControllers(); ~~ Register MVC controllers for the API. / API-এর controller register।
builder.Services.AddEndpointsApiExplorer(); ~~ Let Swagger discover endpoints. / Swagger যেন endpoint খুঁজে পায়।
builder.Services.AddSwaggerGen(); ~~ Generate the OpenAPI document. / OpenAPI document তৈরি।
var app = builder.Build(); ~~ Freeze services and build the app. / Service ঠিক করে app বানানো।
if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); } ~~ Show Swagger only in development. / শুধু development-এ Swagger।
app.UseHttpsRedirection(); ~~ Redirect HTTP to HTTPS. / HTTP থেকে HTTPS-এ পাঠানো।
app.MapControllers(); ~~ Connect controller routes to the pipeline. / Controller route যুক্ত করা।
app.Run(); ~~ Start listening for requests. / Request শোনা শুরু।`,
  "Register services > Build app > Middleware pipeline > Map controllers > Run",
  "Swagger needs the Swashbuckle.AspNetCore package. In .NET 9+ templates you may see AddOpenApi() instead; the idea is the same.",
  "Order matters: anything registered after builder.Build() is too late, and middleware runs in the order you write it. Keep Program.cs thin by moving registrations into extension methods once it grows.",
);

add(
  "EF Core Entities & DbContext",
  "An entity is a plain C# class that becomes a database table. DbContext is the bridge between C# and the database: each DbSet<T> property is a table you can query with LINQ.",
  "Entity হলো সাধারণ C# class যা database-এ table হয়। DbContext হলো C# আর database-এর সেতু: প্রতিটি DbSet<T> একটি table, যাকে LINQ দিয়ে query করা যায়।",
  `public class Employee { public Guid Id { get; set; } public string Name { get; set; } = string.Empty; } ~~ An entity: properties become columns. / Entity: property হয় column।
public class AppDbContext : DbContext ~~ Our bridge to the database. / Database-এর সেতু।
{ public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { } ~~ Options (provider, connection) come from DI. / Option আসে DI থেকে।
  public DbSet<Employee> Employees => Set<Employee>(); } ~~ Employees table, queryable with LINQ. / Employees table, LINQ দিয়ে query।
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlServer(builder.Configuration.GetConnectionString("Default"))); ~~ Register with a scoped lifetime. / Scoped lifetime-এ register।
"ConnectionStrings": { "Default": "Server=.;Database=MyFirstApi;Trusted_Connection=True;TrustServerCertificate=True" } ~~ appsettings.json holds the connection string. / appsettings.json-এ connection string।`,
  "C# entity > DbSet table > DbContext > SQL Server",
  "Needs Microsoft.EntityFrameworkCore.SqlServer (and .Tools for migrations). Never commit a production password inside appsettings.json.",
  "AddDbContext registers the context as Scoped: one instance per HTTP request. Never store a DbContext in a singleton; it is not thread-safe.",
);

add(
  "EF Core Migrations",
  "A migration is a C# file that describes how to change the database schema. You change your entity classes, create a migration, then apply it, and EF Core writes the SQL for you.",
  "Migration হলো একটি C# file যা বলে database schema কীভাবে বদলাবে। Entity বদলান, migration বানান, তারপর apply করুন — SQL EF Core নিজেই লেখে।",
  `dotnet tool install --global dotnet-ef ~~ Install the EF command-line tool once. / একবার EF tool install।
dotnet ef migrations add InitialCreate ~~ Compare model with snapshot and write a migration. / Model তুলনা করে migration লেখা।
dotnet ef database update ~~ Apply pending migrations to the database. / বাকি migration database-এ চালানো।
dotnet ef migrations add AddEmployeeEmail ~~ After adding a property, create the next migration. / নতুন property-র পর পরের migration।
dotnet ef migrations remove ~~ Undo the last migration if it was not applied yet. / Apply না হলে শেষ migration মুছুন।
dotnet ef migrations script --idempotent -o deploy.sql ~~ Produce reviewable SQL for production. / Production-এর জন্য SQL script।`,
  "Change entity > Add migration > Review file > Database update",
  "Package Manager Console users can run Add-Migration and Update-Database instead. The project must reference Microsoft.EntityFrameworkCore.Design.",
  "Always open and read the generated migration: a renamed property can appear as drop-and-add, which deletes data. In production prefer reviewed SQL scripts over running database update from a laptop.",
);

add(
  "Controllers & Routing",
  "A controller is a class that groups related endpoints. Attributes decide which URL and HTTP verb reach which method, and the return type (IActionResult) decides the status code.",
  "Controller হলো সম্পর্কিত endpoint-এর দল। Attribute ঠিক করে কোন URL ও HTTP verb কোন method-এ যাবে, আর IActionResult ঠিক করে status code।",
  `[ApiController] ~~ Automatic 400 on invalid models and smarter binding. / Invalid model-এ নিজে 400।
[Route("api/[controller]")] ~~ [controller] becomes "Employee" from EmployeeController. / [controller] এখানে Employee হয়।
public class EmployeeController : ControllerBase ~~ ControllerBase: API without Razor views. / View ছাড়া API base class।
{ [HttpGet("GetAllEmployees")] public IActionResult GetAll() => Ok(new[] { "Asha", "Rafi" }); ~~ GET api/Employee/GetAllEmployees returns 200. / GET করলে 200।
  [HttpGet("{id:guid}")] public IActionResult GetById(Guid id) => id == Guid.Empty ? NotFound() : Ok(id); ~~ Route constraint guid; 404 when missing. / guid constraint; না পেলে 404।
  [HttpPost] public IActionResult Create(string name) => CreatedAtAction(nameof(GetById), new { id = Guid.NewGuid() }, name); } ~~ 201 Created with a Location header. / 201 Created ও Location header।`,
  "HTTP request > Route match > Model binding > Action > IActionResult",
  "Route templates are case-insensitive. The route constraint is written {id:guid}, not {Guid:id}, a typo found in the notebook.",
  "Prefer resource-style routes (GET api/employees/{id}) over verb names in URLs for public APIs; the notebook uses action names because they are easy to read while learning.",
);

add(
  "Services, Interfaces & DI",
  "Controllers should only handle HTTP. Business logic lives in a service class behind an interface, and ASP.NET Core's dependency injection (DI) creates the service and passes it into the controller's constructor.",
  "Controller শুধু HTTP সামলাবে। আসল কাজ থাকবে interface-এর পিছনে service class-এ। DI নিজে service বানিয়ে controller-এর constructor-এ দিয়ে দেয়।",
  `public interface IEmployeeService { Task<List<string>> GetAllAsync(); } ~~ The contract: what, not how. / চুক্তি: কী করবে, কীভাবে নয়।
public class EmployeeService : IEmployeeService { public Task<List<string>> GetAllAsync() => Task.FromResult(new List<string> { "Asha" }); } ~~ One implementation of the contract. / চুক্তির একটি বাস্তবায়ন।
builder.Services.AddScoped<IEmployeeService, EmployeeService>(); ~~ When IEmployeeService is asked for, create EmployeeService per request. / প্রতি request-এ নতুন service।
public class EmployeeController(IEmployeeService service) : ControllerBase ~~ Constructor injection (primary constructor). / Constructor দিয়ে inject করা।
{ [HttpGet] public async Task<IActionResult> Get() => Ok(await service.GetAllAsync()); } ~~ Controller delegates the work to the service. / কাজ service-কে দেওয়া।`,
  "Request > Controller created > DI resolves IEmployeeService > Service runs > Response",
  "If you forget AddScoped you get 'Unable to resolve service for type IEmployeeService' at runtime, not at compile time.",
  "Lifetimes: Singleton (one for the app), Scoped (one per request, use for DbContext and most services), Transient (new every time). Never inject a Scoped service into a Singleton.",
);

add(
  "DTOs & Model Validation",
  "A DTO (Data Transfer Object) is the shape of data that crosses the API boundary. It hides internal fields like PasswordHash, and validation attributes on it let [ApiController] reject bad input with 400 automatically.",
  "DTO হলো API-র সীমানা পার হওয়া data-র আকার। এটি PasswordHash-এর মতো ভেতরের field লুকায়, আর validation attribute থাকলে [ApiController] নিজে 400 দেয়।",
  `public class UserDto ~~ What the client is allowed to send. / Client যা পাঠাতে পারবে।
{ [Required, EmailAddress] public string Email { get; set; } = string.Empty; ~~ Must exist and look like an email. / থাকতেই হবে, email আকারে।
  [Required, MinLength(6)] public string Password { get; set; } = string.Empty; } ~~ At least six characters. / কমপক্ষে ছয় অক্ষর।
[HttpPost("Register")] public IActionResult Register(UserDto dto) => Ok(dto.Email); ~~ Runs only when the DTO is valid. / DTO valid হলে তবেই চলে।
// Invalid body -> 400 with a ValidationProblemDetails JSON listing each error. ~~ No if-statements needed in the action. / Action-এ if লাগে না।`,
  "JSON body > Bind to DTO > Validate attributes > 400 or Action",
  "Validation attributes check format, not business rules. 'Email already registered' still belongs in the service.",
  "Use separate DTOs for input and output (CreateEmployeeDto, EmployeeDto). Mapping entity to DTO can be manual, a static method, or a library such as Mapster or AutoMapper.",
);

add(
  "Generic Response Model",
  "Every endpoint should return the same JSON envelope so the front end can always read data, message and status. A generic class ResponseResult<T> keeps one shape while T changes: a string, a list, or a token.",
  "সব endpoint একই JSON খাম ফেরত দিলে front end সবসময় data, message, status পড়তে পারে। Generic ResponseResult<T>-এ আকার একই থাকে, শুধু T বদলায়।",
  `public class ResponseResult<T> ~~ A normal class with a type parameter T. / T সহ সাধারণ class।
{ public T? Data { get; set; } public string? Message { get; set; } public bool Status { get; set; } ~~ The three fields of every response. / প্রতিটি response-এর তিন field।
  public static ResponseResult<T> Success(T? data, string message) => new() { Data = data, Message = message, Status = true }; ~~ Static factory for success. / সফলতার factory।
  public static ResponseResult<T> Failure(string message) => new() { Message = message, Status = false }; } ~~ Static factory for failure. / ব্যর্থতার factory।
return Ok(ResponseResult<List<EmployeeDto>>.Success(list, "Data Found")); ~~ Same envelope, T is a list. / একই খাম, T হলো list।`,
  "Service result > Wrap in ResponseResult<T> > Status code > Same JSON shape",
  "Do not make the class itself static: a static class cannot have instance properties, which caused seven compile errors in the notebook.",
  "The envelope does not replace HTTP status codes. Still return 404, 400, 401 and 409 correctly; the body only adds a friendly message.",
);

add(
  "Register & Password Hashing",
  "Never store passwords. Store a hash: a one-way, salted, slow fingerprint. At login you hash the typed password the same way and compare. ASP.NET Core's PasswordHasher<T> does this with PBKDF2.",
  "Password কখনো সংরক্ষণ করবেন না, রাখবেন hash: একমুখী, salt-যুক্ত, ধীর ছাপ। Login-এ দেওয়া password একইভাবে hash করে মেলানো হয়। PasswordHasher<T> PBKDF2 দিয়ে এটি করে।",
  `var hasher = new PasswordHasher<AccountUser>(); ~~ Built-in hasher from Microsoft.AspNetCore.Identity. / তৈরি-করা built-in hasher।
user.Password = hasher.HashPassword(user, dto.Password); ~~ Store "AQAAAA..." instead of the plain text. / Plain text নয়, hash রাখা।
var result = hasher.VerifyHashedPassword(user, user.Password, dto.Password); ~~ Re-hash the typed password and compare. / দেওয়া password মেলানো।
if (result == PasswordVerificationResult.Failed) return (2, "Wrong password"); ~~ Do not reveal which field was wrong in production. / Production-এ কোনটা ভুল বলবেন না।
if (result == PasswordVerificationResult.SuccessRehashNeeded) { user.Password = hasher.HashPassword(user, dto.Password); await db.SaveChangesAsync(); } ~~ Upgrade old hashes silently. / পুরনো hash আপগ্রেড।`,
  "Plain password > Salt + PBKDF2 > Store hash > Verify on login",
  "Hashing is not encryption: you cannot get the password back, and that is the point. Existing plain-text users cannot log in after you switch; reset or migrate them.",
  "Return the same message for 'user not found' and 'wrong password' to avoid account enumeration, and add rate limiting to the login endpoint.",
);

add(
  "CRUD with EF Core",
  "CRUD means Create, Read, Update, Delete. With EF Core you add or change tracked C# objects and call SaveChangesAsync once; EF Core turns the changes into INSERT, UPDATE or DELETE SQL.",
  "CRUD মানে Create, Read, Update, Delete। EF Core-এ C# object যোগ বা বদল করে একবার SaveChangesAsync ডাকলেই EF Core INSERT, UPDATE বা DELETE SQL লেখে।",
  `if (await db.Employees.AnyAsync(e => e.Email == dto.Email)) return (0, "Already exists"); ~~ Check duplicates first (409 later). / আগে duplicate দেখা।
db.Employees.Add(new Employee { Id = Guid.NewGuid(), Name = dto.Name, Email = dto.Email }); await db.SaveChangesAsync(); ~~ Create: INSERT. / তৈরি: INSERT।
var list = await db.Employees.AsNoTracking().ToListAsync(); ~~ Read: no tracking needed for display. / পড়া: tracking লাগে না।
var emp = await db.Employees.FindAsync(id); if (emp is null) return (0, "Not found"); ~~ Update step 1: load the row. / আপডেট ধাপ ১: row আনা।
emp.Name = dto.Name; emp.LastModifiedDate = DateTime.UtcNow; await db.SaveChangesAsync(); ~~ Update step 2: modify, then save. / ধাপ ২: বদলে save।
db.Employees.Remove(emp); await db.SaveChangesAsync(); ~~ Delete: DELETE. / মুছে ফেলা: DELETE।`,
  "Load or create entity > Change tracker > SaveChangesAsync > SQL",
  "Calling Add during an update inserts a duplicate row, a real bug from the notebook. Update means load, modify, save.",
  "Return 201 for create, 200 or 204 for update and delete, 404 when the id does not exist, and 409 for duplicates. Add a unique index on Email so the database also protects you.",
);

add(
  "JWT Authentication (Web API)",
  "A JWT is a signed pass with three parts: header, payload (claims) and signature. After login the API signs a token; the client sends it in the Authorization: Bearer header, and JwtBearer middleware checks the signature, issuer, audience and expiry.",
  "JWT হলো সিল-মারা পাস: header, payload (claim) আর signature। Login-এর পর API token sign করে, client সেটি Authorization: Bearer header-এ পাঠায়, JwtBearer middleware signature, issuer, audience ও মেয়াদ যাচাই করে।",
  `var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!)); ~~ Secret key from configuration, 32+ bytes. / Config থেকে secret key।
var claims = new[] { new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), new Claim(ClaimTypes.Email, user.Email), new Claim(ClaimTypes.Role, user.Role) }; ~~ Facts about the user, including role. / User সম্পর্কে তথ্য, role সহ।
var token = new JwtSecurityToken(config["Jwt:Issuer"], config["Jwt:Audience"], claims, expires: DateTime.UtcNow.AddMinutes(30), signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)); ~~ Build and sign. / তৈরি ও sign।
string jwt = new JwtSecurityTokenHandler().WriteToken(token); ~~ The "xxxxx.yyyyy.zzzzz" string. / তিন অংশের string।
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o => o.TokenValidationParameters = new() { ValidateIssuer = true, ValidateAudience = true, ValidateLifetime = true, ValidateIssuerSigningKey = true, ValidIssuer = config["Jwt:Issuer"], ValidAudience = config["Jwt:Audience"], IssuerSigningKey = key }); ~~ Validate every incoming token. / প্রতিটি token যাচাই।
app.UseAuthentication(); app.UseAuthorization(); ~~ Who are you, then what may you do. / আগে পরিচয়, পরে অনুমতি।`,
  "Login > Sign JWT > Bearer header > Validate > [Authorize] endpoint",
  "Needs Microsoft.AspNetCore.Authentication.JwtBearer. The payload is only Base64Url-encoded, not encrypted: anyone can read it at jwt.io, so never put secrets in claims.",
  "Default ClockSkew is 5 minutes, so a 1-minute token stays valid for about 6 minutes; set ClockSkew = TimeSpan.Zero when testing expiry. Keep access tokens short and use refresh tokens.",
);

add(
  "Role-Based Authorization",
  "Authentication answers 'who are you?'. Authorization answers 'what may you do?'. With roles, each user carries one or more role claims (Admin, Manager, User) and [Authorize(Roles = \"Admin\")] lets only those roles in. A missing token gives 401; a valid token with the wrong role gives 403.",
  "Authentication প্রশ্ন করে 'তুমি কে?'; Authorization প্রশ্ন করে 'তুমি কী করতে পারবে?'। প্রতিটি user-এর role claim থাকে (Admin, Manager, User), আর [Authorize(Roles = \"Admin\")] শুধু সেই role-কে ঢুকতে দেয়। Token না থাকলে 401, ভুল role হলে 403।",
  `public class AccountUser { public Guid Id { get; set; } public string Email { get; set; } = ""; public string Role { get; set; } = "User"; } ~~ Store a role per user; default is User. / প্রতি user-এর role, default User।
new Claim(ClaimTypes.Role, user.Role) ~~ Put the role into the JWT or cookie at login. / Login-এ role claim-এ রাখা।
[Authorize] public class EmployeeController : ControllerBase ~~ Every action needs a logged-in user. / সব action-এ login লাগবে।
[HttpGet] public IActionResult GetAll() => Ok(); ~~ Any authenticated role can read. / যেকোনো logged-in user পড়তে পারে।
[Authorize(Roles = "Admin,Manager")] [HttpPut("{id:guid}")] public IActionResult Update(Guid id) => NoContent(); ~~ Comma means OR: Admin or Manager. / কমা মানে OR।
[Authorize(Roles = "Admin")] [HttpDelete("{id:guid}")] public IActionResult Delete(Guid id) => NoContent(); ~~ Only Admin can delete; others get 403. / শুধু Admin মুছতে পারে।
if (User.IsInRole("Admin")) { /* show extra fields */ } ~~ Check roles inside code or Razor views. / কোড বা view-এ role দেখা।`,
  "Login > Role claim in token > [Authorize(Roles)] > 200 or 403",
  "Stacking two attributes means AND: [Authorize(Roles=\"Admin\")] plus [Authorize(Roles=\"Finance\")] requires both roles. Role names are compared exactly, so keep them in constants.",
  "Roles are coarse. When rules depend on data (only the owner may edit) or on several claims, move to policies and resource-based authorization. Role changes take effect only when a new token or cookie is issued.",
);

add(
  "Policy & Claims Authorization",
  "A policy is a named rule. It can require a role, a claim value, or custom logic in a handler. Endpoints refer to the policy by name, so the rule lives in one place and is easy to test and change.",
  "Policy হলো নাম দেওয়া একটি নিয়ম। এতে role, claim-এর মান বা handler-এ নিজস্ব logic থাকতে পারে। Endpoint শুধু নাম দিয়ে policy ডাকে, তাই নিয়ম এক জায়গায় থাকে।",
  `builder.Services.AddAuthorization(o => { ~~ Define named policies once. / একবার policy সংজ্ঞা।
  o.AddPolicy("AdminOnly", p => p.RequireRole("Admin")); ~~ Same as a role check, but named. / Role check, নাম সহ।
  o.AddPolicy("HRDepartment", p => p.RequireClaim("department", "HR")); ~~ Requires a claim with value HR. / department=HR claim লাগবে।
  o.AddPolicy("SeniorStaff", p => p.RequireAssertion(c => int.TryParse(c.User.FindFirst("level")?.Value, out var l) && l >= 3)); }); ~~ Custom logic inline. / নিজস্ব logic।
[Authorize(Policy = "HRDepartment")] [HttpGet("salaries")] public IActionResult Salaries() => Ok(); ~~ Endpoint refers to the rule by name. / নাম দিয়ে নিয়ম ব্যবহার।
app.MapDelete("/items/{id}", (int id) => Results.NoContent()).RequireAuthorization("AdminOnly"); ~~ Minimal APIs use RequireAuthorization. / Minimal API-তে একই policy।`,
  "Claims in token > Policy requirements > Handler decides > Allow or 403",
  "Claims must come from a trusted issuer. A client cannot add a claim to a signed token without breaking the signature.",
  "For 'only the owner may edit this order' use IAuthorizationService.AuthorizeAsync(User, order, \"OwnerPolicy\") with a resource-based handler, because the rule needs the loaded record.",
);

add(
  "MVC Pattern & Razor Views",
  "MVC splits a web app into Model (data), View (Razor HTML) and Controller (traffic police). The controller fetches data from the model and returns View(data); Razor turns C# data into HTML that the browser shows.",
  "MVC web app-কে তিন ভাগ করে: Model (data), View (Razor HTML), Controller (ট্রাফিক পুলিশ)। Controller model থেকে data এনে View(data) ফেরত দেয়; Razor সেটিকে HTML বানায়।",
  `builder.Services.AddControllersWithViews(); ~~ MVC with Razor views (not just API). / Razor view সহ MVC।
public class ProductController(AppDbContext db) : Controller ~~ Controller (not ControllerBase) can return views. / View দিতে Controller base।
{ public async Task<IActionResult> Index() => View(await db.Products.ToListAsync()); } ~~ Send a list of products to Views/Product/Index.cshtml. / Product list view-এ পাঠানো।
@model List<Product> ~~ Razor: declare the type the view receives. / View কোন type পাবে।
@foreach (var p in Model) { <tr><td>@p.Name</td><td>@p.Price</td></tr> } ~~ C# loop that writes HTML rows; @ output is HTML-encoded. / C# loop দিয়ে HTML row।
<a asp-action="Edit" asp-route-id="@p.Id">Edit</a> ~~ Tag helper builds /Product/Edit/5. / Tag helper URL বানায়।
app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}"); ~~ Conventional routing for MVC. / MVC-র default route।`,
  "Browser GET > Controller action > Model data > Razor view > HTML",
  "Inputs without a name attribute are not posted, and a form without asp-action posts to the wrong place: two classic MVC form bugs.",
  "Use ViewModels for views just like DTOs for APIs. ViewBag is for one request; TempData survives one redirect and is ideal for success messages after POST-Redirect-GET.",
);

add(
  "JWT in Cookie (MVC)",
  "Browsers do not add an Authorization header by themselves, but they do send cookies automatically. So the MVC tutorial stores the JWT in an HttpOnly cookie named jwt_key, and JwtBearer events read the token from that cookie and redirect anonymous users to the login page.",
  "Browser নিজে Authorization header পাঠায় না, কিন্তু cookie স্বয়ংক্রিয়ভাবে পাঠায়। তাই MVC tutorial JWT-কে HttpOnly cookie jwt_key-এ রাখে, আর JwtBearer event cookie থেকে token পড়ে ও login ছাড়া user-কে Login page-এ পাঠায়।",
  `Response.Cookies.Append("jwt_key", jwt, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict, Expires = DateTimeOffset.UtcNow.AddMinutes(30) }); ~~ After login, send the token as a safe cookie. / Login-এর পর নিরাপদ cookie।
o.Events = new JwtBearerEvents { ~~ Hook into the JwtBearer handler. / JwtBearer handler-এ hook।
  OnMessageReceived = ctx => { ctx.Token = ctx.Request.Cookies["jwt_key"]; return Task.CompletedTask; }, ~~ Read the token from the cookie, not the header. / Header নয়, cookie থেকে token।
  OnChallenge = ctx => { ctx.HandleResponse(); ctx.Response.Redirect("/Account/Login"); return Task.CompletedTask; } }; ~~ Not logged in: redirect instead of a bare 401. / Login না থাকলে redirect।
[Authorize] public class DashboardController : Controller { } ~~ The whole dashboard is protected. / পুরো Dashboard সুরক্ষিত।
public IActionResult Logout() { Response.Cookies.Delete("jwt_key"); return RedirectToAction("Login", "Account"); } ~~ Logout deletes the cookie. / Logout-এ cookie মুছে ফেলা।`,
  "Login form > Sign JWT > HttpOnly cookie > OnMessageReceived > [Authorize] > Dashboard",
  "Use one constant for the cookie name: a mismatch such as jwt_key vs jwtKey makes every request look anonymous. Deleting the cookie does not invalidate a stolen copy of the token before it expires.",
  "Because cookies are sent automatically, cookie-based auth needs CSRF protection on POST forms. For a pure server-rendered MVC app the built-in cookie handler is usually simpler than JWT-in-cookie.",
);

add(
  "Built-in Cookie Authentication",
  "ASP.NET Core has its own cookie handler. At login you create a ClaimsPrincipal and call SignInAsync; the framework encrypts it into a cookie, reads it back on every request, handles expiry and sliding renewal, and redirects to LoginPath or AccessDeniedPath for you.",
  "ASP.NET Core-এর নিজস্ব cookie handler আছে। Login-এ ClaimsPrincipal বানিয়ে SignInAsync ডাকলে framework সেটি encrypt করে cookie বানায়, প্রতি request-এ পড়ে, মেয়াদ সামলায়, আর LoginPath বা AccessDeniedPath-এ পাঠায়।",
  `builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(o => { o.LoginPath = "/Account/Login"; o.AccessDeniedPath = "/Account/Denied"; o.ExpireTimeSpan = TimeSpan.FromMinutes(30); o.SlidingExpiration = true; }); ~~ Cookie scheme with redirects and expiry. / Redirect ও মেয়াদসহ cookie scheme।
var claims = new List<Claim> { new(ClaimTypes.NameIdentifier, user.Id.ToString()), new(ClaimTypes.Name, user.Email), new(ClaimTypes.Role, user.Role) }; ~~ Who the user is and their role. / User কে ও তার role।
var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme)); ~~ Identity tied to the cookie scheme. / Cookie scheme-এর identity।
await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal); ~~ Writes the encrypted auth cookie. / Encrypted cookie লেখা।
await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme); ~~ Logout removes the cookie. / Logout-এ cookie মুছে যায়।
[Authorize(Roles = "Admin")] public IActionResult AdminPanel() => View(); ~~ Wrong role goes to AccessDeniedPath (403). / ভুল role গেলে Denied page।`,
  "Login form > ClaimsPrincipal > SignInAsync > Encrypted cookie > [Authorize]",
  "The cookie is protected by the Data Protection keys; on multiple servers or containers those keys must be shared and persisted, or users get logged out on every deploy.",
  "Choose built-in cookies for server-rendered MVC/Razor apps and JWT bearer for APIs consumed by mobile or SPA clients. You can register both schemes and pick per endpoint.",
);

add(
  "CSRF & Secure Cookies",
  "CSRF tricks a logged-in browser into sending a request it did not intend, because cookies travel automatically. The anti-forgery token is a hidden form field the attacker cannot read, and secure cookie flags limit where the cookie can go.",
  "CSRF login-করা browser-কে দিয়ে অনিচ্ছাকৃত request পাঠায়, কারণ cookie নিজে চলে যায়। Anti-forgery token একটি লুকানো field যা attacker পড়তে পারে না, আর cookie flag ঠিক করে cookie কোথায় যাবে।",
  `<form asp-action="Delete" asp-route-id="@p.Id" method="post"> ~~ The form tag helper adds a hidden __RequestVerificationToken. / Form tag helper লুকানো token দেয়।
[HttpPost, ValidateAntiForgeryToken] public async Task<IActionResult> Delete(int id) { } ~~ Reject posts without a valid token. / Token ছাড়া POST বাতিল।
builder.Services.AddControllersWithViews(o => o.Filters.Add(new AutoValidateAntiforgeryTokenAttribute())); ~~ Or validate on every unsafe method globally. / অথবা সব জায়গায় একসাথে।
HttpOnly = true ~~ JavaScript cannot read the cookie (limits XSS theft). / JavaScript cookie পড়তে পারে না।
Secure = true ~~ Sent only over HTTPS. / শুধু HTTPS-এ যায়।
SameSite = SameSiteMode.Strict ~~ Not sent on cross-site requests (blocks most CSRF). / অন্য site থেকে যায় না।`,
  "Logged-in cookie > Attacker page posts > Missing token > 400 rejected",
  "Never delete or change data with GET links like /Product/Delete/5; a crawler, prefetch or image tag can trigger them.",
  "SameSite=Lax is a good default for login cookies when you need top-level navigation from other sites; Strict is safest for admin panels. APIs using Bearer headers are not CSRF-prone because the browser does not attach them automatically.",
);

add(
  "Global Error Handling",
  "Instead of try-catch in every action, let exceptions bubble up to one global handler that logs the error and returns a consistent ProblemDetails JSON. Users never see stack traces, and developers get one place to look.",
  "প্রতিটি action-এ try-catch না লিখে exception-কে একটি global handler-এ যেতে দিন, যা log করে এবং একই রকম ProblemDetails JSON দেয়। User stack trace দেখে না, developer এক জায়গায় খোঁজে।",
  `builder.Services.AddProblemDetails(); ~~ Standard RFC 7807 error bodies. / মানসম্মত error body।
builder.Services.AddExceptionHandler<GlobalExceptionHandler>(); ~~ Register our IExceptionHandler (.NET 8+). / নিজস্ব handler register।
app.UseExceptionHandler(); ~~ Catch unhandled exceptions early in the pipeline. / Pipeline-এর শুরুতে ধরা।
public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> log) : IExceptionHandler ~~ One class handles every crash. / এক class সব crash সামলায়।
{ public async ValueTask<bool> TryHandleAsync(HttpContext ctx, Exception ex, CancellationToken ct) ~~ Called with the thrown exception. / Exception নিয়ে ডাকা হয়।
  { log.LogError(ex, "Unhandled"); ctx.Response.StatusCode = 500; await ctx.Response.WriteAsJsonAsync(new { title = "Something went wrong", traceId = ctx.TraceIdentifier }, ct); return true; } } ~~ Log details, return a safe message. / বিস্তারিত log, নিরাপদ বার্তা।`,
  "Action throws > Exception middleware > Log > ProblemDetails 500",
  "try { ... } catch { throw; } adds nothing; the notebook flagged it. Catch only when you can handle or translate the error.",
  "Map known domain errors to proper codes (NotFound to 404, Conflict to 409) and keep 500 for real bugs. Include a traceId so support can find the log entry.",
);

add(
  "Refresh Tokens & Logout",
  "Short access tokens limit damage if stolen, but users should not log in every 15 minutes. A refresh token is a long random string stored in the database; the client trades it for a new access token, and the server rotates and can revoke it, which also makes real logout possible.",
  "ছোট মেয়াদের access token চুরি হলে ক্ষতি কম, কিন্তু প্রতি ১৫ মিনিটে login বিরক্তিকর। Refresh token হলো database-এ রাখা লম্বা random string; এটি দিয়ে নতুন access token নেওয়া যায়, server এটি ঘোরায় ও বাতিল করতে পারে, তাই আসল logout সম্ভব।",
  `var refresh = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)); ~~ Cryptographically random, not a JWT. / Random string, JWT নয়।
db.RefreshTokens.Add(new RefreshToken { Token = Hash(refresh), UserId = user.Id, ExpiresAt = DateTime.UtcNow.AddDays(7) }); ~~ Store only a hash with an expiry. / শুধু hash ও মেয়াদ রাখা।
var stored = await db.RefreshTokens.SingleOrDefaultAsync(t => t.Token == Hash(req.RefreshToken) && t.RevokedAt == null && t.ExpiresAt > DateTime.UtcNow); ~~ Find a live token. / চালু token খোঁজা।
stored.RevokedAt = DateTime.UtcNow; ~~ Rotation: each refresh token works once. / প্রতিটি token একবারই চলে।
return Ok(new { accessToken = CreateJwt(user), refreshToken = NewRefreshFor(user) }); ~~ Issue a fresh pair. / নতুন জোড়া দেওয়া।
// Logout: set RevokedAt on the user's refresh tokens; the access token dies within minutes. ~~ Real server-side logout. / সার্ভার-পাশে আসল logout।`,
  "Access token expires > Send refresh token > Validate and rotate > New token pair",
  "If a revoked refresh token is used again, assume theft and revoke the whole token family for that user.",
  "Keep access tokens around 5 to 15 minutes. For browser apps store the refresh token in an HttpOnly, Secure, SameSite cookie scoped to the refresh path rather than in localStorage.",
);
