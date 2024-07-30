import { Injectable } from '@nestjs/common';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  async search(query: string, type: string) {
    let results = [];

    if (type === 'posts' || type === 'all') {
      const posts = await this.postsService.searchPosts(query);
      results = results.concat(posts);
    }

    if (type === 'users' || type === 'all') {
      const users = await this.usersService.searchUsers(query);
      results = results.concat(users);
    }

    return results;
  }
}
