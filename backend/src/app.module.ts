import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersController } from './auth/users/users.controller';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './auth/posts/posts.module';

@Module({
  imports: [DatabaseModule, AuthModule, PostsModule],
  controllers: [UsersController],
})
export class AppModule {}
