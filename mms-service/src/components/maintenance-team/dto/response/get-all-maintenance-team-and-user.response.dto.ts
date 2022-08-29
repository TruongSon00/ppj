import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BaseResponseDto } from '@core/dto/base.response.dto';
import { GetUserListResponseDto } from '@components/user/dto/response/get-user-list.response.dto';
import { IsEnum } from 'class-validator';
import { ResponsibleSubjectType } from '@components/device/device.constant';
class MaintenanceTeam extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  type: number;
}
class UserList {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  type: number;
}

export class GetAllMaintenanceTeamAndUserResponseDto {
  @ApiProperty()
  @Expose()
  @Type(() => MaintenanceTeam)
  responsibleMaintenanceTeams: MaintenanceTeam[];

  @ApiProperty()
  @Expose()
  @Type(() => UserList)
  responsibleUsers: UserList[];
}
