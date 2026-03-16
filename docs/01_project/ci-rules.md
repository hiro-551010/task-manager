# CI ルール

## 目的

- PRの実行時間を抑えつつ、必要十分なテストを必ず回す
- 「どのctxが変わったか」をパスから判定し、対象だけ実行する

---

## 変更判定ルール（パス → ctx）

以下のパスに変更が入った場合、その `<ctx>` を「変更対象」とする：

- `modules/<ctx>/**`
- `docs/10_contexts/<ctx>/**`
- `migrations/<ctx>/**`
- `tests/<ctx>/**`

以下は **全ctx対象** とする（横断影響が大きい）：

- `shared_kernel/**`
- `docs/00_governance/**`
- `docs/01_project/**`
- `tools/architecture-tests/**`
- `bootstrap/**`
- CI設定（`.github/workflows/**`）

---

## 実行するテスト（変更対象ctxがある場合）

変更対象となった各 `<ctx>` について以下を実行する：

- `tests/<ctx>/unit/**`（必須）
- `tests/<ctx>/integration/**`（必須：infra/DB/migrations変更がある場合。推奨は常に実行）
- `tests/<ctx>/contract/**`（必須：presentation/http または interfaces/api.md が変更された場合）
- e2e は原則スキップ（nightlyで実行）

---

## 常に実行するチェック（全PR）

- lint / format
- `tools/architecture-tests/**`（依存ルール違反検知）
- unit（全体 or 変更ctx）
  - 推奨：unitは全体（速い場合）
  - 重い場合：変更ctxのみ

---

## CI実装メモ

- `git diff --name-only origin/main...HEAD` で変更ファイルを取得
- 正規表現で `<ctx>` を抽出して重複排除
- ルールに沿ってテストコマンドを組み立てる
- `shared_kernel/**` が含まれる場合は全ctxを実行する
