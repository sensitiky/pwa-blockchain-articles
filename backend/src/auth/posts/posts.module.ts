import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { Tag } from '../tag/tag.entity';
import { Category } from '../category/category.entity';
import { CommentsModule } from '../comments/comments.module';
import { Comment } from '../comments/comment.entity';
import { FavoritesModule } from '../favorites/favorites.module';
import { Favorite } from '../favorites/favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Tag, Category, Comment, Favorite]),
    CommentsModule,
    FavoritesModule,
    CacheModule.register(),
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
