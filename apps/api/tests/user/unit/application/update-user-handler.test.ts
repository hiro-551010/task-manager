import { describe, expect, it, beforeEach, vi } from "vitest";
import { ApplicationError, DomainError } from "@/shared_kernel/errors";
import { UpdateUserHandler } from "@/modules/user/application/handlers/update-user-handler";
import { RegisterUserHandler } from "@/modules/user/application/handlers/register-user-handler";
import { FakeUserRepository } from "@/tests/_shared/fakes/fake-user-repository";

vi.stubGlobal("Bun", {
  password: {
    hash: vi.fn().mockResolvedValue("$2b$10$stubbedhash"),
  },
});

describe("UpdateUserHandler", () => {
  let updateHandler: UpdateUserHandler;
  let registerHandler: RegisterUserHandler;
  let repo: FakeUserRepository;

  beforeEach(() => {
    repo = new FakeUserRepository();
    updateHandler = new UpdateUserHandler(repo);
    registerHandler = new RegisterUserHandler(repo);
  });

  it("名前を更新できる", async () => {
    const registered = await registerHandler.handle({
      name: "旧名前",
      email: "user@example.com",
      password: "password123",
    });
    const dto = await updateHandler.handle({ id: registered.id, name: "新名前" });
    expect(dto.name).toBe("新名前");
  });

  it("name を省略すると名前は変わらない", async () => {
    const registered = await registerHandler.handle({
      name: "田中",
      email: "user@example.com",
      password: "password123",
    });
    const dto = await updateHandler.handle({ id: registered.id });
    expect(dto.name).toBe("田中");
  });

  it("存在しない ID は ApplicationError になる", async () => {
    await expect(
      updateHandler.handle({ id: "01NONEXISTENT000000000000", name: "新名前" })
    ).rejects.toThrow(ApplicationError);
  });

  it("無効な名前は DomainError になる", async () => {
    const registered = await registerHandler.handle({
      name: "田中",
      email: "user@example.com",
      password: "password123",
    });
    await expect(updateHandler.handle({ id: registered.id, name: "" })).rejects.toThrow(
      DomainError
    );
  });
});
