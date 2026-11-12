const data = {};
function add(key, en, bn, a, b, de, db) {
  data[key] = {
    en,
    bn,
    decisionEn: de,
    decisionBn: db,
    examples: [
      {
        title: "Model the behavior · আচরণের বাস্তব উদাহরণ",
        language: "csharp",
        code: a,
        kind: "Console example",
      },
      {
        title: "Extend and verify · বাড়ানো ও যাচাই",
        language: "csharp",
        code: b,
        kind: "Console example",
      },
    ],
  };
}
add(
  "OOP Pillars",
  "Encapsulation is about preserving valid state, not simply hiding fields. A public setter can undermine an invariant even when the field is private. Abstraction should expose the capability a caller needs. Polymorphism lets a consumer choose behavior through a contract; inheritance is one mechanism, while interface-based composition often gives a cleaner boundary.",
  "Encapsulation মানে শুধু field লুকানো নয়, বৈধ state রাখা। Public setter দিয়ে নিয়ম ভাঙা গেলে private field-ও যথেষ্ট নয়। Caller-এর দরকারি ক্ষমতা প্রকাশ করুন; interface-এর মাধ্যমে আচরণ বদলানো যায়।",
  `var account=new Account(100m);
account.Withdraw(30m);
Console.WriteLine(account.Balance);
try { account.Withdraw(100m); }
catch(InvalidOperationException e) { Console.WriteLine(e.Message); }
class Account {
    public decimal Balance {get;private set;}
    public Account(decimal opening) { if(opening<0)throw new ArgumentOutOfRangeException(nameof(opening));Balance=opening; }
    public void Withdraw(decimal value) { if(value<=0||value>Balance)throw new InvalidOperationException("Invalid withdrawal");Balance-=value; }
}`,
  `IShape[] shapes={new Circle(2),new Rectangle(3,4)};
foreach(var shape in shapes) Console.WriteLine(shape.Area);
interface IShape { double Area {get;} }
record Circle(double Radius):IShape { public double Area=>Math.PI*Radius*Radius; }
record Rectangle(double Width,double Height):IShape { public double Area=>Width*Height; }
// Domain validation for negative dimensions belongs at construction.
// The caller only depends on Area, not the concrete geometry.`,
  "Protect invariants through operations and constructors. Use inheritance only when subtype behavior remains substitutable, including errors and preconditions.",
  "Constructor ও operation দিয়ে নিয়ম রক্ষা করুন। Subtype-এ error ও শর্তসহ একই চুক্তি মানলে তবেই inheritance।",
);
add(
  "SOLID Principles",
  "Single responsibility refers to a reason to change, not one method per class. Open/closed favors extension points around real variation. Liskov requires behavioral substitutability. Interface segregation protects consumers from unrelated members. Dependency inversion places stable policy above implementation details; dependency injection is a wiring technique that can support it.",
  "SRP মানে পরিবর্তনের কারণ এক রাখা, class-এ এক method নয়। Liskov আচরণের চুক্তি মানা। ছোট interface caller-কে অপ্রাসঙ্গিক কাজ থেকে বাঁচায়। DIP নীতি ও implementation-এর নির্ভরতা ঠিক করে; DI হলো wiring-এর কৌশল।",
  `var service=new ReceiptService(new ConsoleReceipt());
service.Send(new Receipt(42,150m));
record Receipt(int OrderId,decimal Total);
interface IReceiptSender { void Send(Receipt receipt); }
class ConsoleReceipt:IReceiptSender {
    public void Send(Receipt r)=>Console.WriteLine($"Order {r.OrderId}: {r.Total}");
}
class ReceiptService(IReceiptSender sender) {
    public void Send(Receipt receipt) { if(receipt.Total<0)throw new ArgumentException("Total");sender.Send(receipt); }
}`,
  `var fake=new RecordingSender();
var service=new ReceiptService(fake);
service.Send("Paid");
if(fake.Messages.Single()!="Paid") throw new Exception("Contract failed");
Console.WriteLine("Verified through the contract");
interface ISender { void Send(string text); }
class RecordingSender:ISender { public List<string> Messages {get;}=new();public void Send(string text)=>Messages.Add(text); }
class ReceiptService(ISender sender) { public void Send(string text)=>sender.Send(text); }`,
  "An abstraction should isolate actual volatility. Too many interfaces around stable trivial code increase maintenance and navigation without improving design.",
  "আসল পরিবর্তনশীল অংশ আলাদা করুন। স্থায়ী সহজ code-এ অকারণে interface বাড়ালে বোঝা কঠিন হয়।",
);
add(
  "DRY / KISS / YAGNI",
  "Duplication of business knowledge is more dangerous than repeated syntax. Two rules that happen to be equal today may evolve independently. KISS favors explicit readable control flow over clever compression. YAGNI postpones speculative flexibility so the current requirement can be tested and delivered with fewer moving parts.",
  "একই business rule দুই জায়গায় থাকাই মূল ঝুঁকি; একই syntax সবসময় একই জ্ঞান নয়। সহজ readable flow রাখুন। দরকারের আগে ভবিষ্যতের সব flexibility বানালে আজকের কাজ জটিল হয়।",
  `decimal Tax(decimal amount,decimal rate) {
    if(amount<0||rate<0) throw new ArgumentOutOfRangeException();
    return decimal.Round(amount*rate,2,MidpointRounding.ToEven);
}
decimal subtotal=100m;
decimal tax=Tax(subtotal,0.15m);
Console.WriteLine($"Tax={tax}, total={subtotal+tax}");
// One explicit tax policy, with its rounding rule visible.`,
  `bool CanSubmit(int quantity,bool addressPresent) {
    if(quantity<=0) return false;
    if(!addressPresent) return false;
    return true;
}
Console.WriteLine(CanSubmit(2,true));
Console.WriteLine(CanSubmit(0,true));
// Clear guards beat an unnecessary configurable rule engine.`,
  "Extract shared policy after its meaning is understood. A premature common helper can couple two unrelated domains more tightly than a little duplication.",
  "অর্থ বোঝার পরে common policy বের করুন। আগেভাগে helper বানিয়ে দুই আলাদা domain জুড়ে ফেলবেন না।",
);
add(
  "Composition over Inheritance",
  "Composition delegates a responsibility to another object whose contract can be replaced. The containing object owns coordination, not necessarily the collaborator’s lifetime. This makes policy changes local and supports tests with substitutes. A deep base-class hierarchy can expose protected state and make unrelated subclasses depend on the same fragile implementation decisions.",
  "Composition-এ সহযোগী object-কে কাজ দেওয়া হয়। কে coordination করবে আর কে lifetime সামলাবে আলাদা ঠিক করুন। এতে policy বদল ও test সহজ হয়। Deep inheritance-এ base-এর পরিবর্তনে অনেক subclass ভাঙতে পারে।",
  `var checkout=new Checkout(new PercentageDiscount(0.10m));
Console.WriteLine(checkout.Total(200m));
interface IDiscount { decimal Apply(decimal value); }
class PercentageDiscount(decimal rate):IDiscount {
    public decimal Apply(decimal value)=>value*(1-rate);
}
class Checkout(IDiscount discount) {
    public decimal Total(decimal subtotal)=>discount.Apply(subtotal);
}`,
  `var audit=new List<string>();
var processor=new Processor(text=>audit.Add(text));
processor.Process("order-1");
Console.WriteLine(audit.Single());
class Processor(Action<string> record) {
    public void Process(string id) {
        if(string.IsNullOrWhiteSpace(id))throw new ArgumentException("Id");
        record($"Processed {id}");
    }
}`,
  "Composition does not require a new class for every behavior. Delegates can express small policies; interfaces help when several related operations form one contract.",
  "সব behavior-এর আলাদা class দরকার নেই। ছোট policy-তে delegate, সম্পর্কিত কয়েক কাজের জন্য interface কাজে লাগে।",
);
add(
  "UML Class Diagrams",
  "Use classes, attributes, and operations only at the detail needed for a conversation. Multiplicity answers how many instances participate. Association says objects know about each other; composition adds strong ownership semantics. A diagram can show a design intention that code must still enforce through constructors, access rules, and lifecycle management.",
  "Diagram আলোচনার দরকারমতো detail দেখাবে। Multiplicity বলে কয়টি instance। Association পরিচয়, composition শক্ত মালিকানা। শুধু ছবিতে আঁকলেই নিয়ম চলে না; code-এ constructor ও lifecycle দিয়ে মানাতে হয়।",
  `var order=new Order();
order.Add("Tea",2);
Console.WriteLine(order.Lines.Count);
record OrderLine(string Product,int Quantity);
class Order {
    private readonly List<OrderLine> lines=new();
    public IReadOnlyList<OrderLine> Lines=>lines.AsReadOnly();
    public void Add(string product,int quantity) { if(quantity<=0)throw new ArgumentException("Quantity");lines.Add(new(product,quantity)); }
}`,
  `// UML interpretation: Order 1 owns 0..* OrderLine.
var lines=new[] {new OrderLine("Tea",2),new OrderLine("Milk",1)};
int units=lines.Sum(x=>x.Quantity);
Console.WriteLine(units);
record OrderLine(string Product,int Quantity);
// A read-only collection API protects collection operations.
// It does not magically make every referenced child deeply immutable.`,
  "Keep diagram multiplicities and code invariants consistent. If deletion/lifetime semantics are not truly owned, prefer association over a misleading composition diamond.",
  "Diagram-এর multiplicity ও code-এর rule মিলান। আসল ownership না থাকলে composition diamond নয়, association দিন।",
);
add(
  "Singleton",
  "A singleton service is shared within its owning container. Initialization may be lazy or eager; uniqueness alone does not make mutable behavior thread-safe. In web applications a singleton outlives requests, so it must not capture request-scoped state. Global static access hides dependencies and makes test isolation harder.",
  "Singleton container-এর মধ্যে ভাগ করা instance। একবার তৈরি হলেই ভিতরের mutable কাজ thread-safe হয় না। Request-এর চেয়ে বেশি বাঁচে, তাই request state ধরে রাখা যাবে না। Static global dependency লুকায়।",
  `var lazy=new Lazy<Settings>(()=>new Settings("demo"));
Console.WriteLine(lazy.IsValueCreated);
Settings first=lazy.Value, second=lazy.Value;
Console.WriteLine(ReferenceEquals(first,second));
Console.WriteLine(first.Environment);
record Settings(string Environment);
// Lazy<T> coordinates initialization; it does not synchronize later mutations.`,
  `var counter=new SharedCounter();
Parallel.For(0,1000,_=>counter.Increment());
Console.WriteLine(counter.Value);
class SharedCounter {
    private int value;
    public void Increment()=>Interlocked.Increment(ref value);
    public int Value=>Volatile.Read(ref value);
}
// One instance per process is not a distributed global counter.`,
  "Use stateless or immutable shared services where possible. For cross-server shared state, select a durable external store and its consistency policy.",
  "সম্ভব হলে stateless বা immutable shared service নিন। বহু server-এর state আলাদা store ও consistency policy চায়।",
);
add(
  "Factory",
  "Creation logic can select implementations, validate required inputs, and centralize lifecycle rules. A factory returns a useful contract while hiding details the caller should not coordinate. The selection key must be validated. A factory is different from a service locator that lets arbitrary callers request any hidden dependency.",
  "Factory তৈরি করার সিদ্ধান্ত, validation ও দরকারি setup এক জায়গায় রাখে। Caller কাজের চুক্তি পায়। Key যাচাই করুন। যেকোনো hidden dependency খোঁজার service locator বানানো factory-এর উদ্দেশ্য নয়।",
  `INotifier Create(string kind)=>kind switch {
    "console"=>new ConsoleNotifier(),
    "silent"=>new SilentNotifier(),
    _=>throw new ArgumentException("Unknown notifier")
};
Create("console").Send("Order received");
interface INotifier { void Send(string text); }
class ConsoleNotifier:INotifier { public void Send(string text)=>Console.WriteLine(text); }
class SilentNotifier:INotifier { public void Send(string text){} }`,
  `var creators=new Dictionary<string,Func<IFormatter>>(StringComparer.OrdinalIgnoreCase) {
    ["upper"]=()=>new UpperFormatter(), ["plain"]=()=>new PlainFormatter()
};
string key="upper";
if(!creators.TryGetValue(key,out var create))throw new ArgumentException("Format");
Console.WriteLine(create().Format("hello"));
interface IFormatter { string Format(string text); }
class UpperFormatter:IFormatter { public string Format(string text)=>text.ToUpperInvariant(); }
class PlainFormatter:IFormatter { public string Format(string text)=>text; }`,
  "Prefer explicit constructor injection for stable dependencies. Use a factory when the instance or construction policy genuinely depends on runtime input.",
  "স্থায়ী dependency constructor-এ দিন। Runtime input-এ কোন instance বা setup বদলালে factory দরকার।",
);
add(
  "Abstract Factory",
  "An abstract factory groups construction of compatible products. Choosing a family once should prevent accidentally mixing products with incompatible assumptions. It makes adding a family easier but adding a new product operation harder because every family must implement it. This trade-off should reflect the axis of variation in your domain.",
  "একবার family বাছলে মিল থাকা কয়েক পণ্য তৈরি হয়। নতুন family যোগ সহজ, নতুন product operation যোগ করলে সব factory বদলায়। আপনার domain-এ কোনটি বেশি বদলায় তা দেখুন।",
  `IThemeFactory theme=new DarkTheme();
Console.WriteLine(theme.CreateButton().Render());
Console.WriteLine(theme.CreatePanel().Render());
interface IWidget { string Render(); }
record Widget(string Style):IWidget { public string Render()=>Style; }
interface IThemeFactory { IWidget CreateButton();IWidget CreatePanel(); }
class DarkTheme:IThemeFactory {
    public IWidget CreateButton()=>new Widget("dark-button");
    public IWidget CreatePanel()=>new Widget("dark-panel");
}`,
  `IThemeFactory Choose(bool dark)=>dark?new Theme("dark"):new Theme("light");
var factory=Choose(false);
Console.WriteLine(factory.Button());
Console.WriteLine(factory.Panel());
interface IThemeFactory { string Button();string Panel(); }
class Theme(string name):IThemeFactory {
    public string Button()=>$"{name}-button";
    public string Panel()=>$"{name}-panel";
}`,
  "If products have no meaningful compatibility relationship, a family factory may be artificial. Configuration plus ordinary factories can be simpler.",
  "পণ্যের মধ্যে বাস্তব compatibility না থাকলে family factory কৃত্রিম। Config ও সাধারণ factory সহজ হতে পারে।",
);
add(
  "Builder",
  "Builders separate a sequence of configuration steps from the final validated object. A builder may be mutable while its output is immutable. A good Build method checks required fields and cross-field constraints. Reusing the builder must have documented behavior so an earlier result is not unexpectedly changed by later steps.",
  "Builder ধাপে config নেয়, শেষে validated object দেয়। Builder mutable হলেও ফল immutable হতে পারে। Build-এ required ও cross-field rule দেখুন। Builder reuse করলে আগের ফল বদলাবে কি না স্পষ্ট করুন।",
  `var request=new RequestBuilder().WithPath("/orders").WithLimit(20).Build();
Console.WriteLine(request);
record Request(string Path,int Limit);
class RequestBuilder {
    private string? path;private int limit=10;
    public RequestBuilder WithPath(string value){path=value;return this;}
    public RequestBuilder WithLimit(int value){limit=value;return this;}
    public Request Build(){if(string.IsNullOrWhiteSpace(path)||limit is <1 or >100)throw new InvalidOperationException("Invalid request");return new(path,limit);}
}`,
  `var builder=new UriBuilder("https","example.com");
builder.Path="api/products";
builder.Query="limit=20";
Uri first=builder.Uri;
builder.Query="limit=40";
Uri second=builder.Uri;
Console.WriteLine(first);
Console.WriteLine(second);
Console.WriteLine(first==second);`,
  "For a small immutable value, a constructor with named arguments may be clearer than a fluent builder. Choose the abstraction by construction complexity.",
  "ছোট immutable value-তে named argument-সহ constructor সহজ হতে পারে। তৈরির জটিলতা অনুযায়ী builder নিন।",
);
add(
  "Prototype",
  "Prototype copying starts from an already configured object. The important question is which parts become independent and which remain shared. Record with-expressions copy the top-level record but retain nested references. Deep cloning must define how identity, shared subgraphs, cycles, and disposable resources are handled.",
  "Copy-তে কোন অংশ নতুন, কোনটি shared তা মূল প্রশ্ন। Record with উপরের record কপি করে, ভিতরের list reference থাকতে পারে। Deep clone-এ identity, cycle ও resource কী হবে ঠিক করুন।",
  `var original=new Basket("A",new List<string>{"Tea"});
var shallow=original with {Owner="B"};
shallow.Items.Add("Milk");
Console.WriteLine(string.Join(",",original.Items));
var independent=original with {Items=new List<string>(original.Items)};
independent.Items.Add("Rice");
Console.WriteLine(original.Items.Count);
Console.WriteLine(independent.Items.Count);
record Basket(string Owner,List<string> Items);`,
  `var baseline=new Label("Tea",20m);
var changed=baseline with {Price=25m};
Console.WriteLine(baseline);
Console.WriteLine(changed);
Console.WriteLine(baseline==changed);
record Label(string Name,decimal Price);
// Value equality is useful only when its component semantics fit the domain.`,
  "Do not serialize arbitrary objects as a universal cloning strategy. External handles and object identity may not survive or should not be duplicated.",
  "সব object serialize করে clone করবেন না। File handle বা identity কপি করা ঠিক নাও হতে পারে।",
);
add(
  "Adapter",
  "Adapters translate a boundary without forcing every caller to learn the legacy/provider API. Translation includes data shapes, units, exceptions, and cancellation—not just a method rename. Keeping provider-specific types inside the adapter limits coupling and gives contract tests a clear place to verify semantics.",
  "Adapter caller-এর চুক্তি ও পুরোনো/provider API মেলায়। নামের পাশাপাশি unit, shape, error ও cancellation-ও অনুবাদ। Provider type ভিতরে রাখলে coupling কমে ও contract test সহজ হয়।",
  `ITemperature sensor=new CelsiusAdapter(new LegacyFahrenheit());
Console.WriteLine($"{sensor.ReadCelsius():F1} C");
interface ITemperature { double ReadCelsius(); }
class LegacyFahrenheit { public double Read()=>77; }
class CelsiusAdapter(LegacyFahrenheit sensor):ITemperature {
    public double ReadCelsius()=>(sensor.Read()-32)*5.0/9.0;
}`,
  `decimal ToMajorUnits(long minor,int digits) {
    if(digits is <0 or >6)throw new ArgumentOutOfRangeException(nameof(digits));
    decimal scale=1;
    for(int i=0;i<digits;i++)scale*=10;
    return minor/scale;
}
Console.WriteLine(ToMajorUnits(12345,2));
Console.WriteLine(ToMajorUnits(12345,0));
// Provider amount units must be translated explicitly.`,
  "Test boundaries such as rounding and failure translation. An adapter that silently changes an error into success violates the expected contract.",
  "Rounding ও error translation-এর সীমা test করুন। ভুলকে চুপে success করলে adapter চুক্তি ভাঙে।",
);
add(
  "Decorator",
  "A decorator preserves the wrapped contract while adding behavior around a call. Multiple wrappers form an ordered composition. Logging outside caching sees every request; logging inside caching sees only cache misses. Retry wrappers can repeat side effects, so placement and idempotency must be part of the design.",
  "Decorator একই contract রেখে কাজের আগে/পরে আচরণ দেয়। Wrapper-এর ক্রম গুরুত্বপূর্ণ: cache-এর বাইরে log সব request দেখে, ভিতরে শুধু miss। Retry side effect পুনরাবৃত্তি করতে পারে।",
  `IPrice source=new FixedPrice(100m);
IPrice taxed=new TaxedPrice(source,0.15m);
Console.WriteLine(taxed.Read());
interface IPrice { decimal Read(); }
record FixedPrice(decimal Value):IPrice { public decimal Read()=>Value; }
class TaxedPrice(IPrice inner,decimal rate):IPrice {
    public decimal Read()=>inner.Read()*(1+rate);
}`,
  `IReader reader=new CachedReader(new CountingReader());
Console.WriteLine(reader.Read());
Console.WriteLine(reader.Read());
interface IReader { string Read(); }
class CountingReader:IReader { private int calls;public string Read()=>$"source-call-{++calls}"; }
class CachedReader(IReader inner):IReader {
    private string? cached;
    public string Read()=>cached??=inner.Read();
}
// Teaching cache: no expiry or concurrency guarantee.`,
  "Wrappers should preserve required error and cancellation semantics. A decorator changing those semantics deserves a new explicit contract or documentation.",
  "Wrapper-এ error ও cancellation-এর দরকারি অর্থ রাখুন। বদলালে চুক্তি স্পষ্টভাবে জানান।",
);
add(
  "Facade",
  "A facade offers a use-case-oriented entry point across several subsystem operations. The subsystem components remain responsible for their own rules. A facade can simplify a workflow but cannot promise atomicity across independent systems unless an actual transaction or compensation protocol provides it.",
  "Facade কয়েক subsystem-এর একটি use-case entry দেয়। প্রতিটির নিজস্ব rule থাকে। সহজ method দেখালেই স্বাধীন সিস্টেমের কাজ এক transaction হয় না; compensation লাগতে পারে।",
  `var facade=new Checkout(new Stock(),new Payment());
Console.WriteLine(facade.Place("Tea",2));
class Stock { public bool Available(string product,int quantity)=>product=="Tea"&&quantity>0&&quantity<=10; }
class Payment { public string Charge(decimal amount)=>$"demo-charge:{amount}"; }
class Checkout(Stock stock,Payment payment) {
    public string Place(string product,int quantity) {
        if(!stock.Available(product,quantity))throw new InvalidOperationException("Unavailable");
        return payment.Charge(quantity*20m);
    }
}`,
  `var steps=new[] {"Validate order","Reserve stock","Authorize payment","Confirm"};
foreach(string step in steps)Console.WriteLine(step);
var compensation=new Dictionary<string,string> {
    ["Reserve stock"]="Release reservation",
    ["Authorize payment"]="Void authorization"
};
foreach(var pair in compensation)Console.WriteLine($"{pair.Key} -> {pair.Value}");`,
  "The payment in the first example is a demo, not a real financial operation. Real checkout needs durable identity, idempotency, failure recovery, and transaction boundaries.",
  "প্রথম payment শুধু demo। বাস্তবে durable id, idempotency, recovery ও transaction boundary দরকার।",
);
add(
  "Proxy",
  "A proxy controls access, timing, or location of an operation while presenting a familiar interface. Authorization, lazy initialization, and remote invocation are different proxy uses with different failure models. A method that looks local can incur network latency or fail after the remote side performed the effect.",
  "Proxy access, কখন কাজ হবে বা কোথায় হবে নিয়ন্ত্রণ করে। Authorization, lazy load ও remote call-এর ঝুঁকি আলাদা। Local-এর মতো method দূরে কাজ করে reply হারালে uncertainty থাকতে পারে।",
  `IReport report=new AuthorizedReport(new Report(),canRead:false);
try {Console.WriteLine(report.Read());}
catch(UnauthorizedAccessException){Console.WriteLine("Denied");}
interface IReport { string Read(); }
class Report:IReport { public string Read()=>"Private report"; }
class AuthorizedReport(IReport inner,bool canRead):IReport {
    public string Read()=>canRead?inner.Read():throw new UnauthorizedAccessException();
}`,
  `var lazy=new Lazy<ExpensiveDocument>(()=>new ExpensiveDocument());
Console.WriteLine(lazy.IsValueCreated);
Console.WriteLine(lazy.Value.Read());
Console.WriteLine(lazy.IsValueCreated);
class ExpensiveDocument {
    public ExpensiveDocument(){Console.WriteLine("Loading once");}
    public string Read()=>"Document contents";
}`,
  "Protect the true data boundary, not only an optional proxy callers can bypass. A remote proxy needs explicit timeout and retry policy.",
  "Caller bypass করতে পারে এমন proxy একা নিরাপত্তা নয়। আসল data boundary-তে rule ও remote call-এ timeout দিন।",
);
add(
  "Observer",
  "Observers reduce direct coupling by allowing listeners to subscribe to a publisher’s events. In ordinary C# events, invocation is synchronous and a listener exception can stop later listeners. Subscription lifetime matters because a publisher can retain a receiver. Asynchronous durable delivery is a different architecture than an in-process event.",
  "C# event সাধারণত synchronous। এক listener exception দিলে পরের listener নাও চলতে পারে। Publisher receiver-কে reference ধরে রাখতে পারে, তাই unsubscribe দরকার। Durable async খবর পাঠানো ভিন্ন ব্যবস্থা।",
  `var source=new Inventory();
void OnChanged(int quantity)=>Console.WriteLine($"Stock={quantity}");
source.Changed+=OnChanged;
source.Set(5);
source.Changed-=OnChanged;
source.Set(3);
class Inventory {
    public event Action<int>? Changed;
    public void Set(int value){if(value<0)throw new ArgumentException();Changed?.Invoke(value);}
}`,
  `var handlers=new List<Action<string>> {
    text=>Console.WriteLine(text),
    _=>throw new InvalidOperationException("Listener failed"),
    text=>Console.WriteLine($"Last: {text}")
};
foreach(var handler in handlers) {
    try {handler("update");}
    catch(Exception e){Console.WriteLine($"Observed failure: {e.Message}");}
}
// Explicit failure isolation is a policy, not default event behavior.`,
  "Choose whether listener failures propagate, are isolated, or trigger retries. Swallowing every exception without recording it hides broken projections.",
  "Listener fail হলে propagate, isolate নাকি retry—নীতি দিন। Log ছাড়া exception গিলে broken কাজ লুকাবেন না।",
);
add(
  "Strategy",
  "Strategy separates a varying algorithm from the context that needs its result. A useful contract keeps input, output, error, and state assumptions consistent between alternatives. Selection can come from configuration, user choice, or domain rules. Stateful strategies may require request-local lifetimes even when their interface looks stateless.",
  "Strategy-তে বদলানো algorithm ও caller আলাদা। বিকল্পে input, ফল, error ও state-এর চুক্তি মিলতে হবে। Config বা domain rule কৌশল বাছে। Stateful strategy shared singleton নাও হতে পারে।",
  `IShipping policy=new FlatShipping(50m);
Console.WriteLine(Quote(2m,policy));
policy=new WeightShipping(30m);
Console.WriteLine(Quote(2m,policy));
decimal Quote(decimal weight,IShipping shipping)=>shipping.Cost(weight);
interface IShipping {decimal Cost(decimal weight);}
record FlatShipping(decimal Fee):IShipping {public decimal Cost(decimal weight)=>Fee;}
record WeightShipping(decimal Rate):IShipping {public decimal Cost(decimal weight)=>weight*Rate;}`,
  `var policies=new Dictionary<string,Func<decimal,decimal>> {
    ["regular"]=amount=>amount,
    ["member"]=amount=>amount*0.9m
};
string selected="member";
if(!policies.TryGetValue(selected,out var apply))throw new ArgumentException("Policy");
Console.WriteLine(apply(200m));
// A small functional strategy avoids unnecessary classes.`,
  "Use Strategy for meaningful variability, not to hide a stable one-line calculation behind several layers. Test every alternative against shared contract cases.",
  "অর্থবহ variability-তে Strategy নিন। সব বিকল্পকে একই contract test দিয়ে দেখুন।",
);
add(
  "Command",
  "Commands package an intention with the information required to execute it. A handler decides validity at execution time, because state may have changed after creation. Durable commands need IDs, authorization context, serialization/version rules, and idempotent side effects. An undo command is domain-specific and may not perfectly reverse external consequences.",
  "Command করার ইচ্ছা ও দরকারি তথ্য রাখে। তৈরি ও execution-এর মাঝে state বদলাতে পারে, তাই handler আবার যাচাই করে। Durable command-এ id, permission, version ও duplicate সামলানো লাগে। Undo সব side effect ফিরিয়ে দেয় না।",
  `var handler=new CounterHandler();
var command=new Increment(Guid.NewGuid(),3);
handler.Handle(command);handler.Handle(command);
Console.WriteLine(handler.Value); // 3, not 6
record Increment(Guid Id,int Amount);
class CounterHandler {
    private readonly HashSet<Guid> handled=new();
    public int Value{get;private set;}
    public void Handle(Increment c){if(c.Amount<=0)throw new ArgumentException();if(handled.Add(c.Id))Value+=c.Amount;}
}`,
  `var undo=new Stack<Action>();
int value=0;
value+=5;undo.Push(()=>value-=5);
value+=2;undo.Push(()=>value-=2);
Console.WriteLine(value);
if(undo.TryPop(out var reverse))reverse();
Console.WriteLine(value);
// In-memory undo is not a durable distributed compensation protocol.`,
  "The first example’s deduplication is process-local and not crash-safe. Store command identity and side effects atomically for a real durable guarantee.",
  "প্রথম dedup memory-তে; restart-এ হারায়। বাস্তবে command id ও effect একই atomic storage boundary-তে রাখুন।",
);
add(
  "State",
  "State machines define allowed transitions and reject invalid ones. Treat events, current state, guards, and resulting state as explicit inputs and outputs. Persisted workflows need concurrency protection so two callers cannot both transition from an old state. Transition logs support audit and recovery; state alone may not explain how it was reached.",
  "State machine বৈধ পথ স্পষ্ট করে ও ভুল পথ আটকায়। Event, current state, guard ও next state আলাদা ভাবুন। দুই request পুরোনো state দেখে একসাথে বদলাতে না পারে concurrency দিন।",
  `OrderState Transition(OrderState state,string action)=>(state,action) switch {
    (OrderState.New,"pay")=>OrderState.Paid,
    (OrderState.Paid,"ship")=>OrderState.Shipped,
    (OrderState.New,"cancel")=>OrderState.Cancelled,
    _=>throw new InvalidOperationException("Invalid transition")
};
var state=Transition(OrderState.New,"pay");
Console.WriteLine(Transition(state,"ship"));
enum OrderState{New,Paid,Shipped,Cancelled}`,
  `int version=3;
string state="New";
bool TryPay(int expectedVersion) {
    if(expectedVersion!=version||state!="New")return false;
    state="Paid";version++;return true;
}
Console.WriteLine(TryPay(3));
Console.WriteLine(TryPay(3));
// Single-threaded illustration; use atomic compare-and-swap in storage.`,
  "A local check followed by a separate write is not a distributed compare-and-swap. Use a database concurrency token or conditional update for actual protection.",
  "Local check-এর পরে আলাদা write atomic নয়। Database token বা conditional update ব্যবহার করুন।",
);
add(
  "Thread Safety",
  "Synchronization protects a complete invariant, which may span multiple fields. Atomic increments solve one variable’s operation, not a complex transfer. lock is suitable for short synchronous critical sections. SemaphoreSlim can gate asynchronous work without holding a monitor over await. Cancellation and finally-based release prevent leaked permits.",
  "একাধিক field মিলে rule হলে এক atomic increment যথেষ্ট নয়। Lock ছোট synchronous অংশ রক্ষা করে। Async কাজের সীমায় SemaphoreSlim; finally-তে release না হলে permit হারিয়ে deadlock হতে পারে।",
  `var ledger=new Ledger(100m,0m);
Parallel.For(0,10,_=>ledger.Transfer(5m));
Console.WriteLine(ledger.Snapshot());
class Ledger(decimal a,decimal b) {
    private readonly object gate=new();
    private decimal left=a,right=b;
    public void Transfer(decimal amount){lock(gate){if(amount<=0||left<amount)throw new InvalidOperationException();left-=amount;right+=amount;}}
    public (decimal,decimal) Snapshot(){lock(gate)return(left,right);}
}`,
  `using var gate=new SemaphoreSlim(2);
async Task Work(int id) {
    await gate.WaitAsync();
    try {Console.WriteLine($"Start {id}");await Task.Delay(20);}
    finally {gate.Release();}
}
await Task.WhenAll(Enumerable.Range(0,5).Select(Work));
Console.WriteLine("All work completed");`,
  "Never await while holding a normal lock. Minimize shared mutation and prefer immutable messages or ownership boundaries before adding more locks.",
  "সাধারণ lock-এর মধ্যে await নয়। Lock বাড়ানোর আগে shared mutation কমান ও ownership স্পষ্ট করুন।",
);
add(
  "Machine Coding",
  "A strong small implementation starts with acceptance cases and invariants, then uses the fewest concepts that make them clear. For a parking lot, identity and occupancy are different concerns: a vehicle should not receive duplicate admission, and leaving an unknown ticket should not free space. Persistence, pricing, and concurrency are separate extensions.",
  "ছোট implementation-এ আগে acceptance case ও invariant লিখুন। Parking-এ capacity ও vehicle identity আলাদা; duplicate গাড়ি বা অচেনা ticket-এ জায়গা বদলানো যাবে না। Price, storage ও concurrency পরে আলাদা বাড়ান।",
  `var lot=new ParkingLot(2);
var ticket=lot.Park("DHAKA-1");
Console.WriteLine(lot.Available);
Console.WriteLine(lot.Leave(ticket));
Console.WriteLine(lot.Leave(ticket));
class ParkingLot(int capacity) {
    private readonly Dictionary<Guid,string> tickets=new();
    public int Available=>capacity-tickets.Count;
    public Guid Park(string vehicle){if(capacity<=0||Available==0||tickets.Values.Contains(vehicle))throw new InvalidOperationException("Cannot park");var id=Guid.NewGuid();tickets.Add(id,vehicle);return id;}
    public bool Leave(Guid ticket)=>tickets.Remove(ticket);
}`,
  `var cases=new[] {(Capacity:1,Attempts:2),(Capacity:3,Attempts:2)};
foreach(var c in cases) {
    int admitted=Math.Min(c.Capacity,c.Attempts);
    int rejected=c.Attempts-admitted;
    Console.WriteLine($"capacity={c.Capacity}, admitted={admitted}, rejected={rejected}");
}
// Convert these acceptance expectations into tests against ParkingLot.
// Add duplicate vehicle, unknown ticket, and zero-capacity cases.`,
  "The model is deliberately single-threaded. Production admission requires durable ticket state and an atomic capacity/uniqueness check across concurrent requests.",
  "Model single-threaded। Production-এ durable ticket ও capacity/unique check একই atomic সীমায় লাগবে।",
);
export default data;
