import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '../entities/user.entity';
import { CreateUserDto, UserDto } from '../dto/user.dto';
import { Post } from '../entities/post.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserManagementService {
  private redisCache: Cache;

  constructor(
    @Inject('DATABASE_SERVICE') private databaseClient: ClientProxy,
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
      const favoritePosts = await firstValueFrom(
        this.databaseClient.send<Post[]>('findUserFavorites', userId)
      );

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
      const response = await firstValueFrom(
        this.databaseClient.send('removeFavorite', { userId, postId })
      );

      if (response && response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
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
      const user = await firstValueFrom(
        this.databaseClient.send<User, number>('findUserById', id)
      );
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
      const user = await firstValueFrom(
        this.databaseClient.send<User, string>('findUserByEmail', email)
      );
      if (user) {
        await this.redisCache.set(cacheKey, user, 3600); // Cache for 1 hour
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user by email');
    }
  }

  async countAllUsers(): Promise<number> {
    return firstValueFrom(this.databaseClient.send<number>('countAllUsers', {}));
  }

  async countContentCreators(): Promise<number> {
    return firstValueFrom(this.databaseClient.send<number>('countContentCreators', {}));
  }

  async getActiveUsers(period: 'day' | 'week' | 'month'): Promise<number> {
    const cacheKey = `active-users:${period}`;
    const cachedResult = await this.redisCache.get<number>(cacheKey);

    if (cachedResult !== null) {
      return cachedResult;
    }

    try {
      const count = await firstValueFrom(
        this.databaseClient.send<number, string>('getActiveUsers', period)
      );

      await this.redisCache.set(cacheKey, count, 3600); // Cache for 1 hour
      return count;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get active users count');
    }
  }

  async updateLastActivity(userId: number): Promise<void> {
    await firstValueFrom(
      this.databaseClient.send('updateLastActivity', userId)
    );
  }

  async updateLastLogin(userId: string): Promise<void> {
    await firstValueFrom(
      this.databaseClient.send('updateLastLogin', userId)
    );
  }

  async searchUsers(query: string): Promise<User[]> {
    return firstValueFrom(
      this.databaseClient.send<User[], string>('searchUsers', query)
    );
  }

  async findByFacebookId(facebookId: string): Promise<User | null> {
    return firstValueFrom(
      this.databaseClient.send<User | null, string>('findByFacebookId', facebookId)
    );
  }

  async findUserPosts(userId: number): Promise<Post[]> {
    return firstValueFrom(
      this.databaseClient.send<Post[], number>('findUserPosts', userId)
    );
  }

  async update(user: User): Promise<User> {
    return firstValueFrom(
      this.databaseClient.send<User, User>('updateUser', user)
    );
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return firstValueFrom(
      this.databaseClient.send<User, CreateUserDto>('createUser', createUserDto)
    );
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return firstValueFrom(
      this.databaseClient.send<User | undefined, string>('findByEmail', email)
    );
  }

  async updateUserInfo(userId: number, updateData: Partial<User>): Promise<User> {
    return firstValueFrom(
      this.databaseClient.send<User, { userId: number; updateData: Partial<User> }>('updateUserInfo', { userId, updateData })
    );
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    await firstValueFrom(
      this.databaseClient.send<void, { email: string; newPassword: string }>('updatePassword', { email, newPassword })
    );
  }

  async deleteUser(userId: number): Promise<void> {
    await firstValueFrom(
      this.databaseClient.send<void, number>('deleteUser', userId)
    );
  }
}
