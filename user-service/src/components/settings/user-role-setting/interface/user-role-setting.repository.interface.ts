import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';

export type UserRoleSettingRepositoryInterface =
  BaseInterfaceRepository<UserRoleSetting>;
