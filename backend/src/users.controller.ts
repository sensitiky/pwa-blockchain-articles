import {
  Controller,
  Post,
  Body,
  ConflictException,
  UnauthorizedException,
  Req,
  Get,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DatabaseService } from './database.service';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { User } from './user.interface';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createUser(
    @Body() userData: CreateUserDto,
  ): Promise<{ message: string; user: User }> {
    console.log('Register attempt:', userData);

    const existingUser = await this.dbService.findUserByEmail(userData.email);
    if (existingUser) {
      console.log('User already exists');
      throw new ConflictException('El usuario ya existe');
    }

    const newUser = await this.dbService.createUser(userData);
    console.log('User created:', newUser);
    return { message: 'Usuario registrado exitosamente', user: newUser };
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async loginUser(
    @Body() loginData: LoginUserDto,
  ): Promise<{ message: string; user: User; token: string }> {
    console.log('Login attempt:', loginData);

    const user = await this.dbService.findUserByUsername(loginData.username);
    if (!user) {
      console.log('User not found');
      throw new UnauthorizedException('Credenciales inválidas');
    }

    console.log('User found:', user);
    console.log('Comparing passwords:', loginData.password, user.password);

    const passwordsMatch = await compare(loginData.password, user.password);
    console.log('Passwords match:', passwordsMatch);

    if (!passwordsMatch) {
      console.log('Passwords do not match');
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.jwtService.sign({ username: user.username });
    console.log('Passwords match, generating token', token);
    return { message: 'Usuario autenticado exitosamente', user, token };
  }

  @Get('session')
  async sessionUser(@Req() req): Promise<{ user: User }> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.dbService.findUserByUsername(decoded.username);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      return { user };
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
