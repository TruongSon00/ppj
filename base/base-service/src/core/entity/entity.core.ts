import { now } from 'moment';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseCommonEntity extends BaseEntity {
  @CreateDateColumn({
    type: 'timestamptz',
  })
  @Column({
    type: 'timestamptz',
    default: now(),
    nullable: true,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  @Column({
    type: 'timestamptz',
    default: now(),
    nullable: true,
  })
  updatedAt: Date;
}
