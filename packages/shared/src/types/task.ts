export type TaskStatus = "todo" | "in_progress" | "done";

export type TaskDto = {
  id: string;
  ownerId: string;
  title: string;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};
