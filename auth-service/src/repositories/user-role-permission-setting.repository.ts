import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRolePermissionSettingEntity } from '@entities/user-role-permission-setting/user-role-permission-setting.entity';
import { Repository } from 'typeorm';
import { UserRolePermisisonSettingRepositoryInterface } from '@components/user-role/interface/user-role-permission-setting.repository.interface';

@Injectable()
export class UserRolePermissionSettingRepository
  extends BaseAbstractRepository<UserRolePermissionSettingEntity>
  implements UserRolePermisisonSettingRepositoryInterface
{
  constructor(
    @InjectRepository(UserRolePermissionSettingEntity)
    private readonly userRolePermissionSettingRepository: Repository<UserRolePermissionSettingEntity>,
  ) {
    super(userRolePermissionSettingRepository);
  }

  async checkUserPermission(condition): Promise<any> {
    return await this.userRolePermissionSettingRepository
      .createQueryBuilder('urps')
      .select(['urps.id AS "id"'])
      .leftJoin(
        'user_roles',
        'ur',
        'ur.department_id = urps.department_id AND ur.user_role_id = urps.user_role_id',
      )
      .where('ur.user_id = :userId', { userId: condition.userId })
      .andWhere('urps.permissionSettingCode IN (:...permissionCodes)', {
        permissionCodes: condition.permissionCodes,
      })
      .getRawMany();
  }
}
