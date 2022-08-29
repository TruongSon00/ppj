import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReportTotalJobResponse {
  @ApiProperty({
    description: `
    ALL = 1, // Tất cả công việc
    COMPLETED = 2, // Hoàn thành
    NOT_COMPLETED = 3, // Chưa hoàn thành
    LATE = 4, // Quá hạn
    `,
  })
  @Expose()
  status: number;

  @ApiProperty({
    description: 'Số lượng',
  })
  @Expose()
  count: number;
}
