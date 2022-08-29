import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRolePermissionSettingEntity } from '@entities/user-role-permission-setting/user-role-permission-setting.entity';
import { Module } from '@nestjs/common';
import { UserRoleController } from './user-role.controller';
import { UserRolePermissionSettingRepository } from '@repositories/user-role-permission-setting.repository';
import { UserRoleService } from '@components/user-role/user-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRolePermissionSettingEntity])],
  exports: [
    {
      provide: 'UserRoleServiceInterface',
      useClass: UserRoleService,
    },
    {
      provide: 'UserRolePermissionSettingRepositoryInterface',
      useClass: UserRolePermissionSettingRepository,
    },
  ],
  providers: [
    {
      provide: 'UserRolePermissionSettingRepositoryInterface',
      useClass: UserRolePermissionSettingRepository,
    },
    {
      provide: 'UserRoleServiceInterface',
      useClass: UserRoleService,
    },
  ],
  controllers: [UserRoleController],
})
export class UserRoleModule {}
