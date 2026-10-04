import { test, expect } from "@playwright/test";

/** Core flows of the catalogue and the course player. */

test("catalogue filters and search work", async ({ page }) => {
  await page.goto("/courses");
  await page.getByRole("button", { name: "Development" }).click();
  await expect(page.locator("article")).toHaveCount(2);
  await page.getByRole("button", { name: "All Courses" }).click();
  await page.locator("#course-search").fill("seo");
  await expect(page.locator("article")).toHaveCount(1);
  await expect(page.locator("article h2")).toContainText("Starting SEO");
});

test("selecting a lesson updates the player and locked lessons warn", async ({ page }) => {
  await page.goto("/courses/starting-seo");
  await page.getByRole("button", { name: /Course Overview/ }).first().click();
  await expect(page.locator("figcaption")).toContainText("Course Overview");
  await page.getByRole("button", { name: /Course Wrap Up/ }).click();
  await expect(page.getByRole("status")).toContainText("locked");
});

test("exam saves progress and resumes after closing", async ({ page }) => {
  await page.goto("/courses/starting-seo");
  await page.getByRole("button", { name: /Return Values From Functions/ }).click();
  await page.getByRole("radio", { name: "Bahar" }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: /Close exam/ }).click();
  await page.getByRole("button", { name: /Return Values From Functions/ }).click();
  await expect(page.getByRole("button", { name: "Question 1 (answered)" })).toBeVisible();
  await page.getByRole("button", { name: "Question 1 (answered)" }).click();
  await expect(page.getByRole("radio", { name: "Bahar" })).toHaveAttribute(
    "aria-checked",
    "true"
  );
});

test("ask-a-question keeps the draft within the session", async ({ page }) => {
  await page.goto("/courses/starting-seo");
  await page.getByRole("button", { name: "Ask a question" }).click();
  await page.locator("#ask-question-box").fill("Is keyword research covered?");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Ask a question" }).click();
  await expect(page.locator("#ask-question-box")).toHaveValue(
    "Is keyword research covered?"
  );
});

test("submitting a comment shows it in the list", async ({ page }) => {
  await page.goto("/courses/starting-seo");
  await page.locator("#comment-box").fill("Great course!");
  await page.getByRole("button", { name: /Submit Review/ }).click();
  await expect(page.locator("li", { hasText: "Great course!" })).toHaveCount(1);
});

test("marking a lesson completed moves the progress bar", async ({ page }) => {
  await page.goto("/courses/starting-seo");
  const bar = page.locator("[role=progressbar]").first();
  const before = Number(await bar.getAttribute("aria-valuenow"));
  await page.getByRole("button", { name: "Mark as completed" }).click();
  await expect
    .poll(async () => Number(await bar.getAttribute("aria-valuenow")))
    .toBeGreaterThan(before);
});

test("no horizontal scroll at any breakpoint", async ({ page }) => {
  await page.goto("/courses/starting-seo");
  for (const width of [1236, 992, 820, 768, 430, 360]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `overflow at ${width}px`).toBe(0);
  }
});
