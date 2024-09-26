import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../services/users.service';
import { OAuth2Client } from 'google-auth-library';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UserDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { MetricService } from './metric.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private googleClient: OAuth2Client;
  private readonly mailer: nodemailer.Transporter;
  private verificationCodes: Map<string, string> = new Map();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly metricService: MetricService,
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

  private validatePassword(password: string): boolean {
    const lengthCriteria = password.length >= 8;
    const uppercaseCriteria = /[A-Z]/.test(password);
    const numberOrSymbolCriteria = /[0-9!@#$%^&*]/.test(password);

    return lengthCriteria && uppercaseCriteria && numberOrSymbolCriteria;
  }

  async validateUser(identifier: string, password: string): Promise<any> {
    this.logger.log(`Validating user: ${identifier}`);
    const user = await this.usersService.findByEmailOrUsername(identifier);
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      this.logger.log(`Password valid: ${isPasswordValid}`);
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async checkUser(createuserDto: CreateUserDto): Promise<void> {
    const existingUser = await this.usersService.findByEmail(
      createuserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const existingUsername = await this.usersService.findOne(
      createuserDto.user,
    );
    if (existingUsername) {
      throw new ConflictException('Username already in use');
    }
  }

  async registerUser(createUserDto: CreateUserDto): Promise<UserDto> {
    await this.checkUser(createUserDto);

    if (!this.validatePassword(createUserDto.password)) {
      throw new ConflictException('Password does not meet the criteria');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashedPassword;

    const newUser = await this.usersService.create(createUserDto);
    newUser.postCount = newUser.posts ? newUser.posts.length : 0;

    //Log the event with Mixpanel
    await this.metricService.trackEvent('User Registered', {
      distinct_id: newUser.id,
      email: newUser.email,
    });

    //Track the event with Mixpanel
    await this.metricService.trackEvent('User Registered', {
      distinct_id: newUser.id,
      email: newUser.email,
    });

    return this.usersService.transformToDto(newUser);
  }

  async validateGoogleToken(token: string): Promise<UserDto> {
    console.log(`Validating Google token: ${token}`);

    let ticket;
    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      console.error(`Error verifying Google token: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }

    const payload = ticket.getPayload();
    console.log('Google token payload:', payload);

    const email = payload?.email;

    if (!email) {
      throw new UnauthorizedException('Email not found in token payload');
    }

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.create({
        user: payload?.name,
        email,
        password: '',
        firstName: payload?.given_name,
        lastName: payload?.family_name,
        nombre: payload?.name,
        avatar: payload?.picture,
        verificationCode: '',
      });
      user.postCount = user.posts ? user.posts.length : 0;
    } else {
      user.postCount = user.posts ? user.posts.length : 0;
    }

    return this.usersService.transformToDto(user);
  }

  async findOrCreateFacebookUser(
    facebookId: string,
    email: string,
    name: string,
  ): Promise<UserDto> {
    let user = await this.usersService.findByFacebookId(facebookId);
    if (!user) {
      user = await this.usersService.findByEmail(email);
      if (!user) {
        const [firstName, lastName] = name.split(' ');
        const newUser: CreateUserDto = {
          facebookId,
          email,
          firstName,
          lastName,
          nombre: firstName + ' ' + lastName,
          user: email,
          password: '',
          verificationCode: '',
        };
        user = await this.usersService.create(newUser);
        user.postCount = user.posts ? user.posts.length : 0;
      } else {
        user.facebookId = facebookId;
        await this.usersService.update(user);
      }
    }
    return this.usersService.transformToDto(user);
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

  async verifyCode(email: string, verificationCode: string): Promise<boolean> {
    console.log(`Verifying code for email: ${email}`);

    const storedCode = this.verificationCodes.get(email);
    console.log(`Stored code: ${storedCode}`);
    console.log(`Received code ${verificationCode}`);

    if (storedCode === verificationCode) {
      console.log(`Code verified successfully for email: ${email}`);
      return true;
    }

    console.log(`Code verification failed for email: ${email}`);
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

  async updatePassword(email: string, newPassword: string): Promise<string> {
    console.log('updatePassword called with email:', email);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log('Hashed password:', hashedPassword);
    await this.usersService.updatePassword(email, hashedPassword);

    const user = await this.usersService.findByEmail(email);
    console.log('User found:', user);
    return this.generateJwtToken(this.usersService.transformToDto(user));
  }

  async updateUserProfile(
    userId: number,
    updatedFields: Partial<User>,
  ): Promise<string> {
    console.log(
      'updateUserProfile called with userId:',
      userId,
      'updatedFields:',
      updatedFields,
    );
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      console.error('User not found');
      throw new Error('User not found');
    }

    if (updatedFields.password) {
      const salt = await bcrypt.genSalt();
      updatedFields.password = await bcrypt.hash(updatedFields.password, salt);
      console.log('Hashed password:', updatedFields.password);
    }

    Object.assign(user, updatedFields);
    await this.usersService.update(user);

    const updatedUser = await this.usersService.findOne(user.email);
    console.log('Updated user:', updatedUser);
    return this.generateJwtToken(this.usersService.transformToDto(updatedUser));
  }

  async verifyResetCode(email: string, code: string): Promise<boolean> {
    return this.verifyCode(email, code);
  }

  async validateToken(token: string): Promise<UserDto> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findOne(decoded.userId);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      return this.usersService.transformToDto(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  generateJwtToken(user: UserDto): string {
    const payload = { userId: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  public deleteVerificationCode(email: string): void {
    this.verificationCodes.delete(email);
  }

  async googleLogin(req) {
    if (!req.user) {
      return { message: 'No user from Google', token: null };
    }

    const { email, firstName, lastName, picture } = req.user.user;

    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.usersService.create({
        email,
        firstName,
        lastName,
        avatar: picture,
        nombre: '',
        user: '',
        password: '',
        verificationCode: '',
      });
    }

    const userDto = this.usersService.transformToDto(user);
    const token = this.generateJwtToken(userDto);

    return {
      message: 'User information from Google',
      user: userDto,
      token,
    };
  }
}
