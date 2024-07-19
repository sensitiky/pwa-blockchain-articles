import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'https://blogchain-eight.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  await app.listen(4000);
}
bootstrap();
