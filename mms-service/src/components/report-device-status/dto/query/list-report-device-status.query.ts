import { PaginationQuery } from '@utils/pagination.query';
import { Transform } from 'class-transformer';
import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class ListReportDeviceStatusQuery extends PaginationQuery {
  @IsMongoId()
  @IsOptional()
  deviceGroupId: string;

  @IsNumber()
  @Transform((e) => Number(e.value))
  @IsOptional()
  factoryId: number;

  @IsNumber()
  @Transform((e) => Number(e.value))
  @IsOptional()
  workCenterId: number;
}
