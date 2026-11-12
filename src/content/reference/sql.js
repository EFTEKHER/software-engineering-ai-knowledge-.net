const rows = [
  [
    "Projection and aliases",
    "Projection chooses the output shape before application code receives the rows. Column aliases are result labels, not renames of stored columns. Expressions can calculate values in a result without writing them back. A narrow projection reduces transferred data and discourages accidental exposure of private columns.",
    "Projection ফলের গঠন বেছে নেয়; alias মূল column-এর নাম বদলায় না। Query-তে হিসাব করা মান দেখানো যায়, data না বদলিয়েই। দরকারি column নিলে transfer কমে ও গোপন তথ্য ভুলে যাওয়া কমে।",
    `SELECT Id, Name AS EmployeeName, Salary / 12.0 AS MonthlySalary
FROM Employees
ORDER BY Id;
-- Explicit projection keeps the API output stable.
SELECT Name, 'Employee' AS RecordType
FROM Employees;`,
    `var result = employees
    .OrderBy(e => e.Id)
    .Select(e => new { EmployeeName = e.Name, MonthlySalary = e.Salary / 12m });
foreach (var item in result)
    Console.WriteLine($"{item.EmployeeName}: {item.MonthlySalary:F2}");`,
    "Aliases often cannot be referenced from WHERE in portable SQL because filtering logically occurs before projection. Repeat the expression or use a subquery/CTE when needed.",
    "Portable SQL-এ WHERE-এ projection alias সবসময় চলে না। দরকারে expression আবার লিখুন বা subquery/CTE দিন।",
  ],
  [
    "Boolean filters and missing data",
    "Conditions combine with AND, OR, and NOT. Parentheses make intent explicit and prevent operator precedence from changing business meaning. SQL uses three-valued logic: a comparison involving NULL is generally unknown, which WHERE does not retain. Distinguish an unknown department from a department whose numeric ID is zero.",
    "AND, OR ও NOT দিয়ে শর্ত মেশে। বন্ধনী না দিলে precedence-এ অন্য ফল হতে পারে। NULL তুলনায় unknown আসে, WHERE তা রাখে না। অজানা department আর id শূন্য আলাদা।",
    `SELECT Id, Name, Salary, DepartmentId
FROM Employees
WHERE (DepartmentId = 1 OR DepartmentId IS NULL)
  AND Salary >= 45000;
SELECT Name FROM Employees
WHERE ManagerId IS NULL;`,
    `var result = employees
    .Where(e => (e.DepartmentId == 1 || e.DepartmentId is null) && e.Salary >= 45000m)
    .OrderBy(e => e.Id);
foreach (var e in result)
    Console.WriteLine($"{e.Name}: {e.DepartmentId?.ToString() ?? "Unknown"}");`,
    "C# null semantics and SQL null semantics are not identical in every expression; an ORM may compensate during translation. Inspect generated SQL for complex nullable predicates.",
    "C# ও SQL-এর null নিয়ম সব expression-এ এক নয়। জটিল nullable predicate-এ ORM-এর SQL দেখে নিন।",
  ],
  [
    "Stable ordering and tie breakers",
    "Rows with equal sort values need another ordering key for deterministic results. This is essential for pagination and repeatable exports. Sorting by a calculated expression can prevent a simple index-order scan. Ordering is an output contract, not a permanent property of table storage.",
    "একই salary হলে অন্য unique key দিয়ে ক্রম স্থির করুন। Pagination ও export-এ এটি জরুরি। Calculated expression দিয়ে sort করলে সাধারণ index-এর সুবিধা নাও মেলে। Table নিজের থেকে স্থায়ী ক্রমের প্রতিশ্রুতি দেয় না।",
    `SELECT Id, Name, Salary
FROM Employees
ORDER BY Salary DESC, Id ASC;
SELECT Id, Name, DepartmentId
FROM Employees
ORDER BY DepartmentId IS NULL, DepartmentId, Id;`,
    `var result = employees
    .OrderByDescending(e => e.Salary)
    .ThenBy(e => e.Id)
    .Take(3);
foreach (var e in result)
    Console.WriteLine($"{e.Id}: {e.Name} {e.Salary}");`,
    "Specify NULL placement explicitly when portability matters because defaults vary by database. A unique final key prevents rows swapping between pages.",
    "NULL আগে না পরে তার default database-ভেদে বদলায়। শেষ unique key দিলে পাতার মাঝে ফল এলোমেলো হয় না।",
  ],
  [
    "Distinct combinations",
    "DISTINCT considers the entire selected row. Selecting DepartmentId alone deduplicates departments; selecting DepartmentId and Salary deduplicates combinations. Deduplication can require sorting or hashing. It is a data operation with a cost, not a substitute for defining a correct join cardinality.",
    "DISTINCT নির্বাচিত সব column মিলে একটি row বিচার করে। DepartmentId একা আর DepartmentId-Salary জোড়ার distinct ফল আলাদা। Sort বা hash-এর খরচ লাগে; ভুল join-এর বিকল্প নয়।",
    `SELECT DISTINCT DepartmentId
FROM Employees
ORDER BY DepartmentId;
SELECT DISTINCT DepartmentId, Salary
FROM Employees
ORDER BY DepartmentId, Salary;`,
    `var pairs = employees
    .Select(e => new { e.DepartmentId, e.Salary })
    .Distinct()
    .OrderBy(x => x.DepartmentId);
foreach (var pair in pairs)
    Console.WriteLine($"{pair.DepartmentId}: {pair.Salary}");`,
    "Decide whether duplicates are meaningful before removing them. COUNT(DISTINCT nullable_column) excludes NULL, while SELECT DISTINCT can return one NULL row.",
    "Duplicate সত্যিই বাদ দেওয়ার কি না ঠিক করুন। COUNT DISTINCT-এ NULL বাদ যায়, SELECT DISTINCT-এ একটি NULL row থাকতে পারে।",
  ],
  [
    "Offset versus keyset pages",
    "Offset skips a number of ordered rows, so deep pages can require the engine to walk many entries. Keyset pagination starts after a known ordered key. It is usually more stable for a growing dataset, but arbitrary page-number jumps and reverse navigation need additional design.",
    "Offset আগে কিছু row হাঁটে বা বাদ দেয়; গভীর পাতায় কাজ বাড়ে। Keyset পরিচিত key-এর পরে শুরু করে। বাড়তে থাকা data-তে সুবিধা, তবে সরাসরি ১০০ নম্বর পাতায় যাওয়া আলাদা পরিকল্পনা চায়।",
    `SELECT Id, Name FROM Employees
ORDER BY Id LIMIT 2 OFFSET 2;
-- Cursor says the last observed id was 2.
SELECT Id, Name FROM Employees
WHERE Id > 2
ORDER BY Id LIMIT 2;`,
    `int afterId = 2;
int size = 2;
var page = employees.Where(e => e.Id > afterId)
    .OrderBy(e => e.Id).Take(size).ToList();
foreach (var e in page) Console.WriteLine(e.Name);
int? nextCursor = page.Count == 0 ? null : page[^1].Id;`,
    "Every page needs a stable total ordering and a bounded page size. An offset query without ORDER BY has no dependable page meaning.",
    "প্রতি পাতায় stable ordering ও সীমিত size দরকার। ORDER BY ছাড়া offset-এর ফলের নির্ভরযোগ্য অর্থ নেই।",
  ],
  [
    "Counting rows, values, and groups",
    "COUNT(*) counts input rows even when individual columns are NULL. COUNT(column) counts nonmissing values. Counting after a join counts joined combinations, which may not equal the number of original entities. Understand the row grain before using a count as a business metric.",
    "COUNT(*) row গোনে, COUNT(column) NULL বাদ দেয়। Join-এর পরে row-এর সংখ্যা মূল entity-র সংখ্যা নাও হতে পারে। ব্যবসার metric করার আগে এক row কী বোঝায় জানুন।",
    `SELECT COUNT(*) AS AllRows,
       COUNT(DepartmentId) AS KnownDepartments,
       COUNT(DISTINCT DepartmentId) AS DifferentDepartments
FROM Employees;
SELECT DepartmentId, COUNT(*) AS People
FROM Employees GROUP BY DepartmentId;`,
    `int total = employees.Count();
int assigned = employees.Count(e => e.DepartmentId.HasValue);
int different = employees.Where(e => e.DepartmentId.HasValue)
    .Select(e => e.DepartmentId).Distinct().Count();
Console.WriteLine($"Total={total}, assigned={assigned}, different={different}");`,
    "On very large tables an exact count may be expensive. Do not replace it with an estimate unless the product explicitly accepts approximate results.",
    "বড় table-এ exact count ব্যয়বহুল হতে পারে। Product অনুমতি না দিলে estimate-কে exact সংখ্যা বলে দেখাবেন না।",
  ],
  [
    "Aggregation and numeric precision",
    "Aggregates summarize many input values into one result or one result per group. Most ignore NULL, so missing salary is not automatically treated as zero. Integer division can truncate a calculated average in some SQL dialects; choose numeric types deliberately, especially for money.",
    "Aggregate অনেক মানের সারাংশ করে। NULL সাধারণত বাদ, শূন্য নয়। Integer division-এ দশমিক হারাতে পারে; বিশেষ করে টাকার হিসাবের type বুঝে দিন।",
    `SELECT DepartmentId, SUM(Salary) AS Payroll,
       AVG(Salary) AS MeanSalary,
       MIN(Salary) AS Lowest, MAX(Salary) AS Highest
FROM Employees
GROUP BY DepartmentId
ORDER BY Payroll DESC;`,
    `var totals = employees.GroupBy(e => e.DepartmentId)
    .Select(g => new { Department = g.Key, Payroll = g.Sum(e => e.Salary), Mean = g.Average(e => e.Salary) });
foreach (var g in totals)
    Console.WriteLine($"{g.Department}: {g.Payroll} / {g.Mean:F2}");`,
    "Document whether missing amounts are excluded, treated as zero, or rejected. The choice changes the denominator and business interpretation.",
    "অনুপস্থিত অঙ্ক বাদ, শূন্য নাকি error—নিয়ম লিখুন। গড়ের denominator ও অর্থ বদলায়।",
  ],
  [
    "Pattern matching and escaping",
    "LIKE uses wildcards, not general regular expressions. A user looking for a literal percent or underscore needs an escape policy. Collation determines case sensitivity and text comparison behavior. Prefix searches can be more index-friendly than contains searches, but optimizer and collation rules still matter.",
    "LIKE regex নয়। User সত্যিকারের % বা _ খুঁজলে escape দরকার। Case sensitivity collation-এর নিয়মে চলে। শুরু মিলিয়ে খোঁজা মাঝের শব্দ খোঁজার চেয়ে index-friendly হতে পারে।",
    `SELECT Name FROM Employees
WHERE Name LIKE 'A%'
ORDER BY Name;
SELECT Name FROM Employees
WHERE Name LIKE '%a%'
ORDER BY Name;`,
    `var prefix = employees.Where(e => e.Name.StartsWith("A", StringComparison.OrdinalIgnoreCase));
foreach (var e in prefix) Console.WriteLine(e.Name);
var contains = employees.Where(e => e.Name.Contains("a", StringComparison.OrdinalIgnoreCase));
Console.WriteLine($"Contains a: {contains.Count()}");`,
    "The StringComparison overload here is an in-memory LINQ example; not every EF provider can translate it. Use a provider-supported collation/query when running on a database.",
    "এখানের StringComparison memory-তে চলে। সব EF provider SQL-এ অনুবাদ করতে পারে না; provider-এর collation ব্যবহার করুন।",
  ],
  [
    "Membership and anti-membership",
    "IN can use an explicit list or a single-column subquery. Duplicates in the set do not duplicate the outer rows. NOT IN becomes tricky when its set includes NULL because comparisons become unknown. NOT EXISTS expresses an anti-join without relying on a NULL-free membership list.",
    "IN-এর তালিকায় duplicate থাকলে বাইরের row বাড়ে না। NOT IN-এ NULL থাকলে unknown-এর কারণে অপ্রত্যাশিত ফল আসে। নেই-এমন সম্পর্ক খুঁজতে NOT EXISTS পরিষ্কার হতে পারে।",
    `SELECT Name FROM Employees
WHERE DepartmentId IN (SELECT Id FROM Departments WHERE Id <= 2);
SELECT d.Name FROM Departments d
WHERE NOT EXISTS (
  SELECT 1 FROM Employees e WHERE e.DepartmentId = d.Id
);`,
    `var selected = new HashSet<int> { 1, 2 };
var result = employees.Where(e => e.DepartmentId.HasValue && selected.Contains(e.DepartmentId.Value));
foreach (var e in result) Console.WriteLine(e.Name);
var unused = departments.Where(d => !employees.Any(e => e.DepartmentId == d.Id));
foreach (var d in unused) Console.WriteLine(d.Name);`,
    "Always reason about NULL in exclusion queries. HashSet membership is efficient in memory, while a database optimizer chooses its own physical strategy.",
    "Exclusion query-তে NULL-এর কথা ভাবুন। Memory-তে HashSet সুবিধা দেয়; database নিজে physical strategy বাছে।",
  ],
  [
    "Inclusive bounds and half-open intervals",
    "BETWEEN includes both limits. That is convenient for numeric bands but can be awkward for timestamps: a date literal may mean midnight rather than the end of a day. A half-open interval includes the start and excludes the next boundary, avoiding precision-dependent final instants.",
    "BETWEEN দুই প্রান্তসহ। তারিখে শেষ দিনের literal শুধু midnight বোঝাতে পারে। শুরুসহ ও পরের সীমা বাদ দেওয়া half-open interval-এ শেষ microsecond আন্দাজ করতে হয় না।",
    `SELECT Name, Salary FROM Employees
WHERE Salary BETWEEN 50000 AND 80000
ORDER BY Salary, Id;
SELECT Name, Salary FROM Employees
WHERE Salary >= 50000 AND Salary < 80000
ORDER BY Salary, Id;`,
    `decimal minimum = 50000m, exclusiveMaximum = 80000m;
var result = employees.Where(e => e.Salary >= minimum && e.Salary < exclusiveMaximum)
    .OrderBy(e => e.Salary).ThenBy(e => e.Id);
foreach (var e in result) Console.WriteLine($"{e.Name}: {e.Salary}");`,
    "Name variables to show inclusive/exclusive intent. For time ranges also define timezone and storage type before choosing boundaries.",
    "Variable-এর নামে inclusive/exclusive বোঝান। সময়ের range-এ timezone ও storage type-ও আগে ঠিক করুন।",
  ],
  [
    "Grouping changes row grain",
    "Grouping produces one row per unique grouping key. An aggregate then summarizes only that group’s input. Grouping by too many columns can accidentally return nearly the original row count. Group keys with NULL values generally form a group rather than vanishing automatically.",
    "Group করলে প্রতি key-তে এক ফল হয়। বেশি column দিয়ে group করলে প্রায় মূল row সংখ্যাই থাকতে পারে। NULL key-ও সাধারণত আলাদা group হিসেবে থাকে।",
    `SELECT d.Name AS Department, COUNT(e.Id) AS People,
       COALESCE(SUM(e.Salary), 0) AS Payroll
FROM Departments d
LEFT JOIN Employees e ON e.DepartmentId = d.Id
GROUP BY d.Id, d.Name
ORDER BY People DESC, d.Id;`,
    `var result = employees.GroupBy(e => e.DepartmentId)
    .Select(g => new { DepartmentId = g.Key, People = g.Count(), Payroll = g.Sum(x => x.Salary) });
foreach (var item in result)
    Console.WriteLine($"{item.DepartmentId}: {item.People} people, {item.Payroll}");`,
    "On a left join, COUNT(*) counts the preserved outer row even when no child matches; COUNT(child.Id) counts actual child matches.",
    "LEFT JOIN-এ সন্তান না থাকলেও COUNT(*) বাম row গোনে। আসল matched child গুনতে COUNT(child.Id)।",
  ],
  [
    "Filtering groups after calculation",
    "WHERE and HAVING operate at different logical stages. A row predicate such as salary >= 50000 changes the input to aggregation; HAVING SUM(Salary) >= 100000 selects completed group results. They can appear together to answer a precise business question.",
    "WHERE aggregate-এর input row বাছে; HAVING তৈরি group-এর হিসাব দেখে বাছে। দুইটি একসাথে থাকতে পারে, কিন্তু একে অন্যের বিকল্প নয়।",
    `SELECT DepartmentId, COUNT(*) AS People, SUM(Salary) AS Payroll
FROM Employees
WHERE Salary >= 50000
GROUP BY DepartmentId
HAVING COUNT(*) >= 2 AND SUM(Salary) >= 100000
ORDER BY Payroll DESC;`,
    `var result = employees.Where(e => e.Salary >= 50000m)
    .GroupBy(e => e.DepartmentId)
    .Where(g => g.Count() >= 2 && g.Sum(e => e.Salary) >= 100000m)
    .Select(g => new { Department = g.Key, People = g.Count() });
foreach (var item in result) Console.WriteLine(item);`,
    "Push row-only filters before grouping when semantics allow it. Do not move aggregate conditions into WHERE, where group results do not exist yet.",
    "অর্থ ঠিক থাকলে row filter আগে দিন। Aggregate-এর ফল তখনো না হওয়ায় তার শর্ত WHERE-এ বসে না।",
  ],
  [
    "Join cardinality and relationships",
    "A join emits one row per matching pair. One-to-many relationships intentionally duplicate the parent columns across child rows. Joining unrelated many-to-many inputs without the correct key can multiply results dramatically. Alias columns clearly when both tables contain names such as Id or Name.",
    "Join প্রতি matching pair-এ একটি row দেয়। One-to-many-তে parent তথ্য কয়েকবার থাকা স্বাভাবিক। ভুল key-তে many-to-many মিললে ফল বহুগুণ হয়। দুই table-এর একই নামের column alias দিন।",
    `SELECT e.Id AS EmployeeId, e.Name AS Employee,
       d.Id AS DepartmentId, d.Name AS Department
FROM Employees e
INNER JOIN Departments d ON d.Id = e.DepartmentId
WHERE d.Id = 1
ORDER BY e.Id;`,
    `var result = from e in employees
             join d in departments on e.DepartmentId equals (int?)d.Id
             where d.Id == 1
             orderby e.Id
             select new { Employee = e.Name, Department = d.Name };
foreach (var row in result) Console.WriteLine(row);`,
    "Specify the intended row grain before adding DISTINCT. If you need parents with at least one child, EXISTS may express intent better than a duplicating join.",
    "DISTINCT-এর আগে এক row কী তা ঠিক করুন। শুধু সন্তান আছে কি না চাইলে EXISTS অনেক সময় পরিষ্কার।",
  ],
  [
    "Preserving unmatched rows",
    "LEFT JOIN retains left-side rows without a right match. Right-side filtering in ON affects which matches are attached; the same predicate in WHERE can remove the unmatched rows entirely. These two locations answer different questions and are a common source of reporting bugs.",
    "LEFT JOIN বামের না-মেলা row রাখে। ডানদিকের শর্ত ON-এ দিলে matching নিয়ন্ত্রণ হয়; WHERE-এ দিলে unmatched row-ও বাদ যেতে পারে। রিপোর্টে এটি সাধারণ ভুল।",
    `SELECT e.Name, d.Name AS EngineeringDepartment
FROM Employees e
LEFT JOIN Departments d ON e.DepartmentId = d.Id AND d.Id = 1
ORDER BY e.Id;
SELECT e.Name FROM Employees e
LEFT JOIN Departments d ON e.DepartmentId = d.Id
WHERE d.Id IS NULL;`,
    `var result = from e in employees
             join d in departments on e.DepartmentId equals (int?)d.Id into matches
             from d in matches.DefaultIfEmpty()
             select new { Employee = e.Name, Department = d?.Name ?? "Unassigned" };
foreach (var row in result) Console.WriteLine(row);`,
    "When a report must show empty departments, make Departments the preserved left side. Direction expresses the required completeness.",
    "খালি department-ও দেখাতে চাইলে Departments বামে রাখুন। কোন দিক সব রাখতে হবে তা business requirement।",
  ],
  [
    "Hierarchies and aliases",
    "A self join gives the same table two roles, such as employee and manager. It can reveal one relationship level but does not recursively walk an arbitrary hierarchy. Recursive CTEs solve multi-level traversal when supported. Missing managers, cycles, and orphaned references need a defined data policy.",
    "একই table-কে employee ও manager দুই ভূমিকায় alias দিন। সাধারণ self join এক level দেখে; পুরো hierarchy-তে recursive CTE লাগে। Cycle ও orphan reference-এর নিয়মও দরকার।",
    `SELECT e.Name AS Employee, m.Name AS Manager
FROM Employees e
LEFT JOIN Employees m ON e.ManagerId = m.Id
ORDER BY e.Id;
SELECT m.Name, COUNT(e.Id) AS DirectReports
FROM Employees m LEFT JOIN Employees e ON e.ManagerId = m.Id
GROUP BY m.Id, m.Name;`,
    `var result = from e in employees
             join manager in employees on e.ManagerId equals (int?)manager.Id into managers
             from manager in managers.DefaultIfEmpty()
             select new { Employee = e.Name, Manager = manager?.Name ?? "None" };
foreach (var row in result) Console.WriteLine(row);`,
    "A foreign key can prevent missing referenced managers, but it does not inherently prevent management cycles. Validate domain-specific hierarchy invariants separately.",
    "Foreign key missing manager ঠেকাতে পারে, কিন্তু cycle নিজে ঠেকায় না। Hierarchy-এর domain rule আলাদা যাচাই করুন।",
  ],
  [
    "Set union versus concatenation",
    "UNION removes duplicate output rows; UNION ALL concatenates them and usually avoids deduplication work. Both sides must expose compatible column shapes. The result column labels come from the first query. Ordering the final combined result differs from attempting to order each branch independently.",
    "UNION duplicate বাদ দেয়, UNION ALL সব রাখে। দুই query-র column-এর গঠন compatible হতে হবে। ফলের column নাম সাধারণত প্রথমটির। শেষের মিলিত ফল সাজানো আলাদা ধাপ।",
    `SELECT Name AS Label, 'Employee' AS Kind FROM Employees
UNION ALL
SELECT Name AS Label, 'Department' AS Kind FROM Departments
ORDER BY Kind, Label;
SELECT DepartmentId FROM Employees
UNION
SELECT Id FROM Departments;`,
    `var names = employees.Select(e => e.Name)
    .Concat(departments.Select(d => d.Name));
foreach (string name in names) Console.WriteLine(name);
var uniqueNames = employees.Select(e => e.Name)
    .Union(departments.Select(d => d.Name));
Console.WriteLine($"Unique names: {uniqueNames.Count()}");`,
    "Choose ALL when duplicate rows represent real independent events. Do not pay for deduplication or discard events without a requirement.",
    "স্বাধীন ঘটনা হিসেবে duplicate অর্থবহ হলে ALL নিন। চাহিদা ছাড়া data বাদ বা dedup-এর খরচ নয়।",
  ],
  [
    "Conditional classification",
    "CASE returns the first branch whose condition is true. Conditions should be ordered from specific to broad when they overlap. An omitted ELSE produces NULL when nothing matches. Conditional expressions can also be aggregated to compute counts for several categories in one scan.",
    "CASE প্রথম সত্য শাখা নেয়। Overlap হলে নির্দিষ্ট শর্ত আগে রাখুন। ELSE না থাকলে unmatched-এ NULL। Aggregate-এর সাথে এক scan-এ আলাদা category-র হিসাব করা যায়।",
    `SELECT Name,
 CASE WHEN Salary >= 90000 THEN 'Lead'
      WHEN Salary >= 65000 THEN 'Experienced'
      ELSE 'Developing' END AS Band
FROM Employees;
SELECT SUM(CASE WHEN Salary >= 65000 THEN 1 ELSE 0 END) AS HigherBandCount
FROM Employees;`,
    `var result = employees.Select(e => new {
    e.Name,
    Band = e.Salary >= 90000m ? "Lead" : e.Salary >= 65000m ? "Experienced" : "Developing"
});
foreach (var e in result) Console.WriteLine($"{e.Name}: {e.Band}");`,
    "Keep categories mutually understandable and document boundary inclusivity. A later branch cannot override an earlier match.",
    "Category-এর সীমা স্পষ্ট দিন। আগের শর্ত মিলে গেলে পরের branch আর ফল বদলাতে পারবে না।",
  ],
  [
    "Scalar, set, and correlated subqueries",
    "A scalar subquery supplies one value; a set subquery supplies rows for membership; a correlated subquery references the current outer row. Correlation is a logical dependency, not a promise that the engine literally reruns a query for every row; optimizers may transform it.",
    "Scalar subquery এক মান, set subquery অনেক row দেয়। Correlated query বাইরের row-এর তথ্য ব্যবহার করে। Optimizer বদলে চালাতে পারে, তাই logical dependency আর আসল execution এক ধরে নেবেন না।",
    `SELECT e.Name, e.Salary FROM Employees e
WHERE e.Salary > (
 SELECT AVG(other.Salary) FROM Employees other
 WHERE other.DepartmentId = e.DepartmentId
);
SELECT Name FROM Employees
WHERE Salary = (SELECT MAX(Salary) FROM Employees);`,
    `var result = employees.Where(e => e.DepartmentId.HasValue &&
    e.Salary > employees.Where(x => x.DepartmentId == e.DepartmentId).Average(x => x.Salary));
foreach (var e in result) Console.WriteLine(e.Name);
decimal max = employees.Max(e => e.Salary);
Console.WriteLine($"Highest: {max}");`,
    "An equality comparison to a scalar subquery fails if the subquery returns multiple rows in stricter engines. Prove the cardinality with an aggregate or unique key.",
    "Scalar query একাধিক row দিলে অনেক engine error দেয়। Aggregate বা unique key দিয়ে এক মান হবে তা নিশ্চিত করুন।",
  ],
  [
    "Index shape and query plans",
    "A composite index orders tuples lexicographically. A leading equality filter can make a later sort key useful. Covering indexes can avoid some table lookups, but extra indexed fields increase storage and write cost. The optimizer’s plan is the evidence of index use; a fast small demo does not prove large-scale behavior.",
    "Composite index বামদিকের column আগে ধরে tuple সাজায়। প্রথমে equality filter থাকলে পরের sort key কাজে লাগে। বেশি field-এ read সুবিধা হলেও write ও storage খরচ বাড়ে। Plan-ই ব্যবহারের প্রমাণ।",
    `CREATE INDEX IF NOT EXISTS IX_Employee_DeptSalary ON Employees(DepartmentId, Salary DESC, Id);
EXPLAIN QUERY PLAN
SELECT Id, Salary FROM Employees
WHERE DepartmentId = 1
ORDER BY Salary DESC, Id
LIMIT 2;`,
    `// EF Core model configuration fragment; requires Product-like Employee entity.
modelBuilder.Entity<EmployeeEntity>()
    .HasIndex(e => new { e.DepartmentId, e.Salary, e.Id });
// Generate and review a migration before applying it.
// Inspect the provider's actual query plan after deployment.`,
    "The LINQ companion is an EF Core integration fragment, not part of the in-memory fixture. Index direction, included columns, and online build support vary by provider.",
    "এখানে EF Core model fragment, memory-র LINQ নয়। Index direction ও online build provider অনুযায়ী আলাদা।",
  ],
  [
    "Window partitions and ties",
    "A window preserves input row grain while calculating over a partition. ROW_NUMBER assigns unique positions; RANK shares ties and leaves gaps; DENSE_RANK shares ties without gaps. Partitioning restarts the calculation for each department. Adding a tie-breaker to RANK changes which rows count as ties.",
    "Window মূল row রেখে পাশে হিসাব করে। ROW_NUMBER আলাদা ক্রম, RANK tie-তে একই ও ফাঁক, DENSE_RANK tie-তে একই কিন্তু ফাঁক নয়। PARTITION BY-তে প্রতিটি দলে আবার শুরু।",
    `SELECT Name, DepartmentId, Salary,
 ROW_NUMBER() OVER(PARTITION BY DepartmentId ORDER BY Salary DESC, Id) AS Position,
 RANK() OVER(PARTITION BY DepartmentId ORDER BY Salary DESC) AS SharedRank,
 DENSE_RANK() OVER(PARTITION BY DepartmentId ORDER BY Salary DESC) AS DenseRank
FROM Employees
ORDER BY DepartmentId, Position;`,
    `foreach (var group in employees.GroupBy(e => e.DepartmentId)) {
    var ordered = group.OrderByDescending(e => e.Salary).ThenBy(e => e.Id);
    int position = 0;
    foreach (var e in ordered)
        Console.WriteLine($"{group.Key}: {++position} {e.Name} {e.Salary}");
}`,
    "The companion demonstrates ROW_NUMBER-like enumeration in memory, not SQL window translation. Keep rank ordering free of a unique tiebreaker when equal salary should share rank.",
    "Companion memory-তে row number দেখায়, SQL window translation নয়। Salary tie একই rank চাইলে RANK-এর ordering-এ unique id দেবেন না।",
  ],
];
const fixture = `using System;
using System.Linq;
using System.Collections.Generic;
var employees = new[] {
    new Employee(1, "Ayesha", 1, 95000m, null),
    new Employee(2, "Rahim", 1, 65000m, 1),
    new Employee(3, "Nadia", 2, 80000m, null),
    new Employee(4, "Arif", 3, 50000m, 1),
    new Employee(5, "Tania", 1, 65000m, 1),
    new Employee(6, "Sami", null, 45000m, null)
};
var departments = new[] { new Department(1,"Engineering"), new Department(2,"Design"), new Department(3,"Operations") };`;
export default rows.map(
  ([title, en, bn, query, linq, decisionEn, decisionBn], i) => ({
    en,
    bn,
    decisionEn,
    decisionBn,
    examples: [
      { title: title + " · বাড়তি SQL উদাহরণ", language: "sql", code: query },
      {
        title: "C# LINQ companion · C#-এ একই ধারণা",
        language: "csharp",
        kind: i === 18 ? "Integration fragment" : "Console example",
        code:
          i === 18
            ? linq
            : fixture +
              "\n\n" +
              linq +
              "\n\nrecord Employee(int Id, string Name, int? DepartmentId, decimal Salary, int? ManagerId);\nrecord Department(int Id, string Name);",
      },
    ],
  }),
);
