import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import {
  DEVICE_REQUEST_CONST,
  DEVICE_REQUEST_TYPE_ENUM,
} from '@components/device-request/device-request.constant';
import { BaseDto } from '@core/dto/base.dto';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';
export class CreateDeviceRequestTicketBody extends BaseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(DEVICE_REQUEST_CONST.NAME.MAX_LENGTH)
  @MinLength(DEVICE_REQUEST_CONST.NAME.MIN_LENGTH)
  @Matches(DEVICE_REQUEST_CONST.NAME.REGEX)
  @IsNotBlank()
  name: string;

  @IsInt()
  @IsNotEmpty()
  factoryId: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayUnique()
  @IsMongoId({ each: true })
  deviceGroupIds: string[];

  @ValidateIf((data) => data.type === DEVICE_REQUEST_TYPE_ENUM.RETURN)
  @IsNotEmpty()
  @IsArray()
  @ArrayUnique()
  @IsMongoId({ each: true })
  deviceIds: string[];

  @IsString()
  @IsOptional()
  @MaxLength(DEVICE_REQUEST_CONST.DESCRIPTION.MAX_LENGTH)
  description: string;

  @ValidateIf((data) => data.type === DEVICE_REQUEST_TYPE_ENUM.REQUEST)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @IsEnum(DEVICE_REQUEST_TYPE_ENUM)
  @IsNotEmpty()
  type: number;
}

export class CreateDeviceRequestTicketRequestDto extends CreateDeviceRequestTicketBody {
  @IsInt()
  @IsNotEmpty()
  createdBy: number;
}
