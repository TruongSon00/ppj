import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity({ name: 'department_settings' })
export class DepartmentSetting {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => User)
  @JoinTable()
  user: User;
}
