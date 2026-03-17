import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { UserContainer } from "../../infrastructure/persistence/container";
import { handleError } from "./error-handler";

const registerSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

const updateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
});

export const createUserRouter = (container: UserContainer) => {
  const router = new Hono();

  router.get("/", async (c) => {
    try {
      const users = await container.getAllUsers.handle();
      return c.json(users, 200);
    } catch (err) {
      return handleError(err, c);
    }
  });

  router.get("/:id", async (c) => {
    try {
      const user = await container.getUser.handle({ id: c.req.param("id") });
      return c.json(user, 200);
    } catch (err) {
      return handleError(err, c);
    }
  });

  router.post("/", zValidator("json", registerSchema), async (c) => {
    try {
      const body = c.req.valid("json");
      const user = await container.registerUser.handle(body);
      return c.json(user, 201);
    } catch (err) {
      return handleError(err, c);
    }
  });

  router.patch("/:id", zValidator("json", updateSchema), async (c) => {
    try {
      const body = c.req.valid("json");
      const user = await container.updateUser.handle({ id: c.req.param("id"), ...body });
      return c.json(user, 200);
    } catch (err) {
      return handleError(err, c);
    }
  });

  return router;
};
