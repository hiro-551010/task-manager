# Tech Stack

## プロジェクト概要

タスク管理 Web アプリ。バックエンドは DDD + Hono、フロントエンドは Next.js による構成。Bun workspaces によるモノレポで管理する。

---

## モノレポ構成

Bun workspaces によるモノレポ。

| パス | 内容 |
|---|---|
| `apps/api` | バックエンド（Hono + DDD） |
| `apps/web` | フロントエンド（Next.js） |
| `packages/shared` | フロント・バック共通の型・スキーマ・定数 |

---

## コア技術

### バックエンド（apps/api）

| 役割 | 技術 | バージョン |
|---|---|---|
| 言語 | TypeScript | 5.x |
| ランタイム | Bun | 最新安定版 |
| Web フレームワーク | Hono | 4.x |
| ORM | Drizzle ORM | 0.x |
| DB | PostgreSQL | 16 |
| バリデーション | Zod | 3.x |
| マイグレーション | drizzle-kit | Drizzle ORM に同梱 |

### フロントエンド（apps/web）

| 役割 | 技術 | バージョン |
|---|---|---|
| フレームワーク | Next.js（App Router） | 15.x |
| UI ライブラリ | React | 19.x |
| スタイリング | Tailwind CSS | 4.x |
| コンポーネント | shadcn/ui | 最新安定版 |
| バリデーション | Zod（packages/shared と共有） | 3.x |

### 共有パッケージ（packages/shared）

| 内容 | 説明 |
|---|---|
| `types/` | API リクエスト/レスポンス型定義 |
| `schemas/` | Zod スキーマ（フロント・バック共通バリデーション） |
| `constants/` | 共通定数（ステータス値など） |

---

## 開発ツール

| 役割 | 技術 |
|---|---|
| パッケージマネージャー / ワークスペース | Bun workspaces |
| テスト | Vitest |
| Lint | Biome |
| フォーマット | Biome |
| DB（ローカル） | Docker Compose + PostgreSQL |

---

## 主要コマンド

```bash
bun install                      # 全パッケージの依存インストール
bun run dev                      # 全アプリ開発サーバー起動
bun run --filter api dev         # API のみ起動
bun run --filter web dev         # Web のみ起動
bun run test                     # 全テスト実行
bun run lint                     # Lint（全体）
bun run migrate                  # マイグレーション実行
docker compose up -d             # ローカル DB 起動
```

---

## 技術選定の理由

### Next.js（App Router）
- React Server Components によりサーバーサイドでのデータフェッチが可能
- App Router でファイルベースルーティングを簡潔に管理できる
- Bun との親和性が高く、モノレポで統一したランタイムを使用できる

### shadcn/ui
- Tailwind CSS ベースで自由にカスタマイズ可能
- コンポーネントのソースコードをプロジェクトにコピーして管理するため、外部依存を最小化できる
- アクセシビリティ対応済みのコンポーネントを即座に利用できる

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
