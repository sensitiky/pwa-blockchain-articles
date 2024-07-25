import {
  Controller,
  Get,
  Query,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { TagsService } from './tag.service';
import { Tag } from './tag.entity';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }

  @Get('by-category/:categoryId')
  async findTagsByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<Tag[]> {
    const categoryIdNumber = parseInt(categoryId, 10);

    if (isNaN(categoryIdNumber)) {
      throw new BadRequestException('Invalid categoryId');
    }

    return this.tagsService.findTagsByCategory(categoryIdNumber);
  }

  @Get('count-posts-by-tag')
  async countPostsByTag() {
    return this.tagsService.countPostsByTag();
  }
}
