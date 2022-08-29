import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { checklistConcludeEnum } from '@components/job/job.constant';
import { CheckListTemplateObligatoryConstant } from '@components/checklist-template/checklist-template.constant';
import {
  checklistResultEnum,
  CheckTypeEnum,
} from '@components/checklist-template/checklist-template.constant';

export class Detail {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty()
  @IsEnum(CheckListTemplateObligatoryConstant)
  @IsNotEmpty()
  obligatory: number;

  @IsString()
  @IsOptional()
  subtitle: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  status: number;
}

export class CheckListJobBody extends BaseDto {
  @ApiProperty()
  @IsOptional()
  user: any;

  @ApiProperty({ example: 'description' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  executionDateFrom: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  executionDateTo: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CheckTypeEnum)
  checkType: number;

  @ApiProperty({
    example: [
      {
        title: 'title',
        description: 'description',
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested()
  details: Detail[];

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(checklistResultEnum)
  checklistResult: number;

  @ApiProperty({ example: 1 })
  @IsEnum(checklistConcludeEnum)
  @IsNotEmpty()
  checklistConclude: number;
}
export class ChecklistJobRequestDto extends CheckListJobBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
