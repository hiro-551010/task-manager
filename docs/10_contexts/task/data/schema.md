# task データスキーマ

## テーブル：tasks

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | text | PRIMARY KEY | ULID |
| title | text | NOT NULL | タイトル（1〜100文字） |
| status | text | NOT NULL, DEFAULT 'todo' | `todo` / `in_progress` / `done` |
| due_date | timestamptz | NULL 可 | 期限 |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 作成日時 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 更新日時 |

## マイグレーション方針

- Expand / Contract 戦略を採用する
- カラム追加は Expand フェーズ、削除は Contract フェーズで行う
- マイグレーションファイルは `migrations/task/` に配置する
