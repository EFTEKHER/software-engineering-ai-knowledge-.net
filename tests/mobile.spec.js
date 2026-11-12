import { test, expect } from "@playwright/test";
import curriculum from "../src/curriculum.json" with { type: "json" };

// Phone-sized checks: nothing should force sideways scrolling of the page.
const overflowing = (page) =>
  page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const bad = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.right <= vw + 1) continue;
      // Elements inside a horizontal scroller (code blocks, tables) are fine.
      let p = el.parentElement, scroller = false;
      while (p && p !== document.body) {
        const ox = getComputedStyle(p).overflowX;
        if ((ox === "auto" || ox === "scroll" || ox === "hidden") && p.getBoundingClientRect().right <= vw + 1) { scroller = true; break; }
        p = p.parentElement;
      }
      if (!scroller) bad.push(`${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]} right=${Math.round(r.right)}`);
    }
    return { pageScroll: document.documentElement.scrollWidth > vw + 1, bad: bad.slice(0, 5) };
  });

for (const vp of [{ width: 390, height: 844 }, { width: 360, height: 740 }]) {
  test(`Every module fits a ${vp.width}px phone screen`, async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize(vp);
    const problems = [];
    for (const m of curriculum) {
      for (const t of [0, m.topics.length - 1]) {
        await page.goto(`/#lesson/${m.id}/${t}`, { waitUntil: "domcontentloaded" });
        await expect(page.locator("#lesson-title")).toHaveText(m.topics[t]);
        await expect(page.locator(".reference-example").first()).toBeAttached();
        const r = await overflowing(page);
        if (r.pageScroll || r.bad.length) problems.push(`${m.id}/${t}: ${JSON.stringify(r)}`);
      }
    }
    expect(problems).toEqual([]);
  });
}

test("Sandbox runs JavaScript and fits a phone screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Sandbox|Run code/ }).filter({ visible: true }).first().click();
  await expect(page.getByText("Write it. Run it. Own it.")).toBeVisible();
  const r = await overflowing(page);
  expect(r).toEqual({ pageScroll: false, bad: [] });
});
