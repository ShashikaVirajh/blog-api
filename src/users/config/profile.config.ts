import { registerAs } from '@nestjs/config';

export const profileConfig = registerAs('profileConfig', () => ({
  apiKey: process.env.PROFILE_API_KEY,
}));
