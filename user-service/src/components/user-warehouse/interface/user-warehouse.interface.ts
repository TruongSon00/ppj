import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { UserWarehouse } from '@entities/user-warehouse/user-warehouse.entity';
import { GetWarehouseByUserRequest } from '../dto/request/get-warehouse-by-user.request.dto';

export interface UserWarehouseRepositoryInterface
  extends BaseInterfaceRepository<UserWarehouse> {
  getWarehousesByUserId(
    request: GetWarehouseByUserRequest,
  ): Promise<[data: any[], count: number]>;
}
