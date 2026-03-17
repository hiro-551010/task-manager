import type { SessionRepository } from "../../domain/repositories/session-repository";
import { SessionId } from "../../domain/value-objects/session-id";
import type { UserCredentialPort } from "../ports/user-credential-port";
import type { AuthUserDto } from "../dtos/auth-user-dto";

export class GetSessionHandler {
  constructor(
    private readonly sessionRepo: SessionRepository,
    private readonly userCredentials: UserCredentialPort,
  ) {}

  async handle(sessionId: string): Promise<AuthUserDto | null> {
    const session = await this.sessionRepo.findById(SessionId.reconstruct(sessionId));
    if (!session) return null;

    const user = await this.userCredentials.findById(session.userId);
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
