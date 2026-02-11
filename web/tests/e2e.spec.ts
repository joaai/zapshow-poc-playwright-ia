import { test, expect } from "@playwright/test";

test.beforeEach(async () => {
  const apiBase = process.env.E2E_API_URL || "http://localhost:3001";
  await fetch(`${apiBase}/test/reset`, { method: "POST" });
});

test("login works", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Email").fill("qa@empresa.com");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});

test("create event uses POST /events and appears in list", async ({ page }) => {
  await page.goto("/");

  // login
  await page.getByLabel("Email").fill("qa@empresa.com");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  // go to create event
  await page.getByRole("button", { name: "Criar evento" }).click();
  await expect(
    page.getByRole("heading", { name: "Criar evento" }),
  ).toBeVisible();

  const title = `My event ${Date.now()}`;

  // wait for POST /events returning 201
  const wait = page.waitForResponse(
    (resp) =>
      resp.url().includes("/events") &&
      resp.request().method() === "POST" &&
      resp.status() === 201,
  );

  await page.getByLabel("Título do evento").fill(title);
  await page.getByLabel("Data").fill("2026-02-15");
  await page.getByLabel("Preço").fill("50");
  await page.getByRole("button", { name: "Salvar" }).click();

  await wait;

  await expect(page.getByText("Evento criado com sucesso")).toBeVisible();
  await expect(page.getByText(title)).toBeVisible();
});
