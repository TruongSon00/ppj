import { Expose } from 'class-transformer';

export class GetMaintainRequestByAssignDeviceResponse {
  @Expose()
  id: string;

  @Expose()
  executionDate: string;

  @Expose()
  type: number;
}
