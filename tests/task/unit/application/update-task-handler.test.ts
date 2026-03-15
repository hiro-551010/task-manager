import { beforeEach, describe, expect, it } from "vitest";
import { ApplicationError, DomainError } from "@/shared_kernel/errors";
import { CreateTaskHandler } from "@/modules/task/application/handlers/create-task-handler";
import { UpdateTaskHandler } from "@/modules/task/application/handlers/update-task-handler";
import { FakeTaskRepository } from "@/tests/_shared/fakes/fake-task-repository";

describe("UpdateTaskHandler", () => {
  let repository: FakeTaskRepository;
  let createHandler: CreateTaskHandler;
  let handler: UpdateTaskHandler;

  beforeEach(() => {
    repository = new FakeTaskRepository();
    createHandler = new CreateTaskHandler(repository);
    handler = new UpdateTaskHandler(repository);
  });

  it("タイトルを更新できる", async () => {
    const created = await createHandler.handle({ title: "旧タイトル" });
    const updated = await handler.handle({ id: created.id, title: "新タイトル" });
    expect(updated.title).toBe("新タイトル");
  });

  it("期限を削除できる", async () => {
    const dueDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const created = await createHandler.handle({ title: "タスク", dueDate: dueDate.toISOString() });
    const updated = await handler.handle({ id: created.id, dueDate: null });
    expect(updated.dueDate).toBeNull();
  });

  it("存在しない ID は ApplicationError になる", async () => {
    await expect(handler.handle({ id: "not-exist", title: "新タイトル" })).rejects.toThrow(
      ApplicationError,
    );
  });

  it("無効なタイトルは DomainError になる", async () => {
    const created = await createHandler.handle({ title: "タスク" });
    await expect(handler.handle({ id: created.id, title: "" })).rejects.toThrow(DomainError);
  });
});
