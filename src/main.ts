import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not defined in DTOs
      forbidNonWhitelisted: true, // Throw an error if the payload contains properties not defined in DTOs
      transform: true, // Transform input data to DTO instances (by default input data is a general object type)
    }),
  );
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
