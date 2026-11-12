export const concepts = {};
function add(name, en, bn, code, flow, caution, deep) {
  concepts[name] = { en, bn, code, flow: flow.split(" > "), caution, deep };
}
add(
  "Arrays and Strings",
  "An array stores a fixed number of elements addressable by index. A string is an immutable sequence of UTF-16 code units; changing text creates another string.",
  "Array হলো নম্বর দেওয়া সারিতে রাখা বাক্স। String-এর লেখা বদলালে নতুন string তৈরি হয়।",
  `int[] scores = { 10, 20, 30 }; ~~ Allocate three indexed integers. / তিনটি পূর্ণসংখ্যার array তৈরি।
int first = scores[0]; ~~ Index zero reads the first element. / শূন্য index-এ প্রথম মান।
scores[1] = 25; ~~ Replace the second element in place. / দ্বিতীয় মান বদলান।
Console.WriteLine(first); ~~ Print 10; the saved variable is independent. / সংরক্ষিত ১০ দেখান।`,
  "Allocate > Index 0 > Update index 1 > Read result",
  "Array bounds are 0 through Length - 1. A C# char is not necessarily one visible Unicode character.",
  "Index access is O(1), traversal O(n). Span<T> is a non-owning view; it does not make unsafe lifetimes valid.",
);
add(
  "Hashing",
  "A hash table maps keys to buckets so a value can usually be found without scanning every item. Equality, not the hash alone, decides whether keys match.",
  "নামের প্রথম অক্ষর ধরে আলাদা ড্রয়ারে খোঁজার মতো key দিয়ে মান খুঁজুন।",
  `var stock = new Dictionary<string, int>(); ~~ Create a key-to-value lookup. / নাম থেকে সংখ্যা খোঁজার টেবিল।
stock["tea"] = 5; ~~ Store five units under the tea key. / tea নামে ৫ রাখুন।
bool found = stock.TryGetValue("tea", out int count); ~~ Read safely without a missing-key exception. / key না থাকলেও নিরাপদে খুঁজুন।
Console.WriteLine(count); ~~ Print the retrieved quantity, 5. / পাওয়া পরিমাণ ৫ দেখান।`,
  "Key > Hash bucket > Equality check > Value",
  "Equal keys must have equal hash codes. Do not mutate fields that determine a key’s hash after insertion.",
  "Lookup is expected O(1), worst-case O(n). Resizing and poor hash distribution affect latency.",
);
add(
  "Two Pointers",
  "Use two indices to inspect a sequence from different positions. On a sorted array, moving the correct boundary avoids testing every pair.",
  "সাজানো সারির দুই প্রান্তে দুই আঙুল রেখে যোগফল অনুযায়ী কাছে আনুন।",
  `int[] values = { 1, 3, 4, 7 }; ~~ Use sorted input. / সাজানো array নিন।
int left = 0, right = values.Length - 1; ~~ Start at opposite ends. / দুই প্রান্তে pointer রাখুন।
while (left < right) { ~~ Stop when pointers meet. / pointer মিললে থামুন।
  int sum = values[left] + values[right]; ~~ Inspect the pair sum. / দুই মানের যোগফল নিন।
  if (sum == 8) { Console.WriteLine($"{left},{right}"); break; } ~~ Found the target pair. / জোড়া পাওয়া গেছে।
  if (sum < 8) left++; else right--; ~~ Raise a small sum or lower a large sum. / যোগফল অনুযায়ী এক প্রান্ত সরান।
} ~~ End the search. / খোঁজা শেষ।`,
  "Sorted input > Inspect ends > Move boundary > Pair found",
  "The sum-direction rule requires sorted input. Preserve original indices separately if needed.",
  "O(n) time and O(1) extra space after sorting. Sorting itself costs O(n log n).",
);
add(
  "Sliding Window",
  "Maintain a result for a contiguous range while adding its new right element and removing its old left element.",
  "তিনটি পাশাপাশি দিনের খরচের হিসাব: নতুন দিন যোগ, পুরোনো দিন বাদ।",
  `int[] a = { 2, 1, 5, 1, 3 }; ~~ Define the sequence. / ধারার মানগুলো নিন।
int k = 3, sum = 0, best = int.MinValue; ~~ Choose a window of three. / তিন ঘরের window।
for (int i = 0; i < a.Length; i++) { ~~ Advance the right edge. / ডান প্রান্ত এগোন।
  sum += a[i]; if (i >= k) sum -= a[i-k]; ~~ Add incoming and remove outgoing values. / নতুনটি যোগ, পুরোনোটি বাদ।
  if (i >= k-1) best = Math.Max(best, sum); ~~ Evaluate only full windows. / পূর্ণ window-এর সেরা যোগফল রাখুন।
} ~~ All windows visited. / সব window দেখা শেষ।
Console.WriteLine(best); ~~ Print 9. / ফল ৯।`,
  "Expand right > Add value > Remove left > Update best",
  "Validate 1 <= k <= array length. Some variable-window rules fail when negative numbers are allowed.",
  "Fixed windows run in O(n). For signed sums, prefix sums plus a map may be needed instead of a monotonic window.",
);
add(
  "Prefix Sum",
  "Store the sum before each position so any inclusive range sum is one subtraction.",
  "আগের দিনের মোট খরচ লিখে রাখলে দুই দিনের মধ্যের খরচ বিয়োগেই পাওয়া যায়।",
  `int[] a = { 2, 4, 1, 3 }; ~~ Source values. / মূল মান।
long[] prefix = new long[a.Length + 1]; ~~ Leave prefix[0] as zero. / শুরুর যোগফল শূন্য।
for (int i = 0; i < a.Length; i++) prefix[i+1] = prefix[i] + a[i]; ~~ Accumulate preceding values. / আগের মোটের সাথে নতুন মান যোগ।
long range = prefix[4] - prefix[1]; ~~ Sum indices 1 through 3: 4+1+3. / ১ থেকে ৩ index-এর যোগফল।
Console.WriteLine(range); ~~ Print 8. / ফল ৮।`,
  "Input array > Accumulate > Choose range > Subtract prefixes",
  "The extra leading zero prevents an awkward special case at the first element.",
  "Build in O(n), query in O(1), update O(n). Fenwick trees support changing data in O(log n).",
);
add(
  "Binary Search",
  "Repeatedly discard half of a sorted search interval. Keep an invariant describing where a possible answer can still exist.",
  "অভিধানের মাঝখান খুলে অর্ধেক পাতা বাদ দেওয়ার মতো খুঁজুন।",
  `int[] a = { 2, 4, 6, 8, 10 }; ~~ A sorted array is required. / সাজানো array দরকার।
int lo = 0, hi = a.Length - 1, answer = -1; ~~ Use an inclusive interval. / দুই প্রান্তসহ সীমা নিন।
while (lo <= hi) { ~~ Search until the interval is empty. / সীমা ফাঁকা না হওয়া পর্যন্ত।
  int mid = lo + (hi - lo) / 2; ~~ Compute the midpoint safely. / মাঝের index নিন।
  if (a[mid] == 8) { answer = mid; break; } ~~ Record a matching index. / মিলের index রাখুন।
  if (a[mid] < 8) lo = mid + 1; else hi = mid - 1; ~~ Discard the impossible half. / অসম্ভব অর্ধেক বাদ।
} ~~ The answer is 3. / উত্তর index ৩।`,
  "Sorted interval > Middle element > Discard half > Found or empty",
  "Do not mix inclusive and half-open interval formulas. Always move a boundary beyond mid.",
  "O(log n) time, O(1) space. Search-on-answer needs a monotonic feasibility predicate.",
);
add(
  "Stack and Queue",
  "A stack removes the newest item first (LIFO). A queue removes the oldest item first (FIFO).",
  "থালার স্তূপে শেষ থালা আগে ওঠে; লাইনে আগে আসা মানুষ আগে যায়।",
  `var stack = new Stack<int>(); ~~ Create a last-in-first-out collection. / শেষে আসা আগে বের হবে।
stack.Push(10); stack.Push(20); ~~ Put 10 then 20 on top. / ১০-এর উপর ২০।
Console.WriteLine(stack.Pop()); ~~ Remove and print 20. / ২০ আগে বের হয়।
var queue = new Queue<int>(); ~~ Create a first-in-first-out collection. / আগে আসা আগে যাবে।
queue.Enqueue(10); queue.Enqueue(20); ~~ Join the queue in order. / ক্রমানুসারে লাইনে ঢোকান।
Console.WriteLine(queue.Dequeue()); ~~ Remove and print 10. / ১০ আগে বের হয়।`,
  "Insert items > Collection rule > Remove next > Observe order",
  "Pop and Dequeue throw when empty; TryPop and TryDequeue make empty handling explicit.",
  "Most operations are amortized O(1). Neither ordinary collection is safe for unsynchronized concurrent mutation.",
);
add(
  "Linked List",
  "A linked list stores values in separate nodes connected by references. Finding a position requires following links.",
  "এক কামরার সাথে পরের কামরা জোড়া থাকা ট্রেনের মতো node-এর শিকল।",
  `var list = new LinkedList<int>(); ~~ Allocate a doubly linked list. / দুই দিকের link-সহ তালিকা।
var first = list.AddLast(10); ~~ Append a node and retain its reference. / node যোগ করে ঠিকানা রাখুন।
list.AddAfter(first, 20); ~~ Insert directly after a known node. / চেনা node-এর পরে যোগ।
list.Remove(first); ~~ Remove the known node without a search. / সরাসরি চেনা node সরান।
Console.WriteLine(list.First!.Value); ~~ Print the remaining value, 20. / বাকি মান ২০।`,
  "Head reference > Follow node > Relink neighbors > Updated chain",
  "Index access is O(n), not O(1). The null-forgiving operator in this example relies on a known nonempty list.",
  "Insertion/removal is O(1) when a node is already known. Node allocations and poor cache locality often make arrays faster.",
);
add(
  "Monotonic Stack",
  "Keep candidates ordered in a stack; remove candidates that a newer element makes irrelevant.",
  "যে ছোট ভবনটি নতুন বড় ভবনের আড়ালে পড়ে, তাকে আর প্রার্থী রাখবেন না।",
  `int[] a = { 2, 1, 3 }; ~~ Seek the next greater value for each position. / পরের বড় মান খুঁজুন।
var pending = new Stack<int>(); ~~ Store unresolved indices. / অমীমাংসিত index রাখুন।
for (int i = 0; i < a.Length; i++) { ~~ Visit each new value. / এক এক করে মান দেখুন।
  while (pending.Count > 0 && a[pending.Peek()] < a[i]) ~~ Resolve smaller candidates. / ছোট প্রার্থীগুলো সমাধান করুন।
    Console.WriteLine($"{pending.Pop()} -> {a[i]}"); ~~ Print the next-greater match. / পরের বড় মান দেখান।
  pending.Push(i); ~~ Keep this position for a future match. / ভবিষ্যতের জন্য index রাখুন।
} ~~ Remaining indices have no greater value to their right. / বাকিদের ডানে বড় মান নেই।`,
  "New value > Compare top > Pop resolved > Push index",
  "Use indices when distances or duplicate positions matter. Choose < versus <= deliberately.",
  "Each index is pushed and popped once: O(n) total time and O(n) extra space.",
);
add(
  "Recursion",
  "A function solves a problem by calling itself on a smaller instance until reaching a base case. Each active call occupies a stack frame.",
  "বড় বাক্সের ভেতর ছোট বাক্স খুলতে খুলতে শেষ বাক্সে পৌঁছানোর মতো।",
  `int Factorial(int n) { ~~ Define a function for nonnegative n. / শূন্য বা বড় n-এর factorial।
  if (n < 0) throw new ArgumentOutOfRangeException(nameof(n)); ~~ Reject invalid input. / ঋণাত্মক মান বাতিল।
  if (n <= 1) return 1; ~~ Base case stops recursive calls. / থামার শর্ত।
  return checked(n * Factorial(n - 1)); ~~ Combine with the smaller solution. / ছোট সমস্যার ফল গুণ করুন।
} ~~ End the function. / ফাংশন শেষ।
Console.WriteLine(Factorial(4)); ~~ Print 24. / ফল ২৪।`,
  "Call n > Base-case test > Call n-1 > Unwind results",
  "Without a decreasing argument and a reachable base case, recursion may exhaust the call stack.",
  "Factorial here takes O(n) time and stack. int overflows quickly; checked reports that instead of wrapping.",
);
add(
  "Backtracking",
  "Build a partial candidate, explore it, then undo the last choice before trying another branch.",
  "এক পথ ভুল হলে আগের মোড়ে ফিরে অন্য পথ চেষ্টা করুন।",
  `void Subsets(int[] a, int i, List<int> chosen) { ~~ Track the next index and current subset. / পরের index ও পছন্দের তালিকা।
  if (i == a.Length) { Console.WriteLine(string.Join(",", chosen)); return; } ~~ Emit a finished choice. / সম্পূর্ণ ফল দেখান।
  Subsets(a, i + 1, chosen); ~~ Explore without the current item. / বর্তমানটি বাদ দিয়ে চেষ্টা।
  chosen.Add(a[i]); ~~ Choose the current item. / বর্তমানটি নিন।
  Subsets(a, i + 1, chosen); ~~ Explore with the item included. / নিয়ে পরের ধাপে যান।
  chosen.RemoveAt(chosen.Count - 1); ~~ Undo the choice for the next branch. / আগের অবস্থা ফেরত আনুন।
} ~~ Invoke with Subsets(new[] {1,2}, 0, new List<int>()). / ছোট input দিয়ে ডাকুন।`,
  "Choose > Explore branch > Reach solution > Undo choice",
  "Forgetting to undo mutable state contaminates later branches. Copy a result before storing it.",
  "Enumerating all subsets needs O(2^n) candidates; materializing them adds O(n·2^n) output work. Prune only impossible branches.",
);
add(
  "Trees and BST",
  "A binary tree has up to two children per node. A binary search tree additionally orders left descendants below and right descendants above each key.",
  "পরিবারের গাছের মতো node; BST-তে ছোট মান বাঁয়ে আর বড় মান ডানে।",
  `bool Contains(Node? root, int key) { ~~ Search a binary search tree. / BST-তে মান খুঁজুন।
  if (root is null) return false; ~~ An empty branch has no match. / ফাঁকা শাখায় নেই।
  if (root.Key == key) return true; ~~ Stop at an exact key. / মিললে পাওয়া গেছে।
  return Contains(key < root.Key ? root.Left : root.Right, key); ~~ Follow only the possible side. / সম্ভব দিকেই যান।
} ~~ End the search. / খোঁজা শেষ।
record Node(int Key, Node? Left = null, Node? Right = null); ~~ Model a tree node. / একটি node-এর গঠন।`,
  "Root > Compare key > Left or right > Match or null",
  "An ordinary binary tree is not necessarily a BST. Decide how duplicate keys are stored.",
  "Lookup is O(h): O(log n) in a balanced tree, O(n) in a degenerate chain.",
);
add(
  "Heap / Priority Queue",
  "A heap keeps the smallest-priority element at the root without fully sorting all elements. .NET PriorityQueue is a min-priority queue.",
  "জরুরি রোগীকে আগে ডাকুন, কিন্তু সবার তালিকা পুরো সাজাতে হবে না।",
  `var jobs = new PriorityQueue<string, int>(); ~~ Lower numbers are dequeued first. / ছোট priority আগে।
jobs.Enqueue("report", 3); ~~ Add a lower-urgency task. / কম জরুরি কাজ।
jobs.Enqueue("incident", 1); ~~ Add a more urgent task. / বেশি জরুরি কাজ।
Console.WriteLine(jobs.Dequeue()); ~~ Print incident. / incident আগে বের হয়।`,
  "Insert job > Restore heap > Inspect minimum > Dequeue",
  "Equal priorities do not promise stable insertion order. Encode a sequence tie-breaker if required.",
  "Enqueue/dequeue O(log n), peek O(1). A heap is useful for Top-K and Dijkstra but not arbitrary membership search.",
);
add(
  "Graphs: BFS and DFS",
  "BFS explores one distance layer at a time with a queue. DFS follows a path deeply with a stack or recursion before backtracking.",
  "BFS কাছের বাড়িগুলো আগে দেখে; DFS একটি গলি ধরে শেষ পর্যন্ত যায়।",
  `int[][] graph = { new[] {1, 2}, new[] {2}, Array.Empty<int>() }; ~~ Adjacency lists store outgoing edges. / প্রতিবেশীর তালিকা।
var seen = new HashSet<int> { 0 }; ~~ Mark the starting vertex. / শুরুর node দেখা হয়েছে।
var q = new Queue<int>(); q.Enqueue(0); ~~ Begin breadth-first search. / BFS শুরু।
while (q.TryDequeue(out int node)) { ~~ Visit the next queued vertex. / পরের node বের করুন।
  Console.WriteLine(node); ~~ Observe traversal order. / দেখার ক্রম লিখুন।
  foreach (int next in graph[node]) if (seen.Add(next)) q.Enqueue(next); ~~ Queue unseen neighbors once. / অদেখা প্রতিবেশী যোগ।
} ~~ All reachable vertices have been visited. / পৌঁছানো যায় এমন সব দেখা শেষ।`,
  "Start vertex > Visit frontier > Add unseen neighbors > Next layer",
  "Mark nodes when enqueuing, not later, to avoid duplicate queue entries.",
  "Both take O(V+E). BFS gives shortest edge-count paths only when edge weights are equal.",
);
add(
  "Tries",
  "A trie stores shared key prefixes as paths of character edges. Prefix lookup follows the prefix instead of scanning all words.",
  "একই শুরু থাকা শব্দগুলো একই রাস্তা ভাগ করে, পরে আলাদা শাখা হয়।",
  `var root = new TrieNode(); ~~ Allocate the root. / গাছের মূল তৈরি।
var node = root; ~~ Start inserting at the root. / মূল থেকে শুরু।
foreach (char c in "cat") { ~~ Walk one character at a time. / এক অক্ষর করে যান।
  if (!node.Next.ContainsKey(c)) node.Next[c] = new TrieNode(); ~~ Create a missing edge. / না থাকা শাখা বানান।
  node = node.Next[c]; ~~ Advance down the character edge. / অক্ষরের পথে এগোন।
} ~~ The path c-a-t now exists. / c-a-t পথ তৈরি।
node.IsWord = true; ~~ Distinguish a full word from a prefix. / সম্পূর্ণ শব্দ চিহ্নিত।
class TrieNode { public bool IsWord; public Dictionary<char, TrieNode> Next = new(); } ~~ Node data. / node-এর তথ্য।`,
  "Root > Character edge > Shared prefix > Word marker",
  "A prefix path existing does not prove it is a complete stored word. Unicode normalization may be needed.",
  "Insertion/search O(L) for length L. Per-node dictionaries consume substantial memory; compressed tries reduce it.",
);
add(
  "Topological Sort",
  "Order a directed acyclic graph so every prerequisite appears before the item that depends on it.",
  "রান্নার আগে বাজার করার মতো নির্ভরতার ক্রম সাজান।",
  `int[][] g = { new[] {1, 2}, new[] {2}, Array.Empty<int>() }; ~~ Edges mean prerequisite to dependent. / আগে থেকে পরের কাজের সংযোগ।
int[] indegree = new int[g.Length]; ~~ Count prerequisites per vertex. / কতটি পূর্বশর্ত গুনুন।
foreach (var edges in g) foreach (int v in edges) indegree[v]++; ~~ Build incoming-edge counts. / আগত সংযোগ গুনুন।
var q = new Queue<int>(Enumerable.Range(0, g.Length).Where(v => indegree[v] == 0)); ~~ Queue ready work. / প্রস্তুত কাজ নিন।
int visited = 0; ~~ Count scheduled vertices. / সম্পন্ন কাজের সংখ্যা।
while (q.TryDequeue(out int u)) { visited++; foreach (int v in g[u]) if (--indegree[v] == 0) q.Enqueue(v); } ~~ Release newly ready work. / পূর্বশর্ত শেষ হলে পরের কাজ দিন।
Console.WriteLine(visited == g.Length ? "DAG" : "Cycle"); ~~ Detect a cycle when vertices remain. / বাকি থাকলে cycle।`,
  "Count incoming edges > Queue zero-degree > Remove edge > Release dependent",
  "Topological order is defined for directed acyclic graphs. More than one valid order may exist.",
  "Kahn’s algorithm costs O(V+E). A processed count below V proves a directed cycle exists.",
);
add(
  "Dijkstra's Algorithm",
  "Find shortest path distances in a graph with nonnegative edge weights by repeatedly settling the cheapest pending vertex.",
  "সবচেয়ে কম খরচের রাস্তা আগে নিশ্চিত করে ধীরে ধীরে গন্তব্যে যান।",
  `var edges = new[] { new[] {(to:1, cost:4), (to:2, cost:1)}, Array.Empty<(int to,int cost)>(), new[] {(to:1,cost:2)} }; ~~ A weighted graph. / ওজনসহ graph।
long[] dist = { 0, long.MaxValue, long.MaxValue }; ~~ Start distance is zero. / শুরুর দূরত্ব শূন্য।
var pq = new PriorityQueue<int, long>(); pq.Enqueue(0, 0); ~~ Queue the source. / শুরুর node নিন।
while (pq.TryDequeue(out int u, out long d)) { ~~ Expand the cheapest candidate. / কম খরচের প্রার্থী।
  if (d != dist[u]) continue; ~~ Ignore stale queue entries. / পুরোনো হিসাব বাদ।
  foreach (var e in edges[u]) if (d + e.cost < dist[e.to]) { dist[e.to] = d + e.cost; pq.Enqueue(e.to, dist[e.to]); } ~~ Relax an improved route. / ভালো রাস্তা পেলে বদলান।
} ~~ dist[1] is 3 via vertex 2. / ২ হয়ে ১-এর দূরত্ব ৩।`,
  "Source distance > Cheapest vertex > Relax edges > Updated distances",
  "Negative edge weights break Dijkstra’s settling rule. Use Bellman-Ford for that case.",
  "With a heap, typical complexity is O((V+E) log V). Duplicate queue entries require a stale-entry check.",
);
add(
  "Union Find",
  "Track disjoint components with parent references. Find identifies a representative; union joins components.",
  "দলের নেতা দেখে বুঝুন দুজন একই দলে আছে কি না, দরকারে দল মেলান।",
  `int[] parent = Enumerable.Range(0, 5).ToArray(); ~~ Each item starts in its own component. / শুরুতে সবাই আলাদা।
int Find(int x) => parent[x] == x ? x : parent[x] = Find(parent[x]); ~~ Compress paths to the representative. / নেতার পথে link ছোট করুন।
void Union(int a, int b) => parent[Find(a)] = Find(b); ~~ Join two roots. / দুই দলের নেতা মেলান।
Union(1, 2); Union(2, 3); ~~ Connect three items. / তিনটি সদস্য জুড়ুন।
Console.WriteLine(Find(1) == Find(3)); ~~ Print True. / একই দল, তাই True।`,
  "Separate sets > Find roots > Union roots > Shared representative",
  "This minimal example omits union by rank/size. Add it for robust performance on adversarial sequences.",
  "Path compression plus union by rank/size gives amortized inverse-Ackermann complexity. It does not support ordinary edge deletion.",
);
add(
  "Greedy Algorithms",
  "At each step choose a locally best valid option. The choice is correct only when a proof shows it can belong to an optimal solution.",
  "প্রতিবার সুবিধার কাজটি বেছে নেওয়া ঠিক হবে কি না, আগে যুক্তি দিয়ে প্রমাণ করুন।",
  `var meetings = new[] { (start:1,end:3), (start:2,end:5), (start:4,end:6) }; ~~ Candidate intervals. / সম্ভাব্য সময়সূচি।
int freeAt = int.MinValue, count = 0; ~~ Track the next available time. / পরের ফাঁকা সময়।
foreach (var m in meetings.OrderBy(x => x.end)) { ~~ Prefer the earliest finishing meeting. / আগে শেষ হয় এমনটি আগে।
  if (m.start < freeAt) continue; ~~ Skip an overlapping interval. / সংঘর্ষ হলে বাদ।
  count++; freeAt = m.end; ~~ Accept it and advance availability. / নিন ও ফাঁকা সময় বদলান।
} ~~ The result is two meetings. / দুইটি মিটিং নেওয়া যায়।`,
  "Sort by finish > Check compatibility > Accept interval > Continue",
  "Choosing the shortest interval or earliest start does not solve this objective in general.",
  "Sorting costs O(n log n). An exchange argument proves the earliest-finish greedy choice for maximum interval count.",
);
add(
  "Dynamic Programming",
  "Reuse answers to overlapping subproblems and define a recurrence that builds a larger answer from smaller ones.",
  "একই ছোট হিসাব বারবার না করে লিখে রাখুন, পরে বড় হিসাব বানান।",
  `int n = 8; ~~ Ask for Fibonacci number 8. / অষ্টম Fibonacci।
long[] dp = new long[n + 2]; ~~ Reserve the table including small base cases. / ছোট ফল রাখার ছক।
dp[1] = 1; ~~ Define the base case. / শুরুর উত্তর।
for (int i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2]; ~~ Reuse the preceding answers. / আগের দুটি ফল যোগ।
Console.WriteLine(dp[n]); ~~ Print 21. / ফল ২১।`,
  "Define state > Set base cases > Apply recurrence > Read answer",
  "A DP state must include every fact needed by future choices. Similar-looking partial problems may have different answers.",
  "This runs O(n) time and space; two rolling variables reduce space to O(1). Numeric overflow still limits the sequence.",
);
add(
  "OOP Pillars",
  "Encapsulation protects state, abstraction exposes a useful contract, inheritance specializes behavior, and polymorphism lets callers use different implementations through one contract.",
  "টিভির ভেতরের সার্কিট না জেনেও রিমোট ব্যবহার করেন: দরকারি বোতাম বাইরে, জটিলতা ভেতরে।",
  `IShape shape = new Circle(2); ~~ Refer to a concrete object through an interface. / interface দিয়ে আসল object ব্যবহার।
Console.WriteLine(shape.Area()); ~~ Dispatch to Circle.Area. / Circle-এর আচরণ চলবে।
interface IShape { double Area(); } ~~ Define the abstraction. / চুক্তি নির্ধারণ।
class Circle(double radius) : IShape { public double Area() => Math.PI * radius * radius; } ~~ Encapsulate radius and implement the contract. / তথ্য ভেতরে রেখে কাজ বাস্তবায়ন।`,
  "Caller > Interface contract > Concrete object > Behavior",
  "Inheritance is not required for every design. Use private state and explicit invariants rather than public mutable fields.",
  "Prefer substitutable contracts. Virtual dispatch has a cost, but coupling and invalid state are usually the larger design risks.",
);
add(
  "SOLID Principles",
  "SOLID describes five design pressures: one reason to change, extension through contracts, substitutable implementations, focused interfaces, and dependency on abstractions.",
  "এক দোকানে ক্যাশিয়ার, রাঁধুনি আর ডেলিভারির কাজ আলাদা হলে পরিবর্তন সহজ হয়।",
  `interface ISender { void Send(string message); } ~~ A focused dependency contract. / ছোট কাজের চুক্তি।
class ConsoleSender : ISender { public void Send(string message) => Console.WriteLine(message); } ~~ One replaceable implementation. / বদলানো যায় এমন বাস্তবায়ন।
class ReceiptService(ISender sender) { public void Issue() => sender.Send("Paid"); } ~~ Depend on the contract, not a concrete transport. / নির্দিষ্ট মাধ্যম নয়, চুক্তির উপর নির্ভর।
new ReceiptService(new ConsoleSender()).Issue(); ~~ Compose dependencies at the boundary. / বাইরে থেকে নির্ভরতা দিন।`,
  "Composition root > Service contract > Implementation > Result",
  "SOLID is guidance, not a reason to create an interface for every class. Name the actual change you are isolating.",
  "Liskov substitution includes behavioral expectations such as preconditions, postconditions, and exceptions, not just method signatures.",
);
add(
  "DRY / KISS / YAGNI",
  "DRY avoids duplicating knowledge, KISS favors clear solutions, and YAGNI postpones features until they are needed.",
  "একই নিয়ম দুই জায়গায় লিখবেন না; সহজ রাখুন; দরকারের আগে বাড়তি জটিলতা নয়।",
  `decimal AddTax(decimal subtotal, decimal rate) => subtotal * (1 + rate); ~~ Keep one explicit tax rule. / করের নিয়ম এক জায়গায়।
Console.WriteLine(AddTax(100m, 0.15m)); ~~ Pass the rate rather than hard-code a global assumption. / করের হার স্পষ্ট করে দিন।`,
  "Requirement > Small rule > Explicit inputs > Verified result",
  "Two similar code fragments may represent different business rules and should not always share an abstraction.",
  "The cost of an abstraction includes navigation, configuration, and future compatibility. Extract stable knowledge, not accidental syntax.",
);
add(
  "Composition over Inheritance",
  "Build behavior by holding collaborating objects rather than extending a deep class hierarchy.",
  "মোবাইলে আলাদা ক্যামেরা মডিউল লাগানোর মতো কাজ জুড়ে দিন, বিশাল বংশতালিকা বানাবেন না।",
  `interface IDiscount { decimal Apply(decimal price); } ~~ Describe a replaceable behavior. / বদলানো যায় এমন নিয়ম।
class NoDiscount : IDiscount { public decimal Apply(decimal price) => price; } ~~ Supply one strategy. / একটি কৌশল দিন।
class Checkout(IDiscount discount) { public decimal Total(decimal price) => discount.Apply(price); } ~~ Hold a collaborator instead of inheriting it. / উত্তরাধিকার নয়, সহযোগী রাখুন।`,
  "Checkout > Discount collaborator > Apply rule > Total",
  "Delegation needs a clear ownership and lifetime model; composition does not eliminate design decisions.",
  "Composition can vary behavior at runtime and avoids fragile base-class changes. Inheritance is appropriate for genuine substitutable is-a relationships.",
);
add(
  "UML Class Diagrams",
  "A class diagram shows types, members, and relationships: inheritance, implementation, association, aggregation, and composition.",
  "বাড়ি বানানোর নকশার মতো object-গুলোর সম্পর্ক আগে আঁকুন।",
  `interface INotifier { void Notify(); } ~~ UML interface: a contract with an operation. / interface-এর চুক্তি।
class EmailNotifier : INotifier { public void Notify() { } } ~~ Dashed realization arrow to INotifier. / implementation সম্পর্ক।
class OrderService(INotifier notifier) { } ~~ Association: OrderService depends on a notifier. / নির্ভরতার সংযোগ।`,
  "Identify types > Define members > Draw relationships > Check ownership",
  "A filled composition diamond implies strong ownership/lifetime; it is not a decoration for any field.",
  "Use diagrams to communicate boundaries and multiplicity, then keep them synchronized with important design changes.",
);
add(
  "Singleton",
  "A singleton lifetime shares one service instance within a defined container or scope of ownership. It does not mean one instance across every server.",
  "এক অফিসের একটি রিসেপশন ডেস্কের মতো একটি container-এ সবার জন্য এক instance।",
  `var builder = WebApplication.CreateBuilder(args); ~~ Create the application and service container. / অ্যাপ ও service container।
builder.Services.AddSingleton<Clock>(); ~~ Share one Clock instance per container. / একই Clock instance দিন।
var app = builder.Build(); ~~ Finalize dependency registration. / নিবন্ধন শেষ।
app.MapGet("/time", (Clock clock) => clock.UtcNow); ~~ Resolve the shared service for a request. / request-এ shared service নিন।
app.Run(); ~~ Start the ASP.NET Core host. / সার্ভার চালু।
class Clock { public DateTime UtcNow => DateTime.UtcNow; } ~~ Stateless singleton is safe to share. / state নেই, ভাগ করা সহজ।`,
  "Container > Register singleton > Resolve instance > Shared service",
  "Never capture a scoped DbContext in a singleton. Mutable singleton state needs synchronization.",
  "A singleton exists per process/container, so distributed coordination still requires an external consistency mechanism.",
);
add(
  "Factory",
  "A factory centralizes object creation so callers ask for a capability instead of knowing constructor details.",
  "দোকানে চা চান; কোন কেটলি ব্যবহার হবে তা দোকান ঠিক করে।",
  `IFormat Create(string kind) => kind switch { "json" => new JsonFormat(), _ => throw new ArgumentException("Unknown format") }; ~~ Choose an implementation. / ধরন অনুযায়ী object বানান।
interface IFormat { string Name { get; } } ~~ Shared product contract. / পণ্যের চুক্তি।
class JsonFormat : IFormat { public string Name => "JSON"; } ~~ One concrete product. / একটি বাস্তব পণ্য।`,
  "Requested kind > Factory decision > Construct product > Return interface",
  "A factory returning arbitrary service-locator dependencies can hide coupling; prefer explicit inputs.",
  "Factories help when creation varies, is expensive, or needs policy. Avoid adding them for a constructor that has no meaningful variability.",
);
add(
  "Abstract Factory",
  "An abstract factory creates a family of compatible products through a shared contract.",
  "একই ডিজাইনের চেয়ার-টেবিল সেট বানানোর কারখানার মতো মিল থাকা পরিবার তৈরি করুন।",
  `interface IUiFactory { string Button(); string Dialog(); } ~~ A family-level creation contract. / পণ্যের পরিবারের চুক্তি।
class DarkUi : IUiFactory { public string Button() => "dark-button"; public string Dialog() => "dark-dialog"; } ~~ Create matching products. / মিল থাকা পণ্য।
IUiFactory ui = new DarkUi(); ~~ Select the family once. / পরিবার একবার বাছুন।
Console.WriteLine(ui.Button()); ~~ Consume through the contract. / চুক্তি দিয়ে ব্যবহার।`,
  "Select family > Abstract factory > Matching products > Client",
  "Factories should maintain compatibility between products; unrelated constructors do not necessarily form a family.",
  "Adding a product type changes every family factory. Adding a new family is easy when the product set is stable.",
);
add(
  "Builder",
  "A builder collects construction choices before creating a valid object, useful when construction has many optional steps.",
  "বিরিয়ানির অর্ডারে পরিমাণ, ঝাল, ডিম আলাদা বেছে শেষে অর্ডার তৈরি করুন।",
  `var builder = new UriBuilder("https", "example.com"); ~~ Start with a valid scheme and host. / scheme ও host দিন।
builder.Path = "api/orders"; ~~ Add a path as a separate construction step. / path যোগ।
builder.Query = "page=1"; ~~ Configure an optional query string. / query যোগ।
Uri endpoint = builder.Uri; ~~ Materialize the resulting URI. / চূড়ান্ত URI তৈরি।`,
  "Required inputs > Optional choices > Validate > Build",
  "A fluent API is not automatically a builder. Validate the final object and avoid leaking partially valid state.",
  "Immutable records plus named arguments may be simpler for small objects. Builders help when construction order or validation is nontrivial.",
);
add(
  "Prototype",
  "Create a new object by copying an existing configured object. C# record with-expressions perform a non-destructive shallow copy.",
  "পুরোনো ফর্মের কপি নিয়ে শুধু নাম বদলানোর মতো।",
  `var original = new Label("Tea", 20m); ~~ Create an immutable value-oriented record. / record তৈরি।
var copy = original with { Price = 25m }; ~~ Copy and replace one property. / কপি করে দাম বদলান।
Console.WriteLine(original.Price); ~~ Original stays 20. / আগের দাম ২০-ই থাকে।
record Label(string Name, decimal Price); ~~ Define the record shape. / record-এর গঠন।`,
  "Original > Copy > Change selected field > Independent value",
  "with is shallow: nested mutable collections remain shared unless copied explicitly.",
  "Deep copying must define identity, cycles, shared references, and resource ownership; blind serialization is not always appropriate.",
);
add(
  "Adapter",
  "An adapter translates an existing interface into the interface your application expects.",
  "বিদেশি প্লাগের জন্য অ্যাডাপ্টারের মতো দুই চুক্তির মধ্যে অনুবাদ করুন।",
  `class LegacyPrinter { public void PrintText(string text) => Console.WriteLine(text); } ~~ Existing incompatible API. / পুরোনো API।
interface IPrinter { void Print(string text); } ~~ Contract expected by the application. / অ্যাপের চুক্তি।
class PrinterAdapter(LegacyPrinter old) : IPrinter { public void Print(string text) => old.PrintText(text); } ~~ Translate one call into another. / এক কল অন্য কলে রূপান্তর।`,
  "Client contract > Adapter > Legacy API > Result",
  "Translate semantics, errors, units, and lifetimes, not just method names.",
  "Adapters are useful at external boundaries. Keep provider-specific types from leaking back into the domain contract.",
);
add(
  "Decorator",
  "Wrap an object implementing a contract with another object using the same contract to add behavior around calls.",
  "চায়ের সাথে আদা যোগ করার মতো মূল কাজ রেখেই বাড়তি আচরণ দিন।",
  `interface IMessage { string Read(); } ~~ Stable contract for wrappers and base. / একই চুক্তি।
class Greeting : IMessage { public string Read() => "Hello"; } ~~ The base behavior. / মূল আচরণ।
class Excited(IMessage inner) : IMessage { public string Read() => inner.Read() + "!"; } ~~ Add behavior while delegating. / মূল কাজের পরে বাড়তি আচরণ।
Console.WriteLine(new Excited(new Greeting()).Read()); ~~ Compose wrappers explicitly. / wrapper জুড়ে ব্যবহার।`,
  "Caller > Decorator before > Wrapped object > Decorator after",
  "Decorator ordering changes behavior: logging outside retries observes different events from logging inside retries.",
  "ASP.NET Core middleware forms a related wrapping pipeline. Avoid duplicate side effects when combining retries and decorators.",
);
add(
  "Facade",
  "A facade provides a simple entry point over a subsystem with several collaborating operations.",
  "হাসপাতালের এক ডেস্কে গিয়ে ভেতরের কয়েকটি বিভাগের কাজ করানোর মতো।",
  `class CheckoutFacade { ~~ Offer a use-case-oriented entry point. / একটি কাজের সহজ প্রবেশপথ।
  public string PlaceOrder() { Validate(); return "Order accepted"; } ~~ Coordinate the subsystem. / ভেতরের ধাপ সমন্বয়।
  private void Validate() { } ~~ Keep subsystem detail internal. / বিস্তারিত ভেতরে রাখুন।
} ~~ The validation body is an integration seam in this illustration. / আসল validation এখানে যুক্ত হবে।`,
  "Client > Facade > Subsystem operations > Simple response",
  "A facade should simplify access, not become a giant class containing every business rule.",
  "Keep transaction boundaries and failure semantics visible enough that a simple API does not promise impossible atomicity.",
);
add(
  "Proxy",
  "A proxy stands in front of another object to control when or whether access reaches it, for example authorization or lazy loading.",
  "দারোয়ান আগে অনুমতি দেখে, তারপর ভেতরের সেবায় যেতে দেন।",
  `interface IReport { string Read(); } ~~ Contract shared by proxy and target. / একই চুক্তি।
class Report : IReport { public string Read() => "Confidential"; } ~~ Actual target. / আসল সেবা।
class ReportProxy(IReport target, bool allowed) : IReport { public string Read() => allowed ? target.Read() : throw new UnauthorizedAccessException(); } ~~ Gate access. / অনুমতি থাকলে কাজ দিন।`,
  "Caller > Access check > Target object > Response",
  "Client-side proxies are not a security boundary. Enforce authorization at the actual protected service.",
  "Remote proxies add network failures and latency to ordinary-looking calls; make cancellation, timeouts, and retry semantics explicit.",
);
add(
  "Observer",
  "Publish a notification to subscribed listeners without the publisher naming each concrete receiver.",
  "পত্রিকার গ্রাহক হলে নতুন সংখ্যা এলে সবাই খবর পায়।",
  `var store = new Store(); ~~ Create the publisher. / প্রকাশক তৈরি।
store.Changed += () => Console.WriteLine("Updated"); ~~ Subscribe a listener. / শ্রোতা যোগ।
store.Update(); ~~ Trigger a notification. / খবর পাঠান।
class Store { public event Action? Changed; public void Update() => Changed?.Invoke(); } ~~ Notify current subscribers. / বর্তমান শ্রোতাদের ডাকুন।`,
  "Publisher change > Event > Subscribers > Reactions",
  "Unsubscribe long-lived event handlers when receivers are disposed to avoid retained objects.",
  "In-process events are synchronous here. Durable cross-process pub/sub requires delivery, ordering, and duplicate-handling policies.",
);
add(
  "Strategy",
  "Represent interchangeable algorithms with a common contract and choose one based on the current context.",
  "ঢাকা থেকে যাওয়ার জন্য বাস, ট্রেন বা বিমান—গন্তব্য একই, কৌশল আলাদা।",
  `interface IShipping { decimal Cost(decimal weight); } ~~ Define the algorithm contract. / কৌশলের চুক্তি।
class StandardShipping : IShipping { public decimal Cost(decimal weight) => weight * 20m; } ~~ One algorithm. / একটি নিয়ম।
IShipping selected = new StandardShipping(); ~~ Select a strategy at the boundary. / বাইরে কৌশল বাছুন।
Console.WriteLine(selected.Cost(2)); ~~ Run it without a type-specific branch. / ধরন না জেনেও চালান।`,
  "Choose policy > Strategy contract > Algorithm > Calculated result",
  "Too many one-line strategies can add needless navigation. Use them when policy varies meaningfully.",
  "Selection may use keyed DI, configuration, or domain rules. Keep algorithm state and concurrency requirements explicit.",
);
add(
  "Command",
  "Represent a requested action as data or an object so it can be validated, queued, logged, or handled independently.",
  "খাবারের অর্ডার স্লিপের মতো কাজের অনুরোধ আলাদা করে রাখুন।",
  `var command = new CreateOrder("Tea", 2); ~~ Capture action data. / কাজের তথ্য রাখুন।
string Handle(CreateOrder c) => c.Quantity > 0 ? $"Ordered {c.Quantity} {c.Product}" : throw new ArgumentException("Quantity"); ~~ Validate and handle. / যাচাই করে কাজ করুন।
Console.WriteLine(Handle(command)); ~~ Dispatch the request to its handler. / handler-এ অনুরোধ দিন।
record CreateOrder(string Product, int Quantity); ~~ Immutable command data. / অপরিবর্তনীয় অনুরোধ।`,
  "Command data > Validation > Handler > State change",
  "A command expresses intent; an event describes something that already happened. They are not interchangeable.",
  "Queued commands need idempotency and authorization at handling time. CQRS does not automatically imply separate databases.",
);
add(
  "State",
  "Model legal transitions between explicit states so an object behaves differently as its lifecycle changes.",
  "অর্ডার নতুন, পরিশোধিত, পাঠানো—প্রতিটি অবস্থায় আলাদা কাজের অনুমতি।",
  `enum OrderState { New, Paid, Shipped } ~~ Name lifecycle states. / অবস্থার নাম।
static class Orders { ~~ Group transition logic. / পরিবর্তনের নিয়ম।
  public static OrderState Pay(OrderState state) => state == OrderState.New ? OrderState.Paid : throw new InvalidOperationException("Cannot pay"); ~~ Enforce a legal transition. / বৈধ অবস্থায়ই টাকা দিন।
} ~~ Duplicate payment attempts are rejected by this local model. / একই পরিবর্তন আবার নিষিদ্ধ।`,
  "Current state > Trigger > Transition guard > Next state",
  "Persisted state can change concurrently. Validate transitions in the same atomic write as the state update.",
  "Use optimistic concurrency or compare-and-swap; distributed state machines also need idempotent events and recovery policies.",
);
add(
  "Thread Safety",
  "Shared mutable state requires coordination so concurrent operations preserve invariants rather than overwrite one another.",
  "দুই ক্যাশিয়ার একই টাকার বাক্স ব্যবহার করলে হিসাব বদলানো নিয়ন্ত্রিত হতে হবে।",
  `int count = 0; ~~ Shared variable captured by worker actions. / সবার ব্যবহৃত সংখ্যা।
Parallel.For(0, 1000, _ => Interlocked.Increment(ref count)); ~~ Atomically increment one integer. / একক atomic ধাপে বাড়ান।
Console.WriteLine(count); ~~ Print exactly 1000 after workers complete. / সব শেষে ১০০০।`,
  "Shared state > Concurrent requests > Atomic update > Preserved invariant",
  "count++ is a read-modify-write sequence and is not atomic. A thread-safe collection does not make a multi-step workflow atomic.",
  "Use a lock for multi-field invariants, SemaphoreSlim for asynchronous gates, and minimize shared mutable state. Avoid holding locks across I/O.",
);
add(
  "Machine Coding",
  "Turn a small problem statement into working code with explicit rules, testable boundaries, and edge-case handling before adding abstractions.",
  "পার্কিং লটের মতো ছোট বাস্তব সমস্যা নিয়ম লিখে ধাপে ধাপে কোডে বানান।",
  `class ParkingLot(int capacity) { ~~ Model a bounded resource. / সীমিত জায়গার মডেল।
  private int used; ~~ Keep occupancy private. / ব্যবহার ভেতরে রাখুন।
  public bool TryPark() { if (used >= capacity) return false; used++; return true; } ~~ Refuse admission when full. / পূর্ণ হলে ফিরিয়ে দিন।
  public bool Leave() { if (used == 0) return false; used--; return true; } ~~ Do not underflow occupancy. / শূন্যের নিচে নয়।
} ~~ Single-threaded teaching model; validate capacity at construction in a full implementation. / এক thread-এর উদাহরণ।`,
  "Requirements > Invariants > Small implementation > Edge tests",
  "Clarify negative capacity, duplicate tickets, concurrent entry, pricing, and persistence before calling this a production parking system.",
  "Start with acceptance tests, then isolate clock, storage, and payment boundaries. Design for actual requirements rather than every possible pattern.",
);
add(
  "REST APIs",
  "An HTTP API exposes resources through URLs and uses methods to express operations. GET reads, POST commonly creates, and PUT replaces a resource representation.",
  "ওয়েটারকে অর্ডার দেওয়ার মতো URL ঠিকানা আর HTTP method দিয়ে সার্ভারকে কাজ বলুন।",
  `var builder = WebApplication.CreateBuilder(args); ~~ Prepare an ASP.NET Core application. / অ্যাপের প্রস্তুতি।
var app = builder.Build(); ~~ Build the request pipeline. / request-এর পথ তৈরি।
app.MapGet("/products/{id:int}", (int id) => Results.Ok(new { Id = id, Name = "Tea" })); ~~ Bind a route value and return JSON with 200. / route থেকে id নিয়ে JSON দিন।
app.Run(); ~~ Listen for HTTP requests. / HTTP অনুরোধ শুনুন।`,
  "Client GET > Route matching > Endpoint handler > JSON 200",
  "This example returns a fixed demo product. A real lookup should return 404 when the resource does not exist.",
  "Use consistent resource naming, idempotent method semantics, cache headers, cancellation, and versioned contracts. REST is more than JSON over HTTP.",
);
add(
  "HTTP and Status Codes",
  "HTTP responses pair a numeric status with headers and an optional body. 2xx indicates success, 4xx a request-side problem, and 5xx a server-side failure.",
  "দোকানের উত্তরের মতো: পাওয়া গেছে ২০০, নেই ৪০৪, অনুমতি নেই ৪০৩।",
  `var app = WebApplication.CreateBuilder(args).Build(); ~~ Build a minimal server. / ছোট সার্ভার।
app.MapGet("/orders/{id:int}", (int id) => id == 1 ? Results.Ok(new { Id = 1 }) : Results.NotFound()); ~~ Distinguish found and missing resources. / আছে ও নেই আলাদা করুন।
app.Run(); ~~ Start serving requests. / অনুরোধ নিন।`,
  "Request > Server decision > Status and headers > Client handling",
  "401 means authentication is needed/invalid; 403 means authenticated access is forbidden. Do not return 200 for every failure.",
  "Retry only suitable failures and idempotent operations. 429 can include Retry-After; 503 can describe temporary unavailability.",
);
add(
  "Input Validation",
  "Validate input shape, bounds, and business constraints before treating it as trusted domain data. Parsing a number does not prove the number is acceptable.",
  "দোকানের অর্ডার নেওয়ার আগে পরিমাণ ঠিক আছে কি না যাচাই করুন।",
  `var app = WebApplication.CreateBuilder(args).Build(); ~~ Build the host. / host তৈরি।
app.MapPost("/orders", (OrderInput input) => input.Quantity is > 0 and <= 100 ? Results.Ok(input) : Results.BadRequest("Quantity must be 1–100")); ~~ Enforce a bounded quantity. / পরিমাণ ১–১০০ হতে হবে।
app.Run(); ~~ Serve requests. / সার্ভার চালু।
record OrderInput(int Quantity); ~~ Define the expected input shape. / input-এর গঠন।`,
  "Untrusted input > Parse > Validate rules > Domain operation",
  "Frontend checks improve usability but do not replace server-side validation. Validation and authorization are different.",
  "Reject oversized payloads early, standardize validation errors, and enforce database constraints to handle races after application validation.",
);
add(
  "Pagination",
  "Return a bounded portion of a result set. Offset pagination skips rows; cursor/keyset pagination continues after a stable ordering key.",
  "পুরো বই একবারে না দিয়ে এক পাতা করে দিন।",
  `int afterId = 10, pageSize = 20; ~~ Choose a cursor and bounded page size. / শেষ id ও পাতার সীমা।
var page = await db.Products.AsNoTracking() ~~ Query without tracking read-only entities. / read-only query।
  .Where(p => p.Id > afterId).OrderBy(p => p.Id) ~~ Seek after the stable unique key. / স্থায়ী key-এর পর থেকে।
  .Take(pageSize).ToListAsync(); ~~ Fetch at most twenty rows. / সর্বোচ্চ ২০ সারি।`,
  "Cursor > Ordered query > Bounded page > Next cursor",
  "EF Core fragment: requires a configured DbContext, Product entity, and Microsoft.EntityFrameworkCore. Validate page size.",
  "Keyset pagination handles deep pages efficiently but does not jump naturally to arbitrary page numbers. Use compound cursors for nonunique sort keys.",
);
add(
  "API Versioning",
  "Versioning lets clients continue using an old contract while a new incompatible contract is introduced deliberately.",
  "দোকানের পুরোনো মেনু রাখা অবস্থায় নতুন মেনু চালু করার মতো।",
  `var app = WebApplication.CreateBuilder(args).Build(); ~~ Build the host. / host তৈরি।
app.MapGet("/api/v1/greeting", () => new { Text = "Hello" }); ~~ Preserve the first response shape. / প্রথম গঠন রাখুন।
app.MapGet("/api/v2/greeting", () => new { Message = "Hello", Language = "en" }); ~~ Expose a changed contract separately. / নতুন চুক্তি আলাদা।
app.Run(); ~~ Serve both versions. / দুই সংস্করণ চালু।`,
  "Client version > Contract selection > Compatible handler > Response",
  "This uses explicit URL routes, not the Asp.Versioning package. Adding versions without a retirement policy creates permanent maintenance work.",
  "Prefer backward-compatible additive changes where possible. Track usage, publish deprecation dates, and test consumers before removal.",
);
add(
  "Sessions and Cookies",
  "A cookie is browser-held data sent with matching HTTP requests. A server session uses an identifier to find server-held state across otherwise independent requests.",
  "হোটেলের রুমের চাবি cookie; ভেতরের তথ্য সার্ভারের session।",
  `builder.Services.AddDistributedMemoryCache(); ~~ Provide an in-process session backing store for a demo. / demo-র session store।
builder.Services.AddSession(o => { o.Cookie.HttpOnly = true; o.Cookie.SecurePolicy = CookieSecurePolicy.Always; }); ~~ Configure protected cookie transport. / cookie-এর নিরাপদ সেটিং।
app.UseSession(); ~~ Load session state in the pipeline. / session middleware যুক্ত।
app.MapGet("/visit", (HttpContext ctx) => { ctx.Session.SetString("name", "Ayesha"); return "Saved"; }); ~~ Store server-side session data. / সার্ভারে তথ্য রাখুন।`,
  "Browser cookie > Session ID > Server-side state > Request context",
  "Configuration fragment: register before builder.Build and middleware afterward. Multi-instance production needs a shared session store.",
  "Cookies need domain/path/SameSite policies. Session state is not inherently an authorization mechanism and can create affinity or consistency issues.",
);
add(
  "Authentication with JWT",
  "A JWT carries signed claims. The API validates the signature, issuer, audience, and expiry before trusting those claims. Signing does not encrypt the payload.",
  "সিল দেওয়া পরিচয়পত্রের মতো token; সিল ঠিক আছে কি না সার্ভার যাচাই করে।",
  `builder.Services.AddAuthentication("Bearer").AddJwtBearer(o => { o.Authority = "https://identity.example.com"; o.Audience = "orders-api"; }); ~~ Validate tokens using a trusted issuer. / বিশ্বস্ত issuer দিয়ে যাচাই।
builder.Services.AddAuthorization(); ~~ Register authorization policies. / অনুমতির policy।
app.UseAuthentication(); app.UseAuthorization(); ~~ Establish identity before checking access. / আগে পরিচয়, পরে অনুমতি।
app.MapGet("/me", (HttpContext c) => c.User.Identity!.Name).RequireAuthorization(); ~~ Protect an endpoint. / endpoint সুরক্ষিত।`,
  "Bearer token > Validate signature > Validate claims > Authorized endpoint",
  "Requires Microsoft.AspNetCore.Authentication.JwtBearer and a real identity provider. The authority URL is illustrative.",
  "Use short-lived access tokens, secure refresh rotation, key rollover, and correct clock skew. A valid token still needs resource-level authorization.",
);
add(
  "OAuth 2.0",
  "OAuth delegates access to a resource without sharing the user password with a client application. Authorization Code + PKCE binds a code exchange to the initiating client.",
  "চাবি না দিয়ে নির্দিষ্ট কাজের অনুমতিপত্র অন্য অ্যাপকে দিন।",
  `using System.Security.Cryptography; ~~ Use cryptographic randomness and hashing. / নিরাপদ random ও hash।
byte[] bytes = RandomNumberGenerator.GetBytes(32); ~~ Generate a PKCE verifier seed. / গোপন verifier-এর বীজ।
string verifier = Convert.ToBase64String(bytes).TrimEnd('=').Replace('+','-').Replace('/','_'); ~~ Encode it as base64url. / base64url-এ লিখুন।
byte[] digest = SHA256.HashData(System.Text.Encoding.ASCII.GetBytes(verifier)); ~~ Derive the S256 challenge bytes. / challenge-এর hash।`,
  "Authorize request > User consent > Code callback > PKCE token exchange",
  "This demonstrates PKCE generation only. A full flow also needs state, exact redirect validation, challenge encoding, and secure callback handling.",
  "OAuth is authorization; OpenID Connect adds identity. Use a maintained client library rather than implementing protocol edge cases yourself.",
);
add(
  "SQL vs NoSQL",
  "Choose storage based on data relationships, query patterns, consistency, and operational needs. NoSQL is a family of models, not a promise that schemas disappear.",
  "ডেটা সাজানো টেবিল নাকি ডকুমেন্টে রাখা ভালো, তা প্রশ্ন ও সম্পর্ক দেখে ঠিক করুন।",
  `record Order(int Id, string Customer, decimal Total); ~~ A domain shape independent of storage. / storage থেকে আলাদা model।
var order = new Order(1, "Ayesha", 500m); ~~ Construct a value to persist. / রাখার মতো তথ্য।
string document = System.Text.Json.JsonSerializer.Serialize(order); ~~ Illustrate a document representation. / document আকার দেখুন।
Console.WriteLine(document); ~~ Observe fields that still form a schema. / গঠন তবুও আছে।`,
  "Access pattern > Data model > Consistency needs > Storage choice",
  "Serializing JSON is not a database implementation. Both relational and document databases can offer transactions with different constraints.",
  "Start from required queries and invariants. Denormalization trades read simplicity for write fanout, duplicate data, and consistency work.",
);
add(
  "ORM and Migrations",
  "An ORM maps application types and queries to database operations. Migrations version schema changes so environments can evolve consistently.",
  "C# object আর ডেটাবেজের টেবিলের মধ্যে অনুবাদক হলো ORM; schema বদলের ইতিহাস migration।",
  `var product = new Product { Name = "Tea" }; ~~ Create a tracked entity. / entity তৈরি।
db.Products.Add(product); ~~ Mark it as Added in the DbContext. / নতুন হিসেবে track।
await db.SaveChangesAsync(); ~~ Persist the insert in a database transaction. / ডেটাবেজে লিখুন।
var saved = await db.Products.AsNoTracking().ToListAsync(); ~~ Read without retaining change-tracking state. / tracking ছাড়া পড়ুন।`,
  "Entity > Change tracker > SQL command > Persisted row",
  "EF Core fragment: requires Product and a configured DbContext. Add does not send the insert until SaveChanges.",
  "Review generated migrations, especially destructive changes. Avoid running competing schema migrations from every application replica at startup.",
);
add(
  "Database Indexing",
  "Index selected columns to support frequent selective filters, joins, and ordering without scanning every row.",
  "বইয়ের সূচির মতো সঠিক কলামে index দিলে খোঁজা দ্রুত হয়।",
  `modelBuilder.Entity<Product>() ~~ Select the entity model. / entity বাছুন।
  .HasIndex(p => new { p.CategoryId, p.Id }); ~~ Define an ordered composite index. / দুই কলামের index।
var page = await db.Products.Where(p => p.CategoryId == 1).OrderBy(p => p.Id).Take(20).ToListAsync(); ~~ Query along the index prefix. / index-এর ক্রমে query।`,
  "Query predicate > Index seek > Matching keys > Row fetch",
  "EF Core model/query fragments require the surrounding model and context. An index is not guaranteed to be selected by the optimizer.",
  "The leading columns of a composite index matter. Balance coverage and selectivity against write amplification, storage, and maintenance.",
);
add(
  "Transactions and ACID",
  "A transaction groups operations into a unit with atomicity, consistency rules, isolation, and durability. Isolation level controls which concurrent effects can be observed.",
  "দুই হিসাবে টাকা স্থানান্তরে একটি কাটা হলে অন্যটিতে জমাও হতে হবে, নইলে দুটোই বাতিল।",
  `await using var tx = await db.Database.BeginTransactionAsync(); ~~ Start an explicit transaction. / লেনদেন শুরু।
account.Balance -= 100m; recipient.Balance += 100m; ~~ Apply both domain changes. / দুই হিসাব বদলান।
await db.SaveChangesAsync(); ~~ Persist both changes within the transaction. / একই লেনদেনে লিখুন।
await tx.CommitAsync(); ~~ Make the transaction durable. / চূড়ান্ত করুন।`,
  "Begin > Debit and credit > Save > Commit or rollback",
  "This EF Core fragment omits account lookup, insufficient-funds checks, and concurrency control. A transaction alone does not prevent every lost update.",
  "Use appropriate isolation or optimistic concurrency tokens. Distributed side effects such as sending email do not roll back with the database; use an outbox.",
);
add(
  "File Uploads to S3",
  "Object storage holds byte objects by bucket and key. Streaming an upload avoids holding the entire file in application memory.",
  "বড় ভিডিও অ্যাপের স্মৃতিতে না রেখে আলাদা গুদামে stream করে পাঠান।",
  `using var s3 = new Amazon.S3.AmazonS3Client(); ~~ Resolve AWS credentials from the supported provider chain. / provider chain থেকে পরিচয়।
await using var stream = File.OpenRead("photo.jpg"); ~~ Open a bounded-lifetime file stream. / stream খুলুন।
await s3.PutObjectAsync(new Amazon.S3.Model.PutObjectRequest { BucketName = "your-bucket", Key = "photos/photo.jpg", InputStream = stream }); ~~ Upload bytes under an object key. / নির্দিষ্ট key-তে পাঠান।`,
  "Validated upload > Stream > S3 bucket and key > Object metadata",
  "Requires AWSSDK.S3, real bucket permissions, and a local file. Validate file size/type; do not trust the original filename as an object key.",
  "Presigned URLs can move uploads off the API server. Use short expiration, least privilege, content restrictions, and post-upload verification.",
);
add(
  "Unit and Integration Tests",
  "Unit tests isolate a rule; integration tests verify interactions across real boundaries such as HTTP routing, serialization, and a database.",
  "একটি সুইচ আলাদা পরীক্ষা unit test; পুরো ঘরের সার্কিট পরীক্ষা integration test।",
  `using Xunit; ~~ Import xUnit test attributes and assertions. / xUnit ব্যবহার।
public class PriceTests { ~~ Group related tests. / পরীক্ষার দল।
  [Fact] public void Total_IncludesQuantity() { ~~ Describe one invariant. / একটি নিয়ম পরীক্ষা।
    decimal total = 20m * 3; ~~ Arrange and execute a tiny pricing rule. / উদাহরণের হিসাব।
    Assert.Equal(60m, total); ~~ Fail if the actual result differs. / ফল না মিললে ব্যর্থ।
  } ~~ In a real test, call the application pricing function here. / বাস্তবে অ্যাপের function ডাকুন।
} ~~ Test project requires the xUnit packages and test SDK. / test project-এর package দরকার।`,
  "Arrange > Act > Assert > Repeat safely",
  "Tests that duplicate an expression without calling production code cannot catch a broken production implementation. This snippet teaches assertion structure only.",
  "Use WebApplicationFactory for HTTP boundaries and disposable real database instances for provider semantics. Keep tests deterministic and independent.",
);
add(
  "Caching with Redis",
  "Keep frequently reused data in a faster shared store. Cache-aside checks the cache first, loads missing data from the source, then stores it with an expiry.",
  "প্রতিবার বাজার না গিয়ে দরকারি জিনিস হাতের কাছে রাখুন, কিন্তু মেয়াদ দেখুন।",
  `string key = "product:1"; ~~ Use a namespaced cache key. / আলাদা key।
string? value = await cache.GetStringAsync(key); ~~ Try the distributed cache first. / আগে cache দেখুন।
if (value is null) { ~~ A miss requires a source lookup. / না পেলে উৎসে যান।
  value = "Tea"; ~~ Stand-in for a database read. / উদাহরণের database ফল।
  await cache.SetStringAsync(key, value, new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5) }); ~~ Bound staleness with TTL. / মেয়াদ দিন।
} ~~ cache is an injected IDistributedCache configured for Redis. / Redis cache নির্ভরতা দরকার।`,
  "Cache lookup > Hit or miss > Source read > Store with TTL",
  "Requires Microsoft.Extensions.Caching abstractions plus a configured Redis provider. TTL alone does not prevent a cache stampede.",
  "Plan invalidation, hot keys, negative caching, jitter, and single-flight loading. A cache outage must not overload the origin.",
);
add(
  "Rate Limiting",
  "Bound accepted request volume per identity and time window to protect capacity and fair access.",
  "একজন মানুষ যেন সব টিকিট একা না নিয়ে যায়, তার সীমা দিন।",
  `builder.Services.AddRateLimiter(o => { ~~ Register limiter policies. / সীমার policy।
  o.RejectionStatusCode = 429; ~~ Signal too many requests. / ৪২৯ ফেরত।
  o.AddFixedWindowLimiter("demo", x => { x.PermitLimit = 10; x.Window = TimeSpan.FromMinutes(1); }); ~~ Allow ten permits per minute. / মিনিটে ১০ অনুমতি।
}); ~~ Complete registration before Build. / Build-এর আগে।
app.UseRateLimiter(); ~~ Apply the limiter middleware. / middleware যুক্ত।
app.MapGet("/limited", () => "OK").RequireRateLimiting("demo"); ~~ Protect a route with the policy. / route-এ policy দিন।`,
  "Identity key > Permit counter > Allow or reject > Window reset",
  "Requires System.Threading.RateLimiting/Microsoft.AspNetCore.RateLimiting imports. This demo policy is a shared bucket, not a per-user partition.",
  "In-memory limits are per instance. Distributed quotas need an atomic shared store or a gateway; choose fail-open or fail-closed behavior explicitly.",
);
add(
  "WebSockets",
  "A WebSocket upgrades one HTTP connection into a persistent bidirectional message channel. SignalR adds higher-level hubs, groups, and transport handling.",
  "ফোন লাইনের মতো একবার সংযোগ করে দুই দিক থেকেই খবর পাঠান।",
  `builder.Services.AddSignalR(); ~~ Register real-time hub services. / SignalR service।
app.MapHub<ChatHub>("/chat"); ~~ Expose a hub endpoint. / hub-এর ঠিকানা।
public class ChatHub : Microsoft.AspNetCore.SignalR.Hub { ~~ Define the hub contract. / hub-এর গঠন।
  public Task Send(string text) => Clients.All.SendAsync("message", text); ~~ Broadcast a message to connected clients. / সংযুক্ত সবাইকে খবর দিন।
} ~~ Add the SignalR namespace for SendAsync extension methods. / namespace দরকার।`,
  "Connect > Authenticate > Exchange messages > Disconnect",
  "Treat incoming hub messages as untrusted input. Authentication, group membership, and message sizes need explicit rules.",
  "Multiple app replicas need a backplane or managed SignalR service. Plan reconnect behavior, ordering, backpressure, and connection resource limits.",
);
add(
  "Background Jobs",
  "Move work outside the request-response lifetime. An in-process hosted worker handles tasks while the application runs, but does not make them durable.",
  "অর্ডার নিয়ে টোকেন দিন, পেছনে রান্না চলুক; তবে কাজ হারানো যাবে কি না ভাবুন।",
  `public class Worker(ILogger<Worker> log) : BackgroundService { ~~ Define a hosted worker. / background worker।
  protected override async Task ExecuteAsync(CancellationToken stop) { ~~ Respect host shutdown. / বন্ধের সংকেত নিন।
    using var timer = new PeriodicTimer(TimeSpan.FromSeconds(5)); ~~ Schedule periodic work without busy looping. / বিরতি দিয়ে কাজ।
    while (await timer.WaitForNextTickAsync(stop)) log.LogInformation("Tick"); ~~ Do cancellable periodic work. / বাতিলযোগ্য কাজ করুন।
  } ~~ Register with builder.Services.AddHostedService<Worker>(). / host-এ নিবন্ধন করুন।
} ~~ The body illustrates scheduling, not durable job storage. / স্থায়ী job store নয়।`,
  "Enqueue or schedule > Worker > Execute > Record completion",
  "Do not start fire-and-forget tasks using request-scoped services after a request ends.",
  "Use a durable queue and idempotent workers for work that must survive restarts. Bound concurrency, retries, and poison-message handling.",
);
add(
  "Message Queues",
  "A queue decouples producers from workers and buffers work when arrival rate temporarily exceeds processing rate. Acknowledgment controls redelivery.",
  "কাউন্টারে অর্ডারের স্লিপ জমে; রান্নাঘর নিজের গতিতে কাজ নেয়।",
  `var channel = System.Threading.Channels.Channel.CreateBounded<string>(10); ~~ Bound in-process buffering. / buffer-এর সীমা।
await channel.Writer.WriteAsync("order:1"); ~~ Wait for capacity when necessary. / জায়গা না থাকলে অপেক্ষা।
string work = await channel.Reader.ReadAsync(); ~~ Consume the next available item. / পরের কাজ নিন।
Console.WriteLine(work); ~~ Process the demonstration item. / কাজের তথ্য দেখুন।`,
  "Producer > Buffer > Consumer > Acknowledge",
  "Channel<T> is in-process and non-durable. It is not a replacement for RabbitMQ, SQS, or Azure Service Bus when restart survival matters.",
  "Assume at-least-once delivery for many brokers. Make handlers idempotent, use dead-letter queues, and distinguish ordering within a partition from global ordering.",
);
add(
  "Logging and Monitoring",
  "Logs describe events, metrics summarize measurements, and traces connect operations across a request. Together they explain symptoms and causes.",
  "লগ হলো ঘটনার খাতা, metric হলো মিটার, trace হলো এক অনুরোধের পুরো পথ।",
  `using var activity = new System.Diagnostics.Activity("LoadProduct").Start(); ~~ Start a trace span for the operation. / কাজের trace।
logger.LogInformation("Loading product {ProductId}", 42); ~~ Preserve structured fields instead of concatenating strings. / তথ্য আলাদা field-এ রাখুন।
activity?.SetTag("product.id", 42); ~~ Attach safe diagnostic context. / নিরাপদ context দিন।`,
  "Incoming request > Trace span > Structured log > Metric and alert",
  "logger is an injected ILogger. Exporting traces requires OpenTelemetry/another listener; starting an Activity alone does not configure an exporter.",
  "Avoid PII and high-cardinality metric labels. Alert on user-facing symptoms and define sampling, retention, and correlation policies.",
);
add(
  "OWASP Top 10",
  "The OWASP Top 10 is a periodically updated awareness list of major web application security risks, not a complete security test plan.",
  "ওয়েব অ্যাপের বড় ঝুঁকির মানচিত্র; তালিকা মুখস্থ করলেই অ্যাপ নিরাপদ হয় না।",
  `app.MapGet("/private", () => "Protected").RequireAuthorization(); ~~ Require an authorization check at a server boundary. / সার্ভারে অনুমতি যাচাই।
app.UseHsts(); ~~ Instruct browsers to prefer HTTPS after a valid HTTPS response. / HTTPS-এর নির্দেশনা।`,
  "Asset > Threat > Control > Verification",
  "These are illustrative controls, not an OWASP compliance implementation. Middleware ordering and hosting configuration still matter.",
  "Build a threat model, patch dependencies, verify authorization on objects, and use ASVS-style detailed requirements alongside risk awareness.",
);
add(
  "SQL Injection",
  "Injection occurs when untrusted data is interpreted as SQL syntax. Parameterized commands separate the query structure from supplied values.",
  "ইউজারের লেখা যেন SQL কমান্ড না হয়ে শুধু ডেটা থাকে।",
  `await using var cmd = connection.CreateCommand(); ~~ Create a provider command. / database command।
cmd.CommandText = "SELECT Name FROM Users WHERE Id = @id"; ~~ Keep SQL structure fixed. / SQL-এর গঠন স্থির।
var p = cmd.CreateParameter(); p.ParameterName = "@id"; p.Value = userId; ~~ Bind input as a typed value. / input-কে মান হিসেবে দিন।
cmd.Parameters.Add(p); ~~ Add the parameter to the command. / parameter যুক্ত।
var name = await cmd.ExecuteScalarAsync(); ~~ Execute without string concatenation. / text জোড়া না দিয়ে চালান।`,
  "Untrusted input > Parameter binding > Fixed SQL plan > Result",
  "connection and userId must be supplied by the application. Parameters cannot replace table/column names; allowlist dynamic identifiers.",
  "ORMs protect ordinary parameterized queries, but raw concatenated SQL can reintroduce injection. Use least-privilege database credentials too.",
);
add(
  "XSS",
  "Cross-site scripting happens when attacker-controlled content executes as script in another user’s browser. Encode data for its output context.",
  "অন্যের লেখা দেখাতে গিয়ে ব্রাউজার যেন সেটিকে script হিসেবে না চালায়।",
  `string input = "<script>alert(1)</script>"; ~~ Treat submitted text as untrusted. / লেখা অবিশ্বস্ত।
string encoded = System.Net.WebUtility.HtmlEncode(input); ~~ Encode HTML metacharacters for an HTML text context. / HTML text-এর encoding।
Console.WriteLine(encoded); ~~ Print harmless entity text. / ক্ষতিহীন লেখা।`,
  "User text > Context-aware encoding > HTML text > Safe rendering",
  "HTML encoding is not sufficient for JavaScript, CSS, or URL contexts. React escapes normal text, but dangerouslySetInnerHTML bypasses that protection.",
  "Use a vetted sanitizer when rich HTML is required, restrictive CSP, safe DOM APIs, and avoid interpolating data into executable contexts.",
);
add(
  "CSRF",
  "A browser may attach authentication cookies to a cross-site request automatically. CSRF defenses bind state-changing requests to the intended user interaction.",
  "ব্রাউজার পরিচয়ের cookie নিজে পাঠাতে পারে; তাই অন্য সাইটের লুকানো অনুরোধ ঠেকান।",
  `builder.Services.AddAntiforgery(); ~~ Register token generation and validation. / anti-forgery service।
app.UseAntiforgery(); ~~ Enable antiforgery checks for endpoints that require them. / token যাচাই middleware।`,
  "Authenticated browser > Cross-site request > Token validation > Accept or reject",
  "Configuration fragment for ASP.NET Core: middleware alone does not add token checks to arbitrary JSON endpoints. Mark/validate protected endpoints and issue tokens correctly.",
  "Combine antiforgery validation with suitable SameSite cookies, Origin checks where appropriate, and no state changes on GET. XSS can defeat many CSRF controls.",
);
add(
  "CORS",
  "CORS tells browsers which origins may read responses to cross-origin requests. It is a browser policy and does not authenticate callers.",
  "কোন ওয়েবসাইট ব্রাউজার দিয়ে উত্তর পড়তে পারবে, CORS তা বলে; পরিচয় যাচাই নয়।",
  `builder.Services.AddCors(o => o.AddPolicy("Frontend", p => p.WithOrigins("https://app.example.com").WithMethods("GET").WithHeaders("Content-Type"))); ~~ Allow a precise origin and operation. / নির্দিষ্ট origin অনুমতি।
app.UseCors("Frontend"); ~~ Apply the policy at the correct pipeline point. / policy প্রয়োগ।`,
  "Browser origin > Preflight policy > Allowed response headers > Browser access",
  "The domain is illustrative. Never combine arbitrary reflected origins with credential access. Non-browser clients ignore CORS.",
  "Restrict allowed methods/headers, understand preflight caching, and enforce authentication and authorization independently on the server.",
);
add(
  "HTTPS and TLS",
  "TLS authenticates a server and encrypts traffic between endpoints. HTTPS is HTTP carried over TLS; it does not validate the business meaning of a request.",
  "পথে কেউ চিঠি পড়তে না পারে, আর ঠিক সার্ভারেই গিয়েছে তা নিশ্চিত করার মতো।",
  `app.UseHsts(); ~~ Tell supporting browsers to retain HTTPS-only policy. / ব্রাউজারকে HTTPS policy দিন।
app.UseHttpsRedirection(); ~~ Redirect HTTP requests to HTTPS when host configuration supports it. / HTTP থেকে HTTPS-এ পাঠান।`,
  "Client hello > Certificate verification > Key agreement > Encrypted HTTP",
  "Behind a reverse proxy, configure forwarded headers from trusted proxies to avoid redirect loops or incorrect scheme detection.",
  "Protect private keys, automate certificate renewal, use modern TLS settings, and understand that encryption ends at each TLS termination point.",
);
add(
  "Hashing and Encryption",
  "A hash produces a fixed-size one-way digest. Encryption is reversible with a key. Authenticated encryption also detects tampering.",
  "Hash হলো একমুখী ছাপ; encryption হলো চাবি দিয়ে খোলা যায় এমন তালা।",
  `byte[] data = System.Text.Encoding.UTF8.GetBytes("hello"); ~~ Convert text into bytes. / লেখাকে byte-এ নিন।
byte[] digest = System.Security.Cryptography.SHA256.HashData(data); ~~ Compute a SHA-256 digest. / hash তৈরি।
Console.WriteLine(Convert.ToHexString(digest)); ~~ Display the digest as hexadecimal. / hex আকারে দেখুন।`,
  "Plain bytes > Hash function > Fixed digest > Compare safely",
  "SHA-256 alone is unsuitable for password storage because it is intentionally fast. A hash is not encryption.",
  "Use authenticated modes such as AES-GCM with unique nonces and secure key management. Never invent your own cryptographic construction.",
);
add(
  "Password Hashing",
  "Password storage uses a deliberately expensive, salted password hashing scheme to slow offline guessing. Never store recoverable plaintext passwords.",
  "প্রতি password-এর আলাদা লবণ ও ধীর হিসাব দিয়ে ছাপ রাখুন, আসল password নয়।",
  `var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<object>(); ~~ Use a maintained versioned password hasher. / পরীক্ষিত hasher।
var user = new object(); ~~ Provide the user context required by the API. / user context।
string hash = hasher.HashPassword(user, "example-only"); ~~ Create a salted password hash. / salt-সহ hash।
var result = hasher.VerifyHashedPassword(user, hash, "example-only"); ~~ Verify using the stored format. / সংরক্ষিত hash দিয়ে যাচাই।`,
  "Password > Random salt and KDF > Stored hash > Verification",
  "Example password is for illustration only. Configure current work factors and avoid logging passwords or hashes.",
  "Use a maintained Identity stack, secure reset flows, rate limits, MFA, and rehash-on-login when the stored format needs an upgrade.",
);
add(
  "Secure Sessions",
  "Session security includes cookie flags, lifecycle expiry, rotation after authentication, and safe server-side storage.",
  "চাবি নিরাপদ রাখার পাশাপাশি মেয়াদ ও হারালে বাতিল করার ব্যবস্থাও দরকার।",
  `var options = new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Lax }; ~~ Restrict JavaScript access and transport. / cookie-এর নিরাপদ flag।
http.Response.Cookies.Append("demo", "opaque-id", options); ~~ Illustrate cookie transport; use framework auth cookies for real sessions. / উদাহরণের cookie।`,
  "Login > New session ID > Secure cookie > Expiry or revoke",
  "http is an HttpContext. This cookie is not a complete authentication/session implementation. HttpOnly does not stop a browser from sending the cookie during an XSS attack.",
  "Rotate session identifiers after privilege changes, expire old sessions, protect backing stores, and prevent fixation and replay with framework-supported mechanisms.",
);
add(
  "JWT Security",
  "JWT security depends on correct validation and token lifecycle management, not merely decoding a token payload.",
  "token-এর লেখা পড়া আর তার সই বিশ্বাসযোগ্য কি না যাচাই করা এক কথা নয়।",
  `var validation = new Microsoft.IdentityModel.Tokens.TokenValidationParameters { ~~ Define validation expectations. / যাচাইয়ের নিয়ম।
  ValidateIssuer = true, ValidateAudience = true, ValidateLifetime = true, ValidateIssuerSigningKey = true ~~ Enforce all core checks. / issuer, audience, মেয়াদ ও key যাচাই।
}; ~~ Also configure actual trusted issuer, audience, and signing keys. / আসল বিশ্বস্ত মানও দিতে হবে।`,
  "Receive token > Verify algorithm and key > Validate claims > Resource authorization",
  "This parameter object alone cannot validate anything. Supply trusted keys/metadata; do not accept an algorithm or key from untrusted token data without policy.",
  "Use short token lifetimes, key rotation, revocation strategy where necessary, and secure refresh token storage with reuse detection.",
);
add(
  "OAuth Security",
  "Protect the authorization flow with state correlation, PKCE, strict redirect matching, and server-side handling appropriate to the client type.",
  "অন্যের callback যেন আপনার login না হয়ে যায়, state ও PKCE দিয়ে অনুরোধ মিলিয়ে নিন।",
  `byte[] stateBytes = System.Security.Cryptography.RandomNumberGenerator.GetBytes(32); ~~ Generate an unpredictable correlation value. / অনুমান করা যায় না এমন state।
string state = Convert.ToHexString(stateBytes); ~~ Encode for transport. / পাঠানোর মতো লেখা।
Console.WriteLine(state.Length); ~~ Observe length without exposing state in logs. / গোপন মান না দেখিয়ে দৈর্ঘ্য।`,
  "Generate state > Authorize with PKCE > Validate callback > Exchange once",
  "Generating state is only one step. Store it securely, compare it with the callback, expire it, and consume it once.",
  "Use an established OIDC/OAuth client. Prevent open redirects, code reuse, token leakage in URLs, and confused-deputy behavior.",
);
add(
  "Secrets Management",
  "Keep credentials outside source control, restrict who can retrieve them, and rotate them independently of application releases.",
  "চাবি কোডের খাতায় নয়; অনুমতিসহ আলাদা নিরাপদ বাক্সে রাখুন।",
  `string? endpoint = configuration["Payments:Endpoint"]; ~~ Read non-secret configuration by key. / config key দিয়ে পড়ুন।
string apiKey = configuration["Payments:ApiKey"] ?? throw new InvalidOperationException("Missing API key"); ~~ Require an externally supplied secret without printing it. / গোপন মান না থাকলে থামুন।`,
  "Configuration provider > Scoped identity > Secret retrieval > Protected use",
  "configuration is an injected IConfiguration. Never embed real credentials in examples, browser bundles, logs, or committed .env files.",
  "Prefer workload identity and short-lived credentials where possible. Audit retrieval, restrict scopes, rotate keys, and separate development from production.",
);
add(
  "IAM and Least Privilege",
  "Give each identity only the actions and resources required for its job. Authorization must be checked for both operation and target resource.",
  "কাজের জন্য যতটুকু দরকার ততটুকু চাবি দিন, পুরো ভবনের চাবি নয়।",
  `builder.Services.AddAuthorization(o => o.AddPolicy("Reports", p => p.RequireClaim("permission", "reports.read"))); ~~ Express a focused permission. / নির্দিষ্ট অনুমতি।
app.MapGet("/reports", () => "Allowed").RequireAuthorization("Reports"); ~~ Enforce it at the endpoint. / endpoint-এ যাচাই।`,
  "Authenticated identity > Policy > Resource check > Allowed action",
  "A role/claim check alone may not verify ownership of a particular record. Add resource-level checks.",
  "Use deny-by-default policies, separate service identities, least-privilege cloud roles, and periodic access review.",
);
add(
  "Security Headers and CSP",
  "Security headers instruct browsers to restrict framing, content loading, referrers, and MIME interpretation. CSP limits allowed script sources and other resource types.",
  "ব্রাউজারকে আগে বলে দিন কোন উৎসের script চলতে পারবে।",
  `app.Use(async (ctx, next) => { ~~ Add a response policy middleware. / response policy।
  ctx.Response.Headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none'"; ~~ Restrict sources and framing for this illustrative site. / উৎস ও iframe সীমা।
  ctx.Response.Headers["X-Content-Type-Options"] = "nosniff"; ~~ Disable MIME type guessing. / MIME অনুমান বন্ধ।
  await next(); ~~ Continue the request pipeline. / পরের ধাপ।
}); ~~ Real sites must inventory their resource requirements first. / আসল site's resource যাচাই দরকার।`,
  "Response > Browser policy > Resource request > Allow or block",
  "A copied CSP can break fonts, scripts, and APIs. Start with a report-only rollout and remove unsafe patterns deliberately.",
  "Prefer nonce/hash-based scripts over unsafe-inline. CSP is defense in depth and does not replace escaping or sanitization.",
);
add(
  "SSRF",
  "SSRF occurs when a server makes attacker-influenced requests to destinations it should not reach, including private infrastructure or metadata endpoints.",
  "ইউজারের দেওয়া ঠিকানায় সার্ভারকে পাঠিয়ে ভেতরের ঘরে ঢোকানোর ঝুঁকি।",
  `var allowed = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "api.example.com" }; ~~ Maintain a strict destination allowlist. / অনুমোদিত host-এর তালিকা।
var uri = new Uri(userUrl); ~~ Parse an input URL. / URL parse।
if (uri.Scheme != "https" || !allowed.Contains(uri.Host)) throw new ArgumentException("Destination denied"); ~~ Reject unapproved destinations. / অনুমতি না থাকলে বন্ধ।`,
  "User URL > Destination validation > Controlled egress > HTTP request",
  "This fragment is only an initial host check. Redirects, DNS rebinding, alternate encodings, private IP resolution, and metadata addresses need additional controls.",
  "Prefer fixed upstream identifiers over arbitrary URLs. Disable or revalidate redirects, constrain network egress, and set strict time/size limits.",
);
add(
  "Rate Limiting and DDoS Mitigation",
  "Application quotas manage individual usage; volumetric attacks require upstream capacity, filtering, and edge controls before traffic saturates the origin.",
  "দোকানের লাইনের নিয়ম যথেষ্ট নয় যদি পুরো রাস্তা ভিড়ে বন্ধ হয়ে যায়।",
  `app.MapGet("/expensive", () => "Bounded work").RequireRateLimiting("demo"); ~~ Attach a preconfigured application limiter. / অ্যাপের limiter দিন।`,
  "Edge filter > Connection limits > Application quota > Bounded work",
  "This fragment requires the demo limiter from the rate-limiting lesson. A local limiter does not stop a network-saturating attack.",
  "Layer CDN/WAF protections, per-identity quotas, request body limits, timeouts, and overload shedding. Monitor false positives and emergency procedures.",
);
add(
  "Dependency Scanning",
  "Track vulnerable direct and transitive packages and update them with compatibility tests. A scanner finding nothing is not proof of a secure application.",
  "নিজের কোডের সাথে ধার করা package-এর ঝুঁকিও পরীক্ষা করুন।",
  `dotnet list package --vulnerable --include-transitive ~~ List known vulnerable dependencies in a .NET project. / নির্ভরতার পরিচিত ঝুঁকি দেখুন।
dotnet list package --outdated ~~ Find available updates for review. / নতুন সংস্করণ দেখুন।`,
  "Dependency inventory > Advisory match > Risk triage > Tested update",
  "Run from a project/solution folder. Advisory coverage and freshness vary; do not blindly upgrade all packages without tests.",
  "Use lockfiles, provenance controls, trusted registries, automated update PRs, and an SBOM alongside vulnerability scanning.",
);
add(
  "Penetration Testing",
  "Authorized security testing examines whether real application boundaries can be bypassed. Start with scope, test accounts, and a controlled environment.",
  "নিজের অনুমোদিত test পরিবেশে তালা ঠিকমতো কাজ করছে কি না যাচাই করুন।",
  `var response = await client.GetAsync("/private"); ~~ Request a protected endpoint without credentials in a local test. / পরিচয় ছাড়া সুরক্ষিত route পরীক্ষা।
Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode); ~~ Verify the boundary rejects anonymous access. / অননুমোদিত হলে ৪০১ আশা।`,
  "Defined scope > Test identity > Boundary request > Evidence and fix",
  "Integration-test fragment: client comes from a local WebApplicationFactory and Assert from xUnit. Test only authorized systems.",
  "Include object ownership, role changes, replay, input boundaries, and business-logic abuse. Record reproducible evidence and retest fixes.",
);
add(
  "Prompt Injection",
  "Untrusted text can try to redirect an LLM away from its intended task. Keep data separate from instructions and enforce tool permissions outside the model.",
  "ডকুমেন্টের লেখা যেন অ্যাপের আসল নির্দেশ হয়ে tool চালাতে না পারে।",
  `var allowedTools = new HashSet<string> { "search_docs" }; ~~ Define capability policy in application code. / কোডে tool-এর অনুমতি।
bool CanCall(string tool) => allowedTools.Contains(tool); ~~ Check every proposed tool name outside the model. / model-এর বাইরে যাচাই।
Console.WriteLine(CanCall("delete_account")); ~~ Print False for an unauthorized action. / অননুমোদিত কাজ নিষিদ্ধ।`,
  "Untrusted content > Model proposal > Policy gate > Authorized tool",
  "Prompt wording alone cannot enforce a security boundary. Validate tool arguments, caller identity, resource access, and output handling.",
  "Use least-privilege tools, isolated untrusted context, confirmation for consequential actions when required, and adversarial evaluation. Injection detection is imperfect.",
);
add(
  "Scalability",
  "Vertical scaling adds resources to one machine; horizontal scaling adds machines. Scaling helps only when the bottleneck and shared dependencies can use the extra capacity.",
  "একটি বড় দোকান করা vertical; একই কাজের আরও দোকান খোলা horizontal scaling।",
  `int totalRequests = 1200, replicas = 3; ~~ Define a simple even-distribution model. / অনুরোধ ও server সংখ্যা।
double perReplica = (double)totalRequests / replicas; ~~ Estimate per-instance load. / প্রতি server-এর আনুমানিক চাপ।
Console.WriteLine(perReplica); ~~ Print 400; this is a capacity model, not a benchmark. / মডেলের ফল ৪০০।`,
  "Demand > Load distribution > Replicas > Shared dependencies",
  "Adding API replicas does not fix an already saturated database. Remove state affinity before relying on horizontal scaling.",
  "Apply Amdahl’s law, identify coordination overhead, and measure p95/p99 latency under realistic load rather than assuming linear speedup.",
);
add(
  "Load Balancing",
  "A load balancer routes requests across healthy backends using a selection policy such as round robin or least connections.",
  "একাধিক টিকিট কাউন্টারে মানুষ ভাগ করে দিন, বন্ধ কাউন্টারে পাঠাবেন না।",
  `string[] servers = { "api-a", "api-b", "api-c" }; ~~ List illustrative healthy backends. / সচল server-এর তালিকা।
for (int request = 0; request < 6; request++) ~~ Generate six example requests. / ছয়টি অনুরোধ।
  Console.WriteLine(servers[request % servers.Length]); ~~ Route in a round-robin cycle. / পালাক্রমে ভাগ।`,
  "Client > Health-aware balancer > Selected backend > Response",
  "This local loop does not implement a network proxy, concurrent selection, health checks, or sticky sessions.",
  "L4 balances transport connections; L7 understands HTTP. Account for long-lived connections, retries, TLS termination, and uneven request cost.",
);
add(
  "Caching",
  "Reuse a previously computed or fetched value to reduce repeated work, while explicitly accepting and bounding possible staleness.",
  "প্রতিবার বাজারে না গিয়ে প্রতিদিনের চা-পাতা হাতের কাছে রাখুন।",
  `var cache = new Dictionary<string, string>(); ~~ Use a local teaching cache. / local cache।
if (!cache.TryGetValue("tea", out string? value)) { ~~ Detect a cache miss. / cache-এ নেই।
  value = "Tea details"; cache["tea"] = value; ~~ Simulate loading and storing a result. / এনে রাখুন।
} ~~ Production needs expiry and concurrency controls. / মেয়াদ ও concurrency দরকার।
Console.WriteLine(value); ~~ Reuse the result. / ফল ব্যবহার।`,
  "Lookup > Hit or miss > Origin load > Store result",
  "This Dictionary is not thread-safe and has no expiry or size bound. Do not use it as production cache infrastructure.",
  "Choose cache-aside, read-through, write-through, or write-behind based on consistency and failure requirements. Plan invalidation and stampede protection.",
);
add(
  "CDN",
  "A content delivery network serves cacheable content from locations close to users, reducing origin load and network distance.",
  "ঢাকায় থাকা ইউজারকে দূরের গুদামের বদলে কাছের শাখা থেকে ছবি দিন।",
  `app.MapGet("/assets/versioned-guide.txt", (HttpContext ctx) => { ~~ Define a cacheable illustrative resource. / cache করা যায় এমন resource।
  ctx.Response.Headers.CacheControl = "public,max-age=3600"; ~~ Allow shared caches to reuse for an hour. / এক ঘণ্টা shared cache।
  return "Static guide"; ~~ Return non-personal content. / ব্যক্তিগত নয় এমন content।
}); ~~ A CDN must be configured separately. / CDN আলাদা সেটআপ।`,
  "User > Edge cache > Origin on miss > Cached response",
  "Never mark personalized or secret responses public. Cache keys must account for every response-varying input.",
  "Version asset filenames, configure purge strategy, understand stale-while-revalidate, and avoid cache poisoning through unkeyed headers/query parameters.",
);
add(
  "Blob Storage",
  "Object stores hold large byte sequences using keys and metadata rather than exposing a general-purpose local filesystem.",
  "ছবি-ভিডিওর বাক্স key দিয়ে আলাদা গুদামে রাখুন।",
  `var objectKey = $"uploads/{Guid.NewGuid():N}.jpg"; ~~ Generate a collision-resistant storage key. / আলাদা object key।
Console.WriteLine(objectKey); ~~ Keep the key in database metadata, not the file bytes. / database-এ key রাখুন।`,
  "Upload bytes > Object key > Durable object store > Metadata reference",
  "A key-generation example does not upload bytes. Configure S3/Blob SDK, permissions, size validation, and lifecycle policies separately.",
  "Object stores have provider-specific consistency, multipart, versioning, and deletion semantics. Do not assume rename or atomic append behaves like a filesystem.",
);
add(
  "API Gateway",
  "A gateway provides one entry boundary for routing and shared edge policies such as authentication, rate limits, and request size controls.",
  "বড় ভবনের রিসেপশন ডেস্কের মতো সঠিক বিভাগে অনুরোধ পাঠায়।",
  `var routes = new Dictionary<string, string> { ["/orders"] = "orders-service", ["/catalog"] = "catalog-service" }; ~~ Model route-to-service configuration. / route থেকে service।
Console.WriteLine(routes["/orders"]); ~~ Select the destination for an illustrative prefix. / গন্তব্য বাছুন।`,
  "Client > Gateway policy > Route selection > Service",
  "This is a routing model, not a reverse proxy. Production forwarding needs YARP or another gateway implementation.",
  "Keep business logic out of shared edge layers. Gateways can become bottlenecks or single points of failure; replicate and monitor them.",
);
add(
  "Replication",
  "Replication keeps copies of data on multiple nodes for availability or read capacity. Updates reach replicas according to a consistency protocol.",
  "একটি মূল খাতার একাধিক কপি রাখুন, তবে নতুন লেখা সবার কাছে একসাথে নাও পৌঁছাতে পারে।",
  `int primaryVersion = 3, replicaVersion = 2; ~~ Model a replica lagging one update behind. / কপি এক পরিবর্তন পিছিয়ে।
bool fresh = replicaVersion >= primaryVersion; ~~ Compare observed versions. / সংস্করণ মিলিয়ে দেখুন।
Console.WriteLine(fresh); ~~ Print False: this read could be stale. / পুরোনো ফল হতে পারে।`,
  "Primary write > Replication log > Replica apply > Read replica",
  "A replica is not a backup: accidental deletion or corruption can replicate too.",
  "Synchronous replication trades latency/availability for stronger durability guarantees. Asynchronous replicas may lag and can lose recent writes on failover.",
);
add(
  "Database Sharding",
  "Partition rows across separate database instances using a shard key. A query is cheapest when its target shard can be determined directly.",
  "অনেক ছাত্রের খাতা রোলের ভাগ অনুযায়ী আলাদা আলমারিতে রাখুন।",
  `int tenantId = 42, shardCount = 4; ~~ Choose a stable domain key. / স্থায়ী key।
int shard = tenantId % shardCount; ~~ Route this nonnegative key in a simple model. / ভাগশেষে shard বাছুন।
Console.WriteLine($"shard-{shard}"); ~~ Route to shard-2. / shard-2।`,
  "Shard key > Routing function > Target database > Local query",
  "Modulo routing remaps many keys when shardCount changes. Real routing needs a migration and versioning plan.",
  "Choose keys to avoid hot shards and cross-shard transactions. Plan resharding, uniqueness, backups, and aggregate queries.",
);
add(
  "Consistent Hashing",
  "Place nodes and keys on a hash ring so adding/removing a node moves only nearby key ranges rather than remapping almost every key.",
  "বৃত্তে দোকান ও ক্রেতা বসিয়ে পরের দোকানে পাঠান; নতুন দোকানে অল্প ক্রেতা বদলায়।",
  `int[] ring = { 20, 50, 90 }; ~~ Sorted node positions on a simplified ring. / বৃত্তে node-এর অবস্থান।
int keyHash = 60; ~~ Pretend a stable hash produced this coordinate. / key-এর স্থান।
int node = ring.FirstOrDefault(x => x >= keyHash, ring[0]); ~~ Select the clockwise successor, wrapping if needed. / পরের node, শেষে ঘুরে শুরু।
Console.WriteLine(node); ~~ Print 90. / ৯০-এর node।`,
  "Hash key > Ring position > Clockwise successor > Node assignment",
  "Do not use process-randomized string.GetHashCode for persistent cross-process routing. Use a specified stable hash.",
  "Virtual nodes improve balance but do not remove hot-key problems. Membership changes need coordinated data transfer and replication.",
);
add(
  "Kafka and Pub / Sub",
  "Kafka stores events in partitioned append-only logs. Consumers in one group divide partitions; different groups independently process the same stream.",
  "একই খবরের খাতা আলাদা দল পড়ে; এক দলের মধ্যে কাজ ভাগ হয়।",
  `record Event(string Key, string Value); ~~ Model a keyed event. / key-সহ event।
var events = new[] { new Event("order-1", "Created"), new Event("order-1", "Paid") }; ~~ Keep related events under one key. / একই key-তে সম্পর্কিত খবর।
foreach (var e in events) Console.WriteLine($"{e.Key}: {e.Value}"); ~~ Illustrate ordered processing for one key. / এক key-এর ক্রম।`,
  "Producer > Topic partition > Consumer group > Offset checkpoint",
  "This local sequence is not a Kafka client. Use Confluent.Kafka or another maintained client for actual broker operations.",
  "Order is per partition, not global. Offset commit timing and external side effects determine duplicate/loss behavior; use idempotent processing.",
);
add(
  "Event-Driven Architecture",
  "Components publish facts after changes, and independent handlers react asynchronously. Events describe completed facts rather than requested actions.",
  "অর্ডার হয়েছে—এই খবর শুনে হিসাব, স্টক ও ডেলিভারি আলাদা কাজ করে।",
  `record OrderPlaced(Guid OrderId, DateTime OccurredAt); ~~ Define a past-tense fact. / ঘটে যাওয়া খবর।
var evt = new OrderPlaced(Guid.NewGuid(), DateTime.UtcNow); ~~ Capture event identity and time. / পরিচয় ও সময়।
string payload = System.Text.Json.JsonSerializer.Serialize(evt); ~~ Prepare a portable event representation. / পাঠানোর মতো ডেটা।`,
  "Commit change > Publish fact > Independent handlers > Derived effects",
  "Serialization is not reliable publication. A crash between database commit and publish can lose the event.",
  "Use a transactional outbox, versioned event schemas, idempotent consumers, correlation IDs, and explicit eventual consistency expectations.",
);
add(
  "Microservices",
  "Split a system into independently deployable services around business capabilities, with explicit contracts and ownership. Network boundaries add failure and coordination costs.",
  "এক বড় দোকানের সব কাজ আলাদা বিভাগে ভাগ করে প্রত্যেকের নিজের দায়িত্ব দিন।",
  `using var client = new HttpClient { BaseAddress = new Uri("https://catalog.example.com") }; ~~ Show a remote service boundary. / দূরের service।
using var response = await client.GetAsync("/products/1"); ~~ Make an asynchronous request. / অনুরোধ পাঠান।
response.EnsureSuccessStatusCode(); ~~ Handle failure rather than assuming success. / ব্যর্থতা ধরুন।`,
  "Service boundary > Network call > Independent storage > Contract response",
  "The URL is illustrative. In ASP.NET Core, prefer IHttpClientFactory for managed client lifetimes and resilience configuration.",
  "Start with a modular monolith when deployment independence is not needed. Plan timeouts, tracing, data ownership, and distributed transactions.",
);
add(
  "Rate Limiter Design",
  "Choose a quota algorithm and atomic state update: fixed windows are simple; sliding windows smooth boundaries; token buckets allow bounded bursts.",
  "প্রতি মিনিটের টিকিট নাকি জমা থাকা token—সীমা দেওয়ার নিয়ম আগে বাছুন।",
  `double tokens = 5, capacity = 5, refillPerSecond = 1; ~~ Initialize a token bucket model. / token-এর বাক্স।
double elapsedSeconds = 2; ~~ Model time since last refill. / পার হওয়া সময়।
tokens = Math.Min(capacity, tokens + elapsedSeconds * refillPerSecond); ~~ Refill without exceeding capacity. / সীমা পর্যন্ত পূরণ।
bool allowed = tokens >= 1; if (allowed) tokens--; ~~ Atomically check and spend one permit in a real implementation. / token থাকলে খরচ।`,
  "Elapsed time > Refill bucket > Check permit > Spend or reject",
  "This single-threaded math example is not concurrency-safe. Concurrent distributed checks need atomic updates and a trusted clock strategy.",
  "Partition by appropriate identity, protect key cardinality, choose burst/steady-state limits, and specify behavior when the quota store is unavailable.",
);
add(
  "CAP Theorem",
  "During a network partition, a distributed system cannot guarantee both linearizable consistency and a successful response to every request under CAP’s definitions.",
  "যোগাযোগ বিচ্ছিন্ন হলে সব কপি একই সত্য বলবে, নাকি সবাই উত্তর দেবে—কিছু ক্ষেত্রে বেছে নিতে হয়।",
  `bool partitioned = true, requireConsistentWrite = true; ~~ Model an isolated node and strict consistency requirement. / বিচ্ছিন্ন node।
string action = partitioned && requireConsistentWrite ? "Reject write" : "Accept write"; ~~ Illustrate refusing unsafe writes. / অসমর্থিত write ফিরিয়ে দিন।
Console.WriteLine(action); ~~ The model chooses consistency over availability during partition. / partition-এ consistency বাছা।`,
  "Partition > Can coordinate? > Consistency policy > Accept or reject",
  "CAP is not simply choose any two of three all the time. Partition tolerance is a condition in the trade-off.",
  "Define consistency precisely. Availability in CAP means every request to a non-failing node receives a response, not a monthly uptime percentage.",
);
add(
  "PACELC Theorem",
  "PACELC extends the discussion: if there is a partition, trade availability versus consistency; else, trade latency versus consistency.",
  "যোগাযোগ ঠিক থাকলেও সব কপি মিলিয়ে উত্তর দিতে বেশি সময় লাগতে পারে।",
  `int localReadMs = 2, quorumReadMs = 25; ~~ Compare illustrative coordination costs. / দুই পড়ার আনুমানিক সময়।
Console.WriteLine($"Local {localReadMs}ms; coordinated {quorumReadMs}ms"); ~~ Discuss latency, not measured benchmark claims. / মডেলের সময় তুলনা।`,
  "Normal operation > Coordination choice > Latency cost > Consistency guarantee",
  "These numbers are invented for the model, not provider benchmarks. Actual trade-offs depend on protocol and deployment.",
  "Evaluate quorum placement, cross-region RTT, read/write guarantees, and tail latency under normal as well as partitioned operation.",
);
add(
  "Consistency Models",
  "A consistency model specifies what histories of reads and writes clients may observe, such as linearizable, causal, or eventual behavior.",
  "কে কখন কোন লেখা দেখতে পাবে, তার চুক্তিই consistency model।",
  `int observed = 1, newest = 2; ~~ Model a stale replica read. / পিছিয়ে থাকা ফল।
Console.WriteLine(observed == newest ? "Fresh" : "Stale"); ~~ Compare the observation with the known latest version. / সর্বশেষের সাথে মিল।`,
  "Write > Propagation > Client read > Observable guarantee",
  "Eventual consistency does not mean a fixed maximum delay unless the system explicitly provides that bound.",
  "Choose read-your-writes or monotonic-read guarantees for user workflows where full linearizability is unnecessary but arbitrary staleness is confusing.",
);
add(
  "Bloom Filter",
  "A Bloom filter is a compact probabilistic membership structure. It can say definitely absent or possibly present, with configurable false positives.",
  "ছোট ছাঁকনি নিশ্চিত করে বলতে পারে নেই; আছে বললে আসল খাতায় আবার মিলান।",
  `var bits = new System.Collections.BitArray(16); ~~ Allocate a tiny demonstration bitset. / bit-এর ছক।
int Hash(int x) => (x & int.MaxValue) % bits.Length; ~~ Use one simple teaching hash. / উদাহরণের hash।
bits[Hash(42)] = true; ~~ Mark an inserted value. / মানের চিহ্ন দিন।
Console.WriteLine(bits[Hash(58)]); ~~ Collision says possibly present, even though 58 was not added. / সংঘর্ষে ভুল হ্যাঁ।`,
  "Hash item > Set bits > Check bits > Maybe or definitely not",
  "Real Bloom filters use multiple well-chosen hashes. This one-hash teaching example exaggerates collisions. Deleting bits can create false negatives.",
  "Choose bit count and hash count for expected insertions and false-positive rate. Use counting filters when deletion is a real requirement.",
);
add(
  "Circuit Breaker",
  "Stop repeatedly calling an unhealthy dependency after a failure threshold. After a cooldown, allow limited probe calls before closing the circuit.",
  "বারবার শর্ট সার্কিট হলে সুইচ বন্ধ রাখুন, কিছুক্ষণ পরে অল্প পরীক্ষা করুন।",
  `enum CircuitState { Closed, Open, HalfOpen } ~~ Name the three control states. / তিনটি অবস্থা।
static class Circuit { public static bool CanCall(CircuitState state) => state != CircuitState.Open; } ~~ Model rejecting calls while open. / Open হলে কল নয়।`,
  "Closed calls > Failure threshold > Open cooldown > Half-open probe",
  "This is a state model, not a complete breaker. Use a maintained resilience library with synchronized state and metrics.",
  "Separate timeouts, retries, and breakers. Excess retries can amplify an outage; use jitter, budgets, and idempotency.",
);
add(
  "Saga Pattern",
  "Coordinate a multi-service workflow through local transactions and compensating actions instead of one global database transaction.",
  "ফ্লাইট বুক হলো কিন্তু হোটেল হলো না—আগের বুকিং বাতিলের আলাদা কাজ দরকার।",
  `var steps = new[] { "Reserve inventory", "Charge payment", "Confirm order" }; ~~ Define local business steps. / স্থানীয় কাজগুলো।
var compensation = new[] { "Release inventory", "Refund payment" }; ~~ Plan meaningful undo actions. / ক্ষতিপূরণের কাজ।
Console.WriteLine(string.Join(" -> ", steps)); ~~ Visualize the forward workflow. / সামনের পথ দেখান।`,
  "Local transaction > Next service > Failure detection > Compensation",
  "A refund is a new business operation, not a perfect time reversal. Compensation can fail and need retries/manual recovery.",
  "Choose orchestration or choreography, persist saga state, correlate events, handle duplicates, and define timeout and recovery policies.",
);
add(
  "Back-of-the-Envelope Estimation",
  "Estimate request rates, storage, bandwidth, and concurrency from assumptions before choosing architecture. Keep units explicit and use peak as well as average demand.",
  "কত মানুষ, দিনে কত কাজ, কত byte—আগে সহজ হিসাব করুন, তারপর server বাছুন।",
  `long users = 1_000_000, actionsPerDay = 10; ~~ State demand assumptions. / ব্যবহারকারী ও কাজের ধারণা।
double averageQps = users * actionsPerDay / 86400.0; ~~ Convert daily actions to requests per second. / দিনে থেকে সেকেন্ডে।
double peakQps = averageQps * 5; ~~ Model a five-times peak assumption. / পাঁচ গুণ peak ধরে।
Console.WriteLine($"Average {averageQps:F1}; peak {peakQps:F1}"); ~~ Print estimates, not measured capacity. / আনুমানিক ফল।`,
  "Assumptions > Unit conversion > Peak factor > Capacity budget",
  "Distinguish bytes from bits, GB from GiB, and averages from p99 behavior. A calculation is not a load test.",
  "Little’s law relates concurrency, arrival rate, and time in a stable system. Include replication, indexes, retention, and safety headroom in storage estimates.",
);
add(
  "EC2",
  "EC2 provides virtual machines. You choose an instance shape and image, then manage operating-system patches, networking, and application deployment.",
  "EC2 হলো ভাড়ার কম্পিউটার; OS ও অ্যাপ চালানোর দায়িত্ব আপনার।",
  `aws ec2 describe-instances --region ap-south-1 ~~ Inspect instances in a specific region. / নির্দিষ্ট অঞ্চলের machine দেখুন।`,
  "AMI > Instance > Security group > Application",
  "AWS CLI examples require configured credentials and real account permissions; they do not run in this browser. Region and resource IDs must match.",
  "Choose instance families by CPU/memory/I/O needs, use instance roles instead of static keys, and deploy across availability zones for resilience.",
);
add(
  "S3",
  "S3 stores objects in buckets. An object has a key, bytes, and metadata; prefixes are not real directories.",
  "S3-তে bucket-এর ভেতর key দিয়ে ছবি, ফাইল ও ব্যাকআপ রাখুন।",
  `aws s3 ls s3://your-bucket/ ~~ List objects under an authorized bucket. / অনুমতি থাকা bucket-এর তালিকা।
aws s3api get-bucket-versioning --bucket your-bucket ~~ Inspect versioning configuration. / versioning সেটিং দেখুন।`,
  "Bucket > Object key > Stored bytes > Access policy",
  "Replace your-bucket. Do not make a bucket public just to fix an application permission error.",
  "Use block-public-access, least-privilege policies, encryption, lifecycle rules, versioning, and retention suited to recovery requirements.",
);
add(
  "IAM",
  "IAM defines identities, policies, and roles controlling which AWS actions can operate on which resources under which conditions.",
  "কার হাতে কোন ঘরের চাবি, IAM তার অনুমতি নির্ধারণ করে।",
  `aws sts get-caller-identity ~~ Verify which account and principal the CLI is using. / বর্তমান account ও পরিচয় দেখুন।
aws iam list-roles --max-items 5 ~~ Inspect a bounded page of roles if permitted. / অনুমতি থাকলে role দেখুন।`,
  "Principal > Policy evaluation > Action and resource > Allow or deny",
  "Explicit deny overrides allow. Identity policy and resource policy evaluation can interact; inspect the real account boundary.",
  "Prefer short-lived assumed roles, workload identities, permission boundaries, and scoped resource access. Root credentials should not be application credentials.",
);
add(
  "RDS",
  "RDS manages relational database infrastructure while you retain responsibility for schema, indexes, queries, access, and data lifecycle.",
  "RDS database-এর অনেক পরিচালনা করে; query ও schema ঠিক রাখা তবুও আপনার কাজ।",
  `aws rds describe-db-instances --region ap-south-1 ~~ Inspect database instances and endpoints. / database instance দেখুন।`,
  "Application > DB endpoint > Managed database > Backups and replicas",
  "A managed database is not automatically highly available. Deployment mode, backups, maintenance, and networking need explicit configuration.",
  "Choose Multi-AZ for availability and read replicas for read scaling according to engine semantics. Use pooling, private networking, and recovery drills.",
);
add(
  "Route 53",
  "Route 53 provides DNS and routing policies that resolve names to endpoints. DNS answers are cached according to TTL and client behavior.",
  "সাইটের নাম থেকে ঠিকানা খুঁজে দেওয়া ফোনবুকের মতো DNS।",
  `aws route53 list-hosted-zones --max-items 5 ~~ Inspect hosted DNS zones. / DNS zone-এর তালিকা।`,
  "Domain name > DNS resolver > Routing record > Endpoint address",
  "DNS changes are not instant for every client. A low TTL has cost and does not override all caching behavior.",
  "Use health-aware routing carefully, understand alias versus CNAME behavior, and treat registrar, zone, and certificate management as distinct concerns.",
);
add(
  "VPC",
  "A VPC is a logically isolated network containing subnets, route tables, gateways, and security boundaries. Subnet routes determine reachability.",
  "ক্লাউডে নিজের নেটওয়ার্কের পাড়া বানান; কোন রাস্তা কোথায় যাবে তা route ঠিক করে।",
  `aws ec2 describe-vpcs --region ap-south-1 ~~ Inspect virtual networks. / নেটওয়ার্ক দেখুন।
aws ec2 describe-subnets --region ap-south-1 ~~ Inspect subnet placement and address ranges. / subnet-এর ঠিকানা।`,
  "VPC > Subnet > Route table > Security boundary",
  "A public subnet route does not automatically make every workload public. IP assignment, security groups, and listeners also matter.",
  "Plan CIDRs, private endpoints, NAT cost, availability-zone isolation, and security group rules. Security groups are stateful; network ACLs have different semantics.",
);
add(
  "Lambda",
  "Lambda runs event-triggered functions without a continuously managed VM. Execution environment lifetime and concurrency are controlled by the platform.",
  "ঘণ্টার পর ঘণ্টা machine চালিয়ে না রেখে ঘটনা এলে function চালান।",
  `aws lambda list-functions --region ap-south-1 --max-items 5 ~~ Inspect deployed functions. / function-এর তালিকা।`,
  "Event > Function invocation > Handler > Response or downstream work",
  "Function invocations have limits and may be retried depending on event source. Static in-memory state is not durable storage.",
  "Use idempotency, bounded concurrency, appropriate timeout/memory, and .NET Native AOT where it helps cold start and fits dependency constraints.",
);
add(
  "CloudFront",
  "CloudFront is AWS’s CDN. It caches configured origin responses at edge locations using cache and origin-request policies.",
  "CloudFront কাছের edge থেকে content দেয়, তাই দূরের মূল server-এ বারবার যেতে হয় না।",
  `aws cloudfront list-distributions --max-items 5 ~~ Inspect CDN distributions. / distribution দেখুন।`,
  "Viewer > Edge cache policy > Origin request > Cached object",
  "Forwarding a header to the origin does not always mean it is in the cache key. Misconfiguration can leak personalized content.",
  "Use versioned assets, Origin Access Control for private S3 origins, signed access when needed, and carefully planned invalidation.",
);
add(
  "Auto Scaling",
  "Adjust workload capacity from demand signals while respecting minimums, maximums, warm-up time, and cooldown behavior.",
  "ভিড় বাড়লে কাউন্টার বাড়ান; কমলে কমান; নতুন কাউন্টার প্রস্তুত হতে সময় লাগে।",
  `aws autoscaling describe-auto-scaling-groups --region ap-south-1 ~~ Inspect group bounds and desired capacity. / scaling group দেখুন।`,
  "Metric > Scaling policy > New capacity > Health and warm-up",
  "Scaling is delayed and cannot fix a downstream bottleneck by itself. Protect the database from an uncontrolled scale-out.",
  "Choose signals tied to real saturation, pre-scale predictable peaks, set safe bounds, and test scale-in draining and cost behavior.",
);
add(
  "SNS",
  "SNS fans out published messages to multiple subscriptions. It is useful when several independent systems should react to the same event.",
  "একটি খবর একসাথে কয়েকটি দলের কাছে পাঠান।",
  `aws sns list-topics --region ap-south-1 ~~ Inspect publish/subscribe topics. / topic দেখুন।`,
  "Publisher > Topic > Subscription filter > Multiple consumers",
  "Different subscription types have different retry and delivery behavior. A topic is not a consumer-owned durable work queue.",
  "A common pattern is SNS to separate SQS queues so subscribers have independent buffering, retries, and dead-letter handling.",
);
add(
  "SQS",
  "SQS stores messages until consumers receive and delete them. Visibility timeout temporarily hides a received message while it is being processed.",
  "রান্নাঘরের কাজের স্লিপের লাইনের মতো; কাজ শেষ হলে স্লিপ সরান।",
  `aws sqs list-queues --region ap-south-1 ~~ Inspect available queues. / queue-এর তালিকা।`,
  "Send message > Visibility lease > Process > Delete or redeliver",
  "Standard queues can deliver duplicates. Never assume a successful receive means processing is permanently complete.",
  "Tune visibility to job duration, extend it for long work, use dead-letter queues, and make side effects idempotent. FIFO has different throughput/ordering constraints.",
);
add(
  "DynamoDB",
  "DynamoDB is a managed key-value/document database designed around partition and sort keys. Efficient access patterns begin with a known partition key.",
  "কোন key দিয়ে খুঁজবেন তা আগে ঠিক করে দ্রুত ডেটা রাখুন ও পড়ুন।",
  `aws dynamodb list-tables --region ap-south-1 ~~ Inspect table names. / টেবিলের নাম দেখুন।`,
  "Partition key > Item or range > Capacity partition > Result",
  "A scan is not a substitute for designing keys and indexes. Uneven keys can create hot partitions.",
  "Model access patterns first, use conditional writes for invariants, understand consistency choices, and budget secondary index and capacity costs.",
);
add(
  "CloudWatch",
  "CloudWatch collects AWS metrics, logs, and alarms. An alarm evaluates a signal against a rule and can trigger a notification or action.",
  "অ্যাপ ও cloud resource-এর মিটার ও সতর্কতার ঘর।",
  `aws cloudwatch describe-alarms --region ap-south-1 --max-records 10 ~~ Inspect configured metric alarms. / alarm দেখুন।`,
  "Resource signal > Metric or log > Alarm rule > Notification",
  "Collecting logs without retention limits can create unexpected cost. An alarm needs a clear response owner and runbook.",
  "Monitor user-facing latency/errors and saturation, choose aggregation windows carefully, and avoid high-cardinality dimensions.",
);
add(
  "ECS",
  "ECS schedules containers into services and tasks. Fargate removes host management; EC2 launch capacity retains host-level responsibility.",
  "কন্টেইনার কোথায় চলবে ও কয়টি চলবে, ECS তা সামলায়।",
  `aws ecs list-clusters --region ap-south-1 ~~ Inspect container clusters. / cluster দেখুন।`,
  "Task definition > Service scheduler > Task instance > Load balancer",
  "A task role controls application AWS access; an execution role supports pulling images and related platform operations.",
  "Design health checks, deployment rollback, network mode, secrets injection, and capacity strategy. Choose Fargate versus EC2 by control, scaling, and cost needs.",
);
add(
  "EKS",
  "EKS manages a Kubernetes control plane while workloads, access policies, node/runtime capacity, and application operations still require configuration.",
  "Kubernetes-এর control plane AWS চালালেও আপনার workload-এর দায়িত্ব থাকে।",
  `aws eks list-clusters --region ap-south-1 ~~ Inspect managed Kubernetes cluster names. / EKS cluster দেখুন।`,
  "Managed control plane > Worker capacity > Pods > Service ingress",
  "EKS is not a reason to choose Kubernetes if simpler hosting meets the requirements. Cluster access and workload IAM are distinct.",
  "Plan version upgrades, node patching, pod identity, network policy, ingress, observability, and control-plane connectivity.",
);
add(
  "ECR",
  "ECR is a container image registry. Store versioned images and use repository policies and scanning to govern distribution.",
  "তৈরি Docker image রাখার AWS গুদাম।",
  `aws ecr describe-repositories --region ap-south-1 ~~ Inspect image repositories. / image repository দেখুন।`,
  "Image build > Repository > Image digest > Runtime pull",
  "A tag can move unless tag immutability is configured. Deploy by digest when exact artifact identity matters.",
  "Use scanning, lifecycle cleanup, least-privilege pull/push roles, and replication according to region/recovery needs.",
);
add(
  "CloudFormation",
  "CloudFormation describes AWS resources as a stack and computes updates from a template and existing state.",
  "ক্লাউডের ঘরবাড়ির লিখিত নকশা থেকে একই রিসোর্স তৈরি ও বদলান।",
  `aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE --region ap-south-1 ~~ Inspect successfully deployed stacks. / তৈরি stack দেখুন।`,
  "Template > Change set > Resource operations > Stack state",
  "Some updates replace resources. Review change sets and retention policies before applying changes to stateful resources.",
  "Use reusable modules, parameter validation, drift detection, rollback plans, and least-privilege deployment roles. Infrastructure code still needs review and testing.",
);
add(
  "LLM Fundamentals",
  "A language model predicts tokens from context. Its output can be useful but is not a database lookup, a proof, or a guarantee of factual correctness.",
  "আগের লেখা দেখে পরের ছোট অংশ অনুমান করে LLM; সাবলীল উত্তর মানেই সত্য নয়।",
  `IChatClient client = configuredClient; ~~ Use an authenticated Microsoft.Extensions.AI provider client. / সেটআপ করা model client।
var response = await client.GetResponseAsync("Explain a C# variable in one sentence."); ~~ Request a short teaching response. / ছোট ব্যাখ্যা চান।
Console.WriteLine(response.Text); ~~ Inspect the generated answer before trusting it. / যাচাই করে উত্তর দেখুন।`,
  "Messages > Token context > Next-token generation > Reviewed answer",
  "Provider fragment: requires Microsoft.Extensions.AI, a provider adapter, and configuredClient. Never put provider secrets into a browser bundle.",
  "Choose model capability, latency, cost, context, and privacy requirements. Evaluate factuality and task success rather than judging only fluency.",
);
add(
  "Tokens and Context Window",
  "Models read and generate tokens, which are not identical to words or characters. The context window limits combined input and output budget according to model rules.",
  "একটি বাংলা শব্দও কয়েক token হতে পারে; পুরো আলাপের জন্য সীমিত জায়গা থাকে।",
  `int contextLimit = 8000, reservedOutput = 1000, inputTokens = 6500; ~~ Use illustrative token counts. / উদাহরণের token হিসাব।
bool fits = inputTokens + reservedOutput <= contextLimit; ~~ Reserve space for generated output. / উত্তরের জায়গা রাখুন।
Console.WriteLine(fits); ~~ Print True under these assumptions. / এই হিসাবে True।`,
  "Text > Model tokenizer > Budget check > Truncate or summarize",
  "These counts are illustrative. Use the actual model tokenizer; splitting text on spaces is not accurate token counting.",
  "Preserve essential instructions and recent task state when trimming. Long context does not guarantee attention to every detail and increases cost.",
);
add(
  "Prompt Engineering",
  "A useful prompt defines the task, relevant context, expected output, and constraints. Examples help communicate a format but do not guarantee compliance.",
  "শিক্ষার্থীকে কাজ দেওয়ার মতো কী চাই, কী তথ্য আছে, কীভাবে উত্তর চাই—স্পষ্ট বলুন।",
  `string topic = "C# variables"; ~~ Keep task input explicit. / কাজের বিষয়।
string prompt = $"Explain {topic} for a beginner. Give one analogy and one 3-line example. State uncertainty."; ~~ Specify audience and output. / শ্রোতা ও উত্তর নির্ধারণ।
Console.WriteLine(prompt); ~~ Review the prompt before using a model. / পাঠানোর আগে দেখুন।`,
  "Task > Context > Output contract > Evaluation",
  "Untrusted document text is data, not a higher-priority instruction. Prompt wording cannot enforce tool permissions.",
  "Measure prompts on representative cases, test ambiguity and adversarial inputs, and use structured output plus application validation when format matters.",
);
add(
  "Structured Outputs",
  "Constrain a generated response to a schema and deserialize it into a typed object. Schema validity does not imply the values are true or authorized.",
  "ফ্রি লেখা না নিয়ে নির্দিষ্ট ঘরের ফর্ম পূরণ করান, তারপর মান যাচাই করুন।",
  `record StudyPlan(string Topic, int Minutes); ~~ Define a typed output shape. / ফলের গঠন।
static class Plans { ~~ Group application-side validation. / অ্যাপের যাচাই।
  public static bool Valid(StudyPlan p) => !string.IsNullOrWhiteSpace(p.Topic) && p.Minutes is >= 5 and <= 120; ~~ Check semantic bounds after parsing. / parse-এর পরে মান যাচাই।
} ~~ A provider schema must be configured separately. / model-এর schema আলাদা সেটআপ।`,
  "JSON schema > Generated object > Typed parse > Semantic validation",
  "Do not blindly execute SQL, URLs, or tool arguments just because a JSON schema accepted them.",
  "Use strict schemas, explicit enums/bounds, refusal handling, and versioned contracts. Validate external references and business rules outside the model.",
);
add(
  "Embeddings",
  "An embedding maps content into a numeric vector so geometric similarity can approximate semantic relatedness. Similarity is not the same as truth or permission.",
  "লেখাকে সংখ্যার অবস্থানে রাখুন, অর্থে কাছাকাছি লেখা কাছের স্থানে পড়তে পারে।",
  `float[] a = { 1, 0 }, b = { 0.8f, 0.6f }; ~~ Use illustrative normalized vectors, not real model embeddings. / উদাহরণের vector।
double dot = a.Zip(b, (x, y) => x * y).Sum(); ~~ Compute a dot product. / জোড়া মানের গুণ যোগ।
Console.WriteLine(dot); ~~ For unit vectors, this equals cosine similarity: 0.8. / unit vector হলে cosine ০.৮।`,
  "Text > Embedding model > Vector > Similarity search",
  "Vectors from different models or dimensions are not interchangeable. This example assumes normalized vectors.",
  "Choose a multilingual model for Bangla+English, version embeddings, and evaluate retrieval relevance on real queries. Protect document-level access.",
);
add(
  "Vector Databases",
  "A vector index retrieves nearby embedding vectors. Metadata filters restrict the candidate documents by tenant, source, or other attributes.",
  "অনেক সংখ্যার অবস্থান থেকে কাছের লেখা খুঁজুন, তবে কার ডেটা তা আগে মানুন।",
  `SELECT id, content ~~ Select authorized document data. / নথির তথ্য নিন।
FROM documents ~~ Read a PostgreSQL table with a pgvector embedding column. / vector-সহ টেবিল।
WHERE tenant_id = @tenant ~~ Enforce tenant filtering. / tenant-এর সীমা।
ORDER BY embedding <=> @query_vector LIMIT 5; ~~ Rank by cosine distance and keep five. / কাছের পাঁচটি।`,
  "Query vector > Tenant filter > Nearest-neighbor index > Candidates",
  "PostgreSQL/pgvector query fragment; not compatible with the SQLite lesson runner. Bind typed parameters through the provider.",
  "Approximate HNSW search trades recall, memory, and latency. Test filtering behavior, index settings, updates, and hybrid lexical+vector retrieval.",
);
add(
  "RAG Pipelines",
  "Retrieval-augmented generation fetches relevant source passages and gives them to a model as reference context for a cited answer. It does not make every answer grounded automatically.",
  "আগে বইয়ের প্রাসঙ্গিক পাতা খুঁজুন, তারপর সেই লেখা থেকে সূত্রসহ উত্তর বানান।",
  `string[] passages = { "C# strings are immutable." }; ~~ Stand-in for authorized retrieved passages. / খুঁজে পাওয়া তথ্য।
string question = "Can I change a string in place?"; ~~ Define the user question. / প্রশ্ন।
string context = string.Join("\n", passages); ~~ Assemble bounded source context. / সীমিত context।
string prompt = $"Use only these sources; say if missing. Sources: {context} Question: {question}"; ~~ Request a grounded answer. / উৎসভিত্তিক উত্তর চান।`,
  "Ingest > Embed and retrieve > Augment prompt > Answer with sources",
  "This illustrates prompt assembly only. Real retrieval must preserve permissions, stable citations, freshness, and a response for insufficient evidence.",
  "Evaluate retrieval separately from generation. Prevent context injection, verify citation support, and use reranking and hybrid search when needed.",
);
add(
  "Chunking Strategies",
  "Split documents into retrievable units while preserving enough local meaning. Chunk size and overlap affect recall, context waste, and citation precision.",
  "বইকে এমন অনুচ্ছেদে ভাগ করুন যাতে ছোট হলেও অর্থ বোঝা যায়।",
  `string text = "Variables\nA variable stores a value.\n\nLoops\nA loop repeats work."; ~~ Use a tiny structured source. / ছোট নথি।
string[] chunks = text.Split("\n\n", StringSplitOptions.RemoveEmptyEntries); ~~ Split at paragraph boundaries. / অনুচ্ছেদে ভাগ।
Console.WriteLine(chunks.Length); ~~ Print two chunks. / দুই অংশ।`,
  "Document > Boundary detection > Bounded chunks > Source metadata",
  "Character counts differ from token counts. Preserve document ID, heading, offsets, and access metadata per chunk.",
  "Compare fixed-token, recursive, heading-based, and semantic splitting using a retrieval evaluation set. Overlap adds storage and duplicate context.",
);
add(
  "Reranking",
  "Retrieve a broad candidate set cheaply, then use a more expensive scorer to reorder a smaller set for relevance to the query.",
  "অনেক বই আগে বাছুন, তারপর ভালো করে দেখে সবচেয়ে প্রাসঙ্গিক কয়েকটি নিন।",
  `var candidates = new[] { (id:1, score:0.4), (id:2, score:0.9), (id:3, score:0.7) }; ~~ Use illustrative reranker scores. / উদাহরণের score।
var top = candidates.OrderByDescending(x => x.score).Take(2); ~~ Keep the strongest two candidates. / সেরা দুটি।
foreach (var x in top) Console.WriteLine(x.id); ~~ Print 2 then 3. / ২ তারপর ৩।`,
  "First-stage retrieval > Candidate pairs > Reranker > Final context",
  "Sorting provided numbers is not a trained reranker. A real model must score query-document pairs.",
  "Measure relevance lift versus latency and cost. Calibrate top-K and avoid truncating evidence needed for multi-part questions.",
);
add(
  "Tool Calling",
  "The model proposes a named function and arguments; application code validates and executes the permitted operation, then returns a structured result.",
  "model কাজের প্রস্তাব দেয়; আসল অনুমতি ও চালানোর নিয়ন্ত্রণ অ্যাপের হাতে।",
  `using System.ComponentModel; ~~ Import descriptions used to document tools. / tool-এর বর্ণনা।
[Description("Add two bounded integers")] ~~ Describe the tool capability. / কাজের বর্ণনা।
static int Add(int a, int b) => checked(a + b); ~~ Keep the operation typed and detect overflow. / typed কাজ ও overflow যাচাই।`,
  "Model proposal > Schema validation > Authorization gate > Tool result",
  "Register the function through a supported provider/AI library. A description does not authorize execution or validate resource access.",
  "Treat tool arguments as untrusted. Use least privilege, idempotency, time/size budgets, audit trails, and scoped user authorization.",
);
add(
  "MCP Protocol",
  "Model Context Protocol standardizes how clients discover and invoke server-provided tools, resources, and prompts. It does not replace authentication or tool safety.",
  "বিভিন্ন tool-এর জন্য একই ধরনের সংযোগের ভাষা MCP।",
  `record ToolRequest(string Name, string ArgumentsJson); ~~ Illustrate a typed application-side request envelope. / অনুরোধের গঠন।
static class ToolPolicy { public static bool Allowed(ToolRequest r) => r.Name == "search_docs"; } ~~ Keep policy outside tool descriptions. / অনুমতি অ্যাপের নিয়মে।`,
  "Client discovery > Tool schema > Authorized call > Structured result",
  "This is a conceptual envelope, not an MCP wire implementation. Use the maintained C# MCP SDK for protocol handling.",
  "Secure transport, OAuth scopes, tool trust, prompt-injection boundaries, and schema/version compatibility matter across MCP connections.",
);
add(
  "ReAct Agent Loop",
  "An agent loop alternates model decisions, tool actions, and observations until it can return an answer or reaches a budget. The application must bound the loop.",
  "সহকারী সিদ্ধান্ত নেয়, tool দিয়ে দেখে, ফল নিয়ে পরের পদক্ষেপ ঠিক করে।",
  `int maxSteps = 5; ~~ Set an explicit work budget. / কাজের সীমা।
for (int step = 0; step < maxSteps; step++) { ~~ Bound the decision/action loop. / সীমিত loop।
  Console.WriteLine($"Step {step}: propose, authorize, act, observe"); ~~ Show externally observable stages only. / দৃশ্যমান ধাপ দেখুন।
} ~~ A real loop stops early on a final answer or failure. / উত্তর পেলে আগেই থামবে।`,
  "Model decision > Policy gate > Tool action > Observation",
  "This is a control-flow illustration, not a functioning model agent. Do not expose hidden chain-of-thought as an execution log; show actions and concise outcomes.",
  "Limit steps, tokens, tool calls, time, and cost. Detect repeated ineffective calls and handle partial failure and cancellation.",
);
add(
  "Planning and Reflection",
  "Break a task into explicit verifiable steps, execute them, then check outcomes against the goal. A model critique is another fallible assessment.",
  "আগে ছোট পরিকল্পনা, তারপর কাজ, শেষে ফল মিলিয়ে দেখুন—নিজের প্রশংসাই প্রমাণ নয়।",
  `string[] plan = { "Read requirements", "Implement", "Run checks" }; ~~ Define observable milestones. / যাচাইযোগ্য ধাপ।
foreach (string step in plan) Console.WriteLine(step); ~~ Track public task progress. / কাজের অগ্রগতি।
bool testsPassed = true; ~~ Stand-in for a real test result. / আসল পরীক্ষার ফলের স্থান।`,
  "Goal > Plan > Execute step > Verify outcome",
  "Do not mark a step complete based only on a model saying it succeeded. Use tool outputs and test evidence.",
  "Replan after new evidence, bound review loops, and distinguish a deterministic validation failure from subjective quality feedback.",
);
add(
  "Agent Memory",
  "Memory stores information beyond a single request: recent conversation, episodic summaries, or long-term retrievable knowledge. Retrieval must respect ownership and freshness.",
  "সহকারীর নোটবুক: সাম্প্রতিক কথা, পুরোনো ঘটনার সারাংশ, দরকারি দীর্ঘমেয়াদি তথ্য।",
  `record MemoryItem(string UserId, string Text, DateTime ExpiresAt); ~~ Include ownership and lifetime. / মালিক ও মেয়াদ।
var item = new MemoryItem("user-1", "Prefers Bangla explanations", DateTime.UtcNow.AddDays(30)); ~~ Store a scoped preference. / নির্দিষ্ট user's পছন্দ।
bool active = item.ExpiresAt > DateTime.UtcNow; ~~ Filter expired memory before use. / মেয়াদ যাচাই।`,
  "Conversation > Scoped memory write > Retrieval filter > Relevant context",
  "Do not store secrets or inferred sensitive preferences casually. Users need deletion and correction controls.",
  "Version summaries, track provenance, enforce tenant isolation, and evaluate stale or contradictory memory behavior.",
);
add(
  "Multi-Agent Systems",
  "Multiple specialized agents can divide work, but communication, coordination, and repeated model calls add cost and failure modes.",
  "লেখক, সম্পাদক ও পরীক্ষক আলাদা ভূমিকা নিতে পারে; বেশি লোক মানেই ভালো ফল নয়।",
  `record WorkResult(string Role, string Output); ~~ Give each worker an explicit result contract. / ফলের চুক্তি।
var result = new WorkResult("reviewer", "Check completed"); ~~ Illustrate one bounded contribution. / একটি সীমিত অবদান।
Console.WriteLine(result.Role); ~~ Track provenance of the result. / ফলের উৎস।`,
  "Coordinator > Bounded specialist > Result contract > Integration check",
  "This is a data-contract example, not a multi-agent runtime. Agent consensus is not factual proof.",
  "Compare against a single-agent baseline, isolate capabilities, cap communication, and use deterministic checks for integration where possible.",
);
add(
  "Agent Orchestration",
  "Orchestration controls sequencing, parallelism, handoffs, durable state, retries, and cancellation around agent work.",
  "কে আগে কাজ করবে, কে অপেক্ষা করবে, ব্যর্থ হলে কী হবে—সমন্বয়কারী তা ঠিক করে।",
  `var preparation = Task.FromResult("requirements loaded"); ~~ Represent an asynchronous dependency. / async নির্ভরতা।
string input = await preparation; ~~ Wait for a prerequisite before continuing. / পূর্বশর্ত শেষ হওয়া অপেক্ষা।
Console.WriteLine(input); ~~ Pass the verified result to the next stage. / পরের ধাপে ফল।`,
  "Dependencies > Schedule step > Persist outcome > Next or retry",
  "Task scheduling alone is not durable orchestration. Process restarts lose ordinary in-memory task state.",
  "Use a durable runtime when work must survive crashes. Make external effects idempotent and define timeout, retry, and compensation semantics.",
);
add(
  "Guardrails",
  "Guardrails are application controls around inputs, tool capabilities, and outputs. They reduce risk but do not guarantee a model will never produce unsafe or incorrect content.",
  "অ্যাপের চারপাশে যাচাইয়ের বেড়া দিন; model-এর কথাকেই নিরাপত্তা ধরে নেবেন না।",
  `bool ValidAmount(decimal amount) => amount is > 0 and <= 1000; ~~ Enforce an amount boundary in application code. / অর্থের সীমা কোডে।
Console.WriteLine(ValidAmount(5000)); ~~ Reject a model-suggested amount outside policy. / সীমার বাইরে নিষিদ্ধ।`,
  "Input checks > Capability policy > Model or tool > Output validation",
  "A keyword blocklist is insufficient for prompt injection or semantic safety. Validate each consequential operation at its actual boundary.",
  "Layer schema checks, identity/permissions, content policies, budget controls, PII handling, and adversarial tests. Log safe metadata for audits.",
);
add(
  "Evals",
  "An evaluation compares application outputs against representative tasks and success criteria. It is a repeatable measurement, not one impressive demo.",
  "পরীক্ষার প্রশ্ন ও নম্বরের নিয়ম বানিয়ে বারবার একইভাবে মাপুন।",
  `var cases = new[] { (answer:"2", expected:"2"), (answer:"3", expected:"4") }; ~~ Define tiny exact-match test cases. / test case।
double accuracy = cases.Count(x => x.answer == x.expected) / (double)cases.Length; ~~ Compute the pass fraction. / পাসের অনুপাত।
Console.WriteLine(accuracy); ~~ Print 0.5. / ৫০ শতাংশ।`,
  "Dataset > Run candidate > Score criteria > Compare baseline",
  "Exact match suits narrow tasks but not all open-ended answers. A model judge has biases and should be calibrated with humans.",
  "Separate retrieval, factual grounding, tool success, safety, cost, and latency metrics. Use held-out cases and track regressions across versions.",
);
add(
  "Observability and Tracing",
  "Trace model calls, retrieval, tool operations, and final outcomes so latency, token costs, errors, and decision boundaries can be diagnosed.",
  "কোন model call বা tool-এ সময় ও খরচ গেল, তার পথচিত্র রাখুন।",
  `using var source = new System.Diagnostics.ActivitySource("Learning.Agent"); ~~ Name the instrumentation source. / trace-এর উৎস।
using var span = source.StartActivity("tool.search"); ~~ Create a span when a listener is configured. / tool-এর span।
span?.SetTag("tool.name", "search_docs"); ~~ Attach safe low-risk context. / নিরাপদ context।`,
  "Agent run > Retrieval span > Model/tool spans > Outcome",
  "An ActivitySource needs a listener/exporter. Avoid logging raw prompts, tokens, or personal data without a deliberate data policy.",
  "Use correlation IDs, model/version metadata, bounded attribute cardinality, sampling, retention, and redaction. Compare costs with task success.",
);
add(
  "Fine-Tuning with LoRA",
  "LoRA adapts a model by training low-rank update matrices while most base weights remain fixed. It changes behavior and style more naturally than supplying fresh factual knowledge.",
  "বড় model-এর সব ওজন না বদলে ছোট অতিরিক্ত matrix শিখিয়ে মানিয়ে নিন।",
  `record TrainingPair(string Prompt, string Answer); ~~ Define a supervised training example. / প্রশিক্ষণের জোড়া।
var example = new TrainingPair("Explain a variable", "A named place for a value."); ~~ Curate a high-quality example. / ভালো উদাহরণ।
Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(example)); ~~ Illustrate JSONL row preparation; provider formats vary. / data row তৈরি।`,
  "Curated dataset > Base model plus adapters > Training > Held-out evaluation",
  "This prepares example data, not a LoRA training implementation. Use an authorized dataset and a compatible training stack.",
  "Compare prompting/RAG first, prevent train-test leakage, evaluate overfitting and forgetting, and version base model, adapters, tokenizer, and dataset.",
);
add(
  "Database Internals",
  "Database engines combine indexes, a buffer cache, a write-ahead log, and concurrency control to make durable reads and writes possible.",
  "টেবিলের পেছনে সূচি, memory-র কপি, পরিবর্তনের log ও একইসাথে কাজের নিয়ম থাকে।",
  `string[] wal = { "BEGIN tx1", "UPDATE row 1", "COMMIT tx1" }; ~~ Model an append-only transaction log. / পরিবর্তনের log-এর মডেল।
foreach (string entry in wal) Console.WriteLine(entry); ~~ Observe log order before discussing recovery. / recovery-র আগে ক্রম দেখুন।`,
  "Query > Buffer and index > WAL before page write > Recovery",
  "This string sequence is not a database engine. Durability depends on correct write ordering, flushing, and recovery logic.",
  "Compare B+ trees and LSM trees, understand MVCC visibility and vacuum/compaction, and inspect actual query plans rather than guessing.",
);
add(
  "Operating Systems",
  "An OS schedules processes/threads, maps virtual memory, isolates permissions, and coordinates device I/O. Application performance depends on these shared resources.",
  "OS হলো ভবনের ম্যানেজার: সময়, স্মৃতি, যন্ত্রপাতি ও অনুমতি ভাগ করে।",
  `using var process = System.Diagnostics.Process.GetCurrentProcess(); ~~ Inspect this application process. / বর্তমান process।
Console.WriteLine(process.Id); ~~ Print its process identifier. / process-এর নম্বর।
Console.WriteLine(process.WorkingSet64); ~~ Observe resident working-set bytes. / memory-তে থাকা byte।`,
  "Process > Scheduled thread > Virtual memory > Device I/O",
  "Working set is not the same as .NET managed heap size. OS counters have platform-specific meanings.",
  "Understand context switches, page faults, file descriptors, epoll/I/O completion, and CPU versus I/O bottlenecks before tuning thread counts.",
);
add(
  "Computer Networks",
  "Network communication moves bytes through layered addressing, transport, and application protocols. TCP is an ordered byte stream, not a message queue.",
  "ঠিকানা, রাস্তা, গাড়ি আর চিঠির ভাষা আলাদা স্তর—network-ও তেমন।",
  `var uri = new Uri("https://example.com:443/api"); ~~ Parse scheme, host, port, and path. / ঠিকানার অংশ আলাদা।
Console.WriteLine($"{uri.Host}:{uri.Port}"); ~~ Identify the transport endpoint. / host ও port।
Console.WriteLine(uri.AbsolutePath); ~~ Identify the application resource path. / resource-এর পথ।`,
  "DNS > Transport connection > TLS > HTTP request",
  "A successful TCP connection does not prove an HTTP application is healthy. Every network call can time out or partially fail.",
  "Compare TCP and UDP, HTTP/1.1 versus multiplexed HTTP/2, and QUIC/HTTP/3. Budget DNS, connection, handshake, and request latency separately.",
);
add(
  "Concurrency & Multithreading",
  "Concurrency manages overlapping work; parallelism executes work at the same instant. async/await supports waiting without occupying a thread for the whole wait.",
  "একসাথে অনেক কাজ সামলানো আর এক মুহূর্তে অনেক CPU-তে কাজ করা আলাদা।",
  `using var client = new HttpClient(); ~~ Demonstrate an HTTP client. / HTTP client।
Task<string> first = client.GetStringAsync("https://example.com"); ~~ Begin I/O without blocking here. / I/O শুরু।
string body = await first; ~~ Resume when the request completes. / ফল এলে আবার চলুন।
Console.WriteLine(body.Length); ~~ Use the result after completion. / ফল ব্যবহার।`,
  "Start I/O > Suspend continuation > Completion signal > Resume",
  "async does not automatically move CPU work to another thread. Avoid blocking on .Result or .Wait in asynchronous request code.",
  "Understand ThreadPool starvation, cancellation, synchronization context, bounded parallelism, allocations, and when ValueTask is justified by measurement.",
);
add(
  "Backend Architecture",
  "Architecture organizes dependency direction and business boundaries so changes can be made and tested without every part knowing every other part.",
  "বাড়ির ঘর আলাদা ও দরজা ঠিক রাখলে এক ঘর বদলাতে পুরো বাড়ি ভাঙতে হয় না।",
  `interface IOrderStore { Task SaveAsync(string order, CancellationToken ct); } ~~ Define a domain-facing persistence contract. / storage-এর চুক্তি।
class PlaceOrder(IOrderStore store) { public Task ExecuteAsync(string order, CancellationToken ct) => store.SaveAsync(order, ct); } ~~ Keep use-case logic behind explicit dependencies. / স্পষ্ট নির্ভরতায় কাজ।`,
  "HTTP adapter > Use case > Domain rule > Storage adapter",
  "A folder named CleanArchitecture does not guarantee clean boundaries. Prevent business rules from depending on framework-specific transport details.",
  "Compare modular monolith, vertical slices, and ports/adapters by team and change patterns. Avoid distributed deployment merely to achieve code modularity.",
);
add(
  "API Design",
  "An API contract includes resource shapes, operation semantics, error models, pagination, compatibility, authentication, and observability—not just endpoint names.",
  "API হলো দুই পক্ষের চুক্তি: কী দেবেন, কী পাবেন, ভুল হলে কী হবে।",
  `record ApiError(string Code, string Message); ~~ Make errors machine-readable and human-readable. / ভুলের code ও বার্তা।
var error = new ApiError("invalid_quantity", "Quantity must be positive"); ~~ Use a stable code independent of display wording. / স্থায়ী error code।
Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(error)); ~~ Serialize the error contract. / error-এর JSON।`,
  "Consumer need > Contract > Validation and errors > Compatibility test",
  "Do not leak stack traces, internal SQL, or credentials in an error response.",
  "Choose REST, GraphQL, or gRPC by access patterns and clients. Define idempotency, deadlines, schema evolution, and consumer contract tests.",
);
add(
  "Database Design & Optimization",
  "Model entities and relationships around invariants, then optimize observed query plans. Normalization reduces duplicate knowledge; denormalization can reduce read work with consistency costs.",
  "প্রথমে সম্পর্ক ও নিয়ম ঠিক করুন, তারপর মেপে ধীর query ঠিক করুন।",
  `CREATE TABLE Customers(Id INTEGER PRIMARY KEY, Name TEXT NOT NULL); ~~ Define a customer entity. / customer-এর টেবিল।
CREATE TABLE Orders(Id INTEGER PRIMARY KEY, CustomerId INTEGER NOT NULL REFERENCES Customers(Id)); ~~ Store a relationship through a foreign key. / foreign key-এর সম্পর্ক।
CREATE INDEX IX_Orders_CustomerId ON Orders(CustomerId); ~~ Support frequent customer-order lookups. / খোঁজার index।`,
  "Invariants > Schema > Query plan > Measured optimization",
  "SQL syntax/provider behavior varies. Enforce foreign keys and uniqueness at the database boundary, not just in application code.",
  "Inspect cardinality estimates, N+1 queries, lock waits, and index selectivity. Denormalize only with a plan for updates and reconciliation.",
);
add(
  "System Design Fundamentals",
  "Begin with functional requirements, scale assumptions, reliability goals, and constraints. Draw the smallest system that satisfies them before adding infrastructure.",
  "আগে সমস্যাটি বুঝুন, কত ব্যবহার হবে হিসাব করুন, তারপর ছোট সঠিক নকশা আঁকুন।",
  `int requestsPerSecond = 100, serviceTimeMs = 50; ~~ State simplified workload assumptions. / কাজের ধারণা।
double concurrency = requestsPerSecond * serviceTimeMs / 1000.0; ~~ Apply Little’s law under a stable-system assumption. / স্থিতিশীল অবস্থার হিসাব।
Console.WriteLine(concurrency); ~~ Estimate five in-flight requests on average. / গড়ে পাঁচটি চলমান।`,
  "Requirements > Capacity estimate > Architecture > Failure analysis",
  "The estimate uses average values and assumes a stable workload. It cannot predict p99 latency or overloaded behavior alone.",
  "Explain trade-offs in consistency, latency, availability, operability, security, and cost. Validate capacity with load tests and production signals.",
);
add(
  "Distributed Systems",
  "A distributed system coordinates independent processes over a network where delays, failures, and partial knowledge are normal.",
  "কয়েকটি দোকান ফোনে মিলে কাজ করলে কেউ সাড়া না দিলে বোঝা কঠিন—ধীর নাকি বন্ধ।",
  `using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(2)); ~~ Bound waiting time. / অপেক্ষার সীমা।
try { await Task.Delay(TimeSpan.FromSeconds(5), timeout.Token); } ~~ Model an operation exceeding its deadline. / সময়ের বাইরে কাজ।
catch (OperationCanceledException) { Console.WriteLine("Deadline reached"); } ~~ Handle uncertainty explicitly. / অনিশ্চয়তা ধরুন।`,
  "Independent nodes > Unreliable network > Deadline > Recovery policy",
  "A timeout does not prove the remote side did nothing. Retrying a payment can duplicate a completed side effect.",
  "Use idempotency, consensus where needed, clocks carefully, bounded retries, and explicit failure/recovery state machines.",
);
add(
  "Docker & Kubernetes",
  "Docker-style images package runtime dependencies; Kubernetes schedules and reconciles containers across cluster capacity. Packaging and orchestration solve different problems.",
  "ইমেজ হলো প্যাকেট; Kubernetes ঠিক করে প্যাকেটের অ্যাপ কোথায় কত কপি চলবে।",
  `docker build -t app:1.0 . ~~ Build an image from a local Dockerfile. / image বানান।
kubectl get deployments -n learning ~~ Inspect desired workload state in a configured cluster. / workload-এর অবস্থা।`,
  "Source > Image > Deployment specification > Reconciled pods",
  "These commands require different configured tools and environments. Building locally does not push the image to a cluster-accessible registry.",
  "Separate artifact identity from runtime configuration, apply resource requests/limits, and plan rollout, health, secrets, and persistent storage.",
);
add(
  "Linux and Bash",
  "A shell launches programs, connects standard streams, expands arguments, and evaluates script control flow. Quoting preserves data boundaries.",
  "Bash হলো কমান্ডের সহকারী; quote না দিলে একটি লেখা অনেক argument হয়ে যেতে পারে।",
  `set -euo pipefail ~~ Fail on many unhandled errors, unset variables, and pipeline failures. / সাধারণ script ব্যর্থতা ধরুন।
project_dir="/tmp/learning demo" ~~ Keep a path with spaces in a variable. / space-সহ path।
printf '%s\n' "$project_dir" ~~ Quote expansion to preserve one argument. / quote দিয়ে এক argument।`,
  "Shell parse > Expansion > Program arguments > Exit status",
  "set -e has context-dependent exceptions. Understand exit codes and quote variables rather than treating strict mode as a complete safety guarantee.",
  "Use ShellCheck, explicit error handling, arrays for argument lists, and temporary directories. Avoid evaluating untrusted text as shell code.",
);
add(
  "Networking Basics",
  "Service reachability requires name resolution, routing, allowed traffic, a listening process, and compatible protocol/TLS settings.",
  "ফোন করতে নাম্বার, লাইন, অনুমতি ও অপর পাশের সাড়া—সবই দরকার।",
  `curl --connect-timeout 3 --max-time 5 -I https://example.com ~~ Inspect HTTP headers with bounded connection and total time. / সময় বেঁধে header দেখুন।`,
  "DNS > Route > TCP and TLS > HTTP response",
  "An HTTP 403 means a server responded; it is different from DNS failure or connection refusal.",
  "Diagnose one layer at a time and preserve exact error codes. Check server bind address, proxy settings, DNS, certificates, and firewall policy.",
);
add(
  "Docker Compose",
  "Compose defines a multi-container application with services, networks, volumes, and environment references in one declarative file.",
  "অ্যাপ, database ও cache এক নকশায় লিখে একসাথে চালান।",
  `services: ~~ Declare a group of services. / service-এর তালিকা।
  api: ~~ Name one application service. / একটি service।
    image: mcr.microsoft.com/dotnet/samples:aspnetapp ~~ Use a public sample image. / sample image।
    ports: ["8080:8080"] ~~ Publish container port 8080 to the host. / port প্রকাশ।`,
  "Compose file > Services > Shared network > Running application",
  "YAML example: save as compose.yaml and run docker compose up. Check the image’s supported platform and port behavior.",
  "Use health checks, named volumes for persistent data, external secret handling, and explicit image versions. Compose is not a multi-host scheduler.",
);
add(
  "Helm",
  "Helm packages Kubernetes manifests as charts with configurable values and a release history. Templates generate ordinary Kubernetes resources.",
  "Kubernetes নকশাকে parameter-সহ প্যাকেট করুন যাতে বারবার ব্যবহার করা যায়।",
  `helm list -n learning ~~ Inspect releases in a namespace. / release দেখুন।
helm template api ./chart --values values.yaml ~~ Render local manifests for review without applying them. / apply না করে নকশা দেখুন।`,
  "Chart > Values > Rendered manifests > Release",
  "A successful template render does not prove Kubernetes API compatibility or runtime readiness. Validate generated manifests.",
  "Version charts and images, review diffs, handle CRDs and migrations explicitly, and avoid storing secrets unencrypted in values files.",
);
add(
  "CI/CD Pipelines",
  "Continuous integration checks each change; continuous delivery prepares a releasable artifact; continuous deployment automatically releases passing changes under a defined policy.",
  "কোড এলেই build ও test; তারপর নিয়ন্ত্রিতভাবে একই artifact প্রকাশ।",
  `dotnet restore ~~ Resolve declared .NET dependencies. / dependency আনুন।
dotnet build --no-restore --configuration Release ~~ Compile with the restored graph. / release build।
dotnet test --no-build --configuration Release ~~ Test the already built assemblies. / তৈরি code পরীক্ষা।`,
  "Commit > Build and tests > Artifact > Deployment",
  "Run from a valid .NET solution. Build once and promote the same artifact instead of rebuilding unpredictably in each environment.",
  "Use protected branches, scoped credentials, reproducible inputs, deployment checks, rollback procedures, and separate untrusted PR jobs from production secrets.",
);
add(
  "GitHub Actions",
  "GitHub Actions runs event-triggered jobs on runners. Workflow permissions and secret exposure need the same care as application security boundaries.",
  "GitHub-এ commit বা pull request এলে স্বয়ংক্রিয় কাজ চালানোর নিয়ম।",
  `name: Build ~~ Name the workflow. / workflow-এর নাম।
on: [push, pull_request] ~~ Trigger on repository changes. / পরিবর্তনে চালু।
jobs: ~~ Define independently scheduled jobs. / কাজের তালিকা।
  verify: ~~ One verification job. / একটি যাচাই।
    runs-on: ubuntu-latest ~~ Select a runner image. / runner বাছুন।
    steps: [{run: 'echo "Configure checkout, restore, build and tests here"'}] ~~ Illustrate YAML structure only. / শুধু গঠন দেখানো।`,
  "Event > Workflow permissions > Runner job > Result",
  "This syntax example is intentionally not a complete build pipeline. Pin real actions to reviewed commit SHAs and checkout before accessing source.",
  "Use minimal permissions, protected environments, concurrency controls, safe artifact handling, and avoid running untrusted PR code with production secrets.",
);
add(
  "Terraform",
  "Terraform plans infrastructure changes from declarative configuration and tracked state, then applies the reviewed operations through providers.",
  "নকশা ও বর্তমান অবস্থার পার্থক্য দেখিয়ে cloud resource বদলায়।",
  `terraform init ~~ Initialize providers and the configured backend. / provider ও backend প্রস্তুতি।
terraform plan -out=tfplan ~~ Save a specific proposed change set for review. / পরিবর্তনের plan রাখুন।
terraform show tfplan ~~ Inspect the saved plan before any apply. / apply-এর আগে দেখুন।`,
  "Configuration > State comparison > Reviewed plan > Apply",
  "Requires a real Terraform configuration. State and saved plans can contain secrets and must not be published as ordinary artifacts.",
  "Use remote state locking, least-privilege providers, version constraints, drift review, and careful handling of replacements and stateful resources.",
);
add(
  "Ansible",
  "Ansible applies tasks to managed hosts, commonly over SSH. Idempotent modules describe desired state so repeated runs converge instead of repeating unsafe commands.",
  "একাধিক server-এ একই সঠিক অবস্থা রাখার স্বয়ংক্রিয় নির্দেশনা।",
  `ansible all -i inventory.ini -m ping ~~ Verify configured host connectivity and Python/module execution. / host-এর সংযোগ যাচাই।
ansible-playbook -i inventory.ini deploy.yml --check --diff ~~ Preview supported changes before applying. / পরিবর্তনের preview।`,
  "Inventory > Connection > Idempotent task > Desired host state",
  "Ansible ping is not an ICMP ping. Check mode is module-dependent and not a perfect deployment simulation.",
  "Use dedicated users, protected inventories, secrets management, roles, handlers, and bounded rolling updates. Avoid generic shell tasks when a safe module exists.",
);
add(
  "Nginx Reverse Proxy",
  "A reverse proxy accepts client connections and forwards requests to an upstream service, often handling TLS, buffering, headers, and load balancing.",
  "দোকানের সামনের কাউন্টার অনুরোধ নিয়ে ভেতরের সঠিক কর্মীর কাছে পাঠায়।",
  `server { ~~ Define one virtual server. / একটি virtual server।
  listen 8080; ~~ Accept local demo HTTP traffic. / demo port।
  location / { proxy_pass http://127.0.0.1:5000; } ~~ Forward to an application on the same host. / local অ্যাপে পাঠান।
} ~~ A real deployment also needs TLS and trusted proxy header configuration. / বাস্তবে TLS দরকার।`,
  "Client > Proxy listener > Upstream app > Forwarded response",
  "This local HTTP sample is not an internet-ready secure configuration. Configure TLS, host validation, body limits, and forwarded headers appropriately.",
  "Plan timeouts, buffering, websocket upgrades, graceful reloads, upstream health, and how the application trusts proxy-generated client information.",
);
add(
  "Prometheus",
  "Prometheus scrapes numerical time series from metric endpoints and evaluates queries/rules. Labels identify series and must have bounded cardinality.",
  "নির্দিষ্ট বিরতিতে meter পড়ে সময় অনুযায়ী সংরক্ষণ করে।",
  `using var meter = new System.Diagnostics.Metrics.Meter("Learning.Api"); ~~ Define a metrics source. / metric-এর উৎস।
var requests = meter.CreateCounter<long>("requests_total"); ~~ Create a monotonically increasing counter. / বাড়তে থাকা counter।
requests.Add(1, new KeyValuePair<string, object?>("route", "/products")); ~~ Record a bounded route label. / সীমিত label-সহ মান।`,
  "Instrument > Expose metrics > Scrape > Query and alert",
  "An OpenTelemetry/Prometheus exporter is required to expose these measurements. Do not put user IDs or arbitrary URLs in metric labels.",
  "Distinguish counters, gauges, and histograms. Use latency distributions and rates rather than averaging averages.",
);
add(
  "Grafana",
  "Grafana visualizes signals from configured data sources. A useful dashboard explains user symptoms, system saturation, and likely causes.",
  "বিভিন্ন meter-এর তথ্য এক ড্যাশবোর্ডে সাজিয়ে বোঝার ব্যবস্থা।",
  `rate(http_requests_total[5m]) ~~ PromQL example: estimate per-second request rate over five minutes. / পাঁচ মিনিটের request rate।`,
  "Data source > Query > Panel > Dashboard and alert",
  "This PromQL expression requires a matching metric name in Prometheus. A dashboard cannot create telemetry that was never collected.",
  "Use consistent units, useful percentile panels, deployment annotations, sensible time ranges, and actionable alert links rather than decorative charts.",
);
add(
  "ELK Logging",
  "Elasticsearch indexes logs, Logstash or another collector processes them, and Kibana queries and visualizes them. Structured events make search reliable.",
  "লগ সংগ্রহ, সাজানো, খোঁজা ও দেখা—একটি পূর্ণ প্রবাহ।",
  `var log = new { Timestamp = DateTime.UtcNow, Level = "Information", Event = "OrderCreated", OrderId = 42 }; ~~ Build a structured event. / field-সহ event।
Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(log)); ~~ Emit one JSON log record for a collector. / collector-এর জন্য JSON।`,
  "Application log > Collector > Search index > Investigation",
  "Printing JSON does not configure ELK. Protect log data, define retention, and avoid credentials or sensitive payloads.",
  "Budget ingestion/index storage, choose mappings carefully, correlate trace IDs, and handle collector backpressure without taking down the app.",
);
add(
  "Blue Green Deploys",
  "Keep two complete environments. Validate the inactive environment, then switch traffic while retaining a rollback path to the previous version.",
  "নতুন দোকান প্রস্তুত ও পরীক্ষা করে একবারে ক্রেতার রাস্তা ঘুরিয়ে দিন।",
  `string active = "blue", candidate = "green"; ~~ Name the current and next environments. / দুই পরিবেশ।
bool candidateHealthy = true; ~~ Stand-in for real health and acceptance checks. / আসল যাচাইয়ের ফল।
if (candidateHealthy) active = candidate; ~~ Model a controlled traffic switch. / traffic বদলের মডেল।`,
  "Blue serving > Deploy green > Verify green > Switch traffic",
  "This is a state model, not a traffic controller. Database changes must remain compatible with both versions during overlap and rollback.",
  "Plan expand-contract migrations, session continuity, cache compatibility, capacity for two stacks, and a measured post-switch rollback decision.",
);
add(
  "All Data Structures",
  "Choose a structure by the operations you need: arrays for indexed access, dictionaries for keyed lookup, queues for arrival order, heaps for priority, and graphs for relationships.",
  "কোন কাজ বেশি করবেন তা দেখে বাক্স বাছুন: index, key, লাইন, priority বা সম্পর্ক।",
  `var byId = new Dictionary<int, string> { [1] = "Tea" }; ~~ Optimize lookup by identifier. / id দিয়ে দ্রুত খোঁজা।
var arrival = new Queue<int>(); arrival.Enqueue(1); ~~ Preserve first-in-first-out work order. / আগমনের ক্রম।
Console.WriteLine(byId[arrival.Dequeue()]); ~~ Combine structures for distinct responsibilities. / আলাদা কাজে আলাদা গঠন।`,
  "Required operation > Candidate structure > Complexity > Memory trade-off",
  "A data structure is not universally best. Measure workload size and frequency before optimizing.",
  "Big-O describes growth, not constant factors or cache locality. Compare allocation, mutation, ordering, and concurrency requirements.",
);
add(
  "Advanced Algorithms",
  "Advanced problem solving combines correctness proofs, complexity analysis, and patterns such as dynamic programming, greedy choice, graph algorithms, and divide-and-conquer.",
  "জটিল সমস্যা ছোট অংশে ভেঙে নিয়ম, সঠিকতার যুক্তি ও খরচের হিসাব করুন।",
  `int[] values = { 7, 2, 5, 1 }; ~~ Unordered input. / এলোমেলো মান।
Array.Sort(values); ~~ Use a maintained comparison sort for this task. / পরীক্ষিত sort।
int index = Array.BinarySearch(values, 5); ~~ Search only after satisfying sortedness. / সাজানোর পরে খুঁজুন।`,
  "Problem invariant > Algorithm choice > Correctness > Complexity",
  "Do not apply a pattern solely because a problem contains familiar keywords. Check constraints and counterexamples.",
  "Compare asymptotic time/space, preprocessing, amortized costs, and approximation guarantees when exact solutions are too expensive.",
);
add(
  "Docker",
  "A container image packages an application and runtime filesystem. A running container adds an isolated process and writable layer, sharing the host kernel.",
  "ইমেজে অ্যাপের প্যাকেট; কন্টেইনার সেই প্যাকেট থেকে চলমান process, পুরো VM নয়।",
  `FROM mcr.microsoft.com/dotnet/aspnet:9.0 ~~ Choose a .NET runtime image. / runtime image।
WORKDIR /app ~~ Set the application directory. / কাজের ফোল্ডার।
COPY publish/ ./ ~~ Copy already published application files. / publish করা ফাইল।
ENTRYPOINT ["dotnet", "App.dll"] ~~ Start the actual application assembly. / অ্যাপ চালান।`,
  "Published app > Image layers > Container process > Host kernel",
  "Dockerfile sample requires a real publish/ directory and App.dll. Use a multi-stage build, a non-root user, and version/digest pinning for production.",
  "Containers are process isolation, not a guarantee that untrusted code is safe. Manage capabilities, filesystem permissions, resource limits, and image supply chain.",
);
add(
  "Kubernetes",
  "Kubernetes continuously reconciles declared workload state with actual cluster state through controllers. A Deployment manages ReplicaSets and pods.",
  "আপনি লিখে দেন কত কপি চাই; Kubernetes বাস্তব অবস্থাকে তার সাথে মিলিয়ে রাখে।",
  `apiVersion: apps/v1 ~~ Use the stable Deployment API. / Deployment API।
kind: Deployment ~~ Declare a Deployment resource. / resource-এর ধরন।
metadata: {name: api} ~~ Give it a resource name. / নাম।
spec: ~~ Desired workload state. / কাঙ্ক্ষিত অবস্থা।
  replicas: 2 ~~ Request two pod replicas. / দুই কপি।
  selector: {matchLabels: {app: api}} ~~ Identify owned pods. / label দিয়ে বাছাই।
  template: {metadata: {labels: {app: api}}, spec: {containers: [{name: api, image: 'your-registry/app:1.0'}]}} ~~ Define the pod image and matching label. / image ও label।`,
  "Desired spec > Controller > Pods on nodes > Reconciliation",
  "Image reference is illustrative. Add ports, probes, resources, security context, and accessible registry credentials before real deployment.",
  "Separate readiness from liveness, design graceful shutdown, use requests/limits, and plan pod disruption budgets and failure domains.",
);
add(
  "AWS Cloud",
  "AWS offers compute, networking, storage, database, and managed application services. Shared responsibility divides provider infrastructure duties from your application and configuration duties.",
  "ভাড়ার cloud সুবিধা নিলেও ডেটা, অনুমতি ও অ্যাপের নিরাপত্তা আপনার দায়িত্ব থাকে।",
  `aws sts get-caller-identity ~~ Confirm account and identity before other operations. / account যাচাই।
aws configure get region ~~ Inspect the selected default region without printing secrets. / region দেখুন।`,
  "Account and IAM > Region and network > Managed service > Application responsibility",
  "Use a dedicated learning account, least-privilege roles, budget alerts, and cleanup plans. Free-tier terms do not make all resources free.",
  "Choose managed services by workload, resilience, operational effort, data location, and cost. Understand availability zones versus regions.",
);
add(
  "Git and GitHub",
  "Git is the local version-control system; GitHub hosts repositories and adds pull requests, review, issues, and automation around collaboration.",
  "Git নিজের খাতার ইতিহাস রাখে; GitHub দলের অনলাইন খাতা ও review-এর জায়গা।",
  `git switch -c feature/greeting ~~ Isolate a change on a branch. / আলাদা branch।
git add Program.cs ~~ Stage the intended file. / ফাইল প্রস্তুত।
git commit -m "Add greeting" ~~ Record a local snapshot. / local commit।
git push -u origin feature/greeting ~~ Publish the branch for a pull request. / review-এর জন্য পাঠান।`,
  "Local branch > Commit > Remote push > Pull request review",
  "Push does not necessarily merge or deploy. A pull request is a hosting workflow, not a core Git object.",
  "Use protected branches, required checks, small reviews, secret scanning, and a history policy suited to the team.",
);
add(
  "Design Patterns",
  "Patterns name recurring design solutions and their trade-offs. Choose a pattern after identifying a real problem, not as a target architecture by itself.",
  "বারবার দেখা সমস্যার চেনা সমাধান হলো pattern; দরকার না হলে চাপিয়ে দেবেন না।",
  `Func<decimal, decimal> discount = price => price * 0.9m; ~~ Represent a small interchangeable policy without extra classes. / ছোট strategy function।
Console.WriteLine(discount(100m)); ~~ Apply the policy to get 90. / ফল ৯০।`,
  "Design pressure > Candidate pattern > Simpler alternative > Trade-off",
  "A named pattern can be implemented with a function or composition; it need not create a large class hierarchy.",
  "Consider Strategy for algorithm variation, Factory for creation, Observer for notifications, and Decorator for wrapping. Assess coupling and testability.",
);
const aliases = {
  "High-Level Design": "System Design Fundamentals",
  "Low-Level Design Basics": "OOP Pillars",
  "Caching Strategies": "Caching",
  "Message Queues & Event-Driven Architecture": "Event-Driven Architecture",
  "Microservices Architecture": "Microservices",
  "Security & Authentication": "Authentication with JWT",
  "Cloud Computing": "AWS Cloud",
  "DevOps & CI/CD": "CI/CD Pipelines",
  "Load Balancer": "Load Balancing",
  Sharding: "Database Sharding",
  "Rate Limiter": "Rate Limiter Design",
  "Message Queue": "Message Queues",
  "Pub / Sub": "Kafka and Pub / Sub",
  Indexing: "Database Indexing",
  SOLID: "SOLID Principles",
  "Secrets Manager": "Secrets Management",
  "Load Balancers": "Load Balancing",
};
for (const [alias, target] of Object.entries(aliases))
  concepts[alias] = { ...concepts[target], related: target };
