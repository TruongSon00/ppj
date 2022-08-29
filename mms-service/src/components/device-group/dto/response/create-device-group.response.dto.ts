import { ObjectId } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateDeviceGroupResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  @IsArray()
  responsibleUserIds: number[];

  @ApiProperty()
  @Expose()
  responsibleMaintenanceTeam: string;

  @ApiProperty()
  @Expose()
  description: string;
}
