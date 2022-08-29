import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReportJobResponseDto {
  @ApiProperty({ type: Number })
  @Expose()
  userId: number;

  @ApiProperty({ type: String })
  @Expose()
  userCode: string;

  @ApiProperty({ type: String })
  @Expose()
  fullName: string;

  @ApiProperty({ type: String })
  @Expose()
  userRole: string;

  @ApiProperty({ type: Date })
  @Expose()
  startWork: Date;

  @ApiProperty({ type: Number })
  @Expose()
  totalQuantity: number;

  @ApiProperty({ type: Number })
  @Expose()
  successQuantity: number;

  @ApiProperty({ type: Number })
  @Expose()
  executeQuantity: number;

  @ApiProperty({ type: Number })
  @Expose()
  lateQuantity: number;

  @ApiProperty({ type: Number })
  @Expose()
  waitQuantity: number;

  @ApiProperty({ type: Number })
  @Expose()
  planQuantity: number;

  @ApiProperty({ type: Number })
  @Expose()
  incurredQuantity: number;
}
