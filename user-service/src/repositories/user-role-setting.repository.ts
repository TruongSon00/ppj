import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';
import { UserRoleSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/user-role-setting.repository.interface';

@Injectable()
export class UserRoleSettingRepository
  extends BaseAbstractRepository<UserRoleSetting>
  implements UserRoleSettingRepositoryInterface
{
  constructor(
    @InjectRepository(UserRoleSetting)
    private readonly userRoleRepository: Repository<UserRoleSetting>,
  ) {
    super(userRoleRepository);
  }
}
