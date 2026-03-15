# task UI 設計

## 概要

task bounded-context に対応するフロントエンドのページ・コンポーネント設計。

## 関連ドキュメント

- バックエンド API 契約：`docs/10_contexts/task/interfaces/api.md`
- フロントエンド全体アーキテクチャ：`docs/30_frontend/architecture.md`

---

## ページ構成

| ルート | コンポーネント種別 | 説明 |
|---|---|---|
| `/tasks` | RSC | タスク一覧（初期データを GET /tasks で取得） |

---

## `/tasks` ページ

### 画面構成

```
┌─────────────────────────────────────┐
│  Tasks                  [+ 新規作成]  │
├─────────────────────────────────────┤
│  [タスク作成フォーム（展開時）]         │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │ タスクタイトル               │    │
│  │ 期限: 2026-04-01  [status▼] │    │
│  │               [編集] [削除] │    │
│  └─────────────────────────────┘    │
│  ...                                │
└─────────────────────────────────────┘
```

### コンポーネント構成

| コンポーネント | 種別 | 役割 |
|---|---|---|
| `app/tasks/page.tsx` | RSC | GET /tasks でデータ取得し TaskList に渡す |
| `features/task/task-list.tsx` | Client | タスク一覧表示・新規作成ボタン |
| `features/task/task-card.tsx` | Client | 1件表示・ステータス変更・編集・削除 |
| `features/task/task-form.tsx` | Client | 作成・編集フォーム（タイトル・期限） |

### ミューテーション

| 操作 | Server Action | API |
|---|---|---|
| タスク作成 | `createTask` | POST /tasks |
| タイトル・期限更新 | `updateTask` | PATCH /tasks/:id |
| ステータス変更 | `changeTaskStatus` | PATCH /tasks/:id/status |
| タスク削除 | `deleteTask` | DELETE /tasks/:id |

---

## packages/shared

| ファイル | 内容 |
|---|---|
| `types/task.ts` | `TaskDto` 型 |
| `schemas/task.ts` | `createTaskSchema` / `updateTaskSchema` / `changeTaskStatusSchema` |
| `constants/task.ts` | `TASK_STATUS`・ステータスラベル |
