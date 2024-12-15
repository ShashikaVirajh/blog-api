import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  const config = new DocumentBuilder()
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
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}

bootstrap();
