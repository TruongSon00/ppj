import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateJobResponseDto {
  @ApiProperty({})
  @Expose()
  maintainRequestId: string;

  @ApiProperty({})
  @Expose()
  warningId: string;

  @ApiProperty({})
  @Expose()
  checkListTemplateId: string;

  @ApiProperty({})
  @Expose()
  code: string;

  @ApiProperty({})
  @Expose()
  type: string;

  @ApiProperty({})
  @Expose()
  planDate: string;
}
