import { Inject, Injectable } from '@nestjs/common';
import { ProduceServiceInterface } from '@components/produce/interface/produce.service.interface';
import { ClientProxy } from '@nestjs/microservices';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { keyBy } from 'lodash';

@Injectable()
export class ProduceService implements ProduceServiceInterface {
  constructor(
    @Inject('PRODUCE_SERVICE_CLIENT')
    private readonly produceServiceClient: ClientProxy,
  ) {}

  public async getFactoryIdsBySaleOrderIds(
    saleOrderIds: number[],
  ): Promise<any> {
    const payload = {
      saleOrderIds,
    };
    const response = await this.produceServiceClient
      .send('get_factory_ids_by_sale_order_ids', payload)
      .toPromise();

    if (response.statusCode !== ResponseCodeEnum.SUCCESS) return [];
    return response.data;
  }
}
