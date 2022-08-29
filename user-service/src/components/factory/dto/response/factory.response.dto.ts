import { ApiProperty } from '@nestjs/swagger';
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
class Company {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;
}

class InterRegion {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;
}
class Region {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Type(() => InterRegion)
  @Expose()
  interRegion: InterRegion;
}
export class FactoryResponseDto {
  @ApiProperty({ example: 1, description: '' })
  @Expose()
  id: number;

  @ApiProperty({ example: 2, description: '' })
  @Expose()
  companyId: number;

  @ApiProperty({ example: 2, description: '' })
  @Type(() => Company)
  @Expose()
  company: Company;

  @ApiProperty({ example: 'company 1', description: '' })
  @Expose()
  companyName: string;

  @ApiProperty({ example: 2, description: '' })
  @Expose()
  regionId: string;

  @ApiProperty({ type: Region })
  @Type(() => Region)
  @Expose()
  region: Region;

  @ApiProperty({ example: 'factory 1', description: '' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'ABCDEF', description: '' })
  @Expose()
  code: string;

  @ApiProperty({ example: 'Ha Noi', description: '' })
  @Expose()
  location: string;

  @ApiProperty({ example: '0955-015-1458', description: '' })
  @Expose()
  phone: string;

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

  @ApiProperty({ type: UserResponse })
  @Expose()
  @Type(() => UserResponse)
  createdBy: UserResponse;
}
