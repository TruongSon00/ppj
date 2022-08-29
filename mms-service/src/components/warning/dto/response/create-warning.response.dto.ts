import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class WarningResponse {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  defect: string;

  @ApiProperty()
  @Expose()
  completeExpectedDate: Date;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  executionDate: Date;

  @ApiProperty()
  @Expose()
  type: number;

  @ApiProperty()
  @Expose()
  deviceAssignment: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
