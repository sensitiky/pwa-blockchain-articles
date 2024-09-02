import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, MoreThan, Not, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UserDto } from './user.dto';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';
import { Favorite } from '../favorites/favorite.entity';
import { IUserActivityService } from '../user-activity.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisCache } from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService implements IUserActivityService {
  private redisCache: RedisCache;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
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

  async removeUserFavorite(userId: number, postId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

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

    const users = await this.userRepository.find({
      where: { user: Like(`%${query}%`) },
    });

    await this.redisCache.set(cacheKey, users, 1800); // Cache for 30 minutes

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
    user.postCount = 0;
    const newUser = await this.userRepository.save(user);
    newUser.postCount = newUser.posts ? newUser.posts.length : 0;
    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updateUserInfo(
    userId: number,
    updateData: Partial<User>,
  ): Promise<User> {
    if (!userId) {
      throw new Error('User ID is required for updating user info.');
    }
    if (Object.keys(updateData).length === 0) {
      throw new Error('Update data cannot be empty.');
    }

    await this.userRepository.update(userId, updateData);
    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!updatedUser) {
      throw new Error('User not found after update.');
    }

    updatedUser.postCount = updatedUser.posts ? updatedUser.posts.length : 0;
    return this.userRepository.save(updatedUser);
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    await this.userRepository.update({ email }, { password: newPassword });
  }

  transformToDto(user: User): UserDto {
    const userDto: UserDto = {
      ...user,
      postCount: user.postCount,
    };
    return userDto;
  }

  async deleteUser(userId: number): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required for deleting user.');
    }

    try {
      // Eliminar comentarios relacionados
      await this.commentRepository.delete({ author: { id: userId } });
    } catch (error) {
      console.warn('Error deleting comments for user:', error);
    }

    try {
      // Eliminar publicaciones relacionadas
      await this.postRepository.delete({ author: { id: userId } });
    } catch (error) {
      console.warn('Error deleting posts for user:', error);
    }

    try {
      // Eliminar al usuario en sí
      await this.userRepository.delete(userId);
    } catch (error) {
      console.warn('Error deleting user:', error);
      throw new Error('User deletion failed.');
    }
  }
}
