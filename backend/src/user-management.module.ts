import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { UserManagementService } from './user-management.service';
import { UsersModule } from './auth/users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register(),
    UsersModule,
    ClientsModule.registerAsync([
      {
        name: 'DATABASE_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('DATABASE_HOST', 'localhost'),
            port: configService.get('DATABASE_PORT', 3001),
            ssl:
              configService.get('DB_SLL') === 'true'
                ? { rejectUnauthorized: false }
                : undefined,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [UserManagementService],
  exports: [UserManagementService, ClientsModule, UsersModule],
})
export class UserManagementModule {}
