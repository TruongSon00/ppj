import { PaginationQuery } from '@utils/pagination.query';
import { Transform } from 'class-transformer';
import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class ListReportDeviceAssignStatusQuery extends PaginationQuery {
  @IsNumber()
  @Transform((v) => Number(v.value))
  @IsOptional()
  factoryId: number;

  @IsNumber()
  @Transform((v) => Number(v.value))
  @IsOptional()
  workCenterId: number;

  @IsMongoId()
  @IsOptional()
  deviceId: string;

  @IsMongoId()
  @IsOptional()
  deviceGroupId: string;

  @IsNumber()
  @Transform((v) => Number(v.value))
  @IsOptional()
  assignUserId: number;
}
