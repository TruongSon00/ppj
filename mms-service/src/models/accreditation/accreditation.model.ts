import { BaseModel } from '@core/model/base.model';

class DetailAccreditation {
  title: string;
  descript: string;
  periodic: number;
  obligatory: boolean;
}

export interface Accreditation extends BaseModel {
  code: string;
  name: string;
  descript: string;
  periodic: number;
  active: boolean;
  details: DetailAccreditation[];
}
