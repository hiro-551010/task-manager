# auth — フロントエンド設計

## 概要

ログインと新規登録を1ページで提供する認証画面。未認証時はすべてのページからこの画面にリダイレクトされる。

---

## ページ構成

### `/auth` — ログイン・新規登録

タブまたはトグルでログインフォームと新規登録フォームを切り替える。

**ログインフォーム**

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| email | email | ✓ | メールアドレス |
| password | password | ✓ | パスワード |

送信先：`POST /auth/login`

**新規登録フォーム**

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| name | text | ✓ | 表示名 |
| email | email | ✓ | メールアドレス |
| password | password | ✓ | パスワード |

送信先：`POST /users`（登録後、自動的に `POST /auth/login` でセッションを取得）

---

## 認証フロー

```
未認証ユーザーがページにアクセス
        ↓
middleware で session_id Cookie を確認
        ↓
Cookie なし or 無効 → /auth にリダイレクト
        ↓
ログイン or 新規登録フォームを送信
        ↓
成功 → session_id Cookie がセット → /tasks にリダイレクト
```

### Next.js middleware

`apps/web/src/middleware.ts` でセッション確認を行う。

- 保護対象：`/tasks/**` など認証が必要なルート
- 認証不要：`/auth`
- セッション確認：`GET /auth/session`（API 側の `/auth/session` エンドポイントで Cookie の有効性を確認）

---

## ログアウト

ナビゲーションバーにログアウトボタンを配置。

1. `POST /auth/logout` を呼び出す（Server Action）
2. `session_id` Cookie が削除される
3. `/auth` にリダイレクト

---

## API クライアント層の責務

- `loginAction(email, password)` → `POST /auth/login`
- `registerAction(name, email, password)` → `POST /users` → `POST /auth/login`
- `logoutAction()` → `POST /auth/logout`

Server Action として実装し、Cookie は Next.js のサーバー側で自動的に扱う。

---

## エラーハンドリング

| エラー | 表示 |
|---|---|
| 401（ログイン失敗） | 「メールアドレスまたはパスワードが違います」 |
| 400（バリデーション違反） | フィールドごとのエラーメッセージ |
| その他 | 「予期しないエラーが発生しました」 |

パスワードの詳細（存在しないメールアドレス vs パスワード不一致）は区別して表示しない（セキュリティ上の理由）。
