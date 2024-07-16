import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Category } from './entities/category.entity';
import { Tag } from './entities/tag.entity';
import { Favorite } from './entities/favorite.entity';
import { DatabaseService } from '../database.service';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

@Module({
  imports: [  
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Post, Comment, Category, Tag, Favorite],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([User, Post, Comment, Category, Tag, Favorite]),
  ],
  providers: [DatabaseService],
  exports: [TypeOrmModule, DatabaseService],
})
export class DatabaseModule {}
