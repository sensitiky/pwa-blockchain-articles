import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class UpdatePostCountsService {
  private readonly logger = new Logger(UpdatePostCountsService.name);

  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) {}

  async updateCounts(): Promise<void> {
    const posts = await this.postsRepository.find();

    for (const post of posts) {
      const commentscount = await this.commentsRepository.count({
        where: { post: { id: post.id } },
      });

      const favoritescount = await this.favoritesRepository.count({
        where: { post: { id: post.id } },
      });

      await this.postsRepository.update(post.id, {
        commentscount,
        favoritescount,
      });

      this.logger.log(
        `Post ID ${post.id}: commentsCount updated to ${commentscount}, favoritesCount updated to ${favoritescount}`,
      );
    }

    this.logger.log('All post counts have been updated.');
  }
}
