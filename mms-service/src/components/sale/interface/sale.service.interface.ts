import { CreatePurchasedOrderDto } from '../dto/create-purchase-order.request';

export interface SaleServiceInterface {
  createPO(request: CreatePurchasedOrderDto): Promise<any>;
  getVendorDetail(id: number): Promise<any>;
  getVendorsByIds(ids: number[]): Promise<any>;
}
