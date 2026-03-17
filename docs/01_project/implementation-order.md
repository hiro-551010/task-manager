# 実装順序（このプロジェクト）

汎用的な DDD 実装順序の原則は `docs/00_governance/implementation-order.md` を参照すること。

---

## 順序

ドキュメント → ドメイン層 → アプリケーション層 → インフラ層 → API プレゼンテーション層 → `packages/shared` 型定義 → Web UI 層 → ユニット / インテグレーション / コントラクトテスト → E2E テスト

## 追加ステップの理由

- API プレゼンテーション層（Hono）はアプリケーション層が揃ってから繋ぐ
- `packages/shared` の型定義は API レスポンス型が確定してから切り出す（API 実装後）
- Web UI 層は `packages/shared` の型が揃ってから実装する
- E2E テストは Web UI 層まで完成してから最後に書く（詳細は `docs/01_project/e2e-policy.md` を参照）
