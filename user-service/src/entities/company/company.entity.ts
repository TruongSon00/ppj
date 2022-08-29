import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { CompanyStatusEnum } from '@components/company/company.constant';
import { User } from '@entities/user/user.entity';
import { Factory } from '@entities/factory/factory.entity';

@Entity({ name: 'companies' })
export class Company {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 9,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  taxNo: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  fax: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: CompanyStatusEnum,
    default: CompanyStatusEnum.CREATED,
  })
  status: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  approverId: number;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  approvedAt: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => User, (user) => user.company)
  @JoinColumn({ name: 'id', referencedColumnName: 'company_id' })
  users: User[];

  @OneToMany(() => Factory, (factory) => factory.company)
  @JoinColumn({ name: 'id', referencedColumnName: 'company_id' })
  factories: Factory[];

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  bankAccount: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  bankAccountOwner: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  bank: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  createdBy: number;
}
