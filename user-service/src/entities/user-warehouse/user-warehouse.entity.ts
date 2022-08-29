import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity({ name: 'user_warehouses' })
export class UserWarehouse {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'int',
  })
  userId: number;

  @Column({
    type: 'int',
  })
  warehouseId: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userWarehouses)
  @JoinColumn()
  user: User;
}
