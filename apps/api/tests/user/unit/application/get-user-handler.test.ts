import { describe, expect, it, beforeEach, vi } from "vitest";
import { ApplicationError } from "@/shared_kernel/errors";
import { GetUserHandler } from "@/modules/user/application/handlers/get-user-handler";
import { RegisterUserHandler } from "@/modules/user/application/handlers/register-user-handler";
import { FakeUserRepository } from "@/tests/_shared/fakes/fake-user-repository";

vi.stubGlobal("Bun", {
  password: {
    hash: vi.fn().mockResolvedValue("$2b$10$stubbedhash"),
  },
});

describe("GetUserHandler", () => {
  let getHandler: GetUserHandler;
  let registerHandler: RegisterUserHandler;
  let repo: FakeUserRepository;

  beforeEach(() => {
    repo = new FakeUserRepository();
    getHandler = new GetUserHandler(repo);
    registerHandler = new RegisterUserHandler(repo);
  });

  it("ID でユーザーを取得できる", async () => {
    const registered = await registerHandler.handle({
      name: "田中 太郎",
      email: "tanaka@example.com",
      password: "password123",
    });
    const dto = await getHandler.handle({ id: registered.id });
    expect(dto.id).toBe(registered.id);
    expect(dto.name).toBe("田中 太郎");
    expect(dto.email).toBe("tanaka@example.com");
  });

  it("存在しない ID は ApplicationError になる", async () => {
    await expect(getHandler.handle({ id: "01NONEXISTENT000000000000" })).rejects.toThrow(
      ApplicationError
    );
  });
});
