import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { DepartmentPermissionSettingEntity } from '@entities/department-permission-setting/department-permission-setting.entity';
import { GroupPermissionSettingEntity } from '@entities/group-permission-setting/group-permission-setting.entity';
import { StatusPermission } from '@utils/constant';

@Entity({ name: 'permission_settings' })
export class PermissionSettingEntity {
  @Column()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @PrimaryColumn({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  groupPermissionSettingCode: string;

  @Column({
    type: 'enum',
    enum: StatusPermission,
    default: StatusPermission.ACTIVE,
  })
  status: number;

  @OneToMany(
    () => DepartmentPermissionSettingEntity,
    (departmentPermissionSetting) =>
      departmentPermissionSetting.permissionSetting,
  )
  departmentPermissionSetting: DepartmentPermissionSettingEntity[];

  @ManyToOne(
    () => GroupPermissionSettingEntity,
    (groupPermissionSetting) => groupPermissionSetting.permissionSetting,
  )
  @JoinColumn({
    name: 'group_permission_setting_code',
  })
  groupPermissionSetting: GroupPermissionSettingEntity;
}
