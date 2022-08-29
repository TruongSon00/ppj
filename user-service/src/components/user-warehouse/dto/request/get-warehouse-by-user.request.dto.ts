import { PaginationQuery } from '@utils/pagination.query';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetWarehouseByUserRequest extends PaginationQuery {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  userCode: string;

  @IsOptional()
  @IsEnum(['0', '1'])
  basicInfor: string;

  @IsOptional()
  @IsEnum(['0', '1'])
  isGetAll: string;
}
