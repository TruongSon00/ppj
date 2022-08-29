import { BaseDto } from '@core/dto/base.dto';
import { PaginationQuery } from '@utils/pagination.query';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class ListJobByDeviceRequestDto extends PaginationQuery {
  @IsInt()
  @IsOptional()
  userId: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsNotBlank()
  serial: string;
}
