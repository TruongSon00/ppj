import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, Matches, MaxLength } from 'class-validator';
import { SUPPLY_GROUP_CONST } from '@components/supply-group/supply-group.constant';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';
import { BaseDto } from '@core/dto/base.dto';

export class UpdateSupplyGroupRequestBodyDto extends BaseDto {
  @ApiProperty({ example: 'ABC123', description: 'Tên của nhóm vật tư' })
  @IsNotEmpty()
  @MaxLength(SUPPLY_GROUP_CONST.NAME.MAX_LENGTH)
  @Matches(SUPPLY_GROUP_CONST.NAME.REGEX)
  @IsNotBlank()
  name: string;

  @ApiProperty({ example: 'Mô tả', description: 'Mô tả' })
  @MaxLength(SUPPLY_GROUP_CONST.DESCRIPTION.MAX_LENGTH)
  description: string;
}
export class UpdateSupplyGroupRequestDto extends UpdateSupplyGroupRequestBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
