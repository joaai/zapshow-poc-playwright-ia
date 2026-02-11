import { test, expect } from "@playwright/test";

test.beforeEach(async () => {
  await fetch("http://localhost:3001/test/reset", { method: "POST" });
});

test("login works", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Email").fill("qa@empresa.com");
  await page.getByLabel("Password").fill("123456");
  await page.getByRole("button", { name: /login/i }).click();
  await expect(page.getByRole("heading", { name: /events/i })).toBeVisible();
});

test("create event uses POST /events and appears in list", async ({ page }) => {
  await page.goto("/");
  // login
  await page.getByLabel("Email").fill("qa@empresa.com");
  await page.getByLabel("Password").fill("123456");
  await page.getByRole("button", { name: /login/i }).click();

  // create event and wait for POST /events returning 201
  const wait = page.waitForResponse(
    (resp) => resp.url().includes("/events") && resp.status() === 201,
  );
  await page.getByLabel("Title").fill("My event");
  await page.getByLabel("Description").fill("desc");
  await page.getByRole("button", { name: /create event/i }).click();
  await wait;

  await expect(page.getByText("My event")).toBeVisible();
});
