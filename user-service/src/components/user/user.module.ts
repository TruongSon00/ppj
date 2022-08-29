import { Factory } from './../../entities/factory/factory.entity';
import { DepartmentSettingRepository } from './../../repositories/deparment.repository';
import { DepartmentSetting } from './../../entities/department-setting/department-setting.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities/user/user.entity';
import { UserController } from '@components/user/user.controller';
import { UserRepository } from '@repositories/user.repository';
import { UserService } from '@components/user/user.service';
import { WarehouseService } from '@components/warehouse/warehouse.service';
import { WarehouseModule } from '@components/warehouse/warehouse.module';
import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';
import { UserRoleSettingRepository } from '@repositories/user-role-setting.repository';
import { Company } from '@entities/company/company.entity';
import { CompanyRepository } from '@repositories/company.repository';
import { FactoryRepository } from '@repositories/factory.repository';
import { MailModule } from '@components/mail/mail.module';
import { MailService } from '@components/mail/mail.service';
import { UserWarehouse } from '@entities/user-warehouse/user-warehouse.entity';
import { UserWarehouseRepository } from '@repositories/user-warehouse.repository';
import { UserRoleSettingModule } from '@components/settings/user-role-setting/user-role-setting.module';
import { UserRoleSettingService } from '@components/settings/user-role-setting/user-role-setting.service';
import { GroupPermissionSettingRepository } from '@repositories/group-permission-setting.repository';
import { GroupPermissionSettingEntity } from '@entities/group-permission-setting/group-permission-setting.entity';
import { UserRolePermissionSettingRepository } from '@repositories/user-role-permission-setting.repository';
import { UserRolePermissionSettingEntity } from '@entities/user-role-permission-setting/user-role-permission-setting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      DepartmentSetting,
      UserRoleSetting,
      Company,
      Factory,
      UserWarehouse,
      GroupPermissionSettingEntity,
      UserRolePermissionSettingEntity,
    ]),
    WarehouseModule,
    MailModule,
    UserRoleSettingModule,
  ],
  providers: [
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'DepartmentSettingRepositoryInterface',
      useClass: DepartmentSettingRepository,
    },
    {
      provide: 'UserRoleSettingRepositoryInterface',
      useClass: UserRoleSettingRepository,
    },
    {
      provide: 'CompanyRepositoryInterface',
      useClass: CompanyRepository,
    },
    {
      provide: 'FactoryRepositoryInterface',
      useClass: FactoryRepository,
    },
    {
      provide: 'UserWarehouseRepositoryInterface',
      useClass: UserWarehouseRepository,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'WarehouseServiceInterface',
      useClass: WarehouseService,
    },
    {
      provide: 'MailServiceInterface',
      useClass: MailService,
    },
    {
      provide: 'UserRoleSettingServiceInterface',
      useClass: UserRoleSettingService,
    },
    {
      provide: 'GroupPermissionSettingRepositoryInterface',
      useClass: GroupPermissionSettingRepository,
    },
    {
      provide: 'UserRolePermisisonSettingRepositoryInterface',
      useClass: UserRolePermissionSettingRepository,
    },
  ],
  controllers: [UserController],
  exports: [
    {
      provide: 'WarehouseServiceInterface',
      useClass: WarehouseService,
    },
    {
      provide: 'MailServiceInterface',
      useClass: MailService,
    },
    {
      provide: 'DepartmentSettingRepositoryInterface',
      useClass: DepartmentSettingRepository,
    },
    {
      provide: 'UserRoleSettingRepositoryInterface',
      useClass: UserRoleSettingRepository,
    },
    {
      provide: 'CompanyRepositoryInterface',
      useClass: CompanyRepository,
    },
    {
      provide: 'FactoryRepositoryInterface',
      useClass: FactoryRepository,
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
      provide: 'UserWarehouseRepositoryInterface',
      useClass: UserWarehouseRepository,
    },
    {
      provide: 'UserRoleSettingServiceInterface',
      useClass: UserRoleSettingService,
    },
    {
      provide: 'GroupPermissionSettingRepositoryInterface',
      useClass: GroupPermissionSettingRepository,
    },
    {
      provide: 'UserRolePermisisonSettingRepositoryInterface',
      useClass: UserRolePermissionSettingRepository,
    },
  ],
})
export class UserModule {}
