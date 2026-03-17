"use client";

import { useState } from "react";
import type { UserDto } from "@task-manager/shared";
import { UserForm } from "./user-form";

type Props = { user: UserDto };

export function UserCard({ user }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const createdAt = new Date(user.createdAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (isEditing) {
    return <UserForm mode="edit" user={user} onClose={() => setIsEditing(false)} />;
  }

  return (
    <div className="border rounded-lg p-4 bg-white flex flex-col gap-1">
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-gray-900">{user.name}</p>
        <button
          onClick={() => setIsEditing(true)}
          className="text-xs px-2 py-1 text-gray-600 border rounded hover:bg-gray-50 shrink-0"
        >
          編集
        </button>
      </div>
      <p className="text-sm text-gray-500">{user.email}</p>
      <p className="text-xs text-gray-400">登録日: {createdAt}</p>
    </div>
  );
}
