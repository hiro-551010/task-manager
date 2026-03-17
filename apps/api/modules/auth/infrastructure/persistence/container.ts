import { GetSessionHandler } from "../../application/handlers/get-session-handler";
import { LoginHandler } from "../../application/handlers/login-handler";
import { LogoutHandler } from "../../application/handlers/logout-handler";
import { DrizzleSessionRepository } from "./session-repository-impl";
import { DrizzleUserCredentialReader } from "./user-credential-reader";

export type AuthContainer = ReturnType<typeof createAuthContainer>;

export const createAuthContainer = () => {
  const sessionRepo = new DrizzleSessionRepository();
  const userCredentials = new DrizzleUserCredentialReader();
  return {
    login: new LoginHandler(sessionRepo, userCredentials),
    logout: new LogoutHandler(sessionRepo),
    getSession: new GetSessionHandler(sessionRepo, userCredentials),
  };
};
