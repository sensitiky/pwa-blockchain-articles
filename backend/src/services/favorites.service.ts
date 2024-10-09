import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
import { CreateFavoriteDto } from '../dto/favorite.dto';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { MetricService } from './metric.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @Inject(forwardRef(() => MetricService))
    private readonly metricService: MetricService,
  ) {}

  async create(createFavoriteDto: CreateFavoriteDto): Promise<Favorite> {
    const user = await this.usersRepository.findOne({
      where: { id: createFavoriteDto.userId },
    });
    let post = null;
    let comment = null;

    if (createFavoriteDto.postId) {
      post = await this.postsRepository.findOne({
        where: { id: createFavoriteDto.postId },
      });
    }

    if (createFavoriteDto.commentId) {
      comment = await this.commentsRepository.findOne({
        where: { id: createFavoriteDto.commentId },
      });
    }

    const favorite = this.favoritesRepository.create({
      ...createFavoriteDto,
      user,
      post,
      comment,
    });
    await this.favoritesRepository.save(favorite);
    const timestamp = new Date().toISOString();

    // Log the event data
    console.log('Tracking Favorite Created event:', {
      bookmark_id: 'bookmark_' + favorite.id,
      user: 'user_' + user.id,
      post: 'post_' + post ? post.id : null,
      timestamp: timestamp,
      bookmarks_removed_count: user.favorites,
      //TODO add bookmarked counter
    });

    // Track event with Mixpanel
    await this.metricService.trackEvent('Favorite Created', {
      bookmark_id: 'bookmark_' + favorite.id,
      user: 'user_' + user.id,
      post: 'post_' + post ? post.id : null,
      timestamp: timestamp,
      bookmarks_removed_count: user.favorites,
      //TODO add bookmarked counter
    });

    return favorite;
  }

  async findAllByUser(userId: number): Promise<Favorite[]> {
    return this.favoritesRepository.find({
      where: { user: { id: userId } },
      relations: ['post', 'comment'],
    });
  }

  async remove(
    userId: number,
    postId?: number,
    commentId?: number,
  ): Promise<void> {
    const favorite = await this.favoritesRepository.findOne({
      where: {
        user: { id: userId },
        post: postId ? { id: postId } : undefined,
        comment: commentId ? { id: commentId } : undefined,
      },
      relations: ['post', 'comment'],
    });
    let post = null;
    if (postId) {
      post = await this.postsRepository.findOne({
        where: { id: postId },
      });
    }
    let user = null;
    if (userId) {
      user = await this.usersRepository.findOne({
        where: { id: userId },
      });
    }
    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.favoritesRepository.remove(favorite);
    const timestamp = new Date().toISOString();

    // Log the event data
    console.log('Tracking Favorite Removed event:', {
      favoriteID: 'favorite_' + favorite.id,
      post_id: 'post_' + postId,
      user_id: 'user_' + userId,
      timestamp: timestamp,
      //TODO add bookmark removed counter
    });

    // Track event with Mixpanel
    await this.metricService.trackEvent('Favorite Removed', {
      favorite_id: 'favorite_' + favorite.id,
      post_id: 'post_' + postId,
      user_id: 'user_' + userId,
      timestamp: timestamp,
      //TODO add bookmark removed counter
    });
  }

  async getSavedArticles() {
    return this.favoritesRepository
      .createQueryBuilder('favorite')
      .select('COUNT(favorite.id)', 'count')
      .addSelect('post.title', 'title')
      .addSelect('post.content', 'content')
      .addSelect('post.createdAt', 'createdAt')
      .leftJoin('favorite.post', 'post')
      .groupBy('post.id')
      .getRawMany();
  }
}
