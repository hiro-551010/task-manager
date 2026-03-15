import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  dueDate: z.string().datetime().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

export const changeTaskStatusSchema = z.object({
  status: z.enum(["todo", "in_progress", "done"]),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ChangeTaskStatusInput = z.infer<typeof changeTaskStatusSchema>;
