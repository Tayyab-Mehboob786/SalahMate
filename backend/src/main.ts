import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;

  // =========================================================================
  // Security Middleware (Helmet, Rate Limiting)
  // =========================================================================
  app.use(helmet());

  // =========================================================================
  // CORS Configuration
  // =========================================================================
  app.enableCors({
    origin: true, // Dynamically echoes the request origin. Fixes the credentials+wildcard issue.
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
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
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 SalahMate Backend is running on http://localhost:${port}`);
}

bootstrap();
