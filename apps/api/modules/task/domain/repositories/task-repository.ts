import type { Task } from "../aggregates/task";
import type { TaskId } from "../value-objects/task-id";

export interface TaskRepository {
  findById(id: TaskId): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  save(task: Task): Promise<void>;
  delete(id: TaskId): Promise<void>;
}
