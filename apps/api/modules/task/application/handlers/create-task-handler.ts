import { Task } from "../../domain/aggregates/task";
import type { TaskRepository } from "../../domain/repositories/task-repository";
import type { Create } from "../commands/create";
import { type TaskDto, toTaskDto } from "../dtos/task-dto";

export class CreateTaskHandler {
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(command: Create): Promise<TaskDto> {
    const task = Task.create({
      ownerId: command.userId,
      title: command.title,
      dueDate: command.dueDate ? new Date(command.dueDate) : undefined,
    });
    await this.taskRepository.save(task);
    return toTaskDto(task);
  }
}
