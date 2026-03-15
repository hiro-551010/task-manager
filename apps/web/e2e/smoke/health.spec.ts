import { test, expect } from "@playwright/test";
import { truncateTables } from "../fixtures/db";

test.beforeAll(async () => {
  await truncateTables();
});

test.describe("スモークテスト", () => {
  test("/ → /tasks にリダイレクトされ、正常表示される", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL("**/tasks");
    await expect(page).not.toHaveURL(/.*\/error.*/);
    // Next.js エラーオーバーレイが表示されていないことを確認
    await expect(page.locator("nextjs-portal")).not.toBeVisible();
    await expect(page.getByRole("heading", { name: "Tasks" })).toBeVisible();
  });

  test("/tasks が正常表示される", async ({ page }) => {
    await page.goto("/tasks");
    await expect(page.getByRole("heading", { name: "Tasks" })).toBeVisible();
    await expect(page.locator("nextjs-portal")).not.toBeVisible();
  });
});
