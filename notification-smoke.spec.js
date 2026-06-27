const { test, expect } = require("@playwright/test");

test("notification center renders on admin and student dashboards", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/admin.html");
  await page.evaluate(() => sessionStorage.setItem("gthAdminLoggedIn", "true"));
  await page.reload();
  await expect(page.locator("[data-notification-toggle]")).toBeVisible();
  await page.locator("[data-notification-toggle]").click();
  await expect(page.locator("[data-notification-panel]")).toBeVisible();

  await page.goto("http://127.0.0.1:4173/client.html");
  await page.evaluate(() => sessionStorage.setItem("gthClientLoggedIn", "true"));
  await page.reload();
  await expect(page.locator("[data-notification-toggle]")).toBeVisible();
  await page.locator("[data-notification-toggle]").click();
  await expect(page.locator("[data-notification-panel]")).toBeVisible();
});
