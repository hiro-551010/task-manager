import type { TaskDomainEvent } from "../events";
import { DueDate } from "../value-objects/due-date";
import { TaskId } from "../value-objects/task-id";
import { TaskStatus, type TaskStatusValue } from "../value-objects/task-status";
import { Title } from "../value-objects/title";

export class Task {
  private _domainEvents: TaskDomainEvent[] = [];

  private constructor(
    readonly id: TaskId,
    private _title: Title,
    private _status: TaskStatus,
    private _dueDate: DueDate | null,
    readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(params: { title: string; dueDate?: Date }): Task {
    const now = new Date();
    const task = new Task(
      TaskId.generate(),
      Title.create(params.title),
      TaskStatus.initial(),
      params.dueDate ? DueDate.create(params.dueDate) : null,
      now,
      now,
    );
    task._domainEvents.push({
      type: "TaskCreated",
      taskId: task.id.value,
      title: task._title.value,
      occurredAt: now,
    });
    return task;
  }

  static reconstruct(params: {
    id: string;
    title: string;
    status: TaskStatusValue;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Task {
    return new Task(
      TaskId.reconstruct(params.id),
      Title.create(params.title),
      TaskStatus.reconstruct(params.status),
      params.dueDate ? DueDate.reconstruct(params.dueDate) : null,
      params.createdAt,
      params.updatedAt,
    );
  }

  get title(): string {
    return this._title.value;
  }

  get status(): TaskStatusValue {
    return this._status.value;
  }

  get dueDate(): Date | null {
    return this._dueDate?.value ?? null;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get domainEvents(): TaskDomainEvent[] {
    return [...this._domainEvents];
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  changeStatus(next: TaskStatusValue): void {
    const prev = this._status.value;
    this._status = this._status.transitionTo(next);
    this._updatedAt = new Date();
    this._domainEvents.push({
      type: "TaskStatusChanged",
      taskId: this.id.value,
      from: prev,
      to: next,
      occurredAt: this._updatedAt,
    });
  }

  updateTitle(title: string): void {
    this._title = Title.create(title);
    this._updatedAt = new Date();
  }

  updateDueDate(dueDate: Date | null): void {
    this._dueDate = dueDate ? DueDate.create(dueDate) : null;
    this._updatedAt = new Date();
  }
}
