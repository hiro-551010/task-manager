# user context — ドメインモデル

## 集約: User

| フィールド | 型 | 説明 |
|---|---|---|
| id | UserId | ULID |
| name | UserName | 表示名 |
| email | Email | メールアドレス（一意） |
| passwordHash | PasswordHash | bcrypt ハッシュ済みパスワード |
| createdAt | Date | 登録日時 |
| updatedAt | Date | 最終更新日時 |

## Value Objects

| VO | ルール |
|---|---|
| UserId | ULID を生成または再構築 |
| UserName | 1〜50 文字の文字列 |
| Email | RFC 準拠メールアドレス形式、一意制約 |
| PasswordHash | ハッシュ済み文字列（Bun.password.hash による bcrypt） |

## ドメインイベント

| イベント | 発火タイミング |
|---|---|
| UserRegistered | ユーザー登録時 |
