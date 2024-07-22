import { Controller, Post, Body, Res, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import axios from 'axios';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './users/user.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: { email: string; password: string },
    @Res() res: Response,
  ): Promise<void> {
    this.logger.log(`Login attempt for user: ${loginDto.email}`);
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (user) {
      const token = this.authService.generateJwtToken(user);
      this.logger.log(`Login successful for user: ${loginDto.email}`);
      res.status(200).json({ message: 'Login successful', token, user });
    } else {
      this.logger.warn(`Login failed for user: ${loginDto.email}`);
      res.status(401).json({ message: 'Login failed' });
    }
  }
  //
  @Post('facebook')
  async facebookLogin(
    @Body() body: { accessToken: string },
    @Res() res: Response,
  ): Promise<void> {
    // Asegúrate de que el secreto se está obteniendo correctamente
    const appSecret = this.configService.get<string>('FACEBOOK_CLIENT_SECRET');
    if (!appSecret) {
      this.logger.error('FACEBOOK_CLIENT_SECRET is not defined');
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    const appSecretProof = crypto
      .createHmac('sha256', appSecret)
      .update(body.accessToken)
      .digest('hex');

    try {
      const facebookResponse = await axios.get(
        `https://graph.facebook.com/me?access_token=${body.accessToken}&appsecret_proof=${appSecretProof}&fields=id,name,email`,
      );

      const { id, email, name } = facebookResponse.data;
      const user = await this.authService.findOrCreateFacebookUser(
        id,
        email,
        name,
      );
      const token = this.authService.generateJwtToken(user);
      res
        .status(200)
        .json({ message: 'Facebook login successful', token, user });
    } catch (error) {
      this.logger.error(`Error with Facebook login: ${error.message}`);
      if (axios.isAxiosError(error)) {
        const axiosError = error.response?.data;
        this.logger.error(`Axios error: ${JSON.stringify(axiosError)}`);
      }
      res.status(401).json({ message: 'Facebook login failed' });
    }
  }
  //

  @Post('forgot-password')
  async forgotPassword(
    @Body() body: { email: string },
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.authService.sendForgotPasswordEmail(body.email);
      res
        .status(200)
        .json({ message: 'Password reset email sent successfully' });
    } catch (error) {
      this.logger.error(`Error sending password reset email: ${error.message}`);
      res.status(500).json({ message: 'Failed to send password reset email' });
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { email: string; code: string; newPassword: string },
    @Res() res: Response,
  ): Promise<void> {
    try {
      const isVerified = await this.authService.verifyCode(
        body.email,
        body.code,
      );
      if (!isVerified) {
        res.status(400).json({ message: 'Invalid verification code' });
        return;
      }
      await this.authService.updatePassword(body.email, body.newPassword);
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      this.logger.error(`Error resetting password: ${error.message}`);
      res.status(500).json({ message: 'Failed to reset password' });
    }
  }

  @Post('register')
  async register(
    @Body() registerDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const isVerified = await this.authService.verifyCode(
        registerDto.email,
        registerDto.code,
      );
      if (!isVerified) {
        res.status(400).json({ message: 'Invalid verification code' });
        return;
      }
      const userDto = await this.authService.registerUser(registerDto);
      this.authService.deleteVerificationCode(registerDto.email);
      res
        .status(200)
        .json({ message: 'Registration successful', user: userDto });
    } catch (error) {
      this.logger.error(`Error registering user: ${error.message}`);
      res.status(500).json({ message: 'Failed to register user' });
    }
  }

  @Post('send-verification-code')
  async sendVerificationCode(
    @Body() body: { email: string },
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.authService.sendVerificationCode(body.email);
      res.status(200).json({ message: 'Verification code sent successfully' });
    } catch (error) {
      this.logger.error(`Error sending verification code: ${error.message}`);
      res.status(500).json({ message: 'Failed to send verification code' });
    }
  }

  @Post('verify-code')
  async verifyCode(
    @Body() body: { email: string; code: string },
    @Res() res: Response,
  ): Promise<void> {
    this.logger.log(`Verifying code for email: ${body.email}`);

    try {
      const isVerified = await this.authService.verifyCode(
        body.email,
        body.code,
      );

      if (isVerified) {
        this.logger.log(
          `Code verification successful for email: ${body.email}`,
        );
        res.status(200).json({ message: 'Code verification successful' });
      } else {
        this.logger.warn(`Invalid verification code for email: ${body.email}`);
        res.status(400).json({ message: 'Invalid verification code' });
      }
    } catch (error) {
      this.logger.error(
        `Error verifying code for email: ${body.email} - ${error.message}`,
      );
      res.status(500).json({ message: 'Failed to verify code' });
    }
  }

  @Post('google')
  async googleLogin(
    @Body() body: { token: string },
    @Res() res: Response,
  ): Promise<void> {
    try {
      const userDto = await this.authService.validateGoogleToken(body.token);
      res
        .status(200)
        .json({ message: 'Google login successful', user: userDto });
    } catch (error) {
      this.logger.error(`Error with Google login: ${error.message}`);
      res.status(401).json({ message: 'Google login failed' });
    }
  }
}
