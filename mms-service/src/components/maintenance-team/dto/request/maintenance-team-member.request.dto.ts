import { MaintenanceTeamMemberRoleConstant } from '@components/maintenance-team/maintenance-team.constant';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export class MaintenanceTeamMemberRequestDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  @IsEnum(MaintenanceTeamMemberRoleConstant)
  role: number;
}
