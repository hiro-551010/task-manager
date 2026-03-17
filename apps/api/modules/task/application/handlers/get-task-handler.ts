import { ApplicationError } from "@/shared_kernel/errors";
import type { TaskRepository } from "../../domain/repositories/task-repository";
import { TaskId } from "../../domain/value-objects/task-id";
import { UserId } from "../../domain/value-objects/user-id";
import type { Get } from "../queries/get";
import { type TaskDto, toTaskDto } from "../dtos/task-dto";

export class GetTaskHandler {
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(query: Get): Promise<TaskDto> {
    const task = await this.taskRepository.findById(TaskId.reconstruct(query.id));
    if (!task) {
      throw new ApplicationError("task.not_found", `タスクが見つかりません: ${query.id}`);
    }
    if (!task.ownerId.equals(UserId.reconstruct(query.userId))) {
      throw new ApplicationError("task.forbidden", "このタスクへのアクセス権がありません");
    }
    return toTaskDto(task);
  }
}
