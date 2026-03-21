export class UserId {
  private constructor(readonly value: string) {}

  static reconstruct(value: string): UserId {
    return new UserId(value);
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
