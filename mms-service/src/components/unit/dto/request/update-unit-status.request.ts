import { UNIT_CONST } from '@components/unit/unit.constant';
import { BaseDto } from '@core/dto/base.dto';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateUnitActiveStatusPayload extends BaseDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  @IsEnum(UNIT_CONST.ACTIVE.ENUM)
  status: number;
}
