const data = {};
function add(key, en, bn, a, b, de, db) {
  data[key] = {
    en,
    bn,
    decisionEn: de,
    decisionBn: db,
    examples: [
      {
        title: "Implement the idea · ধারণার বড় code উদাহরণ",
        language: "csharp",
        code: a,
        kind: "Reference example",
      },
      {
        title: "Evaluate the boundary · ফল ও সীমা পরীক্ষা",
        language: "csharp",
        code: b,
        kind: "Reference example",
      },
    ],
  };
}
add(
  "LLM Fundamentals",
  "A model receives role-structured context and produces tokens under a decoding policy. Temperature and sampling change variability, not factual truth. Provider APIs differ in supported output modes, tools, and limits. A production wrapper should apply cancellation, token/cost budgets, privacy policy, and task-specific evaluation instead of trusting fluency.",
  "Model role-সহ context নিয়ে token দেয়। Temperature variability বদলায়, সত্যতা নয়। Provider-এর mode ও limit ভিন্ন। App-এ timeout, token/cost, privacy ও eval লাগবে; সাবলীলতা বিশ্বাসের প্রমাণ নয়।",
  `// Microsoft.Extensions.AI provider integration fragment.
IChatClient client=configuredProviderClient;
var messages=new List<ChatMessage> {
    new(ChatRole.System,"Teach C# clearly. State uncertainty and cite supplied sources."),
    new(ChatRole.User,"Explain the difference between int and string.")
};
using var deadline=new CancellationTokenSource(TimeSpan.FromSeconds(20));
var response=await client.GetResponseAsync(messages,cancellationToken:deadline.Token);
Console.WriteLine(response.Text);
// Configure the provider server-side; never embed its key in React.`,
  `var outputs=new[]{"Sounds confident", "Contains a verifiable source", "Passes a reference test"};
foreach(string signal in outputs)Console.WriteLine(signal);
record Evaluation(bool Grounded,bool Correct,bool FitsAudience);
var checkedResult=new Evaluation(true,true,true);
Console.WriteLine(checkedResult);
// Confidence in wording is not one of the correctness checks.`,
  "Choose a model from measured task quality, cost, latency, and data requirements. A larger model is not automatically the best product fit.",
  "Task quality, cost, latency ও data rule মেপে model বাছুন; বড় হলেই সেরা নয়।",
);
add(
  "Tokens and Context Window",
  "The tokenizer defines how bytes/text become model units; Bangla and English can have different token density. Budget instructions, history, retrieved documents, tool schemas, and output together. Truncation must preserve essential task state and permissions. Summaries can lose details, so retain original provenance when it matters.",
  "Tokenizer অনুযায়ী বাংলা/English token density আলাদা। Instruction, history, document, tool schema ও output মিলে budget। Truncate-এ দরকারি state রাখুন; summary detail হারায়, তাই source রাখুন।",
  `record Budget(int Context,int Instructions,int History,int Documents,int Tools,int ReservedOutput);
var b=new Budget(16000,1000,3000,7000,1000,2000);
int used=b.Instructions+b.History+b.Documents+b.Tools+b.ReservedOutput;
Console.WriteLine($"Budget used={used}, remaining={b.Context-used}");
if(used>b.Context)throw new InvalidOperationException("Reduce context");
// Counts must come from the actual selected tokenizer, not word splitting.`,
  `var history=new Queue<(string Text,int Tokens)>();
history.Enqueue(("Old discussion",300));history.Enqueue(("Recent question",200));
int limit=250,total=history.Sum(x=>x.Tokens);
while(total>limit&&history.Count>1)total-=history.Dequeue().Tokens;
Console.WriteLine(string.Join("; ",history.Select(x=>x.Text)));
// Preserve required system/task context separately from optional history.`,
  "Reserve output space before making the call. A context window limit is not a guarantee the model reliably uses every included detail.",
  "Call-এর আগে output-এর জায়গা রাখুন। Context-এ সব ঢুকেছে মানেই model সব detail কাজে লাগাবে নয়।",
);
add(
  "Prompt Engineering",
  "A task prompt should name the goal, audience, relevant evidence, output contract, and uncertainty behavior. Examples communicate desired patterns but can bias the answer toward accidental details. Keep untrusted content clearly separated and enforce capabilities outside the prompt. Compare prompt changes on a fixed representative dataset.",
  "Goal, audience, evidence, output ও অজানায় কী করবে বলুন। Example কাজে লাগে, কিন্তু ভুল pattern-ও শেখাতে পারে। Untrusted content আলাদা ও ক্ষমতা app-এ enforce। Fixed eval-এ prompt তুলুন।",
  `string topic="C# dictionaries";
string prompt=$"""
Task: Explain {topic} to an absolute beginner.
Language: Bangla plus standard English technical terms.
Output: intuition, 10-line example, common mistake, one exercise.
Use supplied evidence when available; do not invent API guarantees.
Uncertainty: say what needs checking in official documentation.
""";
Console.WriteLine(prompt);`,
  `var variants=new[]{"Explain recursion","Explain recursion using a base case and one traced input"};
var criteria=new[]{"Correct base case","No infinite recursion","Beginner vocabulary","Trace matches code"};
foreach(string variant in variants) {
    Console.WriteLine(variant);
    foreach(string criterion in criteria)Console.WriteLine($"Check: {criterion}");
}
// Evaluate actual outputs; prompt length alone is not a quality measure.`,
  "Prompting is one control surface. It cannot replace server authorization, schema validation, or an accurate source-of-truth system.",
  "Prompt server permission, schema validation বা সত্যের উৎসের বিকল্প নয়।",
);
add(
  "Structured Outputs",
  "A schema restricts output shape, types, enums, and required fields. Application validation must still check value ranges, references, ownership, and factual support. Handle refusal, truncation, parse failure, and schema evolution explicitly. A valid JSON object may still request an invalid or unauthorized operation.",
  "Schema shape/type মানায়, কিন্তু মান, reference, ownership ও সত্যতা app যাচাই করবে। Refusal, truncate ও parse failure সামলান। Valid JSON-এও অননুমোদিত কাজ থাকতে পারে।",
  `using System.Text.Json;
string json="{\"topic\":\"C# variables\",\"minutes\":30}";
var plan=JsonSerializer.Deserialize<StudyPlan>(json,new JsonSerializerOptions{PropertyNameCaseInsensitive=true})
    ??throw new InvalidOperationException("Missing plan");
if(string.IsNullOrWhiteSpace(plan.Topic)||plan.Minutes is <5 or >120)
    throw new ArgumentException("Invalid plan values");
Console.WriteLine(plan);
record StudyPlan(string Topic,int Minutes);`,
  `var schema=new {
    type="object",
    properties=new {topic=new{type="string"},minutes=new{type="integer",minimum=5,maximum=120}},
    required=new[]{"topic","minutes"},additionalProperties=false
};
Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(schema));
// Supply the schema using the selected provider's supported strict-output API.`,
  "A schema is not a truth oracle. Validate cited document IDs and user permissions before acting on generated references.",
  "Schema সত্য যাচাই করে না। Generated document id ও permission আলাদা দেখুন।",
);
add(
  "Embeddings",
  "An embedding model creates a vector representation with a specific dimension and training objective. Similarity measures require compatible vectors and defined normalization. Zero vectors need special handling for cosine. Retrieval quality depends on corpus/query matching, language coverage, and access filtering, not only the vector database’s speed.",
  "Embedding-এর dimension ও উদ্দেশ্য নির্দিষ্ট। Compatible vector ও normalization দরকার। Zero vector-এ cosine আলাদা সামলান। বাংলা coverage, corpus ও permission retrieval-এর মান বদলায়।",
  `double Cosine(double[] a,double[] b) {
    if(a.Length!=b.Length||a.Length==0)throw new ArgumentException("Dimensions");
    double dot=0,aa=0,bb=0;
    for(int i=0;i<a.Length;i++){dot+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i];}
    if(aa==0||bb==0)throw new ArgumentException("Zero vector");
    return dot/Math.Sqrt(aa*bb);
}
Console.WriteLine(Cosine(new[]{1.0,0},new[]{0.8,0.6}));`,
  `var corpus=new[]{(Id:"a",Vector:new[]{1.0,0.0}),(Id:"b",Vector:new[]{0.0,1.0})};
double[] query={0.9,0.1};
var ranked=corpus.Select(x=>new{x.Id,Score=x.Vector.Zip(query,(a,b)=>a*b).Sum()})
    .OrderByDescending(x=>x.Score);
foreach(var item in ranked)Console.WriteLine(item);
// Dot-product demo; use the model's required normalization/similarity.`,
  "Re-embedding after a model change is a data migration. Version vector model, dimensions, source text, and index configuration together.",
  "Model বদলে re-embedding data migration। Model, dimension, source ও index version একসাথে রাখুন।",
);
add(
  "Vector Databases",
  "Approximate nearest-neighbor indexes trade recall, memory, ingestion cost, and query latency. Metadata filters must preserve tenant/document authorization during retrieval. Deletions and source changes need reconciliation so stale text is not cited. Hybrid search combines lexical precision with semantic retrieval for identifiers and rare terminology.",
  "Approximate index recall, memory ও latency-র trade-off। Tenant filter retrieval-এই permission রাখবে। Source বদল/মুছলে index মিলান। Exact id ও দুর্লভ শব্দে lexical+semantic hybrid কাজে লাগে।",
  `record Doc(string Id,string Tenant,double Score);
var candidates=new[]{new Doc("a","t1",0.8),new Doc("b","t2",0.95),new Doc("c","t1",0.7)};
string authorizedTenant="t1";
var result=candidates.Where(x=>x.Tenant==authorizedTenant).OrderByDescending(x=>x.Score).Take(2);
foreach(var item in result)Console.WriteLine(item.Id);
// The real database filter must bind to authenticated scope, not user claims alone.`,
  `int relevant=10,retrievedRelevant=8,retrieved=12;
double recall=(double)retrievedRelevant/relevant;
double precision=(double)retrievedRelevant/retrieved;
Console.WriteLine($"Recall={recall:P0}, precision={precision:P0}");
// Evaluate these over labeled query-document relevance cases.
// Fast retrieval with poor recall can omit the evidence generation needs.`,
  "Do not compare raw scores across different models or indexes without calibration. Preserve provenance and access metadata with every chunk.",
  "Calibration ছাড়া ভিন্ন model/index-এর score তুলবেন না। Chunk-এর source ও permission metadata রাখুন।",
);
add(
  "RAG Pipelines",
  "RAG has an ingestion path and an answering path. Ingestion extracts, chunks, embeds, and indexes versioned content. Answering retrieves authorized evidence, optionally reranks, constructs bounded context, and generates a cited response. Retrieval failure and unsupported generation are separate errors and need separate evaluation.",
  "RAG-এ ingestion ও answer path আলাদা। প্রথমে extract/chunk/embed/index; পরে authorized evidence retrieve/rerank/context/answer। Retrieval ভুল ও evidence ছাড়া generation আলাদা করে মাপুন।",
  `record Passage(string Id,string Text,string Source);
var passages=new[]{new Passage("p1","C# strings are immutable.","C# guide")};
string question="Can I modify a string in place?";
string context=string.Join("\n",passages.Select(p=>$"[{p.Id}] {p.Text}"));
string prompt=$"Answer only from these passages, cite IDs, and say when evidence is missing.\n{context}\nQuestion: {question}";
Console.WriteLine(prompt);
// Send via a configured server-side model client after permission filtering.`,
  `var retrievedIds=new HashSet<string>{"p1","p2"};
string[] citedIds={"p1","invented"};
foreach(string id in citedIds)
    Console.WriteLine($"{id}: exists={retrievedIds.Contains(id)}");
// Existence is only one check: the passage must actually support the claim.
// Show insufficient evidence instead of inventing a source.`,
  "Adding more context is not always better. Duplicate and irrelevant chunks consume budget and can distract from the relevant evidence.",
  "বেশি context সবসময় ভালো নয়। Duplicate ও অপ্রাসঙ্গিক chunk budget খায় ও মূল প্রমাণ আড়াল করে।",
);
add(
  "Chunking Strategies",
  "Chunk boundaries should preserve meaning and stable citations. Fixed-token splitting is predictable; headings and recursive splitting preserve document structure; semantic splitting uses content signals. Overlap reduces boundary loss but increases duplicate storage/context. Keep source offsets, document version, language, and permission metadata with each chunk.",
  "Boundary-তে অর্থ ও citation রাখুন। Fixed token পূর্বানুমেয়, heading/recursive structure মানে, semantic content দেখে। Overlap boundary loss কমায় কিন্তু duplicate বাড়ায়। Offset, version ও permission রাখুন।",
  `string document="## Variables\nA variable stores a value.\n\n## Loops\nA loop repeats work.";
string[] sections=document.Split("\n\n",StringSplitOptions.RemoveEmptyEntries);
for(int i=0;i<sections.Length;i++) {
    var chunk=new{Id=$"guide:v1:{i}",Text=sections[i],Document="guide",Version=1};
    Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(chunk));
}
// Heading/paragraph teaching splitter, not a production tokenizer.`,
  `int totalTokens=1000,size=200,overlap=40;
if(size<=overlap||overlap<0)throw new ArgumentException("Chunk settings");
for(int start=0;start<totalTokens;start+=size-overlap) {
    int end=Math.Min(totalTokens,start+size);
    Console.WriteLine($"[{start},{end})");
    if(end==totalTokens)break;
}
// Apply these boundaries to actual tokenizer tokens, not UTF-16 positions.`,
  "Test queries whose evidence spans a boundary. A visually tidy chunk size can still harm retrieval for the actual question set.",
  "প্রমাণ boundary পার হয় এমন query test করুন। দেখতে সুন্দর chunk size retrieval-এর জন্য ঠিক নাও হতে পারে।",
);
add(
  "Reranking",
  "First-stage retrieval finds a broad candidate set cheaply. A second-stage model scores query-document pairs with richer interaction, then selects a smaller context. Candidate recall limits the best possible final answer; a reranker cannot recover a relevant document that was never retrieved. Evaluate latency/cost together with relevance improvement.",
  "প্রথম stage দ্রুত অনেক candidate আনে, দ্বিতীয় model query-document ভালো করে score করে। প্রথমেই দরকারি নথি না এলে reranker ফেরাতে পারে না। Relevance-এর সাথে latency/cost মাপুন।",
  `var initial=new[]{(Id:"a",Retrieval:0.9,Rerank:0.4),(Id:"b",Retrieval:0.8,Rerank:0.95),(Id:"c",Retrieval:0.7,Rerank:0.6)};
var final=initial.OrderByDescending(x=>x.Rerank).Take(2);
foreach(var item in final)Console.WriteLine($"{item.Id}: {item.Rerank}");
// Scores here are illustrative inputs; a real reranker must compute them.
// Preserve source/permission metadata while reordering.`,
  `int candidates=50,finalCount=5;
double scoringMsPerPair=2;
Console.WriteLine($"Sequential model cost estimate: {candidates*scoringMsPerPair}ms");
Console.WriteLine($"Final context count: {finalCount}");
// Batch capabilities change actual latency; measure the real provider.
// Compare against a no-reranker baseline on held-out relevance cases.`,
  "Do not present lexical heuristics as a semantic cross-encoder. Label the actual scoring method and validate it with domain queries.",
  "শব্দ মেলার heuristic-কে semantic model বলবেন না। আসল scoring method লিখুন ও domain query-তে মাপুন।",
);
add(
  "Tool Calling",
  "A tool call is a proposed structured operation. The application chooses whether it is allowed, validates arguments, invokes the capability with scoped identity, and returns a bounded result. The model should never receive credentials merely to decide a call. Idempotency and confirmation policy are necessary for consequential effects under the product’s rules.",
  "Tool call প্রস্তাব, অনুমতি নয়। App argument ও scope যাচাই করে কাজ চালায় ও সীমিত ফল দেয়। সিদ্ধান্ত নিতে model-কে credential দেবেন না। গুরুত্বপূর্ণ effect-এ idempotency ও product-এর confirmation rule লাগে।",
  `record SearchArgs(string Tenant,string Query,int Limit);
string Search(SearchArgs args,string authenticatedTenant) {
    if(args.Tenant!=authenticatedTenant||args.Limit is <1 or >10||args.Query.Length>200)
        throw new UnauthorizedAccessException("Invalid tool scope");
    return $"Demo results for {args.Query}";
}
Console.WriteLine(Search(new("t1","C#",5),"t1"));
// Register a typed function with the chosen AI provider adapter.`,
  `var allowed=new Dictionary<string,Func<string,string>> {
    ["lookup_product"]=id=>$"Demo product {id}"
};
string requested="delete_database";
if(!allowed.TryGetValue(requested,out var tool))Console.WriteLine("Tool denied");
else Console.WriteLine(tool("42"));
// A real dispatcher also validates typed arguments and caller/resource policy.`,
  "Tool descriptions are documentation, not authority. Enforce policy at the actual execution boundary even after a schema accepted the call.",
  "Tool description অধিকার নয়। Schema পাস হলেও execution-এ permission দিন।",
);
add(
  "MCP Protocol",
  "MCP separates clients from servers that expose tools, resources, and prompts through standardized discovery and invocation. The protocol does not make every connected server trustworthy or every tool safe. Authentication, consent, transport security, schemas, and capability boundaries still belong to the surrounding system. Use maintained SDKs rather than inventing wire formats.",
  "MCP discovery ও call-এর ভাষা এক করে। Connected server মানেই trusted নয়। Auth, consent, transport ও capability boundary আলাদা দরকার। Wire format নিজে না বানিয়ে SDK নিন।",
  `// C# MCP SDK style reference; select the SDK version and hosting transport.
using System.ComponentModel;
using ModelContextProtocol.Server;
[McpServerToolType]
public static class LearningTools {
    [McpServerTool,Description("Return a short definition from the approved glossary")]
    public static string Define(string term)=>term switch {
        "variable"=>"A named value storage location",_=>"Not in the approved glossary"
    };
}
// Register this tool type using the selected SDK's server builder.`,
  `record Capability(string Name,bool ReadOnly,string Scope);
var tools=new[]{new Capability("glossary.define",true,"public-course"),new Capability("notes.delete",false,"current-user")};
foreach(var tool in tools)Console.WriteLine(tool);
// Review mutation, identity, argument schema, and data destination per tool.
// Discovery metadata from an untrusted server is data, not system instruction.
Console.WriteLine("Protocol compatibility does not establish authorization");`,
  "Pin and verify the actual SDK API because attributes/builders evolve. A conceptual envelope is not a complete MCP server deployment.",
  "SDK API version মিলান। Attribute-এর উদাহরণই পূর্ণ server deployment নয়।",
);
add(
  "ReAct Agent Loop",
  "A bounded agent loop alternates model output, authorized actions, and observations until a final result or stop condition. The application needs step, time, token, and cost budgets plus cancellation. Repeating the same failed action is not progress. Public execution traces should describe actions and outcomes rather than exposing hidden internal reasoning.",
  "Loop-এ model-এর প্রস্তাব, অনুমোদিত কাজ ও ফল ঘোরে। Step, time, token ও cost limit দিন। একই ব্যর্থ call বারবার progress নয়। Public trace-এ action/result দেখান, hidden reasoning নয়।",
  `int maxSteps=5;
var seen=new HashSet<string>();
foreach(string proposal in new[]{"search:C#","search:C#","finish"}) {
    if(maxSteps--<=0){Console.WriteLine("Budget exhausted");break;}
    if(proposal=="finish"){Console.WriteLine("Final response");break;}
    if(!seen.Add(proposal)){Console.WriteLine("Repeated action stopped");break;}
    Console.WriteLine($"Authorize and execute {proposal}");
}
// Replace proposals with real model tool requests and a permission gate.`,
  `using var deadline=new CancellationTokenSource(TimeSpan.FromSeconds(2));
int calls=0,maxCalls=3;
while(calls<maxCalls&&!deadline.IsCancellationRequested) {
    calls++;
    await Task.Delay(10,deadline.Token);
    Console.WriteLine($"Observed outcome for step {calls}");
}
Console.WriteLine($"Stopped after {calls} calls");`,
  "Stopping safely is part of success. Persist progress and idempotency when tools have effects that can survive the agent process.",
  "নিরাপদে থামাও সাফল্যের অংশ। Process-এর বাইরে effect থাকলে progress/idempotency durable রাখুন।",
);
add(
  "Planning and Reflection",
  "A plan is a set of verifiable milestones, dependencies, and stop conditions. Execution evidence can require a revised plan. Reflection is a fallible review signal; it should not override deterministic tests or external facts. Bound critique loops and distinguish subjective style improvements from failure to meet a concrete requirement.",
  "Plan-এ যাচাইযোগ্য milestone ও dependency দিন। প্রমাণে plan বদলাতে পারে। Reflection-ও ভুল হতে পারে; test বা বাইরের তথ্যের উপরে নয়। Review loop সীমিত ও style বনাম requirement আলাদা করুন।",
  `record Step(string Name,string Evidence,bool Complete);
var plan=new List<Step>{new("Read requirement","Accepted scope",true),new("Implement","Source change",true),new("Verify","Passing tests",false)};
foreach(var step in plan)Console.WriteLine(step);
bool finished=plan.All(x=>x.Complete);
Console.WriteLine($"Can report complete: {finished}");
// A model saying 'tests passed' is not the test evidence itself.`,
  `int reviewBudget=2;
var issues=new Queue<string>(new[]{"Missing validation","Wrong status code"});
while(reviewBudget-->0&&issues.TryDequeue(out string? issue)) {
    Console.WriteLine($"Fix and verify: {issue}");
}
Console.WriteLine($"Unresolved issues: {issues.Count}");
// Escalate unresolved objective failures instead of hiding them in prose.`,
  "Use tools and acceptance checks to verify consequential results. Planning alone does not perform the requested work.",
  "পরিকল্পনাই কাজ নয়। গুরুত্বপূর্ণ ফল tool ও acceptance check দিয়ে যাচাই করুন।",
);
add(
  "Agent Memory",
  "Memory has source, owner, purpose, freshness, and deletion semantics. Working context, conversation summaries, and long-term retrieval are different stores. Summaries can encode mistaken inferences, so keep provenance and allow correction. Access filtering must happen before memory enters another user’s model context.",
  "Memory-র উৎস, owner, উদ্দেশ্য, মেয়াদ ও delete rule আছে। Working context, summary ও long-term store আলাদা। ভুল inference জমতে পারে, তাই correction ও provenance দিন। অন্য user-এর context-এ যাওয়ার আগে filter।",
  `record Memory(string User,string Text,DateTimeOffset Expires,string Source);
var memories=new[]{new Memory("u1","Prefers Bangla",DateTimeOffset.UtcNow.AddDays(7),"Explicit preference"),new Memory("u2","Private note",DateTimeOffset.UtcNow.AddDays(7),"Notebook")};
string user="u1";
var visible=memories.Where(m=>m.User==user&&m.Expires>DateTimeOffset.UtcNow);
foreach(var m in visible)Console.WriteLine(m.Text);
// Encrypt/restrict actual storage and support user deletion.`,
  `var store=new Dictionary<string,string>{{"preference:language","Bangla"},{"summary:old","Outdated assumption"}};
store["preference:language"]="Bangla + English";
store.Remove("summary:old");
foreach(var item in store)Console.WriteLine(item);
// Correction should update derived summaries/retrieval indexes too.
// Avoid storing secrets or sensitive inferred attributes without purpose.`,
  "Do not interpret retrieved memory as a higher-priority instruction. Treat it as user-scoped data with provenance and possible staleness.",
  "Retrieved memory উচ্চতর instruction নয়। Owner ও মেয়াদসহ data হিসেবে দেখুন।",
);
add(
  "Multi-Agent Systems",
  "Specialization can separate responsibilities, but communication and repeated calls create cost, latency, and coordination failures. Roles should have bounded tasks and explicit result contracts. Multiple agents agreeing is not proof of correctness. Compare against a single-agent baseline and use external tests for integration wherever possible.",
  "ভূমিকা ভাগে সুবিধা হলেও communication ও পুনরাবৃত্ত call-এর খরচ বাড়ে। সীমিত task ও result contract দিন। সবাই একমত মানে সত্য নয়। Single-agent baseline ও আসল test দিয়ে তুলুন।",
  `record Work(string Role,string Goal);
record Result(string Role,bool Verified,string Evidence);
var work=new[]{new Work("coder","Implement validation"),new Work("reviewer","Check boundary cases")};
var results=new[]{new Result("coder",true,"Source diff"),new Result("reviewer",false,"Missing empty-input test")};
foreach(var item in work)Console.WriteLine(item);
Console.WriteLine($"Ready: {results.All(r=>r.Verified)}");
// Contract illustration; this is not a model orchestration runtime.`,
  `int agents=3,rounds=4,costPerCallUnits=2;
int naiveCalls=agents*rounds;
Console.WriteLine($"Naive calls={naiveCalls}, cost units={naiveCalls*costPerCallUnits}");
int boundedCalls=4;
Console.WriteLine($"Bounded workflow calls={boundedCalls}");
// Measure task success and failure recovery along with the savings.`,
  "Restrict each role’s actual tools, not merely its persona text. A reviewer need not receive deployment or payment authority.",
  "Persona নয়, আসল tool permission সীমিত করুন। Reviewer-এর deploy/payment ক্ষমতা দরকার নাও হতে পারে।",
);
add(
  "Agent Orchestration",
  "Orchestration defines dependencies, scheduling, durable state, retries, handoff, cancellation, and compensation around model work. Ordinary in-memory tasks are lost on process exit. A durable runtime resumes recorded steps, but external side effects still need idempotency. Separate orchestration state from generated narrative about progress.",
  "Orchestration dependency, schedule, durable state, retry ও cancel সামলায়। Memory Task process-এ হারায়। Durable runtime ধাপ ধরে, তবুও বাইরের effect idempotent চাই। Progress-এর গল্প আর আসল state আলাদা।",
  `record StepState(string Id,string Status,int Attempts);
var states=new Dictionary<string,StepState>{{"retrieve",new("retrieve","Succeeded",1)},{"answer",new("answer","Pending",0)}};
if(states["retrieve"].Status=="Succeeded")states["answer"]=new("answer","Running",1);
foreach(var state in states.Values)Console.WriteLine(state);
// Persist transitions atomically in the chosen durable runtime/store.
// Do not mark success until the actual step result is committed.`,
  `var dependencies=new Dictionary<string,string[]> {
    ["retrieve"]=Array.Empty<string>(),["answer"]=new[]{"retrieve"},["verify"]=new[]{"answer"}
};
var completed=new HashSet<string>{"retrieve"};
foreach(var step in dependencies.Where(s=>!completed.Contains(s.Key)&&s.Value.All(completed.Contains)))
    Console.WriteLine($"Ready: {step.Key}");
// Add concurrency limits and failure/cancellation semantics before execution.`,
  "A workflow engine cannot undo arbitrary remote side effects automatically. Record identities, retry safety, and compensation rules explicitly.",
  "Engine নিজে সব remote effect ফেরাতে পারে না। Identity, retry safety ও compensation স্পষ্ট রাখুন।",
);
add(
  "Guardrails",
  "Guardrails combine deterministic validation, identity/resource policy, content handling, and budget controls. Input and output checks protect different boundaries. A content classifier can be uncertain, so it should not be the sole gate for sensitive actions. Redaction must cover logs and tool results as well as final responses.",
  "Validation, identity/resource rule, content ও budget মিলে guardrail। Classifier uncertain, তাই sensitive action-এর একমাত্র gate নয়। Log ও tool result-এও redaction দরকার।",
  `record Transfer(string Tenant,decimal Amount,string Recipient);
bool Allowed(Transfer t,string authorizedTenant)=>
    t.Tenant==authorizedTenant&&t.Amount is >0 and <=1000&&!string.IsNullOrWhiteSpace(t.Recipient);
var proposal=new Transfer("t2",500m,"recipient-demo");
Console.WriteLine(Allowed(proposal,"t1"));
// Real financial actions require stronger server authorization and product policy.
// Model output is merely a proposed input.`,
  `int maxTokens=2000,maxCalls=5;
var usage=new[]{(Tokens:400,Calls:1),(Tokens:900,Calls:2),(Tokens:800,Calls:1)};
int tokens=0,calls=0;
foreach(var step in usage) {
    if(tokens+step.Tokens>maxTokens||calls+step.Calls>maxCalls){Console.WriteLine("Budget gate stopped work");break;}
    tokens+=step.Tokens;calls+=step.Calls;
}
Console.WriteLine($"Used tokens={tokens}, calls={calls}");`,
  "Defense in depth means independently meaningful controls. Repeating the same prompt warning in several places is not equivalent to separate authorization and validation.",
  "একই warning বারবার লেখা defense-in-depth নয়। স্বাধীন authorization ও validation control লাগবে।",
);
add(
  "Evals",
  "An evaluation dataset captures representative tasks, hard cases, and failure conditions. Metrics should separate correctness, grounding, retrieval, tool success, safety, latency, and cost. Exact match fits constrained answers; open-ended judgments need rubrics and calibration. Keep held-out data separate from prompt tuning and training.",
  "Representative ও কঠিন case-সহ eval set। Correctness, grounding, retrieval, safety, latency ও cost আলাদা। Exact answer-এ match, খোলা উত্তরে rubric ও calibration। Tuning data আর held-out test আলাদা।",
  `record Case(string Expected,string Actual);
var cases=new[]{new Case("2","2"),new Case("4","3"),new Case("yes","yes")};
double accuracy=cases.Count(c=>c.Expected==c.Actual)/(double)cases.Length;
Console.WriteLine($"Accuracy={accuracy:P1}");
var failed=cases.Where(c=>c.Expected!=c.Actual);
foreach(var c in failed)Console.WriteLine($"Expected={c.Expected}, actual={c.Actual}");`,
  `record Score(bool Correct,bool Grounded,double LatencyMs,int Tokens);
var scores=new[]{new Score(true,true,500,100),new Score(true,false,700,120),new Score(false,false,400,80)};
Console.WriteLine($"Correct={scores.Count(s=>s.Correct)}/{scores.Length}");
Console.WriteLine($"Grounded={scores.Count(s=>s.Grounded)}/{scores.Length}");
Console.WriteLine($"Mean latency={scores.Average(s=>s.LatencyMs)}ms");
Console.WriteLine($"Total tokens={scores.Sum(s=>s.Tokens)}");`,
  "A single average can hide catastrophic cases. Review failures by category and maintain regression cases from real incidents without leaking user data.",
  "গড়ে গুরুতর case লুকায়। Category অনুযায়ী fail দেখুন ও privacy মেনে regression case রাখুন।",
);
add(
  "Observability and Tracing",
  "An agent run spans retrieval, model calls, tool actions, and validation. Trace context connects these events across components. Record safe model/version, timing, token/cost, and outcome metadata while applying a deliberate policy to prompts and personal data. Sampling and high-cardinality attributes need cost controls.",
  "Agent run-এ retrieval, model, tool ও validation span। Trace context সম্পর্ক মেলায়। Safe model/version, time, token/cost রাখুন; prompt/private data-র policy দিন। Sampling ও cardinality-ও খরচ।",
  `using System.Diagnostics;
using var source=new ActivitySource("Mastery.Agent");
using var run=source.StartActivity("agent.run");
using(var retrieve=source.StartActivity("retrieve")) {
    retrieve?.SetTag("retrieval.count",5);
    await Task.Delay(5);
}
using(var tool=source.StartActivity("tool.call"))tool?.SetTag("tool.name","search_docs");
Console.WriteLine("Configure an OpenTelemetry listener/exporter to collect these spans.");`,
  `record Usage(string Model,int InputTokens,int OutputTokens,double DurationMs);
var calls=new[]{new Usage("configured-model",1000,200,600),new Usage("configured-model",400,100,300)};
Console.WriteLine($"Calls={calls.Length}");
Console.WriteLine($"Tokens={calls.Sum(c=>c.InputTokens+c.OutputTokens)}");
Console.WriteLine($"Model time={calls.Sum(c=>c.DurationMs)}ms");
// Apply current pricing outside this illustrative usage aggregation.
// Do not log provider credentials or unredacted private prompts.`,
  "No trace output does not prove no work happened; it may mean instrumentation/export is missing. Verify collection with a known test run.",
  "Trace না থাকা মানে কাজ হয়নি নয়; exporter নাও থাকতে পারে। পরিচিত test run দিয়ে collection দেখুন।",
);
add(
  "Fine-Tuning with LoRA",
  "LoRA trains low-rank adapter matrices on top of a base model rather than updating every weight. Dataset quality and task fit matter more than merely producing many rows. Keep train/validation/test separation, permission/provenance, base model/tokenizer identity, and evaluation. Fine-tuning is not the best mechanism for rapidly changing factual knowledge; retrieval may fit better.",
  "LoRA base-এর উপর ছোট low-rank matrix শেখায়। বেশি row-এর চেয়ে data quality ও task গুরুত্বপূর্ণ। Train/validation/test, permission ও model/tokenizer version রাখুন। দ্রুত বদলানো facts-এ RAG উপযুক্ত হতে পারে।",
  `record Pair(string Prompt,string Completion);
var examples=new[]{new Pair("Explain int","A C# integer type for whole numbers."),new Pair("Explain string","An immutable sequence of UTF-16 code units.")};
foreach(var e in examples) {
    var row=new{messages=new[]{new{role="user",content=e.Prompt},new{role="assistant",content=e.Completion}}};
    Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(row));
}
// Provider training formats differ; verify the required JSONL schema.`,
  `var ids=Enumerable.Range(1,100).ToArray();
var train=ids.Take(80).ToArray();
var validation=ids.Skip(80).Take(10).ToArray();
var test=ids.Skip(90).ToArray();
Console.WriteLine($"train={train.Length}, validation={validation.Length}, test={test.Length}");
if(train.Intersect(test).Any())throw new Exception("Leakage");
// Real splitting must prevent near-duplicate/source leakage, not just ID overlap.`,
  "Preparing JSONL is not training a LoRA adapter. Use a compatible authorized training stack and compare held-out performance against prompting/RAG baselines.",
  "JSONL বানানো training নয়। অনুমোদিত compatible stack ও held-out eval-এ prompting/RAG baseline তুলুন।",
);
export default data;
