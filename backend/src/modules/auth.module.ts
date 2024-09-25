import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { DatabaseModule } from './database.module';
import { UsersService } from '../services/users.service';
import { UsersController } from '../controllers/users.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from '../strategies/google.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { MetricModule } from './metric.module';
import { UsersModule } from './user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    PassportModule,
    CacheModule.register(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '360m' },
      }),
    }),
    forwardRef(() => MetricModule),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, UsersService, GoogleStrategy, JwtStrategy],
  controllers: [AuthController, UsersController],
  exports: [AuthService, UsersService],
})
export class AuthModule {}
