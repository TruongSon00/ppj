import { PaginationQuery } from '@utils/pagination.query';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class GetListSupplyRequestDto extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  isGetAll: string;
}
