import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './posts.dto';
import { User } from '../users/user.entity';
import { Tag } from '../tag/tag.entity';
import { Category } from '../category/category.entity';
import { Favorite } from '../favorites/favorite.entity';
import { Comment } from '../comments/comment.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisCache } from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostsService {
  private redisCache: RedisCache;

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
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.initializeRedisCache();
  }

  private async initializeRedisCache() {
    this.redisCache = await RedisCache.create({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      ttl: 60 * 60 * 24, // 24 hours
    });
  }

  async findUserFavorites(userId: number): Promise<Post[]> {
    const cacheKey = `user:${userId}:favorites`;
    const cachedFavorites = await this.redisCache.get<Post[]>(cacheKey);

    if (cachedFavorites) {
      return cachedFavorites;
    }

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['favorites', 'favorites.post'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const favoritePostIds = user.favorites
      .filter((favorite) => favorite.post)
      .map((favorite) => favorite.post.id);

    const favoritePosts = await this.postsRepository.findByIds(favoritePostIds);

    await this.redisCache.set(cacheKey, favoritePosts, 3600); // Cache for 1 hour

    return favoritePosts;
  }

  async getArticlesByCategory() {
    const cacheKey = 'articles:by:category';
    const cachedResult = await this.redisCache.get<any>(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const result = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoin('post.category', 'category')
      .select('post.categoryId')
      .addSelect('category.name')
      .addSelect('COUNT(post.id)', 'count')
      .groupBy('post.categoryId')
      .addGroupBy('category.name')
      .getRawMany();

    await this.redisCache.set(cacheKey, result, 3600); // Cache for 1 hour

    return result;
  }

  async getAverageReadTime() {
    const cacheKey = 'average:read:time';
    const cachedResult = await this.redisCache.get<any>(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const result = await this.postsRepository
      .createQueryBuilder('post')
      .select('AVG(post.readTime)', 'average')
      .getRawOne();

    await this.redisCache.set(cacheKey, result, 3600); // Cache for 1 hour

    return result;
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    try {
      const author = await this.usersRepository.findOne({
        where: { id: createPostDto.authorId },
      });

      if (!author) {
        throw new NotFoundException('Author not found');
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

      const post = this.postsRepository.create({
        ...createPostDto,
        author,
        category,
        tags,
      });

      await this.postsRepository.save(post);
      author.postCount += 1;
      await this.usersRepository.save(author);

      await this.invalidateCache();

      return post;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create post');
    }
  }

  async deletePost(postId: number): Promise<void> {
    try {
      const post = await this.postsRepository.findOne({
        where: { id: postId },
        relations: ['author', 'comments', 'favorites'],
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.comments && post.comments.length > 0) {
        await this.commentsRepository.remove(post.comments);
      }

      if (post.favorites && post.favorites.length > 0) {
        await this.favoritesRepository.remove(post.favorites);
      }

      const author = post.author;
      await this.postsRepository.remove(post);

      if (author) {
        author.postCount -= 1;
        await this.usersRepository.save(author);
      }

      await this.invalidateCache();
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete post');
    }
  }

  private transformMediaToBase64(posts: Post[]): Post[] {
    return posts.map((post) => {
      if (post.imageUrl) {
        const isGif = post.imageUrl.includes('.gif');
        const mimeType = isGif ? 'image/gif' : 'image/jpeg';
        const base64Image = `data:${mimeType};base64,${post.imageUrl.toString('base64')}`;
        return {
          ...post,
          imageUrl: undefined,
          imageUrlBase64: base64Image,
        };
      }
      return post;
    });
  }

  async findAll(page: number, limit: number, order: string) {
    const cacheKey = `posts:${page}:${limit}:${order}`;
    const cachedResult = await this.redisCache.get<any>(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    let queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tags');

    switch (order) {
      case 'saved':
        queryBuilder = queryBuilder
          .leftJoin('post.favorites', 'favorites')
          .addSelect('COUNT(DISTINCT favorites.id)', 'favoritesCount')
          .groupBy('post.id')
          .addGroupBy('author.id')
          .addGroupBy('category.id')
          .addGroupBy('tags.id')
          .orderBy('favoritesCount', 'DESC');
        break;
      case 'comment':
        queryBuilder = queryBuilder
          .leftJoin('post.comments', 'comments')
          .addSelect('COUNT(DISTINCT comments.id)', 'commentsCount')
          .groupBy('post.id')
          .addGroupBy('author.id')
          .addGroupBy('category.id')
          .addGroupBy('tags.id')
          .orderBy('commentsCount', 'DESC');
        break;
      case 'recent':
      default:
        queryBuilder = queryBuilder.orderBy('post.createdAt', 'DESC');
        break;
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [result, total] = await queryBuilder.getManyAndCount();

    const transformedResult = this.transformMediaToBase64(result);

    const response = {
      data: transformedResult,
      totalPages: Math.ceil(total / limit),
    };

    await this.redisCache.set(cacheKey, response, 3600); // Cache for 1 hour

    return response;
  }

  async invalidateCache() {
    const keys = await this.redisCache.store.keys();
    const postKeys = keys.filter((key) => key.startsWith('posts:'));
    await Promise.all(postKeys.map((key) => this.redisCache.del(key)));
  }

  async findByTag(
    limit: number,
    tagId: number,
    categoryId: number,
  ): Promise<Post[]> {
    const cacheKey = `posts:tag:${tagId}:category:${categoryId}:limit:${limit}`;
    const cachedResult = await this.redisCache.get<Post[]>(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const posts = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.author', 'author')
      .where('tag.id = :tagId', { tagId })
      .andWhere('category.id = :categoryId', { categoryId })
      .take(limit)
      .getMany();

    const transformedPosts = this.transformMediaToBase64(posts);

    await this.redisCache.set(cacheKey, transformedPosts, 3600); // Cache for 1 hour

    return transformedPosts;
  }

  async findAllByCategory(page: number, limit: number, categoryId: number) {
    const cacheKey = `posts:category:${categoryId}:page:${page}:limit:${limit}`;
    const cachedResult = await this.redisCache.get<any>(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const [result, total] = await this.postsRepository.findAndCount({
      where: { category: { id: categoryId } },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['author', 'category', 'tags', 'comments', 'favorites'],
    });

    const transformedResult = this.transformMediaToBase64(result);

    const response = {
      data: transformedResult,
      totalPages: Math.ceil(total / limit),
    };

    await this.redisCache.set(cacheKey, response, 3600); // Cache for 1 hour

    return response;
  }

  async findOne(id: number): Promise<Post> {
    const cacheKey = `post:${id}`;
    const cachedPost = await this.redisCache.get<Post>(cacheKey);

    if (cachedPost) {
      return cachedPost;
    }

    const post = await this.postsRepository.findOne({
      where: { id },
      relations: [
        'author',
        'category',
        'tags',
        'comments',
        'comments.author',
        'favorites',
      ],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.imageUrl) {
      const isGif = post.imageUrl.includes('.gif');
      const mimeType = isGif ? 'image/gif' : 'image/jpeg';
      post.imageUrlBase64 = `data:${mimeType};base64,${post.imageUrl.toString('base64')}`;
    }

    await this.redisCache.set(cacheKey, post, 3600); // Cache for 1 hour

    return post;
  }

  async searchPosts(query: string): Promise<Post[]> {
    const cacheKey = `posts:search:${query}`;
    const cachedResult = await this.redisCache.get<Post[]>(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const posts = await this.postsRepository.find({
      where: { title: Like(`%${query}%`) },
    });

    await this.redisCache.set(cacheKey, posts, 1800); // Cache for 30 minutes

    return posts;
  }

  async findPostsByUserId(userId: number): Promise<Post[]> {
    const cacheKey = `posts:user:${userId}`;
    const cachedResult = await this.redisCache.get<Post[]>(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const posts = await this.postsRepository.find({
      where: { author: { id: userId } },
      relations: ['author', 'category', 'tags', 'comments', 'favorites'],
    });

    await this.redisCache.set(cacheKey, posts, 3600); // Cache for 1 hour

    return posts;
  }

  async countPostsByCategory() {
    const cacheKey = 'posts:count:by:category';
    const cachedResult = await this.redisCache.get<any>(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const result = await this.postsRepository
      .createQueryBuilder('post')
      .select('post.categoryId')
      .addSelect('COUNT(post.id)', 'count')
      .groupBy('post.categoryId')
      .getRawMany();

    await this.redisCache.set(cacheKey, result, 3600); // Cache for 1 hour

    return result;
  }

  async countPostsByTag(categoryId: number) {
    const cacheKey = `posts:count:by:tag:category:${categoryId}`;
    const cachedResult = await this.redisCache.get<any>(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const result = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .select('tag.id', 'tagId')
      .addSelect('tag.name', 'name')
      .addSelect('COUNT(post.id)', 'count')
      .where('post.categoryId = :categoryId', { categoryId })
      .groupBy('tag.id')
      .addGroupBy('tag.name')
      .getRawMany();

    await this.redisCache.set(cacheKey, result, 3600); // Cache for 1 hour

    return result;
  }

  async updatePost(
    postId: number,
    updatePostDto: CreatePostDto,
  ): Promise<Post> {
    try {
      const post = await this.postsRepository.findOne({
        where: { id: postId },
        relations: ['author', 'category', 'tags'],
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (updatePostDto.authorId) {
        const author = await this.usersRepository.findOne({
          where: { id: updatePostDto.authorId },
        });
        if (!author) {
          throw new NotFoundException('Author not found');
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

      post.title = updatePostDto.title;
      post.content = updatePostDto.content;
      post.description = updatePostDto.description;

      if (updatePostDto.imageUrl) {
        post.imageUrl = updatePostDto.imageUrl;
      }

      const updatedPost = await this.postsRepository.save(post);

      await this.invalidateCache();

      return updatedPost;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update post');
    }
  }
}
