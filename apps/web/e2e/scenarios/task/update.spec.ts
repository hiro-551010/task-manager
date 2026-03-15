import { test, expect } from "@playwright/test";
import { truncateTables } from "../../fixtures/db";

test.beforeAll(async () => {
  await truncateTables();
});

test.describe("タスク更新", () => {
  test.beforeEach(async ({ page }) => {
    // 事前にタスクを作成
    await page.goto("/tasks");
    await page.getByRole("button", { name: "+ 新規作成" }).click();
    await page.getByLabel("タイトル").fill("更新前タスク");
    await page.getByRole("button", { name: "作成" }).click();
    await expect(page.getByText("更新前タスク")).toBeVisible();
  });

  test("タイトルを更新できる", async ({ page }) => {
    const card = page.locator(".border.rounded-lg").filter({ hasText: "更新前タスク" });
    await card.getByRole("button", { name: "編集" }).click();

    const titleInput = page.getByLabel("タイトル");
    await titleInput.fill("更新後タスク");
    await page.getByRole("button", { name: "更新" }).click();

    await expect(page.getByText("更新後タスク")).toBeVisible();
    await expect(page.getByText("更新前タスク")).not.toBeVisible();
  });

  test("期限を追加できる", async ({ page }) => {
    const card = page.locator(".border.rounded-lg").filter({ hasText: "更新前タスク" });
    await card.getByRole("button", { name: "編集" }).click();

    await page.getByLabel("期限").fill("2099-06-30");
    await page.getByRole("button", { name: "更新" }).click();

    await expect(page.getByText("更新前タスク")).toBeVisible();
    await expect(page.getByText(/2099/)).toBeVisible();
  });

  test("更新後にフォームが閉じる", async ({ page }) => {
    const card = page.locator(".border.rounded-lg").filter({ hasText: "更新前タスク" });
    await card.getByRole("button", { name: "編集" }).click();

    await page.getByLabel("タイトル").fill("タイトル変更");
    await page.getByRole("button", { name: "更新" }).click();

    await expect(page.getByRole("button", { name: "更新" })).not.toBeVisible();
  });

  // 異常系
  test("タイトルを100文字超に変更した場合エラーが表示される", async ({ page }) => {
    const card = page.locator(".border.rounded-lg").filter({ hasText: "更新前タスク" });
    await card.getByRole("button", { name: "編集" }).click();

    await page.getByLabel("タイトル").fill("a".repeat(101));
    await page.getByRole("button", { name: "更新" }).click();

    await expect(page.getByText("100文字以内")).toBeVisible();
  });

  test("キャンセルで編集を中断できる", async ({ page }) => {
    const card = page.locator(".border.rounded-lg").filter({ hasText: "更新前タスク" });
    await card.getByRole("button", { name: "編集" }).click();

    await page.getByLabel("タイトル").fill("変更中のタイトル");
    await page.getByRole("button", { name: "キャンセル" }).click();

    await expect(page.getByText("更新前タスク")).toBeVisible();
    await expect(page.getByText("変更中のタイトル")).not.toBeVisible();
  });
});
