// Module 03 DSA: easy story, plain theory, steps, mistakes, interview Q&A, 2028 tip, runnable C#.
import { cs } from "./helpers";

export default {
  "Arrays and Strings": {
    s: ["A row of numbered lockers in a school corridor. If you know the locker number, you open it instantly. Inserting a new locker in the middle means shifting every locker after it. That is an array.", "স্কুলের বারান্দায় নম্বর দেওয়া locker-এর সারি। নম্বর জানলে সাথে সাথে খোলা যায়। মাঝখানে নতুন locker বসাতে হলে পরের সবগুলো সরাতে হয়। এটাই array।"],
    t: ["An array stores items next to each other in memory, so reading by index is O(1). Inserting or deleting in the middle is O(n) because items shift. In C#, strings are immutable arrays of characters: every change creates a new string, so building text in a loop should use StringBuilder. Spans (ReadOnlySpan<char>) let you slice without copying.", "Array memory-তে item পাশাপাশি রাখে, তাই index দিয়ে পড়া O(1)। মাঝে ঢোকানো বা মোছা O(n), কারণ item সরাতে হয়। C#-এ string হলো অপরিবর্তনীয় character array: প্রতিটি পরিবর্তনে নতুন string তৈরি হয়, তাই loop-এ লেখা বানাতে StringBuilder দিন। Span (ReadOnlySpan<char>) কপি ছাড়াই অংশ কাটতে দেয়।"],
    p: [["Clarify input size and allowed characters.", "Input-এর আকার ও অনুমোদিত অক্ষর স্পষ্ট করুন।"], ["Walk through a tiny example by hand with indexes.", "Index-সহ ছোট উদাহরণ হাতে করে দেখুন।"], ["Write the loop carefully: start, end, step.", "সাবধানে loop লিখুন: শুরু, শেষ, ধাপ।"], ["Test empty, one item and very long inputs.", "খালি, একটি item ও খুব লম্বা input test করুন।"]],
    m: ["Off-by-one errors (i <= length); string concatenation in a loop (O(n²)); forgetting Unicode: 'বাংলা'.Length counts UTF-16 units, not visible letters.", "Off-by-one error (i <= length); loop-এ string জোড়া (O(n²)); Unicode ভুলে যাওয়া: 'বাংলা'.Length দৃশ্যমান অক্ষর নয়, UTF-16 unit গোনে।"],
    q: ["Q: Reverse the words in 'I love Dhaka' without built-in Reverse. A: Split on spaces, swap from both ends with two pointers, join. O(n) time.", "প্রশ্ন: built-in Reverse ছাড়া 'I love Dhaka'-র শব্দগুলো উল্টান। উত্তর: Space-এ ভাগ করে দুই pointer দিয়ে দুই প্রান্ত থেকে swap, তারপর join। O(n) সময়।"],
    f: ["Even with AI writing code, interviewers still test arrays and strings, because they reveal how you think about indexes, edge cases and complexity.", "AI code লিখলেও interviewer এখনো array ও string পরীক্ষা করেন, কারণ এতে index, সীমার case ও complexity নিয়ে আপনার চিন্তা বোঝা যায়।"],
    x: [cs("Reverse words, palindrome and StringBuilder · শব্দ উল্টানো ও palindrome", `using System.Text;

string[] words = "I love Dhaka".Split(' ');
for (int i = 0, j = words.Length - 1; i < j; i++, j--)
    (words[i], words[j]) = (words[j], words[i]);
Console.WriteLine(string.Join(' ', words));

bool IsPalindrome(string s)
{
    var clean = s.Where(char.IsLetterOrDigit).Select(char.ToLowerInvariant).ToArray();
    for (int i = 0, j = clean.Length - 1; i < j; i++, j--)
        if (clean[i] != clean[j]) return false;
    return true;
}
Console.WriteLine(IsPalindrome("Was it a car or a cat I saw?"));
Console.WriteLine(IsPalindrome("Dhaka"));

var sb = new StringBuilder();
for (int i = 1; i <= 5; i++) sb.Append(i).Append(i < 5 ? "," : "");
Console.WriteLine(sb.ToString());`, "Dhaka love I\nTrue\nFalse\n1,2,3,4,5")],
  },
  "Hashing": {
    s: ["A post office with pigeonholes labelled by house number. The postman looks at the number and drops the letter straight into the right hole, without searching. A hash table turns a key into a slot number the same way.", "বাড়ির নম্বর লেখা খোপসহ ডাকঘর। ডাকপিয়ন নম্বর দেখে খোঁজাখুঁজি ছাড়াই সরাসরি ঠিক খোপে চিঠি ফেলেন। Hash table একইভাবে key-কে slot নম্বরে রূপ দেয়।"],
    t: ["A hash function maps a key to a bucket. Dictionary<TKey,TValue> and HashSet<T> give average O(1) add, lookup and remove. Collisions (two keys in one bucket) are handled internally. Custom keys need consistent Equals and GetHashCode; records do this for you. Hashing trades memory for speed and is the most common trick for turning O(n²) into O(n).", "Hash function একটি key-কে bucket-এ পাঠায়। Dictionary<TKey,TValue> ও HashSet<T> গড়ে O(1)-এ যোগ, খোঁজা ও মোছা দেয়। Collision (একই bucket-এ দুটি key) ভিতরে সামলানো হয়। নিজের key-তে সামঞ্জস্যপূর্ণ Equals ও GetHashCode লাগে; record এটা নিজেই করে। Hashing memory-র বিনিময়ে গতি দেয় এবং O(n²)-কে O(n) করার সবচেয়ে প্রচলিত কৌশল।"],
    p: [["Ask: do I need to remember what I have seen?", "জিজ্ঞেস করুন: যা দেখেছি তা কি মনে রাখতে হবে?"], ["Pick HashSet (seen/not seen) or Dictionary (counts, positions).", "HashSet (দেখা/না দেখা) বা Dictionary (গণনা, অবস্থান) বাছুন।"], ["Use TryGetValue / GetValueOrDefault to avoid exceptions.", "Exception এড়াতে TryGetValue / GetValueOrDefault দিন।"], ["State the trade-off: O(n) extra memory.", "Trade-off বলুন: O(n) বাড়তি memory।"]],
    m: ["Mutating an object after using it as a key; using a mutable class without GetHashCode; assuming dictionaries keep insertion order (do not rely on it); dictionary[key] throwing KeyNotFoundException.", "Key হিসেবে ব্যবহারের পরে object বদলানো; GetHashCode ছাড়া পরিবর্তনশীল class; dictionary insertion-এর ক্রম রাখে ধরে নেওয়া (নির্ভর করবেন না); dictionary[key] KeyNotFoundException দেয়।"],
    q: ["Q: Find the first non-repeating character in 'swiss'. A: Count characters in a Dictionary (one pass), then scan the string again and return the first with count 1: 'w'.", "প্রশ্ন: 'swiss'-এ প্রথম অপুনরাবৃত্ত অক্ষর খুঁজুন। উত্তর: Dictionary-তে অক্ষর গুনুন (এক pass), আবার string পড়ে যার গণনা ১ তা ফেরত দিন: 'w'।"],
    f: ["Hashing powers caches, deduplication, rate limiters and even AI semantic caches. Recognising 'this needs a lookup table' is a skill you will use weekly.", "Hashing cache, deduplication, rate limiter, এমনকি AI semantic cache চালায়। 'এখানে lookup table লাগবে' চেনা এমন দক্ষতা যা প্রতি সপ্তাহে ব্যবহার করবেন।"],
    x: [cs("Two Sum, frequency count and first unique · Two Sum ও গণনা", `int[] TwoSum(int[] nums, int target)
{
    var seen = new Dictionary<int, int>();          // value -> index
    for (int i = 0; i < nums.Length; i++)
    {
        if (seen.TryGetValue(target - nums[i], out int j)) return [j, i];
        seen[nums[i]] = i;
    }
    return [];
}
Console.WriteLine(string.Join(",", TwoSum([2, 7, 11, 15], 9)));

var counts = new Dictionary<char, int>();
foreach (char c in "swiss") counts[c] = counts.GetValueOrDefault(c) + 1;
Console.WriteLine(string.Join(" ", counts.Select(kv => $"{kv.Key}={kv.Value}")));
Console.WriteLine("first unique: " + "swiss".First(c => counts[c] == 1));

var seenEmails = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
foreach (var e in new[] { "a@x.com", "A@X.com", "b@x.com" })
    Console.WriteLine($"{e}: {(seenEmails.Add(e) ? "new" : "duplicate")}");`, "0,1\ns=3 w=1 i=1\nfirst unique: w\na@x.com: new\nA@X.com: duplicate\nb@x.com: new")],
  },
  "Two Pointers": {
    s: ["Two friends searching a long bench for two seats whose numbers add to 100: one starts from the left end, one from the right, and they walk towards each other. Two pointers avoid checking every pair.", "দুই বন্ধু লম্বা বেঞ্চে এমন দুটি আসন খুঁজছে যাদের নম্বরের যোগফল ১০০: একজন বাম প্রান্ত থেকে, একজন ডান প্রান্ত থেকে, একে অপরের দিকে হাঁটে। Two pointer প্রতিটি জোড়া পরীক্ষা এড়ায়।"],
    t: ["Use two indexes that move based on a rule. Opposite ends work on sorted arrays (pair sums, palindromes, container with most water). Same-direction 'slow and fast' pointers remove duplicates in place or detect cycles. Each pointer moves at most n times, so the loop is O(n) instead of O(n²).", "নিয়ম অনুযায়ী সরে এমন দুটি index ব্যবহার করুন। বিপরীত প্রান্ত sorted array-তে কাজ করে (জোড়ার যোগফল, palindrome, সবচেয়ে বেশি পানির পাত্র)। একই দিকের 'ধীর ও দ্রুত' pointer জায়গায় duplicate সরায় বা চক্র ধরে। প্রতিটি pointer সর্বোচ্চ n বার সরে, তাই loop O(n²)-এর বদলে O(n)।"],
    p: [["Check if the input is sorted (or can be sorted).", "Input sorted কি না (বা sort করা যায় কি না) দেখুন।"], ["Place pointers: both ends, or slow/fast at the start.", "Pointer বসান: দুই প্রান্তে, বা শুরুতে ধীর/দ্রুত।"], ["Write the rule for moving each pointer.", "প্রতিটি pointer সরানোর নিয়ম লিখুন।"], ["Stop when pointers cross; test duplicates and empty input.", "Pointer পার হলে থামুন; duplicate ও খালি input test করুন।"]],
    m: ["Using it on unsorted data; moving both pointers when only one should move; infinite loops because neither pointer moves in some branch.", "Unsorted data-য় ব্যবহার; একটি সরানোর কথা থাকলেও দুটোই সরানো; কোনো শাখায় কোনো pointer না সরায় অসীম loop।"],
    q: ["Q: Remove duplicates from a sorted array in place and return the new length. A: Slow pointer marks the write position; fast pointer scans; when nums[fast] != nums[slow], advance slow and copy. O(n) time, O(1) space.", "প্রশ্ন: Sorted array থেকে জায়গায় duplicate সরিয়ে নতুন দৈর্ঘ্য দিন। উত্তর: ধীর pointer লেখার জায়গা চিহ্নিত করে; দ্রুত pointer পড়ে; nums[fast] != nums[slow] হলে slow এগিয়ে কপি করুন। O(n) সময়, O(1) জায়গা।"],
    f: ["Pattern recognition beats memorisation. When you see 'sorted' plus 'pair' or 'in place', think two pointers first.", "মুখস্থের চেয়ে pattern চেনা ভালো। 'Sorted' আর 'জোড়া' বা 'জায়গায়' দেখলে আগে two pointer ভাবুন।"],
    x: [cs("Pair sum and in-place de-duplication · জোড়ার যোগফল ও duplicate সরানো", `int[] prices = [100, 200, 350, 400, 650, 900];   // sorted
int budget = 1000;
int left = 0, right = prices.Length - 1, steps = 0;
while (left < right)
{
    steps++;
    int sum = prices[left] + prices[right];
    if (sum == budget) { Console.WriteLine($"Buy {prices[left]} + {prices[right]} in {steps} steps"); break; }
    if (sum < budget) left++; else right--;
}

int[] nums = [1, 1, 2, 3, 3, 3, 4];
int slow = 0;
for (int fast = 1; fast < nums.Length; fast++)
    if (nums[fast] != nums[slow]) nums[++slow] = nums[fast];
Console.WriteLine($"unique count {slow + 1}: {string.Join(",", nums[..(slow + 1)])}");`, "Buy 100 + 900 in 1 steps\nunique count 4: 1,2,3,4")],
  },
  "Sliding Window": {
    s: ["Looking through a train window: as the train moves, one new tree enters the view on one side and one old tree leaves on the other. You do not rebuild the whole view each second. A sliding window updates a running result the same way.", "ট্রেনের জানালা দিয়ে দেখা: ট্রেন চললে এক পাশে নতুন একটি গাছ দৃশ্যে আসে, অন্য পাশে পুরনো একটি চলে যায়। প্রতি সেকেন্ডে পুরো দৃশ্য নতুন করে বানাতে হয় না। Sliding window একইভাবে চলমান ফল আপডেট করে।"],
    t: ["A window is a contiguous range [left, right]. Fixed windows (size k) add the new element and remove the old one: O(n) instead of O(n·k). Variable windows grow right until a condition breaks, then shrink left until it holds again. A HashSet or Dictionary inside the window tracks contents.", "Window হলো ধারাবাহিক পরিসর [left, right]। নির্দিষ্ট window (আকার k) নতুন element যোগ করে পুরনোটা সরায়: O(n·k)-এর বদলে O(n)। পরিবর্তনশীল window শর্ত না ভাঙা পর্যন্ত ডানে বাড়ে, তারপর আবার শর্ত মানা পর্যন্ত বাম থেকে ছোট হয়। Window-র ভিতরের জিনিস HashSet বা Dictionary দিয়ে track করা হয়।"],
    p: [["Confirm the problem is about a contiguous subarray or substring.", "সমস্যাটি ধারাবাহিক subarray বা substring নিয়ে কি না নিশ্চিত করুন।"], ["Decide fixed size or variable size.", "নির্দিষ্ট নাকি পরিবর্তনশীল আকার ঠিক করুন।"], ["Expand right; while invalid, shrink left.", "ডানে বাড়ান; অবৈধ থাকা পর্যন্ত বাম থেকে ছোট করুন।"], ["Update the best answer at the right moment.", "ঠিক মুহূর্তে সেরা উত্তর আপডেট করুন।"]],
    m: ["Using it for non-contiguous problems (subsequences); updating the answer before shrinking; forgetting to remove the left element from the set or counts.", "অধারাবাহিক সমস্যায় (subsequence) ব্যবহার; ছোট করার আগে উত্তর আপডেট; set বা গণনা থেকে বাম element সরাতে ভুলে যাওয়া।"],
    q: ["Q: Longest substring without repeating characters in 'abcabcbb'? A: Variable window with a HashSet; when a repeat appears, shrink from the left. Answer 3 ('abc'), O(n).", "প্রশ্ন: 'abcabcbb'-এ পুনরাবৃত্তিহীন সবচেয়ে লম্বা substring? উত্তর: HashSet-সহ পরিবর্তনশীল window; পুনরাবৃত্তি এলে বাম থেকে ছোট করুন। উত্তর ৩ ('abc'), O(n)।"],
    f: ["Sliding windows appear in real systems: rate limiters, moving averages on metrics dashboards and chunking long documents for AI with overlap.", "Sliding window বাস্তব system-এ দেখা যায়: rate limiter, metric dashboard-এ চলমান গড়, আর AI-এর জন্য overlap-সহ লম্বা document chunk করা।"],
    x: [cs("Fixed and variable windows · নির্দিষ্ট ও পরিবর্তনশীল window", `int[] sales = [3, 8, 2, 9, 4, 7];
int k = 3, sum = sales[..k].Sum(), best = sum;
for (int i = k; i < sales.Length; i++)
{
    sum += sales[i] - sales[i - k];     // add new, remove old
    best = Math.Max(best, sum);
}
Console.WriteLine($"best 3-day sales: {best}");

string s = "abcabcbb";
var window = new HashSet<char>();
int left = 0, longest = 0, start = 0;
for (int right = 0; right < s.Length; right++)
{
    while (window.Contains(s[right])) window.Remove(s[left++]);
    window.Add(s[right]);
    if (right - left + 1 > longest) { longest = right - left + 1; start = left; }
}
Console.WriteLine($"longest unique substring: {s.Substring(start, longest)} ({longest})");`, "best 3-day sales: 20\nlongest unique substring: abc (3)")],
  },
  "Prefix Sum": {
    s: ["A car's odometer: to know how far you drove between Comilla and Chattogram, subtract the reading at Comilla from the reading at Chattogram. No need to re-add every kilometre. Prefix sums store those running readings.", "গাড়ির odometer: কুমিল্লা থেকে চট্টগ্রাম কত দূর চালালেন জানতে চট্টগ্রামের reading থেকে কুমিল্লার reading বাদ দিন। প্রতিটি কিলোমিটার আবার যোগ করতে হয় না। Prefix sum সেই চলমান reading রাখে।"],
    t: ["prefix[i] = sum of the first i elements (prefix[0] = 0). Then the sum of range [l, r] = prefix[r + 1] - prefix[l] in O(1). Building it is O(n). Combined with a Dictionary of seen prefix values, it counts subarrays with a target sum in O(n). 2D prefix sums answer rectangle sums.", "prefix[i] = প্রথম i element-এর যোগফল (prefix[0] = 0)। তাহলে [l, r] পরিসরের যোগফল = prefix[r + 1] - prefix[l], O(1)-এ। বানাতে O(n)। দেখা prefix মানের Dictionary-র সাথে মিলিয়ে নির্দিষ্ট যোগফলের subarray O(n)-এ গোনা যায়। 2D prefix sum আয়তক্ষেত্রের যোগফল দেয়।"],
    p: [["Create prefix with length n + 1 and prefix[0] = 0.", "দৈর্ঘ্য n + 1-এর prefix বানান, prefix[0] = 0।"], ["Fill prefix[i + 1] = prefix[i] + a[i].", "prefix[i + 1] = prefix[i] + a[i] দিয়ে ভরুন।"], ["Answer range queries with one subtraction.", "এক বিয়োগে পরিসরের প্রশ্নের উত্তর দিন।"], ["For 'subarrays summing to k', count prefix values in a Dictionary.", "'যোগফল k-এর subarray'-তে Dictionary-তে prefix মান গুনুন।"]],
    m: ["Off-by-one between prefix indexes and array indexes; integer overflow on big sums (use long); rebuilding the prefix array for every query.", "Prefix index ও array index-এর মধ্যে off-by-one; বড় যোগফলে integer overflow (long দিন); প্রতিটি প্রশ্নে prefix array আবার বানানো।"],
    q: ["Q: Count subarrays of [1, 2, 3] that sum to 3. A: Running sum with a Dictionary of seen sums starting {0:1}; answer 2 ([1,2] and [3]).", "প্রশ্ন: [1, 2, 3]-এর কতগুলো subarray-র যোগফল ৩? উত্তর: {0:1} দিয়ে শুরু দেখা যোগফলের Dictionary-সহ চলমান যোগফল; উত্তর ২ ([1,2] ও [3])।"],
    f: ["Analytics databases and metrics systems use the same idea (cumulative counters) to answer 'how many requests between 10:00 and 10:05' instantly.", "Analytics database ও metric system একই ধারণা (cumulative counter) ব্যবহার করে '১০:০০ থেকে ১০:০৫-এর মধ্যে কতগুলো request' সাথে সাথে বলতে।"],
    x: [cs("Range sums in O(1) and subarrays equal to k · O(1)-এ পরিসরের যোগফল", `int[] steps = [4000, 6500, 3000, 8000, 7200, 5100, 9900];  // daily steps
long[] prefix = new long[steps.Length + 1];
for (int i = 0; i < steps.Length; i++) prefix[i + 1] = prefix[i] + steps[i];

long Range(int l, int r) => prefix[r + 1] - prefix[l];
Console.WriteLine($"days 2-4 total: {Range(1, 3)}");
Console.WriteLine($"whole week: {Range(0, 6)}");

int[] a = [1, 2, 3];
int k = 3, count = 0, running = 0;
var seen = new Dictionary<int, int> { [0] = 1 };
foreach (int x in a)
{
    running += x;
    count += seen.GetValueOrDefault(running - k);
    seen[running] = seen.GetValueOrDefault(running) + 1;
}
Console.WriteLine($"subarrays summing to {k}: {count}");`, "days 2-4 total: 17500\nwhole week: 43700\nsubarrays summing to 3: 2")],
  },
  "Binary Search": {
    s: ["Guessing a number between 1 and 100 when someone says 'higher' or 'lower'. Smart players guess 50, then 25 or 75, halving each time; seven guesses always suffice. That is binary search.", "কেউ 'বড়' বা 'ছোট' বললে ১ থেকে ১০০-এর মধ্যে সংখ্যা অনুমান করা। বুদ্ধিমান খেলোয়াড় ৫০, তারপর ২৫ বা ৭৫ বলেন, প্রতিবার অর্ধেক করে; সাতবারেই যথেষ্ট। এটাই binary search।"],
    t: ["On sorted data, compare with the middle and discard half: O(log n). Use lo + (hi - lo) / 2 to avoid overflow. Beyond finding a value, binary search finds boundaries (first index >= x) and 'answers' over a monotonic condition, like the minimum capacity that still finishes on time.", "Sorted data-য় মাঝের সাথে তুলনা করে অর্ধেক বাদ: O(log n)। Overflow এড়াতে lo + (hi - lo) / 2 দিন। মান খোঁজার বাইরে binary search সীমা খোঁজে (প্রথম index >= x) আর একমুখী শর্তের 'উত্তর' খোঁজে, যেমন সময়মতো শেষ করার জন্য ন্যূনতম ক্ষমতা।"],
    p: [["Confirm the data (or condition) is sorted/monotonic.", "Data (বা শর্ত) sorted/একমুখী নিশ্চিত করুন।"], ["Choose the loop style (lo <= hi or lo < hi) and stick to it.", "Loop-এর ধরন (lo <= hi বা lo < hi) বেছে মেনে চলুন।"], ["Move lo or hi so the search always shrinks.", "lo বা hi এমনভাবে সরান যাতে খোঁজ সবসময় ছোট হয়।"], ["Test with 0, 1 and 2 elements, and missing values.", "০, ১ ও ২টি element এবং অনুপস্থিত মান দিয়ে test করুন।"]],
    m: ["Infinite loops from lo = mid instead of mid + 1; using it on unsorted data; returning the wrong boundary for duplicates.", "mid + 1-এর বদলে lo = mid দিয়ে অসীম loop; unsorted data-য় ব্যবহার; duplicate-এ ভুল সীমা ফেরত দেওয়া।"],
    q: ["Q: Packages with weights must ship within D days in order; find the minimum ship capacity. A: Binary search the capacity between max(weight) and sum(weights), checking each guess with a greedy simulation.", "প্রশ্ন: ওজনসহ package ক্রমানুসারে D দিনে পাঠাতে হবে; ন্যূনতম জাহাজের ক্ষমতা খুঁজুন। উত্তর: max(weight) থেকে sum(weights)-এর মধ্যে ক্ষমতার binary search, প্রতিটি অনুমান greedy simulation দিয়ে যাচাই।"],
    f: ["git bisect uses binary search over commits to find which one introduced a bug, an essential debugging tool in large codebases.", "git bisect commit-এর উপর binary search চালিয়ে খুঁজে দেয় কোন commit bug এনেছে, বড় codebase-এ অপরিহার্য debugging tool।"],
    x: [cs("Find a value and a lower bound · মান ও lower bound খোঁজা", `int[] prices = [120, 250, 250, 300, 480, 750, 990];

int Find(int target)
{
    int lo = 0, hi = prices.Length - 1;
    while (lo <= hi)
    {
        int mid = lo + (hi - lo) / 2;
        if (prices[mid] == target) return mid;
        if (prices[mid] < target) lo = mid + 1; else hi = mid - 1;
    }
    return -1;
}

int LowerBound(int x)          // first index with prices[i] >= x
{
    int lo = 0, hi = prices.Length;
    while (lo < hi)
    {
        int mid = lo + (hi - lo) / 2;
        if (prices[mid] < x) lo = mid + 1; else hi = mid;
    }
    return lo;
}

Console.WriteLine($"index of 480: {Find(480)}");
Console.WriteLine($"index of 500: {Find(500)}");
Console.WriteLine($"first item >= 250 at {LowerBound(250)}");
Console.WriteLine($"items under 400: {LowerBound(400)}");`, "index of 480: 4\nindex of 500: -1\nfirst item >= 250 at 1\nitems under 400: 4")],
  },
  "Stack and Queue": {
    s: ["A stack is a pile of plates: you take the top one first. A queue is the line at a bank counter: the first person in line is served first.", "Stack হলো থালার স্তূপ: উপরেরটা আগে নেন। Queue হলো ব্যাংকের কাউন্টারের লাইন: লাইনের প্রথম জন আগে সেবা পান।"],
    t: ["Stack<T> is LIFO (Push, Pop, Peek); it powers undo, function calls, bracket matching and DFS. Queue<T> is FIFO (Enqueue, Dequeue); it powers BFS, job processing and buffering. Both operations are O(1). In concurrent code use ConcurrentQueue or Channel<T>.", "Stack<T> হলো LIFO (Push, Pop, Peek); undo, function call, বন্ধনী মেলানো ও DFS চালায়। Queue<T> হলো FIFO (Enqueue, Dequeue); BFS, কাজ প্রক্রিয়া ও buffering চালায়। দুই কাজই O(1)। একসাথে চলা code-এ ConcurrentQueue বা Channel<T> দিন।"],
    p: [["Ask: newest first (stack) or oldest first (queue)?", "জিজ্ঞেস করুন: নতুনটা আগে (stack) নাকি পুরনোটা আগে (queue)?"], ["Use TryPop / TryDequeue to avoid exceptions on empty.", "খালিতে exception এড়াতে TryPop / TryDequeue দিন।"], ["Trace the structure's contents on paper for a small input.", "ছোট input-এ কাগজে কাঠামোর ভিতরের অবস্থা অনুসরণ করুন।"], ["Handle the empty case explicitly.", "খালি case স্পষ্টভাবে সামলান।"]],
    m: ["Pop on an empty stack (InvalidOperationException); using List.RemoveAt(0) as a queue (O(n)); forgetting leftover items at the end (unmatched brackets).", "খালি stack-এ Pop (InvalidOperationException); queue হিসেবে List.RemoveAt(0) (O(n)); শেষে বাকি item ভুলে যাওয়া (না মেলা বন্ধনী)।"],
    q: ["Q: Is '{[()]}' balanced? '([)]'? A: Push openers; on a closer, pop and check it matches. First is balanced, second is not.", "প্রশ্ন: '{[()]}' কি ভারসাম্যপূর্ণ? '([)]'? উত্তর: খোলা বন্ধনী push; বন্ধ বন্ধনীতে pop করে মিল দেখুন। প্রথমটি ঠিক, দ্বিতীয়টি নয়।"],
    f: ["Queues are the heart of backend architecture: message queues, background jobs and AI request batching all follow FIFO with retries.", "Queue backend architecture-এর হৃদয়: message queue, background job ও AI request batching সবই retry-সহ FIFO মানে।"],
    x: [cs("Balanced brackets and a print queue · বন্ধনী মেলানো ও print queue", `bool Balanced(string s)
{
    var stack = new Stack<char>();
    var pairs = new Dictionary<char, char> { [')'] = '(', [']'] = '[', ['}'] = '{' };
    foreach (char c in s)
    {
        if ("([{".Contains(c)) stack.Push(c);
        else if (pairs.TryGetValue(c, out char open))
            if (!stack.TryPop(out char top) || top != open) return false;
    }
    return stack.Count == 0;
}
foreach (var s in new[] { "{[()]}", "([)]", "((" }) Console.WriteLine($"{s} -> {Balanced(s)}");

var printer = new Queue<string>(["invoice.pdf", "photo.jpg"]);
printer.Enqueue("report.docx");
while (printer.TryDequeue(out var job)) Console.WriteLine($"printing {job}");`, "{[()]} -> True\n([)] -> False\n(( -> False\nprinting invoice.pdf\nprinting photo.jpg\nprinting report.docx")],
  },
  "Linked List": {
    s: ["A treasure hunt where each clue tells you where the next clue is hidden. You cannot jump to clue 7 directly; you follow the chain. Adding a new clue only means changing one note.", "গুপ্তধন খোঁজা, যেখানে প্রতিটি সূত্র পরের সূত্র কোথায় লুকানো বলে দেয়। সরাসরি ৭ নম্বর সূত্রে যাওয়া যায় না; শৃঙ্খল অনুসরণ করতে হয়। নতুন সূত্র যোগ মানে শুধু একটি নোট বদলানো।"],
    t: ["Each node holds a value and a reference to the next node. Inserting or removing next to a known node is O(1); finding the k-th node is O(n). Classic techniques: a dummy head to simplify edge cases, fast/slow pointers to find the middle or detect cycles, and reversing by re-pointing next references. C# has LinkedList<T> (doubly linked).", "প্রতিটি node একটি মান ও পরের node-এর reference রাখে। জানা node-এর পাশে ঢোকানো বা মোছা O(1); k-তম node খোঁজা O(n)। প্রচলিত কৌশল: সীমার case সহজ করতে dummy head, মাঝখান খুঁজতে বা চক্র ধরতে fast/slow pointer, আর next reference ঘুরিয়ে উল্টানো। C#-এ LinkedList<T> (doubly linked) আছে।"],
    p: [["Draw boxes and arrows for 3 nodes.", "৩টি node-এর জন্য বাক্স ও তীর আঁকুন।"], ["Keep prev, current and next variables while re-pointing.", "Re-point করার সময় prev, current ও next variable রাখুন।"], ["Use a dummy node when the head might change.", "Head বদলাতে পারলে dummy node দিন।"], ["Test empty, one node and two nodes.", "খালি, একটি ও দুটি node test করুন।"]],
    m: ["Losing the rest of the list by overwriting next before saving it; null reference on the last node; forgetting the head changes after reversal.", "Next সংরক্ষণের আগে overwrite করে তালিকার বাকিটা হারানো; শেষ node-এ null reference; উল্টানোর পরে head বদলায় ভুলে যাওয়া।"],
    q: ["Q: Detect a cycle in a linked list in O(1) space. A: Floyd's algorithm: slow moves 1 step, fast moves 2; if they meet there is a cycle; if fast reaches null there is none.", "প্রশ্ন: O(1) জায়গায় linked list-এ চক্র ধরুন। উত্তর: Floyd-এর algorithm: slow ১ ধাপ, fast ২ ধাপ; দেখা হলে চক্র আছে; fast null-এ পৌঁছালে নেই।"],
    f: ["You rarely hand-write linked lists at work, but the pointer-manipulation thinking appears in LRU caches, undo histories and blockchain-style hash chains.", "কাজে খুব কমই হাতে linked list লেখেন, কিন্তু pointer নাড়াচাড়ার চিন্তা LRU cache, undo ইতিহাস ও blockchain-ধরনের hash chain-এ দেখা যায়।"],
    x: [cs("Build, reverse and find the middle · বানানো, উল্টানো, মাঝখান", `Node? head = null;
for (int i = 5; i >= 1; i--) head = new Node(i, head);       // 1->2->3->4->5
Console.WriteLine("list:     " + Show(head));

Node? slow = head, fast = head;
while (fast?.Next is not null) { slow = slow!.Next; fast = fast.Next.Next; }
Console.WriteLine($"middle:   {slow!.Value}");

Node? prev = null, cur = head;
while (cur is not null) { var next = cur.Next; cur.Next = prev; prev = cur; cur = next; }
head = prev;
Console.WriteLine("reversed: " + Show(head));

static string Show(Node? n) { var parts = new List<int>(); for (; n is not null; n = n.Next) parts.Add(n.Value); return string.Join("->", parts); }

class Node(int value, Node? next) { public int Value = value; public Node? Next = next; }`, "list:     1->2->3->4->5\nmiddle:   3\nreversed: 5->4->3->2->1")],
  },
  "Monotonic Stack": {
    s: ["People standing in a queue looking ahead: each person wants to know the next person taller than them. Shorter people who are 'hidden' behind a taller one stop mattering. A monotonic stack keeps only the people who could still be the answer.", "লাইনে দাঁড়ানো মানুষ সামনে তাকিয়ে: প্রত্যেকে জানতে চায় পরের কে তার চেয়ে লম্বা। লম্বা কারো পিছনে 'লুকানো' খাটো মানুষ আর গুরুত্বপূর্ণ নয়। Monotonic stack শুধু তাদের রাখে যারা এখনো উত্তর হতে পারে।"],
    t: ["A monotonic stack keeps elements in increasing or decreasing order. When a new element breaks the order, you pop elements, and for each popped element the new one is its 'next greater' (or smaller). Each element is pushed and popped once, so the whole pass is O(n). Store indexes to compute distances.", "Monotonic stack element-গুলো বাড়ন্ত বা কমন্ত ক্রমে রাখে। নতুন element ক্রম ভাঙলে element pop করেন, আর প্রতিটি pop হওয়া element-এর জন্য নতুনটি তার 'পরের বড়' (বা ছোট)। প্রতিটি element একবার push ও একবার pop হয়, তাই পুরো pass O(n)। দূরত্ব হিসাবের জন্য index রাখুন।"],
    p: [["Decide: next greater (decreasing stack) or next smaller (increasing stack).", "ঠিক করুন: পরের বড় (কমন্ত stack) নাকি পরের ছোট (বাড়ন্ত stack)।"], ["Push indexes, not values.", "মান নয়, index push করুন।"], ["While the new value breaks the order, pop and record the answer.", "নতুন মান ক্রম ভাঙা পর্যন্ত pop করে উত্তর লিখুন।"], ["Items left in the stack have no answer (-1 or 0).", "Stack-এ বাকি item-এর উত্তর নেই (-1 বা 0)।"]],
    m: ["Pushing values and losing positions; using > instead of >= and mishandling equal values; nested loops that make it O(n²) again.", "মান push করে অবস্থান হারানো; >= এর বদলে > দিয়ে সমান মান ভুলভাবে সামলানো; nested loop দিয়ে আবার O(n²) করা।"],
    q: ["Q: Daily temperatures: how many days until a warmer day? A: Decreasing stack of indexes; when today is warmer than the stack top, pop and set answer[top] = today - top.", "প্রশ্ন: দৈনিক তাপমাত্রা: উষ্ণতর দিন আসতে কত দিন? উত্তর: Index-এর কমন্ত stack; আজ stack-এর উপরেরটার চেয়ে উষ্ণ হলে pop করে answer[top] = today - top।"],
    f: ["This pattern appears in stock-price analysis, histogram problems and UI layout calculations. Knowing it signals strong algorithmic maturity in interviews.", "এই pattern শেয়ারের দাম বিশ্লেষণ, histogram সমস্যা ও UI layout হিসাবে দেখা যায়। জানা থাকলে interview-এ শক্ত algorithmic পরিপক্বতা বোঝায়।"],
    x: [cs("Days until a warmer day · উষ্ণতর দিন পর্যন্ত কত দিন", `int[] temps = [30, 28, 32, 31, 29, 35, 33];   // Dhaka, °C
int[] wait = new int[temps.Length];
var stack = new Stack<int>();                   // indexes, temps decreasing

for (int today = 0; today < temps.Length; today++)
{
    while (stack.Count > 0 && temps[today] > temps[stack.Peek()])
    {
        int earlier = stack.Pop();
        wait[earlier] = today - earlier;
    }
    stack.Push(today);
}
Console.WriteLine(string.Join(" ", wait));
Console.WriteLine($"days with no warmer day ahead: {stack.Count}");`, "2 1 3 2 1 0 0\ndays with no warmer day ahead: 2")],
  },
  "Recursion": {
    s: ["Russian nesting dolls: to reach the smallest doll, you open a doll, find a smaller doll inside, and repeat until there is nothing left to open. Recursion solves a problem by solving a smaller copy of itself.", "রাশিয়ান পুতুলের ভিতরে পুতুল: সবচেয়ে ছোটটায় পৌঁছাতে একটি খুলে ভিতরে ছোট পুতুল পান, আবার খোলেন, যতক্ষণ না খোলার কিছু থাকে। Recursion নিজের ছোট কপি সমাধান করে সমস্যা সমাধান করে।"],
    t: ["A recursive function has a base case (stop) and a recursive case that moves towards it. Each call uses stack memory, so very deep recursion causes StackOverflowException. Memoization caches results of repeated subproblems (fib goes from O(2^n) to O(n)). Trees and divide-and-conquer are natural fits.", "Recursive function-এর একটি base case (থামা) ও একটি recursive case থাকে, যা base-এর দিকে এগোয়। প্রতিটি call stack memory নেয়, তাই খুব গভীর recursion StackOverflowException ঘটায়। Memoization পুনরাবৃত্ত উপ-সমস্যার ফল cache করে (fib O(2^n) থেকে O(n))। Tree ও divide-and-conquer-এ স্বাভাবিকভাবে মানায়।"],
    p: [["Write the base case first.", "আগে base case লিখুন।"], ["Assume the function works for smaller input (trust it).", "ধরে নিন ছোট input-এ function কাজ করে (বিশ্বাস করুন)।"], ["Make sure each call makes the input smaller.", "নিশ্চিত করুন প্রতিটি call input ছোট করে।"], ["Add memoization if subproblems repeat.", "উপ-সমস্যা পুনরাবৃত্ত হলে memoization দিন।"]],
    m: ["Missing or wrong base case (infinite recursion); recursion depth of 100,000 on a linked list; recomputing the same subproblem exponentially.", "Base case না থাকা বা ভুল (অসীম recursion); linked list-এ ১,০০,০০০ গভীর recursion; একই উপ-সমস্যা exponential-ভাবে বারবার হিসাব।"],
    q: ["Q: Why is naive recursive Fibonacci slow? A: fib(n) calls fib(n-1) and fib(n-2), which overlap; the call tree has about 2^n nodes. Memoization or a loop makes it O(n).", "প্রশ্ন: সাধারণ recursive Fibonacci কেন ধীর? উত্তর: fib(n) fib(n-1) ও fib(n-2) ডাকে, যা মিলে যায়; call tree-তে প্রায় 2^n node। Memoization বা loop একে O(n) করে।"],
    f: ["Recursive thinking is how you navigate folder trees, JSON documents, ASTs in compilers and the reasoning traces of AI agents.", "Recursive চিন্তা দিয়েই folder গাছ, JSON document, compiler-এর AST আর AI agent-এর reasoning trace ঘোরা হয়।"],
    x: [cs("Naive vs memoized Fibonacci · সাধারণ বনাম memoized Fibonacci", `long calls = 0;
long Fib(int n) { calls++; return n < 2 ? n : Fib(n - 1) + Fib(n - 2); }

var memo = new Dictionary<int, long>();
long memoCalls = 0;
long FibMemo(int n)
{
    memoCalls++;
    if (n < 2) return n;
    if (memo.TryGetValue(n, out long v)) return v;
    return memo[n] = FibMemo(n - 1) + FibMemo(n - 2);
}

Console.WriteLine($"fib(25) = {Fib(25)} using {calls:N0} calls");
Console.WriteLine($"fib(25) = {FibMemo(25)} using {memoCalls} calls");

int Depth(string path) => path.Contains('/') ? 1 + Depth(path[(path.IndexOf('/') + 1)..]) : 0;
Console.WriteLine($"folder depth of a/b/c/d.txt: {Depth("a/b/c/d.txt")}");`, "fib(25) = 75025 using 242,785 calls\nfib(25) = 75025 using 49 calls\nfolder depth of a/b/c/d.txt: 3")],
  },
  "Backtracking": {
    s: ["Solving a maze: walk forward, and when you hit a dead end, step back to the last junction and try another path. Backtracking explores choices and undoes them when they fail.", "গোলকধাঁধা সমাধান: সামনে হাঁটুন, কানাগলিতে পৌঁছালে শেষ মোড়ে ফিরে অন্য পথ চেষ্টা করুন। Backtracking বিকল্পগুলো ঘুরে দেখে আর ব্যর্থ হলে বাতিল করে।"],
    t: ["Backtracking builds a solution step by step: choose, explore (recurse), un-choose. It generates subsets, permutations and combinations, and solves puzzles like N-Queens and Sudoku. Pruning (stopping early when a partial choice cannot work) is what makes it fast enough. Complexity is often exponential, so constraints are small.", "Backtracking ধাপে ধাপে সমাধান বানায়: বাছুন, ঘুরে দেখুন (recurse), বাছাই বাতিল করুন। এটি subset, permutation ও combination তৈরি করে এবং N-Queens ও Sudoku-র মতো ধাঁধা সমাধান করে। Pruning (আংশিক বাছাই কাজ করবে না বুঝলে আগেই থামা) এটিকে যথেষ্ট দ্রুত করে। Complexity প্রায়ই exponential, তাই সীমা ছোট থাকে।"],
    p: [["Define the state (current path) and when it is complete.", "অবস্থা (বর্তমান পথ) ও কখন সম্পূর্ণ তা ঠিক করুন।"], ["Loop over choices: add, recurse, remove.", "বিকল্পের উপর loop: যোগ, recurse, সরান।"], ["Prune choices that break constraints early.", "শর্ত ভাঙা বিকল্প আগেই বাদ দিন।"], ["Copy the path when saving a result.", "ফল সংরক্ষণের সময় পথ কপি করুন।"]],
    m: ["Saving a reference to the mutable path (all results end up identical); forgetting to undo the choice; no pruning, so it times out.", "পরিবর্তনশীল পথের reference সংরক্ষণ (সব ফল একই হয়ে যায়); বাছাই বাতিল করতে ভুলে যাওয়া; pruning না থাকায় সময় শেষ।"],
    q: ["Q: Find all combinations of coins [2, 3, 5] (reuse allowed) that make 8. A: Backtrack with a start index to avoid duplicate orders; prune when the sum exceeds 8. Answers: 2+2+2+2, 2+3+3, 3+5.", "প্রশ্ন: [2, 3, 5] মুদ্রায় (পুনর্ব্যবহার চলবে) ৮ বানানোর সব সমন্বয় খুঁজুন। উত্তর: একই ক্রম দুবার এড়াতে start index-সহ backtrack; যোগফল ৮ ছাড়ালে prune। উত্তর: 2+2+2+2, 2+3+3, 3+5।"],
    f: ["Search with backtracking underlies constraint solvers, schedulers and test-case generators; AI agents also explore and backtrack over plans.", "Backtracking-সহ search constraint solver, scheduler ও test-case generator-এর ভিত্তি; AI agent-ও পরিকল্পনা ঘুরে দেখে ও পিছিয়ে আসে।"],
    x: [cs("Combination sum with pruning · pruning-সহ combination sum", `int[] coins = [2, 3, 5];
int target = 8;
var results = new List<string>();
var path = new List<int>();
int explored = 0;

void Search(int start, int remaining)
{
    explored++;
    if (remaining == 0) { results.Add(string.Join("+", path)); return; }
    for (int i = start; i < coins.Length; i++)
    {
        if (coins[i] > remaining) break;          // prune: coins are sorted
        path.Add(coins[i]);                       // choose
        Search(i, remaining - coins[i]);          // explore (reuse allowed)
        path.RemoveAt(path.Count - 1);            // un-choose
    }
}
Search(0, target);
Console.WriteLine(string.Join("  |  ", results));
Console.WriteLine($"states explored: {explored}");`, "2+2+2+2  |  2+3+3  |  3+5\nstates explored: 13")],
  },
  "Trees and BST": {
    s: ["A family tree: one ancestor at the top, children below, grandchildren below them. A binary search tree is a family tree with a rule: smaller values go left, larger go right, so you always know which branch to follow.", "পারিবারিক বংশতালিকা: উপরে একজন পূর্বপুরুষ, নিচে সন্তান, তার নিচে নাতি-নাতনি। Binary search tree হলো নিয়মসহ বংশতালিকা: ছোট মান বামে, বড় মান ডানে, তাই সবসময় জানেন কোন শাখায় যেতে হবে।"],
    t: ["A binary tree node has left and right children. In a BST, all left values < node < all right values, so search, insert and delete take O(height): O(log n) when balanced, O(n) when it degenerates into a line. In-order traversal of a BST gives sorted output. .NET's SortedDictionary and SortedSet use balanced trees.", "Binary tree-র node-এর বাম ও ডান সন্তান থাকে। BST-তে সব বাম মান < node < সব ডান মান, তাই খোঁজা, ঢোকানো ও মোছা O(height): ভারসাম্যে O(log n), রেখায় পরিণত হলে O(n)। BST-এর in-order traversal sorted output দেয়। .NET-এর SortedDictionary ও SortedSet ভারসাম্যপূর্ণ tree ব্যবহার করে।"],
    p: [["Draw the tree for the input.", "Input-এর tree আঁকুন।"], ["Choose traversal: pre-order, in-order, post-order or level-order.", "Traversal বাছুন: pre-order, in-order, post-order বা level-order।"], ["Write the recursive function with a null base case.", "Null base case-সহ recursive function লিখুন।"], ["Check height and balance for performance.", "Performance-এর জন্য height ও ভারসাম্য দেখুন।"]],
    m: ["Inserting sorted data into a plain BST (becomes a slow list); validating a BST by only comparing a node with its direct children; forgetting null children.", "সাধারণ BST-তে sorted data ঢোকানো (ধীর তালিকা হয়ে যায়); শুধু সরাসরি সন্তানের সাথে তুলনা করে BST যাচাই; null সন্তান ভুলে যাওয়া।"],
    q: ["Q: How do you check if a tree is a valid BST? A: Recurse with an allowed range (min, max); each node must be inside it, left gets (min, node), right gets (node, max).", "প্রশ্ন: একটি tree বৈধ BST কি না কীভাবে দেখবেন? উত্তর: অনুমোদিত পরিসর (min, max)-সহ recurse; প্রতিটি node তার ভিতরে থাকবে, বাম পায় (min, node), ডান পায় (node, max)।"],
    f: ["Database indexes are B-trees, file systems and DOMs are trees, and AI decision trees and gradient-boosted models are trees too. Tree thinking is everywhere.", "Database index হলো B-tree, file system ও DOM হলো tree, আর AI-এর decision tree ও gradient-boosted model-ও tree। Tree-ভিত্তিক চিন্তা সব জায়গায়।"],
    x: [cs("Build a BST, search it and print in order · BST বানানো ও in-order", `Node? root = null;
foreach (int v in new[] { 50, 30, 70, 20, 40, 60, 80 }) root = Insert(root, v);

Console.WriteLine("in-order: " + string.Join(" ", InOrder(root)));
Console.WriteLine($"contains 60? {Contains(root, 60)}  contains 65? {Contains(root, 65)}");
Console.WriteLine($"height: {Height(root)}");

static Node Insert(Node? n, int v) =>
    n is null ? new Node(v) : v < n.Value ? n with { Left = Insert(n.Left, v) } : n with { Right = Insert(n.Right, v) };
static bool Contains(Node? n, int v) => n is not null && (v == n.Value || Contains(v < n.Value ? n.Left : n.Right, v));
static IEnumerable<int> InOrder(Node? n) => n is null ? [] : InOrder(n.Left).Append(n.Value).Concat(InOrder(n.Right));
static int Height(Node? n) => n is null ? 0 : 1 + Math.Max(Height(n.Left), Height(n.Right));

record Node(int Value, Node? Left = null, Node? Right = null);`, "in-order: 20 30 40 50 60 70 80\ncontains 60? True  contains 65? False\nheight: 3")],
  },
  "Heap / Priority Queue": {
    s: ["A hospital emergency room: patients are not served by arrival time but by how serious their condition is. A priority queue always gives you the most urgent item next.", "হাসপাতালের জরুরি বিভাগ: রোগী আসার সময় নয়, অবস্থা কতটা গুরুতর সেই অনুযায়ী সেবা পান। Priority queue সবসময় পরের সবচেয়ে জরুরি item দেয়।"],
    t: ["A binary heap keeps the smallest (min-heap) or largest item at the top. Insert and remove-top are O(log n); peek is O(1). .NET's PriorityQueue<TElement, TPriority> is a min-heap. Common uses: top-k items (keep a heap of size k), merging sorted lists, scheduling, and Dijkstra's shortest paths.", "Binary heap সবচেয়ে ছোট (min-heap) বা বড় item উপরে রাখে। ঢোকানো ও উপরেরটা সরানো O(log n); দেখা O(1)। .NET-এর PriorityQueue<TElement, TPriority> হলো min-heap। প্রচলিত ব্যবহার: top-k item (k আকারের heap রাখা), sorted তালিকা মেলানো, scheduling, আর Dijkstra-র সবচেয়ে ছোট পথ।"],
    p: [["Decide what 'priority' means and whether smaller or larger wins.", "'অগ্রাধিকার' মানে কী এবং ছোট না বড় জেতে ঠিক করুন।"], ["For a max-heap, use a negative priority or a custom comparer.", "Max-heap-এর জন্য ঋণাত্মক priority বা নিজস্ব comparer দিন।"], ["For top-k, keep the heap size at k and drop the smallest.", "Top-k-এর জন্য heap-এর আকার k রাখুন, সবচেয়ে ছোটটা বাদ দিন।"], ["Dequeue until empty to process in order.", "ক্রমানুসারে প্রক্রিয়া করতে খালি না হওয়া পর্যন্ত Dequeue করুন।"]],
    m: ["Sorting the whole list when only the top 3 are needed; expecting PriorityQueue to be a max-heap; enumerating the queue and expecting sorted order (it is not).", "শুধু শীর্ষ ৩টি দরকার হলেও পুরো তালিকা sort; PriorityQueue max-heap আশা করা; queue enumerate করে sorted ক্রম আশা করা (তা নয়)।"],
    q: ["Q: Find the k largest numbers in a stream of a million values with little memory. A: Keep a min-heap of size k; for each value, add it and remove the smallest if size > k. O(n log k) time, O(k) memory.", "প্রশ্ন: কম memory-তে দশ লাখ মানের stream থেকে k-টি সবচেয়ে বড় সংখ্যা খুঁজুন। উত্তর: k আকারের min-heap রাখুন; প্রতিটি মান যোগ করে আকার k ছাড়ালে সবচেয়ে ছোটটা সরান। O(n log k) সময়, O(k) memory।"],
    f: ["Priority queues schedule background jobs, rank search results and choose the top-k chunks in AI retrieval. Top-k with a heap is a must-know pattern.", "Priority queue background job schedule করে, search ফল rank করে, আর AI retrieval-এ শীর্ষ k chunk বাছে। Heap দিয়ে top-k অবশ্যই জানার মতো pattern।"],
    x: [cs("Emergency queue and top-k scores · জরুরি queue ও top-k", `var er = new PriorityQueue<string, int>();     // smaller number = more urgent
er.Enqueue("sprained ankle", 3);
er.Enqueue("heart attack", 1);
er.Enqueue("fever", 4);
er.Enqueue("broken arm", 2);
while (er.TryDequeue(out var patient, out var level)) Console.WriteLine($"[{level}] {patient}");

int[] scores = [55, 91, 23, 78, 99, 64, 85];
var top = new PriorityQueue<int, int>();
foreach (int s in scores)
{
    top.Enqueue(s, s);
    if (top.Count > 3) top.Dequeue();             // drop the smallest
}
var best = new List<int>();
while (top.TryDequeue(out int s, out _)) best.Add(s);
best.Reverse();
Console.WriteLine("top 3: " + string.Join(", ", best));`, "[1] heart attack\n[2] broken arm\n[3] sprained ankle\n[4] fever\ntop 3: 99, 91, 85")],
  },
  "Graphs: BFS and DFS": {
    s: ["Spreading news in a village: BFS is telling all your neighbours first, then their neighbours (ripples in a pond). DFS is following one friend's chain of friends as far as it goes before trying another (exploring a cave tunnel).", "গ্রামে খবর ছড়ানো: BFS হলো আগে সব প্রতিবেশীকে বলা, তারপর তাদের প্রতিবেশীদের (পুকুরে ঢেউ)। DFS হলো অন্যটা চেষ্টার আগে এক বন্ধুর বন্ধুদের শৃঙ্খল যতদূর যায় অনুসরণ করা (গুহার সুড়ঙ্গ ঘোরা)।"],
    t: ["A graph is nodes connected by edges, usually stored as an adjacency list (Dictionary<int, List<int>>). BFS uses a queue and finds the shortest path in unweighted graphs. DFS uses recursion or a stack and is good for connectivity, cycles and exploring all paths. Both are O(V + E) and need a visited set to avoid loops.", "Graph হলো edge দিয়ে যুক্ত node, সাধারণত adjacency list-এ (Dictionary<int, List<int>>) রাখা। BFS queue ব্যবহার করে এবং ওজনহীন graph-এ সবচেয়ে ছোট পথ খোঁজে। DFS recursion বা stack ব্যবহার করে, সংযোগ, চক্র ও সব পথ ঘোরায় ভালো। দুটোই O(V + E) এবং loop এড়াতে visited set লাগে।"],
    p: [["Build the adjacency list from the edges.", "Edge থেকে adjacency list বানান।"], ["Pick BFS for shortest steps, DFS for exploring/connectivity.", "সবচেয়ে কম ধাপে BFS, ঘোরা/সংযোগে DFS বাছুন।"], ["Mark nodes visited when you enqueue/push them.", "Enqueue/push করার সময়ই node visited চিহ্নিত করুন।"], ["Track parents if you need to rebuild the path.", "পথ আবার বানাতে হলে parent track করুন।"]],
    m: ["Forgetting the visited set (infinite loops); marking visited when dequeuing (duplicates in the queue); using BFS shortest path on weighted graphs (use Dijkstra).", "Visited set ভুলে যাওয়া (অসীম loop); dequeue-এর সময় visited চিহ্ন (queue-তে duplicate); ওজনযুক্ত graph-এ BFS shortest path (Dijkstra দিন)।"],
    q: ["Q: Count islands in a grid of 1s (land) and 0s (water). A: Scan cells; when you find unvisited land, run BFS/DFS to mark the whole island and increase the count.", "প্রশ্ন: 1 (স্থল) ও 0 (পানি)-এর grid-এ দ্বীপ গুনুন। উত্তর: Cell পড়ুন; না দেখা স্থল পেলে BFS/DFS দিয়ে পুরো দ্বীপ চিহ্নিত করে গণনা বাড়ান।"],
    f: ["Graphs model microservice dependencies, social networks, road maps and knowledge graphs used to ground AI answers. BFS/DFS are your basic tools for all of them.", "Graph microservice-এর নির্ভরতা, social network, সড়ক মানচিত্র ও AI উত্তরের ভিত্তি হিসেবে ব্যবহৃত knowledge graph-এর মডেল। এসবের মৌলিক tool BFS/DFS।"],
    x: [cs("Fewest metro stops with BFS, reachability with DFS · BFS ও DFS", `var lines = new Dictionary<string, string[]>
{
    ["Uttara"] = ["Pallabi"], ["Pallabi"] = ["Uttara", "Mirpur10"],
    ["Mirpur10"] = ["Pallabi", "Agargaon"], ["Agargaon"] = ["Mirpur10", "Farmgate"],
    ["Farmgate"] = ["Agargaon", "Motijheel"], ["Motijheel"] = ["Farmgate"],
};

List<string> Bfs(string from, string to)
{
    var parent = new Dictionary<string, string?> { [from] = null };
    var q = new Queue<string>([from]);
    while (q.TryDequeue(out var cur))
    {
        if (cur == to) break;
        foreach (var next in lines[cur])
            if (parent.TryAdd(next, cur)) q.Enqueue(next);   // visited when enqueued
    }
    var path = new List<string>();
    for (string? s = to; s is not null; s = parent[s]) path.Insert(0, s);
    return path;
}
var route = Bfs("Uttara", "Motijheel");
Console.WriteLine($"{route.Count - 1} stops: {string.Join(" -> ", route)}");

var seen = new HashSet<string>();
void Dfs(string s) { if (!seen.Add(s)) return; foreach (var n in lines[s]) Dfs(n); }
Dfs("Farmgate");
Console.WriteLine($"reachable from Farmgate: {seen.Count} stations");`, "5 stops: Uttara -> Pallabi -> Mirpur10 -> Agargaon -> Farmgate -> Motijheel\nreachable from Farmgate: 6 stations")],
  },
  "Tries": {
    s: ["A phone's contact search: type 'R', then 'Ra', then 'Raf', and the list narrows instantly. A trie stores words letter by letter in a tree, so shared beginnings are stored once.", "Phone-এর contact search: 'R', তারপর 'Ra', তারপর 'Raf' টাইপ করলে তালিকা সাথে সাথে ছোট হয়। Trie শব্দগুলো tree-তে অক্ষর ধরে রাখে, তাই একই শুরু একবারই রাখা হয়।"],
    t: ["Each trie node has children keyed by character and a flag for 'a word ends here'. Insert and search are O(length of word), independent of how many words are stored. Prefix queries (autocomplete, 'starts with') are where tries shine. Memory use is higher than a HashSet.", "Trie-র প্রতিটি node-এর অক্ষর ধরে সন্তান থাকে এবং 'এখানে শব্দ শেষ' চিহ্ন থাকে। ঢোকানো ও খোঁজা O(শব্দের দৈর্ঘ্য), কতগুলো শব্দ রাখা আছে তার উপর নির্ভর করে না। Prefix প্রশ্নে (autocomplete, 'শুরু হয়') trie সবচেয়ে ভালো। HashSet-এর চেয়ে memory বেশি লাগে।"],
    p: [["Create a node class with a children dictionary and IsWord.", "Children dictionary ও IsWord-সহ node class বানান।"], ["Insert by walking/creating one node per character.", "প্রতি অক্ষরে একটি node হেঁটে/বানিয়ে ঢোকান।"], ["For prefix search, walk to the prefix node then collect words below it.", "Prefix search-এ prefix node পর্যন্ত হেঁটে নিচের শব্দ সংগ্রহ করুন।"], ["Limit results (top 5) for autocomplete.", "Autocomplete-এ ফল সীমিত করুন (শীর্ষ ৫)।"]],
    m: ["Forgetting the end-of-word flag ('car' found when only 'card' was inserted); case sensitivity; returning all words under a short prefix without a limit.", "শব্দ-শেষের চিহ্ন ভুলে যাওয়া (শুধু 'card' ঢোকালেও 'car' পাওয়া); case-sensitivity; ছোট prefix-এর নিচে সীমা ছাড়া সব শব্দ ফেরত দেওয়া।"],
    q: ["Q: Implement autocomplete for a search box. A: Insert all terms into a trie (optionally with popularity counts), walk to the typed prefix and return the top suggestions below it.", "প্রশ্ন: Search box-এর autocomplete বানান। উত্তর: সব শব্দ trie-তে ঢোকান (দরকারে জনপ্রিয়তার গণনাসহ), টাইপ করা prefix পর্যন্ত হেঁটে নিচের সেরা পরামর্শ ফেরত দিন।"],
    f: ["Tokenizers in language models use related ideas (prefix matching over vocabularies), and routers in web frameworks often use tries for URL matching.", "Language model-এর tokenizer সম্পর্কিত ধারণা (vocabulary-তে prefix মেলানো) ব্যবহার করে, আর web framework-এর router প্রায়ই URL মেলাতে trie ব্যবহার করে।"],
    x: [cs("Autocomplete with a trie · trie দিয়ে autocomplete", `var root = new TrieNode();
foreach (var w in new[] { "rafi", "rahim", "rana", "rabeya", "sami", "rahat" })
{
    var node = root;
    foreach (char c in w) node = node.Children.TryGetValue(c, out var n) ? n : node.Children[c] = new TrieNode();
    node.IsWord = true;
}

List<string> Suggest(string prefix)
{
    var node = root;
    foreach (char c in prefix)
    {
        if (!node.Children.TryGetValue(c, out var child)) return [];
        node = child;
    }
    var found = new List<string>();
    void Collect(TrieNode n, string soFar)
    {
        if (n.IsWord) found.Add(soFar);
        foreach (var (c, child) in n.Children.OrderBy(kv => kv.Key)) Collect(child, soFar + c);
    }
    Collect(node, prefix);
    return found;
}
Console.WriteLine("ra  -> " + string.Join(", ", Suggest("ra")));
Console.WriteLine("rah -> " + string.Join(", ", Suggest("rah")));
Console.WriteLine("x   -> " + (Suggest("x").Count == 0 ? "(none)" : "?"));

class TrieNode { public Dictionary<char, TrieNode> Children = new(); public bool IsWord; }`, "ra  -> rabeya, rafi, rahat, rahim, rana\nrah -> rahat, rahim\nx   -> (none)")],
  },
  "Topological Sort": {
    s: ["Getting dressed: socks before shoes, shirt before tie, but socks and shirt can be in any order. Topological sort finds an order that respects every 'must come before' rule.", "পোশাক পরা: জুতার আগে মোজা, টাইয়ের আগে শার্ট, কিন্তু মোজা ও শার্ট যেকোনো ক্রমে। Topological sort এমন ক্রম খোঁজে যা প্রতিটি 'আগে আসতে হবে' নিয়ম মানে।"],
    t: ["For a directed acyclic graph (DAG), a topological order lists each node before the nodes that depend on it. Kahn's algorithm counts incoming edges (in-degree), starts with nodes at 0, and removes them one by one, decreasing their neighbours' counts. If some nodes are never processed, there is a cycle. O(V + E).", "Directed acyclic graph (DAG)-এ topological ক্রম প্রতিটি node-কে তার উপর নির্ভরশীল node-এর আগে রাখে। Kahn-এর algorithm আসা edge গোনে (in-degree), 0-এর node দিয়ে শুরু করে, একে একে সরায় আর প্রতিবেশীর গণনা কমায়। কিছু node কখনো প্রক্রিয়া না হলে চক্র আছে। O(V + E)।"],
    p: [["List dependencies as edges: prerequisite -> dependent.", "নির্ভরতাকে edge হিসেবে লিখুন: পূর্বশর্ত -> নির্ভরশীল।"], ["Compute in-degree for each node.", "প্রতিটি node-এর in-degree হিসাব করুন।"], ["Queue all nodes with in-degree 0 and process them.", "In-degree 0-এর সব node queue-তে দিয়ে প্রক্রিয়া করুন।"], ["If the output is shorter than the node count, report a cycle.", "Output node-সংখ্যার চেয়ে ছোট হলে চক্র জানান।"]],
    m: ["Reversing edge direction; not detecting cycles; assuming the order is unique (many valid orders exist).", "Edge-এর দিক উল্টে ফেলা; চক্র না ধরা; ক্রম অনন্য ধরে নেওয়া (অনেক বৈধ ক্রম থাকে)।"],
    q: ["Q: Can you finish all courses given prerequisites? A: Build the graph, run Kahn's algorithm; if all courses are processed, yes, otherwise a cycle makes it impossible.", "প্রশ্ন: পূর্বশর্ত দেওয়া থাকলে সব course শেষ করা যাবে? উত্তর: Graph বানিয়ে Kahn-এর algorithm চালান; সব course প্রক্রিয়া হলে হ্যাঁ, নইলে চক্র থাকায় অসম্ভব।"],
    f: ["Build systems (MSBuild), package managers, database migrations, CI pipelines and AI agent task planners all order work with topological sorting.", "Build system (MSBuild), package manager, database migration, CI pipeline ও AI agent-এর task planner সবাই topological sort দিয়ে কাজের ক্রম ঠিক করে।"],
    x: [cs("Order build steps with Kahn's algorithm · Kahn-এর algorithm দিয়ে build ক্রম", `var deps = new (string Before, string After)[]
{
    ("Core", "Data"), ("Core", "Api"), ("Data", "Api"), ("Api", "Tests"), ("Core", "Web"),
};
var nodes = deps.SelectMany(d => new[] { d.Before, d.After }).Distinct().OrderBy(n => n).ToList();
var inDegree = nodes.ToDictionary(n => n, _ => 0);
var next = nodes.ToDictionary(n => n, _ => new List<string>());
foreach (var (b, a) in deps) { next[b].Add(a); inDegree[a]++; }

var ready = new Queue<string>(nodes.Where(n => inDegree[n] == 0));
var order = new List<string>();
while (ready.TryDequeue(out var n))
{
    order.Add(n);
    foreach (var m in next[n].OrderBy(x => x))
        if (--inDegree[m] == 0) ready.Enqueue(m);
}
Console.WriteLine(order.Count == nodes.Count ? "build order: " + string.Join(" -> ", order) : "cycle detected!");`, "build order: Core -> Data -> Web -> Api -> Tests")],
  },
  "Dijkstra's Algorithm": {
    s: ["Planning the fastest route across Dhaka where each road has a different travel time. You always extend the trip from the place you can reach soonest, so you never revisit a place with a worse time. That is Dijkstra.", "ঢাকায় সবচেয়ে দ্রুত পথ পরিকল্পনা, যেখানে প্রতিটি রাস্তার যাত্রার সময় আলাদা। সবসময় সবচেয়ে আগে পৌঁছানো যায় এমন জায়গা থেকে যাত্রা বাড়ান, তাই খারাপ সময় নিয়ে কোনো জায়গায় আবার যান না। এটাই Dijkstra।"],
    t: ["Dijkstra finds the shortest paths from one source in a graph with non-negative weights. A priority queue holds (distance, node); pop the smallest, relax its edges (if dist[u] + w < dist[v], update v and push it). Skip stale entries. With a binary heap it runs in O((V + E) log V). Negative weights need Bellman-Ford.", "Dijkstra অঋণাত্মক ওজনের graph-এ একটি উৎস থেকে সবচেয়ে ছোট পথ খোঁজে। Priority queue (দূরত্ব, node) রাখে; সবচেয়ে ছোটটা নিন, তার edge relax করুন (dist[u] + w < dist[v] হলে v আপডেট করে push)। পুরনো entry বাদ দিন। Binary heap-এ O((V + E) log V)। ঋণাত্মক ওজনে Bellman-Ford লাগে।"],
    p: [["Build a weighted adjacency list.", "ওজনসহ adjacency list বানান।"], ["Set dist[source] = 0, others infinity; push the source.", "dist[source] = 0, বাকিগুলো অসীম; উৎস push করুন।"], ["Pop the closest node; skip if its distance is stale.", "সবচেয়ে কাছের node নিন; দূরত্ব পুরনো হলে বাদ দিন।"], ["Relax edges and record parents to rebuild the path.", "Edge relax করুন এবং পথ আবার বানাতে parent রাখুন।"]],
    m: ["Using it with negative edges; not skipping stale queue entries; using BFS for weighted roads; integer overflow when adding to 'infinity'.", "ঋণাত্মক edge-এ ব্যবহার; পুরনো queue entry বাদ না দেওয়া; ওজনযুক্ত রাস্তায় BFS; 'অসীম'-এ যোগ করে integer overflow।"],
    q: ["Q: Why does Dijkstra fail with negative edges? A: It finalises a node when it is popped; a later negative edge could make that node cheaper, but it will not be revisited.", "প্রশ্ন: ঋণাত্মক edge-এ Dijkstra কেন ব্যর্থ? উত্তর: Pop হওয়ার সময় node চূড়ান্ত করে; পরে ঋণাত্মক edge সেটিকে সস্তা করতে পারে, কিন্তু আর ফিরে দেখা হয় না।"],
    f: ["Ride-sharing, delivery routing, network routing protocols and game AI all build on shortest-path algorithms like Dijkstra and A*.", "Ride-sharing, delivery routing, network routing protocol ও game AI সবই Dijkstra ও A*-এর মতো সবচেয়ে ছোট পথের algorithm-এর উপর তৈরি।"],
    x: [cs("Fastest route across town · শহরজুড়ে দ্রুততম পথ", `var roads = new Dictionary<string, (string To, int Minutes)[]>
{
    ["Mirpur"] = [("Farmgate", 25), ("Gulshan", 30)],
    ["Farmgate"] = [("Motijheel", 20), ("Gulshan", 10)],
    ["Gulshan"] = [("Motijheel", 25)],
    ["Motijheel"] = [],
};
var dist = roads.Keys.ToDictionary(k => k, _ => int.MaxValue);
var parent = new Dictionary<string, string>();
var pq = new PriorityQueue<string, int>();
dist["Mirpur"] = 0;
pq.Enqueue("Mirpur", 0);

while (pq.TryDequeue(out var u, out int d))
{
    if (d > dist[u]) continue;                       // stale entry
    foreach (var (v, w) in roads[u])
        if (d + w < dist[v]) { dist[v] = d + w; parent[v] = u; pq.Enqueue(v, dist[v]); }
}

var path = new List<string> { "Motijheel" };
while (parent.TryGetValue(path[0], out var p)) path.Insert(0, p);
Console.WriteLine($"{dist["Motijheel"]} min: {string.Join(" -> ", path)}");
Console.WriteLine($"to Gulshan: {dist["Gulshan"]} min");`, "45 min: Mirpur -> Farmgate -> Motijheel\nto Gulshan: 30 min")],
  },
  "Union Find": {
    s: ["At a party, people form friend circles. When two people from different circles become friends, their circles merge. To check if two people are connected, you just ask: 'Who is your circle's leader?'", "পার্টিতে মানুষ বন্ধুত্বের বৃত্ত গড়ে। দুই ভিন্ন বৃত্তের দুজন বন্ধু হলে বৃত্ত মিশে যায়। দুজন যুক্ত কি না দেখতে শুধু জিজ্ঞেস করুন: 'তোমার বৃত্তের নেতা কে?'"],
    t: ["Union-Find (disjoint set union) tracks groups. Find(x) returns the group representative; Union(a, b) merges two groups. With path compression and union by rank/size, both are nearly O(1) (inverse Ackermann). It answers connectivity questions, counts components and detects cycles in Kruskal's minimum spanning tree.", "Union-Find (disjoint set union) দল track করে। Find(x) দলের প্রতিনিধি দেয়; Union(a, b) দুটি দল মেলায়। Path compression ও rank/size অনুযায়ী union-সহ দুটোই প্রায় O(1) (inverse Ackermann)। এটি সংযোগের প্রশ্নের উত্তর দেয়, component গোনে এবং Kruskal-এর minimum spanning tree-তে চক্র ধরে।"],
    p: [["Start with parent[i] = i (everyone is their own leader).", "parent[i] = i দিয়ে শুরু (সবাই নিজের নেতা)।"], ["Find with path compression.", "Path compression-সহ Find করুন।"], ["Union by attaching the smaller tree under the larger.", "ছোট tree-কে বড়টার নিচে জুড়ে Union করুন।"], ["Count components by decreasing a counter on each successful union.", "প্রতিটি সফল union-এ counter কমিয়ে component গুনুন।"]],
    m: ["Comparing parent[a] == parent[b] instead of Find(a) == Find(b); skipping path compression on big inputs; using it when edges get removed (it only supports merging).", "Find(a) == Find(b)-এর বদলে parent[a] == parent[b] তুলনা; বড় input-এ path compression বাদ; edge মোছা লাগলে ব্যবহার (এটি শুধু মেলানো সমর্থন করে)।"],
    q: ["Q: Given network cables between computers, how many separate networks are there? A: Union every cable's endpoints; the remaining component count is the answer.", "প্রশ্ন: কম্পিউটারগুলোর মধ্যে network cable দেওয়া থাকলে কয়টি আলাদা network? উত্তর: প্রতিটি cable-এর দুই প্রান্ত union করুন; বাকি component-এর সংখ্যাই উত্তর।"],
    f: ["Union-Find powers image segmentation, network clustering and deduplicating records that refer to the same customer, a common data-cleaning step before AI projects.", "Union-Find image segmentation, network clustering আর একই customer বোঝানো record-এর deduplication চালায়, যা AI project-এর আগে প্রচলিত data-পরিষ্কার ধাপ।"],
    x: [cs("Count friend circles · বন্ধুত্বের বৃত্ত গোনা", `string[] people = ["Asha", "Rafi", "Mina", "Tanvir", "Joya", "Sami"];
int[] parent = Enumerable.Range(0, people.Length).ToArray();
int[] size = Enumerable.Repeat(1, people.Length).ToArray();
int groups = people.Length;

int Find(int x) => parent[x] == x ? x : parent[x] = Find(parent[x]);   // path compression
void Union(int a, int b)
{
    int ra = Find(a), rb = Find(b);
    if (ra == rb) return;
    if (size[ra] < size[rb]) (ra, rb) = (rb, ra);
    parent[rb] = ra; size[ra] += size[rb]; groups--;
}

Union(0, 1); Union(1, 2); Union(3, 4);
Console.WriteLine($"circles: {groups}");
Console.WriteLine($"Asha & Mina connected? {Find(0) == Find(2)}");
Console.WriteLine($"Asha & Joya connected? {Find(0) == Find(4)}");
foreach (var g in Enumerable.Range(0, people.Length).GroupBy(Find))
    Console.WriteLine("  { " + string.Join(", ", g.Select(i => people[i])) + " }");`, "circles: 3\nAsha & Mina connected? True\nAsha & Joya connected? False\n  { Asha, Rafi, Mina }\n  { Tanvir, Joya }\n  { Sami }")],
  },
  "Greedy Algorithms": {
    s: ["Giving change with the fewest notes: take the biggest note that fits, then the next biggest, and so on. For Bangladeshi taka notes this works perfectly. Greedy means always taking the best-looking choice right now.", "সবচেয়ে কম নোটে ভাংতি দেওয়া: যা মানায় তার মধ্যে সবচেয়ে বড় নোট নিন, তারপর পরেরটা, এভাবে। বাংলাদেশি টাকার নোটে এটি নিখুঁত কাজ করে। Greedy মানে সবসময় এখনকার সেরা দেখতে বিকল্প নেওয়া।"],
    t: ["A greedy algorithm makes a locally optimal choice at each step and never reconsiders. It is fast and simple, but correct only when the problem has the 'greedy choice property'. Classic wins: interval scheduling (pick the meeting that ends earliest), Huffman coding, and Kruskal/Prim spanning trees. When greedy fails (coins 1, 3, 4 for 6), use dynamic programming.", "Greedy algorithm প্রতিটি ধাপে স্থানীয়ভাবে সেরা বিকল্প নেয় এবং আর ভাবে না। দ্রুত ও সহজ, কিন্তু সঠিক শুধু যখন সমস্যার 'greedy choice property' থাকে। প্রচলিত জয়: interval scheduling (যে meeting আগে শেষ হয় তা নিন), Huffman coding, আর Kruskal/Prim spanning tree। Greedy ব্যর্থ হলে (৬-এর জন্য ১, ৩, ৪ মুদ্রা) dynamic programming দিন।"],
    p: [["Identify the choice made at each step.", "প্রতিটি ধাপে কোন বিকল্প নেওয়া হয় চিহ্নিত করুন।"], ["Sort by the key that defines 'best' (end time, value per weight).", "'সেরা' বোঝানো key দিয়ে sort করুন (শেষের সময়, ওজন-প্রতি মান)।"], ["Take choices that stay valid.", "বৈধ থাকা বিকল্পগুলো নিন।"], ["Try a counter-example to make sure greedy is correct.", "Greedy সঠিক কি না নিশ্চিত হতে একটি বিপরীত উদাহরণ চেষ্টা করুন।"]],
    m: ["Assuming greedy works without proof; sorting by the wrong key (start time instead of end time); using greedy for 0/1 knapsack.", "প্রমাণ ছাড়া greedy কাজ করবে ধরে নেওয়া; ভুল key দিয়ে sort (শেষের বদলে শুরুর সময়); 0/1 knapsack-এ greedy।"],
    q: ["Q: Maximum number of non-overlapping meetings? A: Sort by end time, pick each meeting whose start is after the last picked end. Proof: finishing earliest leaves the most room.", "প্রশ্ন: সর্বোচ্চ কয়টি না-মেলা meeting? উত্তর: শেষের সময় দিয়ে sort করে, শেষ বাছাই করা meeting-এর শেষের পরে শুরু হওয়া প্রতিটি নিন। প্রমাণ: সবচেয়ে আগে শেষ করলে সবচেয়ে বেশি জায়গা থাকে।"],
    f: ["Schedulers, load balancers and AI model routers often use greedy heuristics because they are fast. Knowing when they can be wrong makes you a better system designer.", "Scheduler, load balancer ও AI model router প্রায়ই দ্রুত বলে greedy heuristic ব্যবহার করে। কখন তারা ভুল হতে পারে জানলে আপনি ভালো system designer হবেন।"],
    x: [cs("Change-making and meeting scheduling · ভাংতি ও meeting সাজানো", `int[] notes = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
int amount = 1788;
var used = new List<string>();
foreach (int n in notes)
    if (amount >= n) { used.Add($"{amount / n}x{n}"); amount %= n; }
Console.WriteLine("change: " + string.Join(" ", used));

var meetings = new (string Name, int Start, int End)[]
    { ("standup", 9, 10), ("design", 9, 12), ("1:1", 10, 11), ("lunch talk", 11, 13), ("review", 12, 14) };
int lastEnd = 0;
var picked = new List<string>();
foreach (var m in meetings.OrderBy(m => m.End))
    if (m.Start >= lastEnd) { picked.Add(m.Name); lastEnd = m.End; }
Console.WriteLine("meetings: " + string.Join(", ", picked));`, "change: 1x1000 1x500 1x200 1x50 1x20 1x10 1x5 1x2 1x1\nmeetings: standup, 1:1, lunch talk")],
  },
  "Dynamic Programming": {
    s: ["Climbing stairs one or two steps at a time: the number of ways to reach step 10 is the ways to reach step 9 plus the ways to reach step 8. Write answers for small steps on a notepad and reuse them. That notepad is dynamic programming.", "সিঁড়ি একবারে এক বা দুই ধাপ ওঠা: ১০ নম্বর ধাপে পৌঁছানোর উপায় = ৯-এ পৌঁছানোর উপায় + ৮-এ পৌঁছানোর উপায়। ছোট ধাপের উত্তর খাতায় লিখে আবার ব্যবহার করুন। সেই খাতাই dynamic programming।"],
    t: ["DP solves problems with overlapping subproblems and optimal substructure. Define the state (dp[i] = best answer for the first i items), the transition (how dp[i] uses smaller states) and base cases. Top-down = recursion + memo; bottom-up = fill a table. Classic examples: coin change, knapsack, longest common subsequence, edit distance.", "DP সেই সমস্যা সমাধান করে যেখানে উপ-সমস্যা মিলে যায় এবং সেরা উপ-কাঠামো থাকে। অবস্থা (dp[i] = প্রথম i item-এর সেরা উত্তর), রূপান্তর (dp[i] ছোট অবস্থা কীভাবে ব্যবহার করে) ও base case ঠিক করুন। Top-down = recursion + memo; bottom-up = table ভরা। প্রচলিত উদাহরণ: coin change, knapsack, longest common subsequence, edit distance।"],
    p: [["Write a brute-force recursive solution first.", "আগে brute-force recursive সমাধান লিখুন।"], ["Notice repeated calls and define dp[state].", "পুনরাবৃত্ত call লক্ষ্য করে dp[state] ঠিক করুন।"], ["Write the transition and base cases.", "রূপান্তর ও base case লিখুন।"], ["Convert to a bottom-up table and reduce memory if possible.", "Bottom-up table-এ রূপ দিন এবং সম্ভব হলে memory কমান।"]],
    m: ["Unclear state definition; wrong loop order in bottom-up; using greedy where DP is needed (coins 1, 3, 4 for 6: greedy gives 3 coins, DP gives 2).", "অস্পষ্ট অবস্থার সংজ্ঞা; bottom-up-এ ভুল loop-ক্রম; DP দরকার হলেও greedy (৬-এর জন্য ১, ৩, ৪ মুদ্রা: greedy ৩টি, DP ২টি দেয়)।"],
    q: ["Q: Minimum edits to turn 'kitten' into 'sitting'? A: Edit distance DP over prefixes: dp[i][j] = min(delete, insert, replace). Answer 3.", "প্রশ্ন: 'kitten'-কে 'sitting' বানাতে ন্যূনতম কয়টি পরিবর্তন? উত্তর: Prefix-এর উপর edit distance DP: dp[i][j] = min(মোছা, ঢোকানো, বদলানো)। উত্তর ৩।"],
    f: ["Edit distance powers spell-checkers and fuzzy search; DP ideas also appear in sequence alignment, speech recognition and some text-generation decoding methods.", "Edit distance spell-checker ও fuzzy search চালায়; DP-র ধারণা sequence alignment, speech recognition ও কিছু text-generation decoding পদ্ধতিতেও দেখা যায়।"],
    x: [cs("Coin change and edit distance · coin change ও edit distance", `int MinCoins(int[] coins, int amount)
{
    var dp = Enumerable.Repeat(int.MaxValue, amount + 1).ToArray();
    dp[0] = 0;
    for (int a = 1; a <= amount; a++)
        foreach (int c in coins)
            if (c <= a && dp[a - c] != int.MaxValue) dp[a] = Math.Min(dp[a], dp[a - c] + 1);
    return dp[amount] == int.MaxValue ? -1 : dp[amount];
}
Console.WriteLine($"coins [1,3,4] for 6: {MinCoins([1, 3, 4], 6)} (greedy would use 3)");

int Edit(string s, string t)
{
    var dp = new int[s.Length + 1, t.Length + 1];
    for (int i = 0; i <= s.Length; i++) dp[i, 0] = i;
    for (int j = 0; j <= t.Length; j++) dp[0, j] = j;
    for (int i = 1; i <= s.Length; i++)
        for (int j = 1; j <= t.Length; j++)
            dp[i, j] = s[i - 1] == t[j - 1] ? dp[i - 1, j - 1]
                     : 1 + Math.Min(dp[i - 1, j - 1], Math.Min(dp[i - 1, j], dp[i, j - 1]));
    return dp[s.Length, t.Length];
}
Console.WriteLine($"kitten -> sitting: {Edit("kitten", "sitting")} edits");
Console.WriteLine($"dhaka -> daka: {Edit("dhaka", "daka")} edit");`, "coins [1,3,4] for 6: 2 (greedy would use 3)\nkitten -> sitting: 3 edits\ndhaka -> daka: 1 edit")],
  },
};
