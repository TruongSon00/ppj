import { BaseModel } from '@core/model/base.model';
import { FilterQuery, Model } from 'mongoose';
import { BaseInterfaceRepository } from './base.interface.repository';

export abstract class BaseAbstractRepository<T extends BaseModel>
  implements BaseInterfaceRepository<T>
{
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async create(data: T | any): Promise<T> {
    return await this.model.create(data);
  }

  public async findOneById(id: string): Promise<T> {
    return await this.model.findOne({
      _id: id,
      deletedAt: null,
    } as any);
  }

  public async findOneByCode(code: string): Promise<T> {
    return await this.model.findOne({
      code: code,
      deletedAt: null,
    } as FilterQuery<T>);
  }

  public async findOneByCondition(filterCondition: any): Promise<T> {
    const condition = filterCondition?.id
      ? {
          ...filterCondition,
          _id: filterCondition?.id,
          deletedAt: null,
        }
      : { ...filterCondition, deletedAt: null };
    return await this.model.findOne(condition);
  }

  public async findAllByCondition(condition: any): Promise<T[]> {
    return await this.model.find({ ...condition, deletedAt: null });
  }

  public async deleteById(id: T | any): Promise<any> {
    return await this.model.deleteOne({ _id: id });
  }

  public async findAll(): Promise<T[]> {
    return await this.model.find({
      deletedAt: null,
    });
  }

  public async findByIdAndUpdate(id: string, data: T | any): Promise<any> {
    return await this.model.findByIdAndUpdate({ _id: id }, data);
  }

  public async updateById(id: T | any, data: T | any): Promise<any> {
    return await this.model.updateOne({ _id: id }, data);
  }

  public async createMany(data: T | any): Promise<any> {
    return await this.model.insertMany(data);
  }

  public async softDelete(id: string): Promise<any> {
    return await this.model.remove(id);
  }

  public async findAllWithPopulate(
    condition: any,
    populate: any,
    skip?: number,
    limit?: number,
  ): Promise<T[]> {
    const query = this.model.find(condition).populate(populate);
    if (skip) {
      query.skip(skip);
    }
    if (limit) {
      query.limit(limit);
    }
    return await query.lean();
  }

  public async findOneWithPopulate(
    condition: FilterQuery<T>,
    populate: any,
  ): Promise<T> {
    return await this.model.findOne(condition).populate(populate).lean();
  }

  public async count(condition?: any): Promise<number> {
    return await this.model.count(condition).exec();
  }

  public async updateManyByCondition(
    condition: any,
    dataUpdate: any,
  ): Promise<any> {
    return await this.model.updateMany(condition, dataUpdate).exec();
  }
}
