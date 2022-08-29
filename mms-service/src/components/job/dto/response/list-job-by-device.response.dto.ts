import { DetailDeviceAssignmentResponse } from '@components/device-assignment/dto/response/detail-device-assignment.response.dto';
import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { isEmpty } from 'lodash';

class MaintainRequest extends BaseResponseDto {
  @ApiProperty({})
  @Expose()
  code: string;

  @Expose()
  @ApiProperty({ example: 'Maintain Request' })
  name: string;

  @Expose()
  @ApiProperty({ example: 1 })
  prioriry: number;

  @Expose()
  @ApiProperty({ example: '' })
  description: string;

  @Expose()
  @ApiProperty({ example: '2021-11-30T00:00:00.000Z' })
  completeExpectedDate: Date;

  @ApiProperty({ type: DetailDeviceAssignmentResponse })
  @Expose()
  @Transform((value) => (!isEmpty(value.value) ? value.value[0] : null))
  @Type(() => DetailDeviceAssignmentResponse)
  deviceAssignment: DetailDeviceAssignmentResponse;
}

class WarningItem extends BaseResponseDto {
  @Expose()
  @ApiProperty({})
  name: string;

  @Expose()
  @ApiProperty({})
  prioriry: number;

  @Expose()
  @ApiProperty({})
  status: number;

  @Expose()
  @ApiProperty({})
  type: number;

  @Expose()
  @ApiProperty({})
  description: string;

  @Expose()
  @ApiProperty({})
  completeExpectedDate: Date;

  @ApiProperty({ type: DetailDeviceAssignmentResponse })
  @Expose()
  @Transform((value) => (!isEmpty(value.value) ? value.value[0] : null))
  @Type(() => DetailDeviceAssignmentResponse)
  deviceAssignment: DetailDeviceAssignmentResponse;
}

class CheckListTemplateItem extends BaseResponseDto {
  @Expose()
  @ApiProperty({})
  name: string;

  @Expose()
  @ApiProperty({})
  status: number;

  @Expose()
  @ApiProperty({})
  checkType: number;

  @Expose()
  @ApiProperty({})
  description: string;

  @Expose()
  @ApiProperty({})
  completeExpectedDate: Date;

  @ApiProperty({ type: DetailDeviceAssignmentResponse })
  @Expose()
  @Transform((value) => (!isEmpty(value.value) ? value.value[0] : null))
  @Type(() => DetailDeviceAssignmentResponse)
  deviceAssignment: DetailDeviceAssignmentResponse;
}

class MaintainancePeriodItem extends BaseResponseDto {
  @Expose()
  @ApiProperty({})
  name: string;

  @Expose()
  @ApiProperty({})
  status: number;

  @Expose()
  @ApiProperty({})
  priority: number;

  @Expose()
  @ApiProperty({})
  description: string;

  @Expose()
  @ApiProperty({})
  completeExpectedDate: Date;

  @ApiProperty({ type: DetailDeviceAssignmentResponse })
  @Expose()
  @Transform((value) => (!isEmpty(value.value) ? value.value[0] : null))
  @Type(() => DetailDeviceAssignmentResponse)
  deviceAssignment: DetailDeviceAssignmentResponse;
}

export class ScanJobByDeviceResponse extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  planDate: Date;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  status: string;

  @Expose()
  @ApiProperty({ type: MaintainRequest })
  @Transform((value) => (!isEmpty(value.value) ? value.value[0] : null))
  @Type(() => MaintainRequest)
  maintainRequest: MaintainRequest;

  @Expose()
  @ApiProperty({ type: WarningItem })
  @Transform((value) => (!isEmpty(value.value) ? value.value[0] : null))
  @Type(() => WarningItem)
  warning: WarningItem;

  @Expose()
  @ApiProperty({ type: CheckListTemplateItem })
  @Transform((value) => (!isEmpty(value.value) ? value.value[0] : null))
  @Type(() => CheckListTemplateItem)
  checklistTemplate: CheckListTemplateItem;

  @Expose()
  @ApiProperty({ type: MaintainancePeriodItem })
  @Transform((value) => (!isEmpty(value.value) ? value.value[0] : null))
  @Type(() => MaintainancePeriodItem)
  maintenancePeriodWarning: MaintainancePeriodItem;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
