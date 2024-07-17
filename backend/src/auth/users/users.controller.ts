import { Controller, Get, Put, Req, Body, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../../database/entities/user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../../dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: Request): Promise<User> {
    const token = req.headers.authorization.split(' ')[1];
    return await this.authService.validateToken(token);
  }

  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(
    @Req() req: Request,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    const token = req.headers.authorization.split(' ')[1];
    const user = await this.authService.validateToken(token);
    return await this.usersService.updateUserInfo(user.id, updateData);
  }
}
