import { generateUlid } from "@/shared_kernel/ids";

export class TaskId {
  private constructor(readonly value: string) {}

  static generate(): TaskId {
    return new TaskId(generateUlid());
  }

  static reconstruct(value: string): TaskId {
    return new TaskId(value);
  }

  equals(other: TaskId): boolean {
    return this.value === other.value;
  }
}
