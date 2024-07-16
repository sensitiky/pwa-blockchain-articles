import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from './database/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: Request): Promise<User> {
    const token = req.headers.authorization.split(' ')[1];
    return await this.authService.validateToken(token);
  }
}
