import { describe, expect, it } from "vitest";
import { DomainError } from "@/shared_kernel/errors";
import { TaskStatus } from "@/modules/task/domain/value-objects/task-status";

describe("TaskStatus", () => {
  it("初期ステータスは todo", () => {
    expect(TaskStatus.initial().value).toBe("todo");
  });

  describe("遷移：許可", () => {
    it("todo → in_progress", () => {
      const status = TaskStatus.initial().transitionTo("in_progress");
      expect(status.value).toBe("in_progress");
    });

    it("in_progress → done", () => {
      const status = TaskStatus.reconstruct("in_progress").transitionTo("done");
      expect(status.value).toBe("done");
    });

    it("in_progress → todo（差し戻し）", () => {
      const status = TaskStatus.reconstruct("in_progress").transitionTo("todo");
      expect(status.value).toBe("todo");
    });
  });

  describe("遷移：禁止", () => {
    it("todo → done は DomainError", () => {
      expect(() => TaskStatus.initial().transitionTo("done")).toThrow(DomainError);
    });

    it("done → todo は DomainError", () => {
      expect(() => TaskStatus.reconstruct("done").transitionTo("todo")).toThrow(DomainError);
    });

    it("done → in_progress は DomainError", () => {
      expect(() => TaskStatus.reconstruct("done").transitionTo("in_progress")).toThrow(DomainError);
    });
  });
});
