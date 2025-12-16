// tests/auth.spec.js
import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

// 👇 WSTAW DANE KONTA TESTOWEGO Z FIREBASE
const TEST_EMAIL = "k.b.acper05@gmail.com";
const TEST_PASSWORD = "123456";

test.describe("Autoryzacja i dostęp do profilu", () => {
  // 🔹 Zadanie 5 – logowanie + przejście do profilu
  test("po zalogowaniu użytkownik może wejść na /user/profile", async ({
    page,
  }) => {
    // 1. Spróbuj wejść od razu na chronioną stronę profilu
    await page.goto(BASE_URL + "/user/profile");

    // 2. Powinno przekierować na stronę logowania z returnUrl
    await expect(page).toHaveURL(/\/user\/signin\?returnUrl=/);

    // 3. Wypełnij formularz logowania
await page.getByPlaceholder("podaj email").fill(TEST_EMAIL);
await page.getByPlaceholder("•••••••").fill(TEST_PASSWORD);
await page.getByRole("button", { name: "Zaloguj" }).click();


    // 4. Po zalogowaniu powinno wrócić na profil
    await expect(page).toHaveURL(BASE_URL + "/user/profile");

    // 5. Na profilu musi być nagłówek „Profil użytkownika”
    await expect(
      page.getByRole("heading", { name: "Profil użytkownika" })
    ).toBeVisible();
  });

  // 🔹 Zadanie 6 – niezalogowany użytkownik -> redirect na logowanie
  test("niezalogowany użytkownik jest przekierowany na logowanie", async ({
    page,
  }) => {
    // nowy context testu = brak sesji -> user niezalogowany
    await page.goto(BASE_URL + "/user/profile");

    // znowu powinno przekierować na stronę logowania z returnUrl
    await expect(page).toHaveURL(/\/user\/signin\?returnUrl=/);

    // powinien być widoczny formularz logowania
    await expect(
      page.getByRole("heading", { name: "Logowanie" })
    ).toBeVisible();
  });
});
