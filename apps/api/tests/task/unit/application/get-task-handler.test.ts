import { beforeEach, describe, expect, it } from "vitest";
import { ApplicationError } from "@/shared_kernel/errors";
import { CreateTaskHandler } from "@/modules/task/application/handlers/create-task-handler";
import { GetAllTasksHandler } from "@/modules/task/application/handlers/get-all-tasks-handler";
import { GetTaskHandler } from "@/modules/task/application/handlers/get-task-handler";
import { FakeTaskRepository } from "@/tests/_shared/fakes/fake-task-repository";

const USER_ID = "01HUSER000000000000000000";
const OTHER_USER_ID = "01HOTHER00000000000000000";

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
    const created = await createHandler.handle({ userId: USER_ID, title: "タスク" });
    const fetched = await handler.handle({ userId: USER_ID, id: created.id });
    expect(fetched.id).toBe(created.id);
    expect(fetched.title).toBe("タスク");
  });

  it("存在しない ID は ApplicationError になる", async () => {
    await expect(handler.handle({ userId: USER_ID, id: "not-exist" })).rejects.toThrow(ApplicationError);
  });

  it("他ユーザーのタスクは ApplicationError になる", async () => {
    const created = await createHandler.handle({ userId: USER_ID, title: "タスク" });
    await expect(handler.handle({ userId: OTHER_USER_ID, id: created.id })).rejects.toThrow(ApplicationError);
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

  it("自分のタスクのみ取得できる", async () => {
    await createHandler.handle({ userId: USER_ID, title: "タスク1" });
    await createHandler.handle({ userId: USER_ID, title: "タスク2" });
    await createHandler.handle({ userId: OTHER_USER_ID, title: "他ユーザーのタスク" });
    const tasks = await handler.handle({ userId: USER_ID });
    expect(tasks).toHaveLength(2);
    expect(tasks.every((t) => t.ownerId === USER_ID)).toBe(true);
  });

  it("タスクが0件のとき空配列を返す", async () => {
    const tasks = await handler.handle({ userId: USER_ID });
    expect(tasks).toHaveLength(0);
  });
});
