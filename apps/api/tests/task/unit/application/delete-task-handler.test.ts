import { beforeEach, describe, expect, it } from "vitest";
import { ApplicationError } from "@/shared_kernel/errors";
import { CreateTaskHandler } from "@/modules/task/application/handlers/create-task-handler";
import { DeleteTaskHandler } from "@/modules/task/application/handlers/delete-task-handler";
import { GetTaskHandler } from "@/modules/task/application/handlers/get-task-handler";
import { FakeTaskRepository } from "@/tests/_shared/fakes/fake-task-repository";

const USER_ID = "01HUSER000000000000000000";
const OTHER_USER_ID = "01HOTHER00000000000000000";

describe("DeleteTaskHandler", () => {
  let repository: FakeTaskRepository;
  let createHandler: CreateTaskHandler;
  let deleteHandler: DeleteTaskHandler;
  let getHandler: GetTaskHandler;

  beforeEach(() => {
    repository = new FakeTaskRepository();
    createHandler = new CreateTaskHandler(repository);
    deleteHandler = new DeleteTaskHandler(repository);
    getHandler = new GetTaskHandler(repository);
  });

  it("タスクを削除できる", async () => {
    const created = await createHandler.handle({ userId: USER_ID, title: "タスク" });
    await deleteHandler.handle({ userId: USER_ID, id: created.id });
    await expect(getHandler.handle({ userId: USER_ID, id: created.id })).rejects.toThrow(ApplicationError);
  });

  it("存在しない ID は ApplicationError になる", async () => {
    await expect(deleteHandler.handle({ userId: USER_ID, id: "not-exist" })).rejects.toThrow(ApplicationError);
  });

  it("他ユーザーのタスクは ApplicationError になる", async () => {
    const created = await createHandler.handle({ userId: USER_ID, title: "タスク" });
    await expect(deleteHandler.handle({ userId: OTHER_USER_ID, id: created.id })).rejects.toThrow(ApplicationError);
  });
});
