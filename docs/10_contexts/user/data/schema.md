# user context — DB スキーマ

## テーブル: users

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | text | PRIMARY KEY | ULID |
| name | text | NOT NULL | 表示名 |
| email | text | NOT NULL, UNIQUE | メールアドレス |
| password_hash | text | NOT NULL | bcrypt ハッシュ |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 登録日時 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 更新日時 |

## マイグレーション

- 設定: `apps/api/drizzle.user.config.ts`
- 出力: `apps/api/migrations/user/`
