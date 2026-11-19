// Module 19 — Computer Networks for .NET developers.
// Each row: topic, en, bn, analogy [en, bn], flow, code (C#, "~~ English / বাংলা" per line),
// output, caution, exercise, kind, optional sql (T-SQL) and bash examples, interview [q, a].
const cs = String.raw;

export const networkRows = [
  {
    topic: "OSI Model",
    en: "The OSI model splits network communication into 7 layers: Physical, Data Link, Network, Transport, Session, Presentation and Application. Each layer does one job and serves the layer above it. Your ASP.NET Core code and SqlClient live at layer 7; TLS encryption and JSON formatting sit near layer 6; TCP ports are layer 4; IP addresses are layer 3; MAC addresses and Wi-Fi/cables are layers 2 and 1. When something breaks, you debug layer by layer from the bottom.",
    bn: "OSI model নেটওয়ার্কের কাজকে ৭টি তলায় (layer) ভাগ করে: Physical, Data Link, Network, Transport, Session, Presentation, Application। প্রতিটি তলা একটি কাজ করে। আপনার ASP.NET Core ও SqlClient কোড থাকে ৭ নম্বরে, TCP port ৪ নম্বরে, IP address ৩ নম্বরে। সমস্যা হলে নিচ থেকে উপরে এক এক তলা পরীক্ষা করুন।",
    analogy: [
      "Sending a gift by courier: you write a letter (Application), translate it into the receiver's language (Presentation), agree to keep talking (Session), choose tracked delivery with a receipt (Transport), write the city address (Network), hand it to the local van with a house number (Data Link), and the van drives on the road (Physical).",
      "কুরিয়ারে উপহার পাঠানোর মতো: চিঠি লেখা (Application), ভাষা ঠিক করা (Presentation), কথা চালু রাখা (Session), রসিদসহ ডেলিভারি (Transport), শহরের ঠিকানা (Network), পাড়ার ভ্যানে বাড়ির নম্বর (Data Link), আর রাস্তা দিয়ে গাড়ি চলা (Physical)।",
    ],
    flow: ["L7 HTTP and SQL (TDS)", "L6 TLS and JSON", "L4 TCP port", "L3 IP address", "L2 MAC frame", "L1 cable or Wi-Fi"],
    code: cs`var layers = new (int No, string Name, string DotNetExample)[] ~~ A small table of the 7 layers / ৭টি layer-এর ছোট table
{
    (7, "Application", "HttpClient, ASP.NET Core, SqlClient (TDS)"), ~~ Your code talks here / আপনার কোড এখানে কথা বলে
    (6, "Presentation", "JSON serialization, TLS encryption"), ~~ Format and encrypt data / data-র format ও encryption
    (5, "Session", "SQL Server login session, HTTP keep-alive"), ~~ Keep a conversation open / কথোপকথন চালু রাখা
    (4, "Transport", "TCP port 443 or 1433"), ~~ Ports and reliable delivery / port ও নিশ্চিত ডেলিভারি
    (3, "Network", "IP address 10.0.0.5"), ~~ Which computer on which network / কোন network-এর কোন কম্পিউটার
    (2, "Data Link", "MAC address, Ethernet frame"), ~~ Next device on the same local network / একই local network-এর পরের device
    (1, "Physical", "Cable, Wi-Fi radio"), ~~ Real signals on wire or air / তার বা বাতাসে আসল signal
};
foreach (var l in layers) ~~ Visit each layer from top to bottom / উপর থেকে নিচে প্রতিটি layer
    Console.WriteLine($"L{l.No} {l.Name,-12} -> {l.DotNetExample}"); ~~ Print number, name and .NET example / নম্বর, নাম ও .NET উদাহরণ লিখুন`,
    output: `L7 Application  -> HttpClient, ASP.NET Core, SqlClient (TDS)
L6 Presentation -> JSON serialization, TLS encryption
L5 Session      -> SQL Server login session, HTTP keep-alive
L4 Transport    -> TCP port 443 or 1433
L3 Network      -> IP address 10.0.0.5
L2 Data Link    -> MAC address, Ethernet frame
L1 Physical     -> Cable, Wi-Fi radio`,
    caution:
      "OSI is a teaching model; real stacks (TCP/IP) merge some layers. SQL Server error 'A network-related or instance-specific error' is usually layer 3/4 (DNS, IP, port, firewall), while 'Login failed for user' is layer 7 — the network works but authentication failed.",
    exercise:
      "Your API cannot reach SQL Server. Write the order in which you would test layers 1, 3, 4 and 7, and one command or C# check for each.",
    interview: [
      "Q: At which OSI layer do HTTP, TCP and IP work? A: HTTP at layer 7, TCP at layer 4, IP at layer 3.",
      "প্রশ্ন: HTTP, TCP, IP কোন layer-এ? উত্তর: HTTP ৭-এ, TCP ৪-এ, IP ৩-এ।",
    ],
  },
  {
    topic: "TCP/IP Model",
    en: "TCP/IP is the model the real internet uses. It has 4 layers: Application (HTTP, DNS, SQL Server's TDS), Transport (TCP or UDP with port numbers), Internet (IP addresses and routing) and Link (Ethernet or Wi-Fi with MAC addresses). Data going down the stack gets wrapped in a new header at each layer — this is called encapsulation. The receiver unwraps the headers in reverse order.",
    bn: "আসল internet চলে TCP/IP model-এ। এর ৪টি layer: Application (HTTP, DNS), Transport (TCP/UDP ও port), Internet (IP address), Link (Ethernet/Wi-Fi ও MAC)। নিচে নামার সময় প্রতিটি layer data-র উপর নিজের header জুড়ে দেয় — একে encapsulation বলে। গ্রহণকারী উল্টো ক্রমে header খোলে।",
    analogy: [
      "Like putting a letter in an envelope, then the envelope in a courier bag, then the bag in a truck. The receiver opens truck, then bag, then envelope, then reads the letter.",
      "চিঠি খামে, খাম কুরিয়ার ব্যাগে, ব্যাগ ট্রাকে। প্রাপক আগে ট্রাক, তারপর ব্যাগ, তারপর খাম খুলে চিঠি পড়েন।",
    ],
    flow: ["Application data", "TCP header adds ports", "IP header adds addresses", "Link header adds MAC", "Bits on the wire"],
    code: cs`string payload = "GET /api/orders HTTP/1.1"; ~~ Application layer: the HTTP request text / Application layer: HTTP request-এর লেখা
string segment = $"[TCP 51000->443]{payload}"; ~~ Transport adds source and destination ports / Transport source ও destination port যোগ করে
string packet = $"[IP 192.168.1.10->93.184.216.34]{segment}"; ~~ Internet layer adds IP addresses / Internet layer IP address যোগ করে
string frame = $"[ETH aa:bb->cc:dd]{packet}"; ~~ Link layer adds MAC addresses for the next hop / Link layer পরের hop-এর MAC যোগ করে
Console.WriteLine(frame); ~~ This wrapped frame is what travels / এই মোড়ানো frame-টাই যাত্রা করে
Console.WriteLine($"Headers added: {frame.Length - payload.Length} characters"); ~~ Each layer adds overhead / প্রতিটি layer বাড়তি জায়গা নেয়`,
    output: `[ETH aa:bb->cc:dd][IP 192.168.1.10->93.184.216.34][TCP 51000->443]GET /api/orders HTTP/1.1
Headers added: 66 characters`,
    caution:
      "Real headers are binary, not text; the string is only a picture of encapsulation. When you call HttpClient or SqlConnection, the operating system builds the TCP, IP and link headers for you.",
    exercise: "Add a TLS layer between TCP and HTTP in the example. Where in the string should it go?",
    interview: [
      "Q: Name the 4 TCP/IP layers and one protocol each. A: Application-HTTP, Transport-TCP, Internet-IP, Link-Ethernet.",
      "প্রশ্ন: TCP/IP-এর ৪টি layer ও একটি করে protocol? উত্তর: Application-HTTP, Transport-TCP, Internet-IP, Link-Ethernet।",
    ],
  },
  {
    topic: "IP Addressing",
    en: "An IP address identifies a device on a network. IPv4 has 4 numbers (192.168.1.25); IPv6 is longer (2001:db8::1). Some ranges are special: 127.0.0.1 and ::1 are loopback (this same machine), and 10.x, 172.16-31.x and 192.168.x are private addresses that are not reachable from the internet. In .NET, System.Net.IPAddress parses and inspects addresses; SQL Server shows the client's IP in sys.dm_exec_connections.",
    bn: "IP address দিয়ে network-এ একটি device চেনা যায়। IPv4-এ ৪টি সংখ্যা (192.168.1.25), IPv6 লম্বা (::1)। 127.0.0.1 মানে এই নিজের কম্পিউটার (loopback)। 10.x, 172.16-31.x, 192.168.x হলো private address — internet থেকে সরাসরি আসা যায় না। .NET-এ IPAddress class দিয়ে address পরীক্ষা করুন।",
    analogy: [
      "An IP address is a house address. Private addresses are flat numbers inside one building (Flat 3B) — useful inside, meaningless to the outside post office. Loopback is writing a letter to yourself.",
      "IP address বাড়ির ঠিকানার মতো। Private address হলো বিল্ডিংয়ের ভেতরের ফ্ল্যাট নম্বর (৩বি) — ভেতরে কাজের, বাইরের পোস্ট অফিসের কাছে অর্থহীন। Loopback মানে নিজেকে চিঠি লেখা।",
    ],
    flow: ["Text address", "IPAddress.Parse", "Check family IPv4 or IPv6", "Check loopback", "Check private range"],
    code: cs`using System.Net; ~~ IPAddress lives here / IPAddress এখানে থাকে
using System.Net.Sockets; ~~ AddressFamily lives here / AddressFamily এখানে থাকে
string[] inputs = { "127.0.0.1", "192.168.1.25", "8.8.8.8", "::1" }; ~~ Loopback, private, public and IPv6 samples / চার রকম address
foreach (var text in inputs) ~~ Check each address / প্রতিটি address পরীক্ষা
{
    var ip = IPAddress.Parse(text); ~~ Turn text into an IPAddress object / লেখাকে IPAddress object বানান
    string family = ip.AddressFamily == AddressFamily.InterNetworkV6 ? "IPv6" : "IPv4"; ~~ Detect the version / version বের করুন
    Console.WriteLine($"{text,-13} {family} loopback={IPAddress.IsLoopback(ip)} private={IsPrivate(ip)}"); ~~ Print the facts / তথ্য লিখুন
}
static bool IsPrivate(IPAddress ip) ~~ Our helper for private IPv4 ranges / private IPv4 চেনার helper
{
    if (ip.AddressFamily != AddressFamily.InterNetwork) return false; ~~ Only IPv4 in this simple version / সহজ রাখতে শুধু IPv4
    byte[] b = ip.GetAddressBytes(); ~~ Get the 4 numbers / ৪টি সংখ্যা নিন
    return b[0] == 10 || (b[0] == 172 && b[1] >= 16 && b[1] <= 31) || (b[0] == 192 && b[1] == 168); ~~ The three private ranges / তিনটি private range
}`,
    output: `127.0.0.1     IPv4 loopback=True private=False
192.168.1.25  IPv4 loopback=False private=True
8.8.8.8       IPv4 loopback=False private=False
::1           IPv6 loopback=True private=False`,
    sql: `-- Which IP is my app connecting from, and which server IP/port did it reach?
SELECT session_id,
       client_net_address,   -- IP of the app server (or proxy/NAT in front of it)
       local_net_address,    -- IP of the SQL Server that accepted the connection
       local_tcp_port        -- usually 1433
FROM sys.dm_exec_connections
WHERE session_id = @@SPID;`,
    caution:
      "Use IPAddress.TryParse for user input. Behind a load balancer or proxy, HttpContext.Connection.RemoteIpAddress shows the proxy's IP — configure ForwardedHeaders to see the real client.",
    exercise: "Change IsPrivate to also return true for 169.254.x.x (link-local). Test it with 169.254.10.10.",
  },
  {
    topic: "Subnetting & CIDR",
    en: "CIDR notation like 10.0.1.0/24 describes a block of addresses: the first 24 bits are the network part and the remaining 8 bits are for hosts, so the block has 2^8 = 256 addresses (254 usable). A smaller prefix (/16) means a bigger network. Cloud VNets, firewall rules and SQL Server access lists are written in CIDR. In .NET 8+, System.Net.IPNetwork parses CIDR and tells you if an address is inside.",
    bn: "10.0.1.0/24 মানে প্রথম ২৪ bit network-এর, বাকি ৮ bit device-এর জন্য — মোট ২৫৬টি address (ব্যবহারযোগ্য ২৫৪)। Prefix ছোট হলে (/16) network বড়। Cloud network, firewall rule সব CIDR-এ লেখা হয়। .NET 8-এ IPNetwork দিয়ে CIDR পরীক্ষা করা যায়।",
    analogy: [
      "A CIDR block is like a street name: '/24' says the first part of the address is the street and the last number is the house. All houses on Road 5 share the same street part.",
      "CIDR হলো রাস্তার নামের মতো: /24 বলে ঠিকানার প্রথম অংশ রাস্তা, শেষ সংখ্যা বাড়ি। ৫ নম্বর রোডের সব বাড়ির রাস্তার অংশ এক।",
    ],
    flow: ["CIDR text 10.0.1.0/24", "Network bits = 24", "Host bits = 8", "256 addresses", "Contains check"],
    code: cs`using System.Net; ~~ IPNetwork is in System.Net (.NET 8+) / IPNetwork আছে System.Net-এ (.NET 8+)
var subnet = IPNetwork.Parse("10.0.1.0/24"); ~~ Parse the CIDR block / CIDR block পড়ুন
int total = 1 << (32 - subnet.PrefixLength); ~~ 2 to the power of host bits / host bit-এর ঘাত হিসাব
Console.WriteLine($"Network {subnet.BaseAddress}, prefix /{subnet.PrefixLength}"); ~~ Show base and prefix / base ও prefix দেখান
Console.WriteLine($"Addresses: {total} (usable {total - 2})"); ~~ First is network id, last is broadcast / প্রথমটি network id, শেষটি broadcast
foreach (var ip in new[] { "10.0.1.7", "10.0.2.7" }) ~~ One inside, one outside / একটি ভেতরে, একটি বাইরে
    Console.WriteLine($"{ip} inside? {subnet.Contains(IPAddress.Parse(ip))}"); ~~ Ask the subnet / subnet-কে জিজ্ঞেস করুন`,
    output: `Network 10.0.1.0, prefix /24
Addresses: 256 (usable 254)
10.0.1.7 inside? True
10.0.2.7 inside? False`,
    caution:
      "Cloud providers reserve extra addresses in each subnet (Azure and AWS reserve 5). Plan subnets bigger than you need — resizing later is painful. Put SQL Server in a private subnet that only the app subnet can reach.",
    exercise: "How many addresses does 10.0.0.0/22 have? Change the code to verify, then test 10.0.3.200.",
  },
  {
    topic: "MAC Address & ARP",
    en: "A MAC address (like AA-BB-CC-11-22-33) is the hardware address of a network card and is used only inside the local network. IP gets a packet to the right network; MAC gets it to the right device on that network. ARP (Address Resolution Protocol) answers the question 'who has IP 192.168.1.1? tell me your MAC' and caches the answer. In .NET, NetworkInterface lists your adapters and their MAC addresses.",
    bn: "MAC address হলো network card-এর hardware ঠিকানা, শুধু local network-এর ভেতরে কাজে লাগে। IP দিয়ে সঠিক network-এ পৌঁছায়, MAC দিয়ে সেই network-এর সঠিক device-এ। ARP জিজ্ঞেস করে 'এই IP কার? তোমার MAC বলো' এবং উত্তর cache-এ রাখে।",
    analogy: [
      "IP is the building address; MAC is the person's national ID inside the building. The receptionist (ARP) shouts 'who is in flat 3B?' once, then writes the name in a notebook (ARP cache).",
      "IP হলো বিল্ডিংয়ের ঠিকানা, MAC হলো ভেতরের মানুষের NID। রিসেপশনিস্ট (ARP) একবার ডেকে জিজ্ঞেস করে '৩বি-তে কে?', তারপর খাতায় (cache) লিখে রাখে।",
    ],
    flow: ["Need to send to 192.168.1.1", "Check ARP cache", "Miss: broadcast who-has", "Device replies with MAC", "Send frame to MAC"],
    code: cs`using System.Net.NetworkInformation; ~~ NetworkInterface lives here / NetworkInterface এখানে
foreach (var nic in NetworkInterface.GetAllNetworkInterfaces()) ~~ Every adapter: Wi-Fi, Ethernet, loopback / সব adapter
    Console.WriteLine($"{nic.Name,-10} MAC={nic.GetPhysicalAddress()} {nic.OperationalStatus}"); ~~ Print name, MAC and up/down / নাম, MAC ও অবস্থা
var arpCache = new Dictionary<string, string> { ["192.168.1.1"] = "AA-BB-CC-00-11-22" }; ~~ A pretend ARP cache: IP to MAC / নকল ARP cache: IP থেকে MAC
foreach (var target in new[] { "192.168.1.1", "192.168.1.50" }) ~~ One known, one unknown IP / একটি জানা, একটি অজানা
    Console.WriteLine(arpCache.TryGetValue(target, out var mac) ~~ Look in the cache first / আগে cache দেখুন
        ? $"ARP hit: {target} is at {mac}" ~~ Known: send directly / জানা: সরাসরি পাঠান
        : $"ARP miss: broadcast 'who has {target}?'"); ~~ Unknown: ask everyone on the LAN / অজানা: LAN-এ সবাইকে জিজ্ঞেস`,
    output: `lo         MAC= Up
eth0       MAC=00155D012A3B Up
ARP hit: 192.168.1.1 is at AA-BB-CC-00-11-22
ARP miss: broadcast 'who has 192.168.1.50?'
(adapter names and MACs differ on your machine)`,
    bash: `ip neigh            # Linux: show the ARP cache (IP -> MAC)
arp -a              # Windows/macOS: same idea
ip link             # list adapters with their MAC (link/ether ...)`,
    caution:
      "MAC addresses never leave the local network — routers replace them at each hop. Do not use MAC addresses as a security or licensing identity; they can be changed in software.",
    exercise: "After an ARP miss, add the reply to arpCache and run the lookup again to show a hit.",
  },
  {
    topic: "DNS",
    en: "DNS (Domain Name System) turns names like api.myshop.com into IP addresses. Your computer asks a resolver; the resolver may ask root, .com and the domain's own name servers, then caches the answer for its TTL (time to live). Every HttpClient call and every SQL Server connection string with a server name starts with a DNS lookup. In .NET, Dns.GetHostAddressesAsync does the lookup.",
    bn: "DNS নাম (api.myshop.com) থেকে IP address বের করে। আপনার কম্পিউটার resolver-কে জিজ্ঞেস করে, resolver দরকার হলে অন্য server-কে জিজ্ঞেস করে এবং TTL সময় পর্যন্ত উত্তর মনে রাখে। HttpClient বা SQL Server connection string-এ server-এর নাম দিলে প্রথমে DNS lookup হয়।",
    analogy: [
      "DNS is the phone's contact list: you tap 'Mum', the phone finds the number. If the contact is missing, you ask a friend who knows (the resolver) and save it for later (cache).",
      "DNS ফোনের contact list-এর মতো: 'আম্মু' চাপলে নম্বর বের হয়। না থাকলে যে জানে তাকে জিজ্ঞেস করে (resolver) পরে ব্যবহারের জন্য save করুন (cache)।",
    ],
    flow: ["Name api.myshop.com", "Local cache", "Resolver", "Authoritative server", "IP address returned"],
    code: cs`using System.Net; ~~ Dns class lives here / Dns class এখানে
using System.Net.Sockets; ~~ SocketException for failed lookups / ব্যর্থ lookup-এর exception
foreach (var host in new[] { "localhost", "learn.microsoft.com", "no-such-host.invalid" }) ~~ Local, real and impossible names / তিন রকম নাম
{
    try ~~ DNS can fail, so be ready / DNS ব্যর্থ হতে পারে
    {
        IPAddress[] ips = await Dns.GetHostAddressesAsync(host); ~~ Ask the OS resolver / OS resolver-কে জিজ্ঞেস করুন
        Console.WriteLine($"{host} -> {string.Join(", ", ips.Take(2))}"); ~~ Show up to two addresses / সর্বোচ্চ দুটি address দেখান
    }
    catch (SocketException ex) ~~ Name not found or no network / নাম নেই বা network নেই
    {
        Console.WriteLine($"{host} -> DNS failed: {ex.SocketErrorCode}"); ~~ Show the reason / কারণ দেখান
    }
}`,
    output: `localhost -> ::1, 127.0.0.1
learn.microsoft.com -> 13.107.246.40
no-such-host.invalid -> DNS failed: HostNotFound
(real IPs vary by location and time)`,
    sql: `-- The name in your connection string (Server=sql.prod.local) is resolved by DNS first.
-- Inside SQL Server you can see both sides of the conversation:
SELECT @@SERVERNAME  AS SqlServerName,   -- the instance name
       HOST_NAME()   AS ClientMachine;   -- the app server's computer name`,
    bash: `nslookup api.myshop.com     # ask DNS for the IP
dig +short api.myshop.com    # shorter answer (Linux)
cat /etc/hosts               # local overrides checked before DNS`,
    caution:
      "A long-lived static HttpClient can keep using an old IP after DNS changes; use IHttpClientFactory or set SocketsHttpHandler.PooledConnectionLifetime. 'Server not found or not accessible' from SQL Server is often a DNS or port problem, not a SQL problem.",
    exercise: "Add your company's API host to the list. Then add a fake entry in /etc/hosts (or C:\\Windows\\System32\\drivers\\etc\\hosts) and watch the result change.",
  },
  {
    topic: "DHCP",
    en: "DHCP gives a device an IP address automatically when it joins a network. It follows four steps called DORA: Discover (client: 'is there a DHCP server?'), Offer (server: 'you can use 192.168.1.100'), Request (client: 'yes, I want it'), Ack (server: 'confirmed for 24 hours'). The address is a lease that expires and is renewed. Laptops use DHCP; servers like SQL Server need a fixed IP or a DHCP reservation.",
    bn: "DHCP নতুন device-কে স্বয়ংক্রিয়ভাবে IP address দেয়। চার ধাপ — DORA: Discover (DHCP server আছে?), Offer (এই IP নাও), Request (হ্যাঁ, এটা চাই), Ack (২৪ ঘণ্টার জন্য নিশ্চিত)। এটা একটি lease, মেয়াদ শেষে নবায়ন হয়। SQL Server-এর মতো server-এর জন্য স্থায়ী IP বা reservation দরকার।",
    analogy: [
      "Like a hotel reception: you arrive (Discover), they offer room 101 (Offer), you accept (Request), they hand over the key for 2 nights (Ack). Come back next week and you may get a different room unless you reserved one.",
      "হোটেলের রিসেপশনের মতো: আপনি এলেন (Discover), ১০১ নম্বর রুম দিল (Offer), আপনি নিলেন (Request), দুই রাতের চাবি দিল (Ack)। পরে এলে অন্য রুম পেতে পারেন, যদি না আগে reserve করেন।",
    ],
    flow: ["Discover", "Offer", "Request", "Ack", "Lease renew"],
    code: cs`var pool = new Queue<string>(new[] { "192.168.1.100", "192.168.1.101" }); ~~ Free addresses the server can give / server-এর হাতে থাকা খালি address
var leases = new Dictionary<string, string>(); ~~ MAC to leased IP / MAC থেকে lease করা IP
string Lease(string mac) ~~ One DORA conversation / একটি DORA কথোপকথন
{
    if (leases.TryGetValue(mac, out var existing)) return existing; ~~ Same device gets the same IP back / একই device আগের IP পায়
    Console.WriteLine($"DISCOVER from {mac}"); ~~ Client broadcasts / client সবাইকে জিজ্ঞেস করে
    string offer = pool.Dequeue(); ~~ Server picks a free address / server খালি address বাছে
    Console.WriteLine($"OFFER {offer} -> REQUEST -> ACK"); ~~ The other three steps / বাকি তিন ধাপ
    leases[mac] = offer; ~~ Remember the lease / lease মনে রাখুন
    return offer; ~~ Client now owns this IP for the lease time / lease সময় পর্যন্ত IP client-এর
}
Console.WriteLine($"Laptop got {Lease("AA-01")}"); ~~ First device / প্রথম device
Console.WriteLine($"Phone got {Lease("BB-02")}"); ~~ Second device / দ্বিতীয় device
Console.WriteLine($"Laptop again {Lease("AA-01")}"); ~~ Renewal: no new DORA needed / নবায়ন: নতুন DORA লাগে না`,
    output: `DISCOVER from AA-01
OFFER 192.168.1.100 -> REQUEST -> ACK
Laptop got 192.168.1.100
DISCOVER from BB-02
OFFER 192.168.1.101 -> REQUEST -> ACK
Phone got 192.168.1.101
Laptop again 192.168.1.100`,
    bash: `ip addr show          # Linux: see the IP you received (dynamic = DHCP)
ipconfig /all         # Windows: shows 'DHCP Enabled' and lease times
ipconfig /renew       # Windows: ask DHCP for a new lease`,
    caution:
      "If the pool runs out, Dequeue throws — real DHCP servers stop handing out addresses. Never let a database server's IP change silently: connection strings and firewall rules would break.",
    exercise: "Make the pool empty after two devices and handle a third device gracefully with a clear message.",
  },
  {
    topic: "TCP vs UDP",
    en: "TCP and UDP are both transport protocols that use port numbers. TCP opens a connection first (handshake), delivers bytes in order, and resends lost data — HTTP, HTTPS and SQL Server (port 1433) use TCP. UDP just sends independent messages (datagrams) with no connection and no guarantee — it is faster and is used by DNS, video calls, games and the SQL Server Browser service (port 1434). In .NET, TcpClient and UdpClient give you each one.",
    bn: "TCP ও UDP দুটোই port ব্যবহার করে। TCP আগে connection খোলে, ক্রমমতো data দেয়, হারালে আবার পাঠায় — HTTP ও SQL Server (1433) TCP-তে চলে। UDP connection ছাড়া আলাদা আলাদা বার্তা পাঠায়, নিশ্চয়তা নেই কিন্তু দ্রুত — DNS, video call, SQL Browser (1434) UDP-তে।",
    analogy: [
      "TCP is a phone call: you dial, the other side answers, you talk in order and ask 'sorry, say again?' if you miss something. UDP is shouting announcements in a stadium: fast, to anyone listening, no confirmation.",
      "TCP হলো ফোন কল: ডায়াল, ধরা, ক্রমমতো কথা, না শুনলে 'আবার বলুন'। UDP হলো স্টেডিয়ামে মাইকে ঘোষণা: দ্রুত, যে শুনছে সে শুনবে, নিশ্চয়তা নেই।",
    ],
    flow: ["Choose protocol", "TCP: handshake then ordered stream", "UDP: send datagram", "TCP resends lost data", "UDP may lose data"],
    code: cs`using System.Net; ~~ IPAddress and IPEndPoint / ঠিকানা ও endpoint-এর class
using System.Net.Sockets; ~~ UdpClient / UDP পাঠানো ও নেওয়ার class
using System.Text; ~~ Encoding to turn text into bytes / লেখা থেকে byte
using var receiver = new UdpClient(new IPEndPoint(IPAddress.Loopback, 0)); ~~ Port 0 means 'OS, pick a free port' / port 0 মানে OS খালি port বাছবে
var target = (IPEndPoint)receiver.Client.LocalEndPoint!; ~~ Find out which port we got / কোন port পেলাম দেখুন
using var sender = new UdpClient(); ~~ No connection needed for UDP / UDP-তে connection লাগে না
byte[] data = Encoding.UTF8.GetBytes("price:120"); ~~ The message as bytes / বার্তাটি byte-এ
await sender.SendAsync(data, data.Length, target); ~~ Fire and forget one datagram / একটি datagram পাঠিয়ে দিন
UdpReceiveResult msg = await receiver.ReceiveAsync(); ~~ Receive it (no delivery guarantee on real networks) / গ্রহণ করুন, আসল network-এ নিশ্চয়তা নেই
Console.WriteLine($"UDP got '{Encoding.UTF8.GetString(msg.Buffer)}' with no handshake"); ~~ Show what arrived / যা এল তা দেখান
Console.WriteLine("TCP: handshake + ordered + resends -> HTTP, SQL Server 1433"); ~~ When to choose TCP / কখন TCP
Console.WriteLine("UDP: fast, may lose messages -> DNS, video, SQL Browser 1434"); ~~ When to choose UDP / কখন UDP`,
    output: `UDP got 'price:120' with no handshake
TCP: handshake + ordered + resends -> HTTP, SQL Server 1433
UDP: fast, may lose messages -> DNS, video, SQL Browser 1434`,
    sql: `-- Which transport is my SQL connection using?
SELECT session_id,
       net_transport,   -- TCP, Shared memory (same machine) or Named pipe
       protocol_type,   -- TSQL
       encrypt_option   -- TRUE when TLS is on
FROM sys.dm_exec_connections
WHERE session_id = @@SPID;`,
    caution:
      "Named SQL Server instances (Server=host\\SQLEXPRESS) need UDP 1434 to find their dynamic TCP port; if a firewall blocks UDP 1434, use a fixed port in the connection string (Server=host,1433).",
    exercise: "Send three UDP messages and receive them. On localhost they arrive; explain why on the internet one might not.",
  },
  {
    topic: "3-Way Handshake",
    en: "Before TCP can send data, the two sides perform a 3-way handshake: the client sends SYN with its starting sequence number, the server replies SYN-ACK (its own number plus 'I got yours'), and the client sends ACK. Only then is the connection ESTABLISHED. Each handshake costs one network round trip, so .NET reuses connections: SqlClient has connection pooling and HttpClient keeps connections alive.",
    bn: "TCP data পাঠানোর আগে ৩ ধাপের handshake হয়: client SYN পাঠায়, server SYN-ACK দেয়, client ACK দেয়। তারপর connection ESTABLISHED। প্রতিটি handshake-এ একবার আসা-যাওয়ার সময় লাগে, তাই .NET connection পুনরায় ব্যবহার করে — SqlClient-এ connection pooling, HttpClient-এ keep-alive।",
    analogy: [
      "Starting a phone call: 'Hello, can you hear me?' (SYN) — 'Yes, I can hear you, can you hear me?' (SYN-ACK) — 'Yes!' (ACK). Now you can talk.",
      "ফোনে কথা শুরু: 'হ্যালো, শুনতে পাচ্ছেন?' (SYN) — 'হ্যাঁ, আপনি শুনছেন?' (SYN-ACK) — 'হ্যাঁ!' (ACK)। এবার কথা শুরু।",
    ],
    flow: ["Client SYN seq=100", "Server SYN-ACK seq=300 ack=101", "Client ACK ack=301", "ESTABLISHED", "Data flows"],
    code: cs`using System.Diagnostics; ~~ Stopwatch to measure time / সময় মাপার জন্য
using System.Net; ~~ IPAddress / IP ঠিকানার class
using System.Net.Sockets; ~~ TcpListener and TcpClient / TcpListener ও TcpClient
int clientSeq = 100, serverSeq = 300; ~~ Starting sequence numbers (random in real life) / শুরুর sequence নম্বর
Console.WriteLine($"1. Client -> SYN seq={clientSeq}"); ~~ Step 1: client wants to connect / ধাপ ১: client connect করতে চায়
Console.WriteLine($"2. Server -> SYN-ACK seq={serverSeq} ack={clientSeq + 1}"); ~~ Step 2: server agrees and confirms / ধাপ ২: server রাজি ও নিশ্চিত
Console.WriteLine($"3. Client -> ACK ack={serverSeq + 1} (ESTABLISHED)"); ~~ Step 3: client confirms / ধাপ ৩: client নিশ্চিত করে
var listener = new TcpListener(IPAddress.Loopback, 0); ~~ A real tiny server on a free port / খালি port-এ ছোট আসল server
listener.Start(); ~~ Start listening / শোনা শুরু
int port = ((IPEndPoint)listener.LocalEndpoint).Port; ~~ Which port did we get / কোন port পেলাম
var sw = Stopwatch.StartNew(); ~~ Start the timer / timer চালু
using var client = new TcpClient(); ~~ A TCP client / একটি TCP client
await client.ConnectAsync(IPAddress.Loopback, port); ~~ The OS does the real SYN, SYN-ACK, ACK here / OS এখানে আসল handshake করে
Console.WriteLine($"Real handshake on localhost: {sw.Elapsed.TotalMilliseconds:F2} ms"); ~~ Tiny locally, 20-200 ms across the internet / local-এ খুব কম, internet-এ বেশি
listener.Stop(); ~~ Clean up / পরিষ্কার করুন`,
    output: `1. Client -> SYN seq=100
2. Server -> SYN-ACK seq=300 ack=101
3. Client -> ACK ack=301 (ESTABLISHED)
Real handshake on localhost: 0.41 ms`,
    sql: `-- Connection pooling means most SqlConnection.Open() calls skip the handshake and login.
-- See how many pooled connections your app keeps open:
SELECT program_name, COUNT(*) AS OpenConnections
FROM sys.dm_exec_sessions
WHERE is_user_process = 1
GROUP BY program_name;`,
    caution:
      "Creating new HttpClient() per request or disabling pooling (Pooling=false) repeats the handshake (and TLS handshake) every time and can exhaust ports. Use IHttpClientFactory and keep default SqlClient pooling.",
    exercise: "Connect 20 times in a loop with a new TcpClient each time and measure the total; compare with sending 20 messages on one connection.",
  },
  {
    topic: "Ports & Sockets",
    en: "An IP address finds the computer; a port number (0-65535) finds the program on it. HTTPS uses 443, HTTP 80, SQL Server 1433, SSH 22. A socket is one end of a connection: IP + port + protocol. A TCP connection is identified by four values: client IP, client port, server IP, server port — that is how one server port can serve thousands of clients. In .NET, TcpListener opens a listening socket and TcpClient connects to it.",
    bn: "IP দিয়ে কম্পিউটার, port (0-65535) দিয়ে সেই কম্পিউটারের program খুঁজে পাওয়া যায়। HTTPS 443, SQL Server 1433, SSH 22। Socket হলো connection-এর এক প্রান্ত: IP + port + protocol। Client IP, client port, server IP, server port — এই চারটি দিয়ে একটি TCP connection আলাদা হয়।",
    analogy: [
      "The IP address is an office building; the port is the counter number inside. Counter 443 handles web visitors, counter 1433 handles database visitors. A socket is one customer standing at one counter.",
      "IP হলো অফিস বিল্ডিং, port হলো ভেতরের কাউন্টার নম্বর। ৪৪৩ নম্বর কাউন্টার web, ১৪৩৩ database সামলায়। Socket হলো একটি কাউন্টারে দাঁড়ানো একজন গ্রাহক।",
    ],
    flow: ["Server listens on port", "Client connects from random port", "Socket pair formed", "Send bytes", "Reply bytes"],
    code: cs`using System.Net; ~~ IPAddress and IPEndPoint / ঠিকানা ও endpoint-এর class
using System.Net.Sockets; ~~ TcpListener and TcpClient / TcpListener ও TcpClient
using System.Text; ~~ Encoding / লেখা থেকে byte বানানোর class
var listener = new TcpListener(IPAddress.Loopback, 0); ~~ Listening socket on a free port / খালি port-এ listening socket
listener.Start(); ~~ Begin accepting / গ্রহণ শুরু
int port = ((IPEndPoint)listener.LocalEndpoint).Port; ~~ Port the OS gave us / OS যে port দিল
var server = Task.Run(async () => ~~ The server runs in the background / server পেছনে চলে
{
    using TcpClient conn = await listener.AcceptTcpClientAsync(); ~~ Wait for one client / একজন client-এর অপেক্ষা
    NetworkStream s = conn.GetStream(); ~~ Byte stream for this connection / এই connection-এর byte stream
    var buffer = new byte[256]; ~~ Space to read into / পড়ার জায়গা
    int n = await s.ReadAsync(buffer); ~~ Read what the client sent / client যা পাঠাল পড়ুন
    await s.WriteAsync(Encoding.UTF8.GetBytes("ECHO " + Encoding.UTF8.GetString(buffer, 0, n))); ~~ Send it back / ফেরত পাঠান
});
using var client = new TcpClient(); ~~ Client socket / client-এর socket
await client.ConnectAsync(IPAddress.Loopback, port); ~~ Connect to IP + port / IP + port-এ যুক্ত হন
NetworkStream stream = client.GetStream(); ~~ Client side of the stream / stream-এর client দিক
await stream.WriteAsync(Encoding.UTF8.GetBytes("hello")); ~~ Send bytes / byte পাঠান
var reply = new byte[256]; ~~ Space for the answer / উত্তরের জায়গা
int read = await stream.ReadAsync(reply); ~~ Read the answer / উত্তর পড়ুন
Console.WriteLine($"Server replied: {Encoding.UTF8.GetString(reply, 0, read)}"); ~~ Show it / দেখান
Console.WriteLine($"Socket pair: {client.Client.LocalEndPoint} -> {client.Client.RemoteEndPoint}"); ~~ Client IP:port to server IP:port / client ও server-এর IP:port
await server; ~~ Wait for the server task / server task শেষ হোক
listener.Stop(); ~~ Close the listening socket / listening socket বন্ধ`,
    output: `Server replied: ECHO hello
Socket pair: 127.0.0.1:53412 -> 127.0.0.1:53411
(port numbers change every run)`,
    sql: `-- See the socket pair of your own SQL Server connection
SELECT client_net_address, client_tcp_port,   -- app side (random port)
       local_net_address,  local_tcp_port     -- server side (1433)
FROM sys.dm_exec_connections
WHERE session_id = @@SPID;`,
    bash: `ss -tlnp | grep 1433          # is SQL Server listening on 1433?
sudo lsof -i :5000            # which process uses port 5000?`,
    caution:
      "'Address already in use' means another process holds the port — pick another or stop it. Ports below 1024 need admin rights on Linux; run Kestrel on 5000/8080 behind Nginx instead of running as root.",
    exercise: "Make the server handle two clients one after another in a loop, each getting its own echo.",
  },
  {
    topic: "NAT",
    en: "NAT (Network Address Translation) lets many devices with private IPs share one public IP. When your laptop (192.168.1.10:51000) calls the internet, the router rewrites the source to its public IP and a new port (203.0.113.5:40000) and remembers the mapping. When the reply comes back to that port, the router forwards it to your laptop. That is why servers see the router's IP, and why a cloud SQL Server firewall must allow the public NAT IP, not your laptop's private IP.",
    bn: "NAT অনেক private IP-র device-কে একটি public IP ভাগ করে ব্যবহার করতে দেয়। Router বাইরে যাওয়ার সময় ঠিকানা বদলে নিজের public IP ও নতুন port বসায় এবং একটি table-এ মনে রাখে। উত্তর ফিরলে সঠিক device-এ পাঠায়। তাই cloud SQL firewall-এ আপনার public IP allow করতে হয়, laptop-এর private IP নয়।",
    analogy: [
      "An office has one main phone number. Staff call out through the switchboard; the operator notes 'line 40 is Rahim'. When the answer comes back on line 40, the operator connects it to Rahim's desk.",
      "অফিসের একটি মূল ফোন নম্বর। কর্মীরা switchboard দিয়ে বাইরে ফোন করেন, অপারেটর লিখে রাখেন '৪০ নম্বর লাইন রহিম'। উত্তর ৪০-এ এলে রহিমের টেবিলে দেন।",
    ],
    flow: ["Private 192.168.1.10:51000", "Router rewrites source", "Public 203.0.113.5:40000", "Reply hits port 40000", "Forward to laptop"],
    code: cs`var natTable = new Dictionary<int, string>(); ~~ Public port to private socket / public port থেকে private socket
int nextPort = 40000; ~~ Router hands out public ports from here / router এখান থেকে port দেয়
string Outbound(string privateSocket) ~~ A device sends to the internet / একটি device বাইরে পাঠায়
{
    int publicPort = nextPort++; ~~ Pick a new public port / নতুন public port
    natTable[publicPort] = privateSocket; ~~ Remember who used it / কে নিল মনে রাখুন
    return $"203.0.113.5:{publicPort}"; ~~ What the internet sees / বাইরে যা দেখা যায়
}
Console.WriteLine($"Laptop 192.168.1.10:51000 appears as {Outbound("192.168.1.10:51000")}"); ~~ First device / প্রথম device
Console.WriteLine($"Phone  192.168.1.11:51000 appears as {Outbound("192.168.1.11:51000")}"); ~~ Same private port, different public port / একই private port, আলাদা public port
int replyPort = 40001; ~~ A reply arrives on this public port / এই public port-এ উত্তর এল
Console.WriteLine($"Reply to :{replyPort} goes to {natTable[replyPort]}"); ~~ Router looks up the table / router table দেখে`,
    output: `Laptop 192.168.1.10:51000 appears as 203.0.113.5:40000
Phone  192.168.1.11:51000 appears as 203.0.113.5:40001
Reply to :40001 goes to 192.168.1.11:51000`,
    caution:
      "Behind NAT or a load balancer, ASP.NET Core's RemoteIpAddress is the proxy's IP. Use app.UseForwardedHeaders() with known proxies to read X-Forwarded-For safely. Inbound connections to a NAT-ed machine need explicit port forwarding.",
    exercise: "Add a reply to an unknown port (40050) and make the router drop it with a message instead of crashing.",
  },
  {
    topic: "Routing",
    en: "Routing decides where to send a packet next. Every router (and your own computer) has a routing table: a list of networks in CIDR form and the next hop for each. When several routes match, the most specific one wins — the longest prefix match. The route 0.0.0.0/0 is the default gateway: 'anything else goes to the internet'. In the cloud, route tables decide whether your app subnet can reach the database subnet.",
    bn: "Routing ঠিক করে packet পরের কোথায় যাবে। প্রতিটি router-এর routing table-এ CIDR network ও পরের hop থাকে। একাধিক route মিললে সবচেয়ে নির্দিষ্টটি (longest prefix) জেতে। 0.0.0.0/0 হলো default gateway — 'বাকি সব internet-এ'। Cloud-এ route table ঠিক করে app subnet database subnet-এ যেতে পারবে কি না।",
    analogy: [
      "A post office sorting letters: 'Mirpur Road 10' goes to the Mirpur 10 van (very specific), 'Dhaka' goes to the Dhaka truck, and anything else goes to the airport (default route).",
      "পোস্ট অফিসে চিঠি বাছাই: 'মিরপুর ১০ রোড' মিরপুর ১০-এর ভ্যানে (সবচেয়ে নির্দিষ্ট), 'ঢাকা' ঢাকার ট্রাকে, বাকি সব এয়ারপোর্টে (default route)।",
    ],
    flow: ["Packet to 10.0.5.20", "Find all matching routes", "Pick longest prefix", "Send to next hop", "Repeat at next router"],
    code: cs`using System.Net; ~~ IPNetwork and IPAddress (.NET 8+) / IPNetwork ও IPAddress
var routes = new (IPNetwork Net, string NextHop)[] ~~ A small routing table / ছোট routing table
{
    (IPNetwork.Parse("0.0.0.0/0"), "ISP gateway"), ~~ Default route: everything / default route: সব কিছু
    (IPNetwork.Parse("10.0.0.0/8"), "Office VPN"), ~~ Whole company network / পুরো কোম্পানির network
    (IPNetwork.Parse("10.0.5.0/24"), "Database subnet router"), ~~ Very specific: DB subnet / নির্দিষ্ট: DB subnet
};
foreach (var dest in new[] { "10.0.5.20", "10.9.9.9", "8.8.8.8" }) ~~ Three destinations / তিনটি গন্তব্য
{
    var ip = IPAddress.Parse(dest); ~~ Destination address / গন্তব্যের address
    var best = routes.Where(r => r.Net.Contains(ip)).MaxBy(r => r.Net.PrefixLength); ~~ Longest prefix match wins / সবচেয়ে লম্বা prefix জেতে
    Console.WriteLine($"{dest,-10} -> {best.NextHop} (matched /{best.Net.PrefixLength})"); ~~ Show the decision / সিদ্ধান্ত দেখান
}`,
    output: `10.0.5.20  -> Database subnet router (matched /24)
10.9.9.9   -> Office VPN (matched /8)
8.8.8.8    -> ISP gateway (matched /0)`,
    bash: `ip route                    # Linux routing table ('default via ...' is the gateway)
route print                 # Windows routing table
traceroute api.myshop.com   # see each router hop (tracert on Windows)`,
    caution:
      "If the app server can ping the gateway but not the SQL Server subnet, check route tables and network security rules before blaming SQL Server. Asymmetric routes (reply takes a different path) can be dropped by firewalls.",
    exercise: "Add a route 10.0.5.128/25 to 'Reporting replica' and predict where 10.0.5.200 and 10.0.5.20 go.",
  },
  {
    topic: "Switches vs Routers",
    en: "A switch connects devices inside one local network and forwards frames by MAC address; it learns which MAC is on which port by watching traffic. A router connects different networks and forwards packets by IP address using a routing table. Your home Wi-Fi box is usually both. In a data center, servers in one rack talk through a switch; traffic from the app subnet to the database subnet passes through a router.",
    bn: "Switch একই local network-এর device যুক্ত করে এবং MAC দেখে frame পাঠায়; traffic দেখে শেখে কোন MAC কোন port-এ। Router আলাদা network যুক্ত করে এবং IP দেখে routing table দিয়ে packet পাঠায়। বাসার Wi-Fi box সাধারণত দুটোই।",
    analogy: [
      "A switch is the guard inside one apartment building who knows which flat each resident lives in. A router is the city traffic police who sends cars to different neighbourhoods.",
      "Switch হলো একটি বিল্ডিংয়ের দারোয়ান, জানে কে কোন ফ্ল্যাটে থাকে। Router হলো শহরের ট্রাফিক পুলিশ, গাড়িকে বিভিন্ন এলাকায় পাঠায়।",
    ],
    flow: ["Frame arrives on port", "Switch learns source MAC", "Known destination: one port", "Unknown: flood", "Different network: router by IP"],
    code: cs`var macTable = new Dictionary<string, int>(); ~~ Switch memory: MAC to port / switch-এর স্মৃতি: MAC থেকে port
void SwitchFrame(string srcMac, int inPort, string dstMac) ~~ A frame arrives at the switch / switch-এ frame এল
{
    macTable[srcMac] = inPort; ~~ Learn where the sender lives / প্রেরক কোথায় আছে শিখুন
    Console.WriteLine(macTable.TryGetValue(dstMac, out int port) ~~ Do we know the receiver / প্রাপক জানা কি
        ? $"Switch: {srcMac}->{dstMac} out port {port}" ~~ Yes: send to exactly one port / হ্যাঁ: একটি port-এ
        : $"Switch: {dstMac} unknown, flood all ports"); ~~ No: send everywhere once / না: সব port-এ
}
SwitchFrame("PC-A", 1, "PC-B"); ~~ Switch does not know PC-B yet / এখনও PC-B অজানা
SwitchFrame("PC-B", 2, "PC-A"); ~~ PC-B replies: now both are learned / উত্তর এল: দুজনই জানা
SwitchFrame("PC-A", 1, "PC-B"); ~~ Now delivered to one port only / এবার শুধু এক port-এ
Console.WriteLine("Router: 10.0.1.5 -> 10.0.2.9 is another network, forward by IP"); ~~ Different subnet needs a router / আলাদা subnet-এ router লাগে`,
    output: `Switch: PC-B unknown, flood all ports
Switch: PC-B->PC-A out port 1
Switch: PC-A->PC-B out port 2
Router: 10.0.1.5 -> 10.0.2.9 is another network, forward by IP`,
    caution:
      "Switches work at layer 2 (MAC), routers at layer 3 (IP). Many modern 'layer 3 switches' do both. In the cloud you never see switches; you configure subnets and route tables instead.",
    exercise: "Add PC-C on port 3 and send a frame from PC-C to PC-A. Which line is printed and why?",
  },
  {
    topic: "Firewalls",
    en: "A firewall checks every connection against rules: source IP, destination port and protocol, then allows or denies. Rules are checked in order and anything not allowed is denied by default. A typical setup: allow 443 from anywhere to the web server, allow 1433 only from the app subnet to SQL Server, deny everything else. Windows Firewall, Linux ufw/iptables, Azure NSGs and AWS security groups all follow this idea.",
    bn: "Firewall প্রতিটি connection নিয়মের সাথে মেলায়: কোথা থেকে (IP), কোন port, কোন protocol — তারপর allow বা deny। নিয়ম ক্রমমতো দেখা হয়, মিল না হলে default deny। সাধারণ নিয়ম: web server-এ 443 সবার জন্য, SQL Server-এ 1433 শুধু app subnet থেকে, বাকি সব বন্ধ।",
    analogy: [
      "A building security guard with a list: 'visitors may enter the shop on floor 1; only staff with ID may enter the server room; everyone else, sorry'.",
      "বিল্ডিংয়ের গার্ডের হাতে তালিকা: 'দর্শনার্থী ১ তলার দোকানে যেতে পারবে, শুধু ID-ধারী কর্মী server room-এ, বাকিরা না'।",
    ],
    flow: ["Connection arrives", "Check rule 1", "Check rule 2", "First match decides", "No match: default deny"],
    code: cs`using System.Net; ~~ IPNetwork and IPAddress / network ও ঠিকানার class
var rules = new (string Name, IPNetwork Source, int Port)[] ~~ Allow rules in order / ক্রমমতো allow নিয়ম
{
    ("HTTPS from anywhere", IPNetwork.Parse("0.0.0.0/0"), 443), ~~ Public website / সবার জন্য খোলা website
    ("SQL only from app subnet", IPNetwork.Parse("10.0.1.0/24"), 1433), ~~ Database protected / database সুরক্ষিত
};
string Check(string src, int port) ~~ Decide for one connection / একটি connection-এর সিদ্ধান্ত
{
    var ip = IPAddress.Parse(src); ~~ Source address / উৎস address
    foreach (var r in rules) ~~ Check rules top to bottom / উপর থেকে নিচে
        if (r.Port == port && r.Source.Contains(ip)) return $"ALLOW ({r.Name})"; ~~ First match wins / প্রথম মিলটাই
    return "DENY (default rule)"; ~~ Nothing matched / কিছুই মেলেনি
}
Console.WriteLine($"8.8.8.8   -> 443  : {Check("8.8.8.8", 443)}"); ~~ Internet user to website / internet থেকে website
Console.WriteLine($"10.0.1.20 -> 1433 : {Check("10.0.1.20", 1433)}"); ~~ App server to SQL / app server থেকে SQL
Console.WriteLine($"8.8.8.8   -> 1433 : {Check("8.8.8.8", 1433)}"); ~~ Internet to SQL is blocked / internet থেকে SQL বন্ধ`,
    output: `8.8.8.8   -> 443  : ALLOW (HTTPS from anywhere)
10.0.1.20 -> 1433 : ALLOW (SQL only from app subnet)
8.8.8.8   -> 1433 : DENY (default rule)`,
    bash: `# Linux (ufw): open the web port, allow SQL Server only from the app subnet
sudo ufw default deny incoming
sudo ufw allow 443/tcp
sudo ufw allow from 10.0.1.0/24 to any port 1433 proto tcp
sudo ufw status numbered`,
    caution:
      "Never expose SQL Server port 1433 to the whole internet — it is constantly scanned and brute-forced. A connection timeout (not 'login failed') often means a firewall silently dropped the packets.",
    exercise: "Add a rule allowing SSH (22) only from your office IP 203.0.113.9/32 and test it.",
  },
  {
    topic: "Proxies & VPN",
    en: "A forward proxy sits in front of clients: your app sends requests to the proxy and the proxy talks to the internet (used for company filtering, caching, or hiding the client). A reverse proxy sits in front of servers: the internet talks to Nginx, IIS or YARP, which forwards to your ASP.NET Core apps (used for TLS, load balancing and hiding servers). A VPN creates an encrypted tunnel so your laptop behaves as if it were inside the office network — for example to reach a private SQL Server.",
    bn: "Forward proxy থাকে client-এর সামনে: আপনার app proxy-কে বলে, proxy internet-এ যায়। Reverse proxy থাকে server-এর সামনে: internet Nginx/YARP-কে বলে, সে আপনার ASP.NET Core app-এ পাঠায়। VPN একটি encrypted সুড়ঙ্গ বানায়, যাতে laptop অফিসের network-এর ভেতরে আছে মনে হয় — যেমন private SQL Server-এ যেতে।",
    analogy: [
      "Forward proxy: you send your assistant to buy things, the shop only sees the assistant. Reverse proxy: a hotel reception receives all guests and sends them to the right room. VPN: a private tunnel from your house straight into the office.",
      "Forward proxy: সহকারীকে দিয়ে কেনাকাটা, দোকান শুধু সহকারীকে দেখে। Reverse proxy: হোটেলের রিসেপশন সব অতিথি নিয়ে সঠিক রুমে পাঠায়। VPN: বাসা থেকে অফিস পর্যন্ত ব্যক্তিগত সুড়ঙ্গ।",
    ],
    flow: ["Client", "Forward proxy (acts for client)", "Internet", "Reverse proxy (acts for server)", "ASP.NET Core app"],
    code: cs`using System.Net; ~~ WebProxy lives here / WebProxy এখানে
var handler = new HttpClientHandler ~~ Configure how HttpClient connects / HttpClient কীভাবে যুক্ত হবে
{
    Proxy = new WebProxy("http://proxy.company.local:8080"), ~~ Forward proxy: works for the CLIENT / forward proxy client-এর হয়ে কাজ করে
    UseProxy = true, ~~ Send all requests through it / সব request এর মধ্য দিয়ে
};
using var http = new HttpClient(handler); ~~ Every call now goes via the proxy / এখন সব call proxy দিয়ে
Console.WriteLine("Forward proxy: my app -> proxy -> internet (controls or hides clients)"); ~~ Direction 1 / দিক ১
Console.WriteLine("Reverse proxy: internet -> Nginx or YARP -> my ASP.NET Core apps (protects servers)"); ~~ Direction 2 / দিক ২
Console.WriteLine("VPN: encrypted tunnel, my laptop acts as if inside the office network"); ~~ Tunnel / সুড়ঙ্গ`,
    output: `Forward proxy: my app -> proxy -> internet (controls or hides clients)
Reverse proxy: internet -> Nginx or YARP -> my ASP.NET Core apps (protects servers)
VPN: encrypted tunnel, my laptop acts as if inside the office network`,
    bash: `# Behind a reverse proxy, tell ASP.NET Core to trust X-Forwarded-* headers (Program.cs):
#   builder.Services.Configure<ForwardedHeadersOptions>(o =>
#       o.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto);
#   app.UseForwardedHeaders();
# Many tools read the forward proxy from environment variables:
export HTTPS_PROXY=http://proxy.company.local:8080
export NO_PROXY=localhost,10.0.0.0/8`,
    caution:
      "Only trust X-Forwarded-For from proxies you control (KnownProxies/KnownNetworks), otherwise attackers can fake their IP. A VPN is not a replacement for SQL Server authentication and least-privilege logins.",
    exercise: "Write down which one (forward proxy, reverse proxy or VPN) you need for: TLS termination for 3 API instances, reaching a private SQL Server from home, and company-wide web filtering.",
  },
  {
    topic: "Latency",
    en: "Latency is the time one message takes to travel and get an answer (round-trip time). Inside one data center it is under 1 ms; across countries it can be 100-300 ms. Latency adds up with every call: an endpoint that runs 50 separate SQL queries pays 50 round trips (the N+1 problem). The fix is fewer, bigger calls: batch queries, use JOINs or table-valued parameters, cache, and put the app close to the database.",
    bn: "Latency হলো একটি বার্তা গিয়ে উত্তর ফিরে আসতে যে সময় লাগে (round-trip)। এক data center-এ ১ ms-এর কম, দেশ পেরিয়ে ১০০-৩০০ ms। প্রতিটি call-এ latency যোগ হয়: ৫০টি আলাদা SQL query মানে ৫০ বার আসা-যাওয়া (N+1 সমস্যা)। সমাধান: কম কিন্তু বড় call, JOIN, batch, cache, এবং app ও database কাছাকাছি রাখা।",
    analogy: [
      "Buying 50 items by walking to the shop 50 times versus taking one bag and buying all 50 in one trip. The walk (latency) is the expensive part, not the items.",
      "৫০টি জিনিস কিনতে ৫০ বার দোকানে হাঁটা বনাম এক ব্যাগ নিয়ে একবারে সব কেনা। দামি অংশটা হলো হাঁটা (latency), জিনিস নয়।",
    ],
    flow: ["Request leaves app", "Travel to DB", "DB works", "Travel back", "Repeat per call"],
    code: cs`using System.Diagnostics; ~~ Stopwatch / সময় মাপার যন্ত্র
const int roundTripMs = 5; ~~ Pretend each database call crosses the network in 5 ms / ধরুন প্রতিটি call-এ ৫ ms
async Task<int> QueryOneAsync(int id) { await Task.Delay(roundTripMs); return id; } ~~ One row per call / প্রতি call-এ এক সারি
async Task<int[]> QueryManyAsync(int[] ids) { await Task.Delay(roundTripMs); return ids; } ~~ All rows in one call / এক call-এ সব সারি
int[] ids = Enumerable.Range(1, 50).ToArray(); ~~ 50 customers to load / ৫০ জন customer
var sw = Stopwatch.StartNew(); ~~ Start timing / সময় মাপা শুরু
foreach (int id in ids) await QueryOneAsync(id); ~~ N+1 style: 50 round trips / ৫০ বার আসা-যাওয়া
Console.WriteLine($"50 separate calls: ~{sw.ElapsedMilliseconds} ms"); ~~ Slow / ধীর
sw.Restart(); ~~ Reset the timer / timer আবার শুরু
await QueryManyAsync(ids); ~~ Batched: 1 round trip / একবার আসা-যাওয়া
Console.WriteLine($"1 batched call:    ~{sw.ElapsedMilliseconds} ms"); ~~ Fast / দ্রুত`,
    output: `50 separate calls: ~270 ms
1 batched call:    ~6 ms
(exact numbers depend on the OS timer)`,
    sql: `-- Slow (N+1): the app sends this 50 times, one round trip each
DECLARE @id int = 1;
SELECT CustomerId, Name FROM dbo.Customers WHERE CustomerId = @id;

-- Fast: one round trip for all 50 ids
DECLARE @ids varchar(max) = '1,2,3,4,5';
SELECT c.CustomerId, c.Name
FROM dbo.Customers AS c
JOIN STRING_SPLIT(@ids, ',') AS s ON c.CustomerId = CAST(s.value AS int);

-- Measure server time; compare with the time your C# Stopwatch shows (= network + server)
SET STATISTICS TIME ON;`,
    caution:
      "In EF Core, lazy loading inside a loop silently creates N+1 queries — use Include or a projection. Latency cannot be fixed with more bandwidth; only fewer round trips or shorter distance help.",
    exercise: "Change roundTripMs to 80 (a cross-country link) and compare the two timings again.",
  },
  {
    topic: "Bandwidth & Throughput",
    en: "Bandwidth is the maximum data rate of a link (for example 100 Mbps). Throughput is what you actually get after protocol overhead, congestion and slow endpoints — always lower. Time to transfer = size in bits divided by throughput. Large JSON responses and SELECT * on wide tables waste bandwidth; fix them with pagination, selecting only needed columns, and response compression in ASP.NET Core.",
    bn: "Bandwidth হলো একটি link-এর সর্বোচ্চ গতি (যেমন 100 Mbps)। Throughput হলো আসলে যা পাওয়া যায় — সবসময় কম। পাঠানোর সময় = আকার (bit) ÷ throughput। বড় JSON ও SELECT * bandwidth নষ্ট করে; pagination, দরকারি column বাছাই ও compression দিয়ে ঠিক করুন।",
    analogy: [
      "Bandwidth is how many lanes a highway has; throughput is how many cars actually pass per minute today, with traffic jams and toll booths. Latency is how long one car takes from start to end.",
      "Bandwidth হলো হাইওয়েতে কয়টি লেন; throughput হলো আজ জ্যাম ও টোলসহ প্রতি মিনিটে আসলে কয়টি গাড়ি পার হচ্ছে। Latency হলো একটি গাড়ির শুরু থেকে শেষ পর্যন্ত সময়।",
    ],
    flow: ["Payload size (MB)", "Convert to bits x8", "Divide by throughput", "Transfer time", "Compress or page to shrink"],
    code: cs`double bandwidthMbps = 100; ~~ Link capacity in megabits per second / link-এর সর্বোচ্চ গতি
double payloadMB = 25; ~~ For example a large JSON export / যেমন বড় JSON export
double seconds = payloadMB * 8 / bandwidthMbps; ~~ Bytes to bits: multiply by 8 / byte থেকে bit: ৮ দিয়ে গুণ
Console.WriteLine($"Best case: {seconds:F1} s to send {payloadMB} MB on {bandwidthMbps} Mbps"); ~~ Theoretical time / তাত্ত্বিক সময়
double throughputMbps = 60; ~~ Real measured rate is lower / আসল গতি কম
Console.WriteLine($"Real throughput {throughputMbps} Mbps -> {payloadMB * 8 / throughputMbps:F1} s"); ~~ Real time / আসল সময়
double compressedMB = payloadMB * 0.2; ~~ JSON often compresses to about 20 percent / JSON প্রায় ২০% হয়ে যায়
Console.WriteLine($"Gzip to {compressedMB} MB -> {compressedMB * 8 / throughputMbps:F1} s"); ~~ Much faster / অনেক দ্রুত`,
    output: `Best case: 2.0 s to send 25 MB on 100 Mbps
Real throughput 60 Mbps -> 3.3 s
Gzip to 5 MB -> 0.7 s`,
    sql: `-- Wasteful: every column (including big nvarchar(max)) for every row
SELECT * FROM dbo.Orders;

-- Lean: only the columns the screen needs, one page at a time
SELECT OrderId, CustomerId, Total, CreatedAt
FROM dbo.Orders
ORDER BY OrderId
OFFSET 0 ROWS FETCH NEXT 50 ROWS ONLY;`,
    caution:
      "Enable compression with builder.Services.AddResponseCompression() and app.UseResponseCompression(), but do not compress already-compressed files (images, zip). Mbps (bits) and MB/s (bytes) differ by 8x.",
    exercise: "A mobile user has 5 Mbps. How long does a 2 MB API response take? What if you return 50 rows instead of 1000?",
  },
];
