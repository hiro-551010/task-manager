"use server";

import { redirect } from "next/navigation";
import { authApi } from "../api/auth";
import { usersApi } from "../api/users";

export async function loginAction(_: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await authApi.login({ email, password });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "ログインに失敗しました" };
  }
  redirect("/tasks");
}

export async function registerAndLoginAction(_: unknown, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await usersApi.create({ name, email, password });
    await authApi.login({ email, password });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "登録に失敗しました" };
  }
  redirect("/tasks");
}

export async function logoutAction() {
  try {
    await authApi.logout();
  } catch {
    // セッションがない場合も正常にログアウト扱い
  }
  redirect("/auth");
}
