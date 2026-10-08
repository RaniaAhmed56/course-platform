import { test, expect } from "@playwright/test";

/** Core flows of the catalogue and the course player. */

// Every page except the welcome screen requires the guest-session flag
// (set by the "Continue as Guest" button) — seed it for all tests.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("itlegend:guest-session", "1");
  });
});

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

/* ----- header actions ----- */

test("header search expands and filters the catalogue", async ({ page }) => {
  await page.goto("/courses");
  await page.getByRole("button", { name: "Search" }).click();
  const field = page.locator("#header-search");
  await expect(field).toBeFocused();
  await field.fill("react");
  await expect(page).toHaveURL(/q=react/);
  await expect(page.locator("article")).toHaveCount(1);
  await expect(page.locator("article h2")).toContainText("React in Practice");
  // the two search fields are independent — the catalogue field stays empty
  await expect(page.locator("#course-search")).toHaveValue("");
  // closing the search clears the filter
  await page.getByRole("button", { name: "Close search" }).click();
  await expect(page.locator("article")).toHaveCount(8);
});

test("header search works with Arabic input (RTL)", async ({ page }) => {
  await page.goto("/courses");
  await page.getByRole("button", { name: "Search" }).click();
  const field = page.locator("#header-search");
  await field.fill("تصميم");
  await expect(field).toBeFocused();
  await expect(field).toHaveAttribute("dir", "auto");
  await expect(page.getByRole("status")).toContainText("No courses match");
});

test("notifications dropdown opens and clears the badge", async ({ page }) => {
  await page.goto("/courses");
  await page.getByRole("button", { name: /Notifications/ }).click();
  await expect(page.getByText("Your question was answered")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByText("Your question was answered")).toBeHidden();
  await expect(page.getByRole("button", { name: "Notifications", exact: true })).toBeVisible();
});

test("account menu opens with working links", async ({ page }) => {
  await page.goto("/courses");
  await page.getByRole("button", { name: "Account menu" }).click();
  await expect(page.getByText("Rania")).toBeVisible();
  await page.getByRole("link", { name: "My Library" }).click();
  await expect(page).toHaveURL(/\/library$/);
});

/* ----- welcome gate, home & library pages ----- */

test("welcome page enters as guest and sign out returns to it", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Continue as Guest" }).click();
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByRole("heading", { name: /Welcome back, Rania/ })).toBeVisible();
  // sign out → back to the welcome screen
  await page.getByRole("button", { name: "Account menu" }).click();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("button", { name: "Continue as Guest" })).toBeVisible();
});

test("app pages redirect to the welcome screen without a guest session", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.removeItem("itlegend:guest-session");
  });
  await page.goto("/home");
  await expect(page.getByRole("button", { name: "Continue as Guest" })).toBeVisible();
});

test("home page shows stats and continue-learning courses", async ({ page }) => {
  await page.goto("/home");
  await expect(page.getByText("Courses in progress")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Continue Learning" })).toBeVisible();
  // in-progress mock courses appear with a Continue CTA
  await expect(page.getByRole("link", { name: /Continue/ }).first()).toBeVisible();
  // category chip filters the catalogue
  await page.getByRole("link", { name: /Design/ }).first().click();
  await expect(page).toHaveURL(/\/courses\?cat=Design/);
  await expect(page.getByRole("button", { name: "Design" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
});

test("library lists materials with preview and completed courses", async ({ page }) => {
  await page.goto("/library");
  await expect(page.getByRole("heading", { name: "Course Materials" })).toBeVisible();
  // one material card per course
  await expect(page.getByRole("button", { name: "Preview" })).toHaveCount(8);
  // PDF preview opens and closes
  await page.getByRole("button", { name: "Preview" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  // the completed mock course shows on the shelf
  await expect(page.getByRole("heading", { name: "Completed Courses" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Review course/ }).first()
  ).toBeVisible();
});

/* ----- player auto-advance ----- */

test("when a video ends the player advances to the next video", async ({ page }) => {
  await page.goto("/courses/starting-seo");
  const caption = page.locator("figcaption");
  const before = await caption.textContent();
  // start playback (loads the YouTube embed and its state listener) ...
  await page.getByRole("button", { name: /Play lesson/ }).click();
  // ... then simulate the embed reporting "video ended" (playerState 0)
  await page.evaluate(() => {
    window.dispatchEvent(
      new MessageEvent("message", {
        origin: "https://www.youtube.com",
        data: JSON.stringify({ event: "infoDelivery", info: { playerState: 0 } }),
      })
    );
  });
  await expect(caption).not.toHaveText(before ?? "");
  // and the finished lesson is now marked completed in the curriculum
  const bar = page.locator("[role=progressbar]").first();
  await expect
    .poll(async () => Number(await bar.getAttribute("aria-valuenow")))
    .toBeGreaterThan(0);
});

test("curriculum uses a video icon for video lessons", async ({ page }) => {
  await page.goto("/courses/starting-seo");
  // the first lesson row is a video: its icon contains the play-glyph rect
  const firstRow = page.getByRole("button", { name: /Course Overview/ }).first();
  await expect(firstRow.locator("svg rect").first()).toBeVisible();
});
