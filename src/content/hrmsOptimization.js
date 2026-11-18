export const hrmsSchema = `
PRAGMA foreign_keys = ON;

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  manager_id INTEGER REFERENCES employees(id),
  active INTEGER NOT NULL CHECK (active IN (0, 1))
);

CREATE TABLE attendance (
  id INTEGER PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  work_date TEXT NOT NULL,
  minutes_worked INTEGER NOT NULL
);

CREATE TABLE leave_entries (
  id INTEGER PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  leave_date TEXT NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE payroll (
  id INTEGER PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  pay_date TEXT NOT NULL,
  amount_cents INTEGER NOT NULL
);

INSERT INTO employees VALUES
  (1, 'Amina', 'People', NULL, 1), (2, 'Rafi', 'Engineering', 1, 1),
  (3, 'Nila', 'Engineering', 2, 1), (4, 'Ishan', 'Operations', 1, 1),
  (5, 'Tara', 'People', 1, 0), (6, 'Sami', 'Engineering', 5, 1);

INSERT INTO attendance VALUES
  (1, 2, '2025-12-31', 480), (2, 2, '2026-01-01', 480),
  (3, 2, '2026-01-02', 450), (4, 2, '2026-01-03', 480),
  (5, 2, '2026-01-05', 480), (6, 3, '2026-01-01', 420),
  (7, 3, '2026-01-02', 480), (8, 4, '2026-01-10', 480),
  (9, 5, '2026-01-10', 480), (10, 2, '2026-02-01', 480),
  (11, 2, '2026-01-03', 30), (12, 4, '2026-01-12', 400);

INSERT INTO leave_entries VALUES
  (1, 2, '2026-01-08', 'approved'), (2, 2, '2026-01-09', 'approved'),
  (3, 3, '2026-01-07', 'pending'), (4, 4, '2026-02-02', 'approved');

INSERT INTO payroll VALUES
  (1, 1, '2026-01-31', 950000), (2, 2, '2026-01-31', 800000),
  (3, 3, '2026-01-31', 700000), (4, 4, '2026-01-31', 500000),
  (5, 2, '2026-01-31', 50000), (6, 6, '2026-01-31', 700000),
  (7, 2, '2026-02-28', 810000), (8, 5, '2025-12-31', 510000),
  (9, 2, '2025-12-31', 780000);
`;

export const challenges = [
  {
    id: "attendance",
    title: "Monthly attendance by employee",
    topic: "SARGability and covering indexes",
    prompt:
      "Return January 2026 minutes for every employee with attendance that month. Keep split shifts, and exclude February 1.",
    starter: `SELECT employee_id, SUM(minutes_worked) AS total_minutes
FROM attendance
WHERE strftime('%Y-%m', work_date) = '2026-01'
GROUP BY employee_id
ORDER BY employee_id;`,
    steps: [
      "Use a half-open date range so the index can search the stored ISO dates directly.",
      "Sum all matching rows per employee. Multiple shifts on one date each contribute minutes.",
      "Add the date-first index and compare the plan. SQLite can read the date, employee, and minutes from the index. Grouping may still need a temporary tree.",
    ],
    solution: `SELECT employee_id, SUM(minutes_worked) AS total_minutes
FROM attendance
WHERE work_date >= '2026-01-01' AND work_date < '2026-02-01'
GROUP BY employee_id
ORDER BY employee_id;`,
    index: `CREATE INDEX attendance_month
ON attendance(work_date, employee_id, minutes_worked);`,
  },
  {
    id: "dashboard",
    title: "Attendance and leave dashboard",
    topic: "Join fan-out, correlated subqueries, and N+1",
    prompt:
      "For every active employee, return January attendance minutes and approved leave-entry count. Use zero when either side is empty. Rafi has 1,920 minutes and two approved entries.",
    starter: `SELECT e.id,
       SUM(a.minutes_worked) AS total_minutes,
       COUNT(l.id) AS approved_entries
FROM employees AS e
LEFT JOIN attendance AS a ON a.employee_id = e.id
  AND a.work_date >= '2026-01-01' AND a.work_date < '2026-02-01'
LEFT JOIN leave_entries AS l ON l.employee_id = e.id
  AND l.leave_date >= '2026-01-01' AND l.leave_date < '2026-02-01'
  AND l.status = 'approved'
WHERE e.active = 1
GROUP BY e.id
ORDER BY e.id;`,
    steps: [
      "Aggregate each fact table first. Joining the raw facts multiplies attendance rows by the number of leave entries.",
      "Join each aggregate to the active roster with LEFT JOIN and replace missing totals with zero.",
      "Fetch all employees in one request instead of issuing one query per employee. Compare the grouped query with indexed correlated subqueries when the outer roster is highly selective.",
      "Use a partial index for approved leave, with the search date first and employee ID available for grouping.",
    ],
    solution: `WITH worked AS (
  SELECT employee_id, SUM(minutes_worked) AS total_minutes
  FROM attendance
  WHERE work_date >= '2026-01-01' AND work_date < '2026-02-01'
  GROUP BY employee_id
), approved AS (
  SELECT employee_id, COUNT(*) AS approved_entries
  FROM leave_entries
  WHERE status = 'approved'
    AND leave_date >= '2026-01-01' AND leave_date < '2026-02-01'
  GROUP BY employee_id
)
SELECT e.id, COALESCE(w.total_minutes, 0) AS total_minutes,
       COALESCE(a.approved_entries, 0) AS approved_entries
FROM employees AS e
LEFT JOIN worked AS w ON w.employee_id = e.id
LEFT JOIN approved AS a ON a.employee_id = e.id
WHERE e.active = 1
ORDER BY e.id;`,
    index: `CREATE INDEX attendance_month
ON attendance(work_date, employee_id, minutes_worked);

CREATE INDEX approved_leave_month
ON leave_entries(leave_date, employee_id) WHERE status = 'approved';`,
  },
  {
    id: "payroll",
    title: "Top two payroll totals per department",
    topic: "Aggregate before ranking and preserve ties",
    prompt:
      "Rank active employees by January payroll total inside each department. Return the top two distinct totals, including all employees tied at second place. Exclude employees without January payroll.",
    starter: `SELECT employee_id, pay_date, amount_cents
FROM payroll
ORDER BY pay_date, employee_id;`,
    steps: [
      "Filter January and sum payroll components in integer cents at employee grain.",
      "Join to active employees and partition DENSE_RANK by department. Order the window by pay alone so ties share a rank.",
      "Keep ranks one and two. Use employee ID only for deterministic display after ranking.",
      "Try the covering index on the fact table and check whether the rank still needs a sort. The index orders individual entries while the rank orders computed totals.",
    ],
    solution: `WITH totals AS (
  SELECT employee_id, SUM(amount_cents) AS total_cents
  FROM payroll
  WHERE pay_date >= '2026-01-01' AND pay_date < '2026-02-01'
  GROUP BY employee_id
), ranked AS (
  SELECT e.department, e.id, t.total_cents,
         DENSE_RANK() OVER (
           PARTITION BY e.department ORDER BY t.total_cents DESC
         ) AS pay_rank
  FROM totals AS t
  JOIN employees AS e ON e.id = t.employee_id
  WHERE e.active = 1
)
SELECT department, id, total_cents, pay_rank
FROM ranked
WHERE pay_rank <= 2
ORDER BY department, pay_rank, id;`,
    index: `CREATE INDEX payroll_month
ON payroll(pay_date, employee_id, amount_cents);`,
  },
  {
    id: "streaks",
    title: "Longest attendance streak",
    topic: "Window functions and gaps-and-islands",
    prompt:
      "Find each employee’s longest January streak of consecutive calendar days with attendance. Count split shifts once, break ties by earliest start, and omit employees with no attendance.",
    starter: `SELECT employee_id, work_date
FROM attendance
WHERE work_date >= '2026-01-01' AND work_date < '2026-02-01'
ORDER BY employee_id, work_date;`,
    steps: [
      "Select distinct employee and date pairs inside the month.",
      "Number each employee’s days in date order. Subtract that row number from the Julian day to get a constant key within each consecutive run.",
      "Summarize each run and rank it by descending length and ascending start date.",
      "Compare the date-first covering index with an employee-first index. The date-first key can narrow the month range. Employee-first order may help when querying one employee.",
    ],
    solution: `WITH days AS (
  SELECT DISTINCT employee_id, work_date
  FROM attendance
  WHERE work_date >= '2026-01-01' AND work_date < '2026-02-01'
), islands AS (
  SELECT employee_id, work_date, julianday(work_date) -
         ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY work_date) AS grp
  FROM days
), streaks AS (
  SELECT employee_id, MIN(work_date) AS start_date,
         MAX(work_date) AS end_date, COUNT(*) AS days
  FROM islands
  GROUP BY employee_id, grp
), ranked AS (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY employee_id ORDER BY days DESC, start_date
  ) AS rn
  FROM streaks
)
SELECT employee_id, start_date, end_date, days
FROM ranked
WHERE rn = 1
ORDER BY employee_id;`,
    index: `CREATE INDEX attendance_days ON attendance(work_date, employee_id);`,
  },
  {
    id: "paging",
    title: "Page through the payroll audit feed",
    topic: "Keyset pagination and composite keys",
    prompt:
      "Return the next three entries after the cursor ('2026-01-31', 4) in descending date and ID order. Include remaining entries on the cursor date.",
    starter: `SELECT id, employee_id, pay_date, amount_cents
FROM payroll
ORDER BY pay_date DESC, id DESC
LIMIT 3 OFFSET 4;`,
    steps: [
      "Include both date and ID in the cursor so records on the same date have an unambiguous position.",
      "Use a strict tuple comparison to exclude the last row of the previous page. In SQL Server, write pay_date < @date OR (pay_date = @date AND id < @id).",
      "Order by the same keys and keep the page size. Carry the last row’s keys to the next request. For a consistent audit snapshot, use stable sort keys and snapshot semantics.",
      "Compare the two plans with the same index. Deep offsets must walk skipped entries, while a seek can start at the cursor boundary.",
    ],
    solution: `SELECT id, employee_id, pay_date, amount_cents
FROM payroll
WHERE (pay_date, id) < ('2026-01-31', 4)
ORDER BY pay_date DESC, id DESC
LIMIT 3;`,
    index: `CREATE INDEX payroll_feed ON payroll(pay_date DESC, id DESC);`,
  },
  {
    id: "hierarchy",
    title: "Manager’s reporting tree",
    topic: "Recursive CTEs and indexed joins",
    prompt:
      "List all direct and indirect reports of manager 1, including each report’s depth. Exclude the manager. Traverse through inactive employees but only display active reports.",
    starter: `SELECT id, name, manager_id
FROM employees
WHERE manager_id = 1 AND active = 1
ORDER BY id;`,
    steps: [
      "Seed recursion with manager 1 and depth zero.",
      "Join reports on manager_id and add one to depth. Record visited IDs in each path to guard against cycles.",
      "Apply the active filter to the final rows so an inactive manager cannot hide active reports.",
      "Index manager_id and inspect the recursive join. Test shallow and deep trees separately when comparing plans.",
    ],
    solution: `WITH RECURSIVE reports(id, name, active, depth, path) AS (
  SELECT id, name, active, 0, '/' || id || '/'
  FROM employees WHERE id = 1
  UNION ALL
  SELECT e.id, e.name, e.active, r.depth + 1, r.path || e.id || '/'
  FROM reports AS r
  JOIN employees AS e ON e.manager_id = r.id
  WHERE instr(r.path, '/' || e.id || '/') = 0
)
SELECT id, name, depth
FROM reports
WHERE depth > 0 AND active = 1
ORDER BY depth, id;`,
    index: `CREATE INDEX employee_manager ON employees(manager_id);`,
  },

  {
    id: "department-counts",
    title: "Department headcount including zeroes",
    topic: "Outer joins and conditional aggregation",
    prompt:
      "Count active employees in every department on the roster, including departments with zero active employees. Include the requested Finance department even though it has no employee records.",
    starter: "SELECT DISTINCT department FROM employees ORDER BY department;",
    steps: [
      "Build a department list from the roster and union in Finance. In production, use the department master table.",
      "Left join employee rows and put the active predicate in ON to keep empty departments.",
      "Count the matched employee IDs. COUNT(*) would count the placeholder row for Finance.",
    ],
    solution: `WITH departments AS (
  SELECT department FROM employees
  UNION SELECT 'Finance'
)
SELECT d.department, COUNT(e.id) AS active_count
FROM departments AS d
LEFT JOIN employees AS e ON e.department = d.department AND e.active = 1
GROUP BY d.department
ORDER BY d.department;`,
    index:
      "CREATE INDEX active_department ON employees(department) WHERE active = 1;",
  },
  {
    id: "payroll-rank",
    title: "Rank every employee by January pay",
    topic: "NULL handling, totals, and ranking",
    prompt:
      "Show every employee’s January gross pay in cents and rank all employees by total. Give employees without payments zero and preserve ties.",
    starter:
      "SELECT employee_id, amount_cents FROM payroll ORDER BY employee_id;",
    steps: [
      "Sum January components at employee grain using a half-open range.",
      "Left join the totals to the roster and use COALESCE for missing payroll.",
      "Use DENSE_RANK on the computed total. Sort ties by employee ID in the final output.",
    ],
    solution: `WITH totals AS (
  SELECT employee_id, SUM(amount_cents) AS gross
  FROM payroll
  WHERE pay_date >= '2026-01-01' AND pay_date < '2026-02-01'
  GROUP BY employee_id
), roster AS (
  SELECT e.id, COALESCE(t.gross, 0) AS gross
  FROM employees AS e LEFT JOIN totals AS t ON t.employee_id = e.id
)
SELECT id, gross, DENSE_RANK() OVER (ORDER BY gross DESC) AS pay_rank
FROM roster
ORDER BY pay_rank, id;`,
    index:
      "CREATE INDEX payroll_month ON payroll(pay_date, employee_id, amount_cents);",
  },
  {
    id: "rolling-attendance",
    title: "Flag rolling seven-day attendance load",
    topic: "Rolling windows and range lookups",
    prompt:
      "For each January day with logged attendance, flag employees who logged at least four shifts that day and the previous six calendar days combined. Include December records inside the first rolling window.",
    starter:
      "SELECT employee_id, work_date FROM attendance ORDER BY employee_id, work_date;",
    steps: [
      "Choose distinct January employee and date pairs as anchors.",
      "For each anchor, count shifts between its date minus six days and the anchor, inclusive. Apply the date calculation to the anchor instead of the indexed shift date.",
      "Group by anchor and filter with HAVING. Try the employee/date index for each range lookup.",
    ],
    solution: `WITH anchors AS (
  SELECT DISTINCT employee_id, work_date
  FROM attendance
  WHERE work_date >= '2026-01-01' AND work_date < '2026-02-01'
)
SELECT a.employee_id, a.work_date, COUNT(*) AS shift_count
FROM anchors AS a
JOIN attendance AS s ON s.employee_id = a.employee_id
  AND s.work_date BETWEEN date(a.work_date, '-6 days') AND a.work_date
GROUP BY a.employee_id, a.work_date
HAVING COUNT(*) >= 4
ORDER BY a.employee_id, a.work_date;`,
    index:
      "CREATE INDEX employee_shift_date ON attendance(employee_id, work_date);",
  },
  {
    id: "running-payroll",
    title: "Running payroll with opening balances",
    topic: "Window frames and stable event order",
    prompt:
      "For every January payroll entry, show its employee’s cumulative cents through that entry, including payments before January. Break same-day ties by entry ID.",
    starter:
      "SELECT id, employee_id, pay_date, amount_cents FROM payroll ORDER BY employee_id, pay_date, id;",
    steps: [
      "Compute SUM OVER per employee, ordered by pay_date and ID with an explicit ROWS frame.",
      "Keep older entries in the input to preserve opening balances. Exclude future entries early.",
      "Filter January in the outer query. Compare how the employee/date/ID index serves the window order.",
    ],
    solution: `WITH running AS (
  SELECT id, employee_id, pay_date,
         SUM(amount_cents) OVER (
           PARTITION BY employee_id ORDER BY pay_date, id
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
         ) AS running_cents
  FROM payroll
  WHERE pay_date < '2026-02-01'
)
SELECT employee_id, id, pay_date, running_cents
FROM running
WHERE pay_date >= '2026-01-01'
ORDER BY employee_id, pay_date, id;`,
    index:
      "CREATE INDEX employee_pay_order ON payroll(employee_id, pay_date, id, amount_cents);",
  },
  {
    id: "missing-payroll",
    title: "Find active employees without February payroll",
    topic: "Anti-joins and NULL-safe existence checks",
    prompt:
      "List active employees who have no February payroll entry, including employees who received payroll in January.",
    starter: "SELECT id, name FROM employees WHERE active = 1 ORDER BY id;",
    steps: [
      "Start with active roster entries.",
      "Use a correlated NOT EXISTS with both employee ID and the February date range.",
      "Inspect the plan with and without an index on employee and pay date.",
    ],
    solution: `SELECT e.id, e.name
FROM employees AS e
WHERE e.active = 1 AND NOT EXISTS (
  SELECT 1 FROM payroll AS p
  WHERE p.employee_id = e.id
    AND p.pay_date >= '2026-02-01' AND p.pay_date < '2026-03-01'
)
ORDER BY e.id;`,
    index: "CREATE INDEX employee_pay_date ON payroll(employee_id, pay_date);",
  },
  {
    id: "manager-chain",
    title: "Walk an employee’s manager chain",
    topic: "Recursive CTEs and primary-key lookups",
    prompt:
      "Starting from employee 6, return each ancestor up to the head of the organization, closest first. Include inactive managers and guard against cycles.",
    starter: "SELECT id, name, manager_id FROM employees WHERE id = 6;",
    steps: [
      "Anchor at the requested employee. Then follow manager_id to the next employee’s primary key.",
      "Track visited IDs with delimiters and stop on repeats. A NULL manager naturally ends the chain.",
      "Exclude the anchor and order by depth. The existing primary key supports the parent lookup.",
    ],
    solution: `WITH RECURSIVE chain(id, name, manager_id, depth, path) AS (
  SELECT id, name, manager_id, 0, '/' || id || '/' FROM employees WHERE id = 6
  UNION ALL
  SELECT e.id, e.name, e.manager_id, c.depth + 1, c.path || e.id || '/'
  FROM chain AS c JOIN employees AS e ON e.id = c.manager_id
  WHERE instr(c.path, '/' || e.id || '/') = 0
)
SELECT id, name, depth
FROM chain
WHERE depth > 0
ORDER BY depth;`,
  },
  {
    id: "monthly-growth",
    title: "Month-over-month payroll growth",
    topic: "Calendar scaffolding, LAG, and NULLIF",
    prompt:
      "Show January and February payroll by department with the previous calendar month’s total and growth percentage. Start the comparison in January. Use zero for empty months and leave growth unknown when the prior period is outside the report or had zero payroll.",
    starter:
      "SELECT employee_id, pay_date, amount_cents FROM payroll ORDER BY pay_date;",
    steps: [
      "Build the calendar months and department list, then cross join to scaffold missing combinations.",
      "Summarize payroll once at department/month grain and left join to the scaffold.",
      "Use LAG over each department’s calendar and divide by NULLIF(previous, 0). Calculate percentages using decimal arithmetic.",
    ],
    solution: `WITH months(month_start) AS (
  VALUES ('2026-01-01'), ('2026-02-01')
), departments AS (
  SELECT DISTINCT department FROM employees
), totals AS (
  SELECT e.department, date(p.pay_date, 'start of month') AS month_start,
         SUM(p.amount_cents) AS gross_cents
  FROM payroll AS p JOIN employees AS e ON e.id = p.employee_id
  WHERE p.pay_date >= '2026-01-01' AND p.pay_date < '2026-03-01'
  GROUP BY e.department, date(p.pay_date, 'start of month')
), monthly AS (
  SELECT d.department, m.month_start, COALESCE(t.gross_cents, 0) AS gross_cents
  FROM departments AS d CROSS JOIN months AS m
  LEFT JOIN totals AS t ON t.department = d.department AND t.month_start = m.month_start
), comparison AS (
  SELECT *, LAG(gross_cents) OVER (
    PARTITION BY department ORDER BY month_start
  ) AS previous_cents
  FROM monthly
)
SELECT department, month_start, gross_cents, previous_cents,
       ROUND(100.0 * (gross_cents - previous_cents) / NULLIF(previous_cents, 0), 2) AS growth_pct
FROM comparison
ORDER BY department, month_start;`,
    index:
      "CREATE INDEX payroll_month ON payroll(pay_date, employee_id, amount_cents);",
  },
];
