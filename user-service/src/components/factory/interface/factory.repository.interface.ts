import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { Factory } from '@entities/factory/factory.entity';
import { CreateFactoryRequestDto } from '../dto/request/create-factory.request.dto';
import { GetListFactoryRequestDto } from '../dto/request/get-list-factory.request.dto';

export interface FactoryRepositoryInterface
  extends BaseInterfaceRepository<Factory> {
  createEntity(factoryDto: CreateFactoryRequestDto): Factory;
  updateEntity(
    updateEntity: Factory,
    factoryDto: CreateFactoryRequestDto,
  ): Factory;
  delete(id: number): Promise<any>;
  getDetail(id: number);
  getList(request: GetListFactoryRequestDto);
  getUserFactories(userId: number);
  findFactoriesByNameKeyword(condition: any): Promise<any>;
  getCount(): Promise<any>;
}
