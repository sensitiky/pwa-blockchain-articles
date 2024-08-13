import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../auth/users/user.entity';
import { Post } from '../auth/posts/post.entity';
import { Comment } from '../auth/comments/comment.entity';
import { Category } from '../auth/category/category.entity';
import { Tag } from 'src/auth/tag/tag.entity';
import { Favorite } from '../auth/favorites/favorite.entity';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Post, Comment, Category, Tag, Favorite],
        synchronize: true,
        logging: true,
        ssl: configService.get<boolean>('DB_SSL')
          ? { rejectUnauthorized: false }
          : false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Post, Comment, Category, Tag, Favorite]),
  ],
  providers: [DatabaseService],
  exports: [TypeOrmModule, DatabaseService],
})
export class DatabaseModule {}
