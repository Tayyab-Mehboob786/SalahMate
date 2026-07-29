import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  // =========================================================================
  // Security Middleware (Helmet, Rate Limiting)
  // =========================================================================

  // =========================================================================
  // CORS Configuration
  // =========================================================================
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // =========================================================================
  // Global Prefix & API Versioning
  // =========================================================================

  // =========================================================================
  // Global Validation (ValidationPipe)
  // =========================================================================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // =========================================================================
  // Global Interceptors
  // =========================================================================

  // =========================================================================
  // Global Exception Filters
  // =========================================================================

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 SalahMate Backend is running on http://localhost:${port}`);
}

bootstrap();  