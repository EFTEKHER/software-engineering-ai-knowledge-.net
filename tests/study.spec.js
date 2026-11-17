import { test, expect } from "@playwright/test";
test("C# spotlight opens its separate module and backend lessons load", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("region", { name: "C# study module" }),
  ).toContainText("39 focused lessons");
  await page.getByRole("button", { name: "Start C#", exact: true }).click();
  await expect(page).toHaveURL(/#lesson\/17\/0$/);
  await expect(page.locator("#lesson-title")).toHaveText(
    "Setup & first program",
  );
  await page.goto("/#lesson/17/38");
  await expect(page.locator("#lesson-title")).toHaveText(
    "IEnumerable vs IQueryable & Deferred Execution",
  );
  await page.goto("/#lesson/18/0");
  await expect(page.locator("#lesson-title")).toHaveText(
    "Cancellation Tokens & Timeouts",
  );
});
test("C# spotlight fits a mobile screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Start C#", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "work/csharp-mobile.png", fullPage: false });
});
