import { ApplicationError } from "@/shared_kernel/errors";
import type { TaskRepository } from "../../domain/repositories/task-repository";
import { TaskId } from "../../domain/value-objects/task-id";
import type { ChangeStatus } from "../commands/change-status";
import { type TaskDto, toTaskDto } from "../dtos/task-dto";

export class ChangeTaskStatusHandler {
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(command: ChangeStatus): Promise<TaskDto> {
    const task = await this.taskRepository.findById(TaskId.reconstruct(command.id));
    if (!task) {
      throw new ApplicationError("task.not_found", `タスクが見つかりません: ${command.id}`);
    }
    task.changeStatus(command.status);
    await this.taskRepository.save(task);
    return toTaskDto(task);
  }
}
