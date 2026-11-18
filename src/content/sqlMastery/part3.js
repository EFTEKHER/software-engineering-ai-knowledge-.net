// SQL Server Mastery — Part IV (second half), Part V (Query Optimization), Part VI (Design and Practice)
// Every code sample is T-SQL for Microsoft SQL Server and runs against BankDB.

export const part3 = [
  {
    id: 17,
    slug: "dynamic-sql-injection",
    part: 3,
    level: "Advanced",
    title: "Dynamic SQL and SQL Injection",
    titleBn: "Dynamic SQL এবং SQL Injection",
    analogy: {
      en: "Concatenating user input into SQL is like letting a customer write their own cheque amount AND the bank's instructions on the same slip. Parameters keep the amount in its own box.",
      bn: "ইউজারের ইনপুট SQL-এ জোড়া দেওয়া মানে কাস্টমারকে একই স্লিপে টাকার অঙ্ক আর ব্যাংকের নির্দেশ দুটোই লিখতে দেওয়া। Parameter অঙ্কটাকে আলাদা বক্সে রাখে।",
    },
    sections: [
      {
        title: "The right way and the catastrophic way",
        titleBn: "সঠিক উপায় এবং সর্বনাশা উপায়",
        en: "EXEC(@sql) with concatenated input is injectable: @City = ''; DROP TABLE dbo.Accounts; -- ends your career. sys.sp_executesql with parameters sends values separately from the SQL text — they are never parsed as SQL, so injection is structurally impossible. Bonus: the constant text gives one reusable cached plan.",
        bn: "জোড়া দেওয়া ইনপুটসহ EXEC(@sql) injection-যোগ্য: @City = ''; DROP TABLE dbo.Accounts; -- আপনার ক্যারিয়ার শেষ। Parameter-সহ sys.sp_executesql মানগুলো SQL টেক্সট থেকে আলাদা পাঠায় — কখনো SQL হিসেবে parse হয় না, তাই injection অসম্ভব। বোনাস: একটি পুনঃব্যবহারযোগ্য cached plan।",
        code: `DECLARE @City NVARCHAR(60) = N'Dhaka', @Kyc VARCHAR(12) = NULL;

-- NEVER: user text becomes code
DECLARE @bad NVARCHAR(MAX) =
    N'SELECT * FROM dbo.Customers WHERE City = ''' + @City + N'''';
-- EXEC (@bad);   -- with @City = N''''; DROP TABLE dbo.Accounts; --'' this destroys data

-- RIGHT: sp_executesql with parameters
DECLARE @sql NVARCHAR(MAX) = N'
    SELECT c.CustomerId, c.FullName, c.City
    FROM   dbo.Customers AS c
    WHERE  1 = 1';

IF @City IS NOT NULL SET @sql += N' AND c.City = @pCity';
IF @Kyc  IS NOT NULL SET @sql += N' AND c.KycStatus = @pKyc';

EXEC sys.sp_executesql @sql,
     N'@pCity NVARCHAR(60), @pKyc VARCHAR(12)',   -- parameter DEFINITION
     @pCity = @City, @pKyc = @Kyc;                -- parameter VALUES`,
        notes: [
          {
            type: "key",
            en: "Parameters are not 'string interpolation with extra steps'. The value travels separately and is never executed.",
            bn: "Parameter মানে 'একটু ঘুরিয়ে string জোড়া' নয়। মানটি আলাদাভাবে যায় এবং কখনো execute হয় না।",
          },
        ],
      },
      {
        title: "Identifiers cannot be parameters",
        titleBn: "টেবিল/কলামের নাম Parameter হতে পারে না",
        en: "You cannot parameterise a table or column name. Whitelist it against a known list FIRST, then wrap with QUOTENAME() as a second layer.",
        bn: "টেবিল বা কলামের নাম parameter দিয়ে দেওয়া যায় না। আগে নির্দিষ্ট তালিকার সাথে মিলিয়ে (whitelist) নিন, তারপর দ্বিতীয় স্তর হিসেবে QUOTENAME() দিন।",
        code: `DECLARE @UserInput SYSNAME = N'Balance';
DECLARE @SortColumn SYSNAME = @UserInput;

IF @SortColumn NOT IN (N'Balance', N'OpenedOn', N'AccountNumber')
    THROW 50030, 'Invalid sort column.', 1;          -- whitelist FIRST

DECLARE @sql NVARCHAR(MAX) =
    N'SELECT AccountNumber, Balance FROM dbo.Accounts ORDER BY '
    + QUOTENAME(@SortColumn);                         -- defence in depth
EXEC sys.sp_executesql @sql;`,
        notes: [
          {
            type: "trap",
            en: "QUOTENAME alone is not enough — it happily quotes a column the user should not reach. Whitelist first.",
            bn: "শুধু QUOTENAME যথেষ্ট নয় — ইউজারের যে কলাম দেখার কথা না সেটাও quote করে দেয়। আগে whitelist।",
          },
        ],
      },
      {
        title: "The optional-parameter ('kitchen sink') problem",
        titleBn: "Optional Parameter ('kitchen sink') সমস্যা",
        en: "WHERE (@BranchId IS NULL OR BranchId = @BranchId) AND … produces ONE cached plan that must work for every NULL combination — usually a scan. Cure 1: OPTION (RECOMPILE) for infrequent queries. Cure 2: dynamic SQL that adds only the supplied predicates, so each shape gets its own optimal plan.",
        bn: "WHERE (@BranchId IS NULL OR BranchId = @BranchId) AND … একটি cached plan বানায় যা সব NULL combination-এ চলতে হয় — সাধারণত scan। সমাধান ১: কম চলা query-তে OPTION (RECOMPILE)। সমাধান ২: dynamic SQL যা শুধু দেওয়া শর্তগুলো যোগ করে, ফলে প্রতিটি আকারের নিজস্ব সেরা plan।",
        code: `DECLARE @BranchId INT = 1, @Type VARCHAR(10) = NULL, @MinBal DECIMAL(19,4) = NULL;

-- Kitchen sink: one mediocre plan for all combinations
SELECT AccountId, AccountNumber, Balance FROM dbo.Accounts
WHERE (@BranchId IS NULL OR BranchId    = @BranchId)
  AND (@Type     IS NULL OR AccountType = @Type)
  AND (@MinBal   IS NULL OR Balance    >= @MinBal);

-- Cure 1: fresh plan per call
SELECT AccountId, AccountNumber, Balance FROM dbo.Accounts
WHERE (@BranchId IS NULL OR BranchId    = @BranchId)
  AND (@Type     IS NULL OR AccountType = @Type)
  AND (@MinBal   IS NULL OR Balance    >= @MinBal)
OPTION (RECOMPILE);

-- Cure 2: build only the predicates supplied
DECLARE @sql NVARCHAR(MAX) = N'SELECT AccountId, AccountNumber, Balance FROM dbo.Accounts WHERE 1 = 1';
IF @BranchId IS NOT NULL SET @sql += N' AND BranchId = @pBranch';
IF @Type     IS NOT NULL SET @sql += N' AND AccountType = @pType';
IF @MinBal   IS NOT NULL SET @sql += N' AND Balance >= @pMin';

EXEC sys.sp_executesql @sql,
     N'@pBranch INT, @pType VARCHAR(10), @pMin DECIMAL(19,4)',
     @pBranch = @BranchId, @pType = @Type, @pMin = @MinBal;`,
      },
    ],
    summary: [
      {
        en: "Always sp_executesql with parameters.",
        bn: "সবসময় parameter-সহ sp_executesql।",
      },
      {
        en: "Identifiers: whitelist, then QUOTENAME.",
        bn: "নাম: whitelist, তারপর QUOTENAME।",
      },
      {
        en: "Optional filters: RECOMPILE or dynamic SQL.",
        bn: "Optional ফিল্টার: RECOMPILE বা dynamic SQL।",
      },
    ],
  },

  {
    id: 18,
    slug: "error-handling",
    part: 3,
    level: "Advanced",
    title: "Error Handling",
    titleBn: "এরর হ্যান্ডলিং",
    analogy: {
      en: "TRY/CATCH is the safety net under a trapeze artist; XACT_STATE() tells you whether the artist can continue or must be carried out.",
      bn: "TRY/CATCH হলো দড়াবাজের নিচের নিরাপত্তা জাল; XACT_STATE() বলে সে চালিয়ে যেতে পারবে নাকি তাকে বাইরে নিতে হবে।",
    },
    sections: [
      {
        title: "TRY/CATCH and what it does not catch",
        titleBn: "TRY/CATCH এবং যা সে ধরে না",
        en: "The skeleton: SET XACT_ABORT ON; BEGIN TRY → BEGIN TRAN → work → COMMIT; END TRY BEGIN CATCH → IF XACT_STATE() <> 0 ROLLBACK → log → THROW; END CATCH. TRY/CATCH does NOT catch compile errors or missing-object errors in the same batch, severity 20+ errors, or KILL.",
        bn: "কাঠামো: SET XACT_ABORT ON; BEGIN TRY → BEGIN TRAN → কাজ → COMMIT; END TRY BEGIN CATCH → IF XACT_STATE() <> 0 ROLLBACK → log → THROW; END CATCH। TRY/CATCH একই batch-এর compile error বা অনুপস্থিত অবজেক্ট এরর, severity 20+ এরর বা KILL ধরে না।",
        code: `CREATE OR ALTER PROCEDURE dbo.usp_CloseAccount @AccountId BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        IF EXISTS (SELECT 1 FROM dbo.Accounts
                   WHERE AccountId = @AccountId AND Balance <> 0)
            THROW 50040, 'Cannot close an account with a non-zero balance.', 1;

        UPDATE dbo.Accounts
        SET    Status = 'CLOSED', ClosedOn = CAST(SYSUTCDATETIME() AS DATE)
        WHERE  AccountId = @AccountId AND Status <> 'CLOSED';

        IF @@ROWCOUNT = 0 THROW 50041, 'Account not found or already closed.', 1;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;

        INSERT INTO dbo.ErrorLog (ErrorNumber, ErrorMessage, ErrorProcedure, ErrorLine, LoggedAt)
        VALUES (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE(), ERROR_LINE(), SYSUTCDATETIME());

        THROW;    -- bare THROW re-raises the ORIGINAL error
    END CATCH
END
GO
EXEC dbo.usp_CloseAccount @AccountId = 1;   -- fails: non-zero balance
SELECT * FROM dbo.ErrorLog;`,
        notes: [
          {
            type: "trap",
            en: "XACT_STATE() = -1 means the transaction is doomed: it can only be rolled back. Checking @@TRANCOUNT instead leads to a COMMIT that throws a second, confusing error.",
            bn: "XACT_STATE() = -1 মানে transaction নষ্ট: শুধু rollback করা যায়। এর বদলে @@TRANCOUNT চেক করলে COMMIT আরেকটি বিভ্রান্তিকর এরর দেয়।",
          },
        ],
      },
      {
        title: "THROW vs RAISERROR",
        titleBn: "THROW বনাম RAISERROR",
        en: "THROW (2012+): severity always 16, bare THROW re-raises the original error intact, any number ≥ 50000 without registering. RAISERROR: legacy, you choose severity, printf-style formatting, cannot preserve the original error. Use THROW; use RAISERROR only for formatted messages or WITH NOWAIT progress output.",
        bn: "THROW (2012+): severity সবসময় ১৬, শুধু THROW লিখলে মূল এরর অক্ষত আবার ছোড়ে, ৫০০০০+ যেকোনো নম্বর রেজিস্টার ছাড়াই। RAISERROR: পুরনো, severity নিজে ঠিক করা যায়, printf-স্টাইল ফরম্যাট, মূল এরর রাখতে পারে না। THROW ব্যবহার করুন; শুধু ফরম্যাটেড মেসেজ বা WITH NOWAIT অগ্রগতি দেখাতে RAISERROR।",
        code: `-- THROW with a custom number
THROW 50050, 'Daily transfer limit exceeded.', 1;
GO
-- RAISERROR for formatted text and immediate progress messages
DECLARE @done INT = 4000, @total INT = 10000;
RAISERROR('Processed %d of %d rows', 0, 1, @done, @total) WITH NOWAIT;`,
      },
      {
        title: "Nested transactions are a lie",
        titleBn: "Nested Transaction একটি মিথ্যা",
        en: "BEGIN TRAN inside BEGIN TRAN only increments @@TRANCOUNT. The inner COMMIT commits nothing; only the outermost COMMIT is real. An inner ROLLBACK rolls back EVERYTHING. For real partial rollback use SAVE TRANSACTION (a savepoint), and never roll back a transaction you did not start.",
        bn: "BEGIN TRAN-এর ভেতরে BEGIN TRAN শুধু @@TRANCOUNT বাড়ায়। ভেতরের COMMIT কিছুই commit করে না; শুধু সবচেয়ে বাইরেরটা আসল। ভেতরের ROLLBACK সবকিছু rollback করে। আংশিক rollback-এর জন্য SAVE TRANSACTION (savepoint) ব্যবহার করুন, আর যে transaction নিজে শুরু করেননি তা rollback করবেন না।",
        code: `CREATE OR ALTER PROCEDURE dbo.usp_ChildOperation
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Started BIT = 0,
            @sp SYSNAME = 'sp_' + CAST(@@NESTLEVEL AS VARCHAR(4));

    IF @@TRANCOUNT = 0 BEGIN BEGIN TRANSACTION; SET @Started = 1; END
    ELSE SAVE TRANSACTION @sp;                 -- a savepoint, not a transaction

    BEGIN TRY
        INSERT INTO dbo.Loans (CustomerId, BranchId, Principal, InterestRate,
                               TermMonths, DisbursedOn, Status)
        VALUES (1, 1, 500000, 9.50, 36, GETDATE(), 'ACTIVE');

        IF @Started = 1 COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @Started = 1 ROLLBACK TRANSACTION;               -- I own it
        ELSE IF XACT_STATE() = 1 ROLLBACK TRANSACTION @sp;  -- undo only my part
        THROW;
    END CATCH
END
GO
-- Proof that nested COMMIT commits nothing
BEGIN TRAN; BEGIN TRAN;
COMMIT;
SELECT @@TRANCOUNT AS StillOpen;   -- 1
ROLLBACK;                          -- rolls back everything, @@TRANCOUNT = 0`,
        notes: [
          {
            type: "interview",
            q: "What does @@TRANCOUNT return after BEGIN TRAN; BEGIN TRAN; COMMIT;?",
            en: "1 — and nothing has been committed. A ROLLBACK now undoes everything and sets it to 0.",
            bn: "1 — আর কিছুই commit হয়নি। এখন ROLLBACK দিলে সব বাতিল হয় এবং 0 হয়ে যায়।",
          },
        ],
      },
    ],
    summary: [
      {
        en: "XACT_ABORT ON + TRY/CATCH + XACT_STATE() + bare THROW.",
        bn: "XACT_ABORT ON + TRY/CATCH + XACT_STATE() + শুধু THROW।",
      },
      {
        en: "Use savepoints for partial rollback.",
        bn: "আংশিক rollback-এ savepoint।",
      },
    ],
  },

  {
    id: 19,
    slug: "strings-dates-json-pivot",
    part: 3,
    level: "Advanced",
    title: "Strings, Dates, JSON, and Pivoting",
    titleBn: "String, Date, JSON এবং Pivot",
    analogy: {
      en: "These are the kitchen tools: STRING_AGG glues, STRING_SPLIT cuts, date functions measure time, JSON functions open parcels, PIVOT turns a list sideways into a table.",
      bn: "এগুলো রান্নাঘরের যন্ত্র: STRING_AGG জোড়া লাগায়, STRING_SPLIT কাটে, date ফাংশন সময় মাপে, JSON ফাংশন পার্সেল খোলে, PIVOT তালিকাকে পাশ ফিরিয়ে টেবিল বানায়।",
    },
    sections: [
      {
        title: "STRING_AGG and STRING_SPLIT",
        titleBn: "STRING_AGG এবং STRING_SPLIT",
        en: "STRING_AGG (2017+) joins rows into one delimited string, ordered with WITHIN GROUP. STRING_SPLIT turns a CSV parameter into rows. Older code uses the FOR XML PATH('') + STUFF trick — learn to read it.",
        bn: "STRING_AGG (2017+) রো-গুলো জোড়া দিয়ে একটি স্ট্রিং বানায়, WITHIN GROUP দিয়ে ক্রম ঠিক হয়। STRING_SPLIT একটি CSV parameter-কে রো বানায়। পুরনো কোডে FOR XML PATH('') + STUFF কৌশল থাকে — পড়তে শিখুন।",
        code: `-- Every account number a customer holds, on one line
SELECT c.CustomerId, c.FullName,
       STRING_AGG(a.AccountNumber, ', ') WITHIN GROUP (ORDER BY a.OpenedOn) AS Accounts
FROM   dbo.Customers AS c
JOIN   dbo.Accounts  AS a ON a.CustomerId = c.CustomerId
GROUP BY c.CustomerId, c.FullName;

-- Split a CSV parameter into a set
DECLARE @CsvList VARCHAR(200) = '1001000000001, 1001000000003,';
SELECT TRIM(value) AS AccountNumber
FROM   STRING_SPLIT(@CsvList, ',')
WHERE  TRIM(value) <> '';

-- Legacy idiom (pre-2017), for reading old code
SELECT c.CustomerId,
       STUFF((SELECT ', ' + a.AccountNumber
              FROM   dbo.Accounts AS a
              WHERE  a.CustomerId = c.CustomerId
              FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS Accounts
FROM   dbo.Customers AS c;`,
      },
      {
        title: "Dates done right",
        titleBn: "সঠিকভাবে Date ব্যবহার",
        en: "DATEADD adds intervals (Jan 31 + 3 months = Apr 30). DATEDIFF counts BOUNDARY crossings, not elapsed time: DATEDIFF(YEAR, '2025-12-31', '2026-01-01') = 1. EOMONTH gives the month end, DATEFROMPARTS builds a date. FORMAT() is CLR-based and ~30x slower than CONVERT — avoid it on many rows.",
        bn: "DATEADD সময় যোগ করে (৩১ জানুয়ারি + ৩ মাস = ৩০ এপ্রিল)। DATEDIFF সীমানা পার হওয়া গোনে, আসল সময় নয়: DATEDIFF(YEAR, '2025-12-31', '2026-01-01') = 1। EOMONTH মাসের শেষ দিন দেয়, DATEFROMPARTS তারিখ বানায়। FORMAT() CLR-ভিত্তিক, CONVERT-এর চেয়ে ~৩০ গুণ ধীর — অনেক রো-তে এড়িয়ে চলুন।",
        code: `SELECT DATEADD(MONTH, 3, '2026-01-31')            AS ThreeMonthsOn,   -- 2026-04-30
       DATEDIFF(DAY, '2026-01-01', '2026-07-16')  AS DaysBetween,
       DATEDIFF(YEAR, '2025-12-31', '2026-01-01') AS YearBoundaries,  -- 1 (one day apart!)
       EOMONTH('2026-02-01')                      AS LastDayOfFeb,
       DATEFROMPARTS(2026, 7, 16)                 AS Built,
       CONVERT(CHAR(10), SYSUTCDATETIME(), 23)    AS IsoFast,          -- yyyy-mm-dd
       FORMAT(SYSUTCDATETIME(), 'yyyy-MM-dd')     AS IsoSlow;

-- Correct age in whole years
DECLARE @Dob DATE = '2000-07-20', @Today DATE = '2026-07-16';
SELECT DATEDIFF(YEAR, @Dob, @Today)
       - IIF(DATEADD(YEAR, DATEDIFF(YEAR, @Dob, @Today), @Dob) > @Today, 1, 0) AS Age;  -- 25`,
      },
      {
        title: "JSON",
        titleBn: "JSON পড়া ও লেখা",
        en: "JSON_VALUE extracts a scalar, ISJSON validates, OPENJSON … WITH shreds an array into typed rows, FOR JSON PATH produces JSON for an API straight from a query.",
        bn: "JSON_VALUE একটি মান বের করে, ISJSON যাচাই করে, OPENJSON … WITH একটি array-কে টাইপসহ রো বানায়, FOR JSON PATH query থেকেই API-র JSON বানায়।",
        code: `-- Read a value from a JSON column
SELECT t.TxnId,
       JSON_VALUE(t.Reference, '$.merchant') AS Merchant,
       JSON_VALUE(t.Reference, '$.deviceId') AS DeviceId
FROM   dbo.Transactions AS t
WHERE  ISJSON(t.Reference) = 1;

-- Shred a JSON array into rows
DECLARE @JsonPayload NVARCHAR(MAX) =
    N'[{"accountId":1,"amount":500.00},{"accountId":3,"amount":120.50}]';
SELECT j.AccountId, j.Amount
FROM   OPENJSON(@JsonPayload)
       WITH (AccountId BIGINT        '$.accountId',
             Amount    DECIMAL(19,4) '$.amount') AS j;

-- Produce JSON for an API
DECLARE @AccountId BIGINT = 1;
SELECT a.AccountNumber, a.Balance,
       (SELECT TOP (5) t.TxnDate, t.Amount
        FROM   dbo.Transactions AS t
        WHERE  t.AccountId = a.AccountId
        ORDER BY t.TxnDate DESC
        FOR JSON PATH) AS RecentTxns
FROM   dbo.Accounts AS a
WHERE  a.AccountId = @AccountId
FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;`,
        notes: [
          {
            type: "tip",
            en: "Filtering on JSON_VALUE(...) in WHERE is non-SARGable. If you must, add a persisted computed column over the JSON_VALUE expression and index it.",
            bn: "WHERE-এ JSON_VALUE(...) দিয়ে ফিল্টার non-SARGable। দরকার হলে JSON_VALUE-এর উপর persisted computed column বানিয়ে index দিন।",
          },
        ],
      },
      {
        title: "PIVOT",
        titleBn: "PIVOT — রো থেকে কলাম",
        en: "Rows to columns. Conditional aggregation (SUM(CASE …)) is the clearest way. The PIVOT operator does the same with T-SQL-specific syntax. Both need the column values known when you write the query; dynamic columns need dynamic SQL — or better, let the reporting tool do layout.",
        bn: "রো থেকে কলাম। Conditional aggregation (SUM(CASE …)) সবচেয়ে পরিষ্কার উপায়। PIVOT অপারেটর T-SQL-এর নিজস্ব সিনট্যাক্সে একই কাজ করে। দুটোতেই কলামের মান আগে থেকে জানা লাগে; ডায়নামিক কলামের জন্য dynamic SQL — বা রিপোর্টিং টুলকে layout করতে দিন।",
        code: `-- Monthly totals as columns (conditional aggregation)
SELECT a.BranchId,
       SUM(CASE WHEN MONTH(t.TxnDate) = 1 THEN t.Amount ELSE 0 END) AS Jan,
       SUM(CASE WHEN MONTH(t.TxnDate) = 2 THEN t.Amount ELSE 0 END) AS Feb,
       SUM(CASE WHEN MONTH(t.TxnDate) = 3 THEN t.Amount ELSE 0 END) AS Mar
FROM   dbo.Transactions AS t
JOIN   dbo.Accounts     AS a ON a.AccountId = t.AccountId
WHERE  t.TxnDate >= '2026-01-01' AND t.TxnDate < '2026-04-01'
GROUP BY a.BranchId;

-- The PIVOT operator
SELECT BranchId, [SAVINGS], [CURRENT], [FD]
FROM   (SELECT BranchId, AccountType, Balance FROM dbo.Accounts) AS src
PIVOT  (SUM(Balance) FOR AccountType IN ([SAVINGS], [CURRENT], [FD])) AS p;

-- UNPIVOT: columns back to rows
SELECT BranchId, AccountType, Total
FROM  (SELECT BranchId, [SAVINGS], [CURRENT], [FD]
       FROM (SELECT BranchId, AccountType, Balance FROM dbo.Accounts) AS s
       PIVOT (SUM(Balance) FOR AccountType IN ([SAVINGS], [CURRENT], [FD])) AS p) AS wide
UNPIVOT (Total FOR AccountType IN ([SAVINGS], [CURRENT], [FD])) AS u;`,
      },
    ],
    summary: [
      {
        en: "STRING_AGG / STRING_SPLIT replace XML tricks.",
        bn: "STRING_AGG / STRING_SPLIT XML কৌশলের বদলে।",
      },
      {
        en: "DATEDIFF counts boundaries; avoid FORMAT on big sets.",
        bn: "DATEDIFF সীমানা গোনে; বড় সেটে FORMAT নয়।",
      },
      {
        en: "Pivot with SUM(CASE …) or PIVOT.",
        bn: "SUM(CASE …) বা PIVOT দিয়ে pivot।",
      },
    ],
  },

  {
    id: 20,
    slug: "indexes",
    part: 4,
    level: "Advanced",
    title: "Indexes",
    titleBn: "ইনডেক্স (Index)",
    analogy: {
      en: "An index is the index at the back of a book: a sorted copy of some data with page numbers, so you don't read every page.",
      bn: "Index হলো বইয়ের শেষের সূচিপত্র: কিছু তথ্যের সাজানো কপি আর পেজ নম্বর, যাতে প্রতিটি পেজ পড়তে না হয়।",
    },
    sections: [
      {
        title: "The B-tree",
        titleBn: "B-tree — index-এর গঠন",
        en: "SQL Server indexes are B+trees: root and intermediate levels hold key ranges, the leaf holds the row (clustered) or key + pointer (nonclustered). A 60M-row table is ~4 levels deep, so finding one row = ~4 page reads instead of ~800,000. Index Seek = navigate directly (what you want). Index Scan = read every leaf. Key Lookup = go back to the clustered index for missing columns, once per row.",
        bn: "SQL Server-এর index হলো B+tree: root ও মাঝের লেভেলে key-এর রেঞ্জ, leaf-এ পুরো রো (clustered) বা key + pointer (nonclustered)। ৬ কোটি রো-র টেবিল ~৪ লেভেল গভীর, তাই একটি রো খুঁজতে ~৪টি পেজ, ~৮ লাখ নয়। Index Seek = সরাসরি যাওয়া। Index Scan = সব leaf পড়া। Key Lookup = বাকি কলামের জন্য প্রতি রো-তে clustered index-এ ফিরে যাওয়া।",
        code: `-- See index depth and size
SELECT i.name AS IndexName, s.index_depth, s.page_count, s.record_count
FROM   sys.dm_db_index_physical_stats(DB_ID(), OBJECT_ID('dbo.Transactions'), NULL, NULL, 'DETAILED') AS s
JOIN   sys.indexes AS i ON i.object_id = s.object_id AND i.index_id = s.index_id
WHERE  s.index_level = 0;`,
      },
      {
        title: "Clustered vs nonclustered",
        titleBn: "Clustered বনাম Nonclustered",
        en: "The clustered index IS the table, sorted by its key — one per table. A nonclustered index is a separate structure whose leaf carries the clustering key as a pointer. A good clustering key is Narrow, Unique, Static and Ever-increasing (IDENTITY is ideal).",
        bn: "Clustered index-ই হলো টেবিল, তার key অনুযায়ী সাজানো — প্রতি টেবিলে একটি। Nonclustered index আলাদা কাঠামো, যার leaf-এ pointer হিসেবে clustering key থাকে। ভালো clustering key: সরু, ইউনিক, অপরিবর্তনীয় এবং ক্রমবর্ধমান (IDENTITY আদর্শ)।",
        code: `-- Clustered on an ever-increasing IDENTITY, unique GUID kept as nonclustered
CREATE TABLE dbo.Devices (
    DeviceId   INT              NOT NULL IDENTITY(1,1),
    DeviceGuid UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    CustomerId INT              NOT NULL,
    CONSTRAINT PK_Devices PRIMARY KEY CLUSTERED (DeviceId),
    CONSTRAINT UQ_Devices_Guid UNIQUE NONCLUSTERED (DeviceGuid)
);`,
        notes: [
          {
            type: "trap",
            en: "A random NEWID() GUID as the clustering key: 16 bytes wide, random inserts split pages, fragmentation ~99%. Use NEWSEQUENTIALID() or cluster on IDENTITY.",
            bn: "Clustering key হিসেবে random NEWID() GUID: ১৬ বাইট চওড়া, এলোমেলো insert-এ page split, fragmentation ~৯৯%। NEWSEQUENTIALID() বা IDENTITY-তে cluster করুন।",
          },
        ],
      },
      {
        title: "Composite keys: order is everything",
        titleBn: "Composite Key: ক্রমই সব",
        en: "An index on (AccountId, TxnDate) is sorted by AccountId first. It can seek on AccountId, or AccountId + TxnDate, but NOT on TxnDate alone — like a phone book sorted by (LastName, FirstName) cannot find everyone named 'Karim'. Rule: equality columns first, then the range column, then the ORDER BY column.",
        bn: "(AccountId, TxnDate)-এর index আগে AccountId দিয়ে সাজানো। এটা AccountId বা AccountId + TxnDate দিয়ে seek করতে পারে, কিন্তু শুধু TxnDate দিয়ে নয় — যেমন (পদবি, নাম) দিয়ে সাজানো ফোনবুকে সব 'করিম' খোঁজা যায় না। নিয়ম: আগে equality কলাম, তারপর range কলাম, তারপর ORDER BY কলাম।",
        code: `CREATE NONCLUSTERED INDEX IX_Txn_Account_Date
    ON dbo.Transactions (AccountId, TxnDate);

-- SEEK: leading column present
SELECT * FROM dbo.Transactions WHERE AccountId = 1;

-- SEEK + range: both, in key order
SELECT * FROM dbo.Transactions WHERE AccountId = 1 AND TxnDate >= '2026-01-01';

-- SCAN: leading column absent
SELECT * FROM dbo.Transactions WHERE TxnDate >= '2026-01-01';`,
      },
      {
        title: "Covering indexes and INCLUDE",
        titleBn: "Covering Index এবং INCLUDE",
        en: "A Key Lookup is a random read per row. INCLUDE adds columns to the leaf only (not the key), so the index alone answers the query. Too many lookups and the optimizer gives up and scans (the 'tipping point').",
        bn: "Key Lookup মানে প্রতি রো-তে একটি এলোমেলো read। INCLUDE শুধু leaf-এ কলাম যোগ করে (key-তে নয়), ফলে index একাই query-র উত্তর দেয়। অনেক lookup হলে optimizer হাল ছেড়ে scan করে ('tipping point')।",
        code: `-- Seeks IX_Txn_Account_Date, then a Key Lookup per row for Amount, TxnType, Channel
SELECT TxnDate, Amount, TxnType, Channel
FROM   dbo.Transactions
WHERE  AccountId = 1 AND TxnDate >= '2026-01-01';

-- Covering index: no lookups
CREATE NONCLUSTERED INDEX IX_Txn_Account_Date_Covering
    ON dbo.Transactions (AccountId, TxnDate)        -- KEY: navigation
    INCLUDE (Amount, TxnType, Channel);             -- LEAF only`,
        notes: [
          {
            type: "tip",
            en: "Cover your hot query's columns, not every column. An index that includes half the row is a second copy of the table.",
            bn: "শুধু গুরুত্বপূর্ণ query-র কলাম cover করুন, সব কলাম নয়। অর্ধেক রো include করা index মানে টেবিলের দ্বিতীয় কপি।",
          },
        ],
      },
      {
        title: "Filtered indexes",
        titleBn: "Filtered Index — শুধু দরকারি রো",
        en: "Index only the rows that matter (WHERE Status = 'DORMANT'): tiny, stays in memory, cheap to maintain. Also the standard trick for 'unique, but many NULLs allowed'. Catch: a parameterised @Status = 'DORMANT' may not match unless you add OPTION (RECOMPILE).",
        bn: "শুধু দরকারি রো index করুন (WHERE Status = 'DORMANT'): ছোট, memory-তে থাকে, রক্ষণাবেক্ষণ সস্তা। 'ইউনিক, কিন্তু অনেক NULL চলবে' — এর স্ট্যান্ডার্ড কৌশলও এটা। সতর্কতা: parameter @Status = 'DORMANT' মিলতে নাও পারে, OPTION (RECOMPILE) দিন।",
        code: `CREATE NONCLUSTERED INDEX IX_Accounts_Dormant
    ON dbo.Accounts (BranchId, ClosedOn)
    WHERE Status = 'DORMANT';

-- Unique email, but many customers have no email
CREATE UNIQUE NONCLUSTERED INDEX UQ_Customers_Email
    ON dbo.Customers (Email)
    WHERE Email IS NOT NULL;`,
      },
      {
        title: "The cost of an index",
        titleBn: "Index-এর খরচ",
        en: "Every INSERT writes to the table AND every index. Every UPDATE touches each index containing a changed column. Every DELETE removes from every index. Every index uses buffer-pool memory. On a busy OLTP table, 5–7 well-chosen indexes is a practical maximum.",
        bn: "প্রতিটি INSERT টেবিলে এবং প্রতিটি index-এ লেখে। প্রতিটি UPDATE বদলানো কলাম আছে এমন প্রতিটি index ছোঁয়। প্রতিটি DELETE সব index থেকে মোছে। প্রতিটি index memory খায়। ব্যস্ত OLTP টেবিলে ৫–৭টি ভালোভাবে বাছা index বাস্তব সর্বোচ্চ।",
        code: `-- How many indexes, and how big?
SELECT i.name AS IndexName, i.type_desc,
       SUM(a.used_pages) * 8 / 1024.0 AS SizeMB
FROM   sys.indexes AS i
JOIN   sys.partitions AS p ON p.object_id = i.object_id AND p.index_id = i.index_id
JOIN   sys.allocation_units AS a ON a.container_id = p.partition_id
WHERE  i.object_id = OBJECT_ID('dbo.Transactions')
GROUP BY i.name, i.type_desc;`,
        notes: [
          {
            type: "interview",
            q: "Why not just index every column?",
            en: "15 indexes turn one insert into 16 writes, flood the log, block writers and evict useful pages. Indexes trade write speed and storage for read speed.",
            bn: "১৫টি index মানে একটি insert-এ ১৬টি write, log ভরে যায়, writer আটকায়, দরকারি পেজ memory থেকে বের হয়। Index মানে write-গতি ও জায়গা দিয়ে read-গতি কেনা।",
          },
        ],
      },
      {
        title: "Finding missing and unused indexes",
        titleBn: "অনুপস্থিত ও অব্যবহৃত Index খোঁজা",
        en: "The missing-index DMVs show what the optimizer wished it had (evidence, not a command). Usage stats show indexes you pay to maintain but never read. Counters reset on restart.",
        bn: "Missing-index DMV দেখায় optimizer কী চেয়েছিল (প্রমাণ, আদেশ নয়)। Usage stats দেখায় কোন index-এর রক্ষণাবেক্ষণে খরচ হচ্ছে কিন্তু পড়া হয় না। রিস্টার্টে কাউন্টার রিসেট হয়।",
        code: `-- What the optimizer wished it had
SELECT TOP (20)
       ROUND(s.avg_total_user_cost * s.avg_user_impact * (s.user_seeks + s.user_scans), 0) AS Score,
       d.statement AS TableName,
       d.equality_columns, d.inequality_columns, d.included_columns
FROM   sys.dm_db_missing_index_group_stats AS s
JOIN   sys.dm_db_missing_index_groups      AS g ON g.index_group_handle = s.group_handle
JOIN   sys.dm_db_missing_index_details     AS d ON d.index_handle = g.index_handle
ORDER BY Score DESC;

-- Indexes you pay for but never read
SELECT OBJECT_NAME(i.object_id) AS TableName, i.name AS IndexName,
       u.user_seeks, u.user_scans, u.user_lookups, u.user_updates
FROM   sys.indexes AS i
LEFT   JOIN sys.dm_db_index_usage_stats AS u
       ON u.object_id = i.object_id AND u.index_id = i.index_id AND u.database_id = DB_ID()
WHERE  i.type_desc = 'NONCLUSTERED' AND i.is_primary_key = 0
  AND  ISNULL(u.user_seeks, 0) + ISNULL(u.user_scans, 0) + ISNULL(u.user_lookups, 0) = 0
  AND  ISNULL(u.user_updates, 0) > 1000
ORDER BY u.user_updates DESC;`,
        notes: [
          {
            type: "trap",
            en: "Never apply missing-index suggestions blindly: they ignore your existing indexes, always want everything in INCLUDE, and never suggest drops. Design the index yourself.",
            bn: "Missing-index পরামর্শ চোখ বুজে প্রয়োগ করবেন না: বিদ্যমান index দেখে না, সবকিছু INCLUDE-এ চায়, কখনো drop করতে বলে না। নিজে index ডিজাইন করুন।",
          },
        ],
      },
    ],
    summary: [
      {
        en: "Seek good, scan big = bad, key lookups add up.",
        bn: "Seek ভালো, বড় scan খারাপ, key lookup জমে যায়।",
      },
      {
        en: "Key order: equality → range → ORDER BY; INCLUDE for coverage.",
        bn: "Key ক্রম: equality → range → ORDER BY; cover করতে INCLUDE।",
      },
      {
        en: "Every index taxes every write — audit usage.",
        bn: "প্রতিটি index প্রতিটি write-এ কর বসায় — ব্যবহার যাচাই করুন।",
      },
    ],
  },

  {
    id: 21,
    slug: "statistics-optimizer",
    part: 4,
    level: "Advanced",
    title: "Statistics and the Optimizer",
    titleBn: "Statistics এবং Optimizer",
    analogy: {
      en: "Statistics are the optimizer's map. With an old map (stale stats) it confidently takes a road that no longer exists.",
      bn: "Statistics হলো optimizer-এর মানচিত্র। পুরনো মানচিত্রে (stale stats) সে আত্মবিশ্বাসের সাথে এমন রাস্তা নেয় যা আর নেই।",
    },
    sections: [
      {
        title: "Cardinality estimation is the whole ballgame",
        titleBn: "Cardinality Estimation-ই আসল খেলা",
        en: "The optimizer guesses how many rows each step produces. Right guess → right join, right index, right memory grant. Wrong guess → every later decision is wrong, multiplied up the plan. It guesses from statistics: a histogram (up to 200 steps) on the leading column plus a density vector.",
        bn: "Optimizer অনুমান করে প্রতিটি ধাপে কত রো আসবে। ঠিক অনুমান → ঠিক join, ঠিক index, ঠিক memory। ভুল অনুমান → পরের সব সিদ্ধান্ত ভুল, গুণিতকে বাড়ে। এই অনুমান আসে statistics থেকে: প্রথম কলামের histogram (সর্বোচ্চ ২০০ ধাপ) আর density vector।",
        code: `DBCC SHOW_STATISTICS ('dbo.Transactions', 'IX_Txn_Account_Date') WITH HISTOGRAM;

-- When were stats last updated, and how many changes since?
SELECT s.name AS StatName, sp.last_updated, sp.rows, sp.rows_sampled, sp.modification_counter
FROM   sys.stats AS s
CROSS APPLY sys.dm_db_stats_properties(s.object_id, s.stats_id) AS sp
WHERE  s.object_id = OBJECT_ID('dbo.Transactions');`,
      },
      {
        title: "When statistics go stale",
        titleBn: "যখন Statistics পুরনো হয়ে যায়",
        en: "Auto-update fires after roughly √(1000 × n) changes — about 245,000 on a 60M-row table. The ascending-key problem: TxnDate is always 'now', yesterday's histogram ends yesterday, so today is estimated at ~1 row → nested loops → 400,000 real rows → an hour.",
        bn: "প্রায় √(১০০০ × n) পরিবর্তনের পর auto-update চলে — ৬ কোটি রো-তে প্রায় ২,৪৫,০০০। Ascending-key সমস্যা: TxnDate সবসময় 'এখন', গতকালের histogram গতকালেই শেষ, তাই আজকের ডেটা ~১ রো ধরা হয় → nested loops → আসলে ৪ লাখ রো → এক ঘণ্টা।",
        code: `-- Today's data is outside the histogram
SELECT * FROM dbo.Transactions WHERE TxnDate >= CAST(GETDATE() AS DATE);

-- Fix: refresh statistics
UPDATE STATISTICS dbo.Transactions IX_Txn_Account_Date WITH FULLSCAN;

-- Or refresh everything that changed
EXEC sys.sp_updatestats;`,
        notes: [
          {
            type: "key",
            en: "Estimated vs Actual Number of Rows in an actual plan is the most valuable number in tuning. If they differ by more than ~10x, fix the estimate first.",
            bn: "Actual plan-এ Estimated বনাম Actual রো সংখ্যা — টিউনিংয়ের সবচেয়ে মূল্যবান সংখ্যা। ~১০ গুণের বেশি পার্থক্য হলে আগে estimate ঠিক করুন।",
          },
        ],
      },
      {
        title: "Where estimates go wrong",
        titleBn: "যেখানে Estimate ভুল হয়",
        en: "Stale statistics → UPDATE STATISTICS. Table variables → treated as tiny; use #temp. Scalar UDFs in predicates → opaque fixed guess. Local variables → no sniffing, average density. Correlated columns (City and AccountType) → multiplied selectivities; add multi-column statistics. Functions on columns (YEAR(TxnDate)) → no histogram, guess.",
        bn: "পুরনো statistics → UPDATE STATISTICS। Table variable → ছোট ধরা হয়; #temp ব্যবহার করুন। Predicate-এ scalar UDF → অন্ধ অনুমান। Local variable → sniffing নেই, গড় density। সম্পর্কিত কলাম (City ও AccountType) → selectivity গুণ হয়; multi-column statistics দিন। কলামে ফাংশন (YEAR(TxnDate)) → histogram নেই, অনুমান।",
        code: `-- Multi-column statistics for correlated columns
CREATE STATISTICS ST_Customers_City_Kyc ON dbo.Customers (City, KycStatus) WITH FULLSCAN;

-- Local variable: estimated by average density (no sniffing)
DECLARE @City NVARCHAR(60) = N'Dhaka';
SELECT * FROM dbo.Customers WHERE City = @City;

-- Same query with the actual value visible at compile time
SELECT * FROM dbo.Customers WHERE City = @City OPTION (RECOMPILE);`,
      },
    ],
    summary: [
      {
        en: "Every bad plan is, at bottom, a bad estimate.",
        bn: "প্রতিটি খারাপ plan-এর মূলে খারাপ estimate।",
      },
      {
        en: "Compare estimated vs actual rows first.",
        bn: "আগে estimated বনাম actual রো তুলনা করুন।",
      },
    ],
  },

  {
    id: 22,
    slug: "plans-sargability-sniffing",
    part: 4,
    level: "Advanced",
    title: "Execution Plans, SARGability, and Parameter Sniffing",
    titleBn: "Execution Plan, SARGability এবং Parameter Sniffing",
    analogy: {
      en: "An execution plan is the route the GPS chose. SARGability is whether the address is written so the GPS can find it. Parameter sniffing is the GPS remembering yesterday's route even when today the traffic is different.",
      bn: "Execution plan হলো GPS-এর বাছা পথ। SARGability মানে ঠিকানাটা এমনভাবে লেখা কিনা যাতে GPS খুঁজে পায়। Parameter sniffing মানে আজ ট্রাফিক আলাদা হলেও GPS গতকালের পথ মনে রাখা।",
    },
    sections: [
      {
        title: "Reading a plan",
        titleBn: "Plan পড়া",
        en: "Turn on STATISTICS IO, TIME and the actual plan (Ctrl+M in SSMS). Read right-to-left, top-to-bottom. Check in order: (1) estimated vs actual rows, (2) fat arrows early, (3) scans where you expected seeks, (4) key lookups with high counts, (5) Sort operators, (6) tempdb spill warnings, (7) implicit conversion warnings.",
        bn: "STATISTICS IO, TIME আর actual plan চালু করুন (SSMS-এ Ctrl+M)। ডান থেকে বামে, উপর থেকে নিচে পড়ুন। ক্রমানুসারে দেখুন: (১) estimated বনাম actual রো, (২) শুরুতেই মোটা তীর, (৩) seek-এর জায়গায় scan, (৪) বেশি সংখ্যক key lookup, (৫) Sort, (৬) tempdb spill সতর্কতা, (৭) implicit conversion সতর্কতা।",
        code: `SET STATISTICS IO, TIME ON;     -- logical reads and CPU/elapsed per statement
GO
SELECT a.BranchId, COUNT(*) AS Txns, SUM(t.Amount) AS Total
FROM   dbo.Transactions AS t
JOIN   dbo.Accounts     AS a ON a.AccountId = t.AccountId
WHERE  t.TxnDate >= '2026-01-01' AND t.TxnDate < '2026-02-01'
GROUP BY a.BranchId;
GO
SET STATISTICS IO, TIME OFF;

-- Get the actual plan as XML without SSMS
SET STATISTICS XML ON;`,
        notes: [
          {
            type: "tip",
            en: "Ignore operator cost percentages — they come from the same (possibly wrong) estimates. Trust logical reads and actual row counts.",
            bn: "Operator-এর cost শতাংশ উপেক্ষা করুন — সেগুলো একই (হয়তো ভুল) estimate থেকে আসে। Logical reads আর actual রো সংখ্যায় ভরসা করুন।",
          },
        ],
      },
      {
        title: "SARGability",
        titleBn: "SARGability — index ব্যবহারযোগ্য শর্ত",
        en: "A predicate is SARGable (Search ARGument-able) if it can seek an index. One rule: the column must appear ALONE on one side of the operator. A function, arithmetic, or type conversion on the column means the engine must compute it for every row → scan.",
        bn: "যে শর্ত index seek করতে পারে সেটা SARGable। একটাই নিয়ম: কলাম অপারেটরের এক পাশে একা থাকবে। কলামের উপর ফাংশন, গণিত বা টাইপ কনভার্সন থাকলে প্রতিটি রো-তে হিসাব করতে হয় → scan।",
        code: `-- WHERE-clause fragments: each SCAN line is followed by its SEEK rewrite
-- 1. Function on the column
WHERE YEAR(TxnDate) = 2026                                          -- SCAN
WHERE TxnDate >= '2026-01-01' AND TxnDate < '2027-01-01'            -- SEEK

-- 2. Arithmetic on the column
WHERE Balance * 1.05 > 100000                                       -- SCAN
WHERE Balance > 100000 / 1.05                                       -- SEEK

-- 3. Stripping the time
WHERE CAST(TxnDate AS DATE) = '2026-07-16'                          -- works, but...
WHERE TxnDate >= '2026-07-16' AND TxnDate < '2026-07-17'            -- SEEK, always

-- 4. Leading wildcard
WHERE FullName LIKE '%Rahman'                                       -- SCAN
WHERE FullName LIKE 'Rahman%'                                       -- SEEK

-- 5. Implicit conversion (AccountNumber is CHAR(13))
WHERE AccountNumber = N'1001000000001'                              -- SCAN
WHERE AccountNumber = '1001000000001'                               -- SEEK

-- 6. ISNULL wrapper
WHERE ISNULL(ClosedOn, '9999-12-31') > GETDATE()                    -- SCAN
WHERE ClosedOn > GETDATE() OR ClosedOn IS NULL                      -- SEEK`,
      },
      {
        title: "Indexing an expression (computed column)",
        titleBn: "Expression-এ Index (Computed Column)",
        en: "When you cannot change the query text (a legacy app sends WHERE UPPER(Email) = @x), add a PERSISTED computed column with the same expression and index it. The optimizer matches the expression to the column automatically.",
        bn: "Query বদলানো না গেলে (পুরনো অ্যাপ WHERE UPPER(Email) = @x পাঠায়), একই expression দিয়ে PERSISTED computed column বানিয়ে index দিন। Optimizer নিজেই expression-টা কলামের সাথে মিলিয়ে নেয়।",
        code: `ALTER TABLE dbo.Customers ADD EmailUpper AS UPPER(Email) PERSISTED;
CREATE INDEX IX_Customers_EmailUpper ON dbo.Customers (EmailUpper);

-- Unchanged application query now seeks the new index
SELECT CustomerId FROM dbo.Customers WHERE UPPER(Email) = N'RAHIM@EXAMPLE.COM';`,
      },
      {
        title: "Parameter sniffing",
        titleBn: "Parameter Sniffing — প্রথম মানের plan",
        en: "On first execution SQL Server 'sniffs' the parameter, builds a plan perfect for that value, and caches it. Sylhet (300 rows) → nested loops + lookups, ideal. Then Dhaka (180,000 rows) reuses it → 180,000 key lookups. Fixes: OPTION (RECOMPILE), OPTIMIZE FOR (@City = …), OPTIMIZE FOR UNKNOWN, split into sub-procedures, or force a good plan in Query Store.",
        bn: "প্রথমবার চালানোর সময় SQL Server parameter 'শুঁকে' দেখে, সেই মানের জন্য সেরা plan বানিয়ে cache করে। Sylhet (৩০০ রো) → nested loops, আদর্শ। তারপর Dhaka (১,৮০,০০০ রো) একই plan পায় → ১,৮০,০০০ key lookup। সমাধান: OPTION (RECOMPILE), OPTIMIZE FOR, OPTIMIZE FOR UNKNOWN, procedure ভাগ করা, বা Query Store-এ ভালো plan force করা।",
        code: `CREATE OR ALTER PROCEDURE dbo.usp_AccountsByCity @City NVARCHAR(60)
AS
SELECT a.AccountId, a.Balance
FROM   dbo.Accounts  AS a
JOIN   dbo.Customers AS c ON c.CustomerId = a.CustomerId
WHERE  c.City = @City;
GO
EXEC dbo.usp_AccountsByCity N'Sylhet';   -- small: plan cached for small
EXEC dbo.usp_AccountsByCity N'Dhaka';    -- big: reuses the small plan

-- Fix options (pick one):
--   ... WHERE c.City = @City OPTION (RECOMPILE);
--   ... WHERE c.City = @City OPTION (OPTIMIZE FOR (@City = N'Dhaka'));
--   ... WHERE c.City = @City OPTION (OPTIMIZE FOR UNKNOWN);

-- Emergency: throw away the cached plan
EXEC sys.sp_recompile N'dbo.usp_AccountsByCity';`,
        notes: [
          {
            type: "interview",
            q: "A procedure ran fine for a year; this morning it's 100x slower. No code or data change. Why?",
            en: "The plan cache was flushed (restart, failover, memory pressure, stats update) and the procedure recompiled with an atypical first parameter. Classic parameter sniffing. Mitigate with sp_recompile or force the known-good plan in Query Store.",
            bn: "Plan cache মুছে গেছে (রিস্টার্ট, failover, memory চাপ, stats update) আর প্রথম আসা অস্বাভাবিক parameter দিয়ে procedure আবার compile হয়েছে। ক্লাসিক parameter sniffing। sp_recompile বা Query Store-এ ভালো plan force করুন।",
          },
        ],
      },
      {
        title: "Query Store",
        titleBn: "Query Store — ফ্লাইট রেকর্ডার",
        en: "Query Store (2016+) is the flight recorder: it keeps query texts, plans and runtime stats over time. Find regressions after a deployment and pin a known-good plan without changing code.",
        bn: "Query Store (2016+) হলো ফ্লাইট রেকর্ডার: সময়ের সাথে query, plan আর runtime stats রাখে। ডিপ্লয়মেন্টের পর কোন query খারাপ হলো খুঁজুন, কোড না বদলেই ভালো plan pin করুন।",
        code: `ALTER DATABASE BankDB SET QUERY_STORE = ON
    (OPERATION_MODE = READ_WRITE, QUERY_CAPTURE_MODE = AUTO);

-- Slowest queries and their plans
SELECT TOP (20) q.query_id, t.query_sql_text,
       rs.avg_duration / 1000.0 AS AvgMs,
       rs.avg_logical_io_reads, rs.count_executions, p.plan_id
FROM   sys.query_store_query         AS q
JOIN   sys.query_store_query_text    AS t  ON t.query_text_id = q.query_text_id
JOIN   sys.query_store_plan          AS p  ON p.query_id      = q.query_id
JOIN   sys.query_store_runtime_stats AS rs ON rs.plan_id      = p.plan_id
ORDER BY rs.avg_duration DESC;

-- Pin the plan you know is good
EXEC sys.sp_query_store_force_plan @query_id = 42, @plan_id = 17;`,
      },
    ],
    summary: [
      {
        en: "Read plans right-to-left; check estimated vs actual first.",
        bn: "Plan ডান থেকে বামে পড়ুন; আগে estimated বনাম actual।",
      },
      {
        en: "Keep the column alone in the predicate.",
        bn: "শর্তে কলামকে একা রাখুন।",
      },
      {
        en: "Sniffing: RECOMPILE / OPTIMIZE FOR / Query Store.",
        bn: "Sniffing-এর সমাধান: RECOMPILE / OPTIMIZE FOR / Query Store।",
      },
    ],
  },

  {
    id: 23,
    slug: "optimization-case-studies",
    part: 4,
    level: "Advanced",
    title: "Optimization Case Studies",
    titleBn: "Optimization কেস স্টাডি",
    analogy: {
      en: "Six real hospital cases: symptom → diagnosis → treatment → lesson. Learn the pattern, not just the cure.",
      bn: "ছয়টি বাস্তব রোগীর কেস: লক্ষণ → রোগনির্ণয় → চিকিৎসা → শিক্ষা। শুধু ওষুধ নয়, প্যাটার্ন শিখুন।",
    },
    sections: [
      {
        title: "Case 1: The date function scan",
        titleBn: "কেস ১: Date ফাংশনের scan",
        en: "Symptom: a daily report takes 4 minutes; STATISTICS IO shows 812,000 reads for 40,000 rows. Diagnosis: YEAR()/MONTH() wrap TxnDate → clustered index scan of 60M rows. Fix: half-open date range + covering index. Result: 812,000 reads → 1,900; 4 minutes → 2 seconds. Lesson: look for functions on columns first.",
        bn: "লক্ষণ: দৈনিক রিপোর্টে ৪ মিনিট; ৪০,০০০ রো-র জন্য ৮,১২,০০০ read। রোগ: YEAR()/MONTH() TxnDate-কে মুড়ে রেখেছে → ৬ কোটি রো scan। চিকিৎসা: half-open তারিখ রেঞ্জ + covering index। ফল: ৮,১২,০০০ → ১,৯০০ read; ৪ মিনিট → ২ সেকেন্ড। শিক্ষা: আগে কলামের উপর ফাংশন খুঁজুন।",
        code: `-- BEFORE
SELECT a.BranchId, COUNT(*) AS Txns, SUM(t.Amount) AS Total
FROM   dbo.Transactions AS t
JOIN   dbo.Accounts     AS a ON a.AccountId = t.AccountId
WHERE  YEAR(t.TxnDate) = 2026 AND MONTH(t.TxnDate) = 7
GROUP BY a.BranchId;

-- AFTER
CREATE NONCLUSTERED INDEX IX_Txn_Date_Account
    ON dbo.Transactions (TxnDate) INCLUDE (AccountId, Amount);

SELECT a.BranchId, COUNT(*) AS Txns, SUM(t.Amount) AS Total
FROM   dbo.Transactions AS t
JOIN   dbo.Accounts     AS a ON a.AccountId = t.AccountId
WHERE  t.TxnDate >= '2026-07-01' AND t.TxnDate < '2026-08-01'
GROUP BY a.BranchId;`,
      },
      {
        title: "Case 2: The correlated subquery in the SELECT list",
        titleBn: "কেস ২: SELECT-এ correlated subquery",
        en: "Symptom: a customer dashboard takes 90 seconds. Diagnosis: three correlated subqueries per customer = 750,000 executions, one touching Transactions each time. Fix: aggregate once per table into CTEs, then LEFT JOIN. 90s → 3s. Note the COALESCE: a correlated COUNT(*) returned 0, but a LEFT JOIN returns NULL — diff the results with EXCEPT.",
        bn: "লক্ষণ: কাস্টমার ড্যাশবোর্ডে ৯০ সেকেন্ড। রোগ: প্রতি কাস্টমারে তিনটি correlated subquery = ৭,৫০,০০০ বার চালানো। চিকিৎসা: প্রতিটি টেবিল একবার aggregate করে CTE, তারপর LEFT JOIN। ৯০ → ৩ সেকেন্ড। COALESCE খেয়াল করুন: আগে COUNT(*) 0 দিত, LEFT JOIN দেয় NULL — EXCEPT দিয়ে ফলাফল মিলিয়ে নিন।",
        code: `-- BEFORE
SELECT c.CustomerId, c.FullName,
       (SELECT COUNT(*)       FROM dbo.Accounts a WHERE a.CustomerId = c.CustomerId) AS AccountCount,
       (SELECT SUM(a.Balance) FROM dbo.Accounts a WHERE a.CustomerId = c.CustomerId) AS TotalBalance,
       (SELECT MAX(t.TxnDate) FROM dbo.Transactions t
        JOIN dbo.Accounts a ON a.AccountId = t.AccountId
        WHERE a.CustomerId = c.CustomerId) AS LastTxnDate
FROM   dbo.Customers AS c;

-- AFTER: one pass per table
WITH AccountAgg AS (
    SELECT a.CustomerId, COUNT(*) AS AccountCount, SUM(a.Balance) AS TotalBalance
    FROM   dbo.Accounts AS a
    GROUP BY a.CustomerId
),
LastTxn AS (
    SELECT a.CustomerId, MAX(t.TxnDate) AS LastTxnDate
    FROM   dbo.Transactions AS t
    JOIN   dbo.Accounts     AS a ON a.AccountId = t.AccountId
    GROUP BY a.CustomerId
)
SELECT c.CustomerId, c.FullName,
       COALESCE(ag.AccountCount, 0) AS AccountCount,
       ag.TotalBalance,
       lt.LastTxnDate
FROM   dbo.Customers AS c
LEFT   JOIN AccountAgg AS ag ON ag.CustomerId = c.CustomerId
LEFT   JOIN LastTxn    AS lt ON lt.CustomerId = c.CustomerId;`,
      },
      {
        title: "Case 3: The implicit conversion",
        titleBn: "কেস ৩: Implicit Conversion",
        en: "Symptom: a login lookup on a unique indexed column takes 800 ms. Diagnosis: Index Scan + CONVERT_IMPLICIT. The app sent @nid as NVARCHAR (AddWithValue infers NVARCHAR) but NationalId is VARCHAR(20). Fix: declare the parameter with the column's exact type. 800 ms → 1 ms.",
        bn: "লক্ষণ: ইউনিক index-যুক্ত কলামে লগইন খুঁজতে ৮০০ ms। রোগ: Index Scan + CONVERT_IMPLICIT। অ্যাপ @nid পাঠিয়েছে NVARCHAR হিসেবে (AddWithValue নিজে NVARCHAR ধরে), কিন্তু NationalId হলো VARCHAR(20)। চিকিৎসা: কলামের ঠিক টাইপে parameter ঘোষণা। ৮০০ ms → ১ ms।",
        code: `-- What the app sent (SCAN + CONVERT_IMPLICIT)
EXEC sys.sp_executesql
     N'SELECT CustomerId FROM dbo.Customers WHERE NationalId = @nid',
     N'@nid NVARCHAR(4000)', @nid = N'1990123456';

-- What it should send (SEEK)
EXEC sys.sp_executesql
     N'SELECT CustomerId FROM dbo.Customers WHERE NationalId = @nid',
     N'@nid VARCHAR(20)', @nid = '1990123456';

-- Find plans in cache that contain implicit conversions
SELECT TOP (20) st.text, qp.query_plan
FROM   sys.dm_exec_query_stats AS qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle)      AS st
CROSS APPLY sys.dm_exec_query_plan(qs.plan_handle)   AS qp
WHERE  CAST(qp.query_plan AS NVARCHAR(MAX)) LIKE N'%CONVERT_IMPLICIT%';`,
      },
      {
        title: "Case 4: The N+1 endpoint",
        titleBn: "কেস ৪: N+1 endpoint",
        en: "Symptom: an API endpoint takes 6 seconds, but the slowest query is 0.4 ms. That IS the tell: 3,000 tiny queries × 2 ms round trip. Fix: one projected query (or an explicit join). Detect it by counting statements per request, not by query duration.",
        bn: "লক্ষণ: API endpoint-এ ৬ সেকেন্ড, অথচ সবচেয়ে ধীর query মাত্র ০.৪ ms। এটাই সংকেত: ৩০০০টি ছোট query × ২ ms round trip। চিকিৎসা: একটি projected query (বা explicit join)। সময় নয়, প্রতি request-এ statement গুনে ধরুন।",
        code: `-- Count how often the same statement shape ran recently
SELECT TOP (10) qs.execution_count, qs.total_elapsed_time / 1000 AS TotalMs,
       SUBSTRING(st.text, 1, 200) AS QueryText
FROM   sys.dm_exec_query_stats AS qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) AS st
ORDER BY qs.execution_count DESC;

-- The single query that replaces N+1
SELECT c.CustomerId, c.FullName, COUNT(a.AccountId) AS AccountCount
FROM   dbo.Customers AS c
LEFT   JOIN dbo.Accounts AS a ON a.CustomerId = c.CustomerId
WHERE  c.City = N'Dhaka'
GROUP BY c.CustomerId, c.FullName;`,
      },
      {
        title: "Case 5: The OFFSET death march",
        titleBn: "কেস ৫: OFFSET-এর মৃত্যুযাত্রা",
        en: "Symptom: page 1 is instant, page 4,000 takes 12 seconds. Diagnosis: OFFSET 79980 still reads, sorts and discards 79,980 rows — linear cost. Fix: keyset pagination. Lesson: nobody reads page 4,000 — they want an export; give them one.",
        bn: "লক্ষণ: ১ম পেজ তাৎক্ষণিক, ৪০০০তম পেজে ১২ সেকেন্ড। রোগ: OFFSET 79980 তবুও ৭৯,৯৮০ রো পড়ে, সাজায়, ফেলে দেয় — রৈখিক খরচ। চিকিৎসা: keyset pagination। শিক্ষা: কেউ ৪০০০তম পেজ পড়ে না — তারা export চায়; সেটা দিন।",
        code: `-- BEFORE: cost grows with page number
SELECT TxnId, TxnDate, Amount
FROM   dbo.Transactions
ORDER BY TxnDate DESC, TxnId DESC
OFFSET 79980 ROWS FETCH NEXT 20 ROWS ONLY;

-- AFTER: keyset — pass the last row of the previous page
DECLARE @LastDate DATETIME2(3) = '2026-02-01T09:10:00', @LastId BIGINT = 4;
SELECT TOP (20) TxnId, TxnDate, Amount
FROM   dbo.Transactions
WHERE  TxnDate < @LastDate
   OR (TxnDate = @LastDate AND TxnId < @LastId)
ORDER BY TxnDate DESC, TxnId DESC;`,
      },
      {
        title: "Case 6: The over-indexed table",
        titleBn: "কেস ৬: অতিরিক্ত Index-যুক্ত টেবিল",
        en: "Symptom: batch inserts dropped from 40,000 to 6,000 rows/second over 18 months. Diagnosis: 14 nonclustered indexes, 9 with zero seeks and millions of updates — every insert wrote 15 times. Fix: drop unused indexes and consolidate overlapping ones ((AccountId), (AccountId, TxnDate), and the same key + INCLUDE are all served by the last). Throughput back to 38,000/s.",
        bn: "লক্ষণ: ১৮ মাসে batch insert ৪০,০০০ থেকে ৬,০০০ রো/সেকেন্ডে নেমেছে। রোগ: ১৪টি nonclustered index, ৯টিতে শূন্য seek কিন্তু লাখো update — প্রতিটি insert ১৫ বার লিখত। চিকিৎসা: অব্যবহৃত index মুছুন, একই ধরনের index একত্র করুন। গতি ফিরে ৩৮,০০০/সেকেন্ড।",
        code: `-- Overlapping indexes: the last one serves all three
-- (AccountId)
-- (AccountId, TxnDate)
-- (AccountId, TxnDate) INCLUDE (Amount)

DROP INDEX IF EXISTS IX_Txn_Account_Date ON dbo.Transactions;   -- covered by the INCLUDE version

-- Disable instead of drop if you want an easy way back
-- ALTER INDEX IX_Some_Unused ON dbo.Transactions DISABLE;`,
        notes: [
          {
            type: "key",
            en: "Indexes are not free and not forever. Audit usage stats quarterly; an index not seeked in a month is costing you money.",
            bn: "Index বিনামূল্যে নয়, চিরস্থায়ীও নয়। প্রতি তিন মাসে usage stats দেখুন; এক মাস seek না হওয়া index আপনার টাকা খরচ করছে।",
          },
        ],
      },
      {
        title: "The tuning method",
        titleBn: "টিউনিং পদ্ধতি",
        en: "1 Measure — find the real slow query (Query Store, sys.dm_exec_query_stats). 2 Get the actual plan with STATISTICS IO, TIME. 3 Compare estimated vs actual rows. 4 Look for the big three: functions on columns, missing/wrong indexes, row-by-row processing. 5 Change ONE thing and re-measure. 6 Verify correctness with EXCEPT both ways. 7 Document why.",
        bn: "১ মাপুন — আসল ধীর query খুঁজুন (Query Store, sys.dm_exec_query_stats)। ২ STATISTICS IO, TIME সহ actual plan নিন। ৩ Estimated বনাম actual রো তুলনা। ৪ বড় তিনটি খুঁজুন: কলামে ফাংশন, ভুল/অনুপস্থিত index, রো-বাই-রো প্রসেসিং। ৫ একবারে একটাই বদলান, আবার মাপুন। ৬ দুই দিকে EXCEPT দিয়ে সঠিকতা যাচাই। ৭ কেন করলেন লিখে রাখুন।",
        code: `-- Step 1: top CPU consumers right now
SELECT TOP (10)
       qs.total_worker_time / qs.execution_count / 1000 AS AvgCpuMs,
       qs.total_logical_reads / qs.execution_count      AS AvgReads,
       qs.execution_count,
       SUBSTRING(st.text, (qs.statement_start_offset / 2) + 1,
                 ((CASE qs.statement_end_offset WHEN -1 THEN DATALENGTH(st.text)
                   ELSE qs.statement_end_offset END - qs.statement_start_offset) / 2) + 1) AS StatementText
FROM   sys.dm_exec_query_stats AS qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) AS st
ORDER BY qs.total_worker_time DESC;`,
      },
    ],
    summary: [
      {
        en: "Functions on columns, missing indexes, RBAR — the big three.",
        bn: "কলামে ফাংশন, অনুপস্থিত index, RBAR — বড় তিনটি।",
      },
      {
        en: "Slow endpoint + fast queries = count the queries.",
        bn: "ধীর endpoint + দ্রুত query = query গুনুন।",
      },
      {
        en: "Change one thing, measure, verify, document.",
        bn: "একটা বদলান, মাপুন, যাচাই করুন, লিখে রাখুন।",
      },
    ],
  },

  {
    id: 24,
    slug: "normalization-anti-patterns",
    part: 5,
    level: "Intermediate",
    title: "Normalization and Anti-Patterns",
    titleBn: "Normalization এবং Anti-Pattern",
    analogy: {
      en: "Normalization is keeping one fact in one place — like having one official address register instead of writing your address in every form, where copies drift apart.",
      bn: "Normalization মানে একটি তথ্য এক জায়গায় রাখা — প্রতিটি ফর্মে ঠিকানা না লিখে একটি অফিসিয়াল রেজিস্টার রাখা, নইলে কপিগুলো আলাদা হয়ে যায়।",
    },
    sections: [
      {
        title: "Normal forms, practically",
        titleBn: "Normal Form — ব্যবহারিকভাবে",
        en: "1NF: one atomic value per column (no 'acc1,acc2', no Phone1/Phone2/Phone3). 2NF: every non-key column depends on the WHOLE key (matters with composite keys). 3NF: no non-key column depends on another non-key column (BranchCity on Accounts violates it). 'The key, the whole key, and nothing but the key.' 3NF is the OLTP default.",
        bn: "1NF: প্রতি কলামে একটি মাত্র মান ('acc1,acc2' বা Phone1/Phone2/Phone3 নয়)। 2NF: প্রতিটি non-key কলাম পুরো key-এর উপর নির্ভর করবে (composite key-তে দরকার)। 3NF: কোনো non-key কলাম অন্য non-key কলামের উপর নির্ভর করবে না (Accounts-এ BranchCity রাখা ভুল)। OLTP-তে 3NF ডিফল্ট।",
        code: `-- 3NF violation: City depends on BranchId, not on AccountId
-- ALTER TABLE dbo.Accounts ADD BranchCity NVARCHAR(60);   -- don't

-- 3NF: get the city through the relationship
SELECT a.AccountNumber, b.City AS BranchCity
FROM   dbo.Accounts AS a
JOIN   dbo.Branches AS b ON b.BranchId = a.BranchId;`,
      },
      {
        title: "Denormalize deliberately, or not at all",
        titleBn: "সচেতনভাবে Denormalize করুন, নইলে নয়",
        en: "Accounts.Balance duplicates SUM(transactions) — legitimate, because summing 60M rows per ATM request is impossible. The price: every write path updates it in the same transaction, a reconciliation job detects drift, and the row becomes a concurrency hotspot.",
        bn: "Accounts.Balance লেনদেনের যোগফলের কপি — বৈধ, কারণ প্রতি ATM অনুরোধে ৬ কোটি রো যোগ করা অসম্ভব। মূল্য: প্রতিটি write একই transaction-এ এটা আপডেট করবে, একটি reconciliation job গরমিল ধরবে, আর রো-টি concurrency hotspot হবে।",
        code: `-- Reconciliation: stored balance vs computed balance
SELECT a.AccountId, a.Balance AS StoredBalance,
       COALESCE(SUM(CASE WHEN t.TxnType = 'CREDIT' THEN t.Amount ELSE -t.Amount END), 0) AS ComputedBalance
FROM   dbo.Accounts AS a
LEFT   JOIN dbo.Transactions AS t ON t.AccountId = a.AccountId
GROUP BY a.AccountId, a.Balance
HAVING a.Balance <> COALESCE(SUM(CASE WHEN t.TxnType = 'CREDIT' THEN t.Amount ELSE -t.Amount END), 0);`,
        notes: [
          {
            type: "trap",
            en: "Denormalization without (a) a maintaining transaction and (b) a reconciliation process is a data-corruption schedule. It shows up in an auditor's report, not in testing.",
            bn: "(ক) রক্ষণাবেক্ষণকারী transaction এবং (খ) reconciliation প্রক্রিয়া ছাড়া denormalization মানে ডেটা নষ্টের সময়সূচি। টেস্টে ধরা পড়ে না, অডিটরের রিপোর্টে পড়ে।",
          },
        ],
      },
      {
        title: "Anti-pattern: Entity-Attribute-Value (EAV)",
        titleBn: "Anti-pattern: EAV — নমনীয়তার ফাঁদ",
        en: "'Fully flexible, no migrations!' — but no types, no constraints, no FKs, no useful index, and every filter needs a self-join per attribute. Defensible only for truly user-defined attributes read by key. Otherwise use columns, or a JSON column with a computed index.",
        bn: "'সম্পূর্ণ নমনীয়, migration লাগে না!' — কিন্তু টাইপ নেই, constraint নেই, FK নেই, কাজের index নেই, আর প্রতিটি ফিল্টারে প্রতি attribute-এ self-join। শুধু সত্যিকারের ইউজার-নির্ধারিত attribute-এর জন্য চলে। নইলে কলাম, বা computed index-সহ JSON কলাম।",
        code: `-- The schema that eats teams
CREATE TABLE dbo.CustomerAttributes (
    CustomerId     INT,
    AttributeName  VARCHAR(50),
    AttributeValue VARCHAR(500)
);
-- "Customers in Dhaka with verified KYC" needs a self-join per attribute:
SELECT c.CustomerId
FROM   dbo.CustomerAttributes AS c
JOIN   dbo.CustomerAttributes AS k ON k.CustomerId = c.CustomerId
WHERE  c.AttributeName = 'City' AND c.AttributeValue = 'Dhaka'
  AND  k.AttributeName = 'Kyc'  AND k.AttributeValue = 'VERIFIED';`,
      },
      {
        title: "Anti-patterns: CSV columns, polymorphic links, god tables",
        titleBn: "Anti-pattern: CSV কলাম, Polymorphic লিংক, God Table",
        en: "AccountIds = '1001,1002' breaks 1NF: no index, no FK, and LIKE '%1002%' matches '11002' — it was always a junction table. OwnerId + OwnerType pointing at different tables cannot have an FK → orphans; use two nullable FKs with a CHECK that exactly one is set. A 90-column god table full of NULLs hides missing tables.",
        bn: "AccountIds = '1001,1002' 1NF ভাঙে: index নেই, FK নেই, আর LIKE '%1002%' '11002'-কেও মেলায় — এটা আসলে junction table। OwnerId + OwnerType দিয়ে ভিন্ন টেবিল দেখালে FK হয় না → অনাথ রো; দুটি nullable FK আর ঠিক একটি সেট থাকবে এমন CHECK দিন। NULL-ভরা ৯০ কলামের god table মানে লুকানো আলাদা টেবিল।",
        code: `-- Junction table instead of a CSV column
CREATE TABLE dbo.CustomerAccountLinks (
    CustomerId INT    NOT NULL REFERENCES dbo.Customers(CustomerId),
    AccountId  BIGINT NOT NULL REFERENCES dbo.Accounts(AccountId),
    CONSTRAINT PK_CustomerAccountLinks PRIMARY KEY (CustomerId, AccountId)
);

-- Polymorphic association done safely
CREATE TABLE dbo.Notes (
    NoteId     INT IDENTITY PRIMARY KEY,
    CustomerId INT NULL REFERENCES dbo.Customers(CustomerId),
    EmployeeId INT NULL REFERENCES dbo.Employees(EmployeeId),
    Body       NVARCHAR(400) NOT NULL,
    CONSTRAINT CK_Notes_OneOwner CHECK (
        (CustomerId IS NOT NULL AND EmployeeId IS NULL) OR
        (CustomerId IS NULL     AND EmployeeId IS NOT NULL))
);`,
      },
      {
        title: "Anti-patterns: FLOAT money, string dates, no foreign keys",
        titleBn: "Anti-pattern: FLOAT টাকা, স্ট্রিং তারিখ, FK না রাখা",
        en: "'16/07/2026' in a VARCHAR cannot be sorted or range-scanned and is ambiguous with '07/16/2026'. FLOAT money rounds. Skipping FKs 'for performance' saves almost nothing and guarantees orphan rows; FKs also let the optimizer remove unneeded joins.",
        bn: "VARCHAR-এ '16/07/2026' সাজানো বা রেঞ্জে খোঁজা যায় না, '07/16/2026'-এর সাথে বিভ্রান্তি হয়। FLOAT টাকা রাউন্ড হয়। 'পারফরম্যান্সের জন্য' FK বাদ দিলে প্রায় কিছুই বাঁচে না, কিন্তু অনাথ রো নিশ্চিত; FK থাকলে optimizer অপ্রয়োজনীয় join বাদও দিতে পারে।",
        code: `-- Find orphans that a missing FK allowed (example check)
SELECT t.TxnId
FROM   dbo.Transactions AS t
WHERE  NOT EXISTS (SELECT 1 FROM dbo.Accounts AS a WHERE a.AccountId = t.AccountId);

-- Make sure existing FKs are trusted (optimizer only uses trusted ones)
SELECT name, is_not_trusted FROM sys.foreign_keys;
ALTER TABLE dbo.Transactions WITH CHECK CHECK CONSTRAINT FK_Txn_Account;`,
        notes: [
          {
            type: "interview",
            q: "When would you denormalize?",
            en: "Name a specific read path that cannot meet its SLA normalized, quantify read/write ratio, and explain how the copy is maintained and reconciled. 'For performance' alone is a weak answer.",
            bn: "এমন নির্দিষ্ট read path বলুন যা normalized অবস্থায় SLA পূরণ করে না, read/write অনুপাত বলুন, আর কপিটা কীভাবে রক্ষণাবেক্ষণ ও মেলানো হবে ব্যাখ্যা করুন। শুধু 'পারফরম্যান্সের জন্য' দুর্বল উত্তর।",
          },
        ],
      },
      {
        title: "Practical design rules",
        titleBn: "ব্যবহারিক ডিজাইন নিয়ম",
        en: "1 Every table gets a primary key. 2 Model relationships with foreign keys. 3 Normalize to 3NF first; denormalize later with evidence. 4 Constrain what must be true (CHECK, UNIQUE, NOT NULL). 5 Name consistently (FK_Accounts_Customers). 6 Store timestamps in UTC; DATETIMEOFFSET when you need the offset. 7 Avoid soft-delete flags that every query must remember; prefer an archive table or filtered index. 8 Design the write path for correctness and the read path for speed.",
        bn: "১ প্রতিটি টেবিলে primary key। ২ সম্পর্ক foreign key দিয়ে। ৩ আগে 3NF; প্রমাণসহ পরে denormalize। ৪ যা সত্য হতেই হবে তা constraint দিয়ে (CHECK, UNIQUE, NOT NULL)। ৫ নামকরণে ধারাবাহিকতা। ৬ সময় UTC-তে; offset লাগলে DATETIMEOFFSET। ৭ প্রতিটি query-তে মনে রাখতে হয় এমন soft-delete ফ্ল্যাগ এড়িয়ে archive table বা filtered index। ৮ Write path সঠিকতার জন্য, read path গতির জন্য।",
        code: `-- Temporal table: history without trigger code (SQL Server 2016+)
CREATE TABLE dbo.InterestRates (
    ProductCode  VARCHAR(10)  NOT NULL PRIMARY KEY,
    Rate         DECIMAL(5,2) NOT NULL,
    ValidFrom    DATETIME2(3) GENERATED ALWAYS AS ROW START NOT NULL,
    ValidTo      DATETIME2(3) GENERATED ALWAYS AS ROW END   NOT NULL,
    PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
) WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.InterestRatesHistory));

-- What was the rate on a past date?
SELECT * FROM dbo.InterestRates FOR SYSTEM_TIME AS OF '2026-01-01';`,
      },
    ],
    summary: [
      {
        en: "Key, whole key, nothing but the key — 3NF by default.",
        bn: "Key, পুরো key, শুধু key — ডিফল্ট 3NF।",
      },
      {
        en: "Denormalize only with a maintaining transaction and reconciliation.",
        bn: "রক্ষণাবেক্ষণ transaction ও reconciliation থাকলেই denormalize।",
      },
      {
        en: "Use real types and real foreign keys.",
        bn: "আসল টাইপ আর আসল foreign key ব্যবহার করুন।",
      },
    ],
  },

  {
    id: 25,
    slug: "interview-exercises",
    part: 5,
    level: "Advanced",
    title: "Interview Preparation and Exercises",
    titleBn: "ইন্টারভিউ প্রস্তুতি ও অনুশীলন",
    analogy: {
      en: "Interviewers don't test memorised syntax; they test method: think in sets, read the plan, measure before and after.",
      bn: "ইন্টারভিউয়াররা মুখস্থ সিনট্যাক্স নয়, পদ্ধতি যাচাই করেন: সেটে ভাবা, plan পড়া, আগে ও পরে মাপা।",
    },
    sections: [
      {
        title: "DELETE vs TRUNCATE vs DROP",
        titleBn: "DELETE বনাম TRUNCATE বনাম DROP",
        en: "DELETE is DML: row-by-row, logged, WHERE-able, fires triggers. TRUNCATE is DDL: deallocates pages, minimal logging, no WHERE, no triggers, resets identity — and in SQL Server it CAN be rolled back. DROP removes the table itself.",
        bn: "DELETE হলো DML: রো-বাই-রো, log হয়, WHERE চলে, trigger চলে। TRUNCATE হলো DDL: পেজ ছেড়ে দেয়, কম log, WHERE নেই, trigger নেই, identity রিসেট — আর SQL Server-এ rollback করা যায়। DROP টেবিলটাই মুছে দেয়।",
        code: `BEGIN TRAN;
    TRUNCATE TABLE dbo.ArchivedTransactions;
    SELECT COUNT(*) AS AfterTruncate FROM dbo.ArchivedTransactions;   -- 0
ROLLBACK;
SELECT COUNT(*) AS AfterRollback FROM dbo.ArchivedTransactions;       -- rows are back`,
      },
      {
        title: "Second-highest value and duplicates",
        titleBn: "দ্বিতীয় সর্বোচ্চ মান এবং ডুপ্লিকেট",
        en: "Second-highest: MAX below the MAX, or DENSE_RANK = 2 (not RANK — a tie for first leaves no rank 2). Delete duplicates keeping the oldest: ROW_NUMBER in a CTE, DELETE WHERE rn > 1. GROUP BY … HAVING COUNT(*) > 1 only FINDS duplicates.",
        bn: "দ্বিতীয় সর্বোচ্চ: MAX-এর নিচের MAX, বা DENSE_RANK = 2 (RANK নয় — প্রথমে টাই হলে ২ নম্বর থাকে না)। পুরনোটা রেখে ডুপ্লিকেট মোছা: CTE-তে ROW_NUMBER, তারপর DELETE WHERE rn > 1। GROUP BY … HAVING COUNT(*) > 1 শুধু খুঁজে পায়।",
        code: `SELECT MAX(Balance) AS SecondHighest FROM dbo.Accounts
WHERE  Balance < (SELECT MAX(Balance) FROM dbo.Accounts);

-- Generalised to Nth
SELECT DISTINCT Balance FROM (
    SELECT Balance, DENSE_RANK() OVER (ORDER BY Balance DESC) AS rnk
    FROM   dbo.Accounts
) AS x WHERE rnk = 2;

-- Find duplicates
SELECT NationalId, COUNT(*) AS Copies
FROM   dbo.Customers GROUP BY NationalId HAVING COUNT(*) > 1;

-- Delete all but the oldest
WITH d AS (
    SELECT CustomerId,
           ROW_NUMBER() OVER (PARTITION BY NationalId ORDER BY CreatedAt) AS rn
    FROM   dbo.Customers
)
DELETE FROM d WHERE rn > 1;`,
        notes: [
          {
            type: "interview",
            q: "UNION vs UNION ALL — which is faster?",
            en: "UNION ALL: UNION must deduplicate with a sort or hash over the whole set. Nine out of ten UNIONs in production should be UNION ALL.",
            bn: "UNION ALL: UNION-কে পুরো সেটে sort বা hash করে ডুপ্লিকেট সরাতে হয়। Production-এর দশটির নয়টি UNION আসলে UNION ALL হওয়া উচিত।",
          },
          {
            type: "interview",
            q: "How do you make a slow query fast?",
            en: "Describe the method, not tricks: measure, actual plan, estimated vs actual, functions on columns / indexes / RBAR, change one thing, re-measure, verify with EXCEPT.",
            bn: "কৌশল নয়, পদ্ধতি বলুন: মাপা, actual plan, estimated বনাম actual, কলামে ফাংশন / index / RBAR, একটা বদলানো, আবার মাপা, EXCEPT দিয়ে যাচাই।",
          },
        ],
      },
      {
        title:
          "Exercise 1: Branches with active-account counts (zeros included)",
        titleBn: "অনুশীলন ১: শাখাভিত্তিক সক্রিয় অ্যাকাউন্ট (শূন্যসহ)",
        en: "Two traps in one: COUNT(*) would return 1 for an empty branch (the NULL-padded row is still a row) — use COUNT(a.AccountId). And a.Status = 'ACTIVE' in WHERE would turn the LEFT JOIN into an INNER JOIN — put it in ON.",
        bn: "এক প্রশ্নে দুই ফাঁদ: খালি শাখায় COUNT(*) 1 দেবে (NULL-ভরা রো-ও একটি রো) — COUNT(a.AccountId) ব্যবহার করুন। আর WHERE-এ a.Status = 'ACTIVE' দিলে LEFT JOIN হবে INNER JOIN — ON-এ দিন।",
        code: `SELECT b.BranchName,
       COUNT(a.AccountId) AS ActiveAccounts            -- COUNT(col) ignores NULLs
FROM   dbo.Branches AS b
LEFT   JOIN dbo.Accounts AS a
       ON a.BranchId = b.BranchId AND a.Status = 'ACTIVE'   -- filter in ON!
GROUP BY b.BranchName
ORDER BY ActiveAccounts DESC;`,
      },
      {
        title: "Exercise 2: Total balance and rank per customer",
        titleBn: "অনুশীলন ২: কাস্টমারভিত্তিক মোট ব্যালান্স ও র‍্যাংক",
        en: "Window functions run after GROUP BY (step 5 vs step 3), so you can rank an aggregate directly — no CTE needed.",
        bn: "Window function GROUP BY-এর পরে চলে (ধাপ ৫ বনাম ধাপ ৩), তাই সরাসরি aggregate-এর উপর র‍্যাংক করা যায় — CTE লাগে না।",
        code: `SELECT c.CustomerId, c.FullName,
       COALESCE(SUM(a.Balance), 0) AS TotalBalance,
       DENSE_RANK() OVER (ORDER BY COALESCE(SUM(a.Balance), 0) DESC) AS BalanceRank
FROM   dbo.Customers AS c
LEFT   JOIN dbo.Accounts AS a ON a.CustomerId = c.CustomerId
GROUP BY c.CustomerId, c.FullName;`,
      },
      {
        title: "Exercise 3: Velocity check — 5+ debits in any rolling 24 hours",
        titleBn: "অনুশীলন ৩: গতি যাচাই — যেকোনো ২৪ ঘণ্টায় ৫+ ডেবিট",
        en: "SQL Server window frames cannot use a time interval, so the T-SQL answer is CROSS APPLY: for each debit, count debits on the same account in the 24 hours ending at that debit.",
        bn: "SQL Server-এর window frame সময়-ব্যবধান নিতে পারে না, তাই T-SQL-এ উত্তর হলো CROSS APPLY: প্রতিটি ডেবিটের জন্য, ওই ডেবিট পর্যন্ত শেষ ২৪ ঘণ্টায় একই অ্যাকাউন্টের ডেবিট গোনা।",
        code: `SELECT DISTINCT t1.AccountId
FROM   dbo.Transactions AS t1
CROSS APPLY (
    SELECT COUNT(*) AS Cnt
    FROM   dbo.Transactions AS t2
    WHERE  t2.AccountId = t1.AccountId
      AND  t2.TxnType   = 'DEBIT'
      AND  t2.TxnDate   > DATEADD(HOUR, -24, t1.TxnDate)
      AND  t2.TxnDate  <= t1.TxnDate
) AS w
WHERE  t1.TxnType = 'DEBIT' AND w.Cnt >= 5;`,
      },
      {
        title: "Exercise 4: Running balance over the last 30 days",
        titleBn: "অনুশীলন ৪: শেষ ৩০ দিনের চলমান ব্যালান্স",
        en: "Credits add, debits subtract. Use ROWS (not the default RANGE) and TxnId as a tiebreaker, so two transactions in the same millisecond get different running totals.",
        bn: "Credit যোগ, Debit বিয়োগ। ROWS ব্যবহার করুন (ডিফল্ট RANGE নয়) আর TxnId দিয়ে tiebreak করুন, যাতে একই মিলিসেকেন্ডের দুটি লেনদেন আলাদা running total পায়।",
        code: `SELECT t.AccountId, t.TxnDate, t.Amount,
       SUM(CASE WHEN t.TxnType = 'CREDIT' THEN t.Amount ELSE -t.Amount END)
           OVER (PARTITION BY t.AccountId ORDER BY t.TxnDate, t.TxnId
                 ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningBalance
FROM   dbo.Transactions AS t
WHERE  t.TxnDate >= DATEADD(DAY, -30, GETDATE());`,
      },
      {
        title: "Exercise 5: Customers with an account but no transactions",
        titleBn: "অনুশীলন ৫: অ্যাকাউন্ট আছে কিন্তু লেনদেন নেই",
        en: "EXISTS for 'has an account' and NOT EXISTS for 'has never transacted'. In the sample data it returns Nusrat Jahan, whose account 4 has no transactions.",
        bn: "'অ্যাকাউন্ট আছে'-এর জন্য EXISTS আর 'কখনো লেনদেন করেনি'-এর জন্য NOT EXISTS। স্যাম্পল ডেটায় এটা Nusrat Jahan-কে দেখাবে (অ্যাকাউন্ট ৪-এ কোনো লেনদেন নেই)।",
        code: `SELECT c.CustomerId, c.FullName
FROM   dbo.Customers AS c
WHERE  EXISTS (SELECT 1 FROM dbo.Accounts AS a WHERE a.CustomerId = c.CustomerId)
  AND  NOT EXISTS (
         SELECT 1
         FROM   dbo.Accounts     AS a
         JOIN   dbo.Transactions AS t ON t.AccountId = a.AccountId
         WHERE  a.CustomerId = c.CustomerId);`,
      },
      {
        title: "Exercise 6: Management chain up to the CEO",
        titleBn: "অনুশীলন ৬: CEO পর্যন্ত ব্যবস্থাপনা চেইন",
        en: "A recursive CTE walking UP the tree: anchor = the employee, recursive member = the manager of the previous row.",
        bn: "Tree-তে উপরের দিকে হাঁটা recursive CTE: anchor = কর্মী নিজে, recursive member = আগের রো-এর ম্যানেজার।",
        code: `DECLARE @EmployeeId INT = 6;   -- Arif Hasan

WITH Chain AS (
    SELECT EmployeeId, FullName, Designation, ManagerId, 0 AS LevelUp
    FROM   dbo.Employees
    WHERE  EmployeeId = @EmployeeId
    UNION ALL
    SELECT m.EmployeeId, m.FullName, m.Designation, m.ManagerId, c.LevelUp + 1
    FROM   dbo.Employees AS m
    JOIN   Chain         AS c ON c.ManagerId = m.EmployeeId
)
SELECT LevelUp, FullName, Designation
FROM   Chain
ORDER BY LevelUp
OPTION (MAXRECURSION 50);`,
      },
      {
        title: "Exercise 7: Longest activity streak per account",
        titleBn: "অনুশীলন ৭: প্রতি অ্যাকাউন্টে দীর্ঘতম সক্রিয়তার ধারা",
        en: "Gaps-and-islands, then keep the longest island per account with ROW_NUMBER.",
        bn: "Gaps-and-islands, তারপর ROW_NUMBER দিয়ে প্রতি অ্যাকাউন্টে দীর্ঘতম island রাখা।",
        code: `WITH Daily AS (
    SELECT DISTINCT AccountId, CAST(TxnDate AS DATE) AS D
    FROM   dbo.Transactions
),
Islands AS (
    SELECT AccountId, D,
           DATEADD(DAY, -ROW_NUMBER() OVER (PARTITION BY AccountId ORDER BY D), D) AS grp
    FROM   Daily
),
Streaks AS (
    SELECT AccountId, COUNT(*) AS Len, MIN(D) AS StartD, MAX(D) AS EndD
    FROM   Islands
    GROUP BY AccountId, grp
)
SELECT AccountId, Len, StartD, EndD
FROM  (SELECT *, ROW_NUMBER() OVER (PARTITION BY AccountId ORDER BY Len DESC, StartD) AS rn
       FROM Streaks) AS x
WHERE  rn = 1;`,
      },
      {
        title: "Exercise 8: Month-over-month growth per branch",
        titleBn: "অনুশীলন ৮: শাখাভিত্তিক মাসিক প্রবৃদ্ধি",
        en: "Aggregate per month in a CTE, then compare with LAG. NULLIF guards the division: the first month has no previous value and a zero month would raise divide-by-zero.",
        bn: "CTE-তে মাসভিত্তিক aggregate, তারপর LAG দিয়ে তুলনা। NULLIF ভাগকে রক্ষা করে: প্রথম মাসের আগের মান নেই, আর শূন্য মাস থাকলে ০ দিয়ে ভাগের এরর হতো।",
        code: `WITH Monthly AS (
    SELECT a.BranchId,
           DATEFROMPARTS(YEAR(t.TxnDate), MONTH(t.TxnDate), 1) AS Mth,
           SUM(t.Amount) AS Total
    FROM   dbo.Transactions AS t
    JOIN   dbo.Accounts     AS a ON a.AccountId = t.AccountId
    GROUP BY a.BranchId, DATEFROMPARTS(YEAR(t.TxnDate), MONTH(t.TxnDate), 1)
)
SELECT BranchId, Mth, Total,
       LAG(Total) OVER (PARTITION BY BranchId ORDER BY Mth) AS PrevTotal,
       100.0 * (Total - LAG(Total) OVER (PARTITION BY BranchId ORDER BY Mth))
             / NULLIF(LAG(Total) OVER (PARTITION BY BranchId ORDER BY Mth), 0) AS GrowthPct
FROM   Monthly
ORDER BY BranchId, Mth;`,
      },
      {
        title: "What to study next",
        titleBn: "এরপর কী শিখবেন",
        en: "Partitioning (100M+ rows, sliding-window archival). Columnstore indexes (analytics on OLTP data, often 10x faster aggregates). Temporal tables (history without triggers). In-Memory OLTP (extreme contention on hot rows). Distributed consistency once data leaves one database.",
        bn: "Partitioning (১০ কোটি+ রো, sliding-window আর্কাইভ)। Columnstore index (OLTP ডেটায় analytics, প্রায়ই ১০ গুণ দ্রুত aggregate)। Temporal table (trigger ছাড়া ইতিহাস)। In-Memory OLTP (খুব ব্যস্ত রো)। ডেটা এক ডেটাবেসের বাইরে গেলে distributed consistency।",
        code: `-- Columnstore for analytics on the same OLTP table
CREATE NONCLUSTERED COLUMNSTORE INDEX NCCI_Transactions_Analytics
    ON dbo.Transactions (AccountId, TxnDate, TxnType, Channel, Amount);

SELECT Channel, TxnType, COUNT(*) AS Txns, SUM(Amount) AS Total
FROM   dbo.Transactions
GROUP BY Channel, TxnType;`,
        notes: [
          {
            type: "key",
            en: "Trusted database developers think in sets, open the actual plan before giving an opinion, know every index is a write tax, and measure before and after.",
            bn: "যাদের উপর ডেটাবেসের ভরসা রাখা হয় তারা সেটে ভাবেন, মতামত দেওয়ার আগে actual plan খোলেন, জানেন প্রতিটি index write-এর উপর কর, আর আগে-পরে মাপেন।",
          },
        ],
      },
    ],
    summary: [
      {
        en: "Explain the method, not a list of tricks.",
        bn: "কৌশলের তালিকা নয়, পদ্ধতি ব্যাখ্যা করুন।",
      },
      {
        en: "Practise all eight exercises against BankDB.",
        bn: "BankDB-তে আটটি অনুশীলনই করুন।",
      },
    ],
  },
];
