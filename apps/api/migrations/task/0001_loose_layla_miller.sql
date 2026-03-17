-- 既存タスクを全削除してから user_id カラムを追加する
DELETE FROM "tasks";
ALTER TABLE "tasks" ADD COLUMN "user_id" text NOT NULL;
