import type { TaskStatusValue } from "../../domain/value-objects/task-status";

export type ChangeStatus = {
  id: string;
  status: TaskStatusValue;
};
