import { ApplicationError } from "@/shared_kernel/errors";
import type { TaskRepository } from "../../domain/repositories/task-repository";
import { TaskId } from "../../domain/value-objects/task-id";
import type { Delete } from "../commands/delete";

export class DeleteTaskHandler {
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(command: Delete): Promise<void> {
    const id = TaskId.reconstruct(command.id);
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new ApplicationError("task.not_found", `タスクが見つかりません: ${command.id}`);
    }
    await this.taskRepository.delete(id);
  }
}
