import { CreateAccreditationRequestDto } from '../dto/request/createAccreditation.dto';
import { UpdateAccreditationRequestDto } from '../dto/request/updateAccreditation.dto';

export interface AccreditationServiceInterface {
  create(request: CreateAccreditationRequestDto): Promise<any>;
  update(request: UpdateAccreditationRequestDto): Promise<any>;
  delete(request: CreateAccreditationRequestDto): Promise<any>;
  getList(): Promise<any>;
  detail(request: CreateAccreditationRequestDto): Promise<any>;
  search(request: CreateAccreditationRequestDto): Promise<any>;
  change(request: CreateAccreditationRequestDto): Promise<any>;
}
