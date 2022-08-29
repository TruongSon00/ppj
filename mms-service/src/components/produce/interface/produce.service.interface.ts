import { GetLogTimeByMoId } from '@components/device-assignment/dto/request/get-log-time-by-mo-id.dto';
import { getMoList } from '@components/device-assignment/dto/request/get-mo-list.dto';

export interface ProduceServiceInterface {
  getDetailWorkCenter(id: number): Promise<any>;
  getWorkCenters(params: any): Promise<any>;
  getDetailWorkOrder(id: number): Promise<any>;
  getMoList(request: getMoList): Promise<any>;
  getLogTimeByMoId(payload: GetLogTimeByMoId): Promise<any>;
  getWorkCenterByIds(ids: number[]): Promise<any[]>;
}
