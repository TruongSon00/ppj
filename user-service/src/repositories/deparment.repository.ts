import { DepartmentSettingRepositoryInterface } from '@components/settings/department-setting/interface/department-setting.repository.interface';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { DepartmentSetting } from '@entities/department-setting/department-setting.entity';
import { UserRole } from '@entities/user-role/user-role.entity';
import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';

@Injectable()
export class DepartmentSettingRepository
  extends BaseAbstractRepository<DepartmentSetting>
  implements DepartmentSettingRepositoryInterface
{
  constructor(
    @InjectRepository(DepartmentSetting)
    private readonly departmentRepository: Repository<DepartmentSetting>,
  ) {
    super(departmentRepository);
  }

  async getListRoleAndPermissionOfDepartment(): Promise<any> {
    return await this.departmentRepository
      .createQueryBuilder('d')
      .select([
        'd.id AS "id"',
        'd.name AS "name"',
        `CASE WHEN COUNT(ur) = 0 THEN '[]' ELSE jsonb_agg(json_build_object('id', ur.user_role_id, 'name', ur.role_name, 'permissionSettings', ur.permission_settings)) END AS roles`,
      ])
      .innerJoin(
        (query) => {
          query
            .select([
              'ur.user_role_id AS "user_role_id"',
              'ur.department_id AS "department_id"',
              'urs.name AS "role_name"',
              'urps.permission_settings AS "permission_settings"',
            ])
            .from('user_roles', 'ur')
            .innerJoin(
              (query) => {
                query
                  .select([
                    'urps.department_id AS "department_id"',
                    'urps.user_role_id AS "user_role_id"',
                    `CASE WHEN COUNT(ps) = 0 THEN '[]' ELSE jsonb_agg(json_build_object('code', ps.code, 'name', ps.name, 'groupPermissionSettingCode', ps.group_permission_setting_code)) END AS permission_settings`,
                  ])
                  .from('user_role_permission_settings', 'urps')
                  .innerJoin(
                    'permission_settings',
                    'ps',
                    'ps.code = urps.permission_setting_code',
                  )
                  .groupBy('urps.department_id')
                  .addGroupBy('urps.user_role_id');

                return query;
              },
              'urps',
              'urps.user_role_id = ur.user_role_id',
            )
            .leftJoin('user_role_settings', 'urs', 'urs.id = ur.user_role_id');

          return query;
        },
        'ur',
        'ur.department_id = d.id',
      )
      .groupBy('d.id')
      .getRawMany();
  }

  async getRoleAndDepartment(): Promise<any> {
    return await this.departmentRepository
      .createQueryBuilder('d')
      .select([
        'd.id AS "id"',
        'd.name AS "name"',
        `CASE WHEN COUNT(ur) = 0 THEN '[]' ELSE jsonb_agg(DISTINCT jsonb_build_object('id', ur.user_role_id, 'name', urs.name)) END AS role`,
      ])
      .innerJoin(UserRole, 'ur', 'ur.department_id = d.id')
      .innerJoin(UserRoleSetting, 'urs', 'urs.id = ur.user_role_id')
      .addGroupBy('d.id')
      .getRawMany();
  }
}
