import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { GeneralMaintenanceParameter } from '../../models/general-maintenance-parameter/general-maintenance-parameter.model';
import { GeneralMaintenanceParameterRepositoryInterface } from '@components/general-maintenance-parameter/interface/general-maintenance-parameter.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GeneralMaintenanceParameterRepository
  extends BaseAbstractRepository<GeneralMaintenanceParameter>
  implements GeneralMaintenanceParameterRepositoryInterface
{
  constructor(
    @InjectModel('GeneralMaintenanceParameter')
    private readonly generalMaintenanceParameterModel: Model<GeneralMaintenanceParameter>,
  ) {
    super(generalMaintenanceParameterModel);
  }

  createDocument(param: any): GeneralMaintenanceParameter {
    const document = new this.generalMaintenanceParameterModel();
    document.time = param.time;
    return document;
  }
  async update(param: any): Promise<any> {
    const result =
      await this.generalMaintenanceParameterModel.findByIdAndUpdate(param._id, {
        time: param.time,
      });
    return await result.save();
  }
}
