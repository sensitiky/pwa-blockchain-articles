import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './database/entities/user.entity';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserByUser(usuario: string): Promise<User | undefined> {
    this.logger.log(`Finding user by usuario: ${usuario}`);
    if (!usuario) {
      this.logger.warn('User not found');
      throw new BadRequestException('User not found');
    }
    const user = await this.userRepository.findOne({ where: { usuario } });
    if (user) {
      this.logger.log(`User found: ${usuario}`);
    } else {
      this.logger.warn(`User not found: ${usuario}`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user: ${createUserDto.usuario}`);
    if (!createUserDto.contrasena) {
      this.logger.warn('Contraseña is required');
      throw new BadRequestException('Contraseña is required');
    }
    
    const salt = await bcrypt.genSalt();
    const hashedcontrasena = await bcrypt.hash(createUserDto.contrasena, salt);

    const newUser = this.userRepository.create({
      ...createUserDto,
      contrasena: hashedcontrasena,
    });

    const savedUser = await this.userRepository.save(newUser);
    this.logger.log(`User created: ${createUserDto.usuario}`);
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
