import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetHistoryDetailResponseDto } from '@components/history/dto/response/get-history-detail.response.dto';
import { GetListMaintenanceTeamMemberResponseDto } from './get-list-maintenance-team-member.response.dto';
export class UpdateMaintenanceTeamResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  type: number;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  @Type(() => GetListMaintenanceTeamMemberResponseDto)
  members: GetListMaintenanceTeamMemberResponseDto[];

  @ApiProperty()
  @Expose()
  @Type(() => GetHistoryDetailResponseDto)
  histories: GetHistoryDetailResponseDto[];
}