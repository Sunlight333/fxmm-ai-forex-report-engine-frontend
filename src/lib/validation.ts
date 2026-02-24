import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    language: z.enum(["en", "es"]).default("en"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const purchaseSchema = z.object({
  amount: z
    .number()
    .int("Must be a whole number")
    .min(1, "Minimum 1 credit")
    .max(100, "Maximum 100 credits"),
});

export const settingsSchema = z.object({
  language: z.enum(["en", "es"]),
  selectedPairs: z.array(z.string()),
});

export const creditAdjustSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  amount: z.number().int().min(-1000).max(1000),
  reason: z.string().min(1, "Reason required"),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type PurchaseForm = z.infer<typeof purchaseSchema>;
export type SettingsForm = z.infer<typeof settingsSchema>;
export type CreditAdjustForm = z.infer<typeof creditAdjustSchema>;
