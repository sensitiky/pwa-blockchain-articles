import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { Category } from '../entities/category.entity';
import { Tag } from '../entities/tag.entity';
import { Favorite } from '../entities/favorite.entity';
import { DatabaseService } from '../services/database.service';
import { CommentSubscriber } from '../services/listenerComment.service';
import { FavoriteSubscriber } from '../services/listenerFavorites.service';

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
        subscribers: [CommentSubscriber, FavoriteSubscriber],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Post, Comment, Category, Tag, Favorite]),
  ],
  providers: [DatabaseService],
  exports: [TypeOrmModule, DatabaseService],
})
export class DatabaseModule {}
