import { generateUlid } from "@/shared_kernel/ids";

export class SessionId {
  private constructor(readonly value: string) {}

  static generate(): SessionId {
    return new SessionId(generateUlid());
  }

  static reconstruct(value: string): SessionId {
    return new SessionId(value);
  }
}
