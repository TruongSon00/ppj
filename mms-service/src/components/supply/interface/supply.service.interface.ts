import { GetListSupplyRequestDto } from '@components/supply/dto/request/get-list-supply.request.dto';
import { ResponsePayload } from '@utils/response-payload';
import { GetDetailSupplyResponseDto } from '@components/supply/dto/response/get-detail-supply.response.dto';
import { UpdateSupplyRequestDto } from '@components/supply/dto/request/update-supply.request.dto';
import { ExportSupplyRequestDto } from '@components/supply/dto/request/export-supply.request.dto';
import { DeleteSupplyRequestDto } from '../dto/request/delete-supply.request.dto';

export interface SupplyServiceInterface {
  create(payload: any): Promise<any>;
  getList(request: GetListSupplyRequestDto): Promise<any>;
  detail(
    id: string,
  ): Promise<ResponsePayload<GetDetailSupplyResponseDto | any>>;
  delete(request: DeleteSupplyRequestDto): Promise<any>;
  update(request: UpdateSupplyRequestDto): Promise<any>;
  checkSupplyGroupExist(id: string): Promise<any>;
  confirm(request: any): Promise<any>;
  exportSupply(request: ExportSupplyRequestDto): Promise<any>;
  createMany(
    data: any,
    userId: number,
  ): Promise<{ dataSuccess: any[]; dataError: any[] }>;
}
