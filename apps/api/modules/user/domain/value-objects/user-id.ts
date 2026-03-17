import { generateUlid } from "@/shared_kernel/ids";

export class UserId {
  private constructor(readonly value: string) {}

  static generate(): UserId {
    return new UserId(generateUlid());
  }

  static reconstruct(value: string): UserId {
    return new UserId(value);
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
