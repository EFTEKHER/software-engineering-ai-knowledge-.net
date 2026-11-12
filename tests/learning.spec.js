import { test, expect } from "@playwright/test";
import curriculum from "../src/curriculum.json" with { type: "json" };
const openLesson = async (page, m, t) => {
  await page.goto(`/#lesson/${m}/${t}`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#lesson-title")).toHaveText(
    curriculum[m].topics[t],
  );
};
test("Every curriculum topic opens with theory, annotated code, and a diagram", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await openLesson(page, 0, 0);
  for (const m of curriculum) {
    for (let t = 0; t < m.topics.length; t++) {
      await page.evaluate((hash) => {
        window.location.hash = hash;
      }, `#lesson/${m.id}/${t}`);
      await expect(page.locator("#lesson-title")).toHaveText(m.topics[t]);
      await expect(page.locator(".intuition-box")).toBeVisible();
      await expect(page.locator(".code-line").first()).toBeAttached();
      await expect(page.locator(".interactive-diagram")).toBeAttached();
    }
  }
  expect(errors).toEqual([]);
});
test("SQL executes and resets a real isolated database", async ({ page }) => {
  await openLesson(page, 2, 1);
  await page
    .locator("#code")
    .getByRole("button", { name: "Run SQL / চালান", exact: true })
    .click();
  await expect(page.locator(".sql-output")).toContainText("Ayesha");
  await expect(page.locator(".sql-output")).toContainText("4 rows");
  await page
    .locator("#code")
    .getByRole("button", { name: "Edit", exact: true })
    .click();
  await page
    .locator("#code")
    .getByRole("textbox", { name: "Edit lesson code" })
    .fill("SELECT COUNT(*) AS Total FROM Employees;");
  await page
    .locator("#code")
    .getByRole("button", { name: "Run SQL / চালান", exact: true })
    .click();
  await expect(page.locator(".sql-output table")).toContainText("6");
  await page
    .locator("#code")
    .getByRole("button", { name: "Reset database", exact: true })
    .click();
  await expect(page.locator(".sql-output")).toContainText(
    "Sample tables restored",
  );
});
test("All 20 SQL examples execute without errors", async ({ page }) => {
  test.setTimeout(120000);
  for (let t = 0; t < 20; t++) {
    await openLesson(page, 2, t);
    await page
      .locator("#code")
      .getByRole("button", { name: "Run SQL / চালান", exact: true })
      .click();
    await expect(page.locator(".sql-output")).toBeVisible();
    await expect(page.locator(".lab-error")).toHaveCount(0);
  }
});
test("Binary search input and diagram stepping produce a real trace", async ({
  page,
}) => {
  await openLesson(page, 3, 5);
  await page.getByLabel("Array values").fill("1,3,5,7,9");
  await page.getByLabel("Target value").fill("7");
  await expect(page.getByLabel("Diagram speed")).toHaveValue("1");
  await page.getByLabel("Diagram speed").selectOption("2");
  await page.getByLabel("Next diagram step", { exact: true }).click();
  await expect(page.locator(".step-caption")).toContainText("7");
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(page.locator(".step-caption")).toContainText("Found 7");
});
test("A code line opens its own Bangla and English explanation", async ({
  page,
}) => {
  await openLesson(page, 3, 0);
  await page
    .getByRole("button", { name: "Explain line 2", exact: true })
    .click();
  await expect(page.locator(".line-explanation")).toContainText(
    "Index zero reads the first element",
  );
  await expect(page.locator(".line-explanation")).toContainText("প্রথম মান");
});
test("Progress, topic notes, bookmarks and notebook export persist", async ({
  page,
}) => {
  await openLesson(page, 0, 0);
  await page
    .getByLabel("Topic notes", { exact: true })
    .fill("আমার Git শেখার প্রথম নোট");
  await page.getByLabel("Bookmark topic", { exact: true }).click();
  await page
    .getByRole("button", { name: "বুঝেছি · Mark complete", exact: true })
    .click();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByLabel("Topic notes", { exact: true })).toHaveValue(
    "আমার Git শেখার প্রথম নোট",
  );
  await expect(
    page.getByRole("button", { name: "Completed", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Learning path", exact: true })
    .click();
  await page.getByRole("button", { name: "My notebook", exact: true }).click();
  await expect(page.locator(".saved-topic-grid")).toContainText(
    "আমার Git শেখার প্রথম নোট",
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export", exact: true }).click();
  expect((await download).suggestedFilename()).toBe(
    "dotnet-mastery-notebook.json",
  );
});
test("Bangla search opens the matching lesson", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page
    .getByRole("button", { name: "Search anything... ⌘ K", exact: true })
    .click();
  await page
    .getByPlaceholder("Search 320 concepts, commands, and modules...")
    .fill("অভিধানের");
  await expect(page.locator(".search-results")).toContainText("Binary Search");
  await page.locator(".search-results button").first().click();
  await expect(page.locator("#lesson-title")).toHaveText("Binary Search");
});
test("Practice answer feedback and model explanation work", async ({
  page,
}) => {
  await openLesson(page, 0, 0);
  await page.locator(".quiz-options button").first().click();
  await expect(page.locator(".quiz-feedback")).toContainText("Correct");
  await page
    .getByRole("button", { name: "Show model answer / নমুনা উত্তর", exact: true })
    .click();
  await expect(page.locator(".model-answer")).toContainText(
    "Create a repository",
  );
});
test("Mobile has no page overflow and supports lesson navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openLesson(page, 3, 5);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(
    await page
      .locator(".rich-reader")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  await page.getByRole("button", { name: "Next concept", exact: true }).click();
  await expect(page.locator("#lesson-title")).toHaveText("Stack and Queue");
});
test("Traffic/failure model is interactive and explicitly labeled", async ({
  page,
}) => {
  await openLesson(page, 8, 0);
  await page
    .getByRole("button", { name: "Simulate node failure", exact: true })
    .click();
  await expect(page.locator(".model-metrics")).toContainText("Unavailable");
  await page
    .getByRole("button", { name: "Restore node / ফিরিয়ে আনুন", exact: true })
    .click();
  await expect(page.locator(".model-metrics")).not.toContainText("Unavailable");
});

test("An unbounded SQL query is stopped without freezing the page", async ({
  page,
}) => {
  await openLesson(page, 2, 0);
  await page
    .locator("#code")
    .getByRole("button", { name: "Edit", exact: true })
    .click();
  await page
    .locator("#code")
    .getByRole("textbox", { name: "Edit lesson code" })
    .fill(
      "WITH RECURSIVE seq(x) AS (VALUES(1) UNION ALL SELECT x+1 FROM seq) SELECT sum(x) FROM seq;",
    );
  await page
    .locator("#code")
    .getByRole("button", { name: "Run SQL / চালান", exact: true })
    .click();
  await expect(page.locator(".lab-error")).toContainText(
    "Query stopped after 5 seconds",
    { timeout: 12000 },
  );
  await page
    .locator("#code")
    .getByRole("button", { name: "Reset database", exact: true })
    .click();
  await expect(page.locator(".sql-output")).toContainText(
    "Sample tables restored",
  );
});
test("Lesson language switches the theory and persists after reload", async ({
  page,
}) => {
  await openLesson(page, 3, 0);
  await page.getByLabel("Lesson language").selectOption("English");
  await expect(page.locator(".intuition-box p")).toHaveCount(1);
  await expect(page.locator(".intuition-box")).toContainText("An array stores");
  await page.getByLabel("Lesson language").selectOption("বাংলা");
  await expect(page.locator(".intuition-box p")).toHaveCount(1);
  await expect(page.locator(".intuition-box")).toContainText("বাক্স");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByLabel("Lesson language")).toHaveValue("বাংলা");
});
test("Mobile workspace navigation opens the beginner guide and lab", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page
    .getByRole("navigation", { name: "Mobile workspace" })
    .getByRole("button", { name: "Start here", exact: true })
    .click();
  await expect(page.locator(".beginner-guide")).toContainText(
    "Variables and types",
  );
  await page
    .getByRole("navigation", { name: "Mobile workspace" })
    .getByRole("button", { name: "Lab", exact: true })
    .click();
  await expect(page.locator(".lab-selectors")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("Notebook import validates format and merges exported notes", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "My notebook", exact: true }).click();
  const payload = {
    format: "dotnet-mastery-notebook",
    version: 1,
    notes: { "0-0": "Imported Git note" },
    bookmarks: ["3-5"],
  };
  await page.locator("input[type=file]").setInputFiles({
    name: "notes.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(payload)),
  });
  await expect(page.locator(".saved-topic-grid")).toContainText(
    "Imported Git note",
  );
  await expect(page.locator(".saved-topic-grid")).toContainText(
    "Binary Search",
  );
  await page.locator("input[type=file]").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("{}"),
  });
  await expect(page.getByRole("status")).toContainText(
    "Not a supported notebook export",
  );
});

test("Kubernetes teaching model retains capacity when one of several pods fails", async ({
  page,
}) => {
  await openLesson(page, 12, 0);
  await page
    .getByRole("button", { name: "Simulate node failure", exact: true })
    .click();
  await expect(page.locator(".model-metrics")).toContainText("500 req/s");
  await expect(page.locator(".model-metrics")).not.toContainText("Unavailable");
  await page.locator(".diagram-configuration input[type=number]").fill("1");
  await expect(page.locator(".model-metrics")).toContainText("Unavailable");
});
