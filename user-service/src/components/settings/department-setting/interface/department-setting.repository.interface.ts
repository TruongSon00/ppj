import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { DepartmentSetting } from '@entities/department-setting/department-setting.entity';

export interface DepartmentSettingRepositoryInterface
  extends BaseInterfaceRepository<DepartmentSetting> {
  getListRoleAndPermissionOfDepartment(): Promise<any>;
  getRoleAndDepartment(): Promise<any>;
}
