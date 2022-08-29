import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class User {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  fullName: string;

  @ApiProperty()
  @Expose()
  phone: number;

  @ApiProperty()
  @Expose()
  factory: string;

  @ApiProperty()
  @Expose()
  workCenter: string;
}

export class ResponsibleUser {
  @ApiProperty()
  @Expose()
  id: number | string;

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

export class ListDevicesAppResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  deviceAssignId: string;

  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  serial: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  estimatedMaintenance: number;

  @ApiProperty()
  @Expose()
  @Type(() => User)
  assignmentUser: User;

  @ApiProperty()
  @Expose()
  type?: number;

  @ApiProperty()
  @Expose()
  @Type(() => ResponsibleUser)
  responsibleUser: ResponsibleUser;
}
