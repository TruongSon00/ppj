import { PaginationQuery } from '@utils/pagination.query';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class GetMaintainRequestByAssignQuery extends PaginationQuery {}

export class GetMaintainRequestByAssignDeviceRequest extends GetMaintainRequestByAssignQuery {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
