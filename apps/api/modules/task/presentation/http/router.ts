import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { TaskContainer } from "../../infrastructure/persistence/container";
import { handleError } from "./error-handler";

const createSchema = z.object({
  title: z.string().min(1).max(100),
  dueDate: z.string().datetime().optional(),
});

const updateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

const changeStatusSchema = z.object({
  status: z.enum(["todo", "in_progress", "done"]),
});

export const createTaskRouter = (container: TaskContainer) => {
  const router = new Hono();

  router.get("/", async (c) => {
    try {
      const tasks = await container.getAllTasks.handle();
      return c.json(tasks, 200);
    } catch (err) {
      return handleError(err, c);
    }
  });

  router.get("/:id", async (c) => {
    try {
      const task = await container.getTask.handle({ id: c.req.param("id") });
      return c.json(task, 200);
    } catch (err) {
      return handleError(err, c);
    }
  });

  router.post("/", zValidator("json", createSchema), async (c) => {
    try {
      const body = c.req.valid("json");
      const task = await container.createTask.handle(body);
      return c.json(task, 201);
    } catch (err) {
      return handleError(err, c);
    }
  });

  router.patch("/:id", zValidator("json", updateSchema), async (c) => {
    try {
      const body = c.req.valid("json");
      const task = await container.updateTask.handle({ id: c.req.param("id"), ...body });
      return c.json(task, 200);
    } catch (err) {
      return handleError(err, c);
    }
  });

  router.patch("/:id/status", zValidator("json", changeStatusSchema), async (c) => {
    try {
      const body = c.req.valid("json");
      const task = await container.changeTaskStatus.handle({ id: c.req.param("id"), ...body });
      return c.json(task, 200);
    } catch (err) {
      return handleError(err, c);
    }
  });

  router.delete("/:id", async (c) => {
    try {
      await container.deleteTask.handle({ id: c.req.param("id") });
      return c.body(null, 204);
    } catch (err) {
      return handleError(err, c);
    }
  });

  return router;
};
