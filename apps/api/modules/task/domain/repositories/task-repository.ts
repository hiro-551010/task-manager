import type { Task } from "../aggregates/task";
import type { TaskId } from "../value-objects/task-id";
import type { UserId } from "../value-objects/user-id";

export interface TaskRepository {
  findById(id: TaskId): Promise<Task | null>;
  findAllByOwner(ownerId: UserId): Promise<Task[]>;
  save(task: Task): Promise<void>;
  delete(id: TaskId): Promise<void>;
}
