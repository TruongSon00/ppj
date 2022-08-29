import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { IsEnum } from 'class-validator';
import { HistoryActionEnum } from '@components/history/history.constant';

export class GetHistoryDetailResponseDto {
  @ApiProperty()
  @Expose()
  _id: string;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  @IsEnum(HistoryActionEnum)
  action: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
