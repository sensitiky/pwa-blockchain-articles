import { Controller, Get, Put, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UpdateUserDto } from 'src/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
  ): Promise<User> {
    if (file) {
      updateData.avatar = `/uploads/avatars/${file.filename}`;
    }
    return await this.usersService.updateUserInfo(user.id, updateData);
  }
}
