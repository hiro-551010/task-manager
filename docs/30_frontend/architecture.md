# フロントエンドアーキテクチャ

## 基本方針

| 関心事 | 方針 |
|---|---|
| データ取得（Read） | React Server Components（RSC）でサーバー側 fetch |
| データ変更（Write） | Server Actions（React 19）でフォーム送信・楽観的更新 |
| 状態管理 | React 組み込みのみ（外部状態管理ライブラリは導入しない） |
| 型共有 | `packages/shared` で API 型・Zod スキーマをフロント・バック共用 |

---

## ディレクトリ構成（`apps/web/src/`）

```
src/
├── app/                            # ルーティング + RSC（データ取得のみ）
│   ├── layout.tsx
│   ├── page.tsx
│   └── <ctx>/                      # bounded-context 単位のルート
│       ├── page.tsx                # 一覧ページ（RSC）
│       └── [id]/
│           └── page.tsx            # 詳細ページ（RSC）
│
├── components/
│   ├── ui/                         # shadcn/ui プリミティブ（自動生成）
│   └── features/
│       └── <ctx>/                  # bounded-context 対応コンポーネント
│
└── lib/
    ├── api/
    │   └── <ctx>.ts                # fetch ラッパー（RSC・Server Actions 両用）
    └── actions/
        └── <ctx>-actions.ts        # Server Actions（CUD 操作）
```

---

## レイヤー構成

### `app/`（ルーティング層）

- RSC として動作し、`lib/api/` を呼んで初期データを取得する
- ビジネスロジックを持たない。取得したデータを `components/features/` に渡すだけ

```
app/tasks/page.tsx（RSC）
  → lib/api/tasks.ts で GET /tasks
  → <TaskList tasks={tasks} /> に渡す
```

### `lib/api/`（APIクライアント層）

- `fetch` のラッパー。RSC（サーバー）と Server Actions（サーバー）の両方から呼ばれる
- `packages/shared` の型でレスポンスを型付けする
- エラーハンドリングをここで統一する

### `lib/actions/`（ミューテーション層）

- `"use server"` ディレクティブで定義する Server Actions
- フォーム送信・ボタン操作をここで処理し、`revalidatePath` でキャッシュを更新する
- React 19 の `useActionState` + `useOptimistic` と組み合わせて楽観的更新を実現する

### `components/features/<ctx>/`（UI層）

- bounded-context に対応した機能コンポーネントを置く
- `"use client"` が必要なインタラクション（フォーム・ドロップダウンなど）はここに集約する
- shadcn/ui の `components/ui/` プリミティブを組み合わせて構築する

---

## データフロー

```
【ページ表示（Read）】
app/<ctx>/page.tsx（RSC）
  → lib/api/<ctx>.ts
    → GET /api/... （Hono API）
  → <FeatureList> に props として渡す

【操作（Write）】
<FeatureForm> で送信
  → lib/actions/<ctx>-actions.ts（Server Action）
    → lib/api/<ctx>.ts
      → POST / PATCH / DELETE（Hono API）
    → revalidatePath でキャッシュ更新
  → UI が自動再レンダー
```

---

## `packages/shared` との関係

バックエンドのリクエスト検証とフロントのフォームバリデーションを **同じ Zod スキーマで共有** する。

| ファイル | バックエンド用途 | フロントエンド用途 |
|---|---|---|
| `types/<ctx>.ts` | レスポンス型の参照 | API レスポンスの型付け |
| `schemas/<ctx>.ts` | Hono の zod-validator でリクエスト検証 | フォームの入力バリデーション |
| `constants/<ctx>.ts` | ステータス値などの定数参照 | UI の選択肢・ラベル表示 |

---

## コンポーネント設計方針

- `components/ui/` は shadcn/ui が自動生成するプリミティブのみを置く（手動編集しない）
- `components/features/<ctx>/` はドメインの語彙でコンポーネントを命名する
- Server Component / Client Component の境界は `app/` 層と `components/features/` 層の間を基本とする
- `features/` の命名は React Context API との混同を避けるため `contexts/` は使わない

---

## 関連ドキュメント

- 技術スタック：`docs/01_project/tech-stack.md`
- bounded-context 単位の UI 設計：`docs/30_frontend/<ctx>/_index.md`
- バックエンド API 契約：`docs/10_contexts/<ctx>/interfaces/api.md`
