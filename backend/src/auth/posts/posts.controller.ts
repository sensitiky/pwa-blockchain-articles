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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
    @Query('sortOrder') sortOrder: string = 'recent',
  ) {
    return this.postsService.findAll(page, limit, sortOrder);
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
    @Query('categoryId') categoryId: number,
    @Query('sortOrder') sortOrder: string = 'recent',
  ) {
    return this.postsService.findAllByCategory(
      page,
      limit,
      categoryId,
      sortOrder,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @HttpPost()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    console.log('Received CreatePostDto:', createPostDto);
    const authorId = parseInt(req.body.authorId, 10);
    const imageUrl = file ? `/uploads/${file.filename}` : null;
    return this.postsService.create({ ...createPostDto, imageUrl, authorId });
  }

  @Get('count-by-category')
  async countPostsByCategory() {
    return this.postsService.countPostsByCategory();
  }
}
