import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { OAuth2Client } from 'google-auth-library';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../dto/user.dto';
import { User } from '../database/entities/user.entity';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  private readonly mailer: nodemailer.Transporter;
  private verificationCodes: Map<string, string> = new Map();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    );

    this.mailer = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async validateUser(
    usuario: string,
    contrasena: string,
  ): Promise<User | null> {
    const user = await this.usersService.findOne(usuario);
    if (user && (await bcrypt.compare(contrasena, user.contrasena))) {
      return user;
    }
    return null;
  }

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const existingUsername = await this.usersService.findOne(
      createUserDto.usuario,
    );
    if (existingUsername) {
      throw new ConflictException('Username already in use');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.contrasena, salt);
    createUserDto.contrasena = hashedPassword;

    return this.usersService.create(createUserDto);
  }

  async validateGoogleToken(token: string): Promise<User> {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;

    if (!email) {
      throw new UnauthorizedException();
    }

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.create({
        usuario: payload?.sub,
        email,
        contrasena: '',
        firstName: payload?.given_name,
        lastName: payload?.family_name,
        nombre: '',
        code: '',
      });
    }

    return user;
  }

  async sendVerificationCode(email: string): Promise<void> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.verificationCodes.set(email, code);

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${code}`,
    };

    await this.mailer.sendMail(mailOptions);
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    const storedCode = this.verificationCodes.get(email);
    if (storedCode === code) {
      this.verificationCodes.delete(email);
      return true;
    }
    return false;
  }

  async sendForgotPasswordEmail(email: string): Promise<void> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.verificationCodes.set(email, code);

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${code}`,
    };

    await this.mailer.sendMail(mailOptions);
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await this.usersService.updatePassword(email, hashedPassword);
  }
  
  async verifyResetCode(email: string, code: string): Promise<boolean> {
    return this.verifyCode(email, code);
  }

  // Método para validar el token JWT y obtener el usuario
  async validateToken(token: string): Promise<User> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findOne(decoded.userId);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
