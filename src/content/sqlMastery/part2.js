// SQL Server Mastery — Part III (Intermediate SQL) and Part IV, first half (Advanced SQL)
// Every code sample is T-SQL for Microsoft SQL Server and runs against BankDB.

export const part2 = [
  {
    id: 8,
    slug: "subqueries",
    part: 2,
    level: "Intermediate",
    title: "Subqueries",
    titleBn: "সাবকোয়েরি (Subquery)",
    analogy: {
      en: "A subquery is a question inside a question: 'Show customers whose loan is (the list of defaulted loans)'.",
      bn: "Subquery হলো প্রশ্নের ভেতরে প্রশ্ন: 'সেই কাস্টমারদের দেখাও যাদের লোন (খেলাপি লোনের তালিকায়) আছে'।",
    },
    sections: [
      {
        title: "Scalar, multi-valued, and correlated",
        titleBn: "Scalar, Multi-valued এবং Correlated",
        en: "Scalar: returns exactly one value (errors at runtime if it returns 2+ rows). Multi-valued: returns a list, used with IN. Correlated: references the outer query, so conceptually it runs once per outer row.",
        bn: "Scalar: ঠিক একটি মান দেয় (২+ রো দিলে রানটাইমে এরর)। Multi-valued: একটি তালিকা দেয়, IN-এর সাথে চলে। Correlated: বাইরের query-কে রেফার করে, তাই ধারণাগতভাবে বাইরের প্রতিটি রো-এর জন্য একবার চলে।",
        code: `-- Scalar
SELECT AccountNumber, Balance,
       Balance - (SELECT AVG(Balance) FROM dbo.Accounts) AS VsAverage
FROM   dbo.Accounts;

-- Multi-valued (feeds IN)
SELECT FullName FROM dbo.Customers
WHERE  CustomerId IN (SELECT CustomerId FROM dbo.Loans WHERE Status = 'DEFAULTED');

-- Correlated (references c.CustomerId from the outer query)
SELECT c.FullName,
       (SELECT COUNT(*) FROM dbo.Accounts AS a
        WHERE a.CustomerId = c.CustomerId) AS AccountCount
FROM   dbo.Customers AS c;`,
        notes: [
          {
            type: "tip",
            en: "'Runs once per row' is the meaning, not the execution. The optimizer often turns a correlated subquery into a single hash join. Measure before rewriting.",
            bn: "'প্রতি রো-তে একবার চলে' — এটা অর্থ, বাস্তব execution নয়। Optimizer প্রায়ই এটাকে একটি hash join বানিয়ে ফেলে। Rewrite-এর আগে মাপুন।",
          },
        ],
      },
      {
        title: "EXISTS vs IN vs JOIN",
        titleBn: "EXISTS বনাম IN বনাম JOIN",
        en: "EXISTS asks yes/no, stops at the first match, ignores NULL issues and never duplicates rows. IN gives the same result here. JOIN is different: it returns a customer once PER account — duplicates. If you are writing SELECT DISTINCT after a join, you probably wanted EXISTS.",
        bn: "EXISTS হ্যাঁ/না প্রশ্ন করে, প্রথম মিলেই থামে, রো ডুপ্লিকেট করে না। এখানে IN-ও একই ফল দেয়। কিন্তু JOIN আলাদা: প্রতি অ্যাকাউন্টের জন্য কাস্টমার একবার করে আসে — ডুপ্লিকেট। Join-এর পরে SELECT DISTINCT লিখলে সম্ভবত EXISTS দরকার ছিল।",
        code: `-- EXISTS: one row per customer
SELECT c.FullName FROM dbo.Customers AS c
WHERE  EXISTS (SELECT 1 FROM dbo.Accounts AS a WHERE a.CustomerId = c.CustomerId);

-- IN: same rows here
SELECT c.FullName FROM dbo.Customers AS c
WHERE  c.CustomerId IN (SELECT a.CustomerId FROM dbo.Accounts AS a);

-- JOIN: duplicates (Rahim appears twice — he has two accounts)
SELECT c.FullName FROM dbo.Customers AS c
JOIN   dbo.Accounts AS a ON a.CustomerId = c.CustomerId;`,
      },
      {
        title: "The NOT IN NULL trap",
        titleBn: "NOT IN-এর NULL ফাঁদ",
        en: "x NOT IN (1, 2, NULL) expands to x <> 1 AND x <> 2 AND x <> NULL → TRUE AND TRUE AND UNKNOWN → UNKNOWN → row rejected. If the subquery can return even one NULL, NOT IN returns ZERO rows. NOT EXISTS is safe.",
        bn: "x NOT IN (1, 2, NULL) মানে x <> 1 AND x <> 2 AND x <> NULL → TRUE AND TRUE AND UNKNOWN → UNKNOWN → রো বাতিল। Subquery যদি একটিও NULL দেয়, NOT IN শূন্য রো দেয়। NOT EXISTS নিরাপদ।",
        code: `-- "Employees who manage nobody" — returns ZERO rows!
-- Because the CEO's ManagerId is NULL, the list contains a NULL.
SELECT e.FullName
FROM   dbo.Employees AS e
WHERE  e.EmployeeId NOT IN (SELECT m.ManagerId FROM dbo.Employees AS m);

-- Safe version: NOT EXISTS
SELECT e.FullName
FROM   dbo.Employees AS e
WHERE  NOT EXISTS (SELECT 1 FROM dbo.Employees AS m
                   WHERE m.ManagerId = e.EmployeeId);`,
        notes: [
          {
            type: "interview",
            q: "NOT IN and NOT EXISTS — when do they differ?",
            en: "When the subquery can produce NULL: NOT IN returns no rows, NOT EXISTS is unaffected. Default to NOT EXISTS.",
            bn: "Subquery NULL দিতে পারলে: NOT IN কোনো রো দেয় না, NOT EXISTS ঠিক থাকে। ডিফল্ট NOT EXISTS।",
          },
        ],
      },
      {
        title: "Derived tables",
        titleBn: "Derived Table — FROM-এর ভেতরের subquery",
        en: "A subquery in FROM acts like a temporary table for one statement. It must have an alias, cannot be referenced twice, and nests badly — that is what CTEs fix.",
        bn: "FROM-এর ভেতরের subquery এক statement-এর জন্য অস্থায়ী টেবিলের মতো কাজ করে। এর alias লাগবে, দুবার রেফার করা যায় না, আর nested হলে জটিল হয় — CTE এই সমস্যা মেটায়।",
        code: `SELECT d.BranchId, d.TxnCount
FROM (
    SELECT a.BranchId, COUNT(*) AS TxnCount
    FROM   dbo.Transactions AS t
    JOIN   dbo.Accounts     AS a ON a.AccountId = t.AccountId
    WHERE  t.TxnDate >= '2026-01-01'
    GROUP BY a.BranchId
) AS d
WHERE d.TxnCount > 2;`,
      },
    ],
    summary: [
      {
        en: "EXISTS never changes row count; JOIN can.",
        bn: "EXISTS রো সংখ্যা বদলায় না; JOIN বদলাতে পারে।",
      },
      {
        en: "Never use NOT IN on a nullable column — use NOT EXISTS.",
        bn: "Nullable কলামে NOT IN নয় — NOT EXISTS।",
      },
    ],
  },

  {
    id: 9,
    slug: "cte",
    part: 2,
    level: "Intermediate",
    title: "Common Table Expressions (CTE)",
    titleBn: "Common Table Expression (CTE) — নামযুক্ত ধাপ",
    analogy: {
      en: "A CTE is giving a name to a step in your recipe: 'first make the dough (MonthlyTxn), then shape it (BranchAverage), then bake'.",
      bn: "CTE মানে রেসিপির একটি ধাপের নাম দেওয়া: 'আগে ময়দা মাখো (MonthlyTxn), তারপর আকার দাও (BranchAverage), তারপর বেক করো'।",
    },
    sections: [
      {
        title: "Why CTEs",
        titleBn: "কেন CTE",
        en: "WITH name AS (...) creates a named result that lives for ONE statement. It turns nested subqueries into readable top-to-bottom steps, and a later CTE can use an earlier one.",
        bn: "WITH name AS (...) একটি নামযুক্ত রেজাল্ট বানায় যা শুধু এক statement টিকে থাকে। Nested subquery-কে উপর থেকে নিচে পড়া যায় এমন ধাপে ভাঙে, আর পরের CTE আগেরটা ব্যবহার করতে পারে।",
        code: `WITH MonthlyTxn AS (
    SELECT a.BranchId,
           DATEFROMPARTS(YEAR(t.TxnDate), MONTH(t.TxnDate), 1) AS TxnMonth,
           SUM(t.Amount) AS Total
    FROM   dbo.Transactions AS t
    JOIN   dbo.Accounts     AS a ON a.AccountId = t.AccountId
    WHERE  t.TxnDate >= '2025-01-01'
    GROUP BY a.BranchId, DATEFROMPARTS(YEAR(t.TxnDate), MONTH(t.TxnDate), 1)
),
BranchAverage AS (
    SELECT BranchId, AVG(Total) AS AvgMonthly
    FROM   MonthlyTxn                       -- uses the earlier CTE
    GROUP BY BranchId
)
SELECT m.BranchId, m.TxnMonth, m.Total, b.AvgMonthly,
       m.Total - b.AvgMonthly AS Variance
FROM   MonthlyTxn    AS m
JOIN   BranchAverage AS b ON b.BranchId = m.BranchId
WHERE  m.Total > b.AvgMonthly * 1.5;`,
        notes: [
          {
            type: "trap",
            en: "A CTE is NOT a temp table. SQL Server inlines it like a macro; referencing it twice may run it twice. For an expensive result used repeatedly, load a #temp table (Module 11).",
            bn: "CTE কোনো temp table নয়। SQL Server এটাকে macro-র মতো inline করে; দুবার রেফার করলে দুবার চলতে পারে। ভারী রেজাল্ট বারবার লাগলে #temp table ব্যবহার করুন (মডিউল ১১)।",
          },
        ],
      },
      {
        title: "Recursive CTEs",
        titleBn: "Recursive CTE — নিজেকে ডাকা CTE",
        en: "Three parts: (1) ANCHOR — the starting rows, runs once; (2) UNION ALL; (3) RECURSIVE MEMBER — joins back to the CTE and runs until it returns zero rows. Use it to walk trees like the org chart. Always set OPTION (MAXRECURSION n) as a guard rail.",
        bn: "তিনটি অংশ: (১) ANCHOR — শুরুর রো, একবার চলে; (২) UNION ALL; (৩) RECURSIVE MEMBER — CTE-র সাথেই join করে, শূন্য রো না আসা পর্যন্ত চলে। Org chart-এর মতো tree হাঁটতে এটা ব্যবহার হয়। সবসময় OPTION (MAXRECURSION n) দিন।",
        code: `WITH OrgChart AS (
    -- 1. ANCHOR: the CEO
    SELECT e.EmployeeId, e.FullName, e.ManagerId, e.Designation,
           0 AS Depth,
           CAST(e.FullName AS NVARCHAR(4000)) AS Path
    FROM   dbo.Employees AS e
    WHERE  e.ManagerId IS NULL

    UNION ALL      -- 2. must be UNION ALL

    -- 3. RECURSIVE MEMBER: people who report to someone already found
    SELECT e.EmployeeId, e.FullName, e.ManagerId, e.Designation,
           o.Depth + 1,
           CAST(o.Path + N' > ' + e.FullName AS NVARCHAR(4000))
    FROM   dbo.Employees AS e
    JOIN   OrgChart      AS o ON o.EmployeeId = e.ManagerId
)
SELECT REPLICATE(N'    ', Depth) + FullName AS Hierarchy, Designation, Depth, Path
FROM   OrgChart
ORDER BY Path
OPTION (MAXRECURSION 100);   -- error instead of looping forever`,
        notes: [
          {
            type: "key",
            en: "Default MAXRECURSION is 100; MAXRECURSION 0 means infinite — a cycle in your data then becomes an outage.",
            bn: "ডিফল্ট MAXRECURSION ১০০; MAXRECURSION 0 মানে অসীম — ডেটায় লুপ থাকলে সার্ভার আটকে যাবে।",
          },
        ],
      },
      {
        title: "Generating a series",
        titleBn: "সিরিজ তৈরি করা",
        en: "GROUP BY only produces rows for data that exists, so a month with no transactions disappears from a report. Generate the calendar with a recursive CTE, then LEFT JOIN the facts onto it.",
        bn: "GROUP BY শুধু বিদ্যমান ডেটার রো দেয়, তাই যে মাসে লেনদেন নেই সেটা রিপোর্ট থেকে হারিয়ে যায়। Recursive CTE দিয়ে ক্যালেন্ডার বানিয়ে তার সাথে LEFT JOIN করুন।",
        code: `WITH Months AS (
    SELECT CAST('2026-01-01' AS DATE) AS MonthStart
    UNION ALL
    SELECT DATEADD(MONTH, 1, MonthStart) FROM Months
    WHERE  MonthStart < '2026-12-01'
)
SELECT m.MonthStart,
       COALESCE(SUM(t.Amount), 0) AS Total     -- 0 instead of a missing row
FROM   Months AS m
LEFT   JOIN dbo.Transactions AS t
       ON  t.TxnDate >= m.MonthStart
       AND t.TxnDate <  DATEADD(MONTH, 1, m.MonthStart)
GROUP BY m.MonthStart
ORDER BY m.MonthStart;`,
        notes: [
          {
            type: "trap",
            en: "Recursive CTEs make rows one at a time — a loop in disguise. Fine for 12 months; slow for a million numbers (use a numbers table or GENERATE_SERIES in SQL Server 2022).",
            bn: "Recursive CTE একটা একটা করে রো বানায় — ছদ্মবেশী লুপ। ১২ মাসের জন্য ঠিক; ১০ লাখ সংখ্যার জন্য ধীর (numbers table বা SQL Server 2022-এর GENERATE_SERIES ব্যবহার করুন)।",
          },
        ],
      },
      {
        title: "Updatable CTEs",
        titleBn: "CTE দিয়ে Update/Delete",
        en: "You can UPDATE or DELETE through a single-table CTE, and the change hits the base table. The classic use: delete duplicates, keeping the oldest row, with ROW_NUMBER().",
        bn: "এক-টেবিলের CTE-এর মাধ্যমে UPDATE বা DELETE করা যায়, পরিবর্তন মূল টেবিলে হয়। ক্লাসিক ব্যবহার: ROW_NUMBER() দিয়ে ডুপ্লিকেট মুছে সবচেয়ে পুরনোটা রাখা।",
        code: `WITH Ranked AS (
    SELECT c.CustomerId,
           ROW_NUMBER() OVER (PARTITION BY c.NationalId
                              ORDER BY c.CreatedAt ASC) AS rn
    FROM   dbo.Customers AS c
)
DELETE FROM Ranked WHERE rn > 1;   -- deletes from dbo.Customers, keeps the oldest`,
      },
    ],
    summary: [
      {
        en: "CTEs are for readability, #temp tables for reuse.",
        bn: "CTE পড়ার সুবিধার জন্য, #temp table পুনঃব্যবহারের জন্য।",
      },
      {
        en: "Recursive CTE = anchor + UNION ALL + recursive member + MAXRECURSION.",
        bn: "Recursive CTE-এর চার অংশ: anchor + UNION ALL + recursive member + MAXRECURSION।",
      },
    ],
  },

  {
    id: 10,
    slug: "window-functions",
    part: 2,
    level: "Intermediate",
    title: "Window Functions",
    titleBn: "উইন্ডো ফাংশন",
    analogy: {
      en: "GROUP BY folds rows into one; a window function looks through a window at neighbouring rows but keeps every row. Like a student seeing their own mark AND their class rank on the same line.",
      bn: "GROUP BY রো-গুলো ভাঁজ করে একটি বানায়; window function জানালা দিয়ে পাশের রো দেখে কিন্তু প্রতিটি রো রাখে। যেমন একজন ছাত্র একই লাইনে নিজের নম্বর আর ক্লাসে নিজের র‍্যাংক দেখে।",
    },
    sections: [
      {
        title: "The anatomy of OVER",
        titleBn: "OVER-এর গঠন",
        en: "OVER( PARTITION BY … ORDER BY … ROWS BETWEEN … ). PARTITION BY = like GROUP BY but rows survive. ORDER BY = order inside the window (unrelated to the final ORDER BY). Frame = which rows relative to the current one are included.",
        bn: "OVER( PARTITION BY … ORDER BY … ROWS BETWEEN … )। PARTITION BY = GROUP BY-এর মতো কিন্তু রো থেকে যায়। ORDER BY = জানালার ভেতরের ক্রম। Frame = বর্তমান রো-এর আশেপাশের কোন রো হিসাবে আসবে।",
        code: `SELECT t.AccountId, t.TxnDate, t.Amount,
       SUM(t.Amount) OVER (
           PARTITION BY t.AccountId                 -- 1. reset per account
           ORDER BY     t.TxnDate, t.TxnId          -- 2. order inside the window
           ROWS BETWEEN UNBOUNDED PRECEDING         -- 3. frame
                    AND CURRENT ROW
       ) AS RunningTotal
FROM   dbo.Transactions AS t
WHERE  t.AccountId = 1;`,
      },
      {
        title: "Ranking functions",
        titleBn: "র‍্যাংকিং ফাংশন",
        en: "Balances 900, 800, 800, 700 → ROW_NUMBER 1,2,3,4 (always unique, ties arbitrary). RANK 1,2,2,4 (ties share, gaps). DENSE_RANK 1,2,2,3 (ties share, no gaps). NTILE(4) splits rows into 4 buckets.",
        bn: "ব্যালান্স ৯০০, ৮০০, ৮০০, ৭০০ → ROW_NUMBER ১,২,৩,৪ (সবসময় ইউনিক)। RANK ১,২,২,৪ (সমান হলে একই, তারপর ফাঁক)। DENSE_RANK ১,২,২,৩ (ফাঁক নেই)। NTILE(4) রো-কে ৪ ভাগে ভাগ করে।",
        code: `SELECT a.AccountNumber, a.BranchId, a.Balance,
       ROW_NUMBER() OVER (PARTITION BY a.BranchId ORDER BY a.Balance DESC) AS rn,
       RANK()       OVER (PARTITION BY a.BranchId ORDER BY a.Balance DESC) AS rnk,
       DENSE_RANK() OVER (PARTITION BY a.BranchId ORDER BY a.Balance DESC) AS drnk,
       NTILE(4)     OVER (ORDER BY a.Balance DESC)                         AS Quartile
FROM   dbo.Accounts AS a
WHERE  a.Status = 'ACTIVE';`,
        notes: [
          {
            type: "interview",
            q: "Give me the 2nd highest salary.",
            en: "Use DENSE_RANK() = 2. With RANK, a tie for first leaves no rank 2 and the query returns nothing.",
            bn: "DENSE_RANK() = 2 ব্যবহার করুন। RANK হলে প্রথম স্থানে টাই থাকলে ২ নম্বর র‍্যাংক থাকে না, query কিছুই দেয় না।",
          },
        ],
      },
      {
        title: "Top-N per group",
        titleBn: "প্রতি গ্রুপে Top-N",
        en: "Rank inside a CTE, then filter. You cannot write WHERE rn <= 3 in the same query, because window functions are computed at step 5 (SELECT) and WHERE runs at step 2.",
        bn: "CTE-এর ভেতরে র‍্যাংক করে বাইরে ফিল্টার করুন। একই query-তে WHERE rn <= 3 লেখা যায় না, কারণ window function চলে ধাপ ৫-এ (SELECT), আর WHERE ধাপ ২-এ।",
        code: `WITH Ranked AS (
    SELECT a.AccountNumber, a.BranchId, a.Balance,
           ROW_NUMBER() OVER (PARTITION BY a.BranchId
                              ORDER BY a.Balance DESC, a.AccountId) AS rn
    FROM   dbo.Accounts AS a
    WHERE  a.Status = 'ACTIVE'
)
SELECT AccountNumber, BranchId, Balance
FROM   Ranked
WHERE  rn <= 3;`,
      },
      {
        title: "Offset functions: LAG and LEAD",
        titleBn: "অফসেট ফাংশন: LAG এবং LEAD",
        en: "LAG reads the previous row, LEAD the next — no self-join needed. The third argument of LAG is a default for the first row. Real use: minutes since last transaction is a fraud-velocity signal.",
        bn: "LAG আগের রো পড়ে, LEAD পরের রো — self-join লাগে না। LAG-এর তৃতীয় আর্গুমেন্ট প্রথম রো-এর ডিফল্ট মান। বাস্তব ব্যবহার: শেষ লেনদেনের পর কত মিনিট — জালিয়াতি ধরার সংকেত।",
        code: `SELECT t.AccountId, t.TxnDate, t.Amount,
       LAG(t.Amount)  OVER (PARTITION BY t.AccountId ORDER BY t.TxnDate) AS PrevAmount,
       LEAD(t.TxnDate) OVER (PARTITION BY t.AccountId ORDER BY t.TxnDate) AS NextDate,
       t.Amount - LAG(t.Amount, 1, 0) OVER (PARTITION BY t.AccountId
                                            ORDER BY t.TxnDate) AS Delta,
       DATEDIFF(MINUTE,
                LAG(t.TxnDate) OVER (PARTITION BY t.AccountId ORDER BY t.TxnDate),
                t.TxnDate) AS MinutesSinceLast
FROM   dbo.Transactions AS t;`,
      },
      {
        title: "Frames: ROWS vs RANGE",
        titleBn: "Frame: ROWS বনাম RANGE",
        en: "ROWS counts physical rows. RANGE treats all rows with the same ORDER BY value as one position (peers). If you write ORDER BY without a frame you silently get RANGE, which gives wrong running totals when the sort key has ties AND is slower (on-disk worktable). Always write ROWS explicitly.",
        bn: "ROWS আসল রো গোনে। RANGE একই ORDER BY মানের সব রো-কে এক অবস্থান ধরে। Frame না লিখে শুধু ORDER BY দিলে চুপচাপ RANGE হয় — sort key-তে টাই থাকলে running total ভুল হয় এবং ধীরও হয়। সবসময় ROWS লিখুন।",
        code: `-- Moving average of the last 30 transactions
SELECT t.TxnDate, t.Amount,
       AVG(t.Amount) OVER (PARTITION BY t.AccountId ORDER BY t.TxnDate
                           ROWS BETWEEN 29 PRECEDING AND CURRENT ROW) AS Avg30Txns
FROM   dbo.Transactions AS t;

-- Correct running total: explicit ROWS + unique tiebreaker
SELECT t.TxnDate, t.Amount,
       SUM(t.Amount) OVER (PARTITION BY t.AccountId ORDER BY t.TxnDate, t.TxnId
                           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningTotal
FROM   dbo.Transactions AS t;`,
        notes: [
          {
            type: "trap",
            en: "Default frame = RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW. Two transactions at the same timestamp both get the full total.",
            bn: "ডিফল্ট frame = RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW। একই সময়ের দুটি লেনদেন দুটোই পুরো total পায়।",
          },
        ],
      },
      {
        title: "The gaps-and-islands problem",
        titleBn: "Gaps-and-Islands সমস্যা",
        en: "Find consecutive runs (streaks). Trick: for consecutive dates, (date − ROW_NUMBER) is constant inside a run. Jan 1,2,3 with numbers 1,2,3 all give Dec 31 → same group. A gap changes the value → new group.",
        bn: "পরপর দিনের ধারা (streak) খোঁজা। কৌশল: পরপর তারিখে (তারিখ − ROW_NUMBER) একই থাকে। ১,২,৩ জানুয়ারি থেকে ১,২,৩ বিয়োগ করলে সবই ৩১ ডিসেম্বর → একই গ্রুপ। ফাঁক এলে মান বদলায় → নতুন গ্রুপ।",
        code: `WITH Daily AS (
    SELECT DISTINCT t.AccountId, CAST(t.TxnDate AS DATE) AS ActivityDate
    FROM   dbo.Transactions AS t
),
Grouped AS (
    SELECT AccountId, ActivityDate,
           DATEADD(DAY,
                   -ROW_NUMBER() OVER (PARTITION BY AccountId ORDER BY ActivityDate),
                   ActivityDate) AS IslandKey
    FROM   Daily
)
SELECT AccountId,
       MIN(ActivityDate) AS StreakStart,
       MAX(ActivityDate) AS StreakEnd,
       COUNT(*)          AS StreakDays
FROM   Grouped
GROUP BY AccountId, IslandKey
HAVING COUNT(*) >= 2
ORDER BY AccountId, StreakStart;`,
      },
    ],
    summary: [
      {
        en: "Window functions compute across rows without collapsing them.",
        bn: "Window function রো না ভেঙে রো জুড়ে হিসাব করে।",
      },
      {
        en: "Running totals: ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW.",
        bn: "Running total-এ লিখুন: ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW।",
      },
      {
        en: "Gaps-and-islands: date − ROW_NUMBER is constant in a run.",
        bn: "Gaps-and-islands: ধারায় তারিখ − ROW_NUMBER একই থাকে।",
      },
    ],
  },

  {
    id: 11,
    slug: "views-temp-tables",
    part: 2,
    level: "Intermediate",
    title: "Views, Temp Tables, and Table Variables",
    titleBn: "View, Temp Table এবং Table Variable",
    analogy: {
      en: "A view is a saved recipe (no food stored). An indexed view is a pre-cooked meal kept warm. A #temp table is a plate where you put food you will use several times.",
      bn: "View হলো সংরক্ষিত রেসিপি (খাবার নয়)। Indexed view হলো আগে রান্না করে গরম রাখা খাবার। #temp table হলো একটি প্লেট যেখানে বারবার লাগবে এমন খাবার রাখেন।",
    },
    sections: [
      {
        title: "Views",
        titleBn: "View — সংরক্ষিত query",
        en: "A view is a stored query, not stored data. It gives a security boundary (grant on the view, not the tables), a compatibility layer during refactors, and a name for a complex join. It gives NO performance benefit — the text is expanded into your query.",
        bn: "View হলো সংরক্ষিত query, ডেটা নয়। এটা নিরাপত্তা সীমানা দেয় (টেবিলে নয়, view-তে permission), refactor-এর সময় সামঞ্জস্য রাখে, জটিল join-এর নাম দেয়। কিন্তু কোনো পারফরম্যান্স সুবিধা দেয় না।",
        code: `CREATE OR ALTER VIEW dbo.vw_ActiveAccountSummary
AS
SELECT a.AccountId, a.AccountNumber, c.FullName, b.BranchName,
       a.AccountType, a.Balance
FROM   dbo.Accounts  AS a
JOIN   dbo.Customers AS c ON c.CustomerId = a.CustomerId
JOIN   dbo.Branches  AS b ON b.BranchId   = a.BranchId
WHERE  a.Status = 'ACTIVE';
GO

SELECT * FROM dbo.vw_ActiveAccountSummary WHERE BranchName = N'Agrabad';`,
        notes: [
          {
            type: "trap",
            en: "Views on views on views expand into a 40-table query the optimizer cannot reason about. Enforce a two-level limit in code review.",
            bn: "View-এর উপর view-এর উপর view — শেষে ৪০ টেবিলের query হয় যা optimizer বুঝতে পারে না। কোড রিভিউতে সর্বোচ্চ দুই লেভেল নিয়ম রাখুন।",
          },
        ],
      },
      {
        title: "Indexed (materialised) views",
        titleBn: "Indexed View — সংরক্ষিত ফলাফল",
        en: "Add WITH SCHEMABINDING, two-part names, COUNT_BIG(*), then a UNIQUE CLUSTERED INDEX — now the result is physically stored and maintained. Reads are instant; every write to Accounts must also update the view inside your transaction. Great for read-heavy reporting, poison on hot write paths.",
        bn: "WITH SCHEMABINDING, দুই-অংশের নাম, COUNT_BIG(*) দিয়ে তারপর UNIQUE CLUSTERED INDEX বানালে রেজাল্ট আসলেই সংরক্ষিত হয়। পড়া তাৎক্ষণিক; কিন্তু Accounts-এ প্রতিটি write-এ view-ও আপডেট হয়। রিপোর্টিংয়ে দারুণ, ব্যস্ত write-এ বিষ।",
        code: `CREATE OR ALTER VIEW dbo.vw_BranchBalance
WITH SCHEMABINDING                       -- required
AS
SELECT a.BranchId,
       COUNT_BIG(*)   AS AccountCount,   -- COUNT_BIG is mandatory
       SUM(a.Balance) AS TotalBalance
FROM   dbo.Accounts AS a                 -- two-part name is mandatory
GROUP BY a.BranchId;
GO
CREATE UNIQUE CLUSTERED INDEX IX_vw_BranchBalance ON dbo.vw_BranchBalance(BranchId);
GO
SELECT * FROM dbo.vw_BranchBalance WITH (NOEXPAND);`,
      },
      {
        title: "Temp tables vs table variables",
        titleBn: "Temp Table বনাম Table Variable",
        en: "#Temp: has statistics (real estimates), any index, allows parallelism, rolled back with the transaction — best for > 100 rows, joins, reuse. @TableVariable: no statistics (historically estimated as 1 row), only inline constraints, survives ROLLBACK — best for small sets. Both live in tempdb; 'table variables are in memory' is a myth.",
        bn: "#Temp: statistics আছে (সঠিক অনুমান), যেকোনো index, parallelism চলে, transaction-এর সাথে rollback হয় — ১০০+ রো, join, পুনঃব্যবহারের জন্য। @TableVariable: statistics নেই (আগে ১ রো ধরা হত), শুধু inline constraint, ROLLBACK-এও টিকে থাকে — ছোট সেটের জন্য। দুটোই tempdb-তে থাকে।",
        code: `CREATE TABLE #HighValue (
    AccountId BIGINT        NOT NULL PRIMARY KEY,
    Total     DECIMAL(19,4) NOT NULL
);

INSERT INTO #HighValue (AccountId, Total)
SELECT t.AccountId, SUM(t.Amount)
FROM   dbo.Transactions AS t
WHERE  t.TxnDate >= '2026-01-01'
GROUP BY t.AccountId
HAVING SUM(t.Amount) > 50000;

CREATE INDEX IX_HV_Total ON #HighValue (Total DESC);    -- index after loading

SELECT c.FullName, h.Total
FROM   #HighValue    AS h
JOIN   dbo.Accounts  AS a ON a.AccountId  = h.AccountId
JOIN   dbo.Customers AS c ON c.CustomerId = a.CustomerId
ORDER BY h.Total DESC;

DROP TABLE #HighValue;

-- Table variable: fine for a handful of rows
DECLARE @Ids TABLE (AccountId BIGINT PRIMARY KEY);
INSERT INTO @Ids VALUES (1), (3);
SELECT a.AccountNumber FROM dbo.Accounts AS a JOIN @Ids AS i ON i.AccountId = a.AccountId;`,
        notes: [
          {
            type: "interview",
            q: "A procedure is fast for 10 rows and times out for 100,000. It uses a table variable. Why?",
            en: "No statistics → optimizer estimates 1 row → nested loops → 100,000 seeks instead of one hash join. Switch to a #temp table or add OPTION (RECOMPILE).",
            bn: "Statistics নেই → optimizer ১ রো ধরে → nested loops → একটি hash join-এর বদলে ১ লাখ seek। #temp table ব্যবহার করুন বা OPTION (RECOMPILE) দিন।",
          },
        ],
      },
    ],
    summary: [
      {
        en: "Views = security and naming, not speed.",
        bn: "View = নিরাপত্তা ও নামকরণ, গতি নয়।",
      },
      {
        en: "Small & once → CTE. Expensive or reused → #temp table.",
        bn: "ছোট ও একবার → CTE। ভারী বা বারবার → #temp table।",
      },
    ],
  },

  {
    id: 12,
    slug: "modifying-data",
    part: 2,
    level: "Intermediate",
    title: "Modifying Data",
    titleBn: "ডেটা পরিবর্তন (INSERT, UPDATE, DELETE, MERGE)",
    analogy: {
      en: "Deleting 20 million rows at once is like emptying a lake with one giant bucket — it breaks. Use many small buckets (batches).",
      bn: "একবারে ২ কোটি রো মোছা মানে এক বিশাল বালতি দিয়ে পুকুর খালি করা — ভেঙে যাবে। অনেক ছোট বালতি (batch) ব্যবহার করুন।",
    },
    sections: [
      {
        title: "INSERT patterns",
        titleBn: "INSERT-এর ধরন",
        en: "Always name the columns. Multi-row VALUES = one round trip. INSERT … SELECT = set-based load. OUTPUT inserted.* captures generated identity values.",
        bn: "সবসময় কলামের নাম লিখুন। Multi-row VALUES = এক round trip। INSERT … SELECT = set-based লোড। OUTPUT inserted.* দিয়ে তৈরি হওয়া identity মান ধরা যায়।",
        code: `-- Multi-row: one round trip, one transaction
INSERT INTO dbo.Branches (BranchCode, BranchName, City, OpenedOn)
VALUES ('KHL02', N'Khulna Main', N'Khulna',   '2026-03-01'),
       ('RAJ02', N'Rajshahi',    N'Rajshahi', '2026-03-15');

-- INSERT ... SELECT: set-based archive
INSERT INTO dbo.ArchivedTransactions (TxnId, AccountId, TxnDate, Amount)
SELECT TxnId, AccountId, TxnDate, Amount
FROM   dbo.Transactions
WHERE  TxnDate < '2026-01-05';

-- Capture generated keys with OUTPUT
DECLARE @NewIds TABLE (CustomerId INT);
INSERT INTO dbo.Customers (NationalId, FullName, City)
OUTPUT inserted.CustomerId INTO @NewIds
VALUES ('2001555666', N'Tanvir Ahmed', N'Dhaka');
SELECT * FROM @NewIds;`,
      },
      {
        title: "UPDATE with a join",
        titleBn: "Join দিয়ে UPDATE",
        en: "T-SQL style: UPDATE alias SET … FROM table AS alias JOIN/WHERE. Example: mark accounts DORMANT if they have had no transaction for 12 months.",
        bn: "T-SQL স্টাইল: UPDATE alias SET … FROM table AS alias JOIN/WHERE। উদাহরণ: ১২ মাস কোনো লেনদেন না থাকলে অ্যাকাউন্ট DORMANT করা।",
        code: `UPDATE a
SET    a.Status = 'DORMANT'
FROM   dbo.Accounts AS a
WHERE  a.Status = 'ACTIVE'
  AND  NOT EXISTS (SELECT 1 FROM dbo.Transactions AS t
                   WHERE t.AccountId = a.AccountId
                     AND t.TxnDate >= DATEADD(MONTH, -12, GETDATE()));`,
        notes: [
          {
            type: "trap",
            en: "If the join matches several source rows per target row, UPDATE … FROM does NOT error — it silently applies an arbitrary one. Aggregate the source first, or use MERGE (which raises an error).",
            bn: "Join-এ একটি target রো-এর জন্য একাধিক source রো মিললে UPDATE … FROM এরর দেয় না — চুপচাপ যেকোনো একটি বসিয়ে দেয়। আগে source aggregate করুন, বা MERGE ব্যবহার করুন।",
          },
        ],
      },
      {
        title: "DELETE, TRUNCATE, and batching",
        titleBn: "DELETE, TRUNCATE এবং Batching",
        en: "DELETE: row-by-row logged, WHERE allowed, fires triggers, keeps identity. TRUNCATE: deallocates pages (minimal log), no WHERE, no triggers, resets identity, blocked if referenced by an FK — and it CAN be rolled back in SQL Server. For huge deletes, loop in batches of ~5,000 (below the lock escalation threshold).",
        bn: "DELETE: প্রতি রো log হয়, WHERE চলে, trigger চলে, identity থাকে। TRUNCATE: পেজ ছেড়ে দেয় (কম log), WHERE নেই, trigger নেই, identity রিসেট, FK থাকলে চলে না — আর SQL Server-এ এটা rollback করা যায়। বিশাল delete ~৫০০০ রো-র batch-এ লুপ করে করুন।",
        code: `SET NOCOUNT ON;
WHILE 1 = 1
BEGIN
    DELETE TOP (5000) FROM dbo.ArchivedTransactions
    WHERE  TxnDate < '2019-01-01';

    IF @@ROWCOUNT = 0 BREAK;

    WAITFOR DELAY '00:00:00.100';   -- let other work through, let the log clear
END

-- Rollback a TRUNCATE (works in SQL Server)
BEGIN TRANSACTION;
    TRUNCATE TABLE dbo.CustomerStaging;
ROLLBACK TRANSACTION;`,
        notes: [
          {
            type: "tip",
            en: "Each batch is its own transaction: the log can truncate, locks are released between batches, and a failure loses one batch instead of everything.",
            bn: "প্রতিটি batch আলাদা transaction: log ছোট থাকে, batch-এর মাঝে lock ছাড়ে, ব্যর্থ হলে শুধু এক batch হারায়।",
          },
        ],
      },
      {
        title: "MERGE / UPSERT",
        titleBn: "MERGE / UPSERT — একসাথে insert ও update",
        en: "MERGE inserts, updates and deletes in one statement, and OUTPUT $action tells you what happened. In SQL Server it is not concurrency-safe by default — add WITH (HOLDLOCK) on the target. For simple upserts, UPDATE then IF @@ROWCOUNT = 0 INSERT inside a transaction is easier to reason about.",
        bn: "MERGE এক statement-এ insert, update, delete করে; OUTPUT $action বলে কী হলো। SQL Server-এ ডিফল্টভাবে এটা concurrency-safe নয় — target-এ WITH (HOLDLOCK) দিন। সাধারণ upsert-এর জন্য transaction-এর ভেতরে আগে UPDATE, তারপর IF @@ROWCOUNT = 0 INSERT — বোঝা সহজ।",
        code: `MERGE INTO dbo.Customers WITH (HOLDLOCK) AS tgt
USING (SELECT NationalId, FullName, Email, City FROM dbo.CustomerStaging) AS src
   ON tgt.NationalId = src.NationalId
WHEN MATCHED AND (tgt.FullName <> src.FullName
              OR ISNULL(tgt.Email, '') <> ISNULL(src.Email, '')) THEN
     UPDATE SET tgt.FullName = src.FullName,
                tgt.Email    = src.Email,
                tgt.City     = src.City
WHEN NOT MATCHED BY TARGET THEN
     INSERT (NationalId, FullName, Email, City, KycStatus)
     VALUES (src.NationalId, src.FullName, src.Email, src.City, 'PENDING')
OUTPUT $action, inserted.CustomerId, deleted.FullName AS OldName;

-- Simple, safe upsert alternative
DECLARE @Nid VARCHAR(20) = '1990123456', @Name NVARCHAR(120) = N'Rahim Uddin';
BEGIN TRANSACTION;
    UPDATE dbo.Customers WITH (UPDLOCK, SERIALIZABLE)
    SET    FullName = @Name
    WHERE  NationalId = @Nid;

    IF @@ROWCOUNT = 0
        INSERT INTO dbo.Customers (NationalId, FullName) VALUES (@Nid, @Name);
COMMIT TRANSACTION;`,
      },
    ],
    summary: [
      {
        en: "Name columns; use OUTPUT to capture what you wrote.",
        bn: "কলামের নাম দিন; যা লিখলেন OUTPUT দিয়ে ধরুন।",
      },
      {
        en: "Big deletes/updates: batch them.",
        bn: "বড় delete/update: batch করুন।",
      },
      { en: "MERGE needs HOLDLOCK.", bn: "MERGE-এ HOLDLOCK লাগে।" },
    ],
  },

  {
    id: 13,
    slug: "transactions-locking",
    part: 3,
    level: "Advanced",
    title: "Transactions, Isolation, and Locking",
    titleBn: "Transaction, Isolation এবং Locking",
    analogy: {
      en: "Two people withdrawing from the same joint account at two ATMs at the same second. Locks make one of them wait so the account never goes negative.",
      bn: "একই যৌথ অ্যাকাউন্ট থেকে দুজন একই সেকেন্ডে দুটি ATM থেকে টাকা তুলছে। Lock একজনকে অপেক্ষা করায়, তাই ব্যালান্স কখনো মাইনাসে যায় না।",
    },
    sections: [
      {
        title: "The transfer that must not lose money",
        titleBn: "যে ট্রান্সফারে টাকা হারানো চলবে না",
        en: "SET XACT_ABORT ON rolls everything back on any error. Lock both accounts in a fixed order (smaller ID first) with UPDLOCK so a second transfer waits instead of reading the same old balance. Without UPDLOCK, two transfers both read Tk 1,000, both decide Tk 800 is affordable, both commit → balance −600.",
        bn: "SET XACT_ABORT ON যেকোনো এররে সব rollback করে। দুটি অ্যাকাউন্ট নির্দিষ্ট ক্রমে (ছোট ID আগে) UPDLOCK দিয়ে লক করুন, যাতে দ্বিতীয় ট্রান্সফার অপেক্ষা করে। UPDLOCK না থাকলে দুটো ট্রান্সফারই ১০০০ টাকা দেখে, দুটোই ৮০০ টাকা পাঠায় → ব্যালান্স −৬০০।",
        code: `CREATE OR ALTER PROCEDURE dbo.usp_TransferFunds
    @FromAccountId BIGINT,
    @ToAccountId   BIGINT,
    @Amount        DECIMAL(19,4)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;      -- any error rolls the whole transaction back

    IF @Amount <= 0 THROW 50001, 'Amount must be positive.', 1;
    IF @FromAccountId = @ToAccountId THROW 50002, 'Accounts must differ.', 1;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Lock in a DETERMINISTIC order (prevents deadlocks)
        DECLARE @First  BIGINT = IIF(@FromAccountId < @ToAccountId, @FromAccountId, @ToAccountId);
        DECLARE @Second BIGINT = IIF(@FromAccountId < @ToAccountId, @ToAccountId, @FromAccountId);

        DECLARE @Locked BIT;
        SELECT @Locked = 1 FROM dbo.Accounts WITH (UPDLOCK, ROWLOCK) WHERE AccountId = @First;
        SELECT @Locked = 1 FROM dbo.Accounts WITH (UPDLOCK, ROWLOCK) WHERE AccountId = @Second;

        DECLARE @Bal DECIMAL(19,4);
        SELECT @Bal = Balance FROM dbo.Accounts WHERE AccountId = @FromAccountId;

        IF @Bal IS NULL     THROW 50003, 'Account not found.', 1;
        IF @Bal < @Amount   THROW 50004, 'Insufficient funds.', 1;

        UPDATE dbo.Accounts SET Balance = Balance - @Amount WHERE AccountId = @FromAccountId;
        UPDATE dbo.Accounts SET Balance = Balance + @Amount WHERE AccountId = @ToAccountId;

        INSERT INTO dbo.Transactions (AccountId, TxnDate, TxnType, Channel, Amount, BalanceAfter, Reference)
        SELECT @FromAccountId, SYSUTCDATETIME(), 'DEBIT', 'ONLINE', @Amount, Balance, N'Transfer out'
        FROM   dbo.Accounts WHERE AccountId = @FromAccountId;

        INSERT INTO dbo.Transactions (AccountId, TxnDate, TxnType, Channel, Amount, BalanceAfter, Reference)
        SELECT @ToAccountId, SYSUTCDATETIME(), 'CREDIT', 'ONLINE', @Amount, Balance, N'Transfer in'
        FROM   dbo.Accounts WHERE AccountId = @ToAccountId;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
        THROW;              -- re-raise the original error
    END CATCH
END
GO
EXEC dbo.usp_TransferFunds @FromAccountId = 2, @ToAccountId = 1, @Amount = 5000;`,
        notes: [
          {
            type: "key",
            en: "UPDLOCK holds until commit and is not compatible with another UPDLOCK, so the second transfer waits. A plain SELECT's shared lock is released immediately.",
            bn: "UPDLOCK commit পর্যন্ত থাকে এবং আরেকটি UPDLOCK-এর সাথে মেলে না, তাই দ্বিতীয় ট্রান্সফার অপেক্ষা করে। সাধারণ SELECT-এর shared lock সাথে সাথে ছেড়ে দেয়।",
          },
        ],
      },
      {
        title: "The four concurrency phenomena",
        titleBn: "Concurrency-র চারটি সমস্যা",
        en: "Dirty read: you read uncommitted data that is later rolled back. Non-repeatable read: same row read twice gives different values. Phantom read: same WHERE twice gives a different number of rows (someone inserted). Lost update: two read-modify-writes, the second overwrites the first.",
        bn: "Dirty read: অন্যের commit না হওয়া ডেটা পড়লেন, পরে সেটা rollback হলো। Non-repeatable read: একই রো দুবার পড়ে ভিন্ন মান। Phantom read: একই WHERE দুবার চালিয়ে ভিন্ন সংখ্যক রো (কেউ insert করেছে)। Lost update: দুজন পড়ে-বদলে-লিখল, দ্বিতীয়জন প্রথমজনের কাজ মুছে দিল।",
        code: `/* Open TWO query windows in SSMS to see a dirty read */

-- Window 1: change a balance but do not commit yet
BEGIN TRANSACTION;
UPDATE dbo.Accounts SET Balance = 0 WHERE AccountId = 1;

-- Window 2: read uncommitted data
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT Balance FROM dbo.Accounts WHERE AccountId = 1;   -- 0 (dirty!)

-- Window 1: undo
ROLLBACK TRANSACTION;   -- the 0 that Window 2 saw never really existed`,
      },
      {
        title: "Isolation levels",
        titleBn: "Isolation Level — কতটা আলাদা থাকবে",
        en: "READ UNCOMMITTED: allows dirty reads. READ COMMITTED (default): no dirty reads. REPEATABLE READ: shared locks held to commit, phantoms possible. SERIALIZABLE: range locks, nothing slips in. SNAPSHOT: row versioning — readers never block writers and see a consistent picture as of the transaction start.",
        bn: "READ UNCOMMITTED: dirty read চলে। READ COMMITTED (ডিফল্ট): dirty read নেই। REPEATABLE READ: commit পর্যন্ত shared lock, phantom সম্ভব। SERIALIZABLE: range lock, কিছুই ঢুকতে পারে না। SNAPSHOT: row versioning — reader কখনো writer-কে আটকায় না, transaction শুরুর মুহূর্তের ছবি দেখে।",
        code: `ALTER DATABASE BankDB SET ALLOW_SNAPSHOT_ISOLATION ON;
GO
SET TRANSACTION ISOLATION LEVEL SNAPSHOT;
BEGIN TRANSACTION;
    SELECT SUM(Balance) FROM dbo.Accounts WHERE BranchId = 1;
    WAITFOR DELAY '00:00:05';
    SELECT SUM(Balance) FROM dbo.Accounts WHERE BranchId = 1;   -- identical
COMMIT;

-- Non-blocking reads for the whole database (READ COMMITTED + versioning)
ALTER DATABASE BankDB SET READ_COMMITTED_SNAPSHOT ON WITH ROLLBACK IMMEDIATE;`,
        notes: [
          {
            type: "trap",
            en: "WITH (NOLOCK) = READ UNCOMMITTED, and worse: it can read the same row twice or skip committed rows during a page split. Use READ_COMMITTED_SNAPSHOT instead.",
            bn: "WITH (NOLOCK) = READ UNCOMMITTED, আরও খারাপ: page split-এর সময় একই রো দুবার পড়তে বা commit হওয়া রো বাদ দিতে পারে। এর বদলে READ_COMMITTED_SNAPSHOT চালু করুন।",
          },
        ],
      },
      {
        title: "Optimistic vs pessimistic concurrency",
        titleBn: "Optimistic বনাম Pessimistic Concurrency",
        en: "Pessimistic: hold a lock (UPDLOCK) — good for short server-side transactions. Optimistic: add a ROWVERSION column; update only if the version is unchanged. If @@ROWCOUNT = 0, someone else changed the row. This is what EF Core's [Timestamp] generates.",
        bn: "Pessimistic: lock ধরে রাখা (UPDLOCK) — ছোট সার্ভার-সাইড transaction-এর জন্য ভালো। Optimistic: ROWVERSION কলাম যোগ করে শুধু version না বদলালে update করা। @@ROWCOUNT = 0 হলে অন্য কেউ রো বদলেছে। EF Core-এর [Timestamp] এটাই তৈরি করে।",
        code: `ALTER TABLE dbo.Accounts ADD RowVer ROWVERSION;
GO
DECLARE @AccountId BIGINT = 1, @NewBalance DECIMAL(19,4) = 90000, @OriginalRowVer BINARY(8);
SELECT @OriginalRowVer = RowVer FROM dbo.Accounts WHERE AccountId = @AccountId;

UPDATE dbo.Accounts
SET    Balance = @NewBalance
WHERE  AccountId = @AccountId
  AND  RowVer    = @OriginalRowVer;

IF @@ROWCOUNT = 0
    THROW 50010, 'Record was modified by another user. Reload and retry.', 1;`,
      },
      {
        title: "Deadlocks",
        titleBn: "Deadlock — lock-এর চক্র",
        en: "A deadlock is a cycle: A holds lock 1 and wants lock 2; B holds 2 and wants 1. SQL Server kills one (error 1205). Defences: (1) consistent lock order, (2) short transactions — never across an HTTP call or user prompt, (3) good indexes so writers lock only the rows they need. Deadlocks are transient, so retry.",
        bn: "Deadlock হলো চক্র: A-র কাছে lock ১, চায় ২; B-র কাছে ২, চায় ১। SQL Server একজনকে মেরে ফেলে (এরর 1205)। প্রতিরোধ: (১) সবসময় একই ক্রমে lock, (২) ছোট transaction — HTTP call বা ইউজারের অপেক্ষায় খোলা রাখবেন না, (৩) ভালো index। Deadlock সাময়িক, তাই retry করুন।",
        code: `DECLARE @Retry INT = 3;
WHILE @Retry > 0
BEGIN
    BEGIN TRY
        EXEC dbo.usp_TransferFunds @FromAccountId = 1, @ToAccountId = 3, @Amount = 500;
        BREAK;                                    -- success
    END TRY
    BEGIN CATCH
        SET @Retry -= 1;
        IF ERROR_NUMBER() <> 1205 OR @Retry = 0 THROW;   -- not a deadlock: give up
        WAITFOR DELAY '00:00:00.200';             -- back off, then retry
    END CATCH
END`,
        notes: [
          {
            type: "interview",
            q: "Deadlock vs blocking?",
            en: "Blocking is normal and temporary — one waits for another. A deadlock is a cycle that can never resolve, so the engine kills one side. Blocking = performance problem; deadlock = retry problem.",
            bn: "Blocking স্বাভাবিক ও সাময়িক — একজন অন্যজনের জন্য অপেক্ষা করে। Deadlock হলো এমন চক্র যা কখনো মেটে না, তাই ইঞ্জিন একজনকে মেরে ফেলে। Blocking = পারফরম্যান্স সমস্যা; deadlock = retry সমস্যা।",
          },
        ],
      },
    ],
    summary: [
      {
        en: "XACT_ABORT ON + TRY/CATCH + UPDLOCK in a fixed order.",
        bn: "XACT_ABORT ON + TRY/CATCH + নির্দিষ্ট ক্রমে UPDLOCK।",
      },
      {
        en: "Use READ_COMMITTED_SNAPSHOT, not NOLOCK.",
        bn: "NOLOCK নয়, READ_COMMITTED_SNAPSHOT।",
      },
      { en: "Retry error 1205.", bn: "এরর 1205 হলে retry।" },
    ],
  },

  {
    id: 14,
    slug: "procedures-functions",
    part: 3,
    level: "Advanced",
    title: "Stored Procedures and Functions",
    titleBn: "Stored Procedure এবং Function",
    analogy: {
      en: "A stored procedure is a bank counter with a fixed form: the app can only submit that form, not walk into the vault.",
      bn: "Stored procedure হলো নির্দিষ্ট ফর্মসহ ব্যাংকের কাউন্টার: অ্যাপ শুধু ফর্ম জমা দিতে পারে, ভল্টে ঢুকতে পারে না।",
    },
    sections: [
      {
        title: "Anatomy of a production procedure",
        titleBn: "Production Procedure-এর গঠন",
        en: "SET NOCOUNT ON (first line, always), SET XACT_ABORT ON, validate inputs and THROW clear errors, use half-open date ranges, page with OFFSET/FETCH and a tiebreaker, return a total with an OUTPUT parameter.",
        bn: "SET NOCOUNT ON (সবসময় প্রথম লাইন), SET XACT_ABORT ON, ইনপুট যাচাই করে পরিষ্কার এরর THROW, half-open তারিখ রেঞ্জ, tiebreaker সহ OFFSET/FETCH পেজিং, OUTPUT parameter দিয়ে মোট সংখ্যা ফেরত।",
        code: `CREATE OR ALTER PROCEDURE dbo.usp_GetAccountStatement
    @AccountId  BIGINT,
    @FromDate   DATE,
    @ToDate     DATE,
    @PageNumber INT = 1,
    @PageSize   INT = 50,
    @TotalRows  INT = NULL OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    IF NOT EXISTS (SELECT 1 FROM dbo.Accounts WHERE AccountId = @AccountId)
        THROW 50020, 'Account does not exist.', 1;
    IF @ToDate < @FromDate
        THROW 50021, 'ToDate must be on or after FromDate.', 1;

    DECLARE @ToExclusive DATETIME2(3) = DATEADD(DAY, 1, CAST(@ToDate AS DATETIME2(3)));

    SELECT @TotalRows = COUNT(*)
    FROM   dbo.Transactions
    WHERE  AccountId = @AccountId
      AND  TxnDate >= @FromDate AND TxnDate < @ToExclusive;

    SELECT t.TxnId, t.TxnDate, t.TxnType, t.Channel, t.Amount, t.BalanceAfter, t.Reference
    FROM   dbo.Transactions AS t
    WHERE  t.AccountId = @AccountId
      AND  t.TxnDate >= @FromDate AND t.TxnDate < @ToExclusive
    ORDER BY t.TxnDate DESC, t.TxnId DESC
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO
DECLARE @Total INT;
EXEC dbo.usp_GetAccountStatement @AccountId = 1, @FromDate = '2026-01-01',
     @ToDate = '2026-12-31', @TotalRows = @Total OUTPUT;
SELECT @Total AS TotalRows;`,
        notes: [
          {
            type: "tip",
            en: "SET NOCOUNT ON is not cosmetic: every '(1 row affected)' is an extra network message, and some clients mis-read them as result sets.",
            bn: "SET NOCOUNT ON শুধু সাজসজ্জা নয়: প্রতিটি '(1 row affected)' একটি বাড়তি নেটওয়ার্ক মেসেজ, কিছু ক্লায়েন্ট এগুলোকে রেজাল্ট সেট ভেবে ভুল করে।",
          },
        ],
      },
      {
        title: "Why procedures still matter in an ORM world",
        titleBn: "ORM-এর যুগেও কেন Procedure দরকার",
        en: "Security: GRANT EXECUTE on the procedure, nothing on tables. Contract: change tables underneath without redeploying the app. Round trips: ten statements in one EXEC. Plan caching: stable reusable plans (also the root of parameter sniffing, Module 22).",
        bn: "নিরাপত্তা: শুধু procedure-এ EXECUTE permission, টেবিলে কিছুই না। চুক্তি: অ্যাপ redeploy না করেই নিচের টেবিল বদলানো যায়। Round trip: এক EXEC-এ দশটি statement। Plan caching: স্থির পুনঃব্যবহারযোগ্য plan (parameter sniffing-এর মূলও এটা, মডিউল ২২)।",
        code: `CREATE ROLE AppRole;
GRANT EXECUTE ON dbo.usp_GetAccountStatement TO AppRole;
GRANT EXECUTE ON dbo.usp_TransferFunds       TO AppRole;
-- No SELECT/INSERT/UPDATE on tables: the app can only call these procedures.`,
      },
      {
        title: "Scalar functions: the performance trap",
        titleBn: "Scalar Function: পারফরম্যান্সের ফাঁদ",
        en: "A multi-statement scalar UDF runs once PER ROW, looks free to the optimizer, and (unless SQL Server 2019 inlining applies) forces the whole query to run single-threaded. A 10-second report becomes 10 minutes.",
        bn: "Multi-statement scalar UDF প্রতিটি রো-তে একবার চলে, optimizer-এর কাছে খরচ শূন্য মনে হয়, আর (SQL Server 2019-এর inlining না খাটলে) পুরো query-কে single-thread করে দেয়। ১০ সেকেন্ডের রিপোর্ট ১০ মিনিট হয়।",
        code: `CREATE OR ALTER FUNCTION dbo.fn_GetCustomerTier (@CustomerId INT)
RETURNS VARCHAR(10)
AS
BEGIN
    DECLARE @Total DECIMAL(19,4);
    SELECT @Total = SUM(Balance) FROM dbo.Accounts WHERE CustomerId = @CustomerId;
    RETURN CASE WHEN @Total >= 1000000 THEN 'PLATINUM'
                WHEN @Total >=  500000 THEN 'GOLD'
                ELSE 'STANDARD' END;
END
GO
-- Looks innocent; runs the function once per customer, row by row
SELECT c.CustomerId, c.FullName, dbo.fn_GetCustomerTier(c.CustomerId) AS Tier
FROM   dbo.Customers AS c;

-- Check whether SQL Server can inline it
SELECT OBJECT_NAME(object_id) AS FunctionName, is_inlineable
FROM   sys.sql_modules WHERE object_id = OBJECT_ID('dbo.fn_GetCustomerTier');`,
      },
      {
        title: "Inline table-valued functions: the good kind",
        titleBn: "Inline Table-Valued Function: ভালোটা",
        en: "RETURNS TABLE AS RETURN (single SELECT) is a parameterised view: SQL Server inlines it, it can run in parallel, and the optimizer sees straight through it. Rule: never put BEGIN … END in a function.",
        bn: "RETURNS TABLE AS RETURN (একটি SELECT) হলো parameter-সহ view: SQL Server এটাকে inline করে, parallel চলতে পারে, optimizer ভেতর পর্যন্ত দেখে। নিয়ম: function-এ কখনো BEGIN … END নয়।",
        code: `CREATE OR ALTER FUNCTION dbo.tvf_CustomerTier ()
RETURNS TABLE
AS
RETURN
    SELECT a.CustomerId,
           SUM(a.Balance) AS TotalBalance,
           CASE WHEN SUM(a.Balance) >= 1000000 THEN 'PLATINUM'
                WHEN SUM(a.Balance) >=  500000 THEN 'GOLD'
                ELSE 'STANDARD' END AS Tier
    FROM   dbo.Accounts AS a
    WHERE  a.Status = 'ACTIVE'
    GROUP BY a.CustomerId;
GO
SELECT c.FullName, t.Tier, t.TotalBalance
FROM   dbo.Customers AS c
JOIN   dbo.tvf_CustomerTier() AS t ON t.CustomerId = c.CustomerId;`,
      },
      {
        title: "Table-valued parameters",
        titleBn: "Table-Valued Parameter (TVP) — এক কলে পুরো সেট",
        en: "Send a whole set from the app in one call. Create a table TYPE, accept it READONLY. From C#, pass a DataTable with SqlDbType.Structured. Replaces giant IN ('1','2',…) strings and 5,000 separate calls.",
        bn: "অ্যাপ থেকে এক কলে পুরো সেট পাঠান। একটি table TYPE বানিয়ে READONLY হিসেবে নিন। C# থেকে SqlDbType.Structured দিয়ে DataTable পাঠান। বিশাল IN ('1','2',…) স্ট্রিং আর ৫০০০ আলাদা কলের বদলে এটা।",
        code: `CREATE TYPE dbo.AccountIdList AS TABLE (AccountId BIGINT NOT NULL PRIMARY KEY);
GO
CREATE OR ALTER PROCEDURE dbo.usp_GetBalances
    @Accounts dbo.AccountIdList READONLY        -- TVPs are always READONLY
AS
BEGIN
    SET NOCOUNT ON;
    SELECT a.AccountId, a.AccountNumber, a.Balance
    FROM   dbo.Accounts AS a
    JOIN   @Accounts    AS p ON p.AccountId = a.AccountId;
END
GO
DECLARE @list dbo.AccountIdList;
INSERT INTO @list VALUES (1), (2), (5);
EXEC dbo.usp_GetBalances @Accounts = @list;`,
      },
    ],
    summary: [
      {
        en: "First lines: SET NOCOUNT ON; SET XACT_ABORT ON.",
        bn: "প্রথম লাইন: SET NOCOUNT ON; SET XACT_ABORT ON।",
      },
      {
        en: "Avoid scalar UDFs; prefer inline TVFs.",
        bn: "Scalar UDF এড়িয়ে চলুন; inline TVF ব্যবহার করুন।",
      },
      {
        en: "Send sets with TVPs, not loops.",
        bn: "লুপ নয়, TVP দিয়ে সেট পাঠান।",
      },
    ],
  },

  {
    id: 15,
    slug: "triggers",
    part: 3,
    level: "Advanced",
    title: "Triggers",
    titleBn: "ট্রিগার (Trigger)",
    analogy: {
      en: "A trigger is a hidden CCTV camera: it records automatically every time something happens — useful for audit, but nobody sees it in the app code.",
      bn: "Trigger হলো লুকানো CCTV ক্যামেরা: প্রতিবার কিছু ঘটলে আপনাআপনি রেকর্ড করে — অডিটে কাজের, কিন্তু অ্যাপ কোডে কেউ দেখতে পায় না।",
    },
    sections: [
      {
        title: "An audit trigger",
        titleBn: "অডিট ট্রিগার",
        en: "An AFTER trigger fires ONCE PER STATEMENT, not per row. The virtual tables inserted (new values) and deleted (old values) can hold thousands of rows — always write set-based code against them.",
        bn: "AFTER trigger প্রতি STATEMENT-এ একবার চলে, প্রতি রো-তে নয়। inserted (নতুন মান) ও deleted (পুরনো মান) ভার্চুয়াল টেবিলে হাজার রো থাকতে পারে — সবসময় set-based কোড লিখুন।",
        code: `CREATE OR ALTER TRIGGER dbo.trg_Accounts_Audit
ON dbo.Accounts
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF ROWCOUNT_BIG() = 0 RETURN;                         -- nothing changed
    IF NOT UPDATE(Balance) AND NOT UPDATE(Status) RETURN;  -- column filter

    INSERT INTO dbo.AccountAudit
          (AccountId, OldBalance, NewBalance, OldStatus, NewStatus, ChangedBy, ChangedAt)
    SELECT i.AccountId, d.Balance, i.Balance, d.Status, i.Status,
           SUSER_SNAME(), SYSUTCDATETIME()
    FROM   inserted AS i
    JOIN   deleted  AS d ON d.AccountId = i.AccountId
    WHERE  i.Balance <> d.Balance OR i.Status <> d.Status;
END
GO
UPDATE dbo.Accounts SET Balance = Balance + 1 WHERE BranchId = 1;
SELECT * FROM dbo.AccountAudit;`,
        notes: [
          {
            type: "trap",
            en: "SELECT @Id = AccountId FROM inserted silently picks ONE arbitrary row and ignores the other 9,999. Classic junior bug.",
            bn: "SELECT @Id = AccountId FROM inserted চুপচাপ যেকোনো একটি রো নেয়, বাকি ৯,৯৯৯টি উপেক্ষা করে। ক্লাসিক জুনিয়র বাগ।",
          },
        ],
      },
      {
        title: "INSTEAD OF triggers",
        titleBn: "INSTEAD OF ট্রিগার",
        en: "INSTEAD OF runs your code in place of the original statement — the way to make a multi-table view updatable.",
        bn: "INSTEAD OF মূল statement-এর বদলে আপনার কোড চালায় — একাধিক টেবিলের view-কে update-যোগ্য করার উপায়।",
        code: `CREATE OR ALTER TRIGGER dbo.trg_vw_ActiveAccount_Update
ON dbo.vw_ActiveAccountSummary
INSTEAD OF UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE a SET a.AccountType = i.AccountType
    FROM   dbo.Accounts AS a JOIN inserted AS i ON i.AccountId = a.AccountId;

    UPDATE c SET c.FullName = i.FullName
    FROM   dbo.Customers AS c
    JOIN   dbo.Accounts  AS a ON a.CustomerId = c.CustomerId
    JOIN   inserted      AS i ON i.AccountId  = a.AccountId;
END`,
      },
      {
        title: "When not to use a trigger",
        titleBn: "কখন Trigger নয়",
        en: "Triggers run inside the caller's transaction, extend it, add locks and can roll it back — invisibly. Use them for audit that cannot be bypassed and invariants no constraint can express. Not for business logic, emails, cross-database calls, or cursors.",
        bn: "Trigger caller-এর transaction-এর ভেতরেই চলে, সেটাকে লম্বা করে, lock বাড়ায়, এমনকি rollback-ও করতে পারে — অদৃশ্যভাবে। শুধু অডিট আর এমন নিয়মের জন্য ব্যবহার করুন যা constraint দিয়ে হয় না। Business logic, ইমেইল, cross-database call বা cursor-এর জন্য নয়।",
        code: `-- Find every trigger and whether it is enabled
SELECT t.name AS TriggerName, OBJECT_NAME(t.parent_id) AS TableName,
       t.is_disabled, t.is_instead_of_trigger
FROM   sys.triggers AS t
WHERE  t.parent_class = 1;`,
        notes: [
          {
            type: "interview",
            q: "An INSERT of 50,000 rows takes 40 minutes. The table has a trigger. Diagnose.",
            en: "The trigger is row-at-a-time (cursor over inserted, or a scalar variable assuming one row). Rewrite as one set-based statement against inserted. Also check nested triggers.",
            bn: "Trigger-টি রো-বাই-রো লেখা (inserted-এর উপর cursor বা এক রো ধরে নেওয়া variable)। inserted-এর উপর একটি set-based statement-এ লিখুন। Nested trigger-ও দেখুন।",
          },
        ],
      },
    ],
    summary: [
      {
        en: "Triggers fire per statement; inserted/deleted are tables.",
        bn: "Trigger প্রতি statement-এ চলে; inserted/deleted হলো টেবিল।",
      },
      {
        en: "Use for audit, not business logic.",
        bn: "অডিটের জন্য, business logic-এর জন্য নয়।",
      },
    ],
  },

  {
    id: 16,
    slug: "loops-cursors-sets",
    part: 3,
    level: "Advanced",
    title: "Loops, Cursors, and Thinking in Sets",
    titleBn: "লুপ, কার্সর এবং সেট-ভিত্তিক চিন্তা",
    analogy: {
      en: "A cursor is carrying bricks one at a time. A set-based statement is a truck that carries all of them in one trip.",
      bn: "Cursor মানে একটা একটা করে ইট বহন করা। Set-based statement হলো ট্রাক — এক ট্রিপে সব ইট।",
    },
    sections: [
      {
        title: "Why loops are slow here",
        titleBn: "এখানে লুপ কেন ধীর",
        en: "Each cursor iteration is a separate fetch with its own locking and trip through the storage engine. A cursor is typically 10 to 1,000 times slower than the equivalent set-based statement. Ask: 'what single statement describes the end state?'",
        bn: "Cursor-এর প্রতিটি ধাপ আলাদা fetch, নিজস্ব locking আর storage engine-এ যাতায়াত। Cursor সাধারণত সমতুল্য set-based statement-এর চেয়ে ১০ থেকে ১০০০ গুণ ধীর। প্রশ্ন করুন: 'কোন একটি statement শেষ অবস্থাটা বর্ণনা করে?'",
        code: `SET STATISTICS TIME ON;   -- compare elapsed time of the cursor vs the set-based version below`,
      },
      {
        title: "The cursor: full syntax (to read legacy code)",
        titleBn: "Cursor: পুরো সিনট্যাক্স (পুরনো কোড পড়ার জন্য)",
        en: "DECLARE … CURSOR LOCAL FAST_FORWARD FOR SELECT, OPEN, FETCH NEXT … INTO, WHILE @@FETCH_STATUS = 0, FETCH again (easy to forget!), CLOSE, DEALLOCATE. Correct — and still the wrong tool: on 400,000 accounts this issues 800,000 statements.",
        bn: "DECLARE … CURSOR LOCAL FAST_FORWARD FOR SELECT, OPEN, FETCH NEXT … INTO, WHILE @@FETCH_STATUS = 0, আবার FETCH (ভুলে যাওয়া সহজ!), CLOSE, DEALLOCATE। সঠিক — তবুও ভুল টুল: ৪ লাখ অ্যাকাউন্টে ৮ লাখ statement চালায়।",
        code: `DECLARE @AccountId BIGINT, @Balance DECIMAL(19,4), @Fee DECIMAL(19,4);

DECLARE account_cursor CURSOR
    LOCAL              -- not visible outside this batch
    FAST_FORWARD       -- forward-only + read-only: the fastest type
    FOR
    SELECT AccountId, Balance
    FROM   dbo.Accounts
    WHERE  Status = 'ACTIVE' AND AccountType = 'SAVINGS';

OPEN account_cursor;
FETCH NEXT FROM account_cursor INTO @AccountId, @Balance;

WHILE @@FETCH_STATUS = 0          -- 0 = success, -1 = end, -2 = row missing
BEGIN
    SET @Fee = CASE WHEN @Balance < 5000  THEN 500
                    WHEN @Balance < 20000 THEN 200
                    ELSE 0 END;
    IF @Fee > 0
    BEGIN
        UPDATE dbo.Accounts SET Balance = Balance - @Fee WHERE AccountId = @AccountId;
        INSERT INTO dbo.Transactions (AccountId, TxnDate, TxnType, Channel, Amount, BalanceAfter, Reference)
        VALUES (@AccountId, SYSUTCDATETIME(), 'DEBIT', 'BRANCH', @Fee, @Balance - @Fee, N'Monthly maintenance fee');
    END
    FETCH NEXT FROM account_cursor INTO @AccountId, @Balance;   -- easy to forget
END

CLOSE account_cursor;
DEALLOCATE account_cursor;        -- forget this and you leak the cursor`,
        notes: [
          {
            type: "tip",
            en: "If you must use a cursor, always LOCAL FAST_FORWARD. The default (GLOBAL, dynamic) is dramatically slower.",
            bn: "Cursor লাগলে সবসময় LOCAL FAST_FORWARD। ডিফল্ট (GLOBAL, dynamic) অনেক বেশি ধীর।",
          },
        ],
      },
      {
        title: "The same thing, set-based",
        titleBn: "একই কাজ, Set-based ভাবে",
        en: "Compute every fee with CROSS APPLY (VALUES (CASE …)), UPDATE all rows at once, capture what changed with OUTPUT, then INSERT all transactions from that captured set. Two statements instead of 800,000.",
        bn: "CROSS APPLY (VALUES (CASE …)) দিয়ে সব ফি একসাথে হিসাব, একবারে সব রো UPDATE, OUTPUT দিয়ে কী বদলাল তা ধরা, তারপর সেখান থেকে সব লেনদেন INSERT। ৮ লাখের বদলে দুটি statement।",
        code: `BEGIN TRANSACTION;

DECLARE @Charged TABLE (AccountId BIGINT, Fee DECIMAL(19,4), NewBalance DECIMAL(19,4));

UPDATE a
SET    a.Balance = a.Balance - v.Fee
OUTPUT inserted.AccountId, v.Fee, inserted.Balance INTO @Charged
FROM   dbo.Accounts AS a
CROSS APPLY (VALUES (CASE WHEN a.Balance < 5000  THEN 500
                          WHEN a.Balance < 20000 THEN 200
                          ELSE 0 END)) AS v(Fee)
WHERE  a.Status = 'ACTIVE' AND a.AccountType = 'SAVINGS'
  AND  v.Fee > 0;

INSERT INTO dbo.Transactions (AccountId, TxnDate, TxnType, Channel, Amount, BalanceAfter, Reference)
SELECT c.AccountId, SYSUTCDATETIME(), 'DEBIT', 'BRANCH', c.Fee, c.NewBalance, N'Monthly maintenance fee'
FROM   @Charged AS c;

COMMIT TRANSACTION;`,
      },
      {
        title: "The set-based translation table",
        titleBn: "Set-based অনুবাদ টেবিল",
        en: "Running total → SUM() OVER (… ROWS …). Compare to previous row → LAG/LEAD. Number rows in a group → ROW_NUMBER. Different value per row → CASE in SET. Insert or update each row → MERGE. Top 3 per parent → CROSS APPLY TOP 3. Walk a hierarchy → recursive CTE. Concatenate rows → STRING_AGG. Need IDs you wrote → OUTPUT. Call a procedure per row → change it to take a TVP.",
        bn: "Running total → SUM() OVER (… ROWS …)। আগের রো-র সাথে তুলনা → LAG/LEAD। গ্রুপে নম্বর → ROW_NUMBER। প্রতি রো-তে ভিন্ন মান → SET-এ CASE। প্রতি রো insert/update → MERGE। প্রতি parent-এ Top 3 → CROSS APPLY TOP 3। Hierarchy → recursive CTE। রো জোড়া দেওয়া → STRING_AGG। লেখা ID দরকার → OUTPUT। প্রতি রো-তে procedure → TVP নিন।",
        code: `-- Loop thinking: "for each customer, build a comma list of accounts"
-- Set thinking:
SELECT c.CustomerId, c.FullName,
       STRING_AGG(a.AccountNumber, ', ') WITHIN GROUP (ORDER BY a.OpenedOn) AS Accounts
FROM   dbo.Customers AS c
JOIN   dbo.Accounts  AS a ON a.CustomerId = c.CustomerId
GROUP BY c.CustomerId, c.FullName;`,
      },
      {
        title: "The WHILE loop and when loops are actually right",
        titleBn: "WHILE লুপ এবং কখন লুপ আসলেই ঠিক",
        en: "Loop over BATCHES, be set-based INSIDE each batch: bounded transaction size, bounded locks, resumable, near set-based speed. Legitimate row cursors: admin work across objects (rebuild every index), calling a procedure you cannot change, rare true sequential dependency.",
        bn: "BATCH-এর উপর লুপ, প্রতিটি batch-এর ভেতরে set-based: সীমিত transaction, সীমিত lock, আবার শুরু করা যায়, প্রায় set-based গতি। বৈধ cursor: অবজেক্টের উপর প্রশাসনিক কাজ (সব index rebuild), যে procedure বদলানো যায় না সেটা কল করা, বিরল আসল ধারাবাহিক নির্ভরতা।",
        code: `-- Backfill millions of rows without one 4-hour transaction
DECLARE @BatchSize INT = 10000, @Rows INT = 1;

WHILE @Rows > 0
BEGIN
    UPDATE TOP (@BatchSize) t
    SET    t.Channel = 'ONLINE'
    FROM   dbo.Transactions AS t
    WHERE  t.Channel = 'WEB';          -- predicate shrinks each pass

    SET @Rows = @@ROWCOUNT;

    CHECKPOINT;                         -- allow log truncation in SIMPLE recovery
    WAITFOR DELAY '00:00:00.050';       -- yield to OLTP work
END`,
        notes: [
          {
            type: "interview",
            q: "When would you use a cursor?",
            en: "Almost never for data. A WHILE loop for batched modifications; a cursor only for admin work across objects or a per-row procedure I cannot change. Otherwise window functions, APPLY, or MERGE first.",
            bn: "ডেটার জন্য প্রায় কখনোই না। Batch পরিবর্তনের জন্য WHILE লুপ; cursor শুধু অবজেক্টের প্রশাসনিক কাজে বা বদলানো যায় না এমন procedure-এর জন্য। নইলে আগে window function, APPLY বা MERGE।",
          },
        ],
      },
      {
        title: "RBAR, and where it hides in application code",
        titleBn: "RBAR — অ্যাপ্লিকেশন কোডে যেখানে লুকিয়ে থাকে",
        en: "Row-By-Agonising-Row is a mindset. In C# it looks like a foreach with lazy loading: 1 query for customers + 1,000 queries for their accounts (N+1). The SQL that EF Core should send instead is ONE grouped query.",
        bn: "Row-By-Agonising-Row একটি মানসিকতা। C#-এ এটা lazy loading সহ foreach: কাস্টমারের জন্য ১টি query + তাদের অ্যাকাউন্টের জন্য ১০০০টি query (N+1)। EF Core-এর পাঠানো উচিত একটি grouped query।",
        code: `-- What N+1 sends (1 + N round trips):
SELECT CustomerId, FullName FROM dbo.Customers WHERE City = N'Dhaka';
SELECT COUNT(*) FROM dbo.Accounts WHERE CustomerId = 1;
SELECT COUNT(*) FROM dbo.Accounts WHERE CustomerId = 2;
-- ... one per customer

-- What it should send (1 round trip):
SELECT c.FullName, COUNT(a.AccountId) AS AccountCount
FROM   dbo.Customers AS c
LEFT   JOIN dbo.Accounts AS a ON a.CustomerId = c.CustomerId
WHERE  c.City = N'Dhaka'
GROUP BY c.CustomerId, c.FullName;`,
      },
    ],
    summary: [
      {
        en: "Think in sets: describe the end state in one statement.",
        bn: "সেটে ভাবুন: এক statement-এ শেষ অবস্থা বলুন।",
      },
      {
        en: "Loop over batches, never over rows.",
        bn: "Batch-এ লুপ, রো-তে নয়।",
      },
      {
        en: "N+1 in the app is a cursor in disguise.",
        bn: "অ্যাপের N+1 আসলে ছদ্মবেশী cursor।",
      },
    ],
  },
];
