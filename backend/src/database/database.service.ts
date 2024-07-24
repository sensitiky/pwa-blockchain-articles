import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../auth/users/user.entity';
import { CreateUserDto } from '../auth/users/user.dto';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserByUser(username: string): Promise<User | undefined> {
    this.logger.log(`Finding user by username: ${username}`);
    if (!username) {
      this.logger.warn('Username not provided');
      throw new BadRequestException('Username not provided');
    }
    const user = await this.userRepository.findOne({
      where: { user: username },
    });
    if (user) {
      this.logger.log(`User found: ${user}`);
    } else {
      this.logger.warn(`User not found: ${username}`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user: ${createUserDto.user}`);
    if (!createUserDto.password) {
      this.logger.warn('Contraseña is required');
      throw new BadRequestException('Contraseña is required');
    }

    const salt = await bcrypt.genSalt();
    const hashedcontrasena = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedcontrasena,
    });

    const savedUser = await this.userRepository.save(newUser);
    this.logger.log(`User created: ${createUserDto.user}`);
    return savedUser;
  }

  async getUser(id: number): Promise<User> {
    this.logger.log(`Getting user by id: ${id}`);
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      this.logger.log(`User found: ${id}`);
    } else {
      this.logger.warn(`User not found: ${id}`);
    }
    return user;
  }
}
