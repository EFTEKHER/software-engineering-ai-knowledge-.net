import { test, expect } from "@playwright/test";
const open = async (page, m, t) => {
  await page.goto(`/#lesson/${m}/${t}`, { waitUntil: "domcontentloaded" });
  await expect(page.locator(".reference-banner")).toBeAttached();
};
test("Every module loads its expanded chapter with multiple worked examples", async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (let m = 0; m < 17; m++) {
    await open(page, m, 0);
    await expect(page.locator(".reference-example").nth(1)).toBeAttached();
    await expect(page.locator(".reference-prose").nth(1)).toBeAttached();
    await expect(
      page.locator(".reference-prose .bn-text").first(),
    ).toBeAttached();
  }
  expect(errors).toEqual([]);
});
test("Expanded SQL query runs and the LINQ companion has its own fixture", async ({
  page,
}) => {
  await open(page, 2, 1);
  const sql = page
    .locator(".reference-example")
    .filter({ has: page.getByRole("button", { name: "Run SQL / চালান", exact: true }) })
    .first();
  await sql
    .getByRole("button", { name: "Run SQL / চালান", exact: true })
    .click();
  await expect(sql.locator(".sql-output")).toContainText(/row/);
  await expect(
    page.locator(".reference-example").filter({ hasText: "record Employee" }),
  ).toHaveCount(1);
});
test("Reference code search and chapter contents controls work", async ({
  page,
}) => {
  await open(page, 3, 5);
  await page.getByLabel("Find within reference").fill("UpperBound");
  await expect(page.locator(".reference-example")).toHaveCount(1);
  await expect(page.locator(".reference-example")).toContainText("UpperBound");
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(page.locator(".reference-example").nth(2)).toBeAttached();
  await page
    .getByRole("button", { name: "Questions & answers", exact: true })
    .click();
  await expect(page.locator(".reference-questions")).toBeInViewport();
  await page.locator(".reference-questions summary").first().click();
  await expect(
    page.locator(".reference-questions details").first(),
  ).toContainText("shrinking interval");
});
test("Markdown chapter download and related-topic links work", async ({
  page,
}) => {
  await open(page, 3, 5);
  const download = page.waitForEvent("download");
  await page.getByLabel("Download reference chapter", { exact: true }).click();
  expect((await download).suggestedFilename()).toBe(
    "Binary-Search-reference.md",
  );
  const related = page.locator(".reference-connections>div a").first();
  const title = await related.innerText();
  await related.click();
  await expect(page.locator("#lesson-title")).toHaveText(title.trim());
  await expect(page.locator(".reference-banner")).toBeAttached();
});
test("Expanded reference supports Bangla mode and mobile width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, 3, 5);
  await page.getByLabel("Lesson language").selectOption("বাংলা");
  await expect(page.locator(".reference-prose").first()).toContainText(
    "সম্ভাবনার",
  );
  expect(
    await page
      .locator(".rich-reader")
      .evaluate((e) => e.scrollWidth <= e.clientWidth),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Deep reference / বিস্তৃত পাঠ", exact: true })
    .click();
  await page.waitForTimeout(400);
  await expect(page.locator(".reference-banner")).toBeInViewport();
});

test("All backend topics provide runnable C# starters and beginner steps", async ({
  page,
}) => {
  test.setTimeout(90000);
  for (let t = 0; t < 20; t++) {
    await open(page, 7, t);
    await expect(page.locator(".reference-example").nth(4)).toBeAttached();
    await expect(page.locator(".backend-reading-steps li")).toHaveCount(4);
    await expect(page.locator(".backend-example-setup").nth(2)).toBeAttached();
    await expect(page.locator(".backend-example-setup").first()).toContainText(
      "dotnet new console",
    );
    await expect(page.locator(".backend-expected-output").nth(1)).toBeAttached();
    await page.evaluate(() =>
      document
        .querySelectorAll(".backend-expected-output")
        .forEach((d) => (d.open = true)),
    );
    await expect(
      page.locator(".backend-expected-output").filter({ hasText: "All checks passed" }).first(),
    ).toBeVisible();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page
      .locator(".rich-reader")
      .evaluate((e) => e.scrollWidth <= e.clientWidth),
  ).toBe(true);
});

test("Backend chapter export includes local setup and bilingual steps", async ({
  page,
}) => {
  await open(page, 7, 11);
  const pending = page.waitForEvent("download");
  await page.getByLabel("Download reference chapter", { exact: true }).click();
  const download = await pending;
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const markdown = Buffer.concat(chunks).toString("utf8");
  expect(markdown).toContain("dotnet new web -n TeaApi");
  expect(markdown).toContain("All checks passed");
  expect(markdown).toContain("C#-এর ধাপ ধরে পড়ুন");
});
