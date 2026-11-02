import { expect, test, type Page } from "@playwright/test";

const routes = ["/", "/about", "/random", "/whatiatetoday", "/ingredient/2"];
const applicationOrigin = new URL(
  process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000",
).origin;

async function watchPageHealth(page: Page) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const applicationHttpErrors: string[] = [];
  const externalHttpErrors: string[] = [];
  const applicationImageFailures: string[] = [];
  const externalImageFailures: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => {
    const isExternal = new URL(response.url()).origin !== applicationOrigin;
    if (response.status() >= 400) {
      (isExternal ? externalHttpErrors : applicationHttpErrors).push(
        `${response.status()} ${response.url()}`,
      );
    }
    if (response.request().resourceType() === "image" && !response.ok()) {
      (isExternal ? externalImageFailures : applicationImageFailures).push(
        `${response.status()} ${response.url()}`,
      );
    }
  });
  page.on("requestfailed", (request) => {
    if (request.resourceType() === "image") {
      const isExternal = new URL(request.url()).origin !== applicationOrigin;
      (isExternal ? externalImageFailures : applicationImageFailures).push(
        `${request.failure()?.errorText} ${request.url()}`,
      );
    }
  });

  return {
    consoleErrors,
    pageErrors,
    applicationHttpErrors,
    externalHttpErrors,
    applicationImageFailures,
    externalImageFailures,
  };
}

for (const route of routes) {
  test(`page health: ${route}`, async ({ page }) => {
    const health = await watchPageHealth(page);
    const response = await page.goto(route);

    expect(response?.status(), `initial response for ${route}`).toBeLessThan(400);
    expect(new URL(page.url()).pathname).toBe(route);
    await expect(page.locator(route === "/random" ? "h1" : "main")).toBeVisible();
    await page.locator("img").evaluateAll((images) => {
      images.forEach((image) => {
        image.loading = "eager";
      });
    });
    await expect
      .poll(
        () =>
          page.locator("img").evaluateAll((images) =>
            images.every((image) => image.complete && image.naturalWidth > 0),
          ),
        { timeout: 20_000 },
      )
      .toBe(true);

    expect(health.applicationHttpErrors, "application HTTP errors").toEqual([]);
    expect(health.externalHttpErrors, "external service HTTP errors").toEqual([]);
    expect(health.consoleErrors, "browser console errors").toEqual([]);
    expect(health.pageErrors, "uncaught browser exceptions").toEqual([]);
    expect(health.applicationImageFailures, "application image failures").toEqual([]);
    expect(health.externalImageFailures, "external service image failures").toEqual([]);
  });

  test(`mobile layout and navigation: ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const response = await page.goto(route);

    expect(response?.status(), `initial response for ${route}`).toBeLessThan(400);
    const popupClose = page.getByTestId("home-popup-close");
    if (await popupClose.isVisible()) await popupClose.click();
    await expect(page.getByTestId("site-menu-open")).toBeVisible();
    await expect(page.locator("body")).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      "page should fit the mobile viewport without horizontal overflow",
    ).toBe(true);

    await page.getByTestId("site-menu-open").click();
    await expect(page.getByTestId("site-menu")).toBeVisible();
    await expect(page.getByTestId("site-menu-open")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    const homeLink = page.getByTestId("site-menu").getByRole("link", { name: "Home" });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page).toHaveURL(/\/$/);
  });
}

test("mobile home gallery opens an ingredient page", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const popupClose = page.getByTestId("home-popup-close");
  if (await popupClose.isVisible()) await popupClose.click();

  const firstIngredient = page.locator('main a[href^="/ingredient/"]').first();
  await expect(firstIngredient).toBeVisible();
  await firstIngredient.click();
  await expect(page).toHaveURL(/\/ingredient\//);
  await expect(page.getByTestId("ingredient-filter-toggle")).toBeVisible();
});

test("mobile about story deck can scroll horizontally", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about");

  const deck = page
    .locator('[class*="horizontalDeck"] [class*="horizontalTrack"]')
    .first();
  const initialScroll = await deck.evaluate((element) => element.scrollLeft);
  await deck.evaluate((element) => element.scrollBy({ left: element.clientWidth }));
  await expect
    .poll(() => deck.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(initialScroll);
});

test("mobile random generator handles no selectable keywords", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/random");

  await page.getByTestId("keyword-settings-toggle").click();
  const categories = ["noun", "verbAdjectiveAdverb", "style"];
  for (const category of categories) {
    await page.getByTestId(`keyword-tab-${category}`).click();
    await page.getByTestId("keyword-toggle-all-off").click();

    await page.getByTestId(`keyword-refresh-${category}`).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button").click();

    await page.getByTestId(`keyword-tab-${category}`).click();
    await page.getByTestId("keyword-toggle-all-on").click();
  }

  for (const category of categories) {
    await page.getByTestId(`keyword-tab-${category}`).click();
    await page.getByTestId("keyword-toggle-all-off").click();
  }

  await page.getByTestId("random-generate").click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("mobile meal journal can add an entry", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/whatiatetoday");

  await page.getByTestId("meal-add-entry").first().click();
  await page.getByTestId("meal-food-input").fill("Playwright lunch");
  await page.getByTestId("meal-save-entry").click();

  await expect(page.getByText("Playwright lunch")).toBeVisible();
});

test("mobile ingredient filter can be changed", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ingredient/2");

  const filter = page.getByTestId("ingredient-filter-toggle");
  const initialLabel = await filter.getAttribute("aria-label");
  await expect(filter).toBeVisible();
  await filter.click();
  await expect(filter).not.toHaveAttribute("aria-label", initialLabel ?? "");
});
