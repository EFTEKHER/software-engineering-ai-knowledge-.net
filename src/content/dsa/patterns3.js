import {
  cs,
  recorder,
  ptr,
  span,
  A,
  Grid,
  Queue,
  Map_,
  Bits,
  BTree,
  Chips,
  Bars,
  lc,
} from "./kit.js";
// Every text is [English, বাংলা]. Step captions too.

// ------------------------------------------------------------ 21 Fenwick Tree
const fenwick = {
  id: 21,
  slug: "fenwick-tree",
  name: "Fenwick Tree",
  level: 2,
  problem: lc(307, "Range Sum Query - Mutable", "Medium"),
  input: "nums = [3, 2, 5, 1, 4, 6, 2, 7]; Prefix(6); Add(3, +2); Prefix(6)",
  expected: "21, then 23",
  idea: [
    "A Fenwick tree (Binary Indexed Tree) answers prefix sums AND point updates in O(log n). Cell i stores the sum of a block that ends at i; the block length is i's lowest 1-bit (i & -i). Query: hop down with i -= i & -i. Update: hop up with i += i & -i.",
    "Fenwick tree (Binary Indexed Tree) prefix যোগফল আর একটি ঘর আপডেট — দুটোই O(log n)-এ করে। ঘর i রাখে i-তে শেষ হওয়া একটা ব্লকের যোগফল; ব্লকের দৈর্ঘ্য = i-এর সবচেয়ে নিচের ১-বিট (i & -i)। প্রশ্নে i -= i & -i দিয়ে নিচে লাফ, আপডেটে i += i & -i দিয়ে উপরে লাফ।",
  ],
  analogy: [
    'Paying 23 taka with notes of 16, 4, 2, 1: any amount is a few "power-of-two" chunks.',
    '২৩ টাকা দেওয়া ১৬, ৪, ২, ১ টাকার নোটে: যেকোনো পরিমাণ কয়েকটা "২-এর ঘাত" টুকরো।',
  ],
  signals: [
    ["Prefix / range sums WITH updates", "আপডেট সহ prefix / রেঞ্জ যোগফল"],
    [
      'Counting inversions, "how many smaller before me"',
      'inversion গোনা, "আমার আগে কতজন ছোট"',
    ],
    [
      "Need something shorter to code than a segment tree",
      "segment tree-এর চেয়ে ছোট কোড দরকার",
    ],
  ],
  code: cs(`
public class Fenwick
{
    private readonly int[] tree; // 1-indexed
    public Fenwick(int n) => tree = new int[n + 1];
    public void Add(int i, int delta) // i is 1-based
    {
        for (; i < tree.Length; i += i & -i) //@add
            tree[i] += delta;
    }
    public int Prefix(int i) // sum of nums[1..i]
    {
        int sum = 0;
        for (; i > 0; i -= i & -i) //@query
            sum += tree[i];
        return sum;
    }
    public int Range(int l, int r) => Prefix(r) - Prefix(l - 1); //@range
}`),
  trace() {
    const nums = [3, 2, 5, 1, 4, 6, 2, 7];
    const n = nums.length;
    const t = new Array(n + 1).fill(0);
    const r = recorder();
    const low = (i) => i & -i;
    const cover = Array.from(
      { length: n },
      (_, k) => `${k + 2 - low(k + 1)}..${k + 1}`,
    );
    const P = (hi = {}, nh = {}, bitsI) => {
      const panels = [
        A(nums, { label: "nums (1-based)", idx: 1, hi: nh }),
        A(t.slice(1), { label: "tree[i]", idx: 1, sub: cover, hi }),
      ];
      if (bitsI)
        panels.push(
          Bits(
            [
              { label: "i", value: bitsI },
              { label: "i & -i", value: low(bitsI), hi: true },
            ],
            { width: 4 },
          ),
        );
      return panels;
    };
    nums.forEach((v, k) => {
      const touched = {};
      for (let i = k + 1; i <= n; i += low(i)) {
        t[i] += v;
        touched[i - 1] = "active";
      }
      r.step(
        "add",
        [
          `Build: Add(${k + 1}, ${v}) updates cells ${Object.keys(touched)
            .map((x) => +x + 1)
            .join(" → ")}.`,
          `তৈরি: Add(${k + 1}, ${v}) ঘরগুলো আপডেট করে ${Object.keys(touched)
            .map((x) => +x + 1)
            .join(" → ")}।`,
        ],
        P(touched, { [k]: "active" }),
        { i: k + 1, delta: v },
      );
    });
    const query = (q) => {
      let s = 0;
      const used = {};
      for (let i = q; i > 0; i -= low(i)) {
        s += t[i];
        used[i - 1] = "good";
        r.step(
          "query",
          [
            `Prefix(${q}): add tree[${i}] = ${t[i]} (covers ${cover[i - 1]}). sum = ${s}. Next i = ${i} − ${low(i)} = ${i - low(i)}.`,
            `Prefix(${q}): tree[${i}] = ${t[i]} যোগ (ঢাকে ${cover[i - 1]})। sum = ${s}। পরের i = ${i} − ${low(i)} = ${i - low(i)}।`,
          ],
          P({ ...used, [i - 1]: "active" }, span(0, q - 1, "range"), i),
          { i, sum: s },
        );
      }
      return s;
    };
    const a = query(6);
    r.step(
      "query",
      [
        `Prefix(6) = ${a} using only 2 cells instead of 6 numbers.`,
        `Prefix(6) = ${a}, ৬টি সংখ্যার বদলে মাত্র ২টি ঘর দিয়ে।`,
      ],
      P({}, span(0, 5, "good")),
      { sum: a },
      String(a),
    );
    nums[2] += 2;
    for (let i = 3; i <= n; i += low(i)) {
      t[i] += 2;
      r.step(
        "add",
        [
          `Add(3, +2): tree[${i}] += 2 → ${t[i]}. Next i = ${i} + ${low(i)} = ${i + low(i)}.`,
          `Add(3, +2): tree[${i}] += 2 → ${t[i]}। পরের i = ${i} + ${low(i)} = ${i + low(i)}।`,
        ],
        P({ [i - 1]: "warn" }, { 2: "warn" }, i),
        { i, delta: 2 },
      );
    }
    const b = query(6);
    r.step(
      "range",
      [
        `After the update, Prefix(6) = ${b}. Range(l, r) = Prefix(r) − Prefix(l − 1).`,
        `আপডেটের পর Prefix(6) = ${b}। Range(l, r) = Prefix(r) − Prefix(l − 1)।`,
      ],
      P({}, span(0, 5, "good")),
      { sum: b },
      String(b),
    );
    return { frames: r.frames, result: [a, b] };
  },
  check: (x) => x[0] === 21 && x[1] === 23,
  complexity: { time: "O(log n) per update / query", space: "O(n)" },
  mistakes: [
    [
      "Using 0-based indices: i & -i is 0 for i = 0 → infinite loop.",
      "0-ভিত্তিক index: i = 0 হলে i & -i = 0 → অসীম লুপ।",
    ],
    [
      "Setting a value directly: Add takes a DELTA (new − old).",
      "সরাসরি মান বসানো: Add নেয় পার্থক্য (নতুন − পুরোনো)।",
    ],
    [
      "Fenwick handles sums easily, but min/max with updates is awkward → segment tree.",
      "Fenwick-এ যোগফল সহজ, কিন্তু আপডেটসহ min/max ঝামেলা → segment tree।",
    ],
  ],
  followups: [
    [
      [
        "Why does i & -i give the lowest 1-bit?",
        "i & -i কেন সবচেয়ে নিচের ১-বিট দেয়?",
      ],
      [
        "-i is two's complement (~i + 1): all bits above the lowest 1 flip, so AND keeps only that bit.",
        "-i হলো two's complement (~i + 1): নিচের ১-এর উপরের সব বিট উল্টায়, তাই AND শুধু সেই বিট রাখে।",
      ],
    ],
    [
      ["Build in O(n)?", "O(n)-এ তৈরি?"],
      [
        "tree[i] += nums[i]; then push tree[i] into tree[i + (i & -i)] once.",
        "tree[i] += nums[i]; তারপর tree[i]-কে একবার tree[i + (i & -i)]-এ যোগ।",
      ],
    ],
  ],
  practice: [
    lc(307, "Range Sum Query - Mutable", "Medium"),
    lc(315, "Count of Smaller Numbers After Self", "Hard"),
    lc(493, "Reverse Pairs", "Hard"),
    lc(1649, "Create Sorted Array through Instructions", "Hard"),
  ],
};

// ------------------------------------------------------------ 22 Segment Tree
const segment = {
  id: 22,
  slug: "segment-tree",
  name: "Segment Tree",
  level: 2,
  problem: lc(307, "Range Sum Query - Mutable", "Medium"),
  input: "nums = [2, 1, 5, 3, 4, 2, 6, 1]; Query(2, 6)",
  expected: "20  (5 + 3 + 4 + 2 + 6)",
  idea: [
    "A segment tree stores the answer for a range in every node: the root covers everything, each child covers half. A query uses at most ~2 nodes per level: fully inside → take it, fully outside → ignore, partly → ask both children.",
    "Segment tree-এর প্রতিটি নোডে একটা রেঞ্জের উত্তর থাকে: root পুরোটা, প্রতিটি সন্তান অর্ধেক। প্রশ্নে প্রতি স্তরে ~২টি নোড লাগে: পুরো ভেতরে → নাও, পুরো বাইরে → বাদ, আংশিক → দুই সন্তানকে জিজ্ঞেস।",
  ],
  analogy: [
    "A company report: each manager knows their team's total, so the CEO never counts individual employees.",
    "অফিসের রিপোর্ট: প্রতিটি ম্যানেজার তার দলের মোট জানে, তাই CEO-কে আলাদা করে প্রত্যেক কর্মী গুনতে হয় না।",
  ],
  signals: [
    [
      "Range sum / min / max / gcd with updates",
      "আপডেটসহ রেঞ্জ যোগফল / min / max / gcd",
    ],
    ["Range updates (lazy propagation)", "রেঞ্জ আপডেট (lazy propagation)"],
    [
      "n and q up to 10⁵ → O(log n) per operation",
      "n আর q ১০⁵ পর্যন্ত → প্রতি অপারেশন O(log n)",
    ],
  ],
  code: cs(`
public class SegmentTree
{
    private readonly int[] tree; private readonly int n;
    public SegmentTree(int[] nums) { n = nums.Length; tree = new int[4 * n]; Build(nums, 1, 0, n - 1); }
    private void Build(int[] a, int node, int l, int r)
    {
        if (l == r) { tree[node] = a[l]; return; } //@leaf
        int m = (l + r) / 2;
        Build(a, 2 * node, l, m); Build(a, 2 * node + 1, m + 1, r);
        tree[node] = tree[2 * node] + tree[2 * node + 1]; //@pull
    }
    public int Query(int ql, int qr) => Query(1, 0, n - 1, ql, qr);
    private int Query(int node, int l, int r, int ql, int qr)
    {
        if (qr < l || r < ql) return 0; //@out
        if (ql <= l && r <= qr) return tree[node]; //@in
        int m = (l + r) / 2; //@split
        return Query(2 * node, l, m, ql, qr) + Query(2 * node + 1, m + 1, r, ql, qr);
    }
    public void Update(int i, int val) => Update(1, 0, n - 1, i, val);
    private void Update(int node, int l, int r, int i, int val)
    {
        if (l == r) { tree[node] = val; return; }
        int m = (l + r) / 2;
        if (i <= m) Update(2 * node, l, m, i, val); else Update(2 * node + 1, m + 1, r, i, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }
}`),
  trace() {
    const a = [2, 1, 5, 3, 4, 2, 6, 1];
    const n = a.length;
    const tree = new Array(2 * n - 1).fill(null);
    const range = {};
    const r = recorder();
    const hi = {};
    const P = (ah = {}) => [
      BTree(tree.slice(), {
        label: "segment tree (node = sum of its range)",
        hi: { ...hi },
        notes: { ...range },
      }),
      A(a, { label: "nums", hi: ah }),
    ];
    const build = (node, l, rr) => {
      const k = node - 1;
      range[k] = `${l}..${rr}`;
      if (l === rr) {
        tree[k] = a[l];
        hi[k] = "active";
        r.step(
          "leaf",
          [
            `Leaf for index ${l}: value ${a[l]}.`,
            `index ${l}-এর পাতা: মান ${a[l]}।`,
          ],
          P({ [l]: "active" }),
          { node, l, r: rr },
        );
        hi[k] = "done";
        return;
      }
      const m = (l + rr) >> 1;
      build(2 * node, l, m);
      build(2 * node + 1, m + 1, rr);
      tree[k] = tree[2 * node - 1] + tree[2 * node];
      hi[k] = "active";
      r.step(
        "pull",
        [
          `Node ${l}..${rr} = left ${tree[2 * node - 1]} + right ${tree[2 * node]} = ${tree[k]}.`,
          `নোড ${l}..${rr} = বাম ${tree[2 * node - 1]} + ডান ${tree[2 * node]} = ${tree[k]}।`,
        ],
        P(span(l, rr, "range")),
        { node, l, r: rr },
      );
      hi[k] = "done";
    };
    build(1, 0, n - 1);
    Object.keys(hi).forEach((k) => delete hi[k]);
    const ql = 2,
      qr = 6;
    r.step(
      "split",
      [
        `Built! Now Query(${ql}, ${qr}): sum of nums[${ql}..${qr}].`,
        `তৈরি শেষ! এবার Query(${ql}, ${qr}): nums[${ql}..${qr}]-এর যোগফল।`,
      ],
      P(span(ql, qr, "range")),
      { ql, qr },
    );
    let total = 0;
    const query = (node, l, rr) => {
      const k = node - 1;
      if (qr < l || rr < ql) {
        hi[k] = "dim";
        r.step(
          "out",
          [
            `Node ${l}..${rr} is completely outside → contributes 0.`,
            `নোড ${l}..${rr} পুরোপুরি বাইরে → ০ দেয়।`,
          ],
          P(span(ql, qr, "range")),
          { ql, qr, sum: total },
        );
        return 0;
      }
      if (ql <= l && rr <= qr) {
        hi[k] = "good";
        total += tree[k];
        r.step(
          "in",
          [
            `Node ${l}..${rr} is completely inside → take ${tree[k]} at once. sum = ${total}.`,
            `নোড ${l}..${rr} পুরোপুরি ভেতরে → একবারেই ${tree[k]} নিই। sum = ${total}।`,
          ],
          P(span(l, rr, "good", span(ql, qr, "range"))),
          { ql, qr, sum: total },
        );
        return tree[k];
      }
      hi[k] = "warn";
      r.step(
        "split",
        [
          `Node ${l}..${rr} is partly inside → ask both children.`,
          `নোড ${l}..${rr} আংশিক ভেতরে → দুই সন্তানকে জিজ্ঞেস।`,
        ],
        P(span(ql, qr, "range")),
        { ql, qr, sum: total },
      );
      const m = (l + rr) >> 1;
      return query(2 * node, l, m) + query(2 * node + 1, m + 1, rr);
    };
    const ans = query(1, 0, n - 1);
    r.step(
      "in",
      [
        `Query(${ql}, ${qr}) = ${ans}, touching only a few nodes.`,
        `Query(${ql}, ${qr}) = ${ans}, মাত্র কয়েকটি নোড ছুঁয়ে।`,
      ],
      P(span(ql, qr, "good")),
      { sum: ans },
      String(ans),
    );
    return { frames: r.frames, result: ans };
  },
  check: (x) => x === 20,
  complexity: {
    time: "Build O(n), query/update O(log n)",
    space: "O(4n) array",
  },
  mistakes: [
    [
      "Array too small: allocate 4n for a recursive segment tree.",
      "অ্যারে ছোট: রিকার্সিভ segment tree-তে 4n বরাদ্দ করুন।",
    ],
    [
      'Wrong "outside" check — it\'s qr < l || r < ql.',
      '"বাইরে" চেক ভুল — সঠিকটা qr < l || r < ql।',
    ],
    [
      "Forgetting to recompute parents after an update.",
      "আপডেটের পর মা-বাবা নোড আবার হিসাব না করা।",
    ],
  ],
  followups: [
    [
      ["What is lazy propagation?", "lazy propagation কী?"],
      [
        "For range updates, store a pending change at a node and push it to children only when needed.",
        "রেঞ্জ আপডেটে নোডে একটা বাকি পরিবর্তন রেখে দিন, দরকার হলে তবেই সন্তানে পাঠান।",
      ],
    ],
    [
      ["Segment tree vs Fenwick?", "Segment tree বনাম Fenwick?"],
      [
        "Segment: any associative op (min, max, gcd), range updates. Fenwick: shorter, mainly sums.",
        "Segment: যেকোনো associative অপারেশন (min, max, gcd), রেঞ্জ আপডেট। Fenwick: ছোট, মূলত যোগফল।",
      ],
    ],
  ],
  practice: [
    lc(307, "Range Sum Query - Mutable", "Medium"),
    lc(699, "Falling Squares", "Hard"),
    lc(715, "Range Module", "Hard"),
    lc(218, "The Skyline Problem", "Hard"),
  ],
};

// ------------------------------------------------------------ 23 Sparse Table
const sparse = {
  id: 23,
  slug: "sparse-table",
  name: "Sparse Table",
  level: 2,
  problem: {
    n: "RMQ",
    title: "Static Range Minimum Query",
    level: "Medium",
    url: "https://cses.fi/problemset/task/1647",
  },
  input: "nums = [5, 2, 4, 7, 1, 3, 6, 8]; Min(1, 6)",
  expected: "1",
  idea: [
    "For data that NEVER changes, precompute st[k][i] = min of the 2^k numbers starting at i. Any range is covered by two overlapping power-of-two blocks, so Min(l, r) is answered in O(1). Overlap is fine because min(x, x) = x.",
    "যে ডেটা কখনো বদলায় না, তার জন্য আগেই st[k][i] = i থেকে শুরু 2^k টি সংখ্যার min বের করে রাখুন। যেকোনো রেঞ্জ দুটো ওভারল্যাপিং ২-এর-ঘাত ব্লকে ঢাকা যায়, তাই Min(l, r) O(1)-এ। ওভারল্যাপে সমস্যা নেই কারণ min(x, x) = x।",
  ],
  analogy: [
    "Covering a shelf with two overlapping rulers of the same length — together they cover it all.",
    "একই মাপের দুটো স্কেল ওভারল্যাপ করে তাক ঢাকা — দুটো মিলে পুরোটা ঢাকে।",
  ],
  signals: [
    [
      "Many range min/max/gcd queries, NO updates",
      "অনেক রেঞ্জ min/max/gcd প্রশ্ন, কোনো আপডেট নেই",
    ],
    ["O(1) per query is required", "প্রতি প্রশ্ন O(1) লাগবে"],
    [
      "Binary lifting (kth ancestor, LCA) uses the same doubling idea",
      "Binary lifting (kth ancestor, LCA)-ও একই দ্বিগুণ ধারণা",
    ],
  ],
  code: cs(`
public class SparseTable
{
    private readonly int[][] st; private readonly int[] log;
    public SparseTable(int[] a)
    {
        int n = a.Length;
        log = new int[n + 1];
        for (int i = 2; i <= n; i++) log[i] = log[i / 2] + 1;
        st = new int[log[n] + 1][];
        st[0] = (int[])a.Clone(); //@base
        for (int k = 1; k < st.Length; k++) //@level
        {
            int len = 1 << k;
            st[k] = new int[n - len + 1];
            for (int i = 0; i + len <= n; i++)
                st[k][i] = Math.Min(st[k - 1][i], st[k - 1][i + len / 2]); //@min
        }
    }
    public int Min(int l, int r) // inclusive, O(1)
    {
        int k = log[r - l + 1]; //@k
        return Math.Min(st[k][l], st[k][r - (1 << k) + 1]); //@answer
    }
}`),
  trace() {
    const a = [5, 2, 4, 7, 1, 3, 6, 8];
    const n = a.length;
    const st = [a.slice()];
    const r = recorder();
    const G = (hi = {}) => [
      Grid(
        st.map((row) => [...row, ...new Array(n - row.length).fill("")]),
        {
          label: "st[k][i]  (row k = blocks of 2^k)",
          rowLabels: st.map((_, k) => `k=${k} (${1 << k})`),
          colLabels: a.map((_, i) => String(i)),
          hi,
        },
      ),
    ];
    r.step(
      "base",
      [
        "Row k=0: blocks of length 1 — just the numbers themselves.",
        "সারি k=0: দৈর্ঘ্য ১-এর ব্লক — সংখ্যাগুলো নিজেই।",
      ],
      G(),
      {},
    );
    for (let k = 1; 1 << k <= n; k++) {
      const len = 1 << k;
      st[k] = [];
      r.step(
        "level",
        [
          `Row k=${k}: each cell = min of ${len} numbers = min of two cells from row ${k - 1}.`,
          `সারি k=${k}: প্রতিটি ঘর = ${len}টি সংখ্যার min = সারি ${k - 1}-এর দুটো ঘরের min।`,
        ],
        G(),
        { k, len },
      );
      for (let i = 0; i + len <= n; i++) {
        st[k][i] = Math.min(st[k - 1][i], st[k - 1][i + len / 2]);
        if (k < 3 && i > 1 && i < n - len) continue;
        r.step(
          "min",
          [
            `st[${k}][${i}] = min(st[${k - 1}][${i}] = ${st[k - 1][i]}, st[${k - 1}][${i + len / 2}] = ${st[k - 1][i + len / 2]}) = ${st[k][i]}.`,
            `st[${k}][${i}] = min(${st[k - 1][i]}, ${st[k - 1][i + len / 2]}) = ${st[k][i]}।`,
          ],
          G({
            [`${k},${i}`]: "good",
            [`${k - 1},${i}`]: "active",
            [`${k - 1},${i + len / 2}`]: "active",
          }),
          { k, i },
        );
      }
      r.step(
        "level",
        [`Row k=${k} complete.`, `সারি k=${k} সম্পূর্ণ।`],
        G(Object.fromEntries(st[k].map((_, i) => [`${k},${i}`, "done"]))),
        { k },
      );
    }
    const l = 1,
      rr = 6,
      len = rr - l + 1;
    const k = Math.floor(Math.log2(len));
    r.step(
      "k",
      [
        `Min(${l}, ${rr}): length ${len}. Biggest power of two ≤ ${len} is ${1 << k} → k = ${k}.`,
        `Min(${l}, ${rr}): দৈর্ঘ্য ${len}। ${len}-এর সমান বা ছোট সবচেয়ে বড় ২-এর ঘাত ${1 << k} → k = ${k}।`,
      ],
      G(),
      { l, r: rr, k },
    );
    const j = rr - (1 << k) + 1;
    const ans = Math.min(st[k][l], st[k][j]);
    r.step(
      "answer",
      [
        `Two blocks: st[${k}][${l}] covers ${l}..${l + (1 << k) - 1} (min ${st[k][l]}), st[${k}][${j}] covers ${j}..${rr} (min ${st[k][j]}). They overlap — fine. Answer = ${ans}.`,
        `দুটো ব্লক: st[${k}][${l}] ঢাকে ${l}..${l + (1 << k) - 1} (min ${st[k][l]}), st[${k}][${j}] ঢাকে ${j}..${rr} (min ${st[k][j]})। ওভারল্যাপ — সমস্যা নেই। উত্তর = ${ans}।`,
      ],
      G({
        [`${k},${l}`]: "good",
        [`${k},${j}`]: "good",
        ...Object.fromEntries(
          a.map((_, i) => [`0,${i}`, i >= l && i <= rr ? "range" : undefined]),
        ),
      }),
      { l, r: rr, k },
      String(ans),
    );
    return { frames: r.frames, result: ans };
  },
  check: (x) => x === 1,
  complexity: { time: "Build O(n log n), query O(1)", space: "O(n log n)" },
  mistakes: [
    [
      "Using it when the array changes → rebuild costs O(n log n). Use a segment tree.",
      "অ্যারে বদলালে ব্যবহার → আবার তৈরি O(n log n)। segment tree নিন।",
    ],
    [
      "Using it for SUM with overlapping blocks → counts numbers twice.",
      "ওভারল্যাপিং ব্লকে SUM → সংখ্যা দুবার গোনা হয়।",
    ],
    [
      "Computing log with Math.Log (floating point errors) → precompute log[].",
      "Math.Log দিয়ে log (দশমিক ভুল) → আগেই log[] বানান।",
    ],
  ],
  followups: [
    [
      [
        "Why does overlap work for min but not sum?",
        "ওভারল্যাপ min-এ চলে, sum-এ না কেন?",
      ],
      [
        "min is idempotent: min(x, x) = x. Sum is not: x + x ≠ x.",
        "min idempotent: min(x, x) = x। sum নয়: x + x ≠ x।",
      ],
    ],
    [
      ["Where else is 'doubling' used?", "'দ্বিগুণ' ধারণা আর কোথায়?"],
      [
        "Binary lifting: up[k][v] = 2^k-th ancestor of v, for LCA and kth ancestor (LeetCode 1483).",
        "Binary lifting: up[k][v] = v-এর 2^k-তম পূর্বপুরুষ, LCA আর kth ancestor-এ (LeetCode 1483)।",
      ],
    ],
  ],
  practice: [
    {
      n: "CSES",
      title: "Static Range Minimum Queries",
      level: "Medium",
      url: "https://cses.fi/problemset/task/1647",
    },
    lc(239, "Sliding Window Maximum", "Hard"),
    lc(
      1438,
      "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit",
      "Medium",
    ),
    lc(1483, "Kth Ancestor of a Tree Node", "Hard"),
  ],
};

// ------------------------------------------------------------------- 24 Heaps
const heaps = {
  id: 24,
  slug: "heaps",
  name: "Heaps",
  level: 2,
  problem: lc(215, "Kth Largest Element in an Array", "Medium"),
  input: "nums = [3, 2, 1, 5, 6, 4], k = 2",
  expected: "5",
  idea: [
    "A heap always keeps the smallest (min-heap) item at the top, with O(log n) push/pop. For the k-th largest, keep a min-heap of size k: it holds the k biggest so far, and its top is the k-th largest. Anything bigger kicks the top out.",
    "Heap সবসময় সবচেয়ে ছোটটা (min-heap) উপরে রাখে, push/pop O(log n)। k-তম বড়র জন্য k মাপের min-heap রাখুন: এতে এখন পর্যন্ত সবচেয়ে বড় k টি থাকে, আর উপরেরটাই k-তম বড়।",
  ],
  analogy: [
    "A top-k leaderboard: the weakest of the top k sits at the door; a stronger newcomer pushes them out.",
    "সেরা k জনের তালিকা: k জনের মধ্যে দুর্বলতম দরজায় বসে; শক্তিশালী নতুন কেউ এলে তাকে বের করে দেয়।",
  ],
  signals: [
    ['"k-th largest / smallest", "top k"', '"k-তম বড় / ছোট", "সেরা k"'],
    [
      "Repeatedly take the min/max (scheduling, Dijkstra)",
      "বারবার min/max নেওয়া (scheduling, Dijkstra)",
    ],
    [
      "Merge k sorted lists, running median",
      "k টি sorted লিস্ট জোড়া, চলমান median",
    ],
  ],
  code: cs(`
public int FindKthLargest(int[] nums, int k)
{
    var heap = new PriorityQueue<int, int>(); // min-heap by priority //@init
    foreach (int n in nums) //@loop
    {
        heap.Enqueue(n, n); //@push
        if (heap.Count > k) heap.Dequeue(); // drop the smallest //@pop
    }
    return heap.Peek(); //@ret
}`),
  trace() {
    const nums = [3, 2, 1, 5, 6, 4],
      k = 2;
    const r = recorder();
    const h = [];
    const P = (i, hh = {}) => [
      A(nums, {
        label: "nums",
        ptr: ptr([[i, "n"]]),
        hi: i >= 0 ? { ...span(0, i - 1, "done"), [i]: "active" } : {},
      }),
      BTree(h.slice(), { label: "min-heap (smallest on top)", hi: hh }),
    ];
    const up = (i) => {
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (h[p] <= h[i]) break;
        [h[p], h[i]] = [h[i], h[p]];
        i = p;
      }
      return i;
    };
    const down = () => {
      let i = 0;
      for (;;) {
        const l = 2 * i + 1,
          rr = l + 1;
        let m = i;
        if (l < h.length && h[l] < h[m]) m = l;
        if (rr < h.length && h[rr] < h[m]) m = rr;
        if (m === i) return;
        [h[m], h[i]] = [h[i], h[m]];
        i = m;
      }
    };
    r.step(
      "init",
      [
        `Empty min-heap. We'll keep only the ${k} biggest numbers.`,
        `খালি min-heap। শুধু সবচেয়ে বড় ${k}টি সংখ্যা রাখব।`,
      ],
      P(-1),
      { k },
    );
    nums.forEach((n, i) => {
      r.step("loop", [`Next number: ${n}.`, `পরের সংখ্যা: ${n}।`], P(i), {
        k,
        size: h.length,
      });
      h.push(n);
      const at = up(h.length - 1);
      r.step(
        "push",
        [
          `Push ${n}; it bubbles up until its parent is smaller. Top = ${h[0]}.`,
          `${n} push; মা-বাবা ছোট না হওয়া পর্যন্ত উপরে ওঠে। উপরে = ${h[0]}।`,
        ],
        P(i, { [at]: "active" }),
        { k, size: h.length },
      );
      if (h.length > k) {
        const gone = h[0];
        h[0] = h.pop();
        down();
        r.step(
          "pop",
          [
            `Size ${k + 1} > ${k} → remove the smallest (${gone}). It can't be in the top ${k}.`,
            `মাপ ${k + 1} > ${k} → সবচেয়ে ছোট (${gone}) বাদ। এটা সেরা ${k}-এ থাকতে পারে না।`,
          ],
          P(i, { 0: "warn" }),
          { k, size: h.length, removed: gone },
        );
      }
    });
    r.step(
      "ret",
      [
        `The heap holds the ${k} biggest: [${[...h].sort((x, y) => y - x).join(", ")}]. Top = ${h[0]} = the ${k}nd largest.`,
        `heap-এ সবচেয়ে বড় ${k}টি: [${[...h].sort((x, y) => y - x).join(", ")}]। উপরেরটা ${h[0]} = ${k}-তম বড়।`,
      ],
      P(-1, { 0: "good" }),
      { k },
      String(h[0]),
    );
    return { frames: r.frames, result: h[0] };
  },
  check: (x) => x === 5,
  complexity: { time: "O(n log k)", space: "O(k)" },
  mistakes: [
    [
      "Using a max-heap of all n items → O(n log n) and O(n) memory.",
      "সব n টি max-heap-এ → O(n log n) আর O(n) মেমরি।",
    ],
    [
      "PriorityQueue<TElement, TPriority> is a MIN-heap; for max use Comparer<int>.Create((a, b) => b.CompareTo(a)).",
      "PriorityQueue min-heap; max-এর জন্য Comparer<int>.Create((a, b) => b.CompareTo(a))।",
    ],
    [
      "Sorting the whole array is simpler but O(n log n).",
      "পুরো অ্যারে sort সহজ, কিন্তু O(n log n)।",
    ],
  ],
  followups: [
    [
      ["Can it be faster than O(n log k)?", "O(n log k)-এর চেয়ে দ্রুত হয়?"],
      [
        "Quickselect: average O(n), worst O(n²).",
        "Quickselect: গড়ে O(n), সবচেয়ে খারাপে O(n²)।",
      ],
    ],
    [
      ["Running median of a stream?", "স্ট্রিমের চলমান median?"],
      [
        "Two heaps: a max-heap for the lower half, a min-heap for the upper half (LeetCode 295).",
        "দুটো heap: নিচের অর্ধেকে max-heap, উপরের অর্ধেকে min-heap (LeetCode 295)।",
      ],
    ],
  ],
  practice: [
    lc(215, "Kth Largest Element in an Array", "Medium"),
    lc(703, "Kth Largest Element in a Stream", "Easy"),
    lc(347, "Top K Frequent Elements", "Medium"),
    lc(973, "K Closest Points to Origin", "Medium"),
    lc(295, "Find Median from Data Stream", "Hard"),
    lc(23, "Merge k Sorted Lists", "Hard"),
  ],
};

// ---------------------------------------------------------------- 25 Intervals
const intervals = {
  id: 25,
  slug: "intervals",
  name: "Intervals",
  level: 2,
  problem: lc(56, "Merge Intervals", "Medium"),
  input: "[[1,3], [8,10], [2,6], [15,18], [9,11]]",
  expected: "[[1,6], [8,11], [15,18]]",
  idea: [
    "Sort intervals by START. Then walk once: if the next interval starts before the last merged one ends, they overlap → stretch the end. Otherwise start a new merged interval.",
    "interval-গুলো শুরুর সময় অনুযায়ী sort করুন। তারপর একবার হাঁটুন: পরেরটা যদি শেষ জোড়া দেওয়াটা শেষ হওয়ার আগে শুরু হয়, তাহলে ওভারল্যাপ → শেষ প্রান্ত বাড়ান। নইলে নতুন interval শুরু।",
  ],
  analogy: [
    "Booking a meeting room: meetings that touch or overlap merge into one busy block on the calendar.",
    "মিটিং রুম বুকিং: ছুঁয়ে যাওয়া বা ওভারল্যাপ করা মিটিং ক্যালেন্ডারে এক ব্যস্ত ব্লকে মিশে যায়।",
  ],
  signals: [
    [
      "Pairs [start, end]: meetings, bookings, ranges",
      "[start, end] জোড়া: মিটিং, বুকিং, রেঞ্জ",
    ],
    [
      "Merge / insert / count overlaps / rooms needed",
      "জোড়া / ঢোকানো / ওভারল্যাপ গোনা / কত রুম লাগবে",
    ],
    [
      "Sorting by start (or end) is the first step",
      "প্রথম ধাপ: শুরু (বা শেষ) অনুযায়ী sort",
    ],
  ],
  code: cs(`
public int[][] Merge(int[][] intervals)
{
    Array.Sort(intervals, (a, b) => a[0].CompareTo(b[0])); //@sort
    var merged = new List<int[]>();
    foreach (var cur in intervals) //@loop
    {
        if (merged.Count > 0 && cur[0] <= merged[^1][1]) //@overlap
            merged[^1][1] = Math.Max(merged[^1][1], cur[1]); //@extend
        else
            merged.Add(cur); //@add
    }
    return merged.ToArray(); //@ret
}`),
  trace() {
    let iv = [
      [1, 3],
      [8, 10],
      [2, 6],
      [15, 18],
      [9, 11],
    ];
    const r = recorder();
    const merged = [];
    const P = (hi = {}, mh = {}) => [
      Bars(
        iv.map((x) => x.slice()),
        { label: "intervals", max: 20, hi },
      ),
      Bars(
        merged.map((x) => x.slice()),
        { label: "merged", max: 20, hi: mh },
      ),
    ];
    r.step(
      "sort",
      [
        "Unsorted input: overlaps are hard to see.",
        "sort না করা ইনপুট: ওভারল্যাপ বোঝা কঠিন।",
      ],
      P(),
      {},
    );
    iv = iv.sort((a, b) => a[0] - b[0]);
    r.step(
      "sort",
      [
        "Sorted by start → overlapping intervals are now neighbors.",
        "শুরু অনুযায়ী sort → ওভারল্যাপ করা interval এখন পাশাপাশি।",
      ],
      P(),
      {},
    );
    iv.forEach((cur, i) => {
      r.step(
        "loop",
        [`Next interval: [${cur}].`, `পরের interval: [${cur}]।`],
        P({ [i]: "active" }, { [merged.length - 1]: "range" }),
        {},
      );
      const last = merged.at(-1);
      if (last && cur[0] <= last[1]) {
        r.step(
          "overlap",
          [
            `${cur[0]} ≤ ${last[1]} → starts before [${last}] ends → overlap!`,
            `${cur[0]} ≤ ${last[1]} → [${last}] শেষ হওয়ার আগেই শুরু → ওভারল্যাপ!`,
          ],
          P({ [i]: "warn" }, { [merged.length - 1]: "warn" }),
          {},
        );
        last[1] = Math.max(last[1], cur[1]);
        r.step(
          "extend",
          [
            `Stretch the end to max(…, ${cur[1]}) → [${last}].`,
            `শেষ প্রান্ত বাড়াই max(…, ${cur[1]}) → [${last}]।`,
          ],
          P({ [i]: "done" }, { [merged.length - 1]: "good" }),
          {},
        );
      } else {
        merged.push(cur.slice());
        r.step(
          "add",
          [
            last
              ? `${cur[0]} > ${last[1]} → no overlap. Start a new block [${cur}].`
              : `First interval → start a block [${cur}].`,
            last
              ? `${cur[0]} > ${last[1]} → ওভারল্যাপ নেই। নতুন ব্লক [${cur}]।`
              : `প্রথম interval → ব্লক শুরু [${cur}]।`,
          ],
          P({ [i]: "done" }, { [merged.length - 1]: "good" }),
          {},
        );
      }
    });
    const s = merged.map((x) => `[${x}]`).join(", ");
    r.step("ret", [`Result: ${s}.`, `ফলাফল: ${s}।`], P(), {}, s);
    return { frames: r.frames, result: merged };
  },
  check: (x) => JSON.stringify(x) === "[[1,6],[8,11],[15,18]]",
  complexity: { time: "O(n log n) for the sort", space: "O(n)" },
  mistakes: [
    ["Forgetting to sort first.", "প্রথমে sort করতে ভুলে যাওয়া।"],
    [
      "Setting end = cur[1] instead of Max(end, cur[1]) — [1,10] + [2,3] must stay [1,10].",
      "Max(end, cur[1])-এর বদলে end = cur[1] — [1,10] + [2,3] হতে হবে [1,10]।",
    ],
    [
      "Touching intervals ([1,2],[2,3]): check if the problem treats them as overlapping (<= vs <).",
      "ছুঁয়ে থাকা ([1,2],[2,3]): সমস্যা এদের ওভারল্যাপ ধরে কি না দেখুন (<= বনাম <)।",
    ],
  ],
  followups: [
    [
      ["Minimum meeting rooms?", "সর্বনিম্ন কত মিটিং রুম?"],
      [
        "Sort starts and ends separately (or use a min-heap of end times); the max overlap is the answer (LeetCode 253).",
        "শুরু আর শেষ আলাদাভাবে sort (বা শেষ সময়ের min-heap); সর্বোচ্চ ওভারল্যাপই উত্তর (LeetCode 253)।",
      ],
    ],
    [
      [
        "Remove the fewest intervals so none overlap?",
        "সবচেয়ে কম interval বাদ দিয়ে ওভারল্যাপ মুক্ত?",
      ],
      [
        "Greedy: sort by END, keep each interval that starts after the last kept end (LeetCode 435).",
        "Greedy: শেষ অনুযায়ী sort, শেষ রাখা interval শেষ হওয়ার পর যেটা শুরু হয় সেটা রাখুন (LeetCode 435)।",
      ],
    ],
  ],
  practice: [
    lc(56, "Merge Intervals", "Medium"),
    lc(57, "Insert Interval", "Medium"),
    lc(435, "Non-overlapping Intervals", "Medium"),
    lc(452, "Minimum Number of Arrows to Burst Balloons", "Medium"),
    lc(253, "Meeting Rooms II", "Medium"),
  ],
};

// ------------------------------------------------------ 26 Data Structure Design
const design = {
  id: 26,
  slug: "data-structure-design",
  name: "Data Structure Design",
  level: 2,
  problem: lc(146, "LRU Cache", "Medium"),
  input:
    "capacity 2: Put(1,1) Put(2,2) Get(1) Put(3,3) Get(2) Put(4,4) Get(1) Get(3) Get(4)",
  expected: "Gets → 1, -1, -1, 3, 4",
  idea: [
    "Design questions combine simple structures so every operation is O(1). LRU Cache = Dictionary (find a key instantly) + doubly LinkedList (order by recency; move/remove a node instantly). Front = most recent, back = least recent → evict from the back.",
    "ডিজাইন প্রশ্নে সাধারণ কাঠামো জুড়ে প্রতিটি অপারেশন O(1) বানাতে হয়। LRU Cache = Dictionary (key সাথে সাথে খোঁজা) + doubly LinkedList (সাম্প্রতিকতার ক্রম; নোড সাথে সাথে সরানো)। সামনে = সবচেয়ে নতুন, পেছনে = সবচেয়ে পুরোনো → পেছন থেকে বাদ।",
  ],
  analogy: [
    "A small desk: whatever you touch goes on top of the pile; when the desk is full, the paper at the bottom goes back to the shelf.",
    "ছোট টেবিল: যা ধরেন তা স্তূপের উপরে যায়; টেবিল ভরে গেলে নিচের কাগজটা তাকে ফেরত যায়।",
  ],
  signals: [
    [
      '"Design a class that supports … in O(1)"',
      '"এমন ক্লাস বানান যা … O(1)-এ করে"',
    ],
    [
      "Cache, rate limiter, iterator, randomized set",
      "Cache, rate limiter, iterator, randomized set",
    ],
    [
      "Combine two structures: each fixes the other's weakness",
      "দুটো কাঠামো জোড়া: একটা আরেকটার দুর্বলতা ঢাকে",
    ],
  ],
  code: cs(`
public class LRUCache
{
    private readonly int capacity;
    private readonly Dictionary<int, LinkedListNode<(int key, int val)>> map = new();
    private readonly LinkedList<(int key, int val)> order = new(); // front = most recent
    public LRUCache(int capacity) => this.capacity = capacity;
    public int Get(int key)
    {
        if (!map.TryGetValue(key, out var node)) return -1; //@miss
        order.Remove(node); order.AddFirst(node); // mark as fresh //@touch
        return node.Value.val;
    }
    public void Put(int key, int value)
    {
        if (map.TryGetValue(key, out var old)) order.Remove(old); //@update
        else if (map.Count == capacity) //@full
        {
            map.Remove(order.Last.Value.key); order.RemoveLast(); //@evict
        }
        map[key] = order.AddFirst((key, value)); //@put
    }
}`),
  trace() {
    const cap = 2;
    const r = recorder();
    let order = [];
    const out = [];
    const P = (qh = {}) => [
      Queue(
        order.map(([k, v]) => `${k}:${v}`),
        { label: "order  (front = most recent … back = least recent)", hi: qh },
      ),
      Map_(
        order.map(([k]) => [k, "→ node"]).sort((a, b) => a[0] - b[0]),
        { label: "map: key → list node" },
      ),
      Chips(out.slice(), { label: "Get results" }),
    ];
    const ops = [
      ["put", 1, 1],
      ["put", 2, 2],
      ["get", 1],
      ["put", 3, 3],
      ["get", 2],
      ["put", 4, 4],
      ["get", 1],
      ["get", 3],
      ["get", 4],
    ];
    for (const [op, k, v] of ops) {
      if (op === "get") {
        const i = order.findIndex((x) => x[0] === k);
        if (i < 0) {
          out.push(-1);
          r.step(
            "miss",
            [`Get(${k}): not in the map → -1.`, `Get(${k}): map-এ নেই → -1।`],
            P(),
            { op: `Get(${k})` },
            "-1",
          );
        } else {
          const node = order.splice(i, 1)[0];
          order.unshift(node);
          out.push(node[1]);
          r.step(
            "touch",
            [
              `Get(${k}): found → move it to the front (most recent). Return ${node[1]}.`,
              `Get(${k}): পাওয়া গেল → সামনে সরাই (সবচেয়ে নতুন)। ফেরত ${node[1]}।`,
            ],
            P({ 0: "good" }),
            { op: `Get(${k})` },
            String(node[1]),
          );
        }
      } else {
        const i = order.findIndex((x) => x[0] === k);
        if (i >= 0) {
          order.splice(i, 1);
          r.step(
            "update",
            [
              `Put(${k}): key exists → remove the old node first.`,
              `Put(${k}): key আছে → আগে পুরোনো নোড সরাই।`,
            ],
            P(),
            { op: `Put(${k},${v})` },
          );
        } else if (order.length === cap) {
          r.step(
            "full",
            [
              `Put(${k}): cache is full (${cap}).`,
              `Put(${k}): cache পূর্ণ (${cap})।`,
            ],
            P({ [order.length - 1]: "bad" }),
            { op: `Put(${k},${v})` },
          );
          const gone = order.pop();
          r.step(
            "evict",
            [
              `Evict the least recently used key ${gone[0]} (back of the list).`,
              `সবচেয়ে কম ব্যবহৃত key ${gone[0]} বাদ (লিস্টের পেছন)।`,
            ],
            P(),
            { op: `Put(${k},${v})`, evicted: gone[0] },
          );
        }
        order.unshift([k, v]);
        r.step(
          "put",
          [
            `Put(${k}, ${v}): add at the front and store the node in the map.`,
            `Put(${k}, ${v}): সামনে যোগ, আর নোডটা map-এ রাখি।`,
          ],
          P({ 0: "good" }),
          { op: `Put(${k},${v})` },
        );
      }
    }
    return { frames: r.frames, result: out };
  },
  check: (x) => x.join() === "1,-1,-1,3,4",
  complexity: { time: "O(1) for Get and Put", space: "O(capacity)" },
  mistakes: [
    [
      "Using List<T>.Remove → O(n). Keep LinkedListNode references in the map.",
      "List<T>.Remove → O(n)। map-এ LinkedListNode রেফারেন্স রাখুন।",
    ],
    [
      "Forgetting to move the key to the front on Get.",
      "Get-এ key সামনে সরাতে ভুলে যাওয়া।",
    ],
    [
      "Evicting before checking if the key already exists.",
      "key আছে কি না না দেখেই বাদ দেওয়া।",
    ],
  ],
  followups: [
    [
      ["How about thread safety?", "thread safety?"],
      [
        "Wrap operations in a lock, or use a concurrent design; in .NET, IMemoryCache handles eviction for real apps.",
        "অপারেশনগুলো lock-এ মুড়ুন; আসল অ্যাপে .NET-এর IMemoryCache eviction সামলায়।",
      ],
    ],
    [
      ["LFU cache?", "LFU cache?"],
      [
        "Map key → (value, freq) plus freq → LinkedList, and track the min freq (LeetCode 460).",
        "key → (মান, freq) আর freq → LinkedList map, সাথে সর্বনিম্ন freq (LeetCode 460)।",
      ],
    ],
  ],
  practice: [
    lc(146, "LRU Cache", "Medium"),
    lc(155, "Min Stack", "Medium"),
    lc(380, "Insert Delete GetRandom O(1)", "Medium"),
    lc(705, "Design HashSet", "Easy"),
    lc(460, "LFU Cache", "Hard"),
  ],
};

// ----------------------------------------------------------- 27 Greedy Algorithm
const greedy = {
  id: 27,
  slug: "greedy-algorithm",
  name: "Greedy Algorithm",
  level: 2,
  problem: lc(55, "Jump Game", "Medium"),
  input: "nums = [2, 3, 1, 1, 4]",
  expected: "true",
  idea: [
    "Greedy = make the locally best choice at every step and never look back. Here: track the farthest index you can reach. Walk forward; if you ever stand beyond `reach`, you're stuck. If reach covers the last index, you win.",
    "Greedy = প্রতি ধাপে তখনকার সেরা সিদ্ধান্ত নিন, পেছনে তাকাবেন না। এখানে: সবচেয়ে দূরের পৌঁছানো যায় এমন index (reach) মনে রাখুন। সামনে হাঁটুন; reach-এর বাইরে দাঁড়ালে আটকে গেছেন। reach শেষ index ছুঁলে জয়।",
  ],
  analogy: [
    "Crossing stepping stones while always remembering the farthest stone any jump so far could land on.",
    "পাথরে পা দিয়ে নদী পার হওয়া, আর মনে রাখা এখন পর্যন্ত কোন সবচেয়ে দূরের পাথরে লাফানো যেত।",
  ],
  signals: [
    [
      '"Minimum / maximum number of …" with a simple local rule',
      'সহজ নিয়মে "সর্বনিম্ন / সর্বোচ্চ কতগুলো …"',
    ],
    [
      "Sorting + picking (intervals by end, cookies by size)",
      "sort + বাছাই (শেষ অনুযায়ী interval, মাপ অনুযায়ী কুকি)",
    ],
    [
      "You can prove a local choice never hurts",
      "প্রমাণ করা যায় তখনকার সেরা বাছাই কখনো ক্ষতি করে না",
    ],
  ],
  code: cs(`
public bool CanJump(int[] nums)
{
    int reach = 0; //@init
    for (int i = 0; i < nums.Length; i++) //@loop
    {
        if (i > reach) return false; // stuck //@stuck
        reach = Math.Max(reach, i + nums[i]); //@extend
    }
    return true; //@ret
}`),
  trace() {
    const a = [2, 3, 1, 1, 4];
    const r = recorder();
    let reach = 0;
    const P = (i, extra = {}) => [
      A(a, {
        label: "nums (max jump from each index)",
        ptr: ptr([
          [i, "i"],
          [Math.min(reach, a.length - 1), "reach"],
        ]),
        hi: span(0, Math.min(reach, a.length - 1), "range", extra),
      }),
    ];
    r.step(
      "init",
      [
        "Standing at index 0, so reach = 0.",
        "index 0-এ দাঁড়িয়ে, তাই reach = 0।",
      ],
      P(0),
      { reach },
    );
    for (let i = 0; i < a.length; i++) {
      r.step(
        "loop",
        [
          `i = ${i}: can jump up to ${a[i]} steps from here.`,
          `i = ${i}: এখান থেকে সর্বোচ্চ ${a[i]} ধাপ লাফানো যায়।`,
        ],
        P(i, { [i]: "active" }),
        { reach, i },
      );
      if (i > reach) {
        r.step(
          "stuck",
          [
            `i = ${i} > reach = ${reach} → can't get here. false.`,
            `i = ${i} > reach = ${reach} → এখানে আসা অসম্ভব। false।`,
          ],
          P(i, { [i]: "bad" }),
          { reach, i },
          "false",
        );
        return { frames: r.frames, result: false };
      }
      r.step(
        "stuck",
        [
          `i = ${i} ≤ reach = ${reach} → reachable ✓.`,
          `i = ${i} ≤ reach = ${reach} → পৌঁছানো যায় ✓।`,
        ],
        P(i, { [i]: "good" }),
        { reach, i },
      );
      const nr = Math.max(reach, i + a[i]);
      r.step(
        "extend",
        nr > reach
          ? [
              `From ${i} we reach ${i} + ${a[i]} = ${i + a[i]} → reach grows to ${nr}.`,
              `${i} থেকে ${i} + ${a[i]} = ${i + a[i]} পর্যন্ত → reach বেড়ে ${nr}।`,
            ]
          : [
              `${i} + ${a[i]} = ${i + a[i]} doesn't beat reach ${reach}.`,
              `${i} + ${a[i]} = ${i + a[i]}, reach ${reach}-কে ছাড়ায় না।`,
            ],
        (() => {
          reach = nr;
          return P(i, { [i]: "good" });
        })(),
        { reach, i },
      );
      if (reach >= a.length - 1) {
        r.step(
          "ret",
          [
            `reach ${reach} ≥ last index ${a.length - 1} → we can make it! true.`,
            `reach ${reach} ≥ শেষ index ${a.length - 1} → পারা যাবে! true।`,
          ],
          P(i, { [a.length - 1]: "good" }),
          { reach },
          "true",
        );
        return { frames: r.frames, result: true };
      }
    }
    return { frames: r.frames, result: true };
  },
  check: (x) => x === true,
  complexity: { time: "O(n)", space: "O(1)" },
  mistakes: [
    [
      "Trying every jump with recursion → exponential time.",
      "রিকার্শনে প্রতিটি লাফ চেষ্টা → exponential সময়।",
    ],
    [
      "Greedy isn't always right (e.g. Coin Change with coins 1,3,4) — prove it or use DP.",
      "Greedy সবসময় ঠিক না (যেমন কয়েন ১,৩,৪-এ Coin Change) — প্রমাণ করুন, নইলে DP।",
    ],
    [
      "Checking i > reach AFTER updating reach.",
      "reach আপডেটের পরে i > reach দেখা।",
    ],
  ],
  followups: [
    [
      ["Minimum number of jumps?", "সর্বনিম্ন কত লাফ?"],
      [
        "BFS-like greedy: track the current level's end; when i reaches it, jumps++ (LeetCode 45).",
        "BFS-এর মতো greedy: বর্তমান স্তরের শেষ মনে রাখুন; i সেখানে পৌঁছালে jumps++ (LeetCode 45)।",
      ],
    ],
    [
      ["How do you know greedy works?", "greedy কাজ করবে কীভাবে বুঝবেন?"],
      [
        "Exchange argument: show swapping any optimal choice for the greedy one never makes it worse.",
        "Exchange argument: দেখান যে কোনো সর্বোত্তম বাছাইয়ের জায়গায় greedy বাছাই দিলে খারাপ হয় না।",
      ],
    ],
  ],
  practice: [
    lc(55, "Jump Game", "Medium"),
    lc(45, "Jump Game II", "Medium"),
    lc(134, "Gas Station", "Medium"),
    lc(763, "Partition Labels", "Medium"),
    lc(455, "Assign Cookies", "Easy"),
  ],
};

// ------------------------------------------------------------------ 28 Graphs
const graphs = {
  id: 28,
  slug: "graphs",
  name: "Graphs",
  level: 2,
  problem: lc(200, "Number of Islands", "Medium"),
  input: "grid = 11000 / 11000 / 00100 / 00011",
  expected: "3",
  idea: [
    "A graph is things (nodes) connected by links (edges). A grid is a graph too: each land cell links to its 4 neighbors. Scan every cell; each time you find unvisited land, that's a NEW island → flood it with BFS (a queue) so you never count it again.",
    "Graph মানে কিছু জিনিস (node) আর তাদের সংযোগ (edge)। গ্রিডও graph: প্রতিটি স্থলের ঘর তার ৪ প্রতিবেশীর সাথে যুক্ত। প্রতিটি ঘর দেখুন; যখনই না-দেখা স্থল পাবেন, সেটা নতুন দ্বীপ → BFS (queue) দিয়ে পুরো দ্বীপ চিহ্নিত করুন যাতে আবার গোনা না হয়।",
  ],
  analogy: [
    "Spilling paint on one land cell: it spreads to every connected land cell. One spill = one island.",
    "এক স্থলের ঘরে রং ঢাললে সব যুক্ত স্থলে ছড়িয়ে পড়ে। এক ঢালা = এক দ্বীপ।",
  ],
  signals: [
    [
      "Grid with regions, mazes, networks, dependencies",
      "অঞ্চলওয়ালা গ্রিড, গোলকধাঁধা, নেটওয়ার্ক, নির্ভরতা",
    ],
    [
      "Shortest path in unweighted graph → BFS",
      "ওজনহীন graph-এ সবচেয়ে ছোট পথ → BFS",
    ],
    [
      "Ordering with prerequisites → topological sort",
      "পূর্বশর্তসহ ক্রম → topological sort",
    ],
  ],
  code: cs(`
public int NumIslands(char[][] grid)
{
    int rows = grid.Length, cols = grid[0].Length, islands = 0;
    int[][] dirs = { new[] { 1, 0 }, new[] { -1, 0 }, new[] { 0, 1 }, new[] { 0, -1 } };
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++) //@scan
        {
            if (grid[r][c] != '1') continue;
            islands++; //@found
            var queue = new Queue<(int r, int c)>();
            queue.Enqueue((r, c)); grid[r][c] = '0'; // sink it = visited
            while (queue.Count > 0)
            {
                var (cr, cc) = queue.Dequeue(); //@visit
                foreach (var d in dirs)
                {
                    int nr = cr + d[0], nc = cc + d[1];
                    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || grid[nr][nc] != '1') continue;
                    grid[nr][nc] = '0'; //@mark
                    queue.Enqueue((nr, nc));
                }
            }
        }
    return islands; //@ret
}`),
  trace() {
    const g = ["11000", "11000", "00100", "00011"].map((s) => s.split(""));
    const rows = g.length,
      cols = g[0].length;
    const owner = {};
    const colors = ["c0", "c1", "c2", "good"];
    const r = recorder();
    let islands = 0;
    const view = () =>
      g.map((row, ri) =>
        row.map((x, ci) =>
          owner[ri + "," + ci] != null
            ? "#" + owner[ri + "," + ci]
            : x === "1"
              ? "🟫"
              : "🌊",
        ),
      );
    const P = (cur, q = [], extra = {}) => {
      const hi = {};
      for (const k in owner) hi[k] = colors[(owner[k] - 1) % colors.length];
      if (cur) hi[cur] = "active";
      return [
        Grid(view(), {
          label: "grid  (🟫 land, 🌊 water, #n = island n)",
          hi: { ...hi, ...extra },
        }),
        Queue(
          q.map(([a, b]) => `(${a},${b})`),
          { label: "BFS queue" },
        ),
      ];
    };
    r.step(
      "scan",
      [
        "Scan every cell, row by row. 🟫 = land, 🌊 = water.",
        "প্রতিটি ঘর সারি ধরে দেখি। 🟫 = স্থল, 🌊 = পানি।",
      ],
      P(),
      { islands },
    );
    for (let rr = 0; rr < rows; rr++)
      for (let c = 0; c < cols; c++) {
        const key = rr + "," + c;
        if (g[rr][c] !== "1" || owner[key] != null) {
          if (g[rr][c] === "1" || (rr + c) % 3 === 0)
            r.step(
              "scan",
              [
                `(${rr},${c}) is ${owner[key] != null ? "already part of island #" + owner[key] : "water"} → skip.`,
                `(${rr},${c}) ${owner[key] != null ? "আগেই দ্বীপ #" + owner[key] + "-এর অংশ" : "পানি"} → বাদ।`,
              ],
              P(key),
              { islands },
            );
          continue;
        }
        islands++;
        owner[key] = islands;
        const q = [[rr, c]];
        r.step(
          "found",
          [
            `(${rr},${c}) is new land → island #${islands}! Start BFS from here.`,
            `(${rr},${c}) নতুন স্থল → দ্বীপ #${islands}! এখান থেকে BFS শুরু।`,
          ],
          P(key, q),
          { islands },
        );
        while (q.length) {
          const [cr, cc] = q.shift();
          r.step(
            "visit",
            [
              `Dequeue (${cr},${cc}) and check its 4 neighbors.`,
              `(${cr},${cc}) বের করে তার ৪ প্রতিবেশী দেখি।`,
            ],
            P(cr + "," + cc, q),
            { islands },
          );
          for (const [dr, dc] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ]) {
            const nr = cr + dr,
              nc = cc + dc,
              nk = nr + "," + nc;
            if (
              nr < 0 ||
              nc < 0 ||
              nr >= rows ||
              nc >= cols ||
              g[nr][nc] !== "1" ||
              owner[nk] != null
            )
              continue;
            owner[nk] = islands;
            q.push([nr, nc]);
            r.step(
              "mark",
              [
                `Neighbor (${nr},${nc}) is land → mark it island #${islands} and enqueue.`,
                `প্রতিবেশী (${nr},${nc}) স্থল → দ্বীপ #${islands} চিহ্ন দিয়ে queue-তে।`,
              ],
              P(nk, q),
              { islands },
            );
          }
        }
      }
    r.step(
      "ret",
      [
        `Scan finished. Number of islands = ${islands}.`,
        `দেখা শেষ। দ্বীপের সংখ্যা = ${islands}।`,
      ],
      P(),
      { islands },
      String(islands),
    );
    return { frames: r.frames, result: islands };
  },
  check: (x) => x === 3,
  complexity: {
    time: "O(rows × cols)",
    space: "O(rows × cols) worst-case queue",
  },
  mistakes: [
    [
      "Marking visited when DEQUEUING (not enqueuing) → the same cell is queued many times.",
      "queue-তে ঢোকানোর বদলে বের করার সময় চিহ্ন → একই ঘর বহুবার queue-তে।",
    ],
    [
      "Counting diagonal neighbors when only 4 directions are allowed.",
      "শুধু ৪ দিক অনুমোদিত, তবু কোনাকুনি প্রতিবেশী গোনা।",
    ],
    [
      "Recursive DFS on a huge grid can overflow the stack → BFS is safer in C#.",
      "বিশাল গ্রিডে রিকার্সিভ DFS-এ stack overflow → C#-এ BFS নিরাপদ।",
    ],
  ],
  followups: [
    [
      ["BFS vs DFS?", "BFS বনাম DFS?"],
      [
        "BFS (queue) explores by distance → shortest path in unweighted graphs. DFS (stack/recursion) goes deep → cycles, components, topological order.",
        "BFS (queue) দূরত্ব অনুযায়ী → ওজনহীন graph-এ ছোট পথ। DFS (stack/রিকার্শন) গভীরে যায় → চক্র, অংশ, topological ক্রম।",
      ],
    ],
    [
      ["Weighted shortest path?", "ওজনসহ ছোট পথ?"],
      [
        "Dijkstra with PriorityQueue (no negative weights) — LeetCode 743.",
        "PriorityQueue দিয়ে Dijkstra (ঋণাত্মক ওজন নয়) — LeetCode 743।",
      ],
    ],
  ],
  practice: [
    lc(200, "Number of Islands", "Medium"),
    lc(133, "Clone Graph", "Medium"),
    lc(207, "Course Schedule", "Medium"),
    lc(994, "Rotting Oranges", "Medium"),
    lc(743, "Network Delay Time", "Medium"),
    lc(127, "Word Ladder", "Hard"),
  ],
};

// ----------------------------------------------------- 29 Dynamic Programming
const dp = {
  id: 29,
  slug: "dynamic-programming",
  name: "Dynamic Programming",
  level: 2,
  problem: lc(322, "Coin Change", "Medium"),
  input: "coins = [1, 3, 4], amount = 6",
  expected: "2  (3 + 3)",
  idea: [
    "DP = solve small versions first and REUSE their answers. dp[a] = fewest coins to make amount a. For each coin: dp[a] = min(dp[a], dp[a − coin] + 1). Note greedy (take 4 first → 4+1+1 = 3 coins) is wrong here; DP finds 3+3 = 2 coins.",
    "DP = আগে ছোট সংস্করণগুলো সমাধান করুন, তারপর সেই উত্তরগুলো আবার ব্যবহার করুন। dp[a] = a টাকা বানাতে সবচেয়ে কম কয়েন। প্রতিটি কয়েনে: dp[a] = min(dp[a], dp[a − coin] + 1)। খেয়াল করুন greedy (আগে ৪ → ৪+১+১ = ৩ কয়েন) এখানে ভুল; DP পায় ৩+৩ = ২ কয়েন।",
  ],
  analogy: [
    "Climbing stairs while writing on each step how you got there cheapest — later steps just read earlier notes.",
    "সিঁড়ি বেয়ে উঠছেন আর প্রতিটি ধাপে লিখে রাখছেন সবচেয়ে সস্তায় কীভাবে এলেন — পরের ধাপ শুধু আগের নোট পড়ে।",
  ],
  signals: [
    [
      '"Number of ways", "minimum cost", "longest …"',
      '"কত উপায়ে", "সর্বনিম্ন খরচ", "সবচেয়ে লম্বা …"',
    ],
    [
      "Choices at each step and overlapping subproblems",
      "প্রতি ধাপে বাছাই, আর একই উপ-সমস্যা বারবার",
    ],
    [
      "Recursion is right but too slow → add memo / table",
      "রিকার্শন ঠিক কিন্তু ধীর → memo / টেবিল যোগ",
    ],
  ],
  code: cs(`
public int CoinChange(int[] coins, int amount)
{
    var dp = new int[amount + 1];
    Array.Fill(dp, amount + 1); // "infinity" //@init
    dp[0] = 0;
    for (int a = 1; a <= amount; a++) //@loop
        foreach (int coin in coins) //@coin
            if (coin <= a) dp[a] = Math.Min(dp[a], dp[a - coin] + 1); //@relax
    return dp[amount] > amount ? -1 : dp[amount]; //@ret
}`),
  trace() {
    const coins = [1, 3, 4],
      amount = 6;
    const INF = amount + 1;
    const d = new Array(amount + 1).fill(INF);
    d[0] = 0;
    const r = recorder();
    const show = () => d.map((x) => (x === INF ? "∞" : x));
    const P = (hi = {}, p = []) => [
      A(show(), { label: "dp[amount] = fewest coins", ptr: ptr(p), hi }),
      Chips(coins, { label: "coins" }),
    ];
    r.step(
      "init",
      [
        "dp[0] = 0 (zero coins make 0). Everything else starts at ∞ (unknown).",
        "dp[0] = 0 (০ টাকায় ০ কয়েন)। বাকি সব ∞ (অজানা) দিয়ে শুরু।",
      ],
      P({ 0: "good" }),
      {},
    );
    for (let a = 1; a <= amount; a++) {
      r.step(
        "loop",
        [
          `Amount ${a}: what's the fewest coins?`,
          `${a} টাকা: সবচেয়ে কম কত কয়েন?`,
        ],
        P({ ...span(0, a - 1, "done"), [a]: "active" }, [[a, "a"]]),
        { a },
      );
      for (const coin of coins) {
        if (coin > a) {
          r.step(
            "coin",
            [
              `Coin ${coin} is bigger than ${a} → can't use it.`,
              `কয়েন ${coin}, ${a}-এর চেয়ে বড় → ব্যবহার করা যাবে না।`,
            ],
            P({ [a]: "active" }, [[a, "a"]]),
            { a, coin },
          );
          continue;
        }
        const before = d[a];
        const cand = d[a - coin] + 1;
        d[a] = Math.min(d[a], cand);
        const fmt = (x) => (x >= INF ? "∞" : x);
        r.step(
          "relax",
          [
            `Use coin ${coin}: dp[${a - coin}] + 1 = ${fmt(cand)}. ${cand < before ? "Better! dp[" + a + "] = " + d[a] + "." : "Not better than " + fmt(before) + "."}`,
            `কয়েন ${coin} নিলে: dp[${a - coin}] + 1 = ${fmt(cand)}। ${cand < before ? "ভালো! dp[" + a + "] = " + d[a] + "।" : fmt(before) + "-এর চেয়ে ভালো না।"}`,
          ],
          P({ [a - coin]: "c1", [a]: cand < before ? "good" : "active" }, [
            [a - coin, "a−" + coin],
            [a, "a"],
          ]),
          { a, coin },
        );
      }
    }
    const ans = d[amount] > amount ? -1 : d[amount];
    r.step(
      "ret",
      [
        `dp[${amount}] = ${ans}: the best is 3 + 3. (Greedy 4 + 1 + 1 would use 3 coins.)`,
        `dp[${amount}] = ${ans}: সেরা হলো ৩ + ৩। (Greedy ৪ + ১ + ১ নিলে ৩টি কয়েন লাগত।)`,
      ],
      P({ [amount]: "good" }),
      {},
      String(ans),
    );
    return { frames: r.frames, result: ans };
  },
  check: (x) => x === 2,
  complexity: { time: "O(amount × coins)", space: "O(amount)" },
  mistakes: [
    [
      "Using int.MaxValue as infinity → dp + 1 overflows to negative. Use amount + 1.",
      "int.MaxValue-কে ∞ ধরলে → dp + 1 overflow হয়ে ঋণাত্মক। amount + 1 নিন।",
    ],
    [
      "Forgetting dp[0] = 0 (the base case).",
      "dp[0] = 0 (base case) ভুলে যাওয়া।",
    ],
    [
      "Plain recursion without memo → exponential time.",
      "memo ছাড়া সাধারণ রিকার্শন → exponential সময়।",
    ],
  ],
  followups: [
    [
      ["Top-down vs bottom-up?", "Top-down বনাম bottom-up?"],
      [
        "Top-down = recursion + memo dictionary. Bottom-up = fill a table from small to big (this solution). Same complexity.",
        "Top-down = রিকার্শন + memo। Bottom-up = ছোট থেকে বড় টেবিল পূরণ (এই সমাধান)। একই জটিলতা।",
      ],
    ],
    [
      ["How do you design a DP?", "DP কীভাবে ডিজাইন করবেন?"],
      [
        "1) Define the state (dp[i] means…), 2) the transition, 3) base cases, 4) answer location, 5) iteration order.",
        "১) state নির্ধারণ (dp[i] মানে…), ২) transition, ৩) base case, ৪) উত্তর কোথায়, ৫) কোন ক্রমে পূরণ।",
      ],
    ],
  ],
  practice: [
    lc(70, "Climbing Stairs", "Easy"),
    lc(322, "Coin Change", "Medium"),
    lc(198, "House Robber", "Medium"),
    lc(300, "Longest Increasing Subsequence", "Medium"),
    lc(1143, "Longest Common Subsequence", "Medium"),
    lc(72, "Edit Distance", "Medium"),
  ],
};

// --------------------------------------------------------- 30 Maths & Geometry
const maths = {
  id: 30,
  slug: "maths-geometry",
  name: "Maths & Geometry",
  level: 2,
  problem: lc(204, "Count Primes", "Medium"),
  input: "n = 30  (count primes < 30)",
  expected: "10",
  idea: [
    'Many problems hide a math shortcut. Sieve of Eratosthenes: every number starts as "maybe prime". Take the next unmarked number p — it IS prime — then cross out its multiples starting at p × p. Unmarked numbers left are primes.',
    'অনেক সমস্যায় গণিতের শর্টকাট লুকিয়ে থাকে। Eratosthenes-এর ছাঁকনি: সব সংখ্যা শুরুতে "হয়তো মৌলিক"। পরের দাগহীন সংখ্যা p নিন — এটা মৌলিক — তারপর p × p থেকে শুরু করে এর গুণিতকগুলো কেটে দিন। শেষে দাগহীনগুলো মৌলিক।',
  ],
  analogy: [
    "Sifting flour: each prime shakes out all its multiples, and only the primes stay in the sieve.",
    "ময়দা চালা: প্রতিটি মৌলিক সংখ্যা তার গুণিতকগুলো ঝেড়ে ফেলে, ছাঁকনিতে শুধু মৌলিকরা থাকে।",
  ],
  signals: [
    [
      "Primes, GCD/LCM, modular arithmetic (mod 1e9+7)",
      "মৌলিক, GCD/LCM, modular গণিত (mod 1e9+7)",
    ],
    [
      "Fast power, digit manipulation, overflow traps",
      "দ্রুত ঘাত, অঙ্ক নিয়ে কাজ, overflow ফাঁদ",
    ],
    [
      "Geometry: rotate matrix, points on a line, areas",
      "জ্যামিতি: ম্যাট্রিক্স ঘোরানো, এক রেখায় বিন্দু, ক্ষেত্রফল",
    ],
  ],
  code: cs(`
public int CountPrimes(int n)
{
    if (n < 3) return 0;
    var composite = new bool[n]; //@init
    int count = 0;
    for (int i = 2; i < n; i++) //@loop
    {
        if (composite[i]) continue; //@skip
        count++; //@prime
        for (long j = (long)i * i; j < n; j += i) //@cross
            composite[j] = true;
    }
    return count; //@ret
}`),
  trace() {
    const n = 30;
    const comp = new Array(n).fill(false);
    const primes = new Set();
    const r = recorder();
    let count = 0;
    const rows = [0, 1, 2].map((k) =>
      Array.from({ length: 10 }, (_, j) => k * 10 + j),
    );
    const G = (extra = {}) => {
      const hi = { "0,0": "dim", "0,1": "dim" };
      for (let x = 2; x < n; x++) {
        const k = `${Math.floor(x / 10)},${x % 10}`;
        if (comp[x]) hi[k] = "dim";
        if (primes.has(x)) hi[k] = "good";
      }
      return [
        Grid(rows, {
          label: "numbers 0–29  (green = prime, faded = crossed out)",
          hi: { ...hi, ...extra },
        }),
      ];
    };
    const K = (x) => `${Math.floor(x / 10)},${x % 10}`;
    r.step(
      "init",
      [
        'Every number from 2 to 29 starts as "maybe prime". 0 and 1 are not prime.',
        '২ থেকে ২৯ পর্যন্ত সবাই শুরুতে "হয়তো মৌলিক"। ০ আর ১ মৌলিক নয়।',
      ],
      G(),
      { count },
    );
    for (let i = 2; i < n; i++) {
      if (comp[i]) {
        if (i < 10)
          r.step(
            "skip",
            [
              `${i} is already crossed out (a multiple of a smaller prime) → skip.`,
              `${i} আগেই কাটা (ছোট কোনো মৌলিকের গুণিতক) → বাদ।`,
            ],
            G({ [K(i)]: "bad" }),
            { i, count },
          );
        continue;
      }
      count++;
      primes.add(i);
      r.step(
        "prime",
        [
          `${i} survived → it's prime! count = ${count}.`,
          `${i} টিকে আছে → মৌলিক! count = ${count}।`,
        ],
        G({ [K(i)]: "active" }),
        { i, count },
      );
      if (i * i < n) {
        const crossed = {};
        for (let j = i * i; j < n; j += i) {
          comp[j] = true;
          crossed[K(j)] = "bad";
        }
        r.step(
          "cross",
          [
            `Cross out multiples of ${i} from ${i}×${i} = ${i * i}: ${Object.keys(
              crossed,
            )
              .map((k) => +k.split(",")[0] * 10 + +k.split(",")[1])
              .join(", ")}.`,
            `${i}-এর গুণিতক কাটি ${i}×${i} = ${i * i} থেকে: ${Object.keys(
              crossed,
            )
              .map((k) => +k.split(",")[0] * 10 + +k.split(",")[1])
              .join(", ")}।`,
          ],
          G({ ...crossed, [K(i)]: "active" }),
          { i, count },
        );
      }
    }
    r.step(
      "ret",
      [
        `Primes below 30: ${[...primes].join(", ")}. count = ${count}.`,
        `৩০-এর নিচে মৌলিক: ${[...primes].join(", ")}। count = ${count}।`,
      ],
      G(),
      { count },
      String(count),
    );
    return { frames: r.frames, result: count };
  },
  check: (x) => x === 10,
  complexity: { time: "O(n log log n)", space: "O(n)" },
  mistakes: [
    [
      "i * i overflows int for big n → use long.",
      "বড় n-এ i * i int overflow → long নিন।",
    ],
    [
      "Checking each number with trial division → O(n√n).",
      "প্রতিটি সংখ্যা ভাগ করে করে যাচাই → O(n√n)।",
    ],
    [
      'Off-by-one: "less than n" vs "up to n".',
      'এক বেশি/কম: "n-এর কম" বনাম "n পর্যন্ত"।',
    ],
  ],
  followups: [
    [
      ["Why start crossing at i × i?", "i × i থেকে কাটা কেন?"],
      [
        "Smaller multiples (2i, 3i, …) were already crossed out by smaller primes.",
        "ছোট গুণিতকগুলো (2i, 3i, …) আগেই ছোট মৌলিকরা কেটে দিয়েছে।",
      ],
    ],
    [
      ["Fast power x^n?", "দ্রুত ঘাত x^n?"],
      [
        "Square the base and halve n each step: O(log n) (LeetCode 50). Careful with n = int.MinValue.",
        "প্রতি ধাপে base বর্গ আর n অর্ধেক: O(log n) (LeetCode 50)। n = int.MinValue-এ সাবধান।",
      ],
    ],
  ],
  practice: [
    lc(204, "Count Primes", "Medium"),
    lc(9, "Palindrome Number", "Easy"),
    lc(202, "Happy Number", "Easy"),
    lc(50, "Pow(x, n)", "Medium"),
    lc(48, "Rotate Image", "Medium"),
    lc(149, "Max Points on a Line", "Hard"),
  ],
};

export default [
  fenwick,
  segment,
  sparse,
  heaps,
  intervals,
  design,
  greedy,
  graphs,
  dp,
  maths,
];
