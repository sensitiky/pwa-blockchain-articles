import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { UserManagementService } from './user-management.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register(),
    ClientsModule.registerAsync([
      {
        name: 'DATABASE_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          console.log('DATABASE_HOST:', configService.get('DATABASE_HOST'));
          console.log('DATABASE_PORT:', configService.get('DATABASE_PORT'));
          console.log('DB_SSL:', configService.get('DB_SSL'));
          
          return {
            transport: Transport.TCP,
            options: {
              host: configService.get('DATABASE_HOST'),
              port: configService.get('DATABASE_PORT'),
              timeout: 5000,
              ssl:
                configService.get('DB_SSL') === 'true'
                  ? { rejectUnauthorized: false }
                  : undefined,
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [UserManagementService],
  exports: [UserManagementService, ClientsModule],
})
export class UserManagementModule {}
