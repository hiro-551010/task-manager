import { ApplicationError } from "@/shared_kernel/errors";
import { TaskId } from "../../domain/value-objects/task-id";
import { UserId } from "../../domain/value-objects/user-id";
import type { TaskRepository } from "../../domain/repositories/task-repository";
import type { Update } from "../commands/update";
import { type TaskDto, toTaskDto } from "../dtos/task-dto";

export class UpdateTaskHandler {
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(command: Update): Promise<TaskDto> {
    const task = await this.taskRepository.findById(TaskId.reconstruct(command.id));
    if (!task) {
      throw new ApplicationError("task.not_found", `タスクが見つかりません: ${command.id}`);
    }
    if (!task.ownerId.equals(UserId.reconstruct(command.userId))) {
      throw new ApplicationError("task.forbidden", "このタスクへのアクセス権がありません");
    }
    if (command.title !== undefined) {
      task.updateTitle(command.title);
    }
    if (command.dueDate !== undefined) {
      task.updateDueDate(command.dueDate ? new Date(command.dueDate) : null);
    }
    await this.taskRepository.save(task);
    return toTaskDto(task);
  }
}
