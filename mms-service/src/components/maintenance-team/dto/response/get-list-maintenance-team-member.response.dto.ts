import { MaintenanceTeamMemberRoleConstant } from '@components/maintenance-team/maintenance-team.constant';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class GetListMaintenanceTeamMemberResponseDto {
  @ApiProperty()
  @Transform(({ obj }) => obj?.userId)
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  @IsEnum(MaintenanceTeamMemberRoleConstant)
  role: number;
}
