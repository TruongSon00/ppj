import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DashboardWarningResponseDto extends BaseResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Mức độ ưu tiên',
  })
  @Expose()
  priority: number;

  @ApiProperty({
    example: 2,
    description: 'Trạng thái',
  })
  @Expose()
  status: number;

  @ApiProperty({
    example: 3,
    description: 'Loại',
  })
  @Expose()
  type: number;

  @ApiProperty({
    example: '2021-11-25 16:00:00',
    description: 'Complete expected date',
  })
  @Expose()
  completeExpectedDate: Date;

  @ApiProperty({
    example: '2021-11-25 16:00:00',
    description: 'Execution date',
  })
  @Expose()
  executionDate: Date;
}
