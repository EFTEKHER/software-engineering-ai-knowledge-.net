// Bangla versions of the caution (c), exercise (x) and custom setup (s) text for the gap lessons.
export const gapBangla = {
  "OSI Model": {
    c: "OSI একটি শেখার model; আসল TCP/IP-তে কয়েকটি layer মিশে যায়। SQL Server-এর 'A network-related or instance-specific error' সাধারণত layer ৩/৪-এর সমস্যা (DNS, IP, port, firewall), আর 'Login failed for user' হলো layer ৭ — network ঠিক আছে, কিন্তু login ব্যর্থ।",
    x: "আপনার API SQL Server-এ পৌঁছাতে পারছে না। Layer ১, ৩, ৪ ও ৭ কোন ক্রমে পরীক্ষা করবেন লিখুন, প্রতিটির জন্য একটি command বা C# check দিন।",
  },
  "TCP/IP Model": {
    c: "আসল header binary, লেখা নয়; এই string শুধু encapsulation-এর ছবি। HttpClient বা SqlConnection ব্যবহার করলে TCP, IP ও link header operating system নিজেই বানায়।",
    x: "উদাহরণে TCP ও HTTP-র মাঝে একটি TLS layer যোগ করুন। String-এর কোথায় বসবে?",
  },
  "IP Addressing": {
    c: "User-এর input-এ IPAddress.TryParse ব্যবহার করুন। Load balancer বা proxy-র পেছনে HttpContext.Connection.RemoteIpAddress proxy-র IP দেখায় — আসল client দেখতে ForwardedHeaders চালু করুন।",
    x: "IsPrivate বদলে 169.254.x.x (link-local)-এর জন্যও true ফেরত দিন। 169.254.10.10 দিয়ে পরীক্ষা করুন।",
  },
  "Subnetting & CIDR": {
    c: "Cloud provider প্রতিটি subnet-এ কিছু address রেখে দেয় (Azure ও AWS ৫টি)। দরকারের চেয়ে বড় subnet পরিকল্পনা করুন — পরে বদলানো কষ্টের। SQL Server-কে private subnet-এ রাখুন, যেখানে শুধু app subnet পৌঁছাতে পারে।",
    x: "10.0.0.0/22-এ কয়টি address? কোড বদলে যাচাই করুন, তারপর 10.0.3.200 পরীক্ষা করুন।",
  },
  "MAC Address & ARP": {
    c: "MAC address কখনো local network-এর বাইরে যায় না — প্রতিটি hop-এ router তা বদলে দেয়। MAC-কে নিরাপত্তা বা license-এর পরিচয় হিসেবে ব্যবহার করবেন না; software দিয়ে বদলানো যায়।",
    x: "ARP miss হলে উত্তরটি arpCache-এ যোগ করুন এবং আবার lookup করে hit দেখান।",
  },
  DNS: {
    c: "দীর্ঘদিন চলা static HttpClient DNS বদলানোর পরও পুরনো IP ব্যবহার করতে পারে; IHttpClientFactory ব্যবহার করুন বা SocketsHttpHandler.PooledConnectionLifetime সেট করুন। SQL Server-এর 'Server not found or not accessible' প্রায়ই DNS বা port-এর সমস্যা, SQL-এর নয়।",
    x: "তালিকায় আপনার কোম্পানির API host যোগ করুন। তারপর hosts ফাইলে একটি নকল entry দিয়ে ফল কীভাবে বদলায় দেখুন।",
  },
  DHCP: {
    c: "Pool খালি হলে Dequeue exception দেয় — আসল DHCP server তখন আর address দেয় না। Database server-এর IP যেন চুপচাপ না বদলায়: connection string ও firewall rule ভেঙে যাবে।",
    x: "দুটি device-এর পর pool খালি করুন এবং তৃতীয় device-কে স্পষ্ট বার্তা দিয়ে সুন্দরভাবে সামলান।",
  },
  "TCP vs UDP": {
    c: "Named SQL Server instance (Server=host\\SQLEXPRESS) নিজের dynamic TCP port খুঁজতে UDP 1434 ব্যবহার করে; firewall UDP 1434 বন্ধ রাখলে connection string-এ নির্দিষ্ট port দিন (Server=host,1433)।",
    x: "তিনটি UDP বার্তা পাঠান ও গ্রহণ করুন। Localhost-এ সব পৌঁছায়; internet-এ কেন একটি হারাতে পারে ব্যাখ্যা করুন।",
  },
  "3-Way Handshake": {
    c: "প্রতি request-এ new HttpClient() বা pooling বন্ধ (Pooling=false) করলে প্রতিবার handshake (ও TLS handshake) হয় এবং port শেষ হয়ে যেতে পারে। IHttpClientFactory ব্যবহার করুন, SqlClient-এর default pooling রাখুন।",
    x: "Loop-এ ২০ বার প্রতিবার নতুন TcpClient দিয়ে connect করে মোট সময় মাপুন; একটি connection-এ ২০টি বার্তা পাঠানোর সাথে তুলনা করুন।",
  },
  "Ports & Sockets": {
    c: "'Address already in use' মানে অন্য process port ধরে আছে — অন্য port নিন বা সেটি বন্ধ করুন। Linux-এ ১০২৪-এর নিচের port-এ admin অধিকার লাগে; root হিসেবে না চালিয়ে Kestrel 5000/8080-এ চালান, সামনে Nginx রাখুন।",
    x: "Server-কে loop-এ পরপর দুজন client সামলাতে দিন, প্রত্যেকে নিজের echo পাবে।",
  },
  NAT: {
    c: "NAT বা load balancer-এর পেছনে ASP.NET Core-এর RemoteIpAddress হলো proxy-র IP। জানা proxy-সহ app.UseForwardedHeaders() দিয়ে নিরাপদে X-Forwarded-For পড়ুন। NAT-এর পেছনের মেশিনে বাইরে থেকে connection আনতে port forwarding লাগে।",
    x: "অজানা port (40050)-এ একটি উত্তর পাঠান এবং router যেন crash না করে বার্তা দিয়ে সেটি ফেলে দেয়।",
  },
  Routing: {
    c: "App server gateway-তে ping পায় কিন্তু SQL Server subnet-এ না পেলে, SQL Server-কে দোষ দেওয়ার আগে route table ও network security rule দেখুন। উত্তর অন্য পথে ফিরলে (asymmetric route) firewall সেটি ফেলে দিতে পারে।",
    x: "10.0.5.128/25 → 'Reporting replica' route যোগ করুন এবং অনুমান করুন 10.0.5.200 ও 10.0.5.20 কোথায় যাবে।",
  },
  "Switches vs Routers": {
    c: "Switch কাজ করে layer ২-এ (MAC), router layer ৩-এ (IP)। আধুনিক অনেক 'layer 3 switch' দুটোই করে। Cloud-এ switch দেখা যায় না; সেখানে subnet ও route table ঠিক করেন।",
    x: "Port ৩-এ PC-C যোগ করে PC-C থেকে PC-A-তে frame পাঠান। কোন লাইন print হয় এবং কেন?",
  },
  Firewalls: {
    c: "SQL Server-এর port 1433 কখনো পুরো internet-এর জন্য খুলবেন না — সারাক্ষণ scan ও password আক্রমণ হয়। 'Login failed' নয়, connection timeout হলে প্রায়ই firewall চুপচাপ packet ফেলে দিয়েছে।",
    x: "শুধু অফিসের IP 203.0.113.9/32 থেকে SSH (22) allow করার নিয়ম যোগ করে পরীক্ষা করুন।",
  },
  "Proxies & VPN": {
    c: "শুধু নিজের নিয়ন্ত্রিত proxy (KnownProxies/KnownNetworks) থেকে আসা X-Forwarded-For বিশ্বাস করুন, নইলে আক্রমণকারী নকল IP দেখাতে পারে। VPN থাকলেও SQL Server authentication ও কম-ক্ষমতার login দরকার।",
    x: "কোনটি লাগবে লিখুন (forward proxy, reverse proxy না VPN): ৩টি API instance-এর জন্য TLS, বাসা থেকে private SQL Server, এবং পুরো কোম্পানির web filtering।",
  },
  Latency: {
    c: "EF Core-এ loop-এর ভেতরে lazy loading চুপচাপ N+1 query বানায় — Include বা projection ব্যবহার করুন। বেশি bandwidth দিয়ে latency কমে না; শুধু কম round trip বা কম দূরত্ব সাহায্য করে।",
    x: "roundTripMs ৮০ করুন (দূরের দেশের link) এবং দুটি সময় আবার তুলনা করুন।",
  },
  "Bandwidth & Throughput": {
    c: "builder.Services.AddResponseCompression() ও app.UseResponseCompression() দিয়ে compression চালু করুন, কিন্তু আগেই compress করা ফাইল (ছবি, zip) আবার করবেন না। Mbps (bit) আর MB/s (byte)-এর পার্থক্য ৮ গুণ।",
    x: "মোবাইল user-এর 5 Mbps। 2 MB API উত্তর পেতে কত সময় লাগবে? ১০০০ সারির বদলে ৫০ সারি দিলে কত?",
  },
  "Request, Response & Headers": {
    c: "Header গোপন নয় — সাধারণ HTTP-তে custom header-এ password দেবেন না। GET ও DELETE-এ body লাগার কথা নয়। সঠিক method নিন: GET পড়ে (নিরাপদ), PUT পুরো বদলায় (idempotent), POST তৈরি করে (idempotent নয়), PATCH অংশ বদলায়।",
    x: "Content-Type text/plain বা application/json না হলে 415 Unsupported Media Type ফেরত দিন।",
  },
  "Query & Path Parameters": {
    c: "page ও size যাচাই করে সীমায় রাখুন। পরিচয়ের জন্য path parameter, ঐচ্ছিক filter-এর জন্য query parameter। Query-র মান জুড়ে SQL বানালে SQL injection হয় — SqlParameter, Dapper parameter বা EF Core LINQ ব্যবহার করুন।",
    x: "একটি sort query parameter যোগ করুন যা শুধু 'name' বা 'city' নেয়, অন্য কিছুতে 400 দেয়।",
  },
  "API Keys": {
    c: "API key কখনো URL-এ (log-এ চলে যায়), frontend JavaScript-এ বা Git-এ রাখবেন না। শুধু API key দিয়ে user authentication হয় না — user-এর জন্য JWT/OAuth। প্রতিটি client-এর জন্য rate limiting যোগ করুন।",
    x: "দুই client-কে আলাদা key দিন এবং উত্তরে client-এর নাম যোগ করুন, যাতে বোঝা যায় কে ডাকল।",
  },
  "Service Boundaries (DDD)": {
    c: "Technical layer ধরে ভাগ করা ('database service', 'validation service') সাধারণ ভুল — ব্যবসার কাজ ধরে ভাগ করুন। দুটি service সবসময় একসাথে deploy করতে হলে সীমানা সম্ভবত ভুল। Domain পরিষ্কার না হলে modular monolith দিয়ে শুরু করুন।",
    x: "একটি food delivery app-এর bounded context (Ordering, Restaurant, Delivery, Payment) লিখুন এবং প্রতিটিতে 'order' মানে কী।",
  },
  "Sync vs Async Communication": {
    c: "লম্বা sync call-এর শিকল (A→B→C→D) latency ও ব্যর্থতার ঝুঁকি গুণ করে বাড়ায়। Async বার্তার জন্য idempotent consumer, retry, dead-letter queue এবং transactional outbox লাগে, যাতে SQL Server-এ save-এর পর app crash করলেও বার্তা না হারায়।",
    x: "CheckStockAsync-এ exception দিন এবং দেখুন sync caller কীভাবে ব্যর্থ হয়, অথচ async email পথ ঠিক থাকে।",
  },
  "REST vs gRPC": {
    c: "Browser সরাসরি gRPC ডাকতে পারে না (gRPC-Web বা JSON transcoding লাগে)। gRPC-তে শুরু থেকে শেষ পর্যন্ত HTTP/2 দরকার, তাই load balancer ও proxy দেখুন। Release-এর পর Protobuf field number কখনো আবার ব্যবহার বা বদলাবেন না।",
    x: "আপনার তিনটি API-র জন্য REST না gRPC ঠিক করুন: public mobile API, সেকেন্ডে ১০০০ বার ডাকা ভেতরের দাম হিসাবের service, partner webhook।",
    s: "'dotnet new grpc -n OrdersGrpc' দিয়ে server বানান, Protos/orders.proto-তে message ও service লিখুন, আর caller project-এ Grpc.Net.Client, Google.Protobuf ও Grpc.Tools package যোগ করুন।",
  },
  "Service Discovery": {
    c: "Registry-কে দ্রুত মৃত instance সরাতে হবে (health check বা heartbeat), নইলে caller সেখানেই যেতে থাকে। Lookup অল্প সময় cache করুন, চিরকাল নয়। Production-এ নিজে না বানিয়ে Kubernetes Service, Consul বা .NET Aspire service discovery ব্যবহার করুন।",
    x: "প্রতিটি instance-এর heartbeat সময় রাখুন এবং Resolve যেন গত ১০ সেকেন্ডে না দেখা instance বাদ দেয়।",
  },
  "Database per Service": {
    c: "একটি database কয়েকটি service ভাগ করে ব্যবহার করলে ('integration database') তারা চুপচাপ জড়িয়ে যায়। শুরুতে আলাদা database একই SQL Server instance-এ থাকতে পারে — নিয়ম হলো মালিকানা, hardware নয়। Local copy-তে eventual consistency আশা করুন।",
    x: "CustomerUpdated event (CustomerId, Name, UpdatedAt) CustomerSnapshot-এ প্রয়োগ করার SQL MERGE লিখুন, পুরনো event উপেক্ষা করে।",
  },
  CQRS: {
    c: "Read model পরে (async) আপডেট হলে user কিছুক্ষণ নিজের পরিবর্তন না-ও দেখতে পারেন (eventual consistency) — UI সেভাবে বানান। CQRS-এর জন্য MediatR বা event sourcing বাধ্যতামূলক নয়; সেগুলো আলাদা সিদ্ধান্ত।",
    x: "দ্বিতীয় read model যোগ করুন: প্রতি customer-এর order সংখ্যা। PlaceOrder-এ আপডেট করুন এবং তার জন্য একটি query লিখুন।",
  },
  "Event Sourcing": {
    c: "Event sourcing সত্যিকারের জটিলতা আনে (event schema-র version, snapshot, projection)। যেখানে ইতিহাসই ব্যবসা (ব্যাংক, হিসাবের খাতা, audit) সেখানে ব্যবহার করুন, প্রতিটি table-এ নয়। (AccountId, Version) primary key বিনামূল্যে optimistic concurrency দেয়।",
    x: "নিয়ম যোগ করুন: replay করা balance শূন্যের নিচে গেলে Withdrawn event বাতিল।",
  },
  "Distributed Transactions": {
    c: "Compensation idempotent হতে হবে (দুবার চললেও নিরাপদ), কারণ বার্তা একাধিকবার আসতে পারে। ধাপের মাঝে সিস্টেম সাময়িকভাবে অসামঞ্জস্যপূর্ণ — UI-তে 'Pending' দেখান। Cloud microservice-এ MSDTC এড়ান; অনেক managed database এটি সমর্থন করে না।",
    x: "তৃতীয় ধাপ (ArrangeDelivery) যোগ করে ব্যর্থ করুন। কোন compensation কোন ক্রমে চলবে?",
  },
  "Service Mesh": {
    c: "নিজের কোডে (Polly) আর mesh-এ দুই জায়গায় retry দেবেন না — retry গুণ হয়ে যায়। ৩-৫টি service-এর জন্য mesh খুব কমই লাভজনক; ASP.NET Core resilience handler ও OpenTelemetry দিয়ে শুরু করুন, অনেক team ও service হলে mesh নিন।",
    x: "প্রথম দুটি চেষ্টা ব্যর্থ করুন। App কী পায়? তিনটিই ব্যর্থ হলে?",
  },
  "Distributed Tracing": {
    c: "Production-এ sample করুন (যেমন ১০% এবং সব error) — প্রতিটি span রেকর্ড করা ব্যয়বহুল। Span tag-এ password, token বা পুরো SQL parameter দেবেন না। Log-এ trace ID রাখুন, যাতে log ও trace মেলানো যায়।",
    x: "তৃতীয় child span 'publish OrderPlaced' যোগ করুন এবং 'call payments'-এর ভেতরে 'fraud check' span রাখুন। Parent ID কীভাবে বদলায়?",
  },
  "File System Hierarchy": {
    c: "Linux-এ path-এ বড়-ছোট হাতের অক্ষর আলাদা: appsettings.json আর AppSettings.json দুটি আলাদা ফাইল। C#-এ কখনো 'C:\\' বা '\\' hard-code করবেন না; Path.Combine ও AppContext.BaseDirectory ব্যবহার করুন, তাহলে একই কোড Windows ও Linux-এ চলবে।",
    x: "কোড বদলে /var/log-এ কয়টি ফাইল আছে দেখান, যে folder পড়ার অনুমতি নেই তার জন্য try/catch দিন।",
  },
  "head, tail & less": {
    c: "Production server-এ 2 GB log cat করবেন না বা editor-এ খুলবেন না — tail, less বা grep ব্যবহার করুন। Log rotate করুন (logrotate বা Serilog rolling file), যাতে disk ভরে না যায়।",
    x: "TakeLast দিয়ে শুধু শেষ ৩টি ERROR লাইন দেখান, tail ও grep একসাথে চালানোর মতো।",
  },
  "Users & Groups": {
    c: "ASP.NET Core কখনো root হিসেবে চালাবেন না — একটি bug পুরো server আক্রমণকারীর হাতে দেবে। Group থেকে সরানো পরের login-এ কার্যকর হয়। Linux user আর SQL Server login আলাদা; app-এর নিজস্ব কম-ক্ষমতার SQL login লাগবে।",
    x: "/etc/group পড়ে যে লাইনে আপনার user-এর নাম আছে সেগুলো খুঁজে current user-এর group দেখান।",
  },
  "Pipes & Redirection": {
    c: "> চুপচাপ ফাইল মুছে লেখে — ফাইলের নাম দুবার দেখুন। আসল ফল stdout-এ, বার্তা ও অগ্রগতি stderr-এ লিখুন, তাহলে pipe পরিষ্কার থাকে। ASP.NET Core default-এ log stdout-এ লেখে, ঠিক যা Docker ও systemd সংগ্রহ করে।",
    x: "--errors-only argument যোগ করুন: থাকলে summary-র বদলে প্রতিটি ERROR লাইন stdout-এ দেখান।",
    s: "Console project বানান (dotnet new console -n LogCounter), Program.cs বদলান, তারপর লেখা pipe করুন: cat app.log | dotnet run --project LogCounter। Pipe ছাড়া এটি keyboard input-এর অপেক্ষা করবে; শেষ করতে Ctrl+D চাপুন।",
  },
  "Package Managers": {
    c: "Install-এর আগে সবসময় apt update দিন। একই মেশিনে Ubuntu-র feed আর Microsoft-এর feed থেকে .NET মেশাবেন না — 'SDK not found' error হয়। Dockerfile-এ apt-এর বদলে অফিসিয়াল mcr.microsoft.com/dotnet image নিন।",
    x: "Program-টি Alpine Docker container-এ (mcr.microsoft.com/dotnet/runtime:8.0-alpine) চালান। কোন package manager ধরা পড়ে?",
  },
  "Environment Variables": {
    c: "Process দেখতে পারে এমন যে কেউ environment variable দেখতে পারে (/proc/<pid>/environ, docker inspect)। Script-এ commit করবেন না; production password-এর জন্য secret store (Azure Key Vault, AWS Secrets Manager) বা শুধু root পড়তে পারে এমন EnvironmentFile ব্যবহার করুন।",
    x: "ASPNETCORE_URLS পড়ে API কোন port-এ শুনবে দেখান; না থাকলে 5000 ধরুন।",
  },
  "cron Jobs": {
    c: "cron খুব ছোট PATH নিয়ে চলে, ASPNETCORE variable থাকে না — সবসময় পুরো path (/usr/bin/dotnet) দিন এবং দরকারি variable crontab-এ সেট করুন। সময় server-এর time zone অনুযায়ী। Job interval-এর চেয়ে বেশি চললে একসাথে দুটি চলা আটকান (flock) বা queue ব্যবহার করুন।",
    x: "প্রতি রবিবার রাত ৩:১৫-এ cleanup চালানোর crontab লাইন লিখুন, output ও error দুটোই /var/log/cleanup.log-এ যোগ হবে।",
  },
  "ping, ss & netstat": {
    c: "Ping ব্যর্থ মানেই server বন্ধ নয় — অনেক network ICMP আটকায়; আসল port পরীক্ষা করুন। ss-এ Kestrel শুধু 127.0.0.1:5000-এ থাকলে অন্য মেশিন পৌঁছাতে পারবে না; ASPNETCORE_URLS=http://0.0.0.0:5000 দিন বা সামনে Nginx রাখুন।",
    x: "Port check যেন command-line argument থেকে host ও port নেয়, nc -zv host port-এর মতো।",
  },
  "systemd & Services": {
    c: "Type=notify শুধু UseSystemd() থাকলে কাজ করে; না থাকলে Type=simple দিন। Unit file বদলানোর পর প্রতিবার daemon-reload দিন। App-কে Nginx-এর পেছনে 127.0.0.1-এ রাখুন, আর secret inline Environment= লাইনে না রেখে শুধু root পড়তে পারে এমন EnvironmentFile-এ রাখুন।",
    x: "RestartSec ১০ করুন, ইচ্ছা করে app crash করান (Environment.Exit(1) ডাকে এমন endpoint), এবং journalctl-এ systemd-এর restart দেখুন।",
    s: "Web project বানান (dotnet new web -n MyApi), 'dotnet add package Microsoft.Extensions.Hosting.Systemd' দিন, Program.cs বদলান, 'dotnet publish -c Release -o /var/www/myapi' দিয়ে publish করুন, তারপর পরের উদাহরণের unit file তৈরি করুন।",
  },
};
