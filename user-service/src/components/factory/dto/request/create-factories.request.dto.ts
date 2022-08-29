import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateFactoriesRequestDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  line: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  location: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  createdBy: number;
}
