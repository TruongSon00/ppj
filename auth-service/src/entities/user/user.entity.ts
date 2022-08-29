import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  DeleteDateColumn,
} from 'typeorm';
import * as bcryptJs from 'bcryptjs';

export enum status {
  ACTIVE = 1,
  IN_ACTIVE = 0,
}
@Entity({ name: 'users' })
export class UserEntity {
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

  @BeforeInsert()
  async hashPassword() {
    const saltOrRounds = 10;
    this.password = await bcryptJs.hashSync(this.password, saltOrRounds);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcryptJs.compareSync(password, this.password);
  }
}
