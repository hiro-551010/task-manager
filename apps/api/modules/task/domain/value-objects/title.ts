import { DomainError } from "@/shared_kernel/errors";

export class Title {
  private constructor(readonly value: string) {}

  static create(value: string): Title {
    if (value.trim().length === 0) {
      throw new DomainError("task.title.empty", "タイトルは空にできません");
    }
    if (value.length > 100) {
      throw new DomainError("task.title.too_long", "タイトルは100文字以内にしてください");
    }
    return new Title(value.trim());
  }
}
