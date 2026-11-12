const data = {};
function add(key, en, bn, a, b, decisionEn, decisionBn) {
  data[key] = {
    en,
    bn,
    decisionEn,
    decisionBn,
    examples: [
      {
        title: "Complete worked example · পূর্ণ কাজের উদাহরণ",
        language: "csharp",
        code: a,
        kind: "Console example",
      },
      {
        title: "Alternative technique and edge cases · অন্য পদ্ধতি ও সীমা",
        language: "csharp",
        code: b,
        kind: "Console example",
      },
    ],
  };
}
add(
  "Arrays and Strings",
  "Arrays allocate a contiguous sequence of slots and store their length. An element access computes an offset after bounds checking. Copying an array variable copies a reference, while cloning the array creates new slots; nested reference elements are still shared. Strings are immutable, and repeated concatenation can allocate many intermediate strings. StringBuilder helps when a loop builds a large result.",
  "Array variable কপি করলে একই array-এর reference আসে, নতুন ঘর নয়। Clone-এ নতুন ঘর হলেও ভিতরের object ভাগ হতে পারে। String বদলানো যায় না; loop-এ বারবার + দিলে অনেক নতুন string হয়। অনেক লেখা জুড়তে StringBuilder সুবিধা দেয়।",
  `int[] original = { 10, 20, 30 };
int[] alias = original;
int[] copy = (int[])original.Clone();
alias[0] = 99;
Console.WriteLine(original[0]); // 99: একই array
Console.WriteLine(copy[0]);     // 10: আলাদা ঘর
for (int i = 0; i < original.Length; i++) {
    Console.WriteLine($"index={i}, value={original[i]}");
}
Console.WriteLine(Array.IndexOf(original, 20));`,
  `using System.Text;
var text = new StringBuilder();
for (int i = 1; i <= 5; i++) {
    if (i > 1) text.Append(", ");
    text.Append(i);
}
string result = text.ToString();
ReadOnlySpan<char> prefix = result.AsSpan(0, 4);
Console.WriteLine(result);
Console.WriteLine(prefix.ToString());`,
  "A Span is a view with lifetime restrictions, not an independently owned array. Use strings or arrays when data must outlive the scope that provides its storage.",
  "Span নিজের storage নয়, নির্দিষ্ট lifetime-এর view। Data পরে রাখতে হলে মালিকানাসহ array বা string দরকার।",
);
add(
  "Hashing",
  "Hashing separates fast candidate placement from final equality checking. Collisions are expected and must not be treated as equality. A frequency map converts repeated scans into one pass. Custom key comparison controls whether values such as Tea and tea represent the same key. Size growth and adversarial collisions affect latency even when average complexity is constant.",
  "Hash শুধু কোন ঘরে দেখবেন জানায়, equality আসল মিল যাচাই করে। Collision স্বাভাবিক। Frequency map একবার ঘুরেই গুনতে পারে। Tea আর tea একই কি না comparer ঠিক করে; resize ও খারাপ hash-এ সময় বাড়ে।",
  `string[] words = { "tea", "milk", "Tea", "tea" };
var counts = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
foreach (string word in words) {
    counts.TryGetValue(word, out int previous);
    counts[word] = previous + 1;
}
foreach (var pair in counts.OrderBy(x => x.Key))
    Console.WriteLine($"{pair.Key}: {pair.Value}");
Console.WriteLine(counts.ContainsKey("TEA"));`,
  `int[] values = { 3, 1, 3, 2, 1, 5 };
var seen = new HashSet<int>();
var unique = new List<int>();
foreach (int value in values) {
    if (seen.Add(value)) unique.Add(value);
}
Console.WriteLine(string.Join(",", unique));
Console.WriteLine($"Unique={seen.Count}, input={values.Length}");`,
  "Choose a comparer consistently across insertion, lookup, and deduplication. Mutable keys can become unreachable if their equality/hash fields change after insertion.",
  "Insert ও lookup-এ একই comparer নিন। Key-এর hash নির্ধারক field বদলালে dictionary-তে রেখেও খুঁজে নাও পেতে পারেন।",
);
add(
  "Two Pointers",
  "The two-pointer technique is a family of invariants. Opposite pointers on sorted input eliminate impossible pairs; read/write pointers compact data in place; fast/slow pointers compare positions at different speeds. Before moving a pointer, state exactly which candidate set becomes impossible and why no answer is skipped.",
  "Two pointers-এর ধরন অনেক: দুই প্রান্ত থেকে pair, read/write দিয়ে compact, fast/slow দিয়ে cycle। Pointer সরালে কোন সম্ভাবনা বাদ যায় ও সঠিক উত্তর কেন বাদ যায় না, সেই যুক্তি আগে বলুন।",
  `int[] values = { 1, 2, 4, 7, 11 };
int target = 9, left = 0, right = values.Length - 1;
bool found = false;
while (left < right) {
    long sum = (long)values[left] + values[right];
    if (sum == target) {
        Console.WriteLine($"Pair: {values[left]}, {values[right]}");
        found = true; break;
    }
    if (sum < target) left++; else right--;
}
if (!found) Console.WriteLine("No pair");`,
  `int[] values = { 1, 1, 2, 2, 3, 4, 4 };
int write = 0;
foreach (int value in values) {
    if (write == 0 || values[write - 1] != value)
        values[write++] = value;
}
Console.WriteLine(string.Join(",", values.Take(write)));
Console.WriteLine($"Logical length: {write}");
// Only the first write elements form the deduplicated result.`,
  "In-place compaction changes logical length, not allocated array length. Sortedness is required for adjacent duplicate elimination, but not for every two-pointer algorithm.",
  "Compaction-এ array ছোট হয় না, প্রথম logical length অংশটি ফল। পাশাপাশি duplicate বাদ দিতে sorting দরকার, সব two-pointer-এ নয়।",
);
add(
  "Sliding Window",
  "A fixed-size window can maintain a running aggregate by removing outgoing contributions. A variable window needs a condition whose validity changes predictably as boundaries move. For minimum length with positive sums, expansion increases the sum and contraction decreases it. Negative values break that monotonic relationship and may require prefix-sum techniques instead.",
  "Fixed window-এ পুরোনোটি বাদ ও নতুনটি যোগে হিসাব থাকে। Variable window-তে সীমা সরালে শর্তের প্রভাব অনুমেয় হতে হয়। Positive sum-এ বড় করলে যোগ বাড়ে; negative থাকলে এই নিয়ম ভাঙে।",
  `int[] a = { 2, 1, 5, 1, 3, 2 };
int k = 3;
if (k <= 0 || k > a.Length) throw new ArgumentOutOfRangeException(nameof(k));
long sum = 0, best = long.MinValue;
int bestStart = -1;
for (int right = 0; right < a.Length; right++) {
    sum += a[right];
    if (right >= k) sum -= a[right - k];
    if (right >= k - 1 && sum > best) {
        best = sum; bestStart = right - k + 1;
    }
}
Console.WriteLine($"Best={best} at {bestStart}");`,
  `int[] a = { 2, 3, 1, 2, 4, 3 }; // positive input only
int target = 7, left = 0, best = int.MaxValue;
long sum = 0;
for (int right = 0; right < a.Length; right++) {
    sum += a[right];
    while (sum >= target) {
        best = Math.Min(best, right - left + 1);
        sum -= a[left++];
    }
}
Console.WriteLine(best == int.MaxValue ? 0 : best);`,
  "Write down the input sign constraint and whether a window must be nonempty. Each boundary moves forward at most n times, giving linear total movement.",
  "Input positive কি না ও খালি window চলবে কি না লিখুন। প্রতিটি প্রান্ত সর্বোচ্চ n বার এগোয়, তাই মোট linear।",
);
add(
  "Prefix Sum",
  "A prefix table stores cumulative aggregates at boundaries between elements. With prefix[0]=0, the sum of [left,right) is prefix[right]-prefix[left]. This half-open convention matches slicing and avoids off-by-one special cases. A prefix-frequency dictionary can count target-sum subarrays even when values are negative.",
  "Prefix table element-এর আগের boundary-তে মোট রাখে। [left,right)-এর যোগ prefix[right]-prefix[left]। শুরুর শূন্যে special case কমে। Prefix-এর frequency map দিয়ে negative থাকলেও target sum গোনা যায়।",
  `int[] a = { 3, -2, 5, 1 };
long[] prefix = new long[a.Length + 1];
for (int i = 0; i < a.Length; i++)
    prefix[i + 1] = prefix[i] + a[i];
long Sum(int left, int right) {
    if (left < 0 || right < left || right > a.Length)
        throw new ArgumentOutOfRangeException();
    return prefix[right] - prefix[left];
}
Console.WriteLine(Sum(1, 4)); // -2+5+1 = 4
Console.WriteLine(Sum(0, 0)); // empty range = 0`,
  `int[] a = { 1, -1, 1, 1, -1 };
int target = 1;
long prefix = 0, answer = 0;
var frequency = new Dictionary<long, long> { [0] = 1 };
foreach (int value in a) {
    prefix += value;
    frequency.TryGetValue(prefix - target, out long matches);
    answer += matches;
    frequency.TryGetValue(prefix, out long old);
    frequency[prefix] = old + 1;
}
Console.WriteLine(answer);`,
  "The initial frequency of zero represents the empty prefix, allowing subarrays that begin at index zero. Query before recording the current prefix to avoid counting the wrong empty interval.",
  "শূন্য prefix-এর frequency ১ দিলে index ০ থেকে শুরু subarray ধরা পড়ে। বর্তমান prefix জমার আগে matching prefix গুনুন।",
);
add(
  "Binary Search",
  "Binary search maintains a shrinking interval in which an answer may exist. Lower-bound search finds the first position whose value is at least a target, even if that target is absent. This boundary formulation handles duplicates cleanly and can be reused to count occurrences. Every iteration must discard at least one possible position.",
  "Binary search ছোট হতে থাকা সম্ভাবনার সীমা রাখে। Lower bound প্রথম >= target অবস্থান দেয়, target না থাকলেও। Duplicate-এর ক্ষেত্রে এ থেকে count বা insertion point বের করা যায়। প্রতিবার সীমা ছোট হওয়া চাই।",
  `int LowerBound(int[] a, int target) {
    int lo = 0, hi = a.Length; // [lo, hi)
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
int[] a = { 1, 3, 3, 3, 7 };
Console.WriteLine(LowerBound(a, 3)); // 1
Console.WriteLine(LowerBound(a, 4)); // 4
Console.WriteLine(LowerBound(a, 9)); // 5, past the end`,
  `int UpperBound(int[] a, int target) {
    int lo = 0, hi = a.Length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] <= target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
int[] a = { 1, 3, 3, 3, 7 };
Console.WriteLine(UpperBound(a, 3)); // 4
Console.WriteLine(Array.BinarySearch(a, 3)); // a match, not guaranteed first`,
  "Never mix inclusive and half-open boundary updates. Binary search on an answer space also requires a monotonic true/false predicate; sorted arrays are one instance of that requirement.",
  "Inclusive ও half-open-এর formula মেশাবেন না। Answer-space search-এও monotonic true/false শর্ত দরকার।",
);
add(
  "Stack and Queue",
  "Stacks model nested work and undo order. Queues model arrival order and breadth-first processing. Both have empty states that need explicit handling. A bounded asynchronous channel extends the queue idea with backpressure and completion, while ordinary collections do not coordinate concurrent producers and consumers.",
  "Stack nested কাজ বা undo, queue আগমনের ক্রম। খালি হলে কী হবে ঠিক করুন। Channel-এ async অপেক্ষা ও সীমা থাকে; সাধারণ Queue একাধিক producer-consumer নিজে সামলায় না।",
  `bool Balanced(string text) {
    var stack = new Stack<char>();
    foreach (char c in text) {
        if (c == '(') stack.Push(c);
        else if (c == ')') {
            if (!stack.TryPop(out _)) return false;
        }
    }
    return stack.Count == 0;
}
Console.WriteLine(Balanced("(())"));
Console.WriteLine(Balanced("(()"));`,
  `var waiting = new Queue<string>();
waiting.Enqueue("Ayesha");
waiting.Enqueue("Rahim");
while (waiting.TryDequeue(out string? person)) {
    Console.WriteLine($"Serving {person}");
}
bool hasMore = waiting.TryPeek(out _);
Console.WriteLine($"More work: {hasMore}");
// For concurrent async work, consider bounded Channel<T> instead.`,
  "The bracket example intentionally handles only parentheses. A full parser needs tokenization, matching delimiter types, and rules for quoted text.",
  "উদাহরণটি শুধু ( ) দেখে। পূর্ণ parser-এ অন্য bracket, quote ও token-এর নিয়ম দরকার।",
);
add(
  "Linked List",
  "A list node holds a value and links, so insertion can relink neighbors without shifting a whole array. This advantage applies when the node is already known; searching for it still takes time. Pointer-based structures allocate more objects and reduce locality. Fast/slow traversal can locate the middle or detect a cycle using constant extra space.",
  "চেনা node থাকলে প্রতিবেশীর link বদলেই insertion হয়, array সরাতে হয় না। কিন্তু node খুঁজতে সময় লাগে। আলাদা object-এ allocation ও cache locality খরচ আছে। Fast/slow দিয়ে কম memory-তে মাঝ বা cycle ধরা যায়।",
  `var list = new LinkedList<string>();
var first = list.AddLast("A");
var last = list.AddLast("C");
list.AddAfter(first, "B");
foreach (string value in list) Console.WriteLine(value);
list.Remove(last);
Console.WriteLine($"First={list.First?.Value}, Last={list.Last?.Value}");
Console.WriteLine($"Count={list.Count}");`,
  `var head = new Node(1, new Node(2, new Node(3, new Node(4))));
Node? slow = head, fast = head;
while (fast is not null && fast.Next is not null) {
    slow = slow!.Next;
    fast = fast.Next.Next;
}
Console.WriteLine($"Middle: {slow?.Value}");
record Node(int Value, Node? Next = null);`,
  "When length is even, define whether the first or second middle is wanted. Avoid modifying a LinkedList through unrelated code while enumerating it.",
  "জোড় দৈর্ঘ্যে প্রথম না দ্বিতীয় middle চাই, আগে ঠিক করুন। Enumerate-এর সময় অন্য code থেকে list বদলাবেন না।",
);
add(
  "Monotonic Stack",
  "The stack stores unresolved candidates in an order that makes future elimination safe. For next-greater queries, a new larger value resolves all smaller stack-top values. For span queries, eliminating dominated candidates lets one index jump over many positions. Each candidate enters and leaves once, explaining the amortized linear bound.",
  "Stack-এ অমীমাংসিত প্রার্থী ক্রমে থাকে। নতুন বড় মান top-এর ছোটগুলোর পরের বড় মান হয়ে যায়। একটি index একবার ঢোকে ও একবার বের হয়, তাই nested loop থাকলেও মোট O(n)।",
  `int[] a = { 2, 1, 5, 3, 4 };
int[] next = Enumerable.Repeat(-1, a.Length).ToArray();
var stack = new Stack<int>();
for (int i = 0; i < a.Length; i++) {
    while (stack.Count > 0 && a[stack.Peek()] < a[i])
        next[stack.Pop()] = i;
    stack.Push(i);
}
for (int i = 0; i < a.Length; i++)
    Console.WriteLine($"{a[i]} -> {(next[i] < 0 ? "none" : a[next[i]].ToString())}");`,
  `int[] prices = { 100, 80, 60, 70, 60, 75, 85 };
var stack = new Stack<int>();
int[] span = new int[prices.Length];
for (int i = 0; i < prices.Length; i++) {
    while (stack.Count > 0 && prices[stack.Peek()] <= prices[i]) stack.Pop();
    span[i] = stack.Count == 0 ? i + 1 : i - stack.Peek();
    stack.Push(i);
}
Console.WriteLine(string.Join(",", span));`,
  "Strictly greater and greater-or-equal require different comparisons. Test equal adjacent values to verify that the stack invariant matches the requested result.",
  "Strict বড় আর বড়-সমান ভিন্ন comparison। পাশাপাশি সমান মান দিয়ে test করুন।",
);
add(
  "Recursion",
  "A recursive call stores local state until its child returns. Correctness needs a base case and a decreasing measure. The recurrence determines runtime; two calls per level may create exponential work without memoization. C# does not promise that all tail-recursive source becomes constant-stack machine code. Use an explicit stack when depth is unbounded.",
  "Recursive call ছোট call-এর ফলের অপেক্ষায় state রাখে। Base case ও কমতে থাকা মাপ চাই। দুই branch-এ পুনরাবৃত্তি অনেক কাজ বাড়াতে পারে। Tail recursion সবসময় constant stack হবে ধরে নেবেন না।",
  `long Factorial(int n) {
    if (n < 0 || n > 20) throw new ArgumentOutOfRangeException(nameof(n));
    if (n <= 1) return 1;
    return checked(n * Factorial(n - 1));
}
foreach (int n in new[] { 0, 1, 5, 20 })
    Console.WriteLine($"{n}! = {Factorial(n)}");
// long is deliberately bounded; 21! cannot fit.`,
  `long FactorialIterative(int n) {
    if (n < 0 || n > 20) throw new ArgumentOutOfRangeException(nameof(n));
    long result = 1;
    for (int i = 2; i <= n; i++) result = checked(result * i);
    return result;
}
Console.WriteLine(FactorialIterative(5));
Console.WriteLine(FactorialIterative(0));`,
  "An iterative version can remove stack growth without changing numeric overflow limits. Keep domain bounds and failure behavior identical when replacing an algorithm.",
  "Loop-এ stack কমে, সংখ্যার overflow সীমা যায় না। বিকল্পেও input boundary ও error-এর চুক্তি রাখুন।",
);
add(
  "Backtracking",
  "A backtracking search explores a decision tree. It maintains a partial solution, rejects impossible prefixes, and restores state before exploring siblings. Saving a reference to a mutable candidate is different from saving a copy. The number of valid outputs can itself be exponential, so no implementation can list them all in sub-output time.",
  "Backtracking সিদ্ধান্তের tree ঘুরে। অসম্ভব prefix বাদ, অন্য শাখার আগে state ফেরত। Mutable list-এর reference জমালে পরে সব উত্তর বদলে যেতে পারে, copy রাখুন। Output-ই exponential হলে পুরো তালিকা দ্রুত বানানো অসম্ভব।",
  `var answers = new List<int[]>();
void Search(int[] values, int index, List<int> chosen) {
    if (index == values.Length) { answers.Add(chosen.ToArray()); return; }
    Search(values, index + 1, chosen);
    chosen.Add(values[index]);
    Search(values, index + 1, chosen);
    chosen.RemoveAt(chosen.Count - 1);
}
Search(new[] { 1, 2, 3 }, 0, new List<int>());
foreach (var subset in answers) Console.WriteLine($"[{string.Join(",", subset)}]");
Console.WriteLine($"Count: {answers.Count}");`,
  `void Parentheses(int pairs, int open, int closed, string current) {
    if (current.Length == pairs * 2) { Console.WriteLine(current); return; }
    if (open < pairs) Parentheses(pairs, open + 1, closed, current + "(");
    if (closed < open) Parentheses(pairs, open, closed + 1, current + ")");
}
Parentheses(3, 0, 0, "");
// closed < open prunes an invalid prefix immediately.
// Immutable strings avoid explicit undo here, at an allocation cost.`,
  "Pruning must prove that a partial candidate cannot lead to a valid answer. A heuristic that merely seems unlikely can silently remove correct solutions.",
  "Prune-এর আগে প্রমাণ চাই এই prefix থেকে valid উত্তর হবে না। আন্দাজে বাদ দিলে ঠিক উত্তর হারায়।",
);
add(
  "Trees and BST",
  "Traversal order changes what a tree algorithm observes. Inorder traversal of a valid BST yields sorted keys; preorder and postorder serve different construction and cleanup tasks. Search cost depends on height, not merely node count. Bounds validation catches invalid descendants that a parent-only comparison misses.",
  "Traversal-এর ক্রমে কাজ বদলায়। BST-র inorder সাজানো key দেয়। শুধু parent-এর সাথে child মেলালেই সব ভুল ধরা পড়ে না; descendant-এর পুরো অনুমোদিত range মানতে হয়। সময় height-এর উপর নির্ভর করে।",
  `var root = new Node(4, new Node(2, new Node(1), new Node(3)), new Node(7));
void Inorder(Node? node) {
    if (node is null) return;
    Inorder(node.Left);
    Console.WriteLine(node.Key);
    Inorder(node.Right);
}
Inorder(root);
record Node(int Key, Node? Left = null, Node? Right = null);`,
  `bool Valid(Node? node, long low, long high) {
    if (node is null) return true;
    if (node.Key <= low || node.Key >= high) return false;
    return Valid(node.Left, low, node.Key) && Valid(node.Right, node.Key, high);
}
var bad = new Node(10, new Node(5, null, new Node(12)), new Node(15));
Console.WriteLine(Valid(bad, long.MinValue, long.MaxValue)); // False
record Node(int Key, Node? Left = null, Node? Right = null);`,
  "The validation example chooses no duplicate keys. If duplicates are allowed, define which side may contain them and change range inclusivity consistently.",
  "এখানে duplicate নিষিদ্ধ। Duplicate চাইলে কোন পাশে সমান key থাকবে ও boundary কী হবে, এক নিয়মে ঠিক করুন।",
);
add(
  "Heap / Priority Queue",
  "A min-heap keeps only the heap invariant, not full sorted order. The root is the minimum priority while arbitrary descendants are not globally ordered. Keeping a min-heap of size k lets you retain the k largest stream values. Priority ties need an explicit sequence when stable processing order matters.",
  "Heap পুরো সাজানো তালিকা নয়, শুধু root সবচেয়ে ছোট priority। Size k-এর min-heap-এ stream-এর বড় kটি রাখা যায়। সমান priority-তে স্থায়ী ক্রম চাইলে sequence যোগ করুন।",
  `int[] stream = { 8, 1, 9, 3, 7, 10 };
int k = 3;
var top = new PriorityQueue<int, int>();
foreach (int value in stream) {
    top.Enqueue(value, value);
    if (top.Count > k) top.Dequeue();
}
var result = new List<int>();
while (top.TryDequeue(out int value, out _)) result.Add(value);
Console.WriteLine(string.Join(",", result)); // 8,9,10`,
  `var jobs = new PriorityQueue<string, (int Priority, long Sequence)>();
long sequence = 0;
jobs.Enqueue("first", (1, sequence++));
jobs.Enqueue("second", (1, sequence++));
jobs.Enqueue("urgent", (0, sequence++));
while (jobs.TryDequeue(out string? job, out var priority))
    Console.WriteLine($"{priority}: {job}");
// Tuple priority compares its fields lexicographically.`,
  "Validate k before processing. Top-K is O(n log k) time and O(k) storage, while sorting all values costs O(n log n) and may need the entire stream retained.",
  "k সঠিক নিন। Top-K-তে O(n log k), O(k) memory; সব sort করলে O(n log n) ও পুরো data লাগতে পারে।",
);
add(
  "Graphs: BFS and DFS",
  "A graph can be disconnected, directed, weighted, cyclic, or all of these. Traversal only reaches vertices connected by the chosen edge direction. BFS uses layers and can reconstruct shortest unweighted paths with parent pointers. Iterative DFS avoids recursion-depth failure, but visitation order depends on adjacency order and stack discipline.",
  "Graph disconnected, directed বা cycle-সহ হতে পারে। Direction অনুযায়ী পৌঁছানো node-ই traversal-এ আসে। BFS-এর parent দিয়ে unweighted ছোট পথ গড়া যায়। Iterative DFS-এ call stack-এর ঝুঁকি কমে।",
  `int[][] g = { new[] {1,2}, new[] {3}, new[] {3}, Array.Empty<int>() };
int[] parent = Enumerable.Repeat(-1, g.Length).ToArray();
var q = new Queue<int>(); q.Enqueue(0); parent[0] = 0;
while (q.TryDequeue(out int u)) {
    foreach (int v in g[u]) if (parent[v] == -1) {
        parent[v] = u; q.Enqueue(v);
    }
}
var path = new List<int>();
for (int v = 3; ; v = parent[v]) { path.Add(v); if (v == 0) break; }
path.Reverse(); Console.WriteLine(string.Join(" -> ", path));`,
  `int[][] g = { new[] {1,2}, new[] {3}, new[] {3}, Array.Empty<int>() };
var seen = new HashSet<int>();
var stack = new Stack<int>(); stack.Push(0);
while (stack.TryPop(out int u)) {
    if (!seen.Add(u)) continue;
    Console.WriteLine(u);
    for (int i = g[u].Length - 1; i >= 0; i--) stack.Push(g[u][i]);
}
Console.WriteLine($"Reached {seen.Count} vertices");`,
  "Check reachability before reconstructing a path in general code. A visited set prevents cycles from causing endless traversal but does not by itself detect every cycle classification.",
  "সাধারণ code-এ path বানানোর আগে target পৌঁছেছে কি না দেখুন। Visited loop থামায়, কিন্তু সব ধরনের cycle আলাদা করে শনাক্ত করে না।",
);
add(
  "Tries",
  "Insertion creates or reuses one edge per symbol and marks terminal nodes. A prefix query asks whether a path exists, while full-word lookup also checks a terminal marker. Children can be arrays for a small fixed alphabet or dictionaries for sparse/large alphabets. Memory cost can dominate the character-by-character time advantage.",
  "প্রতি অক্ষরে edge তৈরি বা ব্যবহার হয়, শেষে word marker। Prefix শুধু path দেখে; পুরো শব্দে marker-ও দেখে। ছোট alphabet-এ array, বড় বা sparse-এ dictionary চলে। Node-এর memory খরচ বড় হতে পারে।",
  `var trie = new Trie();
trie.Add("cat"); trie.Add("car");
Console.WriteLine(trie.Contains("ca")); // False
Console.WriteLine(trie.Contains("cat")); // True
class Trie {
    private readonly Node root = new();
    public void Add(string word) { var n=root; foreach(char c in word) { if(!n.Next.TryGetValue(c,out var next)) n.Next[c]=next=new Node(); n=next; } n.End=true; }
    public bool Contains(string word) { var n=root; foreach(char c in word) { if(!n.Next.TryGetValue(c,out var next)) return false; n=next; } return n.End; }
    private class Node { public bool End; public Dictionary<char,Node> Next=new(); }
}`,
  `string[] words = { "car", "cat", "dog", "cart" };
string prefix = "car";
var matches = words.Where(w => w.StartsWith(prefix, StringComparison.Ordinal))
    .OrderBy(w => w).ToArray();
Console.WriteLine(string.Join(",", matches));
// This linear baseline is often simpler for a tiny dictionary.
// Compare its measured cost with a trie before adding the index.`,
  "Normalize text and define case/Unicode behavior consistently. A char-based trie walks UTF-16 code units; visible Bangla characters can involve multiple code units.",
  "Text normalization ও case-এর নিয়ম এক রাখুন। Char-based trie UTF-16 code unit হাঁটে; দৃশ্যমান বাংলা অক্ষর কয়েক unit হতে পারে।",
);
add(
  "Topological Sort",
  "A topological order respects all directed prerequisite edges. Kahn’s algorithm repeatedly removes zero-indegree vertices. DFS can also produce a reverse finishing order while detecting back edges. Multiple ready vertices imply multiple possible valid orders; a priority queue can select a deterministic smallest-key order.",
  "Topological order সব পূর্বশর্তের edge মানে। Kahn-এ indegree শূন্য node বারবার বের হয়। একাধিক ready node থাকলে কয়েক valid ক্রম হয়; deterministic ক্রমে priority queue কাজে লাগে।",
  `int[][] graph = { new[] {2}, new[] {2}, new[] {3}, Array.Empty<int>() };
int[] indegree = new int[graph.Length];
foreach(var edges in graph) foreach(int v in edges) indegree[v]++;
var ready = new PriorityQueue<int,int>();
for(int i=0;i<graph.Length;i++) if(indegree[i]==0) ready.Enqueue(i,i);
var order = new List<int>();
while(ready.TryDequeue(out int u,out _)) {
    order.Add(u);
    foreach(int v in graph[u]) if(--indegree[v]==0) ready.Enqueue(v,v);
}
Console.WriteLine(order.Count==graph.Length ? string.Join(",",order) : "Cycle detected");`,
  `int[][] cyclic = { new[] {1}, new[] {2}, new[] {0} };
int[] state = new int[cyclic.Length]; // 0 unseen, 1 active, 2 finished
bool Visit(int u) {
    if(state[u]==1) return false;
    if(state[u]==2) return true;
    state[u]=1;
    foreach(int v in cyclic[u]) if(!Visit(v)) return false;
    state[u]=2; return true;
}
Console.WriteLine(Enumerable.Range(0,cyclic.Length).All(Visit) ? "DAG" : "Cycle");`,
  "A topological order is not a shortest path or a resource-aware execution schedule. Parallel execution additionally needs capacity limits and completion tracking.",
  "Topological ক্রম ছোট পথ বা resource-aware schedule নয়। Parallel চালাতে capacity ও completion আলাদা সামলান।",
);
add(
  "Dijkstra's Algorithm",
  "Relaxation improves a tentative distance through a newly considered edge. The min-priority queue chooses the cheapest pending route. Duplicate queue entries are acceptable when stale entries are ignored. Nonnegative weights ensure that taking the cheapest current candidate is safe; negative weights invalidate that argument. Parent pointers recover the actual route.",
  "Relaxation ভালো দূরত্ব পেলে বদলায়। Priority queue কম খরচের route আগে দেয়। Duplicate entry রেখে stale বাদ দেওয়া যায়। Nonnegative weight-এর জন্য greedy সিদ্ধান্ত ঠিক; negative হলে যুক্তি ভাঙে।",
  `var graph = new List<(int To,int Cost)>[] {
    new(){(1,4),(2,1)}, new(){(3,1)}, new(){(1,2),(3,7)}, new()
};
long[] distance=Enumerable.Repeat(long.MaxValue,graph.Length).ToArray();
int[] parent=Enumerable.Repeat(-1,graph.Length).ToArray();
var queue=new PriorityQueue<int,long>(); distance[0]=0; queue.Enqueue(0,0);
while(queue.TryDequeue(out int u,out long cost)) {
    if(cost!=distance[u]) continue;
    foreach(var edge in graph[u]) if(cost+edge.Cost<distance[edge.To]) {
        distance[edge.To]=cost+edge.Cost; parent[edge.To]=u;
        queue.Enqueue(edge.To,distance[edge.To]);
    }
}
Console.WriteLine(distance[3]); // 4`,
  `int[] parent = { -1, 2, 0, 1 }; // from the worked graph
int source=0, target=3;
var route=new List<int>();
for(int v=target;v!=-1;v=parent[v]) route.Add(v);
route.Reverse();
if(route.Count>0 && route[0]==source)
    Console.WriteLine(string.Join(" -> ",route));
else Console.WriteLine("Unreachable");
// Validate parent indices when input is external.`,
  "Use long and guarded arithmetic for large path costs. For unweighted graphs BFS is simpler; for negative weights choose an algorithm with the appropriate guarantees.",
  "বড় দূরত্বে long ও overflow check ভাবুন। Unweighted-এ BFS সহজ; negative-এ উপযুক্ত অন্য algorithm নিন।",
);
add(
  "Union Find",
  "Disjoint-set union represents components as rooted forests. Path compression shortens find paths, while union by size attaches the smaller root under the larger. Together they provide near-constant amortized operations. The structure answers connectivity under additions but does not store actual graph paths or efficiently handle arbitrary edge removal.",
  "DSU forest-এ component রাখে। Path compression রাস্তা ছোট করে, union by size ছোট দল বড় দলে লাগায়। দুটো মিলে প্রায় constant amortized কাজ। এটি path রাখে না ও সহজে edge delete সামলায় না।",
  `var dsu = new Dsu(6);
dsu.Union(0,1); dsu.Union(1,2); dsu.Union(3,4);
Console.WriteLine(dsu.Find(0)==dsu.Find(2));
Console.WriteLine(dsu.Find(0)==dsu.Find(4));
class Dsu {
    private readonly int[] parent, size;
    public Dsu(int n) { parent=Enumerable.Range(0,n).ToArray(); size=Enumerable.Repeat(1,n).ToArray(); }
    public int Find(int x) => parent[x]==x ? x : parent[x]=Find(parent[x]);
    public bool Union(int a,int b) { a=Find(a); b=Find(b); if(a==b)return false; if(size[a]<size[b])(a,b)=(b,a); parent[b]=a;size[a]+=size[b];return true; }
}`,
  `int[] parent = Enumerable.Range(0,4).ToArray();
int Find(int x) { while(parent[x]!=x) x=parent[x]; return x; }
var edges = new[] { (0,1), (1,2), (2,0) };
foreach(var (u,v) in edges) {
    int a=Find(u), b=Find(v);
    if(a==b) { Console.WriteLine("Undirected cycle found"); break; }
    parent[a]=b;
}
// This tiny baseline omits compression/rank to expose the cycle rule.`,
  "DSU cycle detection above is for undirected edge insertion. Directed cycle detection needs a different invariant such as DFS active states or topological processing.",
  "উপরের cycle detection undirected graph-এর জন্য। Directed cycle-এ DFS active state বা topological নিয়ম দরকার।",
);
add(
  "Greedy Algorithms",
  "A greedy proof usually argues that a locally selected choice can replace part of some optimal solution without making it worse. The objective and constraints matter: maximizing the number of meetings differs from maximizing their total value. Weighted interval scheduling generally needs dynamic programming rather than earliest-finish greedy choice.",
  "Greedy proof-এ দেখাতে হয় স্থানীয় সিদ্ধান্ত কোনো optimal উত্তরের অংশ হতে পারে। মিটিংয়ের সংখ্যা বেশি আর মিটিংয়ের মূল্য বেশি আলাদা লক্ষ্য। Weighted ক্ষেত্রে একই greedy নিয়ম চলে না।",
  `var meetings = new[] { (Start:1,End:3), (Start:2,End:5), (Start:3,End:4), (Start:5,End:7) };
var selected=new List<(int Start,int End)>();
int freeAt=int.MinValue;
foreach(var m in meetings.OrderBy(m=>m.End).ThenBy(m=>m.Start)) {
    if(m.Start<freeAt) continue;
    selected.Add(m); freeAt=m.End;
}
foreach(var m in selected) Console.WriteLine($"[{m.Start},{m.End})");
Console.WriteLine($"Meetings: {selected.Count}");`,
  `int[] coins = { 4, 3, 1 };
int amount=6, count=0;
foreach(int coin in coins) {
    count+=amount/coin;
    amount%=coin;
}
Console.WriteLine($"Greedy count: {count}"); // 4+1+1: 3
Console.WriteLine("Optimal is 3+3: 2 coins");
// A counterexample disproves a universal greedy claim.`,
  "Write a counterexample test before assuming a new greedy rule. Sorting order must be tied to a correctness argument, not merely to convenient code.",
  "Greedy নিয়ম মানার আগে counterexample খুঁজুন। Sort-এর ক্রমের সাথে সঠিকতার যুক্তি থাকা চাই।",
);
add(
  "Dynamic Programming",
  "DP defines a state, recurrence, base cases, and evaluation order. Memoization computes states on demand; tabulation computes them in a chosen order. Space compression is valid only when overwritten values are no longer needed. Reconstructing a solution often requires parent choices or a larger table, even if the optimal score alone fits in one dimension.",
  "DP-তে state, recurrence, base case ও ক্রম স্পষ্ট। Memoization দরকারে হিসাব করে, tabulation সাজানো ক্রমে। পুরোনো ফল পরে না লাগলেই memory কমানো যায়। উত্তর গড়তে শুধু score-এর চেয়ে বেশি তথ্য লাগতে পারে।",
  `int[] coins = { 1, 3, 4 }; int amount=6;
int infinity=amount+1;
int[] dp=Enumerable.Repeat(infinity,amount+1).ToArray();
dp[0]=0;
for(int value=1;value<=amount;value++) {
    foreach(int coin in coins)
        if(coin<=value) dp[value]=Math.Min(dp[value],dp[value-coin]+1);
}
Console.WriteLine(dp[amount]>amount ? -1 : dp[amount]); // 2
// Unlimited copies; each state represents one exact amount.`,
  `int Fibonacci(int n, Dictionary<int,int> memo) {
    if(n<0 || n>46) throw new ArgumentOutOfRangeException(nameof(n));
    if(n<2) return n;
    if(memo.TryGetValue(n,out int cached)) return cached;
    return memo[n]=checked(Fibonacci(n-1,memo)+Fibonacci(n-2,memo));
}
var memo=new Dictionary<int,int>();
Console.WriteLine(Fibonacci(10,memo));
Console.WriteLine($"Cached non-base states: {memo.Count}");`,
  "Loop direction distinguishes many 0/1 and unbounded DP algorithms. State the reuse rule before writing a compressed one-dimensional update.",
  "0/1 আর unlimited reuse-এ loop direction ফল বদলায়। এক dimension-এর update-এর আগে reuse rule লিখুন।",
);
export default data;
