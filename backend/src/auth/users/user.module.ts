import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Comment])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
