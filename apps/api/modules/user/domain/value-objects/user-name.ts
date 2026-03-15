import { DomainError } from "@/shared_kernel/errors";

export class UserName {
  private constructor(readonly value: string) {}

  static create(value: string): UserName {
    if (value.trim().length === 0) {
      throw new DomainError("user.name.empty", "名前は空にできません");
    }
    if (value.length > 50) {
      throw new DomainError("user.name.too_long", "名前は50文字以内にしてください");
    }
    return new UserName(value.trim());
  }
}
