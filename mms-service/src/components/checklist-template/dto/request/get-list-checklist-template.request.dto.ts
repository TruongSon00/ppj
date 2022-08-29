import { PaginationQuery } from '@utils/pagination.query';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetListCheckListTemplateRequestDto extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  isGetAll: string;

  @ApiPropertyOptional({
    example: '[{"id": "1"},{ "id": "2"}]',
  })
  @IsOptional()
  @IsString()
  queryIds?: string;
}
