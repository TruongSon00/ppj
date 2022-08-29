import { PaginationQuery } from '@utils/pagination.query';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class GetListDeviceGroupRequestDto extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  isGetAll: string;
}