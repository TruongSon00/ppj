import { GetListSupplyGroupRequestDto } from '@components/supply-group/dto/request/get-list-supply-group.request.dto';
import { UpdateSupplyGroupRequestDto } from '@components/supply-group/dto/request/update-supply-group.request.dto';
import { DetailSupplyGroupRequestDto } from '../dto/request/detail-supply-group.request.dto';
import { UpdateUnitActiveStatusPayload } from '@components/unit/dto/request/update-unit-status.request';

export interface SupplyGroupServiceInterface {
  getList(request: GetListSupplyGroupRequestDto): Promise<any>;
  create(payload: any): Promise<any>;
  detail(request: DetailSupplyGroupRequestDto): Promise<any>;
  update(request: UpdateSupplyGroupRequestDto): Promise<any>;
  createMany(
    request: any,
    userId: number,
  ): Promise<{ dataSuccess: any[]; dataError: any[] }>;
  updateStatus(request: UpdateUnitActiveStatusPayload): Promise<any>;
}
