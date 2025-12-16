// tests/navigation.spec.js
import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test("ma link do strony logowania", async ({ page }) => {
  // 1. Strona główna
  await page.goto(BASE_URL + "/");

  // 2. Kliknięcie przycisku / linku "Logowanie" w navbarze
  await page.getByRole("link", { name: "Logowanie" }).click();

  // 3. Sprawdzenie adresu
  await expect(page).toHaveURL(BASE_URL + "/user/signin");

  // 4. Sprawdzenie nagłówka na stronie logowania
  await expect(
    page.getByRole("heading", { name: "Logowanie" })
  ).toBeVisible();
});
