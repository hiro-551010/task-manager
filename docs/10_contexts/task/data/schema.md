# task データスキーマ

## テーブル：tasks

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | text | PRIMARY KEY | ULID |
| user_id | text | NOT NULL | 所有ユーザーID（users.id を参照） |
| title | text | NOT NULL | タイトル（1〜100文字） |
| status | text | NOT NULL, DEFAULT 'todo' | `todo` / `in_progress` / `done` |
| due_date | timestamptz | NULL 可 | 期限 |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 作成日時 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 更新日時 |

> `user_id` は user context の `users.id` を参照するが、DB の外部キー制約は設けない（bounded context 間の疎結合を維持するため）。整合性はアプリケーション層で保証する。

## マイグレーション方針

- 今回の `user_id` 追加は破壊的変更のため、既存データ（tasks テーブル全件）を削除してから追加する
- Expand / Contract 戦略の適用は既存データが存在する場合に行うが、開発初期段階のため単純なリセットを採用する
- マイグレーションファイルは `migrations/task/` に配置する
