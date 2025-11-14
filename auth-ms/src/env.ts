import z from 'zod';

export const envSchema = z.object({
  API_PORT: z.coerce.number().optional().default(3333),
});

export type EnvType = z.infer<typeof envSchema>;
