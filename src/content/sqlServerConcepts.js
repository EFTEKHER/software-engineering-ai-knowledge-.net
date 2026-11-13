// SQL Server (T-SQL) track for module 2, lessons 21+ (index 20+).
// Topic order follows the "SQL basics -> advanced" course notes: SQL languages,
// database/table design, variables and conversion, CRUD, temp tables, CTE,
// functions, joins, ranking, indexes, transactions, procedures, triggers,
// performance tools and FOR XML PATH.
// Each code line uses "code ~~ English / বাংলা" so the reader can annotate it.
export const sqlServerTopics = [
  "SQL vs NoSQL & SQL Languages",
  "Create, Alter & Drop Database",
  "SQL Server Data Types",
  "Variables: DECLARE & SET",
  "CAST, CONVERT & TRY_CAST",
  "CREATE TABLE & Constraints",
  "Primary Key & Foreign Key",
  "CRUD: INSERT, UPDATE, DELETE",
  "Table Variables",
  "Temporary Tables (# and ##)",
  "CTE (Common Table Expression)",
  "ISNULL, COALESCE & NULL",
  "Aggregate Functions: MIN, MAX",
  "UNION vs UNION ALL",
  "RIGHT JOIN & FULL JOIN",
  "String Functions",
  "Date & Time Functions",
  "Nth Highest Salary with RANK",
  "Clustered & Non-Clustered Index",
  "Scalar User-Defined Functions",
  "Table-Valued Functions",
  "Transactions with TRY...CATCH",
  "ACID Properties",
  "Stored Procedures",
  "Triggers & Audit Tables",
  "SQL Profiler & Execution Plan",
  "FOR XML PATH & STUFF",
];

export const sqlServerConcepts = {};
function add(name, en, bn, code, flow, caution, deep) {
  sqlServerConcepts[name] = {
    en,
    bn,
    code,
    flow: flow.split(" > "),
    caution,
    deep,
    sqlserver: true,
  };
}

add(
  "SQL vs NoSQL & SQL Languages",
  "SQL (relational) databases store data in tables with fixed columns and relationships, so they are best when data is structured and correctness matters (banking, orders, HR). NoSQL databases (MongoDB, Redis, Cassandra) store documents, key-values or graphs with a flexible shape and scale out easily. SQL commands are grouped into five families: DDL defines structure (CREATE, ALTER, DROP, TRUNCATE, RENAME), DML changes rows (INSERT, UPDATE, DELETE, MERGE), DQL reads rows (SELECT), DCL controls permission (GRANT, REVOKE) and TCL controls transactions (COMMIT, ROLLBACK, SAVE TRANSACTION).",
  "SQL (relational) database-এ data থাকে table-এ, নির্দিষ্ট column আর সম্পর্ক (relationship) সহ — তাই data গোছানো আর সঠিকতা জরুরি হলে (ব্যাংক, অর্ডার, HR) SQL সেরা। NoSQL (MongoDB, Redis) document বা key-value আকারে নমনীয়ভাবে data রাখে। SQL command পাঁচ পরিবারে ভাগ: DDL কাঠামো বানায় (CREATE, ALTER, DROP, TRUNCATE), DML সারি বদলায় (INSERT, UPDATE, DELETE, MERGE), DQL পড়ে (SELECT), DCL অনুমতি দেয় (GRANT, REVOKE), TCL transaction সামলায় (COMMIT, ROLLBACK)।",
  `CREATE TABLE Student (Id INT PRIMARY KEY, Name VARCHAR(50)); ~~ DDL: define a new table structure. / DDL: নতুন table-এর কাঠামো বানানো।
ALTER TABLE Student ADD City VARCHAR(50); ~~ DDL: change the structure by adding a column. / DDL: column যোগ করে কাঠামো বদলানো।
INSERT INTO Student (Id, Name, City) VALUES (1, 'Rahim', 'Dhaka'); ~~ DML: add a row of data. / DML: একটি সারি data যোগ।
UPDATE Student SET City = 'Khulna' WHERE Id = 1; ~~ DML: change existing data. / DML: থাকা data বদলানো।
SELECT Id, Name, City FROM Student; ~~ DQL: read data without changing it. / DQL: data না বদলে পড়া।
GRANT SELECT ON Student TO ReportUser; ~~ DCL: allow a user to read this table. / DCL: একজন user-কে পড়ার অনুমতি।
BEGIN TRANSACTION; DELETE FROM Student WHERE Id = 1; ROLLBACK; ~~ TCL: undo the delete before it becomes permanent. / TCL: delete স্থায়ী হওয়ার আগে ফিরিয়ে নেওয়া।`,
  "Business need > Pick SQL or NoSQL > DDL builds tables > DML and DQL use rows > DCL and TCL protect them",
  "TRUNCATE is DDL in SQL Server: it removes all rows fast, resets IDENTITY and cannot use a WHERE clause. DELETE is DML and can remove selected rows.",
  "Most real systems use both: SQL Server for the source of truth (orders, payments) and a NoSQL store for cache, sessions or search. Choose by data shape and consistency needs, not by fashion.",
);

add(
  "Create, Alter & Drop Database",
  "A database is a container that holds tables, views, procedures and functions. CREATE DATABASE makes one, ALTER DATABASE ... MODIFY NAME renames it, USE switches the current database for the next commands, and DROP DATABASE deletes it with all of its data. In SSMS you can also right-click Databases > New Database, but writing the script is repeatable and can be saved in Git.",
  "Database হলো একটি বড় বাক্স, যার ভেতরে table, view, procedure, function থাকে। CREATE DATABASE দিয়ে বানাই, ALTER DATABASE ... MODIFY NAME দিয়ে নাম বদলাই, USE দিয়ে কোন database-এ কাজ করব তা ঠিক করি, আর DROP DATABASE সব data সহ মুছে ফেলে। SSMS-এ mouse দিয়েও করা যায়, কিন্তু script লিখলে বারবার চালানো ও Git-এ রাখা যায়।",
  `CREATE DATABASE TutorialDb2026; ~~ Create an empty database. / খালি database তৈরি।
GO ~~ GO ends a batch in SSMS so the next command runs after this one. / GO দিয়ে SSMS-এ এক ব্যাচ শেষ হয়।
ALTER DATABASE TutorialDb2026 MODIFY NAME = SQLTutorial2026; ~~ Rename the database. / Database-এর নাম বদলানো।
GO ~~ Finish the rename batch. / নাম বদলের ব্যাচ শেষ।
USE SQLTutorial2026; ~~ Make it the current database for the next queries. / পরের query এই database-এ চলবে।
SELECT name, create_date FROM sys.databases WHERE name = 'SQLTutorial2026'; ~~ Confirm it exists using the system catalog. / System catalog দেখে নিশ্চিত হওয়া।
-- DROP DATABASE SQLTutorial2026; ~~ Deletes everything; kept commented for safety. / সব মুছে দেয়; নিরাপত্তার জন্য comment করা।`,
  "CREATE DATABASE > USE database > Create tables > ALTER when needed > DROP only on purpose",
  "You cannot rename or drop a database while you (or another session) are using it. Switch with USE master first.",
  "SQL Server stores every database as at least two files: an .mdf data file and an .ldf transaction log. The log is what makes ROLLBACK and point-in-time restore possible.",
);

add(
  "SQL Server Data Types",
  "A data type tells SQL Server what kind of value a column or variable may hold and how much space it uses. Whole numbers use INT (or BIGINT for very large, TINYINT 0-255). Money and exact decimals use DECIMAL(p,s), for example DECIMAL(18,2) = 18 digits with 2 after the point. Text uses VARCHAR(n) for English-only text and NVARCHAR(n) for Unicode such as Bangla. Dates use DATE, TIME and DATETIME/DATETIME2. True/false uses BIT (1 or 0) because SQL Server has no BOOLEAN type.",
  "Data type বলে দেয় column বা variable-এ কোন ধরনের মান থাকবে আর কত জায়গা লাগবে। পূর্ণসংখ্যার জন্য INT (খুব বড় হলে BIGINT, ০-২৫৫ হলে TINYINT)। টাকা বা নির্ভুল দশমিকের জন্য DECIMAL(18,2) — মোট ১৮ ঘর, দশমিকের পরে ২। শুধু ইংরেজি লেখার জন্য VARCHAR, বাংলা বা Unicode লেখার জন্য NVARCHAR। তারিখের জন্য DATE, DATETIME। সত্য/মিথ্যা রাখতে BIT (1 বা 0), কারণ SQL Server-এ BOOLEAN নেই।",
  `CREATE TABLE Product ( ~~ Each column below gets the smallest correct type. / প্রতিটি column-এ সঠিক ও ছোট type।
  Id INT IDENTITY(1,1) PRIMARY KEY, ~~ INT whole number that auto-increments. / নিজে নিজে বাড়ে এমন INT।
  Name NVARCHAR(100) NOT NULL, ~~ Unicode text up to 100 characters, works for Bangla. / বাংলাসহ ১০০ অক্ষরের লেখা।
  Price DECIMAL(18,2) NOT NULL, ~~ Exact money value with 2 decimals; never use FLOAT for money. / টাকার নির্ভুল মান; FLOAT নয়।
  Stock SMALLINT DEFAULT 0, ~~ Small whole number range is enough here. / ছোট সংখ্যার পরিসরই যথেষ্ট।
  IsActive BIT DEFAULT 1, ~~ BIT is SQL Server's boolean: 1 true, 0 false. / BIT মানে true(1)/false(0)।
  LaunchDate DATE, ~~ Date only without time. / শুধু তারিখ, সময় নয়।
  CreatedAt DATETIME2 DEFAULT SYSDATETIME() ~~ Date and time with high precision. / উচ্চ নির্ভুলতার তারিখ-সময়।
); ~~ Close the column list. / Column তালিকা শেষ।`,
  "Know the value > Pick number, text, date or bit > Choose size > Add NULL and default rules",
  "VARCHAR stores Bangla as ????. Use NVARCHAR and prefix literals with N, for example N'ঢাকা'.",
  "Right-sized types save disk, memory and index space. CHAR(n) always uses n bytes; VARCHAR(n) uses only what it needs plus 2 bytes. VARCHAR(MAX) is for very large text and cannot be a normal index key.",
);

add(
  "Variables: DECLARE & SET",
  "A variable is a named box that holds one value while a batch or procedure runs. In T-SQL every variable name starts with @. DECLARE creates it with a data type, SET or SELECT assigns a value, and you can then use it in WHERE clauses or calculations. A variable lives only until the batch ends (GO ends a batch).",
  "Variable হলো নামওয়ালা একটি বাক্স, যেখানে query চলার সময় একটি মান রাখা যায়। T-SQL-এ প্রতিটি variable-এর নাম @ দিয়ে শুরু। DECLARE দিয়ে type সহ বানাই, SET বা SELECT দিয়ে মান দিই, তারপর WHERE বা হিসাবে ব্যবহার করি। Batch শেষ হলে (GO) variable হারিয়ে যায়।",
  `DECLARE @name VARCHAR(50); ~~ Create a text variable; its value starts as NULL. / Text variable তৈরি; শুরুতে মান NULL।
DECLARE @dob DATE, @salary DECIMAL(18,2), @isAdult BIT; ~~ Declare several variables in one line. / এক লাইনে কয়েকটি variable।
SET @name = 'Rohan'; ~~ SET assigns one value. / SET দিয়ে একটি মান বসানো।
SET @dob = '1995-08-08'; ~~ Text in ISO format converts to DATE. / ISO format-এর লেখা DATE হয়ে যায়।
SELECT @salary = MAX(Salary) FROM Employees; ~~ SELECT can assign a value from a query. / Query থেকে মান নেওয়া যায়।
SET @isAdult = CASE WHEN DATEDIFF(YEAR, @dob, GETDATE()) >= 18 THEN 1 ELSE 0 END; ~~ Calculate using other variables. / অন্য variable দিয়ে হিসাব।
SELECT @name AS Name, @dob AS Dob, @salary AS TopSalary, @isAdult AS IsAdult; ~~ Show all values as one row. / সব মান এক সারিতে দেখা।`,
  "DECLARE with type > SET or SELECT a value > Use in query > Batch ends and variable is gone",
  "If SELECT @x = column returns many rows, @x silently keeps the last row's value. Use an aggregate or TOP 1 with ORDER BY.",
  "Variables are the building blocks of stored procedures and functions, where parameters such as @EmployeeId behave like pre-filled variables.",
);

add(
  "CAST, CONVERT & TRY_CAST",
  "Conversion changes a value from one data type to another. CAST(value AS type) is standard SQL. CONVERT(type, value, style) is SQL Server specific and adds a style number to format dates (105 = dd-mm-yyyy, 120 = yyyy-mm-dd hh:mi:ss). TRY_CAST and TRY_CONVERT return NULL instead of an error when the value cannot be converted. SQL Server also converts implicitly: 13 + '12' becomes 25 because the text is turned into a number.",
  "Conversion মানে এক type-এর মানকে অন্য type-এ বদলানো। CAST(value AS type) সাধারণ SQL। CONVERT(type, value, style) SQL Server-এর নিজস্ব, style নম্বর দিয়ে তারিখের format ঠিক করা যায় (105 = দিন-মাস-বছর)। TRY_CAST ভুল মানে error না দিয়ে NULL দেয়। SQL Server নিজেও বদলায়: 13 + '12' = 25, কারণ লেখাটি সংখ্যা হয়ে যায়।",
  `SELECT CAST(15.8555 AS INT); ~~ Decimal to INT cuts the fraction: result 15. / দশমিক কেটে 15 হয়।
SELECT CAST('2026-08-07' AS DATE); ~~ Text to DATE. / লেখা থেকে তারিখ।
SELECT CONVERT(VARCHAR(20), GETDATE(), 105); ~~ Today's date as dd-mm-yyyy text. / আজকের তারিখ দিন-মাস-বছর আকারে।
SELECT CONVERT(VARCHAR(20), GETDATE(), 120); ~~ Style 120 gives yyyy-mm-dd hh:mi:ss. / Style 120 মানে বছর-মাস-দিন সময়।
SELECT TRY_CAST('7777g' AS INT); ~~ Not a number, so the result is NULL instead of an error. / সংখ্যা নয়, তাই error নয় NULL।
SELECT 13 + '12'; ~~ Implicit conversion: text becomes number, result 25. / নিজে থেকে সংখ্যা হয়ে 25।
SELECT 'Total: ' + CAST(25 AS VARCHAR(10)); ~~ Convert a number to text before joining strings. / লেখা জোড়ার আগে সংখ্যাকে লেখা বানানো।`,
  "Source value > Choose target type > CAST or CONVERT with style > TRY_ version for unsafe input > Result",
  "CAST('abc' AS INT) stops the whole query with an error. Use TRY_CAST when the data comes from users or files.",
  "Implicit conversion on a column in WHERE (for example a VARCHAR column compared with an INT) can stop SQL Server from using an index. Compare values of the same type.",
);

add(
  "CREATE TABLE & Constraints",
  "CREATE TABLE defines the columns of a table and the rules (constraints) every row must follow. PRIMARY KEY uniquely identifies each row, IDENTITY(1,1) auto-numbers it, NOT NULL makes a value required, UNIQUE blocks duplicates, CHECK validates a condition such as Age > 18, and DEFAULT fills a value when none is given, for example GETDATE() for CreatedAt. The database itself then rejects bad data, even if the application has a bug.",
  "CREATE TABLE দিয়ে table-এর column আর নিয়ম (constraint) ঠিক করি। PRIMARY KEY প্রতিটি সারিকে আলাদা করে চেনায়, IDENTITY(1,1) নিজে নিজে নম্বর দেয়, NOT NULL মানে মান দিতেই হবে, UNIQUE দুইবার একই মান আটকায়, CHECK শর্ত যাচাই করে (Age > 18), DEFAULT মান না দিলে নিজে বসায় (যেমন GETDATE())। ফলে app-এ bug থাকলেও database ভুল data ঢুকতে দেয় না।",
  `CREATE TABLE Student ( ~~ Start defining the Student table. / Student table বানানো শুরু।
  StudentId INT PRIMARY KEY IDENTITY(1,1), ~~ Unique row id that starts at 1 and adds 1. / ১ থেকে শুরু হয়ে ১ করে বাড়া অনন্য id।
  StudentName VARCHAR(50) NOT NULL, ~~ Name is required. / নাম দিতেই হবে।
  Email VARCHAR(100) UNIQUE NOT NULL, ~~ Two students cannot share an email. / দুইজনের একই email হবে না।
  SecondaryEmail VARCHAR(100) NULL, ~~ Optional column. / ঐচ্ছিক column।
  DOB DATE NOT NULL, ~~ Date of birth is required. / জন্মতারিখ দিতেই হবে।
  Age INT NOT NULL CHECK (Age > 18), ~~ Rows with age 18 or less are rejected. / ১৮ বা কম বয়স হলে বাতিল।
  IsAdult BIT DEFAULT 0, ~~ If not given, the value becomes 0. / না দিলে 0 বসে।
  CreatedAt DATETIME NOT NULL DEFAULT GETDATE() ~~ Insert time is filled automatically. / ঢোকানোর সময় নিজে বসে।
); ~~ Finish the table. / Table শেষ।`,
  "Columns and types > PRIMARY KEY and IDENTITY > NOT NULL, UNIQUE, CHECK > DEFAULT values > Safe rows",
  "Running CREATE TABLE twice gives 'There is already an object named Student'. Use DROP TABLE IF EXISTS Student first in practice scripts.",
  "Name your constraints (CONSTRAINT CK_Student_Age CHECK (Age > 18)) so error messages and later ALTER/DROP statements are readable.",
);

add(
  "Primary Key & Foreign Key",
  "A primary key (PK) is the column that uniquely identifies a row in its own table. A foreign key (FK) is a column in another table that points to that primary key, creating a parent-child relationship. The FK guarantees referential integrity: you cannot add an EmployeeOtherDetails row for an employee that does not exist, and you cannot delete an employee that still has child rows unless you choose ON DELETE CASCADE.",
  "Primary key (PK) নিজের table-এ প্রতিটি সারিকে আলাদা করে চেনায়। Foreign key (FK) হলো অন্য table-এর column, যা সেই PK-কে নির্দেশ করে — এভাবে parent-child সম্পর্ক তৈরি হয়। FK নিশ্চিত করে যে অস্তিত্বহীন employee-র details যোগ করা যাবে না, আর child সারি থাকলে parent মুছতে দেবে না (ON DELETE CASCADE না দিলে)।",
  `CREATE TABLE Employee ( ~~ Parent table that others will point to. / মূল (parent) table, অন্যরা একে নির্দেশ করবে।
  EmpId INT PRIMARY KEY IDENTITY(1,1), ~~ Primary key of the parent. / Parent-এর primary key।
  EmpName VARCHAR(50) NOT NULL); ~~ Employee name. / কর্মীর নাম।
CREATE TABLE EmployeeOtherDetails ( ~~ Child table with extra details. / অতিরিক্ত তথ্যের child table।
  RowId INT PRIMARY KEY IDENTITY(1,1), ~~ The child's own primary key. / Child-এর নিজের primary key।
  EmployeeId INT NOT NULL, ~~ Will hold an EmpId from the parent. / Parent-এর EmpId রাখবে।
  BankAcNumber VARCHAR(20), IFSC VARCHAR(15), Salary DECIMAL(18,2), ~~ Detail columns. / বিস্তারিত column।
  CONSTRAINT FK_EmpOtherDetail_Employee FOREIGN KEY (EmployeeId) REFERENCES Employee(EmpId)); ~~ Link child to parent; invalid ids are rejected. / Child-কে parent-এর সাথে যুক্ত; ভুল id বাতিল।`,
  "Parent row with PK > Child row stores the key > FK checks parent exists > JOIN reads them together",
  "Inserting a child with EmployeeId = 99 when no employee 99 exists fails with 'The INSERT statement conflicted with the FOREIGN KEY constraint'.",
  "SQL Server does not index foreign key columns automatically. Add an index on EmployeeId so joins and parent deletes stay fast.",
);

add(
  "CRUD: INSERT, UPDATE, DELETE",
  "CRUD means Create, Read, Update, Delete: the four basic things every application does with data. INSERT adds rows, SELECT reads them, UPDATE changes column values for rows matched by WHERE, and DELETE removes rows matched by WHERE. Forgetting WHERE on UPDATE or DELETE changes every row in the table, so always run the matching SELECT first.",
  "CRUD মানে Create, Read, Update, Delete — প্রতিটি app data নিয়ে এই চারটি কাজই করে। INSERT সারি যোগ করে, SELECT পড়ে, UPDATE WHERE-এ মেলা সারির মান বদলায়, DELETE WHERE-এ মেলা সারি মুছে। UPDATE বা DELETE-এ WHERE ভুলে গেলে পুরো table বদলে যায়, তাই আগে একই WHERE দিয়ে SELECT চালিয়ে দেখুন।",
  `INSERT INTO Student (StudentName, Email, DOB, Age) ~~ Create: list the columns you will fill. / Create: কোন column ভরবেন তা লিখুন।
VALUES ('Vaibhav', 'vaibhav@mail.com', '1995-08-08', 30); ~~ Values in the same order as the columns. / Column-এর ক্রমে মান।
SELECT * FROM Student; ~~ Read: check what was stored, including defaults. / Read: default সহ কী জমা হলো দেখা।
SELECT * FROM Student WHERE StudentId = 1; ~~ Preview the row before changing it. / বদলানোর আগে সারিটি দেখা।
UPDATE Student SET StudentName = 'Parul', Age = 21 WHERE StudentId = 1; ~~ Update: change two columns of one row. / Update: একটি সারির দুটি column বদল।
DELETE FROM Student WHERE StudentId = 1; ~~ Delete: remove only that row. / Delete: শুধু সেই সারি মুছা।`,
  "INSERT new row > SELECT to verify > UPDATE with WHERE > DELETE with WHERE",
  "UPDATE Student SET Age = 21 without WHERE changes every student. Wrap risky changes in BEGIN TRAN and check @@ROWCOUNT before COMMIT.",
  "Many teams prefer soft delete (an IsDeleted BIT column) over DELETE so data can be restored and audited.",
);

add(
  "Table Variables",
  "A table variable (DECLARE @employee TABLE (...)) is a variable that holds a small set of rows, like a mini table that exists only while the batch or procedure runs. You can INSERT, SELECT, UPDATE and JOIN it like a normal table. It is convenient for short lists and for returning rows from multi-statement functions, and it disappears automatically.",
  "Table variable (DECLARE @employee TABLE (...)) হলো এমন variable, যার ভেতরে কয়েকটি সারি রাখা যায় — ছোট একটি table, যা শুধু batch বা procedure চলার সময় থাকে। সাধারণ table-এর মতো INSERT, SELECT, JOIN করা যায়। ছোট তালিকা রাখতে সুবিধা, আর কাজ শেষে নিজে মুছে যায়।",
  `DECLARE @employee TABLE ( ~~ Declare a variable whose type is a table. / Table type-এর variable।
  EmpName VARCHAR(50), Email VARCHAR(50), DOB DATE); ~~ Its columns, like CREATE TABLE. / CREATE TABLE-এর মতো column।
INSERT INTO @employee (EmpName, Email, DOB) VALUES ('rohan', 'rohan@gmail.com', '1995-08-08'); ~~ Add a row. / একটি সারি যোগ।
INSERT INTO @employee VALUES ('rahim', 'rahim@gmail.com', '1998-01-15'); ~~ Add another row. / আরেকটি সারি যোগ।
SELECT * FROM @employee; ~~ Read it like a normal table. / সাধারণ table-এর মতো পড়া।
SELECT COUNT(*) AS Total FROM @employee; ~~ Aggregates work too. / Aggregate-ও চলে।`,
  "DECLARE @table > INSERT rows > Use in queries > Batch ends and it is removed",
  "Run the DECLARE and the SELECT together. Running only SELECT * FROM @employee gives 'Must declare the table variable'.",
  "Table variables have no statistics in older SQL Server versions, so the optimizer guesses few rows. For thousands of rows a #temp table is usually faster.",
);

add(
  "Temporary Tables (# and ##)",
  "A temporary table is a real table stored in tempdb that is deleted automatically. A local temp table (#Employee) is visible only in the session (query window) that created it and is dropped when that session closes. A global temp table (##Employee) is visible to all sessions and is dropped when the creating session closes and no one else is using it. Temp tables can have indexes and statistics, so they suit large intermediate results.",
  "Temporary table হলো tempdb-তে থাকা আসল table, যা নিজে নিজে মুছে যায়। Local temp table (#Employee) শুধু যে session (query window) বানিয়েছে সেখানেই দেখা যায়, session বন্ধ হলে মুছে যায়। Global temp table (##Employee) সব session দেখতে পায়, বানানো session বন্ধ হলে মুছে যায়। Temp table-এ index রাখা যায়, তাই বড় মধ্যবর্তী ফলের জন্য ভালো।",
  `CREATE TABLE #Employee (EmpName VARCHAR(50) NULL, Email VARCHAR(50) NULL); ~~ Local temp table: this session only. / Local temp: শুধু এই session।
INSERT INTO #Employee VALUES ('Rohan', 'rohan@gmail.com'); ~~ Use it like a normal table. / সাধারণ table-এর মতো ব্যবহার।
SELECT * FROM #Employee; ~~ Works here; another window gets 'Invalid object name'. / এখানে চলে; অন্য window-তে error।
CREATE TABLE ##Employee (EmpId INT PRIMARY KEY IDENTITY(1,1), EmpName VARCHAR(50)); ~~ Global temp table: every session can read it. / Global temp: সব session পড়তে পারে।
INSERT INTO ##Employee (EmpName) VALUES ('Nadia'); ~~ Add a row to the global table. / Global table-এ সারি যোগ।
DROP TABLE IF EXISTS #Employee; DROP TABLE IF EXISTS ##Employee; ~~ Clean up early instead of waiting. / অপেক্ষা না করে নিজেই মুছে ফেলা।`,
  "CREATE #temp in tempdb > Fill and index it > Query in the same session > Auto-dropped at session end",
  "Two procedures that both create #Employee in nested calls can confuse each other. Use clear, specific temp table names.",
  "Choose: table variable for a few rows, #temp for many rows or when you need indexes, CTE when you only need a named subquery inside one statement.",
);

add(
  "CTE (Common Table Expression)",
  "A CTE is a named, temporary result defined with WITH name AS (query) and used by the very next statement. It makes long queries readable by splitting them into steps, can be referenced more than once in that statement, and can be recursive for hierarchies such as manager to employee. A CTE is not stored; it exists only for one statement.",
  "CTE হলো WITH name AS (query) দিয়ে বানানো একটি নামওয়ালা অস্থায়ী ফল, যা ঠিক পরের statement ব্যবহার করে। বড় query-কে ধাপে ভাগ করে পড়তে সহজ করে, একই statement-এ বারবার ব্যবহার করা যায়, আর recursive হয়ে manager-employee-র মতো স্তর বের করতে পারে। CTE জমা থাকে না; শুধু একটি statement-এর জন্য।",
  `;WITH StudentCTE AS ( ~~ Name the temporary result; the semicolon ends any previous statement. / অস্থায়ী ফলের নাম; আগের statement শেষ করতে সেমিকোলন।
  SELECT StudentName, FatherName, MotherName FROM Student ~~ The inner query that builds the result. / ভেতরের query যা ফল বানায়।
) ~~ Close the CTE definition. / CTE সংজ্ঞা শেষ।
SELECT * FROM StudentCTE; ~~ Use it right away like a table. / সাথে সাথে table-এর মতো ব্যবহার।
;WITH DeptAvg AS (SELECT DepartmentId, AVG(Salary) AS AvgSal FROM Employees GROUP BY DepartmentId) ~~ Step 1: average salary per department. / ধাপ ১: বিভাগভিত্তিক গড় বেতন।
SELECT e.Name, e.Salary, d.AvgSal FROM Employees e JOIN DeptAvg d ON e.DepartmentId = d.DepartmentId WHERE e.Salary > d.AvgSal; ~~ Step 2: people above their department average. / ধাপ ২: বিভাগের গড়ের বেশি পান যারা।`,
  "WITH name AS (query) > Temporary named result > Next statement reads it > Gone after the statement",
  "A CTE can be used only by the single statement right after it. Running SELECT * FROM StudentCTE later gives 'Invalid object name'.",
  "Recursive CTEs need an anchor query UNION ALL a recursive query, and SQL Server stops after 100 levels by default (OPTION (MAXRECURSION n)).",
);

add(
  "ISNULL, COALESCE & NULL",
  "NULL means unknown or missing, not zero and not empty text. Any arithmetic with NULL returns NULL, and NULL = NULL is not true. ISNULL(value, replacement) returns the replacement when value is NULL (SQL Server specific, two arguments). COALESCE(a, b, c) returns the first non-NULL value from any number of arguments and is standard SQL. Use IS NULL / IS NOT NULL to test for NULL in WHERE.",
  "NULL মানে অজানা বা নেই — শূন্য নয়, খালি লেখাও নয়। NULL-এর সাথে যেকোনো হিসাব NULL দেয়, আর NULL = NULL সত্য নয়। ISNULL(value, replacement) মান NULL হলে বিকল্প মান দেয় (SQL Server-এর নিজস্ব, দুই argument)। COALESCE(a, b, c) প্রথম non-NULL মান দেয়, যতগুলো খুশি argument। WHERE-এ NULL পরীক্ষায় IS NULL ব্যবহার করুন।",
  `SELECT EmpName, ISNULL(Email, 'N/A') AS Email FROM Employee; ~~ Show N/A when Email is missing. / Email না থাকলে N/A দেখানো।
SELECT EmpName, ISNULL(CONVERT(VARCHAR(10), Dob, 105), 'N/A') AS Dob FROM Employee; ~~ Convert the date to text first, then replace NULL. / আগে তারিখকে লেখা, তারপর NULL বদল।
SELECT EmpName, COALESCE(Phone, Email, 'No contact') AS Contact FROM Employee; ~~ First available contact value. / প্রথম যে যোগাযোগ মান পাওয়া যায়।
SELECT * FROM Employee WHERE Email IS NULL; ~~ Correct NULL test. / NULL পরীক্ষার সঠিক উপায়।
SELECT 100 + NULL AS Result; ~~ Arithmetic with NULL returns NULL. / NULL-এর সাথে হিসাব NULL।`,
  "Read column > Is it NULL? > Replace with ISNULL or COALESCE > Display clean value",
  "ISNULL(Dob, 'N/A') on a DATE column fails with 'Conversion failed' because the replacement must match the column type. Convert to text first.",
  "ISNULL takes the data type of the first argument; COALESCE uses the highest-precedence type of all arguments. This can change length or rounding.",
);

add(
  "Aggregate Functions: MIN, MAX",
  "Aggregate functions turn many rows into one value: COUNT counts, SUM adds, AVG averages, MIN finds the smallest and MAX the largest. With GROUP BY they produce one value per group, and HAVING filters those groups after aggregation. MIN and MAX work on numbers, dates and text (alphabetical order).",
  "Aggregate function অনেক সারি থেকে একটি মান বানায়: COUNT গোনে, SUM যোগ করে, AVG গড় করে, MIN সবচেয়ে ছোট, MAX সবচেয়ে বড় মান দেয়। GROUP BY দিলে প্রতিটি দলের জন্য আলাদা মান আসে, আর HAVING দলগুলোকে হিসাবের পরে ছাঁকে। MIN ও MAX সংখ্যা, তারিখ আর লেখা (বর্ণক্রমে) সবেতেই চলে।",
  `SELECT MIN(UnitPrice) AS Cheapest, MAX(UnitPrice) AS Costliest FROM Products; ~~ Smallest and largest price in the table. / সবচেয়ে কম ও বেশি দাম।
SELECT COUNT(*) AS Total, AVG(UnitPrice) AS AvgPrice, SUM(UnitsInStock) AS Stock FROM Products; ~~ Several aggregates in one row. / এক সারিতে কয়েকটি aggregate।
SELECT CategoryId, MIN(UnitPrice) AS MinPrice FROM Products GROUP BY CategoryId; ~~ One minimum per category. / প্রতিটি category-র সর্বনিম্ন দাম।
SELECT Country, COUNT(*) AS Employees FROM Employees GROUP BY Country; ~~ Count employees per country. / দেশভিত্তিক কর্মী সংখ্যা।
SELECT ProductName, MIN(UnitPrice) AS Price FROM Products GROUP BY ProductName HAVING MIN(UnitPrice) > 50; ~~ HAVING filters groups after aggregation. / HAVING হিসাবের পরে দল ছাঁকে।`,
  "All rows > WHERE filters rows > GROUP BY makes groups > Aggregate per group > HAVING filters groups",
  "Every selected column must be inside an aggregate or listed in GROUP BY, otherwise SQL Server returns 'is invalid in the select list'.",
  "WHERE runs before grouping and can use indexes; HAVING runs after. Put plain row filters in WHERE and only aggregate conditions in HAVING.",
);

add(
  "UNION vs UNION ALL",
  "UNION and UNION ALL stack the results of two SELECT statements on top of each other. Both queries must return the same number of columns with compatible types, in the same order. UNION removes duplicate rows (which needs an extra sort or hash step), while UNION ALL keeps every row and is therefore faster.",
  "UNION আর UNION ALL দুটি SELECT-এর ফল একটির নিচে আরেকটি বসায়। দুই query-তে column সংখ্যা, ক্রম ও type মিলতে হবে। UNION একই রকম সারি একবারই রাখে (এর জন্য বাড়তি sort লাগে), UNION ALL সব সারি রাখে, তাই দ্রুত।",
  `SELECT * FROM [Order Details] WHERE ProductId = 77 ~~ First result set. / প্রথম ফল।
UNION ~~ Combine and remove duplicate rows. / যোগ করে duplicate বাদ।
SELECT * FROM [Order Details] WHERE ProductId = 32; ~~ Second result set with the same columns. / একই column-এর দ্বিতীয় ফল।
SELECT * FROM [Order Details] WHERE Quantity > 100 ~~ Rows with large quantity. / বড় পরিমাণের সারি।
UNION ALL ~~ Combine and keep duplicates. / যোগ করে duplicate-ও রাখা।
SELECT * FROM [Order Details] WHERE UnitPrice > 100; ~~ A row matching both appears twice. / দুই শর্তে মেলা সারি দুইবার আসে।`,
  "Query A rows > Query B rows > Stack vertically > UNION removes duplicates or UNION ALL keeps all",
  "Column names in the result come from the first SELECT. ORDER BY can appear only once, at the very end.",
  "Use UNION ALL by default when you know the sets cannot overlap; it avoids an unnecessary distinct sort on large data.",
);

add(
  "RIGHT JOIN & FULL JOIN",
  "A join combines columns from two tables by matching a key. INNER JOIN keeps only matching rows (the overlap of the two circles). LEFT JOIN keeps every row from the left table and NULLs where the right side has no match. RIGHT JOIN is the mirror: every row from the right table. FULL OUTER JOIN keeps all rows from both sides, filling NULLs wherever a match is missing.",
  "Join দুই table-এর column একটি key মিলিয়ে একসাথে আনে। INNER JOIN শুধু মেলা সারি রাখে (দুই বৃত্তের মাঝের অংশ)। LEFT JOIN বাম table-এর সব সারি রাখে, ডানে না মিললে NULL। RIGHT JOIN উল্টো: ডান table-এর সব সারি। FULL OUTER JOIN দুই দিকের সব সারি রাখে, না মিললে NULL বসায়।",
  `SELECT emp.EmployeeName, emp.Salary, dept.DepartmentName, dept.Location ~~ Columns from both tables using aliases. / Alias দিয়ে দুই table-এর column।
FROM EmployeesJn emp ~~ Left table with alias emp. / বাম table, alias emp।
INNER JOIN DepartmentsJn dept ON emp.DepartmentId = dept.DepartmentId; ~~ Only employees that have a department. / শুধু যাদের বিভাগ আছে।
SELECT dept.DepartmentName, emp.EmployeeName FROM EmployeesJn emp ~~ Same two tables again. / আবার একই দুই table।
RIGHT JOIN DepartmentsJn dept ON emp.DepartmentId = dept.DepartmentId; ~~ Every department, even with no employees (EmployeeName NULL). / কর্মী না থাকলেও সব বিভাগ।
SELECT dept.DepartmentName, emp.EmployeeName FROM EmployeesJn emp ~~ Both tables once more. / আবার দুই table।
FULL OUTER JOIN DepartmentsJn dept ON emp.DepartmentId = dept.DepartmentId; ~~ Everything from both sides. / দুই দিকের সব সারি।`,
  "Left table > Match on key > Keep matches, left, right or all > Fill missing side with NULL",
  "A WHERE condition on the outer table's column (WHERE dept.Location = 'Delhi') turns a RIGHT or LEFT JOIN back into an INNER JOIN. Put it in ON instead.",
  "Most teams rewrite RIGHT JOIN as LEFT JOIN by swapping table order, so every query reads left to right in the same way.",
);

add(
  "String Functions",
  "String functions clean and shape text. LEN counts characters (ignoring trailing spaces), UPPER and LOWER change case, LEFT and RIGHT take characters from either end, SUBSTRING(text, start, length) takes from the middle (positions start at 1), CHARINDEX finds the position of a substring, REPLACE swaps text, TRIM removes spaces and CONCAT joins values safely (NULL becomes empty).",
  "String function লেখাকে পরিষ্কার ও সাজায়। LEN অক্ষর গোনে, UPPER/LOWER বড়-ছোট হাতের অক্ষর করে, LEFT ও RIGHT দুই প্রান্ত থেকে অক্ষর নেয়, SUBSTRING(text, start, length) মাঝখান থেকে নেয় (অবস্থান ১ থেকে শুরু), CHARINDEX কোনো অংশ কোথায় আছে বলে, REPLACE লেখা বদলায়, TRIM ফাঁকা জায়গা সরায়, CONCAT নিরাপদে জোড়ে (NULL খালি হয়ে যায়)।",
  `SELECT LEN('Rohan Kumawat'); ~~ 13 characters including the space. / ফাঁকাসহ ১৩ অক্ষর।
SELECT UPPER('Rohan Kumawat'), LOWER('ROHAN KUMAWAT'); ~~ Change letter case. / বড় বা ছোট হাতের অক্ষর।
SELECT LEFT('RAHLK5412122', 4), RIGHT('RAHLK5412122', 4); ~~ First 4 = RAHL, last 4 = 2122. / প্রথম ৪ ও শেষ ৪ অক্ষর।
SELECT SUBSTRING('Rohan Kumawat', 4, 5); ~~ From position 4, take 5 characters: 'an Ku'. / ৪ নম্বর থেকে ৫ অক্ষর।
SELECT CHARINDEX('K', 'Rohan Kumawat'); ~~ Position of K is 7; 0 means not found. / K-এর অবস্থান ৭।
SELECT REPLACE('.NET & SQL', '.NET', 'C#'); ~~ Result: 'C# & SQL'. / ফল: 'C# & SQL'।
SELECT CONCAT('Rohan', ' ', 'Kumawat'), TRIM('  hi  '); ~~ Join parts and remove outer spaces. / জোড়া ও বাইরের ফাঁকা বাদ।`,
  "Raw text > Measure or locate > Cut or replace > Join or format > Clean output",
  "LEN ignores trailing spaces; DATALENGTH counts bytes. For NVARCHAR each character uses 2 bytes, so DATALENGTH(N'abc') = 6.",
  "Functions on a column inside WHERE (WHERE UPPER(Name) = 'ROHAN') prevent index seeks. Rely on a case-insensitive collation instead.",
);

add(
  "Date & Time Functions",
  "Date functions read and calculate dates. GETDATE() returns the current date and time, YEAR, MONTH and DAY extract parts, DATEPART(part, date) extracts any part such as WEEK or WEEKDAY, DATENAME returns the name (Monday, August), DATEADD(part, n, date) adds or subtracts time, DATEDIFF(part, start, end) counts boundaries between two dates, and EOMONTH gives the last day of the month.",
  "Date function তারিখ পড়ে ও হিসাব করে। GETDATE() এখনকার তারিখ-সময় দেয়, YEAR, MONTH, DAY অংশ আলাদা করে, DATEPART যেকোনো অংশ (WEEK, WEEKDAY) দেয়, DATENAME নাম দেয় (Monday, August), DATEADD সময় যোগ-বিয়োগ করে, DATEDIFF দুই তারিখের পার্থক্য গোনে, EOMONTH মাসের শেষ দিন দেয়।",
  `SELECT GETDATE(); ~~ Current server date and time. / Server-এর এখনকার তারিখ ও সময়।
SELECT YEAR('2026-05-05'), MONTH('2026-01-04'), DAY('2026-09-14'); ~~ Results 2026, 1 and 14. / ফল 2026, 1, 14।
SELECT DATEPART(WEEKDAY, '2026-07-16'), DATENAME(WEEKDAY, '2026-07-16'); ~~ Weekday number and name (Thursday). / সপ্তাহের দিন নম্বর ও নাম।
SELECT DATEADD(DAY, -45, '2026-07-16'); ~~ 45 days earlier: 2026-06-01. / ৪৫ দিন আগে।
SELECT DATEDIFF(MONTH, '2026-09-08', '2026-08-08'); ~~ Negative because end is before start: -1. / শেষ তারিখ আগে বলে -1।
SELECT DATEDIFF(DAY, '2026-01-01', GETDATE()) AS DaysThisYear; ~~ Days passed this year. / এ বছর কত দিন গেল।
SELECT EOMONTH('2026-02-10'); ~~ Last day of February 2026: 2026-02-28. / ফেব্রুয়ারির শেষ দিন।`,
  "Date value > Extract part or name > Add or subtract > Measure difference > Report",
  "DATEDIFF(YEAR, '2025-12-31', '2026-01-01') returns 1 because it counts year boundaries crossed, not full years lived. Calculate exact age with month and day checks.",
  "Store dates as DATE or DATETIME2, never as VARCHAR. Use ISO text 'yyyy-mm-dd' in scripts so the language setting cannot swap day and month.",
);

add(
  "Nth Highest Salary with RANK",
  "Ranking (window) functions number rows inside an ordered window without collapsing them. ROW_NUMBER gives 1,2,3,4 even for ties; RANK gives ties the same number and skips the next (1,1,3); DENSE_RANK gives ties the same number without gaps (1,1,2). To find the 2nd highest salary, rank salaries in descending order inside a subquery or CTE and keep the rows where the rank = 2.",
  "Ranking (window) function সারিগুলো না মিশিয়ে ক্রম অনুযায়ী নম্বর দেয়। ROW_NUMBER সমান মান হলেও 1,2,3 দেয়; RANK সমানদের একই নম্বর দিয়ে পরেরটি লাফ দেয় (1,1,3); DENSE_RANK লাফ দেয় না (1,1,2)। দ্বিতীয় সর্বোচ্চ বেতন বের করতে subquery বা CTE-তে বেতন বড় থেকে ছোট ক্রমে rank করে rank = 2 রাখুন।",
  `SELECT MAX(BasicSalary) FROM Salary; ~~ Highest salary only. / শুধু সর্বোচ্চ বেতন।
SELECT EmployeeId, BasicSalary, ~~ Show each employee and salary. / প্রতি কর্মী ও বেতন।
  RANK() OVER (ORDER BY BasicSalary DESC) AS Rnk, ~~ Ties share a rank and leave a gap. / সমানদের একই rank, পরে লাফ।
  DENSE_RANK() OVER (ORDER BY BasicSalary DESC) AS DenseRnk ~~ Ties share a rank without a gap. / লাফ ছাড়া একই rank।
FROM Salary; ~~ All rows stay visible. / সব সারি দেখা যায়।
SELECT EmployeeId, BasicSalary FROM ( ~~ Wrap because WHERE cannot use a window alias directly. / সরাসরি WHERE-এ চলে না বলে মোড়ানো।
  SELECT EmployeeId, BasicSalary, DENSE_RANK() OVER (ORDER BY BasicSalary DESC) AS Rnk FROM Salary ~~ Rank inside the subquery. / ভেতরে rank করা।
) AS r WHERE r.Rnk = 2; ~~ Keep the 2nd highest salary rows. / দ্বিতীয় সর্বোচ্চ বেতন রাখা।`,
  "Order salaries DESC > Assign rank > Wrap in subquery > Filter rank = N",
  "Use DENSE_RANK for 'Nth highest salary' questions. With RANK and two people tied for first, no row has rank 2.",
  "Add PARTITION BY DepartmentId to rank inside each department, for example the top 3 earners per department.",
);

add(
  "Clustered & Non-Clustered Index",
  "An index is like the index at the back of a book: it lets SQL Server find rows without reading the whole table. Indexes are stored as B-trees (a root, middle pages and leaf pages). A clustered index sorts and stores the table rows themselves in key order, so a table can have only one (the primary key creates it by default). A non-clustered index is a separate sorted structure that stores the key plus a pointer to the row; a table can have many.",
  "Index হলো বইয়ের পেছনের সূচির মতো: পুরো table না পড়ে দ্রুত সারি খুঁজে দেয়। Index B-tree আকারে থাকে (root, মাঝের page, leaf page)। Clustered index আসল সারিগুলোকেই key-এর ক্রমে সাজিয়ে রাখে, তাই একটি table-এ একটিই থাকে (primary key সাধারণত এটি বানায়)। Non-clustered index আলাদা সাজানো তালিকা, যেখানে key আর আসল সারির ঠিকানা থাকে; একাধিক রাখা যায়।",
  `CREATE CLUSTERED INDEX cx_Salary_SalaryId ON Salary(SalaryId); ~~ Physically order rows by SalaryId (only one allowed). / সারিগুলোকে SalaryId ক্রমে সাজানো (একটিই সম্ভব)।
CREATE NONCLUSTERED INDEX ix_Salary_EmployeeId ON Salary(EmployeeId); ~~ Separate lookup structure for EmployeeId. / EmployeeId খোঁজার আলাদা তালিকা।
CREATE NONCLUSTERED INDEX ix_Orders_Customer ON Orders(CustomerId) INCLUDE (OrderDate); ~~ INCLUDE stores extra columns to avoid lookups. / INCLUDE বাড়তি column রেখে lookup কমায়।
SELECT OrderId, OrderDate FROM Orders WHERE CustomerId = 'VINET'; ~~ Can now seek the index instead of scanning. / এখন পুরো table না পড়ে index seek।
EXEC sp_helpindex 'Orders'; ~~ List the indexes on a table. / Table-এর index তালিকা।
DROP INDEX ix_Salary_EmployeeId ON Salary; ~~ Remove an index you no longer need. / অপ্রয়োজনীয় index মুছা।`,
  "Query with WHERE > Optimizer checks indexes > B-tree seek to leaf > Fetch row > Fast result",
  "Creating a second clustered index fails with 'Cannot create more than one clustered index'. Also, every index slows INSERT, UPDATE and DELETE a little.",
  "Index columns used in WHERE, JOIN and ORDER BY. Leading wildcards (LIKE '%abc') and functions on the column cannot use a seek.",
);

add(
  "Scalar User-Defined Functions",
  "A scalar user-defined function (UDF) takes parameters and returns exactly one value, like a built-in function. You create it with CREATE FUNCTION, define RETURNS type, and put the logic between BEGIN and END with a RETURN statement. Call it with the schema name, for example dbo.CalculateYearlyPackage(15000). Functions cannot change data (no INSERT/UPDATE/DELETE on real tables).",
  "Scalar user-defined function (UDF) parameter নেয় আর ঠিক একটি মান ফেরত দেয়, built-in function-এর মতো। CREATE FUNCTION দিয়ে বানাই, RETURNS-এ type বলি, BEGIN-END-এর মধ্যে logic আর RETURN লিখি। ডাকতে schema নাম লাগে: dbo.CalculateYearlyPackage(15000)। Function আসল table-এর data বদলাতে পারে না।",
  `CREATE FUNCTION dbo.CalculateYearlyPackage (@BasicSalary DECIMAL(12,2)) ~~ Name and input parameter. / নাম ও input parameter।
RETURNS DECIMAL(12,2) ~~ The single value type it returns. / ফেরত মানের type।
AS ~~ Start of the body. / Body শুরু।
BEGIN ~~ Logic block begins. / Logic শুরু।
  RETURN 12 * @BasicSalary; ~~ Monthly salary times 12. / মাসিক বেতন × ১২।
END; ~~ Logic block ends. / Logic শেষ।
SELECT dbo.CalculateYearlyPackage(15000) AS Yearly; ~~ Call it: result 180000.00. / ডাকলে ফল 180000.00।
SELECT EmployeeId, BasicSalary, dbo.CalculateYearlyPackage(BasicSalary) AS Yearly FROM Salary; ~~ Use it per row in a query. / প্রতিটি সারিতে ব্যবহার।`,
  "Input parameters > Function body > RETURN one value > Used in SELECT or WHERE",
  "Calling without the schema (CalculateYearlyPackage(15000)) gives 'is not a recognized built-in function name'. Always write dbo.",
  "Scalar UDFs run once per row and were historically slow on large tables. SQL Server 2019+ can inline simple ones; still keep them simple.",
);

add(
  "Table-Valued Functions",
  "A table-valued function (TVF) returns a table instead of a single value, so you use it in FROM like a table that accepts parameters. An inline TVF is a single SELECT (RETURNS TABLE AS RETURN (SELECT ...)) and is as fast as a view. A multi-statement TVF declares a table variable (RETURNS @EmpTbl TABLE (...)), fills it with several statements and then RETURNs.",
  "Table-valued function (TVF) একটি মান নয়, পুরো table ফেরত দেয় — তাই FROM-এ parameter সহ table-এর মতো ব্যবহার করা যায়। Inline TVF একটি মাত্র SELECT (RETURNS TABLE AS RETURN (SELECT ...)), view-এর মতো দ্রুত। Multi-statement TVF একটি table variable ঘোষণা করে, কয়েকটি statement দিয়ে ভরে, তারপর RETURN করে।",
  `CREATE FUNCTION dbo.GetEmployeesInCity (@City NVARCHAR(50)) ~~ Inline TVF with a parameter. / Parameter সহ inline TVF।
RETURNS TABLE ~~ It returns rows, not one value. / একটি মান নয়, সারি ফেরত।
AS RETURN (SELECT EmployeeId, FirstName, City FROM Employees WHERE City = @City); ~~ One SELECT is the whole body. / একটি SELECT-ই পুরো body।
SELECT * FROM dbo.GetEmployeesInCity('London'); ~~ Use in FROM like a table. / FROM-এ table-এর মতো।
CREATE FUNCTION dbo.GetEmployeeById (@Id INT) RETURNS @EmpTbl TABLE (FirstName NVARCHAR(10), LastName NVARCHAR(20), Dob DATETIME) ~~ Multi-statement TVF declares its output table. / Multi-statement: output table ঘোষণা।
AS BEGIN INSERT INTO @EmpTbl SELECT FirstName, LastName, BirthDate FROM Employees WHERE EmployeeId = @Id; RETURN; END; ~~ Fill the table, then RETURN. / Table ভরে RETURN।
SELECT * FROM dbo.GetEmployeeById(1); ~~ Call it the same way. / একইভাবে ডাকা।`,
  "Parameters > SELECT builds rows > Function returns a table > Caller uses it in FROM or JOIN",
  "Prefer inline TVFs; multi-statement TVFs hide row estimates from the optimizer and can be slow when joined to large tables.",
  "Use CROSS APPLY to call a TVF once per row of another table, for example the latest order for each customer.",
);

add(
  "Transactions with TRY...CATCH",
  "A transaction groups several statements into one all-or-nothing unit. BEGIN TRANSACTION starts it, COMMIT makes every change permanent, and ROLLBACK undoes all of them. Wrap the work in BEGIN TRY ... END TRY and handle errors in BEGIN CATCH ... END CATCH: if any statement fails, control jumps to CATCH, where you check @@TRANCOUNT > 0 and roll back, then read ERROR_MESSAGE() to report what went wrong.",
  "Transaction কয়েকটি statement-কে একটি 'সব হবে নয়তো কিছুই না' কাজে বাঁধে। BEGIN TRANSACTION শুরু করে, COMMIT সব পরিবর্তন স্থায়ী করে, ROLLBACK সব ফিরিয়ে নেয়। কাজটি BEGIN TRY ... END TRY-তে রাখুন, আর ভুল হলে BEGIN CATCH ... END CATCH-এ যান: সেখানে @@TRANCOUNT > 0 হলে ROLLBACK করুন আর ERROR_MESSAGE() দিয়ে কারণ দেখান।",
  `BEGIN TRY ~~ Statements that might fail. / যেগুলো ব্যর্থ হতে পারে।
  BEGIN TRANSACTION; ~~ Start the all-or-nothing unit. / সব-বা-কিছুই-না কাজ শুরু।
  UPDATE DepartmentsJn SET DepartmentName = 'IT Cell' WHERE DepartmentId = 10; ~~ Step 1. / ধাপ ১।
  INSERT INTO EmployeesJn (EmployeeName, DepartmentId, Salary) VALUES ('Ved', 10, 50000); ~~ Step 2. / ধাপ ২।
  INSERT INTO DepartmentsJn (DepartmentName, Location) VALUES ('Legal', NULL); ~~ Step 3 fails if Location is NOT NULL. / Location NOT NULL হলে ধাপ ৩ ব্যর্থ।
  COMMIT TRANSACTION; ~~ Reached only when every step succeeded. / সব সফল হলে তবেই এখানে আসে।
  SELECT 'Operation Successfully Done!' AS Status; ~~ Success message. / সফলতার বার্তা।
END TRY ~~ End of the protected block. / সুরক্ষিত অংশ শেষ।
BEGIN CATCH ~~ Runs only when an error happened. / শুধু error হলে চলে।
  IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION; ~~ Undo steps 1 and 2 as well. / ধাপ ১ ও ২-ও ফিরিয়ে নেওয়া।
  SELECT 'Transaction Rollback Successfully! ' + ERROR_MESSAGE() AS Status; ~~ Report the real error. / আসল error দেখানো।
END CATCH; ~~ End of error handling. / Error handling শেষ।`,
  "BEGIN TRAN > Run steps in TRY > All OK then COMMIT > Any error jumps to CATCH > ROLLBACK",
  "Without the IF @@TRANCOUNT > 0 check, ROLLBACK in CATCH can raise a second error when no transaction is open.",
  "Add SET XACT_ABORT ON at the top so SQL Server automatically rolls back on most runtime errors, including client timeouts.",
);

add(
  "ACID Properties",
  "ACID is the promise a transaction makes. Atomicity: all steps commit or all roll back. Consistency: the database moves from one valid state to another; every constraint stays 100% true. Isolation: concurrent transactions do not interfere; each behaves as if it ran alone (controlled by isolation levels such as READ COMMITTED). Durability: once COMMIT returns, the data survives a crash because it is written to the transaction log first.",
  "ACID হলো transaction-এর প্রতিশ্রুতি। Atomicity: সব ধাপ হবে, নয়তো কোনোটাই না (commit বা rollback)। Consistency: database এক বৈধ অবস্থা থেকে আরেক বৈধ অবস্থায় যায়, সব নিয়ম ১০০% ঠিক থাকে। Isolation: একসাথে চলা transaction একে অপরকে বিরক্ত করে না। Durability: COMMIT হলে বিদ্যুৎ চলে গেলেও data থাকে, কারণ আগে transaction log-এ লেখা হয়।",
  `BEGIN TRANSACTION; ~~ Atomicity begins: the two updates are one unit. / Atomicity: দুই update একটি কাজ।
UPDATE Accounts SET Balance = Balance - 500 WHERE AccountId = 1; ~~ Take 500 from account 1. / ১ নম্বর থেকে ৫০০ কাটা।
UPDATE Accounts SET Balance = Balance + 500 WHERE AccountId = 2; ~~ Give 500 to account 2. / ২ নম্বরে ৫০০ যোগ।
IF EXISTS (SELECT 1 FROM Accounts WHERE Balance < 0) ROLLBACK; ~~ Consistency: never allow a negative balance. / Consistency: ঋণাত্মক ব্যালান্স নয়।
ELSE COMMIT; ~~ Durability: after commit the transfer survives a crash. / Durability: commit-এর পরে crash হলেও থাকে।
SET TRANSACTION ISOLATION LEVEL READ COMMITTED; ~~ Isolation: readers see only committed data. / Isolation: শুধু commit হওয়া data দেখা।`,
  "Atomicity all or nothing > Consistency rules kept > Isolation no interference > Durability saved after commit",
  "Long-running open transactions hold locks and block other users. Keep transactions short and never wait for user input inside one.",
  "Higher isolation (REPEATABLE READ, SERIALIZABLE) prevents more anomalies but blocks more. SNAPSHOT isolation uses row versions in tempdb to let readers avoid blocking writers.",
);

add(
  "Stored Procedures",
  "A stored procedure is a saved, named batch of T-SQL with parameters that runs on the server. It can contain INSERT, UPDATE, DELETE, SELECT, IF/ELSE logic and transactions. Benefits: the plan is cached and reused, network traffic is lower (one EXEC call), permissions can be granted on the procedure instead of the tables, and parameters protect against SQL injection. A common pattern is one procedure with an @Action parameter that chooses insert, update, delete or select.",
  "Stored procedure হলো server-এ জমা রাখা নামওয়ালা T-SQL কাজের তালিকা, parameter সহ। এর ভেতরে INSERT, UPDATE, DELETE, SELECT, IF/ELSE আর transaction থাকতে পারে। সুবিধা: execution plan cache হয়, network-এ শুধু একটি EXEC যায়, table-এর বদলে procedure-এ অনুমতি দেওয়া যায়, আর parameter SQL injection থেকে রক্ষা করে। জনপ্রিয় ধরন: একটি @Action parameter দিয়ে insert, update, delete বা select বেছে নেওয়া।",
  `CREATE OR ALTER PROCEDURE UspEmployees ~~ Create (or replace) the procedure. / Procedure তৈরি বা বদল।
  @Action INT = 0, @EmployeeName NVARCHAR(100) = NULL, ~~ Parameters with default values. / Default সহ parameter।
  @DepartmentId INT = 0, @Salary DECIMAL(10,2) = 0, @EmployeeId INT = 0 ~~ More inputs. / আরও input।
AS BEGIN ~~ Body starts. / Body শুরু।
  IF (@Action = 1) INSERT INTO EmployeesJn (EmployeeName, DepartmentId, Salary) VALUES (@EmployeeName, @DepartmentId, @Salary); ~~ 1 = insert. / ১ = যোগ।
  ELSE IF (@Action = 2) UPDATE EmployeesJn SET EmployeeName = @EmployeeName WHERE EmployeeId = @EmployeeId; ~~ 2 = update. / ২ = বদল।
  ELSE IF (@Action = 3) DELETE FROM EmployeesJn WHERE EmployeeId = @EmployeeId; ~~ 3 = delete. / ৩ = মুছা।
  ELSE SELECT * FROM EmployeesJn WHERE @EmployeeId = 0 OR EmployeeId = @EmployeeId; ~~ Otherwise list all or one. / নইলে সব বা একজন দেখা।
END; ~~ Body ends. / Body শেষ।
EXEC UspEmployees @Action = 1, @EmployeeName = 'Jyoti', @DepartmentId = 34, @Salary = 70000; ~~ Call with named parameters. / নামসহ parameter দিয়ে ডাকা।
EXEC UspEmployees @Action = 4, @EmployeeId = 12; ~~ Read employee 12. / ১২ নম্বর কর্মী দেখা।`,
  "Application calls EXEC > Parameters arrive > IF chooses action > SQL runs with cached plan > Result returned",
  "Building SQL by concatenating parameter text inside a procedure (EXEC('...' + @name)) brings SQL injection back. Use sp_executesql with parameters if dynamic SQL is needed.",
  "ASP.NET Core calls procedures with Dapper (connection.Query(\"UspEmployees\", params, commandType: CommandType.StoredProcedure)) or EF Core FromSql.",
);

add(
  "Triggers & Audit Tables",
  "A trigger is a special procedure that runs automatically when a DML event (INSERT, UPDATE or DELETE) happens on a table. Inside an AFTER trigger SQL Server provides two virtual tables: inserted holds the new rows and deleted holds the old rows (an UPDATE fills both). Triggers are commonly used for audit logs: each change to Employees writes who/what/when into EmployeeAudit without the application doing anything.",
  "Trigger হলো এমন বিশেষ procedure, যা table-এ INSERT, UPDATE বা DELETE হলে নিজে নিজে চলে। AFTER trigger-এর ভেতরে SQL Server দুটি ভার্চুয়াল table দেয়: inserted-এ নতুন সারি, deleted-এ পুরনো সারি (UPDATE হলে দুটোতেই থাকে)। সাধারণ ব্যবহার audit log: Employees-এ প্রতিটি পরিবর্তন EmployeeAudit-এ কী, কখন লিখে রাখে — app-কে কিছু করতে হয় না।",
  `CREATE TABLE EmployeeAudit (AuditId INT IDENTITY(1,1) PRIMARY KEY, EmployeeId INT, Action VARCHAR(20), OldSalary DECIMAL(10,2), NewSalary DECIMAL(10,2), AuditDate DATETIME); ~~ Table that stores the history. / ইতিহাস রাখার table।
CREATE TRIGGER trg_insert_Employee ON Employees AFTER INSERT AS ~~ Fires after every insert. / প্রতিটি insert-এর পরে চলে।
  INSERT INTO EmployeeAudit (EmployeeId, Action, NewSalary, AuditDate) SELECT Id, 'INSERT', Salary, GETDATE() FROM inserted; ~~ inserted = the new rows. / inserted = নতুন সারি।
CREATE TRIGGER trg_delete_Employee ON Employees AFTER DELETE AS ~~ Fires after every delete. / প্রতিটি delete-এর পরে।
  INSERT INTO EmployeeAudit (EmployeeId, Action, OldSalary, AuditDate) SELECT Id, 'DELETE', Salary, GETDATE() FROM deleted; ~~ deleted = the removed rows. / deleted = মুছে যাওয়া সারি।
CREATE TRIGGER trg_update_Employee ON Employees AFTER UPDATE AS ~~ Fires after every update. / প্রতিটি update-এর পরে।
  INSERT INTO EmployeeAudit (EmployeeId, Action, OldSalary, NewSalary, AuditDate) ~~ Store old and new salary together. / পুরনো ও নতুন বেতন একসাথে।
  SELECT ins.Id, 'UPDATE', del.Salary, ins.Salary, GETDATE() FROM deleted del INNER JOIN inserted ins ON del.Id = ins.Id; ~~ Join old and new versions by Id. / Id দিয়ে পুরনো-নতুন মেলানো।
UPDATE Employees SET Salary = 14000 WHERE Id = 1; ~~ Fires the update trigger automatically. / নিজে থেকে update trigger চলে।`,
  "DML on table > Trigger fires > Reads inserted and deleted > Writes audit row > Same transaction commits",
  "Triggers fire once per statement, not once per row. Code that assumes one row (SELECT @id = Id FROM inserted) breaks when 5 rows are updated together.",
  "Use GO between CREATE TRIGGER statements in SSMS because each must be the first statement in its batch. Keep trigger logic short; it runs inside the user's transaction.",
);

add(
  "SQL Profiler & Execution Plan",
  "When a query is slow you need evidence. SQL Server Profiler (or the newer Extended Events) records what statements are running, from which application, with their duration, CPU and reads; filter by DatabaseName to reduce noise. The execution plan (Ctrl+M in SSMS for the actual plan) shows how SQL Server ran a query: table scans versus index seeks, join types, estimated versus actual rows and the cost percentage of each step. SET STATISTICS IO, TIME ON adds logical reads and milliseconds.",
  "Query ধীর হলে প্রমাণ লাগে। SQL Server Profiler (বা নতুন Extended Events) কোন statement, কোন app থেকে, কত সময়, CPU আর read নিল তা রেকর্ড করে; DatabaseName দিয়ে filter করলে ঝামেলা কমে। Execution plan (SSMS-এ Ctrl+M) দেখায় SQL Server কীভাবে query চালাল: পুরো table scan নাকি index seek, কোন join, আনুমানিক বনাম আসল সারি, আর প্রতিটি ধাপের খরচ (%)। SET STATISTICS IO, TIME ON দিয়ে read আর সময়ও দেখা যায়।",
  `SET STATISTICS IO ON; ~~ Show logical reads per table in the Messages tab. / Messages tab-এ কত page পড়া হলো।
SET STATISTICS TIME ON; ~~ Show CPU and elapsed milliseconds. / CPU ও সময় (ms)।
EXEC UspEmployees @Action = 2, @EmployeeId = 18, @EmployeeName = 'Asha'; ~~ Run the statement you want to measure with the actual plan on (Ctrl+M). / Ctrl+M চালু রেখে মাপার statement চালানো।
SELECT * FROM EmployeesJn WHERE EmployeeName = 'Asha'; ~~ Without an index the plan shows a Clustered Index Scan. / Index ছাড়া plan-এ Scan।
CREATE NONCLUSTERED INDEX ix_EmployeesJn_Name ON EmployeesJn(EmployeeName); ~~ Add an index for the filter column. / Filter column-এ index।
SELECT * FROM EmployeesJn WHERE EmployeeName = 'Asha'; ~~ Run again: the plan now shows an Index Seek with fewer reads. / আবার চালালে Seek, কম read।
SET STATISTICS IO OFF; SET STATISTICS TIME OFF; ~~ Turn measurement off. / মাপা বন্ধ।`,
  "Capture with Profiler > Find slow statement > Read execution plan > Fix index or query > Measure again",
  "Running Profiler on a busy production server adds overhead. Use Extended Events or Query Store there, with tight filters.",
  "Compare estimated and actual row counts in the plan. A big difference means outdated statistics or a non-sargable predicate; UPDATE STATISTICS or rewrite the condition.",
);

add(
  "FOR XML PATH & STUFF",
  "FOR XML PATH turns query rows into XML. FOR XML PATH('Employee') wraps each row in an <Employee> element. With an empty path, FOR XML PATH(''), and a single unnamed column like ',' + FirstName, the rows become one long string: ,Nancy,Andrew,Janet. STUFF(text, start, length, replacement) then deletes the first comma. Together they were the classic way to build comma-separated lists; SQL Server 2017+ offers STRING_AGG(FirstName, ',') which is simpler.",
  "FOR XML PATH query-র সারিগুলোকে XML বানায়। FOR XML PATH('Employee') দিলে প্রতিটি সারি <Employee> tag-এ মোড়ানো হয়। ফাঁকা path FOR XML PATH('') আর নামহীন একটি column (',' + FirstName) দিলে সব সারি মিলে একটি লম্বা লেখা হয়: ,Nancy,Andrew,Janet। STUFF(text, start, length, replacement) তারপর প্রথম কমাটি মুছে দেয়। এটি comma-separated তালিকা বানানোর পুরনো কৌশল; SQL Server 2017+-এ STRING_AGG(FirstName, ',') আরও সহজ।",
  `SELECT FirstName, LastName, Title FROM Employees FOR XML PATH('Employee'); ~~ Each row becomes an <Employee> XML element. / প্রতিটি সারি <Employee> element।
SELECT ',' + FirstName FROM Employees FOR XML PATH(''); ~~ Empty path joins rows into ',Nancy,Andrew,...'. / ফাঁকা path সব সারি জোড়ে।
SELECT STUFF('Rohan Kumawat', 1, 3, 'xyz'); ~~ Replace 3 characters from position 1: 'xyzan Kumawat'. / ১ থেকে ৩ অক্ষর বদলে 'xyzan Kumawat'।
SELECT STUFF( ~~ Remove the leading comma from the joined list. / জোড়া তালিকার প্রথম কমা সরানো।
  (SELECT ',' + FirstName FROM Employees FOR XML PATH('')), ~~ Inner query builds ',Nancy,Andrew,Janet'. / ভেতরের query তালিকা বানায়।
  1, 1, '') AS Names; ~~ Delete 1 character at position 1: 'Nancy,Andrew,Janet'. / ১ নম্বর ঘরের ১ অক্ষর মুছা।
SELECT STRING_AGG(FirstName, ',') AS Names FROM Employees; ~~ Modern one-line alternative (SQL Server 2017+). / আধুনিক এক লাইনের বিকল্প।`,
  "Rows > Prefix each with comma > FOR XML PATH('') joins them > STUFF removes first comma > One string",
  "Names containing & or < are escaped to &amp; and &lt; by FOR XML. Use FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)') to get the original text.",
  "Group the list per department with a correlated subquery (WHERE e2.DepartmentId = d.DepartmentId) or STRING_AGG with GROUP BY.",
);
