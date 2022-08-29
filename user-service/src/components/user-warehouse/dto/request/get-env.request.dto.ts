import { PaginationQuery } from '@utils/pagination.query';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetEnvRequest extends PaginationQuery {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  userCode: string;

  @IsNotEmpty()
  @IsArray()
  userRoleIds: number[];

  @IsNotEmpty()
  @IsArray()
  userDepartmentIds: number[];
}
