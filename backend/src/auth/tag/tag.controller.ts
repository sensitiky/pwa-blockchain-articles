import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tag.service';
import { Tag } from './tag.entity';

@Controller('tags')
export class TagsController {
  constructor(private readonly TagsService: TagsService) {}

  @Get()
  findAll(): Promise<Tag[]> {
    return this.TagsService.findAll();
  }
}
