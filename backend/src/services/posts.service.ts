import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/posts.dto';
import { User } from '../entities/user.entity';
import { Tag } from '../entities/tag.entity';
import { Category } from '../entities/category.entity';
import { Favorite } from '../entities/favorite.entity';
import { Comment } from '../entities/comment.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { TagDto } from '../dto/tag.dto';
import { MetricService } from './metric.service';
import { distinct } from 'rxjs';

@Injectable()
export class PostsService {
  private readonly CACHE_TTL = 3600; // 1 hour

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
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private configService: ConfigService,
    @Inject(forwardRef(() => MetricService))
    private readonly metricService: MetricService,
  ) {}

  private async getCachedData<T>(
    key: string,
    fetcher: () => Promise<T>,
  ): Promise<T> {
    const cachedData = await this.cacheManager.get<T>(key);
    if (cachedData) return cachedData;
    const data = await fetcher();
    await this.cacheManager.set(key, data, this.CACHE_TTL);
    return data;
  }

  async findUserFavorites(userId: number): Promise<Post[]> {
    return this.getCachedData(`user:${userId}:favorites`, async () => {
      const favorites = await this.favoritesRepository.find({
        where: { user: { id: userId } },
        relations: ['post'],
      });
      const postIds = favorites.map((fav) => fav.post.id);
      return this.postsRepository.findByIds(postIds);
    });
  }

  async getArticlesByCategory() {
    return this.getCachedData('articles:by:category', () =>
      this.postsRepository
        .createQueryBuilder('post')
        .leftJoin('post.category', 'category')
        .select('post.categoryId')
        .addSelect('category.name')
        .addSelect('COUNT(post.id)', 'count')
        .groupBy('post.categoryId')
        .addGroupBy('category.name')
        .getRawMany(),
    );
  }

  async getAverageReadTime() {
    return this.getCachedData('average:read:time', () =>
      this.postsRepository
        .createQueryBuilder('post')
        .select('AVG(post.readTime)', 'average')
        .getRawOne(),
    );
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    try {
      // Parse tags if they are in JSON string format
      const tags =
        typeof createPostDto.tags === 'string'
          ? JSON.parse(createPostDto.tags)
          : createPostDto.tags;

      const [author, category, processedTags] = await Promise.all([
        this.usersRepository.findOne({ where: { id: createPostDto.authorId } }),
        createPostDto.categoryId
          ? this.categoriesRepository.findOne({
              where: { id: createPostDto.categoryId },
            })
          : null,
        this.processTags(tags),
      ]);

      if (!author) throw new NotFoundException('Author not found');
      if (!category) throw new NotFoundException('Category not found');

      const post = this.postsRepository.create({
        ...createPostDto,
        author,
        category,
        tags: processedTags,
      });

      await this.postsRepository.save(post);
      await this.usersRepository.increment({ id: author.id }, 'postCount', 1);
      await this.invalidateCache();
      const postLength = post.content ? post.content.length : 0;
      const timestamp = new Date().toISOString();

      // Log the event with Mixpanel
      console.log('Post Created', {
        postID: 'post_' + post.id,
        postTitle: post.title,
        timestamp: timestamp,
        category: post.category,
        tags: post.tags,
        content_length: postLength,
      });

      // Track event with Mixpanel
      await this.metricService.trackEvent('Post Created', {
        post_id: 'post_' + post.id,
        distinct_id: post.author.id,
        timestamp: timestamp,
        category: post.category,
        tags: post.tags,
        content_length: postLength,
      });

      return post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new InternalServerErrorException('Failed to create post');
    }
  }

  private async processTags(
    tags: string | string[] | TagDto[],
  ): Promise<Tag[]> {
    const tagNames = Array.isArray(tags)
      ? tags.map((tag) => (typeof tag === 'string' ? tag : tag.name))
      : JSON.parse(tags);

    // Find existing tags
    const existingTags = await this.tagsRepository.find({
      where: { name: In(tagNames) },
    });
    const existingTagNames = existingTags.map((tag) => tag.name);

    // Filter out existing tags and create new tags
    const newTagNames = tagNames.filter(
      (name) => !existingTagNames.includes(name),
    );
    const newTags = newTagNames.map((name) =>
      this.tagsRepository.create({ name }),
    );

    // Save new tags
    if (newTags.length > 0) {
      await this.tagsRepository.save(newTags);
    }

    return [...existingTags, ...newTags];
  }

  async deletePost(postId: number): Promise<void> {
    console.log(`Attempting to delete post with ID: ${postId}`);
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['author', 'favorites', 'comments'],
    });

    if (!post) {
      console.error(`Post with ID: ${postId} not found`);
      throw new NotFoundException('Post not found');
    }

    console.log(`Post found: ${post.title}`);
    //Delete comments
    await this.commentsRepository.delete({ post: { id: postId } });

    //Delete saved
    await this.favoritesRepository.delete({ post: { id: postId } });

    // Delete the post
    await this.postsRepository.remove(post);

    // Downgrade the post counter only god and i know how this works and even i dont know how this works :(
    await this.usersRepository.decrement(
      { id: post.author.id },
      'postCount',
      1,
    );
    const timestamp = new Date().toISOString();

    console.log(`Post Removed`, {
      post_id: 'post_' + postId,
      user_id: 'user_' + post.author.id,
      timestamp: timestamp,
    });

    await this.metricService.trackEvent(`Post Removed`, {
      post_id: 'post_' + postId,
      distinct_id: post.author.id,
      timestamp: timestamp,
    });

    await this.invalidateCache();
  }

  private transformMediaToBase64(posts: Post[]): Post[] {
    return posts.map((post) => {
      if (post.imageUrl) {
        const isGif = post.imageUrl.includes('.gif');
        const mimeType = isGif ? 'image/gif' : 'image/jpeg';
        return {
          ...post,
          imageUrl: undefined,
          imageUrlBase64: `data:${mimeType};base64,${post.imageUrl.toString('base64')}`,
        };
      }
      return post;
    });
  }

  async findAll(page: number, limit: number, order: string) {
    return this.getCachedData(`posts:${page}:${limit}:${order}`, async () => {
      const queryBuilder = this.postsRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.author', 'author')
        .leftJoinAndSelect('post.category', 'category')
        .leftJoinAndSelect('post.tags', 'tags');

      switch (order) {
        case 'saved':
          queryBuilder
            .leftJoin('post.favorites', 'favorites')
            .addSelect('COUNT(DISTINCT favorites.id)', 'favoritesCount')
            .groupBy('post.id')
            .addGroupBy('author.id')
            .addGroupBy('category.id')
            .addGroupBy('tags.id')
            .orderBy('favoritesCount', 'DESC');
          break;
        case 'comment':
          queryBuilder
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
          queryBuilder.orderBy('post.createdAt', 'DESC');
          break;
      }

      const [result, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        data: this.transformMediaToBase64(result),
        totalPages: Math.ceil(total / limit),
      };
    });
  }

  async invalidateCache() {
    const keys = await this.cacheManager.store.keys();
    const postKeys = keys.filter(
      (key) => key.startsWith('posts:') || key.startsWith('post:'),
    );
    await Promise.all(postKeys.map((key) => this.cacheManager.del(key)));
  }

  async findByTag(
    limit: number,
    tagId: number,
    categoryId: number,
  ): Promise<Post[]> {
    return this.getCachedData(
      `posts:tag:${tagId}:category:${categoryId}:limit:${limit}`,
      async () => {
        const posts = await this.postsRepository
          .createQueryBuilder('post')
          .leftJoinAndSelect('post.tags', 'tag')
          .leftJoinAndSelect('post.category', 'category')
          .leftJoinAndSelect('post.author', 'author')
          .where('tag.id = :tagId', { tagId })
          .andWhere('category.id = :categoryId', { categoryId })
          .take(limit)
          .getMany();

        return this.transformMediaToBase64(posts);
      },
    );
  }

  async findAllByCategory(page: number, limit: number, categoryId: number) {
    return this.getCachedData(
      `posts:category:${categoryId}:page:${page}:limit:${limit}`,
      async () => {
        const [result, total] = await this.postsRepository.findAndCount({
          where: { category: { id: categoryId } },
          skip: (page - 1) * limit,
          take: limit,
          relations: ['author', 'category', 'tags', 'comments', 'favorites'],
        });

        return {
          data: this.transformMediaToBase64(result),
          totalPages: Math.ceil(total / limit),
        };
      },
    );
  }

  async findOne(id: number): Promise<Post> {
    return this.getCachedData(`post:${id}`, async () => {
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

      if (!post) throw new NotFoundException('Post not found');

      if (post.imageUrl) {
        const isGif = post.imageUrl.includes('.gif');
        const mimeType = isGif ? 'image/gif' : 'image/jpeg';
        post.imageUrlBase64 = `data:${mimeType};base64,${post.imageUrl.toString('base64')}`;
      }
      const timestamp = new Date().toISOString();

      console.log(`Post open. ID: ${id} title: ${post.title}`, {
        postID: post.id,
        title: post.title,
        authorID: post.author.id,
        authorUsername: post.author.user,
      });
      await this.metricService.trackEvent(`Post open`, {
        post_id: 'post_' + post.id,
        user_id: 'user_' + post.author.id,
        timestamp: timestamp,
        //TODO added viewsource & post_count
      });
      return post;
    });
  }

  async searchPosts(query: string): Promise<Post[]> {
    return this.getCachedData(`posts:search:${query}`, () =>
      this.postsRepository
        .createQueryBuilder('post')
        .where('LOWER(post.title) LIKE :query', { query: `%${query}%` })
        .orWhere('LOWER(post.content) LIKE :query', { query: `%${query}%` })
        .getMany(),
    );
  }

  async findPostsByUserId(userId: number): Promise<Post[]> {
    return this.getCachedData(`posts:user:${userId}`, () =>
      this.postsRepository.find({
        where: { author: { id: userId } },
        relations: ['author', 'category', 'tags', 'comments', 'favorites'],
      }),
    );
  }

  async countPostsByCategory() {
    return this.getCachedData('posts:count:by:category', () =>
      this.postsRepository
        .createQueryBuilder('post')
        .select('post.categoryId')
        .addSelect('COUNT(post.id)', 'count')
        .groupBy('post.categoryId')
        .getRawMany(),
    );
  }

  async countPostsByTag(categoryId: number) {
    return this.getCachedData(`posts:count:by:tag:category:${categoryId}`, () =>
      this.postsRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.tags', 'tag')
        .select('tag.id', 'tagId')
        .addSelect('tag.name', 'name')
        .addSelect('COUNT(post.id)', 'count')
        .where('post.categoryId = :categoryId', { categoryId })
        .groupBy('tag.id')
        .addGroupBy('tag.name')
        .getRawMany(),
    );
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

      if (!post) throw new NotFoundException('Post not found');

      const [author, category, tags] = await Promise.all([
        updatePostDto.authorId
          ? this.usersRepository.findOne({
              where: { id: updatePostDto.authorId },
            })
          : null,
        updatePostDto.categoryId
          ? this.categoriesRepository.findOne({
              where: { id: updatePostDto.categoryId },
            })
          : null,
        updatePostDto.tags ? this.processTags(updatePostDto.tags) : null,
      ]);

      if (updatePostDto.authorId && !author)
        throw new NotFoundException('Author not found');

      Object.assign(post, {
        ...updatePostDto,
        author: author || post.author,
        category: category || post.category,
        tags: tags || post.tags,
      });

      const updatedPost = await this.postsRepository.save(post);
      await this.invalidateCache();

      return updatedPost;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update post');
    }
  }
}
