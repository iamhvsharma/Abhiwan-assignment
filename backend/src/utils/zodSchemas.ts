import { z } from "zod";

// Auth Schemas
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be less than 100 characters"),
  role: z.enum(["TEAM", "MANAGER"]),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const createTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  assignedToId: z.string().uuid(),
  workspaceNumber: z.number(),
});

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
});

export const updateTaskStatusSchema = z.object({
  taskId: z.string().uuid(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
});

export const addNoteSchema = z.object({
  taskId: z.string().uuid(),
  note: z.string().min(1),
});


// Type exports for TypeScript
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type createTaskInput = z.infer<typeof createTaskSchema>;
export type updateTaskInput = z.infer<typeof updateTaskSchema>;
export type updateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
export type addNoteInput = z.infer<typeof addNoteSchema>;
