import { Inject, Injectable } from '@nestjs/common';
import { CreateAccreditationRequestDto } from './dto/request/createAccreditation.dto';
import { UpdateAccreditationRequestDto } from './dto/request/updateAccreditation.dto';
import { AccreditationRepositoryInterface } from './interface/accreditation.repository.interface';
import { AccreditationServiceInterface } from './interface/accreditotion.service.interface';

@Injectable()
export class AccreditationService implements AccreditationServiceInterface {
  constructor(
    @Inject('IAccreditationRepository')
    private readonly accreditationRepository: AccreditationRepositoryInterface,
  ) {}
  create(request: CreateAccreditationRequestDto): Promise<any> {
    throw new Error('Method not implemented.');
  }
  update(request: UpdateAccreditationRequestDto): Promise<any> {
    throw new Error('Method not implemented.');
  }
  delete(request: CreateAccreditationRequestDto): Promise<any> {
    throw new Error('Method not implemented.');
  }
  getList(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  detail(request: CreateAccreditationRequestDto): Promise<any> {
    throw new Error('Method not implemented.');
  }
  search(request: CreateAccreditationRequestDto): Promise<any> {
    throw new Error('Method not implemented.');
  }
  change(request: CreateAccreditationRequestDto): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
