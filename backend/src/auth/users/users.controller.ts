import { Controller, Get, Put, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UpdateUserDto, UserDto } from 'src/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
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
  ): Promise<UserDto> {
    if (file) {
      updateData.avatar = `/uploads/avatars/${file.filename}`;
    }
    const updatedUser = await this.usersService.updateUserInfo(user.id, updateData);
    const userDto = this.usersService.transformToDto(updatedUser);
    return userDto;
  }
}
