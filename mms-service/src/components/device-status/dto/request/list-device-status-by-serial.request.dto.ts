import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationQuery } from '@utils/pagination.query';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class ListDeviceStatusBySerialQuery extends PaginationQuery {
  @IsDateString()
  @IsOptional()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  endDate: Date;
}
export class ListDeviceStatusBySerialRequestDto extends ListDeviceStatusBySerialQuery {
  @IsString()
  @IsNotEmpty()
  @IsNotBlank()
  serial: string;
}
