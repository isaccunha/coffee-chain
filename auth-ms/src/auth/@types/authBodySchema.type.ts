import z from 'zod';

export const authBodySchema = z.object({
  email: z.email(),
  password: z.string().min(5),
});

export type AuthBodySchemaType = z.infer<typeof authBodySchema>;
