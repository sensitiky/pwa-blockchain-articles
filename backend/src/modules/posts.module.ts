import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { PostsService } from '../services/posts.service';
import { PostsController } from '../controllers/posts.controller';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { Tag } from '../entities/tag.entity';
import { Category } from '../entities/category.entity';
import { CommentsModule } from './comments.module';
import { Comment } from '../entities/comment.entity';
import { FavoritesModule } from './favorites.module';
import { Favorite } from '../entities/favorite.entity';

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
