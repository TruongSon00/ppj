import { TypeEnum } from '@components/export/export.constant';
import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EnumSort } from '@utils/common';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

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

export class ExportRequestDto extends BaseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    if (value?.split(',').length > 0)
      return value.split(',').map((id) => Number(id));
    else return null;
  })
  ids: number[];

  @ApiProperty()
  @IsEnum(TypeEnum)
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  type: number;

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
}
