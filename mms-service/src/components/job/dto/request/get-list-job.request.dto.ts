import { PaginationQuery } from '@utils/pagination.query';
import { IsOptional } from 'class-validator';

export class GetListJobRequestDto extends PaginationQuery {
  @IsOptional()
  userInfo: any;

  @IsOptional()
  user: any;

  @IsOptional()
  curUser: any;
}
