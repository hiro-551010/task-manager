# task API 契約

## エンドポイント一覧

| メソッド | パス | 説明 |
|---|---|---|
| GET | `/tasks` | タスク一覧取得 |
| GET | `/tasks/:id` | タスク1件取得 |
| POST | `/tasks` | タスク作成 |
| PATCH | `/tasks/:id` | タスク更新（タイトル・期限） |
| PATCH | `/tasks/:id/status` | ステータス変更 |
| DELETE | `/tasks/:id` | タスク削除 |

---

## GET /tasks

**レスポンス 200**
```json
[
  {
    "id": "01HXXX",
    "title": "タスク名",
    "status": "todo",
    "dueDate": "2026-04-01T00:00:00.000Z",
    "createdAt": "2026-03-15T00:00:00.000Z",
    "updatedAt": "2026-03-15T00:00:00.000Z"
  }
]
```

---

## GET /tasks/:id

**レスポンス 200**：TaskDto

**エラー**
- 404：タスクが存在しない

---

## POST /tasks

**リクエストボディ**
```json
{
  "title": "タスク名",
  "dueDate": "2026-04-01T00:00:00.000Z"
}
```

| フィールド | 型 | 必須 |
|---|---|---|
| title | string | ✓ |
| dueDate | string (ISO 8601) | |

**レスポンス 201**：TaskDto

**エラー**
- 400：バリデーション違反（空タイトル / 100文字超 / 過去の期限）

---

## PATCH /tasks/:id

**リクエストボディ**
```json
{
  "title": "新しいタイトル",
  "dueDate": null
}
```

| フィールド | 型 | 必須 |
|---|---|---|
| title | string | |
| dueDate | string (ISO 8601) \| null | |

**レスポンス 200**：TaskDto

**エラー**
- 400：バリデーション違反
- 404：タスクが存在しない

---

## PATCH /tasks/:id/status

**リクエストボディ**
```json
{
  "status": "in_progress"
}
```

| フィールド | 型 | 必須 |
|---|---|---|
| status | `todo` \| `in_progress` \| `done` | ✓ |

**レスポンス 200**：TaskDto

**エラー**
- 400：許可されていないステータス遷移
- 404：タスクが存在しない

---

## DELETE /tasks/:id

**レスポンス 204**：なし

**エラー**
- 404：タスクが存在しない

---

## エラーレスポンス形式

```json
{
  "error": {
    "code": "task.not_found",
    "message": "タスクが見つかりません",
    "details": {},
    "trace_id": "01HXXX"
  }
}
```

## ステータスコードマッピング

| エラー種別 | ステータスコード |
|---|---|
| DomainError（バリデーション違反・遷移不可） | 400 |
| ApplicationError（存在しない） | 404 |
| InfrastructureError | 503 |
| UnexpectedError | 500 |
