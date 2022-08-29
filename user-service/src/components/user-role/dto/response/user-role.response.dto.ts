import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserRoleResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  userRoleId: number;

  @ApiProperty()
  @Expose()
  departmentId: number;

  @ApiProperty()
  @Expose()
  departmentName: string;
}
