import { SessionId } from "../value-objects/session-id";

export class Session {
  private constructor(
    readonly id: SessionId,
    readonly userId: string,
    readonly createdAt: Date,
  ) {}

  static create(userId: string): Session {
    return new Session(SessionId.generate(), userId, new Date());
  }

  static reconstruct(params: { id: string; userId: string; createdAt: Date }): Session {
    return new Session(SessionId.reconstruct(params.id), params.userId, params.createdAt);
  }
}
