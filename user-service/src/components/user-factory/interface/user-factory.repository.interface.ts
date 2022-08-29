import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { UserFactory } from '@entities/user-factory/user-factory.entity';

export interface UserFactoryRepositoryInterface
  extends BaseInterfaceRepository<UserFactory> {
  isExist(request: any): Promise<any>;
}
