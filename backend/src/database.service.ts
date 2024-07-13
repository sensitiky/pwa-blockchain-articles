import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './database/entities/user.entity';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.contrasena) {
      throw new BadRequestException('contrasena is required');
    }
    
    const salt = await bcrypt.genSalt();
    const hashedcontrasena = await bcrypt.hash(createUserDto.contrasena, salt);

    const newUser = this.userRepository.create({
      ...createUserDto,
      contrasena: hashedcontrasena,
    });

    return await this.userRepository.save(newUser);
  }

  async getUser(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }
}
