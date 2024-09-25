import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UsersService } from '../services/users.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UpdateUserDto, UserDto } from '../dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { AuthService } from 'src/services/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User): Promise<UserDto> {
    const userDto = this.usersService.transformToDto(user);
    return userDto;
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateData: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string; token: string; user: UserDto }> {
    if (file) {
      updateData.avatar = `/uploads/avatars/${file.filename}`;
    }
    const newToken = await this.authService.updateUserProfile(
      user.id,
      updateData,
    );
    const updatedUser = await this.usersService.findByEmailOrUsername(
      user.email || user.user,
    );
    const userDto = this.usersService.transformToDto(updatedUser);
    return {
      message: 'Profile updated successfully',
      token: newToken,
      user: userDto,
    };
  }

  @Get('me/posts')
  @UseGuards(JwtAuthGuard)
  async getUserPosts(@CurrentUser() user: User): Promise<Post[]> {
    return this.usersService.findUserPosts(user.id);
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.usersService.findOneById(id);
  }
  @Get(':id/posts')
  async getUserPostsById(@Param('id') id: number): Promise<Post[]> {
    return this.usersService.findUserPosts(id);
  }
  @Get(':id/favorites')
  async getUserFavorites(@Param('id') id: number): Promise<Post[]> {
    return this.usersService.findUserFavorites(id);
  }
  @Delete('me')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@CurrentUser() user: User): Promise<{ message: string }> {
    await this.usersService.deleteUser(user.id);
    return { message: 'User deleted successfully' };
  }

  @Delete(':userId/favorites/:postId')
  async removeFavorite(
    @Param('userId') userId: number,
    @Param('postId') postId: number,
  ) {
    return this.usersService.removeUserFavorite(userId, postId);
  }
}
