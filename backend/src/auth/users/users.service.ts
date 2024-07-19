import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from '../../dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
  async findByFacebookId(facebookId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { facebookId } });
  }

  async update(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    await this.userRepository.update({ email }, { contrasena: newPassword });
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

    return updatedUser;
  }
}
