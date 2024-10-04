import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from 'src/dto/comment.dto';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { MetricService } from './metric.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @Inject(forwardRef(() => MetricService))
    private readonly metricService: MetricService,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const author = await this.usersRepository.findOne({
      where: { id: createCommentDto.authorId },
    });
    const post = await this.postsRepository.findOne({
      where: { id: createCommentDto.postId },
    });
    const parentComment = createCommentDto.parentCommentId
      ? await this.commentsRepository.findOne({
          where: { id: createCommentDto.parentCommentId },
        })
      : null;

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      author,
      post,
      replies: [],
    });
    console.log('Comment created', {
      commentID: comment.id,
      commentContent: comment.content,
      authorID: author.id,
      authorUsername: author.user,
      post: post ? post.id : null,
      postTitle: post ? post.title : null,
    });
    await this.metricService.trackEvent('Comment Created', {
      distinct_id: comment.id,
      commentContent: comment.content,
      authorID: author.id,
      authorUsername: author.user,
      post: post ? post.id : null,
      postTitle: post ? post.title : null,
    });

    return this.commentsRepository.save(comment);
  }

  async findAllByPost(postId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { post: { id: postId }, parentComment: null },
      relations: ['author'],
    });
  }

  async findAllReplies(commentId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { parentComment: { id: commentId } },
      relations: ['author'],
    });
  }
}
