import { DomainError } from "@/shared_kernel/errors";

export class DueDate {
  private constructor(readonly value: Date) {}

  static create(value: Date): DueDate {
    if (value < new Date()) {
      throw new DomainError("task.due_date.past", "期限に過去の日付は設定できません");
    }
    return new DueDate(value);
  }

  static reconstruct(value: Date): DueDate {
    return new DueDate(value);
  }
}
