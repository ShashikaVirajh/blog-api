import { z } from 'zod';
import { Environment } from './environment.enum';

export const envSchema = z.object({
  NODE_ENV: z.nativeEnum(Environment).default(Environment.DEVELOPMENT),
  // preprocess => Transform the value before validating
  DATABASE_PORT: z.preprocess(
    (port) => (typeof port === 'string' ? Number(port) : port),
    z.number().int().min(1).max(65535).default(5432),
  ),
  DATABASE_PASSWORD: z.string().nonempty('DATABASE_PASSWORD is required'),
  DATABASE_HOST: z.string().nonempty('DATABASE_HOST is required'),
  DATABASE_NAME: z.string().nonempty('DATABASE_NAME is required'),
  DATABASE_USER: z.string().nonempty('DATABASE_USER is required'),
  PROFILE_API_KEY: z.string().nonempty('PROFILE_API_KEY is required'),
});
