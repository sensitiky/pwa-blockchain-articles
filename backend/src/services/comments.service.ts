import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from 'src/dto/comment.dto';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { MetricService } from './metric.service';
import { timeStamp } from 'console';

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

    // Guardar el comentario para obtener el ID generado
    const savedComment = await this.commentsRepository.save(comment);

    const timestamp = new Date().toISOString();
    const commentLength = savedComment.content.length;

    console.log('Comment created', {
      comment_id: savedComment.id,
      post_id: post ? post.id : null,
      user_ID: 'user_' + author.id,
      username: author.user,
      commentContent: savedComment.content,
      timestamp: timestamp,
      commentary: comment.content,
      commentLength: commentLength,
    });

    await this.metricService.trackEvent('Comment Created', {
      comment_id: savedComment.id,
      post_id: post ? post.id : null,
      user_ID: 'user_' + author.id,
      username: author.user,
      timestamp: timestamp,
      commentContent: savedComment.content,
      commentLength: commentLength,
    });

    return savedComment;
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
