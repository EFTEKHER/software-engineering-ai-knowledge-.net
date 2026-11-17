import { test, expect } from "@playwright/test";
test("Banking guide teaches separate Windows, Linux and live procedures", async ({
  page,
}) => {
  await page.goto("/#bank");
  await expect(
    page.getByRole("heading", { name: "Small steps. Safe releases." }),
  ).toBeVisible();
  await expect(page.locator("#bank-windows")).toContainText("Hosting Bundle");
  await page
    .getByRole("button", { name: "Linux · systemd + Nginx", exact: true })
    .click();
  await expect(page.locator("#bank-linux")).toContainText(
    "systemctl enable --now bankapi",
  );
  await expect(page.locator("#bank-windows")).toHaveCount(0);
  await page.getByRole("button", { name: "Show both", exact: true }).click();
  await expect(page.locator("#bank-windows")).toBeVisible();
  await expect(page.locator("#bank-live")).toContainText(
    "App rollback does not undo transactions",
  );
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Small steps. Safe releases." }),
  ).toBeVisible();
});
test("Banking guide fits mobile with both operating systems", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/#bank");
  await page.getByRole("button", { name: "Show both", exact: true }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .locator("#bank-linux")
    .screenshot({ path: "work/banking-linux-mobile.png" });
});
