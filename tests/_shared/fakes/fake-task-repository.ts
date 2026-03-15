import type { Task } from "@/modules/task/domain/aggregates/task";
import type { TaskRepository } from "@/modules/task/domain/repositories/task-repository";
import type { TaskId } from "@/modules/task/domain/value-objects/task-id";

export class FakeTaskRepository implements TaskRepository {
  private store = new Map<string, Task>();

  async findById(id: TaskId): Promise<Task | null> {
    return this.store.get(id.value) ?? null;
  }

  async findAll(): Promise<Task[]> {
    return [...this.store.values()];
  }

  async save(task: Task): Promise<void> {
    this.store.set(task.id.value, task);
  }

  async delete(id: TaskId): Promise<void> {
    this.store.delete(id.value);
  }
}
