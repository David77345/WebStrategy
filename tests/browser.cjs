const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
// Run against a local preview. Optional enabled-form tests intercept ALL lead submissions.
(async () => {
  const origin = process.env.TEST_URL || "http://localhost:3010";
  const browser = await chromium.launch({
    headless: true,
    ...(process.platform === "win32" ? { channel: "msedge" } : {}),
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  fs.mkdirSync("test-results", { recursive: true });
  const routes = [
    "/",
    "/servicios",
    "/metodo",
    "/nosotros",
    "/portafolio",
    "/portafolio/berlin-bar",
    "/portafolio/klan-78",
    "/portafolio/nexcore",
    "/portafolio/sofia-villamizar",
    "/contacto",
    "/privacidad",
    "/cookies",
    "/terminos",
  ];
  let checked = 0;
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    for (const route of routes) {
      const response = await page.goto(origin + route);
      assert.equal(response.status(), 200, route);
      await page.locator("h1").first().waitFor();
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${width} overflow ${route}`,
      );
      assert.equal(
        await page
          .locator("img")
          .evaluateAll((xs) =>
            xs.some((x) => x.complete && x.naturalWidth === 0),
          ),
        false,
        `broken image ${route}`,
      );
      checked++;
    }
  }
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(origin);
  await page.getByRole("button", { name: "Menú", exact: true }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Nosotros", exact: true })
    .click();
  await page.waitForURL("**/nosotros");
  assert.equal(
    await page
      .getByRole("button", { name: "Menú", exact: true })
      .getAttribute("aria-expanded"),
    "false",
  );
  await page.screenshot({
    path: "test-results/mobile-nosotros.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin);
  await page.screenshot({
    path: "test-results/desktop-inicio.png",
    fullPage: true,
  });
  const missing = await page.goto(origin + "/pagina-que-no-existe");
  assert.equal(missing.status(), 404);
  await page.goto(origin + "/contacto");
  assert.equal(
    await page
      .getByRole("button", { name: "Comunícate con nosotros" })
      .isDisabled(),
    true,
  );
  const rejected = await page.request.post(origin + "/api/leads", { data: {} });
  assert.equal(rejected.status(), 503);
  const job = await page.request.post(origin + "/api/internal/outbox");
  assert.equal(job.status(), 401);
  const logoCount = await page
    .locator('img[src*="day-strategy-symbol"]')
    .count();
  assert.ok(logoCount >= 2);
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify(
      {
        pagesAndWidths: checked,
        mobileNavigation: "passed",
        disabledContact: 503,
        unauthorizedJob: 401,
        pageErrors: errors,
      },
      null,
      2,
    ),
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
