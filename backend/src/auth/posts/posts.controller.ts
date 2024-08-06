import {
  Controller,
  Get,
  Query,
  Param,
  Post as HttpPost,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
  Delete,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './posts.dto';
import { Request } from 'express';
import { Express } from 'express';
import { Post } from './post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.postsService.findAll(page, limit);
  }

  @Get('by-tag')
  findByTag(
    @Query('limit') limit: number,
    @Query('tagId') tagId: number,
  ): Promise<Post[]> {
    return this.postsService.findByTag(limit, tagId);
  }

  @Get('by-category')
  async findAllByCategory(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('categoryId') categoryId: string,
    @Query('sortOrder') sortOrder: string = 'recent',
  ) {
    const categoryIdNumber = parseInt(categoryId, 10);

    if (isNaN(categoryIdNumber)) {
      throw new BadRequestException('Invalid categoryId');
    }

    return this.postsService.findAllByCategory(page, limit, categoryIdNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const post = await this.postsService.findOne(id);
    const postDto = {
      ...post,
      imageUrl: post.imageUrl
        ? `data:image/jpeg;base64,${post.imageUrl.toString('base64')}`
        : null,
    };
    return postDto;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.postsService.deletePost(id);
    return { message: 'Post deleted successfully' };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (file) {
      updatePostDto.imageUrl = file.buffer;
    }
    return this.postsService.updatePost(id, updatePostDto);
  }

  @HttpPost()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    console.log('Received CreatePostDto:', createPostDto);
    const authorId = parseInt(req.body.authorId, 10);
    if (file) {
      createPostDto.imageUrl = file.buffer;
    }
    return this.postsService.create({ ...createPostDto, authorId });
  }

  @Get('count/by-category')
  async countByCategory() {
    return this.postsService.countPostsByCategory();
  }

  @Get('count/by-tag')
  async countByTag() {
    return this.postsService.countPostsByTag();
  }
}
