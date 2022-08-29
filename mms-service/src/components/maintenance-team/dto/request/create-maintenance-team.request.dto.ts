import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { MAINTENANCE_TEAM_CONST } from '@components/maintenance-team/maintenance-team.constant';
import { MaintenanceTeamMemberRequestDto } from './maintenance-team-member.request.dto';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class CreateMaintenanceTeamRequestDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(MAINTENANCE_TEAM_CONST.CODE.MAX_LENGTH)
  @Matches(MAINTENANCE_TEAM_CONST.CODE.REGEX)
  @IsNotBlank()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(MAINTENANCE_TEAM_CONST.NAME.MAX_LENGTH)
  @Matches(MAINTENANCE_TEAM_CONST.NAME.REGEX)
  @IsNotBlank()
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(MAINTENANCE_TEAM_CONST.DESCRIPTION.MAX_LENGTH)
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @IsArray()
  @Type(() => MaintenanceTeamMemberRequestDto)
  members: MaintenanceTeamMemberRequestDto[];
}
