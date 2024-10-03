import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from '../services/comments.service';
import { CommentsController } from '../controllers/comments.controller';
import { Comment } from '../entities/comment.entity';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { MetricModule } from './metric.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, Post]),
    forwardRef(() => MetricModule),
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService, TypeOrmModule],
})
export class CommentsModule {}
