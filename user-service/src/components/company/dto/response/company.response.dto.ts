import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class UserResponse {
  @ApiProperty({ example: 1, description: '' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'abc', description: '' })
  @Expose()
  username: string;

  @ApiProperty({ example: 'abc', description: '' })
  @Expose()
  fullName: string;
}
export class CompanyResponseDto {
  @ApiProperty({ example: 1, description: '' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'company 1', description: '' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'ABCDEF', description: '' })
  @Expose()
  code: string;

  @ApiProperty({ example: 'Ha Noi', description: '' })
  @Expose()
  address: string;

  @ApiProperty({ example: '0955-015-1458', description: '' })
  @Expose()
  phone: string;

  @ApiProperty({ example: 'tax_no', description: '' })
  @Expose()
  taxNo: string;

  @ApiProperty({ example: 'email@gmail.com', description: '' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'fax', description: '' })
  @Expose()
  fax: string;

  @ApiProperty({ example: 'description', description: '' })
  @Expose()
  description: string;

  @ApiProperty({ example: 1, description: '' })
  @Expose()
  status: number;

  @ApiProperty({ example: '2021-07-13 09:13:15.562609+00', description: '' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2021-07-13 09:13:15.562609+00', description: '' })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ type: UserResponse })
  @Expose()
  @Type(() => UserResponse)
  approver: UserResponse;

  @ApiPropertyOptional({ example: '03058444901', description: '' })
  @Expose()
  bankAccount: string;

  @ApiPropertyOptional({ example: 'NQT', description: '' })
  @Expose()
  bankAccountOwner: string;

  @ApiPropertyOptional({ example: 'TP BANK', description: '' })
  @Expose()
  bank: string;

  @ApiPropertyOptional({ type: UserResponse })
  @Expose()
  @Type(() => UserResponse)
  createdBy: UserResponse;
}
