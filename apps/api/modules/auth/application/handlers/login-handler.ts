import { ApplicationError } from "@/shared_kernel/errors";
import { Session } from "../../domain/aggregates/session";
import type { SessionRepository } from "../../domain/repositories/session-repository";
import type { UserCredentialPort } from "../ports/user-credential-port";
import type { AuthUserDto } from "../dtos/auth-user-dto";

export type LoginCommand = {
  email: string;
  password: string;
};

export type LoginResult = {
  sessionId: string;
  user: AuthUserDto;
};

export class LoginHandler {
  constructor(
    private readonly sessionRepo: SessionRepository,
    private readonly userCredentials: UserCredentialPort,
  ) {}

  async handle(command: LoginCommand): Promise<LoginResult> {
    const credentials = await this.userCredentials.findByEmail(command.email.toLowerCase());
    if (!credentials) {
      throw new ApplicationError(
        "auth.login.invalid",
        "メールアドレスまたはパスワードが正しくありません",
      );
    }

    const valid = await Bun.password.verify(command.password, credentials.passwordHash);
    if (!valid) {
      throw new ApplicationError(
        "auth.login.invalid",
        "メールアドレスまたはパスワードが正しくありません",
      );
    }

    const session = Session.create(credentials.id);
    await this.sessionRepo.save(session);

    return {
      sessionId: session.id.value,
      user: {
        id: credentials.id,
        name: credentials.name,
        email: credentials.email,
        createdAt: credentials.createdAt.toISOString(),
        updatedAt: credentials.updatedAt.toISOString(),
      },
    };
  }
}
