// Extra beginner notes translate the important edge case, rather than repeating the definition.
export const banglaWarnings = Object.fromEntries(
  `Arrays and Strings|শেষ index হলো Length - 1। একটি দৃশ্যমান বাংলা অক্ষর একাধিক UTF-16 code unit হতে পারে।
Hashing|দুটি key সমান হলে hash-ও সমান হতে হবে। Dictionary-তে রাখার পরে key-এর hash বদলায় এমন তথ্য বদলাবেন না।
Two Pointers|ছোট যোগফলে বাঁয়ের pointer বাড়ানোর নিয়মটি শুধু সাজানো input-এর জন্য ঠিক। সাজানোর খরচও হিসাব করুন।
Sliding Window|Window-এর মাপ ১ থেকে array-এর দৈর্ঘ্যের মধ্যে হতে হবে। ঋণাত্মক সংখ্যা থাকলে অনেক variable-window নিয়ম চলে না।
Prefix Sum|শুরুতে অতিরিক্ত শূন্য রাখলে প্রথম element থেকে range-এর হিসাবও একই নিয়মে হয়। যোগফল বড় হলে long ব্যবহার করুন।
Binary Search|সাজানো data দরকার। lo ও hi দুই প্রান্তসহ নাকি এক প্রান্ত বাদ, শুরু থেকেই একটি নিয়ম মানুন। প্রতিবার সীমা ছোট হতে হবে।
Stack and Queue|খালি collection থেকে Pop বা Dequeue করলে exception হয়। TryPop বা TryDequeue দিয়ে নিরাপদে খালি অবস্থা সামলান।
Linked List|চেনা node-এ ঢোকানো দ্রুত; কিন্তু একটি index খুঁজতে শুরু থেকে link ধরে যেতে হয়। Array-এর মতো সরাসরি index access নয়।
Monotonic Stack|দূরত্ব বা একই মানের একাধিক অবস্থান লাগলে মান নয়, index রাখুন। < আর <= ব্যবহারে ফল বদলায়।
Recursion|থামার শর্ত ও ছোট হতে থাকা সমস্যা না থাকলে call stack শেষ হয়ে যায়। বড় factorial-এ সংখ্যাও overflow করে।
Backtracking|এক শাখা দেখা শেষে পছন্দটি মুছতে ভুললে অন্য শাখার ফল দূষিত হয়। ফল জমা রাখলে তালিকার কপি রাখুন।
Trees and BST|সব binary tree BST নয়। একদিকে লম্বা হয়ে গেলে খোঁজা O(n), balanced হলে O(log n)। একই key কোথায় রাখবেন, নিয়ম দিন।
Heap / Priority Queue|সমান priority-র কাজ কোনটি আগে বের হবে তা ধরে নেবেন না। দরকারে ক্রমের আলাদা নম্বর priority-তে রাখুন।
Graphs: BFS and DFS|Queue-তে ঢোকানোর সময়ই visited চিহ্ন দিন। BFS শুধু সমান weight-এর edge-এ কম edge-এর ছোট পথ দেয়।
Tries|শব্দের prefix আছে মানেই সম্পূর্ণ শব্দ আছে নয়। শব্দের শেষ চিহ্ন ও Unicode normalization আলাদা করে ভাবুন।
Topological Sort|এটি directed acyclic graph-এর জন্য। সব node বের না হলে directed cycle আছে। একাধিক সঠিক ক্রম থাকতে পারে।
Dijkstra's Algorithm|ঋণাত্মক edge weight থাকলে এই নিয়ম ঠিক নয়। Queue-তে আগের বেশি দূরত্বের entry থাকলে তা বাদ দিতে হবে।
Union Find|এই ছোট উদাহরণে rank নেই। Path compression-এর সাথে rank বা size দিয়ে union করলে খারাপ input-এও ভালো কাজ করে।
Greedy Algorithms|প্রতিবার সুবিধার সিদ্ধান্ত নিলেই মোট সেরা উত্তর হবে না। কেন সিদ্ধান্তটি নিরাপদ, তার যুক্তি বা counterexample খুঁজুন।
Dynamic Programming|State-এ ভবিষ্যৎ সিদ্ধান্তের জন্য দরকারি সব তথ্য থাকতে হবে। Base case না দিলে recurrence শুরুই হবে না।
OOP Pillars|সব সমস্যায় inheritance দরকার নেই। তথ্য private রেখে বৈধ state নিশ্চিত করুন, interface দিয়ে দরকারি কাজ প্রকাশ করুন।
SOLID Principles|প্রতি class-এর জন্য interface বানানোই SOLID নয়। কোন পরিবর্তনকে আলাদা রাখছেন, তা পরিষ্কার করে বলুন।
DRY / KISS / YAGNI|দেখতে একই দুই code ভিন্ন ব্যবসার নিয়ম হতে পারে। কেবল লেখা এক বলে জোর করে এক abstraction বানাবেন না।
Composition over Inheritance|সহযোগী object কে বানাবে, কে বন্ধ করবে ও কতক্ষণ থাকবে, তা ঠিক করুন। Composition-এও দায়িত্ব স্পষ্ট দরকার।
UML Class Diagrams|কালো diamond মানে শক্ত মালিকানা ও জীবনচক্রের সম্পর্ক। যেকোনো field থাকলেই এটি আঁকবেন না।
Singleton|একটি scoped DbContext-কে singleton-এ ধরে রাখবেন না। Shared mutable state হলে একইসাথে ব্যবহার সামলাতে হবে।
Factory|Object বানানোর সিদ্ধান্ত আলাদা করুন; কিন্তু সব dependency লুকানো service locator বানাবেন না।
Abstract Factory|এক পরিবারের পণ্যগুলো সামঞ্জস্যপূর্ণ হওয়া উচিত। নতুন পণ্যের ধরন যোগ করলে সব factory বদলাতে হতে পারে।
Builder|Build-এর শেষে আবশ্যক তথ্য ও সঠিকতা যাচাই করুন। বাইরে অর্ধেক তৈরি object পাঠাবেন না।
Prototype|Record-এর with শুধু shallow copy। ভেতরের mutable list আলাদা করতে চাইলে সেটিও কপি করতে হবে।
Adapter|নাম বদলালেই যথেষ্ট নয়; unit, error ও lifecycle-এর মানেও সঠিকভাবে অনুবাদ করতে হবে।
Decorator|Wrapper-এর ক্রমে ফল বদলায়। Retry-এর বাইরে logging আর ভেতরে logging এক ঘটনা মাপে না।
Facade|একটি সহজ প্রবেশপথ দিন, সব ব্যবসার নিয়ম এক বিশাল class-এ জমা করবেন না। লেনদেনের সীমাও বুঝিয়ে দিন।
Proxy|Browser-এর proxy নিরাপত্তার শেষ সীমা নয়। আসল server-এও অনুমতি যাচাই করতে হবে।
Observer|দীর্ঘজীবী publisher-এ listener ছাড়তে ভুললে object memory-তে আটকে থাকতে পারে। In-process event এখানে synchronous।
Strategy|এক লাইনের সামান্য ভিন্নতার জন্য অনেক class দরকার নাও হতে পারে। বাস্তবে বদলায় এমন policy হলে ব্যবহার করুন।
Command|Command হলো করতে চাওয়া কাজ; event হলো হয়ে যাওয়া ঘটনার খবর। Queue-তে গেলে পুনরাবৃত্তি ও অনুমতি আবার ভাবুন।
State|দুই request একই state একসাথে বদলাতে পারে। যাচাই ও পরিবর্তন একই atomic write-এ করুন বা concurrency token দিন।
Thread Safety|count++ পড়া, বাড়ানো ও লেখা—তিন অংশ। Thread-safe collection থাকলেও কয়েক ধাপের পুরো কাজ atomic হয় না।
Machine Coding|Capacity, duplicate ticket, একইসাথে প্রবেশ ও storage-এর নিয়ম আগে জিজ্ঞেস করুন। ছোট model-কে পূর্ণ parking software ভাববেন না।
REST APIs|উদাহরণটি সব id-তে একই demo ফল দেয়। আসল database-এ না পেলে 404 দিতে হবে। HTTP method-এর অর্থ ঠিক রাখুন।
HTTP and Status Codes|401 পরিচয় দরকার বা ভুল; 403 পরিচয় থাকলেও অনুমতি নেই। ব্যর্থতার ক্ষেত্রেও সবসময় 200 দেবেন না।
Input Validation|Frontend-এর যাচাই সহজ ব্যবহার দেয়; server-এর যাচাইয়ের বিকল্প নয়। Input ঠিক থাকা আর কাজের অনুমতি থাকা আলাদা।
Pagination|Page size-এর সীমা দিন। Keyset-এ stable ও unique ordering দরকার; nonunique হলে একাধিক মানের cursor লাগতে পারে।
API Versioning|এখানে URL দিয়ে version আলাদা করা হয়েছে, আলাদা versioning package নয়। পুরোনো version সরানোর পরিকল্পনাও রাখুন।
Sessions and Cookies|Memory session store এক process-এর জন্য। একাধিক server হলে shared store বা উপযুক্ত policy দরকার।
Authentication with JWT|Token-এর payload encrypted ধরে নেবেন না। বিশ্বস্ত issuer, audience, signature ও মেয়াদ সব যাচাই করুন।
OAuth 2.0|এটি শুধু PKCE তৈরির অংশ। State, redirect URI, callback ও token exchange-এর পুরো flow পরীক্ষিত library দিয়ে করুন।
SQL vs NoSQL|JSON বানানো database নয়। NoSQL-এও data-এর schema ও consistency-এর নিয়ম থাকে। প্রশ্ন ও সম্পর্ক দেখে storage বাছুন।
ORM and Migrations|Add করলেই SQL insert যায় না; SaveChanges লাগে। Migration-এ column মুছে গেলে data হারাতে পারে, আগে review করুন।
Database Indexing|Index বানালেই optimizer সেটি নেবে না। Composite index-এর শুরুতে কোন column, তা গুরুত্বপূর্ণ; write-এর বাড়তি খরচও আছে।
Transactions and ACID|Transaction থাকলেই সব race থামে না। Balance যাচাই ও concurrency সামলান। Email পাঠানো database rollback-এ ফিরে আসে না।
File Uploads to S3|মূল filename-কে সরাসরি storage key বানাবেন না। Size, type, permission ও stream-এর lifecycle যাচাই করুন।
Unit and Integration Tests|Test-এর মধ্যে একই হিসাব আবার লিখলে আসল code ভাঙা ধরা পড়ে না। বাস্তবে application function বা HTTP boundary ডাকুন।
Caching with Redis|Cache miss-এ অনেক request একসাথে database-এ গেলে stampede হয়। TTL-এর সাথে invalidation ও concurrent load ভাবুন।
Rate Limiting|উদাহরণের bucket সবার জন্য ভাগ করা। প্রতি user-এর সীমা আলাদা partition চায়; একাধিক server-এর limit-ও আলাদা হতে পারে।
WebSockets|Hub-এর message-ও অবিশ্বস্ত input। User-এর group membership, message size ও একাধিক server-এর backplane দরকার।
Background Jobs|Request শেষের পরে তার scoped service নিয়ে fire-and-forget কাজ করবেন না। Restart-এ কাজ রাখতে durable queue দরকার।
Message Queues|Channel<T> memory-তে থাকে, restart-এ হারায়। Durable broker-এও duplicate message আসতে পারে, handler idempotent করুন।
Logging and Monitoring|Activity শুরু করলেই exporter সেট হয় না। Log-এ password বা ব্যক্তিগত তথ্য নয়; metric label-এর সংখ্যা সীমিত রাখুন।
OWASP Top 10|এটি বড় ঝুঁকির সচেতনতার তালিকা, পূর্ণ test checklist নয়। প্রতিটি asset ও boundary-র threat আলাদা পরীক্ষা করুন।
SQL Injection|Parameter মানের জন্য; table বা column-এর নামের জন্য নয়। Dynamic identifier দরকার হলে অনুমোদিত তালিকা থেকে নিন।
XSS|HTML encoding সব context-এ ঠিক নয়। JavaScript, URL ও CSS-এর নিয়ম আলাদা; rich HTML-এ পরীক্ষিত sanitizer লাগবে।
CSRF|Middleware যোগ করলেই সব endpoint token যাচাই করে না। Token তৈরি, পাঠানো ও নির্দিষ্ট endpoint-এ validation লাগবে।
CORS|CORS পরিচয় যাচাই নয়। Browser ছাড়া client এই নিয়ম মানতে বাধ্য নয়; server-এ অনুমতি আলাদা করে দিন।
HTTPS and TLS|Proxy-এর পেছনে scheme ও forwarded header ভুল হলে redirect loop হতে পারে। শুধু বিশ্বস্ত proxy-এর তথ্য বিশ্বাস করুন।
Hashing and Encryption|সাধারণ SHA-256 password-এর জন্য খুব দ্রুত। Password KDF ব্যবহার করুন; encryption-এ key ও nonce সঠিকভাবে সামলান।
Password Hashing|একই password-এও salt আলাদা হওয়া উচিত। কাজের খরচ আপডেট করুন, password বা hash log-এ দেবেন না।
Secure Sessions|Cookie-এর flag-ই পূর্ণ login ব্যবস্থা নয়। পরিচয়ের পরে session ID বদলান, মেয়াদ দিন ও হারালে বাতিল করুন।
JWT Security|Token decode করা validation নয়। কোন key ও algorithm বিশ্বস্ত তা application policy দিয়ে ঠিক করুন।
OAuth Security|State বানালেই শেষ নয়; নিরাপদে রাখুন, callback-এ মেলান, মেয়াদ দিন ও একবার ব্যবহার করুন।
Secrets Management|Browser bundle, source control বা log-এ আসল secret রাখবেন না। Scope ছোট ও credential স্বল্পমেয়াদি রাখুন।
IAM and Least Privilege|Role থাকলেই নির্দিষ্ট record-এর মালিক হওয়া প্রমাণ হয় না। কাজের পাশাপাশি target resource-এর অনুমতিও দেখুন।
Security Headers and CSP|অন্য সাইটের CSP কপি করলে নিজের script বা font বন্ধ হতে পারে। আগে report-only দিয়ে দরকারি resource দেখুন।
SSRF|শুধু host মিলানো যথেষ্ট নয়। Redirect, DNS-এর বদল ও private IP-তেও যাওয়ার পথ বন্ধ করতে হবে।
Rate Limiting and DDoS Mitigation|অ্যাপের limiter পুরো network ভরে যাওয়া আক্রমণ থামাতে পারে না। Upstream ও edge সুরক্ষাও লাগে।
Dependency Scanning|কোনো finding না থাকা নিরাপত্তার প্রমাণ নয়। আপডেট review ও compatibility test ছাড়া অন্ধভাবে package বদলাবেন না।
Penetration Testing|শুধু অনুমোদিত পরিবেশ ও সীমার মধ্যে test করুন। Object ownership, role ও replay-এর নিয়মও পরীক্ষা করুন।
Prompt Injection|শুধু prompt লিখে tool-এর অনুমতি রক্ষা করা যায় না। প্রতিটি tool call-এর নাম, argument ও resource access model-এর বাইরে যাচাই করুন।
Scalability|Database আগেই পূর্ণ চাপ নিলে API server বাড়িয়ে লাভ নেই। আসল bottleneck মাপুন।
Load Balancing|পালাক্রমে ভাগ করার loop-টি network proxy নয়। Health, connection ও request-এর ভিন্ন খরচ ভাবতে হবে।
Caching|উদাহরণের Dictionary-তে expiry, size limit ও concurrency protection নেই। Production cache হিসেবে সরাসরি নেবেন না।
CDN|ব্যক্তিগত response public cache করবেন না। ফল বদলায় এমন সব input cache key-তে ধরা দরকার।
Blob Storage|Object key বানানো upload নয়। Bucket, permission, metadata, lifecycle ও প্রকৃত SDK আলাদা সেটআপ করুন।
API Gateway|Dictionary-র route তালিকা শুধু model। আসল forwarding, timeout, TLS ও health-এর জন্য gateway implementation দরকার।
Replication|Replica backup নয়; ভুলে মুছে দেওয়াও সব কপিতে ছড়াতে পারে। Lag ও failover-এ হারানোর সম্ভাবনা বুঝুন।
Database Sharding|Shard-এর সংখ্যা বদলালে modulo routing-এ অনেক key-এর গন্তব্য বদলে যায়। Data migration ও routing version দরকার।
Consistent Hashing|Process-এর randomized string hash দিয়ে স্থায়ী routing করবেন না। সবার জন্য একই নির্দিষ্ট hash লাগবে।
Kafka and Pub / Sub|এটি local event তালিকা, Kafka client নয়। ক্রম সাধারণত একটি partition-এর মধ্যে; offset ও side effect ঠিকভাবে সামলান।
Event-Driven Architecture|Database commit-এর পরে publish-এর আগে crash হলে event হারায়। Transactional outbox দিয়ে ফাঁকটি সামলান।
Microservices|Network call ধীর বা ব্যর্থ হতে পারে। Timeout, retry, trace ও data ownership দরকার; অকারণে monolith ভাঙবেন না।
Rate Limiter Design|Check ও token খরচ আলাদা ধাপে হলে একসাথে request সীমা ছাড়িয়ে যেতে পারে। বাস্তবে atomic update দরকার।
CAP Theorem|সবসময় তিনটির যেকোনো দুইটি বাছা—এভাবে CAP বোঝা ভুল। Partition-এর সময় consistency ও availability-এর বিশেষ সংজ্ঞার সীমা।
PACELC Theorem|উদাহরণের millisecond মাপা benchmark নয়। স্বাভাবিক অবস্থাতেও দূরের কপি মিলিয়ে পড়তে সময় লাগে।
Consistency Models|Eventual মানে নির্দিষ্ট কয়েক সেকেন্ডের মধ্যে নিশ্চিত ফল নয়, যদি সিস্টেম তা আলাদা চুক্তিতে না দেয়।
Bloom Filter|হ্যাঁ মানে সম্ভবত আছে, আবার আসল store দেখুন। সাধারণ bit মুছে দিলে ভুল না-ও তৈরি হতে পারে।
Circuit Breaker|তিনটি state-এর model-ই পূর্ণ breaker নয়। সময়, failure threshold, probe ও concurrent state-এর পরীক্ষিত ব্যবস্থা দরকার।
Saga Pattern|Refund পুরোনো সময়ে ফিরে যাওয়া নয়; নতুন ব্যবসার কাজ। Compensation ব্যর্থও হতে পারে, retry ও recovery দিন।
Back-of-the-Envelope Estimation|Byte ও bit, গড় ও peak, GB ও GiB আলাদা। হিসাব load test-এর বিকল্প নয়।
Database Internals|String-এর log database engine নয়। Flush, write order ও crash recovery ঠিক হলেই durability মেলে।
Operating Systems|Working set আর managed heap এক নয়। Memory counter কোনটি মাপে, platform অনুযায়ী বুঝুন।
Computer Networks|TCP connect সফল মানেই HTTP অ্যাপ ভালো নয়। DNS, connection, TLS ও application error আলাদা করে দেখুন।
Concurrency & Multithreading|async নিজে নতুন thread দেয় না। .Result বা .Wait দিয়ে async request আটকে ThreadPool সংকট করবেন না।
Backend Architecture|Folder-এর নাম CleanArchitecture হলেই boundary পরিষ্কার হয় না। Business rule যেন transport framework-এর উপর আটকে না থাকে।
API Design|Error response-এ stack trace, SQL বা secret দেখাবেন না। Error code স্থায়ী রাখুন, বার্তা বদলাতে পারে।
Database Design & Optimization|শুধু application-এ নয়, database-এ foreign key ও uniqueness মানান। মেপে index ও denormalization করুন।
System Design Fundamentals|গড় concurrency-র হিসাব p99 latency বলে না। চাহিদা, failure ও recovery না বুঝে box বাড়াবেন না।
Distributed Systems|Timeout মানে দূরের কাজ হয়নি তা নয়। Payment হয়ে যাওয়ার পরে reply হারালে retry-তে duplicate হতে পারে।
Docker & Kubernetes|লোকাল image build করলেই cluster সেটি পায় না। Registry-তে প্রকাশ ও সঠিক image reference লাগবে।
Linux and Bash|Variable quote না করলে space-সহ data অনেক argument হতে পারে। set -e-ও সব error নিজে সামলায় না।
Networking Basics|403-এ server উত্তর দিয়েছে; DNS fail বা connection refused আলাদা সমস্যা। এক স্তর একবারে পরীক্ষা করুন।
Docker Compose|Start order মানেই অ্যাপ প্রস্তুত নয়। Health check দিন; স্থায়ী data-র জন্য named volume রাখুন।
Helm|Template render সফল হলেই Kubernetes গ্রহণ করবে বা অ্যাপ চলবে, নিশ্চিত নয়। Generated manifest যাচাই করুন।
CI/CD Pipelines|প্রতি পরিবেশে আলাদা build না করে একবারের পরীক্ষিত artifact এগিয়ে দিন। Production secret অবিশ্বস্ত PR-এ দেবেন না।
GitHub Actions|এই YAML শুধু গঠন দেখায়, পূর্ণ build pipeline নয়। আসল action নির্দিষ্ট review করা commit-এ pin করুন।
Terraform|State ও saved plan-এ secret থাকতে পারে। সেগুলো প্রকাশ করবেন না; apply-এর আগে replacement ভালো করে দেখুন।
Ansible|Check mode সব module-এর পূর্ণ simulation নয়। Generic shell-এর বদলে idempotent module ব্যবহার করুন।
Nginx Reverse Proxy|এই local HTTP sample internet-এর পূর্ণ config নয়। TLS, body limit ও trusted header-এর নিয়ম যোগ করুন।
Prometheus|Metric label-এ user ID বা প্রতিটি URL দিলে অগণিত series হয়। নাম ও label সীমিত রাখুন।
Grafana|Data সংগ্রহ না হলে dashboard তা বানাতে পারে না। Metric-এর আসল নাম, unit ও query মেলান।
ELK Logging|JSON print করলেই ELK সেট হয় না। Collector, mapping, retention ও sensitive data-র নিয়ম লাগে।
Blue Green Deploys|অ্যাপ ফেরালেও database migration নিজে ফেরে না। দুই version চলার সময় schema compatible রাখুন।
All Data Structures|একটি structure সব কাজে সেরা নয়। Input-এর মাপ, ordering, mutation ও memory দেখে বাছুন।
Advanced Algorithms|চেনা শব্দ দেখেই pattern ধরবেন না। সীমা, invariant ও counterexample দিয়ে সঠিকতা যাচাই করুন।
Docker|publish/ ও App.dll এখানে বাস্তবে থাকতে হবে। Image pin, non-root user ও resource limit নিয়ে production প্রস্তুতি করুন।
Kubernetes|Image নামটি উদাহরণ। Probe, resource request, security context ও registry access ঠিক করে বাস্তবে চালাতে হবে।
AWS Cloud|সঠিক account ও region যাচাই করুন। Budget alert ও cleanup plan দিন; সব cloud resource বিনা খরচে নয়।
Git and GitHub|Push মানেই merge বা deploy নয়। Pull request হলো review workflow, মূল Git object নয়।
Design Patterns|Pattern-এর নাম দেখানোর জন্য class বাড়াবেন না। একটি function-ই কখনো strategy-র সহজ সমাধান।
EC2|সঠিক account, region ও permission দরকার। Machine-এর OS patch ও অ্যাপের নিরাপত্তার দায়িত্ব আপনার।
S3|Bucket-কে public করে permission error ঢাকবেন না। Block-public-access ও সীমিত policy রাখুন।
IAM|স্পষ্ট deny থাকলে allow তাকে কাটায় না। App-এ root credential নয়, সীমিত short-lived role দিন।
RDS|Managed মানেই সবসময় high availability নয়। Backup, network, failover ও recovery test করুন।
Route 53|DNS বদল সব client-এ সঙ্গে সঙ্গে যায় না। TTL ও resolver cache বুঝুন।
VPC|Public route থাকলেই সব workload public নয়। IP, security group ও listener-ও ঠিক হতে হবে।
Lambda|Memory-র state স্থায়ী নয়। Event source অনুযায়ী retry হতে পারে; কাজ idempotent করুন।
CloudFront|Origin-এ header পাঠানো আর cache key-তে header রাখা এক নয়। ব্যক্তিগত data cache হয়ে যাওয়া ঠেকান।
Auto Scaling|নতুন instance প্রস্তুত হতে সময় লাগে। Downstream database আগেই পূর্ণ হলে শুধু কপি বাড়াবেন না।
SNS|Topic আর worker-এর durable queue এক নয়। Subscriber অনুযায়ী retry ও delivery নিয়ম আলাদা।
SQS|Message পেয়েই কাজ চিরতরে শেষ নয়। শেষ হলে delete; দেরি হলে visibility বাড়ান; duplicate সামলান।
DynamoDB|Scan দিয়ে ভুল key design ঢাকবেন না। এক key-তে বেশি চাপ পড়লে hot partition হয়।
CloudWatch|Log-এর retention না দিলে খরচ বাড়ে। Alarm-এর দায়িত্ব ও করণীয় runbook লিখুন।
ECS|Task role অ্যাপের অনুমতি, execution role platform-এর কাজের অনুমতি। দুইটি আলাদা।
EKS|শুধু Kubernetes শেখার ইচ্ছায় production জটিল করবেন না। Upgrade, node, IAM ও network-এর দায়িত্ব বুঝুন।
ECR|Tag বদলাতে পারে। ঠিক একই artifact চালাতে digest বা immutable tag policy ব্যবহার করুন।
CloudFormation|Update-এ resource replacement হতে পারে। Change set ও data retention policy review করুন।
LLM Fundamentals|সাবলীল লেখা সত্যের প্রমাণ নয়। Model-এর উত্তর যাচাই করুন; API secret frontend-এ রাখবেন না।
Tokens and Context Window|Space দিয়ে শব্দ গুনে token বোঝা যায় না। আসল tokenizer নিন ও উত্তরের জন্য জায়গা রাখুন।
Prompt Engineering|Document-এর অবিশ্বস্ত লেখা অ্যাপের নির্দেশ নয়। Prompt দিয়ে tool-এর অনুমতি নিশ্চিত করা যায় না।
Structured Outputs|JSON schema সঠিক হলেই তথ্য সত্য বা কাজ অনুমোদিত নয়। মান ও ব্যবসার নিয়ম আলাদা যাচাই করুন।
Embeddings|ভিন্ন model-এর vector একসাথে তুলনা করবেন না। Unit vector না হলে dot product-ই cosine নয়।
Vector Databases|এই query PostgreSQL ও pgvector-এর জন্য, SQLite নয়। প্রতিটি ফলের tenant ও permission যাচাই করুন।
RAG Pipelines|Context জুড়লেই grounded উত্তর নিশ্চিত নয়। আসল citation, তথ্যের মেয়াদ, অনুমতি ও প্রমাণ না থাকলে না-বলার ব্যবস্থা দিন।
Chunking Strategies|Character আর token এক নয়। Chunk-এর সাথে source, heading, offset ও permission metadata রাখুন।
Reranking|তৈরি score সাজানো trained reranker নয়। আসল query-document model ও relevance eval দরকার।
Tool Calling|Function-এর description কাজের অনুমতি দেয় না। Argument, identity, resource ও side effect application-এ যাচাই করুন।
MCP Protocol|এটি data contract-এর model, MCP-এর পূর্ণ protocol নয়। Maintained SDK, authentication ও scoped tool policy লাগবে।
ReAct Agent Loop|এটি bounded loop-এর model, পূর্ণ agent নয়। Step, token, সময়, tool ও খরচের সীমা রাখুন।
Planning and Reflection|Model নিজে সফল বললেই কাজ হয়েছে নয়। Tool result, test ও অন্য প্রমাণ দিয়ে মিলিয়ে নিন।
Agent Memory|গোপন তথ্য বা সংবেদনশীল অনুমান memory-তে জমাবেন না। User-এর মুছতে ও সংশোধন করতে পারা দরকার।
Multi-Agent Systems|বেশি agent মানেই সত্য বা ভালো ফল নয়। এক agent-এর baseline, যোগাযোগের খরচ ও আসল যাচাই তুলনা করুন।
Agent Orchestration|সাধারণ Task process বন্ধ হলে থাকে না। Crash পেরোতে durable state ও idempotent side effect লাগবে।
Guardrails|কিছু keyword আটকানো নিরাপত্তার পূর্ণ ব্যবস্থা নয়। আসল কাজের সীমায় schema, identity, অনুমতি ও মান যাচাই করুন।
Evals|সব উত্তরে exact match চলে না। Model judge-এর পক্ষপাত মাপুন, মানুষের review ও held-out test রাখুন।
Observability and Tracing|Trace export করতে listener দরকার। Raw prompt বা ব্যক্তিগত data অনিয়ন্ত্রিতভাবে log করবেন না।
Fine-Tuning with LoRA|JSONL বানানো training নয়। অনুমোদিত dataset, উপযুক্ত training stack ও আলাদা test data দরকার।`
    .split("\n")
    .map((x) => x.split("|")),
);
export const cliWarnings = {
  0: [
    "Init-এ commit হয় না; আগে stage, তারপর commit করুন।",
    "Clone একবারের কপি; পরে sync আলাদা।",
    "Untracked ফাইল add না করলে commit-এ যায় না।",
    "Secret stage করবেন না; staged diff দেখে নিন।",
    "Commit local; upload করতে push লাগে।",
    "Graph-এর parent দেখে merge বুঝুন।",
    "Staged পরিবর্তন দেখতে --staged দরকার।",
    "Remote-এ নতুন কাজ থাকলে আগে fetch ও মিলিয়ে নিন।",
    "Merge নাকি rebase, নীতি স্পষ্ট রাখুন।",
    "Fetch local main নিজে বদলায় না।",
    "Branch বানানো আর তাতে যাওয়া আলাদা।",
    "অসমাপ্ত পরিবর্তন switch আটকাতে পারে।",
    "Commit hash checkout করলে detached HEAD হয়।",
    "Conflict মিটিয়ে add করে merge শেষ করুন।",
    "Tag আলাদাভাবে push লাগতে পারে।",
    "দলের শেয়ার করা history না বুঝে rewrite করবেন না।",
    "-u ছাড়া untracked ফাইল stash হয় না।",
    "--hard হাতে থাকা tracked পরিবর্তন ফেলে দেয়।",
    "Merge revert-এ কোন parent ধরবেন, তা ঠিক করতে হয়।",
    "আসল commit hash ব্যবহার করুন; তার আগের dependency-ও লাগতে পারে।",
  ],
  1: [
    "Dot দিয়ে লুকানো মানে সুরক্ষিত নয়।",
    "এটি শুধু বর্তমান shell-এর folder বদলায়।",
    "Symbolic link-এ logical ও physical path আলাদা হতে পারে।",
    "Permission ও disk space দরকার।",
    "আসল machine-এ এটি data মুছে দেয়; disposable path যাচাই করুন।",
    "Metadata রাখতে -a দরকার হতে পারে।",
    "আগের destination overwrite হতে পারে।",
    "Secret বা binary file terminal-এ দেখাবেন না।",
    "Quote দিয়ে shell expansion নিয়ন্ত্রণ করুন।",
    "Wildcard quote করুন যেন find নিজে মেলায়।",
    "777 দিয়ে সমস্যা ঢাকবেন না; কম permission দিন।",
    "Owner বদলাতে সাধারণত বেশি privilege লাগে।",
    "আলাদা folder-এ trusted archive খুলুন।",
    "Command line-এ secret argument থাকতে পারে।",
    "Load average শুধু CPU শতাংশ নয়।",
    "আগে SIGTERM দিয়ে গুছিয়ে বন্ধের সুযোগ দিন।",
    "Byte ফাঁকা থাকলেও inode শেষ হতে পারে।",
    "ফাইলের apparent size আর disk allocation আলাদা হতে পারে।",
    "Server-এর host key যাচাই করুন।",
    "TLS যাচাই বন্ধ করবেন না; HTTP error আলাদা দেখুন।",
  ],
};
cliWarnings[11] = [
  "Port প্রকাশের সাথে অ্যাপকে container interface-এও শুনতে হবে।",
  "Running মানেই app healthy নয়।",
  "একই layer অন্য tag ব্যবহার করলে জায়গা ছাড়ে না।",
  "Production-এ digest pin করলে নির্দিষ্ট artifact মেলে।",
  ".dockerignore দিয়ে secret ও বড় file বাদ দিন।",
  "ছোট runtime image-এ shell নাও থাকতে পারে।",
  "Log rotation না থাকলে disk ভরে যায়।",
  "SIGTERM পেলে কাজ গুছিয়ে shutdown budget-এর মধ্যে শেষ করুন।",
  "Start নতুন image দিয়ে container আবার বানায় না।",
  "স্থায়ী data volume বা বাইরে রাখুন।",
  "Container image ব্যবহার করলে removal আটকাতে পারে।",
  "Inspect-এর environment-এ secret থাকতে পারে।",
  "নিজস্ব bridge network-এ নাম দিয়ে DNS পাওয়া যায়।",
  "Container মুছলেই named volume মুছে যায় না।",
  "রেজিস্ট্রির host ও repository আসল মান দিয়ে বদলান।",
  "সঠিক registry-তে login করুন; release tag অপরিবর্তনীয় রাখুন।",
  "Password shell history বা command argument-এ নয়।",
  "Service start order মানেই ready নয়; health check দিন।",
  "-v দিলে named volume-এর data-ও হারাতে পারে।",
  "Prune সত্যিই unused resource সরায়; -a-তে আরও বেশি সরে।",
];
cliWarnings[12] = [
  "Running pod হলেও readiness fail হতে পারে।",
  "Selector ভুল হলে Service-এর endpoint খালি থাকে।",
  "Desired ও available replicas rollout-এ আলাদা হতে পারে।",
  "Ready node-এ নতুন pod-এর capacity নাও থাকতে পারে।",
  "get pods থেকে আসল pod name নিন।",
  "আগের crash-এর log দেখতে --previous দিন।",
  "Distroless container-এ shell থাকে না।",
  "Production apply-এর আগে diff ও manifest যাচাই করুন।",
  "Delete-এর আগে context ও namespace দেখুন।",
  "Namespace নিজে সম্পূর্ণ security isolation নয়।",
  "Autoscaler পরে replica count আবার বদলাতে পারে।",
  "Automation-এ rollout timeout দিন।",
  "অ্যাপ rollback-এ database migration ফেরে না।",
  "Port-forward debug-এর জন্য, production ingress নয়।",
  "Metrics API বা Metrics Server দরকার।",
  "Manual edit Git-এর নকশা থেকে drift করতে পারে।",
  "Label বদলালে Service বা policy-র selection বদলায়।",
  "অনেক cp operation-এ container-এর ভেতর tar দরকার।",
  "--raw দিয়ে kubeconfig log-এ দেবেন না; credential ফাঁস হতে পারে।",
  "আসল cluster-এ কাজের আগে বর্তমান context যাচাই করুন।",
];
export const sqlWarnings = [
  "App query-তে প্রয়োজনের column স্পষ্ট বলুন; * দিয়ে schema বদলে output বদলাতে পারে।",
  "NULL পরীক্ষা করতে = NULL নয়, IS NULL ব্যবহার করুন।",
  "একই মানে tie হলে unique key দিয়ে ক্রম স্থির করুন।",
  "ভুল join-এর duplicate ঢাকতে শুধু DISTINCT দেবেন না।",
  "এটি SQLite/PostgreSQL-এর LIMIT; SQL Server-এর syntax আলাদা।",
  "COUNT(column) NULL বাদ দেয়; COUNT(*) সব সারি গোনে।",
  "টাকার জন্য সঠিক precision ব্যবহার করুন; সব database-এর numeric নিয়ম এক নয়।",
  "শুরুতে % থাকলে সাধারণ index দিয়ে seek কঠিন হতে পারে।",
  "NOT IN-এর তালিকায় NULL থাকলে অপ্রত্যাশিত unknown আসে।",
  "সময়ের range-এ শেষ মুহূর্তসহ BETWEEN-এর বদলে half-open range সুবিধাজনক।",
  "Aggregate নয় এমন নির্বাচিত column সাধারণত GROUP BY-তে থাকা উচিত।",
  "WHERE সারির আগে, HAVING দল তৈরির পরে; অদলবদলে ফল বদলাতে পারে।",
  "ভুল join condition-এ সারি বহুগুণ বেড়ে যায়।",
  "ডান টেবিলের শর্ত WHERE-এ দিলে LEFT JOIN-এর না-মেলা সারি বাদ যেতে পারে।",
  "একই টেবিলের দুই ভূমিকার alias আলাদা রাখুন।",
  "দুই query-র column সংখ্যা ও type মিলতে হবে।",
  "প্রথম সত্য WHEN-ই জেতে; শর্তের ক্রম গুরুত্বপূর্ণ।",
  "Correlated subquery বারবার কাজ করতে পারে; plan দেখুন।",
  "Index-এ read সুবিধা থাকলেও প্রতিটি write-এ রক্ষণাবেক্ষণের খরচ আছে।",
  "ROW_NUMBER-এ tie হলে স্থায়ী ক্রমের জন্য unique ordering দরকার।",
];
