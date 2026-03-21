import type { TaskStatusValue } from "../../domain/value-objects/task-status";

export type ChangeStatus = {
  userId: string;
  id: string;
  status: TaskStatusValue;
};
