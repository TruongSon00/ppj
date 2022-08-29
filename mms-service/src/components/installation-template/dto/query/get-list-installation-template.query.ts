import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQuery } from '@utils/pagination.query';
import { IsOptional, IsString } from 'class-validator';

export class GetListInstallationTemplateQuery extends PaginationQuery {
  @ApiPropertyOptional({
    example: '[{"id": "1"},{ "id": "2"}]',
  })
  @IsOptional()
  @IsString()
  queryIds?: string;
}
