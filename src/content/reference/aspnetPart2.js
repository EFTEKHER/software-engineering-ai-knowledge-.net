// Second half of the ASP.NET Core track: authentication and authorization.
import { consoleEx, webEx, refEx } from "./aspnetHelpers";

const jwtPkg = ["Microsoft.AspNetCore.Authentication.JwtBearer"];

export const partTwo = {
  "JWT Authentication (Web API)": {
    en: "A JWT looks like xxxxx.yyyyy.zzzzz. The header names the algorithm, the payload holds claims (sub, email, role, exp), and the signature is HMAC-SHA256(header.payload, secretKey). On each request the JwtBearer handler recomputes the signature with the same key: if a single character of the payload changed, the signatures differ and the request becomes 401. If it matches, the claims become HttpContext.User.",
    bn: "JWT দেখতে xxxxx.yyyyy.zzzzz। Header-এ algorithm, payload-এ claim (sub, email, role, exp), আর signature = HMAC-SHA256(header.payload, secretKey)। প্রতি request-এ JwtBearer handler একই key দিয়ে signature আবার হিসাব করে: payload-এর একটি অক্ষর বদলালেও মিলবে না, ফলে 401। মিললে claim-গুলো HttpContext.User হয়।",
    theoryEn:
      "JWT authentication is stateless: the server does not remember sessions, it trusts any token it signed that has not expired. That makes scaling easy, but it also means a token cannot be 'logged out' before exp unless you add a deny list or use short tokens plus refresh tokens. The notebook signs a 1-minute token and shows the 401 after expiry; remember the default 5-minute clock skew when you test.",
    theoryBn:
      "JWT authentication stateless: server session মনে রাখে না, নিজে sign করা মেয়াদ-না-পেরোনো যেকোনো token বিশ্বাস করে। এতে scale সহজ, কিন্তু exp-এর আগে token 'logout' করা যায় না, যদি না deny list বা ছোট token ও refresh token ব্যবহার করেন। নোটবুক ১ মিনিটের token sign করে মেয়াদ শেষে 401 দেখায়; test করার সময় default ৫ মিনিটের clock skew মনে রাখুন।",
    storyEn:
      "A concert wristband has the band's name, your seat zone and today's date, plus a hologram only the organiser can make. Guards do not phone the office; they just check the hologram and the date. Tomorrow the same band is useless.",
    storyBn:
      "কনসার্টের wristband-এ ব্যান্ডের নাম, আপনার জোন আর আজকের তারিখ, সাথে এমন hologram যা শুধু আয়োজক বানাতে পারে। পাহারাদার অফিসে ফোন করেন না, শুধু hologram আর তারিখ দেখেন। কাল সেই band অচল।",
    steps: [
      ["Add Jwt:Key, Jwt:Issuer, Jwt:Audience to configuration.", "Config-এ Jwt:Key, Issuer, Audience দিন।"],
      ["Create GetJwtToken(user) with id, email and role claims.", "Id, email, role claim সহ GetJwtToken(user) বানান।"],
      ["Register AddAuthentication().AddJwtBearer(...) with validation.", "Validation সহ AddJwtBearer register করুন।"],
      ["Add UseAuthentication, UseAuthorization and [Authorize].", "UseAuthentication, UseAuthorization ও [Authorize] দিন।"],
    ],
    mistakesEn:
      "From the notebook: new Claim(ClaimTypes.Name, null) throws because Name was never set (use ?? string.Empty); TokenDto.Token without a default triggers CS8618; returning a TokenDto where a string is expected gives CS1503. Also: a key shorter than 32 bytes fails for HS256, and putting the key in source code leaks it.",
    mistakesBn:
      "নোটবুক থেকে: Name set না থাকায় new Claim(ClaimTypes.Name, null) exception দেয় (?? string.Empty দিন); default ছাড়া TokenDto.Token-এ CS8618; string-এর জায়গায় TokenDto দিলে CS1503। আরও: HS256-এ ৩২ byte-এর ছোট key চলে না, আর source code-এ key রাখলে ফাঁস হয়।",
    decisionEn:
      "Symmetric keys (HS256) are fine when the same app signs and validates. When several services validate tokens, use an identity provider (Entra ID, Auth0, Duende, Keycloak) with asymmetric keys (RS256) so only the issuer holds the private key.",
    decisionBn:
      "একই app sign ও যাচাই করলে symmetric key (HS256) যথেষ্ট। একাধিক service token যাচাই করলে identity provider (Entra ID, Auth0, Duende, Keycloak) ও asymmetric key (RS256), যাতে private key শুধু issuer-এর কাছে থাকে।",
    examples: [
      consoleEx(
        "1. Build and decode a JWT · JWT বানান ও পড়ুন",
        `using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("learning-only-key-that-is-32-bytes-long!!"));
var token = new JwtSecurityToken(
    issuer: "MyFirstApi", audience: "MyFirstApiClients",
    claims: new[] { new Claim("email", "asha@example.com"), new Claim("role", "Admin") },   // short JWT claim names
    expires: DateTime.UtcNow.AddMinutes(30),
    signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));
string jwt = new JwtSecurityTokenHandler().WriteToken(token);

Console.WriteLine($"Parts: {jwt.Split('.').Length}");
var read = new JwtSecurityTokenHandler().ReadJwtToken(jwt);   // decoding needs no key!
Console.WriteLine($"Algorithm: {read.Header.Alg}");
Console.WriteLine($"Role claim: {read.Claims.First(c => c.Type == "role").Value}");   // same short name inside the payload`,
        "Parts: 3\nAlgorithm: HS256\nRole claim: Admin",
        ["System.IdentityModel.Tokens.Jwt"],
      ),
      webEx(
        "2. Login that issues a token, protected endpoint · token দেওয়া ও সুরক্ষিত endpoint",
        `using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("learning-only-key-that-is-32-bytes-long!!"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o => o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true, ValidIssuer = "LearnApi",
        ValidateAudience = true, ValidAudience = "LearnApiClients",
        ValidateLifetime = true, ClockSkew = TimeSpan.Zero,
        ValidateIssuerSigningKey = true, IssuerSigningKey = key,
    });
builder.Services.AddAuthorization();
var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/api/auth/login", (LoginDto dto) =>
{
    if (dto.Password != "secret123") return Results.Unauthorized();   // demo only
    var token = new JwtSecurityToken("LearnApi", "LearnApiClients",
        new[] { new Claim(ClaimTypes.Name, dto.Email), new Claim(ClaimTypes.Role, "User") },
        expires: DateTime.UtcNow.AddMinutes(1),
        signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));
    return Results.Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
});

app.MapGet("/api/me", (ClaimsPrincipal user) => new { name = user.Identity!.Name, role = user.FindFirstValue(ClaimTypes.Role) })
   .RequireAuthorization();
app.Run();

public record LoginDto(string Email, string Password);`,
        'curl -k -X POST https://localhost:5001/api/auth/login -H "Content-Type: application/json" -d "{\\"email\\":\\"asha@example.com\\",\\"password\\":\\"secret123\\"}"\ncurl -k -i https://localhost:5001/api/me                       # 401\ncurl -k https://localhost:5001/api/me -H "Authorization: Bearer <paste token>"\n# wait 61 seconds and repeat: 401 again (expired)',
        jwtPkg,
      ),
      refEx(
        "3. GetJwtToken with configuration · configuration সহ GetJwtToken",
        `// appsettings.json (use user-secrets for the key in development)
// "Jwt": { "Key": "<32+ random bytes>", "Issuer": "MyFirstApi", "Audience": "MyFirstApiClients", "Minutes": 30 }

private string GetJwtToken(AccountUser user)
{
    var jwt = _config.GetSection("Jwt");
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
    var claims = new List<Claim>
    {
        new(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new(ClaimTypes.Name, user.Name ?? string.Empty),   // fixed: never null
        new(ClaimTypes.Email, user.Email),
        new(ClaimTypes.Role, user.Role),
    };
    var token = new JwtSecurityToken(
        issuer: jwt["Issuer"],
        audience: jwt["Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(jwt.GetValue<int>("Minutes")),
        signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));
    return new JwtSecurityTokenHandler().WriteToken(token);
}

public class TokenDto { public string Token { get; set; } = string.Empty; }   // fixed CS8618`,
        "Inside AuthService; inject IConfiguration as _config. Run: dotnet user-secrets set \"Jwt:Key\" \"<long random value>\".",
        "AuthService-এর ভেতরে; IConfiguration-কে _config হিসেবে inject করুন। চালান: dotnet user-secrets set \"Jwt:Key\" \"<লম্বা random মান>\"।",
      ),
    ],
  },

  "Role-Based Authorization": {
    en: "After authentication, HttpContext.User holds a ClaimsPrincipal. Role checks look for claims of type ClaimTypes.Role (the long URI http://schemas.microsoft.com/ws/2008/06/identity/claims/role). [Authorize(Roles = \"Admin,Manager\")] passes if the user has at least one listed role. The authorization middleware returns 401 Challenge when there is no authenticated user and 403 Forbid when the user is known but lacks the role.",
    bn: "Authentication-এর পর HttpContext.User-এ ClaimsPrincipal থাকে। Role check ClaimTypes.Role type-এর claim খোঁজে। [Authorize(Roles = \"Admin,Manager\")] পাস করে যদি তালিকার অন্তত একটি role থাকে। Authenticated user না থাকলে middleware 401 Challenge দেয়, আর user থাকলেও role না থাকলে 403 Forbid।",
    theoryEn:
      "Design roles around jobs, not people: Admin manages everything, Manager edits records, User reads. Store the role on the user (a Role column or, with Identity, AspNetUserRoles), copy it into a claim at login, and decorate endpoints. Apply [Authorize] at controller level so nothing is accidentally public, then tighten individual actions. Use [AllowAnonymous] only for login and register.",
    theoryBn:
      "Role মানুষের নামে নয়, কাজের ভিত্তিতে বানান: Admin সব সামলায়, Manager record বদলায়, User পড়ে। Role user-এর সাথে রাখুন (Role column বা Identity-র AspNetUserRoles), login-এ claim-এ কপি করুন, আর endpoint-এ attribute দিন। Controller স্তরে [Authorize] দিন যাতে ভুলে কিছু public না হয়, তারপর আলাদা action আরও কড়া করুন। [AllowAnonymous] শুধু login ও register-এ।",
    storyEn:
      "In a hospital everyone wears a badge (authenticated). The badge colour is the role: blue for nurses, red for surgeons. Any badge opens the cafeteria; only red opens the operating theatre. A visitor without a badge is sent to reception (401); a nurse at the theatre door is politely refused (403).",
    storyBn:
      "হাসপাতালে সবার ব্যাজ আছে (authenticated)। ব্যাজের রঙ হলো role: নার্স নীল, সার্জন লাল। যেকোনো ব্যাজে ক্যান্টিন খোলে; শুধু লাল ব্যাজে অপারেশন থিয়েটার। ব্যাজহীন অতিথিকে reception-এ পাঠানো হয় (401); থিয়েটারের দরজায় নার্সকে বিনয়ের সাথে না বলা হয় (403)।",
    steps: [
      ["Add a Role property to AccountUser and a migration.", "AccountUser-এ Role property ও migration দিন।"],
      ["Add new Claim(ClaimTypes.Role, user.Role) when issuing the token or cookie.", "Token বা cookie দেওয়ার সময় role claim যোগ করুন।"],
      ["Put [Authorize] on the controller and [Authorize(Roles=...)] on sensitive actions.", "Controller-এ [Authorize], সংবেদনশীল action-এ [Authorize(Roles=...)]।"],
      ["Test three users: none (401), User (403 on delete), Admin (204).", "তিনভাবে test: কেউ না (401), User (delete-এ 403), Admin (204)।"],
    ],
    mistakesEn:
      "Forgetting UseAuthentication before UseAuthorization makes every user anonymous. Mapping a custom claim name like \"role\" without telling the handler (RoleClaimType = \"role\") makes IsInRole always false. Checking roles only in the front end is not security: always enforce on the server.",
    mistakesBn:
      "UseAuthorization-এর আগে UseAuthentication ভুলে গেলে সবাই anonymous। নিজস্ব \"role\" claim নাম দিলে handler-কে না জানালে (RoleClaimType = \"role\") IsInRole সবসময় false। শুধু front end-এ role দেখা নিরাপত্তা নয়: সবসময় server-এ যাচাই করুন।",
    decisionEn:
      "Roles are perfect for a handful of stable job types. When you need many permissions (Orders.Read, Orders.Delete) or rules on data (only the author can edit), use policies with permission claims or resource-based handlers. With ASP.NET Core Identity use RoleManager and UserManager.AddToRoleAsync instead of a plain column.",
    decisionBn:
      "অল্প কয়েকটি স্থির কাজের ধরনের জন্য role ঠিক আছে। অনেক permission (Orders.Read, Orders.Delete) বা data-নির্ভর নিয়ম (শুধু লেখক edit করবে) হলে permission claim সহ policy বা resource-based handler। ASP.NET Core Identity-তে সাধারণ column-এর বদলে RoleManager ও UserManager.AddToRoleAsync।",
    examples: [
      consoleEx(
        "1. Claims, roles and decisions · claim, role ও সিদ্ধান্ত",
        `using System.Security.Claims;

ClaimsPrincipal Make(string? role) => role is null
    ? new ClaimsPrincipal(new ClaimsIdentity())                          // not authenticated
    : new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, role + "-user"), new Claim(ClaimTypes.Role, role) }, "demo"));

int Authorize(ClaimsPrincipal user, params string[] roles)
{
    if (user.Identity?.IsAuthenticated != true) return 401;
    return roles.Length == 0 || roles.Any(user.IsInRole) ? 200 : 403;
}

foreach (var role in new[] { null, "User", "Manager", "Admin" })
{
    var u = Make(role);
    Console.WriteLine($"{role ?? "anonymous",-9} read={Authorize(u)} update={Authorize(u, "Admin", "Manager")} delete={Authorize(u, "Admin")}");
}`,
        "anonymous read=401 update=401 delete=401\nUser      read=200 update=403 delete=403\nManager   read=200 update=200 delete=403\nAdmin     read=200 update=200 delete=200",
      ),
      webEx(
        "2. Complete role-protected API with JWT · JWT সহ role-সুরক্ষিত API",
        `using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("learning-only-key-that-is-32-bytes-long!!"));
builder.Services.AddControllers();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o => o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false, ValidateAudience = false,
        ValidateIssuerSigningKey = true, IssuerSigningKey = key,
    });
builder.Services.AddAuthorization();
builder.Services.AddSingleton(key);
var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

public static class Roles { public const string Admin = "Admin", Manager = "Manager", User = "User"; }
public record LoginDto(string Email, string Password);

[ApiController, Route("api/auth"), AllowAnonymous]
public class AuthController(SymmetricSecurityKey key) : ControllerBase
{
    // demo users: admin@x.com, manager@x.com, user@x.com (password: pass123)
    private static readonly Dictionary<string, string> UserRoles = new()
    {
        ["admin@x.com"] = Roles.Admin, ["manager@x.com"] = Roles.Manager, ["user@x.com"] = Roles.User,
    };

    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        if (!UserRoles.TryGetValue(dto.Email, out var role) || dto.Password != "pass123") return Unauthorized();
        var jwt = new JwtSecurityToken(claims: new[] { new Claim(ClaimTypes.Name, dto.Email), new Claim(ClaimTypes.Role, role) },
            expires: DateTime.UtcNow.AddMinutes(30), signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));
        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(jwt), role });
    }
}

[ApiController, Route("api/employees"), Authorize]          // everyone must log in
public class EmployeesController : ControllerBase
{
    private static readonly List<string> Names = new() { "Asha", "Rafi" };

    [HttpGet] public IActionResult GetAll() => Ok(Names);                       // any role

    [HttpPut("{index:int}"), Authorize(Roles = $"{Roles.Admin},{Roles.Manager}")]
    public IActionResult Rename(int index, [FromBody] string name) { Names[index] = name; return NoContent(); }

    [HttpDelete("{index:int}"), Authorize(Roles = Roles.Admin)]
    public IActionResult Delete(int index) { Names.RemoveAt(index); return NoContent(); }

    [HttpGet("whoami")]
    public IActionResult WhoAmI() => Ok(new { name = User.Identity!.Name, isAdmin = User.IsInRole(Roles.Admin) });
}`,
        'curl -k -X POST https://localhost:5001/api/auth/login -H "Content-Type: application/json" -d "{\\"email\\":\\"user@x.com\\",\\"password\\":\\"pass123\\"}"\ncurl -k -i -X DELETE https://localhost:5001/api/employees/0 -H "Authorization: Bearer <user token>"    # 403\n# log in as admin@x.com and repeat: 204 No Content',
        jwtPkg,
      ),
      refEx(
        "3. Seeding an Admin and promoting users · Admin seed ও promote",
        `// Data/AppDbContext.cs: seed one admin (hash created once, offline)
protected override void OnModelCreating(ModelBuilder b)
{
    b.Entity<AccountUser>().HasData(new AccountUser
    {
        Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
        Email = "admin@company.com",
        Name = "System Admin",
        Role = "Admin",
        Password = "AQAAAAIAAYagAAAAE...paste-a-precomputed-hash...",
    });
}

// Controllers/AdminController.cs: only admins can change roles
[ApiController, Route("api/admin"), Authorize(Roles = "Admin")]
public class AdminController(AppDbContext db) : ControllerBase
{
    private static readonly string[] Allowed = { "Admin", "Manager", "User" };

    [HttpPut("users/{id:guid}/role")]
    public async Task<IActionResult> SetRole(Guid id, [FromBody] string role)
    {
        if (!Allowed.Contains(role)) return BadRequest("Unknown role");
        var user = await db.AccountUsers.FindAsync(id);
        if (user is null) return NotFound();
        user.Role = role;
        await db.SaveChangesAsync();
        return NoContent();   // takes effect at the user's next login
    }
}`,
        "Registration always creates Role = \"User\"; only an Admin endpoint can promote. The new role appears after the user's next token or cookie.",
        "Register সবসময় Role = \"User\" দেয়; শুধু Admin endpoint promote করতে পারে। নতুন role user-এর পরের token বা cookie-তে আসে।",
      ),
    ],
  },

  "Policy & Claims Authorization": {
    en: "An authorization policy is a list of requirements. Built-in helpers cover common ones: RequireAuthenticatedUser, RequireRole, RequireClaim(type, values), RequireAssertion(lambda). For anything else you write an IAuthorizationRequirement plus an AuthorizationHandler<T> that calls context.Succeed(requirement). The policy succeeds only when every requirement succeeds.",
    bn: "Authorization policy হলো requirement-এর তালিকা। সাধারণগুলোর জন্য built-in helper: RequireAuthenticatedUser, RequireRole, RequireClaim(type, values), RequireAssertion(lambda)। বাকি সবকিছুতে IAuthorizationRequirement ও AuthorizationHandler<T> লিখে context.Succeed(requirement) ডাকুন। সব requirement সফল হলে তবেই policy সফল।",
    theoryEn:
      "Roles ask 'what is your job title?'. Claims ask 'what facts are true about you?': department=HR, level=3, subscription=premium, permission=orders.delete. Policies combine those facts into business rules and give them names. Resource-based authorization goes one step further: the handler also receives the record (an order, a document) and can check ownership, which an attribute alone cannot do.",
    theoryBn:
      "Role জিজ্ঞেস করে 'তোমার পদ কী?'। Claim জিজ্ঞেস করে 'তোমার সম্পর্কে কোন তথ্য সত্য?': department=HR, level=3, subscription=premium, permission=orders.delete। Policy এই তথ্যগুলো মিলিয়ে নাম দেওয়া business rule বানায়। Resource-based authorization আরও এক ধাপ: handler record-টিও (order, document) পায় এবং মালিকানা যাচাই করতে পারে, যা শুধু attribute পারে না।",
    storyEn:
      "A gym door does not care about your job title. It checks the facts on your card: membership is premium, age is 18+, and today is not past expiry. The rule has a name, 'Pool access', printed on the door.",
    storyBn:
      "জিমের দরজা আপনার পদ দেখে না। কার্ডের তথ্য দেখে: membership premium, বয়স ১৮+, আজ মেয়াদ পেরোয়নি। নিয়মটির নাম 'Pool access', দরজায় লেখা।",
    steps: [
      ["Issue the needed claims (department, level, permission) at login.", "Login-এ প্রয়োজনীয় claim দিন (department, level, permission)।"],
      ["Define named policies in AddAuthorization.", "AddAuthorization-এ নামযুক্ত policy সংজ্ঞায়িত করুন।"],
      ["Use [Authorize(Policy = \"Name\")] or RequireAuthorization(\"Name\").", "[Authorize(Policy = \"Name\")] বা RequireAuthorization(\"Name\") ব্যবহার করুন।"],
      ["For ownership rules, call IAuthorizationService.AuthorizeAsync with the resource.", "মালিকানার নিয়মে resource সহ AuthorizeAsync ডাকুন।"],
    ],
    mistakesEn:
      "Registering a handler class but forgetting builder.Services.AddSingleton<IAuthorizationHandler, MyHandler>() means the requirement never succeeds (always 403). Calling context.Fail() too eagerly blocks other handlers that could have succeeded.",
    mistakesBn:
      "Handler class লিখে AddSingleton<IAuthorizationHandler, MyHandler>() ভুলে গেলে requirement কখনো সফল হয় না (সবসময় 403)। খুব তাড়াতাড়ি context.Fail() ডাকলে অন্য handler সফল হতে পারত, তাও আটকে যায়।",
    decisionEn:
      "Start with roles; introduce policies when the same rule appears in several places or depends on claims. Keep policy names as constants. A fallback policy (options.FallbackPolicy = RequireAuthenticatedUser) secures every endpoint by default.",
    decisionBn:
      "Role দিয়ে শুরু করুন; একই নিয়ম কয়েক জায়গায় এলে বা claim-নির্ভর হলে policy আনুন। Policy নাম constant রাখুন। Fallback policy (options.FallbackPolicy = RequireAuthenticatedUser) default-এ সব endpoint সুরক্ষিত করে।",
    examples: [
      consoleEx(
        "1. Evaluate policies with the real authorization service · আসল service দিয়ে policy",
        `using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;

var services = new ServiceCollection().AddLogging();
services.AddAuthorizationCore(o =>
{
    o.AddPolicy("HR", p => p.RequireClaim("department", "HR"));
    o.AddPolicy("Senior", p => p.RequireAssertion(c => int.Parse(c.User.FindFirst("level")?.Value ?? "0") >= 3));
});
var auth = services.BuildServiceProvider().GetRequiredService<IAuthorizationService>();

ClaimsPrincipal U(string dept, int level) => new(new ClaimsIdentity(new[]
    { new Claim("department", dept), new Claim("level", level.ToString()) }, "demo"));

foreach (var (dept, level) in new[] { ("HR", 1), ("IT", 4), ("HR", 5) })
{
    var u = U(dept, level);
    Console.WriteLine($"{dept} L{level}: HR={(await auth.AuthorizeAsync(u, "HR")).Succeeded} Senior={(await auth.AuthorizeAsync(u, "Senior")).Succeeded}");
}`,
        "HR L1: HR=True Senior=False\nIT L4: HR=False Senior=True\nHR L5: HR=True Senior=True",
        ["Microsoft.AspNetCore.Authorization", "Microsoft.Extensions.Logging"],
      ),
      webEx(
        "2. Custom requirement: minimum age · নিজস্ব requirement",
        `using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);
// Demo scheme: identity comes from headers X-User and X-Birth. Never do this in production.
builder.Services.AddAuthentication("Demo").AddScheme<AuthenticationSchemeOptions, HeaderAuth>("Demo", null);
builder.Services.AddAuthorization(o => o.AddPolicy("Adult", p => p.Requirements.Add(new MinimumAgeRequirement(18))));
builder.Services.AddSingleton<IAuthorizationHandler, MinimumAgeHandler>();
var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();
app.MapGet("/movies/adult", () => "Enjoy the film").RequireAuthorization("Adult");
app.Run();

public record MinimumAgeRequirement(int Age) : IAuthorizationRequirement;

public class MinimumAgeHandler : AuthorizationHandler<MinimumAgeRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext ctx, MinimumAgeRequirement req)
    {
        var birth = ctx.User.FindFirst(ClaimTypes.DateOfBirth)?.Value;
        if (DateTime.TryParse(birth, out var dob) && dob.AddYears(req.Age) <= DateTime.Today)
            ctx.Succeed(req);
        return Task.CompletedTask;
    }
}

public class HeaderAuth(Microsoft.Extensions.Options.IOptionsMonitor<AuthenticationSchemeOptions> o,
    ILoggerFactory l, System.Text.Encodings.Web.UrlEncoder e) : AuthenticationHandler<AuthenticationSchemeOptions>(o, l, e)
{
    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue("X-User", out var user)) return Task.FromResult(AuthenticateResult.NoResult());
        var id = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, user!), new Claim(ClaimTypes.DateOfBirth, Request.Headers["X-Birth"].ToString()) }, "Demo");
        return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(new ClaimsPrincipal(id), "Demo")));
    }
}`,
        'curl -k -i https://localhost:5001/movies/adult                                              # 401\ncurl -k -i https://localhost:5001/movies/adult -H "X-User: rafi" -H "X-Birth: 2015-01-01"  # 403\ncurl -k https://localhost:5001/movies/adult -H "X-User: asha" -H "X-Birth: 1995-06-01"     # 200',
      ),
      refEx(
        "3. Resource-based: only the owner may edit · শুধু মালিক edit করবে",
        `public class SameOwnerRequirement : IAuthorizationRequirement { }

public class DocumentOwnerHandler : AuthorizationHandler<SameOwnerRequirement, Document>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext ctx,
        SameOwnerRequirement req, Document doc)
    {
        var userId = ctx.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (doc.OwnerId.ToString() == userId || ctx.User.IsInRole("Admin"))
            ctx.Succeed(req);
        return Task.CompletedTask;
    }
}

// Program.cs
builder.Services.AddAuthorization(o => o.AddPolicy("EditDocument", p => p.Requirements.Add(new SameOwnerRequirement())));
builder.Services.AddSingleton<IAuthorizationHandler, DocumentOwnerHandler>();

// Controller action
[HttpPut("{id:guid}")]
public async Task<IActionResult> Edit(Guid id, DocumentDto dto, [FromServices] IAuthorizationService auth)
{
    var doc = await db.Documents.FindAsync(id);
    if (doc is null) return NotFound();
    var result = await auth.AuthorizeAsync(User, doc, "EditDocument");
    if (!result.Succeeded) return Forbid();
    doc.Title = dto.Title;
    await db.SaveChangesAsync();
    return NoContent();
}`,
        "The rule needs the loaded record, so it runs inside the action rather than in an attribute.",
        "নিয়মে load করা record লাগে, তাই attribute নয়, action-এর ভেতরে চলে।",
      ),
    ],
  },

  "MVC Pattern & Razor Views": {
    en: "In MVC the browser asks for a URL such as /Product/Index. Conventional routing maps it to ProductController.Index(). The action loads data through EF Core and returns View(model). The view engine finds Views/Product/Index.cshtml, runs its Razor code with that model, and produces HTML. Forms post back to actions, which validate, save, and usually RedirectToAction (the POST-Redirect-GET pattern).",
    bn: "MVC-তে browser /Product/Index-এর মতো URL চায়। Conventional routing সেটিকে ProductController.Index()-এ পাঠায়। Action EF Core দিয়ে data এনে View(model) দেয়। View engine Views/Product/Index.cshtml খুঁজে model দিয়ে Razor চালিয়ে HTML বানায়। Form action-এ post হয়, যেখানে validate ও save করে সাধারণত RedirectToAction (POST-Redirect-GET)।",
    theoryEn:
      "Model is your data and rules (entities, view models, DbContext). View is presentation only (Razor .cshtml with HTML plus @ C#). Controller is the coordinator. Controller (for MVC) can return views; ControllerBase (for APIs) cannot. Tag helpers such as asp-for, asp-action and asp-validation-for generate correct names, URLs and error messages, and the form tag helper adds the anti-forgery token automatically.",
    theoryBn:
      "Model হলো data ও নিয়ম (entity, view model, DbContext)। View শুধু প্রদর্শন (HTML আর @ C# সহ Razor .cshtml)। Controller সমন্বয়কারী। MVC-র Controller view দিতে পারে; API-র ControllerBase পারে না। asp-for, asp-action, asp-validation-for-এর মতো tag helper সঠিক name, URL ও error বার্তা বানায়, আর form tag helper নিজে anti-forgery token দেয়।",
    storyEn:
      "In a restaurant the waiter (controller) takes your order, the kitchen (model) prepares the food, and the plating (view) makes it look good on the table. The waiter never cooks and the chef never takes orders.",
    storyBn:
      "রেস্তোরাঁয় ওয়েটার (controller) অর্ডার নেন, রান্নাঘর (model) খাবার বানায়, আর সাজানো (view) টেবিলে সুন্দর করে দেয়। ওয়েটার রান্না করেন না, শেফ অর্ডার নেন না।",
    steps: [
      ["Register AddControllersWithViews and the default route.", "AddControllersWithViews ও default route register করুন।"],
      ["Create a controller action that returns View(model).", "View(model) ফেরত দেওয়া action বানান।"],
      ["Create Views/<Controller>/<Action>.cshtml with @model.", "@model সহ Views/<Controller>/<Action>.cshtml বানান।"],
      ["Build forms with asp-for and post them to [HttpPost] actions.", "asp-for দিয়ে form বানিয়ে [HttpPost] action-এ post করুন।"],
    ],
    mistakesEn:
      "From the MVC tutorial: inputs without name (or asp-for) post nothing; a form without asp-action posts to the wrong action; forgetting SaveChangesAsync after Add means nothing is stored; using ViewBag for a message that must survive a redirect (use TempData).",
    mistakesBn:
      "MVC tutorial থেকে: name (বা asp-for) ছাড়া input কিছু পাঠায় না; asp-action ছাড়া form ভুল action-এ যায়; Add-এর পর SaveChangesAsync ভুলে গেলে কিছু save হয় না; redirect-এর পরে লাগবে এমন বার্তায় ViewBag (TempData ব্যবহার করুন)।",
    decisionEn:
      "Choose MVC when the server renders HTML and SEO or simple hosting matters. Choose Web API plus a front-end framework when you serve mobile apps or a SPA. Razor Pages is a simpler page-focused alternative to MVC for form-heavy sites.",
    decisionBn:
      "Server HTML render করলে এবং SEO বা সহজ hosting জরুরি হলে MVC। Mobile app বা SPA-কে সেবা দিলে Web API ও front-end framework। Form-ভিত্তিক site-এ MVC-র সহজ বিকল্প Razor Pages।",
    examples: [
      refEx(
        "1. ProductController with full CRUD · সম্পূর্ণ CRUD controller",
        `public class ProductController(AppDbContext db) : Controller
{
    public async Task<IActionResult> Index() =>
        View(await db.Products.AsNoTracking().OrderBy(p => p.Name).ToListAsync());

    [HttpGet] public IActionResult Create() => View();

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(ProductDto dto)
    {
        if (!ModelState.IsValid) return View(dto);          // show errors again
        db.Products.Add(new Product { Name = dto.Name, Price = dto.Price });
        await db.SaveChangesAsync();
        TempData["Message"] = "Product added";
        return RedirectToAction(nameof(Index));            // POST-Redirect-GET
    }

    [HttpGet]
    public async Task<IActionResult> Edit(int id) =>
        await db.Products.FindAsync(id) is { } p ? View(new ProductDto { Id = p.Id, Name = p.Name, Price = p.Price }) : NotFound();

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(ProductDto dto)
    {
        if (!ModelState.IsValid) return View(dto);
        var p = await db.Products.FindAsync(dto.Id);
        if (p is null) return NotFound();
        p.Name = dto.Name; p.Price = dto.Price;
        await db.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var p = await db.Products.FindAsync(id);
        if (p is not null) { db.Products.Remove(p); await db.SaveChangesAsync(); }
        return RedirectToAction(nameof(Index));
    }
}`,
        "Controllers/ProductController.cs in an MVC project created with dotnet new mvc.",
        "dotnet new mvc দিয়ে তৈরি project-এর Controllers/ProductController.cs।",
      ),
      refEx(
        "2. Razor list and form views · Razor list ও form view",
        `@* Views/Product/Index.cshtml *@
@model List<Product>
<h2>Products</h2>
@if (TempData["Message"] is string msg) { <div class="alert alert-success">@msg</div> }
<a asp-action="Create" class="btn btn-primary">Add product</a>
<table class="table">
  <tr><th>Name</th><th>Price</th><th></th></tr>
  @foreach (var p in Model)
  {
    <tr>
      <td>@p.Name</td>
      <td>@p.Price.ToString("C")</td>
      <td>
        <a asp-action="Edit" asp-route-id="@p.Id">Edit</a>
        <form asp-action="Delete" asp-route-id="@p.Id" method="post" style="display:inline"
              onsubmit="return confirm('Delete @p.Name?')">
          <button type="submit" class="btn btn-link text-danger">Delete</button>
        </form>
      </td>
    </tr>
  }
</table>

@* Views/Product/Create.cshtml *@
@model ProductDto
<form asp-action="Create" method="post">
  <div asp-validation-summary="ModelOnly"></div>
  <label asp-for="Name"></label> <input asp-for="Name" class="form-control" />
  <span asp-validation-for="Name" class="text-danger"></span>
  <label asp-for="Price"></label> <input asp-for="Price" class="form-control" />
  <span asp-validation-for="Price" class="text-danger"></span>
  <button type="submit">Save</button>
</form>`,
        "asp-for generates id, name and validation attributes; the form tag helper adds the anti-forgery token.",
        "asp-for id, name ও validation attribute বানায়; form tag helper anti-forgery token দেয়।",
        "html",
      ),
      consoleEx(
        "3. What Razor does, in plain C# · Razor কী করে, সাধারণ C#-এ",
        `using System.Net;
using System.Text;

var products = new[] { new Product("Tea", 20), new Product("<script>alert(1)</script>", 0) };
var html = new StringBuilder("<table>\\n");
foreach (var p in products)
    html.Append($"  <tr><td>{WebUtility.HtmlEncode(p.Name)}</td><td>{p.Price}</td></tr>\\n");   // @p.Name encodes too
html.Append("</table>");
Console.WriteLine(html);

public record Product(string Name, decimal Price);`,
        "<table>\n  <tr><td>Tea</td><td>20</td></tr>\n  <tr><td>&lt;script&gt;alert(1)&lt;/script&gt;</td><td>0</td></tr>\n</table>",
      ),
    ],
  },

  "JWT in Cookie (MVC)": {
    en: "The tutorial's flow: (1) the login action verifies the password and signs a JWT with email and expiry claims; (2) it sends the JWT in an HttpOnly, Secure, SameSite cookie named jwt_key; (3) the browser sends that cookie with every request; (4) JwtBearerEvents.OnMessageReceived copies the cookie value into context.Token, so the normal JwtBearer validation runs; (5) [Authorize] checks the result and OnChallenge redirects anonymous users to /Account/Login; (6) logout deletes the cookie.",
    bn: "Tutorial-এর ধাপ: (১) login action password যাচাই করে email ও মেয়াদ claim সহ JWT sign করে; (২) JWT-কে HttpOnly, Secure, SameSite cookie jwt_key-এ পাঠায়; (৩) browser প্রতি request-এ cookie পাঠায়; (৪) OnMessageReceived cookie-র মান context.Token-এ দেয়, ফলে সাধারণ JwtBearer যাচাই চলে; (৫) [Authorize] ফল দেখে, OnChallenge login ছাড়া user-কে /Account/Login-এ পাঠায়; (৬) logout cookie মুছে দেয়।",
    theoryEn:
      "Storing a JWT in localStorage lets any injected script steal it. An HttpOnly cookie is invisible to JavaScript, and Secure plus SameSite limit when it is sent. The trade-off: because the browser attaches the cookie automatically, forms need anti-forgery tokens. Logout only deletes the browser's copy; the token itself stays valid until exp, so keep expiry short.",
    theoryBn:
      "JWT localStorage-এ রাখলে যেকোনো ঢুকে পড়া script চুরি করতে পারে। HttpOnly cookie JavaScript দেখতে পায় না, আর Secure ও SameSite ঠিক করে কখন পাঠানো হবে। বিনিময়ে: browser নিজে cookie জুড়ে দেয়, তাই form-এ anti-forgery token লাগে। Logout শুধু browser-এর কপি মোছে; token নিজে exp পর্যন্ত বৈধ, তাই মেয়াদ ছোট রাখুন।",
    storyEn:
      "Instead of carrying your gym pass in your hand (Authorization header), the gym stitches it into your jacket lining (cookie). You cannot lose it or show it to strangers, and the scanner at every door reads it through the jacket. Logging out means cutting it out of the jacket.",
    storyBn:
      "জিমের পাস হাতে না রেখে (Authorization header) জিম সেটা জ্যাকেটের লাইনিংয়ে সেলাই করে দেয় (cookie)। হারাবেন না, অপরিচিতকে দেখাতেও পারবেন না, আর প্রতিটি দরজার scanner জ্যাকেটের ভেতর দিয়েই পড়ে। Logout মানে লাইনিং থেকে কেটে ফেলা।",
    steps: [
      ["On login, sign a JWT and Response.Cookies.Append(\"jwt_key\", ...).", "Login-এ JWT sign করে jwt_key cookie-তে দিন।"],
      ["In AddJwtBearer, set OnMessageReceived to read the cookie.", "AddJwtBearer-এ OnMessageReceived দিয়ে cookie পড়ুন।"],
      ["Set OnChallenge to redirect to the login page.", "OnChallenge দিয়ে login page-এ redirect করুন।"],
      ["Protect controllers with [Authorize]; logout deletes the cookie.", "[Authorize] দিয়ে সুরক্ষা; logout cookie মুছে।"],
    ],
    mistakesEn:
      "The tutorial's own bug: the cookie was written as one name and read as another, so every request looked anonymous; keep the name in a constant. Without ctx.HandleResponse() in OnChallenge, the redirect and the default 401 conflict. Test it: delete the cookie in DevTools (back to login), or change one character (signature mismatch, back to login).",
    mistakesBn:
      "Tutorial-এর নিজের bug: cookie এক নামে লেখা, অন্য নামে পড়া, ফলে সব request anonymous; নাম constant-এ রাখুন। OnChallenge-এ ctx.HandleResponse() না দিলে redirect আর default 401 সংঘর্ষ করে। Test: DevTools-এ cookie মুছুন (login-এ ফেরত), বা একটি অক্ষর বদলান (signature মেলে না, login-এ ফেরত)।",
    decisionEn:
      "JWT-in-cookie is useful when the same token must also work for an API. For a pure server-rendered app, the built-in cookie handler (next lesson) does the same with less code and supports sliding expiration. Add role claims exactly as in the API: [Authorize(Roles = \"Admin\")] works the same way.",
    decisionBn:
      "একই token API-তেও কাজ করতে হলে JWT-in-cookie উপকারী। শুধু server-rendered app-এ built-in cookie handler (পরের lesson) কম কোডে একই কাজ করে, sliding expiration-ও দেয়। API-র মতোই role claim দিন: [Authorize(Roles = \"Admin\")] একইভাবে কাজ করে।",
    examples: [
      refEx(
        "1. Program.cs: JwtBearer reading a cookie · cookie পড়া JwtBearer",
        `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

var jwt = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, ValidIssuer = jwt["Issuer"],
            ValidateAudience = true, ValidAudience = jwt["Audience"],
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!)),
        };
        o.Events = new JwtBearerEvents
        {
            OnMessageReceived = ctx =>
            {
                ctx.Token = ctx.Request.Cookies[AuthCookie.Name];
                return Task.CompletedTask;
            },
            OnChallenge = ctx =>
            {
                ctx.HandleResponse();
                ctx.Response.Redirect("/Account/Login");
                return Task.CompletedTask;
            },
            OnForbidden = ctx =>
            {
                ctx.Response.Redirect("/Account/Denied");
                return Task.CompletedTask;
            },
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllerRoute("default", "{controller=Account}/{action=Login}/{id?}");
app.Run();

public static class AuthCookie { public const string Name = "jwt_key"; }`,
        "Program.cs of the MVC tutorial with the cookie name in one constant and a 403 page for wrong roles.",
        "MVC tutorial-এর Program.cs, cookie নাম এক constant-এ এবং ভুল role-এর জন্য 403 page।",
      ),
      refEx(
        "2. AccountController: login, logout, already-logged-in · login ও logout",
        `public class AccountController(AppDbContext db, IConfiguration config) : Controller
{
    [HttpGet]
    public IActionResult Login() =>
        User.Identity?.IsAuthenticated == true ? RedirectToAction("Index", "Dashboard") : View();

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(LoginViewModel vm)
    {
        if (!ModelState.IsValid) return View(vm);
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == vm.Email);
        if (user is null || new PasswordHasher<User>().VerifyHashedPassword(user, user.Password, vm.Password)
            == PasswordVerificationResult.Failed)
        {
            ModelState.AddModelError("", "Invalid email or password");
            return View(vm);
        }

        var token = TokenFactory.Create(user, config);   // claims: NameIdentifier, Name, Role; exp 30 min
        Response.Cookies.Append(AuthCookie.Name, token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddMinutes(30),
        });
        return RedirectToAction("Index", "Dashboard");
    }

    [HttpPost, ValidateAntiForgeryToken]
    public IActionResult Logout()
    {
        Response.Cookies.Delete(AuthCookie.Name);
        return RedirectToAction(nameof(Login));
    }

    public IActionResult Denied() => View();
}

[Authorize]
public class DashboardController : Controller
{
    public IActionResult Index() => View(model: User.Identity!.Name);

    [Authorize(Roles = "Admin")]
    public IActionResult Admin() => View();
}`,
        "Logout is a POST with an anti-forgery token, so another site cannot log your users out with a link.",
        "Logout একটি anti-forgery token সহ POST, যাতে অন্য site link দিয়ে user-কে logout করাতে না পারে।",
      ),
      consoleEx(
        "3. Why a changed character fails · একটি অক্ষর বদলালে কেন ব্যর্থ",
        `using System.Security.Cryptography;
using System.Text;

byte[] key = Encoding.UTF8.GetBytes("server-secret-key");
string Sign(string payload) => Convert.ToBase64String(HMACSHA256.HashData(key, Encoding.UTF8.GetBytes(payload)));

string payload = "{\\"email\\":\\"asha@x.com\\",\\"role\\":\\"User\\"}";
string cookie = payload + "." + Sign(payload);

bool Valid(string c) { var i = c.LastIndexOf('.'); return Sign(c[..i]) == c[(i + 1)..]; }
Console.WriteLine($"Original cookie valid: {Valid(cookie)}");
string tampered = cookie.Replace("\\"User\\"", "\\"Admin\\"");
Console.WriteLine($"Role changed to Admin, valid: {Valid(tampered)}");`,
        "Original cookie valid: True\nRole changed to Admin, valid: False",
      ),
    ],
  },

  "Built-in Cookie Authentication": {
    en: "AddCookie registers a handler that serialises your ClaimsPrincipal into an authentication ticket, encrypts it with ASP.NET Core Data Protection, and stores it in a cookie (named .AspNetCore.Cookies by default). On each request it decrypts the ticket, checks expiry, renews it when SlidingExpiration is on, and sets HttpContext.User. Challenge redirects to LoginPath with a ReturnUrl; Forbid redirects to AccessDeniedPath.",
    bn: "AddCookie এমন handler register করে যা ClaimsPrincipal-কে authentication ticket বানিয়ে Data Protection দিয়ে encrypt করে cookie-তে রাখে (default নাম .AspNetCore.Cookies)। প্রতি request-এ ticket decrypt করে মেয়াদ দেখে, SlidingExpiration চালু থাকলে নবায়ন করে, HttpContext.User বসায়। Challenge ReturnUrl সহ LoginPath-এ, Forbid AccessDeniedPath-এ পাঠায়।",
    theoryEn:
      "Compared with JWT-in-cookie, the built-in handler encrypts (not just signs) the cookie, so its contents are hidden; it handles login redirects, return URLs and sliding renewal for you; and it can validate the principal on each request (OnValidatePrincipal) to log out users whose role or password changed. You only write: build claims, SignInAsync, SignOutAsync.",
    theoryBn:
      "JWT-in-cookie-এর তুলনায় built-in handler cookie শুধু sign নয়, encrypt করে, ফলে ভেতরের তথ্য লুকানো; login redirect, return URL ও sliding নবায়ন নিজে সামলায়; আর প্রতি request-এ principal যাচাই করতে পারে (OnValidatePrincipal), ফলে role বা password বদলালে user-কে logout করা যায়। আপনি শুধু লেখেন: claim বানানো, SignInAsync, SignOutAsync।",
    storyEn:
      "A hotel gives you a key card. The card is sealed, so you cannot read or edit what is inside. Each door reads it; if you are an hour from checkout and still active, reception quietly extends it (sliding). The pool door says 'guests only' and the gym door 'premium only': same card, different rules.",
    storyBn:
      "হোটেল একটি key card দেয়। কার্ড সিল করা, ভেতরের তথ্য পড়া বা বদলানো যায় না। প্রতিটি দরজা এটি পড়ে; checkout-এর কাছাকাছি সময়েও সক্রিয় থাকলে reception চুপচাপ মেয়াদ বাড়ায় (sliding)। Pool-এর দরজায় 'শুধু অতিথি', gym-এ 'শুধু premium': একই কার্ড, ভিন্ন নিয়ম।",
    steps: [
      ["AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(...).", "AddCookie দিয়ে cookie scheme register করুন।"],
      ["At login, build claims including Role and call SignInAsync.", "Login-এ Role সহ claim বানিয়ে SignInAsync।"],
      ["Protect controllers with [Authorize] and [Authorize(Roles=...)].", "[Authorize] ও [Authorize(Roles=...)] দিয়ে সুরক্ষা।"],
      ["Logout with SignOutAsync; handle ReturnUrl safely with Url.IsLocalUrl.", "SignOutAsync দিয়ে logout; Url.IsLocalUrl দিয়ে ReturnUrl যাচাই।"],
    ],
    mistakesEn:
      "Redirecting to any ReturnUrl without Url.IsLocalUrl creates an open-redirect vulnerability. Running several instances without shared Data Protection keys makes cookies from one server unreadable on another. Mixing JWT and cookie schemes without saying which one an endpoint uses gives confusing 401s.",
    mistakesBn:
      "Url.IsLocalUrl ছাড়া যেকোনো ReturnUrl-এ redirect করলে open-redirect দুর্বলতা। Shared Data Protection key ছাড়া একাধিক instance চালালে এক server-এর cookie অন্যটি পড়তে পারে না। কোন endpoint কোন scheme ব্যবহার করবে না বলে JWT ও cookie মেশালে বিভ্রান্তিকর 401।",
    decisionEn:
      "Default choice for MVC and Razor Pages. For apps that need both a website and an API, register both schemes: cookies as the default for pages, and [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)] on API controllers. ASP.NET Core Identity builds on exactly this handler.",
    decisionBn:
      "MVC ও Razor Pages-এ এটিই default পছন্দ। Website ও API দুটোই লাগলে দুই scheme register করুন: page-এর জন্য cookie default, আর API controller-এ [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]। ASP.NET Core Identity ঠিক এই handler-এর উপর তৈরি।",
    examples: [
      webEx(
        "1. Cookie login with roles, runnable · role সহ cookie login",
        `using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(o =>
    {
        o.LoginPath = "/login";
        o.AccessDeniedPath = "/denied";
        o.ExpireTimeSpan = TimeSpan.FromMinutes(30);
        o.SlidingExpiration = true;
        o.Cookie.HttpOnly = true;
        o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        o.Cookie.SameSite = SameSiteMode.Lax;
    });
builder.Services.AddAuthorization();
var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/login", () => Results.Content("""
    <form method="post" action="/login">
      <input name="email" placeholder="admin@x.com or user@x.com" />
      <button>Login</button>
    </form>
    """, "text/html"));

app.MapPost("/login", async (HttpContext http) =>
{
    var email = http.Request.Form["email"].ToString();
    var role = email.StartsWith("admin") ? "Admin" : "User";
    var claims = new[] { new Claim(ClaimTypes.Name, email), new Claim(ClaimTypes.Role, role) };
    await http.SignInAsync(new ClaimsPrincipal(new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme)));
    return Results.Redirect("/dashboard");
}).DisableAntiforgery();   // demo only; MVC forms validate tokens

app.MapGet("/dashboard", (ClaimsPrincipal u) => $"Hi {u.Identity!.Name}, role {u.FindFirstValue(ClaimTypes.Role)}")
   .RequireAuthorization();
app.MapGet("/admin", () => "Admin panel").RequireAuthorization(p => p.RequireRole("Admin"));
app.MapGet("/denied", () => Results.Content("403: you do not have permission", "text/plain"));
app.MapGet("/logout", async (HttpContext http) => { await http.SignOutAsync(); return Results.Redirect("/login"); });
app.Run();`,
        "# Open https://localhost:5001/dashboard in a browser: redirected to /login\n# Log in as user@x.com, then open /admin: redirected to /denied\n# Log in as admin@x.com and open /admin: Admin panel",
      ),
      refEx(
        "2. MVC AccountController with SignInAsync · MVC-তে SignInAsync",
        `public class AccountController(AppDbContext db) : Controller
{
    [HttpGet]
    public IActionResult Login(string? returnUrl = null) { ViewData["ReturnUrl"] = returnUrl; return View(); }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(LoginViewModel vm, string? returnUrl = null)
    {
        if (!ModelState.IsValid) return View(vm);
        var user = await db.Users.SingleOrDefaultAsync(u => u.Email == vm.Email);
        if (user is null || new PasswordHasher<User>().VerifyHashedPassword(user, user.Password, vm.Password)
            == PasswordVerificationResult.Failed)
        {
            ModelState.AddModelError("", "Invalid email or password");
            return View(vm);
        }

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Email),
            new(ClaimTypes.Role, user.Role),
        };
        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(identity),
            new AuthenticationProperties { IsPersistent = vm.RememberMe });

        return Url.IsLocalUrl(returnUrl) ? Redirect(returnUrl!) : RedirectToAction("Index", "Dashboard");
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToAction(nameof(Login));
    }
}`,
        "The tutorial's bonus chapter: replace JWT-in-cookie with the built-in handler. IsPersistent keeps the cookie after the browser closes.",
        "Tutorial-এর bonus অধ্যায়: JWT-in-cookie-র বদলে built-in handler। IsPersistent browser বন্ধ হলেও cookie রাখে।",
      ),
      refEx(
        "3. Razor: show or hide by role · role অনুযায়ী দেখানো",
        `@* Views/Shared/_Layout.cshtml navbar *@
@if (User.Identity?.IsAuthenticated == true)
{
    <span>Hi, @User.Identity.Name</span>
    @if (User.IsInRole("Admin"))
    {
        <a asp-controller="Admin" asp-action="Users">Manage users</a>
    }
    <form asp-controller="Account" asp-action="Logout" method="post" class="d-inline">
        <button type="submit" class="btn btn-link">Logout</button>
    </form>
}
else
{
    <a asp-controller="Account" asp-action="Login">Login</a>
}`,
        "Hiding a link is only a convenience. The Admin controller must still have [Authorize(Roles = \"Admin\")].",
        "Link লুকানো শুধু সুবিধা। Admin controller-এ [Authorize(Roles = \"Admin\")] থাকতেই হবে।",
        "html",
      ),
    ],
  },

  "CSRF & Secure Cookies": {
    en: "Cross-Site Request Forgery works because browsers attach cookies to any request to your domain, even one started by evil.com. ASP.NET Core's anti-forgery system issues a pair of tokens: one in a cookie and one in the form's hidden field. An attacker's page can make the browser send the cookie but cannot read your page to copy the hidden value, so the pair does not match and the request is rejected with 400.",
    bn: "CSRF কাজ করে কারণ browser আপনার domain-এ যেকোনো request-এ cookie জুড়ে দেয়, এমনকি evil.com থেকে শুরু হলেও। ASP.NET Core-এর anti-forgery একজোড়া token দেয়: একটি cookie-তে, একটি form-এর লুকানো field-এ। Attacker-এর page browser দিয়ে cookie পাঠাতে পারে কিন্তু আপনার page পড়ে লুকানো মান কপি করতে পারে না, তাই জোড়া মেলে না, request 400 দিয়ে বাতিল।",
    theoryEn:
      "Three cookie flags do most of the work. HttpOnly hides the cookie from JavaScript, limiting what an XSS bug can steal. Secure sends it only over HTTPS. SameSite=Strict never sends it on cross-site requests; Lax sends it only on top-level GET navigations, which is why state-changing actions must be POST. Anti-forgery tokens add defence in depth for older browsers and same-site subdomains.",
    theoryBn:
      "তিনটি cookie flag বেশিরভাগ কাজ করে। HttpOnly JavaScript থেকে cookie লুকায়, ফলে XSS bug কম চুরি করতে পারে। Secure শুধু HTTPS-এ পাঠায়। SameSite=Strict অন্য site-এর request-এ কখনো পাঠায় না; Lax শুধু top-level GET navigation-এ পাঠায়, তাই data বদলানো action অবশ্যই POST। Anti-forgery token পুরনো browser ও একই site-এর subdomain-এর বিরুদ্ধে অতিরিক্ত সুরক্ষা।",
    storyEn:
      "A shop accepts orders from anyone wearing its membership badge. A trickster cannot steal your badge, but he can push you through the door while you are wearing it. So the cashier also asks for today's secret word, printed only on the shop's own order form.",
    storyBn:
      "একটি দোকান membership ব্যাজ পরা যে কারো অর্ডার নেয়। প্রতারক ব্যাজ চুরি করতে পারে না, কিন্তু ব্যাজ পরা অবস্থায় আপনাকে দরজা দিয়ে ঠেলে দিতে পারে। তাই cashier আজকের গোপন শব্দও চান, যা শুধু দোকানের নিজের অর্ডার ফর্মে ছাপা।",
    steps: [
      ["Make every state-changing action [HttpPost] (or PUT/DELETE).", "Data বদলানো প্রতিটি action [HttpPost] (বা PUT/DELETE) করুন।"],
      ["Use <form asp-action> so the hidden token is added.", "<form asp-action> ব্যবহার করুন যাতে token যোগ হয়।"],
      ["Add [ValidateAntiForgeryToken] or the global AutoValidate filter.", "[ValidateAntiForgeryToken] বা global AutoValidate filter দিন।"],
      ["Set HttpOnly, Secure and SameSite on auth cookies.", "Auth cookie-তে HttpOnly, Secure, SameSite দিন।"],
    ],
    mistakesEn:
      "A GET link that deletes (/Product/Delete/5) can be triggered by an <img> tag on any site. Writing a raw <form> with a hand-typed action URL skips the token. AJAX calls must send the token in a header (RequestVerificationToken) when you validate globally.",
    mistakesBn:
      "Delete করা GET link (/Product/Delete/5) যেকোনো site-এর <img> tag দিয়েও চালানো যায়। হাতে লেখা action URL-সহ raw <form> token বাদ দেয়। Global validation চালু থাকলে AJAX call-এ header-এ (RequestVerificationToken) token পাঠাতে হবে।",
    decisionEn:
      "Use AutoValidateAntiforgeryTokenAttribute globally in MVC apps so you cannot forget it. Pure JSON APIs that use Bearer tokens in headers do not need anti-forgery, but if your API reads auth from cookies, it does. Pair this with Content-Security-Policy headers to reduce XSS.",
    decisionBn:
      "MVC app-এ global AutoValidateAntiforgeryTokenAttribute দিন যাতে ভুলে না যান। Header-এ Bearer token ব্যবহার করা JSON API-তে anti-forgery লাগে না, কিন্তু API cookie থেকে auth পড়লে লাগে। XSS কমাতে Content-Security-Policy header-ও দিন।",
    examples: [
      refEx(
        "1. Global anti-forgery and secure cookie defaults · global সুরক্ষা",
        `builder.Services.AddControllersWithViews(o =>
    o.Filters.Add(new AutoValidateAntiforgeryTokenAttribute()));   // every POST/PUT/DELETE checked

builder.Services.AddAntiforgery(o =>
{
    o.HeaderName = "RequestVerificationToken";                       // for fetch/AJAX
    o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    o.Cookie.SameSite = SameSiteMode.Strict;
});

builder.Services.Configure<CookiePolicyOptions>(o =>
{
    o.MinimumSameSitePolicy = SameSiteMode.Lax;
    o.HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.Always;
    o.Secure = CookieSecurePolicy.Always;
});

var app = builder.Build();
app.UseHsts();
app.UseHttpsRedirection();
app.UseCookiePolicy();`,
        "Program.cs settings for an MVC app. UseHsts tells browsers to use HTTPS for your domain from now on.",
        "MVC app-এর Program.cs setting। UseHsts browser-কে বলে এখন থেকে আপনার domain-এ HTTPS ব্যবহার করতে।",
      ),
      refEx(
        "2. Safe delete form and AJAX with the token · নিরাপদ delete ও AJAX",
        `@* Razor: delete must be a POST form *@
<form asp-action="Delete" asp-route-id="@item.Id" method="post"
      onsubmit="return confirm('Delete this product?')">
    <button type="submit" class="btn btn-danger">Delete</button>
</form>

@* AJAX: read the token rendered by @Html.AntiForgeryToken() *@
@Html.AntiForgeryToken()
<script>
  async function deleteProduct(id) {
    const token = document.querySelector('input[name="__RequestVerificationToken"]').value;
    const res = await fetch('/Product/Delete/' + id, {
      method: 'POST',
      headers: { 'RequestVerificationToken': token }
    });
    if (res.ok) location.reload();
  }
</script>`,
        "The MVC tutorial's exercise: turn the Delete link into a POST form with a confirm dialog.",
        "MVC tutorial-এর অনুশীলন: Delete link-কে confirm dialog সহ POST form বানানো।",
        "html",
      ),
      consoleEx(
        "3. Token pair check, simplified · token জোড়া যাচাই (সরল)",
        `using System.Security.Cryptography;

string NewToken() => Convert.ToHexString(RandomNumberGenerator.GetBytes(16));

string cookieToken = NewToken();            // browser stores this in a cookie
string formToken = cookieToken;             // your page renders the same value in a hidden field

bool Accept(string? cookie, string? form) => cookie is not null && form is not null &&
    CryptographicOperations.FixedTimeEquals(Convert.FromHexString(cookie), Convert.FromHexString(form));

Console.WriteLine($"Your own form: {(Accept(cookieToken, formToken) ? "accepted" : "400 rejected")}");
Console.WriteLine($"evil.com form (no hidden value): {(Accept(cookieToken, null) ? "accepted" : "400 rejected")}");
Console.WriteLine($"evil.com guessing: {(Accept(cookieToken, NewToken()) ? "accepted" : "400 rejected")}");`,
        "Your own form: accepted\nevil.com form (no hidden value): 400 rejected\nevil.com guessing: 400 rejected",
      ),
    ],
  },

  "Global Error Handling": {
    en: "UseExceptionHandler adds middleware near the start of the pipeline that wraps everything after it in a try-catch. When an exception escapes a controller, the middleware clears the response, calls your IExceptionHandler implementations in order, and, if none handles it, writes a ProblemDetails 500. In Development you can still show the detailed developer page.",
    bn: "UseExceptionHandler pipeline-এর শুরুর দিকে এমন middleware যোগ করে যা পরের সবকিছুকে try-catch-এ মুড়ে রাখে। Controller থেকে exception বেরোলে middleware response পরিষ্কার করে, আপনার IExceptionHandler-গুলো ক্রমানুসারে ডাকে, কেউ না সামলালে ProblemDetails 500 লেখে। Development-এ বিস্তারিত developer page দেখানো যায়।",
    theoryEn:
      "Exceptions are for unexpected situations: the database is down, a null slipped through. Expected outcomes (not found, duplicate) are better returned as results. A global handler gives you one place to log with context (path, user, traceId), map special exception types to status codes, and hide internals. The client gets a stable JSON shape it can display.",
    theoryBn:
      "Exception অপ্রত্যাশিত অবস্থার জন্য: database বন্ধ, কোথাও null ঢুকে গেছে। প্রত্যাশিত ফল (পাওয়া যায়নি, duplicate) result হিসেবে ফেরত দেওয়াই ভালো। Global handler এক জায়গায় context (path, user, traceId) সহ log, বিশেষ exception-কে status code-এ রূপান্তর, আর ভেতরের তথ্য লুকানোর সুযোগ দেয়। Client একটি স্থির JSON আকার পায়।",
    storyEn:
      "In a factory, any worker who sees a problem presses the same red button. One supervisor comes, writes it in the incident book, and puts a polite 'temporarily unavailable' sign at the front desk. Customers never see the broken machine.",
    storyBn:
      "কারখানায় যে কোনো কর্মী সমস্যা দেখলে একই লাল বোতাম চাপেন। একজন supervisor এসে ঘটনার খাতায় লেখেন, আর সামনের ডেস্কে ভদ্রভাবে 'সাময়িকভাবে বন্ধ' লেখা দেন। ক্রেতা ভাঙা যন্ত্র দেখেন না।",
    steps: [
      ["AddProblemDetails() and AddExceptionHandler<T>().", "AddProblemDetails() ও AddExceptionHandler<T>() দিন।"],
      ["app.UseExceptionHandler() early in the pipeline.", "Pipeline-এর শুরুতে app.UseExceptionHandler()।"],
      ["Log the exception with the traceId; return a safe message.", "TraceId সহ log; নিরাপদ বার্তা ফেরত।"],
      ["Remove try { } catch { throw; } blocks from actions.", "Action থেকে try { } catch { throw; } সরান।"],
    ],
    mistakesEn:
      "Returning ex.Message or the stack trace to clients leaks internals such as table names. Catching Exception in every action and returning 200 with an error message hides failures from monitoring. Placing UseExceptionHandler after other middleware leaves them unprotected.",
    mistakesBn:
      "Client-কে ex.Message বা stack trace দিলে table নামের মতো ভেতরের তথ্য ফাঁস হয়। প্রতিটি action-এ Exception ধরে error বার্তাসহ 200 দিলে monitoring ব্যর্থতা দেখে না। অন্য middleware-এর পরে UseExceptionHandler দিলে সেগুলো অরক্ষিত থাকে।",
    decisionEn:
      "Combine with structured logging (Serilog or OpenTelemetry) so the traceId in the response finds the log entry. Map validation and domain exceptions to 400/404/409 in the handler, keep 500 for genuine bugs, and alert on the 500 rate.",
    decisionBn:
      "Structured logging (Serilog বা OpenTelemetry) যুক্ত করুন যাতে response-এর traceId দিয়ে log খোঁজা যায়। Handler-এ validation ও domain exception-কে 400/404/409-এ রূপান্তর করুন, 500 শুধু আসল bug-এর জন্য, আর 500-এর হারে alert দিন।",
    examples: [
      webEx(
        "1. IExceptionHandler with ProblemDetails · ProblemDetails সহ handler",
        `using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<NotFoundHandler>();     // runs first
builder.Services.AddExceptionHandler<GlobalHandler>();       // fallback
var app = builder.Build();
app.UseExceptionHandler();

app.MapGet("/employees/{id:int}", (int id) =>
    id == 1 ? Results.Ok(new { id, name = "Asha" }) : throw new NotFoundException($"Employee {id}"));
app.MapGet("/crash", () => { throw new InvalidOperationException("DB connection string missing"); });
app.Run();

public class NotFoundException(string what) : Exception($"{what} was not found");

public class NotFoundHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext ctx, Exception ex, CancellationToken ct)
    {
        if (ex is not NotFoundException) return false;
        ctx.Response.StatusCode = 404;
        await ctx.Response.WriteAsJsonAsync(new ProblemDetails { Status = 404, Title = ex.Message }, ct);
        return true;
    }
}

public class GlobalHandler(ILogger<GlobalHandler> log) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext ctx, Exception ex, CancellationToken ct)
    {
        log.LogError(ex, "Unhandled error on {Path} trace {TraceId}", ctx.Request.Path, ctx.TraceIdentifier);
        ctx.Response.StatusCode = 500;
        await ctx.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = 500,
            Title = "Something went wrong. Please try again.",
            Extensions = { ["traceId"] = ctx.TraceIdentifier },
        }, ct);
        return true;
    }
}`,
        "curl -k https://localhost:5001/employees/1\ncurl -k -i https://localhost:5001/employees/9   # 404 ProblemDetails\ncurl -k -i https://localhost:5001/crash         # 500, no internal message",
      ),
      consoleEx(
        "2. Expected results vs exceptions · প্রত্যাশিত ফল বনাম exception",
        `var store = new Dictionary<int, string> { [1] = "Asha" };

Result Find(int id) => store.TryGetValue(id, out var name) ? Result.Ok(name) : Result.NotFound($"Employee {id}");

foreach (var id in new[] { 1, 7 })
{
    var r = Find(id);
    Console.WriteLine(r.Success ? $"200 {r.Value}" : $"404 {r.Error} not found");
}

public record Result(bool Success, string? Value, string? Error)
{
    public static Result Ok(string v) => new(true, v, null);
    public static Result NotFound(string e) => new(false, null, e);
}`,
        "200 Asha\n404 Employee 7 not found",
      ),
      refEx(
        "3. What the client receives · client কী পায়",
        `HTTP/1.1 500 Internal Server Error
Content-Type: application/problem+json

{
  "title": "Something went wrong. Please try again.",
  "status": 500,
  "traceId": "0HN4K2V3P8Q1R:00000001"
}`,
        "The traceId matches the server log line, so support can find the real error without exposing it.",
        "TraceId server log-এর সাথে মেলে, তাই আসল error প্রকাশ না করেই support খুঁজে পায়।",
        "http",
      ),
    ],
  },

  "Refresh Tokens & Logout": {
    en: "The client stores two tokens. The access token (JWT, 5 to 15 minutes) goes with every API call. The refresh token (random, days) is sent only to /api/auth/refresh. The server looks it up by hash, checks it is not expired or revoked, marks it used, and returns a new access token and a new refresh token (rotation). Logout revokes the refresh token, so no new access tokens can be minted.",
    bn: "Client দুটি token রাখে। Access token (JWT, ৫ থেকে ১৫ মিনিট) প্রতিটি API call-এ যায়। Refresh token (random, কয়েক দিন) শুধু /api/auth/refresh-এ যায়। Server hash দিয়ে খোঁজে, মেয়াদ বা বাতিল কি না দেখে, ব্যবহৃত চিহ্ন দেয়, আর নতুন access ও refresh token দেয় (rotation)। Logout refresh token বাতিল করে, ফলে নতুন access token আর তৈরি হয় না।",
    theoryEn:
      "This solves the JWT logout problem from earlier lessons. The access token is still stateless and fast to check, but it lives only minutes. The refresh token is stateful: it lives in your database, so you can revoke it per device, list a user's sessions, and detect theft. If an already-used refresh token appears again, someone copied it: revoke every token in that family and force a new login.",
    theoryBn:
      "এটি আগের lesson-এর JWT logout সমস্যা সমাধান করে। Access token এখনো stateless ও দ্রুত যাচাইযোগ্য, কিন্তু কয়েক মিনিট বাঁচে। Refresh token stateful: database-এ থাকে, তাই device অনুযায়ী বাতিল, user-এর session তালিকা আর চুরি ধরা যায়। আগে ব্যবহৃত refresh token আবার এলে কেউ কপি করেছে: সেই family-র সব token বাতিল করে নতুন login বাধ্য করুন।",
    storyEn:
      "An office gives you a day pass (access token) that the guard checks quickly, and a membership card (refresh token) kept at reception. Each morning you swap yesterday's card for a new card and a new day pass. If someone shows an old card, reception knows it was copied and cancels your membership until you visit in person.",
    storyBn:
      "অফিস একটি day pass (access token) দেয় যা গার্ড দ্রুত দেখেন, আর একটি membership card (refresh token) যা reception-এ থাকে। প্রতিদিন সকালে পুরনো কার্ড দিয়ে নতুন কার্ড ও নতুন day pass নেন। কেউ পুরনো কার্ড দেখালে reception বোঝে কপি হয়েছে, আর সশরীরে না আসা পর্যন্ত membership বন্ধ রাখে।",
    steps: [
      ["Create a RefreshToken entity (hash, userId, expires, revoked, replacedBy).", "RefreshToken entity বানান (hash, userId, মেয়াদ, বাতিল, replacedBy)।"],
      ["At login return both tokens; store only the refresh token's hash.", "Login-এ দুটি token দিন; refresh token-এর শুধু hash রাখুন।"],
      ["POST /refresh validates, rotates and returns a new pair.", "POST /refresh যাচাই, rotate ও নতুন জোড়া দেয়।"],
      ["POST /logout revokes; reuse of a revoked token revokes the family.", "POST /logout বাতিল করে; বাতিল token আবার এলে পুরো family বাতিল।"],
    ],
    mistakesEn:
      "Making the refresh token a long-lived JWT means you cannot revoke it. Storing it in plain text means a database leak hands out sessions. Forgetting rotation lets a stolen refresh token work for its whole lifetime.",
    mistakesBn:
      "Refresh token-কে দীর্ঘমেয়াদি JWT বানালে বাতিল করা যায় না। Plain text-এ রাখলে database ফাঁস হলে session-ও ফাঁস। Rotation না থাকলে চুরি করা refresh token পুরো মেয়াদ চলে।",
    decisionEn:
      "For browser SPAs, keep the refresh token in an HttpOnly, Secure, SameSite=Strict cookie with Path=/api/auth, and the access token in memory. For mobile apps use the platform's secure storage. Managed identity providers implement all of this for you via OAuth 2.0 and OpenID Connect.",
    decisionBn:
      "Browser SPA-তে refresh token HttpOnly, Secure, SameSite=Strict, Path=/api/auth cookie-তে, আর access token memory-তে রাখুন। Mobile app-এ platform-এর secure storage। Managed identity provider OAuth 2.0 ও OpenID Connect দিয়ে এ সবই করে দেয়।",
    examples: [
      consoleEx(
        "1. Rotation and theft detection · rotation ও চুরি ধরা",
        `using System.Security.Cryptography;
using System.Text;

var db = new List<RefreshToken>();
string Hash(string t) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(t)));

string Issue(string user, string family)
{
    var raw = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
    db.Add(new RefreshToken { Hash = Hash(raw), User = user, Family = family, Expires = DateTime.UtcNow.AddDays(7) });
    return raw;
}

string? Refresh(string raw)
{
    var t = db.SingleOrDefault(x => x.Hash == Hash(raw));
    if (t is null || t.Expires < DateTime.UtcNow) return null;
    if (t.Revoked)
    {
        db.Where(x => x.Family == t.Family).ToList().ForEach(x => x.Revoked = true);   // theft
        return null;
    }
    t.Revoked = true;
    return Issue(t.User, t.Family);
}

var first = Issue("asha", "laptop");
var second = Refresh(first);
Console.WriteLine($"Refresh with first: {(second is null ? "rejected" : "new token")}");
Console.WriteLine($"Attacker reuses first: {(Refresh(first) is null ? "rejected" : "new token")}");
Console.WriteLine($"Real user uses second: {(Refresh(second!) is null ? "rejected, family revoked" : "new token")}");

public class RefreshToken
{
    public string Hash { get; set; } = ""; public string User { get; set; } = ""; public string Family { get; set; } = "";
    public DateTime Expires { get; set; } public bool Revoked { get; set; }
}`,
        "Refresh with first: new token\nAttacker reuses first: rejected\nReal user uses second: rejected, family revoked",
      ),
      refEx(
        "2. Refresh and logout endpoints · refresh ও logout endpoint",
        `[HttpPost("refresh"), AllowAnonymous]
public async Task<IActionResult> Refresh(RefreshRequest req)
{
    var hash = TokenHasher.Sha256(req.RefreshToken);
    var stored = await db.RefreshTokens.Include(t => t.User).SingleOrDefaultAsync(t => t.TokenHash == hash);
    if (stored is null || stored.ExpiresAt < DateTime.UtcNow) return Unauthorized();

    if (stored.RevokedAt is not null)                       // reuse = theft
    {
        await db.RefreshTokens.Where(t => t.FamilyId == stored.FamilyId && t.RevokedAt == null)
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.RevokedAt, DateTime.UtcNow));
        return Unauthorized();
    }

    var (raw, next) = RefreshToken.CreateFor(stored.User, stored.FamilyId);
    stored.RevokedAt = DateTime.UtcNow;
    stored.ReplacedByHash = next.TokenHash;
    db.RefreshTokens.Add(next);
    await db.SaveChangesAsync();
    return Ok(new { accessToken = jwtFactory.Create(stored.User), refreshToken = raw });
}

[HttpPost("logout"), Authorize]
public async Task<IActionResult> Logout(RefreshRequest req)
{
    var hash = TokenHasher.Sha256(req.RefreshToken);
    var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    await db.RefreshTokens.Where(t => t.TokenHash == hash && t.UserId == userId)
        .ExecuteUpdateAsync(s => s.SetProperty(t => t.RevokedAt, DateTime.UtcNow));
    return NoContent();
}`,
        "AuthController endpoints. The new role from an Admin promotion appears in the very next refreshed access token.",
        "AuthController endpoint। Admin promote করার পর নতুন role পরের refresh করা access token-এই দেখা যায়।",
      ),
      refEx(
        "3. Client flow · client-এর ধাপ",
        `1. POST /api/auth/login            -> { accessToken (15 min), refreshToken (7 days) }
2. GET  /api/employees              Authorization: Bearer <accessToken>   -> 200
3. ...15 minutes later...           -> 401 (token expired)
4. POST /api/auth/refresh           { refreshToken }   -> new accessToken + new refreshToken
5. Retry step 2 with the new token  -> 200
6. POST /api/auth/logout            { refreshToken }   -> 204, refresh token revoked
7. POST /api/auth/refresh (old)     -> 401, user must log in again`,
        "Most HTTP clients implement steps 3 to 5 in an interceptor so the user never notices.",
        "বেশিরভাগ HTTP client ৩ থেকে ৫ ধাপ interceptor-এ করে, ফলে user টেরই পায় না।",
        "bash",
      ),
    ],
  },
};
