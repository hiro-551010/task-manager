export type TaskCreated = {
  type: "TaskCreated";
  taskId: string;
  title: string;
  occurredAt: Date;
};

export type TaskStatusChanged = {
  type: "TaskStatusChanged";
  taskId: string;
  from: string;
  to: string;
  occurredAt: Date;
};

export type TaskDomainEvent = TaskCreated | TaskStatusChanged;
