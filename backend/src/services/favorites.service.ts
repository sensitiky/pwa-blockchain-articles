import { forwardRef, Inject, Injectable } from '@nestjs/common';
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

    // Log the event data
    console.log('Tracking Favorite Created event:', {
      distinct_id: favorite.id,
      user: user.id,
      post: post ? post.id : null,
      comment: comment ? comment.id : null,
    });

    // Track event with Mixpanel
    await this.metricService.trackEvent('Favorite Created', {
      distinct_id: favorite.id,
      user: user.id,
      post: post ? post.id : null,
      comment: comment ? comment.id : null,
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
    });

    if (favorite) {
      await this.favoritesRepository.remove(favorite);
    }
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
