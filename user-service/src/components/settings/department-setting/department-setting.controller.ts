import { Controller, Inject } from '@nestjs/common';
import { DepartmentSettingServiceInterface } from '@components/settings/department-setting/interface/department-setting.service.interface';

@Controller('department-setting')
export class DepartmentSettingController {
  constructor(
    @Inject('DepartmentSettingServiceInterface')
    private readonly departmentSettingService: DepartmentSettingServiceInterface,
  ) {}
}
