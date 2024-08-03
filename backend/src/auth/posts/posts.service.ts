import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './posts.dto';
import { User } from '../users/user.entity';
import { Tag } from '../tag/tag.entity';
import { Category } from '../category/category.entity';
import { Favorite } from '../favorites/favorite.entity';
import { Comment } from '../comments/comment.entity';

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
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}
  async findUserFavorites(userId: number): Promise<Post[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['favorites', 'favorites.post'],
    });
    if (!user) {
      throw new Error('User not found');
    }

    const favoritePostIds = user.favorites
      .filter((favorite) => favorite.post)
      .map((favorite) => favorite.post.id);

    const favoritePosts = await this.postsRepository.findByIds(favoritePostIds);

    return favoritePosts;
  }
  async create(createPostDto: CreatePostDto): Promise<Post> {
    console.log('Received createPostDto:', createPostDto);

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

    let tags = [];
    if (typeof createPostDto.tags === 'string') {
      tags = JSON.parse(createPostDto.tags);
    }

    tags = Array.isArray(tags)
      ? await Promise.all(
          tags.map(async (tag) => {
            let existingTag = await this.tagsRepository.findOne({
              where: { name: tag.name },
            });
            if (!existingTag) {
              existingTag = this.tagsRepository.create({ name: tag.name });
              await this.tagsRepository.save(existingTag);
            }
            return existingTag;
          }),
        )
      : [];

    console.log('Tags processed:', tags);

    const post = this.postsRepository.create({
      ...createPostDto,
      author,
      category,
      tags,
    });

    await this.postsRepository.save(post);
    author.postCount += 1;
    await this.usersRepository.save(author);

    return post;
  }

  async deletePost(postId: number): Promise<void> {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['author', 'comments'],
    });

    if (post) {
      if (post.comments && post.comments.length > 0) {
        await this.commentsRepository.remove(
          post.comments as unknown as Comment[],
        );
      }

      const author = post.author;
      await this.postsRepository.remove(post);

      if (author) {
        author.postCount -= 1;
        await this.usersRepository.save(author);
      }
    }
  }

  async findAll(page: number, limit: number, sortOrder: string) {
    const order = this.getSortOrder(sortOrder);

    const transformImageToBase64 = (posts: Post[]) => {
      return posts.map((post) => {
        if (post.imageUrl) {
          const base64Image = `data:image/jpeg;base64,${post.imageUrl.toString('base64')}`;
          return {
            ...post,
            imageUrlBase64: base64Image,
          };
        }
        return post;
      });
    };

    if (sortOrder === 'comments') {
      const [result, total] = await this.postsRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.comments', 'comment')
        .leftJoinAndSelect('post.tags', 'tag')
        .groupBy('post.id')
        .addSelect('COUNT(comment.id)', 'commentsCount')
        .orderBy('commentsCount', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      const transformedResult = transformImageToBase64(result);

      return {
        data: transformedResult,
        totalPages: Math.ceil(total / limit),
      };
    } else {
      const [result, total] = await this.postsRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order,
        relations: ['author', 'category', 'tags', 'comments', 'favorites'],
      });

      const transformedResult = transformImageToBase64(result);

      return {
        data: transformedResult,
        totalPages: Math.ceil(total / limit),
      };
    }
  }

  async findByTag(limit: number, tagId: number): Promise<Post[]> {
    return this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .where('tag.id = :tagId', { tagId })
      .take(limit)
      .getMany();
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

  async searchPosts(query: string): Promise<Post[]> {
    return this.postsRepository.find({
      where: { title: Like(`%${query}%`) },
    });
  }

  private getSortOrder(sortOrder: string): { [key: string]: 'ASC' | 'DESC' } {
    switch (sortOrder) {
      case 'saved':
        return { 'favorites.length': 'DESC' };
      case 'createdAt':
        return { createdAt: 'DESC' };
      case 'comments':
        return {};
      default:
        return { createdAt: 'DESC' };
    }
  }

  async countPostsByCategory() {
    return this.postsRepository
      .createQueryBuilder('post')
      .select('post.categoryId')
      .addSelect('COUNT(post.id)', 'count')
      .groupBy('post.categoryId')
      .getRawMany();
  }

  async countPostsByTag() {
    return this.postsRepository
      .createQueryBuilder('post')
      .leftJoin('post.tags', 'tag')
      .select('tag.id')
      .addSelect('COUNT(post.id)', 'count')
      .groupBy('tag.id')
      .getRawMany();
  }

  async updatePost(
    postId: number,
    updatePostDto: CreatePostDto,
  ): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['author', 'category', 'tags'],
    });

    if (!post) {
      throw new Error('Post not found');
    }

    if (updatePostDto.authorId) {
      const author = await this.usersRepository.findOne({
        where: { id: updatePostDto.authorId },
      });
      if (!author) {
        throw new Error('Author not found');
      }
      post.author = author;
    }

    if (updatePostDto.categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: updatePostDto.categoryId },
      });
      post.category = category;
    }

    if (updatePostDto.tags) {
      let tags = [];
      if (typeof updatePostDto.tags === 'string') {
        tags = JSON.parse(updatePostDto.tags);
      }

      tags = Array.isArray(tags)
        ? await Promise.all(
            tags.map(async (tag) => {
              let existingTag = await this.tagsRepository.findOne({
                where: { name: tag.name },
              });
              if (!existingTag) {
                existingTag = this.tagsRepository.create({ name: tag.name });
                await this.tagsRepository.save(existingTag);
              }
              return existingTag;
            }),
          )
        : [];

      post.tags = tags;
    }

    // Update other post properties directly
    post.title = updatePostDto.title;
    post.content = updatePostDto.content;
    post.description = updatePostDto.description;

    // Handle the imageUrl update if present
    if (updatePostDto.imageUrl) {
      post.imageUrl = updatePostDto.imageUrl;
    }

    return await this.postsRepository.save(post);
  }
}
