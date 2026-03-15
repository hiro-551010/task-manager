import { DomainError } from "@/shared_kernel/errors";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private constructor(readonly value: string) {}

  static create(value: string): Email {
    if (!EMAIL_REGEX.test(value)) {
      throw new DomainError("user.email.invalid", "メールアドレスの形式が正しくありません");
    }
    return new Email(value.toLowerCase());
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
