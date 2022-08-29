import { UserModule } from '@components/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '../../constant/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '@components/user/user.service';
import { UserEntity } from '@entities/user/user.entity';
import { UserRepository } from '@repositories/user.repository';
import { HttpModule } from '@nestjs/axios';
import { UserRoleModule } from '../user-role/user-role.module';
import { UserRoleService } from '@components/user-role/user-role.service';
import { ConfigService } from '@config/config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'users',
      session: false,
    }),
    JwtModule.register({
      secret: jwtConstants.acessTokenSecret,
    }),
    HttpModule,
    UserModule,
    UserRoleModule,
  ],
  providers: [
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService,
    },
    {
      provide: 'UserRoleInterface',
      useClass: UserRoleService,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'ConfigServiceInterface',
      useClass: ConfigService,
    },
  ],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
