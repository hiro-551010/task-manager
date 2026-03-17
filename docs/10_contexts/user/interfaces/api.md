# user context — API 契約

## Base URL

`/users`

---

## POST /users — ユーザー登録

**リクエスト**
```json
{
  "name": "山田 太郎",
  "email": "taro@example.com",
  "password": "password123"
}
```

**レスポンス** `201 Created`
```json
{
  "id": "01HXX...",
  "name": "山田 太郎",
  "email": "taro@example.com",
  "createdAt": "2026-03-16T00:00:00.000Z",
  "updatedAt": "2026-03-16T00:00:00.000Z"
}
```

**エラー**
- `400` メールアドレス重複 / バリデーションエラー

---

## GET /users — ユーザー一覧

**レスポンス** `200 OK`
```json
[
  {
    "id": "01HXX...",
    "name": "山田 太郎",
    "email": "taro@example.com",
    "createdAt": "2026-03-16T00:00:00.000Z",
    "updatedAt": "2026-03-16T00:00:00.000Z"
  }
]
```

---

## GET /users/:id — ユーザー取得

**レスポンス** `200 OK` / `404 Not Found`

---

## PATCH /users/:id — プロフィール更新

**リクエスト**
```json
{ "name": "新しい名前" }
```

**レスポンス** `200 OK` / `404 Not Found`
