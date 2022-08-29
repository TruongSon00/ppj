import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { UserRolePermissionSettingEntity } from '@entities/user-role-permission-setting/user-role-permission-setting.entity';

export interface UserRolePermisisonSettingRepositoryInterface
  extends BaseInterfaceRepository<UserRolePermissionSettingEntity> {
  checkUserPermission(condition): Promise<any>;
}
