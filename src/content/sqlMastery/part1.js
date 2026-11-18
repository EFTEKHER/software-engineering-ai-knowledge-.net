// SQL Server Mastery — Part I (Foundations) and Part II (Core SQL)
// Every code sample is T-SQL for Microsoft SQL Server and runs against BankDB.

export const part1 = [
  {
    id: 1,
    slug: "how-database-thinks",
    part: 0,
    level: "Beginner",
    title: "How a Relational Database Thinks",
    titleBn: "রিলেশনাল ডাটাবেস কীভাবে চিন্তা করে",
    analogy: {
      en: "Ordering food in a restaurant: you say WHAT you want (biryani, no onion). The chef decides HOW to cook it. SQL is the order; the query optimizer is the chef.",
      bn: "রেস্টুরেন্টে খাবার অর্ডারের মতো: আপনি বলেন কী চান (বিরিয়ানি, পেঁয়াজ ছাড়া)। কীভাবে রান্না হবে সেটা শেফ ঠিক করেন। SQL হলো অর্ডার, আর Query Optimizer হলো শেফ।",
    },
    sections: [
      {
        title: "The one idea underneath everything",
        titleBn: "সবকিছুর নিচে একটাই আইডিয়া",
        en: "In C# a for loop tells the computer HOW to get an answer. A SELECT only describes WHAT answer you want. SQL Server's query optimizer invents the HOW for you, fresh, every time, based on how much data exists today. That is why the same query can be fast on your laptop and slow in production, and why one set-based statement can beat a loop by 1000x.",
        bn: "C#-এ for loop দিয়ে আপনি কম্পিউটারকে বলেন কীভাবে উত্তর বের করবে। কিন্তু SELECT শুধু বলে কী উত্তর চাই। কীভাবে বের হবে, সেটা SQL Server-এর Query Optimizer প্রতিবার আজকের ডেটার পরিমাণ দেখে নতুন করে ঠিক করে। এজন্যই একই query ল্যাপটপে দ্রুত, কিন্তু production-এ ধীর হতে পারে।",
        code: `-- You describe the RESULT, not the steps.
SELECT c.FullName, a.AccountNumber, a.Balance
FROM   dbo.Customers AS c
JOIN   dbo.Accounts  AS a ON a.CustomerId = c.CustomerId
WHERE  a.Balance > 100000;
-- SQL Server decides: which index, which join algorithm, which order.`,
        notes: [
          {
            type: "key",
            en: "You declare intent; the optimizer chooses strategy. Your job: write clear queries and give the optimizer good indexes and statistics.",
            bn: "আপনি উদ্দেশ্য বলবেন, optimizer কৌশল বাছবে। আপনার কাজ: পরিষ্কার query লেখা আর ভালো index ও statistics দেওয়া।",
          },
        ],
      },
      {
        title: "Tables, rows, and the relational model",
        titleBn: "টেবিল, রো এবং রিলেশনাল মডেল",
        en: "A table is an unordered SET of rows. Three rules follow: (1) rows have no order unless you write ORDER BY, (2) rows have no position — there is no 'third row', only 'the row whose AccountId = 3', (3) duplicate rows are a design smell, so every table needs a primary key.",
        bn: "টেবিল হলো রো-এর একটি ক্রমহীন সেট (set)। তিনটি নিয়ম: (১) ORDER BY না লিখলে রো-এর কোনো ক্রম নেই, (২) রো-এর কোনো অবস্থান নেই — 'তৃতীয় রো' বলে কিছু নেই, আছে 'যে রো-এর AccountId = 3', (৩) ডুপ্লিকেট রো মানে ডিজাইনে সমস্যা, তাই প্রতিটি টেবিলে Primary Key লাগবে।",
        code: `-- WRONG assumption: "it came back sorted, so it is sorted"
SELECT AccountNumber, Balance FROM dbo.Accounts;

-- RIGHT: if you need order, say so
SELECT AccountNumber, Balance
FROM   dbo.Accounts
ORDER BY Balance DESC, AccountId;`,
        notes: [
          {
            type: "trap",
            en: "'Rows came back in the right order without ORDER BY' is the most common hidden bug. When the table grows and the plan goes parallel, the order silently changes.",
            bn: "'ORDER BY ছাড়াই ঠিক ক্রমে এসেছে' — এটা সবচেয়ে কমন লুকানো বাগ। টেবিল বড় হলে plan বদলায় আর ক্রমও চুপচাপ বদলে যায়।",
          },
        ],
      },
      {
        title: "The logical processing order of a SELECT",
        titleBn: "SELECT-এর লজিক্যাল প্রসেসিং অর্ডার",
        en: "You WRITE: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY. SQL Server EVALUATES: 1 FROM/JOIN → 2 WHERE → 3 GROUP BY → 4 HAVING → 5 SELECT → 6 DISTINCT → 7 ORDER BY → 8 TOP / OFFSET-FETCH. This order explains many rules: a SELECT alias cannot be used in WHERE (alias is born at step 5), but can be used in ORDER BY (step 7). COUNT(*) cannot go in WHERE because groups do not exist until step 3 — use HAVING.",
        bn: "আপনি লেখেন SELECT, FROM, WHERE... কিন্তু SQL Server চালায় এই ক্রমে: ১ FROM/JOIN → ২ WHERE → ৩ GROUP BY → ৪ HAVING → ৫ SELECT → ৬ DISTINCT → ৭ ORDER BY → ৮ TOP/OFFSET। তাই SELECT-এর alias WHERE-এ চলে না (alias জন্মায় ধাপ ৫-এ), কিন্তু ORDER BY-তে চলে (ধাপ ৭)। COUNT(*) WHERE-এ দেওয়া যায় না, কারণ group তৈরি হয় ধাপ ৩-এ — তাই HAVING ব্যবহার করুন।",
        code: `SELECT   c.FullName, COUNT(*) AS TxnCount        -- 5
FROM     dbo.Customers    AS c                   -- 1
JOIN     dbo.Accounts     AS a ON a.CustomerId = c.CustomerId
JOIN     dbo.Transactions AS t ON t.AccountId  = a.AccountId
WHERE    t.TxnDate >= '2026-01-01'               -- 2
GROUP BY c.FullName                              -- 3
HAVING   COUNT(*) > 2                            -- 4
ORDER BY TxnCount DESC;                          -- 7 (alias works here)

-- Error: Invalid column name 'TxnCount' (WHERE runs before SELECT)
-- SELECT COUNT(*) AS TxnCount FROM dbo.Transactions WHERE TxnCount > 2;`,
        notes: [
          {
            type: "key",
            en: "FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → TOP. Memorise it.",
            bn: "FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → TOP — এটা মুখস্থ রাখুন।",
          },
        ],
      },
      {
        title: "Logical order is not physical order",
        titleBn: "লজিক্যাল অর্ডার ≠ ফিজিক্যাল অর্ডার",
        en: "The logical order defines MEANING. The execution plan defines what physically happens. The optimizer may push your WHERE into an index seek that runs first, or stop reading after TOP (10) rows. It may do anything that cannot change the result. So an execution plan often looks nothing like your query text — and that is correct.",
        bn: "লজিক্যাল অর্ডার query-র অর্থ ঠিক করে। কিন্তু আসলে কী ঘটবে সেটা ঠিক করে execution plan। Optimizer WHERE-কে আগে index seek-এ নিয়ে যেতে পারে, বা TOP (10) পেলেই পড়া বন্ধ করতে পারে — ফলাফল না বদলালে সে যেকোনো কিছু করতে পারে।",
        code: `-- Logically: read all, sort all, then take 10.
-- Physically (with an index on Balance): read only 10 rows from the index and stop.
SELECT TOP (10) AccountNumber, Balance
FROM   dbo.Accounts
ORDER BY Balance DESC;`,
      },
      {
        title: "Client–server: the cost you forget",
        titleBn: "ক্লায়েন্ট–সার্ভার: যে খরচ আমরা ভুলে যাই",
        en: "Every statement crosses the network, is parsed, compiled (or a cached plan is found), executes, and streams rows back. One round trip costs ~0.5–2 ms. 1,000 single-row INSERTs from your app = 1–2 seconds of pure network wait. One INSERT with 1,000 rows = one round trip.",
        bn: "প্রতিটি statement নেটওয়ার্ক পার হয়, parse হয়, compile হয়, চলে, তারপর রেজাল্ট ফেরত আসে। একটি round trip ≈ ০.৫–২ ms। অ্যাপ থেকে ১০০০টি আলাদা INSERT = ১–২ সেকেন্ড শুধু নেটওয়ার্কে নষ্ট। একটি INSERT-এ ১০০০ রো = একটি round trip।",
        code: `-- Slow pattern (from the app): 3 statements = 3 round trips
INSERT INTO dbo.Branches (BranchCode, BranchName, City, OpenedOn) VALUES ('KHL01', N'Khulna',   N'Khulna',   '2026-03-01');
INSERT INTO dbo.Branches (BranchCode, BranchName, City, OpenedOn) VALUES ('RAJ01', N'Rajshahi', N'Rajshahi', '2026-03-15');

-- Fast pattern: one statement, one round trip
INSERT INTO dbo.Branches (BranchCode, BranchName, City, OpenedOn)
VALUES ('BAR01', N'Barishal', N'Barishal', '2026-04-01'),
       ('RNG01', N'Rangpur',  N'Rangpur',  '2026-04-10');`,
        notes: [
          {
            type: "tip",
            en: "For a slow endpoint, measure: (1) how many statements it sends, (2) rows each returns, (3) time each took. Usually the problem is the number of round trips.",
            bn: "ধীর endpoint-এ আগে মাপুন: (১) কতগুলো statement যায়, (২) প্রতিটি কত রো ফেরত দেয়, (৩) প্রতিটির সময়। সাধারণত সমস্যা হলো round trip-এর সংখ্যা।",
          },
        ],
      },
      {
        title: "ACID in one page",
        titleBn: "এক পাতায় ACID",
        en: "Atomicity: all or nothing — a debit without its credit cannot survive. Consistency: constraints are never left broken. Isolation: concurrent transactions don't see each other's half-done work (tunable). Durability: once committed, it survives a power cut (the log is flushed to disk first).",
        bn: "Atomicity: হয় পুরোটা হবে, নয় কিছুই না — টাকা কাটা হলো কিন্তু জমা হলো না, এমন হবে না। Consistency: constraint কখনো ভাঙা থাকবে না। Isolation: একসাথে চলা transaction একে অপরের অর্ধেক কাজ দেখবে না (এটা টিউন করা যায়)। Durability: commit হলে বিদ্যুৎ গেলেও ডেটা থাকবে।",
        code: `BEGIN TRANSACTION;
    UPDATE dbo.Accounts SET Balance = Balance - 500 WHERE AccountId = 1;
    UPDATE dbo.Accounts SET Balance = Balance + 500 WHERE AccountId = 3;
COMMIT TRANSACTION;   -- both happen, or (on error + rollback) neither happens`,
        notes: [
          {
            type: "interview",
            q: "Which ACID property do you actually get to choose?",
            en: "Isolation. A, C and D are guaranteed by the engine; isolation is a dial you set per transaction, trading correctness against concurrency.",
            bn: "Isolation। A, C, D ইঞ্জিন নিশ্চিত করে; Isolation হলো একটি ডায়াল যা প্রতি transaction-এ সেট করা যায় — সঠিকতা বনাম concurrency-র ট্রেড-অফ।",
          },
        ],
      },
    ],
    summary: [
      {
        en: "SQL is declarative: describe the result, the optimizer picks the method.",
        bn: "SQL declarative: ফলাফল বলুন, পদ্ধতি optimizer বাছবে।",
      },
      {
        en: "Tables are unordered sets — no ORDER BY means no order.",
        bn: "টেবিল ক্রমহীন সেট — ORDER BY ছাড়া কোনো ক্রম নেই।",
      },
      {
        en: "Logical processing order explains alias, aggregate and LEFT JOIN rules.",
        bn: "লজিক্যাল অর্ডার দিয়ে alias, aggregate ও LEFT JOIN-এর নিয়ম বোঝা যায়।",
      },
      {
        en: "Round trips are usually the real cost in application code.",
        bn: "অ্যাপ্লিকেশনে আসল খরচ সাধারণত round trip।",
      },
    ],
  },

  {
    id: 2,
    slug: "bankdb-schema",
    part: 0,
    level: "Beginner",
    title: "The BankDB Schema",
    titleBn: "BankDB স্কিমা — পুরো কোর্সের ডেটাবেস",
    analogy: {
      en: "One bank, six registers: Branches, Employees, Customers, Accounts, Transactions and Loans. Every module uses this same bank, so you never re-learn a toy schema.",
      bn: "একটি ব্যাংক, ছয়টি খাতা: Branches, Employees, Customers, Accounts, Transactions ও Loans। প্রতিটি মডিউলে একই ব্যাংক — নতুন করে schema শিখতে হবে না।",
    },
    sections: [
      {
        title: "Entity overview",
        titleBn: "এন্টিটি এক নজরে",
        en: "Branches (~40 rows, one branch each). Employees (~900, self-referencing ManagerId). Customers (~250,000). Accounts (~400,000, many per customer). Transactions (~60,000,000 money movements — the big one). Loans (~35,000). A query fine on 400K Accounts can be a disaster on 60M Transactions; optimization lessons depend on that size difference.",
        bn: "Branches (~৪০টি), Employees (~৯০০, ManagerId নিজের টেবিলকেই রেফার করে), Customers (~২.৫ লাখ), Accounts (~৪ লাখ, এক কাস্টমারের একাধিক), Transactions (~৬ কোটি — সবচেয়ে বড়), Loans (~৩৫ হাজার)। ৪ লাখ রো-তে যে query ঠিক আছে, ৬ কোটিতে সেটা বিপর্যয় হতে পারে।",
        code: `-- Quick look at the size of each table
SELECT t.name AS TableName, SUM(p.rows) AS TotalRows
FROM   sys.tables AS t
JOIN   sys.partitions AS p ON p.object_id = t.object_id AND p.index_id IN (0, 1)
GROUP BY t.name
ORDER BY TotalRows DESC;`,
      },
      {
        title: "Data definition (DDL)",
        titleBn: "ডেটা ডেফিনিশন (DDL)",
        en: "Each table has a clustered primary key, foreign keys to its parent, and CHECK constraints for status columns. Use the full setup script at the top of this page to create everything. Below is the Accounts table — read every line as a decision.",
        bn: "প্রতিটি টেবিলে clustered primary key, parent টেবিলে foreign key, আর status কলামে CHECK constraint আছে। পেজের উপরের setup script দিয়ে সব তৈরি করুন। নিচে Accounts টেবিল — প্রতিটি লাইন একটি সিদ্ধান্ত।",
        code: `CREATE TABLE dbo.Accounts (
    AccountId     BIGINT        NOT NULL IDENTITY(1,1),   -- surrogate key
    AccountNumber CHAR(13)      NOT NULL,                 -- natural key customers know
    CustomerId    INT           NOT NULL,
    BranchId      INT           NOT NULL,
    AccountType   VARCHAR(10)   NOT NULL,                 -- SAVINGS, CURRENT, FD
    Balance       DECIMAL(19,4) NOT NULL DEFAULT 0,       -- money: never FLOAT
    Currency      CHAR(3)       NOT NULL DEFAULT 'BDT',
    Status        VARCHAR(10)   NOT NULL DEFAULT 'ACTIVE',
    OpenedOn      DATE          NOT NULL,
    ClosedOn      DATE          NULL,
    CONSTRAINT PK_Accounts PRIMARY KEY CLUSTERED (AccountId),
    CONSTRAINT UQ_Accounts_Number UNIQUE (AccountNumber),
    CONSTRAINT FK_Acc_Customer FOREIGN KEY (CustomerId) REFERENCES dbo.Customers(CustomerId),
    CONSTRAINT FK_Acc_Branch   FOREIGN KEY (BranchId)   REFERENCES dbo.Branches(BranchId),
    CONSTRAINT CK_Acc_Type   CHECK (AccountType IN ('SAVINGS','CURRENT','FD')),
    CONSTRAINT CK_Acc_Status CHECK (Status IN ('ACTIVE','DORMANT','CLOSED')),
    CONSTRAINT CK_Acc_Closed CHECK (ClosedOn IS NULL OR ClosedOn >= OpenedOn)
);`,
      },
      {
        title: "Reading the DDL like an engineer",
        titleBn: "ইঞ্জিনিয়ারের চোখে DDL পড়া",
        en: "BIGINT for AccountId/TxnId because 60M+ rows will outgrow INT; the FK type must match the PK type (mismatch = accidental scans). DECIMAL(19,4) for money because FLOAT cannot store 0.1 exactly. DATETIME2(3) instead of DATETIME (DATETIME rounds to 3.33 ms). Surrogate key + unique natural key: join on AccountId, look up by AccountNumber. CHECK constraints are the last line of defence when the app has a bug. ManagerId is nullable because the CEO has no manager.",
        bn: "AccountId/TxnId-এ BIGINT, কারণ ৬ কোটি+ রো INT-এ ধরবে না; FK-এর টাইপ PK-এর সাথে মিলতে হবে (না মিললে scan হয়)। টাকার জন্য DECIMAL(19,4), কারণ FLOAT ০.১ ঠিকভাবে রাখতে পারে না। DATETIME-এর বদলে DATETIME2(3)। Surrogate key দিয়ে join, natural key (AccountNumber) দিয়ে খোঁজা। অ্যাপে বাগ থাকলেও CHECK constraint শেষ পাহারাদার। CEO-র ম্যানেজার নেই, তাই ManagerId nullable।",
        code: `-- FLOAT vs DECIMAL: why a bank never uses FLOAT
DECLARE @f FLOAT = 0.1, @d DECIMAL(19,4) = 0.1;
SELECT IIF(@f + 0.2 = 0.3, 'equal', 'NOT equal') AS FloatResult,     -- NOT equal
       IIF(@d + 0.2 = 0.3, 'equal', 'NOT equal') AS DecimalResult;   -- equal`,
        notes: [
          {
            type: "trap",
            en: "Accounts.Balance is a derived (denormalized) value — it should equal the sum of the account's transactions. Every write path must update it inside a transaction (Module 24).",
            bn: "Accounts.Balance একটি derived (denormalized) মান — এটা লেনদেনের যোগফলের সমান হওয়া উচিত। তাই প্রতিটি write-এ transaction-এর ভেতরে এটা আপডেট করতে হবে (মডিউল ২৪)।",
          },
        ],
      },
      {
        title: "Seeding sample data",
        titleBn: "স্যাম্পল ডেটা যোগ করা",
        en: "Use a multi-row INSERT with column names. N'...' marks Unicode (NVARCHAR) text, needed for Bangla names. Amounts are in Bangladeshi Taka (Tk).",
        bn: "কলামের নাম দিয়ে multi-row INSERT ব্যবহার করুন। N'...' মানে Unicode (NVARCHAR) টেক্সট — বাংলা নাম রাখতে এটা লাগে। টাকার অঙ্ক বাংলাদেশি টাকায় (Tk)।",
        code: `INSERT INTO dbo.Customers (NationalId, FullName, Email, City, KycStatus)
VALUES ('2002000111', N'রহিম উদ্দিন', 'rahim.bn@example.com', N'ঢাকা', 'VERIFIED'),
       ('2003000222', N'Tania Akter', NULL,                   N'Khulna', 'PENDING');

SELECT CustomerId, FullName, City FROM dbo.Customers;`,
      },
    ],
    summary: [
      {
        en: "Six tables, one bank, used by every module.",
        bn: "ছয়টি টেবিল, একটি ব্যাংক — সব মডিউলে।",
      },
      {
        en: "Money = DECIMAL(19,4); time = DATETIME2(3); keys = INT/BIGINT.",
        bn: "টাকা = DECIMAL(19,4); সময় = DATETIME2(3); key = INT/BIGINT।",
      },
      {
        en: "Constraints protect data even when the application is wrong.",
        bn: "অ্যাপ ভুল করলেও constraint ডেটা রক্ষা করে।",
      },
    ],
  },

  {
    id: 3,
    slug: "data-types-null",
    part: 0,
    level: "Beginner",
    title: "Data Types and the Truth About NULL",
    titleBn: "ডেটা টাইপ এবং NULL-এর আসল সত্য",
    analogy: {
      en: "NULL is a sealed envelope: you don't know what's inside. Two sealed envelopes are not 'equal' — you simply don't know.",
      bn: "NULL হলো সিল করা খাম: ভেতরে কী আছে জানি না। দুটি সিল করা খাম 'সমান' কিনা — সেটাও জানি না।",
    },
    sections: [
      {
        title: "Choosing types deliberately",
        titleBn: "সচেতনভাবে টাইপ বাছাই",
        en: "Type choice is a performance decision. Every byte is read from disk, cached in memory and sent over the network. A row twice as wide = half the rows per 8 KB page = twice the I/O. Money → DECIMAL(19,4). Keys → INT/BIGINT (UNIQUEIDENTIFIER is 16 bytes and fragments). Timestamp → DATETIME2(3). Date only → DATE. Flag → BIT. Fixed code → CHAR(3). Free text → NVARCHAR(n), not NVARCHAR(MAX).",
        bn: "টাইপ বাছাই মানে পারফরম্যান্সের সিদ্ধান্ত। রো দ্বিগুণ চওড়া হলে ৮ KB পেজে অর্ধেক রো ধরে, ফলে I/O দ্বিগুণ। টাকা → DECIMAL(19,4), key → INT/BIGINT, সময় → DATETIME2(3), শুধু তারিখ → DATE, হ্যাঁ/না → BIT, নির্দিষ্ট দৈর্ঘ্যের কোড → CHAR(3), টেক্সট → NVARCHAR(n), MAX নয়।",
        code: `CREATE TABLE dbo.TypeDemo (
    Id         INT            NOT NULL IDENTITY PRIMARY KEY,
    Amount     DECIMAL(19,4)  NOT NULL,   -- money
    IsActive   BIT            NOT NULL,   -- flag
    Currency   CHAR(3)        NOT NULL,   -- fixed code
    City       NVARCHAR(60)   NULL,       -- honest width
    CreatedAt  DATETIME2(3)   NOT NULL DEFAULT SYSUTCDATETIME()
);

-- See the declared size in bytes
SELECT name, TYPE_NAME(system_type_id) AS TypeName, max_length
FROM   sys.columns WHERE object_id = OBJECT_ID('dbo.TypeDemo');`,
        notes: [
          {
            type: "trap",
            en: "Never size a column 'just in case'. NVARCHAR(4000) for a city name makes SQL Server request a huge memory grant for sorts (it estimates from declared size) and can spill to tempdb.",
            bn: "'যদি লাগে' ভেবে কলাম বড় করবেন না। শহরের নামের জন্য NVARCHAR(4000) দিলে sort-এর সময় SQL Server বিশাল memory চায় (declared size দেখে) এবং tempdb-তে spill হতে পারে।",
          },
        ],
      },
      {
        title: "NULL is not a value",
        titleBn: "NULL কোনো মান নয়",
        en: "NULL means UNKNOWN. It is not zero, not an empty string, and not equal to itself. SQL uses three-valued logic: TRUE, FALSE, UNKNOWN. WHERE and JOIN keep only TRUE rows. CHECK constraints reject only FALSE — so CHECK (Salary > 0) still allows a NULL salary.",
        bn: "NULL মানে অজানা (UNKNOWN)। এটা শূন্য নয়, ফাঁকা স্ট্রিং নয়, এমনকি নিজের সমানও নয়। SQL-এ তিনটি লজিক: TRUE, FALSE, UNKNOWN। WHERE ও JOIN শুধু TRUE রাখে। CHECK শুধু FALSE বাতিল করে — তাই CHECK (Salary > 0) NULL salary আটকায় না।",
        code: `-- Returns NO rows, ever. NULL = NULL is UNKNOWN, not TRUE.
SELECT * FROM dbo.Customers WHERE Email = NULL;

-- Correct:
SELECT * FROM dbo.Customers WHERE Email IS NULL;

-- Subtle: this EXCLUDES customers whose Email is NULL
SELECT * FROM dbo.Customers WHERE Email <> 'rahim@example.com';

-- If you want them too, say so:
SELECT * FROM dbo.Customers
WHERE  Email <> 'rahim@example.com' OR Email IS NULL;`,
        notes: [
          {
            type: "key",
            en: "AND: TRUE AND UNKNOWN = UNKNOWN; FALSE AND UNKNOWN = FALSE. OR: TRUE OR UNKNOWN = TRUE; FALSE OR UNKNOWN = UNKNOWN.",
            bn: "AND-এ: TRUE AND UNKNOWN = UNKNOWN, কিন্তু FALSE AND UNKNOWN = FALSE। OR-এ: TRUE OR UNKNOWN = TRUE, কিন্তু FALSE OR UNKNOWN = UNKNOWN।",
          },
        ],
      },
      {
        title: "How aggregates treat NULL",
        titleBn: "Aggregate ফাংশন NULL-কে কীভাবে দেখে",
        en: "Aggregates ignore NULL — except COUNT(*), which counts rows. COUNT(Email) counts only non-NULL emails. AVG skips NULLs in both the sum and the divisor: AVG(100, NULL, 200) = 150, not 100.",
        bn: "Aggregate ফাংশন NULL উপেক্ষা করে — শুধু COUNT(*) ছাড়া, যেটা রো গোনে। COUNT(Email) শুধু non-NULL ইমেইল গোনে। AVG যোগফল ও ভাজক দুটো থেকেই NULL বাদ দেয়: AVG(100, NULL, 200) = 150, 100 নয়।",
        code: `SELECT COUNT(*)     AS AllCustomers,     -- counts rows
       COUNT(Email) AS WithEmail,        -- counts non-NULL emails
       COUNT(*) - COUNT(Email) AS NoEmail
FROM   dbo.Customers;

SELECT AVG(v) AS AvgIgnoresNull   -- 150
FROM   (VALUES (100), (NULL), (200)) AS x(v);`,
        notes: [
          {
            type: "interview",
            q: "COUNT(*) vs COUNT(1) vs COUNT(col)?",
            en: "COUNT(*) and COUNT(1) are identical — both count rows, same plan, same speed. COUNT(col) counts rows where col IS NOT NULL — a different question.",
            bn: "COUNT(*) আর COUNT(1) একই — দুটোই রো গোনে, একই গতি। COUNT(col) শুধু যেখানে col NULL নয় সেগুলো গোনে — এটা ভিন্ন প্রশ্ন।",
          },
        ],
      },
      {
        title: "Handling NULL: COALESCE, ISNULL, NULLIF",
        titleBn: "NULL সামলানো: COALESCE, ISNULL, NULLIF",
        en: "COALESCE(a, b, c) returns the first non-NULL value (any number of arguments). ISNULL(a, b) takes exactly two and returns the type of the FIRST argument (it can truncate!). NULLIF(x, 0) turns 0 into NULL — the classic divide-by-zero guard.",
        bn: "COALESCE(a, b, c) প্রথম non-NULL মান দেয় (যত খুশি আর্গুমেন্ট)। ISNULL(a, b) ঠিক দুটো নেয় এবং প্রথম আর্গুমেন্টের টাইপ ফেরত দেয় (কেটে ফেলতে পারে!)। NULLIF(x, 0) শূন্যকে NULL বানায় — ০ দিয়ে ভাগ ঠেকানোর ক্লাসিক কৌশল।",
        code: `-- First available contact point
SELECT FullName, COALESCE(Email, Phone, 'no contact') AS ContactPoint
FROM   dbo.Customers;

-- ISNULL truncates to the first argument's type: returns 'AB'
SELECT ISNULL(CAST(NULL AS CHAR(2)), 'ABCD') AS IsNullResult,
       COALESCE(CAST(NULL AS CHAR(2)), 'ABCD') AS CoalesceResult;  -- 'ABCD'

-- Divide-by-zero guard
SELECT t.TxnId, t.Amount / NULLIF(a.Balance, 0) AS ShareOfBalance
FROM   dbo.Transactions AS t
JOIN   dbo.Accounts     AS a ON a.AccountId = t.AccountId;`,
        notes: [
          {
            type: "tip",
            en: "Prefer COALESCE: it is standard and does not silently truncate.",
            bn: "COALESCE ব্যবহার করুন: এটা standard এবং চুপচাপ ডেটা কাটে না।",
          },
        ],
      },
      {
        title: "Implicit conversion: the silent performance killer",
        titleBn: "Implicit Conversion: নিঃশব্দ পারফরম্যান্স খুনি",
        en: "When two different types are compared, SQL Server converts one side using type precedence. If it converts the COLUMN, the index can no longer be used for a seek. AccountNumber is CHAR(13); N'...' is NVARCHAR, which outranks CHAR, so every row's AccountNumber is converted → scan.",
        bn: "দুটি ভিন্ন টাইপ তুলনা করলে SQL Server এক পাশকে কনভার্ট করে। যদি কলামকে কনভার্ট করে, তবে index seek আর কাজ করে না। AccountNumber হলো CHAR(13); N'...' হলো NVARCHAR যার precedence বেশি — তাই প্রতিটি রো কনভার্ট হয় → scan।",
        code: `-- SCAN: the N prefix makes the literal NVARCHAR, so the column is converted
SELECT * FROM dbo.Accounts WHERE AccountNumber = N'1001000000001';

-- SEEK: literal type matches the column type CHAR(13)
SELECT * FROM dbo.Accounts WHERE AccountNumber = '1001000000001';`,
        notes: [
          {
            type: "key",
            en: "Compare a column to a literal or parameter of the column's OWN type. Look for CONVERT_IMPLICIT warnings in the plan.",
            bn: "কলামকে সবসময় তার নিজের টাইপের literal বা parameter-এর সাথে তুলনা করুন। Plan-এ CONVERT_IMPLICIT সতর্কবার্তা খুঁজুন।",
          },
        ],
      },
    ],
    summary: [
      {
        en: "Type choice is an I/O decision; declared width drives memory grants.",
        bn: "টাইপ মানে I/O সিদ্ধান্ত; declared width memory grant ঠিক করে।",
      },
      {
        en: "Use IS NULL / IS NOT NULL, never = NULL.",
        bn: "IS NULL ব্যবহার করুন, কখনো = NULL নয়।",
      },
      {
        en: "COUNT(*) counts rows; COUNT(col) counts values.",
        bn: "COUNT(*) রো গোনে; COUNT(col) মান গোনে।",
      },
      {
        en: "Type mismatches cause implicit conversion and kill seeks.",
        bn: "টাইপ না মিললে implicit conversion হয় এবং seek নষ্ট হয়।",
      },
    ],
  },

  {
    id: 4,
    slug: "single-table-queries",
    part: 1,
    level: "Beginner",
    title: "Querying a Single Table",
    titleBn: "একটি টেবিল থেকে Query করা",
    analogy: {
      en: "SELECT picks the columns (which fields of the form), WHERE picks the rows (which forms), ORDER BY stacks them, TOP / OFFSET-FETCH takes a page.",
      bn: "SELECT কলাম বাছে (ফর্মের কোন ঘর), WHERE রো বাছে (কোন ফর্ম), ORDER BY সাজায়, TOP / OFFSET-FETCH এক পাতা নেয়।",
    },
    sections: [
      {
        title: "SELECT and projection",
        titleBn: "SELECT এবং প্রজেকশন",
        en: "Projection = choosing columns and computing new ones. Give computed columns a name with AS.",
        bn: "Projection মানে কোন কলাম দেখাবেন আর নতুন কলাম হিসাব করা। হিসাব করা কলামের নাম AS দিয়ে দিন।",
        code: `SELECT a.AccountNumber,
       a.AccountType,
       a.Balance,
       a.Balance * 0.045 / 12            AS MonthlyInterest,   -- computed
       DATEDIFF(DAY, a.OpenedOn, GETDATE()) AS AgeInDays
FROM   dbo.Accounts AS a;`,
        notes: [
          {
            type: "trap",
            en: "SELECT * in application code is a defect: it sends unneeded columns, prevents covering indexes, breaks DTO mapping when a column is added, and duplicates names in joins. Fine interactively; never ship it.",
            bn: "অ্যাপ কোডে SELECT * একটি ত্রুটি: অপ্রয়োজনীয় কলাম পাঠায়, covering index কাজ করতে দেয় না, নতুন কলাম যোগ হলে DTO ম্যাপিং ভাঙে। টেস্টে চলে, production-এ নয়।",
          },
        ],
      },
      {
        title: "Filtering with WHERE",
        titleBn: "WHERE দিয়ে ফিল্টার",
        en: "Combine predicates with AND/OR. IN checks a list. BETWEEN is inclusive on both ends — fine for money, dangerous for timestamps. For date ranges always use a half-open interval: >= start AND < next_start.",
        bn: "AND/OR দিয়ে শর্ত মেলান। IN দিয়ে তালিকা চেক করুন। BETWEEN দুই প্রান্তই অন্তর্ভুক্ত করে — টাকার জন্য ঠিক আছে, কিন্তু সময়ের জন্য বিপজ্জনক। তারিখের রেঞ্জে সবসময় half-open interval: >= শুরু AND < পরের শুরু।",
        code: `SELECT AccountNumber, Balance
FROM   dbo.Accounts
WHERE  Status = 'ACTIVE'
  AND  AccountType IN ('SAVINGS', 'CURRENT')
  AND  Balance BETWEEN 10000 AND 500000
  AND  OpenedOn >= '2020-01-01'
  AND  ClosedOn IS NULL;

-- WRONG: '2026-01-31' means 2026-01-31 00:00:00.000, so most of Jan 31 is missed
SELECT * FROM dbo.Transactions
WHERE  TxnDate BETWEEN '2026-01-01' AND '2026-01-31';

-- RIGHT: half-open interval [start, end)
SELECT * FROM dbo.Transactions
WHERE  TxnDate >= '2026-01-01'
  AND  TxnDate <  '2026-02-01';`,
        notes: [
          {
            type: "key",
            en: "Date ranges: always >= start AND < end_exclusive. Correct for any time precision and index-friendly.",
            bn: "তারিখের রেঞ্জ: সবসময় >= শুরু AND < শেষ (বাদে)। যেকোনো সময়-নির্ভুলতায় সঠিক এবং index-বান্ধব।",
          },
        ],
      },
      {
        title: "Pattern matching with LIKE",
        titleBn: "LIKE দিয়ে প্যাটার্ন মেলানো",
        en: "% = any characters, _ = one character, [12] = a character class (T-SQL). 'Rah%' can seek an index because the start is known. '%uddin' must scan the whole index. Use ESCAPE to search for a literal %.",
        bn: "% = যেকোনো অক্ষর, _ = একটি অক্ষর, [12] = অক্ষরের সেট। 'Rah%' index seek করতে পারে কারণ শুরুটা জানা। '%uddin' পুরো index scan করবে। আসল % খুঁজতে ESCAPE ব্যবহার করুন।",
        code: `SELECT * FROM dbo.Customers WHERE FullName LIKE 'Rah%';       -- seekable
SELECT * FROM dbo.Customers WHERE FullName LIKE '%uddin';      -- scan
SELECT * FROM dbo.Accounts  WHERE AccountNumber LIKE '100[12]%'; -- character class
SELECT * FROM dbo.Transactions WHERE Reference LIKE '%50!%%' ESCAPE '!'; -- literal %`,
        notes: [
          {
            type: "tip",
            en: "For real 'contains' search on large text, use SQL Server Full-Text Search (CONTAINS), not LIKE '%x%'.",
            bn: "বড় টেক্সটে আসল 'contains' সার্চের জন্য LIKE '%x%' নয়, SQL Server Full-Text Search (CONTAINS) ব্যবহার করুন।",
          },
        ],
      },
      {
        title: "ORDER BY, TOP, and pagination",
        titleBn: "ORDER BY, TOP এবং পেজিনেশন",
        en: "OFFSET … FETCH pages results (SQL Server 2012+). Always add a unique tiebreaker (AccountId) or the same row can appear on two pages. OFFSET is O(n): page 5,000 still reads and throws away 99,980 rows. For deep paging use keyset pagination — pass the last row's key.",
        bn: "OFFSET … FETCH দিয়ে পেজিনেশন হয়। সবসময় একটি ইউনিক tiebreaker (AccountId) দিন, নইলে একই রো দুই পেজে আসতে পারে। OFFSET হলো O(n): ৫০০০তম পেজেও ৯৯,৯৮০ রো পড়ে ফেলে দেয়। গভীর পেজিংয়ে keyset pagination ব্যবহার করুন — শেষ রো-এর key পাঠান।",
        code: `-- Page 3, 20 rows per page
SELECT AccountNumber, Balance
FROM   dbo.Accounts
ORDER BY Balance DESC, AccountId ASC          -- tiebreaker = deterministic
OFFSET 40 ROWS FETCH NEXT 20 ROWS ONLY;

-- Keyset pagination: page 5,000 costs the same as page 1
DECLARE @LastBalance DECIMAL(19,4) = 85000, @LastAccountId BIGINT = 1;
SELECT TOP (20) AccountNumber, Balance, AccountId
FROM   dbo.Accounts
WHERE  (Balance < @LastBalance)
   OR  (Balance = @LastBalance AND AccountId > @LastAccountId)
ORDER BY Balance DESC, AccountId ASC;`,
        notes: [
          {
            type: "trap",
            en: "ORDER BY Balance DESC alone is not deterministic — ties can swap between calls. Append a unique column to every ORDER BY used for paging.",
            bn: "শুধু ORDER BY Balance DESC নির্ধারিত (deterministic) নয় — সমান মানের রো জায়গা বদলাতে পারে। পেজিংয়ের ORDER BY-তে সবসময় একটি ইউনিক কলাম যোগ করুন।",
          },
        ],
      },
      {
        title: "CASE: conditional logic inside SQL",
        titleBn: "CASE: SQL-এর ভেতরে if-else",
        en: "CASE is an expression, so it works anywhere a value works — SELECT, WHERE, ORDER BY, even inside SUM(). It is the base of conditional aggregation (Module 6) and pivoting (Module 19). IIF(cond, a, b) is a short two-way CASE.",
        bn: "CASE হলো একটি expression, তাই যেখানে মান বসে সেখানেই চলে — SELECT, WHERE, ORDER BY, এমনকি SUM()-এর ভেতরেও। এটাই conditional aggregation (মডিউল ৬) ও pivot (মডিউল ১৯)-এর ভিত্তি। IIF(cond, a, b) হলো ছোট দুই-পথের CASE।",
        code: `SELECT a.AccountNumber,
       a.Balance,
       CASE
           WHEN a.Balance >= 1000000 THEN 'PLATINUM'
           WHEN a.Balance >=  500000 THEN 'GOLD'
           WHEN a.Balance >=  100000 THEN 'SILVER'
           ELSE 'STANDARD'
       END AS Tier,
       IIF(a.AccountType = 'FD', 'Locked', 'Flexible') AS Access
FROM   dbo.Accounts AS a
WHERE  a.Status = 'ACTIVE';`,
      },
    ],
    summary: [
      {
        en: "Name your columns; never ship SELECT *.",
        bn: "কলামের নাম লিখুন; SELECT * production-এ নয়।",
      },
      { en: "Dates: >= start AND < end.", bn: "তারিখ: >= শুরু AND < শেষ।" },
      {
        en: "Paging needs a unique tiebreaker; deep paging needs keyset.",
        bn: "পেজিংয়ে ইউনিক tiebreaker লাগে; গভীর পেজিংয়ে keyset।",
      },
    ],
  },

  {
    id: 5,
    slug: "joins",
    part: 1,
    level: "Beginner",
    title: "Joins",
    titleBn: "জয়েন (JOIN)",
    analogy: {
      en: "A JOIN is matching two lists by a common ID — like matching students to their exam results by roll number.",
      bn: "JOIN মানে একটি কমন ID দিয়ে দুটি তালিকা মেলানো — যেমন রোল নম্বর দিয়ে ছাত্রদের সাথে পরীক্ষার ফলাফল মেলানো।",
    },
    sections: [
      {
        title: "INNER JOIN",
        titleBn: "INNER JOIN — শুধু মিলে যাওয়া রো",
        en: "Returns only rows where the ON condition is TRUE. Customers with no account disappear.",
        bn: "শুধু সেই রো দেয় যেখানে ON শর্ত TRUE। যাদের কোনো অ্যাকাউন্ট নেই সেই কাস্টমার বাদ পড়ে।",
        code: `SELECT c.FullName, a.AccountNumber, a.Balance
FROM   dbo.Customers AS c
INNER JOIN dbo.Accounts AS a ON a.CustomerId = c.CustomerId
WHERE  a.Status = 'ACTIVE';`,
        notes: [
          {
            type: "trap",
            en: "Never use old comma joins (FROM Customers c, Accounts a WHERE ...). Forget the WHERE and you get a silent cross join: 250,000 × 400,000 = 100 billion rows.",
            bn: "পুরনো কমা-জয়েন (FROM Customers c, Accounts a WHERE ...) কখনো নয়। WHERE ভুলে গেলে চুপচাপ cross join: ২.৫ লাখ × ৪ লাখ = ১০,০০০ কোটি রো।",
          },
        ],
      },
      {
        title: "LEFT JOIN and the WHERE trap",
        titleBn: "LEFT JOIN এবং WHERE-এর ফাঁদ",
        en: "LEFT JOIN keeps every row of the left table; missing right-side values become NULL. The trap: a WHERE filter on the right table removes those NULL rows and turns your LEFT JOIN into an INNER JOIN. Put right-table filters in the ON clause.",
        bn: "LEFT JOIN বাম টেবিলের সব রো রাখে; ডান দিকে মিল না পেলে NULL বসে। ফাঁদ: ডান টেবিলের উপর WHERE ফিল্টার দিলে NULL রো-গুলো মুছে যায় — LEFT JOIN হয়ে যায় INNER JOIN। ডান টেবিলের ফিল্টার ON-এ দিন।",
        code: `-- Every customer, with accounts if they have any
SELECT c.FullName, a.AccountNumber, a.Balance
FROM   dbo.Customers AS c
LEFT   JOIN dbo.Accounts AS a ON a.CustomerId = c.CustomerId;

-- BUG: became an INNER JOIN (NULL = 'ACTIVE' is UNKNOWN)
SELECT c.FullName, a.AccountNumber
FROM   dbo.Customers AS c
LEFT   JOIN dbo.Accounts AS a ON a.CustomerId = c.CustomerId
WHERE  a.Status = 'ACTIVE';

-- CORRECT: filter in ON, so it is part of the match rule
SELECT c.FullName, a.AccountNumber
FROM   dbo.Customers AS c
LEFT   JOIN dbo.Accounts AS a
       ON  a.CustomerId = c.CustomerId
       AND a.Status = 'ACTIVE';`,
        notes: [
          {
            type: "key",
            en: "Outer join: ON decides what counts as a match; WHERE decides which result rows survive.",
            bn: "Outer join-এ: ON ঠিক করে কোনটা মিল; WHERE ঠিক করে কোন রো টিকে থাকবে।",
          },
        ],
      },
      {
        title: "Anti-joins: finding what is missing",
        titleBn: "Anti-join: যা নেই তা খোঁজা",
        en: "'Customers with no account' is an anti-join. Two idioms: LEFT JOIN … WHERE right.Key IS NULL, or NOT EXISTS. NOT EXISTS states the intent more clearly and usually gets the same or better plan.",
        bn: "'যাদের কোনো অ্যাকাউন্ট নেই' — এটা anti-join। দুটি উপায়: LEFT JOIN … WHERE ডানের Key IS NULL, অথবা NOT EXISTS। NOT EXISTS উদ্দেশ্য পরিষ্কার বলে এবং সাধারণত একই বা ভালো plan পায়।",
        code: `-- LEFT JOIN / IS NULL idiom
SELECT c.CustomerId, c.FullName
FROM   dbo.Customers AS c
LEFT   JOIN dbo.Accounts AS a ON a.CustomerId = c.CustomerId
WHERE  a.AccountId IS NULL;          -- test a NOT NULL column of the right table

-- NOT EXISTS: clearer intent
SELECT c.CustomerId, c.FullName
FROM   dbo.Customers AS c
WHERE  NOT EXISTS (SELECT 1 FROM dbo.Accounts AS a
                   WHERE a.CustomerId = c.CustomerId);`,
      },
      {
        title: "Self joins",
        titleBn: "Self Join — নিজের সাথে জয়েন",
        en: "Join a table to itself with two aliases. Employees → their manager (also an employee). A self join reaches exactly ONE level; for the full chain use a recursive CTE (Module 9).",
        bn: "একই টেবিলকে দুটি alias দিয়ে নিজের সাথে join করা। কর্মী → তার ম্যানেজার (যিনিও কর্মী)। Self join শুধু এক লেভেল যায়; পুরো চেইনের জন্য recursive CTE (মডিউল ৯)।",
        code: `SELECT e.FullName AS Employee,
       e.Designation,
       COALESCE(m.FullName, N'-- top of tree --') AS Manager
FROM   dbo.Employees AS e
LEFT   JOIN dbo.Employees AS m ON m.EmployeeId = e.ManagerId;`,
      },
      {
        title: "CROSS JOIN and CROSS APPLY",
        titleBn: "CROSS JOIN এবং CROSS APPLY",
        en: "CROSS JOIN = every combination (useful for 'every branch × every month' report grids). CROSS APPLY runs the right side once per left row and can reference it — perfect for 'top N per group'. OUTER APPLY keeps left rows even when the right side returns nothing (the LEFT JOIN of applies).",
        bn: "CROSS JOIN = সব সম্ভাব্য জোড়া (যেমন 'প্রতিটি শাখা × প্রতিটি মাস' রিপোর্ট গ্রিড)। CROSS APPLY বাম দিকের প্রতিটি রো-এর জন্য ডান দিক চালায় এবং বাম রো-কে রেফার করতে পারে — 'প্রতি গ্রুপে Top N'-এর জন্য দারুণ। OUTER APPLY ডান দিক খালি হলেও বাম রো রাখে।",
        code: `-- Every branch x every account type (report skeleton)
SELECT b.BranchName, t.AccountType
FROM   dbo.Branches AS b
CROSS JOIN (VALUES ('SAVINGS'), ('CURRENT'), ('FD')) AS t(AccountType);

-- The 3 most recent transactions for each ACTIVE account
SELECT a.AccountNumber, t.TxnDate, t.Amount, t.TxnType
FROM   dbo.Accounts AS a
CROSS APPLY (
        SELECT TOP (3) t2.TxnDate, t2.Amount, t2.TxnType
        FROM   dbo.Transactions AS t2
        WHERE  t2.AccountId = a.AccountId          -- correlation
        ORDER BY t2.TxnDate DESC
) AS t
WHERE  a.Status = 'ACTIVE';`,
        notes: [
          {
            type: "tip",
            en: "With an index on Transactions(AccountId, TxnDate DESC), APPLY does one tiny seek per account and stops after 3 rows — it never touches the other 60 million.",
            bn: "Transactions(AccountId, TxnDate DESC)-এ index থাকলে APPLY প্রতিটি অ্যাকাউন্টে ছোট একটি seek করে ৩টি রো পেলেই থামে — বাকি ৬ কোটি রো ছোঁয়ও না।",
          },
        ],
      },
      {
        title: "Join fan-out: the duplicate-money bug",
        titleBn: "Join Fan-out: টাকা দ্বিগুণ হওয়ার বাগ",
        en: "Customer 1 has 2 accounts and 3 loans. Joining both children gives 2 × 3 = 6 rows, so SUM(Balance) is 3x too large and SUM(Principal) 2x too large. Fix: aggregate each child separately, then join.",
        bn: "কাস্টমার ১-এর ২টি অ্যাকাউন্ট ও ৩টি লোন। দুটো child একসাথে join করলে ২ × ৩ = ৬ রো, ফলে SUM(Balance) ৩ গুণ আর SUM(Principal) ২ গুণ বেশি। সমাধান: প্রতিটি child আলাদাভাবে aggregate করে তারপর join।",
        code: `-- WRONG: totals are multiplied
SELECT c.FullName, SUM(a.Balance) AS TotalBalance, SUM(l.Principal) AS TotalLoans
FROM   dbo.Customers AS c
JOIN   dbo.Accounts  AS a ON a.CustomerId = c.CustomerId
JOIN   dbo.Loans     AS l ON l.CustomerId = c.CustomerId
GROUP BY c.FullName;

-- RIGHT: aggregate first, then join
SELECT c.FullName, acc.TotalBalance, lo.TotalLoans
FROM   dbo.Customers AS c
OUTER APPLY (SELECT SUM(a.Balance) AS TotalBalance
             FROM dbo.Accounts AS a WHERE a.CustomerId = c.CustomerId) AS acc
OUTER APPLY (SELECT SUM(l.Principal) AS TotalLoans
             FROM dbo.Loans AS l WHERE l.CustomerId = c.CustomerId) AS lo;`,
        notes: [
          {
            type: "interview",
            q: "A report shows revenue exactly double the real figure. Where do you look first?",
            en: "Join fan-out: some one-to-many join was assumed one-to-one and duplicated rows before SUM. Remove the aggregate and count rows per key to prove it.",
            bn: "Join fan-out: কোনো one-to-many join-কে one-to-one ভাবা হয়েছে, ফলে SUM-এর আগে রো ডুপ্লিকেট হয়েছে। Aggregate সরিয়ে প্রতি key-তে রো গুনে প্রমাণ করুন।",
          },
        ],
      },
      {
        title: "Physical join algorithms",
        titleBn: "ফিজিক্যাল জয়েন অ্যালগরিদম",
        en: "You don't choose, but you must recognise them in plans. Nested Loops: for each outer row, seek the inner — best when outer is small and inner has an index. Merge Join: walk two inputs already sorted on the key. Hash Match: build a hash table on one input, probe with the other — large unsorted inputs, no useful index.",
        bn: "আপনি বাছেন না, কিন্তু plan-এ চিনতে হবে। Nested Loops: বাইরের প্রতিটি রো-এর জন্য ভেতরে seek — বাইরেরটা ছোট আর ভেতরে index থাকলে সেরা। Merge Join: key অনুযায়ী আগে থেকেই সাজানো দুটি ইনপুট একসাথে হাঁটে। Hash Match: একটির hash table বানিয়ে অন্যটি দিয়ে খোঁজে — বড়, অসাজানো ইনপুট।",
        code: `-- Compare the plans (Ctrl+M in SSMS for the actual plan)
SELECT c.FullName, a.Balance
FROM   dbo.Customers AS c
INNER LOOP JOIN dbo.Accounts AS a ON a.CustomerId = c.CustomerId;   -- hint: for learning only

SELECT c.FullName, a.Balance
FROM   dbo.Customers AS c
INNER HASH JOIN dbo.Accounts AS a ON a.CustomerId = c.CustomerId;   -- hint: for learning only`,
        notes: [
          {
            type: "tip",
            en: "Join hints are for learning and emergencies only. A Hash Match where you expected a seek usually means a missing index or type mismatch; Nested Loops over millions of rows means a bad row estimate.",
            bn: "Join hint শুধু শেখার জন্য বা জরুরি অবস্থায়। Seek আশা করছিলেন কিন্তু Hash Match — মানে index নেই বা টাইপ মেলেনি; লাখো রো-তে Nested Loops মানে row estimate ভুল।",
          },
        ],
      },
    ],
    summary: [
      {
        en: "LEFT JOIN: right-table filters go in ON.",
        bn: "LEFT JOIN: ডান টেবিলের ফিল্টার ON-এ।",
      },
      { en: "NOT EXISTS for 'missing' rows.", bn: "'যা নেই' খুঁজতে NOT EXISTS।" },
      {
        en: "APPLY for top-N per group; aggregate before joining siblings.",
        bn: "প্রতি গ্রুপে top-N-এর জন্য APPLY; sibling join-এর আগে aggregate।",
      },
    ],
  },

  {
    id: 6,
    slug: "aggregation-grouping",
    part: 1,
    level: "Beginner",
    title: "Aggregation and Grouping",
    titleBn: "Aggregation এবং Grouping",
    analogy: {
      en: "GROUP BY is sorting receipts into piles (one pile per branch) and writing a total on each pile. After grouping, single receipts are gone — only piles remain.",
      bn: "GROUP BY মানে রসিদগুলো স্তূপে ভাগ করা (প্রতি শাখায় একটি স্তূপ) আর প্রতিটির উপর মোট লেখা। গ্রুপ হওয়ার পর একক রসিদ আর থাকে না — শুধু স্তূপ।",
    },
    sections: [
      {
        title: "The aggregate functions",
        titleBn: "Aggregate ফাংশনগুলো",
        en: "COUNT, SUM, AVG, MIN, MAX and COUNT(DISTINCT col) turn many rows into one value.",
        bn: "COUNT, SUM, AVG, MIN, MAX এবং COUNT(DISTINCT col) অনেক রো থেকে একটি মান বানায়।",
        code: `SELECT COUNT(*)                  AS TxnCount,
       SUM(Amount)               AS TotalAmount,
       AVG(Amount)               AS AvgAmount,
       MIN(TxnDate)              AS FirstTxn,
       MAX(TxnDate)              AS LastTxn,
       COUNT(DISTINCT AccountId) AS DistinctAccounts
FROM   dbo.Transactions
WHERE  TxnDate >= '2026-01-01' AND TxnDate < '2026-02-01';`,
      },
      {
        title: "GROUP BY and the every-column rule",
        titleBn: "GROUP BY এবং প্রতিটি-কলাম নিয়ম",
        en: "Every non-aggregated column in SELECT must appear in GROUP BY. After grouping (step 3), individual rows no longer exist — asking for a.OpenedOn means 'which of the 4,000 dates in this group?'",
        bn: "SELECT-এ যে কলাম aggregate নয়, সেটা অবশ্যই GROUP BY-তে থাকতে হবে। গ্রুপ হওয়ার পর (ধাপ ৩) একক রো আর নেই — a.OpenedOn চাওয়া মানে 'এই গ্রুপের ৪০০০ তারিখের কোনটা?'",
        code: `SELECT b.BranchName,
       a.AccountType,
       COUNT(*)       AS AccountCount,
       SUM(a.Balance) AS TotalBalance
FROM   dbo.Accounts AS a
JOIN   dbo.Branches AS b ON b.BranchId = a.BranchId
WHERE  a.Status = 'ACTIVE'
GROUP BY b.BranchName, a.AccountType
ORDER BY b.BranchName, a.AccountType;`,
      },
      {
        title: "WHERE vs HAVING",
        titleBn: "WHERE বনাম HAVING",
        en: "WHERE removes ROWS before grouping (cheap). HAVING removes GROUPS after grouping (after the expensive work). Any condition without an aggregate belongs in WHERE.",
        bn: "WHERE গ্রুপের আগে রো বাদ দেয় (সস্তা)। HAVING গ্রুপের পরে গ্রুপ বাদ দেয় (ভারী কাজের পরে)। Aggregate ছাড়া যেকোনো শর্ত WHERE-এ রাখুন।",
        code: `SELECT a.CustomerId, COUNT(*) AS ActiveAccounts, SUM(a.Balance) AS Total
FROM   dbo.Accounts AS a
WHERE  a.Status = 'ACTIVE'            -- step 2: rows
GROUP BY a.CustomerId
HAVING COUNT(*) >= 2                  -- step 4: groups
   AND SUM(a.Balance) > 300000;`,
        notes: [
          {
            type: "key",
            en: "Filter as early as you can: WHERE first, HAVING only for aggregates.",
            bn: "যত আগে সম্ভব ফিল্টার করুন: আগে WHERE, শুধু aggregate-এর জন্য HAVING।",
          },
        ],
      },
      {
        title: "Conditional aggregation",
        titleBn: "শর্তসাপেক্ষ Aggregation",
        en: "CASE inside an aggregate computes many answers in ONE scan. Six separate queries would read the 60M-row table six times; this reads it once. COUNT(CASE WHEN … THEN 1 END) counts matches because COUNT ignores the NULL from the missing ELSE. AVG(CASE WHEN … THEN x END) averages only matching rows.",
        bn: "Aggregate-এর ভেতরে CASE দিয়ে এক scan-এ অনেক উত্তর। ছয়টি আলাদা query ৬ কোটি রো ছয়বার পড়ত; এটা একবার পড়ে। COUNT(CASE WHEN … THEN 1 END) মিল গোনে, কারণ ELSE না থাকায় NULL হয় আর COUNT তা উপেক্ষা করে।",
        code: `SELECT a.BranchId,
       COUNT(*) AS TotalTxns,
       SUM(CASE WHEN t.TxnType = 'CREDIT' THEN t.Amount ELSE 0 END) AS Credits,
       SUM(CASE WHEN t.TxnType = 'DEBIT'  THEN t.Amount ELSE 0 END) AS Debits,
       SUM(CASE WHEN t.Channel = 'ATM'    THEN 1 ELSE 0 END)        AS AtmCount,
       COUNT(CASE WHEN t.Channel = 'ONLINE' THEN 1 END)             AS OnlineCount,
       AVG(CASE WHEN t.TxnType = 'DEBIT'  THEN t.Amount END)        AS AvgDebit
FROM   dbo.Transactions AS t
JOIN   dbo.Accounts     AS a ON a.AccountId = t.AccountId
WHERE  t.TxnDate >= '2026-01-01'
GROUP BY a.BranchId;`,
      },
      {
        title: "GROUPING SETS, ROLLUP, CUBE",
        titleBn: "GROUPING SETS, ROLLUP, CUBE — এক পাসে সাবটোটাল",
        en: "Subtotals and grand totals in one pass, without UNION ALL. ROLLUP(a, b) = (a,b), (a), (). GROUPING SETS lets you name exact combinations. CUBE = every combination. GROUPING(col) returns 1 on a subtotal row — the only way to tell a subtotal NULL from a real NULL.",
        bn: "UNION ALL ছাড়াই এক পাসে সাবটোটাল ও গ্র্যান্ড টোটাল। ROLLUP(a, b) = (a,b), (a), ()। GROUPING SETS দিয়ে নির্দিষ্ট combination বলা যায়। CUBE = সব combination। সাবটোটাল রো-তে GROUPING(col) = 1 — সাবটোটালের NULL আর আসল NULL আলাদা করার একমাত্র উপায়।",
        code: `-- (branch, type), (branch), grand total
SELECT b.BranchName,
       a.AccountType,
       SUM(a.Balance)          AS TotalBalance,
       GROUPING(a.AccountType) AS IsTypeSubtotal
FROM   dbo.Accounts AS a
JOIN   dbo.Branches AS b ON b.BranchId = a.BranchId
GROUP BY ROLLUP (b.BranchName, a.AccountType);

-- Exactly the combinations you name
SELECT b.City, a.AccountType, SUM(a.Balance) AS Total
FROM   dbo.Accounts AS a
JOIN   dbo.Branches AS b ON b.BranchId = a.BranchId
GROUP BY GROUPING SETS ((b.City, a.AccountType), (b.City), ());

-- Every combination
SELECT b.City, a.AccountType, SUM(a.Balance) AS Total
FROM   dbo.Accounts AS a
JOIN   dbo.Branches AS b ON b.BranchId = a.BranchId
GROUP BY CUBE (b.City, a.AccountType);`,
        notes: [
          {
            type: "interview",
            q: "Each branch's total plus a grand total, in one result set?",
            en: "GROUP BY ROLLUP(BranchName). Two queries with UNION ALL works but scans twice.",
            bn: "GROUP BY ROLLUP(BranchName)। UNION ALL দিয়ে দুটি query-ও চলে, কিন্তু দুবার scan করে।",
          },
        ],
      },
    ],
    summary: [
      {
        en: "Non-aggregated SELECT columns must be in GROUP BY.",
        bn: "Aggregate নয় এমন SELECT কলাম GROUP BY-তে থাকবে।",
      },
      {
        en: "WHERE filters rows; HAVING filters groups.",
        bn: "WHERE রো ফিল্টার করে; HAVING গ্রুপ।",
      },
      {
        en: "Conditional aggregation = many answers, one scan.",
        bn: "Conditional aggregation = এক scan-এ অনেক উত্তর।",
      },
    ],
  },

  {
    id: 7,
    slug: "set-operators",
    part: 1,
    level: "Beginner",
    title: "Set Operators",
    titleBn: "সেট অপারেটর",
    analogy: {
      en: "Two guest lists: UNION ALL staples them together, UNION staples and removes repeated names, INTERSECT keeps names on both, EXCEPT keeps names only on the first.",
      bn: "দুটি অতিথি তালিকা: UNION ALL দুটো জোড়া দেয়, UNION জোড়া দিয়ে একই নাম বাদ দেয়, INTERSECT দুই তালিকাতেই থাকা নাম রাখে, EXCEPT শুধু প্রথম তালিকার নাম রাখে।",
    },
    sections: [
      {
        title: "The four operators",
        titleBn: "চারটি অপারেটর",
        en: "UNION ALL: everything, duplicates kept — cheap concatenation. UNION: duplicates removed — needs a sort or hash. INTERSECT: rows in both (distinct). EXCEPT: rows in the first but not the second (distinct).",
        bn: "UNION ALL: সব, ডুপ্লিকেট সহ — সস্তা। UNION: ডুপ্লিকেট বাদ — sort বা hash লাগে। INTERSECT: দুটিতেই আছে এমন রো। EXCEPT: প্রথমটিতে আছে কিন্তু দ্বিতীয়টিতে নেই।",
        code: `-- All people connected to the bank
SELECT FullName, 'CUSTOMER' AS PartyType FROM dbo.Customers
UNION ALL
SELECT FullName, 'EMPLOYEE'             FROM dbo.Employees;

-- Customers who hold BOTH an account and a loan
SELECT CustomerId FROM dbo.Accounts
INTERSECT
SELECT CustomerId FROM dbo.Loans;

-- Customers with an account but no loan
SELECT CustomerId FROM dbo.Accounts
EXCEPT
SELECT CustomerId FROM dbo.Loans;`,
        notes: [
          {
            type: "trap",
            en: "UNION deduplicates. If the inputs are already distinct (usually true), UNION makes SQL Server sort millions of rows for nothing. Default to UNION ALL.",
            bn: "UNION ডুপ্লিকেট সরায়। ইনপুট যদি আগেই আলাদা হয় (সাধারণত তাই), তবে UNION অকারণে লাখো রো sort করায়। ডিফল্ট হিসেবে UNION ALL ব্যবহার করুন।",
          },
        ],
      },
      {
        title: "Rules and NULL behaviour",
        titleBn: "নিয়ম এবং NULL-এর আচরণ",
        en: "Same number of columns with compatible types. Column names come from the first query. Only one ORDER BY, at the very end. Set operators treat NULLs as EQUAL for dedup (unlike =), which makes EXCEPT perfect for comparing two result sets.",
        bn: "কলামের সংখ্যা সমান ও টাইপ সামঞ্জস্যপূর্ণ হতে হবে। কলামের নাম আসে প্রথম query থেকে। ORDER BY শুধু একবার, একদম শেষে। সেট অপারেটর NULL-কে সমান ধরে (= এর মতো নয়), তাই দুটি রেজাল্ট তুলনায় EXCEPT দারুণ।",
        code: `-- Did my rewrite return exactly the same rows? (NULLs included)
WITH OldQuery AS (
    SELECT CustomerId, City FROM dbo.Customers WHERE KycStatus = 'VERIFIED'
), NewQuery AS (
    SELECT CustomerId, City FROM dbo.Customers WHERE KycStatus IN ('VERIFIED')
)
SELECT 'only in old' AS Side, * FROM (SELECT * FROM OldQuery EXCEPT SELECT * FROM NewQuery) AS x
UNION ALL
SELECT 'only in new', *          FROM (SELECT * FROM NewQuery EXCEPT SELECT * FROM OldQuery) AS y
ORDER BY Side;   -- zero rows = identical`,
        notes: [
          {
            type: "tip",
            en: "(A EXCEPT B) UNION ALL (B EXCEPT A) returning zero rows proves two queries are identical. Use it after every optimization rewrite.",
            bn: "(A EXCEPT B) UNION ALL (B EXCEPT A) শূন্য রো দিলে প্রমাণ হয় দুটি query একই। প্রতিটি optimization rewrite-এর পরে এটা চালান।",
          },
        ],
      },
    ],
    summary: [
      { en: "Default to UNION ALL.", bn: "ডিফল্ট UNION ALL।" },
      {
        en: "EXCEPT both ways = result diff tool.",
        bn: "দুই দিকে EXCEPT = রেজাল্ট তুলনার টুল।",
      },
    ],
  },
];
