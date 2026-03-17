import type { UserDto, RegisterUserInput, UpdateUserInput } from "@task-manager/shared";

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
  return res.json() as Promise<T>;
}

export const usersApi = {
  getAll: () => request<UserDto[]>("/users", { cache: "no-store" }),
  getOne: (id: string) => request<UserDto>(`/users/${id}`),
  create: (input: RegisterUserInput) =>
    request<UserDto>("/users", { method: "POST", body: JSON.stringify(input) }),
  register: (input: RegisterUserInput) =>
    request<UserDto>("/users", { method: "POST", body: JSON.stringify(input) }),
  update: (id: string, input: UpdateUserInput) =>
    request<UserDto>(`/users/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
};
