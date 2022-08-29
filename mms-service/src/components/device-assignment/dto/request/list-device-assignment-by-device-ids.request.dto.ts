import { PaginationQuery } from '@utils/pagination.query';
import { IsString, IsNotEmpty } from 'class-validator';

export class ListSerialByDeviceIds extends PaginationQuery {
  @IsString()
  @IsNotEmpty()
  deviceIds: string;
}
