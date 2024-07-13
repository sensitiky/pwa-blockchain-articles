import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../database/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }): Promise<User | null> {
    return await this.authService.validateUser(loginDto.email, loginDto.password);
  }
}
