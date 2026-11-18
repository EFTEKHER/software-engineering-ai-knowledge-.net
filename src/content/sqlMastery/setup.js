// BankDB: the one schema used by every SQL Server Mastery module.
// Pure T-SQL (Microsoft SQL Server 2019+). Run it once in SSMS or Azure Data Studio.

export const bankDbSetup = `/* =========================================================
   BankDB setup script — SQL Server (T-SQL) only
   Run in SSMS / Azure Data Studio against SQL Server 2019+
   Re-running it RESETS BankDB to a clean state.
   ========================================================= */
USE master;
GO
IF DB_ID(N'BankDB') IS NOT NULL
BEGIN
    ALTER DATABASE BankDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE BankDB;
END
GO
CREATE DATABASE BankDB;
GO
USE BankDB;
GO

/* ---------- Core tables ---------- */
CREATE TABLE dbo.Branches (
    BranchId     INT           NOT NULL IDENTITY(1,1),
    BranchCode   CHAR(5)       NOT NULL,
    BranchName   NVARCHAR(100) NOT NULL,
    City         NVARCHAR(60)  NOT NULL,
    OpenedOn     DATE          NOT NULL,
    CONSTRAINT PK_Branches PRIMARY KEY CLUSTERED (BranchId),
    CONSTRAINT UQ_Branches_Code UNIQUE (BranchCode)
);

CREATE TABLE dbo.Employees (
    EmployeeId   INT           NOT NULL IDENTITY(1,1),
    BranchId     INT           NOT NULL,
    ManagerId    INT           NULL,          -- self-reference (CEO has none)
    FullName     NVARCHAR(120) NOT NULL,
    Designation  NVARCHAR(60)  NOT NULL,
    Salary       DECIMAL(12,2) NOT NULL,
    HiredOn      DATE          NOT NULL,
    CONSTRAINT PK_Employees PRIMARY KEY CLUSTERED (EmployeeId),
    CONSTRAINT FK_Emp_Branch  FOREIGN KEY (BranchId)  REFERENCES dbo.Branches(BranchId),
    CONSTRAINT FK_Emp_Manager FOREIGN KEY (ManagerId) REFERENCES dbo.Employees(EmployeeId),
    CONSTRAINT CK_Emp_Salary  CHECK (Salary > 0)
);

CREATE TABLE dbo.Customers (
    CustomerId   INT           NOT NULL IDENTITY(1,1),
    NationalId   VARCHAR(20)   NOT NULL,
    FullName     NVARCHAR(120) NOT NULL,
    Email        NVARCHAR(160) NULL,
    Phone        VARCHAR(20)   NULL,
    City         NVARCHAR(60)  NULL,
    KycStatus    VARCHAR(12)   NOT NULL CONSTRAINT DF_Customers_Kyc DEFAULT 'PENDING',
    CreatedAt    DATETIME2(3)  NOT NULL CONSTRAINT DF_Customers_Created DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Customers PRIMARY KEY CLUSTERED (CustomerId),
    CONSTRAINT UQ_Customers_Nid UNIQUE (NationalId),
    CONSTRAINT CK_Customers_Kyc CHECK (KycStatus IN ('PENDING','VERIFIED','REJECTED'))
);

CREATE TABLE dbo.Accounts (
    AccountId     BIGINT        NOT NULL IDENTITY(1,1),
    AccountNumber CHAR(13)      NOT NULL,
    CustomerId    INT           NOT NULL,
    BranchId      INT           NOT NULL,
    AccountType   VARCHAR(10)   NOT NULL,          -- SAVINGS, CURRENT, FD
    Balance       DECIMAL(19,4) NOT NULL CONSTRAINT DF_Acc_Balance  DEFAULT 0,
    Currency      CHAR(3)       NOT NULL CONSTRAINT DF_Acc_Currency DEFAULT 'BDT',
    Status        VARCHAR(10)   NOT NULL CONSTRAINT DF_Acc_Status   DEFAULT 'ACTIVE',
    OpenedOn      DATE          NOT NULL,
    ClosedOn      DATE          NULL,
    CONSTRAINT PK_Accounts PRIMARY KEY CLUSTERED (AccountId),
    CONSTRAINT UQ_Accounts_Number UNIQUE (AccountNumber),
    CONSTRAINT FK_Acc_Customer FOREIGN KEY (CustomerId) REFERENCES dbo.Customers(CustomerId),
    CONSTRAINT FK_Acc_Branch   FOREIGN KEY (BranchId)   REFERENCES dbo.Branches(BranchId),
    CONSTRAINT CK_Acc_Type   CHECK (AccountType IN ('SAVINGS','CURRENT','FD')),
    CONSTRAINT CK_Acc_Status CHECK (Status IN ('ACTIVE','DORMANT','CLOSED')),
    CONSTRAINT CK_Acc_Closed CHECK (ClosedOn IS NULL OR ClosedOn >= OpenedOn)
);

CREATE TABLE dbo.Transactions (
    TxnId        BIGINT        NOT NULL IDENTITY(1,1),
    AccountId    BIGINT        NOT NULL,
    TxnDate      DATETIME2(3)  NOT NULL,
    TxnType      VARCHAR(10)   NOT NULL,           -- DEBIT / CREDIT
    Channel      VARCHAR(12)   NOT NULL,           -- ATM, ONLINE, BRANCH, POS
    Amount       DECIMAL(19,4) NOT NULL,
    BalanceAfter DECIMAL(19,4) NOT NULL,
    Reference    NVARCHAR(80)  NULL,
    CONSTRAINT PK_Transactions PRIMARY KEY CLUSTERED (TxnId),
    CONSTRAINT FK_Txn_Account FOREIGN KEY (AccountId) REFERENCES dbo.Accounts(AccountId),
    CONSTRAINT CK_Txn_Type   CHECK (TxnType IN ('DEBIT','CREDIT')),
    CONSTRAINT CK_Txn_Amount CHECK (Amount > 0)
);

CREATE TABLE dbo.Loans (
    LoanId       INT           NOT NULL IDENTITY(1,1),
    CustomerId   INT           NOT NULL,
    BranchId     INT           NOT NULL,
    Principal    DECIMAL(19,4) NOT NULL,
    InterestRate DECIMAL(5,2)  NOT NULL,
    TermMonths   INT           NOT NULL,
    DisbursedOn  DATE          NOT NULL,
    Status       VARCHAR(12)   NOT NULL,           -- ACTIVE, CLOSED, DEFAULTED
    CONSTRAINT PK_Loans PRIMARY KEY CLUSTERED (LoanId),
    CONSTRAINT FK_Loan_Customer FOREIGN KEY (CustomerId) REFERENCES dbo.Customers(CustomerId),
    CONSTRAINT FK_Loan_Branch   FOREIGN KEY (BranchId)   REFERENCES dbo.Branches(BranchId)
);

/* ---------- Helper tables used in later modules ---------- */
CREATE TABLE dbo.AccountAudit (
    AuditId    BIGINT        NOT NULL IDENTITY(1,1) PRIMARY KEY,
    AccountId  BIGINT        NOT NULL,
    OldBalance DECIMAL(19,4) NULL,
    NewBalance DECIMAL(19,4) NULL,
    OldStatus  VARCHAR(10)   NULL,
    NewStatus  VARCHAR(10)   NULL,
    ChangedBy  SYSNAME       NOT NULL,
    ChangedAt  DATETIME2(3)  NOT NULL
);

CREATE TABLE dbo.ErrorLog (
    ErrorLogId     INT            NOT NULL IDENTITY(1,1) PRIMARY KEY,
    ErrorNumber    INT            NOT NULL,
    ErrorMessage   NVARCHAR(4000) NOT NULL,
    ErrorProcedure SYSNAME        NULL,
    ErrorLine      INT            NULL,
    LoggedAt       DATETIME2(3)   NOT NULL
);

CREATE TABLE dbo.CustomerStaging (
    NationalId VARCHAR(20)   NOT NULL,
    FullName   NVARCHAR(120) NOT NULL,
    Email      NVARCHAR(160) NULL,
    City       NVARCHAR(60)  NULL
);

CREATE TABLE dbo.ArchivedTransactions (
    TxnId     BIGINT        NOT NULL PRIMARY KEY,
    AccountId BIGINT        NOT NULL,
    TxnDate   DATETIME2(3)  NOT NULL,
    Amount    DECIMAL(19,4) NOT NULL
);
GO

/* ---------- Seed data (amounts in Bangladeshi Taka) ---------- */
INSERT INTO dbo.Branches (BranchCode, BranchName, City, OpenedOn)
VALUES ('DHK01', N'Gulshan Corporate', N'Dhaka',      '2005-03-01'),
       ('DHK02', N'Motijheel Main',    N'Dhaka',      '1998-07-15'),
       ('CTG01', N'Agrabad',           N'Chattogram', '2001-01-10'),
       ('SYL01', N'Zindabazar',        N'Sylhet',     '2012-02-01');

INSERT INTO dbo.Employees (BranchId, ManagerId, FullName, Designation, Salary, HiredOn)
VALUES (1, NULL, N'Farhana Kabir',  N'CEO',              450000, '2010-01-01'),
       (1, 1,    N'Imran Chowdhury',N'Head of Retail',   280000, '2012-05-10'),
       (2, 1,    N'Shirin Akter',   N'Head of Ops',      260000, '2013-08-01'),
       (1, 2,    N'Tanim Rahman',   N'Branch Manager',   150000, '2016-03-15'),
       (3, 2,    N'Rupa Das',       N'Branch Manager',   145000, '2017-07-01'),
       (1, 4,    N'Arif Hasan',     N'Officer',           65000, '2020-02-01'),
       (3, 5,    N'Mitu Sarkar',    N'Officer',           62000, '2021-09-12');

INSERT INTO dbo.Customers (NationalId, FullName, Email, Phone, City, KycStatus)
VALUES ('1990123456', N'Rahim Uddin',   'rahim@example.com', '01711000001', N'Dhaka',      'VERIFIED'),
       ('1985987654', N'Karim Hossain', 'karim@example.com', NULL,          N'Dhaka',      'VERIFIED'),
       ('1999111222', N'Nusrat Jahan',  NULL,                '01811000003', N'Chattogram', 'PENDING'),
       ('1978333444', N'Sadia Islam',   'sadia@example.com', NULL,          N'Sylhet',     'VERIFIED'),
       ('2001555777', N'Jamal Mia',     NULL,                NULL,          NULL,          'REJECTED');

INSERT INTO dbo.Accounts (AccountNumber, CustomerId, BranchId, AccountType, Balance, Status, OpenedOn)
VALUES ('1001000000001', 1, 1, 'SAVINGS',   85000.00, 'ACTIVE',  '2020-02-01'),
       ('1001000000002', 1, 1, 'CURRENT',  250000.00, 'ACTIVE',  '2021-06-11'),
       ('1001000000003', 2, 2, 'SAVINGS',    4300.50, 'ACTIVE',  '2019-11-23'),
       ('1001000000004', 3, 3, 'SAVINGS',   18000.00, 'ACTIVE',  '2022-01-05'),
       ('1001000000005', 4, 4, 'FD',      1200000.00, 'ACTIVE',  '2023-04-01'),
       ('1001000000006', 2, 2, 'CURRENT',  640000.00, 'DORMANT', '2018-09-09');

INSERT INTO dbo.Transactions (AccountId, TxnDate, TxnType, Channel, Amount, BalanceAfter, Reference)
VALUES (1, '2026-01-01T09:15:00', 'CREDIT', 'BRANCH', 50000, 50000, N'Salary'),
       (1, '2026-01-02T10:00:00', 'DEBIT',  'ATM',     2000, 48000, N'Cash'),
       (1, '2026-01-03T18:40:00', 'DEBIT',  'POS',     1500, 46500, N'Grocery'),
       (1, '2026-02-01T09:10:00', 'CREDIT', 'ONLINE', 40000, 86500, N'Salary'),
       (1, '2026-02-05T12:00:00', 'DEBIT',  'ONLINE',  1500, 85000, N'Mobile bill'),
       (2, '2026-01-10T11:00:00', 'CREDIT', 'BRANCH',250000,250000, N'Opening deposit'),
       (3, '2026-01-15T14:30:00', 'CREDIT', 'ATM',     5000,  5000, N'Deposit'),
       (3, '2026-03-01T08:05:00', 'DEBIT',  'POS',      699.50, 4300.50, N'Pharmacy'),
       (5, '2026-02-20T10:00:00', 'CREDIT', 'BRANCH',1200000,1200000, N'FD booking');
       -- Account 4 has no transactions on purpose (used in anti-join lessons)

INSERT INTO dbo.Loans (CustomerId, BranchId, Principal, InterestRate, TermMonths, DisbursedOn, Status)
VALUES (1, 1, 500000, 9.50, 36, '2024-01-15', 'ACTIVE'),
       (1, 1, 200000, 11.0, 24, '2025-03-01', 'ACTIVE'),
       (1, 1, 100000, 12.0, 12, '2023-06-01', 'CLOSED'),
       (3, 3, 150000, 10.5, 24, '2024-08-10', 'DEFAULTED');
GO

SELECT 'BankDB is ready' AS Status,
       (SELECT COUNT(*) FROM dbo.Accounts)     AS Accounts,
       (SELECT COUNT(*) FROM dbo.Transactions) AS Transactions;
`;
