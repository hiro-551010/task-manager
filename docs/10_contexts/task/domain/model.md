# task ドメインモデル

## 集約

### Task（集約ルート）

タスクを表す集約。ステータス遷移と期限を管理する。

| フィールド | 型 | 説明 |
|---|---|---|
| id | TaskId | タスクID（ULID） |
| title | Title | タイトル |
| status | TaskStatus | ステータス |
| dueDate | DueDate \| null | 期限（任意） |
| createdAt | Date | 作成日時 |
| updatedAt | Date | 更新日時 |

---

## 値オブジェクト

### TaskId
- ULID 形式の文字列
- 生成時に自動付与

### Title
- 空文字不可
- 最大100文字

### TaskStatus
ステータスは以下の3種類。

| 値 | 説明 |
|---|---|
| `todo` | 未着手（初期状態） |
| `in_progress` | 進行中 |
| `done` | 完了 |

**遷移ルール：**

```
todo ──→ in_progress ──→ done
          ↑__________|
```

- `todo` → `in_progress`：着手
- `in_progress` → `done`：完了
- `in_progress` → `todo`：差し戻し
- `done` からの遷移は不可（終端状態）

### DueDate
- 省略可能
- 過去日付は設定不可（作成・更新時点で検証）

---

## ドメインイベント

| イベント | 発火タイミング |
|---|---|
| `TaskCreated` | タスク作成時 |
| `TaskStatusChanged` | ステータス変更時 |
