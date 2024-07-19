import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PostsService } from './posts.service';
import { CreatePostDto } from '../../dto/posts.dto';
import { Request } from 'express';
import { Express } from 'express';

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

  @Post()
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
    const authorId = parseInt(req.body.authorId, 10);
    const imageUrl = file ? `/uploads/${file.filename}` : null;
    return this.postsService.create({ ...createPostDto, imageUrl, authorId });
  }
}
