import { PaginationQuery } from '@utils/pagination.query';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetListDefectRequestDto extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  isGetAll: string;
}
