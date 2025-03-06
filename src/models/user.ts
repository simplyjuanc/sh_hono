import { z } from "zod";

export interface UserComplete extends User, UserCredentials {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

interface UserCredentials {
  email: string;
  password: string;
}

export const userCredentialsSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).openapi({
  type: "object",
  title: "User",
  description: "A user of the application",
});
