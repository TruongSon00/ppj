import { Controller, Inject, Injectable } from '@nestjs/common';
import { AccreditationServiceInterface } from './interface/accreditotion.service.interface';

@Injectable()
@Controller('accreditation')
export class AccreditationController {
  constructor(
    @Inject('IAccreditationService')
    private readonly accreditation: AccreditationServiceInterface,
  ) {}
}
