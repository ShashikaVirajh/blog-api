import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('appConfig', () => {
  return {
    // System
    environment: process.env.NODE_ENV || 'production',
    // App
    apiVersion: process.env.API_VERSION,
    // AWS S3
    awsBucketName: process.env.AWS_PUBLIC_BUCKET_NAME,
    awsRegion: process.env.AWS_REGION,
    awsCloudfrontUrl: process.env.AWS_CLOUDFRONT_URL,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // Mail Trap
    mailHost: process.env.MAIL_HOST,
    smtpUserName: process.env.SMTP_USER_NAME,
    smtpPassword: process.env.SMTP_PASSWORD,
  };
});
