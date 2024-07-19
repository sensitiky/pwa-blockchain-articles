import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from '../../dto/posts.dto';
import { User } from '../users/user.entity';
import { Tag } from '../tag/tag.entity';
import { Category } from '../category/category.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const author = await this.usersRepository.findOne({
      where: { id: createPostDto.authorId },
    });

    if (!author) {
      throw new Error('Author not found');
    }

    const category = createPostDto.categoryId
      ? await this.categoriesRepository.findOne({
          where: { id: createPostDto.categoryId },
        })
      : null;

    const tags = Array.isArray(createPostDto.tags)
      ? await Promise.all(
          createPostDto.tags.map(async (tagName) => {
            let tag = await this.tagsRepository.findOne({
              where: { name: tagName },
            });
            if (!tag) {
              tag = this.tagsRepository.create({ name: tagName });
              await this.tagsRepository.save(tag);
            }
            return tag;
          }),
        )
      : [];

    const post = this.postsRepository.create({
      ...createPostDto,
      author,
      category,
      tags,
    });

    return this.postsRepository.save(post);
  }

  async findAll(page: number, limit: number, sortOrder: string) {
    const order = this.getSortOrder(sortOrder);
    const [result, total] = await this.postsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order,
      relations: ['author', 'category', 'tags', 'comments', 'favorites'],
    });
    return {
      data: result,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllByCategory(
    page: number,
    limit: number,
    categoryId: number,
    sortOrder: string,
  ) {
    const order = this.getSortOrder(sortOrder);
    const [result, total] = await this.postsRepository.findAndCount({
      where: { category: { id: categoryId } },
      skip: (page - 1) * limit,
      take: limit,
      order,
      relations: ['author', 'category', 'tags', 'comments', 'favorites'],
    });
    return {
      data: result,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Post> {
    return this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'category', 'tags', 'comments', 'favorites'],
    });
  }

  private getSortOrder(sortOrder: string) {
    switch (sortOrder) {
      case 'saved':
        return { savedAt: 'DESC' as const };
      case 'comments':
        return { comments: 'DESC' as const };
      default:
        return { createdAt: 'DESC' as const };
    }
  }
}
