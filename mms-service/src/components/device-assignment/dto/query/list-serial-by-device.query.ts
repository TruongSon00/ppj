import { PaginationQuery } from '@utils/pagination.query';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class ListSerialByDeviceQuery extends PaginationQuery {
  @IsMongoId()
  @IsNotEmpty()
  deviceId: string;

  @IsOptional()
  @IsEnum(['0', '1'])
  isGetAll: string;
}
