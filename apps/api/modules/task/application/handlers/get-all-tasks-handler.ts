import type { TaskRepository } from "../../domain/repositories/task-repository";
import { type TaskDto, toTaskDto } from "../dtos/task-dto";

export class GetAllTasksHandler {
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(): Promise<TaskDto[]> {
    const tasks = await this.taskRepository.findAll();
    return tasks.map(toTaskDto);
  }
}
