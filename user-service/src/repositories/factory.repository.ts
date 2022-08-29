import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { escapeCharForSearch } from './../utils/common';
import { Factory } from '@entities/factory/factory.entity';
import { FactoryRepositoryInterface } from '@components/factory/interface/factory.repository.interface';
import { CreateFactoryRequestDto } from '@components/factory/dto/request/create-factory.request.dto';
import { GetListFactoryRequestDto } from '@components/factory/dto/request/get-list-factory.request.dto';
import { isEmpty } from 'lodash';

@Injectable()
export class FactoryRepository
  extends BaseAbstractRepository<Factory>
  implements FactoryRepositoryInterface
{
  constructor(
    @InjectRepository(Factory)
    private readonly factoryRepository: Repository<Factory>,
  ) {
    super(factoryRepository);
  }

  public async findFactoriesByNameKeyword(nameKeyword: any): Promise<any> {
    const condition: any = {
      where:
        `LOWER(unaccent(name)) LIKE ` +
        `LOWER(unaccent('%${escapeCharForSearch(nameKeyword)}%')) escape '\\'`,
    };
    return await this.factoryRepository.findOne(condition);
  }

  public createEntity(factoryDto: CreateFactoryRequestDto): Factory {
    const factoryEntity = new Factory();

    factoryEntity.companyId = factoryDto.companyId;
    factoryEntity.regionId = factoryDto.regionId;
    factoryEntity.name = factoryDto.name;
    factoryEntity.code = factoryDto.code;
    factoryEntity.description = factoryDto.description;
    factoryEntity.phone = factoryDto.phone;
    factoryEntity.location = factoryDto.location;
    factoryEntity.createdBy = factoryDto.userId;

    return factoryEntity;
  }

  public updateEntity(
    updateEntity: Factory,
    request: CreateFactoryRequestDto,
  ): Factory {
    if (request.name !== undefined) updateEntity.name = request.name;
    updateEntity.code = request.code;
    updateEntity.companyId = request.companyId;
    updateEntity.regionId = request.regionId;
    if (request.description !== undefined)
      updateEntity.description = request.description;
    if (request.location !== undefined)
      updateEntity.location = request.location;
    if (request.phone !== undefined) updateEntity.phone = request.phone;
    return updateEntity;
  }

  public async delete(id: number): Promise<any> {
    return await this.factoryRepository
      .createQueryBuilder()
      .softDelete()
      .where('id = :id', { id: id })
      .execute();
  }

  public async getDetail(id: number) {
    return await this.findOneById(id);
  }

  public async getList(request: GetListFactoryRequestDto) {
    const { keyword, sort, filter, take, skip, isGetAll } = request;
    let query = this.factoryRepository
      .createQueryBuilder('f')
      .select([
        'f.id AS id',
        'f.company_id AS "companyId"',
        'f.region_id AS "regionId"',
        'c.name AS "companyName"',
        'f.name AS "name"',
        'f.code AS "code"',
        'f.location AS "location"',
        'f.phone AS "phone"',
        'f.description AS "description"',
        'f.status AS "status"',
        'f.approver_id AS "approverId"',
        'f.created_by AS "createdBy"',
        'f.created_at AS "createdAt"',
        'f.updated_at AS "updatedAt"',
      ])
      .leftJoin('companies', 'c', 'c.id = f.company_id');

    if (keyword) {
      query = query
        .orWhere(`LOWER("f"."name") LIKE LOWER(:pkeyWord) escape '\\'`, {
          pkeyWord: `%${escapeCharForSearch(keyword)}%`,
        })
        .orWhere(`LOWER("f"."code") LIKE LOWER(:pkeyWord) escape '\\'`, {
          pkeyWord: `%${escapeCharForSearch(keyword)}%`,
        });
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'code':
            query.andWhere(`LOWER("f"."code") LIKE LOWER(:code) escape '\\'`, {
              code: `%${escapeCharForSearch(item.text)}%`,
            });
            break;
          case 'name':
            query.andWhere(`LOWER("f"."name") LIKE LOWER(:name) escape '\\'`, {
              name: `%${escapeCharForSearch(item.text)}%`,
            });
            break;
          case 'companyName':
            query.andWhere(
              `LOWER("c"."name") LIKE LOWER(:companyName) escape '\\'`,
              {
                companyName: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
          case 'createdAt':
            const createdFrom = item.text.split('|')[0];
            const createdTo = item.text.split('|')[1];
            query.andWhere(
              `"f"."created_at" between :createdFrom AND :createdTo`,
              {
                createdFrom: createdFrom,
                createdTo: createdTo,
              },
            );
            break;
          case 'factoryIds':
            query.andWhere(`f.id IN(:...factoryIds)`, {
              factoryIds: item.text,
            });
            break;
          case 'codes':
            query.andWhere(`f.code IN(:...codes)`, {
              codes: item.text,
            });
          default:
            break;
        }
      });
    }
    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        switch (item.column) {
          case 'code':
            query.addOrderBy('f.code', item.order);
            break;
          case 'name':
            query.addOrderBy('f.name', item.order);
            break;
          case 'companyName':
            query.addOrderBy('c.name', item.order);
            break;
          default:
            break;
        }
      });
    } else {
      query = query.orderBy('f.id', 'DESC');
    }

    if (request.ids) {
      query.andWhere(`"f"."id" IN (:...ids)`, {
        ids: request.ids.split(','),
      });
    }

    const data = parseInt(isGetAll)
      ? await query.getRawMany()
      : await query.offset(skip).limit(take).getRawMany();

    const total = await query.getCount();

    return {
      result: data,
      count: total,
    };
  }

  public async getUserFactories(userId: number) {
    return await this.factoryRepository
      .createQueryBuilder('f')
      .select([
        `f.id as id`,
        `f.name as name`,
        `f.code as code`,
        `f.location as location`,
        `f.phone as phone`,
        `f.description as description`,
        `f.created_at as "createdAt"`,
        `f.updated_at as "updatedAt"`,
      ])
      .innerJoin('user_factories', 'uf', 'uf.factory_id = f.id')
      .where('uf.user_id =:userId', {
        userId: userId,
      })
      .getRawMany();
  }

  async getCount(): Promise<any> {
    return await this.factoryRepository
      .createQueryBuilder('f')
      .select([`COUNT("f"."id") AS "cnt"`])
      .getRawOne();
  }
}
