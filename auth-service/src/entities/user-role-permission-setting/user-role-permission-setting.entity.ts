import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_role_permission_settings' })
export class UserRolePermissionSettingEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'int',
  })
  userRoleId: number;

  @Column({
    type: 'int',
  })
  departmentId: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  permissionSettingCode: string;
}
