import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BaseResponseDto } from '@core/dto/base.response.dto';
import { GetListMaintenanceTeamMemberResponseDto } from './get-list-maintenance-team-member.response.dto';

export class CreateMaintenanceTeamResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  type: number;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  @Type(() => GetListMaintenanceTeamMemberResponseDto)
  members: GetListMaintenanceTeamMemberResponseDto[];
}
