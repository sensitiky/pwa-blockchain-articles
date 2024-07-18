import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from 'src/dto/comment.dto';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const author = await this.usersRepository.findOne({ where: { id: createCommentDto.authorId } });
    const post = await this.postsRepository.findOne({ where: { id: createCommentDto.postId } });

    const comment = this.commentsRepository.create({ ...createCommentDto, author, post });
    return this.commentsRepository.save(comment);
  }

  async findAllByPost(postId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { post: { id: postId } },
      relations: ['author'],
    });
  }
}