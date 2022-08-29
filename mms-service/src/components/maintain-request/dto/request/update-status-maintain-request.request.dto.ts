import { MAINTAIN_REQUEST_CONST } from '@components/maintain-request/maintain-request.constant';
import { BaseDto } from '@core/dto/base.dto';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class UpdateMaintainStatusBodyDto extends BaseDto {}
export class UpdateMaintainRequestStatusDto extends UpdateMaintainStatusBodyDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAINTAIN_REQUEST_CONST.DESCRIPTION.MAX_LENGTH)
  reason: string;
}
