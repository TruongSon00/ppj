import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { MAINTENANCE_TEAM_CONST } from '@components/maintenance-team/maintenance-team.constant';
import { IsNoSqlId } from '../../../../validator/is-nosql-id.validator';
import { IsSqlId } from '../../../../validator/is-sql-id.validator';
import { MAINTENANCE_ATTRIBUTE_CONST } from '@components/maintenance-attribute/maintenance-attribute.constant';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class UpdateMaintenanceAttributeBody extends BaseDto {
  @ApiProperty({ example: 'ABC123', description: 'Tên của thuộc tính bảo trì' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(MAINTENANCE_ATTRIBUTE_CONST.NAME.MAX_LENGTH)
  @Matches(MAINTENANCE_ATTRIBUTE_CONST.NAME.REGEX)
  @IsNotBlank()
  name: string;

  @ApiProperty({ example: 'Mô tả', description: 'Mô tả' })
  @Expose()
  @IsOptional()
  @MaxLength(MAINTENANCE_TEAM_CONST.DESCRIPTION.MAX_LENGTH)
  description: string;

  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  @IsSqlId()
  userId: number;
}
export class UpdateMaintenanceAttributeRequestDto extends UpdateMaintenanceAttributeBody {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNoSqlId()
  _id: string;
}
