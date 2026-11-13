// Deep chapters for the SQL Server (T-SQL) track in module 2 (lessons 21+).
// Every chapter: easy story, full theory, steps, mistakes, interview practice,
// a SQL Server example with its expected result, and a practice query that
// runs in the in-browser SQLite database (Employees / Departments sample).

const T = {
  story: "Simple story first · আগে একটি সহজ গল্প",
  theory: "Full theory in easy words · সহজ ভাষায় পুরো তত্ত্ব",
  steps: "Do it step by step · ধাপে ধাপে করুন",
  mistakes: "Common mistakes and fixes · সাধারণ ভুল ও সমাধান",
  interview: "Interview practice · ইন্টারভিউ অনুশীলন",
};

const setupEn =
  "Open SQL Server Management Studio (SSMS) or Azure Data Studio, connect to your local SQL Server (localhost), click New Query and run the script from top to bottom. Use a practice database, never a production one.";
const setupBn =
  "SSMS বা Azure Data Studio খুলুন, localhost SQL Server-এ connect করুন, New Query চাপুন, তারপর script উপর থেকে নিচে চালান। অনুশীলনের database ব্যবহার করুন, কখনো production নয়।";

function tsql(title, code, expectedOutput) {
  return {
    title,
    kind: "SQL Server (T-SQL) script · run in SSMS",
    language: "sql-reference",
    setupEn,
    setupBn,
    commands: "-- Practice database\nCREATE DATABASE PracticeDb;\nGO\nUSE PracticeDb;",
    code,
    expectedOutput,
  };
}
function lite(title, code) {
  return { title, kind: "Executable SQLite example · runs in your browser", language: "sql", code };
}

const chapters = {};
function chapter(name, x) {
  chapters[name] = {
    en: x.en,
    bn: x.bn,
    decisionEn: x.dEn,
    decisionBn: x.dBn,
    extraSections: [
      { id: "easy-story", toc: "Easy story", title: T.story, en: x.story[0], bn: x.story[1] },
      { id: "full-theory", toc: "Full theory", title: T.theory, en: x.theory[0], bn: x.theory[1] },
      {
        id: "step-by-step",
        toc: "Step by step",
        title: T.steps,
        en: x.steps.map((s, i) => `${i + 1}) ${s[0]}`).join(" "),
        bn: x.steps.map((s, i) => `${i + 1}) ${s[1]}`).join(" "),
      },
      { id: "mistakes", toc: "Mistakes", title: T.mistakes, en: x.mistakes[0], bn: x.mistakes[1] },
      { id: "interview", toc: "Interview", title: T.interview, en: x.interview[0], bn: x.interview[1] },
    ],
    examples: x.examples,
  };
}

chapter("SQL vs NoSQL & SQL Languages", {
  en: "A relational database (SQL Server, MySQL, PostgreSQL) keeps data in tables. Every table has a fixed set of columns with data types, every row follows the same shape, and tables are connected through keys. You talk to it with SQL, a declarative language: you describe what result you want and the database engine decides how to get it. A NoSQL database (MongoDB, Redis, Cassandra, Neo4j) relaxes the fixed shape: a document can have different fields from its neighbour, and data is often duplicated on purpose to make reads fast and to scale across many servers.",
  bn: "Relational database (SQL Server, MySQL, PostgreSQL) data রাখে table-এ। প্রতিটি table-এর column ও data type ঠিক করা থাকে, সব সারি একই আকারের, আর table-গুলো key দিয়ে যুক্ত। এর সাথে কথা বলি SQL দিয়ে — আমরা বলি কী ফল চাই, কীভাবে আনবে সেটা database engine ঠিক করে। NoSQL database (MongoDB, Redis) নির্দিষ্ট আকারের নিয়ম শিথিল করে: একটি document-এর field পাশেরটির থেকে আলাদা হতে পারে, আর দ্রুত পড়া ও অনেক server-এ ছড়াতে ইচ্ছা করেই data নকল রাখা হয়।",
  story: [
    "Think of a school office. The admission register has printed columns: Roll, Name, Father's name, Class. Every student fills the same boxes and the roll number links the register to the fee book. That is SQL. Now think of each student's personal folder: one has certificates, another has photos, a third has medical papers. Every folder looks different. That is NoSQL. The office needs both, but the fee calculation must come from the strict register.",
    "একটি স্কুলের অফিস ভাবুন। ভর্তির রেজিস্টারে ছাপানো ঘর আছে: রোল, নাম, বাবার নাম, শ্রেণি। প্রত্যেক ছাত্র একই ঘর পূরণ করে, আর রোল নম্বর দিয়ে রেজিস্টারকে বেতনের খাতার সাথে মেলানো যায়। এটাই SQL। এবার প্রত্যেক ছাত্রের ব্যক্তিগত ফোল্ডার ভাবুন: কারও ফোল্ডারে সার্টিফিকেট, কারও ছবি, কারও মেডিকেল কাগজ — সব আলাদা। এটাই NoSQL। অফিসে দুটোই লাগে, কিন্তু বেতনের হিসাব কঠোর রেজিস্টার থেকেই আসা উচিত।",
  ],
  theory: [
    "SQL commands are grouped by what they touch. DDL (Data Definition Language) changes structure: CREATE, ALTER, DROP, TRUNCATE and renaming with sp_rename. DML (Data Manipulation Language) changes the rows inside tables: INSERT, UPDATE, DELETE and MERGE. DQL (Data Query Language) only reads: SELECT. DCL (Data Control Language) manages who may do what: GRANT and REVOKE (and DENY in SQL Server). TCL (Transaction Control Language) decides whether changes become permanent: BEGIN TRANSACTION, COMMIT, ROLLBACK and SAVE TRANSACTION. Knowing the family tells you the risk: DDL and DML change things, DQL is safe to run, DCL affects security and TCL affects whether work is kept.",
    "SQL command-গুলো ভাগ করা হয় কী বদলায় তার উপর। DDL কাঠামো বদলায়: CREATE, ALTER, DROP, TRUNCATE, আর sp_rename দিয়ে নাম বদল। DML table-এর ভেতরের সারি বদলায়: INSERT, UPDATE, DELETE, MERGE। DQL শুধু পড়ে: SELECT। DCL ঠিক করে কে কী করতে পারবে: GRANT, REVOKE (SQL Server-এ DENY-ও)। TCL ঠিক করে পরিবর্তন স্থায়ী হবে কি না: BEGIN TRANSACTION, COMMIT, ROLLBACK, SAVE TRANSACTION। পরিবার জানলে ঝুঁকিও বোঝা যায়: DDL ও DML জিনিস বদলায়, DQL চালানো নিরাপদ, DCL নিরাপত্তা বদলায়, TCL কাজ রাখা হবে কি না ঠিক করে।",
  ],
  steps: [
    ["Write down what the data looks like: fixed columns and relations point to SQL.", "Data দেখতে কেমন লিখুন: নির্দিষ্ট column ও সম্পর্ক থাকলে SQL।"],
    ["Use DDL to create the database and tables.", "DDL দিয়ে database ও table বানান।"],
    ["Use DML to insert and change rows and DQL (SELECT) to read them.", "DML দিয়ে সারি যোগ ও বদল, DQL (SELECT) দিয়ে পড়ুন।"],
    ["Use DCL to give each user only the permission they need, and TCL to protect multi-step changes.", "DCL দিয়ে প্রত্যেককে শুধু দরকারি অনুমতি দিন, আর TCL দিয়ে বহু-ধাপের পরিবর্তন সুরক্ষিত রাখুন।"],
  ],
  mistakes: [
    "Mistake: thinking NoSQL is always faster or more modern. It is faster only for the access patterns it was designed for and usually gives up joins and strong consistency. Mistake: calling TRUNCATE a DML command; in SQL Server it is DDL, resets IDENTITY, needs ALTER permission and is blocked when a foreign key references the table. Mistake: giving the application login db_owner; grant only SELECT, INSERT, UPDATE, DELETE or EXECUTE on what it needs.",
    "ভুল: ভাবা যে NoSQL সবসময় দ্রুত বা আধুনিক। যে ধরনের পড়ার জন্য বানানো শুধু সেখানেই দ্রুত, আর সাধারণত join ও কঠোর consistency ছেড়ে দেয়। ভুল: TRUNCATE-কে DML বলা; SQL Server-এ এটি DDL, IDENTITY reset করে, ALTER অনুমতি লাগে, আর foreign key থাকলে চলে না। ভুল: app-এর login-কে db_owner দেওয়া; শুধু দরকারি SELECT, INSERT, UPDATE, DELETE বা EXECUTE দিন।",
  ],
  interview: [
    "Q: What is the difference between DELETE, TRUNCATE and DROP? A: DELETE (DML) removes rows that match WHERE, logs each row, fires triggers and can be rolled back. TRUNCATE (DDL) removes all rows quickly by deallocating pages, resets IDENTITY and does not fire DELETE triggers; inside a transaction it can still be rolled back in SQL Server. DROP (DDL) removes the whole table structure and its data.",
    "প্রশ্ন: DELETE, TRUNCATE আর DROP-এর পার্থক্য কী? উত্তর: DELETE (DML) WHERE-এ মেলা সারি মুছে, প্রতিটি সারি log করে, trigger চালায়, rollback করা যায়। TRUNCATE (DDL) page ছেড়ে দিয়ে দ্রুত সব সারি মুছে, IDENTITY reset করে, DELETE trigger চালায় না; SQL Server-এ transaction-এর ভেতরে থাকলে rollback করা যায়। DROP (DDL) পুরো table-এর কাঠামো ও data মুছে দেয়।",
  ],
  dEn: "Choose SQL when you need joins, transactions, constraints and reporting over structured data; choose NoSQL for flexible documents, caching, very high write volume or graph traversal. In .NET projects SQL Server with EF Core or Dapper is the common default, with Redis added for caching. Whatever you pick, separate DDL scripts (migrations) from DML code and run DDL through a reviewed deployment step.",
  dBn: "Join, transaction, constraint আর গোছানো data-র report লাগলে SQL; নমনীয় document, cache, বিপুল write বা graph লাগলে NoSQL। .NET project-এ সাধারণত SQL Server + EF Core বা Dapper, আর cache-এর জন্য Redis। যেটাই বাছুন, DDL script (migration) আর DML code আলাদা রাখুন, আর DDL review করা deployment ধাপে চালান।",
  examples: [
    tsql(
      "All five SQL language families in one script · পাঁচ পরিবার একসাথে",
      `-- DDL: structure
CREATE TABLE Student (Id INT PRIMARY KEY, Name VARCHAR(50));
ALTER TABLE Student ADD City VARCHAR(50);
-- DML: rows
INSERT INTO Student (Id, Name, City) VALUES (1, 'Rahim', 'Dhaka'), (2, 'Karim', 'Sylhet');
UPDATE Student SET City = 'Khulna' WHERE Id = 2;
-- DQL: read
SELECT Id, Name, City FROM Student;
-- TCL: undo a mistake
BEGIN TRANSACTION;
DELETE FROM Student;          -- oops, no WHERE
ROLLBACK;                     -- rows are back
SELECT COUNT(*) AS StillThere FROM Student;
-- DCL: permissions (needs a user named ReportUser)
-- GRANT SELECT ON Student TO ReportUser;
-- DDL: remove the practice table
DROP TABLE Student;`,
      "Id  Name   City\n1   Rahim  Dhaka\n2   Karim  Khulna\n\nStillThere\n2",
    ),
    lite(
      "Practice DDL, DML and DQL in the browser · browser-এ অনুশীলন",
      `DROP TABLE IF EXISTS Student;
CREATE TABLE Student (Id INTEGER PRIMARY KEY, Name TEXT, City TEXT);
INSERT INTO Student (Id, Name, City) VALUES (1, 'Rahim', 'Dhaka'), (2, 'Karim', 'Sylhet');
UPDATE Student SET City = 'Khulna' WHERE Id = 2;
SELECT Id, Name, City FROM Student;`,
    ),
  ],
});

chapter("Create, Alter & Drop Database", {
  en: "In SQL Server one instance (for example localhost) hosts many databases. System databases such as master, model, msdb and tempdb come built in; your own databases are user databases. CREATE DATABASE copies the model database as a starting template and creates a data file (.mdf) and a log file (.ldf). ALTER DATABASE changes the name, size, recovery model or compatibility level. DROP DATABASE removes the files from disk, so it is permanent unless you have a backup.",
  bn: "SQL Server-এর একটি instance (যেমন localhost)-এ অনেক database থাকে। master, model, msdb, tempdb হলো system database; আপনার বানানোগুলো user database। CREATE DATABASE model database-কে নমুনা হিসেবে কপি করে একটি data file (.mdf) আর একটি log file (.ldf) বানায়। ALTER DATABASE নাম, আকার, recovery model বদলায়। DROP DATABASE disk থেকে file মুছে দেয়, তাই backup না থাকলে চিরতরে হারায়।",
  story: [
    "A database is like a new cupboard you buy for your office. CREATE DATABASE is buying and placing the cupboard. USE is opening its door so everything you put next goes inside it. ALTER changes the label on the door. DROP throws the cupboard away with every file inside, so you check twice before doing it.",
    "Database মানে অফিসের জন্য কেনা নতুন আলমারি। CREATE DATABASE হলো আলমারি কিনে বসানো। USE হলো দরজা খোলা, যাতে এরপর যা রাখবেন তা ভেতরেই যায়। ALTER দরজার লেবেল বদলায়। DROP ভেতরের সব কাগজসহ আলমারি ফেলে দেয়, তাই দুইবার ভেবে করুন।",
  ],
  theory: [
    "Scripts in SSMS run in batches. The word GO is not SQL; it tells SSMS to send everything above it as one batch. Some statements, such as CREATE PROCEDURE or CREATE TRIGGER, must be first in a batch, and a database you just created can be used safely only in the next batch. Before renaming or dropping, nobody may be connected, so you switch to master and optionally force others out with ALTER DATABASE ... SET SINGLE_USER WITH ROLLBACK IMMEDIATE. Querying sys.databases confirms what exists, and DB_ID('name') returns NULL when a database is missing, which lets you write safe IF checks.",
    "SSMS-এ script ব্যাচে চলে। GO আসলে SQL নয়; এটি SSMS-কে বলে উপরের সব একসাথে পাঠাও। CREATE PROCEDURE বা CREATE TRIGGER-এর মতো কিছু statement ব্যাচের প্রথমে থাকতে হয়, আর নতুন বানানো database পরের ব্যাচেই নিরাপদে ব্যবহার করা যায়। নাম বদল বা মুছার আগে কেউ connected থাকতে পারবে না, তাই master-এ যান, দরকার হলে SET SINGLE_USER WITH ROLLBACK IMMEDIATE দিয়ে অন্যদের বের করুন। sys.databases দেখে নিশ্চিত হন, আর DB_ID('name') না থাকলে NULL দেয় — এভাবে নিরাপদ IF check লেখা যায়।",
  ],
  steps: [
    ["Run CREATE DATABASE TutorialDb2026 and refresh the Databases folder.", "CREATE DATABASE চালিয়ে Databases folder refresh করুন।"],
    ["Rename with ALTER DATABASE ... MODIFY NAME and check sys.databases.", "ALTER DATABASE ... MODIFY NAME দিয়ে নাম বদলে sys.databases দেখুন।"],
    ["USE the new name before creating any table.", "Table বানানোর আগে USE দিয়ে নতুন database-এ যান।"],
    ["To delete, USE master, then DROP DATABASE IF EXISTS.", "মুছতে হলে আগে USE master, তারপর DROP DATABASE IF EXISTS।"],
  ],
  mistakes: [
    "Mistake: creating tables while the dropdown still shows master, so your tables land in the system database. Fix: always start scripts with USE YourDb. Mistake: 'Cannot drop database because it is currently in use'. Fix: close other query windows or set SINGLE_USER first. Mistake: naming databases with spaces; use PascalCase such as SchoolDb.",
    "ভুল: dropdown-এ master থাকা অবস্থায় table বানানো, ফলে table system database-এ চলে যায়। সমাধান: script শুরু করুন USE YourDb দিয়ে। ভুল: 'Cannot drop database because it is currently in use'। সমাধান: অন্য query window বন্ধ করুন বা আগে SINGLE_USER করুন। ভুল: database-এর নামে space রাখা; SchoolDb-এর মতো PascalCase ব্যবহার করুন।",
  ],
  interview: [
    "Q: What are the system databases in SQL Server? A: master stores instance-level information (logins, databases list), model is the template for new databases, msdb stores SQL Agent jobs and backup history, and tempdb holds temporary tables and row versions and is recreated at every restart.",
    "প্রশ্ন: SQL Server-এর system database কী কী? উত্তর: master-এ instance-এর তথ্য (login, database তালিকা), model নতুন database-এর নমুনা, msdb-তে SQL Agent job ও backup-এর ইতিহাস, আর tempdb-তে temporary table ও row version থাকে — প্রতি restart-এ নতুন করে তৈরি হয়।",
  ],
  dEn: "Keep database creation in a versioned script or EF Core migration so every developer and server gets the same structure. Decide the recovery model early: FULL for production with log backups, SIMPLE for development. Protect DROP DATABASE behind IF DB_ID(...) IS NOT NULL and never run it on a shared server without a fresh backup.",
  dBn: "Database তৈরির script বা EF Core migration Git-এ রাখুন, যাতে সবাই একই কাঠামো পায়। শুরুতেই recovery model ঠিক করুন: production-এ FULL (log backup সহ), development-এ SIMPLE। DROP DATABASE-কে IF DB_ID(...) IS NOT NULL দিয়ে সুরক্ষিত রাখুন, আর নতুন backup ছাড়া shared server-এ কখনো চালাবেন না।",
  examples: [
    tsql(
      "Safe create, rename and drop script · নিরাপদ script",
      `USE master;
GO
IF DB_ID('TutorialDb2026') IS NULL
    CREATE DATABASE TutorialDb2026;
GO
ALTER DATABASE TutorialDb2026 MODIFY NAME = SQLTutorial2026;
GO
SELECT name, database_id, create_date
FROM sys.databases
WHERE name = 'SQLTutorial2026';
GO
-- Clean up (only in practice)
-- ALTER DATABASE SQLTutorial2026 SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
-- DROP DATABASE IF EXISTS SQLTutorial2026;`,
      "The database name 'SQLTutorial2026' has been set.\n\nname             database_id  create_date\nSQLTutorial2026  12           2026-09-06 08:09:42.633",
    ),
    lite(
      "List the tables that exist in this browser database · কোন table আছে দেখুন",
      `-- SQLite has one database per file; sqlite_master is its catalog
-- (similar to sys.tables in SQL Server).
SELECT type, name
FROM sqlite_master
WHERE type = 'table'
ORDER BY name;`,
    ),
  ],
});

chapter("SQL Server Data Types", {
  en: "Every column, variable and parameter in SQL Server has a data type. The type controls which values are allowed, how many bytes are stored on disk and in memory, how values are compared and sorted, and which functions work on them. Main families: exact numbers (BIT, TINYINT, SMALLINT, INT, BIGINT, DECIMAL/NUMERIC, MONEY), approximate numbers (FLOAT, REAL), text (CHAR, VARCHAR, NCHAR, NVARCHAR), date/time (DATE, TIME, DATETIME, DATETIME2, DATETIMEOFFSET), binary (VARBINARY) and others such as UNIQUEIDENTIFIER (GUID) and XML.",
  bn: "SQL Server-এ প্রতিটি column, variable, parameter-এর একটি data type থাকে। Type ঠিক করে কোন মান চলবে, disk ও memory-তে কত byte লাগবে, কীভাবে তুলনা ও সাজানো হবে, আর কোন function চলবে। প্রধান পরিবার: নির্ভুল সংখ্যা (BIT, TINYINT, SMALLINT, INT, BIGINT, DECIMAL, MONEY), আনুমানিক সংখ্যা (FLOAT, REAL), লেখা (CHAR, VARCHAR, NCHAR, NVARCHAR), তারিখ-সময় (DATE, TIME, DATETIME, DATETIME2), binary (VARBINARY), আর UNIQUEIDENTIFIER (GUID), XML।",
  story: [
    "Imagine packing for a trip. Shoes go in a shoe box, a laptop in a padded sleeve, coins in a small purse. Using a huge suitcase for one coin wastes space; forcing a laptop into a purse breaks it. Data types are those containers: INT for counts, DECIMAL for money, NVARCHAR for names in Bangla, DATE for birthdays, BIT for yes or no.",
    "ভ্রমণের জন্য ব্যাগ গোছানোর কথা ভাবুন। জুতা জুতার বাক্সে, laptop প্যাডেড ব্যাগে, কয়েন ছোট পার্সে। একটি কয়েনের জন্য বড় স্যুটকেস জায়গা নষ্ট করে; laptop পার্সে ঢোকালে ভেঙে যায়। Data type-ই সেই পাত্র: গোনার জন্য INT, টাকার জন্য DECIMAL, বাংলা নামের জন্য NVARCHAR, জন্মদিনের জন্য DATE, হ্যাঁ/না-র জন্য BIT।",
  ],
  theory: [
    "Sizes matter: TINYINT is 1 byte (0 to 255), SMALLINT 2 bytes, INT 4 bytes (about plus or minus 2.1 billion) and BIGINT 8 bytes. DECIMAL(p,s) stores exact values: p is the total number of digits and s the digits after the decimal point, so DECIMAL(18,2) holds up to 9999999999999999.99. FLOAT is approximate, so 0.1 + 0.2 may not equal 0.3; never use it for money. CHAR(n) is fixed width and pads with spaces; VARCHAR(n) is variable width. The N versions (NCHAR, NVARCHAR) store Unicode using 2 bytes per character, which is required for Bangla, Hindi or Arabic, and string literals need the N prefix: N'বাংলা'. DATETIME is accurate to about 3 milliseconds; DATETIME2 is more precise and is the recommended choice for new tables. BIT stores 1, 0 or NULL and is SQL Server's boolean.",
    "আকার গুরুত্বপূর্ণ: TINYINT ১ byte (০-২৫৫), SMALLINT ২ byte, INT ৪ byte (প্রায় ±২১০ কোটি), BIGINT ৮ byte। DECIMAL(p,s) নির্ভুল মান রাখে: p মোট অঙ্ক, s দশমিকের পরের অঙ্ক — DECIMAL(18,2)। FLOAT আনুমানিক, তাই 0.1 + 0.2 ঠিক 0.3 না-ও হতে পারে; টাকার জন্য কখনো নয়। CHAR(n) নির্দিষ্ট মাপের, বাকি জায়গা space দিয়ে ভরে; VARCHAR(n) যতটুকু লাগে ততটুকু। N যুক্ত type (NCHAR, NVARCHAR) Unicode রাখে, প্রতি অক্ষর ২ byte — বাংলা লেখার জন্য বাধ্যতামূলক, আর লেখার আগে N দিন: N'বাংলা'। DATETIME প্রায় ৩ millisecond নির্ভুল; DATETIME2 আরও নির্ভুল, নতুন table-এ এটিই ভালো। BIT রাখে 1, 0 বা NULL — এটাই SQL Server-এর boolean।",
  ],
  steps: [
    ["List each piece of information and its real-world range.", "প্রতিটি তথ্য আর তার বাস্তব পরিসর লিখুন।"],
    ["Pick the smallest exact type that safely covers the range.", "পরিসর নিরাপদে ধরে এমন সবচেয়ে ছোট নির্ভুল type নিন।"],
    ["Use NVARCHAR for any text that may contain non-English characters.", "অ-ইংরেজি অক্ষর থাকতে পারে এমন লেখায় NVARCHAR দিন।"],
    ["In SSMS expand Programmability > Types > System Data Types to explore all types.", "SSMS-এ Programmability > Types > System Data Types খুলে সব type দেখুন।"],
  ],
  mistakes: [
    "Mistake: storing phone numbers as INT; leading zeros disappear and +880 cannot be stored. Use VARCHAR(20). Mistake: storing dates as VARCHAR, which breaks sorting and date math. Mistake: inserting 'ঢাকা' into VARCHAR and seeing ????; use NVARCHAR with N'ঢাকা'. Mistake: DECIMAL without precision (DECIMAL alone means DECIMAL(18,0)), which silently rounds away the paisa.",
    "ভুল: ফোন নম্বর INT-এ রাখা; শুরুর শূন্য হারায় আর +880 রাখা যায় না। VARCHAR(20) দিন। ভুল: তারিখ VARCHAR-এ রাখা, ফলে সাজানো ও তারিখের হিসাব ভাঙে। ভুল: VARCHAR-এ 'ঢাকা' রেখে ???? দেখা; NVARCHAR ও N'ঢাকা' দিন। ভুল: শুধু DECIMAL লেখা (মানে DECIMAL(18,0)), ফলে পয়সা নিঃশব্দে গোল হয়ে হারায়।",
  ],
  interview: [
    "Q: VARCHAR vs NVARCHAR? A: VARCHAR stores non-Unicode text using a code page (1 byte for most characters); NVARCHAR stores Unicode (UTF-16, 2 bytes per character) and can hold any language. Use NVARCHAR for names, addresses and user input in multilingual apps, and remember the N prefix on literals.",
    "প্রশ্ন: VARCHAR বনাম NVARCHAR? উত্তর: VARCHAR code page অনুযায়ী non-Unicode লেখা রাখে (বেশিরভাগ অক্ষর ১ byte); NVARCHAR Unicode (UTF-16, প্রতি অক্ষর ২ byte) রাখে, যেকোনো ভাষা চলে। বহুভাষার app-এ নাম, ঠিকানা, user input-এর জন্য NVARCHAR, আর লেখার আগে N দিতে ভুলবেন না।",
  ],
  dEn: "Agree on standard types for the whole project: INT or BIGINT identities, DECIMAL(18,2) for money, NVARCHAR for human text, DATETIME2 for timestamps, BIT for flags. In C# these map to int/long, decimal, string, DateTime and bool, which keeps EF Core and Dapper mappings simple. Changing a type later on a big table is slow and risky, so choose carefully at design time.",
  dBn: "পুরো project-এর জন্য একই type ঠিক করুন: INT বা BIGINT identity, টাকার জন্য DECIMAL(18,2), মানুষের লেখার জন্য NVARCHAR, সময়ের জন্য DATETIME2, flag-এর জন্য BIT। C#-এ এগুলো int/long, decimal, string, DateTime, bool — ফলে EF Core ও Dapper mapping সহজ। বড় table-এ পরে type বদলানো ধীর ও ঝুঁকিপূর্ণ, তাই design-এর সময়ই ভেবে বাছুন।",
  examples: [
    tsql(
      "See how types store and compare values · type কীভাবে মান রাখে",
      `DECLARE @price DECIMAL(18,2) = 199.999;
DECLARE @f FLOAT = 0.1 + 0.2;
DECLARE @city1 VARCHAR(20) = 'ঢাকা';
DECLARE @city2 NVARCHAR(20) = N'ঢাকা';
DECLARE @flag BIT = 5;          -- any non-zero becomes 1
SELECT @price AS Price,         -- rounded to 2 decimals
       @f AS FloatSum,
       @city1 AS VarcharCity,
       @city2 AS NvarcharCity,
       @flag AS Flag,
       DATALENGTH(@city2) AS Bytes;`,
      "Price   FloatSum              VarcharCity  NvarcharCity  Flag  Bytes\n200.00  0.30000000000000004   ????         ঢাকা           1     8",
    ),
    lite(
      "Check value types in SQLite · SQLite-এ মানের type দেখা",
      `-- SQLite uses dynamic types; typeof() shows what was stored.
SELECT Name,
       typeof(Name)   AS NameType,
       Salary,
       typeof(Salary) AS SalaryType,
       typeof(DepartmentId) AS DeptType
FROM Employees;`,
    ),
  ],
});

chapter("Variables: DECLARE & SET", {
  en: "A T-SQL variable is a local named value that exists for the lifetime of a batch, stored procedure or function. You declare it with DECLARE @name TYPE, optionally with an initial value (DECLARE @age INT = 25). Until assigned, its value is NULL. SET assigns exactly one value and raises an error if a subquery returns more than one row; SELECT @var = ... can assign several variables at once from a query and keeps the last row if many rows match. Variables are used for parameters, counters in WHILE loops, intermediate results and dynamic filters.",
  bn: "T-SQL variable হলো একটি স্থানীয় নামওয়ালা মান, যা একটি batch, procedure বা function চলা পর্যন্ত থাকে। DECLARE @name TYPE দিয়ে ঘোষণা করি, চাইলে শুরুর মান দিই (DECLARE @age INT = 25)। মান না দিলে NULL থাকে। SET ঠিক একটি মান দেয়, subquery-তে একাধিক সারি এলে error দেয়; SELECT @var = ... query থেকে একসাথে কয়েকটি variable ভরে, অনেক সারি মিললে শেষেরটি রাখে। Variable ব্যবহার হয় parameter, WHILE loop-এর counter, মধ্যবর্তী ফল আর dynamic filter-এ।",
  story: [
    "A variable is like a sticky note on your desk. You write 'Name: Rohan' on it, use it while doing today's work, and throw it away in the evening. Tomorrow the note is gone. In SQL the evening is the end of the batch (GO).",
    "Variable মানে টেবিলের উপর একটি sticky note। তাতে লিখলেন 'নাম: রোহান', আজকের কাজে ব্যবহার করলেন, সন্ধ্যায় ফেলে দিলেন। কাল আর নেই। SQL-এ সেই সন্ধ্যা হলো batch-এর শেষ (GO)।",
  ],
  theory: [
    "Scope is the key idea. A variable declared in one batch is invisible after GO, and a variable declared inside a stored procedure is invisible to the caller unless it is an OUTPUT parameter. Variables can be used in WHERE, in calculations and in IF/WHILE control flow, but not as table or column names; for that you need dynamic SQL with sp_executesql. PRINT @var writes to the Messages tab, while SELECT @var returns a result grid. Since SQL Server 2008 you can also use compound operators: SET @count += 1.",
    "মূল ধারণা হলো scope। এক batch-এ ঘোষণা করা variable GO-এর পরে দেখা যায় না, আর procedure-এর ভেতরের variable caller দেখতে পায় না (OUTPUT parameter ছাড়া)। Variable WHERE, হিসাব আর IF/WHILE-এ ব্যবহার করা যায়, কিন্তু table বা column-এর নাম হিসেবে নয় — তার জন্য sp_executesql দিয়ে dynamic SQL লাগে। PRINT @var Messages tab-এ লেখে, SELECT @var result grid দেয়। SQL Server 2008 থেকে SET @count += 1 লেখা যায়।",
  ],
  steps: [
    ["DECLARE each variable with the right data type.", "প্রতিটি variable সঠিক type দিয়ে DECLARE করুন।"],
    ["Assign with SET for one value or SELECT for values from a query.", "একটি মানে SET, query থেকে মানে SELECT দিয়ে ভরুন।"],
    ["Use the variable in WHERE or a calculation.", "WHERE বা হিসাবে variable ব্যবহার করুন।"],
    ["Select all lines together and press Execute, because variables do not survive between runs.", "সব লাইন একসাথে select করে Execute চাপুন, কারণ আলাদা run-এ variable থাকে না।"],
  ],
  mistakes: [
    "Mistake: running only the SELECT @name line and getting 'Must declare the scalar variable @name'. Fix: run the DECLARE in the same execution. Mistake: forgetting the size, DECLARE @name VARCHAR, which means VARCHAR(1) and silently keeps one letter. Mistake: SET @x = (SELECT Salary FROM Employees) when many rows exist, which errors with 'Subquery returned more than 1 value'.",
    "ভুল: শুধু SELECT @name লাইন চালিয়ে 'Must declare the scalar variable' পাওয়া। সমাধান: DECLARE একই run-এ চালান। ভুল: আকার না লেখা, DECLARE @name VARCHAR — মানে VARCHAR(1), নিঃশব্দে একটি অক্ষর রাখে। ভুল: অনেক সারি থাকা অবস্থায় SET @x = (SELECT Salary FROM Employees) — error 'Subquery returned more than 1 value'।",
  ],
  interview: [
    "Q: Difference between SET and SELECT for assignment? A: SET is ANSI standard, assigns one variable at a time and errors if the subquery returns multiple rows. SELECT can assign many variables in one statement, does not error on multiple rows (keeps the last) and leaves the variable unchanged when no row is returned, while SET makes it NULL.",
    "প্রশ্ন: মান দেওয়ায় SET আর SELECT-এর পার্থক্য? উত্তর: SET ANSI standard, একবারে একটি variable, subquery একাধিক সারি দিলে error। SELECT একসাথে অনেক variable ভরে, একাধিক সারিতে error দেয় না (শেষেরটি রাখে), আর কোনো সারি না এলে আগের মান রেখে দেয়, যেখানে SET NULL বানায়।",
  ],
  dEn: "Use variables to make scripts readable and to avoid repeating literal values. In application code prefer parameters (SqlParameter, Dapper anonymous objects) over string-built SQL so values travel as variables and plans are reused. For many values use a table variable or a table-valued parameter instead of a comma-separated string.",
  dBn: "Script পড়তে সহজ করতে আর একই মান বারবার না লিখতে variable ব্যবহার করুন। App code-এ string জুড়ে SQL না বানিয়ে parameter (SqlParameter, Dapper) দিন, যাতে মান variable হিসেবে যায় আর plan আবার ব্যবহার হয়। অনেক মান হলে comma দেওয়া string নয়, table variable বা table-valued parameter দিন।",
  examples: [
    tsql(
      "Variables, SET vs SELECT and a WHILE loop · variable ও loop",
      `DECLARE @name VARCHAR(50), @dob DATE, @city VARCHAR(50);
DECLARE @salary DECIMAL(18,2), @age INT, @isAdult BIT;
SET @name = 'Rohan';
SET @dob = '1995-08-08';
SET @city = 'Jaipur';
SET @age = DATEDIFF(YEAR, @dob, '2026-08-08');
SET @isAdult = CASE WHEN @age >= 18 THEN 1 ELSE 0 END;
SELECT @name AS Name, @city AS City, @age AS Age, @isAdult AS IsAdult;
DECLARE @i INT = 1;
WHILE @i <= 3
BEGIN
    PRINT 'Loop number ' + CAST(@i AS VARCHAR(5));
    SET @i += 1;
END`,
      "Name   City    Age  IsAdult\nRohan  Jaipur  31   1\n\nMessages:\nLoop number 1\nLoop number 2\nLoop number 3",
    ),
    lite(
      "SQLite has no DECLARE; use a one-row CTE as a variable · CTE দিয়ে variable",
      `WITH vars AS (SELECT 60000 AS MinSalary, 1 AS DeptId)
SELECT e.Name, e.Salary
FROM Employees e, vars
WHERE e.Salary >= vars.MinSalary
  AND e.DepartmentId = vars.DeptId
ORDER BY e.Salary DESC;`,
    ),
  ],
});

chapter("CAST, CONVERT & TRY_CAST", {
  en: "SQL Server converts values in two ways. Explicit conversion is when you ask for it with CAST, CONVERT, TRY_CAST, TRY_CONVERT or PARSE. Implicit conversion happens automatically when two different types meet, following data type precedence: the lower-precedence value is converted to the higher one (INT is higher than VARCHAR, so 13 + '12' = 25, while 'Total ' + 5 fails because 'Total ' cannot become INT). Conversions can lose information: DECIMAL to INT truncates, long text to a short VARCHAR cuts characters, and invalid text raises an error unless you use a TRY_ function.",
  bn: "SQL Server দুইভাবে মান বদলায়। Explicit: আপনি নিজে বলেন — CAST, CONVERT, TRY_CAST, TRY_CONVERT, PARSE। Implicit: দুই আলাদা type মিললে নিজে থেকে, type precedence অনুযায়ী — নিচের ক্রমের মান উপরেরটিতে যায় (INT, VARCHAR-এর উপরে, তাই 13 + '12' = 25, কিন্তু 'Total ' + 5 ব্যর্থ, কারণ 'Total ' INT হতে পারে না)। বদলাতে গিয়ে তথ্য হারাতে পারে: DECIMAL থেকে INT-এ দশমিক কাটা যায়, লম্বা লেখা ছোট VARCHAR-এ কাটা পড়ে, ভুল লেখা error দেয় — TRY_ function না দিলে।",
  story: [
    "Converting is like changing money at the airport. 100 dollars becomes taka with a clear rate (CAST). The counter can also print the receipt in your preferred date style (CONVERT with a style). If you hand over a toy note, a strict counter shouts (error) while a polite one just returns nothing (TRY_CAST returns NULL).",
    "Conversion মানে বিমানবন্দরে টাকা বদলানো। ১০০ ডলার নির্দিষ্ট হারে টাকা হয় (CAST)। Counter আপনার পছন্দের তারিখের ধরনে রসিদও দিতে পারে (style সহ CONVERT)। খেলনার নোট দিলে কড়া counter চিৎকার করে (error), ভদ্র counter শুধু কিছু ফেরত দেয় না (TRY_CAST দেয় NULL)।",
  ],
  theory: [
    "CAST(expression AS type) is portable across databases. CONVERT(type, expression, style) adds formatting styles for dates and money: 101 = mm/dd/yyyy, 103 = dd/mm/yyyy, 105 = dd-mm-yyyy, 112 = yyyymmdd, 120 = yyyy-mm-dd hh:mi:ss, 126 = ISO 8601. TRY_CAST and TRY_CONVERT behave the same but return NULL on failure, which is ideal when cleaning imported data: WHERE TRY_CAST(Amount AS DECIMAL(18,2)) IS NULL finds the bad rows. FORMAT(value, 'dd MMM yyyy') gives .NET-style formatting but is much slower, so use it only for small result sets. Converting a DECIMAL to INT truncates toward zero (15.85 becomes 15); use ROUND first if you need rounding.",
    "CAST(expression AS type) সব database-এ চলে। CONVERT(type, expression, style) তারিখ ও টাকার format দেয়: 101 = মাস/দিন/বছর, 103 = দিন/মাস/বছর, 105 = দিন-মাস-বছর, 112 = বছরমাসদিন, 120 = বছর-মাস-দিন সময়, 126 = ISO 8601। TRY_CAST ও TRY_CONVERT একই কাজ করে কিন্তু ব্যর্থ হলে NULL দেয় — import করা data পরিষ্কারে দারুণ: WHERE TRY_CAST(Amount AS DECIMAL(18,2)) IS NULL দিয়ে খারাপ সারি খুঁজুন। FORMAT(value, 'dd MMM yyyy') .NET-এর মতো format দেয় কিন্তু অনেক ধীর, তাই ছোট ফলেই ব্যবহার করুন। DECIMAL থেকে INT-এ দশমিক কেটে যায় (15.85 → 15); গোল করতে চাইলে আগে ROUND দিন।",
  ],
  steps: [
    ["Find the source type and the type you need.", "উৎসের type আর দরকারি type চিনুন।"],
    ["Use CAST for simple changes and CONVERT when you need a date style.", "সাধারণ বদলে CAST, তারিখের ধরন লাগলে CONVERT।"],
    ["Use TRY_CAST when the input may be invalid, then handle NULL.", "Input ভুল হতে পারলে TRY_CAST, তারপর NULL সামলান।"],
    ["Run each line and compare the result with the expected value.", "প্রতিটি লাইন চালিয়ে প্রত্যাশিত মানের সাথে মেলান।"],
  ],
  mistakes: [
    "Mistake: SELECT 'Age: ' + 25 fails with 'Conversion failed when converting the varchar value'. Fix: 'Age: ' + CAST(25 AS VARCHAR(5)) or CONCAT('Age: ', 25). Mistake: CAST('12525' AS DATE) fails because 12525 is not a recognisable date. Mistake: CONVERT(VARCHAR, ...) without a length defaults to 30 characters, which is easy to forget.",
    "ভুল: SELECT 'Age: ' + 25 'Conversion failed' দেয়। সমাধান: 'Age: ' + CAST(25 AS VARCHAR(5)) বা CONCAT('Age: ', 25)। ভুল: CAST('12525' AS DATE) ব্যর্থ, কারণ 12525 চেনা তারিখ নয়। ভুল: দৈর্ঘ্য ছাড়া CONVERT(VARCHAR, ...) — default ৩০ অক্ষর, সহজেই ভুলে যাওয়া হয়।",
  ],
  interview: [
    "Q: CAST vs CONVERT vs TRY_CAST? A: CAST is ANSI standard and portable. CONVERT is SQL Server specific and accepts a style number for date and money formatting. TRY_CAST and TRY_CONVERT return NULL instead of raising an error when conversion fails, which keeps a batch running when some rows are dirty.",
    "প্রশ্ন: CAST, CONVERT আর TRY_CAST-এর পার্থক্য? উত্তর: CAST ANSI standard, সব জায়গায় চলে। CONVERT SQL Server-এর নিজস্ব, তারিখ ও টাকার format-এর style নম্বর নেয়। TRY_CAST ও TRY_CONVERT ব্যর্থ হলে error না দিয়ে NULL দেয়, ফলে কিছু খারাপ সারি থাকলেও কাজ চলতে থাকে।",
  ],
  dEn: "Format dates and numbers in the application (C# ToString with culture) rather than in SQL whenever possible; return real DATE and DECIMAL values from queries. Inside SQL, convert the literal or parameter, not the column, so that indexes stay usable: WHERE OrderDate >= CAST(@from AS DATE) is good, WHERE CONVERT(VARCHAR, OrderDate, 105) = @text is slow.",
  dBn: "সম্ভব হলে তারিখ ও সংখ্যার format app-এ (C# ToString) করুন, query থেকে আসল DATE ও DECIMAL ফেরত দিন। SQL-এর ভেতরে column নয়, literal বা parameter-কে বদলান, যাতে index কাজ করে: WHERE OrderDate >= CAST(@from AS DATE) ভালো, WHERE CONVERT(VARCHAR, OrderDate, 105) = @text ধীর।",
  examples: [
    tsql(
      "Every conversion from the lesson with results · প্রতিটি conversion-এর ফল",
      `SELECT CAST(15.8555585565565659 AS INT)        AS ToInt;
SELECT CAST('100' AS INT) + 1                   AS TextToInt;
SELECT CAST('2026-08-07' AS DATE)               AS ToDate;
SELECT CONVERT(VARCHAR(20), '2026-08-07', 105)  AS StillText;
SELECT CONVERT(VARCHAR(20), CAST('2026-08-07' AS DATE), 105) AS Style105;
SELECT CONVERT(VARCHAR(20), CAST('2026-08-07' AS DATE), 120) AS Style120;
SELECT TRY_CAST('123' AS INT)   AS Good,
       TRY_CAST('7777g' AS INT) AS Bad;
SELECT 13 + '12' AS Implicit;`,
      "ToInt\n15\nTextToInt\n101\nToDate\n2026-08-07\nStillText\n2026-08-07   (already text, style ignored)\nStyle105\n07-08-2026\nStyle120\n2026-08-07\nGood  Bad\n123   NULL\nImplicit\n25",
    ),
    lite(
      "CAST in SQLite · SQLite-এ CAST",
      `SELECT CAST(15.8555 AS INTEGER)       AS ToInt,
       CAST('100' AS INTEGER) + 1       AS TextToInt,
       13 + '12'                        AS Implicit,
       'Total: ' || CAST(25 AS TEXT)    AS Joined,
       strftime('%d-%m-%Y', '2026-08-07') AS Style105Like;`,
    ),
  ],
});

chapter("CREATE TABLE & Constraints", {
  en: "A table definition has three parts: the table name, the column list (name, type, NULL or NOT NULL) and the constraints. Constraints are rules the database enforces on every INSERT and UPDATE. PRIMARY KEY = unique + not null and creates a clustered index by default. UNIQUE allows only distinct values (one NULL allowed in SQL Server). CHECK accepts a row only if its condition is true or unknown. DEFAULT supplies a value when the INSERT does not mention the column. FOREIGN KEY links to another table. IDENTITY(seed, increment) is a column property that numbers rows automatically.",
  bn: "Table-এর সংজ্ঞায় তিন অংশ: table-এর নাম, column তালিকা (নাম, type, NULL বা NOT NULL), আর constraint। Constraint হলো নিয়ম, যা database প্রতিটি INSERT ও UPDATE-এ যাচাই করে। PRIMARY KEY = অনন্য + NULL নয়, default-এ clustered index বানায়। UNIQUE শুধু আলাদা মান নেয় (SQL Server-এ একটি NULL চলে)। CHECK শর্ত সত্য হলে তবেই সারি নেয়। DEFAULT INSERT-এ column না থাকলে মান বসায়। FOREIGN KEY অন্য table-এর সাথে যুক্ত করে। IDENTITY(seed, increment) নিজে নিজে নম্বর দেয়।",
  story: [
    "A table is like an admission form printed by the school. Some boxes are marked 'required' (NOT NULL), the roll number is printed automatically (IDENTITY), the email box says 'must not match another student' (UNIQUE), the age box says 'above 18 only' (CHECK), and the date box is pre-stamped with today's date (DEFAULT). The clerk refuses any form that breaks these rules.",
    "Table হলো স্কুলের ছাপানো ভর্তি ফর্মের মতো। কিছু ঘরে লেখা 'আবশ্যক' (NOT NULL), রোল নম্বর নিজে ছাপা হয় (IDENTITY), email ঘরে লেখা 'অন্য কারও সাথে মিলবে না' (UNIQUE), বয়সের ঘরে '১৮-এর বেশি' (CHECK), আর তারিখের ঘরে আজকের তারিখের সিল আগেই দেওয়া (DEFAULT)। নিয়ম ভাঙলে কেরানি ফর্ম ফেরত দেন।",
  ],
  theory: [
    "Constraints can be written inline next to a column or as separate named table constraints at the end: CONSTRAINT CK_Student_Age CHECK (Age > 18). Naming them matters because SQL Server otherwise invents names such as CK__Student__Age__3A81B327 that differ on every server, making later ALTER TABLE ... DROP CONSTRAINT scripts fragile. IDENTITY values are not reused after a delete or a failed insert, so gaps are normal; never rely on IDENTITY being continuous. A DEFAULT applies only when the column is omitted or the DEFAULT keyword is used; explicitly inserting NULL stores NULL. Use ALTER TABLE to add columns and constraints later: ALTER TABLE Student ADD CONSTRAINT UQ_Student_Email UNIQUE (Email).",
    "Constraint column-এর পাশেই লেখা যায়, অথবা শেষে নাম দিয়ে আলাদা: CONSTRAINT CK_Student_Age CHECK (Age > 18)। নাম দেওয়া জরুরি, নইলে SQL Server CK__Student__Age__3A81B327-এর মতো নাম বানায়, যা প্রতিটি server-এ আলাদা, ফলে পরে DROP CONSTRAINT script ভাঙে। Delete বা ব্যর্থ insert-এর পরে IDENTITY মান আর ফেরত আসে না, তাই ফাঁক থাকা স্বাভাবিক; ধারাবাহিক নম্বরের উপর ভরসা করবেন না। DEFAULT কাজ করে শুধু column বাদ দিলে বা DEFAULT শব্দ লিখলে; নিজে NULL দিলে NULL-ই থাকে। পরে ALTER TABLE দিয়ে column ও constraint যোগ করুন।",
  ],
  steps: [
    ["Write DROP TABLE IF EXISTS Student so the script can run again.", "DROP TABLE IF EXISTS Student লিখুন, যাতে script আবার চালানো যায়।"],
    ["Define columns with types and NULL or NOT NULL.", "Type ও NULL বা NOT NULL সহ column লিখুন।"],
    ["Add PRIMARY KEY IDENTITY, UNIQUE, CHECK and DEFAULT rules.", "PRIMARY KEY IDENTITY, UNIQUE, CHECK, DEFAULT নিয়ম যোগ করুন।"],
    ["Insert one good row and one bad row and read the error message.", "একটি ঠিক আর একটি ভুল সারি insert করে error বার্তা পড়ুন।"],
  ],
  mistakes: [
    "Mistake: CHECK (Age > 10) when the rule is adult students; the database happily accepts age 11. Write the real business rule. Mistake: making Email UNIQUE but storing different cases (A@x.com, a@x.com); the default case-insensitive collation treats them as equal, which is usually what you want, so test it. Mistake: putting DEFAULT GETDATE() but inserting NULL explicitly from the application.",
    "ভুল: নিয়ম প্রাপ্তবয়স্ক হলেও CHECK (Age > 10) লেখা; database ১১ বছরও নেয়। আসল নিয়ম লিখুন। ভুল: Email UNIQUE কিন্তু বড়-ছোট হাতের ভিন্নতা; default collation দুটোকে এক ধরে, যা সাধারণত ঠিক — test করুন। ভুল: DEFAULT GETDATE() দিয়ে app থেকে নিজে NULL পাঠানো।",
  ],
  interview: [
    "Q: Difference between PRIMARY KEY and UNIQUE? A: A table has one primary key; it cannot contain NULL and by default creates the clustered index. A table can have many UNIQUE constraints; each allows one NULL in SQL Server and creates a non-clustered index by default.",
    "প্রশ্ন: PRIMARY KEY আর UNIQUE-এর পার্থক্য? উত্তর: একটি table-এ একটিই primary key, এতে NULL চলে না, default-এ clustered index বানায়। UNIQUE অনেকগুলো থাকতে পারে; SQL Server-এ প্রতিটিতে একটি NULL চলে, default-এ non-clustered index বানায়।",
  ],
  dEn: "Put important rules in constraints even if the application validates too: the database is the last line of defence and protects data from scripts, imports and other apps. Keep CHECK constraints simple and deterministic. Name every constraint with a prefix (PK_, FK_, UQ_, CK_, DF_) so errors and migrations are self-explanatory.",
  dBn: "App যাচাই করলেও জরুরি নিয়ম constraint-এ রাখুন: database শেষ পাহারাদার, script, import বা অন্য app থেকেও data রক্ষা করে। CHECK সহজ রাখুন। প্রতিটি constraint-এর নাম prefix দিয়ে দিন (PK_, FK_, UQ_, CK_, DF_), যাতে error আর migration দেখে বোঝা যায়।",
  examples: [
    tsql(
      "Student table with every constraint · সব constraint সহ Student",
      `DROP TABLE IF EXISTS Student;
CREATE TABLE Student (
    StudentId      INT IDENTITY(1,1) CONSTRAINT PK_Student PRIMARY KEY,
    StudentName    VARCHAR(50)  NOT NULL,
    FatherName     VARCHAR(50)  NOT NULL,
    MotherName     VARCHAR(50)  NOT NULL,
    Email          VARCHAR(100) NOT NULL CONSTRAINT UQ_Student_Email UNIQUE,
    SecondaryEmail VARCHAR(100) NULL,
    DOB            DATE         NOT NULL,
    Age            INT          NOT NULL CONSTRAINT CK_Student_Age CHECK (Age > 18),
    IsAdult        BIT          NOT NULL CONSTRAINT DF_Student_IsAdult DEFAULT 0,
    CreatedAt      DATETIME     NOT NULL CONSTRAINT DF_Student_CreatedAt DEFAULT GETDATE()
);
INSERT INTO Student (StudentName, FatherName, MotherName, Email, DOB, Age)
VALUES ('Rohan', 'XYZ', 'PQR', 'rohan@mail.com', '1995-08-08', 30);
-- Fails: Age 15 breaks CK_Student_Age
INSERT INTO Student (StudentName, FatherName, MotherName, Email, DOB, Age)
VALUES ('Mina', 'A', 'B', 'mina@mail.com', '2011-01-01', 15);
SELECT StudentId, StudentName, Age, IsAdult, CreatedAt FROM Student;`,
      "(1 row affected)\nMsg 547: The INSERT statement conflicted with the CHECK constraint \"CK_Student_Age\".\n\nStudentId  StudentName  Age  IsAdult  CreatedAt\n1          Rohan        30   0        2026-09-07 10:15:22.170",
    ),
    lite(
      "Constraints in action (SQLite) · constraint পরীক্ষা",
      `DROP TABLE IF EXISTS Student;
CREATE TABLE Student (
  StudentId INTEGER PRIMARY KEY AUTOINCREMENT,
  StudentName TEXT NOT NULL,
  Email TEXT NOT NULL UNIQUE,
  Age INTEGER NOT NULL CHECK (Age > 18),
  IsAdult INTEGER DEFAULT 0,
  CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO Student (StudentName, Email, Age) VALUES ('Rohan', 'rohan@mail.com', 30);
INSERT INTO Student (StudentName, Email, Age) VALUES ('Parul', 'parul@mail.com', 21);
SELECT * FROM Student;`,
    ),
  ],
});

chapter("Primary Key & Foreign Key", {
  en: "Relational design splits data into tables so each fact is stored once (normalisation). A primary key identifies each row; a foreign key in a child table stores the parent's key and SQL Server checks it on every insert and update of the child and every delete or key update of the parent. The relationship can be one-to-many (one department, many employees), one-to-one (employee and EmployeeOtherDetails) or many-to-many through a junction table (students and courses via StudentCourse). Referential actions decide what happens when a parent changes: NO ACTION (default, block), CASCADE, SET NULL or SET DEFAULT.",
  bn: "Relational design-এ data ভাগ করা হয় যাতে প্রতিটি তথ্য একবারই থাকে (normalisation)। Primary key প্রতিটি সারি চেনায়; child table-এর foreign key parent-এর key রাখে, আর SQL Server child-এর প্রতিটি insert/update আর parent-এর প্রতিটি delete-এ তা যাচাই করে। সম্পর্ক হতে পারে one-to-many (এক বিভাগ, অনেক কর্মী), one-to-one (employee ও EmployeeOtherDetails), বা junction table দিয়ে many-to-many (student ও course)। Parent বদলালে কী হবে ঠিক করে referential action: NO ACTION (default, আটকানো), CASCADE, SET NULL, SET DEFAULT।",
  story: [
    "In a family register each person gets a unique ID card number (primary key). A child's form has a box 'Father's ID number' (foreign key). The office will not accept a child's form that names an ID which does not exist, and it will not let you erase the father's record while children still point to it.",
    "পরিবারের রেজিস্টারে প্রত্যেকের একটি অনন্য পরিচয়পত্র নম্বর (primary key)। সন্তানের ফর্মে একটি ঘর 'বাবার ID নম্বর' (foreign key)। যে ID নেই তা লিখলে অফিস ফর্ম নেয় না, আর সন্তানেরা নির্দেশ করে থাকলে বাবার রেকর্ড মুছতে দেয় না।",
  ],
  theory: [
    "A good primary key is unique, never NULL, never changes and is small: an INT IDENTITY or a GUID (UNIQUEIDENTIFIER with NEWSEQUENTIALID to reduce fragmentation). A natural key such as a national ID can still be stored with a UNIQUE constraint. A composite primary key uses several columns, common in junction tables: PRIMARY KEY (StudentId, CourseId). The foreign key column must have the same data type as the referenced key. SQL Server shows relationships in Database Diagrams, and you can query sys.foreign_keys to list them. ON DELETE CASCADE is convenient but dangerous on large trees, because one delete can silently remove thousands of rows.",
    "ভালো primary key অনন্য, কখনো NULL নয়, কখনো বদলায় না, ছোট: INT IDENTITY বা GUID (fragmentation কমাতে NEWSEQUENTIALID)। জাতীয় পরিচয়পত্রের মতো natural key UNIQUE দিয়ে রাখা যায়। Composite primary key একাধিক column নিয়ে, junction table-এ সাধারণ: PRIMARY KEY (StudentId, CourseId)। Foreign key column-এর type parent key-এর সমান হতে হবে। SQL Server Database Diagrams-এ সম্পর্ক দেখায়, sys.foreign_keys দিয়ে তালিকা পাওয়া যায়। ON DELETE CASCADE সুবিধাজনক কিন্তু বড় গাছে বিপজ্জনক — একটি delete হাজার সারি নিঃশব্দে মুছে দিতে পারে।",
  ],
  steps: [
    ["Create the parent table with a primary key.", "Primary key সহ parent table বানান।"],
    ["Create the child table with a column of the same type.", "একই type-এর column সহ child table বানান।"],
    ["Add CONSTRAINT FK_... FOREIGN KEY ... REFERENCES parent(key).", "CONSTRAINT FK_... FOREIGN KEY ... REFERENCES যোগ করুন।"],
    ["Insert a valid child, then try an invalid one and read the error.", "ঠিক child insert করুন, তারপর ভুলটি চেষ্টা করে error পড়ুন।"],
  ],
  mistakes: [
    "Mistake: creating the child table before the parent, which fails because the referenced table does not exist. Mistake: mismatched types (INT vs BIGINT) give 'Column ... is not the same data type as referencing column'. Mistake: deleting parents first in cleanup scripts; delete children first or the FK blocks you.",
    "ভুল: parent-এর আগে child table বানানো — referenced table নেই বলে ব্যর্থ। ভুল: type না মেলা (INT বনাম BIGINT) error দেয়। ভুল: পরিষ্কারের script-এ আগে parent মুছা; আগে child মুছুন, নইলে FK আটকাবে।",
  ],
  interview: [
    "Q: Can a foreign key reference a non-primary-key column? A: Yes, any column with a PRIMARY KEY or UNIQUE constraint can be referenced. Q: Can a foreign key column contain NULL? A: Yes, unless it is declared NOT NULL; a NULL means the row is not linked to any parent.",
    "প্রশ্ন: Foreign key কি primary key ছাড়া অন্য column-কে নির্দেশ করতে পারে? উত্তর: হ্যাঁ, PRIMARY KEY বা UNIQUE থাকা যেকোনো column। প্রশ্ন: Foreign key column-এ NULL চলে? উত্তর: হ্যাঁ, NOT NULL না লিখলে; NULL মানে সারিটি কোনো parent-এর সাথে যুক্ত নয়।",
  ],
  dEn: "Always declare foreign keys; they document the model, prevent orphan rows and help the optimizer. Index every FK column. Prefer NO ACTION and explicit deletes in application code (or soft delete) over cascades for important business data. EF Core creates FKs from navigation properties, so the same rules apply to code-first models.",
  dBn: "সবসময় foreign key ঘোষণা করুন; এটি model বোঝায়, অনাথ সারি আটকায়, optimizer-কে সাহায্য করে। প্রতিটি FK column-এ index দিন। জরুরি ব্যবসায়িক data-য় cascade-এর বদলে NO ACTION আর app-এ স্পষ্ট delete (বা soft delete) ভালো। EF Core navigation property থেকে FK বানায়, তাই code-first-এও একই নিয়ম।",
  examples: [
    tsql(
      "Employee and EmployeeOtherDetails relationship · সম্পর্ক তৈরি",
      `DROP TABLE IF EXISTS EmployeeOtherDetails;
DROP TABLE IF EXISTS Employee;
CREATE TABLE Employee (
    EmpId   INT IDENTITY(1,1) PRIMARY KEY,
    EmpName VARCHAR(50) NOT NULL
);
CREATE TABLE EmployeeOtherDetails (
    RowId        INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId   INT NOT NULL,
    Salary       DECIMAL(18,2) NULL,
    BankAcNumber VARCHAR(20) NULL,
    IFSC         VARCHAR(15) NULL,
    BankName     VARCHAR(50) NULL,
    CONSTRAINT FK_EmpOtherDetail_Employee
        FOREIGN KEY (EmployeeId) REFERENCES Employee(EmpId)
);
INSERT INTO Employee (EmpName) VALUES ('Rohan'), ('Nadia');
INSERT INTO EmployeeOtherDetails (EmployeeId, Salary, BankName) VALUES (1, 50000, 'SBI');
INSERT INTO EmployeeOtherDetails (EmployeeId, Salary, BankName) VALUES (99, 1, 'X'); -- fails
SELECT e.EmpName, d.Salary, d.BankName
FROM Employee e JOIN EmployeeOtherDetails d ON d.EmployeeId = e.EmpId;`,
      "Msg 547: The INSERT statement conflicted with the FOREIGN KEY constraint \"FK_EmpOtherDetail_Employee\".\n\nEmpName  Salary    BankName\nRohan    50000.00  SBI",
    ),
    lite(
      "Join the sample parent and child tables · parent ও child মেলানো",
      `-- Departments is the parent, Employees.DepartmentId is the foreign key.
SELECT d.Name AS Department, e.Name AS Employee, e.Salary
FROM Departments d
JOIN Employees e ON e.DepartmentId = d.Id
ORDER BY d.Name, e.Salary DESC;`,
    ),
  ],
});

chapter("CRUD: INSERT, UPDATE, DELETE", {
  en: "INSERT INTO table (columns) VALUES (...) adds one or more rows; listing the columns protects you when the table structure changes. INSERT ... SELECT copies rows from a query. UPDATE table SET col = value WHERE condition changes values in matching rows and can use expressions (Salary = Salary * 1.10) or joins. DELETE FROM table WHERE condition removes matching rows. SQL Server reports '(n rows affected)', and @@ROWCOUNT holds that number for the next statement. The OUTPUT clause can return the inserted, updated or deleted rows directly.",
  bn: "INSERT INTO table (columns) VALUES (...) এক বা একাধিক সারি যোগ করে; column তালিকা দিলে table বদলালেও নিরাপদ। INSERT ... SELECT query থেকে সারি কপি করে। UPDATE table SET col = value WHERE শর্ত মেলা সারির মান বদলায়, হিসাব (Salary = Salary * 1.10) বা join-ও চলে। DELETE FROM table WHERE শর্ত মেলা সারি মুছে। SQL Server '(n rows affected)' দেখায়, আর পরের statement-এ @@ROWCOUNT সেই সংখ্যা রাখে। OUTPUT clause যোগ, বদল বা মুছে যাওয়া সারি সরাসরি ফেরত দেয়।",
  story: [
    "A shop keeps a customer notebook. Writing a new customer is Create, looking someone up is Read, correcting a phone number is Update and crossing out a customer who left is Delete. A careless shopkeeper who says 'change the phone number' without saying whose ends up changing every page. That is UPDATE without WHERE.",
    "একটি দোকান ক্রেতার খাতা রাখে। নতুন ক্রেতা লেখা Create, কাউকে খোঁজা Read, ফোন নম্বর ঠিক করা Update, চলে যাওয়া ক্রেতাকে কেটে দেওয়া Delete। অসাবধান দোকানদার 'ফোন নম্বর বদলাও' বললেন কিন্তু কার তা বললেন না — সব পাতাই বদলে গেল। এটাই WHERE ছাড়া UPDATE।",
  ],
  theory: [
    "Safe change routine: 1) write the SELECT with the WHERE you intend, 2) check the row count, 3) turn it into UPDATE or DELETE keeping the same WHERE, 4) for important data wrap it in BEGIN TRAN, check @@ROWCOUNT and then COMMIT or ROLLBACK. Multi-row inserts use one VALUES list with several tuples. Identity columns are skipped in the column list; SCOPE_IDENTITY() returns the new id. UPDATE with a join: UPDATE e SET e.Salary = e.Salary + 1000 FROM Employees e JOIN Departments d ON d.Id = e.DepartmentId WHERE d.Name = 'IT'. MERGE can insert, update and delete in one statement when syncing a staging table.",
    "নিরাপদ পরিবর্তনের নিয়ম: ১) যে WHERE চান তা দিয়ে SELECT লিখুন, ২) সারির সংখ্যা দেখুন, ৩) একই WHERE রেখে UPDATE বা DELETE বানান, ৪) জরুরি data হলে BEGIN TRAN-এ রেখে @@ROWCOUNT দেখে COMMIT বা ROLLBACK করুন। একাধিক সারি insert-এ একটি VALUES-এ কয়েকটি বন্ধনী। Identity column তালিকায় দিতে হয় না; SCOPE_IDENTITY() নতুন id দেয়। Join সহ UPDATE: UPDATE e SET ... FROM Employees e JOIN Departments d ...। Staging table মেলাতে MERGE একবারে insert, update, delete করে।",
  ],
  steps: [
    ["INSERT two students listing every required column.", "সব আবশ্যক column লিখে দুজন ছাত্র INSERT করুন।"],
    ["SELECT * to see the defaults that were filled in.", "SELECT * দিয়ে default মানগুলো দেখুন।"],
    ["UPDATE one student by StudentId and check '(1 row affected)'.", "StudentId দিয়ে একজনকে UPDATE করে '(1 row affected)' দেখুন।"],
    ["DELETE one student by StudentId and SELECT again.", "StudentId দিয়ে একজনকে DELETE করে আবার SELECT করুন।"],
  ],
  mistakes: [
    "Mistake: INSERT INTO Student VALUES (...) without a column list breaks when someone adds a column. Mistake: inserting a value into an IDENTITY column gives 'Cannot insert explicit value for identity column'. Mistake: highlighting only the first line of a DELETE in SSMS and running DELETE FROM Student alone, which wipes the table. Always run the full statement.",
    "ভুল: column তালিকা ছাড়া INSERT INTO Student VALUES (...) — কেউ column যোগ করলে ভাঙে। ভুল: IDENTITY column-এ মান দেওয়া — 'Cannot insert explicit value for identity column'। ভুল: SSMS-এ DELETE-এর শুধু প্রথম লাইন select করে চালানো, ফলে পুরো table মুছে যায়। সবসময় পুরো statement চালান।",
  ],
  interview: [
    "Q: How do you get the id of the row you just inserted? A: Use SCOPE_IDENTITY(), which returns the last identity value in the current scope, or OUTPUT inserted.StudentId. Avoid @@IDENTITY because a trigger inserting into another table can change it.",
    "প্রশ্ন: এইমাত্র insert করা সারির id কীভাবে পাবেন? উত্তর: SCOPE_IDENTITY() (বর্তমান scope-এর শেষ identity) বা OUTPUT inserted.StudentId। @@IDENTITY এড়িয়ে চলুন, কারণ trigger অন্য table-এ insert করলে তা বদলে যায়।",
  ],
  dEn: "In applications, run CRUD with parameters (EF Core, Dapper or SqlCommand) and never by concatenating user input. Return the affected row count to detect 'not found' (0 rows) versus success. Prefer soft delete and audit columns (CreatedAt, UpdatedAt, UpdatedBy) for business data so changes can be traced.",
  dBn: "App-এ CRUD চালান parameter দিয়ে (EF Core, Dapper, SqlCommand), user input জুড়ে কখনো নয়। কত সারি বদলাল দেখে 'পাওয়া যায়নি' (০) আর সফলতা আলাদা করুন। ব্যবসায়িক data-য় soft delete আর audit column (CreatedAt, UpdatedAt, UpdatedBy) রাখুন, যাতে পরিবর্তন খুঁজে পাওয়া যায়।",
  examples: [
    tsql(
      "Full CRUD on the Student table · Student-এ পুরো CRUD",
      `INSERT INTO Student (StudentName, FatherName, MotherName, Email, SecondaryEmail, DOB, Age, IsAdult)
VALUES ('Rohan',   'XYZ', 'PQR', 'rohan@mail.com',   NULL, '1995-08-08', 30, 1),
       ('Vaibhav', '123', '789', 'vaibhav@mail.com', NULL, '1995-08-08', 19, 0);
SELECT SCOPE_IDENTITY() AS LastId;
SELECT StudentId, StudentName, Email, Age FROM Student;
UPDATE Student
SET StudentName = 'Parul', Email = 'parul@gmail.com', Age = 21
WHERE StudentId = 2;
SELECT @@ROWCOUNT AS Updated;
DELETE FROM Student WHERE StudentId = 2;
SELECT StudentId, StudentName FROM Student;`,
      "LastId\n2\n\nStudentId  StudentName  Email             Age\n1          Rohan        rohan@mail.com    30\n2          Vaibhav      vaibhav@mail.com  19\n\nUpdated\n1\n\nStudentId  StudentName\n1          Rohan",
    ),
    lite(
      "CRUD on the sample Employees table · Employees-এ CRUD",
      `INSERT INTO Employees (Id, Name, DepartmentId, Salary, ManagerId) VALUES (7, 'Jyoti', 2, 70000, 3);
UPDATE Employees SET Salary = Salary + 5000 WHERE Id = 7;
SELECT Id, Name, Salary FROM Employees WHERE Id = 7;
DELETE FROM Employees WHERE Id = 7;
SELECT COUNT(*) AS RowsLeft FROM Employees;`,
    ),
  ],
});

chapter("Table Variables", {
  en: "DECLARE @t TABLE (...) creates a table-typed variable. Its rows live in tempdb (not only in memory, despite the common myth) but its scope is the batch, function or procedure that declared it, exactly like a scalar variable. It supports PRIMARY KEY, UNIQUE, CHECK and DEFAULT inline constraints, and since SQL Server 2014 inline indexes. Changes to a table variable are not undone by ROLLBACK, which makes it useful for keeping error logs inside a failed transaction.",
  bn: "DECLARE @t TABLE (...) একটি table-type variable বানায়। এর সারি tempdb-তে থাকে (শুধু memory-তে নয়, প্রচলিত ভুল ধারণার উল্টো), কিন্তু scope ঠিক scalar variable-এর মতো: যে batch, function বা procedure ঘোষণা করেছে সেখানেই। এতে PRIMARY KEY, UNIQUE, CHECK, DEFAULT চলে, SQL Server 2014 থেকে inline index-ও। ROLLBACK table variable-এর পরিবর্তন ফেরায় না — তাই ব্যর্থ transaction-এর ভেতরেও error log রাখতে কাজে লাগে।",
  story: [
    "A table variable is like a small whiteboard you carry into a meeting. You write a short list on it, discuss it, and wipe it when you leave the room. Nobody in another room can see it, and it is not meant for a thousand lines.",
    "Table variable হলো meeting-এ নিয়ে যাওয়া ছোট whiteboard। তাতে ছোট একটি তালিকা লেখেন, আলোচনা করেন, ঘর থেকে বের হওয়ার সময় মুছে ফেলেন। অন্য ঘরের কেউ দেখে না, আর হাজার লাইনের জন্য এটি নয়।",
  ],
  theory: [
    "Use table variables for small sets: a list of ids to process, the result of a multi-statement table-valued function, or rows collected inside a loop. Because the optimizer historically assumed one row, large table variables can produce poor plans; SQL Server 2019 added deferred compilation that uses the real row count. You cannot ALTER a table variable after declaring it, and you cannot SELECT ... INTO a table variable; use INSERT INTO @t SELECT .... Table-valued parameters (CREATE TYPE ... AS TABLE) let C# send a whole DataTable to a stored procedure, which is the safe replacement for comma-separated id strings.",
    "ছোট সেটের জন্য table variable: process করার id তালিকা, multi-statement TVF-এর ফল, বা loop-এ জমানো সারি। Optimizer আগে ধরে নিত একটিই সারি, তাই বড় table variable খারাপ plan দিত; SQL Server 2019 আসল সংখ্যা ব্যবহার করে। ঘোষণার পরে ALTER করা যায় না, SELECT ... INTO-ও চলে না; INSERT INTO @t SELECT ... লিখুন। Table-valued parameter (CREATE TYPE ... AS TABLE) দিয়ে C# পুরো DataTable procedure-এ পাঠাতে পারে — comma দেওয়া id string-এর নিরাপদ বিকল্প।",
  ],
  steps: [
    ["DECLARE @employee TABLE with columns.", "Column সহ DECLARE @employee TABLE লিখুন।"],
    ["INSERT a few rows, or INSERT ... SELECT from a real table.", "কয়েকটি সারি INSERT করুন বা আসল table থেকে INSERT ... SELECT।"],
    ["SELECT, JOIN or aggregate the table variable.", "Table variable-এ SELECT, JOIN বা aggregate করুন।"],
    ["Run all lines in one execution.", "সব লাইন এক run-এ চালান।"],
  ],
  mistakes: [
    "Mistake: running the SELECT separately from the DECLARE. Mistake: using a table variable for 100,000 rows and wondering why joins are slow; switch to a #temp table. Mistake: expecting ROLLBACK to empty the table variable; it keeps its rows.",
    "ভুল: DECLARE থেকে আলাদা করে SELECT চালানো। ভুল: ১ লক্ষ সারির জন্য table variable ব্যবহার করে join ধীর দেখে অবাক হওয়া; #temp table নিন। ভুল: ROLLBACK table variable খালি করবে ভাবা; সারি থেকেই যায়।",
  ],
  interview: [
    "Q: Table variable vs temp table? A: Table variables are batch-scoped, cannot be altered, are not affected by ROLLBACK and historically have no statistics. Temp tables are session-scoped, support ALTER, indexes and statistics, and take part in transactions. Use table variables for small data, temp tables for large or heavily joined data.",
    "প্রশ্ন: Table variable বনাম temp table? উত্তর: Table variable batch পর্যন্ত, ALTER চলে না, ROLLBACK-এ প্রভাবিত হয় না, আগে statistics ছিল না। Temp table session পর্যন্ত, ALTER, index, statistics চলে, transaction-এ অংশ নেয়। ছোট data-য় table variable, বড় বা বেশি join-এ temp table।",
  ],
  dEn: "Default to a table variable when you expect fewer than about a hundred rows and the code is short. Measure with the actual execution plan when in doubt. Do not keep large business data in table variables inside long procedures.",
  dBn: "প্রায় একশোর কম সারি আর ছোট code হলে table variable দিয়ে শুরু করুন। সন্দেহ হলে actual execution plan দিয়ে মাপুন। লম্বা procedure-এ বড় ব্যবসায়িক data table variable-এ রাখবেন না।",
  examples: [
    tsql(
      "Table variable filled from a query · query থেকে ভরা",
      `DECLARE @employee TABLE (
    EmpName VARCHAR(50),
    Email   VARCHAR(50),
    DOB     DATE
);
INSERT INTO @employee (EmpName, Email, DOB) VALUES ('rohan', 'rohan@gmail.com', '1995-08-08');
INSERT INTO @employee (EmpName, Email, DOB) VALUES ('rahim', 'rahim@gmail.com', '1998-01-15');
INSERT INTO @employee (EmpName, Email, DOB)
SELECT EmpName, NULL, NULL FROM Employee WHERE EmpId = 2;
SELECT * FROM @employee;
SELECT COUNT(*) AS Total FROM @employee;`,
      "EmpName  Email            DOB\nrohan    rohan@gmail.com  1995-08-08\nrahim    rahim@gmail.com  1998-01-15\nNadia    NULL             NULL\n\nTotal\n3",
    ),
    tsql(
      "ROLLBACK does not undo a table variable · ROLLBACK-এ মুছে না",
      `DECLARE @log TABLE (Msg VARCHAR(100));
BEGIN TRANSACTION;
    INSERT INTO @log VALUES ('Step 1 started');
    INSERT INTO Employee (EmpName) VALUES ('Temp person');
ROLLBACK;
SELECT * FROM @log;                       -- still has 1 row
SELECT COUNT(*) FROM Employee WHERE EmpName = 'Temp person';  -- 0`,
      "Msg\nStep 1 started\n\n(No column name)\n0",
    ),
  ],
});

chapter("Temporary Tables (# and ##)", {
  en: "Temporary tables are created in the tempdb system database. A local temp table name starts with one # and is private to the session; if created inside a stored procedure it is dropped automatically when the procedure ends. A global temp table name starts with ## and every session can read and write it until the creating session ends and the last statement using it finishes. Temp tables behave like real tables: they support ALTER, indexes, constraints, statistics and transactions, so the optimizer can make good plans for large intermediate results.",
  bn: "Temporary table তৈরি হয় tempdb system database-এ। Local temp table-এর নাম এক # দিয়ে শুরু, শুধু সেই session-এর; procedure-এর ভেতরে বানালে procedure শেষ হলেই মুছে যায়। Global temp table-এর নাম ## দিয়ে শুরু, বানানো session শেষ না হওয়া পর্যন্ত সব session পড়তে-লিখতে পারে। Temp table আসল table-এর মতো: ALTER, index, constraint, statistics, transaction সব চলে — তাই বড় মধ্যবর্তী ফলে optimizer ভালো plan বানায়।",
  story: [
    "A local temp table is your personal rough notebook during an exam: only you see it and the invigilator collects it at the end. A global temp table is the notice board in the exam hall: everyone in the building can read it until the hall is closed.",
    "Local temp table হলো পরীক্ষার সময় নিজের খসড়া খাতা: শুধু আপনিই দেখেন, শেষে পরিদর্শক নিয়ে যান। Global temp table হলো পরীক্ষার হলের notice board: হল বন্ধ না হওয়া পর্যন্ত ভবনের সবাই পড়তে পারে।",
  ],
  theory: [
    "Each query window in SSMS is a separate session (see the SPID number in its tab). That is why SELECT * FROM #Employee works in the window that created it but gives 'Invalid object name #Employee' in another window, while ##Employee works in both. SQL Server internally appends a long suffix to local temp table names so two sessions can each have their own #Employee. Typical uses: breaking a complex report into steps, storing the result of an expensive query that is joined several times, or staging imported rows before validation. Create indexes on temp tables after loading data for best performance, and DROP them when done to free tempdb space early.",
    "SSMS-এর প্রতিটি query window আলাদা session (tab-এ SPID নম্বর দেখুন)। তাই যে window #Employee বানিয়েছে সেখানে SELECT চলে, কিন্তু অন্য window-তে 'Invalid object name #Employee', অথচ ##Employee দুই জায়গায় চলে। SQL Server local temp table-এর নামের শেষে লম্বা suffix জুড়ে দেয়, ফলে দুই session-এর নিজস্ব #Employee থাকতে পারে। সাধারণ ব্যবহার: জটিল report ধাপে ভাগ করা, ব্যয়বহুল query-র ফল জমিয়ে কয়েকবার join করা, import করা সারি যাচাইয়ের আগে রাখা। Data ভরার পরে index বানান, কাজ শেষে DROP করে tempdb খালি করুন।",
  ],
  steps: [
    ["In window 1 create #Employee and insert a row.", "Window ১-এ #Employee বানিয়ে একটি সারি দিন।"],
    ["Open window 2 and try SELECT * FROM #Employee; read the error.", "Window ২ খুলে SELECT * FROM #Employee চেষ্টা করে error পড়ুন।"],
    ["Create ##Employee in window 1 and read it from window 2.", "Window ১-এ ##Employee বানিয়ে window ২ থেকে পড়ুন।"],
    ["Close window 1 and see that both tables disappear.", "Window ১ বন্ধ করে দেখুন দুটো table-ই নেই।"],
  ],
  mistakes: [
    "Mistake: creating ##Report in a procedure that many users run at once; they overwrite each other. Use #Report. Mistake: SELECT ... INTO #t inside a loop without dropping it first gives 'There is already an object named #t'. Use DROP TABLE IF EXISTS #t. Mistake: forgetting that a temp table created inside a procedure is gone after it returns.",
    "ভুল: অনেক user একসাথে চালায় এমন procedure-এ ##Report বানানো; একে অপরের data নষ্ট করে। #Report নিন। ভুল: loop-এর ভেতরে আগে না মুছে SELECT ... INTO #t — 'There is already an object named #t'। DROP TABLE IF EXISTS #t দিন। ভুল: ভুলে যাওয়া যে procedure-এর ভেতরে বানানো temp table procedure শেষ হলে আর থাকে না।",
  ],
  interview: [
    "Q: Where are temporary tables stored and when are they dropped? A: In tempdb. A local #table is dropped when the session ends or the procedure that created it finishes; a global ##table is dropped when the creating session ends and no other session is still using it.",
    "প্রশ্ন: Temporary table কোথায় থাকে আর কখন মুছে যায়? উত্তর: tempdb-তে। Local #table মুছে যায় session শেষ হলে বা যে procedure বানিয়েছে তা শেষ হলে; global ##table মুছে যায় বানানো session শেষ হলে আর অন্য কেউ ব্যবহার না করলে।",
  ],
  dEn: "Prefer local temp tables; global temp tables are rarely needed and create concurrency risks. Use SELECT ... INTO #t for quick prototypes and an explicit CREATE TABLE #t with types and keys in production code. Watch tempdb size on busy servers.",
  dBn: "Local temp table-ই বেছে নিন; global খুব কম লাগে আর একসাথে চলার ঝুঁকি আনে। দ্রুত পরীক্ষায় SELECT ... INTO #t, production code-এ type ও key সহ CREATE TABLE #t। ব্যস্ত server-এ tempdb-এর আকার নজরে রাখুন।",
  examples: [
    tsql(
      "Local and global temp tables · local ও global",
      `---Local :- current session only
DROP TABLE IF EXISTS #Employee;
CREATE TABLE #Employee (
    EmpName VARCHAR(50) NULL,
    Email   VARCHAR(50) NULL
);
INSERT INTO #Employee VALUES ('Rohan', 'rohan@gmail.com');
SELECT * FROM #Employee;
---Global :- visible to every session
DROP TABLE IF EXISTS ##Employee;
CREATE TABLE ##Employee (
    EmpId   INT PRIMARY KEY IDENTITY(1,1),
    EmpName VARCHAR(50) NULL,
    Email   VARCHAR(50) NULL
);
INSERT INTO ##Employee (EmpName, Email) VALUES ('Nadia', 'nadia@gmail.com');
SELECT * FROM ##Employee;
-- In a second window: SELECT * FROM #Employee  -> Msg 208 Invalid object name '#Employee'.`,
      "EmpName  Email\nRohan    rohan@gmail.com\n\nEmpId  EmpName  Email\n1      Nadia    nadia@gmail.com",
    ),
    lite(
      "SQLite TEMP table built from a query · query থেকে TEMP table",
      `DROP TABLE IF EXISTS HighEarners;
CREATE TEMP TABLE HighEarners AS
SELECT Id, Name, Salary FROM Employees WHERE Salary >= 65000;
SELECT * FROM HighEarners ORDER BY Salary DESC;`,
    ),
  ],
});

chapter("CTE (Common Table Expression)", {
  en: "A Common Table Expression gives a name to a query so the main statement can refer to it like a table. Syntax: WITH CteName (optional column list) AS (inner query) followed immediately by SELECT, INSERT, UPDATE, DELETE or MERGE that uses it. Several CTEs can be chained with commas, and a later CTE may use an earlier one. A CTE is expanded into the main query at execution time; it is not materialised or stored, so it behaves like a readable, reusable subquery.",
  bn: "Common Table Expression একটি query-কে নাম দেয়, যাতে মূল statement তাকে table-এর মতো ব্যবহার করতে পারে। গঠন: WITH CteName AS (ভেতরের query), তারপর সাথে সাথে SELECT, INSERT, UPDATE, DELETE বা MERGE। কমা দিয়ে কয়েকটি CTE পরপর লেখা যায়, পরেরটি আগেরটিকে ব্যবহার করতে পারে। Execution-এর সময় CTE মূল query-তে মিশে যায়; জমা থাকে না — পড়তে সহজ, পুনর্ব্যবহারযোগ্য subquery-র মতো।",
  story: [
    "When cooking biryani you first prepare the rice, then the masala, then layer them. A CTE is giving each preparation a name, 'Rice' and 'Masala', so the final step reads simply: layer Rice with Masala. Nobody keeps the bowls after dinner.",
    "বিরিয়ানি রান্নায় আগে চাল, তারপর মশলা প্রস্তুত, শেষে স্তর করে সাজানো। CTE মানে প্রতিটি প্রস্তুতির নাম দেওয়া — 'চাল' আর 'মশলা' — যাতে শেষ ধাপ সহজে পড়া যায়: চাল আর মশলা স্তর করো। খাওয়ার পরে বাটিগুলো কেউ রাখে না।",
  ],
  theory: [
    "Because WITH is also used in other T-SQL syntax, the statement before a CTE must end with a semicolon, which is why many people write ;WITH. A recursive CTE has an anchor member (the starting rows, for example the CEO whose ManagerId IS NULL) UNION ALL a recursive member that joins the CTE to the table to find the next level. SQL Server repeats the recursive part until it returns no rows or reaches MAXRECURSION (100 by default, 0 means unlimited). CTEs are also handy with window functions, because you cannot filter on a window function in WHERE directly: compute the rank in a CTE and filter in the outer query. Updating through a CTE updates the base table.",
    "WITH অন্য T-SQL গঠনেও ব্যবহার হয়, তাই CTE-এর আগের statement সেমিকোলন দিয়ে শেষ করতে হয় — এজন্য অনেকে ;WITH লেখেন। Recursive CTE-তে থাকে anchor অংশ (শুরুর সারি, যেমন যার ManagerId IS NULL) UNION ALL recursive অংশ, যা CTE-কে table-এর সাথে join করে পরের স্তর খোঁজে। নতুন সারি না আসা পর্যন্ত বা MAXRECURSION (default ১০০) পর্যন্ত চলে। Window function-এর সাথেও CTE কাজে লাগে, কারণ WHERE-এ সরাসরি window function ছাঁকা যায় না: CTE-তে rank করে বাইরে ছাঁকুন। CTE-এর মাধ্যমে UPDATE করলে আসল table বদলায়।",
  ],
  steps: [
    ["Write the inner SELECT and run it alone first.", "আগে ভেতরের SELECT একা চালিয়ে দেখুন।"],
    ["Wrap it: ;WITH StudentCTE AS ( ... ).", "মোড়ান: ;WITH StudentCTE AS ( ... )।"],
    ["Add the main SELECT that reads StudentCTE right after it.", "ঠিক পরে StudentCTE পড়ে এমন মূল SELECT লিখুন।"],
    ["Try chaining a second CTE separated by a comma.", "কমা দিয়ে দ্বিতীয় CTE জুড়ে দেখুন।"],
  ],
  mistakes: [
    "Mistake: 'Incorrect syntax near the keyword with' because the previous statement had no semicolon. Mistake: putting another statement between the CTE and the query that uses it. Mistake: a recursive CTE without a stopping condition, which fails after 100 levels with 'The maximum recursion 100 has been exhausted'.",
    "ভুল: আগের statement-এ সেমিকোলন না থাকায় 'Incorrect syntax near the keyword with'। ভুল: CTE আর তার ব্যবহারকারী query-র মাঝে অন্য statement রাখা। ভুল: থামার শর্ত ছাড়া recursive CTE — ১০০ স্তরের পরে 'maximum recursion 100 has been exhausted'।",
  ],
  interview: [
    "Q: CTE vs temp table vs subquery? A: A subquery and a CTE are both inline; the CTE is just more readable, can be referenced several times in one statement and can be recursive. A temp table stores data physically in tempdb, survives across statements and can be indexed. Choose a temp table when the intermediate result is large or reused by several statements.",
    "প্রশ্ন: CTE, temp table আর subquery-র পার্থক্য? উত্তর: Subquery ও CTE দুটোই inline; CTE পড়তে সহজ, এক statement-এ কয়েকবার ব্যবহার করা যায়, recursive হতে পারে। Temp table tempdb-তে আসলে data রাখে, কয়েকটি statement জুড়ে থাকে, index দেওয়া যায়। মধ্যবর্তী ফল বড় বা কয়েকটি statement-এ লাগলে temp table নিন।",
  ],
  dEn: "Use CTEs to make long reports readable and for hierarchies (org charts, categories, bill of materials). If the same CTE is referenced many times in a heavy query, SQL Server may compute it repeatedly; materialise it into a #temp table in that case.",
  dBn: "লম্বা report পড়তে সহজ করতে আর স্তরভিত্তিক data-য় (org chart, category) CTE ব্যবহার করুন। ভারী query-তে একই CTE বহুবার লাগলে SQL Server বারবার হিসাব করতে পারে; তখন #temp table-এ রেখে দিন।",
  examples: [
    tsql(
      "Simple CTE and a recursive manager tree · সাধারণ ও recursive CTE",
      `;WITH StudentCTE AS (
    SELECT StudentName, FatherName, MotherName FROM Student
)
SELECT * FROM StudentCTE;
;WITH OrgChart AS (
    SELECT EmployeeId, FirstName, ReportsTo, 0 AS Level
    FROM Employees WHERE ReportsTo IS NULL          -- anchor: the boss
    UNION ALL
    SELECT e.EmployeeId, e.FirstName, e.ReportsTo, o.Level + 1
    FROM Employees e JOIN OrgChart o ON e.ReportsTo = o.EmployeeId
)
SELECT REPLICATE('  ', Level) + FirstName AS Tree, Level
FROM OrgChart ORDER BY Level, FirstName;`,
      "StudentName  FatherName  MotherName\nRohan        XYZ         PQR\n\nTree             Level\nAndrew           0\n  Janet          1\n  Laura          1\n  Margaret       1\n  Nancy          1\n  Steven         1\n    Anne         2\n    Michael      2\n    Robert       2",
    ),
    lite(
      "Recursive CTE on the sample data · sample data-য় recursive CTE",
      `WITH RECURSIVE Chain AS (
  SELECT Id, Name, ManagerId, 0 AS Level FROM Employees WHERE ManagerId IS NULL
  UNION ALL
  SELECT e.Id, e.Name, e.ManagerId, c.Level + 1
  FROM Employees e JOIN Chain c ON e.ManagerId = c.Id
)
SELECT Level, Name, ManagerId FROM Chain ORDER BY Level, Name;`,
    ),
  ],
});

chapter("ISNULL, COALESCE & NULL", {
  en: "SQL uses three-valued logic: TRUE, FALSE and UNKNOWN. Any comparison with NULL (=, <>, >, <) is UNKNOWN, and WHERE keeps only TRUE rows, so WHERE Email = NULL never matches. Use IS NULL and IS NOT NULL. Functions that deal with NULL: ISNULL(a, b) returns b when a is NULL; COALESCE(a, b, c, ...) returns the first non-NULL argument; NULLIF(a, b) returns NULL when a equals b, which prevents divide-by-zero (Total / NULLIF(Count, 0)). Aggregates such as SUM, AVG, MIN and MAX ignore NULLs, and COUNT(column) counts only non-NULL values.",
  bn: "SQL তিন মানের যুক্তি ব্যবহার করে: TRUE, FALSE, UNKNOWN। NULL-এর সাথে যেকোনো তুলনা (=, <>, >) UNKNOWN, আর WHERE শুধু TRUE রাখে — তাই WHERE Email = NULL কখনো মেলে না; IS NULL ও IS NOT NULL লিখুন। NULL সামলানোর function: ISNULL(a, b) — a NULL হলে b; COALESCE(a, b, c) — প্রথম non-NULL; NULLIF(a, b) — a আর b সমান হলে NULL, যা শূন্য দিয়ে ভাগ আটকায় (Total / NULLIF(Count, 0))। SUM, AVG, MIN, MAX NULL বাদ দেয়, COUNT(column) শুধু non-NULL গোনে।",
  story: [
    "A teacher's register has a blank in the phone column for a new student. Blank does not mean phone number zero; it means 'we do not know yet'. When printing the list, the teacher writes 'N/A' in the blanks so the printout looks clean. ISNULL is that pen.",
    "শিক্ষকের রেজিস্টারে নতুন ছাত্রের ফোনের ঘর ফাঁকা। ফাঁকা মানে ফোন নম্বর শূন্য নয়, মানে 'এখনো জানি না'। তালিকা ছাপানোর সময় শিক্ষক ফাঁকা ঘরে 'N/A' লিখে দেন, যাতে দেখতে পরিষ্কার লাগে। ISNULL সেই কলম।",
  ],
  theory: [
    "ISNULL and COALESCE differ in small but important ways. ISNULL takes exactly two arguments and the result has the data type and length of the first argument, so ISNULL(@shortVarchar5, 'Not available') is cut to 5 characters. COALESCE accepts many arguments and follows data type precedence. ISNULL is evaluated once; COALESCE is rewritten as a CASE expression and can evaluate a subquery twice. For DATE columns the replacement must also be a date, so convert first when you want text: ISNULL(CONVERT(VARCHAR(10), Dob, 105), 'N/A'). NULLs sort first in ascending ORDER BY in SQL Server. A NOT IN subquery that returns a single NULL makes the whole condition UNKNOWN and returns no rows; use NOT EXISTS instead.",
    "ISNULL আর COALESCE-এ ছোট কিন্তু জরুরি পার্থক্য আছে। ISNULL ঠিক দুটি argument নেয়, ফলের type ও দৈর্ঘ্য প্রথম argument-এর — তাই ISNULL(@ছোট_VARCHAR5, 'Not available') ৫ অক্ষরে কাটা পড়ে। COALESCE অনেক argument নেয়, type precedence মানে। ISNULL একবার হিসাব হয়; COALESCE CASE-এ বদলে যায়, subquery দুইবার চলতে পারে। DATE column-এ বিকল্পও তারিখ হতে হবে, তাই লেখা চাইলে আগে convert করুন। SQL Server-এ ascending ORDER BY-তে NULL আগে আসে। NOT IN subquery একটি NULL দিলেই পুরো শর্ত UNKNOWN, কোনো সারি আসে না; NOT EXISTS দিন।",
  ],
  steps: [
    ["Find columns that allow NULL in the table design.", "Table design-এ কোন column NULL নেয় দেখুন।"],
    ["Select them raw and notice NULL in the grid.", "সরাসরি select করে grid-এ NULL দেখুন।"],
    ["Wrap with ISNULL or COALESCE to show a friendly value.", "ISNULL বা COALESCE দিয়ে সুন্দর মান দেখান।"],
    ["Filter missing data with IS NULL, never = NULL.", "অনুপস্থিত data ছাঁকুন IS NULL দিয়ে, = NULL নয়।"],
  ],
  mistakes: [
    "Mistake: ISNULL(Dob, 'N/A') on a DATE column fails with 'Conversion failed when converting date and/or time from character string'. Mistake: AVG(Bonus) ignoring NULL bonuses when the business meant 'no bonus = 0'; use AVG(ISNULL(Bonus, 0)). Mistake: string + NULL returns NULL, so FirstName + ' ' + MiddleName loses the whole name; use CONCAT.",
    "ভুল: DATE column-এ ISNULL(Dob, 'N/A') — 'Conversion failed' error। ভুল: AVG(Bonus) NULL বাদ দেয়, অথচ ব্যবসায় 'bonus নেই = 0'; AVG(ISNULL(Bonus, 0)) লিখুন। ভুল: লেখা + NULL = NULL, তাই FirstName + ' ' + MiddleName পুরো নাম হারায়; CONCAT দিন।",
  ],
  interview: [
    "Q: Why does WHERE Col = NULL return nothing? A: Because comparing anything with NULL yields UNKNOWN, not TRUE, and WHERE keeps only TRUE rows. Use WHERE Col IS NULL. Q: ISNULL vs COALESCE? A: ISNULL is SQL Server specific with two arguments and the first argument's type; COALESCE is ANSI standard, accepts many arguments and uses type precedence.",
    "প্রশ্ন: WHERE Col = NULL কেন কিছু দেয় না? উত্তর: NULL-এর সাথে তুলনা UNKNOWN দেয়, TRUE নয়, আর WHERE শুধু TRUE রাখে। WHERE Col IS NULL লিখুন। প্রশ্ন: ISNULL বনাম COALESCE? উত্তর: ISNULL SQL Server-এর, দুই argument, প্রথমটির type; COALESCE ANSI standard, অনেক argument, type precedence মানে।",
  ],
  dEn: "Decide per column whether NULL has a real meaning (unknown) or whether a NOT NULL with a DEFAULT is clearer. Replace NULLs for display at the edge (report or UI) rather than storing fake values such as 'N/A' in the table.",
  dBn: "প্রতিটি column-এর জন্য ঠিক করুন NULL-এর আসল অর্থ (অজানা) আছে কি না, নাকি DEFAULT সহ NOT NULL পরিষ্কার। দেখানোর সময় (report বা UI) NULL বদলান, table-এ 'N/A'-এর মতো নকল মান জমাবেন না।",
  examples: [
    tsql(
      "Clean NULLs for a report · report-এর জন্য NULL পরিষ্কার",
      `SELECT EmpName,
       ISNULL(CONVERT(VARCHAR(10), Dob, 105), 'N/A') AS Dob,
       ISNULL(Email, 'N/A') AS Email,
       COALESCE(Phone, SecondaryEmail, Email, 'No contact') AS Contact
FROM Employee;
SELECT COUNT(*) AS AllRows, COUNT(Email) AS WithEmail FROM Employee;
SELECT 1000 / NULLIF(0, 0) AS SafeDivide;   -- NULL, not an error`,
      "EmpName  Dob         Email            Contact\nrohan    08-08-1995  rohan@gmail.com  rohan@gmail.com\nNadia    N/A         N/A              No contact\n\nAllRows  WithEmail\n2        1\n\nSafeDivide\nNULL",
    ),
    lite(
      "NULL department in the sample data · sample data-য় NULL",
      `SELECT Name,
       IFNULL(DepartmentId, 0)                      AS DeptOrZero,
       COALESCE(CAST(ManagerId AS TEXT), 'No manager') AS Manager
FROM Employees;
SELECT COUNT(*) AS AllRows, COUNT(DepartmentId) AS WithDept FROM Employees;
SELECT Name FROM Employees WHERE DepartmentId IS NULL;`,
    ),
  ],
});

chapter("Aggregate Functions: MIN, MAX", {
  en: "Aggregate functions compute a single summary value from a set of rows. The core five are COUNT, SUM, AVG, MIN and MAX; SQL Server also offers STDEV, VAR, STRING_AGG and COUNT_BIG. Without GROUP BY the whole result is one group and you get one row. With GROUP BY col, SQL Server splits rows into groups that share the same value and returns one row per group. The logical order of processing is FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, which explains why WHERE cannot use an aggregate but HAVING can.",
  bn: "Aggregate function অনেক সারি থেকে একটি সারাংশ মান দেয়। মূল পাঁচটি COUNT, SUM, AVG, MIN, MAX; SQL Server-এ STDEV, STRING_AGG, COUNT_BIG-ও আছে। GROUP BY না দিলে পুরোটা এক দল, ফল একটি সারি। GROUP BY col দিলে একই মানের সারিগুলো দলে ভাগ হয়, প্রতিটি দলের জন্য একটি সারি। যুক্তির ক্রম: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY — তাই WHERE-এ aggregate চলে না, HAVING-এ চলে।",
  story: [
    "After a cricket series the scorer does not read out every ball. He announces the highest score (MAX), the lowest (MIN), total runs (SUM), average (AVG) and number of matches (COUNT). If he announces them separately for each team, that is GROUP BY team. If he only mentions teams whose average is above 250, that is HAVING.",
    "Cricket series শেষে scorer প্রতিটি বল পড়ে শোনান না। তিনি বলেন সর্বোচ্চ রান (MAX), সর্বনিম্ন (MIN), মোট রান (SUM), গড় (AVG), ম্যাচ সংখ্যা (COUNT)। প্রতিটি দলের জন্য আলাদা বললে তা GROUP BY team। শুধু যাদের গড় ২৫০-এর বেশি তাদের কথা বললে তা HAVING।",
  ],
  theory: [
    "The course practises on the Northwind sample database (Products, Orders, [Order Details], Employees, Customers), which you can download from Microsoft's sql-server-samples repository. MIN and MAX return a value, not a row, so to see which product is the cheapest you need ORDER BY UnitPrice ASC with TOP 1, or a subquery: WHERE UnitPrice = (SELECT MIN(UnitPrice) FROM Products). AVG on an INT column returns an INT (integer division), so AVG(CAST(Quantity AS DECIMAL(10,2))) gives decimals. COUNT(*) counts rows including NULLs, COUNT(col) skips NULLs and COUNT(DISTINCT col) counts different values. GROUP BY can use several columns, and ROLLUP adds subtotal rows.",
    "Course অনুশীলন করে Northwind sample database-এ (Products, Orders, [Order Details], Employees, Customers) — Microsoft-এর sql-server-samples repository থেকে নামানো যায়। MIN ও MAX মান দেয়, সারি নয়; তাই কোন product সবচেয়ে সস্তা জানতে TOP 1 সহ ORDER BY UnitPrice বা subquery লাগে: WHERE UnitPrice = (SELECT MIN(UnitPrice) FROM Products)। INT column-এ AVG INT দেয় (পূর্ণসংখ্যা ভাগ), দশমিক চাইলে AVG(CAST(Quantity AS DECIMAL(10,2)))। COUNT(*) NULL সহ সব সারি, COUNT(col) NULL বাদ, COUNT(DISTINCT col) আলাদা মান গোনে। GROUP BY-তে কয়েকটি column চলে, ROLLUP subtotal সারি যোগ করে।",
  ],
  steps: [
    ["Run SELECT MIN(UnitPrice), MAX(UnitPrice) FROM Products.", "SELECT MIN(UnitPrice), MAX(UnitPrice) FROM Products চালান।"],
    ["Add GROUP BY CategoryId and the column in SELECT.", "GROUP BY CategoryId আর SELECT-এ সেই column দিন।"],
    ["Filter rows first with WHERE (for example Discontinued = 0).", "আগে WHERE দিয়ে সারি ছাঁকুন (যেমন Discontinued = 0)।"],
    ["Filter groups with HAVING MIN(UnitPrice) > 50.", "HAVING MIN(UnitPrice) > 50 দিয়ে দল ছাঁকুন।"],
  ],
  mistakes: [
    "Mistake: SELECT ProductName, MIN(UnitPrice) FROM Products without GROUP BY gives 'Column Products.ProductName is invalid in the select list because it is not contained in either an aggregate function or the GROUP BY clause'. Mistake: using WHERE MIN(UnitPrice) > 50, which is not allowed; use HAVING. Mistake: expecting AVG of integers to have decimals.",
    "ভুল: GROUP BY ছাড়া SELECT ProductName, MIN(UnitPrice) — 'is invalid in the select list' error। ভুল: WHERE MIN(UnitPrice) > 50 লেখা, যা চলে না; HAVING দিন। ভুল: পূর্ণসংখ্যার AVG-এ দশমিক আশা করা।",
  ],
  interview: [
    "Q: Difference between WHERE and HAVING? A: WHERE filters individual rows before grouping and cannot contain aggregates; HAVING filters groups after GROUP BY and can use aggregates. A query can have both: WHERE Country = 'USA' GROUP BY City HAVING COUNT(*) > 2.",
    "প্রশ্ন: WHERE আর HAVING-এর পার্থক্য? উত্তর: WHERE দল বানানোর আগে প্রতিটি সারি ছাঁকে, aggregate চলে না; HAVING GROUP BY-এর পরে দল ছাঁকে, aggregate চলে। একই query-তে দুটোই থাকতে পারে: WHERE Country = 'USA' GROUP BY City HAVING COUNT(*) > 2।",
  ],
  dEn: "Aggregate close to the data: let SQL Server calculate totals rather than loading all rows into C# and summing in memory. Index the GROUP BY and WHERE columns of frequent reports, and consider indexed views or summary tables for dashboards over very large data.",
  dBn: "Data-র কাছেই হিসাব করুন: সব সারি C#-এ এনে memory-তে যোগ না করে SQL Server-কে মোট বের করতে দিন। নিয়মিত report-এর GROUP BY ও WHERE column-এ index দিন, আর খুব বড় data-র dashboard-এ indexed view বা summary table ভাবুন।",
  examples: [
    tsql(
      "Northwind aggregates with GROUP BY and HAVING · Northwind-এ aggregate",
      `---Aggregate Functions: Sum, Avg, Count, Min, Max
SELECT MIN(UnitPrice) AS Cheapest, MAX(UnitPrice) AS Costliest,
       AVG(UnitPrice) AS AvgPrice, COUNT(*) AS Products
FROM Products;
SELECT TOP 1 ProductName, UnitPrice FROM Products ORDER BY UnitPrice ASC;
SELECT Country, COUNT(*) AS Employees
FROM Employees GROUP BY Country;
-- having
SELECT ProductName, MIN(UnitPrice) AS Price
FROM Products
GROUP BY ProductName
HAVING MIN(UnitPrice) > 50;`,
      "Cheapest  Costliest  AvgPrice  Products\n2.50      263.50     28.8663   77\n\nProductName  UnitPrice\nGeitost      2.50\n\nCountry  Employees\nUK       4\nUSA      5\n\nProductName               Price\nCarnarvon Tigers          62.50\nCôte de Blaye             263.50\nManjimup Dried Apples     53.00\nMishi Kobe Niku           97.00\nRaclette Courdavault      55.00\nSir Rodney's Marmalade    81.00\nThüringer Rostbratwurst   123.79",
    ),
    lite(
      "MIN, MAX, AVG per department · বিভাগভিত্তিক aggregate",
      `SELECT d.Name AS Department,
       COUNT(e.Id)   AS People,
       MIN(e.Salary) AS MinSalary,
       MAX(e.Salary) AS MaxSalary,
       ROUND(AVG(e.Salary), 2) AS AvgSalary
FROM Departments d
LEFT JOIN Employees e ON e.DepartmentId = d.Id
GROUP BY d.Name
HAVING COUNT(e.Id) >= 1
ORDER BY AvgSalary DESC;`,
    ),
  ],
});

chapter("UNION vs UNION ALL", {
  en: "Set operators combine whole result sets. UNION returns the distinct rows that appear in either query, UNION ALL returns every row from both queries, INTERSECT returns rows present in both, and EXCEPT returns rows in the first query that are not in the second. All of them require the same number of columns in the same order with compatible data types. The column names and types of the final result come from the first query.",
  bn: "Set operator পুরো ফলকে একত্র করে। UNION দুই query-র আলাদা (distinct) সারি দেয়, UNION ALL দুই দিকের সব সারি দেয়, INTERSECT দুটোতেই থাকা সারি দেয়, EXCEPT প্রথমটিতে আছে কিন্তু দ্বিতীয়টিতে নেই এমন সারি দেয়। সবগুলোতেই একই সংখ্যক column, একই ক্রমে, মেলানো type লাগে। শেষ ফলের column নাম ও type আসে প্রথম query থেকে।",
  story: [
    "Two classes submit their picnic lists. UNION is the teacher merging them and crossing out any student written twice. UNION ALL is simply stapling the two pages together, so a student who is on both lists appears twice. Stapling is faster than checking every name.",
    "দুই শ্রেণি পিকনিকের তালিকা জমা দিল। UNION মানে শিক্ষক তালিকা দুটি মিলিয়ে দুইবার লেখা নাম কেটে দেন। UNION ALL মানে শুধু দুই পাতা stapler দিয়ে জোড়া, তাই দুই তালিকায় থাকা ছাত্র দুইবার আসে। প্রতিটি নাম মেলানোর চেয়ে stapler দ্রুত।",
  ],
  theory: [
    "To remove duplicates, UNION has to sort or hash the combined rows, which costs CPU, memory and sometimes tempdb on large data; you can see a Distinct Sort or Hash Match operator in the execution plan. UNION ALL just appends, so it streams results immediately. A row counts as duplicate only if every selected column is equal, and NULLs are treated as equal for this purpose. ORDER BY may appear only once at the end and sorts the combined result; use column names from the first query or positions. Adding a literal column such as 'Old' AS Source to each query shows where each row came from.",
    "Duplicate সরাতে UNION-কে সব সারি sort বা hash করতে হয় — বড় data-য় CPU, memory, কখনো tempdb লাগে; execution plan-এ Distinct Sort বা Hash Match দেখা যায়। UNION ALL শুধু জুড়ে দেয়, সাথে সাথে ফল দেয়। প্রতিটি নির্বাচিত column সমান হলে তবেই duplicate, আর এক্ষেত্রে NULL-কে সমান ধরা হয়। ORDER BY একবারই, শেষে, পুরো ফল সাজায়। প্রতিটি query-তে 'Old' AS Source-এর মতো column যোগ করলে কোন সারি কোথা থেকে এল বোঝা যায়।",
  ],
  steps: [
    ["Write the first SELECT and the second SELECT with matching columns.", "মেলানো column সহ প্রথম ও দ্বিতীয় SELECT লিখুন।"],
    ["Join them with UNION and count the rows.", "UNION দিয়ে জুড়ে সারি গুনুন।"],
    ["Replace with UNION ALL and count again.", "UNION ALL দিয়ে বদলে আবার গুনুন।"],
    ["Add ORDER BY once at the very end.", "একেবারে শেষে একবার ORDER BY দিন।"],
  ],
  mistakes: [
    "Mistake: different column counts give 'All queries combined using a UNION operator must have an equal number of expressions'. Mistake: columns in a different order, so names fall under the wrong headings without any error. Mistake: using UNION to 'be safe' on millions of rows that cannot overlap, which wastes a large sort.",
    "ভুল: column সংখ্যা আলাদা — 'must have an equal number of expressions' error। ভুল: column-এর ক্রম আলাদা, ফলে error ছাড়াই নাম ভুল শিরোনামে যায়। ভুল: যে লক্ষ লক্ষ সারি কখনো মিলবে না সেখানে 'নিরাপদ থাকতে' UNION দেওয়া — বড় sort নষ্ট।",
  ],
  interview: [
    "Q: UNION vs UNION ALL, which is faster and why? A: UNION ALL, because it does not need to eliminate duplicates. UNION performs an extra distinct operation (sort or hash). Use UNION only when duplicates are possible and must be removed.",
    "প্রশ্ন: UNION আর UNION ALL-এর মধ্যে কোনটি দ্রুত, কেন? উত্তর: UNION ALL, কারণ duplicate সরাতে হয় না। UNION বাড়তি distinct কাজ (sort বা hash) করে। Duplicate হতে পারে আর সরাতেই হবে — শুধু তখনই UNION।",
  ],
  dEn: "Default to UNION ALL and switch to UNION only when the business rule requires distinct rows. If you need distinct rows from a single table, a WHERE with OR or IN is often simpler than two queries and a UNION.",
  dBn: "UNION ALL দিয়ে শুরু করুন, ব্যবসার নিয়মে আলাদা সারি লাগলে তবেই UNION। এক table থেকেই আলাদা সারি লাগলে দুই query আর UNION-এর চেয়ে WHERE-এ OR বা IN প্রায়ই সহজ।",
  examples: [
    tsql(
      "Northwind order lines with UNION and UNION ALL · UNION ও UNION ALL",
      `---Union and Union all
SELECT * FROM [Order Details] WHERE ProductId = 77
UNION
SELECT * FROM [Order Details] WHERE ProductId = 32;
SELECT COUNT(*) AS UnionRows FROM (
    SELECT OrderId FROM [Order Details] WHERE Quantity > 100
    UNION
    SELECT OrderId FROM [Order Details] WHERE UnitPrice > 100
) u;
SELECT COUNT(*) AS UnionAllRows FROM (
    SELECT OrderId FROM [Order Details] WHERE Quantity > 100
    UNION ALL
    SELECT OrderId FROM [Order Details] WHERE UnitPrice > 100
) ua;`,
      "OrderID  ProductID  UnitPrice  Quantity  Discount\n10248    ...        (rows for product 77 and 32)\n\nUnionRows\n(distinct order ids)\n\nUnionAllRows\n(always >= UnionRows)",
    ),
    lite(
      "See the duplicate difference on sample data · পার্থক্য দেখুন",
      `SELECT 'UNION' AS Kind, COUNT(*) AS RowsReturned FROM (
  SELECT Name FROM Employees WHERE DepartmentId = 1
  UNION
  SELECT Name FROM Employees WHERE Salary >= 65000
)
UNION ALL
SELECT 'UNION ALL', COUNT(*) FROM (
  SELECT Name FROM Employees WHERE DepartmentId = 1
  UNION ALL
  SELECT Name FROM Employees WHERE Salary >= 65000
);`,
    ),
  ],
});

chapter("RIGHT JOIN & FULL JOIN", {
  en: "Joins combine rows from two tables side by side using a condition in ON. The Venn diagram is a helpful picture: circle A is the left table, circle B the right table. INNER JOIN = only the overlap. LEFT (OUTER) JOIN = all of A plus matching B. RIGHT (OUTER) JOIN = all of B plus matching A. FULL (OUTER) JOIN = everything in A and B. CROSS JOIN = every row of A combined with every row of B (no ON). A SELF JOIN joins a table to itself, for example an employee to their manager.",
  bn: "Join ON-এর শর্ত দিয়ে দুই table-এর সারি পাশাপাশি জোড়ে। Venn diagram ভালো ছবি: বৃত্ত A বাম table, বৃত্ত B ডান table। INNER JOIN = শুধু মাঝের অংশ। LEFT JOIN = A-এর সব, সাথে মেলা B। RIGHT JOIN = B-এর সব, সাথে মেলা A। FULL JOIN = A ও B-এর সবকিছু। CROSS JOIN = A-এর প্রতিটি সারির সাথে B-এর প্রতিটি সারি (ON নেই)। SELF JOIN একই table-কে নিজের সাথে জোড়ে, যেমন কর্মী আর তার manager।",
  story: [
    "A school has a list of students (left) and a list of club memberships (right). INNER JOIN prints only students who joined a club. LEFT JOIN prints every student, with 'no club' where empty. RIGHT JOIN prints every club, even a new club with no members yet. FULL JOIN prints both: lonely students and empty clubs together.",
    "স্কুলে ছাত্রদের তালিকা (বাম) আর ক্লাবের সদস্যতার তালিকা (ডান) আছে। INNER JOIN শুধু ক্লাবে যোগ দেওয়া ছাত্রদের দেখায়। LEFT JOIN সব ছাত্র দেখায়, ফাঁকা হলে 'ক্লাব নেই'। RIGHT JOIN সব ক্লাব দেখায়, সদস্যহীন নতুন ক্লাবও। FULL JOIN দুটোই: ক্লাবহীন ছাত্র আর সদস্যহীন ক্লাব একসাথে।",
  ],
  theory: [
    "Aliases (FROM EmployeesJn emp) keep queries short and are required for self joins. When a row has no match on the outer side, every column from the other table is NULL, so 'find departments with no employees' becomes RIGHT JOIN ... WHERE emp.EmployeeId IS NULL (an anti-join). The ON clause decides how rows match; WHERE filters after the join. For outer joins this difference matters: a condition on the optional table belongs in ON to keep unmatched rows. Join on indexed key columns of the same type for performance. If one department matches many employees, the department's columns repeat on each row, which is expected; unexpected duplicates usually mean a missing join condition.",
    "Alias (FROM EmployeesJn emp) query ছোট রাখে, self join-এ বাধ্যতামূলক। বাইরের দিকে মিল না থাকলে অন্য table-এর সব column NULL — তাই 'কর্মী নেই এমন বিভাগ' মানে RIGHT JOIN ... WHERE emp.EmployeeId IS NULL (anti-join)। ON ঠিক করে সারি কীভাবে মিলবে; WHERE join-এর পরে ছাঁকে। Outer join-এ এটা জরুরি: ঐচ্ছিক table-এর শর্ত ON-এ রাখুন, নইলে না-মেলা সারি হারায়। একই type-এর index করা key-তে join করুন। এক বিভাগ অনেক কর্মীর সাথে মিললে বিভাগের column প্রতিটি সারিতে পুনরাবৃত্তি হয় — স্বাভাবিক; অপ্রত্যাশিত duplicate মানে সাধারণত join শর্ত বাদ পড়েছে।",
  ],
  steps: [
    ["Create EmployeesJn and DepartmentsJn with a DepartmentId link.", "DepartmentId দিয়ে যুক্ত EmployeesJn ও DepartmentsJn বানান।"],
    ["Run INNER JOIN and count the rows.", "INNER JOIN চালিয়ে সারি গুনুন।"],
    ["Switch to LEFT, RIGHT and FULL JOIN and look for NULLs.", "LEFT, RIGHT, FULL JOIN-এ বদলে NULL খুঁজুন।"],
    ["Draw the Venn circles for each result to remember them.", "মনে রাখতে প্রতিটি ফলের Venn বৃত্ত আঁকুন।"],
  ],
  mistakes: [
    "Mistake: forgetting the ON clause in older comma syntax (FROM A, B) creates a CROSS JOIN with rows A x B. Mistake: WHERE dept.Location = 'Delhi' after a LEFT JOIN removes the NULL rows and silently becomes an INNER JOIN. Mistake: ambiguous column names without aliases give 'Ambiguous column name DepartmentId'.",
    "ভুল: পুরনো কমা গঠনে (FROM A, B) শর্ত ভুলে গেলে CROSS JOIN হয়, A × B সারি। ভুল: LEFT JOIN-এর পরে WHERE dept.Location = 'Delhi' NULL সারি সরিয়ে নিঃশব্দে INNER JOIN বানায়। ভুল: alias ছাড়া 'Ambiguous column name DepartmentId'।",
  ],
  interview: [
    "Q: How do you find employees without a department and departments without employees in one query? A: FULL OUTER JOIN DepartmentsJn dept ON emp.DepartmentId = dept.DepartmentId WHERE emp.EmployeeId IS NULL OR dept.DepartmentId IS NULL.",
    "প্রশ্ন: এক query-তে বিভাগহীন কর্মী আর কর্মীহীন বিভাগ কীভাবে খুঁজবেন? উত্তর: FULL OUTER JOIN ... ON emp.DepartmentId = dept.DepartmentId WHERE emp.EmployeeId IS NULL OR dept.DepartmentId IS NULL।",
  ],
  dEn: "Write joins in ANSI style with explicit ON. Prefer LEFT JOIN over RIGHT JOIN for consistency by putting the table you want to keep completely on the left. Use FULL JOIN mainly for reconciliation reports that compare two sources.",
  dBn: "স্পষ্ট ON সহ ANSI ধরনে join লিখুন। যে table পুরোটা রাখতে চান তাকে বামে রেখে RIGHT JOIN-এর বদলে LEFT JOIN ব্যবহার করুন — সব query একই রকম পড়া যায়। FULL JOIN মূলত দুই উৎস মেলানোর report-এ।",
  examples: [
    tsql(
      "EmployeesJn and DepartmentsJn with every join · সব ধরনের join",
      `CREATE TABLE DepartmentsJn (DepartmentId INT PRIMARY KEY, DepartmentName VARCHAR(50), Location VARCHAR(50));
CREATE TABLE EmployeesJn (EmployeeId INT IDENTITY PRIMARY KEY, EmployeeName VARCHAR(50), DepartmentId INT NULL, Salary DECIMAL(10,2));
INSERT INTO DepartmentsJn VALUES (10, 'IT', 'Delhi'), (20, 'HR', 'Mumbai'), (30, 'Marketing', 'Pune');
INSERT INTO EmployeesJn (EmployeeName, DepartmentId, Salary)
VALUES ('Ravi', 10, 60000), ('Anita', 10, 65000), ('Sunil', 20, 50000), ('Meena', NULL, 40000);
SELECT dept.DepartmentId, emp.EmployeeName, emp.Salary, dept.DepartmentName, dept.Location
FROM EmployeesJn emp
RIGHT JOIN DepartmentsJn dept ON emp.DepartmentId = dept.DepartmentId;
SELECT emp.EmployeeName, dept.DepartmentName
FROM EmployeesJn emp
FULL OUTER JOIN DepartmentsJn dept ON emp.DepartmentId = dept.DepartmentId;`,
      "RIGHT JOIN\nDepartmentId  EmployeeName  Salary    DepartmentName  Location\n10            Ravi          60000.00  IT              Delhi\n10            Anita         65000.00  IT              Delhi\n20            Sunil         50000.00  HR              Mumbai\n30            NULL          NULL      Marketing       Pune\n\nFULL JOIN\nEmployeeName  DepartmentName\nRavi          IT\nAnita         IT\nSunil         HR\nMeena         NULL\nNULL          Marketing",
    ),
    lite(
      "RIGHT and FULL JOIN on the sample tables · sample table-এ join",
      `-- Sami has no department (left only).
SELECT e.Name AS Employee, d.Name AS Department
FROM Employees e
RIGHT JOIN Departments d ON e.DepartmentId = d.Id
ORDER BY d.Name;
SELECT e.Name AS Employee, d.Name AS Department
FROM Employees e
FULL OUTER JOIN Departments d ON e.DepartmentId = d.Id
ORDER BY d.Name, e.Name;`,
    ),
  ],
});

chapter("String Functions", {
  en: "SQL Server string functions work on CHAR, VARCHAR, NCHAR and NVARCHAR values. Measuring: LEN (characters, trailing spaces ignored), DATALENGTH (bytes). Changing case: UPPER, LOWER. Extracting: LEFT, RIGHT, SUBSTRING. Searching: CHARINDEX(find, text, start) and PATINDEX('%pattern%', text). Replacing: REPLACE, STUFF, TRANSLATE. Trimming: LTRIM, RTRIM, TRIM. Building: CONCAT, CONCAT_WS, REPLICATE, SPACE, STRING_AGG. Splitting: STRING_SPLIT. Formatting: FORMAT, QUOTENAME. Positions start at 1, not 0 as in C#.",
  bn: "SQL Server-এর string function CHAR, VARCHAR, NCHAR, NVARCHAR-এ চলে। মাপা: LEN (অক্ষর, শেষের space বাদ), DATALENGTH (byte)। হাতের অক্ষর: UPPER, LOWER। কেটে নেওয়া: LEFT, RIGHT, SUBSTRING। খোঁজা: CHARINDEX, PATINDEX। বদলানো: REPLACE, STUFF, TRANSLATE। ছাঁটা: LTRIM, RTRIM, TRIM। জোড়া: CONCAT, CONCAT_WS, REPLICATE, STRING_AGG। ভাগ করা: STRING_SPLIT। অবস্থান শুরু হয় ১ থেকে, C#-এর মতো ০ থেকে নয়।",
  story: [
    "A tailor works with cloth the way string functions work with text. He measures the length (LEN), cuts a piece from the left or right edge (LEFT, RIGHT), cuts from the middle (SUBSTRING), finds where a mark is (CHARINDEX), replaces a stained patch (REPLACE) and stitches pieces together (CONCAT).",
    "দর্জি কাপড় নিয়ে যা করেন, string function লেখা নিয়ে তাই করে। তিনি দৈর্ঘ্য মাপেন (LEN), বাম বা ডান প্রান্ত থেকে টুকরো কাটেন (LEFT, RIGHT), মাঝখান থেকে কাটেন (SUBSTRING), দাগ কোথায় খোঁজেন (CHARINDEX), দাগি অংশ বদলান (REPLACE), টুকরো সেলাই করে জোড়েন (CONCAT)।",
  ],
  theory: [
    "Combine functions to solve real problems. First name: LEFT(FullName, CHARINDEX(' ', FullName) - 1). Last name: SUBSTRING(FullName, CHARINDEX(' ', FullName) + 1, LEN(FullName)). Email domain: SUBSTRING(Email, CHARINDEX('@', Email) + 1, 100). Mask a card: REPLICATE('*', LEN(Card) - 4) + RIGHT(Card, 4). CHARINDEX returns 0 when not found, so LEFT(..., 0 - 1) would fail; guard with CASE or NULLIF. Comparison and LIKE follow the column's collation; the default SQL_Latin1_General_CP1_CI_AS is case-insensitive (CI) and accent-sensitive (AS). CONCAT treats NULL as empty, while + returns NULL if any part is NULL.",
    "বাস্তব সমস্যায় function মিলিয়ে ব্যবহার করুন। প্রথম নাম: LEFT(FullName, CHARINDEX(' ', FullName) - 1)। শেষ নাম: SUBSTRING(FullName, CHARINDEX(' ', FullName) + 1, LEN(FullName))। Email-এর domain: SUBSTRING(Email, CHARINDEX('@', Email) + 1, 100)। কার্ড লুকানো: REPLICATE('*', LEN(Card) - 4) + RIGHT(Card, 4)। না পেলে CHARINDEX ০ দেয়, তখন LEFT(..., -1) ব্যর্থ — CASE বা NULLIF দিয়ে রক্ষা করুন। তুলনা ও LIKE column-এর collation মানে; default SQL_Latin1_General_CP1_CI_AS বড়-ছোট হাতের পার্থক্য করে না। CONCAT NULL-কে খালি ধরে, + কোনো অংশ NULL হলে পুরোটাই NULL।",
  ],
  steps: [
    ["Run each function on the literal 'Rohan Kumawat' and predict the result first.", "'Rohan Kumawat'-এ প্রতিটি function চালানোর আগে ফল অনুমান করুন।"],
    ["Split a full name into first and last name with CHARINDEX.", "CHARINDEX দিয়ে পুরো নামকে প্রথম ও শেষ নামে ভাগ করুন।"],
    ["Apply the same functions to a table column.", "একই function table-এর column-এ প্রয়োগ করুন।"],
    ["Handle the case where the space is missing (CHARINDEX = 0).", "Space না থাকলে (CHARINDEX = 0) কী হবে সামলান।"],
  ],
  mistakes: [
    "Mistake: SUBSTRING('abc', 0, 2) returns only 'a' because position 0 is before the first character. Mistake: LEN('abc   ') = 3, which surprises people checking fixed-width data; use DATALENGTH. Mistake: REPLACE is case-insensitive under the default collation, so REPLACE('NET net', 'net', 'X') changes both.",
    "ভুল: SUBSTRING('abc', 0, 2) শুধু 'a' দেয়, কারণ ০ প্রথম অক্ষরের আগে। ভুল: LEN('abc   ') = 3 — নির্দিষ্ট মাপের data যাচাইয়ে অবাক করে; DATALENGTH দিন। ভুল: default collation-এ REPLACE বড়-ছোট হাত মানে না, তাই REPLACE('NET net', 'net', 'X') দুটোই বদলায়।",
  ],
  interview: [
    "Q: How do you extract the domain from an email address? A: SUBSTRING(Email, CHARINDEX('@', Email) + 1, LEN(Email)). Q: LEN vs DATALENGTH? A: LEN counts characters excluding trailing spaces; DATALENGTH counts bytes including them, and NVARCHAR uses two bytes per character.",
    "প্রশ্ন: Email থেকে domain কীভাবে বের করবেন? উত্তর: SUBSTRING(Email, CHARINDEX('@', Email) + 1, LEN(Email))। প্রশ্ন: LEN বনাম DATALENGTH? উত্তর: LEN শেষের space বাদে অক্ষর গোনে; DATALENGTH space সহ byte গোনে, NVARCHAR-এ প্রতি অক্ষর ২ byte।",
  ],
  dEn: "Clean text once on the way in (TRIM, consistent case) instead of wrapping every query in functions. If you must search by a computed value often, add a persisted computed column and index it.",
  dBn: "প্রতিটি query-তে function না মুড়িয়ে data ঢোকার সময় একবার পরিষ্কার করুন (TRIM, একই রকম হাতের অক্ষর)। হিসাব করা মান দিয়ে প্রায়ই খুঁজতে হলে persisted computed column বানিয়ে index দিন।",
  examples: [
    tsql(
      "All string functions from the lesson · সব string function",
      `SELECT LEN('Rohan Kumawat')                    AS Len;
SELECT UPPER('Rohan Kumawat')                  AS Upper;
SELECT LOWER('ROHAN KUMAWAT')                  AS Lower;
SELECT LEFT('RAHLK5412122', 4)                 AS Left4;
SELECT RIGHT('RAHLK5412122', 4)                AS Right4;
SELECT SUBSTRING('Rohan Kumawat', 4, 5)        AS Sub;
SELECT CHARINDEX('K', 'Rohan Kumawat')         AS PosK;
SELECT REPLACE('.NET & SQL', '.NET', 'C#')     AS Replaced;
SELECT CONCAT('Rohan', ' ', 'Kumawat')         AS FullName;
SELECT LEFT('Rohan Kumawat', CHARINDEX(' ', 'Rohan Kumawat') - 1) AS FirstName;`,
      "Len 13 | Upper ROHAN KUMAWAT | Lower rohan kumawat | Left4 RAHL | Right4 2122\nSub an Ku | PosK 7 | Replaced C# & SQL | FullName Rohan Kumawat | FirstName Rohan",
    ),
    lite(
      "SQLite string functions on the sample names · SQLite-এ string",
      `SELECT Name,
       length(Name)            AS Len,
       upper(Name)             AS Upper,
       substr(Name, 1, 3)      AS First3,
       instr(Name, 'a')        AS PosA,
       replace(Name, 'a', '@') AS Replaced,
       Name || ' (' || Id || ')' AS Label
FROM Employees;`,
    ),
  ],
});

chapter("Date & Time Functions", {
  en: "SQL Server stores dates internally as numbers and gives you functions to read and calculate them. Current time: GETDATE() and SYSDATETIME() (local server time), GETUTCDATE() and SYSUTCDATETIME() (UTC). Parts: YEAR, MONTH, DAY, DATEPART(part, date) and DATENAME(part, date), where part can be YEAR, QUARTER, MONTH, DAYOFYEAR, DAY, WEEK, WEEKDAY, HOUR, MINUTE or SECOND. Arithmetic: DATEADD(part, number, date). Difference: DATEDIFF(part, start, end). Building: DATEFROMPARTS(2026, 8, 7), EOMONTH(date). Validation: ISDATE('text').",
  bn: "SQL Server ভেতরে তারিখকে সংখ্যা হিসেবে রাখে আর পড়া ও হিসাবের function দেয়। এখনকার সময়: GETDATE(), SYSDATETIME() (server-এর স্থানীয়), GETUTCDATE() (UTC)। অংশ: YEAR, MONTH, DAY, DATEPART(part, date), DATENAME(part, date) — part হতে পারে YEAR, QUARTER, MONTH, DAY, WEEK, WEEKDAY, HOUR, MINUTE। হিসাব: DATEADD(part, number, date)। পার্থক্য: DATEDIFF(part, start, end)। বানানো: DATEFROMPARTS(2026, 8, 7), EOMONTH(date)। যাচাই: ISDATE('text')।",
  story: [
    "A calendar on the wall is all you need to understand these functions. Looking at today is GETDATE. Reading just the month printed at the top is MONTH. Flipping 45 pages back is DATEADD(DAY, -45). Counting how many month pages you flip between two dates is DATEDIFF(MONTH). The last page of the month is EOMONTH.",
    "দেয়ালের একটি ক্যালেন্ডারই এই function বোঝার জন্য যথেষ্ট। আজকের দিকে তাকানো GETDATE। উপরে ছাপা শুধু মাসের নাম পড়া MONTH। ৪৫ পাতা পেছনে উল্টানো DATEADD(DAY, -45)। দুই তারিখের মাঝে কয়টি মাসের পাতা উল্টালেন গোনা DATEDIFF(MONTH)। মাসের শেষ পাতা EOMONTH।",
  ],
  theory: [
    "DATEDIFF counts boundaries crossed, not complete periods: DATEDIFF(YEAR, '2025-12-31', '2026-01-01') is 1 even though only one day passed, and DATEDIFF(MONTH, '2026-09-08', '2026-08-08') is -1 because the end is before the start. WEEKDAY numbering depends on SET DATEFIRST (US default 7 means Sunday = 1). For date ranges use a half-open interval so every time of the last day is included and indexes are used: WHERE OrderDate >= '2026-08-01' AND OrderDate < '2026-09-01'. Avoid BETWEEN with DATETIME because it misses 23:59:59.997 or double-counts midnight. Store times in UTC for global apps and convert at display with AT TIME ZONE.",
    "DATEDIFF সম্পূর্ণ সময় নয়, পার হওয়া সীমানা গোনে: DATEDIFF(YEAR, '2025-12-31', '2026-01-01') = ১, যদিও মাত্র এক দিন গেছে; DATEDIFF(MONTH, '2026-09-08', '2026-08-08') = -১, কারণ শেষ তারিখ আগে। WEEKDAY নম্বর SET DATEFIRST-এর উপর নির্ভর করে (US default-এ রবিবার = ১)। তারিখের পরিসরে half-open ব্যবহার করুন, যাতে শেষ দিনের সব সময় আসে আর index কাজ করে: WHERE OrderDate >= '2026-08-01' AND OrderDate < '2026-09-01'। DATETIME-এ BETWEEN এড়ান। বিশ্বব্যাপী app-এ UTC-তে রাখুন, দেখানোর সময় AT TIME ZONE দিয়ে বদলান।",
  ],
  steps: [
    ["Run SELECT GETDATE() and note the server time.", "SELECT GETDATE() চালিয়ে server-এর সময় দেখুন।"],
    ["Extract YEAR, MONTH, DAY and DATENAME(WEEKDAY) from one date.", "একটি তারিখ থেকে YEAR, MONTH, DAY, DATENAME(WEEKDAY) বের করুন।"],
    ["Add and subtract days with DATEADD.", "DATEADD দিয়ে দিন যোগ-বিয়োগ করুন।"],
    ["Measure gaps with DATEDIFF and check the sign of the result.", "DATEDIFF দিয়ে পার্থক্য মেপে ফলের চিহ্ন দেখুন।"],
  ],
  mistakes: [
    "Mistake: writing dates as '08/07/2026', which means 7 August in the US setting and 8 July in British settings. Use '2026-08-07' or '20260807'. Mistake: calculating age with DATEDIFF(YEAR, Dob, GETDATE()), which is one year too high before the birthday. Mistake: WHERE YEAR(OrderDate) = 2026 cannot use an index; use a date range.",
    "ভুল: '08/07/2026' লেখা — US setting-এ ৭ আগস্ট, British-এ ৮ জুলাই। '2026-08-07' বা '20260807' লিখুন। ভুল: DATEDIFF(YEAR, Dob, GETDATE()) দিয়ে বয়স — জন্মদিনের আগে এক বছর বেশি দেখায়। ভুল: WHERE YEAR(OrderDate) = 2026 index ব্যবহার করতে পারে না; তারিখের পরিসর দিন।",
  ],
  interview: [
    "Q: How do you get all orders from last month? A: WHERE OrderDate >= DATEADD(MONTH, -1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)) AND OrderDate < DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1). This half-open range uses an index and includes every time on the last day.",
    "প্রশ্ন: গত মাসের সব অর্ডার কীভাবে আনবেন? উত্তর: এই মাসের ১ তারিখ বানিয়ে, তার এক মাস আগে থেকে (>=) এই মাসের ১ তারিখের আগে (<) পর্যন্ত — half-open পরিসর index ব্যবহার করে আর শেষ দিনের সব সময় ধরে।",
  ],
  dEn: "Use DATE for birthdays and business days, DATETIME2 for events, and DATETIMEOFFSET or UTC when users span time zones. Keep date math in SQL for filtering and grouping, and do display formatting in the application.",
  dBn: "জন্মদিন ও কর্মদিবসে DATE, ঘটনায় DATETIME2, বিভিন্ন time zone-এর user থাকলে DATETIMEOFFSET বা UTC। ছাঁকা ও দলে ভাগের হিসাব SQL-এ রাখুন, দেখানোর format app-এ করুন।",
  examples: [
    tsql(
      "Every date function from the lesson · সব date function",
      `--datetime
SELECT GETDATE() AS Now;
SELECT YEAR('2026-05-05') AS Y, MONTH('2026-01-04') AS M, DAY('2026-09-14') AS D;
SELECT DATEPART(WEEK, '2026-07-16')    AS WeekNo,
       DATEPART(WEEKDAY, '2026-07-16') AS WeekdayNo,
       DATENAME(WEEKDAY, '2026-07-16') AS WeekdayName,
       DATENAME(MONTH, '2026-07-16')   AS MonthName;
SELECT DATEADD(DAY, -45, '2026-07-16') AS Minus45Days;
SELECT DATEDIFF(MONTH, '2026-09-08', '2026-08-08') AS MonthDiff;
SELECT EOMONTH('2026-02-10') AS LastDayOfFeb;`,
      "Now 2026-08-07 08:23:11.547\nY 2026 | M 1 | D 14\nWeekNo 29 | WeekdayNo 5 | WeekdayName Thursday | MonthName July\nMinus45Days 2026-06-01 00:00:00.000\nMonthDiff -1\nLastDayOfFeb 2026-02-28",
    ),
    lite(
      "SQLite date functions · SQLite-এ তারিখ",
      `SELECT date('now')                              AS Today,
       strftime('%Y', '2026-05-05')              AS Y,
       strftime('%m', '2026-01-04')              AS M,
       date('2026-07-16', '-45 days')            AS Minus45Days,
       julianday('2026-08-08') - julianday('2026-01-01') AS DaysBetween,
       date('2026-02-10', 'start of month', '+1 month', '-1 day') AS EndOfFeb;`,
    ),
  ],
});

chapter("Nth Highest Salary with RANK", {
  en: "Window functions perform a calculation across a set of rows related to the current row, defined by OVER(). Unlike GROUP BY they keep every row. Ranking functions are ROW_NUMBER, RANK, DENSE_RANK and NTILE(n). OVER(ORDER BY col DESC) defines the ranking order; adding PARTITION BY col restarts the numbering for each group. Because window functions are evaluated in the SELECT phase, you cannot use them in WHERE; wrap the query in a subquery or CTE and filter outside. This is the standard answer to 'find the Nth highest salary'.",
  bn: "Window function বর্তমান সারির সাথে সম্পর্কিত সারিগুলোর উপর হিসাব করে, OVER() দিয়ে নির্ধারিত। GROUP BY-এর উল্টো, সব সারি থেকে যায়। Ranking function: ROW_NUMBER, RANK, DENSE_RANK, NTILE(n)। OVER(ORDER BY col DESC) ক্রম ঠিক করে; PARTITION BY col দিলে প্রতিটি দলে নম্বর আবার শুরু হয়। Window function SELECT ধাপে হিসাব হয়, তাই WHERE-এ চলে না; subquery বা CTE-তে মুড়ে বাইরে ছাঁকুন। 'Nth সর্বোচ্চ বেতন' প্রশ্নের এটাই আদর্শ উত্তর।",
  story: [
    "In a race three runners finish together in first place. ROW_NUMBER is the stopwatch that still gives them 1, 2, 3. RANK is the Olympic way: three gold medals, then the next runner is fourth. DENSE_RANK is the school sports day: three firsts, then the next runner is second. Asking 'who came second' depends on which system you use.",
    "এক দৌড়ে তিনজন একসাথে প্রথম হলো। ROW_NUMBER হলো stopwatch, যা তবুও ১, ২, ৩ দেয়। RANK অলিম্পিকের নিয়ম: তিনটি সোনা, পরের জন চতুর্থ। DENSE_RANK স্কুলের ক্রীড়া দিবস: তিনজন প্রথম, পরের জন দ্বিতীয়। 'কে দ্বিতীয় হলো' উত্তর নির্ভর করে কোন নিয়ম ব্যবহার করছেন তার উপর।",
  ],
  theory: [
    "Older approaches to the second highest salary: SELECT MAX(Salary) FROM Salary WHERE Salary < (SELECT MAX(Salary) FROM Salary), or SELECT TOP 1 Salary FROM (SELECT DISTINCT TOP 2 Salary FROM Salary ORDER BY Salary DESC) t ORDER BY Salary ASC. Both work for N = 2 but become messy for any N. With DENSE_RANK the pattern is the same for every N: rank in a CTE, then WHERE Rnk = @N. Ties return several rows, which is correct because several employees share that salary. Use OFFSET (N-1) ROWS FETCH NEXT 1 ROWS ONLY on DISTINCT salaries when you only need the value. ROW_NUMBER is the right choice for pagination and for deleting duplicates (keep rn = 1).",
    "দ্বিতীয় সর্বোচ্চ বেতনের পুরনো উপায়: SELECT MAX(Salary) ... WHERE Salary < (SELECT MAX(Salary) ...), অথবা DISTINCT TOP 2 নিয়ে উল্টো সাজানো। N = ২-এ চলে কিন্তু যেকোনো N-এ জটিল হয়। DENSE_RANK-এ সব N-এর জন্য একই নিয়ম: CTE-তে rank, তারপর WHERE Rnk = @N। সমান বেতনে কয়েকটি সারি আসে — সঠিক, কারণ কয়েকজন একই বেতন পান। শুধু মান লাগলে DISTINCT বেতনে OFFSET (N-1) ROWS FETCH NEXT 1 ROWS ONLY। Pagination আর duplicate মুছতে (rn = 1 রাখা) ROW_NUMBER সঠিক।",
  ],
  steps: [
    ["SELECT MAX(BasicSalary) to see the top value.", "SELECT MAX(BasicSalary) দিয়ে সর্বোচ্চ মান দেখুন।"],
    ["Add RANK() and DENSE_RANK() OVER (ORDER BY BasicSalary DESC) side by side.", "RANK() ও DENSE_RANK() পাশাপাশি যোগ করুন।"],
    ["Wrap the ranked query and filter WHERE Rnk = 2.", "Rank করা query মুড়ে WHERE Rnk = 2 দিন।"],
    ["Add PARTITION BY DepartmentId to rank inside each department.", "PARTITION BY DepartmentId দিয়ে প্রতিটি বিভাগে rank করুন।"],
  ],
  mistakes: [
    "Mistake: WHERE RANK() OVER (...) = 2 gives 'Windowed functions can only appear in the SELECT or ORDER BY clauses'. Mistake: using RANK when two people share the top salary, so no row has rank 2. Mistake: forgetting DESC, which ranks the lowest salary first.",
    "ভুল: WHERE RANK() OVER (...) = 2 — 'Windowed functions can only appear in the SELECT or ORDER BY clauses'। ভুল: দুইজন সর্বোচ্চ বেতন ভাগ করলে RANK ব্যবহার — rank ২ কারও নেই। ভুল: DESC ভুলে যাওয়া, ফলে সবচেয়ে কম বেতন প্রথম হয়।",
  ],
  interview: [
    "Q: Write a query for the 3rd highest salary per department. A: ;WITH r AS (SELECT DepartmentId, EmployeeId, Salary, DENSE_RANK() OVER (PARTITION BY DepartmentId ORDER BY Salary DESC) AS Rnk FROM Employees) SELECT * FROM r WHERE Rnk = 3;",
    "প্রশ্ন: প্রতিটি বিভাগে তৃতীয় সর্বোচ্চ বেতনের query লিখুন। উত্তর: CTE-তে DENSE_RANK() OVER (PARTITION BY DepartmentId ORDER BY Salary DESC) দিয়ে rank, তারপর WHERE Rnk = 3।",
  ],
  dEn: "Prefer window functions over self-joins and correlated subqueries for rankings, running totals (SUM() OVER (ORDER BY ...)) and previous/next comparisons (LAG, LEAD). An index on (PARTITION BY columns, ORDER BY columns) lets SQL Server avoid an expensive sort.",
  dBn: "Ranking, running total (SUM() OVER (ORDER BY ...)) আর আগের/পরের তুলনায় (LAG, LEAD) self-join বা correlated subquery-এর বদলে window function নিন। (PARTITION BY column, ORDER BY column)-এ index থাকলে SQL Server ব্যয়বহুল sort এড়ায়।",
  examples: [
    tsql(
      "Rank functions and the 2nd highest salary · দ্বিতীয় সর্বোচ্চ বেতন",
      `--Rank Functions
SELECT MAX(BasicSalary) AS TopSalary FROM Salary;
SELECT TOP 1 BasicSalary FROM Salary ORDER BY BasicSalary DESC;
--2nd max?
SELECT EmployeeId, BasicSalary,
       ROW_NUMBER() OVER (ORDER BY BasicSalary DESC) AS RowNo,
       RANK()       OVER (ORDER BY BasicSalary DESC) AS Rnk,
       DENSE_RANK() OVER (ORDER BY BasicSalary DESC) AS DenseRnk
FROM Salary;
SELECT EmployeeId, BasicSalary
FROM (
    SELECT EmployeeId, BasicSalary,
           DENSE_RANK() OVER (ORDER BY BasicSalary DESC) AS Rnk
    FROM Salary
) AS r
WHERE r.Rnk = 2;`,
      "TopSalary\n95000.00\n\nEmployeeId  BasicSalary  RowNo  Rnk  DenseRnk\n1           95000.00     1      1    1\n3           80000.00     2      2    2\n2           65000.00     3      3    3\n5           65000.00     4      3    3\n4           50000.00     5      5    4\n\nEmployeeId  BasicSalary\n3           80000.00",
    ),
    lite(
      "ROW_NUMBER, RANK, DENSE_RANK and the 2nd highest · browser-এ চালান",
      `SELECT Name, Salary,
       ROW_NUMBER() OVER (ORDER BY Salary DESC) AS RowNo,
       RANK()       OVER (ORDER BY Salary DESC) AS Rnk,
       DENSE_RANK() OVER (ORDER BY Salary DESC) AS DenseRnk
FROM Employees;
WITH r AS (SELECT Name, Salary, DENSE_RANK() OVER (ORDER BY Salary DESC) AS Rnk FROM Employees)
SELECT Name, Salary FROM r WHERE Rnk = 2;`,
    ),
  ],
});

chapter("Clustered & Non-Clustered Index", {
  en: "SQL Server stores data in 8 KB pages. Without an index (a heap) it must read every page to find a row: a table scan. An index organises keys in a B-tree: a root page points to intermediate pages, which point to leaf pages, so finding one key out of millions takes only three or four page reads (a seek). In a clustered index the leaf level is the data rows themselves, ordered by the key. In a non-clustered index the leaf level holds the key plus a row locator (the clustered key or a RID), so SQL Server may need a Key Lookup to fetch other columns.",
  bn: "SQL Server data রাখে ৮ KB-এর page-এ। Index না থাকলে (heap) একটি সারি খুঁজতে সব page পড়তে হয়: table scan। Index key-কে B-tree-তে সাজায়: root page মাঝের page দেখায়, মাঝের page leaf page দেখায় — লক্ষ সারির মধ্যে একটি key খুঁজতে মাত্র ৩-৪টি page পড়তে হয় (seek)। Clustered index-এ leaf স্তরই আসল সারি, key-এর ক্রমে সাজানো। Non-clustered index-এর leaf-এ থাকে key আর সারির ঠিকানা, তাই অন্য column আনতে Key Lookup লাগতে পারে।",
  story: [
    "A dictionary is a clustered index: the words themselves are printed in alphabetical order, so there can be only one such order. The index at the back of a textbook is a non-clustered index: it lists topics alphabetically with page numbers, and you jump to the page to read the full text. A book can have many such back indexes (topics, authors, formulas).",
    "অভিধান হলো clustered index: শব্দগুলোই বর্ণক্রমে ছাপা, তাই এমন ক্রম একটিই হতে পারে। পাঠ্যবইয়ের পেছনের সূচি হলো non-clustered index: বিষয়গুলো বর্ণক্রমে পাতা নম্বরসহ, আর পুরো লেখা পড়তে সেই পাতায় যান। একটি বইয়ে এমন অনেক সূচি থাকতে পারে (বিষয়, লেখক, সূত্র)।",
  ],
  theory: [
    "Good clustered keys are narrow, unique, static and ever-increasing (INT IDENTITY), because every non-clustered index stores the clustered key too and random keys cause page splits. Non-clustered indexes should match the queries: the leftmost column of a composite index must appear in WHERE for a seek, so an index on (LastName, FirstName) helps WHERE LastName = 'Fuller' but not WHERE FirstName = 'Andrew'. A covering index includes every column the query needs (via key or INCLUDE), removing key lookups. Every index costs disk space and slows INSERT, UPDATE and DELETE because each index must be maintained. Indexes fragment over time; rebuild or reorganise them during maintenance windows, and keep statistics up to date.",
    "ভালো clustered key সরু, অনন্য, স্থির আর ক্রমাগত বাড়ে (INT IDENTITY), কারণ প্রতিটি non-clustered index clustered key-ও রাখে, আর এলোমেলো key page split ঘটায়। Non-clustered index query অনুযায়ী বানান: composite index-এর বাম দিকের column WHERE-এ থাকলে তবেই seek — (LastName, FirstName)-এ index WHERE LastName = 'Fuller'-এ কাজে লাগে, WHERE FirstName = 'Andrew'-এ নয়। Covering index query-র সব column রাখে (key বা INCLUDE দিয়ে), key lookup দূর করে। প্রতিটি index disk জায়গা নেয় আর INSERT, UPDATE, DELETE ধীর করে। সময়ের সাথে fragmentation হয়; maintenance-এ rebuild বা reorganize করুন, statistics হালনাগাদ রাখুন।",
  ],
  steps: [
    ["Run a query with the actual execution plan on (Ctrl+M) and note Table Scan.", "Ctrl+M চালু রেখে query চালিয়ে Table Scan দেখুন।"],
    ["Create a non-clustered index on the WHERE column.", "WHERE-এর column-এ non-clustered index বানান।"],
    ["Run again and look for Index Seek and fewer logical reads.", "আবার চালিয়ে Index Seek আর কম logical read দেখুন।"],
    ["List indexes with sp_helpindex and drop unused ones.", "sp_helpindex দিয়ে তালিকা দেখে অপ্রয়োজনীয়গুলো মুছুন।"],
  ],
  mistakes: [
    "Mistake: creating a clustered index when the primary key already made one gives 'Cannot create more than one clustered index on table'. Mistake: indexing every column 'just in case', which slows writes and wastes memory. Mistake: expecting an index on Email to help WHERE Email LIKE '%gmail.com'; a leading wildcard forces a scan.",
    "ভুল: primary key আগেই clustered index বানালে আরেকটি বানাতে গেলে 'Cannot create more than one clustered index'। ভুল: 'কাজে লাগতে পারে' ভেবে সব column-এ index — write ধীর, memory নষ্ট। ভুল: Email-এর index WHERE Email LIKE '%gmail.com'-এ সাহায্য করবে ভাবা; শুরুর wildcard scan করায়।",
  ],
  interview: [
    "Q: Clustered vs non-clustered index? A: Clustered defines the physical order of the table's rows and the leaf level is the data; only one per table. Non-clustered is a separate structure whose leaf holds keys and row locators; up to 999 per table. Q: What is a covering index? A: A non-clustered index that contains all columns a query needs, usually via INCLUDE, so no lookup to the base table is required.",
    "প্রশ্ন: Clustered বনাম non-clustered index? উত্তর: Clustered সারির ভৌত ক্রম ঠিক করে, leaf স্তরই data; table-এ একটিই। Non-clustered আলাদা কাঠামো, leaf-এ key আর সারির ঠিকানা; table-এ ৯৯৯টি পর্যন্ত। প্রশ্ন: Covering index কী? উত্তর: যে non-clustered index query-র সব column রাখে (সাধারণত INCLUDE দিয়ে), ফলে আসল table-এ lookup লাগে না।",
  ],
  dEn: "Design indexes from real query patterns: check the execution plan, the missing index suggestions (with caution) and sys.dm_db_index_usage_stats for unused indexes. Index foreign keys and the columns of frequent WHERE, JOIN and ORDER BY clauses; keep the number of indexes on write-heavy tables small.",
  dBn: "আসল query দেখে index design করুন: execution plan, missing index পরামর্শ (সাবধানে) আর অব্যবহৃত index-এর জন্য sys.dm_db_index_usage_stats দেখুন। Foreign key আর নিয়মিত WHERE, JOIN, ORDER BY-এর column-এ index দিন; বেশি write হয় এমন table-এ index কম রাখুন।",
  examples: [
    tsql(
      "Create, inspect and test indexes · index বানানো ও পরীক্ষা",
      `---indexes : clustered , non clustered
SELECT * FROM Orders;
CREATE NONCLUSTERED INDEX ix_salary_salaryid ON Salary(SalaryId);
-- CREATE CLUSTERED INDEX cx_salary_salaryid ON Salary(SalaryId);
--   -> Msg 1902: Cannot create more than one clustered index on table 'Salary'.
CREATE NONCLUSTERED INDEX ix_Orders_CustomerId
    ON Orders(CustomerId) INCLUDE (OrderDate, ShipCity);
SET STATISTICS IO ON;
SELECT OrderId, OrderDate, ShipCity FROM Orders WHERE CustomerId = 'VINET';
SET STATISTICS IO OFF;
EXEC sp_helpindex 'Orders';`,
      "Table 'Orders'. Scan count 1, logical reads 2   (Index Seek on ix_Orders_CustomerId)\n\nindex_name             index_description                       index_keys\nPK_Orders              clustered, unique, primary key          OrderID\nix_Orders_CustomerId   nonclustered                            CustomerID\n...",
    ),
    lite(
      "SQLite query plan before and after an index · plan তুলনা",
      `DROP INDEX IF EXISTS ix_emp_salary;
EXPLAIN QUERY PLAN SELECT Name FROM Employees WHERE Salary = 65000;
CREATE INDEX ix_emp_salary ON Employees(Salary);
EXPLAIN QUERY PLAN SELECT Name FROM Employees WHERE Salary = 65000;`,
    ),
  ],
});

chapter("Scalar User-Defined Functions", {
  en: "SQL Server has three kinds of user-defined functions: scalar functions (return one value), inline table-valued functions and multi-statement table-valued functions. A scalar function is created with CREATE FUNCTION schema.Name (@param TYPE, ...) RETURNS TYPE AS BEGIN ... RETURN value END. It can use variables, IF/ELSE and SELECT from tables, but it must be deterministic in effect: it cannot INSERT, UPDATE or DELETE permanent tables, cannot call stored procedures that change data and cannot use TRY/CATCH or temp tables. You find it in SSMS under Programmability > Functions > Scalar-valued Functions.",
  bn: "SQL Server-এ তিন ধরনের user-defined function: scalar (একটি মান দেয়), inline table-valued আর multi-statement table-valued। Scalar function বানাই CREATE FUNCTION schema.Name (@param TYPE) RETURNS TYPE AS BEGIN ... RETURN value END দিয়ে। এতে variable, IF/ELSE, table থেকে SELECT চলে, কিন্তু স্থায়ী table-এ INSERT, UPDATE, DELETE চলে না, data বদলানো procedure ডাকা যায় না, TRY/CATCH বা temp table-ও নয়। SSMS-এ Programmability > Functions > Scalar-valued Functions-এ পাবেন।",
  story: [
    "A scalar function is like a calculator app on your phone with one special button: 'yearly package'. You type a monthly salary, press the button and get one number back. The button never edits your contacts or deletes photos; it only calculates.",
    "Scalar function হলো phone-এর calculator app-এ একটি বিশেষ বোতাম: 'বাৎসরিক প্যাকেজ'। মাসিক বেতন লিখে বোতাম চাপলে একটি সংখ্যা ফেরত আসে। বোতামটি কখনো contact বদলায় না বা ছবি মুছে না; শুধু হিসাব করে।",
  ],
  theory: [
    "Use ALTER FUNCTION (or CREATE OR ALTER) to change it and DROP FUNCTION to remove it. Parameters can have defaults, but callers must still pass the keyword DEFAULT. Scalar UDFs are called once per row: SELECT dbo.CalculateYearlyPackage(BasicSalary) FROM Salary runs the body for every row, and before SQL Server 2019 this also forced a serial plan and hid the cost from the execution plan. SQL Server 2019 introduced scalar UDF inlining that rewrites simple functions into the query. Functions that read tables inside the body are the most expensive; often a JOIN or an inline TVF is faster. A function used in a CHECK constraint or computed column must be deterministic and created WITH SCHEMABINDING.",
    "বদলাতে ALTER FUNCTION (বা CREATE OR ALTER), মুছতে DROP FUNCTION। Parameter-এ default থাকতে পারে, কিন্তু ডাকার সময় DEFAULT শব্দটি লিখতে হয়। Scalar UDF প্রতিটি সারিতে একবার চলে: SELECT dbo.CalculateYearlyPackage(BasicSalary) FROM Salary প্রতিটি সারিতে body চালায়; SQL Server 2019-এর আগে এটি serial plan-ও চাপাত আর খরচ plan-এ লুকাত। SQL Server 2019 সহজ function-কে query-তে inline করে। Body-র ভেতরে table পড়া function সবচেয়ে ব্যয়বহুল; প্রায়ই JOIN বা inline TVF দ্রুত। CHECK constraint বা computed column-এ ব্যবহৃত function deterministic আর WITH SCHEMABINDING হতে হয়।",
  ],
  steps: [
    ["Write CREATE FUNCTION with one parameter and RETURNS DECIMAL(12,2).", "এক parameter আর RETURNS DECIMAL(12,2) সহ CREATE FUNCTION লিখুন।"],
    ["Put RETURN 12 * @BasicSalary between BEGIN and END and execute.", "BEGIN-END-এ RETURN 12 * @BasicSalary লিখে চালান।"],
    ["Call SELECT dbo.CalculateYearlyPackage(15000).", "SELECT dbo.CalculateYearlyPackage(15000) ডাকুন।"],
    ["Write a second function dbo.IsAdult(@age) that returns BIT.", "দ্বিতীয় function dbo.IsAdult(@age) লিখুন, যা BIT দেয়।"],
  ],
  mistakes: [
    "Mistake: calling CalculateYearlyPackage(15000) without dbo gives 'is not a recognized built-in function name'. Mistake: running CREATE FUNCTION twice gives 'There is already an object named'; use ALTER or CREATE OR ALTER. Mistake: putting INSERT INTO a real table inside a function: 'Invalid use of a side-effecting operator INSERT within a function'.",
    "ভুল: dbo ছাড়া CalculateYearlyPackage(15000) — 'is not a recognized built-in function name'। ভুল: CREATE FUNCTION দুইবার চালানো — 'There is already an object named'; ALTER বা CREATE OR ALTER দিন। ভুল: function-এর ভেতরে আসল table-এ INSERT — 'Invalid use of a side-effecting operator'।",
  ],
  interview: [
    "Q: Function vs stored procedure? A: A function must return a value or table, can be used inside SELECT, WHERE and JOIN, cannot change database state and cannot use TRY/CATCH. A stored procedure is executed with EXEC, may return zero or more result sets and output parameters, can change data, manage transactions and handle errors, but cannot be used inside a SELECT.",
    "প্রশ্ন: Function বনাম stored procedure? উত্তর: Function অবশ্যই মান বা table দেয়, SELECT, WHERE, JOIN-এ ব্যবহার করা যায়, database বদলাতে পারে না, TRY/CATCH নেই। Procedure EXEC দিয়ে চলে, শূন্য বা একাধিক ফল আর output parameter দিতে পারে, data বদলায়, transaction ও error সামলায়, কিন্তু SELECT-এর ভেতরে ব্যবহার করা যায় না।",
  ],
  dEn: "Use scalar functions for small, reusable calculations and formatting rules shared by many queries. Avoid them in WHERE clauses on large tables and avoid table access inside them; replace with inline TVFs or joins when performance matters.",
  dBn: "বহু query-তে লাগে এমন ছোট, পুনর্ব্যবহারযোগ্য হিসাবের জন্য scalar function। বড় table-এর WHERE-এ আর function-এর ভেতরে table পড়া এড়ান; performance জরুরি হলে inline TVF বা join দিয়ে বদলান।",
  examples: [
    tsql(
      "CalculateYearlyPackage and IsAdult functions · দুটি scalar function",
      `---custom functions
CREATE OR ALTER FUNCTION dbo.CalculateYearlyPackage (@BasicSalary DECIMAL(12,2))
RETURNS DECIMAL(12,2)
AS
BEGIN
    RETURN 12 * @BasicSalary;
END
GO
CREATE OR ALTER FUNCTION dbo.IsAdult (@Age INT)
RETURNS BIT
AS
BEGIN
    RETURN CASE WHEN @Age >= 18 THEN 1 ELSE 0 END;
END
GO
SELECT dbo.CalculateYearlyPackage(15000) AS Yearly, dbo.IsAdult(56) AS Adult;
SELECT EmployeeId, BasicSalary, dbo.CalculateYearlyPackage(BasicSalary) AS Yearly
FROM Salary;`,
      "Yearly     Adult\n180000.00  1\n\nEmployeeId  BasicSalary  Yearly\n1           95000.00     1140000.00\n2           65000.00     780000.00\n...",
    ),
    lite(
      "Same calculation as an expression in SQLite · SQLite-এ একই হিসাব",
      `-- SQLite has no CREATE FUNCTION in SQL; the same logic as expressions:
SELECT Name,
       Salary,
       12 * Salary AS YearlyPackage,
       CASE WHEN Salary >= 60000 THEN 'Senior' ELSE 'Junior' END AS Band
FROM Employees
ORDER BY YearlyPackage DESC;`,
    ),
  ],
});

chapter("Table-Valued Functions", {
  en: "A table-valued function returns a result set and is used in the FROM clause, so it behaves like a view that accepts parameters. An inline TVF contains a single RETURN (SELECT ...) and SQL Server expands it into the calling query, so the optimizer sees the real tables, statistics and indexes. A multi-statement TVF declares an output table variable in RETURNS @t TABLE (...), runs any number of statements to fill it and ends with RETURN; the optimizer treats it as a black box with a fixed row estimate. Both are found under Programmability > Functions > Table-valued Functions.",
  bn: "Table-valued function একটি ফলের সেট দেয় আর FROM-এ ব্যবহার হয় — parameter নেওয়া view-এর মতো। Inline TVF-এ একটিই RETURN (SELECT ...), SQL Server তা ডাকা query-তে মিশিয়ে দেয়, তাই optimizer আসল table, statistics, index দেখে। Multi-statement TVF RETURNS @t TABLE (...)-এ output table variable ঘোষণা করে, যত খুশি statement দিয়ে ভরে, RETURN দিয়ে শেষ করে; optimizer একে কালো বাক্স ধরে নির্দিষ্ট সংখ্যা অনুমান করে। দুটোই Programmability > Functions > Table-valued Functions-এ।",
  story: [
    "An inline TVF is a vending machine with a glass front: you press 'London' and it hands you the London employees, and the shop owner can see exactly how it picks them. A multi-statement TVF is a closed kitchen: you give the order, someone inside does several steps and hands you a tray, but nobody outside can see how big the tray will be until it arrives.",
    "Inline TVF হলো কাচের সামনের vending machine: 'London' চাপলে London-এর কর্মীদের দেয়, আর দোকানদার দেখতে পান কীভাবে বাছাই হয়। Multi-statement TVF হলো বন্ধ রান্নাঘর: অর্ডার দেন, ভেতরে কেউ কয়েকটি ধাপ করে ট্রে দেয়, কিন্তু বাইরের কেউ জানে না ট্রে কত বড় হবে।",
  ],
  theory: [
    "Call a TVF with its schema: SELECT * FROM dbo.GetOrderById(10251). Join it like a table, or use CROSS APPLY to run it once per outer row: SELECT c.CompanyName, o.* FROM Customers c CROSS APPLY dbo.GetLatestOrders(c.CustomerId, 3) o. OUTER APPLY keeps outer rows that return nothing, like a LEFT JOIN. Inline TVFs can be updatable when they select from one table. In a multi-statement TVF you can use IF, loops and several inserts, which is useful for complex logic but slower on large data. Choose a view when there are no parameters, an inline TVF when there are parameters, and a stored procedure when the logic must change data.",
    "Schema সহ ডাকুন: SELECT * FROM dbo.GetOrderById(10251)। Table-এর মতো join করুন, বা বাইরের প্রতিটি সারিতে একবার চালাতে CROSS APPLY: Customers c CROSS APPLY dbo.GetLatestOrders(c.CustomerId, 3) o। OUTER APPLY ফল না দেওয়া বাইরের সারিও রাখে, LEFT JOIN-এর মতো। এক table থেকে select করা inline TVF update-যোগ্য হতে পারে। Multi-statement TVF-এ IF, loop, কয়েকটি insert চলে — জটিল logic-এ কাজের, কিন্তু বড় data-য় ধীর। Parameter না থাকলে view, parameter থাকলে inline TVF, data বদলাতে হলে stored procedure।",
  ],
  steps: [
    ["Create GetOrderById(@OrderId INT) RETURNS TABLE AS RETURN (SELECT ...).", "GetOrderById(@OrderId INT) RETURNS TABLE AS RETURN (SELECT ...) বানান।"],
    ["Call SELECT * FROM dbo.GetOrderById(10251).", "SELECT * FROM dbo.GetOrderById(10251) ডাকুন।"],
    ["Create GetEmployeesInCity(@City) and test with 'London'.", "GetEmployeesInCity(@City) বানিয়ে 'London' দিয়ে পরীক্ষা করুন।"],
    ["Write a multi-statement version that fills @EmpTbl and compare the plans.", "@EmpTbl ভরে এমন multi-statement সংস্করণ লিখে plan তুলনা করুন।"],
  ],
  mistakes: [
    "Mistake: SELECT dbo.GetOrderById(10251) in the SELECT list gives an error; a TVF must be used in FROM. Mistake: forgetting RETURN at the end of a multi-statement TVF body. Mistake: ORDER BY inside an inline TVF without TOP is not allowed; sort in the calling query.",
    "ভুল: SELECT তালিকায় SELECT dbo.GetOrderById(10251) error দেয়; TVF FROM-এ ব্যবহার করতে হয়। ভুল: multi-statement TVF-এর শেষে RETURN ভুলে যাওয়া। ভুল: TOP ছাড়া inline TVF-এর ভেতরে ORDER BY চলে না; ডাকা query-তে সাজান।",
  ],
  interview: [
    "Q: Inline vs multi-statement table-valued function? A: Inline has a single SELECT and is expanded into the outer query like a view, so it gets accurate estimates and good plans. Multi-statement builds a table variable step by step and returns it; it allows complex logic but has poor cardinality estimates and is usually slower.",
    "প্রশ্ন: Inline বনাম multi-statement TVF? উত্তর: Inline-এ একটিই SELECT, view-এর মতো বাইরের query-তে মিশে যায়, তাই সঠিক অনুমান ও ভালো plan। Multi-statement ধাপে ধাপে table variable বানিয়ে ফেরত দেয়; জটিল logic চলে কিন্তু অনুমান দুর্বল, সাধারণত ধীর।",
  ],
  dEn: "Prefer inline TVFs as parameterised views for reusable read logic. Reach for multi-statement TVFs only when the logic genuinely needs several steps, and test them against realistic data sizes.",
  dBn: "পুনর্ব্যবহারযোগ্য পড়ার logic-এ parameter-যুক্ত view হিসেবে inline TVF নিন। Logic-এ সত্যিই কয়েকটি ধাপ লাগলে তবেই multi-statement TVF, আর বাস্তব আকারের data-য় পরীক্ষা করুন।",
  examples: [
    tsql(
      "Inline and multi-statement TVFs on Northwind · Northwind-এ TVF",
      `---table valued functions
CREATE OR ALTER FUNCTION dbo.GetOrderById (@OrderId INT)
RETURNS TABLE
AS
RETURN (SELECT * FROM Orders WHERE OrderId = @OrderId);
GO
CREATE OR ALTER FUNCTION dbo.GetEmployeeById (@Id INT)
RETURNS @EmpTbl TABLE (FirstName NVARCHAR(10), LastName NVARCHAR(20), Dob DATETIME)
AS
BEGIN
    INSERT INTO @EmpTbl
    SELECT FirstName, LastName, BirthDate FROM Employees WHERE EmployeeId = @Id;
    RETURN;
END
GO
SELECT * FROM dbo.GetOrderById(10251);
SELECT * FROM dbo.GetEmployeeById(1);`,
      "OrderID  CustomerID  EmployeeID  OrderDate   ShipCity\n10251    VICTE       3           1996-07-08  Lyon\n\nFirstName  LastName  Dob\nNancy      Davolio   1948-12-08 00:00:00.000",
    ),
    lite(
      "A view as the parameter-free cousin of a TVF · view দিয়ে একই ধারণা",
      `DROP VIEW IF EXISTS EngineeringStaff;
CREATE VIEW EngineeringStaff AS
SELECT e.Id, e.Name, e.Salary
FROM Employees e JOIN Departments d ON d.Id = e.DepartmentId
WHERE d.Name = 'Engineering';
SELECT * FROM EngineeringStaff WHERE Salary > 60000;`,
    ),
  ],
});

chapter("Transactions with TRY...CATCH", {
  en: "By default every single statement in SQL Server is its own transaction (autocommit). BEGIN TRANSACTION starts an explicit transaction that stays open until COMMIT or ROLLBACK, so several statements succeed or fail together. TRY...CATCH catches errors with severity above 10 that do not close the connection: when any statement in the TRY block fails, the remaining statements are skipped and control moves to CATCH. Inside CATCH, ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_LINE(), ERROR_PROCEDURE() and ERROR_SEVERITY() describe the problem, @@TRANCOUNT tells whether a transaction is still open and XACT_STATE() tells whether it can be committed.",
  bn: "Default-এ SQL Server-এর প্রতিটি statement নিজেই একটি transaction (autocommit)। BEGIN TRANSACTION একটি স্পষ্ট transaction শুরু করে, যা COMMIT বা ROLLBACK পর্যন্ত খোলা থাকে — ফলে কয়েকটি statement একসাথে সফল বা ব্যর্থ হয়। TRY...CATCH সেই error ধরে যা connection বন্ধ করে না: TRY-এর কোনো statement ব্যর্থ হলে বাকিগুলো বাদ দিয়ে CATCH-এ যায়। CATCH-এ ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_LINE() সমস্যা বলে, @@TRANCOUNT বলে transaction খোলা কি না, XACT_STATE() বলে commit করা যাবে কি না।",
  story: [
    "Transferring a plot of land needs three signatures: the seller, the buyer and the registrar. If the registrar refuses, the seller's and buyer's signatures are torn up too; the deal never half-happens. BEGIN TRANSACTION is opening the deed, COMMIT is the registrar's stamp and ROLLBACK is tearing it up. TRY...CATCH is the lawyer who notices the refusal and tears the papers for you.",
    "জমি হস্তান্তরে তিনটি সই লাগে: বিক্রেতা, ক্রেতা আর রেজিস্ট্রার। রেজিস্ট্রার রাজি না হলে বিক্রেতা ও ক্রেতার সইও ছিঁড়ে ফেলা হয়; চুক্তি অর্ধেক হয় না। BEGIN TRANSACTION হলো দলিল খোলা, COMMIT রেজিস্ট্রারের সিল, ROLLBACK ছিঁড়ে ফেলা। TRY...CATCH হলো সেই উকিল, যিনি আপত্তি দেখে আপনার হয়ে কাগজ ছিঁড়ে দেন।",
  ],
  theory: [
    "Recommended template: SET XACT_ABORT ON; BEGIN TRY BEGIN TRAN; ...work...; COMMIT; END TRY BEGIN CATCH IF @@TRANCOUNT > 0 ROLLBACK; THROW; END CATCH. XACT_ABORT ON makes most runtime errors doom and roll back the transaction, including when a client times out. THROW (without arguments) re-raises the original error so the application knows it failed; selecting a message alone would hide the failure from C#. Some errors are not caught in the same scope: compile errors such as a missing table name in the same batch, and errors with severity 20 or higher. SAVE TRANSACTION name creates a savepoint you can roll back to partially. Nested BEGIN TRAN only increments @@TRANCOUNT; a single ROLLBACK undoes everything.",
    "প্রস্তাবিত কাঠামো: SET XACT_ABORT ON; BEGIN TRY BEGIN TRAN; ...কাজ...; COMMIT; END TRY BEGIN CATCH IF @@TRANCOUNT > 0 ROLLBACK; THROW; END CATCH। XACT_ABORT ON হলে বেশিরভাগ runtime error-এ transaction নিজে rollback হয়, client timeout হলেও। THROW (argument ছাড়া) আসল error আবার তোলে, যাতে app জানে কাজ ব্যর্থ; শুধু বার্তা SELECT করলে C# ব্যর্থতা টের পায় না। কিছু error একই scope-এ ধরা পড়ে না: একই batch-এ না থাকা table-এর নামের মতো compile error, আর severity ২০ বা বেশি। SAVE TRANSACTION name savepoint বানায়, আংশিক rollback করা যায়। Nested BEGIN TRAN শুধু @@TRANCOUNT বাড়ায়; একটি ROLLBACK সব ফেরায়।",
  ],
  steps: [
    ["Write three statements that must succeed together.", "একসাথে সফল হতেই হবে এমন তিনটি statement লিখুন।"],
    ["Wrap them in BEGIN TRY + BEGIN TRANSACTION ... COMMIT.", "BEGIN TRY + BEGIN TRANSACTION ... COMMIT-এ মুড়ে দিন।"],
    ["In BEGIN CATCH, roll back when @@TRANCOUNT > 0 and show ERROR_MESSAGE().", "BEGIN CATCH-এ @@TRANCOUNT > 0 হলে rollback, ERROR_MESSAGE() দেখান।"],
    ["Break the third statement on purpose and confirm the first two were undone.", "ইচ্ছা করে তৃতীয়টি ভাঙুন, আর দেখুন প্রথম দুটি ফিরেছে।"],
  ],
  mistakes: [
    "Mistake: no TRY/CATCH, so after an error the transaction stays open, holding locks, until the window is closed. Mistake: COMMIT placed after END TRY, so it runs even after a failure was caught. Mistake: swallowing errors in CATCH with only a SELECT message; the application thinks everything succeeded. Re-throw with THROW.",
    "ভুল: TRY/CATCH নেই, তাই error-এর পরে transaction খোলা থাকে আর window বন্ধ না হওয়া পর্যন্ত lock ধরে রাখে। ভুল: END TRY-এর পরে COMMIT রাখা, ফলে ব্যর্থতা ধরার পরেও চলে। ভুল: CATCH-এ শুধু SELECT বার্তা দিয়ে error গিলে ফেলা; app ভাবে সব সফল। THROW দিয়ে আবার তুলুন।",
  ],
  interview: [
    "Q: What does @@TRANCOUNT tell you? A: The number of open BEGIN TRANSACTION statements in the session. COMMIT decrements it by one; the outermost COMMIT really commits. ROLLBACK sets it to zero and undoes all work. Checking IF @@TRANCOUNT > 0 before ROLLBACK avoids error 3903 when no transaction is active.",
    "প্রশ্ন: @@TRANCOUNT কী বলে? উত্তর: Session-এ কতগুলো BEGIN TRANSACTION খোলা আছে। COMMIT এক কমায়; সবচেয়ে বাইরের COMMIT আসলে commit করে। ROLLBACK শূন্য করে আর সব কাজ ফেরায়। ROLLBACK-এর আগে IF @@TRANCOUNT > 0 দেখলে transaction না থাকলে error 3903 এড়ানো যায়।",
  ],
  dEn: "Use explicit transactions for every multi-statement business change (order + order lines + stock). Keep them short, touch tables in a consistent order to avoid deadlocks, and always re-throw errors. In .NET, either let the stored procedure own the transaction or use SqlTransaction or EF Core's BeginTransaction, but not both at once.",
  dBn: "প্রতিটি বহু-statement ব্যবসায়িক পরিবর্তনে (অর্ডার + অর্ডার লাইন + stock) স্পষ্ট transaction ব্যবহার করুন। ছোট রাখুন, deadlock এড়াতে table একই ক্রমে ছুঁয়ে যান, আর error সবসময় আবার তুলুন। .NET-এ procedure-ই transaction সামলাক, নয়তো SqlTransaction বা EF Core-এর BeginTransaction — দুটো একসাথে নয়।",
  examples: [
    tsql(
      "Transaction with TRY...CATCH from the course · course-এর উদাহরণ",
      `SET XACT_ABORT ON;
BEGIN TRY
    BEGIN TRANSACTION;
        UPDATE DepartmentsJn SET DepartmentName = 'IT Cell' WHERE DepartmentId = 10;
        INSERT INTO EmployeesJn (EmployeeName, DepartmentId, Salary) VALUES ('Ved', 10, 50000);
        INSERT INTO DepartmentsJn (DepartmentId, DepartmentName, Location) VALUES (40, 'Legal', NULL);
    COMMIT TRANSACTION;
    SELECT 'Operation Successfully Done!' AS Status;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
    BEGIN
        ROLLBACK TRANSACTION;
        SELECT 'Transaction Rollback Successfully! ' + ERROR_MESSAGE() AS Status;
    END
    -- THROW;   -- re-raise for the application in real code
END CATCH;`,
      "Status\nTransaction Rollback Successfully! Cannot insert the value NULL into column 'Location', table 'Practice.dbo.DepartmentsJn'; column does not allow nulls. INSERT fails.\n\n(DepartmentName for 10 is still 'IT' and Ved was not added.)",
    ),
    lite(
      "BEGIN, ROLLBACK and COMMIT in SQLite · SQLite-এ transaction",
      `BEGIN TRANSACTION;
UPDATE Employees SET Salary = Salary + 10000 WHERE DepartmentId = 1;
SELECT 'inside' AS Phase, SUM(Salary) AS Payroll FROM Employees;
ROLLBACK;
SELECT 'after rollback' AS Phase, SUM(Salary) AS Payroll FROM Employees;
BEGIN TRANSACTION;
UPDATE Employees SET Salary = Salary + 1000 WHERE Id = 6;
COMMIT;
SELECT 'after commit' AS Phase, Salary FROM Employees WHERE Id = 6;`,
    ),
  ],
});

chapter("ACID Properties", {
  en: "ACID describes how a reliable database protects transactions. Atomicity means a transaction is indivisible: commit or rollback, never half done. Consistency means a transaction moves the database from one valid state to another, so constraints, foreign keys and triggers are always satisfied after it. Isolation means concurrent transactions do not see each other's uncommitted work; SQL Server implements this with locks and optional row versioning. Durability means once a commit is acknowledged, the change is safe even after a crash, because SQL Server writes it to the transaction log on disk first (write-ahead logging).",
  bn: "ACID বলে নির্ভরযোগ্য database কীভাবে transaction রক্ষা করে। Atomicity: transaction অবিভাজ্য — commit বা rollback, কখনো অর্ধেক নয়। Consistency: transaction database-কে এক বৈধ অবস্থা থেকে আরেক বৈধ অবস্থায় নেয়, constraint, foreign key, trigger সবসময় মানা হয়। Isolation: একসাথে চলা transaction একে অপরের commit-না-হওয়া কাজ দেখে না; SQL Server lock আর row versioning দিয়ে এটি করে। Durability: commit নিশ্চিত হলে crash-এর পরেও পরিবর্তন নিরাপদ, কারণ আগে disk-এর transaction log-এ লেখা হয় (write-ahead logging)।",
  story: [
    "Sending money through bKash: the money must leave your wallet and reach your friend's wallet, or neither happens (Atomicity). The total money in the system stays correct and no balance goes negative (Consistency). Two people paying the same shop at the same moment do not mix up each other's payments (Isolation). After you get the 'successful' SMS, a power cut at the server cannot erase the payment (Durability).",
    "bKash-এ টাকা পাঠানো: টাকা আপনার wallet থেকে যাবে আর বন্ধুর wallet-এ পৌঁছাবে, নয়তো কোনোটাই হবে না (Atomicity)। সিস্টেমে মোট টাকা ঠিক থাকে, কোনো ব্যালান্স ঋণাত্মক হয় না (Consistency)। একই মুহূর্তে দুজন একই দোকানে টাকা দিলে কারও লেনদেন মিশে যায় না (Isolation)। 'সফল' SMS পাওয়ার পরে server-এ বিদ্যুৎ গেলেও লেনদেন মুছে যায় না (Durability)।",
  ],
  theory: [
    "Isolation levels trade correctness for concurrency. READ UNCOMMITTED (or NOLOCK) allows dirty reads of uncommitted data. READ COMMITTED, the SQL Server default, prevents dirty reads but a second read may see changed values (non-repeatable read). REPEATABLE READ keeps read rows locked so they cannot change, but new rows can appear (phantoms). SERIALIZABLE locks ranges so the transaction behaves as if it ran alone. SNAPSHOT and READ_COMMITTED_SNAPSHOT use row versions in tempdb so readers do not block writers. Two transactions waiting on each other's locks cause a deadlock; SQL Server picks a victim, rolls it back and returns error 1205, so applications should retry. Durability depends on the log: back up the log in the FULL recovery model to restore to a point in time.",
    "Isolation level সঠিকতা আর একসাথে চলার মধ্যে ভারসাম্য করে। READ UNCOMMITTED (বা NOLOCK) commit-না-হওয়া data পড়তে দেয় (dirty read)। READ COMMITTED, SQL Server-এর default, dirty read আটকায় কিন্তু দ্বিতীয়বার পড়লে বদলানো মান দেখা যেতে পারে। REPEATABLE READ পড়া সারি lock রাখে, কিন্তু নতুন সারি আসতে পারে (phantom)। SERIALIZABLE পরিসর lock করে, যেন transaction একা চলছে। SNAPSHOT ও READ_COMMITTED_SNAPSHOT tempdb-তে row version রাখে, ফলে পাঠক লেখককে আটকায় না। দুই transaction একে অপরের lock-এর অপেক্ষায় থাকলে deadlock; SQL Server একটিকে বেছে rollback করে error 1205 দেয়, তাই app-এ retry রাখুন। Durability নির্ভর করে log-এর উপর: FULL recovery-তে log backup নিলে নির্দিষ্ট সময়ে restore করা যায়।",
  ],
  steps: [
    ["Write a money transfer between two accounts inside one transaction.", "এক transaction-এ দুই account-এর মধ্যে টাকা পাঠানো লিখুন।"],
    ["Add a CHECK (Balance >= 0) constraint to enforce consistency.", "Consistency রাখতে CHECK (Balance >= 0) যোগ করুন।"],
    ["Open two windows, update in one without committing, read in the other and observe blocking.", "দুই window খুলে একটিতে commit ছাড়া update, অন্যটিতে পড়ে blocking দেখুন।"],
    ["Commit, then restart the service and confirm the data is still there.", "Commit করে service restart দিন, data আছে কি না দেখুন।"],
  ],
  mistakes: [
    "Mistake: sprinkling WITH (NOLOCK) everywhere for speed; reports may read uncommitted, duplicated or missing rows. Mistake: leaving a transaction open in an SSMS window during lunch, blocking the whole team. Mistake: believing consistency comes from the application alone; without constraints the database cannot guarantee it.",
    "ভুল: গতির জন্য সবখানে WITH (NOLOCK); report commit-না-হওয়া, নকল বা হারানো সারি পড়তে পারে। ভুল: দুপুরের খাবারের সময় SSMS window-তে transaction খোলা রেখে পুরো দলকে আটকে রাখা। ভুল: ভাবা consistency শুধু app থেকে আসে; constraint ছাড়া database নিশ্চয়তা দিতে পারে না।",
  ],
  interview: [
    "Q: Explain ACID with an example. A: In a bank transfer, debit and credit happen together or not at all (Atomicity); balances never break rules such as non-negative (Consistency); other users never see the money missing from both accounts mid-transfer (Isolation); after commit, the transfer survives a crash because it is in the log (Durability).",
    "প্রশ্ন: উদাহরণ দিয়ে ACID ব্যাখ্যা করুন। উত্তর: ব্যাংক transfer-এ debit ও credit একসাথে হয় বা কোনোটাই নয় (Atomicity); ব্যালান্স কখনো নিয়ম ভাঙে না, যেমন ঋণাত্মক নয় (Consistency); মাঝপথে অন্য user দুই account থেকেই টাকা উধাও দেখে না (Isolation); commit-এর পরে log-এ থাকায় crash-এও থাকে (Durability)।",
  ],
  dEn: "Rely on ACID transactions for money, stock and anything that must balance. Consider enabling READ_COMMITTED_SNAPSHOT on busy OLTP databases to reduce reader/writer blocking, and design retry logic for deadlocks and transient errors in the application.",
  dBn: "টাকা, stock আর যা মিলতেই হবে তার জন্য ACID transaction-এ ভরসা করুন। ব্যস্ত OLTP database-এ পাঠক-লেখক blocking কমাতে READ_COMMITTED_SNAPSHOT চালু করার কথা ভাবুন, আর app-এ deadlock ও সাময়িক error-এর জন্য retry রাখুন।",
  examples: [
    tsql(
      "Bank transfer that respects ACID · ACID মেনে টাকা পাঠানো",
      `CREATE TABLE Accounts (
    AccountId INT PRIMARY KEY,
    Holder    NVARCHAR(50) NOT NULL,
    Balance   DECIMAL(18,2) NOT NULL CONSTRAINT CK_Accounts_Balance CHECK (Balance >= 0)
);
INSERT INTO Accounts VALUES (1, N'Rahim', 1000), (2, N'Karim', 200);
SET XACT_ABORT ON;
BEGIN TRY
    BEGIN TRAN;
        UPDATE Accounts SET Balance = Balance - 1500 WHERE AccountId = 1;  -- breaks CHECK
        UPDATE Accounts SET Balance = Balance + 1500 WHERE AccountId = 2;
    COMMIT;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK;
    SELECT ERROR_MESSAGE() AS WhyRolledBack;
END CATCH;
SELECT AccountId, Holder, Balance FROM Accounts;`,
      "WhyRolledBack\nThe UPDATE statement conflicted with the CHECK constraint \"CK_Accounts_Balance\".\n\nAccountId  Holder  Balance\n1          Rahim   1000.00\n2          Karim   200.00",
    ),
    lite(
      "Atomic transfer in SQLite · SQLite-এ atomic transfer",
      `DROP TABLE IF EXISTS Accounts;
CREATE TABLE Accounts (AccountId INTEGER PRIMARY KEY, Holder TEXT, Balance INTEGER CHECK (Balance >= 0));
INSERT INTO Accounts VALUES (1, 'Rahim', 1000), (2, 'Karim', 200);
BEGIN TRANSACTION;
UPDATE Accounts SET Balance = Balance - 500 WHERE AccountId = 1;
UPDATE Accounts SET Balance = Balance + 500 WHERE AccountId = 2;
COMMIT;
SELECT * FROM Accounts;
SELECT SUM(Balance) AS TotalStillSame FROM Accounts;`,
    ),
  ],
});

chapter("Stored Procedures", {
  en: "A stored procedure is a named T-SQL program stored in the database. It accepts input parameters (with optional default values), OUTPUT parameters, and returns result sets and an integer return code. It can contain any statements: DML, DDL, transactions, TRY/CATCH, temp tables, loops and calls to other procedures. When first executed, SQL Server compiles an execution plan and caches it, so later calls are faster. You manage them with CREATE, ALTER, CREATE OR ALTER and DROP PROCEDURE, run them with EXEC and find them under Programmability > Stored Procedures. By convention user procedures are prefixed usp, not sp_ which is reserved for system procedures.",
  bn: "Stored procedure হলো database-এ জমা রাখা নামওয়ালা T-SQL program। এটি input parameter (default সহ), OUTPUT parameter নেয়, আর ফলের সেট ও একটি পূর্ণসংখ্যার return code দেয়। ভেতরে যেকোনো statement চলে: DML, DDL, transaction, TRY/CATCH, temp table, loop, অন্য procedure ডাকা। প্রথমবার চালালে SQL Server execution plan বানিয়ে cache করে, পরের বার দ্রুত হয়। CREATE, ALTER, CREATE OR ALTER, DROP PROCEDURE দিয়ে সামলান, EXEC দিয়ে চালান, Programmability > Stored Procedures-এ পাবেন। নিয়ম অনুযায়ী নিজের procedure-এর নাম usp দিয়ে শুরু, sp_ নয় — sp_ system procedure-এর জন্য।",
  story: [
    "A restaurant kitchen keeps recipe cards. A waiter does not explain every step to the cook; he just says 'Recipe 12, extra spicy, two plates'. The recipe card is the stored procedure, 'extra spicy, two plates' are the parameters, and the cook who already knows the recipe by heart is the cached execution plan.",
    "রেস্তোরাঁর রান্নাঘরে রেসিপি কার্ড থাকে। ওয়েটার রাঁধুনিকে প্রতিটি ধাপ বোঝান না; শুধু বলেন 'রেসিপি ১২, বেশি ঝাল, দুই প্লেট'। রেসিপি কার্ডই stored procedure, 'বেশি ঝাল, দুই প্লেট' হলো parameter, আর যে রাঁধুনি রেসিপি মুখস্থ করে ফেলেছেন তিনি cache করা execution plan।",
  ],
  theory: [
    "Parameters make procedures safe and reusable: EXEC UspEmployees @Action = 1, @EmployeeName = 'Jyoti' sends values separately from code, so input such as ' OR 1=1 -- is treated as plain text. OUTPUT parameters return single values: CREATE PROCEDURE UspAddEmployee @Name NVARCHAR(100), @NewId INT OUTPUT AS ... SET @NewId = SCOPE_IDENTITY(); then DECLARE @id INT; EXEC UspAddEmployee 'Asha', @id OUTPUT. SET NOCOUNT ON at the top removes '(n rows affected)' messages and reduces network chatter. A cached plan built for one parameter value can be poor for another (parameter sniffing); OPTION (RECOMPILE) or OPTIMIZE FOR are the usual fixes. You can right-click a procedure > Modify to see its script, or run sp_helptext 'UspEmployees'. A single @Action procedure is easy to learn, but in larger systems separate procedures per action (UspEmployee_Insert, UspEmployee_Update) are clearer and get better plans.",
    "Parameter procedure-কে নিরাপদ ও পুনর্ব্যবহারযোগ্য করে: EXEC UspEmployees @Action = 1, @EmployeeName = 'Jyoti' মান code থেকে আলাদা পাঠায়, তাই ' OR 1=1 -- সাধারণ লেখা হিসেবেই থাকে। OUTPUT parameter একটি মান ফেরত দেয়: ... @NewId INT OUTPUT ... SET @NewId = SCOPE_IDENTITY(); তারপর DECLARE @id INT; EXEC UspAddEmployee 'Asha', @id OUTPUT। শুরুতে SET NOCOUNT ON দিলে '(n rows affected)' বার্তা থাকে না, network কম ব্যস্ত হয়। এক মানের জন্য বানানো plan অন্য মানে খারাপ হতে পারে (parameter sniffing); OPTION (RECOMPILE) বা OPTIMIZE FOR সাধারণ সমাধান। Procedure-এ right-click > Modify বা sp_helptext দিয়ে script দেখুন। এক @Action procedure শেখা সহজ, কিন্তু বড় সিস্টেমে প্রতিটি কাজের আলাদা procedure পরিষ্কার আর ভালো plan পায়।",
  ],
  steps: [
    ["Create UspLearnSP that contains the transaction from the previous lesson.", "আগের lesson-এর transaction দিয়ে UspLearnSP বানান।"],
    ["Create UspEmployees with @Action and the other parameters with defaults.", "@Action আর default সহ অন্য parameter দিয়ে UspEmployees বানান।"],
    ["Use IF / ELSE IF blocks for insert (1), update (2), delete (3) and select.", "Insert (১), update (২), delete (৩), select-এর জন্য IF / ELSE IF লিখুন।"],
    ["Call each action with EXEC and named parameters, then check the table.", "নামসহ parameter দিয়ে প্রতিটি action EXEC করে table দেখুন।"],
  ],
  mistakes: [
    "Mistake: running CREATE PROCEDURE twice gives 'There is already an object named'; use ALTER or CREATE OR ALTER. Mistake: passing parameters by position and in the wrong order; use named parameters. Mistake: naming your procedure sp_Something, which makes SQL Server search master first. Mistake: forgetting GO after the procedure, so the following test EXEC becomes part of the procedure body.",
    "ভুল: CREATE PROCEDURE দুইবার — 'There is already an object named'; ALTER বা CREATE OR ALTER দিন। ভুল: অবস্থান অনুযায়ী ভুল ক্রমে parameter দেওয়া; নামসহ parameter দিন। ভুল: procedure-এর নাম sp_ দিয়ে শুরু করা, ফলে SQL Server আগে master-এ খোঁজে। ভুল: procedure-এর পরে GO না দেওয়া, ফলে পরের পরীক্ষার EXEC procedure-এর body-তে ঢুকে যায়।",
  ],
  interview: [
    "Q: Advantages of stored procedures? A: Plan reuse, fewer network round trips, a security boundary (grant EXECUTE, not table access), protection from SQL injection through parameters, and a single place for data logic shared by several applications. Q: How do you return a value? A: Result sets with SELECT, OUTPUT parameters for scalars, and RETURN for an integer status code.",
    "প্রশ্ন: Stored procedure-এর সুবিধা? উত্তর: Plan আবার ব্যবহার, network-এ কম আসা-যাওয়া, নিরাপত্তার সীমা (table নয়, EXECUTE অনুমতি), parameter-এর মাধ্যমে SQL injection থেকে সুরক্ষা, আর কয়েকটি app-এর data logic এক জায়গায়। প্রশ্ন: মান কীভাবে ফেরত দেন? উত্তর: SELECT দিয়ে ফলের সেট, একক মানে OUTPUT parameter, অবস্থা জানাতে RETURN (পূর্ণসংখ্যা)।",
  ],
  dEn: "Use stored procedures for performance-critical or security-sensitive data operations and for logic reused by several apps; keep business rules that change often in the application layer. Store procedure scripts in Git and deploy them with migrations. From ASP.NET Core call them with Dapper or EF Core using parameters only.",
  dBn: "Performance-জরুরি বা নিরাপত্তা-সংবেদনশীল কাজে আর কয়েকটি app-এ ব্যবহৃত logic-এ stored procedure নিন; প্রায়ই বদলায় এমন ব্যবসার নিয়ম app-এ রাখুন। Procedure script Git-এ রেখে migration দিয়ে deploy করুন। ASP.NET Core থেকে Dapper বা EF Core দিয়ে শুধু parameter সহ ডাকুন।",
  examples: [
    tsql(
      "UspEmployees: one procedure for CRUD · CRUD-এর একটি procedure",
      `---Stored Procedure...
CREATE OR ALTER PROCEDURE UspEmployees
    @Action       INT = 0,
    @EmployeeName NVARCHAR(100) = NULL,
    @DepartmentId INT = 0,
    @Salary       DECIMAL(10,2) = 0,
    @EmployeeId   INT = 0
AS
BEGIN
    SET NOCOUNT ON;
    IF (@Action = 1)
    BEGIN
        INSERT INTO EmployeesJn (EmployeeName, DepartmentId, Salary)
        VALUES (@EmployeeName, @DepartmentId, @Salary);
        SELECT 'Data Inserted Successfully!' AS Msg;
    END
    ELSE IF (@Action = 2)
    BEGIN
        UPDATE EmployeesJn SET EmployeeName = @EmployeeName WHERE EmployeeId = @EmployeeId;
        SELECT 'Data Updated Successfully!' AS Msg;
    END
    ELSE IF (@Action = 3)
    BEGIN
        DELETE FROM EmployeesJn WHERE EmployeeId = @EmployeeId;
        SELECT 'Data Deleted Successfully!' AS Msg;
    END
    ELSE IF (@Action = 4)
        SELECT * FROM EmployeesJn WHERE EmployeeId = @EmployeeId;
    ELSE
        SELECT * FROM EmployeesJn;
END
GO
EXEC UspEmployees @Action = 1, @EmployeeName = 'Jyoti', @DepartmentId = 10, @Salary = 70000;
EXEC UspEmployees @Action = 2, @EmployeeId = 5, @EmployeeName = 'Jyoti Kumari';
EXEC UspEmployees @Action = 4, @EmployeeId = 5;`,
      "Msg\nData Inserted Successfully!\n\nMsg\nData Updated Successfully!\n\nEmployeeId  EmployeeName  DepartmentId  Salary\n5           Jyoti Kumari  10            70000.00",
    ),
    tsql(
      "OUTPUT parameter and calling from C# · OUTPUT parameter",
      `CREATE OR ALTER PROCEDURE UspAddEmployee
    @Name NVARCHAR(100), @DepartmentId INT, @Salary DECIMAL(10,2),
    @NewId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO EmployeesJn (EmployeeName, DepartmentId, Salary) VALUES (@Name, @DepartmentId, @Salary);
    SET @NewId = SCOPE_IDENTITY();
END
GO
DECLARE @id INT;
EXEC UspAddEmployee @Name = N'Asha', @DepartmentId = 20, @Salary = 55000, @NewId = @id OUTPUT;
SELECT @id AS NewEmployeeId;
-- C# with Dapper:
-- var p = new DynamicParameters(new { Name = "Asha", DepartmentId = 20, Salary = 55000m });
-- p.Add("NewId", dbType: DbType.Int32, direction: ParameterDirection.Output);
-- await conn.ExecuteAsync("UspAddEmployee", p, commandType: CommandType.StoredProcedure);`,
      "NewEmployeeId\n6",
    ),
  ],
});

chapter("Triggers & Audit Tables", {
  en: "DML triggers run automatically in response to INSERT, UPDATE or DELETE on a table or view. AFTER (FOR) triggers run after the statement and its constraints succeed, inside the same transaction, so a ROLLBACK in the trigger cancels the original statement too. INSTEAD OF triggers replace the statement, which is useful on views. Inside the trigger the pseudo-tables inserted and deleted hold the affected rows: INSERT fills inserted, DELETE fills deleted and UPDATE fills both with the after and before versions. DDL triggers (ON DATABASE FOR CREATE_TABLE, DROP_TABLE) and logon triggers also exist for auditing schema changes and logins.",
  bn: "DML trigger table বা view-এ INSERT, UPDATE বা DELETE হলে নিজে চলে। AFTER (FOR) trigger statement আর constraint সফল হওয়ার পরে, একই transaction-এর ভেতরে চলে — তাই trigger-এ ROLLBACK দিলে মূল statement-ও বাতিল হয়। INSTEAD OF trigger statement-এর বদলে চলে, view-এ কাজে লাগে। Trigger-এর ভেতরে inserted আর deleted ছদ্ম-table প্রভাবিত সারি রাখে: INSERT-এ inserted, DELETE-এ deleted, UPDATE-এ দুটোই (পরের ও আগের রূপ)। Schema পরিবর্তন ও login audit-এর জন্য DDL trigger আর logon trigger-ও আছে।",
  story: [
    "A trigger is like the CCTV camera above a shop's cash drawer. Nobody has to press record; every time the drawer opens (insert), money leaves (delete) or an amount is corrected (update), the camera writes down what happened and when. The shop staff do not even think about it.",
    "Trigger হলো দোকানের ক্যাশ ড্রয়ারের উপরের CCTV ক্যামেরা। কাউকে record চাপতে হয় না; ড্রয়ার খুললে (insert), টাকা বের হলে (delete) বা অঙ্ক ঠিক করলে (update) ক্যামেরা লিখে রাখে কী হলো, কখন। দোকানের কর্মীদের এ নিয়ে ভাবতেই হয় না।",
  ],
  theory: [
    "Always write triggers set-based: an UPDATE that touches 1,000 rows fires the trigger once with 1,000 rows in inserted and deleted, so use INSERT ... SELECT FROM inserted, never SELECT @Id = Id FROM inserted. For UPDATE audit, join deleted del to inserted ins on the primary key to compare old and new values, and use the UPDATE(Salary) function to act only when that column was in the SET list. Triggers add hidden work to every write and can cascade into other triggers (nested up to 32 levels), which makes debugging hard. Alternatives for auditing include temporal tables (SYSTEM_VERSIONING), Change Data Capture, SQL Server Audit or audit columns written by the application. Disable a trigger temporarily with DISABLE TRIGGER trg_update_Employee ON Employees.",
    "Trigger সবসময় set-based লিখুন: ১০০০ সারি বদলানো একটি UPDATE trigger একবারই চালায়, inserted ও deleted-এ ১০০০ সারি নিয়ে — তাই INSERT ... SELECT FROM inserted লিখুন, কখনো SELECT @Id = Id FROM inserted নয়। UPDATE audit-এ primary key দিয়ে deleted del আর inserted ins join করে পুরনো-নতুন মান মেলান, আর UPDATE(Salary) function দিয়ে শুধু সেই column বদলালে কাজ করুন। Trigger প্রতিটি write-এ লুকানো কাজ যোগ করে আর অন্য trigger-এ গড়াতে পারে (৩২ স্তর পর্যন্ত), ফলে debug কঠিন। Audit-এর বিকল্প: temporal table (SYSTEM_VERSIONING), Change Data Capture, SQL Server Audit বা app-এর audit column। সাময়িক বন্ধ করতে DISABLE TRIGGER।",
  ],
  steps: [
    ["Create Employees and an EmployeeAudit table.", "Employees আর EmployeeAudit table বানান।"],
    ["Create trg_insert_Employee AFTER INSERT that copies from inserted.", "inserted থেকে কপি করে এমন AFTER INSERT trigger বানান।"],
    ["Create the DELETE trigger reading deleted and the UPDATE trigger joining both.", "deleted পড়া DELETE trigger আর দুটো join করা UPDATE trigger বানান।"],
    ["Insert, update and delete employees, then SELECT * FROM EmployeeAudit.", "কর্মী insert, update, delete করে SELECT * FROM EmployeeAudit দেখুন।"],
  ],
  mistakes: [
    "Mistake: copy-pasting the insert trigger into the delete trigger but still reading from inserted, so the audit stores nothing; a DELETE trigger must read deleted (the course shows this exact fix with ALTER TRIGGER). Mistake: labelling every action 'INSERT' after copy-paste. Mistake: forgetting GO between CREATE TRIGGER statements: 'CREATE TRIGGER must be the first statement in a query batch'.",
    "ভুল: insert trigger কপি করে delete trigger বানিয়ে তবুও inserted থেকে পড়া, ফলে audit-এ কিছুই জমে না; DELETE trigger-কে deleted পড়তে হয় (course-এ ALTER TRIGGER দিয়ে ঠিক এই সংশোধন দেখানো হয়েছে)। ভুল: কপির পরে সব action-এর নাম 'INSERT' রেখে দেওয়া। ভুল: CREATE TRIGGER-গুলোর মাঝে GO না দেওয়া — 'must be the first statement in a query batch'।",
  ],
  interview: [
    "Q: What are the inserted and deleted tables? A: Temporary, in-memory pseudo-tables available only inside a trigger. inserted contains the new versions of affected rows (INSERT and UPDATE); deleted contains the old versions (DELETE and UPDATE). Q: AFTER vs INSTEAD OF? A: AFTER runs once the statement has succeeded; INSTEAD OF runs in place of it, letting you redirect or validate writes, for example on a view joined from several tables.",
    "প্রশ্ন: inserted আর deleted table কী? উত্তর: শুধু trigger-এর ভেতরে পাওয়া অস্থায়ী ছদ্ম-table। inserted-এ প্রভাবিত সারির নতুন রূপ (INSERT ও UPDATE); deleted-এ পুরনো রূপ (DELETE ও UPDATE)। প্রশ্ন: AFTER বনাম INSTEAD OF? উত্তর: AFTER statement সফল হওয়ার পরে চলে; INSTEAD OF তার বদলে চলে, ফলে লেখা ঘুরিয়ে বা যাচাই করা যায় — যেমন কয়েকটি table join করা view-এ।",
  ],
  dEn: "Use triggers sparingly for rules that must hold no matter which application writes: audit trails, preventing deletes of protected rows, or keeping a denormalised total in sync. Keep them short, set-based and documented. For full history prefer system-versioned temporal tables, which SQL Server maintains automatically.",
  dBn: "যে app-ই লিখুক, যে নিয়ম মানতেই হবে শুধু সেখানে অল্প trigger দিন: audit trail, সুরক্ষিত সারি মুছতে না দেওয়া, বা denormalised মোট হালনাগাদ রাখা। ছোট, set-based আর নথিভুক্ত রাখুন। পুরো ইতিহাসের জন্য system-versioned temporal table ভালো, যা SQL Server নিজেই রাখে।",
  examples: [
    tsql(
      "Insert, delete and update audit triggers · তিনটি audit trigger",
      `--triggers
CREATE TABLE Employees (Id INT PRIMARY KEY, Name VARCHAR(100), Salary DECIMAL(10,2), Department VARCHAR(100));
CREATE TABLE EmployeeAudit (
    AuditId INT IDENTITY(1,1) PRIMARY KEY, EmployeeId INT, Action VARCHAR(20),
    OldSalary DECIMAL(10,2), NewSalary DECIMAL(10,2), AuditDate DATETIME);
GO
CREATE TRIGGER trg_insert_Employee ON Employees AFTER INSERT AS
BEGIN
    INSERT INTO EmployeeAudit (EmployeeId, Action, NewSalary, AuditDate)
    SELECT Id, 'INSERT', Salary, GETDATE() FROM inserted;
END
GO
CREATE TRIGGER trg_delete_Employee ON Employees AFTER DELETE AS
BEGIN
    INSERT INTO EmployeeAudit (EmployeeId, Action, OldSalary, AuditDate)
    SELECT Id, 'DELETE', Salary, GETDATE() FROM deleted;
END
GO
CREATE TRIGGER trg_update_Employee ON Employees AFTER UPDATE AS
BEGIN
    INSERT INTO EmployeeAudit (EmployeeId, Action, OldSalary, NewSalary, AuditDate)
    SELECT ins.Id, 'UPDATE', del.Salary, ins.Salary, GETDATE()
    FROM deleted del INNER JOIN inserted ins ON del.Id = ins.Id;
END
GO
INSERT INTO Employees (Id, Name, Salary, Department) VALUES (1, 'Rohan', 15000, 'HR');
UPDATE Employees SET Salary = 14000 WHERE Id = 1;
DELETE FROM Employees WHERE Id = 1;
SELECT EmployeeId, Action, OldSalary, NewSalary FROM EmployeeAudit;`,
      "EmployeeId  Action  OldSalary  NewSalary\n1           INSERT  NULL       15000.00\n1           UPDATE  15000.00   14000.00\n1           DELETE  14000.00   NULL",
    ),
    lite(
      "Audit trigger in SQLite (NEW and OLD rows) · SQLite-এ trigger",
      `DROP TABLE IF EXISTS SalaryAudit;
DROP TRIGGER IF EXISTS trg_salary_update;
CREATE TABLE SalaryAudit (EmployeeId INTEGER, OldSalary INTEGER, NewSalary INTEGER, AuditDate TEXT);
CREATE TRIGGER trg_salary_update AFTER UPDATE OF Salary ON Employees
BEGIN
  INSERT INTO SalaryAudit VALUES (OLD.Id, OLD.Salary, NEW.Salary, datetime('now'));
END;
UPDATE Employees SET Salary = Salary + 2000 WHERE DepartmentId = 1;
SELECT * FROM SalaryAudit;`,
    ),
  ],
});

chapter("SQL Profiler & Execution Plan", {
  en: "Performance tuning starts with measuring. SQL Server Profiler is a graphical tool (Tools > SQL Server Profiler in SSMS) that creates a trace: you choose events such as RPC:Completed and SQL:BatchCompleted, columns such as TextData, ApplicationName, Duration, CPU and Reads, and filters such as DatabaseName LIKE 'Practice'. It shows the exact SQL an application like EF Core sends. Profiler is deprecated in favour of Extended Events (XEvent Profiler in SSMS), which is lighter. The execution plan shows the operators SQL Server chose: Index Seek, Index Scan, Table Scan, Key Lookup, Nested Loops, Hash Match, Merge Join, Sort, with arrows whose thickness shows row counts.",
  bn: "Performance tuning শুরু হয় মাপা দিয়ে। SQL Server Profiler (SSMS-এ Tools > SQL Server Profiler) একটি trace বানায়: RPC:Completed, SQL:BatchCompleted-এর মতো event, TextData, ApplicationName, Duration, CPU, Reads-এর মতো column, আর DatabaseName LIKE 'Practice'-এর মতো filter বাছেন। EF Core-এর মতো app ঠিক কোন SQL পাঠাচ্ছে তা দেখায়। Profiler পুরনো হয়ে যাচ্ছে, তার বদলে হালকা Extended Events (SSMS-এ XEvent Profiler)। Execution plan দেখায় SQL Server কোন operator বেছেছে: Index Seek, Index Scan, Table Scan, Key Lookup, Nested Loops, Hash Match, Sort — তীরের মোটা মাপ সারির সংখ্যা বোঝায়।",
  story: [
    "When a car is slow, a good mechanic does not guess; he connects a diagnostic machine (Profiler) to see which part is struggling and then opens the engine map (execution plan) to see the path fuel takes. Only then does he replace the right part (add an index or rewrite the query) and test-drive again.",
    "গাড়ি ধীর হলে ভালো mechanic অনুমান করেন না; diagnostic যন্ত্র (Profiler) লাগিয়ে দেখেন কোন অংশ কষ্ট পাচ্ছে, তারপর engine-এর মানচিত্র (execution plan) খুলে দেখেন জ্বালানি কোন পথে যায়। তারপরই সঠিক অংশ বদলান (index যোগ বা query নতুন করে লেখা) আর আবার চালিয়ে দেখেন।",
  ],
  theory: [
    "Read a plan right to left and top to bottom: data flows from the right-most operators toward SELECT. Hover over an operator to see estimated vs actual rows, logical reads and the predicate. Warning signs: a Table or Clustered Index Scan on a large table for a selective filter (missing index or non-sargable predicate), a Key Lookup executed thousands of times (add INCLUDE columns), a big gap between estimated and actual rows (stale statistics or parameter sniffing), Sort or Hash operators with a yellow spill warning (memory grant too small), and implicit conversion warnings. SET STATISTICS IO ON reports logical reads per table, the best single number to compare before and after. Query Store (enabled per database) keeps history of plans and runtime statistics and can force a known good plan.",
    "Plan পড়ুন ডান থেকে বামে, উপর থেকে নিচে: data ডানদিকের operator থেকে SELECT-এর দিকে যায়। Operator-এর উপর mouse রাখলে আনুমানিক বনাম আসল সারি, logical read আর শর্ত দেখা যায়। সতর্কতার চিহ্ন: বেছে নেওয়া filter-এ বড় table-এ Table বা Clustered Index Scan (index নেই বা non-sargable শর্ত), হাজারবার চলা Key Lookup (INCLUDE column দিন), আনুমানিক ও আসল সারিতে বড় ফারাক (পুরনো statistics বা parameter sniffing), হলুদ spill সতর্কতা সহ Sort বা Hash, আর implicit conversion সতর্কতা। SET STATISTICS IO ON table-প্রতি logical read দেয় — আগে-পরে তুলনার সেরা সংখ্যা। Query Store plan আর runtime-এর ইতিহাস রাখে, ভালো plan জোর করে চালাতেও পারে।",
  ],
  steps: [
    ["Open SQL Server Profiler, connect and choose the TSQL_SP template.", "SQL Server Profiler খুলে connect করে TSQL_SP template বাছুন।"],
    ["In Events Selection add a filter DatabaseName LIKE your database and run the trace.", "Events Selection-এ DatabaseName LIKE আপনার database filter দিয়ে trace চালান।"],
    ["Execute EXEC UspEmployees ... in SSMS and watch it appear with Duration and Reads.", "SSMS-এ EXEC UspEmployees ... চালিয়ে Duration ও Reads সহ দেখুন।"],
    ["Press Ctrl+M, run the query again and read the actual execution plan.", "Ctrl+M চেপে query আবার চালিয়ে actual execution plan পড়ুন।"],
  ],
  mistakes: [
    "Mistake: running an unfiltered Profiler trace on production, which slows the server and floods the screen. Mistake: trusting the 'Query cost (relative to the batch)' percentages as real time; they are estimates. Mistake: blindly creating every 'Missing Index' suggestion, producing many overlapping indexes.",
    "ভুল: production-এ filter ছাড়া Profiler trace চালানো — server ধীর হয়, পর্দা ভরে যায়। ভুল: 'Query cost (relative to the batch)'-এর শতাংশকে আসল সময় ভাবা; এগুলো অনুমান। ভুল: প্রতিটি 'Missing Index' পরামর্শ চোখ বুজে বানানো, ফলে একে অপরের উপর চাপা অনেক index।",
  ],
  interview: [
    "Q: How do you troubleshoot a slow query? A: Reproduce it with the same parameters, capture it with Extended Events or Query Store, look at the actual execution plan and STATISTICS IO, check for scans, key lookups, estimate mismatches and implicit conversions, fix with an index, a sargable rewrite or updated statistics, then measure again and compare logical reads.",
    "প্রশ্ন: ধীর query কীভাবে সমাধান করবেন? উত্তর: একই parameter দিয়ে আবার চালান, Extended Events বা Query Store দিয়ে ধরুন, actual execution plan আর STATISTICS IO দেখুন, scan, key lookup, অনুমানের ফারাক আর implicit conversion খুঁজুন, index, sargable শর্ত বা statistics হালনাগাদ দিয়ে ঠিক করুন, তারপর আবার মেপে logical read তুলনা করুন।",
  ],
  dEn: "Make measuring a habit: enable Query Store on every database, keep Extended Events sessions for long-running queries and deadlocks, and compare logical reads before and after every tuning change. Tune the few queries that consume most resources rather than everything.",
  dBn: "মাপাকে অভ্যাস বানান: প্রতিটি database-এ Query Store চালু রাখুন, দীর্ঘ query আর deadlock-এর জন্য Extended Events session রাখুন, প্রতিটি tuning-এর আগে-পরে logical read তুলনা করুন। সবকিছু নয়, যে কয়টি query সবচেয়ে বেশি resource খায় সেগুলো ঠিক করুন।",
  examples: [
    tsql(
      "Measure, add an index, measure again · মাপুন, index দিন, আবার মাপুন",
      `SET STATISTICS IO ON;
SET STATISTICS TIME ON;
-- Ctrl+M first to include the actual execution plan
SELECT EmployeeId, EmployeeName, Salary FROM EmployeesJn WHERE EmployeeName = 'Asha';
CREATE NONCLUSTERED INDEX ix_EmployeesJn_Name ON EmployeesJn(EmployeeName) INCLUDE (Salary);
SELECT EmployeeId, EmployeeName, Salary FROM EmployeesJn WHERE EmployeeName = 'Asha';
SET STATISTICS IO OFF;
SET STATISTICS TIME OFF;
-- Recent expensive statements from the plan cache
SELECT TOP 5 qs.total_logical_reads, qs.execution_count,
       SUBSTRING(st.text, 1, 200) AS QueryText
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) st
ORDER BY qs.total_logical_reads DESC;`,
      "Before: Table 'EmployeesJn'. Scan count 1, logical reads 120   (Clustered Index Scan)\nAfter:  Table 'EmployeesJn'. Scan count 1, logical reads 2     (Index Seek)\nSQL Server Execution Times: CPU time = 0 ms, elapsed time = 1 ms.",
    ),
    lite(
      "Read SQLite's plan for a join · join-এর plan পড়ুন",
      `EXPLAIN QUERY PLAN
SELECT d.Name, COUNT(*) AS People
FROM Employees e
JOIN Departments d ON d.Id = e.DepartmentId
WHERE e.Salary > 60000
GROUP BY d.Name;`,
    ),
  ],
});

chapter("FOR XML PATH & STUFF", {
  en: "FOR XML is a clause added to the end of a SELECT that returns the result as XML instead of a grid. FOR XML PATH('RowName') wraps each row in <RowName> and each column becomes a child element named after the column alias. Columns without a name (an expression such as ',' + FirstName) are written as plain text with no element. With PATH('') there is no row element either, so all rows are concatenated into a single string. STUFF(string, start, length, replace) deletes length characters starting at start and inserts replace there; STUFF(list, 1, 1, '') removes the first character, the leading comma.",
  bn: "FOR XML SELECT-এর শেষে যোগ করা clause, যা grid-এর বদলে XML দেয়। FOR XML PATH('RowName') প্রতিটি সারিকে <RowName>-এ মোড়ায়, প্রতিটি column alias-এর নামে child element হয়। নামহীন column (',' + FirstName-এর মতো expression) কোনো element ছাড়া সাধারণ লেখা হিসেবে যায়। PATH('') দিলে সারির element-ও থাকে না, তাই সব সারি জুড়ে একটি লেখা হয়। STUFF(string, start, length, replace) start থেকে length অক্ষর মুছে সেখানে replace বসায়; STUFF(list, 1, 1, '') প্রথম অক্ষর, মানে শুরুর কমা, সরায়।",
  story: [
    "A teacher wants to write all students' names on one line of the blackboard. She writes a comma before each name as she goes: ,Nancy,Andrew,Janet. At the end she rubs out the very first comma with her finger. Writing the names in a row is FOR XML PATH(''), and rubbing out the first comma is STUFF.",
    "শিক্ষক বোর্ডের এক লাইনে সব ছাত্রের নাম লিখতে চান। প্রতিটি নামের আগে কমা দিয়ে লেখেন: ,Nancy,Andrew,Janet। শেষে আঙুল দিয়ে একেবারে প্রথম কমাটি মুছে দেন। এক লাইনে নাম লেখা হলো FOR XML PATH(''), প্রথম কমা মুছা হলো STUFF।",
  ],
  theory: [
    "Before SQL Server 2017 there was no built-in string aggregation, so STUFF + FOR XML PATH was the standard trick for comma-separated lists, often inside a correlated subquery to build one list per group: SELECT d.DepartmentName, STUFF((SELECT ',' + e.EmployeeName FROM EmployeesJn e WHERE e.DepartmentId = d.DepartmentId FOR XML PATH('')), 1, 1, '') FROM DepartmentsJn d. Because the output is XML, special characters are escaped (& becomes &amp;); adding , TYPE).value('.', 'NVARCHAR(MAX)') returns the original text. SQL Server 2017+ provides STRING_AGG(expression, separator) WITHIN GROUP (ORDER BY ...), which is shorter, faster and has no escaping issue. The reverse operation, splitting a string into rows, is STRING_SPLIT('a,b,c', ','). FOR JSON PATH works like FOR XML PATH but produces JSON for APIs.",
    "SQL Server 2017-এর আগে built-in string aggregation ছিল না, তাই comma দেওয়া তালিকার জন্য STUFF + FOR XML PATH ছিল আদর্শ কৌশল, প্রায়ই correlated subquery-তে প্রতিটি দলের আলাদা তালিকা বানাতে। Output XML বলে বিশেষ অক্ষর বদলে যায় (& হয় &amp;); , TYPE).value('.', 'NVARCHAR(MAX)') যোগ করলে আসল লেখা ফেরে। SQL Server 2017+-এ STRING_AGG(expression, separator) WITHIN GROUP (ORDER BY ...) — ছোট, দ্রুত, escaping সমস্যা নেই। উল্টো কাজ, লেখা ভেঙে সারি বানানো, STRING_SPLIT('a,b,c', ',')। FOR JSON PATH একইভাবে API-র জন্য JSON বানায়।",
  ],
  steps: [
    ["Run SELECT FirstName, LastName, Title FROM Employee FOR XML PATH('Employee') and open the XML link.", "FOR XML PATH('Employee') চালিয়ে XML link খুলুন।"],
    ["Change to SELECT ',' + FirstName ... FOR XML PATH('') and see one long string.", "SELECT ',' + FirstName ... FOR XML PATH('')-এ বদলে একটি লম্বা লেখা দেখুন।"],
    ["Test STUFF('Rohan Kumawat', 1, 3, 'xyz') to understand STUFF on its own.", "STUFF আলাদা বুঝতে STUFF('Rohan Kumawat', 1, 3, 'xyz') চালান।"],
    ["Wrap the list in STUFF(..., 1, 1, '') and compare with STRING_AGG.", "তালিকাকে STUFF(..., 1, 1, '')-এ মুড়ে STRING_AGG-এর সাথে তুলনা করুন।"],
  ],
  mistakes: [
    "Mistake: giving the concatenated column an alias (',' + FirstName AS Name), which wraps every name in <Name> tags. Leave it unnamed. Mistake: STUFF(list, 0, 1, '') returns NULL because position 0 is invalid; start at 1. Mistake: forgetting that FOR XML escapes &, < and >, producing 'Tom &amp; Jerry'.",
    "ভুল: জোড়া column-এ alias দেওয়া (',' + FirstName AS Name), ফলে প্রতিটি নাম <Name> tag-এ মোড়ানো হয়। নামহীন রাখুন। ভুল: STUFF(list, 0, 1, '') NULL দেয়, কারণ ০ অবস্থান অবৈধ; ১ থেকে শুরু করুন। ভুল: ভুলে যাওয়া যে FOR XML &, <, > বদলে দেয়, ফলে 'Tom &amp; Jerry'।",
  ],
  interview: [
    "Q: How do you return all employee names of each department as a comma-separated list? A: On SQL Server 2017+: SELECT DepartmentId, STRING_AGG(EmployeeName, ', ') WITHIN GROUP (ORDER BY EmployeeName) FROM EmployeesJn GROUP BY DepartmentId. On older versions use STUFF with a correlated FOR XML PATH('') subquery.",
    "প্রশ্ন: প্রতিটি বিভাগের সব কর্মীর নাম comma দিয়ে কীভাবে দেবেন? উত্তর: SQL Server 2017+-এ GROUP BY DepartmentId সহ STRING_AGG(EmployeeName, ', ') WITHIN GROUP (ORDER BY EmployeeName)। পুরনো version-এ correlated FOR XML PATH('') subquery-র সাথে STUFF।",
  ],
  dEn: "Use STRING_AGG on modern SQL Server and keep STUFF + FOR XML PATH for older servers or when maintaining existing code. Return lists as proper rows to applications when possible and join them in C# with string.Join; build strings in SQL mainly for reports and exports.",
  dBn: "আধুনিক SQL Server-এ STRING_AGG, আর পুরনো server বা পুরনো code রক্ষণাবেক্ষণে STUFF + FOR XML PATH। সম্ভব হলে app-এ তালিকা আলাদা সারি হিসেবে দিন আর C#-এ string.Join দিয়ে জুড়ুন; SQL-এ লেখা জোড়া মূলত report আর export-এর জন্য।",
  examples: [
    tsql(
      "From XML elements to a clean comma list · XML থেকে comma তালিকা",
      `-- xml path
SELECT FirstName, LastName, Title FROM Employee FOR XML PATH('Employee');
SELECT ',' + FirstName FROM Employee FOR XML PATH('');
SELECT STUFF('Rohan Kumawat', 1, 3, 'xyz') AS StuffDemo;
SELECT STUFF(
    (SELECT ',' + FirstName FROM Employee FOR XML PATH('')),
    1, 1, ''
) AS Names;
--Nancy, Andrew, Janet, Margaret
SELECT STRING_AGG(FirstName, ',') AS Names FROM Employee;  -- SQL Server 2017+`,
      "<Employee><FirstName>Nancy</FirstName><LastName>Davolio</LastName><Title>Sales Representative</Title></Employee><Employee><FirstName>Andrew</FirstName>...\n\n,Nancy,Andrew,Janet,Margaret,Steven,Michael,Robert,Laura,Anne\n\nStuffDemo\nxyzan Kumawat\n\nNames\nNancy,Andrew,Janet,Margaret,Steven,Michael,Robert,Laura,Anne",
    ),
    lite(
      "SQLite group_concat is STRING_AGG · SQLite-এ একই কাজ",
      `SELECT group_concat(Name, ',') AS AllNames FROM Employees;
SELECT d.Name AS Department, group_concat(e.Name, ', ') AS People
FROM Departments d JOIN Employees e ON e.DepartmentId = d.Id
GROUP BY d.Name;
-- STUFF-like: remove the first 3 characters and insert 'xyz'
SELECT 'xyz' || substr('Rohan Kumawat', 4) AS StuffDemo;`,
    ),
  ],
});

export const sqlServerChapters = chapters;

export function buildSqlServerChapter(lesson) {
  const chapter = chapters[lesson.topic];
  if (!chapter) throw new Error("Missing SQL Server chapter: " + lesson.topic);
  return chapter;
}
