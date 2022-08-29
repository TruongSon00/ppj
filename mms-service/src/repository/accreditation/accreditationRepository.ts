import { AccreditationRepositoryInterface } from '@components/accreditation/interface/accreditation.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Accreditation } from 'src/models/accreditation/accreditation.model';

@Injectable()
export class AccreditationRepository
  extends BaseAbstractRepository<Accreditation>
  implements AccreditationRepositoryInterface
{
  constructor(
    @InjectModel('Accreditation')
    private readonly accreditation: Model<Accreditation>,
  ) {
    super(accreditation);
  }
  createEntity(request: any): Accreditation {
    const { code, name, descript, periodic, active, details } = request;
    const newAccreditation = new this.accreditation();
    newAccreditation.code = code;
    newAccreditation.name = name;
    newAccreditation.descript = descript;
    newAccreditation.periodic = periodic;
    newAccreditation.active = active;
    newAccreditation.details = details;

    return newAccreditation;
  }
  async search(key: any): Promise<Accreditation[]> {
    return await this.accreditation.find({ name: key });
  }
}
