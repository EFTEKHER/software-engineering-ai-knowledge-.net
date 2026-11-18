import { test, expect } from "@playwright/test";

test("runs the HRMS exercises and compares indexed plans", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "SQL Optimization", exact: true })
    .click();
  await expect(page).toHaveURL(/#sql-optimization$/);
  await expect(
    page.getByRole("heading", { name: "SQL Query Optimization" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Explain plan" }).click();
  await expect(page.getByRole("table")).toContainText("SCAN attendance");

  await page.getByText("Step-by-step solution").click();
  await page.getByRole("button", { name: "Load solution" }).click();
  await page.getByLabel("Apply suggested indexes").check();
  await page.getByRole("button", { name: "Explain plan" }).click();
  await expect(page.getByRole("table")).toContainText(
    "SEARCH attendance USING COVERING INDEX attendance_month",
  );

  const checks = [
    [
      "Monthly attendance by employee",
      [
        ["2", "1920"],
        ["3", "900"],
        ["4", "880"],
        ["5", "480"],
      ],
    ],
    [
      "Attendance and leave dashboard",
      [
        ["1", "0", "0"],
        ["2", "1920", "2"],
        ["3", "900", "0"],
        ["4", "880", "0"],
        ["6", "0", "0"],
      ],
    ],
    [
      "Top two payroll totals per department",
      [
        ["Engineering", "2", "850000", "1"],
        ["Engineering", "3", "700000", "2"],
        ["Engineering", "6", "700000", "2"],
        ["Operations", "4", "500000", "1"],
        ["People", "1", "950000", "1"],
      ],
    ],
    [
      "Longest attendance streak",
      [
        ["2", "2026-01-01", "2026-01-03", "3"],
        ["3", "2026-01-01", "2026-01-02", "2"],
        ["4", "2026-01-10", "2026-01-10", "1"],
        ["5", "2026-01-10", "2026-01-10", "1"],
      ],
    ],
    [
      "Page through the payroll audit feed",
      [
        ["3", "3", "2026-01-31", "700000"],
        ["2", "2", "2026-01-31", "800000"],
        ["1", "1", "2026-01-31", "950000"],
      ],
    ],
    [
      "Manager’s reporting tree",
      [
        ["2", "Rafi", "1"],
        ["4", "Ishan", "1"],
        ["3", "Nila", "2"],
        ["6", "Sami", "2"],
      ],
    ],
    [
      "Department headcount including zeroes",
      [
        ["Engineering", "3"],
        ["Finance", "0"],
        ["Operations", "1"],
        ["People", "1"],
      ],
    ],
    [
      "Rank every employee by January pay",
      [
        ["1", "950000", "1"],
        ["2", "850000", "2"],
        ["3", "700000", "3"],
        ["6", "700000", "3"],
        ["4", "500000", "4"],
        ["5", "0", "5"],
      ],
    ],
    [
      "Flag rolling seven-day attendance load",
      [
        ["2", "2026-01-03", "5"],
        ["2", "2026-01-05", "6"],
      ],
    ],
    [
      "Running payroll with opening balances",
      [
        ["1", "1", "2026-01-31", "950000"],
        ["2", "2", "2026-01-31", "1580000"],
        ["2", "5", "2026-01-31", "1630000"],
        ["3", "3", "2026-01-31", "700000"],
        ["4", "4", "2026-01-31", "500000"],
        ["6", "6", "2026-01-31", "700000"],
      ],
    ],
    [
      "Find active employees without February payroll",
      [
        ["1", "Amina"],
        ["3", "Nila"],
        ["4", "Ishan"],
        ["6", "Sami"],
      ],
    ],
    [
      "Walk an employee’s manager chain",
      [
        ["5", "Tara", "1"],
        ["1", "Amina", "2"],
      ],
    ],
    [
      "Month-over-month payroll growth",
      [
        ["Engineering", "2026-01-01", "2250000", "NULL", "NULL"],
        ["Engineering", "2026-02-01", "810000", "2250000", "-64"],
        ["Operations", "2026-01-01", "500000", "NULL", "NULL"],
        ["Operations", "2026-02-01", "0", "500000", "-100"],
        ["People", "2026-01-01", "950000", "NULL", "NULL"],
        ["People", "2026-02-01", "0", "950000", "-100"],
      ],
    ],
  ];

  await page.reload();
  const challenges = page.getByRole("navigation", { name: "HRMS challenges" });
  for (const [title, expected] of checks) {
    await challenges.getByRole("button", { name: title }).click();
    await page.getByText("Step-by-step solution").click();
    await page.getByRole("button", { name: "Load solution" }).click();
    const indexToggle = page.getByLabel("Apply suggested indexes");
    const indexOptions = (await indexToggle.count()) ? [false, true] : [false];
    for (const indexed of indexOptions) {
      if (indexed) await indexToggle.check();
      await page.getByRole("button", { name: "Run query" }).click();
      const rows = page.locator(".hrms-results tbody tr");
      await expect(rows).toHaveCount(expected.length);
      expect(
        await rows.evaluateAll((items) =>
          items.map((row) => Array.from(row.cells, (cell) => cell.textContent)),
        ),
      ).toEqual(expected);
    }
  }

  await page.getByRole("button", { name: "Playground", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "SQL Query Optimization" }),
  ).toHaveCount(0);
  await expect(page).not.toHaveURL(/#sql-optimization$/);
});

test("opens the module from mobile navigation without page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Mobile workspace" })
    .getByRole("button", { name: "SQL Optimization" })
    .click();
  await expect(
    page.getByRole("heading", { name: "SQL Query Optimization" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Browse the full SQL curriculum" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Full SQL curriculum" }),
  ).toBeFocused();
  await expect(page).toHaveURL(/#sql-optimization$/);
  const curriculum = page.getByRole("region", { name: "Full SQL curriculum" });
  const chapters = curriculum.locator("summary");
  await expect(chapters).toHaveCount(25);
  await expect(curriculum.locator("dt")).toHaveCount(121);
  await curriculum
    .getByText("14. Stored Procedures and Functions", { exact: true })
    .click();
  await expect(
    curriculum.getByText("14.5 Table-valued parameters"),
  ).toBeVisible();
  await curriculum
    .getByText("22. Execution Plans, SARGability, and Parameter Sniffing", {
      exact: true,
    })
    .click();
  await expect(curriculum.getByText("22.4 Query Store")).toBeVisible();
  await page.getByText("Sample database schema and data").click();
  await page.getByText("Step-by-step solution").click();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(360);
});
