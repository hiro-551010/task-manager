import { describe, expect, it, beforeEach, vi } from "vitest";
import { ApplicationError, DomainError } from "@/shared_kernel/errors";
import { RegisterUserHandler } from "@/modules/user/application/handlers/register-user-handler";
import { FakeUserRepository } from "@/tests/_shared/fakes/fake-user-repository";

// Bun.password は Node.js 環境（Vitest）では使えないためスタブする
vi.stubGlobal("Bun", {
  password: {
    hash: vi.fn().mockResolvedValue("$2b$10$stubbedhash"),
  },
});

describe("RegisterUserHandler", () => {
  let handler: RegisterUserHandler;
  let repo: FakeUserRepository;

  beforeEach(() => {
    repo = new FakeUserRepository();
    handler = new RegisterUserHandler(repo);
  });

  it("ユーザーを登録して DTO を返す", async () => {
    const dto = await handler.handle({
      name: "田中 太郎",
      email: "tanaka@example.com",
      password: "password123",
    });
    expect(dto.name).toBe("田中 太郎");
    expect(dto.email).toBe("tanaka@example.com");
    expect(dto.id).toBeDefined();
  });

  it("パスワードはハッシュ化されて保存される（平文で保存されない）", async () => {
    const dto = await handler.handle({
      name: "田中",
      email: "tanaka@example.com",
      password: "password123",
    });
    // DTO にパスワードハッシュは含まれない
    expect(dto).not.toHaveProperty("passwordHash");
    expect(dto).not.toHaveProperty("password");
  });

  it("同じメールアドレスで登録すると ApplicationError になる", async () => {
    await handler.handle({
      name: "田中",
      email: "tanaka@example.com",
      password: "password123",
    });
    await expect(
      handler.handle({ name: "別ユーザー", email: "tanaka@example.com", password: "pass1234" })
    ).rejects.toThrow(ApplicationError);
  });

  it("メールアドレスの比較は大文字小文字を区別しない", async () => {
    await handler.handle({
      name: "田中",
      email: "tanaka@example.com",
      password: "password123",
    });
    await expect(
      handler.handle({ name: "別ユーザー", email: "TANAKA@EXAMPLE.COM", password: "pass1234" })
    ).rejects.toThrow(ApplicationError);
  });

  it("不正なメールアドレスは DomainError になる", async () => {
    await expect(
      handler.handle({ name: "田中", email: "invalid-email", password: "password123" })
    ).rejects.toThrow(DomainError);
  });

  it("空の名前は DomainError になる", async () => {
    await expect(
      handler.handle({ name: "", email: "tanaka@example.com", password: "password123" })
    ).rejects.toThrow(DomainError);
  });
});
