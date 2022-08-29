import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CheckPermissionDepartmentRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  departmentId: number;
}
