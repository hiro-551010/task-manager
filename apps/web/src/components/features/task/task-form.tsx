"use client";

import { useActionState, useEffect, useRef } from "react";
import type { TaskDto } from "@task-manager/shared";
import { createTask, updateTask } from "@/lib/actions/task-actions";

type Props =
  | { mode: "create"; onClose: () => void }
  | { mode: "edit"; task: TaskDto; onClose: () => void };

export function TaskForm(props: Props) {
  const action = props.mode === "create" ? createTask : updateTask;
  const [state, dispatch, isPending] = useActionState(action, { error: null, success: false });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      props.onClose();
    }
  }, [state.success]);

  const task = props.mode === "edit" ? props.task : null;
  const dueDateValue = task?.dueDate ? task.dueDate.slice(0, 10) : "";

  return (
    <form ref={formRef} action={dispatch} className="flex flex-col gap-3 p-4 border rounded-lg bg-white">
      {task && <input type="hidden" name="id" value={task.id} />}

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={task?.title ?? ""}
          maxLength={100}
          placeholder="タスクのタイトルを入力"
          className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
          期限
        </label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          defaultValue={dueDateValue}
          className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={props.onClose}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
        >
          {isPending ? "保存中..." : props.mode === "create" ? "作成" : "更新"}
        </button>
      </div>
    </form>
  );
}
