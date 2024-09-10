import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsController } from '../controllers/tag.controller';
import { TagsService } from '../services/tag.service';
import { Tag } from '../entities/tag.entity';
import { Post } from '../entities/post.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Tag, Post])],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
