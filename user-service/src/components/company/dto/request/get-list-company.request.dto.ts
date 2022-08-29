import { PaginationQuery } from '@utils/pagination.query';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EnumSort } from '@utils/common';

class Sort {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  column: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(EnumSort)
  order: any;
}

class Filter {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  column: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  text: string;
}

export class GetListCompanyRequestDto extends PaginationQuery {
  @ApiPropertyOptional({ example: 'company', description: '' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    example: [{ columm: 'name', text: 'abc' }],
    description: '',
  })
  @IsOptional()
  @IsArray()
  @Type(() => Filter)
  filter?: Filter[];

  @ApiPropertyOptional({
    example: [{ columm: 'name', order: 'DESC' }],
    description: '',
  })
  @Type(() => Sort)
  @IsArray()
  @IsOptional()
  sort?: Sort[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['0', '1'])
  isGetAll: string;

  @ApiPropertyOptional({
    example: '[{"id": "1", "itemId": "2"}]',
  })
  @IsOptional()
  @IsString()
  ids?: string;
}
