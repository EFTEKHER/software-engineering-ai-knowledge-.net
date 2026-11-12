// Module 04 Object-Oriented Design: easy story, plain theory, steps, mistakes, interview, 2028 tip, runnable C#.
import { cs } from "./helpers";

export default {
  "OOP Pillars": {
    s: ["A TV remote: you press 'volume up' without knowing the circuits inside (abstraction, encapsulation). A smart-TV remote is a remote with extra buttons (inheritance). The same 'power' button works on any brand (polymorphism).", "TV-র remote: ভিতরের circuit না জেনেই 'volume up' চাপেন (abstraction, encapsulation)। Smart-TV-র remote হলো বাড়তি বোতামসহ remote (inheritance)। একই 'power' বোতাম যেকোনো brand-এ কাজ করে (polymorphism)।"],
    t: ["Encapsulation hides data behind methods so objects stay valid. Abstraction exposes what an object does, not how. Inheritance lets a class reuse and extend a base class. Polymorphism lets code call the same method on different types and get type-specific behaviour, usually through interfaces or virtual methods.", "Encapsulation method-এর পিছনে data লুকিয়ে object-কে বৈধ রাখে। Abstraction দেখায় object কী করে, কীভাবে নয়। Inheritance একটি class-কে base class পুনর্ব্যবহার ও বাড়াতে দেয়। Polymorphism একই method ভিন্ন ধরনে ডেকে ধরন-নির্দিষ্ট আচরণ দেয়, সাধারণত interface বা virtual method দিয়ে।"],
    p: [["Make fields private; expose behaviour through methods.", "Field private রাখুন; method দিয়ে আচরণ দেখান।"], ["Validate inside constructors and methods so invalid states are impossible.", "Constructor ও method-এর ভিতরে যাচাই করুন যাতে অবৈধ অবস্থা অসম্ভব হয়।"], ["Define interfaces for roles (IPaymentMethod).", "ভূমিকার জন্য interface বানান (IPaymentMethod)।"], ["Call through the interface and let each type do its own thing.", "Interface দিয়ে ডাকুন, প্রতিটি ধরন নিজের কাজ করুক।"]],
    m: ["Public setters everywhere so anyone can break rules; deep inheritance trees; type checks (if obj is X) instead of polymorphism.", "সব জায়গায় public setter, ফলে যে কেউ নিয়ম ভাঙতে পারে; গভীর inheritance গাছ; polymorphism-এর বদলে ধরন পরীক্ষা (if obj is X)।"],
    q: ["Q: Explain polymorphism with a real example. A: An IPaymentMethod with Pay(amount); bKash, Card and Cash each implement it differently; checkout code loops over them without knowing the concrete type.", "প্রশ্ন: বাস্তব উদাহরণে polymorphism বোঝান। উত্তর: Pay(amount)-সহ IPaymentMethod; bKash, Card ও Cash প্রত্যেকে ভিন্নভাবে বাস্তবায়ন করে; checkout code নির্দিষ্ট ধরন না জেনেই loop চালায়।"],
    f: ["Well-encapsulated code with clear interfaces is also easier for AI tools to modify safely: the rules live in one place and the compiler protects them.", "স্পষ্ট interface-সহ ভালো encapsulated code AI tool-এর জন্যও নিরাপদে বদলানো সহজ: নিয়ম এক জায়গায় থাকে এবং compiler তা রক্ষা করে।"],
    x: [cs("Encapsulated account and polymorphic payments · encapsulation ও polymorphism", `var account = new Wallet(500m);
account.Withdraw(200m);
try { account.Withdraw(1000m); } catch (InvalidOperationException e) { Console.WriteLine(e.Message); }
Console.WriteLine($"balance: {account.Balance}");

IPaymentMethod[] methods = [new BKash("01711000000"), new Card("4111"), new Cash()];
foreach (var m in methods) Console.WriteLine(m.Pay(350m));

class Wallet(decimal opening)
{
    public decimal Balance { get; private set; } = opening;       // no public setter
    public void Withdraw(decimal amount)
    {
        if (amount <= 0) throw new ArgumentOutOfRangeException(nameof(amount));
        if (amount > Balance) throw new InvalidOperationException("Insufficient balance");
        Balance -= amount;
    }
}
interface IPaymentMethod { string Pay(decimal amount); }
class BKash(string phone) : IPaymentMethod { public string Pay(decimal a) => $"bKash {phone[^4..]} paid {a}"; }
class Card(string last4) : IPaymentMethod { public string Pay(decimal a) => $"Card ****{last4} paid {a}"; }
class Cash : IPaymentMethod { public string Pay(decimal a) => $"Cash on delivery: {a}"; }`, "Insufficient balance\nbalance: 300\nbKash 0000 paid 350\nCard ****4111 paid 350\nCash on delivery: 350")],
  },
  "SOLID Principles": {
    s: ["A good kitchen: each cook has one job (S), you add a new dish without rebuilding the stove (O), any trained cook can replace another (L), cooks only get the tools they need (I), and the head chef orders 'a cook', not 'Rahim specifically' (D).", "ভালো রান্নাঘর: প্রত্যেক রাঁধুনির একটি কাজ (S), চুলা নতুন না বানিয়ে নতুন পদ যোগ (O), যেকোনো প্রশিক্ষিত রাঁধুনি অন্যের জায়গা নিতে পারে (L), রাঁধুনিরা শুধু দরকারি tool পায় (I), আর প্রধান রাঁধুনি 'একজন রাঁধুনি' চান, 'নির্দিষ্টভাবে রহিম' নয় (D)।"],
    t: ["S: a class has one reason to change. O: open for extension (new classes), closed for modification. L: subtypes must work wherever the base type is expected. I: many small interfaces beat one fat one. D: depend on abstractions; inject dependencies through constructors. In ASP.NET Core, DI makes D natural.", "S: একটি class-এর বদলানোর একটিই কারণ। O: বাড়ানোর জন্য খোলা (নতুন class), বদলানোর জন্য বন্ধ। L: base type প্রত্যাশিত যেকোনো জায়গায় subtype কাজ করবে। I: একটি মোটা interface-এর চেয়ে অনেক ছোট interface ভালো। D: abstraction-এর উপর নির্ভর করুন; constructor দিয়ে dependency inject করুন। ASP.NET Core-এ DI D-কে স্বাভাবিক করে।"],
    p: [["Find a class doing many jobs; split it.", "অনেক কাজ করা class খুঁজে ভাগ করুন।"], ["Replace switch-on-type with an interface and implementations.", "ধরন অনুযায়ী switch-কে interface ও বাস্তবায়নে বদলান।"], ["Inject dependencies via constructor parameters.", "Constructor parameter দিয়ে dependency inject করুন।"], ["Write a unit test with a fake to prove decoupling.", "Decoupling প্রমাণে fake দিয়ে unit test লিখুন।"]],
    m: ["Applying SOLID mechanically and creating dozens of tiny classes; a subclass that throws NotSupportedException (breaks L); new-ing dependencies inside classes (hard to test).", "যান্ত্রিকভাবে SOLID প্রয়োগ করে ডজনখানেক ছোট class; NotSupportedException দেওয়া subclass (L ভাঙে); class-এর ভিতরে dependency new করা (test কঠিন)।"],
    q: ["Q: Give a Liskov violation. A: Square inheriting Rectangle: setting width changes height, so code that expects a Rectangle's independent sides breaks.", "প্রশ্ন: Liskov ভঙ্গের উদাহরণ দিন। উত্তর: Rectangle থেকে inherit করা Square: width দিলে height বদলায়, তাই Rectangle-এর স্বাধীন বাহু আশা করা code ভাঙে।"],
    f: ["SOLID code has seams for testing and swapping parts, for example replacing a cloud AI client with a fake in tests, or a local model in production.", "SOLID code-এ test ও অংশ বদলানোর জায়গা থাকে, যেমন test-এ cloud AI client-এর বদলে fake, বা production-এ local model।"],
    x: [cs("Open/closed discounts with injected rules · inject করা নিয়মে discount", `var checkout = new Checkout([new EidDiscount(), new BulkDiscount()]);
Console.WriteLine(checkout.Total(6000m, items: 3));
Console.WriteLine(checkout.Total(2000m, items: 12));
Console.WriteLine(checkout.Total(2000m, items: 1));

// D: Checkout depends on the abstraction; O: add a rule by adding a class
interface IDiscountRule { decimal Apply(decimal total, int items); }
class EidDiscount : IDiscountRule { public decimal Apply(decimal t, int i) => t >= 5000 ? t * 0.10m : 0; }
class BulkDiscount : IDiscountRule { public decimal Apply(decimal t, int i) => i >= 10 ? 150 : 0; }
class Checkout(IEnumerable<IDiscountRule> rules)
{
    public string Total(decimal total, int items)
    {
        decimal discount = rules.Max(r => r.Apply(total, items));   // best single discount
        return $"{total} -> {total - discount} (saved {discount})";
    }
}`, "6000 -> 5400.00 (saved 600.00)\n2000 -> 1850 (saved 150)\n2000 -> 2000 (saved 0)")],
  },
  "DRY / KISS / YAGNI": {
    s: ["Writing your home address on every envelope by hand versus using a printed label (DRY). Giving directions as 'second left, then the blue gate' instead of GPS coordinates (KISS). Not buying a 12-seat car 'in case' you have ten children one day (YAGNI).", "প্রতিটি খামে হাতে ঠিকানা লেখা বনাম ছাপানো label (DRY)। GPS coordinate-এর বদলে 'দ্বিতীয় বাঁয়ে, তারপর নীল গেট' বলে পথ বলা (KISS)। একদিন দশ সন্তান হতে পারে ভেবে ১২ আসনের গাড়ি না কেনা (YAGNI)।"],
    t: ["DRY: one piece of knowledge should live in one place, so a change happens once. KISS: the simplest working design is usually the best. YAGNI: do not build features or abstractions until you actually need them. They balance each other: over-applying DRY can create confusing abstractions; duplicating twice is fine, three times suggests extraction.", "DRY: এক টুকরো জ্ঞান এক জায়গায় থাকবে, যাতে পরিবর্তন একবারই হয়। KISS: কাজ করা সবচেয়ে সহজ design সাধারণত সেরা। YAGNI: সত্যিই দরকার না হওয়া পর্যন্ত feature বা abstraction বানাবেন না। এরা একে অপরকে ভারসাম্য দেয়: অতিরিক্ত DRY বিভ্রান্তিকর abstraction বানাতে পারে; দুবার পুনরাবৃত্তি ঠিক আছে, তিনবার হলে আলাদা করার সংকেত।"],
    p: [["Spot the same rule written in several places.", "কয়েক জায়গায় লেখা একই নিয়ম খুঁজুন।"], ["Extract it into one well-named method or constant.", "একটি ভালো নামের method বা constant-এ সরান।"], ["Delete code paths nobody uses.", "কেউ ব্যবহার করে না এমন code path মুছুন।"], ["Prefer plain code over clever generic frameworks.", "চতুর generic framework-এর চেয়ে সহজ code পছন্দ করুন।"]],
    m: ["Merging two things that only look similar (they will change differently); building plugin systems 'for the future'; clever one-liners nobody can read.", "শুধু দেখতে একই রকম দুটি জিনিস মেলানো (তারা ভিন্নভাবে বদলাবে); 'ভবিষ্যতের জন্য' plugin system বানানো; কেউ পড়তে পারে না এমন চতুর এক-লাইন।"],
    q: ["Q: When is duplication acceptable? A: When the two pieces represent different business concepts that happen to look alike today; coupling them would make future changes harder.", "প্রশ্ন: কখন পুনরাবৃত্তি গ্রহণযোগ্য? উত্তর: যখন দুটি অংশ ভিন্ন ব্যবসায়িক ধারণা, আজ শুধু দেখতে একই; তাদের জুড়ে দিলে ভবিষ্যতের পরিবর্তন কঠিন হবে।"],
    f: ["AI assistants happily generate lots of code. KISS and YAGNI are your filters: accept the smallest change that solves today's problem.", "AI assistant আনন্দের সাথে প্রচুর code তৈরি করে। KISS ও YAGNI আপনার ছাঁকনি: আজকের সমস্যা সমাধান করে এমন সবচেয়ে ছোট পরিবর্তন গ্রহণ করুন।"],
    x: [cs("One source of truth for a business rule · ব্যবসার নিয়মের একটি উৎস", `// KISS: a simple method, not a "pricing engine" (YAGNI)
string Invoice(string item, decimal net) => $"{item,-8} net {net,7} | total {Tax.WithVat(net),8}";

Console.WriteLine(Invoice("Laptop", 80000m));
Console.WriteLine(Invoice("Mouse", 650m));
Console.WriteLine($"VAT rate used everywhere: {Tax.VatRate * 100:0}%");

// DRY: the VAT rule lives in one place
static class Tax
{
    public const decimal VatRate = 0.15m;
    public static decimal WithVat(decimal net) => Math.Round(net * (1 + VatRate), 2);
}`, "Laptop   net   80000 | total 92000.00\nMouse    net     650 | total   747.50\nVAT rate used everywhere: 15%")],
  },
  "Composition over Inheritance": {
    s: ["Building a robot from Lego blocks (arms, wheels, camera) that you can swap, instead of carving it from one solid piece of wood. Composition builds objects from parts; inheritance carves them from a parent.", "এক টুকরো কাঠ খোদাই না করে বদলানো যায় এমন Lego block (হাত, চাকা, ক্যামেরা) দিয়ে robot বানানো। Composition অংশ দিয়ে object বানায়; inheritance parent থেকে খোদাই করে।"],
    t: ["Inheritance is an 'is-a' relationship fixed at compile time; deep hierarchies become fragile when the base changes. Composition is 'has-a': an object holds other objects behind interfaces and delegates work to them. You can mix behaviours and swap them at runtime (e.g., change a notifier from email to SMS) without new subclasses.", "Inheritance হলো compile time-এ স্থির 'is-a' সম্পর্ক; base বদলালে গভীর hierarchy ভঙ্গুর হয়। Composition হলো 'has-a': একটি object interface-এর পিছনে অন্য object রাখে এবং কাজ তাদের দেয়। নতুন subclass ছাড়াই আচরণ মেশানো ও runtime-এ বদলানো যায় (যেমন email থেকে SMS notifier)।"],
    p: [["Ask: is it truly an 'is-a' relationship for its whole life?", "জিজ্ঞেস করুন: সারা জীবন কি সত্যিই 'is-a' সম্পর্ক?"], ["Extract varying behaviour into an interface.", "পরিবর্তনশীল আচরণ interface-এ সরান।"], ["Inject the behaviour through the constructor.", "Constructor দিয়ে আচরণ inject করুন।"], ["Swap implementations in tests and configuration.", "Test ও configuration-এ বাস্তবায়ন বদলান।"]],
    m: ["Inheriting just to reuse a helper method; class explosion (EmailSmsUrgentNotifier); overriding base methods in surprising ways.", "শুধু একটি helper method পুনর্ব্যবহারের জন্য inherit; class বিস্ফোরণ (EmailSmsUrgentNotifier); অবাক করা উপায়ে base method override।"],
    q: ["Q: How would you add logging to an existing repository without changing it? A: Composition with a decorator: LoggingRepository implements the same interface, holds the real repository and logs around each call.", "প্রশ্ন: পরিবর্তন না করে বিদ্যমান repository-তে logging কীভাবে যোগ করবেন? উত্তর: Decorator-সহ composition: LoggingRepository একই interface বাস্তবায়ন করে, আসল repository রাখে এবং প্রতিটি call-এর চারপাশে log করে।"],
    f: ["Microsoft.Extensions.AI builds AI clients by composition (logging, caching, telemetry and tool calling wrapped around a model client). Learn the pattern here and you will recognise it there.", "Microsoft.Extensions.AI composition দিয়ে AI client বানায় (model client-এর চারপাশে logging, caching, telemetry ও tool calling)। এখানে pattern শিখলে সেখানে চিনতে পারবেন।"],
    x: [cs("Swap behaviour at runtime with composition · composition দিয়ে আচরণ বদল", `var alerts = new OrderAlerts(new EmailSender());
alerts.Shipped("A-1042");
alerts.UseSender(new SmsSender());           // swap without a new subclass
alerts.Shipped("A-1043");
alerts.UseSender(new MultiSender(new EmailSender(), new SmsSender()));
alerts.Shipped("A-1044");

interface ISender { void Send(string text); }
class EmailSender : ISender { public void Send(string t) => Console.WriteLine($"[email] {t}"); }
class SmsSender : ISender { public void Send(string t) => Console.WriteLine($"[sms] {t}"); }
class MultiSender(params ISender[] all) : ISender { public void Send(string t) { foreach (var s in all) s.Send(t); } }
class OrderAlerts(ISender sender)
{
    private ISender current = sender;
    public void UseSender(ISender s) => current = s;
    public void Shipped(string id) => current.Send($"Order {id} has shipped");
}`, "[email] Order A-1042 has shipped\n[sms] Order A-1043 has shipped\n[email] Order A-1044 has shipped\n[sms] Order A-1044 has shipped")],
  },
  "UML Class Diagrams": {
    s: ["An architect's floor plan shows rooms and doors before any brick is laid. A UML class diagram shows classes and how they connect before (or after) code is written, so a team can agree on the design.", "স্থপতির নকশা ইট বসানোর আগেই ঘর ও দরজা দেখায়। UML class diagram code লেখার আগে (বা পরে) class ও তাদের সংযোগ দেখায়, যাতে দল design-এ একমত হতে পারে।"],
    t: ["A class box lists name, fields and methods (+ public, - private). Lines show relationships: association (uses), aggregation (has, can live alone, hollow diamond), composition (owns, dies with parent, filled diamond), inheritance (hollow triangle) and interface realisation (dashed line with triangle). Multiplicity (1, 0..*, 1..*) shows how many.", "Class বাক্সে নাম, field ও method থাকে (+ public, - private)। রেখা সম্পর্ক দেখায়: association (ব্যবহার করে), aggregation (আছে, আলাদা বাঁচতে পারে, ফাঁপা হীরা), composition (মালিক, parent-এর সাথে মরে, ভরা হীরা), inheritance (ফাঁপা ত্রিভুজ) আর interface বাস্তবায়ন (ত্রিভুজসহ ড্যাশ রেখা)। Multiplicity (1, 0..*, 1..*) সংখ্যা দেখায়।"],
    p: [["List the nouns in the requirements: candidate classes.", "Requirement-এর বিশেষ্যগুলোর তালিকা করুন: সম্ভাব্য class।"], ["Add key fields and methods only.", "শুধু মূল field ও method যোগ করুন।"], ["Draw relationships with multiplicity.", "Multiplicity-সহ সম্পর্ক আঁকুন।"], ["Keep it as text (Mermaid) next to the code so it stays updated.", "Code-এর পাশে text (Mermaid) হিসেবে রাখুন যাতে হালনাগাদ থাকে।"]],
    m: ["Drawing every getter and setter; diagrams that drift from the code; confusing aggregation and composition.", "প্রতিটি getter ও setter আঁকা; code থেকে সরে যাওয়া diagram; aggregation ও composition গুলিয়ে ফেলা।"],
    q: ["Q: Order and OrderLine: aggregation or composition? A: Composition: order lines have no meaning without their order and are deleted with it.", "প্রশ্ন: Order ও OrderLine: aggregation নাকি composition? উত্তর: Composition: order ছাড়া order line-এর অর্থ নেই এবং তার সাথেই মুছে যায়।"],
    f: ["Mermaid diagrams in Markdown render on GitHub and are easy for AI tools to read and update, making 'diagrams as code' the practical choice.", "Markdown-এ Mermaid diagram GitHub-এ দেখা যায় এবং AI tool সহজে পড়ে ও আপডেট করে, তাই 'diagram as code' বাস্তবসম্মত পছন্দ।"],
    x: [{ title: "Shop domain as a Mermaid class diagram · Mermaid class diagram", kind: "Diagram as code", language: "markdown", code: "```mermaid\nclassDiagram\n  class Customer {\n    +Guid Id\n    +string Name\n    +PlaceOrder(cart) Order\n  }\n  class Order {\n    +Guid Id\n    -List~OrderLine~ lines\n    +decimal Total()\n    +AddLine(product, qty)\n  }\n  class OrderLine {\n    +int Quantity\n    +decimal UnitPrice\n  }\n  class Product {\n    +string Sku\n    +decimal Price\n  }\n  class IPaymentMethod {\n    <<interface>>\n    +Pay(amount) bool\n  }\n  class BKashPayment\n  Customer \"1\" --> \"0..*\" Order : places\n  Order \"1\" *-- \"1..*\" OrderLine : composition\n  OrderLine \"*\" --> \"1\" Product : refers to\n  IPaymentMethod <|.. BKashPayment : implements\n```" }],
  },
  "Singleton": {
    s: ["A country has one national clock that everyone sets their watch by. Creating a second 'official' clock would cause confusion. A singleton guarantees exactly one instance of a class.", "একটি দেশে একটি জাতীয় ঘড়ি থাকে, যা দেখে সবাই ঘড়ি মেলায়। দ্বিতীয় 'অফিসিয়াল' ঘড়ি বানালে বিভ্রান্তি হতো। Singleton একটি class-এর ঠিক একটি instance নিশ্চিত করে।"],
    t: ["Classic singleton: private constructor and a static Instance property, made thread-safe with Lazy<T>. In modern .NET, prefer registering a normal class with AddSingleton in DI: the container guarantees one instance, and you can still inject fakes in tests. Singletons must be thread-safe because many requests use them at once.", "প্রচলিত singleton: private constructor ও static Instance property, Lazy<T> দিয়ে thread-safe। আধুনিক .NET-এ DI-তে AddSingleton দিয়ে সাধারণ class register করাই ভালো: container একটি instance নিশ্চিত করে, আর test-এ fake inject করা যায়। Singleton thread-safe হতে হবে, কারণ একসাথে অনেক request ব্যবহার করে।"],
    p: [["Ask whether one shared instance is really required.", "সত্যিই একটি শেয়ার instance লাগে কি না জিজ্ঞেস করুন।"], ["Prefer services.AddSingleton<T>() over a static Instance.", "Static Instance-এর বদলে services.AddSingleton<T>() পছন্দ করুন।"], ["Make shared state thread-safe (immutable or locked).", "শেয়ার অবস্থা thread-safe করুন (অপরিবর্তনীয় বা lock)।"], ["Never inject scoped services (DbContext) into a singleton.", "Singleton-এ কখনো scoped service (DbContext) inject করবেন না।"]],
    m: ["Global mutable state that makes tests depend on each other; non-thread-safe lazy initialisation; a singleton holding a DbContext (captive dependency).", "Test-কে একে অপরের উপর নির্ভরশীল করা global পরিবর্তনশীল অবস্থা; thread-safe নয় এমন lazy initialisation; DbContext রাখা singleton (captive dependency)।"],
    q: ["Q: Why do many consider singleton an anti-pattern? A: It hides dependencies (global access), makes testing hard and can hold shared mutable state. DI-managed singletons keep the single instance without those problems.", "প্রশ্ন: অনেকে singleton-কে কেন anti-pattern মনে করে? উত্তর: এটি dependency লুকায় (global access), test কঠিন করে এবং শেয়ার পরিবর্তনশীল অবস্থা রাখতে পারে। DI-পরিচালিত singleton সেই সমস্যা ছাড়াই একটি instance রাখে।"],
    f: ["HttpClient factories, AI clients and caches are typically registered as singletons. Knowing lifetimes (singleton, scoped, transient) prevents subtle production bugs.", "HttpClient factory, AI client ও cache সাধারণত singleton হিসেবে register হয়। Lifetime (singleton, scoped, transient) জানলে সূক্ষ্ম production bug এড়ানো যায়।"],
    x: [cs("Thread-safe Lazy singleton vs DI lifetime · Lazy singleton বনাম DI", `var tasks = Enumerable.Range(0, 5).Select(_ => Task.Run(() => AppClock.Instance.Id)).ToArray();
await Task.WhenAll(tasks);
Console.WriteLine($"distinct instances: {tasks.Select(t => t.Result).Distinct().Count()}");
Console.WriteLine($"created: {AppClock.Created} time(s)");

sealed class AppClock
{
    private static readonly Lazy<AppClock> lazy = new(() => new AppClock());   // thread-safe by default
    public static AppClock Instance => lazy.Value;
    public static int Created;
    public Guid Id { get; } = Guid.NewGuid();
    private AppClock() { Interlocked.Increment(ref Created); }
}
// In ASP.NET Core prefer: builder.Services.AddSingleton<AppClock>();`, "distinct instances: 1\ncreated: 1 time(s)")],
  },
  "Factory": {
    s: ["You order 'a medium pizza' at the counter; the kitchen decides which oven, dough and chef to use. A factory creates the right object for you so the caller does not need to know the details.", "Counter-এ 'একটি মাঝারি pizza' অর্ডার দেন; রান্নাঘর ঠিক করে কোন oven, ময়দা ও রাঁধুনি। Factory আপনার জন্য সঠিক object বানায়, তাই ডাকা code-কে বিস্তারিত জানতে হয় না।"],
    t: ["A factory method or class centralises object creation. Callers ask for an abstraction (INotifier) and the factory picks the concrete type based on input or configuration. This keeps 'new' and switch statements in one place, so adding a type changes one spot. In .NET, DI with keyed services or a factory delegate often replaces hand-written factories.", "Factory method বা class object তৈরি এক জায়গায় রাখে। ডাকা code abstraction (INotifier) চায়, আর factory input বা configuration অনুযায়ী নির্দিষ্ট ধরন বাছে। এতে 'new' ও switch এক জায়গায় থাকে, তাই নতুন ধরন যোগে একটি জায়গাই বদলায়। .NET-এ keyed service বা factory delegate-সহ DI প্রায়ই হাতে লেখা factory-র জায়গা নেয়।"],
    p: [["Identify where switch/new on a type appears in many places.", "কোথায় কোথায় ধরন ধরে switch/new আছে খুঁজুন।"], ["Create an interface for the product.", "Product-এর জন্য interface বানান।"], ["Write one Create(kind) method that returns the interface.", "Interface ফেরত দেওয়া একটি Create(kind) method লিখুন।"], ["Throw a clear error for unknown kinds.", "অজানা ধরনে স্পষ্ট error দিন।"]],
    m: ["Factories that just call new with no decision (needless); returning concrete types; giant factories that know every class in the system.", "কোনো সিদ্ধান্ত ছাড়া শুধু new ডাকা factory (অপ্রয়োজনীয়); নির্দিষ্ট ধরন ফেরত দেওয়া; system-এর সব class জানা বিশাল factory।"],
    q: ["Q: Factory method vs abstract factory? A: Factory method creates one product; abstract factory creates a family of related products that must match (e.g., light-theme button + light-theme dialog).", "প্রশ্ন: Factory method বনাম abstract factory? উত্তর: Factory method একটি product বানায়; abstract factory মিল থাকা সম্পর্কিত product-এর পরিবার বানায় (যেমন light-theme button + light-theme dialog)।"],
    f: ["Model routers in AI apps are factories: given a task type, return the right client (small, large, local). The pattern keeps routing logic in one testable place.", "AI app-এর model router হলো factory: কাজের ধরন দিলে সঠিক client (ছোট, বড়, local) ফেরত দেয়। Pattern routing যুক্তি এক test-যোগ্য জায়গায় রাখে।"],
    x: [cs("Create the right notifier from configuration · configuration থেকে সঠিক notifier", `foreach (var channel in new[] { "email", "sms", "push", "fax" })
{
    try { Console.WriteLine(NotifierFactory.Create(channel).Send("Your OTP is 4821")); }
    catch (NotSupportedException e) { Console.WriteLine(e.Message); }
}

interface INotifier { string Send(string message); }
class EmailNotifier : INotifier { public string Send(string m) => $"email: {m}"; }
class SmsNotifier : INotifier { public string Send(string m) => $"sms (160 chars max): {m}"; }
class PushNotifier : INotifier { public string Send(string m) => $"push: {m}"; }

static class NotifierFactory
{
    public static INotifier Create(string channel) => channel switch
    {
        "email" => new EmailNotifier(),
        "sms" => new SmsNotifier(),
        "push" => new PushNotifier(),
        _ => throw new NotSupportedException($"Unknown channel '{channel}'"),
    };
}`, "email: Your OTP is 4821\nsms (160 chars max): Your OTP is 4821\npush: Your OTP is 4821\nUnknown channel 'fax'")],
  },
  "Abstract Factory": {
    s: ["Buying furniture from one collection: if you pick 'Modern', the chair, sofa and table all match. You never get a Modern chair with a Victorian table. An abstract factory creates whole families of matching objects.", "এক collection থেকে আসবাব কেনা: 'Modern' বাছলে চেয়ার, সোফা ও টেবিল সব মেলে। Modern চেয়ারের সাথে Victorian টেবিল কখনো পান না। Abstract factory মিল থাকা object-এর পুরো পরিবার বানায়।"],
    t: ["An abstract factory interface has several create methods (CreateButton, CreateDialog). Each concrete factory (LightTheme, DarkTheme) returns products that belong together. Client code depends only on the factory and product interfaces, so switching the whole family is one line. Use it when products must be consistent with each other.", "Abstract factory interface-এ কয়েকটি create method থাকে (CreateButton, CreateDialog)। প্রতিটি নির্দিষ্ট factory (LightTheme, DarkTheme) একসাথে মানানসই product দেয়। Client code শুধু factory ও product interface-এর উপর নির্ভর করে, তাই পুরো পরিবার বদলানো এক লাইনের কাজ। Product একে অপরের সাথে সামঞ্জস্যপূর্ণ হতে হলে ব্যবহার করুন।"],
    p: [["List the product family members.", "Product পরিবারের সদস্যদের তালিকা করুন।"], ["Define an interface per product and one factory interface.", "প্রতি product-এ একটি interface ও একটি factory interface বানান।"], ["Implement one factory per family.", "প্রতি পরিবারে একটি factory বাস্তবায়ন করুন।"], ["Choose the factory once at startup.", "Startup-এ একবার factory বাছুন।"]],
    m: ["Using it for a single product (factory method is enough); adding a new product type requires changing every factory; mixing products from different factories.", "একটি product-এর জন্য ব্যবহার (factory method যথেষ্ট); নতুন product ধরন যোগে প্রতিটি factory বদলাতে হয়; ভিন্ন factory-র product মেশানো।"],
    q: ["Q: Real .NET example? A: DbProviderFactory creates matching connection, command and parameter objects for SQL Server, PostgreSQL or SQLite.", "প্রশ্ন: বাস্তব .NET উদাহরণ? উত্তর: DbProviderFactory SQL Server, PostgreSQL বা SQLite-এর জন্য মিল থাকা connection, command ও parameter object বানায়।"],
    f: ["Cloud-agnostic code often uses this idea: one factory for AWS (S3 storage + SQS queue), another for Azure (Blob + Service Bus), selected by configuration.", "Cloud-নিরপেক্ষ code প্রায়ই এই ধারণা ব্যবহার করে: AWS-এর জন্য একটি factory (S3 storage + SQS queue), Azure-এর জন্য আরেকটি (Blob + Service Bus), configuration দিয়ে বাছাই।"],
    x: [cs("Matching cloud services per provider · provider অনুযায়ী মিল থাকা service", `foreach (ICloudFactory cloud in new ICloudFactory[] { new AwsFactory(), new AzureFactory() })
{
    var storage = cloud.CreateStorage();
    var queue = cloud.CreateQueue();
    Console.WriteLine($"{storage.Save("invoice.pdf")} | {queue.Send("invoice-ready")}");
}

interface IStorage { string Save(string file); }
interface IQueue { string Send(string msg); }
interface ICloudFactory { IStorage CreateStorage(); IQueue CreateQueue(); }

class AwsFactory : ICloudFactory
{
    public IStorage CreateStorage() => new S3();
    public IQueue CreateQueue() => new Sqs();
}
class AzureFactory : ICloudFactory
{
    public IStorage CreateStorage() => new Blob();
    public IQueue CreateQueue() => new ServiceBus();
}
class S3 : IStorage { public string Save(string f) => $"S3 saved {f}"; }
class Sqs : IQueue { public string Send(string m) => $"SQS sent {m}"; }
class Blob : IStorage { public string Save(string f) => $"Blob saved {f}"; }
class ServiceBus : IQueue { public string Send(string m) => $"Service Bus sent {m}"; }`, "S3 saved invoice.pdf | SQS sent invoice-ready\nBlob saved invoice.pdf | Service Bus sent invoice-ready")],
  },
  "Builder": {
    s: ["Ordering a burger step by step: bun, then patty, extra cheese, no onion, add sauce. You build exactly what you want, then say 'done'. A builder constructs complex objects step by step.", "ধাপে ধাপে burger অর্ডার: bun, তারপর patty, বাড়তি cheese, পেঁয়াজ নয়, sauce দিন। ঠিক যা চান তা বানান, তারপর বলেন 'শেষ'। Builder জটিল object ধাপে ধাপে বানায়।"],
    t: ["When an object has many optional parts, constructors with ten parameters become unreadable. A builder offers fluent methods (WithX, AddY) and a final Build() that validates and returns an immutable object. .NET uses builders everywhere: WebApplication.CreateBuilder, StringBuilder, ConfigurationBuilder, ChatClientBuilder.", "Object-এর অনেক ঐচ্ছিক অংশ থাকলে দশ parameter-এর constructor পড়া যায় না। Builder fluent method (WithX, AddY) আর শেষে Build() দেয়, যা যাচাই করে অপরিবর্তনীয় object ফেরত দেয়। .NET সব জায়গায় builder ব্যবহার করে: WebApplication.CreateBuilder, StringBuilder, ConfigurationBuilder, ChatClientBuilder।"],
    p: [["Identify required vs optional parts.", "আবশ্যিক ও ঐচ্ছিক অংশ চিহ্নিত করুন।"], ["Add fluent methods that return the builder.", "Builder ফেরত দেওয়া fluent method যোগ করুন।"], ["Validate in Build() and return an immutable object.", "Build()-এ যাচাই করে অপরিবর্তনীয় object দিন।"], ["Use the builder in tests to create test data easily.", "Test-এ সহজে test data বানাতে builder ব্যবহার করুন।"]],
    m: ["Forgetting validation in Build(); reusing one builder instance and leaking state between objects; using a builder for a 2-field object (records with init are enough).", "Build()-এ যাচাই ভুলে যাওয়া; একটি builder instance পুনর্ব্যবহার করে object-এর মধ্যে অবস্থা ফাঁস; ২-field-এর object-এ builder (init-সহ record যথেষ্ট)।"],
    q: ["Q: Builder vs object initializer in C#? A: Initializers are fine for simple data; a builder adds validation, defaults and readable step-by-step construction for complex objects.", "প্রশ্ন: C#-এ builder বনাম object initializer? উত্তর: সাধারণ data-য় initializer যথেষ্ট; জটিল object-এ builder যাচাই, ডিফল্ট ও পড়ার মতো ধাপে ধাপে তৈরি যোগ করে।"],
    f: ["Test-data builders make unit tests short and readable, a habit that also helps when you ask AI to generate tests: give it a builder and it writes cleaner tests.", "Test-data builder unit test ছোট ও পড়ার মতো করে, যা AI দিয়ে test বানাতেও সাহায্য করে: builder দিলে সে পরিষ্কার test লেখে।"],
    x: [cs("Fluent builder with validation · যাচাইসহ fluent builder", `var email = new EmailBuilder()
    .To("asha@example.com")
    .Subject("Your order shipped")
    .Body("Order A-1042 is on the way.")
    .Cc("support@example.com")
    .Build();
Console.WriteLine(email);

try { new EmailBuilder().Subject("No recipient").Build(); }
catch (InvalidOperationException e) { Console.WriteLine($"error: {e.Message}"); }

record Email(string To, string Subject, string Body, IReadOnlyList<string> Cc)
{
    public override string ToString() => $"To={To}; Subject={Subject}; Cc={string.Join(",", Cc)}";
}
class EmailBuilder
{
    private string? to, subject, body;
    private readonly List<string> cc = [];
    public EmailBuilder To(string v) { to = v; return this; }
    public EmailBuilder Subject(string v) { subject = v; return this; }
    public EmailBuilder Body(string v) { body = v; return this; }
    public EmailBuilder Cc(string v) { cc.Add(v); return this; }
    public Email Build() => to is null
        ? throw new InvalidOperationException("Recipient is required")
        : new Email(to, subject ?? "(no subject)", body ?? "", cc.ToArray());
}`, "To=asha@example.com; Subject=Your order shipped; Cc=support@example.com\nerror: Recipient is required")],
  },
  "Prototype": {
    s: ["A tailor keeps a perfect sample shirt. For a new customer, he copies the sample and adjusts the sleeves, instead of designing from scratch. Prototype creates new objects by cloning an existing one.", "দর্জি একটি নিখুঁত নমুনা শার্ট রাখেন। নতুন ক্রেতার জন্য নমুনা কপি করে হাতা ঠিক করেন, শুরু থেকে design করেন না। Prototype বিদ্যমান object clone করে নতুন object বানায়।"],
    t: ["Cloning is useful when creation is expensive or when many objects share a configured base. The key question is shallow vs deep copy: a shallow copy shares inner objects (changing a list in the copy changes the original). C# records give non-destructive copies with 'with', but they are shallow too.", "তৈরি ব্যয়বহুল হলে বা অনেক object একটি সাজানো ভিত্তি শেয়ার করলে cloning কাজের। মূল প্রশ্ন shallow বনাম deep copy: shallow copy ভিতরের object শেয়ার করে (copy-তে list বদলালে মূলটাও বদলায়)। C# record 'with' দিয়ে অ-ধ্বংসাত্মক copy দেয়, কিন্তু সেটাও shallow।"],
    p: [["Decide which fields must be independent in the copy.", "Copy-তে কোন field স্বাধীন হতে হবে ঠিক করুন।"], ["Use records + with for simple copies.", "সাধারণ copy-তে record + with দিন।"], ["Deep-copy collections explicitly (new List(old)).", "Collection স্পষ্টভাবে deep-copy করুন (new List(old))।"], ["Test that changing the copy does not change the original.", "Copy বদলালে মূল বদলায় না test করুন।"]],
    m: ["Assuming 'with' deep-copies lists; using MemberwiseClone without understanding it; serialisation-based cloning in hot paths (slow).", "'with' list deep-copy করে ধরে নেওয়া; না বুঝে MemberwiseClone; গুরুত্বপূর্ণ পথে serialisation-ভিত্তিক cloning (ধীর)।"],
    q: ["Q: Shallow vs deep copy? A: Shallow copies the top-level fields (references are shared); deep copies the whole object graph so nothing is shared.", "প্রশ্ন: Shallow বনাম deep copy? উত্তর: Shallow উপরের স্তরের field কপি করে (reference শেয়ার হয়); deep পুরো object graph কপি করে, কিছুই শেয়ার হয় না।"],
    f: ["Immutable data (records, ImmutableList) avoids most cloning bugs. Prefer immutability in concurrent code and in state passed between AI agent steps.", "অপরিবর্তনীয় data (record, ImmutableList) বেশিরভাগ cloning bug এড়ায়। Concurrent code-এ এবং AI agent-এর ধাপের মধ্যে পাঠানো অবস্থায় অপরিবর্তনীয়তা পছন্দ করুন।"],
    x: [cs("Shallow copy trap and a safe deep copy · shallow copy-র ফাঁদ ও deep copy", `var template = new Report("Monthly sales", ["Revenue", "Orders"]);

var shallow = template with { Title = "November sales" };
shallow.Sections.Add("Refunds");                         // also changes template!
Console.WriteLine($"template sections after shallow edit: {template.Sections.Count}");

var deep = template.DeepCopy("December sales");
deep.Sections.Add("Returns");
Console.WriteLine($"template sections after deep edit: {template.Sections.Count}");
Console.WriteLine($"deep copy: {deep.Title} -> {string.Join(", ", deep.Sections)}");

record Report(string Title, List<string> Sections)
{
    public Report DeepCopy(string title) => new(title, new List<string>(Sections));
}`, "template sections after shallow edit: 3\ntemplate sections after deep edit: 3\ndeep copy: December sales -> Revenue, Orders, Refunds, Returns")],
  },
  "Adapter": {
    s: ["A travel plug adapter lets your Bangladeshi charger fit a UK socket. Neither the charger nor the socket changes; the adapter sits in between. In code, an adapter makes an existing class fit the interface your app expects.", "Travel plug adapter বাংলাদেশি charger-কে UK socket-এ লাগাতে দেয়। Charger বা socket কোনোটাই বদলায় না; adapter মাঝে বসে। Code-এ adapter বিদ্যমান class-কে আপনার app-এর প্রত্যাশিত interface-এ মানিয়ে নেয়।"],
    t: ["An adapter implements your interface and translates calls to a third-party or legacy API (different method names, units or data shapes). Your core code stays clean and testable; only the adapter knows the vendor's quirks. When you switch vendors, you write a new adapter.", "Adapter আপনার interface বাস্তবায়ন করে এবং call-কে third-party বা পুরনো API-তে অনুবাদ করে (ভিন্ন method-এর নাম, একক বা data-র আকার)। মূল code পরিষ্কার ও test-যোগ্য থাকে; শুধু adapter vendor-এর বৈশিষ্ট্য জানে। Vendor বদলালে নতুন adapter লেখেন।"],
    p: [["Define the interface your app wants.", "আপনার app যে interface চায় তা বানান।"], ["Wrap the vendor SDK in a class implementing it.", "Vendor SDK-কে সেই interface বাস্তবায়নকারী class-এ মোড়ান।"], ["Convert units, names and errors inside the adapter.", "Adapter-এর ভিতরে একক, নাম ও error বদলান।"], ["Test the adapter separately with recorded vendor responses.", "রেকর্ড করা vendor response দিয়ে adapter আলাদাভাবে test করুন।"]],
    m: ["Letting vendor types leak into domain code; adapters that add business logic; ignoring vendor error codes.", "Vendor-এর ধরন domain code-এ ঢুকতে দেওয়া; business যুক্তি যোগ করা adapter; vendor-এর error code উপেক্ষা।"],
    q: ["Q: Adapter vs facade? A: An adapter changes an interface to match an expected one; a facade simplifies a complex subsystem behind a new, smaller interface.", "প্রশ্ন: Adapter বনাম facade? উত্তর: Adapter একটি interface-কে প্রত্যাশিতটার সাথে মেলায়; facade জটিল subsystem-কে নতুন, ছোট interface-এর পিছনে সহজ করে।"],
    f: ["AsIChatClient() is an adapter: it adapts OpenAI, Ollama or other SDKs to one .NET interface. You will write similar adapters for payment gateways like bKash, Nagad or Stripe.", "AsIChatClient() একটি adapter: OpenAI, Ollama বা অন্য SDK-কে একটি .NET interface-এ মানিয়ে নেয়। bKash, Nagad বা Stripe-এর মতো payment gateway-র জন্যও এমন adapter লিখবেন।"],
    x: [cs("Adapt a legacy SMS SDK to your interface · পুরনো SMS SDK মানিয়ে নেওয়া", `ISmsSender sender = new LegacySmsAdapter(new OldTelcoSdk());
Console.WriteLine(sender.Send("+8801711000000", "Your OTP is 4821"));
Console.WriteLine(sender.Send("01711000000", ""));

// Our clean interface
interface ISmsSender { string Send(string phone, string text); }

// Vendor SDK we cannot change: different names, local numbers, numeric status codes
class OldTelcoSdk
{
    public int SubmitMsg(string msisdn, string body) => body.Length == 0 ? 17 : 0;
}

class LegacySmsAdapter(OldTelcoSdk sdk) : ISmsSender
{
    public string Send(string phone, string text)
    {
        string local = phone.StartsWith("+880") ? "0" + phone[4..] : phone;      // convert format
        int code = sdk.SubmitMsg(local, text);
        return code == 0 ? $"sent to {local}" : $"failed: vendor code {code} (empty message)";
    }
}`, "sent to 01711000000\nfailed: vendor code 17 (empty message)")],
  },
  "Decorator": {
    s: ["Gift wrapping: a box, then wrapping paper, then a ribbon. Each layer adds something, and you can add or remove layers without changing the gift. A decorator wraps an object to add behaviour.", "উপহার মোড়ানো: বাক্স, তারপর মোড়কের কাগজ, তারপর ফিতা। প্রতিটি স্তর কিছু যোগ করে, আর উপহার না বদলে স্তর যোগ বা বাদ দেওয়া যায়। Decorator একটি object মুড়িয়ে আচরণ যোগ করে।"],
    t: ["A decorator implements the same interface as the object it wraps and forwards calls, adding behaviour before or after: logging, caching, retries, timing, authorisation. Decorators stack in any order. ASP.NET Core middleware and DelegatingHandler for HttpClient follow the same idea.", "Decorator যে object মোড়ায় তার একই interface বাস্তবায়ন করে এবং call এগিয়ে দেয়, আগে বা পরে আচরণ যোগ করে: logging, caching, retry, সময় মাপা, authorisation। Decorator যেকোনো ক্রমে স্তূপ করা যায়। ASP.NET Core middleware ও HttpClient-এর DelegatingHandler একই ধারণা মানে।"],
    p: [["Start with an interface and a plain implementation.", "একটি interface ও সাধারণ বাস্তবায়ন দিয়ে শুরু করুন।"], ["Write a decorator that takes the interface in its constructor.", "Constructor-এ interface নেওয়া decorator লিখুন।"], ["Add behaviour around the forwarded call.", "এগিয়ে দেওয়া call-এর চারপাশে আচরণ যোগ করুন।"], ["Compose: new Logging(new Caching(new Real())).", "মেলান: new Logging(new Caching(new Real()))।"]],
    m: ["Decorators that change the meaning of results; wrong ordering (cache outside retry vs inside); forgetting to forward some interface members.", "ফলের অর্থ বদলানো decorator; ভুল ক্রম (retry-এর বাইরে বনাম ভিতরে cache); interface-এর কিছু member এগিয়ে দিতে ভুলে যাওয়া।"],
    q: ["Q: How does decorator differ from inheritance for adding logging? A: The decorator adds logging to any implementation at runtime and can be combined with others; inheritance ties logging to one subclass.", "প্রশ্ন: Logging যোগে decorator inheritance থেকে কীভাবে আলাদা? উত্তর: Decorator runtime-এ যেকোনো বাস্তবায়নে logging যোগ করে এবং অন্যদের সাথে মেলানো যায়; inheritance logging-কে একটি subclass-এ বেঁধে দেয়।"],
    f: ["AI client pipelines are decorator stacks: caching, telemetry, rate limiting and function invocation wrapped around a model. Understanding decorators makes those APIs obvious.", "AI client pipeline হলো decorator-এর স্তূপ: model-এর চারপাশে caching, telemetry, rate limiting ও function invocation। Decorator বুঝলে সেই API সহজবোধ্য হয়।"],
    x: [cs("Caching and logging decorators stacked · caching ও logging decorator", `IPriceService prices = new LoggingPrices(new CachingPrices(new SlowPriceApi()));
Console.WriteLine(prices.Get("rice"));
Console.WriteLine(prices.Get("rice"));
Console.WriteLine(prices.Get("oil"));

interface IPriceService { decimal Get(string item); }
class SlowPriceApi : IPriceService
{
    public decimal Get(string item) { Console.WriteLine($"  (api call for {item})"); return item == "rice" ? 78m : 190m; }
}
class CachingPrices(IPriceService inner) : IPriceService
{
    private readonly Dictionary<string, decimal> cache = new();
    public decimal Get(string item) => cache.TryGetValue(item, out var p) ? p : cache[item] = inner.Get(item);
}
class LoggingPrices(IPriceService inner) : IPriceService
{
    public decimal Get(string item) { Console.WriteLine($"get {item}"); return inner.Get(item); }
}`, "get rice\n  (api call for rice)\n78\nget rice\n78\nget oil\n  (api call for oil)\n190")],
  },
  "Facade": {
    s: ["A hotel receptionist: you say 'book me a room with breakfast and airport pickup', and they talk to housekeeping, the kitchen and the driver for you. A facade gives one simple entry point to a complicated system.", "Hotel-এর receptionist: আপনি বলেন 'নাশতা ও বিমানবন্দর থেকে আনাসহ একটি রুম বুক করুন', তিনি আপনার হয়ে housekeeping, রান্নাঘর ও চালকের সাথে কথা বলেন। Facade জটিল system-এ একটি সহজ প্রবেশপথ দেয়।"],
    t: ["A facade class exposes a few high-level methods (PlaceOrder) and coordinates many lower-level services (inventory, payment, shipping, email). Callers stay simple and are protected from changes in subsystems. It does not hide the subsystems from those who need them; it just offers an easier path.", "Facade class কয়েকটি উচ্চ-স্তরের method (PlaceOrder) দেখায় এবং অনেক নিম্ন-স্তরের service (inventory, payment, shipping, email) সমন্বয় করে। ডাকা code সহজ থাকে এবং subsystem-এর পরিবর্তন থেকে সুরক্ষিত থাকে। যাদের দরকার তাদের কাছ থেকে subsystem লুকায় না; শুধু সহজ পথ দেয়।"],
    p: [["Find a workflow that callers repeat with many steps.", "অনেক ধাপে ডাকা code বারবার করে এমন workflow খুঁজুন।"], ["Create a facade method for it.", "তার জন্য একটি facade method বানান।"], ["Inject the subsystem services into the facade.", "Facade-এ subsystem service inject করুন।"], ["Keep business decisions in the domain, coordination in the facade.", "Business সিদ্ধান্ত domain-এ, সমন্বয় facade-এ রাখুন।"]],
    m: ["Facades that grow into 'god classes'; hiding errors from subsystems; duplicating subsystem logic inside the facade.", "'god class'-এ পরিণত facade; subsystem-এর error লুকানো; facade-এর ভিতরে subsystem-এর যুক্তি পুনরাবৃত্তি।"],
    q: ["Q: Where do you see facades in ASP.NET Core? A: An application service like OrderService used by a controller is a facade over repositories, payment and messaging.", "প্রশ্ন: ASP.NET Core-এ facade কোথায় দেখেন? উত্তর: Controller যে OrderService-এর মতো application service ব্যবহার করে, তা repository, payment ও messaging-এর উপর facade।"],
    f: ["An MCP server is often a facade: one 'create_support_ticket' tool hides calls to CRM, email and chat systems, giving AI agents a simple, safe interface.", "MCP server প্রায়ই একটি facade: একটি 'create_support_ticket' tool CRM, email ও chat system-এর call লুকায়, AI agent-কে সহজ ও নিরাপদ interface দেয়।"],
    x: [cs("One call to place an order · এক call-এ order", `var shop = new OrderFacade(new Inventory(), new Payments(), new Shipping());
Console.WriteLine(shop.PlaceOrder("A-1042", "rice-5kg", 520m));
Console.WriteLine(shop.PlaceOrder("A-1043", "laptop", 85000m));

class Inventory { public bool Reserve(string sku) => sku != "laptop"; }
class Payments { public string Charge(decimal amount) => $"PAY-{amount:0}"; }
class Shipping { public string Book(string order) => $"TRACK-{order[^4..]}"; }

class OrderFacade(Inventory inv, Payments pay, Shipping ship)
{
    public string PlaceOrder(string orderId, string sku, decimal amount)
    {
        if (!inv.Reserve(sku)) return $"{orderId}: out of stock";
        string payment = pay.Charge(amount);
        string tracking = ship.Book(orderId);
        return $"{orderId}: paid {payment}, tracking {tracking}";
    }
}`, "A-1042: paid PAY-520, tracking TRACK-1042\nA-1043: out of stock")],
  },
  "Proxy": {
    s: ["A celebrity's manager: every request goes through the manager, who checks your identity, filters requests and only then lets you talk to the star. A proxy stands in front of an object and controls access to it.", "তারকার ম্যানেজার: প্রতিটি অনুরোধ ম্যানেজারের মাধ্যমে যায়, যিনি পরিচয় যাচাই করেন, অনুরোধ বাছেন, তারপরই তারকার সাথে কথা বলতে দেন। Proxy একটি object-এর সামনে দাঁড়িয়ে তার access নিয়ন্ত্রণ করে।"],
    t: ["A proxy implements the same interface as the real object. Types: protection proxy (permission checks), virtual proxy (lazy loading of expensive objects), remote proxy (local object that calls a server, like an HTTP client), and caching proxy. It looks like a decorator, but its purpose is controlling access, not adding features.", "Proxy আসল object-এর একই interface বাস্তবায়ন করে। ধরন: protection proxy (অনুমতি যাচাই), virtual proxy (ব্যয়বহুল object-এর lazy loading), remote proxy (server ডাকে এমন local object, যেমন HTTP client) আর caching proxy। দেখতে decorator-এর মতো, কিন্তু উদ্দেশ্য access নিয়ন্ত্রণ, feature যোগ নয়।"],
    p: [["Decide the access rule (who, when, how much).", "Access নিয়ম ঠিক করুন (কে, কখন, কতটা)।"], ["Implement the same interface in the proxy.", "Proxy-তে একই interface বাস্তবায়ন করুন।"], ["Check the rule, then forward or deny.", "নিয়ম যাচাই করে এগিয়ে দিন বা প্রত্যাখ্যান করুন।"], ["Register the proxy in DI instead of the real class.", "DI-তে আসল class-এর বদলে proxy register করুন।"]],
    m: ["Security checks only in the UI instead of a server-side proxy; proxies that swallow exceptions; lazy proxies that are not thread-safe.", "Server-side proxy-র বদলে শুধু UI-তে নিরাপত্তা যাচাই; exception গিলে ফেলা proxy; thread-safe নয় এমন lazy proxy।"],
    q: ["Q: Give three real proxies. A: EF Core lazy-loading proxies, HttpClient (remote proxy to a server), and a reverse proxy like Nginx protecting backend services.", "প্রশ্ন: তিনটি বাস্তব proxy বলুন। উত্তর: EF Core lazy-loading proxy, HttpClient (server-এর remote proxy) আর backend service রক্ষা করা Nginx-এর মতো reverse proxy।"],
    f: ["An AI gateway is a proxy: it sits between apps and model providers to check permissions, apply budgets, redact data and log usage.", "AI gateway হলো proxy: app ও model provider-এর মাঝে বসে অনুমতি যাচাই, budget প্রয়োগ, data মোছা ও ব্যবহার log করে।"],
    x: [cs("Protection proxy with a daily budget · দৈনিক budget-সহ protection proxy", `IReportService reports = new ReportProxy(new RealReportService(), role: "staff", dailyLimit: 2);
for (int i = 1; i <= 3; i++) Console.WriteLine(reports.Generate($"sales-{i}"));
Console.WriteLine(new ReportProxy(new RealReportService(), role: "guest", dailyLimit: 5).Generate("salaries"));

interface IReportService { string Generate(string name); }
class RealReportService : IReportService { public string Generate(string n) => $"report {n} generated"; }
class ReportProxy(IReportService real, string role, int dailyLimit) : IReportService
{
    private int used;
    public string Generate(string name)
    {
        if (role == "guest") return "denied: guests cannot generate reports";
        if (used >= dailyLimit) return "denied: daily limit reached";
        used++;
        return real.Generate(name);
    }
}`, "report sales-1 generated\nreport sales-2 generated\ndenied: daily limit reached\ndenied: guests cannot generate reports")],
  },
  "Observer": {
    s: ["Subscribing to a YouTube channel: when a new video is posted, every subscriber gets a notification. The channel does not need to know who you are personally. Observer lets one object notify many listeners of changes.", "YouTube channel subscribe করা: নতুন video এলে প্রতিটি subscriber notification পায়। Channel-কে ব্যক্তিগতভাবে আপনাকে চিনতে হয় না। Observer একটি object-কে অনেক শ্রোতাকে পরিবর্তন জানাতে দেয়।"],
    t: ["A subject keeps a list of observers and notifies them when something happens. In C#, events and delegates (event Action<T>) implement observer directly; IObservable<T> and Reactive Extensions support streams. Across services, the same idea becomes pub/sub messaging. Always unsubscribe to avoid memory leaks.", "Subject observer-এর তালিকা রাখে এবং কিছু ঘটলে জানায়। C#-এ event ও delegate (event Action<T>) সরাসরি observer বাস্তবায়ন করে; IObservable<T> ও Reactive Extensions stream সমর্থন করে। Service-এর মধ্যে একই ধারণা pub/sub messaging হয়। Memory leak এড়াতে সবসময় unsubscribe করুন।"],
    p: [["Define the event and its data (record OrderPlaced).", "Event ও তার data ঠিক করুন (record OrderPlaced)।"], ["Expose 'public event Action<OrderPlaced>?'.", "'public event Action<OrderPlaced>?' দেখান।"], ["Subscribe handlers with += and raise with ?.Invoke.", "+= দিয়ে handler subscribe ও ?.Invoke দিয়ে raise করুন।"], ["Unsubscribe with -= when a listener is disposed.", "শ্রোতা dispose হলে -= দিয়ে unsubscribe করুন।"]],
    m: ["Forgetting to unsubscribe (objects never garbage-collected); one failing handler stopping the others; heavy work inside handlers blocking the publisher.", "Unsubscribe ভুলে যাওয়া (object কখনো garbage-collect হয় না); একটি ব্যর্থ handler অন্যদের থামায়; handler-এর ভিতরে ভারী কাজ publisher আটকায়।"],
    q: ["Q: Observer vs pub/sub? A: Observer is in-process and the subject knows its observers; pub/sub uses a broker so publishers and subscribers do not know each other and can be in different services.", "প্রশ্ন: Observer বনাম pub/sub? উত্তর: Observer একই process-এ এবং subject তার observer চেনে; pub/sub broker ব্যবহার করে, তাই publisher ও subscriber একে অপরকে চেনে না এবং ভিন্ন service-এ থাকতে পারে।"],
    f: ["Event-driven thinking scales from UI events to Kafka streams to AI agents reacting to events (a new ticket triggers a triage agent).", "Event-চালিত চিন্তা UI event থেকে Kafka stream, AI agent-এর event-এ সাড়া (নতুন ticket একটি triage agent চালু করে) পর্যন্ত বিস্তৃত।"],
    x: [cs("Order events with several listeners · একাধিক শ্রোতাসহ order event", `var orders = new OrderService();
Action<OrderPlaced> email = o => Console.WriteLine($"email: thanks for order {o.Id}");
orders.Placed += email;
orders.Placed += o => Console.WriteLine($"stock: reserve items for {o.Id}");
orders.Placed += o => { if (o.Total > 5000) Console.WriteLine($"loyalty: +{o.Total / 100:0} points"); };

orders.Place("A-1", 6200m);
orders.Placed -= email;                       // unsubscribe
orders.Place("A-2", 900m);

record OrderPlaced(string Id, decimal Total);
class OrderService
{
    public event Action<OrderPlaced>? Placed;
    public void Place(string id, decimal total)
    {
        Console.WriteLine($"-- order {id} saved");
        Placed?.Invoke(new OrderPlaced(id, total));
    }
}`, "-- order A-1 saved\nemail: thanks for order A-1\nstock: reserve items for A-1\nloyalty: +62 points\n-- order A-2 saved\nstock: reserve items for A-2")],
  },
  "Strategy": {
    s: ["Choosing how to get to work: bus when it is cheap, CNG when you are late, walking when it is nice. The goal is the same; the method changes. Strategy lets you swap algorithms behind one interface.", "কাজে যাওয়ার উপায় বাছা: সস্তা হলে বাস, দেরি হলে CNG, আবহাওয়া ভালো হলে হাঁটা। লক্ষ্য একই; পদ্ধতি বদলায়। Strategy একটি interface-এর পিছনে algorithm বদলাতে দেয়।"],
    t: ["Define an interface for a family of algorithms (IShippingCost) and implement each one separately. The context class receives a strategy and uses it without if/else chains. Strategies can be chosen at runtime by configuration or user input, and each is tested alone. In C#, a simple Func<> delegate can be a lightweight strategy.", "এক পরিবারের algorithm-এর জন্য interface (IShippingCost) বানিয়ে প্রতিটি আলাদা বাস্তবায়ন করুন। Context class একটি strategy নেয় এবং if/else শৃঙ্খল ছাড়াই ব্যবহার করে। Configuration বা user input দিয়ে runtime-এ strategy বাছা যায় এবং প্রতিটি একা test হয়। C#-এ সাধারণ Func<> delegate হালকা strategy হতে পারে।"],
    p: [["Find an if/else or switch choosing between algorithms.", "Algorithm বাছাই করা if/else বা switch খুঁজুন।"], ["Extract each branch into a class implementing one interface.", "প্রতিটি শাখা এক interface বাস্তবায়নকারী class-এ সরান।"], ["Pass the chosen strategy into the context.", "বাছাই করা strategy context-এ দিন।"], ["Test each strategy independently.", "প্রতিটি strategy আলাদাভাবে test করুন।"]],
    m: ["Strategies that need to know about each other; creating a strategy for two lines of code; choosing the strategy with a switch scattered across the code (centralise it).", "একে অপরকে জানতে হয় এমন strategy; দুই লাইনের code-এর জন্য strategy; code জুড়ে ছড়ানো switch দিয়ে strategy বাছা (এক জায়গায় রাখুন)।"],
    q: ["Q: Strategy vs state pattern? A: Strategy is chosen by the client and usually fixed per call; state changes itself as the object's internal state changes.", "প্রশ্ন: Strategy বনাম state pattern? উত্তর: Strategy client বাছে এবং সাধারণত call-প্রতি স্থির; state object-এর ভিতরের অবস্থা বদলালে নিজেই বদলায়।"],
    f: ["Retrieval strategies (keyword, vector, hybrid) and model-selection policies in AI systems are classic strategy patterns; evals compare them fairly.", "AI system-এ retrieval strategy (keyword, vector, hybrid) ও model-বাছাইয়ের policy প্রচলিত strategy pattern; eval তাদের ন্যায্যভাবে তুলনা করে।"],
    x: [cs("Pluggable shipping cost strategies · বদলযোগ্য shipping খরচ", `var parcel = new Parcel(WeightKg: 3.5m, InsideDhaka: false);
IShippingCost[] options = [new Standard(), new Express(), new FreeOver(5000m, orderTotal: 6000m)];
foreach (var s in options) Console.WriteLine($"{s.Name,-10} {s.Cost(parcel),6} BDT");

record Parcel(decimal WeightKg, bool InsideDhaka);
interface IShippingCost { string Name { get; } decimal Cost(Parcel p); }
class Standard : IShippingCost
{
    public string Name => "standard";
    public decimal Cost(Parcel p) => (p.InsideDhaka ? 60 : 120) + Math.Ceiling(p.WeightKg - 1) * 20;
}
class Express : IShippingCost
{
    public string Name => "express";
    public decimal Cost(Parcel p) => new Standard().Cost(p) * 2;
}
class FreeOver(decimal threshold, decimal orderTotal) : IShippingCost
{
    public string Name => "promo";
    public decimal Cost(Parcel p) => orderTotal >= threshold ? 0 : new Standard().Cost(p);
}`, "standard      180 BDT\nexpress       360 BDT\npromo           0 BDT")],
  },
  "Command": {
    s: ["A waiter writes your order on a slip and pins it in the kitchen queue. The slip can be cooked later, cancelled or repeated. The command pattern turns a request into an object you can queue, log or undo.", "ওয়েটার আপনার অর্ডার স্লিপে লিখে রান্নাঘরের queue-তে আটকে দেন। স্লিপ পরে রান্না, বাতিল বা আবার করা যায়। Command pattern একটি অনুরোধকে object বানায়, যা queue, log বা undo করা যায়।"],
    t: ["A command object holds everything needed to perform an action (Execute) and often to reverse it (Undo). An invoker runs commands and keeps a history stack for undo/redo. Commands can be serialised into queues for background processing. MediatR-style request handlers and CQRS commands in .NET apply the same idea.", "Command object একটি কাজ করার (Execute) এবং প্রায়ই তা উল্টানোর (Undo) জন্য দরকারি সবকিছু রাখে। Invoker command চালায় এবং undo/redo-র জন্য ইতিহাসের stack রাখে। Background প্রক্রিয়ার জন্য command queue-তে serialise করা যায়। .NET-এ MediatR-ধরনের request handler ও CQRS command একই ধারণা মানে।"],
    p: [["Define ICommand with Execute and Undo.", "Execute ও Undo-সহ ICommand বানান।"], ["Create one class per action holding its parameters.", "প্রতি কাজে তার parameter-সহ একটি class বানান।"], ["Run through an invoker that records history.", "ইতিহাস রাখা invoker দিয়ে চালান।"], ["Undo by popping the history stack.", "ইতিহাসের stack থেকে pop করে undo করুন।"]],
    m: ["Commands that depend on global state and cannot be undone reliably; forgetting to clear redo history after a new command; huge command objects with logic that belongs in services.", "Global অবস্থার উপর নির্ভরশীল command যা নির্ভরযোগ্যভাবে undo হয় না; নতুন command-এর পরে redo ইতিহাস মুছতে ভুলে যাওয়া; service-এ থাকার মতো যুক্তিসহ বিশাল command object।"],
    q: ["Q: How would you implement undo in a text editor? A: Each edit is a command with Execute/Undo; push to an undo stack after executing; Undo pops and reverses it (and pushes to a redo stack).", "প্রশ্ন: Text editor-এ undo কীভাবে বানাবেন? উত্তর: প্রতিটি সম্পাদনা Execute/Undo-সহ command; চালানোর পর undo stack-এ push; Undo pop করে উল্টায় (এবং redo stack-এ push করে)।"],
    f: ["AI agent tool calls are commands: a name plus arguments. Logging them as command objects gives you audit trails, replays for debugging and human approval queues.", "AI agent-এর tool call হলো command: একটি নাম ও argument। Command object হিসেবে log করলে audit trail, debugging-এর জন্য replay ও মানুষের অনুমোদনের queue পাওয়া যায়।"],
    x: [cs("Cart actions with undo · undo-সহ cart-এর কাজ", `var cart = new List<string>();
var history = new Stack<ICommand>();
void Run(ICommand c) { c.Execute(); history.Push(c); Console.WriteLine($"do   {c} -> [{string.Join(", ", cart)}]"); }
void Undo() { var c = history.Pop(); c.Undo(); Console.WriteLine($"undo {c} -> [{string.Join(", ", cart)}]"); }

Run(new AddItem(cart, "rice"));
Run(new AddItem(cart, "oil"));
Run(new RemoveItem(cart, "rice"));
Undo();
Undo();

interface ICommand { void Execute(); void Undo(); }
record AddItem(List<string> Cart, string Item) : ICommand
{
    public void Execute() => Cart.Add(Item);
    public void Undo() => Cart.Remove(Item);
    public override string ToString() => $"add {Item}";
}
record RemoveItem(List<string> Cart, string Item) : ICommand
{
    private int index;
    public void Execute() { index = Cart.IndexOf(Item); Cart.RemoveAt(index); }
    public void Undo() => Cart.Insert(index, Item);
    public override string ToString() => $"remove {Item}";
}`, "do   add rice -> [rice]\ndo   add oil -> [rice, oil]\ndo   remove rice -> [oil]\nundo remove rice -> [rice, oil]\nundo add oil -> [rice]")],
  },
  "State": {
    s: ["A traffic light: in Red it only goes to Green, in Green only to Yellow, in Yellow only to Red. What it can do depends on what state it is in. The state pattern models objects whose behaviour depends on their current state.", "Traffic light: লাল থেকে শুধু সবুজে, সবুজ থেকে শুধু হলুদে, হলুদ থেকে শুধু লালে। কী করতে পারবে তা নির্ভর করে বর্তমান অবস্থার উপর। State pattern এমন object মডেল করে যার আচরণ বর্তমান অবস্থার উপর নির্ভর করে।"],
    t: ["Each state becomes a class (or an entry in a transition table) that decides which actions are allowed and what the next state is. This replaces scattered if (status == ...) checks. For business workflows (order: Pending -> Paid -> Shipped -> Delivered, or Cancelled), an explicit state machine prevents illegal transitions like shipping an unpaid order.", "প্রতিটি অবস্থা একটি class (বা transition table-এর entry) হয়, যা ঠিক করে কোন কাজ অনুমোদিত এবং পরের অবস্থা কী। এটি ছড়ানো if (status == ...) পরীক্ষার জায়গা নেয়। ব্যবসার workflow-তে (order: Pending -> Paid -> Shipped -> Delivered, বা Cancelled) স্পষ্ট state machine অবৈধ পরিবর্তন আটকায়, যেমন টাকা না দেওয়া order ship করা।"],
    p: [["List states and allowed transitions (draw arrows).", "অবস্থা ও অনুমোদিত পরিবর্তনের তালিকা করুন (তীর আঁকুন)।"], ["Encode transitions in one place (table or state classes).", "পরিবর্তন এক জায়গায় লিখুন (table বা state class)।"], ["Reject illegal transitions with a clear error.", "অবৈধ পরিবর্তন স্পষ্ট error দিয়ে প্রত্যাখ্যান করুন।"], ["Log every transition with time and actor.", "প্রতিটি পরিবর্তন সময় ও কর্তাসহ log করুন।"]],
    m: ["Status strings changed anywhere in the code; missing transitions (no way to cancel after payment); not persisting state changes atomically.", "Code-এর যেকোনো জায়গায় status string বদলানো; অনুপস্থিত পরিবর্তন (payment-এর পরে বাতিলের উপায় নেই); অবস্থার পরিবর্তন atomic-ভাবে সংরক্ষণ না করা।"],
    q: ["Q: How do you prevent shipping an unpaid order? A: Model order status as a state machine; Ship() is only allowed from Paid; any other state throws or returns an error.", "প্রশ্ন: টাকা না দেওয়া order ship করা কীভাবে আটকাবেন? উত্তর: Order status-কে state machine হিসেবে মডেল করুন; Ship() শুধু Paid থেকে অনুমোদিত; অন্য অবস্থায় throw বা error।"],
    f: ["Agent workflows and approval flows are state machines (Proposed -> Approved -> Executed). Explicit states make AI-driven processes auditable and safe.", "Agent workflow ও অনুমোদন প্রবাহ হলো state machine (Proposed -> Approved -> Executed)। স্পষ্ট অবস্থা AI-চালিত প্রক্রিয়াকে যাচাইযোগ্য ও নিরাপদ করে।"],
    x: [cs("Order state machine with a transition table · transition table-সহ order state machine", `var allowed = new Dictionary<(Status, string), Status>
{
    [(Status.Pending, "pay")] = Status.Paid,
    [(Status.Pending, "cancel")] = Status.Cancelled,
    [(Status.Paid, "ship")] = Status.Shipped,
    [(Status.Paid, "cancel")] = Status.Cancelled,
    [(Status.Shipped, "deliver")] = Status.Delivered,
};

var status = Status.Pending;
foreach (var action in new[] { "ship", "pay", "ship", "cancel", "deliver" })
{
    if (allowed.TryGetValue((status, action), out var next))
    {
        Console.WriteLine($"{action,-8} {status} -> {next}");
        status = next;
    }
    else Console.WriteLine($"{action,-8} not allowed while {status}");
}

enum Status { Pending, Paid, Shipped, Delivered, Cancelled }`, "ship     not allowed while Pending\npay      Pending -> Paid\nship     Paid -> Shipped\ncancel   not allowed while Shipped\ndeliver  Shipped -> Delivered")],
  },
  "Thread Safety": {
    s: ["Two cashiers updating the same paper ledger at the same moment: one writes '+500', the other '-200', and one overwrites the other. Thread safety means organising work so shared data is never corrupted.", "দুই ক্যাশিয়ার একই মুহূর্তে একই কাগজের খাতা আপডেট করছেন: একজন '+500', অন্যজন '-200' লেখেন, আর একজনেরটা অন্যজনেরটা মুছে দেয়। Thread safety মানে কাজ এমনভাবে সাজানো যাতে শেয়ার data কখনো নষ্ট না হয়।"],
    t: ["A race condition happens when threads read-modify-write shared state without coordination. Fixes: avoid sharing (immutable data, local variables), use atomic operations (Interlocked), use locks (lock, SemaphoreSlim for async), or use thread-safe collections (ConcurrentDictionary, Channel<T>). In ASP.NET Core, singletons are shared across all requests, so their state must be thread-safe.", "Race condition ঘটে যখন thread সমন্বয় ছাড়া শেয়ার অবস্থা পড়ে-বদলায়-লেখে। সমাধান: শেয়ার এড়ানো (অপরিবর্তনীয় data, local variable), atomic কাজ (Interlocked), lock (lock, async-এ SemaphoreSlim), বা thread-safe collection (ConcurrentDictionary, Channel<T>)। ASP.NET Core-এ singleton সব request-এ শেয়ার হয়, তাই তাদের অবস্থা thread-safe হতে হবে।"],
    p: [["Find shared mutable state (static fields, singletons).", "শেয়ার পরিবর্তনশীল অবস্থা খুঁজুন (static field, singleton)।"], ["Remove sharing if possible.", "সম্ভব হলে শেয়ার সরান।"], ["Otherwise use Interlocked, lock or concurrent collections.", "নয়তো Interlocked, lock বা concurrent collection দিন।"], ["Test with many parallel tasks.", "অনেক parallel task দিয়ে test করুন।"]],
    m: ["Using lock around await (not allowed; use SemaphoreSlim); locking on 'this' or strings; Dictionary in a singleton shared by requests; deadlocks from taking locks in different orders.", "await-এর চারপাশে lock (চলে না; SemaphoreSlim দিন); 'this' বা string-এ lock; request-এর শেয়ার করা singleton-এ Dictionary; ভিন্ন ক্রমে lock নিয়ে deadlock।"],
    q: ["Q: Why is count++ not thread-safe? A: It is read, add, write: two threads can read the same value and both write value+1, losing one increment. Use Interlocked.Increment.", "প্রশ্ন: count++ কেন thread-safe নয়? উত্তর: এটি পড়া, যোগ, লেখা: দুই thread একই মান পড়ে দুজনই value+1 লিখতে পারে, একটি বৃদ্ধি হারায়। Interlocked.Increment দিন।"],
    f: ["Concurrency bugs are hard for both humans and AI to spot in review. Prefer designs that avoid shared state, and use stress tests to prove thread safety.", "Concurrency bug review-এ মানুষ ও AI দুজনেরই ধরা কঠিন। শেয়ার অবস্থা এড়ানো design পছন্দ করুন এবং thread safety প্রমাণে stress test ব্যবহার করুন।"],
    x: [cs("Lost updates vs Interlocked vs lock · হারানো আপডেট বনাম নিরাপদ পদ্ধতি", `const int Tasks = 8, PerTask = 100_000;
int unsafeCount = 0, atomicCount = 0, lockedCount = 0;
var gate = new object();

await Task.WhenAll(Enumerable.Range(0, Tasks).Select(_ => Task.Run(() =>
{
    for (int i = 0; i < PerTask; i++)
    {
        unsafeCount++;                              // race condition
        Interlocked.Increment(ref atomicCount);     // atomic
        lock (gate) lockedCount++;                  // mutual exclusion
    }
})));

int expected = Tasks * PerTask;
Console.WriteLine($"expected:    {expected}");
Console.WriteLine($"unsafe lost updates: {(unsafeCount < expected ? "yes" : "not this time")}");
Console.WriteLine($"Interlocked: {atomicCount}");
Console.WriteLine($"lock:        {lockedCount}");`, "expected:    800000\nunsafe lost updates: yes\nInterlocked: 800000\nlock:        800000")],
  },
  "Machine Coding": {
    s: ["A cooking competition where you must serve a complete, tasty dish in 90 minutes. Judges care that it works, tastes good and the kitchen stays organised. Machine coding rounds ask you to build a small working system (parking lot, splitwise, rate limiter) in 60-90 minutes.", "রান্নার প্রতিযোগিতা, যেখানে ৯০ মিনিটে সম্পূর্ণ ও সুস্বাদু পদ পরিবেশন করতে হবে। বিচারকেরা দেখেন কাজ করে কি না, স্বাদ ভালো কি না, রান্নাঘর গোছানো কি না। Machine coding round ৬০-৯০ মিনিটে ছোট কাজের system (parking lot, splitwise, rate limiter) বানাতে বলে।"],
    t: ["Interviewers judge: correct core features, clean class design (entities, services, interfaces), extensibility (new vehicle type or payment method without rewrites), handling edge cases, and readable code with a small demo or tests. Clarify requirements first, design entities, implement the happy path, then add validation and extensions.", "Interviewer বিচার করেন: সঠিক মূল feature, পরিষ্কার class design (entity, service, interface), বাড়ানোর সুযোগ (নতুন vehicle ধরন বা payment পদ্ধতি নতুন করে না লিখে), সীমার case সামলানো, আর ছোট demo বা test-সহ পড়ার মতো code। আগে requirement স্পষ্ট করুন, entity design করুন, সফল পথ বানান, তারপর যাচাই ও বিস্তার যোগ করুন।"],
    p: [["Spend 5-10 minutes clarifying requirements and writing them down.", "৫-১০ মিনিট requirement স্পষ্ট করে লিখে রাখুন।"], ["Sketch entities and interfaces.", "Entity ও interface আঁকুন।"], ["Implement core flows with an in-memory store and a demo in Main.", "In-memory store ও Main-এ demo দিয়ে মূল প্রবাহ বানান।"], ["Add validation, edge cases and one extension; explain trade-offs.", "যাচাই, সীমার case ও একটি বিস্তার যোগ করুন; trade-off ব্যাখ্যা করুন।"]],
    m: ["Coding before clarifying; over-engineering with databases and frameworks; one giant class; never running the code before time is up.", "স্পষ্ট করার আগে code; database ও framework দিয়ে অতিরিক্ত জটিলতা; একটি বিশাল class; সময় শেষের আগে কখনো code না চালানো।"],
    q: ["Q: Design a parking lot. A: Entities: ParkingLot, Level, Spot (size), Vehicle (size), Ticket. Strategy for spot allocation, pricing strategy for fees, and clear errors when full.", "প্রশ্ন: Parking lot design করুন। উত্তর: Entity: ParkingLot, Level, Spot (আকার), Vehicle (আকার), Ticket। Spot বরাদ্দের strategy, ফি-র pricing strategy, আর ভরা হলে স্পষ্ট error।"],
    f: ["Some companies now allow AI assistants in coding rounds and judge how you direct, review and test the generated code. Practise both with and without AI.", "কিছু কোম্পানি এখন coding round-এ AI assistant ব্যবহারের অনুমতি দেয় এবং দেখে আপনি তৈরি হওয়া code কীভাবে পরিচালনা, review ও test করেন। AI-সহ ও AI ছাড়া দুভাবেই অনুশীলন করুন।"],
    x: [cs("Mini parking lot in one file · এক file-এ ছোট parking lot", `var lot = new ParkingLot([new Spot(1, Size.Small), new Spot(2, Size.Large), new Spot(3, Size.Medium)]);
var t1 = lot.Park(new Vehicle("DHK-1", Size.Medium));
var t2 = lot.Park(new Vehicle("DHK-2", Size.Large));
var t3 = lot.Park(new Vehicle("DHK-3", Size.Large));
Console.WriteLine(t1); Console.WriteLine(t2); Console.WriteLine(t3?.ToString() ?? "DHK-3: lot full for Large");
Console.WriteLine(lot.Leave(t1!, hours: 3));
Console.WriteLine($"free spots: {lot.Free}");

enum Size { Small = 1, Medium = 2, Large = 3 }
record Vehicle(string Plate, Size Size);
record Spot(int Id, Size Size) { public Vehicle? Parked { get; set; } }
record Ticket(string Plate, int SpotId) { public override string ToString() => $"{Plate} -> spot {SpotId}"; }

class ParkingLot(List<Spot> spots)
{
    public int Free => spots.Count(s => s.Parked is null);
    public Ticket? Park(Vehicle v)
    {
        // smallest free spot that fits the vehicle
        var spot = spots.Where(s => s.Parked is null && s.Size >= v.Size).OrderBy(s => s.Size).FirstOrDefault();
        if (spot is null) return null;
        spot.Parked = v;
        return new Ticket(v.Plate, spot.Id);
    }
    public string Leave(Ticket t, int hours)
    {
        var spot = spots.Single(s => s.Id == t.SpotId);
        decimal fee = hours * 20m * (int)spot.Size;
        spot.Parked = null;
        return $"{t.Plate} paid {fee} BDT for {hours}h";
    }
}`, "DHK-1 -> spot 3\nDHK-2 -> spot 2\nDHK-3: lot full for Large\nDHK-1 paid 120 BDT for 3h\nfree spots: 2")],
  },
};
