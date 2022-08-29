import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';
export class RejectWarningBodyDto extends BaseDto {
  @ApiProperty({ example: 'reason' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @IsNotBlank()
  reason: string;
}
export class RejectWarningRequestDto extends RejectWarningBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
