import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, UserDto } from '../dto/user.dto';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { Favorite } from '../entities/favorite.entity';
import { IUserActivityService } from '../auth/user-activity.interface';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { MetricService } from './metric.service';

@Injectable()
export class UsersService implements IUserActivityService {
  private redisCache: Cache;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @Inject(forwardRef(() => MetricService))
    private metricService: MetricService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.initializeRedisCache();
  }
  removeActiveUser(userId: number): void {
    throw new Error('Method not implemented.');
  }
  getActiveUsersCount(): number {
    throw new Error('Method not implemented.');
  }

  private initializeRedisCache() {
    this.redisCache = this.cacheManager;
  }

  async findUserFavorites(userId: number): Promise<Post[]> {
    const cacheKey = `user:${userId}:favorites`;
    const cachedFavorites = await this.redisCache.get<Post[]>(cacheKey);

    if (cachedFavorites) {
      return cachedFavorites;
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites', 'favorites.post'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const favoritePostIds = user.favorites
      .filter((favorite) => favorite.post)
      .map((favorite) => favorite.post.id);

    const favoritePosts = await this.postRepository.findByIds(favoritePostIds);

    await this.redisCache.set(cacheKey, favoritePosts, 3600); // Cache for 1 hour

    return favoritePosts;
  }

  async removeUserFavorite(
    userId: number,
    postId?: number,
    commentId?: number,
  ): Promise<void> {
    let favorite;

    if (postId) {
      favorite = await this.favoriteRepository.findOne({
        where: { user: { id: userId }, post: { id: postId } },
      });
    } else if (commentId) {
      favorite = await this.favoriteRepository.findOne({
        where: { user: { id: userId }, comment: { id: commentId } },
      });
    }

    if (!favorite) {
      throw new Error('Favorite not found');
    }

    await this.favoriteRepository.remove(favorite);
  }

  async findOneById(id: number): Promise<User> {
    const cacheKey = `user:${id}`;
    const cachedUser = await this.redisCache.get<User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      await this.redisCache.set(cacheKey, user, 3600); // Cache for 1 hour
    }
    return user;
  }

  async findOne(email: string): Promise<User | undefined> {
    const cacheKey = `user:email:${email}`;
    const cachedUser = await this.redisCache.get<User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      await this.redisCache.set(cacheKey, user, 3600); // Cache for 1 hour
    }
    return user;
  }

  async countAllUsers(): Promise<number> {
    return this.userRepository.count();
  }

  async countContentCreators(): Promise<number> {
    const creators = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.posts', 'post')
      .getCount();

    return creators;
  }

  async getActiveUsers(period: 'day' | 'week' | 'month'): Promise<number> {
    const cacheKey = `active-users:${period}`;
    const cachedResult = await this.redisCache.get<number>(cacheKey);

    if (cachedResult !== null) {
      return cachedResult;
    }

    const date = new Date();
    if (period === 'day') {
      date.setDate(date.getDate() - 1);
    } else if (period === 'week') {
      date.setDate(date.getDate() - 7);
    } else if (period === 'month') {
      date.setMonth(date.getMonth() - 1);
    }

    try {
      const count = await this.userRepository.count({
        where: {
          lastActivity: MoreThan(date),
        },
      });

      await this.redisCache.set(cacheKey, count, 3600); // Cache for 1 hour
      return count;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get active users count',
      );
    }
  }

  async updateLastActivity(userId: number): Promise<void> {
    await this.userRepository.update(userId, {
      lastActivity: new Date(),
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      lastLogin: new Date(),
    });
  }

  async getRetentionRate(): Promise<{ weekly: number; monthly: number }> {
    const weeklyRetention = await this.calculateRetentionRate('week');
    const monthlyRetention = await this.calculateRetentionRate('month');
    return { weekly: weeklyRetention, monthly: monthlyRetention };
  }

  private async calculateRetentionRate(
    period: 'week' | 'month',
  ): Promise<number> {
    const date = new Date();
    if (period === 'week') {
      date.setDate(date.getDate() - 7);
    } else if (period === 'month') {
      date.setMonth(date.getMonth() - 1);
    }
    return 0;
  }

  async searchUsers(query: string): Promise<User[]> {
    const cacheKey = `users:search:${query}`;
    const cachedResult = await this.redisCache.get<User[]>(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const normalizedQuery = `%${query.toLowerCase()}%`;
    const users = await this.userRepository.query(
      `SELECT * FROM "user" WHERE LOWER(user) LIKE $1 OR LOWER("email") LIKE $1`,
      [normalizedQuery],
    );

    await this.redisCache.set(cacheKey, users, 1800);

    return users;
  }

  async findByFacebookId(facebookId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { facebookId } });
  }

  async findUserPosts(userId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { author: { id: userId } },
      relations: ['author'],
    });
  }
  async update(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);
    console.log('User Registered', {
      distinct_id: savedUser.id,
      email: savedUser.email,
    });
    await this.metricService.trackEvent('User Registered', {
      distinct_id: savedUser.id,
      email: savedUser.email,
    });
    return savedUser;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
  async findByUsername(user: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { user } });
  }

  async findByEmailOrUsername(identifier: string): Promise<User | undefined> {
    console.log('findByEmailOrUsername called with identifier:', identifier);
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { user: identifier }],
    });
    console.log('User found:', user);
    return user;
  }

  async updateUserInfo(
    userId: number,
    updateData: Partial<User>,
  ): Promise<User> {
    console.log(
      'updateUserInfo called with userId:',
      userId,
      'updateData:',
      updateData,
    );
    if (!userId) {
      console.error('User ID is required for updating user info.');
      throw new Error('User ID is required for updating user info.');
    }
    if (Object.keys(updateData).length === 0) {
      console.error('Update data cannot be empty.');
      throw new Error('Update data cannot be empty.');
    }

    await this.userRepository.update(userId, updateData);
    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!updatedUser) {
      console.error('User not found after update.');
      throw new Error('User not found after update.');
    }

    updatedUser.postCount = updatedUser.posts ? updatedUser.posts.length : 0;
    console.log('Updated user:', updatedUser);
    return this.userRepository.save(updatedUser);
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    console.log('updatePassword called with email:', email);
    await this.userRepository.update({ email }, { password: newPassword });
  }

  transformToDto(user: User): UserDto {
    if (!user) {
      console.error('User is null in transformToDto');
      throw new Error('User not found');
    }
    console.log('transformToDto called with user:', user);
    const userDto: UserDto = {
      id: user.id,
      user: user.user,
      facebookId: user.facebookId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      date: user.date,
      country: user.country,
      medium: user.medium,
      instagram: user.instagram,
      facebook: user.facebook,
      twitter: user.twitter,
      linkedin: user.linkedin,
      bio: user.bio,
      avatar: user.avatar,
      postCount: user.postCount,
    };
    return userDto;
  }

  async deleteUser(userId: number): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required for deleting user.');
    }

    try {
      // Delete comments related
      await this.commentRepository.delete({ author: { id: userId } });
    } catch (error) {
      console.warn('Error deleting comments for user:', error);
    }

    try {
      // Delete posts related
      await this.postRepository.delete({ author: { id: userId } });
    } catch (error) {
      console.warn('Error deleting posts for user:', error);
    }

    try {
      // Delete the user itself
      await this.userRepository.delete(userId);
    } catch (error) {
      console.warn('Error deleting user:', error);
      throw new Error('User deletion failed.');
    }
  }
}
