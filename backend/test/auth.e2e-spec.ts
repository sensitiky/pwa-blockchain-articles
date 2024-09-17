import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/services/auth.service';
import { UsersService } from '../src/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { MetricService } from '../src/services/metric.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UserDto } from '../src/dto/user.dto';
import { User } from '../src/entities/user.entity';

jest.mock('nodemailer');
jest.mock('google-auth-library');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let metricService: MetricService;
  let googleClient: OAuth2Client;
  let mailer: nodemailer.Transporter;
  let mockMailer: { sendMail: jest.Mock };

  beforeEach(async () => {
    mockMailer = { sendMail: jest.fn().mockResolvedValue(null) };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            updatePassword: jest.fn(),
            transformToDto: jest.fn(),
            findByFacebookId: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: MetricService,
          useValue: {
            trackEvent: jest.fn(),
          },
        },
        {
          provide: 'MAILER',
          useValue: mockMailer,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    metricService = module.get<MetricService>(MetricService);
    googleClient = new OAuth2Client();
    mailer = module.get('MAILER');
  });

  describe('validateUser', () => {
    it('should return user dto if email and password are valid', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user: User = {
        id: 1,
        email,
        password: await bcrypt.hash(password, 10),
        user: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: '',
        lastLogin: new Date(),
        lastActivity: new Date(),
        facebookId: null,
        posts: [],
        comments: [],
        favorites: [],
        postCount: 0,
      };
      const userDto: UserDto = { id: 1, email, user: 'testuser', postCount: 0 };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(usersService, 'transformToDto').mockReturnValue(userDto);

      const result = await authService.validateUser(email, password);
      expect(result).toEqual(userDto);
    });

    it('should return null if email or password are invalid', async () => {
      const email = 'test@example.com';
      const password = 'password';

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      const result = await authService.validateUser(email, password);
      expect(result).toBeNull();
    });
  });

  describe('registerUser', () => {
    it('should throw ConflictException if email is already in use', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        user: 'testuser',
        password: 'Password1!',
        firstName: 'Test',
        lastName: 'User',
        nombre: '',
        code: '',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue({} as User);

      await expect(authService.registerUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if username is already in use', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        user: 'testuser',
        password: 'Password1!',
        firstName: 'Test',
        lastName: 'User',
        nombre: '',
        code: '',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'findOne').mockResolvedValue({} as User);

      await expect(authService.registerUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if password does not meet criteria', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        user: 'testuser',
        password: 'pass',
        firstName: 'Test',
        lastName: 'User',
        nombre: '',
        code: '',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      await expect(authService.registerUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create a new user and return user dto', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        user: 'testuser',
        password: 'Password1!',
        firstName: 'Test',
        lastName: 'User',
        nombre: '',
        code: '',
      };
      const newUser: User = {
        id: 1,
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, 10),
        user: createUserDto.user,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        role: '',
        lastLogin: new Date(),
        lastActivity: new Date(),
        facebookId: null,
        posts: [],
        comments: [],
        favorites: [],
        postCount: 0,
      };
      const userDto: UserDto = {
        id: 1,
        email: createUserDto.email,
        user: createUserDto.user,
        postCount: 0,
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(newUser);
      jest.spyOn(usersService, 'transformToDto').mockReturnValue(userDto);
      jest.spyOn(metricService, 'trackEvent').mockResolvedValue(null);

      const result = await authService.registerUser(createUserDto);
      expect(result).toEqual(userDto);
    });
  });

  describe('validateGoogleToken', () => {
    it('should return user dto if Google token is valid', async () => {
      const token = 'valid-token';
      const payload = {
        email: 'test@example.com',
        sub: '123',
        given_name: 'Test',
        family_name: 'User',
      };
      const user: User = {
        id: 1,
        email: payload.email,
        password: 'hashedpassword',
        user: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: '',
        lastLogin: new Date(),
        lastActivity: new Date(),
        facebookId: null,
        posts: [],
        comments: [],
        favorites: [],
        postCount: 0,
      };
      const userDto: UserDto = {
        id: 1,
        email: payload.email,
        user: 'testuser',
        postCount: 0,
      };

      const ticket = {
        getPayload: jest.fn().mockReturnValue(payload),
      };

      jest
        .spyOn(googleClient, 'verifyIdToken')
        .mockResolvedValue(ticket as never);
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(usersService, 'create').mockResolvedValue(user);
      jest.spyOn(usersService, 'transformToDto').mockReturnValue(userDto);

      const result = await authService.validateGoogleToken(token);
      expect(result).toEqual(userDto);
    });

    it('should throw UnauthorizedException if Google token is invalid', async () => {
      const token = 'invalid-token';

      jest
        .spyOn(googleClient, 'verifyIdToken')
        .mockRejectedValue(new Error('Invalid token') as never);

      await expect(authService.validateGoogleToken(token)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('sendVerificationCode', () => {
    it('should send a verification code to the given email', async () => {
      const email = 'test@example.com';
      const code = '123456';

      jest.spyOn(global.Math, 'random').mockReturnValue(0.123456);

      await authService.sendVerificationCode(email);

      expect(mailer.sendMail).toHaveBeenCalledWith({
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Verification Code',
        text: `Your verification code is: ${code}`,
      });
    });
  });

  describe('verifyCode', () => {
    it('should return true if the code is valid', async () => {
      const email = 'test@example.com';
      const code = '123456';

      authService['verificationCodes'].set(email, code);

      const result = await authService.verifyCode(email, code);
      expect(result).toBe(true);
    });

    it('should return false if the code is invalid', async () => {
      const email = 'test@example.com';
      const code = '123456';

      authService['verificationCodes'].set(email, '654321');

      const result = await authService.verifyCode(email, code);
      expect(result).toBe(false);
    });
  });

  describe('validateToken', () => {
    it('should return user dto if token is valid', async () => {
      const token = 'valid-token';
      const decoded = { userId: 1 };
      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        user: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: '',
        lastLogin: new Date(),
        lastActivity: new Date(),
        facebookId: null,
        posts: [],
        comments: [],
        favorites: [],
        postCount: 0,
      };
      const userDto: UserDto = {
        id: 1,
        email: 'test@example.com',
        user: 'testuser',
        postCount: 0,
      };

      jest.spyOn(jwtService, 'verify').mockReturnValue(decoded);
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      jest.spyOn(usersService, 'transformToDto').mockReturnValue(userDto);

      const result = await authService.validateToken(token);
      expect(result).toEqual(userDto);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const token = 'invalid-token';

      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.validateToken(token)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
