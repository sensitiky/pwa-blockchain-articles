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

  async findAll(page: number, limit: number) {
    const [result, total] = await this.postsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: result,
      totalPages: Math.ceil(total / limit),
    };
  }
}
