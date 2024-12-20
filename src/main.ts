import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not defined in DTOs
      forbidNonWhitelisted: true, // Throw an error if the payload contains properties not defined in DTOs
      transform: true, // Transform input data to DTO instances (by default input data is a general object type)
      transformOptions: {
        enableImplicitConversion: true, // Validation pipe takes care of types
      },
    }),
  );

  /** Swagger configuration */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('Base URL: http://localhost:3001')
    .setTermsOfService('http://localhost:3001/terms-of-service')
    .setLicense(
      'MIT License',
      'https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt',
    )
    .addServer('http://localhost:3001')
    .setVersion('1.0')
    .build();

  // Instantiate Document
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Set up the aws sds used to upload files to aws s3 bucket.
  const configService = app.get(ConfigService);
  config.update({
    credentials: {
      accessKeyId: configService.get<string>('appConfig.awsAccessKeyId'),
      secretAccessKey: configService.get<string>(
        'appConfig.awsSecretAccessKey',
      ),
    },
    region: configService.get<string>('appConfig.awsRegion'),
  });

  app.enableCors();
  await app.listen(3001);
}

bootstrap();
