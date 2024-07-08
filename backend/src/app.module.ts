import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { DatabaseService } from './database.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [DatabaseService],
})
export class AppModule {}
