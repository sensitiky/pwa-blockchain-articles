import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('users')
export class UsersController {
  constructor(private readonly dbService: DatabaseService) {}

  @Post('register')
  async createUser(@Body() userData: any) {
    const existingUser = await this.dbService.findUserByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    await this.dbService.createUser(userData);
    return { message: 'Usuario registrado exitosamente' };
  }
}
