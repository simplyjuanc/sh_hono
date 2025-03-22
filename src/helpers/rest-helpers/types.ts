import { z } from "zod";

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
export type ZodSchema = z.ZodUnion | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;

export const jwtPayloadSchema = z.object({
  user: z.string().uuid().optional(),
  exp: z.number(),
  iat: z.number(),
  nbf: z.number(),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
