import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { UserDepartment } from '@entities/user-department/user-department.entity';
import { UserDepartmentRepositoryInterface } from '@components/settings/user-role-setting/interface/user-department.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserDepartmentRepository
  extends BaseAbstractRepository<UserDepartment>
  implements UserDepartmentRepositoryInterface
{
  constructor(
    @InjectRepository(UserDepartment)
    private readonly userDepartmentRepository: Repository<UserDepartment>,
  ) {
    super(userDepartmentRepository);
  }
}
