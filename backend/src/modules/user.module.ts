import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { Favorite } from '../entities/favorite.entity';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, Comment, Favorite]),
    CacheModule.register(),
    forwardRef(() => AuthModule),
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
    TypeOrmModule,
  ],
})
export class UsersModule {}
