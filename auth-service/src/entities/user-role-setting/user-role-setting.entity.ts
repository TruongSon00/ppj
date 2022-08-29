import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../user/user.entity';

@Entity({ name: 'user_role_settings' })
export class UserRoleSettingEntity {
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

  @ManyToMany(() => UserEntity)
  @JoinTable()
  user: UserEntity;
}
