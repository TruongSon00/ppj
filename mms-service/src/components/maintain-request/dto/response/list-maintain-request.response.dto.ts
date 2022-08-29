import { DetailDeviceAssignmentResponse } from '@components/device-assignment/dto/response/detail-device-assignment.response.dto';
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
  name: string;

  @ApiProperty()
  @Expose()
  fullName: string;
}

class Supply {
  @ApiProperty()
  @Expose()
  supplyId: string;

  @ApiProperty()
  @Expose()
  quantity: number;
}

export class ListMaintainRequestResponseDto extends BaseResponseDto {
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
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  expectedMaintainTime: number;
}
