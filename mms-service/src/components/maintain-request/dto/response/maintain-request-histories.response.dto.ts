import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MaintainRequestHistoriesResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  userId: number;

  @ApiProperty({ example: 'it_mms' })
  @Expose()
  userName: string;

  @ApiProperty({ example: 'created' })
  @Expose()
  action: string;

  @ApiProperty({ example: 'it_mms đã tạo yêu cầu bảo trì' })
  @Expose()
  content: string;

  @ApiProperty({ example: '2022-01-18T07:27:45.139Z' })
  @Expose()
  createdAt: string;
}
