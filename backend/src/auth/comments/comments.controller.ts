import {
    Controller,
    Post,
    Body,
    Get,
    Param,
  } from '@nestjs/common';
  import { CommentsService } from './comments.service';
  import { CreateCommentDto } from 'src/dto/comment.dto';
  
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
  }
  