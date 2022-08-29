import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { DepartmentSetting } from '../department-setting/department-setting.entity';
import { UserRole } from '../user-role/user-role.entity';
import { UserRoleSetting } from '../user-role-setting/user-role-setting.entity';
import { UserWarehouse } from '../user-warehouse/user-warehouse.entity';
import { UserDepartment } from '../user-department/user-department.entity';
import { UserFactory } from '../user-factory/user-factory.entity';
import { Factory } from '@entities/factory/factory.entity';
import { Company } from '@entities/company/company.entity';

export enum status {
  ACTIVE = 1,
  IN_ACTIVE = 0,
}
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    length: 255,
    nullable: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 255,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 255,
    select: false,
  })
  password: string;

  @Column({
    type: 'integer',
  })
  companyId: number;

  @Column({
    type: 'varchar',
    unique: true,
    length: 9,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'enum',
    enum: status,
    default: status.ACTIVE,
  })
  status: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  statusNotification: boolean;

  @Column({
    type: 'date',
    nullable: true,
  })
  dateOfBirth: Date;

  @Column({
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  otpCode: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  expire: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({
    type: 'int',
    nullable: true,
  })
  createdBy: number;

  @BeforeInsert()
  async hashPassword() {
    const saltOrRounds = 10;
    this.password = await bcrypt.hashSync(this.password, saltOrRounds);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compareSync(password, this.password);
  }

  @ManyToMany(() => DepartmentSetting)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'department_id',
      referencedColumnName: 'id',
    },
  })
  departmentSettings: DepartmentSetting[];

  @ManyToMany(() => UserRoleSetting)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_role_id',
      referencedColumnName: 'id',
    },
  })
  userRoleSettings: UserRoleSetting[];

  @ManyToMany(() => Factory)
  @JoinTable({
    name: 'user_factories',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'factory_id',
      referencedColumnName: 'id',
    },
  })
  factories: Factory[];

  @ManyToOne(() => Company, (company) => company.users)
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company: Company;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => UserWarehouse, (userWarehouse) => userWarehouse.user)
  userWarehouses: UserWarehouse[];

  @OneToMany(() => UserDepartment, (userDepartment) => userDepartment.user)
  userDepartments: UserDepartment[];

  @OneToMany(() => UserFactory, (userFactory) => userFactory.user)
  userFactories: UserFactory[];
}
