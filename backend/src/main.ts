import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { DatabaseService } from './database.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dbService = app.get(DatabaseService);

  app.use(
    cors({
      origin: ['http://localhost:3000','https://blogchain-eight.vercel.app/'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  await dbService.initialize();
  await app.listen(4000);
}

bootstrap();
