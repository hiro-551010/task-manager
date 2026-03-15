# Tech Stack

## プロジェクト概要

タスク管理 Web API。ステータス遷移・期限管理を中心とした DDD 実装の練習を兼ねる。

---

## コア技術

| 役割 | 技術 | バージョン |
|---|---|---|
| 言語 | TypeScript | 5.x |
| ランタイム | Bun | 最新安定版 |
| Web フレームワーク | Hono | 4.x |
| ORM | Drizzle ORM | 0.x |
| DB | PostgreSQL | 16 |
| バリデーション | Zod | 3.x |
| マイグレーション | drizzle-kit | Drizzle ORM に同梱 |

---

## 開発ツール

| 役割 | 技術 |
|---|---|
| パッケージマネージャー | bun |
| テスト | Vitest |
| Lint | Biome |
| フォーマット | Biome |
| DB（ローカル） | Docker Compose + PostgreSQL |

---

## 主要コマンド

```bash
bun install                  # 依存インストール
bun run dev                  # 開発サーバー起動
bun run test                 # テスト実行
bun run lint                 # Lint
bun run migrate              # マイグレーション実行（drizzle-kit migrate）
bun run migrate:generate     # マイグレーションファイル生成（drizzle-kit generate）
docker compose up -d         # ローカル DB 起動
```

---

## 技術選定の理由

### Hono
- TypeScript ファーストで presentation 層の型安全を確保できる
- Zod との連携でリクエストバリデーションを簡潔に書ける
- ミドルウェアで認証・ロギング・エラーハンドリングを統一できる

### Drizzle ORM
- SQL に近い記法で infrastructure 層のクエリが予測しやすい
- drizzle-kit によりマイグレーションファイルを自動生成できる（Expand/Contract 戦略と相性が良い）
- スキーマ定義から TypeScript 型が自動生成され、Repository 実装が型安全になる

### Bun
- TypeScript をそのまま実行できる（トランスパイル不要）
- Vitest・テスト実行が高速

### Zod
- Hono のバリデーションミドルウェアと統合できる
- presentation 層での入力検証に使用し、domain 層には持ち込まない

---

## レイヤーと技術の対応

| レイヤー | 使用技術 |
|---|---|
| presentation | Hono（ルーティング・バリデーション）、Zod |
| application | TypeScript（純粋なユースケース） |
| domain | TypeScript（外部依存なし） |
| infrastructure | Drizzle ORM、PostgreSQL |

---

## Bounded Context

| Context | 説明 |
|---|---|
| `task` | タスクの CRUD・ステータス遷移・期限管理 |
| `user` | ユーザー管理・認証（フェーズ2以降） |

初期実装は `task` コンテキストのみ。
