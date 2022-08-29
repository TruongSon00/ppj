import { UserRole } from '@entities/user-role/user-role.entity';
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity({ name: 'user_role_settings' })
export class UserRoleSetting {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 2,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => User)
  @JoinTable()
  user: User;

  @OneToMany(() => UserRole, (userRole) => userRole.department)
  userRoles: UserRole[];
}
