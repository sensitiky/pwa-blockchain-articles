import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from '../services/search.service';
import { SearchController } from '../controllers/search.controller';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { PostsModule } from './posts.module';
import { UsersModule } from '../modules/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post]), PostsModule, UsersModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
