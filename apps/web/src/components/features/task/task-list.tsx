"use client";

import { useState } from "react";
import type { TaskDto } from "@task-manager/shared";
import { TaskCard } from "./task-card";
import { TaskForm } from "./task-form";

type Props = { tasks: TaskDto[] };

export function TaskList({ tasks }: Props) {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            + 新規作成
          </button>
        )}
      </div>

      {isCreating && (
        <TaskForm mode="create" onClose={() => setIsCreating(false)} />
      )}

      {tasks.length === 0 && !isCreating ? (
        <p className="text-gray-500 text-sm text-center py-12">タスクがありません</p>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
