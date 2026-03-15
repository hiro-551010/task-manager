import { beforeEach, describe, expect, it } from "vitest";
import { ApplicationError } from "@/shared_kernel/errors";
import { CreateTaskHandler } from "@/modules/task/application/handlers/create-task-handler";
import { GetAllTasksHandler } from "@/modules/task/application/handlers/get-all-tasks-handler";
import { GetTaskHandler } from "@/modules/task/application/handlers/get-task-handler";
import { FakeTaskRepository } from "@/tests/_shared/fakes/fake-task-repository";

describe("GetTaskHandler", () => {
  let repository: FakeTaskRepository;
  let createHandler: CreateTaskHandler;
  let handler: GetTaskHandler;

  beforeEach(() => {
    repository = new FakeTaskRepository();
    createHandler = new CreateTaskHandler(repository);
    handler = new GetTaskHandler(repository);
  });

  it("タスクを取得できる", async () => {
    const created = await createHandler.handle({ title: "タスク" });
    const fetched = await handler.handle({ id: created.id });
    expect(fetched.id).toBe(created.id);
    expect(fetched.title).toBe("タスク");
  });

  it("存在しない ID は ApplicationError になる", async () => {
    await expect(handler.handle({ id: "not-exist" })).rejects.toThrow(ApplicationError);
  });
});

describe("GetAllTasksHandler", () => {
  let repository: FakeTaskRepository;
  let createHandler: CreateTaskHandler;
  let handler: GetAllTasksHandler;

  beforeEach(() => {
    repository = new FakeTaskRepository();
    createHandler = new CreateTaskHandler(repository);
    handler = new GetAllTasksHandler(repository);
  });

  it("全タスクを取得できる", async () => {
    await createHandler.handle({ title: "タスク1" });
    await createHandler.handle({ title: "タスク2" });
    const tasks = await handler.handle();
    expect(tasks).toHaveLength(2);
  });

  it("タスクが0件の場合は空配列を返す", async () => {
    const tasks = await handler.handle();
    expect(tasks).toHaveLength(0);
  });
});
