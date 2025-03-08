import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string(),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
}).openapi({
  type: "object",
  title: "User",
  description: "A user of the application",
});

export const userCreationRequestSchema = z.object({
  password: z.string(),
}).merge(userSchema).omit({ id: true });

export const userCreationResponseSchema = z.object({ userId: z.string() });

export type UserCreationRequest = z.infer<typeof userCreationRequestSchema>;
export type User = z.infer<typeof userSchema>;
