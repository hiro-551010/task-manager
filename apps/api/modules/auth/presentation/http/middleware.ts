import type { Context, MiddlewareHandler, Next } from "hono";
import { getCookie } from "hono/cookie";
import { generateUlid } from "@/shared_kernel/ids";
import type { GetSessionHandler } from "../../application/handlers/get-session-handler";

export const SESSION_COOKIE = "session_id";

export type AuthVariables = { userId: string };

const unauthorizedResponse = (c: Context) =>
  c.json(
    {
      error: {
        code: "auth.unauthorized",
        message: "認証が必要です",
        details: {},
        trace_id: generateUlid(),
      },
    },
    401,
  );

export const createSessionMiddleware = (
  getSession: GetSessionHandler,
): MiddlewareHandler<{ Variables: AuthVariables }> => {
  return async (c, next: Next) => {
    const sessionId = getCookie(c, SESSION_COOKIE);
    if (!sessionId) return unauthorizedResponse(c);

    const user = await getSession.handle(sessionId);
    if (!user) return unauthorizedResponse(c);

    c.set("userId", user.id);
    await next();
  };
};
