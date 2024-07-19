import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UpdateUserDto } from 'src/dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateData: UpdateUserDto,
  ): Promise<User> {
    console.log('Updating user with ID:', user.id);
    return await this.usersService.updateUserInfo(user.id, updateData);
  }
}
