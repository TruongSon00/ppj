import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { BaseDto } from '@core/dto/base.dto';
import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GenerateJobForPlanRequest extends BaseDto {
  @IsNumber()
  @IsOptional()
  factoryId: number;

  @IsMongoId()
  @IsOptional()
  planId: string;

  @IsString()
  @IsOptional()
  uuid: string;

  @IsNumber()
  @IsOptional()
  workCenterId: number;

  @IsDateString()
  @IsNotEmpty()
  planFrom: Date;

  @IsDateString()
  @IsNotEmpty()
  planTo: Date;

  @IsNotEmpty()
  user: UserInforRequestDto;
}
