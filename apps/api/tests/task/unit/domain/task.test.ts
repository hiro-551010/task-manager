import { describe, expect, it } from "vitest";
import { DomainError } from "@/shared_kernel/errors";
import { Task } from "@/modules/task/domain/aggregates/task";

describe("Task", () => {
  describe("create", () => {
    it("タスクを作成できる", () => {
      const task = Task.create({ title: "テストタスク" });
      expect(task.title).toBe("テストタスク");
      expect(task.status).toBe("todo");
      expect(task.dueDate).toBeNull();
    });

    it("期限付きで作成できる", () => {
      const dueDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
      const task = Task.create({ title: "期限付きタスク", dueDate });
      expect(task.dueDate).toEqual(dueDate);
    });

    it("TaskCreated イベントが発行される", () => {
      const task = Task.create({ title: "テストタスク" });
      const events = task.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe("TaskCreated");
    });

    it("無効なタイトルは DomainError になる", () => {
      expect(() => Task.create({ title: "" })).toThrow(DomainError);
    });
  });

  describe("changeStatus", () => {
    it("ステータスを変更できる", () => {
      const task = Task.create({ title: "テストタスク" });
      task.changeStatus("in_progress");
      expect(task.status).toBe("in_progress");
    });

    it("TaskStatusChanged イベントが発行される", () => {
      const task = Task.create({ title: "テストタスク" });
      task.clearDomainEvents();
      task.changeStatus("in_progress");
      const events = task.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe("TaskStatusChanged");
    });

    it("禁止された遷移は DomainError になる", () => {
      const task = Task.create({ title: "テストタスク" });
      expect(() => task.changeStatus("done")).toThrow(DomainError);
    });
  });

  describe("updateTitle", () => {
    it("タイトルを更新できる", () => {
      const task = Task.create({ title: "旧タイトル" });
      task.updateTitle("新タイトル");
      expect(task.title).toBe("新タイトル");
    });

    it("無効なタイトルは DomainError になる", () => {
      const task = Task.create({ title: "テストタスク" });
      expect(() => task.updateTitle("")).toThrow(DomainError);
    });
  });

  describe("updateDueDate", () => {
    it("期限を更新できる", () => {
      const task = Task.create({ title: "テストタスク" });
      const dueDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
      task.updateDueDate(dueDate);
      expect(task.dueDate).toEqual(dueDate);
    });

    it("null で期限を削除できる", () => {
      const dueDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
      const task = Task.create({ title: "テストタスク", dueDate });
      task.updateDueDate(null);
      expect(task.dueDate).toBeNull();
    });
  });
});
