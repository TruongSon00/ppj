import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { GroupPermissionSettingEntity } from '@entities/group-permission-setting/group-permission-setting.entity';

export type GroupPermissionSettingRepositoryInterface =
  BaseInterfaceRepository<GroupPermissionSettingEntity>;
