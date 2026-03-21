import { Hono } from "hono";
import { createAuthContainer } from "@/modules/auth/infrastructure/persistence/container";
import { createAuthRouter } from "@/modules/auth/presentation/http/router";
import { createSessionMiddleware } from "@/modules/auth/presentation/http/middleware";
import { createTaskContainer } from "@/modules/task/infrastructure/persistence/container";
import { createTaskRouter } from "@/modules/task/presentation/http/router";
import { createUserContainer } from "@/modules/user/infrastructure/persistence/container";
import { createUserRouter } from "@/modules/user/presentation/http/router";

const app = new Hono();

const authContainer = createAuthContainer();
const sessionMiddleware = createSessionMiddleware(authContainer.getSession);

app.get("/", (c) => c.json({ message: "ok" }));
app.route("/auth", createAuthRouter(authContainer));
app.route("/users", createUserRouter(createUserContainer()));
app.use("/tasks/*", sessionMiddleware);
app.route("/tasks", createTaskRouter(createTaskContainer()));

export default {
  port: 3000,
  fetch: app.fetch,
};
