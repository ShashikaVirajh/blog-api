import { z } from 'zod';
import { Environment } from './environment.enum';

export const envSchema = z.object({
  /** APP */
  NODE_ENV: z.nativeEnum(Environment).default(Environment.DEVELOPMENT),
  API_VERSION: z.string().nonempty('API_VERSION is required'),

  /** DATABASE */
  DATABASE_PORT: z.preprocess(
    (port) => (typeof port === 'string' ? Number(port) : port),
    z.number().int().min(1).max(65535).default(5432),
  ),
  DATABASE_PASSWORD: z.string().nonempty('DATABASE_PASSWORD is required'),
  DATABASE_HOST: z.string().nonempty('DATABASE_HOST is required'),
  DATABASE_NAME: z.string().nonempty('DATABASE_NAME is required'),
  DATABASE_USER: z.string().nonempty('DATABASE_USER is required'),
  DATABASE_SYNC: z.string().nonempty('DATABASE_SYNC is required'),
  DATABASE_AUTOLOAD: z.string().nonempty('DATABASE_AUTOLOAD is required'),

  /** PROFILE */
  PROFILE_API_KEY: z.string().nonempty('PROFILE_API_KEY is required'),

  /** JWT */
  JWT_SECRET: z.string().nonempty('JWT_SECRET is required'),
  JWT_TOKEN_AUDIENCE: z.string().nonempty('JWT_TOKEN_AUDIENCE is required'),
  JWT_TOKEN_ISSUER: z.string().nonempty('JWT_TOKEN_ISSUER is required'),
  JWT_ACCESS_TOKEN_TTL: z.preprocess(
    (ttl) => Number(ttl),
    z.number({ required_error: 'JWT_ACCESS_TOKEN_TTL is required' }),
  ),
  JWT_REFRESH_TOKEN_TTL: z.preprocess(
    (ttl) => Number(ttl),
    z.number({ required_error: 'JWT_REFRESH_TOKEN_TTL is required' }),
  ),

  /** GOOGLE */
  GOOGLE_CLIENT_ID: z.string().nonempty('GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().nonempty('GOOGLE_CLIENT_SECRET is required'),
});

/**           ZOD VALIDATION NOTE
 *
 * preprocess   => Transform the value before validating
 * nativeEnum   => Set a custom enum as the type
 **/
