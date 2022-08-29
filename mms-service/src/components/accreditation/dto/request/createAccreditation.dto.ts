import { ACCREDITATION_CONST } from '@components/accreditation/accreditation.constant';
import { DETAILACCREDITATION_CONST } from '@components/accreditation/detailAccreditation.constant';
import { BaseDto } from '@core/dto/base.dto';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  MaxLength,
} from 'class-validator';

class DetailAccreditationRequestDto extends BaseDto {
  @IsNotEmpty()
  @MaxLength(DETAILACCREDITATION_CONST.TITLE.MAX_LENGTH)
  @IsString()
  @Matches(DETAILACCREDITATION_CONST.TITLE.REGEX)
  title: string;

  @IsNotEmpty()
  @MaxLength(DETAILACCREDITATION_CONST.DESCRIPTION.MAX_LENGTH)
  @IsString()
  @Matches(DETAILACCREDITATION_CONST.DESCRIPTION.REGEX)
  descript: string;
  @IsNotEmpty()
  @Max(DETAILACCREDITATION_CONST.PERIODIC.MAX)
  @IsNumber()
  periodic: number;

  @IsNotEmpty()
  @IsBoolean()
  obligatory: boolean;
}
export class CreateAccreditationRequestDto extends BaseDto {
  @IsNotEmpty()
  @MaxLength(ACCREDITATION_CONST.CODE.MAX_LENGTH)
  @IsString()
  @Matches(ACCREDITATION_CONST.CODE.REGEX)
  code: string;

  @IsNotEmpty()
  @MaxLength(ACCREDITATION_CONST.NAME.MAX_LENGTH)
  @IsString()
  @Matches(ACCREDITATION_CONST.NAME.REGEX)
  name: string;

  @IsNotEmpty()
  @MaxLength(ACCREDITATION_CONST.DESCRIPTION.MAX_LENGTH)
  @IsString()
  @Matches(ACCREDITATION_CONST.DESCRIPTION.REGEX)
  descript: string;

  @IsNotEmpty()
  @Max(ACCREDITATION_CONST.PERIODIC.MAX)
  @IsNumber()
  periodic: number;

  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  @IsNotEmpty()
  detail: DetailAccreditationRequestDto;
}
