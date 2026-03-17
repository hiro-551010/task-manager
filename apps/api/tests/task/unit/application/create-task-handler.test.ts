import { describe, expect, it, beforeEach } from "vitest";
import { DomainError } from "@/shared_kernel/errors";
import { CreateTaskHandler } from "@/modules/task/application/handlers/create-task-handler";
import { FakeTaskRepository } from "@/tests/_shared/fakes/fake-task-repository";

const USER_ID = "01HUSER000000000000000000";

describe("CreateTaskHandler", () => {
  let handler: CreateTaskHandler;

  beforeEach(() => {
    handler = new CreateTaskHandler(new FakeTaskRepository());
  });

  it("タスクを作成して DTO を返す", async () => {
    const dto = await handler.handle({ userId: USER_ID, title: "テストタスク" });
    expect(dto.title).toBe("テストタスク");
    expect(dto.status).toBe("todo");
    expect(dto.dueDate).toBeNull();
    expect(dto.id).toBeDefined();
    expect(dto.ownerId).toBe(USER_ID);
  });

  it("期限付きで作成できる", async () => {
    const dueDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const dto = await handler.handle({ userId: USER_ID, title: "テストタスク", dueDate: dueDate.toISOString() });
    expect(dto.dueDate).toBeDefined();
  });

  it("無効なタイトルは DomainError になる", async () => {
    await expect(handler.handle({ userId: USER_ID, title: "" })).rejects.toThrow(DomainError);
  });
});
