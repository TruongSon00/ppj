import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';

export class CompanyRequestDto extends BaseDto {
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
  address: string;

  @ApiPropertyOptional({ example: '0955-015-1458', description: '' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone: string;

  @ApiPropertyOptional({ example: 'tax_no', description: '' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  taxNo: string;

  @ApiPropertyOptional({ example: 'email@gmail.com', description: '' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  email: string;

  @ApiPropertyOptional({ example: 'fax', description: '' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  fax: string;

  @ApiPropertyOptional({ example: 'description', description: '' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description: string;

  @ApiPropertyOptional({ example: '03058444901', description: '' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  bankAccount: string;

  @ApiPropertyOptional({ example: 'NQT', description: '' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  bankAccountOwner: string;

  @ApiPropertyOptional({ example: 'TP BANK', description: '' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  bank: string;

  @ApiPropertyOptional({ example: 1, description: '' })
  @IsInt()
  @IsOptional()
  userId: number;
}
