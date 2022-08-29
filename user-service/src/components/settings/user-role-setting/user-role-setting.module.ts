import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';
import { Module } from '@nestjs/common';
import { UserRoleSettingController } from '@components/settings/user-role-setting/user-role-setting.controller';
import { UserRoleSettingService } from '@components/settings/user-role-setting/user-role-setting.service';
import { UserRoleSettingRepository } from '@repositories/user-role-setting.repository';
import { UserRolePermissionSettingRepository } from '@repositories/user-role-permission-setting.repository';
import { UserRolePermissionSettingEntity } from '@entities/user-role-permission-setting/user-role-permission-setting.entity';
import { WarehouseModule } from '@components/warehouse/warehouse.module';
import { WarehouseService } from '@components/warehouse/warehouse.service';
import { UserModule } from '@components/user/user.module';
import { DepartmentSettingRepository } from '@repositories/deparment.repository';
import { UserDepartmentRepository } from '@repositories/user-department.repository';
import { UserRoleRepository } from '@repositories/user-role.repository';
import { DepartmentSetting } from '@entities/department-setting/department-setting.entity';
import { UserDepartment } from '@entities/user-department/user-department.entity';
import { UserRole } from '@entities/user-role/user-role.entity';
import { PermissionSettingRepository } from '@repositories/permission-setting.repository';
import { DepartmentPermissionSettingRepository } from '@repositories/department-permission-setting.repository';
import { PermissionSettingEntity } from '@entities/permission-setting/permission-setting.entity';
import { DepartmentPermissionSettingEntity } from '@entities/department-permission-setting/department-permission-setting.entity';
import { GroupPermissionSettingRepository } from '@repositories/group-permission-setting.repository';
import { GroupPermissionSettingEntity } from '@entities/group-permission-setting/group-permission-setting.entity';
import { UserRepository } from '@repositories/user.repository';
import { User } from '@entities/user/user.entity';
import { UserRoleSettingCronService } from './user-role-setting.cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRoleSetting,
      UserRolePermissionSettingEntity,
      DepartmentSetting,
      UserDepartment,
      UserRole,
      PermissionSettingEntity,
      DepartmentPermissionSettingEntity,
      GroupPermissionSettingEntity,
      User,
    ]),
    WarehouseModule,
  ],
  exports: [
    {
      provide: 'DepartmentSettingRepositoryInterface',
      useClass: DepartmentSettingRepository,
    },
    {
      provide: 'UserRoleSettingServiceInterface',
      useClass: UserRoleSettingService,
    },
    {
      provide: 'UserRoleSettingRepositoryInterface',
      useClass: UserRoleSettingRepository,
    },
    {
      provide: 'UserRolePermissionSettingRepositoryInterface',
      useClass: UserRolePermissionSettingRepository,
    },
    {
      provide: 'WarehouseServiceInterface',
      useClass: WarehouseService,
    },
    {
      provide: 'UserDepartmentRepositoryInterface',
      useClass: UserDepartmentRepository,
    },
    {
      provide: 'UserRoleRepositoryInterface',
      useClass: UserRoleRepository,
    },
    {
      provide: 'PermissionSettingRepositoryInterface',
      useClass: PermissionSettingRepository,
    },
    {
      provide: 'DepartmentPermissionSettingRepositoryInterface',
      useClass: DepartmentPermissionSettingRepository,
    },
    {
      provide: 'GroupPermissionSettingRepositoryInterface',
      useClass: GroupPermissionSettingRepository,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    UserRoleSettingCronService,
  ],
  providers: [
    {
      provide: 'DepartmentSettingRepositoryInterface',
      useClass: DepartmentSettingRepository,
    },
    {
      provide: 'UserRoleSettingServiceInterface',
      useClass: UserRoleSettingService,
    },
    {
      provide: 'UserRoleSettingRepositoryInterface',
      useClass: UserRoleSettingRepository,
    },
    {
      provide: 'UserRolePermissionSettingRepositoryInterface',
      useClass: UserRolePermissionSettingRepository,
    },
    {
      provide: 'WarehouseServiceInterface',
      useClass: WarehouseService,
    },
    {
      provide: 'UserDepartmentRepositoryInterface',
      useClass: UserDepartmentRepository,
    },
    {
      provide: 'UserRoleRepositoryInterface',
      useClass: UserRoleRepository,
    },
    {
      provide: 'PermissionSettingRepositoryInterface',
      useClass: PermissionSettingRepository,
    },
    {
      provide: 'DepartmentPermissionSettingRepositoryInterface',
      useClass: DepartmentPermissionSettingRepository,
    },
    {
      provide: 'GroupPermissionSettingRepositoryInterface',
      useClass: GroupPermissionSettingRepository,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    UserRoleSettingCronService,
  ],
  controllers: [UserRoleSettingController],
})
export class UserRoleSettingModule {}
