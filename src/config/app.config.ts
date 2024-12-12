import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
}));
