import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UserDto } from './user.dto';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}
  async findUserFavorites(userId: number): Promise<Post[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites', 'favorites.post'],
    });
    if (!user) {
      throw new Error('User not found');
    }

    const favoritePostIds = user.favorites
      .filter((favorite) => favorite.post)
      .map((favorite) => favorite.post.id);

    const favoritePosts = await this.postRepository.findByIds(favoritePostIds);

    return favoritePosts;
  }
  async findOneById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.userRepository.find({
      where: { user: Like(`%${query}%`) },
    });
  }

  async findByFacebookId(facebookId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { facebookId } });
  }

  async findUserPosts(userId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { author: { id: userId } },
      relations: ['author'],
    });
  }
  async update(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    user.postCount = 0;
    const newUser = await this.userRepository.save(user);
    newUser.postCount = newUser.posts ? newUser.posts.length : 0;
    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updateUserInfo(
    userId: number,
    updateData: Partial<User>,
  ): Promise<User> {
    if (!userId) {
      throw new Error('User ID is required for updating user info.');
    }
    if (Object.keys(updateData).length === 0) {
      throw new Error('Update data cannot be empty.');
    }

    await this.userRepository.update(userId, updateData);
    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!updatedUser) {
      throw new Error('User not found after update.');
    }

    updatedUser.postCount = updatedUser.posts ? updatedUser.posts.length : 0;
    return this.userRepository.save(updatedUser);
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    await this.userRepository.update({ email }, { password: newPassword });
  }

  transformToDto(user: User): UserDto {
    const userDto: UserDto = {
      ...user,
      postCount: user.postCount,
    };
    return userDto;
  }

  async deleteUser(userId: number): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required for deleting user.');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found.');
    }

    await this.commentRepository.delete({ author: { id: userId } });
    
    await this.postRepository.delete({ author: { id: userId } });

    await this.userRepository.delete(userId);
  }
}
