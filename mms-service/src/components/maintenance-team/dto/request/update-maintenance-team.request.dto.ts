import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  Matches,
} from 'class-validator';
import { MAINTENANCE_TEAM_CONST } from '@components/maintenance-team/maintenance-team.constant';
import { MaintenanceTeamMemberRequestDto } from './maintenance-team-member.request.dto';
import { IsNoSqlId } from 'src/validator/is-nosql-id.validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class UpdateMaintenanceTeamBodyDto extends BaseDto {
  @ApiProperty({ example: 'ABC123', description: 'Tên của đội bảo trì' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(MAINTENANCE_TEAM_CONST.NAME.MAX_LENGTH)
  @Matches(MAINTENANCE_TEAM_CONST.NAME.REGEX)
  @IsNotBlank()
  name: string;

  @ApiProperty({ example: 'Mô tả', description: 'Mô tả' })
  @Expose()
  @IsOptional()
  @MaxLength(MAINTENANCE_TEAM_CONST.DESCRIPTION.MAX_LENGTH)
  description: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => MaintenanceTeamMemberRequestDto)
  members: MaintenanceTeamMemberRequestDto[];
}
export class UpdateMaintenanceTeamRequestDto extends UpdateMaintenanceTeamBodyDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNoSqlId()
  _id: string;
}
