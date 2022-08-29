import { Inject, Injectable } from '@nestjs/common';
import { DepartmentSettingServiceInterface } from '@components/settings/department-setting/interface/department-setting.service.interface';
import { DepartmentSettingRepositoryInterface } from '@components/settings/department-setting/interface/department-setting.repository.interface';

@Injectable()
export class DepartmentSettingService
  implements DepartmentSettingServiceInterface
{
  constructor(
    @Inject('DepartmentRepositoryInterface')
    private readonly departmentSettingRepository: DepartmentSettingRepositoryInterface,
  ) {}
}
