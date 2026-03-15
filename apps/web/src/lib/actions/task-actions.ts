"use server";

import { revalidatePath } from "next/cache";
import { tasksApi } from "../api/tasks";
import { createTaskSchema, updateTaskSchema, changeTaskStatusSchema } from "@task-manager/shared";

export async function createTask(_: unknown, formData: FormData) {
  const raw = {
    title: formData.get("title"),
    dueDate: formData.get("dueDate") || undefined,
  };
  const parsed = createTaskSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }
  try {
    await tasksApi.create(parsed.data);
    revalidatePath("/tasks");
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "作成に失敗しました" };
  }
}

export async function updateTask(_: unknown, formData: FormData) {
  const id = formData.get("id") as string;
  const raw = {
    title: formData.get("title") || undefined,
    dueDate: formData.get("dueDate") !== "" ? formData.get("dueDate") : null,
  };
  const parsed = updateTaskSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }
  try {
    await tasksApi.update(id, parsed.data);
    revalidatePath("/tasks");
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "更新に失敗しました" };
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
