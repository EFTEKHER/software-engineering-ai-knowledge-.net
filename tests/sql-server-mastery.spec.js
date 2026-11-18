import { test, expect } from "@playwright/test";

test("course home lists tracks and starts at Episode 0.1", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^SQL Server Mastery/ }).click();
  await expect(page).toHaveURL(/#sql-server$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "SQL Server Mastery" }),
  ).toBeVisible();
  await expect(page.getByText("128 episodes")).toBeVisible();
  for (const track of [
    "Start Here",
    "Track 1 · Beginner · Read Data",
    "Track 4 · Optimization · Make It Fast",
    "Track 5 · Pro · Design & Interviews",
  ])
    await expect(page.getByRole("heading", { name: track })).toBeVisible();

  // Search finds the module that mentions NOLOCK
  await page.getByPlaceholder(/Search any topic/).fill("NOLOCK");
  await expect(page.getByRole("status")).toContainText("1 module match");
  await expect(
    page.getByRole("button", { name: /Module 13: Transactions/ }),
  ).toBeVisible();
  await page.getByPlaceholder(/Search any topic/).fill("");

  await page.getByRole("button", { name: /Start here — Episode 0\.1/ }).click();
  await expect(page).toHaveURL(/#sql-server\/start-here\/1$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "0.1 What is a database, a table, and SQL?",
    }),
  ).toBeVisible();
});

test("the player walks through scenes and highlights code", async ({
  page,
}) => {
  await page.goto("/#sql-server/joins/2");
  const player = page.getByLabel(/Episode player/);
  await expect(player).toBeVisible();
  await expect(
    player.getByRole("heading", { name: "LEFT JOIN and the WHERE trap" }),
  ).toBeVisible();

  // Step forward until the code walkthrough appears
  const next = page.getByRole("button", { name: "Next scene" });
  for (let k = 0; k < 4; k++) await next.click();
  await expect(page.locator(".sqlm-cl.is-now").first()).toBeVisible();
  await expect(page.locator(".sqlm-caption")).toContainText("SELECT");
  // Bangla caption shows in the default bilingual mode
  await expect(page.locator('.sqlm-caption [lang="bn"]')).toBeVisible();

  // Captions can be turned off
  await page.getByRole("button", { name: "Captions" }).click();
  await expect(page.locator(".sqlm-caption")).toHaveCount(0);
  await page.getByRole("button", { name: "Captions" }).click();

  // Jumping to the end finishes the episode and offers the next one
  const seek = page.getByLabel("Episode position");
  const max = await seek.getAttribute("max");
  await seek.fill(max);
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Episode finished" }),
  ).toBeVisible({
    timeout: 20000,
  });
  await expect(page.getByText("Ep 5.3 · Anti-joins")).toBeVisible();

  // The playlist marks the episode as watched
  const playlist = page.getByRole("region", { name: "Module playlist" });
  await expect(playlist.getByText("1/7 watched")).toBeVisible();
  await page.getByRole("button", { name: /Play next/ }).click();
  await expect(page).toHaveURL(/#sql-server\/joins\/3$/);
});

test("transcript, quiz and progress persist", async ({ page }) => {
  await page.goto("/#sql-server/joins/1");
  // full code in the episode notes, with copy
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: "Copy SQL code" }).click();
  await expect(page.getByText("Copied")).toBeVisible();
  await page.getByRole("button", { name: "Mark as watched" }).click();
  await expect(page.getByRole("button", { name: "Watched" })).toBeVisible();

  // English-only mode hides Bangla text in the notes
  await page.getByLabel("Language").selectOption("English");
  await expect(page.locator('.sqlm-transcript p[lang="bn"]')).toHaveCount(0);
  await page.getByLabel("Language").selectOption("বাংলা + EN");

  // Module quiz from the playlist
  await page
    .getByRole("region", { name: "Module playlist" })
    .getByRole("button", { name: /Module quiz/ })
    .click();
  await expect(page).toHaveURL(/#sql-server\/joins\/quiz$/);
  await page
    .getByRole("button", { name: /Turns it into an INNER JOIN/ })
    .click();
  await expect(page.getByText("Correct!")).toBeVisible();
  await page.getByRole("button", { name: /^A\s*5$/ }).click();
  await expect(page.getByText("Not quite.")).toBeVisible();
  await expect(page.getByText("Score: 1/2")).toBeVisible();

  // Reload keeps progress; home shows the continue button
  await page.goto("/#sql-server");
  await page.reload();
  await expect(page.getByText("1/128 watched")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Continue: Ep 0\.1/ }),
  ).toBeVisible();

  // Escape does not throw the learner out of the course
  await page.goto("/#sql-server/indexes/2");
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/#sql-server\/indexes\/2$/);
});

test("SQL Server Mastery works on a phone", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 800 },
  });
  const page = await context.newPage();
  await page.goto("/#sql-server/window-functions/1");
  await expect(page.getByLabel(/Episode player/)).toBeVisible();
  await page.getByLabel("Jump to module").selectOption("indexes");
  await expect(page).toHaveURL(/#sql-server\/indexes\/1$/);
  await expect(page.getByRole("button", { name: "All modules" })).toBeVisible();
  for (const url of [
    "/#sql-server",
    "/#sql-server/indexes/3",
    "/#sql-server/joins/quiz",
  ]) {
    await page.goto(url);
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, url).toBeLessThanOrEqual(1);
  }
  await context.close();
});
