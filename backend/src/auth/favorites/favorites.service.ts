import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';
import { CreateFavoriteDto } from '../../dto/favorite.dto';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';

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
    return this.favoritesRepository.save(favorite);
  }

  async findAllByUser(userId: number): Promise<Favorite[]> {
    return this.favoritesRepository.find({
      where: { user: { id: userId } },
      relations: ['post', 'comment'],
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
