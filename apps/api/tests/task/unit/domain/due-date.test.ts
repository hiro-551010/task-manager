import { describe, expect, it } from "vitest";
import { DomainError } from "@/shared_kernel/errors";
import { DueDate } from "@/modules/task/domain/value-objects/due-date";

describe("DueDate", () => {
  it("未来の日付で生成できる", () => {
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const dueDate = DueDate.create(future);
    expect(dueDate.value).toEqual(future);
  });

  it("過去の日付は DomainError になる", () => {
    const past = new Date(Date.now() - 1000);
    expect(() => DueDate.create(past)).toThrow(DomainError);
  });

  it("reconstruct は過去日付でも生成できる（DB復元用）", () => {
    const past = new Date(Date.now() - 1000);
    const dueDate = DueDate.reconstruct(past);
    expect(dueDate.value).toEqual(past);
  });
});
