import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['worker', 'admin']).optional().default('worker'),
  location: z.object({
    lat: z.number().optional(),
    lng: z.number().optional()
  }).optional()
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  password: z.string()
});

export const policySchema = z.object({
  coverageAmount: z.number().min(100, "Coverage amount must be at least 100")
});
