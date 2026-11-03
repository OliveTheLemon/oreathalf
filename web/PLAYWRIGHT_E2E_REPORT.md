# oreathalf Playwright E2E report

Run on 2026-11-02 with the local Next.js development server and Chromium.

## 1. Project analysis

### Routes and functionality checked

| Page | Route | Implementation notes |
| --- | --- | --- |
| Home | `/` | `HomePageContent` loads ingredient groups and the popup image from the configured Sanity dataset. `next/image` serves the remote Sanity images. The popup's hide-for-today choice is stored in `localStorage`, keyed by the popup image URL, until the next 23:00 KST. |
| Ingredient detail | `/pantry/[ingredientNumber]` (`/pantry/2` in these tests) | The server queries existing `ingrePhotograph` documents through `getIngredientGroupById`. The client filters images by categories `0`, `1`, and `2`, with the all-images state available from the floating filter menu. |
| About | `/about` | `AboutExperience` owns the vertically scrollable page. `AboutContent` contains horizontal scroll panels and background images hosted by Unsplash. |
| Food journal | `/whatiatetoday` | Add, edit, and delete operations update browser `localStorage` under `oreathalf-meal-journal-v1`. Poster generation draws to a canvas, creates a PNG blob, and downloads it through a temporary object URL. |
| Random keywords | `/random` | Keyword source files are read locally. Noun, verb/adjective/adverb, and style can be filtered by group; purpose is not selectable. Empty selections show a dialog instead of choosing an undefined value. |

The tests only read the configured Sanity dataset. They do not create or update Sanity documents. Food journal tests use Playwright's isolated browser context and remove their local storage entry after each test.

## 2. Test environment

- Package manager: npm (`web/package-lock.json`).
- Test package: `@playwright/test` 1.64.1, already present in the project.
- Browser: Chromium, using the Desktop Chrome Playwright project; mobile behavior is checked at a 390 × 844 viewport.
- Config: `playwright.config.ts` starts `npm run dev` for local targets, supports `PLAYWRIGHT_BASE_URL`, and writes an HTML report to `playwright-report/`.
- Reports and temporary test output are git-ignored.

Commands, run from `web/`:

```bash
npx playwright install chromium
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:debug
npm run test:e2e:report
```

By default tests target `http://127.0.0.1:3000`. To target a different host, set `PLAYWRIGHT_BASE_URL`. For example, in PowerShell:

```powershell
$env:PLAYWRIGHT_BASE_URL = "https://example.com"
npm run test:e2e
```

Remote targets do not start the local development server. Local URLs use the URL's port, or port 3000 when omitted.

## 3. Test results

The full run completed with **27 passed, 0 failed**. This includes the 12 feature scenarios below, five route-health checks, five mobile navigation/layout checks, and five additional mobile feature checks.

| Page | Test | Result | Notes |
| --- | --- | --- | --- |
| Home | First screen | PASS | Main message, image grid container, and menu are visible. |
| Home | Ingredient image grid | PASS | Grid has images with valid URLs; images complete and have non-zero natural width. |
| Home | Click ingredient image | PASS | Link navigates to its corresponding ingredient URL; detail heading and images load. |
| Home | Popup controls | PASS | Close is temporary; hide-for-today stores a future expiry and remains hidden after reload. |
| Ingredient | Detail page | PASS | Existing Sanity ingredient `2` returns a heading and loaded images. |
| Ingredient | Filter button | PASS | Cycles `all → ingredient → dish → design → all`; visible cards match the selected category. |
| About | Scroll and content | PASS | Page scrolls; background images attached to image-role elements decode successfully. |
| whatiatetoday | Meal CRUD | PASS | Adds an entry, edits its text, and removes it from the list. |
| whatiatetoday | Persistence after reload | PASS | Stored journal data and the reloaded visible entry agree. |
| whatiatetoday | Create and download image | PASS | Canvas preview loads; downloaded file has a PNG signature and non-trivial content. |
| random | Generate keywords | PASS | Noun, verb/adjective/adverb, style, and purpose results are populated. |
| random | Exclude groups | PASS | With all noun groups disabled except one, generated noun belongs to the selected group's keyword set. |

Common checks run for `/`, `/about`, `/random`, `/whatiatetoday`, and `/pantry/2`:

- HTTP status and final pathname are checked for each expected route.
- Application and external HTTP errors are collected and asserted separately.
- Browser `console.error` messages and uncaught page exceptions are checked.
- Failed image requests and decoded `<img>` natural dimensions are checked.
- At 390 × 844, each route is checked for horizontal overflow; the shared menu opens and its Home link returns to `/`.
- Additional mobile interactions cover the Home gallery, About horizontal story deck, random no-keyword handling, journal entry creation, and Ingredient filter.

## 4. Findings

- No application feature failure was reproduced in the final run. The final run had zero application HTTP errors, external HTTP errors, failed images, console errors, or uncaught page exceptions on the common route checks.
- Two initial failures were test implementation assumptions, not service failures: the About image check included accessible image elements that did not use CSS backgrounds, and the fixed Ingredient fixture did not always expose its name on the Home card. The image check now selects only actual CSS backgrounds; the Ingredient test asserts the registered name directly. Both fixes pass in the full suite.
- The Home popup test depends on the currently configured Sanity dataset containing a popup image. The current dataset did, and both close and hide-for-today behavior passed. If the popup is intentionally removed from the dataset, this test should use a controlled fixture instead of weakening its assertions.
- Ingredient integration tests use the existing Sanity ingredient number `2`. An outage or content removal at Sanity/CDN will be reported separately from application-origin HTTP errors, but still fails the integration check because the requested page content would not be available.
- `npm run lint` succeeds with one existing Next.js warning: the generated poster preview uses a raw `<img>` for a Blob URL in `WhatIAteToday.tsx`. It does not cause a test or runtime failure; optimizing a generated Blob preview can be considered separately.

## 5. GitHub Actions automation

- [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs on pull requests and pushes to `main`: `npm ci`, ESLint, Next.js build, and the Chromium E2E suite. The workflow uploads the HTML report and test traces as a 14-day artifact.
- [`.github/workflows/production-smoke.yml`](../.github/workflows/production-smoke.yml) checks `https://www.oreathalf.com` after a successful production deployment event, every day at 09:23 KST, and on manual dispatch. It runs the full E2E suite against the live URL; journal and popup checks use isolated browser storage and do not mutate Sanity content.
- Production smoke failures are marked as failed workflow runs and include a summary and downloadable Playwright report. GitHub delivers email or web notifications according to each user's Actions notification preferences; select **Only notify for failed workflows** in GitHub notification settings to receive failure-only alerts. Scheduled notifications go to the account that last changed the schedule.
- Vercel's GitHub integration must emit a successful `deployment_status` event with `production_environment: true` for the post-deployment trigger. The scheduled and manual checks work independently of that integration.

## 6. Future improvements

- Add a controlled Sanity fixture or API mock for popup and ingredient data if tests need to run without external services.
- Add Firefox and WebKit projects after the Chromium suite is stable in CI.
- Expand mobile coverage to browser device emulation and actual touch gestures; current checks use a narrow viewport and programmatic horizontal scrolling.
- Add tests for invalid ingredient routes and expected 404 handling once those error-page behaviors are explicitly defined.
