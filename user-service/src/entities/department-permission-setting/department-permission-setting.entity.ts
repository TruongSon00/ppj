import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionSettingEntity } from '@entities/permission-setting/permission-setting.entity';

@Entity({ name: 'department_permission_settings' })
export class DepartmentPermissionSettingEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  departmentId: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  permissionSettingCode: string;

  @ManyToOne(
    () => PermissionSettingEntity,
    (permissionSetting) => permissionSetting.departmentPermissionSetting,
  )
  @JoinColumn({
    name: 'permission_setting_code',
  })
  permissionSetting: PermissionSettingEntity;
}
