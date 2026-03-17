"use client";

import { useState } from "react";
import type { UserDto } from "@task-manager/shared";
import { UserCard } from "./user-card";
import { UserForm } from "./user-form";

type Props = { users: UserDto[] };

export function UserList({ users }: Props) {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            + ユーザー登録
          </button>
        )}
      </div>

      {isCreating && (
        <UserForm mode="create" onClose={() => setIsCreating(false)} />
      )}

      {users.length === 0 && !isCreating ? (
        <p className="text-gray-500 text-sm text-center py-12">ユーザーがいません</p>
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
