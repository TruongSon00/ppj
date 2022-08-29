import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToInstance } from 'class-transformer';
import { has, keyBy } from 'lodash';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { DetailAreaRequest } from './dto/request/detail-area.request';
import { GetListAreaQuery } from './dto/request/get-list-area.query';
import { DetailAreaResponse } from './dto/response/detail-area.response';
import { AreaRepositoryInterface } from './interface/area.repository.interface';
import { AreaServiceInterface } from './interface/area.service.interface';

@Injectable()
export class AreaService implements AreaServiceInterface {
  constructor(
    @Inject('AreaRepositoryInterface')
    private readonly areaRepository: AreaRepositoryInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async import(data: any): Promise<{ dataSuccess: any[]; dataError: any[] }> {
    const dataToInsert = [];
    const dataToUpdate = [];
    const codesInsert = [];
    const codesUpdate = [];
    const factoryCodes = [];
    const textAdd = await this.i18n.translate('import.common.add');

    data.forEach((item) => {
      if (item.action === textAdd) {
        dataToInsert.push(item);
        codesInsert.push(item.code);
      } else {
        dataToUpdate.push(item);
        codesUpdate.push(item.code);
      }
      factoryCodes.push(item.factoryCode);
    });

    const areaCodeInsertExists = await this.areaRepository.findAllByCondition({
      code: { $in: codesInsert },
    });
    const areaCodeUpdateExists = await this.areaRepository.findAllByCondition({
      code: { $in: codesUpdate },
    });
    const areaInsertMap = keyBy(areaCodeInsertExists, 'code');
    const areaUpdateMap = keyBy(areaCodeUpdateExists, 'code');

    const filter = [];
    filter.push({
      column: 'codes',
      text: factoryCodes,
    });
    const factories = await this.userService.getFactoryList(filter);
    const factoryMap = keyBy(factories, 'code');

    const dataError = [];
    const dataInsert = [];
    const dataUpdate = [];
    dataToInsert.forEach((item) => {
      if (has(areaInsertMap, item.code)) {
        dataError.push(item);
      } else if (!has(factoryMap, item.factoryCode)) {
        dataError.push(item);
      } else {
        dataInsert.push(item);
      }
    });
    dataToUpdate.forEach((item) => {
      if (!has(areaUpdateMap, item.code)) {
        dataError.push(item);
      } else if (!has(factoryMap, item.factoryCode)) {
        dataError.push(item);
      } else {
        dataUpdate.push(item);
      }
    });

    const regionDocument = [...dataInsert, ...dataUpdate];
    const bulkOps = regionDocument.map((doc) => ({
      updateOne: {
        filter: {
          code: doc.code,
        },
      },
      update: {
        code: doc.code,
        name: doc.name,
        description: doc.description,
        factoryId: factoryMap[doc.factoryCode].id,
      },
      upsert: true,
    }));

    const dataSuccess = await this.areaRepository.import(bulkOps);

    return {
      dataError,
      dataSuccess: [...dataSuccess],
    };
  }

  async detail(
    request: DetailAreaRequest,
  ): Promise<ResponsePayload<DetailAreaResponse | any>> {
    const { id } = request;
    const response = await this.areaRepository.findOneById(id);
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.AREA_NOT_FOUND'))
        .build();
    }
    const factory = await this.userService.getFactoryById(response.factoryId);
    if (!factory) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.FACTORY_NOT_FOUND'))
        .build();
    }
    const result = plainToInstance(
      DetailAreaResponse,
      {
        ...response['_doc'],
        factory,
      },
      {
        excludeExtraneousValues: true,
      },
    );
    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }
  async list(request: GetListAreaQuery): Promise<ResponsePayload<any>> {
    const { data, count } = await this.areaRepository.list(request);

    const filter = [];
    const factoryIds = data.map((item) => item.factoryId);
    filter.push({
      column: 'factoryIds',
      text: factoryIds,
    });
    const factories = await this.userService.getFactoryList(filter);
    const factoriesMap = keyBy(factories, 'id');

    data.forEach((element) => {
      element.factory = factoriesMap[element.factoryId];
    });

    const dataReturn = plainToInstance(DetailAreaResponse, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder({
      items: dataReturn,
      meta: { total: count, page: request.page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }
}
