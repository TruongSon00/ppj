import { PaginationQuery } from '@utils/pagination.query';
import { IsOptional, IsInt } from 'class-validator';

export class GetListWarningRequestDto extends PaginationQuery {
  @IsOptional()
  @IsInt()
  userId: number;
}
