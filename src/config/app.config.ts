import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('appConfig', () => {
  return {
    environment: process.env.NODE_ENV || 'production',
  };
});
