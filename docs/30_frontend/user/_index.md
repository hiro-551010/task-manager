# user context — フロントエンド設計

## ページ

| ページ | パス | 種別 |
|---|---|---|
| ユーザー一覧 | `/users` | RSC |

## コンポーネント構成

```
components/features/user/
├── user-list.tsx    # ユーザー一覧 + 登録フォームトグル
├── user-card.tsx    # ユーザーカード（名前・メール表示）
└── user-form.tsx    # 登録フォーム（mode: "create"）
```

## Server Actions

| Action | 処理 |
|---|---|
| `registerUser` | POST /users |
| `updateUser` | PATCH /users/:id |

## データフロー

- `GET /users` → RSC（`app/users/page.tsx`）でフェッチ → UserList に props で渡す
- 登録・更新 → Server Action → `revalidatePath("/users")`
