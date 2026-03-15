"use server";

import { revalidatePath } from "next/cache";
import { tasksApi } from "../api/tasks";
import { changeTaskStatusSchema } from "@task-manager/shared";

function toISODatetime(dateStr: string): string {
  return new Date(dateStr).toISOString();
}

export async function createTask(_: unknown, formData: FormData) {
  const title = formData.get("title") as string;
  const rawDueDate = formData.get("dueDate") as string;

  if (!title || title.trim() === "") return { error: "タイトルを入力してください", success: false };
  if (title.length > 100) return { error: "タイトルは100文字以内で入力してください", success: false };

  try {
    await tasksApi.create({
      title,
      dueDate: rawDueDate ? toISODatetime(rawDueDate) : undefined,
    });
    revalidatePath("/tasks");
    return { error: null, success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "作成に失敗しました", success: false };
  }
}

export async function updateTask(_: unknown, formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const rawDueDate = formData.get("dueDate") as string;

  if (title && title.length > 100) return { error: "タイトルは100文字以内で入力してください", success: false };

  try {
    await tasksApi.update(id, {
      title: title || undefined,
      dueDate: rawDueDate ? toISODatetime(rawDueDate) : null,
    });
    revalidatePath("/tasks");
    return { error: null, success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "更新に失敗しました", success: false };
  }
}

export async function changeTaskStatus(id: string, status: string) {
  const parsed = changeTaskStatusSchema.safeParse({ status });
  if (!parsed.success) return { error: "不正なステータスです" };
  try {
    await tasksApi.changeStatus(id, parsed.data);
    revalidatePath("/tasks");
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "ステータス変更に失敗しました" };
  }
}

export async function deleteTask(id: string) {
  try {
    await tasksApi.delete(id);
    revalidatePath("/tasks");
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "削除に失敗しました" };
  }
}
