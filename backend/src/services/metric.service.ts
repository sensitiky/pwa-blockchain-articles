import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { PostsService } from '../services/posts.service';
import { FavoritesService } from '../services/favorites.service';
import { UserActivityService } from '../services/user-activity.service';
import * as Mixpanel from 'mixpanel';

@Injectable()
export class MetricService {
  private mixpanel: Mixpanel.Mixpanel;

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly userActivityService: UserActivityService,
  ) {
    this.mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN, {
      protocol: 'https',
    });
  }

  async trackEvent(
    event: string,
    properties: Record<string, any> = {},
    userProperties: Record<string, any> = {},
  ): Promise<void> {
    const mergedProperties = { ...properties, ...userProperties };
    this.mixpanel.track(event, mergedProperties);
  }

  async setUserProperties(
    distinctId: string,
    properties: Record<string, any>,
  ): Promise<void> {
    this.mixpanel.people.set(distinctId, properties);
  }

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
