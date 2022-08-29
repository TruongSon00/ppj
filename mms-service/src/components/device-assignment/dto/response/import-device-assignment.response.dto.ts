import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';

export class ImportDeviceAssignResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Số dòng import thành công.',
  })
  @Expose()
  SUCCESS: number;

  @ApiProperty({
    example: 1,
    description: 'Số dòng import thất bại.',
  })
  @Expose()
  FAIL: number;

  @ApiProperty({
    example: 1,
    description: 'Trạng thái import.',
  })
  @IsArray()
  @Expose()
  statusImport: boolean[];

  @ApiProperty({
    example: 1,
    description: 'Validation message.',
  })
  @IsArray()
  @Expose()
  messageValidate: string[];
}
