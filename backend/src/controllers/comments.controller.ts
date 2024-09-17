import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dto/comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get('post/:postId')
  findAllByPost(@Param('postId') postId: number) {
    return this.commentsService.findAllByPost(postId);
  }

  @Get('replies/:commentId')
  findAllReplies(@Param('commentId') commentId: number) {
    return this.commentsService.findAllReplies(commentId);
  }
}
