import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity({ name: 'user_roles' })
export class UserRole {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'int',
  })
  userId: number;

  @Column({
    type: 'int',
  })
  userRoleId: number;

  @Column({
    type: 'int',
  })
  departmentId: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userRoles)
  @JoinColumn()
  user: User;

  @ManyToOne(
    () => UserRoleSetting,
    (userRoleSetting) => userRoleSetting.userRoles,
  )
  department: UserRoleSetting;
}
