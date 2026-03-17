"use client";

import { useActionState, useEffect, useRef } from "react";
import type { UserDto } from "@task-manager/shared";
import { registerUser, updateUser } from "@/lib/actions/user-actions";

type Props =
  | { mode: "create"; onClose: () => void }
  | { mode: "edit"; user: UserDto; onClose: () => void };

export function UserForm(props: Props) {
  const action = props.mode === "create" ? registerUser : updateUser;
  const [state, dispatch, isPending] = useActionState(action, { error: null, success: false });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      props.onClose();
    }
  }, [state.success]);

  const user = props.mode === "edit" ? props.user : null;

  return (
    <form ref={formRef} action={dispatch} className="flex flex-col gap-3 p-4 border rounded-lg bg-white">
      {user && <input type="hidden" name="id" value={user.id} />}

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          名前 <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={user?.name ?? ""}
          maxLength={50}
          placeholder="ユーザー名を入力"
          className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {props.mode === "create" && (
        <>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="example@example.com"
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              パスワード <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="8文字以上"
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}

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
          {isPending ? "保存中..." : props.mode === "create" ? "登録" : "更新"}
        </button>
      </div>
    </form>
  );
}
