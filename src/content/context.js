export const contexts = [
  {
    need: ["A folder and a text file", "ফোল্ডার ও সাধারণ text file"],
    why: [
      "Git lets you save checkpoints, compare changes, and collaborate without passing folders named final-final.zip. A repository is your project plus its tracked history. The working tree is what you edit; the index is the exact content prepared for the next commit; HEAD identifies your current position.",
      "Git দিয়ে কাজের checkpoint রাখুন। Repository হলো project ও তার ইতিহাস। Working tree-তে লেখেন, staging area-তে কোন লেখা জমা দেবেন বাছেন, commit-এ তার স্থায়ী snapshot রাখেন। HEAD বলে আপনি এখন ইতিহাসের কোথায় আছেন।",
    ],
    analogy: [
      "Think of a notebook: your desk holds edits, an envelope holds selected pages, a dated archive holds saved copies, and a shared cupboard holds the team copy.",
      "খাতার নতুন লেখা টেবিলে, নির্বাচিত পাতা খামে, তারিখ দেওয়া কপি আলমারিতে, আর দলের কপি সবার গুদামে।",
    ],
    terms: [
      ["Repository", "Project plus tracked history", "প্রজেক্ট ও সংরক্ষিত ইতিহাস"],
      [
        "Commit",
        "A recorded snapshot with parent links",
        "সংরক্ষিত snapshot ও আগেরটির সংযোগ",
      ],
      [
        "Branch",
        "A movable name pointing to a commit",
        "commit-এর দিকে থাকা চলমান নাম",
      ],
      ["HEAD", "Your current position in history", "ইতিহাসে বর্তমান অবস্থান"],
    ],
  },
  {
    need: ["A terminal and the idea of folders", "টার্মিনাল ও ফোল্ডারের ধারণা"],
    why: [
      "Linux commands are small programs. The shell splits your typed line into a program name and arguments, runs it, and reports an exit status. Paths locate files; permissions determine who may access them. Standard output carries results and standard error carries diagnostics.",
      "Shell আপনার লেখা থেকে program ও argument আলাদা করে চালায়। Path হলো ফাইলের ঠিকানা। Permission বলে কে কী করতে পারবে। stdout-এ ফল ও stderr-এ সমস্যার বার্তা আসে। সফলতার exit code সাধারণত ০।",
    ],
    analogy: [
      "Treat the filesystem as a building: directories are rooms, paths are addresses, permissions are keys, and processes are people currently doing work.",
      "Filesystem একটি বাড়ি: directory হলো ঘর, path ঠিকানা, permission চাবি, process চলমান কর্মী।",
    ],
    terms: [
      ["Path", "Address of a file or directory", "ফাইল বা ফোল্ডারের ঠিকানা"],
      ["Process", "A running program instance", "চলমান program"],
      ["Argument", "An input passed to a program", "কমান্ডকে দেওয়া input"],
      ["Exit code", "Program completion status", "কাজ শেষের ফলসূচক নম্বর"],
    ],
  },
  {
    need: ["Rows, columns, and basic comparisons", "সারি, কলাম ও তুলনার ধারণা"],
    why: [
      "A relational table stores rows with named columns. A primary key identifies a row, and a foreign key links related rows. SQL describes the result you want; the optimizer chooses a physical plan. In this course, browser examples use SQLite and a small employee dataset.",
      "টেবিলের প্রতিটি সারি একটি রেকর্ড, কলাম একটি বৈশিষ্ট্য। Primary key আলাদা পরিচয় দেয়; foreign key অন্য টেবিলের সাথে সম্পর্ক করে। SQL-এ ফল কী চাই তা বলেন, database কীভাবে আনবে তা plan করে। এখানে browser-এ SQLite ব্যবহার হয়।",
    ],
    analogy: [
      "An employee register has one line per person. SQL is a precise instruction for selecting lines, combining registers, and calculating totals.",
      "কর্মীদের হাজিরা খাতায় এক লাইনে একজন। SQL দিয়ে নির্দিষ্ট লাইন বাছুন, অন্য খাতার সাথে মিলান, মোট হিসাব করুন।",
    ],
    terms: [
      ["Row", "One record", "একটি রেকর্ড"],
      ["Column", "One named field", "নাম দেওয়া একটি তথ্যের ঘর"],
      ["NULL", "Missing or unknown value", "অজানা বা অনুপস্থিত মান"],
      [
        "Query plan",
        "Database execution strategy",
        "database-এর কাজ করার পরিকল্পনা",
      ],
    ],
  },
  {
    need: [
      "Variables, loops, functions, and C# collections",
      "variable, loop, function ও collection",
    ],
    why: [
      "A data structure organizes values; an algorithm defines the steps that act on them. Before coding, write the input, expected output, and constraints. Trace a tiny example by hand. Big-O compares how work or extra memory grows as input size n grows; it does not give exact milliseconds.",
      "Data structure তথ্য সাজায়, algorithm কাজের ধাপ বলে। আগে input, output ও সীমা লিখুন। ছোট উদাহরণ হাতে চালান। Big-O বলে input বাড়লে কাজ বা বাড়তি memory কীভাবে বাড়ে; সরাসরি millisecond নয়।",
    ],
    analogy: [
      "Choose the right organizer before searching a room: a numbered shelf, labeled drawer, queue, and family tree solve different access problems.",
      "ঘর খোঁজার আগে সাজানোর পদ্ধতি বাছুন: নম্বরের তাক, নামের ড্রয়ার, লাইন ও বংশের গাছ আলাদা কাজে লাগে।",
    ],
    terms: [
      ["Index", "Zero-based position", "শূন্য থেকে গোনা অবস্থান"],
      [
        "Invariant",
        "A fact kept true throughout an algorithm",
        "সব ধাপে ঠিক রাখা নিয়ম",
      ],
      [
        "Time complexity",
        "How work grows with input",
        "input-এর সাথে কাজের বৃদ্ধি",
      ],
      ["Space complexity", "How extra memory grows", "বাড়তি memory-র বৃদ্ধি"],
    ],
  },
  {
    need: [
      "Classes, objects, methods, and interfaces",
      "class, object, method ও interface",
    ],
    why: [
      "A class describes data and behavior; an object is an instance of that description. An interface names a contract without forcing callers to know the implementation. Good design protects valid state, makes dependencies visible, and keeps changes local. Patterns are tools for real design pressure, not badges to collect.",
      "Class হলো গঠন, object সেই গঠন থেকে তৈরি একটি জিনিস। Interface কাজের চুক্তি বলে, ভেতরে কীভাবে করে তা নয়। ভালো design সঠিক state রক্ষা করে, নির্ভরতা স্পষ্ট করে ও ছোট জায়গায় পরিবর্তন রাখতে দেয়।",
    ],
    analogy: [
      "A restaurant works through roles: a customer asks a waiter, the waiter delegates to a cook, and recipes can change without teaching the customer kitchen details.",
      "রেস্টুরেন্টে ক্রেতা ওয়েটারকে বলেন; ওয়েটার রাঁধুনিকে দেন। রান্নার ভেতর বদলালেও ক্রেতাকে সব শেখাতে হয় না।",
    ],
    terms: [
      ["Class", "A type describing data and behavior", "তথ্য ও কাজের গঠন"],
      ["Object", "An instance of a type", "সেই গঠনের একটি instance"],
      ["Interface", "A behavior contract", "কাজের চুক্তি"],
      [
        "Dependency",
        "Another component needed to do work",
        "কাজে লাগা অন্য component",
      ],
    ],
  },
  {
    need: [
      "C# basics and the idea of an HTTP request",
      "C# ও HTTP request-এর ধারণা",
    ],
    why: [
      "A backend receives a request, validates inputs and identity, applies a business rule, interacts with storage, and returns a response. ASP.NET Core routes requests through middleware and endpoints. Keep each boundary explicit so errors, cancellation, and testing are manageable.",
      "Backend অনুরোধ নেয়, input ও পরিচয় যাচাই করে, ব্যবসার নিয়ম চালায়, প্রয়োজনে database-এ যায়, তারপর উত্তর দেয়। ASP.NET Core-এ middleware ও endpoint দিয়ে এই পথ তৈরি হয়।",
    ],
    analogy: [
      "A food order passes reception, order validation, kitchen work, and delivery. A backend pipeline similarly has distinct responsibilities.",
      "খাবারের অর্ডার রিসেপশন, যাচাই, রান্নাঘর ও ডেলিভারির ধাপ পেরোয়। Backend-ও আলাদা দায়িত্বের পথ।",
    ],
    terms: [
      [
        "Endpoint",
        "A request-handling address and operation",
        "অনুরোধ সামলানোর ঠিকানা ও কাজ",
      ],
      [
        "Middleware",
        "A component in the request pipeline",
        "request-এর পথের একটি ধাপ",
      ],
      [
        "DbContext",
        "EF Core unit for queries and tracked changes",
        "EF Core-এর query ও পরিবর্তনের একক",
      ],
      [
        "Async",
        "Waiting without blocking an entire thread",
        "পুরো thread আটকে না রেখে অপেক্ষা",
      ],
    ],
  },
  {
    need: [
      "HTTP, user input, identity, and server boundaries",
      "HTTP, input, পরিচয় ও server-এর সীমা",
    ],
    why: [
      "Security starts by identifying assets, trust boundaries, and threats. Every external input is untrusted until checked for its intended use. Authentication identifies the caller; authorization decides what that caller may do to a particular resource. Encode output, minimize privilege, and test the boundary that actually protects data.",
      "আগে কী রক্ষা করবেন ও কোথায় বিশ্বাসের সীমা, তা লিখুন। বাইরের input যাচাই না হওয়া পর্যন্ত অবিশ্বস্ত। Authentication পরিচয় জানে; authorization নির্দিষ্ট জিনিসে কাজের অনুমতি দেয়। Output encode করুন, কম অনুমতি দিন ও আসল সুরক্ষার সীমা পরীক্ষা করুন।",
    ],
    analogy: [
      "An ID card shows who someone is; a room key shows where they may enter. Both are needed, and a locked door must enforce the rule.",
      "পরিচয়পত্র বলে কে, চাবি বলে কোন ঘরে যেতে পারেন। দরজায় নিয়ম না থাকলে শুধু কাগজ যথেষ্ট নয়।",
    ],
    terms: [
      ["Authentication", "Verification of identity", "পরিচয় যাচাই"],
      [
        "Authorization",
        "Permission for an action/resource",
        "কাজ ও resource-এর অনুমতি",
      ],
      [
        "Threat model",
        "Assets, attackers, and possible failure paths",
        "সম্পদ, আক্রমণকারী ও ঝুঁকির মানচিত্র",
      ],
      [
        "Trust boundary",
        "Where data changes trust level",
        "বিশ্বাসের স্তর বদলানোর সীমা",
      ],
    ],
  },
  {
    need: [
      "Basic APIs, databases, and data structures",
      "API, database ও data structure",
    ],
    why: [
      "Backend engineering connects application code to CPU, memory, networks, databases, and operational needs. Trace one request end to end before adding abstractions. Define correctness first, then measure latency, throughput, resource use, and failure behavior.",
      "Backend engineering কোডকে CPU, memory, network, database ও পরিচালনার সাথে যুক্ত করে। আগে একটি request-এর পুরো পথ বুঝুন। সঠিকতা ঠিক করে তারপর সময়, গতি, resource ও ব্যর্থতা মাপুন।",
    ],
    analogy: [
      "A factory is more than one machine: storage, workers, transport, electricity, and quality control all constrain delivery.",
      "কারখানা শুধু একটি machine নয়; গুদাম, কর্মী, পরিবহন, বিদ্যুৎ ও মাননিয়ন্ত্রণ মিলে ফল দেয়।",
    ],
    terms: [
      ["Latency", "Time for one operation", "এক কাজের সময়"],
      ["Throughput", "Completed work per unit time", "সময়প্রতি শেষ হওয়া কাজ"],
      ["Bottleneck", "The limiting resource or stage", "গতির প্রধান বাধা"],
      ["Invariant", "A rule that must remain true", "অবশ্যই ঠিক থাকার নিয়ম"],
    ],
  },
  {
    need: [
      "HTTP, databases, and an ordinary single-server app",
      "HTTP, database ও এক server-এর অ্যাপ",
    ],
    why: [
      "System architecture begins with requirements and a simple baseline. Each extra cache, queue, replica, or service solves a particular problem while adding operational and consistency costs. A diagram should explain data ownership, request flow, and behavior when a component fails.",
      "প্রথমে চাহিদা ও সহজ নকশা। Cache, queue, replica বা service যোগ করলে একটি সমস্যা কমে, কিন্তু নতুন খরচ ও নিয়ম আসে। Diagram-এ কার ডেটা কোথায়, request কোন পথে যায় ও নষ্ট হলে কী হয়, তা দেখান।",
    ],
    analogy: [
      "Expand a busy shop only after knowing whether the queue is caused by one cashier, slow cooking, or limited stock.",
      "দোকানে ভিড় হলেই কাউন্টার বাড়াবেন না; সমস্যা ক্যাশিয়ার, রান্না নাকি স্টক—আগে জানুন।",
    ],
    terms: [
      [
        "Replica",
        "Another copy of a service or data",
        "সেবা বা তথ্যের আরেক কপি",
      ],
      [
        "Consistency",
        "Which updates readers may observe",
        "পাঠক কোন পরিবর্তন দেখতে পাবে",
      ],
      [
        "Availability",
        "Ability to serve requests under a definition",
        "নির্দিষ্ট অর্থে উত্তর দেওয়ার সামর্থ্য",
      ],
      [
        "Failure domain",
        "Components that can fail together",
        "একসাথে ব্যর্থ হতে পারে এমন এলাকা",
      ],
    ],
  },
  {
    need: ["Core system-design building blocks", "সিস্টেম design-এর মূল উপাদান"],
    why: [
      "In a design exercise, ask questions before drawing boxes. Specify users, main operations, traffic, data size, consistency needs, and service goals. Build a baseline, trace writes and reads, find bottlenecks, then add a justified improvement.",
      "Design প্রশ্নে আগে ব্যবহারকারী, কাজ, traffic, data, consistency ও লক্ষ্য জানুন। সহজ নকশা করুন, write ও read-এর পথ দেখুন, বাধা খুঁজে যুক্তিসহ উন্নতি যোগ করুন।",
    ],
    analogy: [
      "A city plan depends on population and traffic, not on how many roads you can draw.",
      "শহরের নকশা জনসংখ্যা ও চলাচল দেখে হয়, কত রাস্তা আঁকা যায় তা দেখে নয়।",
    ],
    terms: [
      [
        "Requirement",
        "Behavior or constraint the design must meet",
        "নকশাকে মানতে হবে এমন চাহিদা",
      ],
      [
        "Trade-off",
        "A benefit gained with a cost",
        "এক সুবিধার বিনিময়ে অন্য খরচ",
      ],
      [
        "SLO",
        "A measurable service-level objective",
        "মাপা যায় এমন সেবার লক্ষ্য",
      ],
      [
        "Capacity",
        "Work a system can handle within goals",
        "লক্ষ্যের মধ্যে সামলানো কাজের সীমা",
      ],
    ],
  },
  {
    need: [
      "Requests, logs, basic database and infrastructure ideas",
      "request, log, database ও infrastructure",
    ],
    why: [
      "An incident begins with a user-visible symptom. Gather evidence, compare recent changes, and identify the constrained component before changing architecture. Apply the smallest safe mitigation, verify the user-facing metric, and document prevention and recovery.",
      "Incident-এ আগে ব্যবহারকারীর সমস্যা দেখুন। প্রমাণ, সাম্প্রতিক পরিবর্তন ও আসল বাধা খুঁজুন। ছোট নিরাপদ প্রতিকার দিন, ব্যবহারকারীর metric ঠিক হলো কি না দেখুন, তারপর প্রতিরোধ লিখুন।",
    ],
    analogy: [
      "A fever is a symptom; a diagnosis identifies the cause. Scaling every server is like prescribing the same medicine for every illness.",
      "জ্বর লক্ষণ; পরীক্ষা করে কারণ জানতে হয়। সব server বাড়ানো সব রোগে একই ওষুধ দেওয়ার মতো।",
    ],
    terms: [
      ["Symptom", "What the user observes", "ব্যবহারকারীর দেখা সমস্যা"],
      ["Root cause", "Underlying reason for failure", "সমস্যার মূল কারণ"],
      [
        "Mitigation",
        "Action reducing current impact",
        "বর্তমান ক্ষতি কমানোর কাজ",
      ],
      ["Runbook", "A tested response procedure", "পরীক্ষিত সমাধানের ধাপ"],
    ],
  },
  {
    need: [
      "An application process and basic Linux files",
      "process ও Linux file-এর ধারণা",
    ],
    why: [
      "An image is a layered filesystem plus configuration. A container starts a process from an image with isolation and resource controls. Its writable layer is usually disposable; persistent data needs a volume or external storage. A registry distributes images by tags and immutable digests.",
      "Image হলো স্তরভিত্তিক ফাইল ও সেটিংস। Container সেই image থেকে process চালায়। তার নিজের লেখা স্তর সাধারণত অস্থায়ী, তাই স্থায়ী ডেটা volume বা বাইরে রাখুন। Registry image বিতরণ করে।",
    ],
    analogy: [
      "An image is a recipe and prepared ingredients; a container is one cooking session. Important records should not live only on the temporary kitchen counter.",
      "Image রান্নার প্রস্তুত রেসিপি; container একবারের রান্না। জরুরি হিসাব শুধু অস্থায়ী টেবিলে রাখবেন না।",
    ],
    terms: [
      [
        "Image",
        "Immutable layered application package",
        "স্তরভিত্তিক অ্যাপের প্যাকেট",
      ],
      [
        "Container",
        "An isolated running process environment",
        "আলাদা পরিবেশে চলমান process",
      ],
      [
        "Volume",
        "Storage outside the disposable writable layer",
        "অস্থায়ী layer-এর বাইরে storage",
      ],
      [
        "Registry",
        "Service distributing container images",
        "image রাখার ও বিতরণের service",
      ],
    ],
  },
  {
    need: [
      "Containers, networks, and declarative YAML",
      "container, network ও YAML",
    ],
    why: [
      "Kubernetes reconciles desired state through controllers. Pods run containers; Deployments manage replicas; Services provide stable discovery; Ingress or gateways route external requests. A resource belongs to a context and often a namespace, so verify both before any command.",
      "Kubernetes লিখিত কাঙ্ক্ষিত অবস্থার সাথে বাস্তব মিলিয়ে রাখে। Pod-এ container, Deployment-এ কপির নিয়ম, Service-এ স্থায়ী ঠিকানা। কমান্ডের আগে context ও namespace যাচাই করুন।",
    ],
    analogy: [
      "A school timetable says which classes should exist; controllers keep assigning rooms and teachers when something changes.",
      "স্কুলের routine-এ কোন class চাই লেখা থাকে; ঘর বা শিক্ষক বদলালে পরিচালনা ব্যবস্থা আবার মিলিয়ে দেয়।",
    ],
    terms: [
      [
        "Pod",
        "Smallest schedulable workload unit",
        "চালানোর ক্ষুদ্র workload একক",
      ],
      [
        "Deployment",
        "Controller managing replicated pods",
        "pod-এর কপি সামলানো controller",
      ],
      [
        "Service",
        "Stable discovery/routing over selected pods",
        "নির্বাচিত pod-এর স্থায়ী ঠিকানা",
      ],
      [
        "Namespace",
        "Logical resource boundary",
        "resource-এর আলাদা logical এলাকা",
      ],
    ],
  },
  {
    need: [
      "Basic networking, storage, and identity",
      "network, storage ও পরিচয়ের ধারণা",
    ],
    why: [
      "AWS resources exist in accounts and often regions. IAM controls access; VPC networking controls reachability; services provide different managed capabilities. The shared-responsibility model leaves your data, permissions, and application behavior under your control. CLI commands here are reference examples, not live cloud operations.",
      "AWS-এ account ও region আগে বুঝুন। IAM অনুমতি, VPC যোগাযোগের পথ, service নির্দিষ্ট সুবিধা দেয়। আপনার data, অনুমতি ও অ্যাপের আচরণের দায়িত্ব আপনার। এখানে CLI উদাহরণ reference, cloud-এ চালানো হয় না।",
    ],
    analogy: [
      "Cloud is a rented workshop: the owner maintains the building, but you still lock your tools, manage staff access, and pay for what you use.",
      "Cloud ভাড়ার workshop: মালিক বাড়ি সামলান, কিন্তু যন্ত্রের তালা, কর্মীর অনুমতি ও খরচ আপনার।",
    ],
    terms: [
      [
        "Region",
        "A geographic group of cloud locations",
        "cloud-এর ভৌগোলিক এলাকা",
      ],
      [
        "Availability zone",
        "An isolated location within a region",
        "region-এর আলাদা failure এলাকা",
      ],
      [
        "IAM role",
        "An assumable set of scoped permissions",
        "নেওয়া যায় এমন সীমিত অনুমতি",
      ],
      [
        "Managed service",
        "Provider-operated infrastructure capability",
        "provider পরিচালিত সুবিধা",
      ],
    ],
  },
  {
    need: [
      "Git, a working app, and basic deployment ideas",
      "Git, কাজ করা অ্যাপ ও deployment",
    ],
    why: [
      "DevOps connects development and operations through reproducible builds, automation, feedback, and shared ownership. A release should identify its exact source and artifact, pass relevant checks, and have a recovery path. Infrastructure and pipeline configuration are code and need review.",
      "DevOps-এ build, test, প্রকাশ ও feedback এক নিয়মে আসে। কোন source থেকে কোন artifact, কী check পাস করেছে ও ফিরবেন কীভাবে—প্রকাশের আগে জানুন। Pipeline ও infrastructure-ও review করা code।",
    ],
    analogy: [
      "A reliable delivery line labels each package, checks quality, tracks its route, and knows how to recall a faulty batch.",
      "ভালো delivery ব্যবস্থায় প্যাকেটের পরিচয়, মান পরীক্ষা, পথের খবর ও ভুল batch ফেরানোর উপায় থাকে।",
    ],
    terms: [
      ["Artifact", "The built output being released", "প্রকাশের তৈরি প্যাকেট"],
      ["Pipeline", "Ordered automated delivery steps", "স্বয়ংক্রিয় কাজের ধারা"],
      [
        "Rollback",
        "Restore a previously working release",
        "আগের কাজ করা প্রকাশে ফেরা",
      ],
      [
        "Infrastructure as code",
        "Versioned resource configuration",
        "ইতিহাসসহ resource-এর নকশা",
      ],
    ],
  },
  {
    need: [
      "APIs, C# types, async work, and data privacy basics",
      "API, C# type, async ও data privacy",
    ],
    why: [
      "An AI application is a system around a model: input preparation, retrieval, tools, permissions, output validation, evaluation, and observability. Model output is probabilistic. Keep deterministic business rules and authorization in application code, and measure success on representative tasks.",
      "AI অ্যাপ শুধু model নয়: input, retrieval, tool, অনুমতি, output যাচাই, eval ও trace মিলে তৈরি। Model-এর ফল নিশ্চিত নয়। ব্যবসার নিয়ম ও অনুমতি কোডে রাখুন, বাস্তব প্রশ্নে ফল মাপুন।",
    ],
    analogy: [
      "A new assistant can draft useful work, but needs relevant documents, limited permissions, clear tasks, and checks before important actions.",
      "নতুন সহকারীকে দরকারি বই, সীমিত অনুমতি, স্পষ্ট কাজ ও গুরুত্বপূর্ণ পদক্ষেপের আগে যাচাই দিন।",
    ],
    terms: [
      ["Token", "A model-specific unit of text", "model-এর লেখার ক্ষুদ্র একক"],
      [
        "Embedding",
        "A numeric representation for similarity",
        "অর্থের কাছাকাছি খোঁজার সংখ্যার রূপ",
      ],
      [
        "Tool",
        "An application-controlled external action",
        "অ্যাপ নিয়ন্ত্রিত বাইরের কাজ",
      ],
      [
        "Evaluation",
        "Repeatable measurement against criteria",
        "নিয়ম মেনে বারবার ফল পরীক্ষা",
      ],
    ],
  },
];
