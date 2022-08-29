import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { GroupPermissionSettingEntity } from '@entities/group-permission-setting/group-permission-setting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupPermissionSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/group-permission-setting.repository.interface';

@Injectable()
export class GroupPermissionSettingRepository
  extends BaseAbstractRepository<GroupPermissionSettingEntity>
  implements GroupPermissionSettingRepositoryInterface
{
  constructor(
    @InjectRepository(GroupPermissionSettingEntity)
    private readonly groupPermissionSettingRepository: Repository<GroupPermissionSettingEntity>,
  ) {
    super(groupPermissionSettingRepository);
  }
}
