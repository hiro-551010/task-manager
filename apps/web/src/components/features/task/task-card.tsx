"use client";

import { useState, useTransition } from "react";
import type { TaskDto, TaskStatus } from "@task-manager/shared";
import { TASK_STATUS_LABEL, TASK_STATUS_TRANSITIONS } from "@task-manager/shared";
import { changeTaskStatus, deleteTask } from "@/lib/actions/task-actions";
import { TaskForm } from "./task-form";

const STATUS_STYLE: Record<TaskStatus, string> = {
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};

type Props = { task: TaskDto };

export function TaskCard({ task }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const nextStatuses = TASK_STATUS_TRANSITIONS[task.status];

  function handleChangeStatus(status: TaskStatus) {
    startTransition(async () => {
      await changeTaskStatus(task.id, status);
    });
  }

  function handleDelete() {
    if (!confirm("削除しますか？")) return;
    startTransition(async () => {
      await deleteTask(task.id);
    });
  }

  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" })
    : null;
  const isOverdue =
    task.dueDate && task.status !== "done" && new Date(task.dueDate) < new Date();

  if (isEditing) {
    return <TaskForm mode="edit" task={task} onClose={() => setIsEditing(false)} />;
  }

  return (
    <div className={`border rounded-lg p-4 bg-white flex flex-col gap-2 ${isPending ? "opacity-50" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <p className={`font-medium text-gray-900 flex-1 ${task.status === "done" ? "line-through text-gray-400" : ""}`}>
          {task.title}
        </p>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_STYLE[task.status]}`}>
          {TASK_STATUS_LABEL[task.status]}
        </span>
      </div>

      {dueDate && (
        <p className={`text-xs ${isOverdue ? "text-red-500 font-medium" : "text-gray-500"}`}>
          期限: {dueDate} {isOverdue && "（期限超過）"}
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap mt-1">
        {nextStatuses.map((s) => (
          <button
            key={s}
            onClick={() => handleChangeStatus(s)}
            disabled={isPending}
            className="text-xs px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            → {TASK_STATUS_LABEL[s]}
          </button>
        ))}
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => setIsEditing(true)}
            disabled={isPending}
            className="text-xs px-2 py-1 text-gray-600 border rounded hover:bg-gray-50"
          >
            編集
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-xs px-2 py-1 text-red-600 border border-red-200 rounded hover:bg-red-50"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
