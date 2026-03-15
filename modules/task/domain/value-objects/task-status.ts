import { DomainError } from "@/shared_kernel/errors";

export type TaskStatusValue = "todo" | "in_progress" | "done";

const ALLOWED_TRANSITIONS: Record<TaskStatusValue, TaskStatusValue[]> = {
  todo: ["in_progress"],
  in_progress: ["todo", "done"],
  done: [],
};

export class TaskStatus {
  private constructor(readonly value: TaskStatusValue) {}

  static initial(): TaskStatus {
    return new TaskStatus("todo");
  }

  static reconstruct(value: TaskStatusValue): TaskStatus {
    return new TaskStatus(value);
  }

  transitionTo(next: TaskStatusValue): TaskStatus {
    const allowed = ALLOWED_TRANSITIONS[this.value];
    if (!allowed.includes(next)) {
      throw new DomainError(
        "task.status.invalid_transition",
        `${this.value} から ${next} への遷移はできません`,
      );
    }
    return new TaskStatus(next);
  }
}
