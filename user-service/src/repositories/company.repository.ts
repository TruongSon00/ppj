import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Company } from '@entities/company/company.entity';
import { CompanyRepositoryInterface } from '@components/company/interface/company.repository.interface';
import { escapeCharForSearch } from './../utils/common';
import { GetListCompanyRequestDto } from '@components/company/dto/request/get-list-company.request.dto';
import { CompanyRequestDto } from '@components/company/dto/request/company.request.dto';
import { isEmpty } from 'lodash';

@Injectable()
export class CompanyRepository
  extends BaseAbstractRepository<Company>
  implements CompanyRepositoryInterface
{
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {
    super(companyRepository);
  }

  public async getList(request: GetListCompanyRequestDto) {
    const { keyword, sort, filter, take, skip, isGetAll, ids } = request;

    let query = this.companyRepository.createQueryBuilder('c');

    if (keyword) {
      query = query
        .orWhere(`LOWER("c"."name") LIKE LOWER(:pkeyWord) escape '\\'`, {
          pkeyWord: `%${escapeCharForSearch(keyword)}%`,
        })
        .orWhere(`LOWER("c"."code") LIKE LOWER(:pkeyWord) escape '\\'`, {
          pkeyWord: `%${escapeCharForSearch(keyword)}%`,
        });
    }

    if (!isEmpty(ids)) {
      query.andWhere(`"c"."id" in (:...ids)`, { ids });
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'code':
            query.andWhere(`LOWER("c"."code") LIKE LOWER(:code) escape '\\'`, {
              code: `%${escapeCharForSearch(item.text)}%`,
            });
            break;
          case 'name':
            query.andWhere(`LOWER("c"."name") LIKE LOWER(:name) escape '\\'`, {
              name: `%${escapeCharForSearch(item.text)}%`,
            });
            break;
          case 'taxNo':
            query.andWhere(
              `LOWER("c"."tax_no") LIKE LOWER(:taxNo) escape '\\'`,
              {
                taxNo: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
          case 'createdAt':
            const createdFrom = item.text.split('|')[0];
            const createdTo = item.text.split('|')[1];
            query.andWhere(
              `"c"."created_at" between :createdFrom AND :createdTo`,
              {
                createdFrom: createdFrom,
                createdTo: createdTo,
              },
            );
            break;
          default:
            break;
        }
      });
    }

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        query = query.addOrderBy(item.column, item.order);
      });
    } else {
      query = query.orderBy('c.id', 'DESC');
    }

    if (request.ids) {
      query.andWhere(`"c"."id" IN (:...ids)`, {
        ids: request.ids.split(','),
      });
    }
    let result = [];
    let total = 0;
    if (isGetAll) [result, total] = await query.getManyAndCount();
    else
      [result, total] = await query.offset(skip).limit(take).getManyAndCount();
    return {
      result: result,
      count: total,
    };
  }

  public async getDetail(id: number) {
    return await this.companyRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  public createEntity(companyDto: CompanyRequestDto): Company {
    const companyEntity = new Company();

    companyEntity.code = companyDto.code;
    companyEntity.name = companyDto.name;
    companyEntity.address = companyDto.address;
    companyEntity.phone = companyDto.phone;
    companyEntity.taxNo = companyDto.taxNo;
    companyEntity.email = companyDto.email;
    companyEntity.fax = companyDto.fax;
    companyEntity.description = companyDto.description;
    companyEntity.bankAccount = companyDto.bankAccount;
    companyEntity.bankAccountOwner = companyDto.bankAccountOwner;
    companyEntity.bank = companyDto.bank;
    return companyEntity;
  }

  public updateEntity(
    updateEntity: Company,
    request: CompanyRequestDto,
  ): Company {
    if (request.name !== undefined) updateEntity.name = request.name;
    updateEntity.code = request.code;
    if (request.description !== undefined)
      updateEntity.description = request.description;
    if (request.address !== undefined) updateEntity.address = request.address;
    if (request.phone !== undefined) updateEntity.phone = request.phone;
    if (request.taxNo !== undefined) updateEntity.taxNo = request.taxNo;
    if (request.email !== undefined) updateEntity.email = request.email;
    if (request.fax !== undefined) updateEntity.fax = request.fax;
    if (request.bankAccount !== undefined)
      updateEntity.bankAccount = request.bankAccount;
    if (request.bankAccountOwner !== undefined)
      updateEntity.bankAccountOwner = request.bankAccountOwner;
    if (request.bank !== undefined) updateEntity.bank = request.bank;
    return updateEntity;
  }

  public async getUserCompanies(userId: number) {
    return await this.companyRepository
      .createQueryBuilder('c')
      .select([
        `c.id as id`,
        `c.name as name`,
        `c.code as code`,
        `c.address as address`,
        `c.fax as fax`,
        `c.phone as phone`,
        `c.tax_no as "taxNo"`,
        `c.email as email`,
        `c.description as description`,
        `c.created_at as "createdAt"`,
        `c.updated_at as "updatedAt"`,
      ])
      .innerJoin('users', 'u', 'u.company_id = c.id')
      .where('u.id =:userId', {
        userId: userId,
      })
      .getRawMany();
  }

  async getCount(): Promise<any> {
    return await this.companyRepository
      .createQueryBuilder('c')
      .select([`COUNT("c"."id") AS "cnt"`])
      .getRawOne();
  }
}
