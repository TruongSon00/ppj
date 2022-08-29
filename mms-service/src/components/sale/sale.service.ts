import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePurchasedOrderDto } from './dto/create-purchase-order.request';
import { SaleServiceInterface } from './interface/sale.service.interface';

@Injectable()
export class SaleService implements SaleServiceInterface {
  constructor(
    @Inject('SALE_SERVICE_CLIENT')
    private readonly saleServiceClient: ClientProxy,
  ) {}
  async createPO(request: CreatePurchasedOrderDto): Promise<any> {
    try {
      return await this.saleServiceClient
        .send('create_purchased_order', request)
        .toPromise();
    } catch (err) {
      return err;
    }
  }

  async getVendorDetail(id: number): Promise<any> {
    const res = await this.saleServiceClient
      .send('get_vendor', { id })
      .toPromise();
    return res?.data ?? null;
  }

  async getVendorsByIds(ids: number[]): Promise<any> {
    const res = await this.saleServiceClient
      .send('get_vendor_by_ids', { ids })
      .toPromise();
    if (res.statusCode !== ResponseCodeEnum.SUCCESS) return [];
    return res.data;
  }
}
