import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@entities/user/user.entity';
import { FactoryStatusEnum } from '@components/factory/factory.constant';
import { Company } from '@entities/company/company.entity';

@Entity({ name: 'factories' })
export class Factory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'integer',
  })
  companyId: number;

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
  description: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  location: string;

  @Column({
    type: 'enum',
    enum: FactoryStatusEnum,
    default: FactoryStatusEnum.CREATED,
  })
  status: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  createdBy: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  approverId: number;

  @Column({
    type: 'varchar',
  })
  regionId: string;

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

  @Column()
  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_factories',
    joinColumn: {
      name: 'factory_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  Users: User[];

  @ManyToOne(() => Company, (company) => company.factories)
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company: Company;
}
