import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  IsMongoId,
} from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';

export class CreateFactoryRequestDto extends BaseDto {
  @ApiProperty({ example: '1', description: '' })
  @IsInt()
  @IsNotEmpty()
  companyId: number;

  @ApiProperty({ example: '1', description: '' })
  @IsMongoId()
  @IsNotEmpty()
  regionId: string;

  @ApiProperty({ example: 'company 1', description: '' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'ABCDEF', description: '' })
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ example: 'Ha Noi', description: '' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  location: string;

  @ApiPropertyOptional({ example: '0955-015-1458', description: '' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone: string;

  @ApiPropertyOptional({ example: 'description', description: '' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description: string;

  @ApiPropertyOptional({ example: 1, description: '' })
  @IsInt()
  @IsOptional()
  userId: number;
}
