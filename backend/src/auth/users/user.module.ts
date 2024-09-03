import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';
import { Favorite } from '../favorites/favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, Comment, Favorite]),
    CacheModule.register(),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserActivityService',
      useClass: UsersService,
    },
  ],
  exports: [
    UsersService,
    {
      provide: 'IUserActivityService',
      useClass: UsersService,
    },
  ],
})
export class UsersModule {}
