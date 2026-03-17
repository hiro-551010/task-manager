import { describe, expect, it, beforeEach, vi } from "vitest";
import { GetAllUsersHandler } from "@/modules/user/application/handlers/get-all-users-handler";
import { RegisterUserHandler } from "@/modules/user/application/handlers/register-user-handler";
import { FakeUserRepository } from "@/tests/_shared/fakes/fake-user-repository";

vi.stubGlobal("Bun", {
  password: {
    hash: vi.fn().mockResolvedValue("$2b$10$stubbedhash"),
  },
});

describe("GetAllUsersHandler", () => {
  let getAllHandler: GetAllUsersHandler;
  let registerHandler: RegisterUserHandler;
  let repo: FakeUserRepository;

  beforeEach(() => {
    repo = new FakeUserRepository();
    getAllHandler = new GetAllUsersHandler(repo);
    registerHandler = new RegisterUserHandler(repo);
  });

  it("全ユーザーを取得できる", async () => {
    await registerHandler.handle({ name: "田中", email: "tanaka@example.com", password: "pass1234" });
    await registerHandler.handle({ name: "鈴木", email: "suzuki@example.com", password: "pass1234" });

    const dtos = await getAllHandler.handle();
    expect(dtos).toHaveLength(2);
  });

  it("ユーザーが0件のとき空配列を返す", async () => {
    const dtos = await getAllHandler.handle();
    expect(dtos).toHaveLength(0);
  });
});
