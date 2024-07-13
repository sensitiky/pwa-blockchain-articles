import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { CreateUserDto } from './dto/user.dto';
import { User } from './database/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.databaseService.createUser(createUserDto);
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    return await this.databaseService.getUser(id);
  }
}
