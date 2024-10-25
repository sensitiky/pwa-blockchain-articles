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
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const dbHost = configService.get<string>('DB_HOST');
        const dbPort = configService.get<number>('DB_PORT');
        const dbUsername = configService.get<string>('DB_USERNAME');
        const dbPassword = configService.get<string>('DB_PASSWORD');
        const dbName = configService.get<string>('DB_DATABASE');

        /*
        console.log('DB_HOST:', dbHost);
        console.log('DB_PORT:', dbPort);
        console.log('DB_USERNAME:', dbUsername);
        console.log('DB_PASSWORD:', dbPassword);
        console.log('DB_DATABASE:', dbName);
        */

        return {
          type: 'postgres',
          host: dbHost,
          port: dbPort,
          username: dbUsername,
          password: dbPassword,
          database: dbName,
          entities: [User, Post, Comment, Category, Tag, Favorite],
          synchronize: true,
          logging: false,
          ssl: { rejectUnauthorized: false },
          subscribers: [CommentSubscriber, FavoriteSubscriber],
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Post, Comment, Category, Tag, Favorite]),
  ],
  providers: [DatabaseService],
  exports: [TypeOrmModule, DatabaseService],
})
export class DatabaseModule {}
