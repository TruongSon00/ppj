import { BaseModel } from '@core/model/base.model';
import { FilterQuery } from 'mongoose';

export interface BaseInterfaceRepository<T extends BaseModel> {
  create(data: T | any): Promise<T>;

  findOneById(id: number | string): Promise<T>;

  findOneByCondition(filterCondition: any): Promise<T>;

  findOneByCode(code: string): Promise<T>;

  findAll(): Promise<T[]>;

  findByIdAndUpdate(id: string, data: T | any): Promise<T>;

  deleteById(id: string): Promise<any>;

  updateById(id: string, data: T | any): Promise<any>;

  findAllByCondition(condition: any): Promise<T[]>;

  createMany(data: T | any): Promise<any>;

  softDelete(id: string): Promise<any>;

  count(condition?: any): Promise<number>;

  updateManyByCondition(condition: any, dataUpdate: any): Promise<any>;

  findAllWithPopulate(
    condition: any,
    populate: any,
    skip?: number,
    limit?: number,
  ): Promise<T[]>;

  findOneWithPopulate(condition: FilterQuery<T>, populate: any): Promise<T>;
}
