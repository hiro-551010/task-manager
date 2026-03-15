import { DomainError } from "@/shared_kernel/errors";

export class PasswordHash {
  private constructor(readonly value: string) {}

  static reconstruct(value: string): PasswordHash {
    if (!value) {
      throw new DomainError("user.password_hash.empty", "パスワードハッシュが空です");
    }
    return new PasswordHash(value);
  }
}
