import { IsOptional } from 'class-validator';
import { PaginationQuery } from '@utils/pagination.query';

export class ListDeviceRequestsRequestDto extends PaginationQuery {
  @IsOptional()
  isGetAll: boolean;
}
