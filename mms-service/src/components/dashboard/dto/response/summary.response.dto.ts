import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DashboardSummaryResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  totalAllItem: number;

  @ApiProperty({ example: 5 })
  @Expose()
  totalFinishItem: number;

  @ApiProperty({ example: 20 })
  @Expose()
  totalSemiFinishItem: number;

  @ApiProperty({ example: 40 })
  @Expose()
  totalOutOfDateItem  : number;
}
