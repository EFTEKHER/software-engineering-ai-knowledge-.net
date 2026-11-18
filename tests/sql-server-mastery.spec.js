import { test, expect } from "@playwright/test";

test("opens SQL Server Mastery, reads a module, and keeps progress", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^SQL Server Mastery/ }).click();
  await expect(page).toHaveURL(/#sql-server$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "SQL Server Mastery" }),
  ).toBeVisible();
  await expect(page.getByText("25 modules", { exact: false })).toBeVisible();

  // Overview lists all six parts and the setup script
  await expect(
    page.getByRole("heading", { name: /Part VI · Design and Practice/ }),
  ).toHaveCount(2);
  await expect(
    page.getByText("CREATE TABLE dbo.Transactions").first(),
  ).toBeVisible();

  // Open Joins from the sidebar
  const sidebar = page.getByRole("navigation", { name: "SQL Server modules" });
  await sidebar.getByRole("button", { name: /^5\s*Joins/ }).click();
  await expect(page).toHaveURL(/#sql-server\/joins$/);
  await expect(
    page.getByRole("heading", { level: 2, name: "5. Joins" }),
  ).toBeVisible();
  await expect(page.getByText("LEFT JOIN and the WHERE trap")).toHaveCount(2);
  // bilingual by default
  await expect(page.locator('p[lang="bn"]').first()).toBeVisible();
  // highlighted T-SQL code
  await expect(page.locator(".sqlm-code .tk-kw").first()).toBeVisible();

  // Copy button works
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: "Copy SQL code" }).first().click();
  await expect(page.getByText("Copied").first()).toBeVisible();

  // English only hides Bangla paragraphs
  await page.getByLabel("Language").selectOption("English");
  await expect(page.locator('.sqlm-main p[lang="bn"]')).toHaveCount(0);
  await page.getByLabel("Language").selectOption("বাংলা + EN");

  // Mark complete + next module
  await page.getByRole("button", { name: "Mark module complete" }).click();
  await expect(
    page.getByRole("button", { name: "Module completed" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Next\s*6\. Aggregation/ }).click();
  await expect(page).toHaveURL(/#sql-server\/aggregation-grouping$/);

  // Deep link + reload keeps the module and progress
  await page.reload();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "6. Aggregation and Grouping",
    }),
  ).toBeVisible();
  await expect(sidebar.getByLabel("Completed")).toHaveCount(1);

  // Escape does not throw the learner out of the page
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/#sql-server\/aggregation-grouping$/);

  // Search filters modules
  await page.getByPlaceholder(/Search topics/).fill("NOLOCK");
  await expect(page.getByRole("status")).toContainText("1 module match");
  await expect(
    sidebar.getByRole("button", { name: /Transactions, Isolation/ }),
  ).toBeVisible();
});

test("SQL Server Mastery works on a phone", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 800 },
  });
  const page = await context.newPage();
  await page.goto("/#sql-server/window-functions");
  await expect(
    page.getByRole("heading", { level: 2, name: "10. Window Functions" }),
  ).toBeVisible();
  await page.getByLabel("Jump to module").selectOption("indexes");
  await expect(page).toHaveURL(/#sql-server\/indexes$/);
  await expect(
    page.getByRole("heading", { level: 2, name: "20. Indexes" }),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await context.close();
});
