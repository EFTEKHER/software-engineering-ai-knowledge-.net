import {
  cs,
  recorder,
  ptr,
  span,
  A,
  Stack,
  Queue,
  BTree,
  NTree,
  Chips,
  lc,
} from "./kit.js";
// Every text is [English, বাংলা]. Step captions too.

// ----------------------------------------------------------------- 11 Stacks
const stacks = {
  id: 11,
  slug: "stacks",
  name: "Stacks",
  level: 1,
  problem: lc(20, "Valid Parentheses", "Easy"),
  input: 's = "{[()]}"',
  expected: "true",
  idea: [
    "A stack is Last-In-First-Out (LIFO): you only touch the top. Push every opening bracket. On a closing bracket, the top MUST be its matching opener — pop it. At the end the stack must be empty.",
    "Stack মানে শেষে ঢুকলে আগে বের হয় (LIFO) — শুধু উপরেরটা ধরা যায়। খোলা বন্ধনী push করুন। বন্ধ বন্ধনী এলে উপরেরটা অবশ্যই তার জোড়া হতে হবে — pop করুন। শেষে stack খালি থাকতে হবে।",
  ],
  analogy: [
    "A pile of plates: the last plate you put on is the first one you take off.",
    "প্লেটের স্তূপ: সবার শেষে রাখা প্লেটটাই আগে তোলা হয়।",
  ],
  signals: [
    ["Matching pairs: brackets, tags, undo", "জোড়া মেলানো: বন্ধনী, ট্যাগ, undo"],
    [
      '"Next greater / smaller element" (monotonic stack)',
      '"পরের বড় / ছোট উপাদান" (monotonic stack)',
    ],
    [
      "Evaluate expressions, simulate recursion",
      "এক্সপ্রেশন হিসাব, রিকার্শন অনুকরণ",
    ],
  ],
  code: cs(`
public bool IsValid(string s)
{
    var stack = new Stack<char>(); //@init
    foreach (char c in s) //@loop
    {
        if (c == '(' || c == '[' || c == '{') stack.Push(c); //@push
        else
        {
            if (stack.Count == 0) return false; //@empty
            char open = stack.Pop(); //@pop
            if (c == ')' && open != '(' || c == ']' && open != '[' || c == '}' && open != '{') //@match
                return false;
        }
    }
    return stack.Count == 0; //@ret
}`),
  trace() {
    const s = "{[()]}".split("");
    const pair = { ")": "(", "]": "[", "}": "{" };
    const r = recorder();
    const st = [];
    const P = (i, hi, sh) => [
      A(s, {
        label: "s",
        ptr: ptr([[i, "c"]]),
        hi: { ...span(0, i - 1, "done"), [i]: hi },
      }),
      Stack(st.slice(), { label: "stack", hi: sh }),
    ];
    r.step(
      "init",
      [
        "Empty stack. Openers wait here for their partner.",
        "খালি stack। খোলা বন্ধনীগুলো এখানে জোড়ার জন্য অপেক্ষা করবে।",
      ],
      P(-1),
      {},
    );
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      r.step("loop", [`Read '${c}'.`, `'${c}' পড়ি।`], P(i, "active"), { c });
      if (!pair[c]) {
        st.push(c);
        r.step(
          "push",
          [`'${c}' opens → push it on top.`, `'${c}' খোলা বন্ধনী → উপরে push।`],
          P(i, "good", "top"),
          { c },
        );
      } else {
        const open = st.pop();
        r.step(
          "pop",
          [
            `'${c}' closes → pop the top: '${open}'.`,
            `'${c}' বন্ধ করে → উপর থেকে pop: '${open}'।`,
          ],
          P(i, "active"),
          { c, open },
        );
        const ok = open === pair[c];
        r.step(
          "match",
          ok
            ? [
                `'${open}' and '${c}' are partners ✓.`,
                `'${open}' আর '${c}' জোড়া ✓।`,
              ]
            : [
                `'${open}' doesn't match '${c}' ✗ → false.`,
                `'${open}' আর '${c}' মেলে না ✗ → false।`,
              ],
          P(i, ok ? "good" : "bad"),
          { c, open },
        );
        if (!ok) return { frames: r.frames, result: false };
      }
    }
    const ok = st.length === 0;
    r.step(
      "ret",
      [
        `End of string. Stack empty? ${ok ? "Yes → true." : "No → false."}`,
        `স্ট্রিং শেষ। stack খালি? ${ok ? "হ্যাঁ → true।" : "না → false।"}`,
      ],
      P(s.length),
      {},
      String(ok),
    );
    return { frames: r.frames, result: ok };
  },
  check: (x) => x === true,
  complexity: { time: "O(n)", space: "O(n)" },
  mistakes: [
    [
      "Not checking for an empty stack before Pop() → InvalidOperationException.",
      "Pop()-এর আগে খালি কি না না দেখলে → InvalidOperationException।",
    ],
    [
      'Returning true without checking the stack is empty ("((" is invalid).',
      'শেষে stack খালি কি না না দেখে true ("((" ভুল)।',
    ],
    [
      'Only counting brackets: "([)]" has equal counts but is invalid.',
      'শুধু গুনলে হবে না: "([)]"-এ সংখ্যা সমান কিন্তু ভুল।',
    ],
  ],
  followups: [
    [
      ["What is a monotonic stack?", "monotonic stack কী?"],
      [
        'A stack kept increasing/decreasing; pop while the new item breaks the order. Solves "next greater element" in O(n) (LeetCode 739).',
        'ক্রমবর্ধমান/ক্রমহ্রাসমান stack; নতুন উপাদান ক্রম ভাঙলে pop। "পরের বড় উপাদান" O(n)-এ (LeetCode 739)।',
      ],
    ],
    [
      ["Min Stack in O(1)?", "O(1)-এ Min Stack?"],
      [
        "Store (value, minSoFar) pairs on the stack (LeetCode 155).",
        "stack-এ (মান, এখন পর্যন্ত min) জোড়া রাখুন (LeetCode 155)।",
      ],
    ],
  ],
  practice: [
    lc(20, "Valid Parentheses", "Easy"),
    lc(155, "Min Stack", "Medium"),
    lc(150, "Evaluate Reverse Polish Notation", "Medium"),
    lc(739, "Daily Temperatures", "Medium"),
    lc(84, "Largest Rectangle in Histogram", "Hard"),
  ],
};

// ----------------------------------------------------------------- 12 Queues
const queues = {
  id: 12,
  slug: "queues",
  name: "Queues",
  level: 1,
  problem: lc(232, "Implement Queue using Stacks", "Easy"),
  input: "Push 1, Push 2, Push 3, Peek, Pop, Push 4, Pop, Pop",
  expected: "Peek → 1, Pops → 1, 2, 3",
  idea: [
    "A queue is First-In-First-Out (FIFO), like a line at a shop. You can build one from two stacks: push into `inbox`; when you need the front, pour inbox into `outbox` (this reverses the order) and pop from outbox.",
    "Queue মানে আগে এলে আগে যায় (FIFO), দোকানের লাইনের মতো। দুটো stack দিয়ে বানানো যায়: inbox-এ push; সামনেরটা লাগলে inbox ঢেলে দিন outbox-এ (ক্রম উল্টে যায়), তারপর outbox থেকে pop।",
  ],
  analogy: [
    "Two cups: pouring a stack of coins from one cup to the other flips the order, so the oldest coin ends up on top.",
    "দুটো কাপ: এক কাপের কয়েন আরেক কাপে ঢাললে ক্রম উল্টে যায়, সবচেয়ে পুরোনো কয়েন উপরে চলে আসে।",
  ],
  signals: [
    ["Process things in arrival order", "যে ক্রমে এসেছে সেই ক্রমে কাজ"],
    ["BFS / level-by-level traversal", "BFS / স্তরে স্তরে ঘোরা"],
    [
      "Design a buffer, rate limiter, or task scheduler",
      "buffer, rate limiter, task scheduler ডিজাইন",
    ],
  ],
  code: cs(`
public class MyQueue
{
    private readonly Stack<int> inbox = new(), outbox = new();
    public void Push(int x) => inbox.Push(x); //@push
    public int Pop() { Move(); return outbox.Pop(); } //@pop
    public int Peek() { Move(); return outbox.Peek(); } //@peek
    public bool Empty() => inbox.Count == 0 && outbox.Count == 0;
    private void Move()
    {
        if (outbox.Count == 0) //@move
            while (inbox.Count > 0) outbox.Push(inbox.Pop()); //@pour
    }
}`),
  trace() {
    const r = recorder();
    const inbox = [],
      outbox = [],
      out = [];
    const P = (ih, oh) => [
      Stack(inbox.slice(), { label: "inbox", hi: ih }),
      Stack(outbox.slice(), { label: "outbox", hi: oh }),
      Chips(out.slice(), { label: "returned" }),
    ];
    const move = () => {
      if (outbox.length === 0) {
        r.step(
          "move",
          [
            "outbox is empty → pour everything from inbox.",
            "outbox খালি → inbox থেকে সব ঢালি।",
          ],
          P(),
          {},
        );
        while (inbox.length) {
          const x = inbox.pop();
          outbox.push(x);
          r.step(
            "pour",
            [
              `Move ${x}: inbox → outbox. Order flips, oldest rises to the top.`,
              `${x} সরাই: inbox → outbox। ক্রম উল্টায়, পুরোনোটা উপরে ওঠে।`,
            ],
            P(null, "top"),
            {},
          );
        }
      } else {
        r.step(
          "move",
          [
            "outbox already has items → its top is the oldest. No pouring needed.",
            "outbox-এ আগেই আছে → উপরেরটাই সবচেয়ে পুরোনো। ঢালার দরকার নেই।",
          ],
          P(null, "top"),
          {},
        );
      }
    };
    for (const op of [
      ["push", 1],
      ["push", 2],
      ["push", 3],
      ["peek"],
      ["pop"],
      ["push", 4],
      ["pop"],
      ["pop"],
    ]) {
      if (op[0] === "push") {
        inbox.push(op[1]);
        r.step(
          "push",
          [
            `Push(${op[1]}) → goes on top of inbox. O(1).`,
            `Push(${op[1]}) → inbox-এর উপরে। O(1)।`,
          ],
          P("top"),
          { op: "Push " + op[1] },
        );
      } else if (op[0] === "peek") {
        move();
        r.step(
          "peek",
          [
            `Peek() → outbox top = ${outbox.at(-1)} (the first one pushed).`,
            `Peek() → outbox-এর উপরে ${outbox.at(-1)} (প্রথমে push করা)।`,
          ],
          P(null, "top"),
          { op: "Peek" },
          String(outbox.at(-1)),
        );
      } else {
        move();
        const x = outbox.pop();
        out.push(x);
        r.step(
          "pop",
          [
            `Pop() → removes ${x}. First in, first out ✓.`,
            `Pop() → ${x} বের হলো। আগে এলে আগে যায় ✓।`,
          ],
          P(),
          { op: "Pop" },
          String(x),
        );
      }
    }
    return { frames: r.frames, result: out };
  },
  check: (x) => x.join() === "1,2,3",
  complexity: { time: "O(1) amortized per operation", space: "O(n)" },
  mistakes: [
    [
      "Pouring when outbox is NOT empty → breaks the order.",
      "outbox খালি না হলেও ঢাললে → ক্রম ভেঙে যায়।",
    ],
    [
      "Thinking every Pop is O(n): each item is moved at most once → amortized O(1).",
      "প্রতিটি Pop O(n) ভাবা: প্রতিটি উপাদান সর্বোচ্চ একবার সরে → গড়ে O(1)।",
    ],
    [
      "In C#, prefer Queue<T> for real code; this is an interview exercise.",
      "আসল কোডে C#-এর Queue<T> নিন; এটা ইন্টারভিউ অনুশীলন।",
    ],
  ],
  followups: [
    [
      ["What does 'amortized O(1)' mean?", "'amortized O(1)' মানে কী?"],
      [
        "Some calls are slow, but averaged over many calls each costs O(1).",
        "কিছু কল ধীর, কিন্তু অনেক কলের গড়ে প্রতিটি O(1)।",
      ],
    ],
    [
      [
        "Circular queue with a fixed array?",
        "নির্দিষ্ট অ্যারে দিয়ে circular queue?",
      ],
      [
        "Keep head and count; next index = (head + count) % capacity (LeetCode 622).",
        "head আর count রাখুন; পরের index = (head + count) % capacity (LeetCode 622)।",
      ],
    ],
  ],
  practice: [
    lc(232, "Implement Queue using Stacks", "Easy"),
    lc(225, "Implement Stack using Queues", "Easy"),
    lc(933, "Number of Recent Calls", "Easy"),
    lc(622, "Design Circular Queue", "Medium"),
    lc(994, "Rotting Oranges", "Medium"),
  ],
};

// ------------------------------------------------------------------ 13 Deque
const deque = {
  id: 13,
  slug: "deque",
  name: "Deque",
  level: 1,
  problem: lc(239, "Sliding Window Maximum", "Hard"),
  input: "nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3",
  expected: "[3, 3, 5, 5, 6, 7]",
  idea: [
    "A deque (double-ended queue) lets you add/remove at BOTH ends in O(1). Keep indices whose values are decreasing. The front is always the window's maximum. Drop the front when it leaves the window; drop from the back anything smaller than the new number (it can never be a max again).",
    "Deque-এ দুই মাথাতেই O(1)-এ যোগ/বাদ দেওয়া যায়। এমন index রাখুন যাদের মান কমতে থাকে। সামনেরটা সবসময় জানালার সর্বোচ্চ। জানালা থেকে বের হলে সামনেরটা বাদ; নতুন সংখ্যার চেয়ে ছোটগুলো পেছন থেকে বাদ (তারা আর কখনো সর্বোচ্চ হবে না)।",
  ],
  analogy: [
    "A line of tall people: when a taller person joins, everyone shorter in front of them (at the back of the line) gives up — they'll never be seen.",
    "লম্বা মানুষের লাইন: বেশি লম্বা কেউ এলে তার সামনের খাটোরা হাল ছেড়ে দেয় — তাদের আর দেখা যাবে না।",
  ],
  signals: [
    ["Max / min of every window of size k", "k মাপের প্রতিটি জানালার max / min"],
    [
      "Need both ends: push/pop front and back",
      "দুই মাথাই লাগবে: সামনে-পেছনে push/pop",
    ],
    [
      "Monotonic queue optimizations in DP",
      "DP-তে monotonic queue অপ্টিমাইজেশন",
    ],
  ],
  code: cs(`
public int[] MaxSlidingWindow(int[] nums, int k)
{
    var dq = new LinkedList<int>(); // indices, values decreasing //@init
    var result = new int[nums.Length - k + 1];
    for (int i = 0; i < nums.Length; i++) //@loop
    {
        if (dq.Count > 0 && dq.First.Value <= i - k) dq.RemoveFirst(); //@expire
        while (dq.Count > 0 && nums[dq.Last.Value] < nums[i]) dq.RemoveLast(); //@pop
        dq.AddLast(i); //@push
        if (i >= k - 1) result[i - k + 1] = nums[dq.First.Value]; //@record
    }
    return result; //@ret
}`),
  trace() {
    const a = [1, 3, -1, -3, 5, 3, 6, 7],
      k = 3;
    const r = recorder();
    const dq = [],
      res = [];
    const P = (i, hi = {}, qh) => [
      A(a, {
        label: "nums",
        ptr: ptr([[i, "i"]]),
        hi: i >= 0 ? span(Math.max(0, i - k + 1), i, "range", hi) : hi,
      }),
      Queue(
        dq.map((j) => `${a[j]} (i${j})`),
        { label: "deque  (front … back)", hi: qh },
      ),
      Chips(res.slice(), { label: "result" }),
    ];
    r.step(
      "init",
      [
        "Deque holds indices; their values stay decreasing from front to back.",
        "Deque-এ index থাকে; সামনে থেকে পেছনে মানগুলো কমতে থাকে।",
      ],
      P(-1),
      { k },
    );
    for (let i = 0; i < a.length; i++) {
      r.step(
        "loop",
        [
          `i = ${i}, nums[i] = ${a[i]}. Window is indices ${Math.max(0, i - k + 1)}..${i}.`,
          `i = ${i}, nums[i] = ${a[i]}। জানালা: index ${Math.max(0, i - k + 1)}..${i}।`,
        ],
        P(i, { [i]: "active" }),
        { k, i },
      );
      if (dq.length && dq[0] <= i - k) {
        const g = dq.shift();
        r.step(
          "expire",
          [
            `Front index ${g} slid out of the window → remove from the front.`,
            `সামনের index ${g} জানালার বাইরে → সামনে থেকে বাদ।`,
          ],
          P(i, { [g]: "dim" }),
          { k, i },
        );
      }
      while (dq.length && a[dq.at(-1)] < a[i]) {
        const g = dq.pop();
        r.step(
          "pop",
          [
            `${a[g]} < ${a[i]}: ${a[g]} can never be a max again → remove from the back.`,
            `${a[g]} < ${a[i]}: ${a[g]} আর কখনো সর্বোচ্চ হবে না → পেছন থেকে বাদ।`,
          ],
          P(i, { [g]: "bad", [i]: "active" }),
          { k, i },
        );
      }
      dq.push(i);
      r.step(
        "push",
        [
          `Add index ${i} (value ${a[i]}) to the back.`,
          `index ${i} (মান ${a[i]}) পেছনে যোগ।`,
        ],
        P(i, { [i]: "active" }, { [dq.length - 1]: "active" }),
        { k, i },
      );
      if (i >= k - 1) {
        res.push(a[dq[0]]);
        r.step(
          "record",
          [
            `Window full → max is the front: ${a[dq[0]]}.`,
            `জানালা পূর্ণ → সর্বোচ্চ হলো সামনেরটা: ${a[dq[0]]}।`,
          ],
          P(i, { [dq[0]]: "good" }, { 0: "good" }),
          { k, i },
        );
      }
    }
    r.step(
      "ret",
      [
        `All windows done: [${res.join(", ")}].`,
        `সব জানালা শেষ: [${res.join(", ")}]।`,
      ],
      P(-1),
      { k },
      "[" + res.join(", ") + "]",
    );
    return { frames: r.frames, result: res };
  },
  check: (x) => x.join() === "3,3,5,5,6,7",
  complexity: {
    time: "O(n) — each index enters and leaves once",
    space: "O(k)",
  },
  mistakes: [
    [
      "Storing values instead of indices → can't tell when the front expires.",
      "index-এর বদলে মান রাখলে → সামনেরটা কখন জানালা ছাড়ল বোঝা যায় না।",
    ],
    [
      "Recomputing max of each window → O(n·k).",
      "প্রতি জানালায় নতুন করে max খোঁজা → O(n·k)।",
    ],
    [
      "Using < vs <= wrongly in the pop condition (both work, but be consistent).",
      "pop শর্তে < আর <= গুলিয়ে ফেলা (দুটোই চলে, কিন্তু একটায় স্থির থাকুন)।",
    ],
  ],
  followups: [
    [
      ["Why LinkedList<int> in C#?", "C#-এ LinkedList<int> কেন?"],
      [
        "It supports O(1) add/remove at both ends; C# has no built-in Deque<T> class.",
        "দুই মাথায় O(1)-এ যোগ/বাদ দেয়; C#-এ নিজস্ব Deque<T> নেই।",
      ],
    ],
    [
      ["Can a heap solve it?", "heap দিয়ে করা যায়?"],
      [
        "Yes, with lazy deletion, but it's O(n log n). The deque is O(n).",
        "হ্যাঁ, lazy deletion দিয়ে, কিন্তু O(n log n)। deque O(n)।",
      ],
    ],
  ],
  practice: [
    lc(239, "Sliding Window Maximum", "Hard"),
    lc(641, "Design Circular Deque", "Medium"),
    lc(
      1438,
      "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit",
      "Medium",
    ),
    lc(862, "Shortest Subarray with Sum at Least K", "Hard"),
  ],
};

// ----------------------------------------------------------------- 14 Sorting
const sorting = {
  id: 14,
  slug: "sorting",
  name: "Sorting",
  level: 1,
  problem: lc(75, "Sort Colors", "Medium"),
  input: "nums = [2, 0, 2, 1, 1, 0]",
  expected: "[0, 0, 1, 1, 2, 2]",
  idea: [
    "Sorting puts order into chaos, and order makes many problems easy. When there are only 3 values (0,1,2), the Dutch National Flag trick sorts in ONE pass: zone of 0s on the left (low), 2s on the right (high), and mid scans the unknown middle.",
    "sort করলে বিশৃঙ্খলায় শৃঙ্খলা আসে, আর অনেক সমস্যা সহজ হয়। শুধু ৩টি মান (০,১,২) হলে Dutch National Flag কৌশলে একবারেই sort হয়: বামে ০-এর এলাকা (low), ডানে ২-এর এলাকা (high), আর mid মাঝের অজানা অংশ দেখে।",
  ],
  analogy: [
    "Sorting laundry into three baskets as you pick each item up — never touching an item twice.",
    "কাপড় তুলতে তুলতে তিন ঝুড়িতে ভাগ করা — কোনো কাপড় দুবার ধরতে হয় না।",
  ],
  signals: [
    [
      '"Sort", or sorting would make the problem easy',
      '"sort", বা sort করলে সমস্যা সহজ হয়',
    ],
    [
      "Few distinct values → counting / partitioning",
      "অল্প কয়েকটি মান → গণনা / ভাগ করা",
    ],
    [
      "Custom order → comparer (Array.Sort with a lambda)",
      "নিজস্ব ক্রম → comparer (lambda দিয়ে Array.Sort)",
    ],
  ],
  code: cs(`
public void SortColors(int[] nums)
{
    int low = 0, mid = 0, high = nums.Length - 1; //@init
    while (mid <= high) //@loop
    {
        if (nums[mid] == 0) { Swap(nums, low, mid); low++; mid++; } //@zero
        else if (nums[mid] == 1) mid++; //@one
        else { Swap(nums, mid, high); high--; } //@two
    }
}
private static void Swap(int[] a, int i, int j) => (a[i], a[j]) = (a[j], a[i]);`),
  trace() {
    const a = [2, 0, 2, 1, 1, 0];
    const r = recorder();
    let low = 0,
      mid = 0,
      high = a.length - 1;
    const P = (hi = {}) => {
      const h = {};
      for (let i = 0; i < a.length; i++)
        h[i] = i < low ? "c0" : i < mid ? "c1" : i > high ? "c2" : undefined;
      return [
        A(a.slice(), {
          label: "nums",
          ptr: ptr([
            [low, "low"],
            [mid, "mid"],
            [high, "high"],
          ]),
          hi: { ...h, ...hi },
        }),
      ];
    };
    r.step(
      "init",
      [
        "low = mid = 0, high = end. Left of low = 0s, between low and mid = 1s, right of high = 2s.",
        "low = mid = 0, high = শেষ। low-এর বামে ০, low থেকে mid-এর মাঝে ১, high-এর ডানে ২।",
      ],
      P(),
      { low, mid, high },
    );
    while (mid <= high) {
      r.step(
        "loop",
        [
          `mid (${mid}) ≤ high (${high}) → look at nums[mid] = ${a[mid]}.`,
          `mid (${mid}) ≤ high (${high}) → nums[mid] = ${a[mid]} দেখি।`,
        ],
        P({ [mid]: "active" }),
        { low, mid, high },
      );
      if (a[mid] === 0) {
        [a[low], a[mid]] = [a[mid], a[low]];
        r.step(
          "zero",
          [
            `It's 0 → swap into the 0-zone at low (${low}), then low++ and mid++.`,
            `এটা ০ → low (${low})-এ ০-এর এলাকায় swap, তারপর low++ আর mid++।`,
          ],
          P({ [low]: "good", [mid]: "good" }),
          { low, mid, high },
        );
        low++;
        mid++;
      } else if (a[mid] === 1) {
        r.step(
          "one",
          [
            "It's 1 → already in the middle zone. mid++.",
            "এটা ১ → আগে থেকেই মাঝের এলাকায়। mid++।",
          ],
          P({ [mid]: "good" }),
          { low, mid, high },
        );
        mid++;
      } else {
        [a[mid], a[high]] = [a[high], a[mid]];
        r.step(
          "two",
          [
            `It's 2 → swap to the 2-zone at high (${high}), high--. Don't move mid: the swapped-in number is unknown.`,
            `এটা ২ → high (${high})-এ ২-এর এলাকায় swap, high--। mid নড়াই না: নতুন আসা সংখ্যাটা অজানা।`,
          ],
          P({ [mid]: "warn", [high]: "good" }),
          { low, mid, high },
        );
        high--;
      }
    }
    r.step(
      "loop",
      [
        `mid passed high → sorted in one pass: [${a.join(", ")}].`,
        `mid, high পার হলো → একবারেই sort: [${a.join(", ")}]।`,
      ],
      P(),
      { low, mid, high },
      "[" + a.join(", ") + "]",
    );
    return { frames: r.frames, result: a };
  },
  check: (x) => x.join() === "0,0,1,1,2,2",
  complexity: { time: "O(n), one pass", space: "O(1)" },
  mistakes: [
    [
      "Incrementing mid after swapping with high — the new value hasn't been checked.",
      "high-এর সাথে swap করে mid++ করা — নতুন মানটা দেখা হয়নি।",
    ],
    [
      "Loop condition mid < high misses the last element.",
      "mid < high শর্তে শেষ উপাদান বাদ পড়ে।",
    ],
    [
      "Calling Array.Sort is O(n log n) — interviewers want one pass.",
      "Array.Sort হলে O(n log n) — ইন্টারভিউয়ার একবারের সমাধান চায়।",
    ],
  ],
  followups: [
    [
      [
        "Which sort does Array.Sort use in .NET?",
        ".NET-এর Array.Sort কোন sort?",
      ],
      [
        "Introsort: quicksort that switches to heapsort/insertion sort; it's not stable. Use OrderBy (LINQ) for a stable sort.",
        "Introsort: quicksort, দরকারে heapsort/insertion sort; stable নয়। stable চাইলে LINQ-এর OrderBy।",
      ],
    ],
    [
      ["What does 'stable sort' mean?", "'stable sort' মানে কী?"],
      [
        "Equal elements keep their original relative order.",
        "সমান উপাদানগুলো আগের আপেক্ষিক ক্রম বজায় রাখে।",
      ],
    ],
  ],
  practice: [
    lc(75, "Sort Colors", "Medium"),
    lc(88, "Merge Sorted Array", "Easy"),
    lc(179, "Largest Number", "Medium"),
    lc(912, "Sort an Array", "Medium"),
    lc(164, "Maximum Gap", "Medium"),
  ],
};

// ------------------------------------------------- 15 Recursion & Backtracking
const backtracking = {
  id: 15,
  slug: "recursion-backtracking",
  name: "Recursion & Backtracking",
  level: 1,
  problem: lc(78, "Subsets", "Medium"),
  input: "nums = [1, 2, 3]",
  expected: "[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]",
  idea: [
    "Backtracking = try a choice, explore everything after it (recursion), then UNDO the choice and try the next one. Three steps every time: choose → explore → un-choose. Every path you visit is one candidate answer.",
    "Backtracking = একটা পছন্দ নিন, তার পরের সব কিছু ঘুরে দেখুন (রিকার্শন), তারপর পছন্দটা ফিরিয়ে নিয়ে (undo) পরেরটা চেষ্টা করুন। প্রতিবার তিন ধাপ: বাছাই → ঘোরা → বাছাই বাতিল।",
  ],
  analogy: [
    "Exploring a maze: walk down a path, and when it ends, walk back to the last junction and try the next turn.",
    "গোলকধাঁধা ঘোরা: একটা পথে হাঁটুন, শেষ হলে আগের মোড়ে ফিরে পরের পথ ধরুন।",
  ],
  signals: [
    [
      '"All" subsets / permutations / combinations',
      '"সব" subset / permutation / combination',
    ],
    [
      "Puzzles: N-Queens, Sudoku, word search",
      "ধাঁধা: N-Queens, Sudoku, word search",
    ],
    ["Small n (≤ 20) — exponential answers", "ছোট n (≤ ২০) — উত্তর exponential"],
  ],
  code: cs(`
public IList<IList<int>> Subsets(int[] nums)
{
    var result = new List<IList<int>>();
    var path = new List<int>();
    void Backtrack(int start)
    {
        result.Add(new List<int>(path)); //@record
        for (int i = start; i < nums.Length; i++) //@loop
        {
            path.Add(nums[i]); //@choose
            Backtrack(i + 1); //@recurse
            path.RemoveAt(path.Count - 1); //@undo
        }
    }
    Backtrack(0); //@start
    return result;
}`),
  trace() {
    const nums = [1, 2, 3];
    const r = recorder();
    const path = [],
      result = [],
      calls = [];
    const fmt = (p) => "[" + p.join(",") + "]";
    const P = (i, hi) => [
      A(nums, {
        label: "nums",
        ptr: ptr([[i, "i"]]),
        hi: i >= 0 ? { [i]: hi } : {},
      }),
      Stack(path.slice(), { label: "path (current choice)", hi: "top" }),
      Stack(calls.slice(), { label: "call stack" }),
      Chips(result.map(fmt), {
        label: "result",
        hi: { [result.length - 1]: "good" },
      }),
    ];
    r.step(
      "start",
      [
        "Call Backtrack(0) with an empty path.",
        "খালি path নিয়ে Backtrack(0) ডাকি।",
      ],
      P(-1),
      {},
    );
    const bt = (start) => {
      calls.push(`Backtrack(${start})`);
      result.push(path.slice());
      r.step(
        "record",
        [
          `Every path is a subset → save ${fmt(path)}.`,
          `প্রতিটি path-ই একটা subset → ${fmt(path)} সেভ।`,
        ],
        P(-1),
        { start, depth: calls.length },
      );
      for (let i = start; i < nums.length; i++) {
        r.step(
          "loop",
          [
            `Try choosing nums[${i}] = ${nums[i]}.`,
            `nums[${i}] = ${nums[i]} বাছাই চেষ্টা।`,
          ],
          P(i, "active"),
          { start, i, depth: calls.length },
        );
        path.push(nums[i]);
        r.step(
          "choose",
          [
            `CHOOSE ${nums[i]} → path = ${fmt(path)}.`,
            `বাছাই ${nums[i]} → path = ${fmt(path)}।`,
          ],
          P(i, "good"),
          { start, i, depth: calls.length },
        );
        r.step(
          "recurse",
          [
            `EXPLORE: go deeper with Backtrack(${i + 1}).`,
            `ঘোরা: Backtrack(${i + 1}) দিয়ে আরও গভীরে।`,
          ],
          P(i, "good"),
          { start, i, depth: calls.length },
        );
        bt(i + 1);
        const x = path.pop();
        r.step(
          "undo",
          [
            `Back from the call. UN-CHOOSE ${x} → path = ${fmt(path)}.`,
            `কল থেকে ফিরলাম। বাছাই বাতিল ${x} → path = ${fmt(path)}।`,
          ],
          P(i, "bad"),
          { start, i, depth: calls.length },
        );
      }
      calls.pop();
    };
    bt(0);
    r.step(
      "start",
      [
        `All branches explored: ${result.length} subsets (2³ = 8).`,
        `সব শাখা ঘোরা শেষ: ${result.length}টি subset (2³ = 8)।`,
      ],
      P(-1),
      {},
      result.map(fmt).join(" "),
    );
    return { frames: r.frames, result };
  },
  check: (x) => x.length === 8,
  complexity: { time: "O(n · 2ⁿ)", space: "O(n) recursion depth" },
  mistakes: [
    [
      "Adding `path` itself instead of a copy → every saved subset changes later.",
      "কপির বদলে `path` নিজেই যোগ করলে → পরে সব সেভ করা subset বদলে যায়।",
    ],
    [
      "Forgetting the undo step → path keeps growing.",
      "undo ভুলে গেলে → path শুধু বড় হতেই থাকে।",
    ],
    [
      "Starting the loop at 0 instead of `start` → duplicates like [1,2] and [2,1].",
      "লুপ `start`-এর বদলে ০ থেকে → [1,2] আর [2,1]-এর মতো ডুপ্লিকেট।",
    ],
  ],
  followups: [
    [
      ["How do permutations differ?", "permutation কীভাবে আলাদা?"],
      [
        "Loop from 0 every time and skip used items (bool[] used) — order matters (LeetCode 46).",
        "প্রতিবার ০ থেকে লুপ, ব্যবহৃতগুলো বাদ (bool[] used) — ক্রম গুরুত্বপূর্ণ (LeetCode 46)।",
      ],
    ],
    [
      ["What is pruning?", "pruning কী?"],
      [
        "Stop exploring a branch early when it can't lead to a valid answer (e.g. sum already too big).",
        "যে শাখা থেকে সঠিক উত্তর আসবে না, তা আগেই থামানো (যেমন যোগফল আগেই বেশি)।",
      ],
    ],
  ],
  practice: [
    lc(78, "Subsets", "Medium"),
    lc(46, "Permutations", "Medium"),
    lc(39, "Combination Sum", "Medium"),
    lc(79, "Word Search", "Medium"),
    lc(51, "N-Queens", "Hard"),
  ],
};

// ------------------------------------------------------ 16 Divide and Conquer
const divide = {
  id: 16,
  slug: "divide-and-conquer",
  name: "Divide and Conquer",
  level: 1,
  problem: lc(912, "Sort an Array", "Medium"),
  input: "nums = [5, 2, 4, 7, 1, 3]  (merge sort)",
  expected: "[1, 2, 3, 4, 5, 7]",
  idea: [
    "Divide the problem into halves, solve each half (recursively), then combine the answers. Merge sort: split until each piece has 1 element (already sorted), then merge sorted pieces by always taking the smaller front item.",
    "সমস্যাকে অর্ধেক অর্ধেক করুন, প্রতিটি অর্ধেক সমাধান করুন (রিকার্শনে), তারপর উত্তর জোড়া দিন। Merge sort: ১টি উপাদান না হওয়া পর্যন্ত ভাগ (যা নিজেই sorted), তারপর দুই sorted অংশের সামনের ছোটটা নিয়ে নিয়ে জোড়া।",
  ],
  analogy: [
    "Two sorted piles of exam papers: keep taking the paper with the lower roll number from the top of either pile.",
    "রোল নম্বর অনুযায়ী সাজানো দুটো খাতার স্তূপ: দুই স্তূপের উপর থেকে কম রোলেরটা নিতে থাকুন।",
  ],
  signals: [
    ["Problem splits into independent halves", "সমস্যা স্বাধীন দুই অর্ধেকে ভাগ হয়"],
    [
      "Sorting, counting inversions, closest pair",
      "sort, inversion গোনা, নিকটতম জোড়া",
    ],
    [
      "Recurrence like T(n) = 2T(n/2) + O(n) → O(n log n)",
      "T(n) = 2T(n/2) + O(n) → O(n log n)",
    ],
  ],
  code: cs(`
public void MergeSort(int[] a, int lo, int hi)
{
    if (lo >= hi) return; //@base
    int mid = (lo + hi) / 2; //@split
    MergeSort(a, lo, mid); //@left
    MergeSort(a, mid + 1, hi); //@right
    Merge(a, lo, mid, hi); //@merge
}
private void Merge(int[] a, int lo, int mid, int hi)
{
    var temp = new List<int>();
    int i = lo, j = mid + 1;
    while (i <= mid && j <= hi) //@cmp
        temp.Add(a[i] <= a[j] ? a[i++] : a[j++]); //@take
    while (i <= mid) temp.Add(a[i++]); //@rest
    while (j <= hi) temp.Add(a[j++]);
    for (int k = 0; k < temp.Count; k++) a[lo + k] = temp[k]; //@copy
}`),
  trace() {
    const a = [5, 2, 4, 7, 1, 3];
    const r = recorder();
    let temp = [];
    const P = (lo, hi, extra = {}, p = []) => [
      A(a.slice(), {
        label: "nums",
        ptr: ptr(p),
        hi: lo == null ? extra : span(lo, hi, "range", extra),
      }),
      Chips(temp.slice(), { label: "temp (merged)" }),
    ];
    const ms = (lo, hi, depth) => {
      if (lo >= hi) {
        r.step(
          "base",
          [
            `[${a[lo]}] has one element → already sorted.`,
            `[${a[lo]}]-এ একটাই উপাদান → নিজেই sorted।`,
          ],
          P(lo, hi, { [lo]: "good" }),
          { lo, hi, depth },
        );
        return;
      }
      const mid = (lo + hi) >> 1;
      r.step(
        "split",
        [
          `Split [${a.slice(lo, hi + 1).join(", ")}] into [${a.slice(lo, mid + 1).join(", ")}] and [${a.slice(mid + 1, hi + 1).join(", ")}].`,
          `[${a.slice(lo, hi + 1).join(", ")}] কে ভাগ: [${a.slice(lo, mid + 1).join(", ")}] আর [${a.slice(mid + 1, hi + 1).join(", ")}]।`,
        ],
        P(lo, hi, span(lo, mid, "c0", span(mid + 1, hi, "c2"))),
        { lo, mid, hi, depth },
      );
      ms(lo, mid, depth + 1);
      ms(mid + 1, hi, depth + 1);
      r.step(
        "merge",
        [
          `Both halves sorted → merge [${a.slice(lo, mid + 1).join(", ")}] + [${a.slice(mid + 1, hi + 1).join(", ")}].`,
          `দুই অর্ধেক sorted → জোড়া দিই [${a.slice(lo, mid + 1).join(", ")}] + [${a.slice(mid + 1, hi + 1).join(", ")}]।`,
        ],
        P(lo, hi),
        { lo, mid, hi, depth },
      );
      temp = [];
      let i = lo,
        j = mid + 1;
      while (i <= mid && j <= hi) {
        const takeL = a[i] <= a[j];
        const x = takeL ? a[i] : a[j];
        temp.push(x);
        r.step(
          "take",
          [
            `Compare ${a[i]} vs ${a[j]} → take the smaller, ${x}.`,
            `${a[i]} বনাম ${a[j]} → ছোটটা নিই, ${x}।`,
          ],
          P(
            lo,
            hi,
            { [i]: takeL ? "good" : "active", [j]: takeL ? "active" : "good" },
            [
              [i, "i"],
              [j, "j"],
            ],
          ),
          { lo, mid, hi, depth },
        );
        takeL ? i++ : j++;
      }
      if (i <= mid || j <= hi) {
        while (i <= mid) temp.push(a[i++]);
        while (j <= hi) temp.push(a[j++]);
        r.step(
          "rest",
          [
            "One side is empty → copy the leftovers.",
            "এক পাশ শেষ → বাকিগুলো কপি।",
          ],
          P(lo, hi),
          { lo, mid, hi, depth },
        );
      }
      for (let k = 0; k < temp.length; k++) a[lo + k] = temp[k];
      r.step(
        "copy",
        [
          `Write back: [${temp.join(", ")}] is now sorted.`,
          `ফেরত লিখি: [${temp.join(", ")}] এখন sorted।`,
        ],
        P(lo, hi, span(lo, hi, "good")),
        { lo, mid, hi, depth },
      );
      temp = [];
    };
    ms(0, a.length - 1, 0);
    r.step(
      "copy",
      [`Fully sorted: [${a.join(", ")}].`, `পুরোপুরি sorted: [${a.join(", ")}]।`],
      P(0, a.length - 1, span(0, a.length - 1, "good")),
      {},
      "[" + a.join(", ") + "]",
    );
    return { frames: r.frames, result: a };
  },
  check: (x) => x.join() === "1,2,3,4,5,7",
  complexity: { time: "O(n log n) always", space: "O(n) for temp" },
  mistakes: [
    [
      "mid = (lo + hi) / 2 can overflow for huge arrays → use lo + (hi - lo) / 2.",
      "বিশাল অ্যারেতে (lo + hi) / 2 overflow হতে পারে → lo + (hi - lo) / 2।",
    ],
    [
      "Using < instead of <= in the merge makes it unstable.",
      "merge-এ <= এর বদলে < দিলে stable থাকে না।",
    ],
    [
      "Forgetting to copy leftovers after one side runs out.",
      "এক পাশ শেষ হলে বাকিগুলো কপি করতে ভুলে যাওয়া।",
    ],
  ],
  followups: [
    [
      ["Merge sort vs quick sort?", "Merge sort বনাম quick sort?"],
      [
        "Merge: always O(n log n), stable, O(n) memory. Quick: O(n log n) average, O(n²) worst, in-place.",
        "Merge: সবসময় O(n log n), stable, O(n) মেমরি। Quick: গড়ে O(n log n), সবচেয়ে খারাপে O(n²), জায়গাতেই।",
      ],
    ],
    [
      ["Where else is divide & conquer used?", "আর কোথায় divide & conquer?"],
      [
        "Binary search, fast power, merging k lists, counting inversions.",
        "Binary search, দ্রুত ঘাত, k লিস্ট জোড়া, inversion গোনা।",
      ],
    ],
  ],
  practice: [
    lc(912, "Sort an Array", "Medium"),
    lc(169, "Majority Element", "Easy"),
    lc(108, "Convert Sorted Array to Binary Search Tree", "Easy"),
    lc(23, "Merge k Sorted Lists", "Hard"),
    lc(315, "Count of Smaller Numbers After Self", "Hard"),
  ],
};

// ----------------------------------------------------------- 17 Binary Search
const binarySearch = {
  id: 17,
  slug: "binary-search",
  name: "Binary Search",
  level: 1,
  problem: lc(704, "Binary Search", "Easy"),
  input: "nums = [-1, 0, 3, 5, 9, 12, 17, 21], target = 17",
  expected: "6",
  idea: [
    "In a SORTED array, look at the middle. If it's too small, the answer can only be on the right; if too big, only on the left. Each look throws away half — 1 million items need only ~20 looks.",
    "sorted অ্যারের মাঝখানে দেখুন। ছোট হলে উত্তর শুধু ডানে; বড় হলে শুধু বামে। প্রতিবার অর্ধেক বাদ যায় — ১০ লাখ উপাদানে মাত্র ~২০ বার দেখা লাগে।",
  ],
  analogy: [
    'Guess-the-number game: "Is it 50?" — "Higher!" — "75?" — "Lower!" Each guess halves the range.',
    'সংখ্যা আন্দাজের খেলা: "৫০?" — "আরও বেশি!" — "৭৫?" — "কম!" প্রতিটি আন্দাজে পরিসর অর্ধেক।',
  ],
  signals: [
    [
      "Sorted input, or a yes/no answer that flips once (monotonic)",
      "sorted ইনপুট, বা হ্যাঁ/না উত্তর যা একবারই বদলায়",
    ],
    [
      '"Minimum value that works" (binary search on the answer)',
      '"সবচেয়ে ছোট যে মান কাজ করে" (উত্তরের উপর binary search)',
    ],
    ["O(log n) is required", "O(log n) লাগবে"],
  ],
  code: cs(`
public int Search(int[] nums, int target)
{
    int lo = 0, hi = nums.Length - 1; //@init
    while (lo <= hi) //@loop
    {
        int mid = lo + (hi - lo) / 2; //@mid
        if (nums[mid] == target) return mid; //@found
        if (nums[mid] < target) lo = mid + 1; //@right
        else hi = mid - 1; //@left
    }
    return -1; //@ret
}`),
  trace() {
    const a = [-1, 0, 3, 5, 9, 12, 17, 21],
      target = 17;
    const r = recorder();
    let lo = 0,
      hi = a.length - 1;
    const P = (mid, hi2 = {}) => {
      const h = {};
      a.forEach((_, i) => {
        if (i < lo || i > hi) h[i] = "dim";
      });
      return [
        A(a, {
          label: "nums (sorted)",
          ptr: ptr([
            [lo, "lo"],
            [mid, "mid"],
            [hi, "hi"],
          ]),
          hi: { ...h, ...hi2 },
        }),
      ];
    };
    r.step(
      "init",
      [
        "Search space = the whole array: lo = 0, hi = 7.",
        "খোঁজার এলাকা = পুরো অ্যারে: lo = 0, hi = 7।",
      ],
      P(-1),
      { target, lo, hi },
    );
    while (lo <= hi) {
      r.step(
        "loop",
        [
          `lo ≤ hi → ${hi - lo + 1} candidates left.`,
          `lo ≤ hi → এখনো ${hi - lo + 1}টি সম্ভাবনা।`,
        ],
        P(-1),
        { target, lo, hi },
      );
      const mid = lo + ((hi - lo) >> 1);
      r.step(
        "mid",
        [
          `mid = ${lo} + (${hi} − ${lo}) / 2 = ${mid}. nums[mid] = ${a[mid]}.`,
          `mid = ${lo} + (${hi} − ${lo}) / 2 = ${mid}। nums[mid] = ${a[mid]}।`,
        ],
        P(mid, { [mid]: "active" }),
        { target, lo, hi, mid },
      );
      if (a[mid] === target) {
        r.step(
          "found",
          [
            `${a[mid]} == ${target} → found at index ${mid}!`,
            `${a[mid]} == ${target} → index ${mid}-এ পাওয়া গেল!`,
          ],
          P(mid, { [mid]: "good" }),
          { target, lo, hi, mid },
          String(mid),
        );
        return { frames: r.frames, result: mid };
      }
      if (a[mid] < target) {
        r.step(
          "right",
          [
            `${a[mid]} < ${target} → answer is to the right. Throw away the left half: lo = ${mid + 1}.`,
            `${a[mid]} < ${target} → উত্তর ডানে। বাম অর্ধেক বাদ: lo = ${mid + 1}।`,
          ],
          P(mid, span(lo, mid, "bad")),
          { target, lo, hi, mid },
        );
        lo = mid + 1;
      } else {
        r.step(
          "left",
          [
            `${a[mid]} > ${target} → answer is to the left. Throw away the right half: hi = ${mid - 1}.`,
            `${a[mid]} > ${target} → উত্তর বামে। ডান অর্ধেক বাদ: hi = ${mid - 1}।`,
          ],
          P(mid, span(mid, hi, "bad")),
          { target, lo, hi, mid },
        );
        hi = mid - 1;
      }
    }
    r.step(
      "ret",
      ["Not found → −1.", "পাওয়া যায়নি → −1।"],
      P(-1),
      { target },
      "-1",
    );
    return { frames: r.frames, result: -1 };
  },
  check: (x) => x === 6,
  complexity: { time: "O(log n)", space: "O(1)" },
  mistakes: [
    [
      "Infinite loop: lo = mid (not mid + 1) with `lo < hi`.",
      "অসীম লুপ: `lo < hi` দিয়ে lo = mid (mid + 1 নয়)।",
    ],
    [
      "(lo + hi) / 2 overflow → use lo + (hi - lo) / 2.",
      "(lo + hi) / 2 overflow → lo + (hi - lo) / 2।",
    ],
    ["Using it on unsorted data.", "unsorted ডেটায় চালানো।"],
  ],
  followups: [
    [
      ["Rotated sorted array?", "ঘোরানো sorted অ্যারে?"],
      [
        "One half around mid is always sorted; check if the target lies in that half (LeetCode 33).",
        "mid-এর চারপাশে এক অর্ধেক সবসময় sorted; target সেই অর্ধেকে কি না দেখুন (LeetCode 33)।",
      ],
    ],
    [
      ["Binary search on the answer?", "উত্তরের উপর binary search?"],
      [
        'If "can we do it with speed x?" is monotonic, search the smallest x that works (LeetCode 875).',
        '"x গতিতে পারব?" যদি monotonic হয়, কাজ করে এমন সবচেয়ে ছোট x খুঁজুন (LeetCode 875)।',
      ],
    ],
  ],
  practice: [
    lc(704, "Binary Search", "Easy"),
    lc(35, "Search Insert Position", "Easy"),
    lc(33, "Search in Rotated Sorted Array", "Medium"),
    lc(153, "Find Minimum in Rotated Sorted Array", "Medium"),
    lc(875, "Koko Eating Bananas", "Medium"),
    lc(4, "Median of Two Sorted Arrays", "Hard"),
  ],
};

// ------------------------------------------------------------- 18 Binary Tree
const binaryTree = {
  id: 18,
  slug: "binary-tree",
  name: "Binary Tree",
  level: 1,
  problem: lc(104, "Maximum Depth of Binary Tree", "Easy"),
  input: "root = [3, 9, 20, null, null, 15, 7]",
  expected: "3",
  idea: [
    'Each node has up to two children. Most tree problems are: "ask my left child, ask my right child, combine their answers". Depth of a node = 1 + max(depth of left, depth of right). An empty child has depth 0.',
    'প্রতিটি নোডের সর্বোচ্চ দুটি সন্তান। বেশিরভাগ ট্রি সমস্যা: "বাম সন্তানকে জিজ্ঞেস করো, ডান সন্তানকে জিজ্ঞেস করো, উত্তর মেলাও"। গভীরতা = 1 + max(বামের গভীরতা, ডানের গভীরতা)। খালি সন্তানের গভীরতা ০।',
  ],
  analogy: [
    "A family tree: to know how many generations are below you, ask each child and add 1 for yourself.",
    "বংশতালিকা: আপনার নিচে কত প্রজন্ম আছে জানতে প্রতিটি সন্তানকে জিজ্ঞেস করুন, নিজের জন্য ১ যোগ করুন।",
  ],
  signals: [
    ["Input is a TreeNode root", "ইনপুট একটা TreeNode root"],
    [
      "Depth, height, path sums, diameter → DFS",
      "গভীরতা, উচ্চতা, পথের যোগফল, ব্যাস → DFS",
    ],
    ["Level by level → BFS with a queue", "স্তরে স্তরে → queue দিয়ে BFS"],
  ],
  code: cs(`
public int MaxDepth(TreeNode root)
{
    if (root == null) return 0; //@base
    int left = MaxDepth(root.left); //@left
    int right = MaxDepth(root.right); //@right
    return 1 + Math.Max(left, right); //@ret
}`),
  trace() {
    const tree = [3, 9, 20, null, null, 15, 7];
    const r = recorder();
    const notes = {},
      hi = {},
      calls = [];
    const P = () => [
      BTree(tree, { label: "tree", hi: { ...hi }, notes: { ...notes } }),
      Stack(calls.slice(), { label: "call stack" }),
    ];
    const val = (i) => (i < tree.length ? tree[i] : null);
    const go = (i) => {
      if (val(i) == null) return 0;
      calls.push(`MaxDepth(${tree[i]})`);
      hi[i] = "active";
      r.step(
        "left",
        [
          `At node ${tree[i]}. First ask the LEFT child.`,
          `নোড ${tree[i]}-এ। আগে বাম সন্তানকে জিজ্ঞেস।`,
        ],
        P(),
        { node: tree[i] },
      );
      const L =
        val(2 * i + 1) == null
          ? (r.step(
              "base",
              [
                `Left of ${tree[i]} is null → depth 0.`,
                `${tree[i]}-এর বামে null → গভীরতা ০।`,
              ],
              P(),
              { node: tree[i] },
            ),
            0)
          : go(2 * i + 1);
      hi[i] = "active";
      r.step(
        "right",
        [
          `Node ${tree[i]}: left says ${L}. Now ask the RIGHT child.`,
          `নোড ${tree[i]}: বাম বলল ${L}। এবার ডান সন্তানকে।`,
        ],
        P(),
        { node: tree[i], left: L },
      );
      const R =
        val(2 * i + 2) == null
          ? (r.step(
              "base",
              [
                `Right of ${tree[i]} is null → depth 0.`,
                `${tree[i]}-এর ডানে null → গভীরতা ০।`,
              ],
              P(),
              { node: tree[i], left: L },
            ),
            0)
          : go(2 * i + 2);
      const d = 1 + Math.max(L, R);
      notes[i] = "d=" + d;
      hi[i] = "good";
      r.step(
        "ret",
        [
          `Node ${tree[i]}: 1 + max(${L}, ${R}) = ${d}. Return ${d} to the parent.`,
          `নোড ${tree[i]}: 1 + max(${L}, ${R}) = ${d}। মা-বাবা নোডকে ${d} ফেরত।`,
        ],
        P(),
        { node: tree[i], left: L, right: R },
      );
      calls.pop();
      return d;
    };
    const ans = go(0);
    r.step(
      "ret",
      [
        `The root returns ${ans} → maximum depth is ${ans}.`,
        `root ফেরত দিল ${ans} → সর্বোচ্চ গভীরতা ${ans}।`,
      ],
      P(),
      {},
      String(ans),
    );
    return { frames: r.frames, result: ans };
  },
  check: (x) => x === 3,
  complexity: { time: "O(n)", space: "O(h) recursion, h = height" },
  mistakes: [
    [
      "Forgetting the null base case → NullReferenceException.",
      "null base case ভুলে গেলে → NullReferenceException।",
    ],
    [
      'Counting edges vs nodes — read what "depth" means in the problem.',
      'edge গোনা না node গোনা — সমস্যায় "depth" মানে কী পড়ুন।',
    ],
    [
      "Very deep (skewed) trees can overflow the stack → use iterative BFS.",
      "খুব গভীর (একপাশে হেলে থাকা) ট্রিতে stack overflow → iterative BFS।",
    ],
  ],
  followups: [
    [
      ["Level order traversal?", "Level order traversal?"],
      [
        "BFS with Queue<TreeNode>; process queue.Count nodes per level (LeetCode 102).",
        "Queue<TreeNode> দিয়ে BFS; প্রতি স্তরে queue.Count টি নোড (LeetCode 102)।",
      ],
    ],
    [
      ["Pre-, in-, post-order?", "Pre-, in-, post-order?"],
      [
        "Root-Left-Right, Left-Root-Right, Left-Right-Root. This solution is post-order (children first).",
        "Root-Left-Right, Left-Root-Right, Left-Right-Root। এই সমাধান post-order (আগে সন্তান)।",
      ],
    ],
  ],
  practice: [
    lc(104, "Maximum Depth of Binary Tree", "Easy"),
    lc(226, "Invert Binary Tree", "Easy"),
    lc(102, "Binary Tree Level Order Traversal", "Medium"),
    lc(236, "Lowest Common Ancestor of a Binary Tree", "Medium"),
    lc(124, "Binary Tree Maximum Path Sum", "Hard"),
  ],
};

// ------------------------------------------------------- 19 Binary Search Tree
const bst = {
  id: 19,
  slug: "binary-search-tree",
  name: "Binary Search Tree",
  level: 1,
  problem: lc(98, "Validate Binary Search Tree", "Medium"),
  input: "root = [8, 3, 10, 1, 9, null, 14]",
  expected: "false  (9 is in 8's LEFT subtree but 9 > 8)",
  idea: [
    "In a BST, EVERY node in the left subtree is smaller and EVERY node in the right subtree is bigger — not just the direct children. Pass down an allowed range (low, high): going left tightens high, going right tightens low.",
    "BST-তে বাম subtree-এর সব নোড ছোট আর ডান subtree-এর সব নোড বড় — শুধু সরাসরি সন্তান নয়। নিচে একটা অনুমোদিত পরিসর (low, high) পাঠান: বামে গেলে high কমে, ডানে গেলে low বাড়ে।",
  ],
  analogy: [
    'A security guard at each door narrowing the allowed age range: "under 8 only", then "between 3 and 8".',
    'প্রতিটি দরজায় প্রহরী বয়সের সীমা সরু করছে: "৮-এর নিচে", তারপর "৩ থেকে ৮-এর মাঝে"।',
  ],
  signals: [
    ['"BST" in the problem', 'সমস্যায় "BST" আছে'],
    [
      "In-order traversal gives sorted order",
      "in-order traversal দিলে sorted ক্রম",
    ],
    ["Search / insert / kth smallest in O(h)", "O(h)-এ খোঁজা / যোগ / kth ছোট"],
  ],
  code: cs(`
public bool IsValidBST(TreeNode root) => Check(root, long.MinValue, long.MaxValue);
private bool Check(TreeNode node, long low, long high)
{
    if (node == null) return true; //@base
    if (node.val <= low || node.val >= high) return false; //@test
    return Check(node.left, low, node.val) //@left
        && Check(node.right, node.val, high); //@right
}`),
  trace() {
    const tree = [8, 3, 10, 1, 9, null, 14];
    const r = recorder();
    const notes = {},
      hi = {};
    const P = () => [
      BTree(tree, { label: "tree", hi: { ...hi }, notes: { ...notes } }),
    ];
    const f = (x) => (x === -Infinity ? "−∞" : x === Infinity ? "+∞" : x);
    const val = (i) => (i < tree.length ? tree[i] : null);
    const check = (i, low, high) => {
      if (val(i) == null) return true;
      const v = tree[i];
      notes[i] = `(${f(low)}, ${f(high)})`;
      hi[i] = "active";
      r.step(
        "test",
        [
          `Node ${v} must be inside (${f(low)}, ${f(high)}).`,
          `নোড ${v} অবশ্যই (${f(low)}, ${f(high)})-এর ভেতরে থাকতে হবে।`,
        ],
        P(),
        { node: v, low: f(low), high: f(high) },
      );
      if (v <= low || v >= high) {
        hi[i] = "bad";
        r.step(
          "test",
          [
            `${v} is NOT inside (${f(low)}, ${f(high)}) → NOT a valid BST!`,
            `${v}, (${f(low)}, ${f(high)})-এর ভেতরে নেই → বৈধ BST নয়!`,
          ],
          P(),
          { node: v, low: f(low), high: f(high) },
        );
        return false;
      }
      hi[i] = "good";
      r.step(
        "left",
        [
          `${v} is OK ✓. Go left with range (${f(low)}, ${v}).`,
          `${v} ঠিক আছে ✓। বামে যাই, পরিসর (${f(low)}, ${v})।`,
        ],
        P(),
        { node: v },
      );
      if (!check(2 * i + 1, low, v)) return false;
      r.step(
        "right",
        [
          `Left of ${v} is valid. Go right with range (${v}, ${f(high)}).`,
          `${v}-এর বাম বৈধ। ডানে যাই, পরিসর (${v}, ${f(high)})।`,
        ],
        P(),
        { node: v },
      );
      return check(2 * i + 2, v, high);
    };
    const ok = check(0, -Infinity, Infinity);
    r.step(
      "base",
      ok
        ? [
            "Every node fits its range → valid BST.",
            "সব নোড পরিসরে আছে → বৈধ BST।",
          ]
        : [
            "Answer: false. Checking only parent-child pairs would have missed this!",
            "উত্তর: false। শুধু মা-বাবা-সন্তান মেলালে এটা ধরা পড়ত না!",
          ],
      P(),
      {},
      String(ok),
    );
    return { frames: r.frames, result: ok };
  },
  check: (x) => x === false,
  complexity: { time: "O(n)", space: "O(h)" },
  mistakes: [
    [
      "Only comparing a node with its direct children (9 > 3 looks fine locally!).",
      "শুধু সরাসরি সন্তানের সাথে তুলনা (৯ > ৩ আলাদাভাবে ঠিক দেখায়!)।",
    ],
    [
      "Using int.MinValue/MaxValue bounds fails when a node equals them → use long or nullable.",
      "int.MinValue/MaxValue সীমা দিলে নোড সমান হলে ভুল → long বা nullable।",
    ],
    [
      "Allowing duplicates when the problem says strictly less/greater.",
      "সমস্যা কঠোরভাবে ছোট/বড় বললেও ডুপ্লিকেট মেনে নেওয়া।",
    ],
  ],
  followups: [
    [
      ["Another way to validate?", "যাচাইয়ের আরেক উপায়?"],
      [
        "In-order traversal must be strictly increasing; keep the previous value.",
        "in-order traversal কঠোরভাবে বাড়তে হবে; আগের মান মনে রাখুন।",
      ],
    ],
    [
      ["Why can BST operations be O(n)?", "BST অপারেশন কেন O(n) হতে পারে?"],
      [
        "An unbalanced BST becomes a linked list. Balanced trees (SortedSet in C# is red-black) keep O(log n).",
        "ভারসাম্যহীন BST লিংকড লিস্ট হয়ে যায়। ভারসাম্যপূর্ণ ট্রি (C#-এর SortedSet red-black) O(log n) রাখে।",
      ],
    ],
  ],
  practice: [
    lc(98, "Validate Binary Search Tree", "Medium"),
    lc(700, "Search in a Binary Search Tree", "Easy"),
    lc(235, "Lowest Common Ancestor of a Binary Search Tree", "Medium"),
    lc(230, "Kth Smallest Element in a BST", "Medium"),
    lc(450, "Delete Node in a BST", "Medium"),
  ],
};

// ------------------------------------------------------------------- 20 Tries
const tries = {
  id: 20,
  slug: "tries",
  name: "Tries",
  level: 1,
  problem: lc(208, "Implement Trie (Prefix Tree)", "Medium"),
  input:
    'Insert "cat", "car", "dog"; Search "car"; Search "ca"; StartsWith "ca"',
  expected: "true, false, true",
  idea: [
    "A trie is a tree of letters. Each path from the root spells a prefix; a node marked End means a whole word stops there. Words that share a prefix share the same nodes, so prefix lookups take O(length of word).",
    "Trie হলো অক্ষরের ট্রি। root থেকে প্রতিটি পথ একটা prefix বানান করে; End চিহ্নিত নোডে একটা পুরো শব্দ শেষ। একই prefix-এর শব্দগুলো একই নোড ভাগ করে, তাই prefix খোঁজা O(শব্দের দৈর্ঘ্য)।",
  ],
  analogy: [
    'Phone autocomplete: typing "ca" walks down two branches, and everything below is a suggestion.',
    'ফোনের autocomplete: "ca" লিখলে দুটো শাখা নিচে নামে, তার নিচের সবকিছুই পরামর্শ।',
  ],
  signals: [
    [
      "Prefix search, autocomplete, spell check",
      "prefix খোঁজা, autocomplete, বানান যাচাই",
    ],
    [
      "Many words searched against the same dictionary",
      "একই অভিধানে অনেক শব্দ খোঁজা",
    ],
    [
      "Word search on a grid with many words (LeetCode 212)",
      "গ্রিডে অনেক শব্দ খোঁজা (LeetCode 212)",
    ],
  ],
  code: cs(`
public class Trie
{
    private class Node { public Node[] Next = new Node[26]; public bool End; }
    private readonly Node root = new();
    public void Insert(string word)
    {
        var node = root; //@ins
        foreach (char c in word)
        {
            node.Next[c - 'a'] ??= new Node(); //@create
            node = node.Next[c - 'a']; //@walk
        }
        node.End = true; //@end
    }
    public bool Search(string word) => Find(word)?.End == true; //@search
    public bool StartsWith(string prefix) => Find(prefix) != null; //@prefix
    private Node Find(string s)
    {
        var node = root;
        foreach (char c in s)
        {
            node = node.Next[c - 'a']; //@find
            if (node == null) return null;
        }
        return node;
    }
}`),
  trace() {
    const r = recorder();
    const nodes = [{ id: 0, label: "root", parent: null, end: false }];
    const kids = [{}];
    const out = [];
    const P = (hi) => [
      NTree(
        nodes.map((n) => ({ ...n })),
        { label: "trie", hi },
      ),
      Chips(out.slice(), { label: "answers" }),
    ];
    for (const w of ["cat", "car", "dog"]) {
      let cur = 0;
      r.step(
        "ins",
        [`Insert "${w}": start at the root.`, `"${w}" ঢোকাই: root থেকে শুরু।`],
        P({ 0: "active" }),
        { word: w },
      );
      for (const c of w) {
        if (kids[cur][c] == null) {
          const id = nodes.length;
          nodes.push({ id, label: c, parent: cur, end: false });
          kids.push({});
          kids[cur][c] = id;
          r.step(
            "create",
            [
              `No '${c}' child yet → create it.`,
              `'${c}' সন্তান নেই → নতুন বানাই।`,
            ],
            P({ [id]: "good" }),
            { word: w, letter: c },
          );
        } else {
          r.step(
            "walk",
            [
              `'${c}' already exists (shared prefix!) → just walk down.`,
              `'${c}' আগেই আছে (একই prefix!) → শুধু নিচে নামি।`,
            ],
            P({ [kids[cur][c]]: "active" }),
            { word: w, letter: c },
          );
        }
        cur = kids[cur][c];
      }
      nodes[cur].end = true;
      r.step(
        "end",
        [
          `Mark '${w.at(-1)}' as End: the word "${w}" finishes here.`,
          `'${w.at(-1)}'-কে End চিহ্ন: "${w}" এখানে শেষ।`,
        ],
        P({ [cur]: "good" }),
        { word: w },
      );
    }
    const find = (s, tag, check) => {
      let cur = 0;
      const path = { 0: "active" };
      for (const c of s) {
        const nx = kids[cur][c];
        if (nx == null) return null;
        cur = nx;
        path[cur] = "active";
        r.step(
          "find",
          [
            `${tag}("${s}"): follow '${c}'.`,
            `${tag}("${s}"): '${c}' ধরে নামি।`,
          ],
          P({ ...path }),
          { query: s },
        );
      }
      return cur;
    };
    let n = find("car", "Search");
    out.push("Search(car)=true");
    r.step(
      "search",
      [
        "Reached 'r' and it is marked End → Search(\"car\") = true.",
        "'r'-এ পৌঁছালাম, End চিহ্ন আছে → Search(\"car\") = true।",
      ],
      P({ [n]: "good" }),
      { query: "car" },
      "true",
    );
    n = find("ca", "Search");
    out.push("Search(ca)=false");
    r.step(
      "search",
      [
        "Reached 'a' but it is NOT End → \"ca\" is only a prefix → false.",
        "'a'-তে পৌঁছালাম কিন্তু End নয় → \"ca\" শুধু prefix → false।",
      ],
      P({ [n]: "bad" }),
      { query: "ca" },
      "false",
    );
    n = find("ca", "StartsWith");
    out.push("StartsWith(ca)=true");
    r.step(
      "prefix",
      [
        "StartsWith only needs the path to exist → true.",
        "StartsWith-এ শুধু পথ থাকলেই হয় → true।",
      ],
      P({ [n]: "good" }),
      { query: "ca" },
      "true",
    );
    return { frames: r.frames, result: out };
  },
  check: (x) =>
    x.join() === "Search(car)=true,Search(ca)=false,StartsWith(ca)=true",
  complexity: {
    time: "O(L) per operation, L = word length",
    space: "O(total letters × 26)",
  },
  mistakes: [
    [
      'Forgetting the End flag → "ca" would count as a word.',
      'End চিহ্ন ভুলে গেলে → "ca"-কেও শব্দ ধরা হবে।',
    ],
    [
      "Search vs StartsWith: only Search checks End.",
      "Search বনাম StartsWith: শুধু Search End দেখে।",
    ],
    [
      "Big alphabets → use Dictionary<char, Node> instead of Node[26].",
      "বড় বর্ণমালা → Node[26]-এর বদলে Dictionary<char, Node>।",
    ],
  ],
  followups: [
    [
      ["Wildcard search with '.'?", "'.' wildcard দিয়ে খোঁজা?"],
      [
        "On '.', try all 26 children recursively (LeetCode 211).",
        "'.' এলে ২৬টি সন্তানই রিকার্সিভভাবে চেষ্টা (LeetCode 211)।",
      ],
    ],
    [
      ["Trie vs HashSet<string>?", "Trie বনাম HashSet<string>?"],
      [
        "HashSet: fast exact match only. Trie: also prefix queries and shared memory for common prefixes.",
        "HashSet: শুধু হুবহু মেলায় দ্রুত। Trie: prefix প্রশ্নও পারে, একই prefix-এর মেমরি ভাগ করে।",
      ],
    ],
  ],
  practice: [
    lc(208, "Implement Trie (Prefix Tree)", "Medium"),
    lc(211, "Design Add and Search Words Data Structure", "Medium"),
    lc(14, "Longest Common Prefix", "Easy"),
    lc(648, "Replace Words", "Medium"),
    lc(212, "Word Search II", "Hard"),
  ],
};

export default [
  stacks,
  queues,
  deque,
  sorting,
  backtracking,
  divide,
  binarySearch,
  binaryTree,
  bst,
  tries,
];
