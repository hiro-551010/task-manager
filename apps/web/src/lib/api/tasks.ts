import type { TaskDto } from "@task-manager/shared";
import type { CreateTaskInput, UpdateTaskInput, ChangeTaskStatusInput } from "@task-manager/shared";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const tasksApi = {
  getAll: () => request<TaskDto[]>("/tasks", { cache: "no-store" }),
  getOne: (id: string) => request<TaskDto>(`/tasks/${id}`),
  create: (input: CreateTaskInput) =>
    request<TaskDto>("/tasks", { method: "POST", body: JSON.stringify(input) }),
  update: (id: string, input: UpdateTaskInput) =>
    request<TaskDto>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
  changeStatus: (id: string, input: ChangeTaskStatusInput) =>
    request<TaskDto>(`/tasks/${id}/status`, { method: "PATCH", body: JSON.stringify(input) }),
  delete: (id: string) => request<void>(`/tasks/${id}`, { method: "DELETE" }),
};
