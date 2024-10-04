import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { UsersService } from '../services/users.service';
import { MetricService } from './metric.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => MetricService))
    private readonly metricService: MetricService,
  ) {}

  async search(query: string, type: string, userID?: number) {
    let results = [];
    const normalizedQuery = query.toLowerCase();

    if (type === 'posts' || type === 'all') {
      const posts = await this.postsService.searchPosts(normalizedQuery);
      const postsWithType = posts.map((post) => ({ ...post, type: 'post' }));
      results = results.concat(postsWithType);
    }

    if (type === 'users' || type === 'all') {
      const users = await this.usersService.searchUsers(normalizedQuery);
      const usersWithType = users.map((user) => ({ ...user, type: 'user' }));
      results = results.concat(usersWithType);
    }

    const timestamp = new Date().toISOString();
    const resultsCount = results.length;

    await this.metricService.trackEvent('Search Performed', {
      event: 'Search Performed',
      query: query,
      user_id: userID ?? 'anonymous',
      timestamp: timestamp,
      results_count: resultsCount,
    });

    console.log('Search Performed Event Tracked', {
      event: 'Search Performed',
      query: query,
      user_id: userID ?? 'anonymous',
      timestamp: timestamp,
      results_count: resultsCount,
    });

    return results;
  }

  async searchById(id: string) {
    const postId = parseInt(id, 10);
    const post = await this.postsService.findOne(postId);
    if (post) {
      return { type: 'post', data: post };
    }

    const userId = parseInt(id, 10);
    const user = await this.usersService.findOneById(userId);
    if (user) {
      const userPosts = await this.postsService.findPostsByUserId(userId);
      return { type: 'user', data: { user, posts: userPosts } };
    }

    return null;
  }
}
