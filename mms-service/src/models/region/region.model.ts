import { BaseModel } from '@core/model/base.model';

export interface RegionModel extends BaseModel {
  code: string;
  name: string;
  description: string;
  interRegionId: string;
}
