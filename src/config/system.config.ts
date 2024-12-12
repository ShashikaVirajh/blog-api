import { registerAs } from '@nestjs/config';

export const systemConfig = registerAs('system', () => ({
  SYSTEM_PORT: process.env.SYSTEM_PORT || 3001,
}));
