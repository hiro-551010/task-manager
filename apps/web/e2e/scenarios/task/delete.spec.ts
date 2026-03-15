import { test, expect } from "@playwright/test";
import { truncateTables } from "../../fixtures/db";

test.beforeAll(async () => {
  await truncateTables();
});

test.describe("タスク削除", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tasks");
    await page.getByRole("button", { name: "+ 新規作成" }).click();
    await page.getByLabel("タイトル").fill("削除対象タスク");
    await page.getByRole("button", { name: "作成" }).click();
    await expect(page.getByText("削除対象タスク")).toBeVisible();
  });

  test("タスクを削除できる", async ({ page }) => {
    const card = page.locator(".border.rounded-lg").filter({ hasText: "削除対象タスク" });

    // confirm ダイアログを accept
    page.on("dialog", (dialog) => dialog.accept());
    await card.getByRole("button", { name: "削除" }).click();

    await expect(page.getByText("削除対象タスク")).not.toBeVisible();
    await expect(page.getByText("タスクがありません")).toBeVisible();
  });

  test("削除確認ダイアログをキャンセルするとタスクが残る", async ({ page }) => {
    const card = page.locator(".border.rounded-lg").filter({ hasText: "削除対象タスク" });

    // confirm ダイアログを dismiss
    page.on("dialog", (dialog) => dialog.dismiss());
    await card.getByRole("button", { name: "削除" }).click();

    await expect(page.getByText("削除対象タスク")).toBeVisible();
  });

  test("複数タスクのうち一つだけ削除できる", async ({ page }) => {
    // もう一つタスクを作成
    await page.getByRole("button", { name: "+ 新規作成" }).click();
    await page.getByLabel("タイトル").fill("残すタスク");
    await page.getByRole("button", { name: "作成" }).click();
    await expect(page.getByText("残すタスク")).toBeVisible();

    const card = page.locator(".border.rounded-lg").filter({ hasText: "削除対象タスク" });
    page.on("dialog", (dialog) => dialog.accept());
    await card.getByRole("button", { name: "削除" }).click();

    await expect(page.getByText("削除対象タスク")).not.toBeVisible();
    await expect(page.getByText("残すタスク")).toBeVisible();
  });
});
