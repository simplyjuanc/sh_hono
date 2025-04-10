import { z } from "zod";

const PASSWORD_REQUIREMENTS = /^(?=.*\S)(?=.*\d).{8,}$/;

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).openapi({
  type: "object",
  title: "User",
  description: "A user of the application",
});
export type User = z.infer<typeof userSchema>;

export const userCreationRequestSchema = z.object({
  password: z.string().regex(
    PASSWORD_REQUIREMENTS,
    "Minimum 8 characters, with at least one letter and one number",
  ),
}).merge(userSchema).omit({ id: true });
export type UserCreationRequest = z.infer<typeof userCreationRequestSchema>;

export const userCreationResponseSchema = z.object({ userId: z.string() });

export const userCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const userCredentialsAndIdSchema = z.object({
  id: z.string().uuid(),
}).merge(userCredentialsSchema);

export type UserCredentials = z.infer<typeof userCredentialsSchema>;
export type UserCredentialsAndId = z.infer<typeof userCredentialsAndIdSchema>;
