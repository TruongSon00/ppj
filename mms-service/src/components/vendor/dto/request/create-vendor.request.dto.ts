import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { VENDOR_CONST } from '@components/vendor/vendor.constant';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class CreateVendorRequestDto extends BaseDto {
  @ApiProperty()
  @MaxLength(VENDOR_CONST.CODE.MAX_LENGTH)
  @MinLength(VENDOR_CONST.CODE.MIN_LENGTH)
  @Matches(VENDOR_CONST.CODE.REGEX)
  @IsNotBlank()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @MaxLength(VENDOR_CONST.NAME.MAX_LENGTH)
  @MinLength(VENDOR_CONST.NAME.MIN_LENGTH)
  @Matches(VENDOR_CONST.NAME.REGEX)
  @IsNotBlank()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @MaxLength(VENDOR_CONST.DESCRIPTION.MAX_LENGTH)
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @MaxLength(VENDOR_CONST.DESCRIPTION.MAX_LENGTH)
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty()
  @MaxLength(VENDOR_CONST.DESCRIPTION.MAX_LENGTH)
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty()
  @MaxLength(VENDOR_CONST.DESCRIPTION.MAX_LENGTH)
  @IsOptional()
  @IsString()
  bank: string;

  @ApiProperty()
  @MaxLength(VENDOR_CONST.DESCRIPTION.MAX_LENGTH)
  @IsOptional()
  @IsString()
  asignUser: string;

  @ApiProperty()
  @MaxLength(VENDOR_CONST.PHONE.MAX_LENGTH)
  @IsOptional()
  @IsString()
  phone: string;
}
