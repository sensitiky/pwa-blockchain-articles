import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    await this.userRepository.update({ email }, { contrasena: newPassword });
  }

  async updateUserInfo(userId: number, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(userId, updateData);
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
