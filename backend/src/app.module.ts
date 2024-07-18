import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersController } from './auth/users/users.controller';
import { PostsController } from './auth/posts/posts.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UsersController,PostsController],
})
export class AppModule {}
