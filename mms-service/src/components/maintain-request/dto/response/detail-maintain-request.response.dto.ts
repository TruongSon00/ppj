import { DetailDeviceAssignmentResponse } from '@components/device-assignment/dto/response/detail-device-assignment.response.dto';
import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { isEmpty, isNil } from 'lodash';

export class UserFactory {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  location: string;
}

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
  @Type(() => UserFactory)
  factories: UserFactory[];
}

class ItemUnitData {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;
}

class Supply extends BaseResponseDto {
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  quantity: number;

  @ApiProperty()
  @Expose()
  @Type(() => ItemUnitData)
  itemUnit: ItemUnitData;

  @ApiProperty()
  @Expose()
  quantityInStock: number;

  @ApiProperty()
  @Expose()
  maintainType: number;

  @ApiProperty()
  @Expose()
  description: number;
}

class Job extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  planFrom: Date;

  @ApiProperty()
  @Expose()
  planTo: Date;

  @ApiProperty()
  @Expose()
  maintenanceType: number;

  @ApiProperty()
  @Expose()
  description: string;
}

class MaintainRequestHistory {
  @Expose()
  userId: number;

  @Expose()
  userName: string;

  @Expose()
  action: string;

  @Expose()
  content: string;

  @Expose()
  createdAt: string;
}

export class DetailMaintainRequestResponseDto extends BaseResponseDto {
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
  completeExpectedDate: Date;

  @ApiProperty()
  @Expose()
  type: number;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  priority: number;

  @ApiProperty()
  @Expose()
  @Type(() => User)
  user: User;

  @ApiProperty()
  @Expose()
  @Transform((value) => (!isEmpty(value.value) ? value.value[0] : null))
  @Type(() => DetailDeviceAssignmentResponse)
  deviceAssignment: DetailDeviceAssignmentResponse;

  @ApiProperty()
  @Expose()
  executionDate: Date;

  @ApiProperty()
  @Expose()
  @Type(() => Supply)
  supplies: Supply[];

  @ApiProperty()
  @Expose()
  @Type(() => Supply)
  actualSupplies: Supply[];

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  @Transform((value) => (!isEmpty(value.value) ? value.value : null))
  @Type(() => Job)
  job: Job;

  @ApiProperty()
  @Expose()
  @Type(() => MaintainRequestHistory)
  histories: MaintainRequestHistory[];

  @ApiProperty()
  @Expose()
  expectedMaintainTime: number;
}
