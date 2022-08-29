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

@Entity({ name: 'user_factories' })
export class UserFactory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'int',
  })
  userId: number;

  @Column({
    type: 'int',
  })
  factoryId: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userFactories)
  @JoinColumn()
  user: User;
}
