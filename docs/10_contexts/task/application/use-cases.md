# task アプリケーション層 — ユースケース

## コマンド（状態変更）

### Create
タスクを作成する。

**入力**
| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| title | string | ✓ | タイトル（1〜100文字） |
| dueDate | string (ISO 8601) | | 期限 |

**出力**：作成したタスクの `TaskDto`

**エラー**
- `DomainError`：タイトルが空 / 100文字超 / 過去の期限

---

### Update
タスクのタイトル・期限を更新する。

**入力**
| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| id | string | ✓ | タスクID |
| title | string | | タイトル |
| dueDate | string (ISO 8601) \| null | | 期限（null で削除） |

**出力**：更新後の `TaskDto`

**エラー**
- `ApplicationError`：タスクが存在しない
- `DomainError`：バリデーション違反

---

### ChangeStatus
タスクのステータスを変更する。

**入力**
| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| id | string | ✓ | タスクID |
| status | `todo` \| `in_progress` \| `done` | ✓ | 変更後のステータス |

**出力**：更新後の `TaskDto`

**エラー**
- `ApplicationError`：タスクが存在しない
- `DomainError`：許可されていないステータス遷移

---

### Delete
タスクを削除する。

**入力**
| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| id | string | ✓ | タスクID |

**出力**：なし

**エラー**
- `ApplicationError`：タスクが存在しない

---

## クエリ（参照）

### Get
IDでタスクを1件取得する。

**入力**：`id: string`

**出力**：`TaskDto`

**エラー**
- `ApplicationError`：タスクが存在しない

---

### GetAll
全タスクを取得する。

**入力**：なし

**出力**：`TaskDto[]`

---

## DTO

### TaskDto
```ts
type TaskDto = {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  dueDate: string | null; // ISO 8601
  createdAt: string;      // ISO 8601
  updatedAt: string;      // ISO 8601
};
```

---

## ハンドラー命名

ハンドラーはコンテキスト名を含める（presentation 層からのインポートを明示的にするため）。

| コマンド / クエリ | ハンドラー名 |
|---|---|
| Create | `CreateTaskHandler` |
| Update | `UpdateTaskHandler` |
| ChangeStatus | `ChangeTaskStatusHandler` |
| Delete | `DeleteTaskHandler` |
| Get | `GetTaskHandler` |
| GetAll | `GetAllTasksHandler` |
