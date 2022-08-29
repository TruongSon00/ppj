import { ApiProperty } from '@nestjs/swagger';
import { PagingResponse } from '@utils/paging.response';
import { SuccessResponse } from '@utils/success.response.dto';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';


class Device {
  @Expose()
  @ApiProperty({})
  id: string;

  @Expose()
  @ApiProperty({})
  code: string;

  @Expose()
  @ApiProperty({})
  name: string;

  @Expose()
  @ApiProperty({ example: 1 })
  status: number;
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
  companyName: string;

  @ApiProperty()
  @Expose()
  address: string;
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
export class DetailDeviceAssignmentResponse {
  @ApiProperty({})
  @Expose()
  userId: string;

  @ApiProperty({})
  @Expose()
  status: number;

  @ApiProperty({})
  @Expose()
  serial: string;

  @ApiProperty({})
  @Expose()
  deviceId: string;

  @ApiProperty()
  @Expose()
  factoryId: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @Expose()
  @ApiProperty({ type: Device })
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
}
class MaintainRequest {
  @Expose()
  @ApiProperty({ example: '01' })
  id: string;

  @Expose()
  @ApiProperty({ example: '01' })
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

  @Expose()
  @ApiProperty({ type: DetailDeviceAssignmentResponse })
  @Type(() => DetailDeviceAssignmentResponse)
  deviceAssignment: DetailDeviceAssignmentResponse;
}

class MaintenancePeriodWarningItem {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  priority: number;

  @ApiProperty()
  @Expose()
  completeExpectedDate: Date;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  @Type(() => DetailDeviceAssignmentResponse)
  deviceAssignment: DetailDeviceAssignmentResponse;
}

export class WarningItemResponse {
  @ApiProperty({})
  @Expose()
  id: string;

  @ApiProperty({})
  @Expose()
  completeExpectedDate: Date;

  @ApiProperty({})
  @Expose()
  description: string;

  @ApiProperty({})
  @Expose()
  status: number;

  @ApiProperty({})
  @Expose()
  priority: number;

  @ApiProperty({})
  @Expose()
  code: string;

  @ApiProperty({})
  @Expose()
  executionDate: Date;

  @ApiProperty({})
  @Expose()
  type: number;

  @ApiProperty({ type: DetailDeviceAssignmentResponse })
  @Expose()
  @Type(() => DetailDeviceAssignmentResponse)
  deviceAssignment: DetailDeviceAssignmentResponse;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}

export class CheckListTemplateItem {
  @ApiProperty()
  @Expose()
  id: number;

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
  checkType: string;

  @ApiProperty()
  @Expose()
  priority: number;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty({})
  @Expose()
  @Type(() => DetailDeviceAssignmentResponse)
  deviceAssignment: DetailDeviceAssignmentResponse;
}

class Job {
  @Expose()
  @ApiProperty({ example: '01' })
  id: number;

  @Expose()
  @ApiProperty({ example: '01' })
  code: string;

  @Expose()
  @ApiProperty({ example: 'Sua ban phim' })
  name: string;

  @Expose()
  @ApiProperty({ example: 1 })
  status: number;

  @Expose()
  @ApiProperty({ example: '2021-11-30T00:00:00.000Z' })
  planDate: Date;

  @Expose()
  @ApiProperty({ example: 1 })
  type: number;

  @Expose()
  @ApiProperty({ type: MaintainRequest })
  @Type(() => MaintainRequest)
  maintainRequest: MaintainRequest;

  @ApiProperty({ type: CheckListTemplateItem })
  @Expose()
  @Type(() => CheckListTemplateItem)
  checklistTemplate: CheckListTemplateItem;

  @ApiProperty({ type: WarningItemResponse })
  @Expose()
  @Type(() => WarningItemResponse)
  warning: WarningItemResponse;

  @ApiProperty({ type: MaintenancePeriodWarningItem })
  @Expose()
  @Type(() => MaintenancePeriodWarningItem)
  maintenancePeriodWarning: MaintenancePeriodWarningItem;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}

export class ListJob extends PagingResponse {
  @Expose()
  @ApiProperty({ type: Job, isArray: true })
  @Type(() => Job)
  @IsArray()
  items: Job[];
}

export class ListJobByDeviceResponse extends SuccessResponse {
  @Expose()
  @ApiProperty({ type: ListJob })
  @Type(() => Job)
  data: ListJob;
}
