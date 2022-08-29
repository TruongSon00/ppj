import { TypeEnum } from '../../export.constant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQuery } from '@utils/pagination.query';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';

export class ExportRequestDto extends PaginationQuery {
  @ApiPropertyOptional({
    example: '[{"id": "1", "itemId": "2"}]',
  })
  @IsOptional()
  @IsString()
  queryIds?: string;

  @ApiProperty()
  @IsEnum(TypeEnum)
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  type: number;
}
