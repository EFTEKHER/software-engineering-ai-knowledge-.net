import {
  cs,
  recorder,
  ptr,
  span,
  A,
  Grid,
  List,
  Map_,
  Bits,
  Chips,
  lc,
} from "./kit.js";
// Every text is [English, বাংলা]. Step captions too.

// ---------------------------------------------------------------- 01 Arrays
const arrays = {
  id: 1,
  slug: "arrays",
  name: "Arrays",
  level: 0,
  problem: lc(121, "Best Time to Buy and Sell Stock", "Easy"),
  input: "prices = [7, 1, 5, 3, 6, 4]",
  expected: "5  (buy at 1, sell at 6)",
  idea: [
    "An array is a row of numbered boxes. You can jump to any box instantly by its index. Most array problems are solved with ONE pass from left to right while remembering a small summary of what you have already seen.",
    "অ্যারে মানে সারি সারি নম্বর দেওয়া বাক্স — index দিয়ে যেকোনো বাক্সে সাথে সাথে যাওয়া যায়। বেশিরভাগ অ্যারে সমস্যা বাম থেকে ডানে একবার হেঁটেই সমাধান হয়, শুধু যা দেখেছেন তার ছোট একটা সারাংশ মনে রাখতে হয়।",
  ],
  analogy: [
    "Walking past a row of shops while remembering the cheapest price you've seen so far.",
    "সারি সারি দোকানের পাশ দিয়ে হাঁটছেন, আর এখন পর্যন্ত দেখা সবচেয়ে কম দামটা মনে রাখছেন।",
  ],
  signals: [
    [
      "Input is a list of numbers and you need a max / min / count",
      "ইনপুট সংখ্যার তালিকা, আর লাগবে সর্বোচ্চ / সর্বনিম্ন / গণনা",
    ],
    [
      '"Best so far" can be updated with each new element',
      'প্রতিটি নতুন উপাদানে "এখন পর্যন্ত সেরা" আপডেট করা যায়',
    ],
    [
      "O(n) single pass is expected; nested loops would be O(n²)",
      "একবারের লুপে O(n) চাই; লুপের ভেতর লুপ হলে O(n²)",
    ],
  ],
  code: cs(`
public int MaxProfit(int[] prices)
{
    int minPrice = int.MaxValue; //@init
    int best = 0;
    foreach (int p in prices) //@loop
    {
        if (p < minPrice) minPrice = p; //@min
        else best = Math.Max(best, p - minPrice); //@profit
    }
    return best; //@ret
}`),
  trace() {
    const prices = [7, 1, 5, 3, 6, 4];
    const r = recorder();
    let min = Infinity,
      best = 0,
      minAt = -1;
    const v = () => ({ minPrice: min === Infinity ? "∞" : min, best });
    r.step(
      "init",
      [
        "Start: nothing bought yet. minPrice = ∞, best profit = 0.",
        "শুরু: এখনো কিছু কেনা হয়নি। minPrice = ∞, best = 0।",
      ],
      [A(prices, { label: "prices" })],
      v(),
    );
    prices.forEach((p, i) => {
      const P = (hi) => [
        A(prices, {
          label: "prices",
          ptr: ptr([
            [minAt, "buy"],
            [i, "today"],
          ]),
          hi,
        }),
      ];
      r.step(
        "loop",
        [`Day ${i}: price is ${p}.`, `দিন ${i}: দাম ${p}।`],
        P({ [i]: "active", [minAt]: "good" }),
        v(),
      );
      if (p < min) {
        min = p;
        minAt = i;
        r.step(
          "min",
          [
            `${p} is the cheapest so far → remember it as the best day to BUY.`,
            `${p} এখন পর্যন্ত সবচেয়ে কম দাম → কেনার সেরা দিন হিসেবে মনে রাখি।`,
          ],
          P({ [i]: "good" }),
          v(),
        );
      } else {
        const profit = p - min;
        const better = profit > best;
        best = Math.max(best, profit);
        r.step(
          "profit",
          [
            `Selling today earns ${p} − ${min} = ${profit}. ${better ? "New best profit!" : "Not better than " + best + "."}`,
            `আজ বিক্রি করলে লাভ ${p} − ${min} = ${profit}। ${better ? "নতুন সেরা লাভ!" : best + "-এর চেয়ে ভালো না।"}`,
          ],
          P({ [i]: better ? "good" : "active", [minAt]: "done" }),
          v(),
        );
      }
    });
    r.step(
      "ret",
      [
        `Done in one pass. Maximum profit = ${best}.`,
        `একবার হেঁটেই শেষ। সর্বোচ্চ লাভ = ${best}।`,
      ],
      [A(prices, { label: "prices" })],
      v(),
      String(best),
    );
    return { frames: r.frames, result: best };
  },
  check: (x) => x === 5,
  complexity: { time: "O(n)", space: "O(1)" },
  mistakes: [
    [
      "Two nested loops (check every pair) → O(n²), times out.",
      "দুটো লুপ দিয়ে সব জোড়া দেখা → O(n²), সময় শেষ হয়ে যায়।",
    ],
    [
      "Selling before buying: always subtract the minimum seen BEFORE today.",
      "কেনার আগে বিক্রি: সবসময় আজকের আগের সর্বনিম্ন দাম বিয়োগ করুন।",
    ],
    [
      "Starting best at int.MinValue: if prices only fall, the answer must be 0.",
      "best = int.MinValue দিয়ে শুরু করা ভুল: দাম শুধু কমলে উত্তর ০।",
    ],
  ],
  followups: [
    [
      [
        "What if you can buy and sell many times?",
        "অনেকবার কেনাবেচা করা গেলে?",
      ],
      [
        "Add every positive day-to-day increase (LeetCode 122) — a greedy sum.",
        "প্রতিদিনের প্রতিটি বৃদ্ধি যোগ করুন (LeetCode 122) — greedy।",
      ],
    ],
    [
      ["Why is this O(1) space?", "কেন O(1) মেমরি?"],
      [
        "We only keep two integers (minPrice, best), no matter how big the input is.",
        "ইনপুট যত বড়ই হোক, শুধু দুটো int (minPrice, best) রাখি।",
      ],
    ],
  ],
  practice: [
    lc(121, "Best Time to Buy and Sell Stock", "Easy"),
    lc(217, "Contains Duplicate", "Easy"),
    lc(238, "Product of Array Except Self", "Medium"),
    lc(189, "Rotate Array", "Medium"),
    lc(41, "First Missing Positive", "Hard"),
  ],
};

// --------------------------------------------------------------- 02 Strings
const strings = {
  id: 2,
  slug: "strings",
  name: "Strings",
  level: 0,
  problem: lc(242, "Valid Anagram", "Easy"),
  input: 's = "anagram", t = "nagaram"',
  expected: "true",
  idea: [
    "A string is an array of characters. A classic trick: count how many times each letter appears using an int[26] array (one slot per letter a–z) instead of comparing letters one by one.",
    "স্ট্রিং মানে অক্ষরের অ্যারে। ক্লাসিক কৌশল: ২৬ ঘরের int[26] অ্যারেতে প্রতিটি অক্ষর কতবার এল গুনুন — s-এর অক্ষরে +১, t-এর অক্ষরে −১। শেষে সব ০ হলে দুটো anagram।",
  ],
  analogy: [
    "Two bags of letter tiles: add tiles from bag S, remove tiles from bag T. If the table is empty at the end, the bags were identical.",
    "দুই ব্যাগ অক্ষর-টাইল: S থেকে টাইল টেবিলে রাখুন, T-এর টাইল দিয়ে সরান। শেষে টেবিল ফাঁকা হলে দুই ব্যাগ একই।",
  ],
  signals: [
    ["Compare letters between strings", "দুই স্ট্রিংয়ের অক্ষর তুলনা"],
    [
      "Only lowercase English letters → int[26] is enough",
      "শুধু ছোট হাতের ইংরেজি অক্ষর → int[26] যথেষ্ট",
    ],
    [
      "Order doesn't matter, only frequency does",
      "ক্রম জরুরি না, শুধু কতবার এসেছে সেটা জরুরি",
    ],
  ],
  code: cs(`
public bool IsAnagram(string s, string t)
{
    if (s.Length != t.Length) return false; //@len
    int[] count = new int[26]; //@arr
    for (int i = 0; i < s.Length; i++) //@loop
    {
        count[s[i] - 'a']++; //@inc
        count[t[i] - 'a']--; //@dec
    }
    foreach (int c in count) //@check
        if (c != 0) return false;
    return true; //@ret
}`),
  trace() {
    const s = "anagram",
      t = "nagaram";
    const letters = [...new Set((s + t).split(""))].sort();
    const count = {};
    letters.forEach((c) => (count[c] = 0));
    const r = recorder();
    const M = (hi) =>
      Map_(
        letters.map((c) => [c, count[c]]),
        { label: "count[letter]", hi },
      );
    const P = (i, hi, cmap) => [
      A(s.split(""), { label: "s", ptr: ptr([[i, "i"]]), hi: { [i]: hi } }),
      A(t.split(""), { label: "t", ptr: ptr([[i, "i"]]), hi: { [i]: hi } }),
      M(cmap),
    ];
    r.step(
      "len",
      [
        "Both strings have length 7, so they could be anagrams.",
        "দুটোর দৈর্ঘ্য ৭, তাই anagram হতে পারে। এগোই।",
      ],
      P(-1),
      {},
    );
    r.step(
      "arr",
      [
        "Create a counter with one slot per letter (only letters that appear are shown).",
        "প্রতিটি অক্ষরের জন্য একটা গণনা-ঘর বানাই (শুধু যেগুলো আছে সেগুলো দেখানো)।",
      ],
      P(-1),
      {},
    );
    for (let i = 0; i < s.length; i++) {
      r.step(
        "loop",
        [
          `i = ${i}: s[${i}] = '${s[i]}', t[${i}] = '${t[i]}'.`,
          `i = ${i}: s[${i}] = '${s[i]}', t[${i}] = '${t[i]}' দেখি।`,
        ],
        P(i, "active"),
        { i },
      );
      count[s[i]]++;
      r.step(
        "inc",
        [
          `'${s[i]}' is from s → count['${s[i]}']++ → ${count[s[i]]}.`,
          `'${s[i]}' এসেছে s থেকে → +১ → ${count[s[i]]}।`,
        ],
        P(i, "good", { [s[i]]: "good" }),
        { i },
      );
      count[t[i]]--;
      r.step(
        "dec",
        [
          `'${t[i]}' is from t → count['${t[i]}']-- → ${count[t[i]]}.`,
          `'${t[i]}' এসেছে t থেকে → −১ → ${count[t[i]]}।`,
        ],
        P(i, "bad", { [t[i]]: "bad" }),
        { i },
      );
    }
    const ok = Object.values(count).every((x) => x === 0);
    r.step(
      "check",
      [
        "Check every slot: is anything not zero?",
        "সব ঘর দেখি: কোনোটা কি ০ নয়?",
      ],
      P(
        -1,
        null,
        Object.fromEntries(
          letters.map((c) => [c, count[c] === 0 ? "good" : "bad"]),
        ),
      ),
      {},
    );
    r.step(
      "ret",
      ok
        ? [
            "Every counter is 0 → same letters, same amounts → TRUE.",
            "সব ঘর ০ → একই অক্ষর, একই সংখ্যায় → TRUE।",
          ]
        : ["Some counter isn't 0 → FALSE.", "কোনো ঘর ০ নয় → FALSE।"],
      P(-1),
      {},
      String(ok),
    );
    return { frames: r.frames, result: ok };
  },
  check: (x) => x === true,
  complexity: { time: "O(n)", space: "O(1) — always 26 slots" },
  mistakes: [
    [
      "Sorting both strings works but costs O(n log n).",
      "দুটো sort করলেও হয়, কিন্তু খরচ O(n log n)।",
    ],
    ["Forgetting the length check first.", "শুরুতে দৈর্ঘ্য মেলানো ভুলে যাওয়া।"],
    [
      "Unicode input? Use Dictionary<char,int> instead of int[26].",
      "Unicode ইনপুট হলে int[26]-এর বদলে Dictionary<char,int>।",
    ],
  ],
  followups: [
    [
      ["What if the input has Unicode characters?", "ইনপুটে Unicode থাকলে?"],
      [
        "Use a Dictionary<char, int>, because 26 slots are no longer enough.",
        "Dictionary<char, int> ব্যবহার করুন, কারণ ২৬টা ঘর আর যথেষ্ট না।",
      ],
    ],
    [
      [
        "How do you group many words that are anagrams?",
        "অনেক শব্দকে anagram অনুযায়ী দলে ভাগ করবেন কীভাবে?",
      ],
      [
        "Use the sorted word (or the 26-count signature) as a dictionary key — LeetCode 49.",
        "sort করা শব্দ (বা ২৬-গণনার স্বাক্ষর) কে Dictionary-র key বানান — LeetCode 49।",
      ],
    ],
  ],
  practice: [
    lc(242, "Valid Anagram", "Easy"),
    lc(14, "Longest Common Prefix", "Easy"),
    lc(49, "Group Anagrams", "Medium"),
    lc(5, "Longest Palindromic Substring", "Medium"),
    lc(151, "Reverse Words in a String", "Medium"),
  ],
};

// -------------------------------------------------------- 03 Bit Manipulation
const bits = {
  id: 3,
  slug: "bit-manipulation",
  name: "Bit Manipulation",
  level: 0,
  problem: lc(136, "Single Number", "Easy"),
  input: "nums = [4, 1, 2, 1, 2]",
  expected: "4",
  idea: [
    "Numbers are stored as bits (0/1). XOR (^) has two magic rules: x ^ x = 0 and x ^ 0 = x. So if every number appears twice except one, XOR-ing everything cancels the pairs and leaves the lonely number.",
    "সংখ্যা জমা থাকে বিট (০/১) হিসেবে। XOR (^)-এর দুটো জাদু নিয়ম: x ^ x = 0 আর x ^ 0 = x। তাই সব সংখ্যা XOR করলে জোড়াগুলো কেটে যায়, একা সংখ্যাটা থেকে যায়।",
  ],
  analogy: [
    "A light switch: flip it twice and it's back to off. Only the switch flipped once stays on.",
    "লাইটের সুইচ: দুবার টিপলে আবার বন্ধ। যেটা একবার টেপা হয়েছে, শুধু সেটাই জ্বলে থাকে।",
  ],
  signals: [
    ['"Every element appears twice except one"', '"একটা ছাড়া সবাই দুবার আছে"'],
    ["Asked for O(1) extra space", "অতিরিক্ত মেমরি O(1) চাওয়া হয়েছে"],
    [
      "Powers of two, counting set bits, toggling flags",
      "২-এর ঘাত, ১-বিট গোনা, ফ্ল্যাগ চালু/বন্ধ",
    ],
  ],
  code: cs(`
public int SingleNumber(int[] nums)
{
    int result = 0; //@init
    foreach (int n in nums) //@loop
        result ^= n; //@xor
    return result; //@ret
}`),
  trace() {
    const nums = [4, 1, 2, 1, 2];
    const r = recorder();
    let res = 0;
    r.step(
      "init",
      [
        "result starts at 0 (000 in binary). XOR with 0 changes nothing.",
        "result = ০ (বাইনারিতে 000) দিয়ে শুরু। ০-এর সাথে XOR কিছুই বদলায় না।",
      ],
      [
        A(nums, { label: "nums" }),
        Bits([{ label: "result", value: 0 }], { width: 3 }),
      ],
      { result: 0 },
    );
    nums.forEach((n, i) => {
      const b = n.toString(2).padStart(3, "0");
      r.step(
        "loop",
        [
          `Take nums[${i}] = ${n} (binary ${b}).`,
          `nums[${i}] = ${n} নিই (বাইনারি ${b})।`,
        ],
        [
          A(nums, {
            label: "nums",
            hi: { [i]: "active" },
            ptr: ptr([[i, "n"]]),
          }),
          Bits(
            [
              { label: "result", value: res },
              { label: "n", value: n },
            ],
            { width: 3 },
          ),
        ],
        { result: res, n },
      );
      const before = res;
      res ^= n;
      r.step(
        "xor",
        [
          `Bit by bit: same bits → 0, different → 1. ${before} ^ ${n} = ${res}.`,
          `প্রতিটি বিটে: একই হলে ০, আলাদা হলে ১। ${before} ^ ${n} = ${res}।`,
        ],
        [
          A(nums, { label: "nums", hi: { [i]: "good" } }),
          Bits(
            [
              { label: "before", value: before },
              { label: "^ n", value: n },
              { label: "= result", value: res, hi: true },
            ],
            { width: 3 },
          ),
        ],
        { result: res, n },
      );
    });
    r.step(
      "ret",
      [
        `The pairs (1,1) and (2,2) cancelled out. Lonely number = ${res}.`,
        `(1,1) আর (2,2) জোড়া কেটে গেছে। একা সংখ্যা = ${res}।`,
      ],
      [
        A(nums, { label: "nums", hi: { 0: "good" } }),
        Bits([{ label: "result", value: res, hi: true }], { width: 3 }),
      ],
      { result: res },
      String(res),
    );
    return { frames: r.frames, result: res };
  },
  check: (x) => x === 4,
  complexity: { time: "O(n)", space: "O(1)" },
  mistakes: [
    [
      "A HashSet works but costs O(n) memory.",
      "HashSet দিয়েও হয়, কিন্তু O(n) মেমরি লাগে।",
    ],
    [
      "In C#, ^ is XOR, NOT power (use Math.Pow).",
      "C#-এ ^ মানে XOR, ঘাত নয় (ঘাতের জন্য Math.Pow)।",
    ],
    [
      ">> keeps the sign on negatives; use >>> for a logical shift.",
      "ঋণাত্মক সংখ্যায় >> চিহ্ন রাখে; লজিক্যাল শিফটে >>>।",
    ],
  ],
  followups: [
    [
      [
        "How do you check if n is a power of two?",
        "n ২-এর ঘাত কি না কীভাবে বুঝবেন?",
      ],
      [
        "n > 0 && (n & (n - 1)) == 0 — a power of two has exactly one 1-bit.",
        "n > 0 && (n & (n - 1)) == 0 — ২-এর ঘাতে ঠিক একটা ১-বিট থাকে।",
      ],
    ],
    [
      ["How do you count 1-bits?", "১-বিট গুনবেন কীভাবে?"],
      [
        "Repeat n &= n - 1 (clears the lowest 1) and count, or use BitOperations.PopCount.",
        "n &= n - 1 (সবচেয়ে নিচের ১ মুছে দেয়) বারবার করে গুনুন, অথবা BitOperations.PopCount।",
      ],
    ],
  ],
  practice: [
    lc(136, "Single Number", "Easy"),
    lc(191, "Number of 1 Bits", "Easy"),
    lc(338, "Counting Bits", "Easy"),
    lc(268, "Missing Number", "Easy"),
    lc(190, "Reverse Bits", "Easy"),
    lc(371, "Sum of Two Integers", "Medium"),
  ],
};

// ------------------------------------------------------------- 04 Hash Tables
const hash = {
  id: 4,
  slug: "hash-tables",
  name: "Hash Tables",
  level: 0,
  problem: lc(1, "Two Sum", "Easy"),
  input: "nums = [3, 8, 11, 2, 7], target = 9",
  expected: "[3, 4]  (2 + 7 = 9)",
  idea: [
    'A Dictionary answers "have I seen X before?" in O(1). For Two Sum, for each number ask: is (target − number) already in my dictionary? If yes, done. If not, store this number and move on.',
    'Dictionary "X কি আগে দেখেছি?" প্রশ্নের উত্তর দেয় O(1)-এ। প্রতিটি সংখ্যায় জিজ্ঞেস করুন: (target − সংখ্যা) কি Dictionary-তে আছে? থাকলে উত্তর পেয়ে গেছি; না থাকলে সংখ্যাটা রেখে সামনে যাই।',
  ],
  analogy: [
    "A guest list at the door: checking a name takes one glance, not reading the whole list.",
    "দরজায় অতিথির তালিকা: নাম আছে কি না দেখতে এক নজর লাগে, পুরো তালিকা পড়তে হয় না।",
  ],
  signals: [
    ['"Find a pair / complement / duplicate"', '"জোড়া / পরিপূরক / ডুপ্লিকেট খুঁজুন"'],
    ["Need fast lookups by value", "মান দিয়ে দ্রুত খোঁজা দরকার"],
    [
      "Counting frequencies or grouping items",
      "কতবার এসেছে গোনা বা দলে ভাগ করা",
    ],
  ],
  code: cs(`
public int[] TwoSum(int[] nums, int target)
{
    var seen = new Dictionary<int, int>(); // value -> index //@init
    for (int i = 0; i < nums.Length; i++) //@loop
    {
        int need = target - nums[i]; //@need
        if (seen.TryGetValue(need, out int j)) //@check
            return new[] { j, i }; //@found
        seen[nums[i]] = i; //@store
    }
    return Array.Empty<int>();
}`),
  trace() {
    const nums = [3, 8, 11, 2, 7],
      target = 9;
    const r = recorder();
    const seen = new Map();
    const M = (hi) => Map_([...seen], { label: "seen: value → index", hi });
    r.step(
      "init",
      [
        "Empty dictionary. It will remember every number we pass (value → index).",
        "খালি Dictionary। যে সংখ্যা পার হব সেগুলো মনে রাখবে (মান → index)।",
      ],
      [A(nums, { label: "nums" }), M()],
      { target },
    );
    for (let i = 0; i < nums.length; i++) {
      const need = target - nums[i];
      const N = (hi, mh, p) => [
        A(nums, { label: "nums", ptr: ptr(p || [[i, "i"]]), hi }),
        M(mh),
      ];
      r.step(
        "loop",
        [`i = ${i}, nums[i] = ${nums[i]}.`, `i = ${i}, nums[i] = ${nums[i]}।`],
        N({ [i]: "active" }),
        { target, i },
      );
      r.step(
        "need",
        [
          `To reach ${target} we need ${target} − ${nums[i]} = ${need}.`,
          `${target} বানাতে লাগবে ${target} − ${nums[i]} = ${need}।`,
        ],
        N({ [i]: "active" }),
        { target, i, need },
      );
      if (seen.has(need)) {
        const j = seen.get(need);
        r.step(
          "check",
          [
            `Is ${need} in the dictionary? YES, at index ${j}!`,
            `${need} কি Dictionary-তে আছে? হ্যাঁ, index ${j}-এ!`,
          ],
          N({ [i]: "good", [j]: "good" }, { [need]: "good" }, [
            [j, "j"],
            [i, "i"],
          ]),
          { target, i, need },
        );
        r.step(
          "found",
          [
            `Answer: [${j}, ${i}] because ${nums[j]} + ${nums[i]} = ${target}.`,
            `উত্তর: [${j}, ${i}], কারণ ${nums[j]} + ${nums[i]} = ${target}।`,
          ],
          N({ [i]: "good", [j]: "good" }, { [need]: "good" }, []),
          { target },
          `[${j}, ${i}]`,
        );
        return { frames: r.frames, result: [j, i] };
      }
      r.step(
        "check",
        [
          `Is ${need} in the dictionary? No.`,
          `${need} কি Dictionary-তে আছে? না।`,
        ],
        N({ [i]: "bad" }),
        { target, i, need },
      );
      seen.set(nums[i], i);
      r.step(
        "store",
        [
          `Store ${nums[i]} → ${i} so a later number can find it.`,
          `${nums[i]} → ${i} রেখে দিই, যাতে পরের কোনো সংখ্যা একে খুঁজে পায়।`,
        ],
        N({ [i]: "done" }, { [nums[i]]: "active" }),
        { target, i },
      );
    }
    return { frames: r.frames, result: null };
  },
  check: (x) => x && x[0] === 3 && x[1] === 4,
  complexity: { time: "O(n)", space: "O(n)" },
  mistakes: [
    [
      "Storing before checking → a number could pair with itself.",
      "খোঁজার আগে রেখে দিলে → সংখ্যা নিজের সাথেই জোড়া বাঁধতে পারে।",
    ],
    [
      "List.Contains / IndexOf inside the loop → O(n²).",
      "লুপের ভেতর List.Contains / IndexOf → O(n²)।",
    ],
    ["Returning values instead of indices.", "index-এর বদলে মান ফেরত দেওয়া।"],
  ],
  followups: [
    [
      ["What if the array is sorted?", "অ্যারে sort করা থাকলে?"],
      [
        "Use two pointers instead — O(1) extra space (LeetCode 167).",
        "two pointers ব্যবহার করুন — অতিরিক্ত মেমরি O(1) (LeetCode 167)।",
      ],
    ],
    [
      ["Why is Dictionary lookup O(1)?", "Dictionary-তে খোঁজা কেন O(1)?"],
      [
        "The key's hash code picks a bucket directly; only collisions need extra checks (average O(1), worst O(n)).",
        "key-এর hash code সরাসরি বাকেট বেছে দেয়; শুধু collision হলে বাড়তি খোঁজা লাগে (গড়ে O(1), সবচেয়ে খারাপে O(n))।",
      ],
    ],
  ],
  practice: [
    lc(1, "Two Sum", "Easy"),
    lc(49, "Group Anagrams", "Medium"),
    lc(128, "Longest Consecutive Sequence", "Medium"),
    lc(347, "Top K Frequent Elements", "Medium"),
    lc(380, "Insert Delete GetRandom O(1)", "Medium"),
  ],
};

// ------------------------------------------------------------- 05 Two Pointers
const twoPointers = {
  id: 5,
  slug: "two-pointers",
  name: "Two Pointers",
  level: 0,
  problem: lc(167, "Two Sum II - Input Array Is Sorted", "Medium"),
  input: "numbers = [1, 3, 4, 6, 8, 11], target = 10",
  expected: "[3, 4]  (1-based: 4 + 6 = 10)",
  idea: [
    "Put one finger at the start and one at the end of a SORTED array. Sum too small? Move the left finger right (bigger number). Too big? Move the right finger left (smaller number). Each step throws away one option forever.",
    "সাজানো (sorted) অ্যারের দুই মাথায় দুটো আঙুল রাখুন। যোগফল ছোট? বাম আঙুল ডানে (বড় সংখ্যা)। বড়? ডান আঙুল বামে (ছোট সংখ্যা)। প্রতি ধাপে একটা অপশন চিরতরে বাদ যায়।",
  ],
  analogy: [
    "Squeezing a tube of toothpaste from both ends toward the middle.",
    "টুথপেস্টের টিউব দুই মাথা থেকে মাঝের দিকে চাপা।",
  ],
  signals: [
    ["Array is SORTED (or can be sorted)", "অ্যারে sorted (বা sort করা যায়)"],
    [
      "Find a pair / triplet with a target sum",
      "নির্দিষ্ট যোগফলের জোড়া / ত্রয়ী খোঁজা",
    ],
    [
      "Palindromes, reversing, removing duplicates in place",
      "প্যালিনড্রোম, উল্টানো, জায়গায় ডুপ্লিকেট মোছা",
    ],
  ],
  code: cs(`
public int[] TwoSum(int[] numbers, int target)
{
    int left = 0, right = numbers.Length - 1; //@init
    while (left < right) //@loop
    {
        int sum = numbers[left] + numbers[right]; //@sum
        if (sum == target) return new[] { left + 1, right + 1 }; //@found
        if (sum < target) left++; //@less
        else right--; //@more
    }
    return new[] { -1, -1 };
}`),
  trace() {
    const a = [1, 3, 4, 6, 8, 11],
      target = 10;
    const r = recorder();
    let L = 0,
      R = a.length - 1;
    const P = (hi) => {
      const h = {};
      a.forEach((_, i) => {
        if (i < L || i > R) h[i] = "dim";
      });
      return [
        A(a, {
          label: "numbers (sorted)",
          ptr: ptr([
            [L, "left"],
            [R, "right"],
          ]),
          hi: { ...h, ...hi },
        }),
      ];
    };
    r.step(
      "init",
      [
        "left at the smallest number, right at the biggest.",
        "left সবচেয়ে ছোট সংখ্যায়, right সবচেয়ে বড় সংখ্যায়।",
      ],
      P({}),
      { target },
    );
    while (L < R) {
      r.step(
        "loop",
        [
          `left (${L}) < right (${R}) → keep searching.`,
          `left (${L}) < right (${R}) → খোঁজা চলবে।`,
        ],
        P({ [L]: "active", [R]: "active" }),
        { target },
      );
      const sum = a[L] + a[R];
      r.step(
        "sum",
        [`${a[L]} + ${a[R]} = ${sum}.`, `${a[L]} + ${a[R]} = ${sum}।`],
        P({ [L]: "active", [R]: "active" }),
        { target, sum },
      );
      if (sum === target) {
        r.step(
          "found",
          [
            `${sum} equals the target! Return 1-based [${L + 1}, ${R + 1}].`,
            `${sum} = target! 1-ভিত্তিক [${L + 1}, ${R + 1}] ফেরত দিই।`,
          ],
          P({ [L]: "good", [R]: "good" }),
          { target, sum },
          `[${L + 1}, ${R + 1}]`,
        );
        return { frames: r.frames, result: [L + 1, R + 1] };
      }
      if (sum < target) {
        r.step(
          "less",
          [
            `${sum} < ${target}: too small → left++. (${a[L]} can't pair with anything.)`,
            `${sum} < ${target}: ছোট → left++। (${a[L]} কারো সাথেই মিলবে না।)`,
          ],
          P({ [L]: "bad" }),
          { target, sum },
        );
        L++;
      } else {
        r.step(
          "more",
          [
            `${sum} > ${target}: too big → right--. (${a[R]} is too big for everyone.)`,
            `${sum} > ${target}: বড় → right--। (${a[R]} সবার জন্যই বড়।)`,
          ],
          P({ [R]: "bad" }),
          { target, sum },
        );
        R--;
      }
    }
    return { frames: r.frames, result: null };
  },
  check: (x) => x && x[0] === 3 && x[1] === 4,
  complexity: { time: "O(n)", space: "O(1)" },
  mistakes: [
    [
      "Using it on an UNSORTED array — the logic only works when sorted.",
      "unsorted অ্যারেতে চালানো — এই যুক্তি শুধু sorted-এ কাজ করে।",
    ],
    [
      "Forgetting 1-based indices in this LeetCode version.",
      "এই LeetCode-এ 1-ভিত্তিক index ভুলে যাওয়া।",
    ],
    [
      "left <= right lets one element pair with itself.",
      "left <= right দিলে একই উপাদান নিজের সাথে জোড়া বাঁধে।",
    ],
  ],
  followups: [
    [
      ["How do you solve 3Sum?", "3Sum কীভাবে?"],
      [
        "Sort, fix one number i, then run this two-pointer search on the rest; skip duplicates (LeetCode 15).",
        "sort করুন, একটা সংখ্যা i স্থির রাখুন, বাকিটায় two pointers চালান; ডুপ্লিকেট এড়ান (LeetCode 15)।",
      ],
    ],
    [
      [
        "Why can we discard a[left] when the sum is too small?",
        "যোগফল ছোট হলে a[left] বাদ দেওয়া যায় কেন?",
      ],
      [
        "Even with the biggest remaining number it's too small, so it can never be in the answer.",
        "সবচেয়ে বড় বাকি সংখ্যার সাথেও ছোট, তাই সে কখনো উত্তরে থাকবে না।",
      ],
    ],
  ],
  practice: [
    lc(167, "Two Sum II - Input Array Is Sorted", "Medium"),
    lc(125, "Valid Palindrome", "Easy"),
    lc(15, "3Sum", "Medium"),
    lc(11, "Container With Most Water", "Medium"),
    lc(42, "Trapping Rain Water", "Hard"),
  ],
};

// --------------------------------------------------------------- 06 Prefix Sum
const prefixSum = {
  id: 6,
  slug: "prefix-sum",
  name: "Prefix Sum",
  level: 0,
  problem: lc(560, "Subarray Sum Equals K", "Medium"),
  input: "nums = [1, 2, 1, 2, 1], k = 3",
  expected: "4",
  idea: [
    "prefix = sum of everything so far. The sum of any slice = (prefix now) − (prefix earlier). So a slice ending here sums to k exactly when an earlier prefix equals (prefix − k). Count earlier prefixes with a Dictionary.",
    "prefix মানে শুরু থেকে এখন পর্যন্ত যোগফল। যেকোনো অংশের যোগফল = (এখনকার prefix) − (আগের prefix)। তাই আগে কতবার (prefix − k) দেখা গেছে, সেটা গুনলেই উত্তর।",
  ],
  analogy: [
    "A car's odometer: distance between two towns = odometer at town B − odometer at town A.",
    "গাড়ির মিটার: দুই শহরের দূরত্ব = শহর B-তে মিটার − শহর A-তে মিটার।",
  ],
  signals: [
    [
      '"Sum of a subarray / range" asked many times',
      '"subarray / রেঞ্জের যোগফল" বারবার জিজ্ঞাসা',
    ],
    [
      "Count subarrays with sum = k (negatives allowed)",
      "যোগফল = k এমন subarray গোনা (ঋণাত্মকও থাকতে পারে)",
    ],
    ["O(1) range queries after O(n) setup", "O(n) প্রস্তুতির পর O(1)-এ রেঞ্জ প্রশ্ন"],
  ],
  code: cs(`
public int SubarraySum(int[] nums, int k)
{
    var freq = new Dictionary<int, int> { [0] = 1 }; //@init
    int prefix = 0, count = 0;
    foreach (int n in nums) //@loop
    {
        prefix += n; //@add
        if (freq.TryGetValue(prefix - k, out int c)) count += c; //@look
        freq[prefix] = freq.GetValueOrDefault(prefix) + 1; //@store
    }
    return count; //@ret
}`),
  trace() {
    const nums = [1, 2, 1, 2, 1],
      k = 3;
    const r = recorder();
    const freq = new Map([[0, 1]]);
    let prefix = 0,
      count = 0;
    const pre = [];
    const M = (hi) =>
      Map_([...freq], { label: "freq: prefix → times seen", hi });
    const P = (i, hi, mh) => [
      A(nums, { label: "nums", ptr: ptr([[i, "n"]]), hi: { [i]: hi } }),
      A(pre.length ? pre : ["·"], { label: "prefix sums so far" }),
      M(mh),
    ];
    r.step(
      "init",
      [
        "freq starts as {0: 1}: an empty prefix (sum 0) exists before the array begins.",
        "freq = {0: 1} দিয়ে শুরু: অ্যারের আগে একটা খালি prefix (যোগফল ০) আছে।",
      ],
      P(-1),
      { k, prefix, count },
    );
    nums.forEach((n, i) => {
      r.step(
        "loop",
        [`Next number: ${n}.`, `পরের সংখ্যা: ${n}।`],
        P(i, "active"),
        { k, prefix, count },
      );
      prefix += n;
      pre.push(prefix);
      r.step(
        "add",
        [
          `Running total: prefix = ${prefix}.`,
          `চলতি যোগফল: prefix = ${prefix}।`,
        ],
        P(i, "active"),
        { k, prefix, count },
      );
      const want = prefix - k;
      const c = freq.get(want) || 0;
      count += c;
      r.step(
        "look",
        c
          ? [
              `Need an earlier prefix of ${prefix} − ${k} = ${want}. Seen ${c} time(s) → ${c} slice(s) ending here sum to ${k}. count = ${count}.`,
              `আগের prefix ${prefix} − ${k} = ${want} লাগবে। দেখা গেছে ${c} বার → এখানে শেষ হওয়া ${c}টি অংশের যোগফল ${k}। count = ${count}।`,
            ]
          : [
              `Need an earlier prefix of ${want}. Never seen → no slice ending here sums to ${k}.`,
              `আগের prefix ${want} লাগবে। কখনো দেখা যায়নি → এখানে শেষ হওয়া কোনো অংশ ${k} হয় না।`,
            ],
        P(i, c ? "good" : "active", c ? { [want]: "good" } : {}),
        { k, prefix, count, want },
      );
      freq.set(prefix, (freq.get(prefix) || 0) + 1);
      r.step(
        "store",
        [
          `Record prefix ${prefix} (seen ${freq.get(prefix)} time(s)).`,
          `prefix ${prefix} লিখে রাখি (মোট ${freq.get(prefix)} বার)।`,
        ],
        P(i, "done", { [prefix]: "active" }),
        { k, prefix, count },
      );
    });
    r.step(
      "ret",
      [
        `Total slices summing to ${k}: ${count}.`,
        `যোগফল ${k} এমন মোট অংশ: ${count}।`,
      ],
      P(-1),
      { k, count },
      String(count),
    );
    return { frames: r.frames, result: count };
  },
  check: (x) => x === 4,
  complexity: { time: "O(n)", space: "O(n)" },
  mistakes: [
    [
      "Forgetting freq[0] = 1 → misses slices that start at index 0.",
      "freq[0] = 1 ভুলে গেলে → index 0 থেকে শুরু হওয়া অংশ বাদ পড়ে।",
    ],
    [
      "Sliding window breaks when numbers can be negative.",
      "ঋণাত্মক সংখ্যা থাকলে sliding window কাজ করে না।",
    ],
    [
      "Updating freq BEFORE looking up → wrong when k = 0.",
      "খোঁজার আগে freq আপডেট করলে → k = 0 হলে ভুল।",
    ],
  ],
  followups: [
    [
      [
        "How do you answer many range-sum queries fast?",
        "অনেক রেঞ্জ-যোগফল প্রশ্নের দ্রুত উত্তর?",
      ],
      [
        "Build prefix[] once (O(n)); each query is prefix[r+1] − prefix[l] in O(1) (LeetCode 303).",
        "একবার prefix[] বানান (O(n)); প্রতিটি প্রশ্ন prefix[r+1] − prefix[l], O(1)-এ (LeetCode 303)।",
      ],
    ],
    [
      [
        "What if the array changes between queries?",
        "প্রশ্নের মাঝে অ্যারে বদলালে?",
      ],
      [
        "Use a Fenwick tree or segment tree (patterns 21–22).",
        "Fenwick tree বা segment tree (প্যাটার্ন ২১–২২)।",
      ],
    ],
  ],
  practice: [
    lc(560, "Subarray Sum Equals K", "Medium"),
    lc(303, "Range Sum Query - Immutable", "Easy"),
    lc(724, "Find Pivot Index", "Easy"),
    lc(238, "Product of Array Except Self", "Medium"),
    lc(974, "Subarray Sums Divisible by K", "Medium"),
  ],
};

// ----------------------------------------------------------- 07 Sliding Window
const slidingWindow = {
  id: 7,
  slug: "sliding-window",
  name: "Sliding Window",
  level: 0,
  problem: lc(3, "Longest Substring Without Repeating Characters", "Medium"),
  input: 's = "abcabcbb"',
  expected: '3  ("abc")',
  idea: [
    "Keep a window [left..right] that is always valid. Grow it by moving right. When it breaks a rule (here: a repeated letter), shrink it by moving left until it's valid again. Track the best window size.",
    "একটা জানালা [left..right] রাখুন যেটা সবসময় নিয়ম মানে। right সরিয়ে বড় করুন; নিয়ম ভাঙলে (এখানে: অক্ষর পুনরাবৃত্তি) left সরিয়ে ছোট করুন। সবচেয়ে বড় জানালার মাপ মনে রাখুন।",
  ],
  analogy: [
    "A caterpillar crawling: the head stretches forward, the tail catches up when needed.",
    "শুঁয়োপোকার হাঁটা: মাথা সামনে বাড়ে, দরকার হলে লেজ এগিয়ে আসে।",
  ],
  signals: [
    [
      '"Longest / shortest contiguous substring or subarray"',
      '"সবচেয়ে লম্বা / ছোট টানা substring বা subarray"',
    ],
    [
      "A rule about what's INSIDE the window",
      "জানালার ভেতরে কী আছে তা নিয়ে শর্ত",
    ],
    ["Brute force checks every substring → O(n²)", "সব substring দেখা → O(n²)"],
  ],
  code: cs(`
public int LengthOfLongestSubstring(string s)
{
    var last = new Dictionary<char, int>(); //@init
    int left = 0, best = 0;
    for (int right = 0; right < s.Length; right++) //@loop
    {
        if (last.TryGetValue(s[right], out int seen) && seen >= left) //@check
            left = seen + 1; //@shrink
        last[s[right]] = right; //@store
        best = Math.Max(best, right - left + 1); //@best
    }
    return best; //@ret
}`),
  trace() {
    const s = "abcabcbb".split("");
    const r = recorder();
    const last = new Map();
    let L = 0,
      best = 0;
    const P = (R, extra = {}, mh) => [
      A(s, {
        label: "s",
        ptr: ptr([
          [L, "left"],
          [R, "right"],
        ]),
        hi: span(L, R, "range", extra),
      }),
      Map_([...last], { label: "last index of each char", hi: mh }),
    ];
    r.step(
      "init",
      [
        "Window is empty. `last` remembers where each letter was last seen.",
        "জানালা খালি। `last` মনে রাখে কোন অক্ষর শেষবার কোথায় দেখা গেছে।",
      ],
      P(-1),
      { left: 0, best: 0 },
    );
    for (let R = 0; R < s.length; R++) {
      const c = s[R];
      r.step(
        "loop",
        [
          `Move right to ${R}: add '${c}' to the window.`,
          `right = ${R}: '${c}' জানালায় ঢুকাই।`,
        ],
        P(R, { [R]: "active" }),
        { left: L, best },
      );
      const seen = last.get(c);
      if (seen !== undefined && seen >= L) {
        r.step(
          "check",
          [
            `'${c}' is already inside the window (index ${seen}) → repeat! Invalid.`,
            `'${c}' আগেই জানালায় আছে (index ${seen}) → পুনরাবৃত্তি! নিয়ম ভাঙল।`,
          ],
          P(R, { [R]: "bad", [seen]: "bad" }, { [c]: "bad" }),
          { left: L, best },
        );
        L = seen + 1;
        r.step(
          "shrink",
          [
            `Jump left to ${seen} + 1 = ${L}. No repeats now.`,
            `left লাফিয়ে ${seen} + 1 = ${L}-এ। এখন আর পুনরাবৃত্তি নেই।`,
          ],
          P(R, { [R]: "active" }),
          { left: L, best },
        );
      } else {
        r.step(
          "check",
          [
            `'${c}' is not inside the window → still valid.`,
            `'${c}' জানালায় নেই → নিয়ম ঠিক আছে।`,
          ],
          P(R, { [R]: "good" }),
          { left: L, best },
        );
      }
      last.set(c, R);
      r.step(
        "store",
        [`Remember last['${c}'] = ${R}.`, `last['${c}'] = ${R} মনে রাখি।`],
        P(R, {}, { [c]: "active" }),
        { left: L, best },
      );
      const len = R - L + 1;
      const better = len > best;
      best = Math.max(best, len);
      const w = s.slice(L, R + 1).join("");
      r.step(
        "best",
        [
          `Window "${w}" has length ${len}. ${better ? "New best!" : "best stays " + best + "."}`,
          `জানালা "${w}"-এর দৈর্ঘ্য ${len}। ${better ? "নতুন সেরা!" : "best থাকল " + best + "।"}`,
        ],
        P(R, better ? span(L, R, "good") : {}),
        { left: L, best },
      );
    }
    r.step(
      "ret",
      [
        `Longest window without repeats = ${best}.`,
        `পুনরাবৃত্তি ছাড়া সবচেয়ে লম্বা জানালা = ${best}।`,
      ],
      [A(s, { label: "s" })],
      { best },
      String(best),
    );
    return { frames: r.frames, result: best };
  },
  check: (x) => x === 3,
  complexity: { time: "O(n)", space: "O(min(n, alphabet))" },
  mistakes: [
    [
      "Forgetting `seen >= left`: an old position outside the window must be ignored.",
      "`seen >= left` ভুলে যাওয়া: জানালার বাইরের পুরোনো অবস্থান উপেক্ষা করতে হবে।",
    ],
    [
      "Moving left backwards (left only goes forward).",
      "left পেছনে নেওয়া (left শুধু সামনে যায়)।",
    ],
    [
      "Restarting from scratch at each repeat → O(n²).",
      "প্রতি পুনরাবৃত্তিতে শূন্য থেকে শুরু → O(n²)।",
    ],
  ],
  followups: [
    [
      [
        "Fixed-size vs variable-size window?",
        "নির্দিষ্ট মাপ বনাম বদলানো মাপের জানালা?",
      ],
      [
        "Fixed: add right, remove right−k each step (643). Variable: shrink while invalid (this problem, 76).",
        "নির্দিষ্ট: প্রতি ধাপে right যোগ, right−k বাদ (643)। বদলানো: নিয়ম ভাঙলে ছোট করা (এই সমস্যা, 76)।",
      ],
    ],
    [
      [
        "Why is it O(n) even with the inner jump?",
        "ভেতরের লাফ থাকলেও O(n) কেন?",
      ],
      [
        "left and right each move forward at most n times in total.",
        "left আর right প্রত্যেকে মোট সর্বোচ্চ n বার সামনে যায়।",
      ],
    ],
  ],
  practice: [
    lc(3, "Longest Substring Without Repeating Characters", "Medium"),
    lc(643, "Maximum Average Subarray I", "Easy"),
    lc(424, "Longest Repeating Character Replacement", "Medium"),
    lc(567, "Permutation in String", "Medium"),
    lc(76, "Minimum Window Substring", "Hard"),
  ],
};

// --------------------------------------------------------- 08 Kadane's Algorithm
const kadane = {
  id: 8,
  slug: "kadanes-algorithm",
  name: "Kadane's Algorithm",
  level: 0,
  problem: lc(53, "Maximum Subarray", "Medium"),
  input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
  expected: "6  ([4, -1, 2, 1])",
  idea: [
    "At every number ask ONE question: is it better to join the previous run, or start fresh here? current = max(num, current + num). If the past run is negative, it only drags you down, so drop it.",
    "প্রতিটি সংখ্যায় একটাই প্রশ্ন: আগের দলে যোগ দেব, নাকি এখান থেকে নতুন শুরু করব? current = max(num, current + num)। আগের যোগফল ঋণাত্মক হলে সেটা শুধু টেনে নামায় — ফেলে দিন।",
  ],
  analogy: [
    "Carrying a backpack: if it only slows you down (negative), drop it and start light.",
    "ব্যাকপ্যাক বহন: যদি শুধু ধীর করে (ঋণাত্মক), ফেলে দিয়ে হালকা হয়ে শুরু করুন।",
  ],
  signals: [
    [
      "Maximum (or minimum) sum of a CONTIGUOUS subarray",
      "টানা subarray-এর সর্বোচ্চ (বা সর্বনিম্ন) যোগফল",
    ],
    ["Numbers can be negative", "সংখ্যা ঋণাত্মক হতে পারে"],
    ["One pass, O(1) memory expected", "একবারের লুপ, O(1) মেমরি"],
  ],
  code: cs(`
public int MaxSubArray(int[] nums)
{
    int current = nums[0], best = nums[0]; //@init
    for (int i = 1; i < nums.Length; i++) //@loop
    {
        current = Math.Max(nums[i], current + nums[i]); //@extend
        best = Math.Max(best, current); //@best
    }
    return best; //@ret
}`),
  trace() {
    const a = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    const r = recorder();
    let cur = a[0],
      best = a[0],
      start = 0,
      bs = 0,
      be = 0;
    const P = (i, extra = {}) => [
      A(a, {
        label: "nums",
        ptr: ptr([
          [start, "start"],
          [i, "i"],
        ]),
        hi: span(start, i, "range", extra),
      }),
      A(
        a.map((_, j) => (j >= bs && j <= be ? "★" : "")),
        { label: "best run", hi: span(bs, be, "good") },
      ),
    ];
    r.step(
      "init",
      [
        `Start with the first number: current = best = ${a[0]}.`,
        `প্রথম সংখ্যা দিয়ে শুরু: current = best = ${a[0]}।`,
      ],
      P(0, { 0: "active" }),
      { current: cur, best },
    );
    for (let i = 1; i < a.length; i++) {
      r.step(
        "loop",
        [`i = ${i}, nums[i] = ${a[i]}.`, `i = ${i}, nums[i] = ${a[i]}।`],
        P(i, { [i]: "active" }),
        { current: cur, best },
      );
      const join = cur + a[i];
      if (a[i] > join) {
        start = i;
        cur = a[i];
        r.step(
          "extend",
          [
            `Join → ${join}, or start fresh → ${a[i]}. Fresh is better: the old run was dragging us down.`,
            `যোগ দিলে → ${join}, নতুন শুরু → ${a[i]}। নতুন শুরুই ভালো: আগের দল টেনে নামাচ্ছিল।`,
          ],
          P(i, { [i]: "warn" }),
          { current: cur, best },
        );
      } else {
        cur = join;
        r.step(
          "extend",
          [
            `Join → ${join}, or start fresh → ${a[i]}. Joining wins. current = ${cur}.`,
            `যোগ দিলে → ${join}, নতুন শুরু → ${a[i]}। যোগ দেওয়াই ভালো। current = ${cur}।`,
          ],
          P(i, { [i]: "active" }),
          { current: cur, best },
        );
      }
      if (cur > best) {
        best = cur;
        bs = start;
        be = i;
        r.step(
          "best",
          [
            `current ${cur} beats best → best = ${best}.`,
            `current ${cur} best-কে হারাল → best = ${best}।`,
          ],
          P(i, span(start, i, "good")),
          { current: cur, best },
        );
      } else {
        r.step(
          "best",
          [
            `current ${cur} doesn't beat best ${best}.`,
            `current ${cur}, best ${best}-কে হারাতে পারল না।`,
          ],
          P(i),
          { current: cur, best },
        );
      }
    }
    r.step(
      "ret",
      [
        `Maximum subarray sum = ${best} (indices ${bs}..${be}).`,
        `সর্বোচ্চ subarray যোগফল = ${best} (index ${bs}..${be})।`,
      ],
      [A(a, { label: "nums", hi: span(bs, be, "good") })],
      { best },
      String(best),
    );
    return { frames: r.frames, result: best };
  },
  check: (x) => x === 6,
  complexity: { time: "O(n)", space: "O(1)" },
  mistakes: [
    [
      "Starting best = 0: wrong when ALL numbers are negative.",
      "best = 0 দিয়ে শুরু: সব সংখ্যা ঋণাত্মক হলে ভুল।",
    ],
    [
      "Resetting current to 0 instead of nums[i].",
      "current-কে nums[i]-এর বদলে ০ করা।",
    ],
    [
      "Confusing subarray (contiguous) with subsequence (any picks).",
      "subarray (টানা) আর subsequence (যেকোনো বাছাই) গুলিয়ে ফেলা।",
    ],
  ],
  followups: [
    [
      ["What about maximum PRODUCT subarray?", "সর্বোচ্চ গুণফলের subarray হলে?"],
      [
        "Track both max and min so far, since negative × negative becomes big (LeetCode 152).",
        "max আর min দুটোই রাখুন, কারণ ঋণাত্মক × ঋণাত্মক বড় হয় (LeetCode 152)।",
      ],
    ],
    [
      ["Circular array?", "বৃত্তাকার অ্যারে হলে?"],
      [
        "max(normal Kadane, total − minimum subarray), unless all are negative (LeetCode 918).",
        "max(সাধারণ Kadane, মোট − সর্বনিম্ন subarray), যদি না সব ঋণাত্মক হয় (LeetCode 918)।",
      ],
    ],
  ],
  practice: [
    lc(53, "Maximum Subarray", "Medium"),
    lc(152, "Maximum Product Subarray", "Medium"),
    lc(918, "Maximum Sum Circular Subarray", "Medium"),
    lc(121, "Best Time to Buy and Sell Stock", "Easy"),
  ],
};

// ------------------------------------------------------------------ 09 Matrix
const matrix = {
  id: 9,
  slug: "matrix",
  name: "Matrix",
  level: 0,
  problem: lc(54, "Spiral Matrix", "Medium"),
  input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]",
  expected: "[1,2,3,4,8,12,11,10,9,5,6,7]",
  idea: [
    "A matrix is an array of rows: matrix[row][col]. For spiral order keep four walls — top, bottom, left, right. Walk along one wall, then move that wall inward. Repeat until the walls cross.",
    "ম্যাট্রিক্স মানে সারির অ্যারে: matrix[row][col]। spiral-এর জন্য চারটা দেয়াল রাখুন — top, bottom, left, right। এক দেয়াল ধরে হাঁটুন, তারপর সেই দেয়াল ভেতরে সরান। দেয়াল পার হওয়া পর্যন্ত চলুক।",
  ],
  analogy: [
    "Peeling an onion layer by layer, clockwise around each layer.",
    "পেঁয়াজের খোসা স্তরে স্তরে ছাড়ানো, প্রতিটি স্তরে ঘড়ির কাঁটার দিকে।",
  ],
  signals: [
    ["2D grid / board / image", "2D গ্রিড / বোর্ড / ছবি"],
    [
      "Traverse in a special order (spiral, diagonal, layer)",
      "বিশেষ ক্রমে ঘোরা (spiral, কোনাকুনি, স্তর)",
    ],
    [
      "Rotate / transpose / mark rows and columns",
      "ঘোরানো / transpose / সারি-কলাম চিহ্নিত করা",
    ],
  ],
  code: cs(`
public IList<int> SpiralOrder(int[][] matrix)
{
    var result = new List<int>();
    int top = 0, bottom = matrix.Length - 1; //@init
    int left = 0, right = matrix[0].Length - 1;
    while (top <= bottom && left <= right) //@loop
    {
        for (int c = left; c <= right; c++) result.Add(matrix[top][c]); //@top
        top++;
        for (int r = top; r <= bottom; r++) result.Add(matrix[r][right]); //@right
        right--;
        if (top <= bottom)
        {
            for (int c = right; c >= left; c--) result.Add(matrix[bottom][c]); //@bottom
            bottom--;
        }
        if (left <= right)
        {
            for (int r = bottom; r >= top; r--) result.Add(matrix[r][left]); //@left
            left++;
        }
    }
    return result; //@ret
}`),
  trace() {
    const m = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
    ];
    const r = recorder();
    const out = [];
    const visited = new Set();
    let top = 0,
      bottom = 2,
      left = 0,
      right = 3;
    const G = (cur) => {
      const hi = {};
      visited.forEach((k) => (hi[k] = "done"));
      if (cur) hi[cur] = "active";
      return [
        Grid(m, { label: "matrix", hi }),
        Chips(out.slice(), { label: "result" }),
      ];
    };
    const V = () => ({ top, bottom, left, right });
    const dirs = {
      top: ["right along the top", "উপরের সারি ধরে ডানে"],
      right: ["down the right side", "ডান পাশ ধরে নিচে"],
      bottom: ["left along the bottom", "নিচের সারি ধরে বামে"],
      left: ["up the left side", "বাম পাশ ধরে উপরে"],
    };
    const add = (rr, cc, tag) => {
      out.push(m[rr][cc]);
      visited.add(rr + "," + cc);
      r.step(
        tag,
        [
          `Going ${dirs[tag][0]}: add matrix[${rr}][${cc}] = ${m[rr][cc]}.`,
          `${dirs[tag][1]} যাচ্ছি: matrix[${rr}][${cc}] = ${m[rr][cc]} যোগ।`,
        ],
        G(rr + "," + cc),
        V(),
      );
    };
    r.step(
      "init",
      [
        "Four walls: top = 0, bottom = 2, left = 0, right = 3.",
        "চার দেয়াল: top = 0, bottom = 2, left = 0, right = 3।",
      ],
      G(),
      V(),
    );
    while (top <= bottom && left <= right) {
      r.step(
        "loop",
        [
          "Walls haven't crossed → peel the next layer.",
          "দেয়াল পার হয়নি → পরের স্তর ছাড়াই।",
        ],
        G(),
        V(),
      );
      for (let c = left; c <= right; c++) add(top, c, "top");
      top++;
      for (let rr = top; rr <= bottom; rr++) add(rr, right, "right");
      right--;
      if (top <= bottom) {
        for (let c = right; c >= left; c--) add(bottom, c, "bottom");
        bottom--;
      }
      if (left <= right) {
        for (let rr = bottom; rr >= top; rr--) add(rr, left, "left");
        left++;
      }
    }
    r.step(
      "ret",
      [
        "Walls crossed — every cell visited exactly once.",
        "দেয়াল পার হয়ে গেছে — প্রতিটি ঘর ঠিক একবার দেখা হলো।",
      ],
      G(),
      V(),
      "[" + out.join(",") + "]",
    );
    return { frames: r.frames, result: out };
  },
  check: (x) => x.join(",") === "1,2,3,4,8,12,11,10,9,5,6,7",
  complexity: { time: "O(rows × cols)", space: "O(1) extra (besides output)" },
  mistakes: [
    [
      "Missing the `top <= bottom` / `left <= right` checks → duplicates on non-square matrices.",
      "`top <= bottom` / `left <= right` চেক না করলে → বর্গ নয় এমন ম্যাট্রিক্সে ডুপ্লিকেট।",
    ],
    [
      "Mixing up matrix[row][col] with matrix[col][row].",
      "matrix[row][col] আর matrix[col][row] গুলিয়ে ফেলা।",
    ],
    [
      "Using a visited[][] array when the walls already do the job.",
      "দেয়ালই কাজ করছে, তবু visited[][] রাখা।",
    ],
  ],
  followups: [
    [
      ["Rotate an n×n image 90° in place?", "n×n ছবি জায়গায় ৯০° ঘোরানো?"],
      [
        "Transpose (swap [i][j] with [j][i]) then reverse every row (LeetCode 48).",
        "transpose ([i][j] ↔ [j][i]) করে প্রতিটি সারি উল্টান (LeetCode 48)।",
      ],
    ],
    [
      ["Set matrix zeroes with O(1) space?", "O(1) মেমরিতে Set Matrix Zeroes?"],
      [
        "Use the first row and first column as marker storage (LeetCode 73).",
        "প্রথম সারি আর প্রথম কলামকে চিহ্ন রাখার জায়গা বানান (LeetCode 73)।",
      ],
    ],
  ],
  practice: [
    lc(54, "Spiral Matrix", "Medium"),
    lc(48, "Rotate Image", "Medium"),
    lc(73, "Set Matrix Zeroes", "Medium"),
    lc(36, "Valid Sudoku", "Medium"),
    lc(240, "Search a 2D Matrix II", "Medium"),
  ],
};

// ------------------------------------------------------------- 10 Linked List
const linkedList = {
  id: 10,
  slug: "linked-list",
  name: "Linked List",
  level: 0,
  problem: lc(206, "Reverse Linked List", "Easy"),
  input: "head = 1 → 2 → 3 → 4",
  expected: "4 → 3 → 2 → 1",
  idea: [
    "Each node holds a value and a pointer to the next node. To reverse, walk once and flip every arrow backwards. You need three pointers: prev (already reversed), curr (being flipped), next (so you don't lose the rest).",
    "প্রতিটি নোডে একটা মান আর পরের নোডের ঠিকানা থাকে। উল্টাতে একবার হাঁটুন আর প্রতিটি তীর পেছনে ঘুরিয়ে দিন। তিনটি পয়েন্টার লাগে: prev (উল্টানো অংশ), curr (যেটা ঘোরাচ্ছি), next (বাকি অংশ যেন হারিয়ে না যায়)।",
  ],
  analogy: [
    "A conga line where everyone turns around one by one, now holding the shoulder of the person who was behind them.",
    "লাইনে দাঁড়ানো মানুষ একে একে ঘুরে দাঁড়ায়, এখন পেছনের জনের কাঁধে হাত রাখে।",
  ],
  signals: [
    ["Input is a ListNode head", "ইনপুট একটা ListNode head"],
    [
      "Reverse, merge, find middle, detect cycle",
      "উল্টানো, মেলানো, মাঝখান খোঁজা, চক্র ধরা",
    ],
    [
      "Fast & slow pointers, dummy head node",
      "দ্রুত ও ধীর পয়েন্টার, dummy head নোড",
    ],
  ],
  code: cs(`
public ListNode ReverseList(ListNode head)
{
    ListNode prev = null, curr = head; //@init
    while (curr != null) //@loop
    {
        ListNode next = curr.next; //@save
        curr.next = prev; //@flip
        prev = curr; //@prev
        curr = next; //@curr
    }
    return prev; //@ret
}`),
  trace() {
    const vals = [1, 2, 3, 4];
    const nxt = [1, 2, 3, -1];
    const r = recorder();
    let prev = -1,
      curr = 0,
      next = -1;
    const nm = (i) => (i < 0 ? "null" : "node " + vals[i]);
    const P = (hi = {}) => [
      List(vals, nxt.slice(), {
        label: "nodes",
        ptr: ptr([
          [prev, "prev"],
          [curr, "curr"],
          [next, "next"],
        ]),
        hi,
      }),
    ];
    const V = () => ({
      prev: prev < 0 ? "null" : vals[prev],
      curr: curr < 0 ? "null" : vals[curr],
      next: next < 0 ? "null" : vals[next],
    });
    r.step(
      "init",
      [
        "prev = null (nothing reversed yet), curr = head (node 1).",
        "prev = null (কিছু উল্টানো হয়নি), curr = head (node 1)।",
      ],
      P({ 0: "active" }),
      V(),
    );
    while (curr !== -1) {
      r.step(
        "loop",
        [
          `curr is node ${vals[curr]} (not null) → process it.`,
          `curr = node ${vals[curr]} (null নয়) → কাজ করি।`,
        ],
        P({ [curr]: "active" }),
        V(),
      );
      next = nxt[curr];
      r.step(
        "save",
        [
          `Save next = ${nm(next)} so we don't lose the rest.`,
          `next = ${nm(next)} রেখে দিই, যাতে বাকি অংশ হারিয়ে না যায়।`,
        ],
        P({ [curr]: "active", [next]: "warn" }),
        V(),
      );
      nxt[curr] = prev;
      r.step(
        "flip",
        [
          `Flip the arrow: node ${vals[curr]}.next = ${nm(prev)}.`,
          `তীর ঘোরাই: node ${vals[curr]}.next = ${nm(prev)}।`,
        ],
        P({ [curr]: "good" }),
        V(),
      );
      prev = curr;
      r.step(
        "prev",
        [
          `prev moves to node ${vals[prev]} — head of the reversed part.`,
          `prev এল node ${vals[prev]}-এ — উল্টানো অংশের মাথা।`,
        ],
        P({ [prev]: "good" }),
        V(),
      );
      curr = next;
      r.step(
        "curr",
        curr < 0
          ? [
              "curr becomes null — reached the end.",
              "curr = null — শেষে পৌঁছে গেছি।",
            ]
          : [
              `curr moves to node ${vals[curr]}.`,
              `curr এল node ${vals[curr]}-এ।`,
            ],
        P({ [curr]: "active" }),
        V(),
      );
    }
    const out = [];
    for (let i = prev; i !== -1; i = nxt[i]) out.push(vals[i]);
    r.step(
      "ret",
      [
        `Return prev (node ${vals[prev]}) as the new head: ${out.join(" → ")}.`,
        `prev (node ${vals[prev]}) নতুন head হিসেবে ফেরত: ${out.join(" → ")}।`,
      ],
      P({ 0: "done", 1: "done", 2: "done", 3: "done" }),
      V(),
      out.join(" → "),
    );
    return { frames: r.frames, result: out };
  },
  check: (x) => x.join() === "4,3,2,1",
  complexity: { time: "O(n)", space: "O(1)" },
  mistakes: [
    [
      "Flipping curr.next before saving it → the rest of the list is lost.",
      "সেভ না করে curr.next ঘোরালে → বাকি লিস্ট হারিয়ে যায়।",
    ],
    [
      "Returning curr (null at the end) instead of prev.",
      "prev-এর বদলে curr (শেষে null) ফেরত দেওয়া।",
    ],
    [
      "The recursive version uses O(n) stack — mention it.",
      "রিকার্সিভ সংস্করণে O(n) stack লাগে — ইন্টারভিউতে বলুন।",
    ],
  ],
  followups: [
    [
      ["Find the middle node?", "মাঝের নোড খুঁজবেন কীভাবে?"],
      [
        "Slow moves 1 step, fast moves 2; when fast ends, slow is in the middle (LeetCode 876).",
        "slow ১ ধাপ, fast ২ ধাপ; fast শেষ হলে slow মাঝখানে (LeetCode 876)।",
      ],
    ],
    [
      ["Detect a cycle?", "চক্র ধরবেন কীভাবে?"],
      [
        "Floyd's tortoise & hare: if fast ever meets slow, there's a cycle (LeetCode 141).",
        "Floyd-এর কচ্ছপ-খরগোশ: fast কখনো slow-কে ধরলে চক্র আছে (LeetCode 141)।",
      ],
    ],
  ],
  practice: [
    lc(206, "Reverse Linked List", "Easy"),
    lc(21, "Merge Two Sorted Lists", "Easy"),
    lc(141, "Linked List Cycle", "Easy"),
    lc(19, "Remove Nth Node From End of List", "Medium"),
    lc(143, "Reorder List", "Medium"),
    lc(25, "Reverse Nodes in k-Group", "Hard"),
  ],
};

export default [
  arrays,
  strings,
  bits,
  hash,
  twoPointers,
  prefixSum,
  slidingWindow,
  kadane,
  matrix,
  linkedList,
];
