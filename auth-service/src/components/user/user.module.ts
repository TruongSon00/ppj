import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user.service';
import { ConfigService } from '@config/config.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [ConfigModule, HttpModule],
  providers: [
    ConfigService,
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
  ],
  controllers: [],
})
export class UserModule {}
