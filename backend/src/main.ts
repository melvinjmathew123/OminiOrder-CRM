import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Required for Shopify HMAC signature verification
  });

  // Enable CORS for frontend Vite app
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global filters & interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Set API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`===================================================`);
  logger.log(`🚀 Mini Order Management CRM Backend running on:`);
  logger.log(`   http://localhost:${port}/api`);
  logger.log(`   Health check:      http://localhost:${port}/api/health`);
  logger.log(`   Webhooks endpoint: http://localhost:${port}/api/webhooks/shopify`);
  logger.log(`===================================================`);
}

bootstrap();
