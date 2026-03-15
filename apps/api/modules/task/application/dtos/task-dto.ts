import type { Task } from "../../domain/aggregates/task";

export type TaskDto = {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export const toTaskDto = (task: Task): TaskDto => ({
  id: task.id.value,
  title: task.title,
  status: task.status,
  dueDate: task.dueDate?.toISOString() ?? null,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
});
