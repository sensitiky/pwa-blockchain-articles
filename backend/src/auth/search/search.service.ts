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
