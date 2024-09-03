import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { FavoritesService } from '../favorites/favorites.service';
import { UserActivityService } from '../../user-activity.service';

@Injectable()
export class MetricService {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
    private readonly favoritesService: FavoritesService,
    private readonly userActivityService: UserActivityService,
  ) {}

  async getAllMetrics() {
    const userCount = await this.usersService.countAllUsers();
    const contentCreatorCount = await this.usersService.countContentCreators();
    const dau = await this.usersService.getActiveUsers('day');
    const wau = await this.usersService.getActiveUsers('week');
    const mau = await this.usersService.getActiveUsers('month');
    const retentionRate = await this.usersService.getRetentionRate();
    const articlesByCategory = await this.postsService.getArticlesByCategory();
    const averageReadTime = await this.postsService.getAverageReadTime();
    const savedArticles = await this.favoritesService.getSavedArticles();
    const activeUsers = this.userActivityService.getActiveUsersCount();

    return {
      userCount,
      contentCreatorCount,
      dau,
      wau,
      mau,
      retentionRate,
      articlesByCategory,
      averageReadTime,
      savedArticles,
      activeUsers,
    };
  }
}
