const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.platform === "win32" ? { channel: "msedge" } : {}),
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  // This is an isolated UI test: no Turnstile provider or database requests are sent.
  await page.route("https://challenges.cloudflare.com/**", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: 'window.turnstile={render:function(el,opts){setTimeout(function(){opts.callback("test-token")},20);return "test"},remove:function(){}};',
    }),
  );
  const keys = [];
  let attempt = 0;
  await page.route("**/api/leads", async (route) => {
    keys.push(route.request().headers()["idempotency-key"]);
    attempt++;
    if (attempt === 1) return route.abort("failed");
    return route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        status: "accepted",
        publicReference: "test-reference",
        whatsappUrl:
          "https://wa.me/12025550123?text=Referencia%20test-reference",
      }),
    });
  });
  await page.goto(
    process.env.FORM_TEST_URL || "http://127.0.0.1:3011/contacto",
  );
  const send = page.getByRole("button", { name: "Comunícate con nosotros" });
  await send.click();
  await page.getByText("Revisa la información antes de continuar.").waitFor();
  await page.locator("[name=fullName]").fill("Persona de prueba");
  await page.locator("[name=companyName]").fill("Marca de prueba");
  await page.locator("[name=phone]").fill("+12025550123");
  await page.locator("[name=challenge]").selectOption("unsure");
  await page.locator("[name=contactAuthorization]").check();
  await send.click();
  await page
    .getByRole("alert")
    .filter({ hasText: "Revisa tu conexión" })
    .waitFor();
  assert.equal(
    await page.locator("[name=fullName]").inputValue(),
    "Persona de prueba",
  );
  await send.click();
  await page
    .getByRole("heading", { name: "Gracias por contarnos sobre tu marca." })
    .waitFor();
  assert.equal(keys.length, 2);
  assert.equal(keys[0], keys[1]);
  assert.ok(
    await page
      .getByRole("link", { name: "Continuar por WhatsApp" })
      .getAttribute("href"),
  );
  console.log(
    "UI: validation, failed request, data preserved, idempotent retry and confirmed success passed. Network endpoints intercepted only in test.",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
