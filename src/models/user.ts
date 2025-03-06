import { z } from "zod";

export const userCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).openapi({
  type: "object",
  title: "User",
  description: "A user of the application",
});

export type User = z.infer<typeof userSchema>;
export type UserCredentials = z.infer<typeof userCredentialsSchema>;

export type UserComplete = User & UserCredentials;
