import {
  IsNotEmpty,
  IsDateString,
  IsString,
  IsInt,
  IsOptional,
  IsMongoId,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@core/dto/base.dto';
import { Type } from 'class-transformer';
import { IsSqlOrNoSqlId } from 'src/validator/is-nosql-or-sql-id.validator';

class AssignUserItem {
  @IsNotEmpty()
  assignId: string | number;

  @IsString()
  @IsOptional()
  description: string;
}
export class JobAssignmentBody extends BaseDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  planFrom: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  planTo: Date;

  @IsString()
  @IsNotEmpty()
  assignUser: string;

  @ApiProperty()
  @IsOptional()
  history: any;

  @IsMongoId()
  @IsNotEmpty()
  planId: string;

  @ApiProperty()
  @IsNotEmpty()
  user: any;
}

export class JobAssignmentRequestDto extends JobAssignmentBody {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;
}
