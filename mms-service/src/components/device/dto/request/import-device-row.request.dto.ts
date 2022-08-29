import { ImportBaseDto } from '@components/import/dto/request/import.base.dto';
import { Expose } from 'class-transformer';

export class ImportDeviceRowRequestDto extends ImportBaseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  deviceGroupName: string;

  @Expose()
  isForManufacturing: string;

  @Expose()
  maintenanceAttributeName: string;

  @Expose()
  frequency: number;

  @Expose()
  periodicInspectionTime: number;

  @Expose()
  responsibleUser: string;

  @Expose()
  responsibleMaintenanceTeam: string;
}
