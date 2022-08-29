import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { DepartmentPermissionSettingEntity } from '@entities/department-permission-setting/department-permission-setting.entity';

export type DepartmentPermissionSettingRepositoryInterface =
  BaseInterfaceRepository<DepartmentPermissionSettingEntity>;
