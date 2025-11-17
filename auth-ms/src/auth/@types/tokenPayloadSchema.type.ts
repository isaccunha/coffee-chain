import z from 'zod';

export const tokenPayloadSchema = z.object({
  sub: z.uuid(),
  email: z.email(),
  name: z.string(),
  role: z.string(),
});

export type TokenPayloadType = z.infer<typeof tokenPayloadSchema>;
