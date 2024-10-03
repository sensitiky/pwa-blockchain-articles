import { Injectable } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { UsersService } from '../services/users.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  async search(query: string, type: string) {
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
