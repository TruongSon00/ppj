import { Expose } from 'class-transformer';
import { ImportResultBaseDto } from '@components/import/dto/response/import-result.base.dto';

export class ImportDeviceResultDto extends ImportResultBaseDto {
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
  isForManufacturing: boolean;

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
