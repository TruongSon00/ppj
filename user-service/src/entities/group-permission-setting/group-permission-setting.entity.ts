import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { PermissionSettingEntity } from '@entities/permission-setting/permission-setting.entity';
import { StatusPermission } from '@utils/constant';

@Entity('group_permission_settings')
export class GroupPermissionSettingEntity {
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
    type: 'enum',
    enum: StatusPermission,
    default: StatusPermission.ACTIVE,
  })
  status: number;

  @OneToMany(
    () => PermissionSettingEntity,
    (permissionSetting) => permissionSetting.groupPermissionSetting,
  )
  @JoinColumn()
  permissionSetting: PermissionSettingEntity[];
}
