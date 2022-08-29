import { UserFactoryRepositoryInterface } from '@components/user-factory/interface/user-factory.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { UserFactory } from '@entities/user-factory/user-factory.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserFactoryRepository
  extends BaseAbstractRepository<UserFactory>
  implements UserFactoryRepositoryInterface
{
  constructor(
    @InjectRepository(UserFactory)
    private readonly userFactoryRepository: Repository<UserFactory>,
  ) {
    super(userFactoryRepository);
  }
  async isExist(request: any): Promise<any> {
    return await this.userFactoryRepository.find({
      where: { factoryId: request.factoryId, userId: request.userId },
    });
  }
}
