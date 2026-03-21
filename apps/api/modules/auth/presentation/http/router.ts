import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import type { AuthContainer } from "../../infrastructure/persistence/container";
import { handleAuthError } from "./error-handler";
import { SESSION_COOKIE } from "./middleware";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createAuthRouter = (container: AuthContainer) => {
  const router = new Hono();

  router.post("/login", zValidator("json", loginSchema), async (c) => {
    try {
      const body = c.req.valid("json");
      const result = await container.login.handle(body);
      setCookie(c, SESSION_COOKIE, result.sessionId, {
        httpOnly: true,
        sameSite: "Lax",
        path: "/",
      });
      return c.json(result.user, 200);
    } catch (err) {
      return handleAuthError(err, c);
    }
  });

  router.post("/logout", async (c) => {
    try {
      const sessionId = getCookie(c, SESSION_COOKIE);
      if (sessionId) {
        await container.logout.handle({ sessionId });
      }
      deleteCookie(c, SESSION_COOKIE, { path: "/" });
      return c.body(null, 204);
    } catch (err) {
      return handleAuthError(err, c);
    }
  });

  router.get("/session", async (c) => {
    try {
      const sessionId = getCookie(c, SESSION_COOKIE);
      if (!sessionId) return c.json(null, 200);
      const user = await container.getSession.handle(sessionId);
      return c.json(user, 200);
    } catch (err) {
      return handleAuthError(err, c);
    }
  });

  return router;
};
