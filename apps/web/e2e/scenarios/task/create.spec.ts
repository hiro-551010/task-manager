import { test, expect } from "@playwright/test";
import { truncateTables } from "../../fixtures/db";

test.beforeEach(async () => {
  await truncateTables();
});

test.describe("タスク作成", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tasks");
  });

  test("タイトルのみでタスクを作成できる", async ({ page }) => {
    await page.getByRole("button", { name: "+ 新規作成" }).click();
    await page.getByLabel("タイトル").fill("新しいタスク");
    await page.getByRole("button", { name: "作成", exact: true }).click();

    await expect(page.getByText("新しいタスク")).toBeVisible();
    // フォームが閉じていることを確認（送信ボタン「作成」が消えている）
    await expect(page.getByRole("button", { name: "作成", exact: true })).not.toBeVisible();
  });

  test("タイトルと期限を指定してタスクを作成できる", async ({ page }) => {
    await page.getByRole("button", { name: "+ 新規作成" }).click();
    await page.getByLabel("タイトル").fill("期限付きタスク");
    await page.getByLabel("期限").fill("2099-12-31");
    await page.getByRole("button", { name: "作成", exact: true }).click();

    await expect(page.getByText("期限付きタスク")).toBeVisible();
  });

  test("作成後のタスクはtodoステータスで表示される", async ({ page }) => {
    await page.getByRole("button", { name: "+ 新規作成" }).click();
    await page.getByLabel("タイトル").fill("ステータス確認タスク");
    await page.getByRole("button", { name: "作成", exact: true }).click();

    const card = page.locator(".border.rounded-lg").filter({ hasText: "ステータス確認タスク" });
    await expect(card.locator("span").filter({ hasText: "未着手" })).toBeVisible();
  });

  // 異常系
  test("タイトルが空の場合フォームが送信されない", async ({ page }) => {
    await page.getByRole("button", { name: "+ 新規作成" }).click();
    await page.getByRole("button", { name: "作成", exact: true }).click();

    // HTML5 required によりフォームが送信されずフォーカスが当たる
    const titleInput = page.getByLabel("タイトル");
    await expect(titleInput).toBeFocused();
  });

  test("タイトルは100文字以内に制限されている", async ({ page }) => {
    await page.getByRole("button", { name: "+ 新規作成" }).click();
    const input = page.getByLabel("タイトル");
    // pressSequentially はブラウザの maxLength を尊重する
    await input.pressSequentially("a".repeat(101));
    await expect(input).toHaveValue("a".repeat(100));
  });

  test("キャンセルボタンでフォームが閉じる", async ({ page }) => {
    await page.getByRole("button", { name: "+ 新規作成" }).click();
    await page.getByLabel("タイトル").fill("キャンセルテスト");
    await page.getByRole("button", { name: "キャンセル" }).click();

    await expect(page.getByRole("button", { name: "作成", exact: true })).not.toBeVisible();
    await expect(page.getByRole("button", { name: "+ 新規作成" })).toBeVisible();
  });
});
