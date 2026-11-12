// Module 16 "AI Engineering 2028": easy story, plain theory, steps, mistakes, future tip.
export default {
  "AI-Assisted Coding Workflow": {
    s: [
      "Imagine a very fast assistant cook in your restaurant kitchen. He can chop, mix and cook ten dishes while you finish one, but sometimes he adds sugar instead of salt. A good head chef gives clear orders, tastes every dish before it leaves the kitchen, and never lets the assistant decide the menu alone.",
      "ভাবুন রেস্তোরাঁর রান্নাঘরে খুব দ্রুত এক সহকারী রাঁধুনি আছে। আপনি একটি পদ শেষ করার আগেই সে দশটি পদ কাটে, মেশায়, রাঁধে, কিন্তু মাঝে মাঝে লবণের বদলে চিনি দেয়। ভালো প্রধান রাঁধুনি স্পষ্ট নির্দেশ দেন, প্রতিটি পদ বাইরে যাওয়ার আগে চেখে দেখেন, আর সহকারীকে একা menu ঠিক করতে দেন না।",
    ],
    t: [
      "AI coding tools predict code from patterns they learned. They are excellent at boilerplate, tests, refactors and explaining unfamiliar code, and weaker at your hidden business rules and security details. Your job shifts from typing every line to specifying, reviewing and verifying. The workflow is: small task, good context, AI draft, human review, tests, commit.",
      "AI coding tool শেখা pattern থেকে code অনুমান করে। Boilerplate, test, refactor ও অচেনা code বোঝাতে এরা দারুণ, কিন্তু আপনার গোপন ব্যবসার নিয়ম ও নিরাপত্তার খুঁটিনাটিতে দুর্বল। আপনার কাজ প্রতিটি লাইন টাইপ করা থেকে বদলে হয় নির্দিষ্ট করা, review ও যাচাই করা। ধারা: ছোট কাজ, ভালো context, AI-এর খসড়া, মানুষের review, test, commit।",
    ],
    p: [
      ["Create a branch and write the task in 2-3 clear sentences with an example.", "Branch বানান এবং উদাহরণসহ ২-৩টি স্পষ্ট বাক্যে কাজটি লিখুন।"],
      ["Point the assistant to the relevant files and your instructions file (AGENTS.md).", "Assistant-কে দরকারি file ও আপনার instruction file (AGENTS.md) দেখান।"],
      ["Read the full diff line by line; ask the AI to explain anything unclear.", "পুরো diff লাইন ধরে পড়ুন; অস্পষ্ট কিছু থাকলে AI-কে ব্যাখ্যা করতে বলুন।"],
      ["Run tests and the app yourself, then commit with a clear message.", "নিজে test ও app চালান, তারপর স্পষ্ট message দিয়ে commit করুন।"],
    ],
    m: [
      "Accepting a huge change you did not read; letting the assistant add packages or disable tests to make the build pass; pasting secrets or customer data into prompts; trusting a confident explanation of an API that does not exist (always check the docs or compile it).",
      "না পড়ে বিশাল পরিবর্তন মেনে নেওয়া; build পাস করাতে assistant-কে package যোগ বা test বন্ধ করতে দেওয়া; prompt-এ secret বা ক্রেতার data দেওয়া; নেই এমন API-র আত্মবিশ্বাসী ব্যাখ্যা বিশ্বাস করা (সবসময় docs দেখুন বা compile করুন)।",
    ],
    f: [
      "In 2028 interviews, expect to be asked how you use AI tools, and to review AI-written code for bugs live. Practise reading code critically: find the missing null check, the SQL injection, the off-by-one. Reviewing is the skill AI cannot replace.",
      "২০২৮-এর interview-এ জিজ্ঞেস করা হতে পারে আপনি কীভাবে AI tool ব্যবহার করেন, আর সরাসরি AI-লেখা code-এ bug খুঁজতে বলা হতে পারে। সমালোচনার চোখে code পড়া অনুশীলন করুন: বাদ পড়া null check, SQL injection, off-by-one খুঁজুন। Review করাই সেই দক্ষতা যা AI বদলাতে পারে না।",
    ],
    x: [],
  },
  "Spec-Driven Development": {
    s: [
      "Before building a house, the owner and the builder agree on a drawing: how many rooms, where the doors go, how big the windows are. Builders (and now AI helpers) follow the drawing. If the owner changes their mind, they change the drawing first, so everybody builds the same house.",
      "বাড়ি বানানোর আগে মালিক ও নির্মাতা একটি নকশায় একমত হন: কয়টি ঘর, দরজা কোথায়, জানালা কত বড়। নির্মাতারা (এখন AI সাহায্যকারীরাও) নকশা মেনে কাজ করেন। মালিক মত বদলালে আগে নকশা বদলান, যাতে সবাই একই বাড়ি বানায়।",
    ],
    t: [
      "A spec answers: what problem, what inputs, what outputs, which rules, which examples, what is out of scope. Examples with real numbers remove ambiguity and turn directly into tests. When an AI assistant implements from a spec, you can check its work against the examples instead of arguing about intent.",
      "Spec উত্তর দেয়: কী সমস্যা, কী input, কী output, কোন নিয়ম, কোন উদাহরণ, কী বাইরে। আসল সংখ্যার উদাহরণ দ্ব্যর্থতা দূর করে এবং সরাসরি test হয়ে যায়। AI assistant spec থেকে বানালে উদ্দেশ্য নিয়ে তর্ক না করে উদাহরণের সাথে তার কাজ মিলিয়ে দেখা যায়।",
    ],
    p: [
      ["Write the goal in one sentence.", "এক বাক্যে লক্ষ্য লিখুন।"],
      ["List rules as numbered lines with exact values.", "নিয়মগুলো নির্দিষ্ট মানসহ নম্বর দিয়ে লিখুন।"],
      ["Add 4-6 examples, including boundaries and an error case.", "সীমা ও একটি error case-সহ ৪-৬টি উদাহরণ দিন।"],
      ["Turn examples into tests, then implement (by hand or with AI) until they pass.", "উদাহরণকে test বানান, তারপর (হাতে বা AI দিয়ে) test পাস না করা পর্যন্ত বানান।"],
    ],
    m: [
      "Specs full of words like 'fast', 'user-friendly' or 'handle errors properly' with no numbers; skipping boundary examples (exactly 5000); never updating the spec after a decision in chat; writing a 10-page spec that nobody reads.",
      "সংখ্যা ছাড়া 'দ্রুত', 'ব্যবহারবান্ধব' বা 'error ঠিকমতো সামলাও' দিয়ে ভরা spec; সীমার উদাহরণ (ঠিক 5000) বাদ দেওয়া; chat-এ সিদ্ধান্তের পর spec আপডেট না করা; ১০ পাতার spec যা কেউ পড়ে না।",
    ],
    f: [
      "Teams increasingly hand specs to coding agents and review the result. Engineers who write crisp specs get better AI output and move faster. Practise by writing a spec for every feature in this course before you code it.",
      "দলগুলো ক্রমশ coding agent-কে spec দিয়ে ফল review করছে। যারা পরিষ্কার spec লেখে, তারা ভালো AI output পায় ও দ্রুত এগোয়। এই course-এর প্রতিটি feature code করার আগে spec লিখে অনুশীলন করুন।",
    ],
    x: [],
  },
  "IChatClient in .NET": {
    s: [
      "Your phone charger has a standard USB-C plug. You can plug it into any brand's phone. IChatClient is the USB-C of AI in .NET: your app has one standard plug, and OpenAI, Azure, Ollama or another provider fits behind it.",
      "আপনার phone charger-এ মানক USB-C plug আছে, যেকোনো brand-এর phone-এ লাগানো যায়। .NET-এ AI-এর USB-C হলো IChatClient: আপনার app-এ একটি মানক plug, তার পিছনে OpenAI, Azure, Ollama বা অন্য provider বসে।",
    ],
    t: [
      "You send a list of messages (system, user, assistant) and get a response. System messages set rules and tone; user messages carry questions; assistant messages are earlier answers. The model remembers nothing between calls, so you keep the history list and send it each time. Options control randomness (temperature) and length (max output tokens).",
      "আপনি message-এর তালিকা (system, user, assistant) পাঠান এবং উত্তর পান। System message নিয়ম ও সুর ঠিক করে; user message-এ প্রশ্ন; assistant message আগের উত্তর। Model দুই call-এর মাঝে কিছু মনে রাখে না, তাই ইতিহাসের তালিকা রেখে প্রতিবার পাঠান। Option দিয়ে এলোমেলোভাব (temperature) ও দৈর্ঘ্য (max output token) নিয়ন্ত্রণ হয়।",
    ],
    p: [
      ["Add the Microsoft.Extensions.AI package and a provider package.", "Microsoft.Extensions.AI ও একটি provider package যোগ করুন।"],
      ["Store the API key in user-secrets or environment variables.", "API key user-secrets বা environment variable-এ রাখুন।"],
      ["Register the client with AddChatClient and inject IChatClient.", "AddChatClient দিয়ে client register করে IChatClient inject করুন।"],
      ["Call GetResponseAsync with a system message, user message and options.", "System message, user message ও option দিয়ে GetResponseAsync ডাকুন।"],
    ],
    m: [
      "Putting the API key in appsettings.json committed to Git; forgetting history so the bot 'forgets' the previous question; sending unlimited history until it hits the context limit; no timeout or cancellation, so slow calls pile up.",
      "Git-এ commit করা appsettings.json-এ API key রাখা; ইতিহাস না পাঠানোয় bot আগের প্রশ্ন 'ভুলে যায়'; context সীমা না ছোঁয়া পর্যন্ত সীমাহীন ইতিহাস পাঠানো; timeout বা cancellation না থাকায় ধীর call জমে যায়।",
    ],
    f: [
      "Provider APIs will keep changing, but abstractions like IChatClient let your code survive those changes. Learn the abstraction well and treat any one provider as a replaceable detail.",
      "Provider-এর API বদলাতেই থাকবে, কিন্তু IChatClient-এর মতো abstraction আপনার code-কে সেই পরিবর্তন থেকে বাঁচায়। Abstraction ভালো করে শিখুন এবং যেকোনো provider-কে বদলযোগ্য অংশ ভাবুন।",
    ],
    x: [],
  },
  "Streaming AI Responses": {
    s: [
      "When a teacher writes on the board, you read each word as the chalk moves; you do not wait until the whole paragraph is finished. Streaming does the same for AI answers: words appear while the model is still thinking of the rest.",
      "শিক্ষক বোর্ডে লিখলে চক নড়ার সাথে সাথে আপনি প্রতিটি শব্দ পড়েন; পুরো অনুচ্ছেদ শেষ হওয়ার অপেক্ষা করেন না। Streaming AI-এর উত্তরে একই কাজ করে: model বাকিটা ভাবতে ভাবতেই শব্দ দেখা যায়।",
    ],
    t: [
      "Without streaming, the server waits for the full answer, then sends it. With streaming, the server forwards small updates as they arrive. In C#, await foreach reads them one by one. On the web, Server-Sent Events keep one HTTP response open and push lines that start with 'data:'. Cancellation stops generation (and cost) when the user leaves.",
      "Streaming ছাড়া server পুরো উত্তরের অপেক্ষা করে, তারপর পাঠায়। Streaming-এ server ছোট update আসামাত্র পাঠায়। C#-এ await foreach একে একে পড়ে। Web-এ Server-Sent Events একটি HTTP response খোলা রেখে 'data:' দিয়ে শুরু লাইন পাঠায়। User চলে গেলে cancellation তৈরি (ও খরচ) থামায়।",
    ],
    p: [
      ["Call GetStreamingResponseAsync instead of GetResponseAsync.", "GetResponseAsync-এর বদলে GetStreamingResponseAsync ডাকুন।"],
      ["Loop with await foreach and write each update.Text.", "await foreach দিয়ে loop করে প্রতিটি update.Text লিখুন।"],
      ["In ASP.NET Core set Content-Type text/event-stream and flush after each chunk.", "ASP.NET Core-এ Content-Type text/event-stream দিন এবং প্রতিটি টুকরোর পর flush করুন।"],
      ["Pass the request CancellationToken and keep the full text for logging.", "Request-এর CancellationToken দিন এবং log-এর জন্য পুরো লেখা রাখুন।"],
    ],
    m: [
      "Forgetting to flush, so the browser still receives everything at the end; proxies (Nginx) buffering the stream; parsing JSON from a half-finished stream; not handling a stream that breaks in the middle.",
      "Flush ভুলে যাওয়ায় browser শেষে সব একসাথে পায়; proxy (Nginx) stream buffer করে রাখে; অর্ধেক stream থেকে JSON parse করা; মাঝপথে ভাঙা stream না সামলানো।",
    ],
    f: [
      "Users now expect AI interfaces to feel instant. Know your time-to-first-token and keep it under about one second; it matters more to users than total generation time.",
      "এখন user AI interface-কে তাৎক্ষণিক মনে করতে চায়। আপনার time-to-first-token জানুন এবং প্রায় এক সেকেন্ডের নিচে রাখুন; user-এর কাছে এটি মোট সময়ের চেয়ে বেশি গুরুত্বপূর্ণ।",
    ],
    x: [],
  },
  "Function Calling in C#": {
    s: [
      "A receptionist cannot see the warehouse, but she can phone the storekeeper: 'Is order A-1042 packed?' The storekeeper checks and replies, and she tells the customer. The model is the receptionist, your C# method is the storekeeper, and the phone call is a tool call.",
      "Receptionist গুদাম দেখতে পান না, কিন্তু গুদামরক্ষককে ফোন করতে পারেন: 'A-1042 order কি pack হয়েছে?' গুদামরক্ষক দেখে উত্তর দেন, তিনি ক্রেতাকে জানান। Model হলো receptionist, আপনার C# method গুদামরক্ষক, আর ফোন কলটি হলো tool call।",
    ],
    t: [
      "Models only produce text, so they cannot read your database. Function calling gives them a menu of functions with descriptions. The model replies 'please call get_order_status with orderId A-1042'. Your code runs it, returns the result, and the model writes a normal answer. You decide which functions exist and check every argument.",
      "Model শুধু লেখা তৈরি করে, তাই আপনার database পড়তে পারে না। Function calling তাকে বিবরণসহ function-এর menu দেয়। Model উত্তর দেয় 'orderId A-1042 দিয়ে get_order_status ডাকো'। আপনার code চালিয়ে ফল ফেরত দেয়, model সাধারণ উত্তর লেখে। কোন function থাকবে তা আপনি ঠিক করেন এবং প্রতিটি argument যাচাই করেন।",
    ],
    p: [
      ["Write a small C# method that does one job.", "একটি কাজ করে এমন ছোট C# method লিখুন।"],
      ["Wrap it with AIFunctionFactory.Create and a clear description.", "AIFunctionFactory.Create ও স্পষ্ট বিবরণ দিয়ে মোড়ান।"],
      ["Add it to ChatOptions.Tools and enable UseFunctionInvocation().", "ChatOptions.Tools-এ দিন এবং UseFunctionInvocation() চালু করুন।"],
      ["Inside the method, validate input and check the user's permission.", "Method-এর ভিতরে input যাচাই ও user-এর অনুমতি পরীক্ষা করুন।"],
    ],
    m: [
      "Vague tool descriptions so the model calls the wrong tool; one giant 'run_sql' tool that can do anything; trusting the orderId the model passes without checking ownership; letting a tool loop run without a limit.",
      "অস্পষ্ট tool বিবরণে model ভুল tool ডাকে; সবকিছু করতে পারে এমন একটি বিশাল 'run_sql' tool; মালিকানা না দেখে model-এর দেওয়া orderId বিশ্বাস করা; সীমা ছাড়া tool loop চলতে দেওয়া।",
    ],
    f: [
      "Tool use is how AI moves from chatting to doing. Engineers who design safe, well-described, permission-aware tools will build most of the valuable AI features in the next few years.",
      "Tool ব্যবহারেই AI কথা বলা থেকে কাজ করায় যায়। যারা নিরাপদ, ভালো বর্ণনাসহ ও অনুমতি-সচেতন tool design করবে, তারাই আগামী কয়েক বছরের বেশিরভাগ মূল্যবান AI feature বানাবে।",
    ],
    x: [],
  },
  "Build an MCP Server in C#": {
    s: [
      "Every country uses different power plugs, which is why travellers carry adapters. MCP is like one universal socket for AI: build your tool once with an MCP plug, and Claude, VS Code, and other AI apps can all plug in without special adapters.",
      "প্রতিটি দেশের power plug আলাদা, তাই ভ্রমণকারী adapter নিয়ে ঘোরে। MCP হলো AI-এর জন্য একটি সার্বজনীন socket: MCP plug দিয়ে একবার tool বানান, Claude, VS Code ও অন্যান্য AI app বিশেষ adapter ছাড়াই যুক্ত হতে পারে।",
    ],
    t: [
      "An MCP server is a small program that says 'here are my tools' and runs them when asked. The AI app starts your server (or connects over HTTP), lists the tools, and calls them when the model needs them. In C#, you mark a class with [McpServerToolType] and methods with [McpServerTool] and a description; the SDK handles the protocol.",
      "MCP server একটি ছোট program, যা বলে 'এই আমার tool' এবং চাইলে চালায়। AI app আপনার server চালু করে (বা HTTP-তে যুক্ত হয়), tool-এর তালিকা নেয়, model-এর দরকারে ডাকে। C#-এ class-এ [McpServerToolType] আর method-এ [McpServerTool] ও বিবরণ দিন; SDK protocol সামলায়।",
    ],
    p: [
      ["Create a console app and add the ModelContextProtocol and Hosting packages.", "Console app বানিয়ে ModelContextProtocol ও Hosting package যোগ করুন।"],
      ["Register AddMcpServer().WithStdioServerTransport().WithToolsFromAssembly().", "AddMcpServer().WithStdioServerTransport().WithToolsFromAssembly() register করুন।"],
      ["Write static tool methods with clear descriptions and simple parameters.", "স্পষ্ট বিবরণ ও সহজ parameter-সহ static tool method লিখুন।"],
      ["Add the server to your AI app's MCP config and ask a question that needs the tool.", "AI app-এর MCP config-এ server যোগ করে এমন প্রশ্ন করুন যাতে tool লাগে।"],
    ],
    m: [
      "Writing logs to stdout (it breaks the protocol; use stderr); exposing a tool that deletes or pays without confirmation; returning huge outputs that waste the model's context; installing unknown third-party MCP servers without reading what they can access.",
      "stdout-এ log লেখা (protocol ভাঙে; stderr ব্যবহার করুন); নিশ্চিতকরণ ছাড়া মুছে ফেলা বা টাকা দেওয়ার tool দেওয়া; বিশাল output ফেরত দিয়ে model-এর context নষ্ট করা; কী access পায় না পড়ে অজানা third-party MCP server install করা।",
    ],
    f: [
      "MCP is becoming the common way to connect AI to company systems. Being able to wrap an internal API as a secure MCP server is a practical, in-demand skill for backend engineers.",
      "AI-কে কোম্পানির system-এর সাথে যুক্ত করার সাধারণ উপায় হয়ে উঠছে MCP। ভিতরের API-কে নিরাপদ MCP server হিসেবে মোড়াতে পারা backend engineer-দের ব্যবহারিক ও চাহিদাসম্পন্ন দক্ষতা।",
    ],
    x: [],
  },
  "Embeddings and Vector Search in .NET": {
    s: [
      "In a library, books on the same subject sit on nearby shelves. If you find one good book about cooking, the next books are probably about cooking too. Embeddings put every piece of text on a 'meaning shelf', so questions land next to the paragraphs that answer them.",
      "Library-তে একই বিষয়ের বই কাছাকাছি তাকে থাকে। রান্নার একটি ভালো বই পেলে পাশের বইগুলোও সম্ভবত রান্নার। Embedding প্রতিটি লেখাকে 'অর্থের তাকে' বসায়, ফলে প্রশ্ন সেই অনুচ্ছেদের পাশে পড়ে যা তার উত্তর দেয়।",
    ],
    t: [
      "An embedding is a list of numbers that represents meaning. To answer from your own documents (RAG): split them into chunks, compute an embedding for each chunk, and store them. For a question, compute its embedding, find the closest chunks with cosine similarity, and give only those chunks to the chat model with the instruction to answer from them.",
      "Embedding হলো অর্থ প্রকাশ করা সংখ্যার তালিকা। নিজের document থেকে উত্তর দিতে (RAG): document-কে chunk-এ ভাগ করুন, প্রতিটির embedding বানিয়ে রাখুন। প্রশ্নের embedding বানিয়ে cosine similarity দিয়ে সবচেয়ে কাছের chunk খুঁজুন, শুধু সেগুলো chat model-কে দিন, সাথে নির্দেশ: এগুলো থেকে উত্তর দাও।",
    ],
    p: [
      ["Split documents into chunks of a few paragraphs.", "Document-কে কয়েক অনুচ্ছেদের chunk-এ ভাগ করুন।"],
      ["Embed each chunk and store vector, text, URL and permissions.", "প্রতিটি chunk-এর embedding বানিয়ে vector, লেখা, URL ও অনুমতি রাখুন।"],
      ["Embed the question and take the top 3-5 most similar chunks.", "প্রশ্নের embedding বানিয়ে সবচেয়ে কাছের ৩-৫টি chunk নিন।"],
      ["Send chunks + question to the model and show the sources with the answer.", "Chunk ও প্রশ্ন model-এ পাঠান এবং উত্তরের সাথে উৎস দেখান।"],
    ],
    m: [
      "Chunks that are too big (mixed topics) or too small (no context); using different embedding models for documents and questions; ignoring permissions, so users see documents they should not; never measuring whether the right chunk was retrieved.",
      "খুব বড় (মিশ্র বিষয়) বা খুব ছোট (context নেই) chunk; document ও প্রশ্নে ভিন্ন embedding model; অনুমতি উপেক্ষা করায় user নিষিদ্ধ document দেখে; সঠিক chunk এসেছে কি না কখনো না মাপা।",
    ],
    f: [
      "Most business AI features are 'chat with our data'. Retrieval quality usually matters more than which model you use. Learn to measure retrieval (did the right chunk come back?) and you will fix most RAG problems quickly.",
      "বেশিরভাগ ব্যবসায়িক AI feature হলো 'আমাদের data-র সাথে কথা'। কোন model ব্যবহার করছেন তার চেয়ে retrieval-এর মান সাধারণত বেশি গুরুত্বপূর্ণ। Retrieval মাপতে শিখুন (সঠিক chunk কি এল?), বেশিরভাগ RAG সমস্যা দ্রুত ঠিক করতে পারবেন।",
    ],
    x: [],
  },
  "Hybrid Search": {
    s: [
      "To find a friend at a crowded fair, you can shout their exact name (keyword search) or look for someone who looks and dresses like them (meaning search). Doing both together finds them fastest: the name catches the exact match, the look catches them even if they did not hear you.",
      "ভিড়ের মেলায় বন্ধুকে খুঁজতে তার হুবহু নাম ধরে ডাকতে পারেন (keyword search), বা তার মতো দেখতে ও পোশাক পরা কাউকে খুঁজতে পারেন (অর্থের search)। দুটো একসাথে করলে সবচেয়ে দ্রুত পাওয়া যায়: নাম হুবহু মিল ধরে, চেহারা ধরে সে না শুনলেও।",
    ],
    t: [
      "Keyword search is precise for exact words but blind to synonyms. Vector search understands meaning but can miss rare codes and names. Hybrid search runs both and merges the two ranked lists. Reciprocal Rank Fusion is a simple merge: a document gets more points for appearing near the top of either list, and the points are added.",
      "Keyword search হুবহু শব্দে নিখুঁত, কিন্তু সমার্থক শব্দ দেখে না। Vector search অর্থ বোঝে, কিন্তু বিরল code ও নাম হারাতে পারে। Hybrid search দুটো চালিয়ে দুই ranked তালিকা মেলায়। Reciprocal Rank Fusion একটি সহজ মিলন: যেকোনো তালিকার উপরের দিকে থাকলে document বেশি নম্বর পায়, আর নম্বর যোগ হয়।",
    ],
    p: [
      ["Run a keyword (full-text) search and keep the top 20.", "Keyword (full-text) search চালিয়ে শীর্ষ ২০টি রাখুন।"],
      ["Run a vector search and keep the top 20.", "Vector search চালিয়ে শীর্ষ ২০টি রাখুন।"],
      ["Give each result 1/(60 + rank) points from each list and add them.", "প্রতিটি তালিকা থেকে প্রতিটি ফলকে 1/(60 + rank) নম্বর দিয়ে যোগ করুন।"],
      ["Sort by total points, optionally rerank, and keep the top 5.", "মোট নম্বর দিয়ে সাজান, দরকারে rerank করুন, শীর্ষ ৫টি রাখুন।"],
    ],
    m: [
      "Adding raw BM25 scores to cosine scores (different scales); filtering permissions after ranking, which can leave too few results; tuning k and weights without a test set; forgetting Bangla text needs a suitable analyzer for keyword search.",
      "কাঁচা BM25 score-এর সাথে cosine score যোগ করা (ভিন্ন মাপ); ranking-এর পরে অনুমতি filter করায় খুব কম ফল থাকে; test set ছাড়া k ও weight tune করা; keyword search-এ বাংলা লেখার জন্য উপযুক্ত analyzer লাগে তা ভুলে যাওয়া।",
    ],
    f: [
      "Search quality is the foundation of reliable AI answers. Knowing both classic information retrieval (BM25) and vectors makes you far more effective than knowing vectors alone.",
      "নির্ভরযোগ্য AI উত্তরের ভিত্তি হলো search-এর মান। শুধু vector নয়, প্রচলিত information retrieval (BM25) ও vector দুটোই জানলে আপনি অনেক বেশি কার্যকর হবেন।",
    ],
    x: [],
  },
  "Semantic Caching": {
    s: [
      "At a busy help desk, the same question comes again and again in different words: 'When will my parcel come?', 'How long is delivery?'. A smart clerk keeps a notebook of answers and reuses them, instead of phoning the warehouse every time.",
      "ব্যস্ত help desk-এ একই প্রশ্ন বারবার ভিন্ন শব্দে আসে: 'পার্সেল কবে আসবে?', 'delivery কতদিন?'। বুদ্ধিমান কর্মী উত্তরের খাতা রাখেন ও আবার ব্যবহার করেন, প্রতিবার গুদামে ফোন করেন না।",
    ],
    t: [
      "A semantic cache stores questions as embeddings with their answers. When a new question is very close in meaning to a stored one (similarity above a threshold), the stored answer is returned without calling the model. It saves money and time, but only for answers that are the same for everyone and still up to date.",
      "Semantic cache প্রশ্নকে embedding হিসেবে উত্তরসহ রাখে। নতুন প্রশ্ন অর্থে সংরক্ষিত প্রশ্নের খুব কাছাকাছি হলে (similarity সীমার উপরে), model না ডেকে সংরক্ষিত উত্তর দেয়। টাকা ও সময় বাঁচায়, তবে শুধু সেই উত্তরে যা সবার জন্য একই ও এখনো হালনাগাদ।",
    ],
    p: [
      ["Decide which questions are safe to cache (public FAQ answers).", "কোন প্রশ্ন cache করা নিরাপদ ঠিক করুন (public FAQ উত্তর)।"],
      ["Embed each new question and search the cache for the nearest one.", "প্রতিটি নতুন প্রশ্নের embedding বানিয়ে cache-এ সবচেয়ে কাছেরটি খুঁজুন।"],
      ["Return the cached answer if similarity is above your tested threshold.", "Similarity পরীক্ষিত সীমার উপরে হলে cache-এর উত্তর দিন।"],
      ["Otherwise call the model, store the result with an expiry time.", "নাহলে model ডেকে ফলটি মেয়াদসহ রাখুন।"],
    ],
    m: [
      "Caching personal answers ('my balance') and showing them to other users; a threshold so low that different questions share one answer; never expiring entries after policies change; caching answers that were wrong.",
      "ব্যক্তিগত উত্তর ('আমার balance') cache করে অন্য user-কে দেখানো; এত নিচু threshold যে ভিন্ন প্রশ্ন একই উত্তর পায়; policy বদলানোর পরও entry-র মেয়াদ শেষ না করা; ভুল উত্তর cache করা।",
    ],
    f: [
      "As AI traffic grows, caching becomes a major cost lever. Learn to measure hit rate and wrong-hit rate together; one without the other is misleading.",
      "AI traffic বাড়লে caching খরচ কমানোর বড় হাতিয়ার হয়। Hit rate ও ভুল-hit rate একসাথে মাপতে শিখুন; একটি ছাড়া অন্যটি বিভ্রান্তিকর।",
    ],
    x: [],
  },
  "Agent Workflows in .NET": {
    s: [
      "A recipe is a workflow: fixed steps in order. A chef inventing a new dish is an agent: tasting, deciding, adjusting. Restaurants mostly cook from recipes because results are reliable, and let the chef improvise only on special dishes, with a time limit and a budget.",
      "Recipe হলো workflow: ক্রমানুসারে নির্দিষ্ট ধাপ। নতুন পদ উদ্ভাবন করা রাঁধুনি হলো agent: চাখে, সিদ্ধান্ত নেয়, বদলায়। রেস্তোরাঁ বেশিরভাগ recipe দিয়ে রাঁধে কারণ ফল নির্ভরযোগ্য, আর শুধু বিশেষ পদে সময় ও বাজেটের সীমায় রাঁধুনিকে নিজের মতো করতে দেয়।",
    ],
    t: [
      "An agent loop: the model looks at the goal and what has happened so far, chooses a tool, your code runs it, the result is added to the history, and the loop repeats until the model says it is done. Because the model chooses, behaviour varies, so you add limits, logging and checkpoints. A workflow fixes the order in code and is easier to test.",
      "Agent loop: model লক্ষ্য ও এ পর্যন্ত যা ঘটেছে দেখে একটি tool বাছে, আপনার code চালায়, ফল ইতিহাসে যোগ হয়, আর model 'শেষ' বলা পর্যন্ত loop চলে। Model বাছে বলে আচরণ বদলায়, তাই সীমা, logging ও checkpoint যোগ করুন। Workflow code-এ ক্রম নির্দিষ্ট করে এবং test করা সহজ।",
    ],
    p: [
      ["Write the task as a workflow first: list the fixed steps.", "আগে কাজটিকে workflow হিসেবে লিখুন: নির্দিষ্ট ধাপগুলোর তালিকা।"],
      ["Only where steps truly vary, add an agent step with a small set of tools.", "যেখানে ধাপ সত্যিই বদলায় শুধু সেখানে ছোট tool set-সহ agent ধাপ দিন।"],
      ["Set max steps, a timeout and a token budget for the agent step.", "Agent ধাপে সর্বোচ্চ ধাপ, timeout ও token budget দিন।"],
      ["Log every decision and tool result, and test with saved scenarios.", "প্রতিটি সিদ্ধান্ত ও tool-এর ফল log করুন, সংরক্ষিত scenario দিয়ে test করুন।"],
    ],
    m: [
      "Building an autonomous agent for a task a simple if/else could do; no step limit, so a confused agent loops and spends money; giving the agent every tool 'just in case'; no way to see why the agent did something.",
      "সাধারণ if/else দিয়ে হয় এমন কাজে স্বাধীন agent বানানো; ধাপের সীমা না থাকায় বিভ্রান্ত agent loop করে টাকা খরচ করে; 'যদি লাগে' ভেবে agent-কে সব tool দেওয়া; agent কেন কিছু করল দেখার উপায় না রাখা।",
    ],
    f: [
      "Agents are improving fast, but reliable products still come from good engineering around them: clear tools, limits, state, traces and evals. That engineering is what employers will pay for.",
      "Agent দ্রুত উন্নত হচ্ছে, কিন্তু নির্ভরযোগ্য product এখনো আসে তাদের চারপাশের ভালো engineering থেকে: স্পষ্ট tool, সীমা, state, trace ও eval। কোম্পানি এই engineering-এর জন্যই টাকা দেবে।",
    ],
    x: [],
  },
  "Human-in-the-Loop Approvals": {
    s: [
      "In a bank, a junior officer can prepare a large loan, but a manager must sign before money moves. The junior does the slow paperwork; the manager makes the final call. AI should work like the junior officer for risky actions.",
      "ব্যাংকে একজন junior officer বড় ঋণের কাগজ তৈরি করতে পারেন, কিন্তু টাকা যাওয়ার আগে manager-কে সই করতে হয়। Junior ধীর কাগজের কাজ করেন; চূড়ান্ত সিদ্ধান্ত manager নেন। ঝুঁকির কাজে AI-এর উচিত junior officer-এর মতো কাজ করা।",
    ],
    t: [
      "Human-in-the-loop means the AI prepares, a person decides, and code executes. A policy decides which actions need a person, for example refunds above 500 BDT. Pending actions wait in a queue; the reviewer sees a simple summary and approves or rejects. Everything is logged, and execution happens only once even if someone clicks twice.",
      "Human-in-the-loop মানে AI প্রস্তুত করে, মানুষ সিদ্ধান্ত নেয়, code চালায়। একটি policy ঠিক করে কোন কাজে মানুষ লাগবে, যেমন ৫০০ টাকার বেশি refund। অপেক্ষমাণ কাজ queue-তে থাকে; reviewer সহজ সারসংক্ষেপ দেখে অনুমোদন বা বাতিল করেন। সব log হয়, আর কেউ দুবার click করলেও কাজ একবারই হয়।",
    ],
    p: [
      ["List the AI actions and mark which are risky (money, data, messages).", "AI-এর কাজের তালিকা করে ঝুঁকিপূর্ণগুলো চিহ্নিত করুন (টাকা, data, message)।"],
      ["Write an approval policy with clear thresholds.", "স্পষ্ট সীমাসহ অনুমোদনের policy লিখুন।"],
      ["Store proposals in a queue with an expiry and a readable summary.", "মেয়াদ ও পড়ার মতো সারসংক্ষেপসহ প্রস্তাব queue-তে রাখুন।"],
      ["Execute idempotently after approval and record who approved.", "অনুমোদনের পর idempotent-ভাবে চালান ও কে অনুমোদন দিল লিখুন।"],
    ],
    m: [
      "Asking humans to approve everything, so they click 'approve' without reading; showing raw JSON to reviewers; proposals that never expire; letting the AI mark its own proposal as approved.",
      "সবকিছুতে মানুষের অনুমোদন চাওয়ায় তারা না পড়েই 'approve' চাপেন; reviewer-কে কাঁচা JSON দেখানো; প্রস্তাবের মেয়াদ শেষ না হওয়া; AI-কে নিজের প্রস্তাব অনুমোদিত চিহ্নিত করতে দেওয়া।",
    ],
    f: [
      "Regulators and customers increasingly expect human oversight of automated decisions. Designing good approval flows is both a safety skill and a product skill.",
      "নিয়ন্ত্রক ও ক্রেতারা ক্রমশ স্বয়ংক্রিয় সিদ্ধান্তে মানুষের তত্ত্বাবধান আশা করছে। ভালো অনুমোদন-প্রবাহ design করা একইসাথে নিরাপত্তা ও product-এর দক্ষতা।",
    ],
    x: [],
  },
  "Evaluating LLM Apps": {
    s: [
      "A cricket coach does not judge a batter by one good shot in the nets. He watches many balls, counts runs and outs, and compares this week with last week. Evals do the same for AI: many questions, a score, and a comparison over time.",
      "Cricket coach নেট-এ একটি ভালো shot দেখে batter-কে বিচার করেন না। অনেক বল দেখেন, run ও out গোনেন, এই সপ্তাহ গত সপ্তাহের সাথে তুলনা করেন। Eval AI-এর জন্য একই কাজ করে: অনেক প্রশ্ন, একটি নম্বর, আর সময়ের সাথে তুলনা।",
    ],
    t: [
      "AI output changes with every prompt edit, model update or data change, and a few manual tests cannot show the full picture. An eval set is a list of real questions with what a good answer must contain. A script runs all of them, grades them automatically, and prints a score. If the score drops below your threshold, the change does not ship.",
      "প্রতিটি prompt পরিবর্তন, model update বা data পরিবর্তনে AI output বদলায়, আর কয়েকটি হাতে করা test পুরো চিত্র দেখাতে পারে না। Eval set হলো বাস্তব প্রশ্নের তালিকা, সাথে ভালো উত্তরে কী থাকতেই হবে। একটি script সব চালায়, স্বয়ংক্রিয়ভাবে নম্বর দেয়, score দেখায়। Score সীমার নিচে নামলে পরিবর্তন চালু হয় না।",
    ],
    p: [
      ["Collect 30-50 real, anonymised questions, including hard and tricky ones.", "কঠিন ও কৌশলী প্রশ্নসহ ৩০-৫০টি বাস্তব, পরিচয়হীন প্রশ্ন জোগাড় করুন।"],
      ["For each, write required facts, forbidden content or expected format.", "প্রতিটির জন্য আবশ্যিক তথ্য, নিষিদ্ধ বিষয় বা প্রত্যাশিত format লিখুন।"],
      ["Write a runner that calls your real pipeline and grades every answer.", "এমন runner লিখুন যা আসল pipeline ডেকে প্রতিটি উত্তরে নম্বর দেয়।"],
      ["Run it in CI on every AI-related change and block merges below the threshold.", "AI-সম্পর্কিত প্রতিটি পরিবর্তনে CI-তে চালান, সীমার নিচে হলে merge আটকান।"],
    ],
    m: [
      "Testing with three hand-picked questions; only testing the easy path and never refusals, Bangla questions or tricky inputs; trusting an LLM judge without checking it against humans; not saving production failures as new eval cases.",
      "হাতে বাছা তিনটি প্রশ্নে test; শুধু সহজ পথ, কখনো অস্বীকার, বাংলা প্রশ্ন বা কৌশলী input নয়; মানুষের সাথে না মিলিয়ে LLM judge-কে বিশ্বাস; production-এর ব্যর্থতাকে নতুন eval case হিসেবে না রাখা।",
    ],
    f: [
      "Evals are to AI what unit tests are to code. In 2028, 'How do you know your AI feature works?' is a standard interview question; the strong answer is a dataset, graders, a score and a CI gate.",
      "Code-এর জন্য unit test যা, AI-এর জন্য eval তাই। ২০২৮-এ 'আপনার AI feature কাজ করে কীভাবে জানেন?' সাধারণ interview প্রশ্ন; শক্তিশালী উত্তর হলো dataset, grader, score ও CI gate।",
    ],
    x: [],
  },
  "Prompt Versioning and LLMOps": {
    s: [
      "A shop's price list is printed with a date. If a customer complains, the owner can check which list was used that day. Prompts are your AI's price list: version them, so when an answer goes wrong you know exactly which version produced it.",
      "দোকানের মূল্যতালিকা তারিখসহ ছাপা হয়। ক্রেতা অভিযোগ করলে মালিক দেখতে পারেন সেদিন কোন তালিকা চলছিল। Prompt হলো আপনার AI-এর মূল্যতালিকা: version দিন, যাতে কোনো উত্তর ভুল হলে ঠিক কোন version থেকে এল জানা যায়।",
    ],
    t: [
      "LLMOps means managing AI behaviour like software releases. Prompts live in files under Git, each with a version. A configuration ties prompt version, model and settings together. Changes go through review and evals, roll out gradually, and can be rolled back. Every request logs the version it used.",
      "LLMOps মানে software release-এর মতো AI-এর আচরণ পরিচালনা। Prompt Git-এর অধীনে file-এ থাকে, প্রতিটির version আছে। একটি configuration prompt version, model ও setting একসাথে বাঁধে। পরিবর্তন review ও eval পেরিয়ে ধীরে ধীরে চালু হয়, আর ফেরানো যায়। প্রতিটি request কোন version ব্যবহার করল তা log করে।",
    ],
    p: [
      ["Move prompts out of code strings into versioned files (prompts/support/v2.md).", "Prompt-কে code-এর string থেকে version-সহ file-এ সরান (prompts/support/v2.md)।"],
      ["Keep model, temperature and max tokens in configuration next to the prompt version.", "Model, temperature ও max token prompt version-এর পাশে configuration-এ রাখুন।"],
      ["Run evals in CI when prompts change; compare with the current version.", "Prompt বদলালে CI-তে eval চালান; বর্তমান version-এর সাথে তুলনা করুন।"],
      ["Roll out to a small percentage first, watch metrics, then go to 100%.", "আগে অল্প শতাংশে চালু করুন, metric দেখুন, তারপর ১০০%।"],
    ],
    m: [
      "Editing prompts directly in production; not logging which version answered; upgrading the model without re-running evals; storing prompts in a database with no history or review.",
      "Production-এ সরাসরি prompt বদলানো; কোন version উত্তর দিল log না করা; eval আবার না চালিয়ে model upgrade; ইতিহাস বা review ছাড়া database-এ prompt রাখা।",
    ],
    f: [
      "AI features are now part of normal releases. Engineers who can bring DevOps habits (versioning, CI gates, canaries, rollbacks) to AI will be trusted with production AI systems.",
      "AI feature এখন সাধারণ release-এর অংশ। যারা AI-তে DevOps-এর অভ্যাস (versioning, CI gate, canary, rollback) আনতে পারে, তাদের হাতেই production AI system-এর দায়িত্ব দেওয়া হবে।",
    ],
    x: [],
  },
  "AI Cost and Latency Budgets": {
    s: [
      "When you take a CNG, you agree on the fare before the ride, and you choose a bus for cheap long trips and a CNG when you are in a hurry. AI calls need the same habit: know the price per trip, pick the right vehicle, and stop the meter if it takes too long.",
      "CNG-তে ওঠার আগে ভাড়া ঠিক করে নেন, আর সস্তায় লম্বা পথে বাস, তাড়া থাকলে CNG বাছেন। AI call-এও একই অভ্যাস লাগে: প্রতি যাত্রার দাম জানুন, সঠিক বাহন বাছুন, আর বেশি সময় লাগলে মিটার থামান।",
    ],
    t: [
      "You pay per token: words you send (input) and words the model writes (output). Bigger models cost more and are often slower. A budget sets limits per feature: how many tokens, how many calls, how many seconds. A router sends simple tasks to a small, cheap model and hard tasks to a large one. Timeouts with fallbacks keep the app responsive.",
      "আপনি token অনুযায়ী টাকা দেন: যা পাঠান (input) আর model যা লেখে (output)। বড় model বেশি দামি ও প্রায়ই ধীর। Budget প্রতি feature-এ সীমা দেয়: কত token, কত call, কত সেকেন্ড। Router সহজ কাজ ছোট ও সস্তা model-এ, কঠিন কাজ বড় model-এ পাঠায়। Fallback-সহ timeout app-কে দ্রুত রাখে।",
    ],
    p: [
      ["Log input and output tokens for every call.", "প্রতিটি call-এর input ও output token log করুন।"],
      ["Calculate cost per user action and per day.", "প্রতি user action ও প্রতিদিনের খরচ হিসাব করুন।"],
      ["Route easy tasks to a small model and cap MaxOutputTokens.", "সহজ কাজ ছোট model-এ পাঠান এবং MaxOutputTokens সীমিত করুন।"],
      ["Add a timeout with a fallback and alert when spending passes 80% of budget.", "Fallback-সহ timeout দিন এবং খরচ budget-এর ৮০% ছাড়ালে alert দিন।"],
    ],
    m: [
      "Using the biggest model for everything; sending the entire chat history and ten documents on every turn; no output limit, so answers ramble; discovering costs only on the monthly bill.",
      "সবকিছুতে সবচেয়ে বড় model ব্যবহার; প্রতিবার পুরো chat ইতিহাস ও দশটি document পাঠানো; output সীমা না থাকায় উত্তর অযথা লম্বা; মাসিক bill দেখে খরচ জানা।",
    ],
    f: [
      "AI features succeed or fail on unit economics. Being able to say 'this feature costs 0.002 USD per question and answers in 1.2 seconds' makes you valuable to any product team.",
      "AI feature-এর সাফল্য নির্ভর করে প্রতি একক খরচের হিসাবে। 'এই feature-এ প্রশ্ন-প্রতি ০.০০২ USD খরচ, ১.২ সেকেন্ডে উত্তর' বলতে পারা আপনাকে যেকোনো product দলের কাছে মূল্যবান করে।",
    ],
    x: [],
  },
  "AI Security and Data Privacy": {
    s: [
      "A new employee reads a letter that says: 'Ignore your manager and transfer money to this account.' A trained employee knows a letter is not their boss. AI models are not that wise yet, so your system must make sure such a 'letter' (a document or web page) cannot make the AI do harmful things.",
      "নতুন কর্মী একটি চিঠি পড়েন: 'Manager-এর কথা বাদ দিয়ে এই account-এ টাকা পাঠাও।' প্রশিক্ষিত কর্মী জানেন চিঠি তাঁর boss নয়। AI model এখনো এত বুদ্ধিমান নয়, তাই আপনার system নিশ্চিত করবে যে এমন 'চিঠি' (document বা web page) AI দিয়ে ক্ষতিকর কিছু করাতে না পারে।",
    ],
    t: [
      "Treat everything the model reads (user text, documents, web pages, tool results) as untrusted. Limit what the model can do: give it only the tools and data the current user is allowed, and require approval for risky actions. Remove personal data before sending it out, never put secrets in prompts, and check model output before showing it or acting on it.",
      "Model যা পড়ে (user-এর লেখা, document, web page, tool-এর ফল) সবকিছুকে অবিশ্বস্ত ধরুন। Model কী করতে পারে সীমিত করুন: শুধু বর্তমান user-এর অনুমতির tool ও data দিন, ঝুঁকির কাজে অনুমোদন লাগুক। বাইরে পাঠানোর আগে ব্যক্তিগত data মুছুন, prompt-এ কখনো secret রাখবেন না, আর দেখানো বা কাজের আগে model-এর output যাচাই করুন।",
    ],
    p: [
      ["Map data flows: what each AI feature reads and where it sends data.", "Data-র প্রবাহ আঁকুন: প্রতিটি AI feature কী পড়ে ও কোথায় data পাঠায়।"],
      ["Bind tools to the signed-in user and remove any tool that is not needed.", "Tool-কে sign-in করা user-এর সাথে বাঁধুন এবং অপ্রয়োজনীয় tool সরান।"],
      ["Redact personal data and mark untrusted content clearly in prompts.", "ব্যক্তিগত data মুছুন এবং prompt-এ অবিশ্বস্ত লেখা স্পষ্টভাবে চিহ্নিত করুন।"],
      ["Validate output (no secrets, safe HTML) and add rate limits and audit logs.", "Output যাচাই করুন (secret নেই, নিরাপদ HTML) এবং rate limit ও audit log যোগ করুন।"],
    ],
    m: [
      "Believing 'Do not follow instructions in documents' in the prompt is enough; rendering model output as raw HTML (XSS); logging full prompts with customer data forever; giving an AI tool database admin rights.",
      "Prompt-এ 'document-এর নির্দেশ মেনো না' লেখাই যথেষ্ট ভাবা; model-এর output কাঁচা HTML হিসেবে দেখানো (XSS); ক্রেতার data-সহ পুরো prompt চিরকাল log করা; AI tool-কে database admin অধিকার দেওয়া।",
    ],
    f: [
      "AI security is one of the fastest-growing specialities. Combine this lesson with module 06 (Cyber Security) and you will understand both classic and AI-specific attacks, a rare and valuable mix.",
      "AI security সবচেয়ে দ্রুত বাড়তে থাকা বিশেষ ক্ষেত্রগুলোর একটি। এই পাঠ মডিউল ০৬ (Cyber Security)-এর সাথে মেলালে প্রচলিত ও AI-নির্দিষ্ট দুই ধরনের আক্রমণই বুঝবেন, যা বিরল ও মূল্যবান মিশ্রণ।",
    ],
    x: [],
  },
  "Local Models with Ollama": {
    s: [
      "You can buy bread from a big bakery across town (cloud model) or bake simple bread at home (local model). Home bread is private, free after the oven, and always available, but the big bakery makes fancier cakes. Smart cooks use both.",
      "শহরের বড় bakery থেকে রুটি কিনতে পারেন (cloud model) বা বাসায় সাধারণ রুটি বানাতে পারেন (local model)। বাসার রুটি গোপন, oven কেনার পর বিনামূল্যে, সবসময় পাওয়া যায়, কিন্তু বড় bakery আরও জমকালো cake বানায়। বুদ্ধিমান রাঁধুনি দুটোই ব্যবহার করেন।",
    ],
    t: [
      "Ollama runs open models on your machine and gives them a simple local API. Data never leaves your computer and there is no per-token bill. Small models (1-8B parameters) run on laptops and are good at summarising, classifying and extracting. Because OllamaSharp supports IChatClient, you switch between local and cloud models with configuration, not rewrites.",
      "Ollama আপনার machine-এ open model চালায় এবং সহজ local API দেয়। Data কখনো কম্পিউটারের বাইরে যায় না, token-প্রতি bill নেই। ছোট model (1-8B parameter) laptop-এ চলে এবং সংক্ষেপ, শ্রেণিবিভাগ ও তথ্য বের করায় ভালো। OllamaSharp IChatClient মানে বলে code নতুন করে না লিখে configuration দিয়ে local ও cloud model বদলানো যায়।",
    ],
    p: [
      ["Install Ollama and pull a small model (llama3.2) and an embedding model.", "Ollama install করে ছোট model (llama3.2) ও একটি embedding model নামান।"],
      ["Test it with curl against http://localhost:11434.", "http://localhost:11434-এ curl দিয়ে পরীক্ষা করুন।"],
      ["In .NET create an OllamaApiClient and use it as IChatClient.", ".NET-এ OllamaApiClient বানিয়ে IChatClient হিসেবে ব্যবহার করুন।"],
      ["Compare its answers with a cloud model on your eval set before choosing.", "বাছার আগে নিজের eval set-এ cloud model-এর সাথে উত্তর তুলনা করুন।"],
    ],
    m: [
      "Expecting a 3B local model to match the largest cloud models on hard reasoning; running out of RAM with a model that is too big; forgetting to check the model licence; exposing port 11434 to the internet without authentication.",
      "কঠিন যুক্তিতে 3B local model সবচেয়ে বড় cloud model-এর সমান হবে আশা করা; খুব বড় model-এ RAM শেষ হয়ে যাওয়া; model-এর licence দেখতে ভুলে যাওয়া; authentication ছাড়া port 11434 internet-এ খুলে রাখা।",
    ],
    f: [
      "Small models keep getting better and cheaper to run. A hybrid setup (local for private and simple tasks, cloud for hard ones) is becoming a standard architecture worth knowing.",
      "ছোট model ক্রমশ ভালো ও চালাতে সস্তা হচ্ছে। Hybrid ব্যবস্থা (ব্যক্তিগত ও সহজ কাজে local, কঠিন কাজে cloud) একটি প্রচলিত architecture হয়ে উঠছে, যা জানা দরকার।",
    ],
    x: [],
  },
  "Multimodal Inputs": {
    s: [
      "Instead of typing every number from a shop receipt, you show the receipt to a friend and ask, 'What is the total?' Multimodal AI is that friend: it can look at photos, screenshots and PDFs and tell you what is inside.",
      "দোকানের রসিদের প্রতিটি সংখ্যা টাইপ না করে বন্ধুকে রসিদ দেখিয়ে জিজ্ঞেস করেন, 'মোট কত?' Multimodal AI সেই বন্ধু: ছবি, screenshot ও PDF দেখে ভিতরে কী আছে বলে দিতে পারে।",
    ],
    t: [
      "You send a message that contains both text (the instruction) and data (the image or file with its type, like image/jpeg). The model returns text, ideally structured JSON that you convert into a C# record. Because the model can misread, you check the result with rules, for example that item prices add up to the total.",
      "আপনি এমন message পাঠান যাতে লেখা (নির্দেশ) ও data (ধরনসহ ছবি বা file, যেমন image/jpeg) দুটোই থাকে। Model লেখা ফেরত দেয়, ভালো হয় structured JSON, যা C# record-এ রূপ দেন। Model ভুল পড়তে পারে বলে ফল নিয়ম দিয়ে যাচাই করেন, যেমন item-এর দাম যোগ করলে মোটের সমান হয় কি না।",
    ],
    p: [
      ["Accept an upload and check size and file type.", "Upload নিন এবং আকার ও file-এর ধরন যাচাই করুন।"],
      ["Build a ChatMessage with TextContent and DataContent.", "TextContent ও DataContent দিয়ে ChatMessage বানান।"],
      ["Ask for a typed result with GetResponseAsync<T>.", "GetResponseAsync<T> দিয়ে typed ফল চান।"],
      ["Validate the fields; send unclear cases to a person.", "Field যাচাই করুন; অস্পষ্ট case মানুষের কাছে পাঠান।"],
    ],
    m: [
      "Sending 12-megapixel photos (slow and expensive); trusting extracted totals for payments without checks; forgetting photos may contain location data and faces; no fallback when the image is blurry.",
      "১২ মেগাপিক্সেলের ছবি পাঠানো (ধীর ও দামি); যাচাই ছাড়া পাওয়া মোট টাকা payment-এ বিশ্বাস করা; ছবিতে location data ও মুখ থাকতে পারে ভুলে যাওয়া; ঝাপসা ছবিতে কোনো বিকল্প না রাখা।",
    ],
    f: [
      "Much of the world's business data is in PDFs, photos and scans. Engineers who can turn them into clean, validated data with AI unlock automation that was impossible a few years ago.",
      "বিশ্বের অনেক ব্যবসায়িক data PDF, ছবি ও scan-এ আছে। যারা AI দিয়ে এগুলোকে পরিষ্কার, যাচাই করা data-তে রূপ দিতে পারে, তারা এমন automation খুলে দেয় যা কয়েক বছর আগেও অসম্ভব ছিল।",
    ],
    x: [],
  },
  "AI Observability with OpenTelemetry": {
    s: [
      "A delivery company tracks each parcel: picked up, at the hub, out for delivery, delivered, with times. When a parcel is late, they can see exactly where it waited. Tracing does the same for each AI request: retrieval, model call, tools, each with its time and cost.",
      "Delivery কোম্পানি প্রতিটি পার্সেল সময়সহ track করে: নেওয়া হলো, hub-এ, delivery-র পথে, পৌঁছেছে। পার্সেল দেরি হলে ঠিক কোথায় আটকে ছিল দেখা যায়। Tracing প্রতিটি AI request-এর জন্য একই কাজ করে: retrieval, model call, tool, প্রতিটির সময় ও খরচসহ।",
    ],
    t: [
      "A trace is the story of one request, made of spans (steps) with start time, duration and tags such as model name and token counts. Metrics are numbers over time (requests per minute, p95 latency, tokens per day). OpenTelemetry is the standard way to collect both and send them to dashboards. Microsoft.Extensions.AI adds standard AI tags automatically.",
      "Trace হলো একটি request-এর গল্প, span (ধাপ) দিয়ে তৈরি, যার শুরুর সময়, স্থায়িত্ব ও model-এর নাম, token সংখ্যার মতো tag থাকে। Metric হলো সময়ের সাথে সংখ্যা (প্রতি মিনিটে request, p95 latency, প্রতিদিন token)। দুটো সংগ্রহ করে dashboard-এ পাঠানোর মানক উপায় OpenTelemetry। Microsoft.Extensions.AI স্বয়ংক্রিয়ভাবে মানক AI tag যোগ করে।",
    ],
    p: [
      ["Add OpenTelemetry packages and AddOpenTelemetry().WithTracing(...).", "OpenTelemetry package যোগ করে AddOpenTelemetry().WithTracing(...) দিন।"],
      ["Wrap your chat client with UseOpenTelemetry().", "Chat client-কে UseOpenTelemetry() দিয়ে মোড়ান।"],
      ["Create your own spans for retrieval and tools with ActivitySource.", "ActivitySource দিয়ে retrieval ও tool-এর নিজস্ব span বানান।"],
      ["Build a dashboard for latency, errors, tokens and cost, and set alerts.", "Latency, error, token ও খরচের dashboard বানিয়ে alert দিন।"],
    ],
    m: [
      "Only logging 'AI call failed' with no context; storing full prompts with personal data in logs; no trace id, so you cannot connect the user's complaint to the request; alerts on nothing, so a token explosion is found a month later.",
      "কোনো context ছাড়া শুধু 'AI call failed' log করা; ব্যক্তিগত data-সহ পুরো prompt log-এ রাখা; trace id না থাকায় user-এর অভিযোগকে request-এর সাথে মেলানো যায় না; কোনো alert না থাকায় token-এর বিস্ফোরণ এক মাস পরে ধরা পড়ে।",
    ],
    f: [
      "Production AI without observability is guesswork. Knowing OpenTelemetry and the GenAI conventions lets you debug quality, cost and latency issues that others can only guess about.",
      "Observability ছাড়া production AI অনুমাননির্ভর। OpenTelemetry ও GenAI convention জানলে মান, খরচ ও latency-র এমন সমস্যা debug করতে পারবেন যা অন্যরা শুধু অনুমান করে।",
    ],
    x: [],
  },
  "Testing AI Features": {
    s: [
      "Pilots train in a flight simulator before flying real planes. The simulator can create storms and engine failures on demand, safely and cheaply. A fake AI client is your simulator: it can return perfect answers, broken JSON or nothing at all, so you can test how your code reacts.",
      "Pilot আসল বিমান চালানোর আগে flight simulator-এ প্রশিক্ষণ নেন। Simulator চাইলেই ঝড় ও engine বিকল তৈরি করতে পারে, নিরাপদে ও কম খরচে। Fake AI client আপনার simulator: নিখুঁত উত্তর, ভাঙা JSON বা কিছুই না দিতে পারে, যাতে আপনার code কীভাবে সাড়া দেয় test করা যায়।",
    ],
    t: [
      "Most of an AI feature is normal code: building prompts, parsing replies, checking rules and handling errors. That part should be tested with fast, repeatable unit tests using a fake IChatClient that returns scripted replies. The real model's quality is checked separately with evals. Together they give speed and confidence.",
      "AI feature-এর বেশিরভাগই সাধারণ code: prompt বানানো, উত্তর parse করা, নিয়ম যাচাই ও error সামলানো। এই অংশ scripted উত্তর দেওয়া fake IChatClient দিয়ে দ্রুত ও পুনরাবৃত্তিযোগ্য unit test-এ পরীক্ষা করা উচিত। আসল model-এর মান আলাদাভাবে eval দিয়ে দেখা হয়। দুটো মিলে গতি ও আস্থা দেয়।",
    ],
    p: [
      ["Depend on IChatClient in your services so you can inject a fake.", "Service-এ IChatClient-এর উপর নির্ভর করুন, যাতে fake inject করা যায়।"],
      ["Write a fake client that returns scripted replies.", "Scripted উত্তর দেওয়া fake client লিখুন।"],
      ["Test happy paths and failures: invalid JSON, empty reply, unknown values, timeouts.", "সফল পথ ও ব্যর্থতা test করুন: ভুল JSON, খালি উত্তর, অজানা মান, timeout।"],
      ["Run these tests on every commit; run real-model evals before release.", "প্রতি commit-এ এই test চালান; release-এর আগে আসল model-এ eval চালান।"],
    ],
    m: [
      "Calling the real model in unit tests (slow, costly, flaky); asserting exact wording; only testing the happy path; letting a bad model reply crash the request.",
      "Unit test-এ আসল model ডাকা (ধীর, দামি, অনিশ্চিত); হুবহু শব্দ assert করা; শুধু সফল পথ test করা; খারাপ model উত্তরে request crash হতে দেওয়া।",
    ],
    f: [
      "Teams that ship AI quickly and safely separate deterministic tests from evals. Showing this split in your projects and interviews signals real production experience.",
      "যে দলগুলো দ্রুত ও নিরাপদে AI চালু করে, তারা নির্দিষ্ট test ও eval আলাদা রাখে। নিজের project ও interview-এ এই ভাগ দেখানো আসল production অভিজ্ঞতার সংকেত দেয়।",
    ],
    x: [],
  },
  "Capstone: AI Support Assistant": {
    s: [
      "Learning to drive happens in pieces: steering, brakes, mirrors, signals. The driving test puts them all together on a real road. This capstone is your AI driving test: every skill from the module working together in one useful product.",
      "গাড়ি চালানো শেখা হয় টুকরো টুকরো: স্টিয়ারিং, ব্রেক, আয়না, সংকেত। Driving test আসল রাস্তায় সব একসাথে মেলায়। এই capstone আপনার AI driving test: মডিউলের সব দক্ষতা একসাথে একটি কাজের product-এ।",
    ],
    t: [
      "The assistant answers customer questions from help articles (RAG with hybrid search and permissions), checks order status with a safe tool, proposes refunds that a human approves, streams answers with sources, and records traces with tokens and cost. Unit tests use a fake model; evals with a real model run in CI and gate deploys.",
      "Assistant help article থেকে ক্রেতার প্রশ্নের উত্তর দেয় (hybrid search ও অনুমতিসহ RAG), নিরাপদ tool দিয়ে order status দেখে, মানুষ অনুমোদন দেবে এমন refund প্রস্তাব করে, উৎসসহ উত্তর stream করে, আর token ও খরচসহ trace রাখে। Unit test fake model ব্যবহার করে; আসল model-এর eval CI-তে চলে ও deploy আটকায়।",
    ],
    p: [
      ["Write the one-page design doc and a 30-question eval set first.", "আগে এক পাতার design doc ও ৩০ প্রশ্নের eval set লিখুন।"],
      ["Build FAQ answers with sources (RAG) and measure them.", "উৎসসহ FAQ উত্তর (RAG) বানিয়ে মাপুন।"],
      ["Add the order-status tool, then refund proposals with approval.", "Order-status tool যোগ করুন, তারপর অনুমোদনসহ refund প্রস্তাব।"],
      ["Add streaming UI, tracing, cost dashboard and CI eval gate; deploy.", "Streaming UI, tracing, খরচের dashboard ও CI eval gate যোগ করে deploy করুন।"],
    ],
    m: [
      "Building everything at once and never shipping; skipping evals until the end; giving the assistant refund power without approval; no plan for 'I don't know' answers.",
      "সব একসাথে বানাতে গিয়ে কখনো চালু না করা; শেষ পর্যন্ত eval বাদ রাখা; অনুমোদন ছাড়া assistant-কে refund-এর ক্ষমতা দেওয়া; 'আমি জানি না' উত্তরের কোনো পরিকল্পনা না রাখা।",
    ],
    f: [
      "Put this project on GitHub with a README, architecture diagram, eval results and a short demo video. A working, measured, safe AI system is one of the strongest portfolio pieces a 2028 engineer can show.",
      "README, architecture diagram, eval-এর ফল ও ছোট demo video-সহ এই project GitHub-এ রাখুন। কাজ করে, মাপা যায় ও নিরাপদ এমন AI system ২০২৮-এর একজন engineer-এর দেখানোর মতো সবচেয়ে শক্তিশালী portfolio-গুলোর একটি।",
    ],
    x: [],
  },
};
