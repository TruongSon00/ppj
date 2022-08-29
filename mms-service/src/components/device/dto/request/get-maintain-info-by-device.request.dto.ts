import { PaginationQuery } from '@utils/pagination.query';
import { IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';

export class GetMaintainInfoByDeviceParam extends PaginationQuery {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
export class GetMaintainInfoByDeviceRequest extends GetMaintainInfoByDeviceParam {
  @IsOptional()
  @IsMongoId()
  deviceAssignId: string;
}
