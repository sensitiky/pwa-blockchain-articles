import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { Post } from '../posts/post.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagsRepository.find();
  }

  async findTagsByCategory(categoryId: number): Promise<Tag[]> {
    const posts = await this.postsRepository.find({
      where: { category: { id: categoryId } },
      relations: ['tags'],
    });

    const tagsMap = new Map<number, Tag>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        if (!tagsMap.has(tag.id)) {
          tagsMap.set(tag.id, tag);
        }
      });
    });

    return Array.from(tagsMap.values());
  }

  async countPostsByTag(): Promise<
    { tagId: number; tagName: string; postCount: number }[]
  > {
    const result = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoin('post.tags', 'tag')
      .select('tag.id', 'tagId')
      .addSelect('tag.name', 'tagName')
      .addSelect('COUNT(post.id)', 'postCount')
      .groupBy('tag.id')
      .addGroupBy('tag.name')
      .getRawMany();

    return result;
  }
}
