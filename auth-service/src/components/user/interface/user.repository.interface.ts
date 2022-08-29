import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { UserEntity } from '@entities/user/user.entity';

export interface UserRepositoryInterface
  extends BaseInterfaceRepository<UserEntity> {
  validateUser(username: string, password: string): Promise<any>;
}
