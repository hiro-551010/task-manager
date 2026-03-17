import { eq } from "drizzle-orm";
import { InfrastructureError } from "@/shared_kernel/errors";
import { Task } from "../../domain/aggregates/task";
import type { TaskRepository } from "../../domain/repositories/task-repository";
import { TaskId } from "../../domain/value-objects/task-id";
import type { TaskStatusValue } from "../../domain/value-objects/task-status";
import type { UserId } from "../../domain/value-objects/user-id";
import { db } from "./db";
import { tasks } from "./schema";

export class DrizzleTaskRepository implements TaskRepository {
  async findById(id: TaskId): Promise<Task | null> {
    try {
      const records = await db.select().from(tasks).where(eq(tasks.id, id.value)).limit(1);
      if (records.length === 0) return null;
      return this.toDomain(records[0]);
    } catch (error) {
      throw new InfrastructureError("task.db.find_failed", "タスクの取得に失敗しました", error);
    }
  }

  async findAllByOwner(ownerId: UserId): Promise<Task[]> {
    try {
      const records = await db.select().from(tasks).where(eq(tasks.userId, ownerId.value));
      return records.map((r) => this.toDomain(r));
    } catch (error) {
      throw new InfrastructureError(
        "task.db.find_all_failed",
        "タスク一覧の取得に失敗しました",
        error,
      );
    }
  }

  async save(task: Task): Promise<void> {
    try {
      await db
        .insert(tasks)
        .values({
          id: task.id.value,
          userId: task.ownerId.value,
          title: task.title,
          status: task.status,
          dueDate: task.dueDate,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        })
        .onConflictDoUpdate({
          target: tasks.id,
          set: {
            title: task.title,
            status: task.status,
            dueDate: task.dueDate,
            updatedAt: task.updatedAt,
          },
        });
    } catch (error) {
      throw new InfrastructureError("task.db.save_failed", "タスクの保存に失敗しました", error);
    }
  }

  async delete(id: TaskId): Promise<void> {
    try {
      await db.delete(tasks).where(eq(tasks.id, id.value));
    } catch (error) {
      throw new InfrastructureError("task.db.delete_failed", "タスクの削除に失敗しました", error);
    }
  }

  private toDomain(record: typeof tasks.$inferSelect): Task {
    return Task.reconstruct({
      id: record.id,
      ownerId: record.userId,
      title: record.title,
      status: record.status as TaskStatusValue,
      dueDate: record.dueDate ?? null,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
