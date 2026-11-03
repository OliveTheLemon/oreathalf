import { readFile } from "node:fs/promises";
import { expect, test, type Locator, type Page } from "@playwright/test";

const mealStorageKey = "oreathalf-meal-journal-v1";

async function goToHome(page: Page) {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByTestId("site-menu-open")).toBeVisible();
}

async function closeHomePopup(page: Page) {
  const closeButton = page.getByTestId("home-popup-close");
  if (await closeButton.isVisible()) await closeButton.click();
}

async function assertLoadedImages(images: Locator) {
  await images.evaluateAll((elements) => {
    elements.forEach((element) => {
      element.loading = "eager";
    });
  });

  await expect
    .poll(
      () =>
        images.evaluateAll((elements) =>
          elements.every((element) => {
            try {
              new URL(element.currentSrc || element.src, window.location.href);
              return element.complete && element.naturalWidth > 0;
            } catch {
              return false;
            }
          }),
        ),
      { timeout: 20_000 },
    )
    .toBe(true);
}

async function addMealEntry(page: Page, food: string) {
  await page.getByTestId("meal-add-entry").first().click();
  await page.getByTestId("meal-food-input").fill(food);
  await page.getByTestId("meal-save-entry").click();
  await expect(page.locator('[data-testid="meal-entry"]').filter({ hasText: food })).toBeVisible();
}

async function clearMealJournal(page: Page) {
  await page.evaluate((key) => window.localStorage.removeItem(key), mealStorageKey);
}

test.describe("Home page", () => {
  test("first visit shows the main message and navigation", async ({ page }) => {
    await goToHome(page);

    await expect(page.getByText("Drink a lot of water", { exact: true })).toBeVisible();
    await expect(page.getByText(/음식과 식재료의 순간을 모아 기록하는 아카이브/)).toBeVisible();
    await expect(page.getByTestId("home-image-grid")).toBeVisible();
    await expect(page.getByRole("link", { name: "오늘 먹은 것 기록하기" })).toHaveAttribute(
      "href",
      "/whatiatetoday",
    );
    await expect(page.getByRole("link", { name: "랜덤 키워드 생성기" })).toHaveAttribute(
      "href",
      "/random",
    );
    await expect(page.getByText(/본 서비스는 개인의 다이어트 경험을 바탕으로/)).toBeVisible();
    await expect(page.getByTestId("site-menu-open")).toBeVisible();
  });

  test("ingredient image grid contains loaded images with valid URLs", async ({ page }) => {
    await goToHome(page);
    await closeHomePopup(page);

    const grid = page.getByTestId("home-image-grid");
    const images = grid.locator("img");
    await expect(grid).toBeVisible();
    await expect(images.first()).toBeAttached();
    expect(await images.count()).toBeGreaterThan(0);
    await assertLoadedImages(images);
  });

  test("ingredient image navigates to its matching detail page", async ({ page }) => {
    await goToHome(page);
    await closeHomePopup(page);

    const ingredientLink = page.locator('main a[href^="/ingredient/"]').first();
    await expect(ingredientLink).toBeVisible();
    const destination = await ingredientLink.getAttribute("href");
    const expectedName = await ingredientLink.getAttribute("data-ingredient-name");
    expect(destination).toMatch(/^\/ingredient\/\d+$/);
    expect(expectedName).toBeTruthy();

    await ingredientLink.click();
    await expect(page).toHaveURL(new RegExp(`${destination}$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(expectedName!);
    await assertLoadedImages(page.locator("main img"));
  });

  test("popup close is temporary and hide-for-today persists after reload", async ({ page }) => {
    await goToHome(page);

    const popup = page.getByTestId("home-popup");
    await expect(popup).toBeVisible();
    await page.getByTestId("home-popup-close").click();
    await expect(popup).toBeHidden();

    await page.reload();
    await expect(popup).toBeVisible();
    await page.getByTestId("home-popup-hide-today").click();
    await expect(popup).toBeHidden();

    const storedHideExpiry = await page.evaluate(() => {
      const key = Object.keys(window.localStorage).find((entry) =>
        entry.startsWith("oreathalf-hide-popup-until-"),
      );
      return key ? Number(window.localStorage.getItem(key)) : 0;
    });
    expect(storedHideExpiry).toBeGreaterThan(Date.now());

    await page.reload();
    await expect(popup).toBeHidden();
  });
});

test.describe("Ingredient page", () => {
  test("registered ingredient 2 displays its name and loaded images", async ({ page }) => {
    const expectedName = String.fromCodePoint(0xc544, 0xce68);
    const response = await page.goto("/ingredient/2");
    expect(response?.status()).toBe(200);

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText(expectedName!);
    const images = page.locator('[data-testid="ingredient-image-grid"] img');
    await expect(images.first()).toBeAttached();
    await assertLoadedImages(images);
  });

  test("expanded filter menu selects each category and highlights the active option", async ({ page }) => {
    await page.goto("/ingredient/2");

    const filter = page.getByTestId("ingredient-filter-toggle");
    const grid = page.getByTestId("ingredient-image-grid");
    const imageCards = grid.getByTestId("ingredient-image");
    const allCount = await imageCards.count();
    expect(allCount).toBeGreaterThan(0);
    expect(await filter.getAttribute("data-filter-state")).toBe("all");

    for (const [state, category] of [
      ["ingredient", "0"],
      ["dish", "1"],
      ["design", "2"],
    ]) {
      await filter.click();
      const option = page.getByTestId(`ingredient-filter-option-${state}`);
      await expect(option).toBeVisible();
      await option.click();
      await expect(filter).toHaveAttribute("data-filter-state", state);
      await filter.click();
      await expect(page.getByTestId(`ingredient-filter-option-${state}`)).toHaveClass(
        /bg-amber-400/,
      );
      await filter.click();
      const categories = await imageCards.evaluateAll((cards) =>
        cards.map((card) => card.getAttribute("data-category")),
      );
      if (categories.length === 0) {
        await expect(grid.getByText("이미지 없음")).toBeVisible();
      } else {
        expect(categories.every((value) => value === category)).toBe(true);
      }
    }

    await filter.click();
    await page.getByTestId("ingredient-filter-option-all").click();
    await expect(filter).toHaveAttribute("data-filter-state", "all");
    await expect(imageCards).toHaveCount(allCount);
  });

  test("external-link images show the link icon", async ({ page }) => {
    await page.goto("/ingredient/2");
    const linkedImages = page.locator(
      '[data-testid="ingredient-image-grid"] a[href^="http"]',
    );
    const linkedImageCount = await linkedImages.count();

    if (linkedImageCount > 0) {
      await expect(linkedImages.first().locator("svg")).toBeVisible();
    }
  });
});

test("About page scrolls through content and its background images load", async ({ page }) => {
  const response = await page.goto("/about");
  expect(response?.status()).toBe(200);
  await expect(page.getByTestId("about-scroll-container")).toBeVisible();
  await expect(page.locator("main h1").first()).toBeVisible();

  const imageRoles = page.getByRole("img");
  const backgroundSources = await imageRoles.evaluateAll((elements) =>
    elements.flatMap((element) => {
      const match = getComputedStyle(element)
        .backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      return match?.[1] ? [match[1]] : [];
    }),
  );
  expect(backgroundSources.length).toBeGreaterThan(0);
  const backgroundResults = await page.evaluate(
    async (sources: string[]) =>
      Promise.all(
        sources.map(async (source) => {
          const image = new Image();
          image.src = source;
          try {
            await image.decode();
            return { source, loaded: image.naturalWidth > 0 };
          } catch {
            return { source, loaded: false };
          }
        }),
      ),
    backgroundSources,
  );
  expect(backgroundResults.filter((result) => !result.loaded)).toEqual([]);

  const scrollContainer = page.getByTestId("about-scroll-container");
  await scrollContainer.evaluate((element) => {
    element.scrollTo({ top: element.scrollHeight, behavior: "instant" });
  });
  await expect
    .poll(() => scrollContainer.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
});

test.describe("whatIatetoday journal", () => {
  test.afterEach(async ({ page }) => {
    await clearMealJournal(page).catch(() => undefined);
  });

  test("adds, edits, and deletes a meal entry", async ({ page }) => {
    await page.goto("/whatiatetoday");
    const originalFood = "E2E lunch original";
    const updatedFood = "E2E lunch updated";
    await addMealEntry(page, originalFood);

    const originalEntry = page
      .locator('[data-testid="meal-entry"]')
      .filter({ hasText: originalFood });
    await originalEntry.getByRole("button").first().click();
    await expect(page.getByTestId("meal-food-input")).toHaveValue(originalFood);
    await page.getByTestId("meal-food-input").fill(updatedFood);
    await page.getByTestId("meal-save-entry").click();

    const updatedEntry = page
      .locator('[data-testid="meal-entry"]')
      .filter({ hasText: updatedFood });
    await expect(updatedEntry).toBeVisible();
    await updatedEntry.getByRole("button").nth(1).click();
    await expect(updatedEntry).toHaveCount(0);
  });

  test("meal entry remains visible after reload and matches localStorage", async ({ page }) => {
    await page.goto("/whatiatetoday");
    const food = "E2E persisted meal";
    await addMealEntry(page, food);

    const storedEntries = await page.evaluate((key) => {
      const value = window.localStorage.getItem(key);
      return value ? (JSON.parse(value) as Record<string, Array<{ food: string }>>) : {};
    }, mealStorageKey);
    expect(Object.values(storedEntries).flat().map((entry) => entry.food)).toContain(food);

    await page.reload();
    await expect(page.locator('[data-testid="meal-entry"]').filter({ hasText: food })).toBeVisible();
    const displayedFoods = await page.locator('[data-testid="meal-entry"]').evaluateAll((entries) =>
      entries.map((entry) => entry.getAttribute("data-food")),
    );
    expect(displayedFoods).toContain(food);
  });

  test("creates a poster image and downloads a valid PNG", async ({ page }) => {
    await page.goto("/whatiatetoday");
    await addMealEntry(page, "E2E poster meal");

    await page.getByTestId("meal-create-poster").click();
    const preview = page.getByTestId("meal-poster-preview");
    const image = page.getByTestId("meal-poster-image");
    await expect(preview).toBeVisible();
    await expect(image).toHaveAttribute("src", /^blob:/);
    await expect(image).toHaveAttribute("width", "1080");
    await expect(image).toHaveAttribute("height", "1350");
    await expect
      .poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0))
      .toBe(true);

    const downloadPromise = page.waitForEvent("download");
    await page.getByTestId("meal-poster-download").click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^oreathalf-\d{4}-\d{2}-\d{2}-\d+x\d+\.png$/);
    const downloadedFile = await download.path();
    expect(downloadedFile).not.toBeNull();
    const contents = await readFile(downloadedFile!);
    expect(contents.length).toBeGreaterThan(100);
    expect(contents.subarray(0, 8)).toEqual(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    );
  });
});

test.describe("Random page", () => {
  test("shows the matching title style and copies and saves generated keywords", async ({ page }) => {
    await page.goto("/random");
    const title = page.getByRole("heading", { level: 1, name: "랜덤 키워드 생성기" });
    await expect(title).toHaveClass(/sunflower-bold/);
    await expect(title).toHaveClass(/sm:text-6xl/);
    await expect(page.getByText("RANDOM KEYWORD GENERATOR")).toBeVisible();

    await page.getByTestId("random-generate").click();
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByRole("button", { name: "키워드 텍스트 복사" }).click();
    const copiedText = await page.evaluate(() => navigator.clipboard.readText());
    expect(copiedText.split("\n")).toHaveLength(4);
    await expect(page.getByRole("status")).toHaveText("키워드를 복사했습니다.");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "이미지로 저장" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("oreathalf-random-keywords.png");
    const downloadedFile = await download.path();
    expect(downloadedFile).not.toBeNull();
    const contents = await readFile(downloadedFile!);
    expect(contents.length).toBeGreaterThan(100);
    expect(contents.subarray(0, 8)).toEqual(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    );
    await expect(page.getByRole("status")).toHaveText("키워드 이미지를 저장했습니다.");
  });

  test("generates a value for all four keyword categories", async ({ page }) => {
    await page.goto("/random");
    await page.getByTestId("random-generate").click();

    for (const category of ["noun", "verbAdjectiveAdverb", "style", "purpose"]) {
      const result = page.getByTestId(`keyword-result-${category}`);
      await expect(result).toBeVisible();
      await expect(result).not.toBeEmpty();
    }
  });

  test("selected noun group controls generated noun output", async ({ page }) => {
    await page.goto("/random");
    await page.getByTestId("keyword-settings-toggle").click();
    await page.getByTestId("keyword-tab-noun").click();
    await page.getByTestId("keyword-toggle-all-off").click();

    const groups = page.locator('[data-testid^="keyword-group-noun-"]');
    const allowedGroup = await groups.evaluateAll((elements) => {
      const match = elements.find((element) => element.getAttribute("data-keywords"));
      return match
        ? {
            testId: match.getAttribute("data-testid"),
            keywords: match.getAttribute("data-keywords")?.split("|") ?? [],
          }
        : null;
    });
    expect(allowedGroup).not.toBeNull();
    expect(allowedGroup!.keywords.length).toBeGreaterThan(0);

    const selectedGroup = page.getByTestId(allowedGroup!.testId!);
    await selectedGroup.locator('input[type="checkbox"]').first().check();
    await page.getByTestId("keyword-settings-toggle").click();
    await page.getByTestId("random-generate").click();

    const generatedNoun = await page.getByTestId("keyword-result-noun").innerText();
    expect(allowedGroup!.keywords).toContain(generatedNoun);
  });
});
