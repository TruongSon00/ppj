import { DetailVendorRequestDto } from '../dto/request/detail-vendor.request.dto';
import { GetListVendorRequestDto } from '../dto/request/get-list-vendor.request.dto';

export interface VendorServiceInterface {
  getList(request: GetListVendorRequestDto): Promise<any>;
  detail(request: DetailVendorRequestDto): Promise<any>;
  import(data: any): Promise<{ dataSuccess: any[]; dataError: any[] }>;
}
