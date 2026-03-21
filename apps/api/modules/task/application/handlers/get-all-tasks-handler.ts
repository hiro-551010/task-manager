import type { TaskRepository } from "../../domain/repositories/task-repository";
import { UserId } from "../../domain/value-objects/user-id";
import { type TaskDto, toTaskDto } from "../dtos/task-dto";

export class GetAllTasksHandler {
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(query: { userId: string }): Promise<TaskDto[]> {
    const tasks = await this.taskRepository.findAllByOwner(UserId.reconstruct(query.userId));
    return tasks.map(toTaskDto);
  }
}
