// Module 0 — Start Here: for someone who has never touched a database.
// SQL Server (T-SQL) only.

export const startModule = {
  id: 0,
  slug: "start-here",
  part: 0,
  level: "Beginner",
  title: "Start Here: Your First Day with SQL Server",
  titleBn: "এখান থেকে শুরু: SQL Server-এর সাথে প্রথম দিন",
  analogy: {
    en: "A database is a super-organised notebook that many apps can read and write at the same time, without ever losing a page. SQL is the language you use to talk to it.",
    bn: "ডেটাবেস হলো একটি সুপার-গোছানো খাতা, যেখানে অনেক অ্যাপ একসাথে পড়তে ও লিখতে পারে, অথচ একটি পাতাও হারায় না। SQL হলো সেই খাতার সাথে কথা বলার ভাষা।",
  },
  sections: [
    {
      title: "What is a database, a table, and SQL?",
      titleBn: "ডেটাবেস, টেবিল আর SQL আসলে কী?",
      en: "A database stores data safely for many users at once. Inside it, data lives in tables, which look like Excel sheets. Each row is one thing, like one customer. Each column is one fact about it, like the customer's name or city. SQL (Structured Query Language) is how you ask the database questions and change data. Microsoft SQL Server is the database engine we use, and its dialect of SQL is called T-SQL.",
      bn: "ডেটাবেস একসাথে অনেক ইউজারের ডেটা নিরাপদে রাখে। এর ভেতরে ডেটা থাকে টেবিলে, দেখতে Excel শিটের মতো। প্রতিটি রো (row) মানে একটি জিনিস, যেমন একজন কাস্টমার। প্রতিটি কলাম (column) মানে তার একটি তথ্য, যেমন নাম বা শহর। SQL দিয়ে আমরা ডেটাবেসকে প্রশ্ন করি আর ডেটা বদলাই। আমরা ব্যবহার করব Microsoft SQL Server, আর এর SQL-কে বলে T-SQL।",
      code: `-- A table is like a sheet. This is how you ask for some of its rows:
SELECT FullName, City       -- the columns you want to see
FROM   dbo.Customers        -- the table (sheet) to read
WHERE  City = N'Dhaka';     -- only the rows you care about`,
      notes: [
        {
          type: "key",
          en: "Three words to remember: table = sheet, row = one record, column = one field.",
          bn: "তিনটি শব্দ মনে রাখুন: table = শিট, row = একটি রেকর্ড, column = একটি ঘর।",
        },
      ],
    },
    {
      title: "Install SQL Server and SSMS (free)",
      titleBn: "SQL Server ও SSMS ইনস্টল করুন (ফ্রি)",
      en: "Step 1: download SQL Server 2022 Developer edition from Microsoft. It is free for learning. Choose the Basic install. Step 2: download SQL Server Management Studio (SSMS), the app where you type and run queries. Step 3: open SSMS and connect to the server name localhost with Windows Authentication. On a Mac or Linux machine you can run SQL Server in Docker and connect with SSMS from Windows or with VS Code and the mssql extension. Once you are connected, run the query below to check that everything works.",
      bn: "ধাপ ১: Microsoft থেকে SQL Server 2022 Developer edition নামান — শেখার জন্য এটা ফ্রি। Basic install বেছে নিন। ধাপ ২: SQL Server Management Studio (SSMS) নামান — এখানেই query লিখে চালাবেন। ধাপ ৩: SSMS খুলে Server name-এ localhost দিন, Windows Authentication দিয়ে Connect করুন। Mac বা Linux-এ Docker-এ SQL Server চালিয়ে VS Code-এর mssql extension দিয়ে যুক্ত হতে পারেন। যুক্ত হলে নিচের query চালিয়ে দেখুন সব ঠিক আছে কিনা।",
      code: `-- In SSMS: New Query, paste this, press F5 (Execute)
SELECT @@VERSION   AS SqlServerVersion,   -- which SQL Server you installed
       @@SERVERNAME AS ServerName,        -- the server you are connected to
       SYSUTCDATETIME() AS NowUtc;        -- the server clock`,
      notes: [
        {
          type: "tip",
          en: "Shortcuts in SSMS: F5 runs everything, or only the text you select. Ctrl+M turns on the actual execution plan (used in Modules 20–23).",
          bn: "SSMS শর্টকাট: F5 সব চালায় — কিছু select করলে শুধু সেটুকু চালায়। Ctrl+M দিলে actual execution plan দেখায় (মডিউল ২০–২৩-এ লাগবে)।",
        },
      ],
    },
    {
      title: "Create the BankDB practice database",
      titleBn: "অনুশীলনের BankDB ডেটাবেস তৈরি",
      en: "Every episode uses one small bank database called BankDB. It has six tables: Branches, Employees, Customers, Accounts, Transactions and Loans. On the course home page, click 'Download BankDB setup script', open the file in SSMS and press F5. The script deletes any old BankDB, creates a fresh one, and fills it with sample data in Bangladeshi Taka. If you break something while practising, just run it again.",
      bn: "প্রতিটি এপিসোডে একটি ছোট ব্যাংক ডেটাবেস ব্যবহার হবে — নাম BankDB। এতে ছয়টি টেবিল: Branches, Employees, Customers, Accounts, Transactions ও Loans। কোর্সের হোম পেজে 'Download BankDB setup script' চাপুন, ফাইলটি SSMS-এ খুলে F5 দিন। স্ক্রিপ্টটি পুরনো BankDB মুছে নতুন বানায় এবং বাংলাদেশি টাকায় স্যাম্পল ডেটা ভরে দেয়। অনুশীলনে কিছু নষ্ট হলে আবার চালান।",
      code: `USE BankDB;   -- switch to the practice database

-- How many rows are in each table?
SELECT 'Branches'     AS TableName, COUNT(*) AS TotalRows FROM dbo.Branches
UNION ALL SELECT 'Customers',    COUNT(*) FROM dbo.Customers
UNION ALL SELECT 'Accounts',     COUNT(*) FROM dbo.Accounts
UNION ALL SELECT 'Transactions', COUNT(*) FROM dbo.Transactions;`,
    },
    {
      title: "Your first real query",
      titleBn: "আপনার প্রথম আসল query",
      en: "Let's read the Accounts table. SELECT says which columns you want. FROM says which table to read. WHERE keeps only the rows you want. ORDER BY sorts the result. Type it yourself; don't copy and paste. Then change the numbers and run it again, and watch how the result changes. That habit is how you really learn SQL.",
      bn: "চলুন Accounts টেবিল পড়ি। SELECT বলে কোন কলাম চাই, FROM বলে কোন টেবিল, WHERE বলে কোন রো রাখব, আর ORDER BY সাজায়। কপি-পেস্ট নয়, নিজে টাইপ করুন। তারপর সংখ্যা বদলে আবার চালান, দেখুন ফলাফল কীভাবে বদলায়। এভাবেই আসল শেখা হয়।",
      code: `SELECT AccountNumber, AccountType, Balance   -- 1. which columns
FROM   dbo.Accounts                         -- 2. which table
WHERE  Balance > 10000                      -- 3. which rows
ORDER BY Balance DESC;                      -- 4. biggest balance first`,
    },
    {
      title: "How to learn with this course",
      titleBn: "এই কোর্স দিয়ে কীভাবে শিখবেন",
      en: "Watch one episode at a time. Use the speed and caption buttons, and switch the language at the top right. After each episode, run its code in SSMS. At the end of each module, take the short quiz. Follow the order: Beginner (Modules 0–7), then Intermediate (8–12), then Advanced (13–19), then Optimization (20–23), then Design and Interview (24–25). Don't skip the beginner modules — the later ones build on them.",
      bn: "একবারে একটি এপিসোড দেখুন। গতি ও ক্যাপশন বাটন ব্যবহার করুন, উপরে ডানে ভাষা বদলান। প্রতিটি এপিসোডের পর কোডটি SSMS-এ চালান। প্রতিটি মডিউলের শেষে ছোট কুইজ দিন। ক্রম মেনে চলুন: Beginner (০–৭) → Intermediate (৮–১২) → Advanced (১৩–১৯) → Optimization (২০–২৩) → Design ও Interview (২৪–২৫)। Beginner অংশ বাদ দেবেন না — পরের সবকিছু এর উপর দাঁড়িয়ে।",
      code: `-- Your learning loop for every episode:
-- 1. Watch the episode
-- 2. Type the code in SSMS and press F5
-- 3. Change one thing and run it again
SELECT 'I am ready to learn SQL Server' AS Goal;`,
    },
  ],
  summary: [
    {
      en: "Database = safe shared storage; table = sheet; row = record; column = field.",
      bn: "ডেটাবেস = নিরাপদ শেয়ার্ড স্টোরেজ; টেবিল = শিট; রো = রেকর্ড; কলাম = ঘর।",
    },
    {
      en: "Install SQL Server Developer + SSMS, then run the BankDB script.",
      bn: "SQL Server Developer + SSMS ইনস্টল করে BankDB স্ক্রিপ্ট চালান।",
    },
    {
      en: "SELECT → FROM → WHERE → ORDER BY is your first pattern.",
      bn: "SELECT → FROM → WHERE → ORDER BY — আপনার প্রথম প্যাটার্ন।",
    },
  ],
};
