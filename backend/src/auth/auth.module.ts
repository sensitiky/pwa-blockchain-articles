import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
	imports:[ConfigModule],
	inject:[ConfigService],
	useFactory: async (configService: ConfigService) =>({
	secret: configService.get<string>('JWT_SECRET'),
	signOptions: { expiresIn: '60m' },
    }),
   }),
  ],
  providers: [AuthService, UsersService, GoogleStrategy, JwtStrategy],
  controllers: [AuthController, UsersController],
  exports: [AuthService, UsersService]
})
export class AuthModule {}
