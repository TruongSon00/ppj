import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DashboardDeviceAssignmentStatusDataResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  totalUnUseItem: number;

  @ApiProperty({ example: 5 })
  @Expose()
  totalInUseItem: number;

  @ApiProperty({ example: 5 })
  @Expose()
  totalMaintiningItem: number;

  @ApiProperty({ example: 5 })
  @Expose()
  totalReturnItem: number;

  @ApiProperty({ example: 5 })
  @Expose()
  totalScrappingItem: number;

}