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

## テーブル: sessions

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | text | PRIMARY KEY | ULID（セッション ID） |
| user_id | text | NOT NULL, FK → users.id | 所有ユーザー |
| created_at | timestamptz | NOT NULL, DEFAULT now() | セッション作成日時 |

- セッションの有効期限は現時点では管理しない（将来拡張可）
- ログアウト時にレコードを削除する

## マイグレーション

- 設定: `apps/api/drizzle.user.config.ts`
- 出力: `apps/api/migrations/user/`
