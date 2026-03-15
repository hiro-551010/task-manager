import { Hono } from "hono";
import { createTaskContainer } from "@/modules/task/infrastructure/persistence/container";
import { createTaskRouter } from "@/modules/task/presentation/http/router";
import { createUserContainer } from "@/modules/user/infrastructure/persistence/container";
import { createUserRouter } from "@/modules/user/presentation/http/router";

const app = new Hono();

app.get("/", (c) => c.json({ message: "ok" }));
app.route("/tasks", createTaskRouter(createTaskContainer()));
app.route("/users", createUserRouter(createUserContainer()));

export default {
  port: 3000,
  fetch: app.fetch,
};