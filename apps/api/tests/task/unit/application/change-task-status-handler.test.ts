import { beforeEach, describe, expect, it } from "vitest";
import { ApplicationError, DomainError } from "@/shared_kernel/errors";
import { ChangeTaskStatusHandler } from "@/modules/task/application/handlers/change-task-status-handler";
import { CreateTaskHandler } from "@/modules/task/application/handlers/create-task-handler";
import { FakeTaskRepository } from "@/tests/_shared/fakes/fake-task-repository";

const USER_ID = "01HUSER000000000000000000";
const OTHER_USER_ID = "01HOTHER00000000000000000";

describe("ChangeTaskStatusHandler", () => {
  let repository: FakeTaskRepository;
  let createHandler: CreateTaskHandler;
  let handler: ChangeTaskStatusHandler;

  beforeEach(() => {
    repository = new FakeTaskRepository();
    createHandler = new CreateTaskHandler(repository);
    handler = new ChangeTaskStatusHandler(repository);
  });

  it("ステータスを変更できる", async () => {
    const created = await createHandler.handle({ userId: USER_ID, title: "タスク" });
    const updated = await handler.handle({ userId: USER_ID, id: created.id, status: "in_progress" });
    expect(updated.status).toBe("in_progress");
  });

  it("存在しない ID は ApplicationError になる", async () => {
    await expect(handler.handle({ userId: USER_ID, id: "not-exist", status: "in_progress" })).rejects.toThrow(
      ApplicationError,
    );
  });

  it("他ユーザーのタスクは ApplicationError になる", async () => {
    const created = await createHandler.handle({ userId: USER_ID, title: "タスク" });
    await expect(handler.handle({ userId: OTHER_USER_ID, id: created.id, status: "in_progress" })).rejects.toThrow(
      ApplicationError,
    );
  });

  it("禁止された遷移は DomainError になる", async () => {
    const created = await createHandler.handle({ userId: USER_ID, title: "タスク" });
    await expect(handler.handle({ userId: USER_ID, id: created.id, status: "done" })).rejects.toThrow(DomainError);
  });
});
