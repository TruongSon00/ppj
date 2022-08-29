import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { JOB_TYPE_MAINTENANCE_ENUM } from '@components/job/job.constant';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { SUPPLY_CONST } from '@components/supply/supply.constant';

class Supply {
  @IsString()
  @IsNotEmpty()
  supplyId: string;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsOptional()
  @MaxLength(SUPPLY_CONST.DESCRIPTION.MAX_LENGTH)
  description: string;

  @ApiProperty()
  @IsEnum(JOB_TYPE_MAINTENANCE_ENUM)
  @IsNotEmpty()
  maintainType: number;
}
export class ExecuteJobBody extends BaseDto {
  @ApiProperty({ example: 'description' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  executionDateFrom: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  executionDateTo: Date;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsOptional()
  @IsEnum(JOB_TYPE_MAINTENANCE_ENUM)
  maintenanceType: number;

  @ApiProperty({
    example: [
      {
        supplyId: '1',
        quantity: 1,
        description: 'description',
        maintenanceType: 1,
      },
    ],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  supplies: Supply[];

  @ApiProperty()
  @IsNotEmpty()
  user: UserInforRequestDto;
}
export class ExecuteJobRequestDto extends ExecuteJobBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
