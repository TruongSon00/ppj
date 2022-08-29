import { UserFactory } from './../../../maintain-request/dto/response/detail-maintain-request.response.dto';
import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { isEmpty } from 'lodash';

export class User {
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
  phone: string;

  @ApiProperty()
  @Expose()
  companyName: string;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  @Type(() => UserFactory)
  factories: UserFactory[];
}

export class FactoryItem {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  location: string;

  @ApiProperty()
  @Expose()
  companyId: number;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  status: number;
}
class Device extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  status: number;
}

class WorkCenter {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

export class DetailDeviceAssignmentResponse extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  serial: string;

  @ApiProperty()
  @Expose()
  factoryId: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  @Transform((value) => {
    return !isEmpty(value?.value) ? value.value[0] : null;
  })
  @Type(() => Device)
  device: Device;

  @ApiProperty()
  @Expose()
  @Type(() => User)
  user: User;

  @ApiProperty({ type: FactoryItem })
  @Expose()
  @Type(() => FactoryItem)
  factory: FactoryItem;

  @ApiProperty({ type: WorkCenter })
  @Expose()
  @Type(() => WorkCenter)
  workCenter: WorkCenter;

  @ApiProperty()
  @Expose()
  @Type(() => User)
  @Transform((value) => value?.value ?? null)
  responsibleUser: User;

  @ApiProperty()
  @Expose()
  @Transform(() => 'Ha Noi')
  location: string;

  @ApiProperty()
  @Expose()
  workTimeDataSource: number;

  @ApiProperty()
  @Expose()
  productivityTarget: number;
}
