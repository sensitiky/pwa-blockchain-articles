import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsController } from './tag.controller';
import { TagsService } from './tag.service';
import { Tag } from './tag.entity';
import { Post } from '../posts/post.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Tag, Post])],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}