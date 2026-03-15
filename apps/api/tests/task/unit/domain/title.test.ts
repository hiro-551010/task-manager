import { describe, expect, it } from "vitest";
import { DomainError } from "@/shared_kernel/errors";
import { Title } from "@/modules/task/domain/value-objects/title";

describe("Title", () => {
  it("有効なタイトルで生成できる", () => {
    const title = Title.create("タスク名");
    expect(title.value).toBe("タスク名");
  });

  it("前後の空白をトリムする", () => {
    const title = Title.create("  タスク名  ");
    expect(title.value).toBe("タスク名");
  });

  it("空文字は DomainError になる", () => {
    expect(() => Title.create("")).toThrow(DomainError);
  });

  it("空白のみは DomainError になる", () => {
    expect(() => Title.create("   ")).toThrow(DomainError);
  });

  it("100文字は有効", () => {
    const title = Title.create("a".repeat(100));
    expect(title.value).toBe("a".repeat(100));
  });

  it("101文字は DomainError になる", () => {
    expect(() => Title.create("a".repeat(101))).toThrow(DomainError);
  });
});
