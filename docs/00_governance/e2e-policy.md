# E2E テストポリシー

## 概要

Playwright を使用したブラウザ自動化テスト。フロントエンド（`apps/web`）が正常に動作することを、実際のブラウザ操作を通じて検証する。

---

## テスト対象スコープ

以下の3レベルをすべてカバーする。

| レベル | 内容 | 配置 |
|---|---|---|
| スモーク | 各ページが正常表示されるか（Next.js エラーオーバーレイなし） | `e2e/smoke/` |
| ハッピーパス | タスク CRUD の正常系フローを一通り確認 | `e2e/scenarios/` |
| 異常系 | バリデーションエラー・存在しない ID・不正な遷移など | `e2e/scenarios/` |

---

## ディレクトリ構成

```
apps/web/
└── e2e/
    ├── playwright.config.ts
    ├── smoke/
    │   └── health.spec.ts          # 全ページ正常表示確認
    ├── scenarios/
    │   └── task/
    │       ├── create.spec.ts      # タスク作成（正常系・異常系）
    │       ├── update.spec.ts      # タスク更新（正常系・異常系）
    │       ├── status.spec.ts      # ステータス変更（正常系・不正遷移）
    │       └── delete.spec.ts      # タスク削除（正常系・存在しない ID）
    └── fixtures/
        └── db.ts                   # テスト DB セットアップ・teardown
```

---

## テスト DB

本番 DB（port 5432）とは分離した専用 DB を使用する。

| 項目 | 内容 |
|---|---|
| サービス名 | `db-test`（docker-compose.yml に追加） |
| ポート | `5433:5432` |
| DB 名 | `taskdb_test` |
| 環境変数 | `TEST_DATABASE_URL`（`apps/api/.env.local` に追記） |

### リセット方針

**テストスイート開始時に全テーブルを truncate する。**

- 各 `spec` ファイルの `beforeAll` で truncate を実行する
- テストケース間は状態を引き継ぐ（ロールバックは使用しない）

---

## エラー検出時の出力

テスト失敗時は以下の2形式で出力する。

| 出力 | 内容 | 用途 |
|---|---|---|
| Playwright HTML レポート | スクリーンショット・トレース・ログ | 人間がブラウザで確認 |
| `e2e/error-report.json` | エラーメッセージ・スタックトレース・発生ページ | Claude Code が読んで修正できる形式 |

`error-report.json` のフォーマット：

```json
[
  {
    "page": "/tasks",
    "type": "runtime_error",
    "message": "...",
    "stack": "...",
    "screenshot": "test-results/xxx.png"
  }
]
```

---

## 実行方法

```bash
# 手動実行
bun run --filter @task-manager/web e2e

# テスト用 DB のみ起動
docker compose up db-test -d
```

---

## CI（GitHub Actions）

PR 時に自動実行する。

- トリガー：`apps/web/**` または `apps/api/**` を変更する PR
- 実行内容：`db-test` コンテナ起動 → マイグレーション → Playwright 実行
- 失敗時：`error-report.json` と Playwright レポートをアーティファクトとして保存

---

## 関連ドキュメント

- フロントエンドアーキテクチャ：`docs/30_frontend/architecture.md`
- テストポリシー（バックエンド）：`docs/00_governance/test-policy.md`
- API 契約：`docs/10_contexts/task/interfaces/api.md`
