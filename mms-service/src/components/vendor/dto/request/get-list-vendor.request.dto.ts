import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from '@utils/pagination.query';
export class GetListVendorRequestDto extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  isGetAll: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  queryIds?: string[];
}
