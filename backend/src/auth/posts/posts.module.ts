import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { Tag } from 'src/database/entities/tag.entity';
import { Category } from 'src/database/entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Post, User, Tag, Category])],
    providers: [PostsService],
    controllers: [PostsController],
    exports: [PostsService],
  })
  export class PostsModule {}