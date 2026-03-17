import { describe, expect, it } from "vitest";
import { DomainError } from "@/shared_kernel/errors";
import { User } from "@/modules/user/domain/aggregates/user";
import { Email } from "@/modules/user/domain/value-objects/email";
import { UserName } from "@/modules/user/domain/value-objects/user-name";
import { PasswordHash } from "@/modules/user/domain/value-objects/password-hash";

describe("Email", () => {
  it("有効なメールアドレスを作成できる", () => {
    const email = Email.create("test@example.com");
    expect(email.value).toBe("test@example.com");
  });

  it("大文字を小文字に正規化する", () => {
    const email = Email.create("Test@Example.COM");
    expect(email.value).toBe("test@example.com");
  });

  it("不正な形式は DomainError になる", () => {
    expect(() => Email.create("not-an-email")).toThrow(DomainError);
    expect(() => Email.create("missing@domain")).toThrow(DomainError);
    expect(() => Email.create("@no-local.com")).toThrow(DomainError);
  });

  it("同じ値のEmailは等しい", () => {
    const a = Email.create("a@example.com");
    const b = Email.create("a@example.com");
    expect(a.equals(b)).toBe(true);
  });
});

describe("UserName", () => {
  it("有効な名前を作成できる", () => {
    const name = UserName.create("田中 太郎");
    expect(name.value).toBe("田中 太郎");
  });

  it("前後の空白をトリムする", () => {
    const name = UserName.create("  田中  ");
    expect(name.value).toBe("田中");
  });

  it("空文字は DomainError になる", () => {
    expect(() => UserName.create("")).toThrow(DomainError);
    expect(() => UserName.create("   ")).toThrow(DomainError);
  });

  it("50文字超は DomainError になる", () => {
    expect(() => UserName.create("a".repeat(51))).toThrow(DomainError);
  });

  it("50文字はOK", () => {
    const name = UserName.create("a".repeat(50));
    expect(name.value).toHaveLength(50);
  });
});

describe("PasswordHash", () => {
  it("ハッシュ文字列を保持できる", () => {
    const hash = PasswordHash.reconstruct("$2b$10$hashedvalue");
    expect(hash.value).toBe("$2b$10$hashedvalue");
  });

  it("空文字は DomainError になる", () => {
    expect(() => PasswordHash.reconstruct("")).toThrow(DomainError);
  });
});

describe("User", () => {
  describe("create", () => {
    it("ユーザーを作成できる", () => {
      const user = User.create({
        name: "田中 太郎",
        email: "tanaka@example.com",
        passwordHash: "$2b$10$hash",
      });
      expect(user.name).toBe("田中 太郎");
      expect(user.email).toBe("tanaka@example.com");
      expect(user.id).toBeDefined();
    });

    it("UserRegistered イベントが発行される", () => {
      const user = User.create({
        name: "田中 太郎",
        email: "tanaka@example.com",
        passwordHash: "$2b$10$hash",
      });
      const events = user.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe("UserRegistered");
    });

    it("不正なメールアドレスは DomainError になる", () => {
      expect(() =>
        User.create({ name: "田中", email: "invalid", passwordHash: "$2b$10$hash" })
      ).toThrow(DomainError);
    });

    it("空の名前は DomainError になる", () => {
      expect(() =>
        User.create({ name: "", email: "tanaka@example.com", passwordHash: "$2b$10$hash" })
      ).toThrow(DomainError);
    });
  });

  describe("updateName", () => {
    it("名前を更新できる", () => {
      const user = User.create({
        name: "旧名前",
        email: "user@example.com",
        passwordHash: "$2b$10$hash",
      });
      user.updateName("新名前");
      expect(user.name).toBe("新名前");
    });

    it("無効な名前は DomainError になる", () => {
      const user = User.create({
        name: "田中",
        email: "user@example.com",
        passwordHash: "$2b$10$hash",
      });
      expect(() => user.updateName("")).toThrow(DomainError);
    });
  });
});
