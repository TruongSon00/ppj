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

@Entity({ name: 'user_departments' })
export class UserDepartment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'int',
  })
  userId: number;

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

  @ManyToOne(() => User, (user) => user.userDepartments)
  @JoinColumn()
  user: User;
}
