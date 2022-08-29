import { getMoList } from './../device-assignment/dto/request/get-mo-list.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProduceServiceInterface } from '@components/produce/interface/produce.service.interface';
import { lastValueFrom } from 'rxjs';
import { GetLogTimeByMoId } from '@components/device-assignment/dto/request/get-log-time-by-mo-id.dto';
import { isEmpty } from 'lodash';
import { ResponseCodeEnum } from '@constant/response-code.enum';

@Injectable()
export class ProduceService implements ProduceServiceInterface {
  constructor(
    @Inject('PRODUCE_SERVICE_CLIENT')
    private readonly produceServiceClient: ClientProxy,
  ) {}

  async getDetailWorkCenter(id: number): Promise<any> {
    const response = await lastValueFrom(
      this.produceServiceClient.send('work_center_detail', { id: id }),
    );

    const data = response.data;

    if (data) return data;
    return null;
  }

  async getWorkCenterByIds(ids: number[]): Promise<any[]> {
    const response = await lastValueFrom(
      this.produceServiceClient.send('get_work_center_by_ids', { ids }),
    );

    if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
      return [];
    }

    return response.data;
  }

  async getWorkCenters(params: any): Promise<any> {
    const response = await lastValueFrom(
      this.produceServiceClient.send('work_center_list', params),
    );

    const data = response.data;

    if (data) return data;

    return null;
  }

  async getDetailWorkOrder(id: number): Promise<any> {
    const res: any = await lastValueFrom(
      this.produceServiceClient.send('work_order_detail', { id }),
    );
    if (res.data) return res.data;
    return null;
  }

  async getMoList(request: getMoList): Promise<any> {
    const res: any = await lastValueFrom(
      this.produceServiceClient.send('get_mo_list', request),
    );
    if (res?.data) return res.data.items;
    return null;
  }

  async getLogTimeByMoId(payload: GetLogTimeByMoId): Promise<any> {
    const res = await lastValueFrom(
      this.produceServiceClient.send('get_log_time_by_mo_ids', {
        workCenterId: payload.wcId,
        ids: payload.moIds,
      }),
    );
    if (res?.data) return res.data;
    return null;
  }

  async getInfoOeeByMo(ids: string, workCenterId: number): Promise<any> {
    const res: any = await lastValueFrom(
      this.produceServiceClient.send('get_info_oee_by_mo', {
        ids,
        workCenterId,
      }),
    );

    if (!isEmpty(res?.data)) return res.data;
    return null;
  }
}
