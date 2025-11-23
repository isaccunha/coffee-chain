import z from 'zod';

export const createUserBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(5),
});

export type CreateUserBodySchemaType = z.infer<typeof createUserBodySchema>;
