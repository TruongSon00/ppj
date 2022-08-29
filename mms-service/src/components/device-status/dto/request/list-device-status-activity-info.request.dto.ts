import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { IsNoSqlId } from 'src/validator/is-nosql-id.validator';
import { PaginationQuery } from '@utils/pagination.query';

export class ListDeviceStatusActivityInfoQuery extends PaginationQuery {
  @IsDateString()
  @IsOptional()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  endDate: Date;
}
export class ListDeviceStatusActivityInfoRequestDto extends ListDeviceStatusActivityInfoQuery {
  @IsNoSqlId()
  @IsNotEmpty()
  deviceAssignmentId: string;
}
