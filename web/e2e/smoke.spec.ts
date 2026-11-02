import { expect, test } from "@playwright/test";

test("random keyword page loads", async ({ page }) => {
  const response = await page.goto("/random");

  expect(response?.ok()).toBeTruthy();
  await expect(page.locator("h1")).toBeVisible();
});
