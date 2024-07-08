import { Controller, Post, Body, ConflictException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { User } from './user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly dbService: DatabaseService) {}

  @Post('register')
  async createUser(@Body() userData: User) {
    const existingUser = await this.dbService.findUserByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    await this.dbService.createUser(userData);
    return { message: 'Usuario registrado exitosamente' };
  }

  @Post('login')
  async loginUser(@Body() loginData: { username: string; password: string }) {
    const user = await this.dbService.findUserByUsername(loginData.username);
    if (!user || user.password !== loginData.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Aquí podrías generar y devolver un token JWT u otra forma de autenticación
    return { message: 'Usuario autenticado exitosamente', user };
  }
}
