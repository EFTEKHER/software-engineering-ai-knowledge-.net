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
  ];

  await page.reload();
  const challenges = page.getByRole("navigation", { name: "HRMS challenges" });
  for (const [title, expected] of checks) {
    await challenges.getByRole("button", { name: title }).click();
    await page.getByText("Step-by-step solution").click();
    await page.getByRole("button", { name: "Load solution" }).click();
    for (const indexed of [false, true]) {
      await page.getByLabel("Apply suggested indexes").setChecked(indexed);
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
  await page.getByText("Sample database schema and data").click();
  await page.getByText("Step-by-step solution").click();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(360);
});
