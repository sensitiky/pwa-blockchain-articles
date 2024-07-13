import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Category } from './entities/category.entity';
import { Tag } from './entities/tag.entity';
import { Favorite } from './entities/favorite.entity';
import { DatabaseService } from '../database.service';

@Module({
  imports: [  
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '2010',
      database: 'postgres',
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
