import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { DatabaseService } from './database.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UsersController],
  providers: [DatabaseService],
})
export class AppModule {}
