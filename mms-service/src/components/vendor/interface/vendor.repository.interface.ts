import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { VendorModel } from 'src/models/vendor/vendor.model';
import { GetListVendorRequestDto } from '../dto/request/get-list-vendor.request.dto';

export interface VendorRepositoryInterface
  extends BaseInterfaceRepository<VendorModel> {
  list(request: GetListVendorRequestDto): Promise<any>;
  import(bulkOps: any): Promise<any>;
}
