import type { SessionRepository } from "../../domain/repositories/session-repository";
import { SessionId } from "../../domain/value-objects/session-id";

export type LogoutCommand = {
  sessionId: string;
};

export class LogoutHandler {
  constructor(private readonly sessionRepo: SessionRepository) {}

  async handle(command: LogoutCommand): Promise<void> {
    await this.sessionRepo.delete(SessionId.reconstruct(command.sessionId));
  }
}
