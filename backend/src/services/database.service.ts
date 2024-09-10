import {
  Injectable,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/user.dto';
import * as NodeCache from 'node-cache';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly cache = new NodeCache({ stdTTL: 300 }); // 5 minutes TTL

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

    try {
      // Check cache first
      const cachedUser = this.cache.get<User>(username);
      if (cachedUser) {
        this.logger.log(`User found in cache: ${username}`);
        return cachedUser;
      }

      const user = await this.userRepository.findOne({
        where: { user: username },
        select: ['id', 'user', 'email', 'role'], // Select only necessary fields
      });

      if (user) {
        this.logger.log(`User found: ${username}`);
        this.cache.set(username, user);
      } else {
        this.logger.warn(`User not found: ${username}`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Error finding user: ${error.message}`);
      throw new InternalServerErrorException('Error finding user');
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user: ${createUserDto.user}`);
    if (!createUserDto.password) {
      this.logger.warn('Contraseña is required');
      throw new BadRequestException('Contraseña is required');
    }

    try {
      const salt = await bcrypt.genSalt();
      const hashedcontrasena = await bcrypt.hash(createUserDto.password, salt);

      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedcontrasena,
      });

      const savedUser = await this.userRepository.save(newUser);
      this.logger.log(`User created: ${createUserDto.user}`);

      // Cache the new user
      this.cache.set(savedUser.user, savedUser);

      return savedUser;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async getUser(id: number): Promise<User> {
    this.logger.log(`Getting user by id: ${id}`);

    try {
      // Check cache first
      const cachedUser = this.cache.get<User>(`user_${id}`);
      if (cachedUser) {
        this.logger.log(`User found in cache: ${id}`);
        return cachedUser;
      }

      const user = await this.userRepository.findOne({
        where: { id },
        select: ['id', 'user', 'email', 'role'], // Select only necessary fields
      });

      if (user) {
        this.logger.log(`User found: ${id}`);
        this.cache.set(`user_${id}`, user);
      } else {
        this.logger.warn(`User not found: ${id}`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Error getting user: ${error.message}`);
      throw new InternalServerErrorException('Error getting user');
    }
  }
}
