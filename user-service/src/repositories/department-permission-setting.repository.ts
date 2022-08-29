import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { DepartmentPermissionSettingEntity } from '@entities/department-permission-setting/department-permission-setting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentPermissionSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/department-permission-setting.repository.interface';

@Injectable()
export class DepartmentPermissionSettingRepository
  extends BaseAbstractRepository<DepartmentPermissionSettingEntity>
  implements DepartmentPermissionSettingRepositoryInterface
{
  constructor(
    @InjectRepository(DepartmentPermissionSettingEntity)
    private readonly departmentPermissionSettingRepository: Repository<DepartmentPermissionSettingEntity>,
  ) {
    super(departmentPermissionSettingRepository);
  }
}
