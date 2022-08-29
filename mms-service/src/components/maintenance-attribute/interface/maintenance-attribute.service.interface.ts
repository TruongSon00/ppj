import { GetListMaintenanceAttributeRequestDto } from '@components/maintenance-attribute/dto/request/get-list-maintenance-attribute.request.dto';
import { UpdateMaintenanceAttributeRequestDto } from '@components/maintenance-attribute/dto/request/update-maintenance-attribute.request.dto';
import { GetDetailMaintenanceAttributeResponseDto } from '@components/maintenance-attribute/dto/response/get-detail-maintenance-attribute.response.dto';
import { ResponsePayload } from '@utils/response-payload';
import { DeleteMaintenanceAttributeRequestDto } from '../dto/request/delete-maintenance-attribute.request.dto';
import { DetailMaintenanceAttributeRequestDto } from '../dto/request/detail-maintenance-attribute.request.dto';

export interface MaintenanceAttributeServiceInterface {
  create(payload: any): Promise<any>;
  getList(request: GetListMaintenanceAttributeRequestDto): Promise<any>;
  detail(request: DetailMaintenanceAttributeRequestDto): Promise<any>;
  update(request: UpdateMaintenanceAttributeRequestDto): Promise<any>;
  delete(request: DeleteMaintenanceAttributeRequestDto): Promise<any>;
  findOneByCode(code: string): Promise<any>;
  findOneByCondition(
    condition: any,
  ): Promise<ResponsePayload<GetDetailMaintenanceAttributeResponseDto>>;
  createMany(
    data: any,
    userId: number,
  ): Promise<{ dataSuccess: any[]; dataError: any[] }>;
}
