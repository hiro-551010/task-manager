"use server";

import { revalidatePath } from "next/cache";
import { usersApi } from "../api/users";

export async function registerUser(_: unknown, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || name.trim() === "") return { error: "名前を入力してください", success: false };
  if (name.length > 50) return { error: "名前は50文字以内で入力してください", success: false };
  if (!email) return { error: "メールアドレスを入力してください", success: false };
  if (!password || password.length < 8) return { error: "パスワードは8文字以上で入力してください", success: false };

  try {
    await usersApi.register({ name, email, password });
    revalidatePath("/users");
    return { error: null, success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "登録に失敗しました", success: false };
  }
}

export async function updateUser(_: unknown, formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;

  if (name && name.length > 50) return { error: "名前は50文字以内で入力してください", success: false };

  try {
    await usersApi.update(id, { name: name || undefined });
    revalidatePath("/users");
    return { error: null, success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "更新に失敗しました", success: false };
  }
}
