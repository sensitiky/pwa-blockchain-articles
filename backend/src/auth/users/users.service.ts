import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto, UserDto } from './user.dto';
import { IUserActivityService } from '../user-activity.interface';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Post } from '../posts/post.entity';
import { UserManagementService } from '../../user-management.service';

@Injectable()
export class UsersService implements IUserActivityService {
  private redisCache: Cache;

  constructor(
    private userManagementService: UserManagementService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.initializeRedisCache();
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

    try {
      const favoritePosts =
        await this.userManagementService.findUserFavorites(userId);

      if (!favoritePosts || favoritePosts.length === 0) {
        throw new NotFoundException('User not found or has no favorites');
      }

      await this.redisCache.set(cacheKey, favoritePosts, 3600); // Cache for 1 hour

      return favoritePosts;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching user favorites');
    }
  }

  async removeUserFavorite(userId: number, postId: number): Promise<void> {
    try {
      await this.userManagementService.removeUserFavorite(userId, postId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error removing user favorite');
    }
  }

  async findOneById(id: number): Promise<User> {
    const cacheKey = `user:${id}`;
    const cachedUser = await this.redisCache.get<User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    try {
      const user = await this.userManagementService.findOneById(id);
      if (user) {
        await this.redisCache.set(cacheKey, user, 3600); // Cache for 1 hour
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user by ID');
    }
  }

  async findOne(email: string): Promise<User | undefined> {
    const cacheKey = `user:email:${email}`;
    const cachedUser = await this.redisCache.get<User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    try {
      const user = await this.userManagementService.findOne(email);
      if (user) {
        await this.redisCache.set(cacheKey, user, 3600); // Cache for 1 hour
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user by email');
    }
  }

  async countAllUsers(): Promise<number> {
    return this.userManagementService.countAllUsers();
  }

  async countContentCreators(): Promise<number> {
    return this.userManagementService.countContentCreators();
  }

  async getActiveUsers(period: 'day' | 'week' | 'month'): Promise<number> {
    const cacheKey = `active-users:${period}`;
    const cachedResult = await this.redisCache.get<number>(cacheKey);

    if (cachedResult !== null) {
      return cachedResult;
    }

    try {
      const count = await this.userManagementService.getActiveUsers(period);

      await this.redisCache.set(cacheKey, count, 3600); // Cache for 1 hour
      return count;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get active users count',
      );
    }
  }

  async updateLastActivity(userId: number): Promise<void> {
    await this.userManagementService.updateLastActivity(userId);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userManagementService.updateLastLogin(userId);
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

    try {
      const users = await this.userManagementService.searchUsers(query);
      await this.redisCache.set(cacheKey, users, 1800); // Cache for 30 minutes
      return users;
    } catch (error) {
      throw new InternalServerErrorException('Error searching users');
    }
  }

  async findByFacebookId(facebookId: string): Promise<User | null> {
    try {
      return await this.userManagementService.findByFacebookId(facebookId);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error finding user by Facebook ID',
      );
    }
  }

  async findUserPosts(userId: number): Promise<Post[]> {
    try {
      return await this.userManagementService.findUserPosts(userId);
    } catch (error) {
      throw new InternalServerErrorException('Error finding user posts');
    }
  }

  async update(user: User): Promise<User> {
    try {
      return await this.userManagementService.update(user);
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userManagementService.create(createUserDto);
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      return await this.userManagementService.findByEmail(email);
    } catch (error) {
      throw new InternalServerErrorException('Error finding user by email');
    }
  }

  async updateUserInfo(
    userId: number,
    updateData: Partial<User>,
  ): Promise<User> {
    if (!userId) {
      throw new BadRequestException(
        'User ID is required for updating user info.',
      );
    }
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('Update data cannot be empty.');
    }

    try {
      return await this.userManagementService.updateUserInfo(
        userId,
        updateData,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating user info');
    }
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    try {
      await this.userManagementService.updatePassword(email, newPassword);
    } catch (error) {
      throw new InternalServerErrorException('Error updating password');
    }
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
      throw new BadRequestException('User ID is required for deleting user.');
    }

    try {
      await this.userManagementService.deleteUser(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting user');
    }
  }
}
