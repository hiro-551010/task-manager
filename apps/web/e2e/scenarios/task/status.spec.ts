import { test, expect } from "@playwright/test";
import { truncateTables } from "../../fixtures/db";

test.beforeEach(async () => {
  await truncateTables();
});

test.describe("タスクステータス変更", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tasks");
    await page.getByRole("button", { name: "+ 新規作成" }).click();
    await page.getByLabel("タイトル").fill("ステータステストタスク");
    await page.getByRole("button", { name: "作成", exact: true }).click();
    await expect(page.getByText("ステータステストタスク")).toBeVisible();
  });

  test("todo → in_progress に変更できる", async ({ page }) => {
    const card = page.locator(".border.rounded-lg").filter({ hasText: "ステータステストタスク" });
    await card.getByRole("button", { name: "→ 進行中" }).click();

    await expect(card.locator("span.rounded-full").filter({ hasText: "進行中" })).toBeVisible();
    await expect(card.getByRole("button", { name: "→ 未着手" })).toBeVisible();
    await expect(card.getByRole("button", { name: "→ 完了" })).toBeVisible();
  });

  test("in_progress → done に変更できる", async ({ page }) => {
    const card = page.locator(".border.rounded-lg").filter({ hasText: "ステータステストタスク" });
    await card.getByRole("button", { name: "→ 進行中" }).click();
    await expect(card.locator("span.rounded-full").filter({ hasText: "進行中" })).toBeVisible();

    await card.getByRole("button", { name: "→ 完了" }).click();
    await expect(card.locator("span.rounded-full").filter({ hasText: "完了" })).toBeVisible();
    // done からはステータス変更ボタンが表示されない
    await expect(card.getByRole("button", { name: /→/ })).not.toBeVisible();
  });

  test("in_progress → todo に戻せる", async ({ page }) => {
    const card = page.locator(".border.rounded-lg").filter({ hasText: "ステータステストタスク" });
    await card.getByRole("button", { name: "→ 進行中" }).click();
    await expect(card.locator("span.rounded-full").filter({ hasText: "進行中" })).toBeVisible();

    await card.getByRole("button", { name: "→ 未着手" }).click();
    await expect(card.locator("span.rounded-full").filter({ hasText: "未着手" })).toBeVisible();
  });

  // 異常系: 不正な遷移はボタンが存在しないことで保証される
  test("todo から直接 done への変更ボタンは存在しない", async ({ page }) => {
    const card = page.locator(".border.rounded-lg").filter({ hasText: "ステータステストタスク" });
    await expect(card.getByRole("button", { name: "→ 完了" })).not.toBeVisible();
  });

  test("done からの変更ボタンは表示されない", async ({ page }) => {
    const card = page.locator(".border.rounded-lg").filter({ hasText: "ステータステストタスク" });
    await card.getByRole("button", { name: "→ 進行中" }).click();
    await card.getByRole("button", { name: "→ 完了" }).click();
    await expect(card.locator("span.rounded-full").filter({ hasText: "完了" })).toBeVisible();

    await expect(card.getByRole("button", { name: /→/ })).not.toBeVisible();
  });
});
