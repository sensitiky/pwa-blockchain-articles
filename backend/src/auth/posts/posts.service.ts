import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../database/entities/post.entity';
import { CreatePostDto } from '../../dto/posts.dto';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const author = await this.usersRepository.findOne({ where: { id: createPostDto.authorId } });
    const post = this.postsRepository.create({ ...createPostDto, author });
    return this.postsRepository.save(post);
  }
}
