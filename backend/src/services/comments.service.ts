import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      author,
      post,
      replies: [],
    });

    const savedComment = await this.commentsRepository.save(comment);

    const timestamp = new Date().toISOString();
    const commentLength = savedComment.content.length;

    console.log('Comment created', {
      comment_id: 'comment_' + savedComment.id,
      post_id: 'post_' + (post ? post.id : null),
      user_id: 'user_' + author.id,
      username: author.user,
      timestamp: timestamp,
      comment_content: savedComment.content,
      comment_length: commentLength,
    });

    await this.metricService.trackEvent('Comment Created', {
      comment_id: 'comment_' + savedComment.id,
      post_id: 'post_' + (post ? post.id : null),
      distinct_id: author.id,
      username: author.user,
      timestamp: timestamp,
      comment_content: savedComment.content,
      comment_length: commentLength,
    });

    return savedComment;
  }

  async delete(commentId: number, userId: number): Promise<void> {
    console.log('Attempting to delete comment', { commentId, userId });

    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['author'],
    });
    const post = comment.post;
    if (!comment) {
      console.error('Comment not found');
      throw new NotFoundException('Comment not found');
    }

    console.log('Comment found', { comment });

    console.log('Comparing author ID and user ID', {
      commentAuthorId: comment.author.id,
      userId,
      types: {
        commentAuthorId: typeof comment.author.id,
        userId: typeof userId,
      },
    });

    if (comment.author.id !== userId) {
      console.error('User not allowed to delete this comment', {
        commentAuthorId: comment.author.id,
        userId,
      });
      throw new ForbiddenException(
        'You are not allowed to delete this comment',
      );
    }
    const timestamp = new Date().toISOString();
    const commentLength = comment.content.length;
    console.log('Comment removed', {
      comment_id: 'comment_' + comment.id,
      user_id: 'user_' + userId,
      timestamp: timestamp,
    });

    await this.metricService.trackEvent('Comment Removed', {
      comment_id: 'comment_' + commentId,
      distinct_id: userId,
      timestamp: timestamp,
      username: comment.author,
      post_id: 'post_' + (post ? post.id : null),
      comment_content: comment.content,
      comment_length: commentLength,
    });
    await this.commentsRepository.remove(comment);
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
