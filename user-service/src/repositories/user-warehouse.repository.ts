import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { UserWarehouse } from '@entities/user-warehouse/user-warehouse.entity';
import { UserWarehouseRepositoryInterface } from '@components/user-warehouse/interface/user-warehouse.interface';
import { GetWarehouseByUserRequest } from '@components/user-warehouse/dto/request/get-warehouse-by-user.request.dto';

@Injectable()
export class UserWarehouseRepository
  extends BaseAbstractRepository<UserWarehouse>
  implements UserWarehouseRepositoryInterface
{
  constructor(
    @InjectRepository(UserWarehouse)
    private readonly userWarehouseRepository: Repository<UserWarehouse>,
  ) {
    super(userWarehouseRepository);
  }

  public async getWarehousesByUserId(
    request: GetWarehouseByUserRequest,
  ): Promise<[data: any[], count: number]> {
    const query = this.userWarehouseRepository
      .createQueryBuilder('uw')
      .select(['uw.warehouse_id AS "warehouseId"'])
      .where('uw.user_id = :userId', { userId: request.userId });

    const data = parseInt(request.isGetAll)
      ? await query.getRawMany()
      : await query.offset(request.skip).limit(request.take).getRawMany();
    const count = await query.getCount();

    return [data, count];
  }
}
