import z from 'zod';

export const envSchema = z.object({
  API_PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
});

export type EnvType = z.infer<typeof envSchema>;
