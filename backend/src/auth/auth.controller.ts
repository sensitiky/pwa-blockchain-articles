import {
  Controller,
  Post,
  Res,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDto } from '../dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('contrasena') contrasena: string,
    @Res() res: Response,
  ) {
    const user = await this.authService.validateUser(email, contrasena);
    if (!user) {
      throw new UnauthorizedException();
    }

    const jwt = await this.authService.generateJwtToken(user);

    res.cookie('jwt', jwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return res.send({ user });
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.authService.registerUser(createUserDto);
    const jwt = await this.authService.generateJwtToken(user);

    res.cookie('jwt', jwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return res.send({ user });
  }

  @Post('google')
  async googleLogin(@Body('token') token: string, @Res() res: Response) {
    const user = await this.authService.validateGoogleToken(token);
    if (!user) {
      throw new UnauthorizedException();
    }

    const jwt = await this.authService.generateJwtToken(user);

    res.cookie('jwt', jwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return res.send({ user });
  }
}
