import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';
import { ActiveUsersGateway } from 'src/active-users.gateway';
import { Favorite } from '../favorites/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Comment, Favorite])],
  controllers: [UsersController],
  providers: [UsersService, ActiveUsersGateway],
  exports: [UsersService],
})
export class UsersModule {}
