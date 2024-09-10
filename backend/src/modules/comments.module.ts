import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from '../services/comments.service';
import { CommentsController } from '../controllers/comments.controller';
import { Comment } from '../entities/comment.entity';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Post])],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService, TypeOrmModule],
})
export class CommentsModule {}