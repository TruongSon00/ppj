import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from '@config/config.service';
import { UserService } from './user.service';
import { UserController } from '@components/user/user.controller';
import { UserCronService } from './user.cron.service';

@Global()
@Module({
  imports: [ConfigModule],
  exports: [
    'USER_SERVICE_CLIENT',
    UserCronService,
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
  ],
  providers: [
    ConfigService,
    {
      provide: 'USER_SERVICE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const userServiceOptions = configService.get('userService');
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    UserCronService,
  ],
  controllers: [UserController],
})
export class UserModule {}
