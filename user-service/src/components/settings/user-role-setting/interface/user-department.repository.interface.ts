import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { UserDepartment } from '@entities/user-department/user-department.entity';

export type UserDepartmentRepositoryInterface =
  BaseInterfaceRepository<UserDepartment>;
