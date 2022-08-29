import { InterRegionRepositoryInterface } from '@components/inter-region/interface/inter-region.repository.interface';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToInstance } from 'class-transformer';
import { has, keyBy, map, uniq } from 'lodash';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { DetailRegionRequest } from './dto/request/detail-region.request';
import { GetListRegionQuery } from './dto/request/get-list-region.query';
import { DetailRegionResponse } from './dto/response/detail-region.response';
import { RegionRepositoryInterface } from './interface/region.repository.interface';
import { RegionServiceInterface } from './interface/region.service.interface';

@Injectable()
export class RegionService implements RegionServiceInterface {
  constructor(
    @Inject('RegionRepositoryInterface')
    private readonly regionRepository: RegionRepositoryInterface,

    @Inject('InterRegionRepositoryInterface')
    private readonly interRegionRepository: InterRegionRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async import(data: any): Promise<{ dataSuccess: any[]; dataError: any[] }> {
    const dataToInsert = [];
    const dataToUpdate = [];
    const codesInsert = [];
    const codesUpdate = [];
    const textAdd = await this.i18n.translate('import.common.add');

    data.forEach((item) => {
      if (item.action === textAdd) {
        dataToInsert.push(item);
        codesInsert.push(item.code);
      } else {
        dataToUpdate.push(item);
        codesUpdate.push(item.code);
      }
    });

    const regionCodeInsertExists =
      await this.regionRepository.findAllByCondition({
        code: { $in: codesInsert },
      });
    const regionCodeUpdateExists =
      await this.regionRepository.findAllByCondition({
        code: { $in: codesUpdate },
      });
    const regionInsertMap = keyBy(regionCodeInsertExists, 'code');
    const regionUpdateMap = keyBy(regionCodeUpdateExists, 'code');

    const interRegionCodes = uniq(map(data, 'interRegionCode'));
    const interRegions = await this.interRegionRepository.findAllByCondition({
      code: { $in: interRegionCodes },
    });
    const interRegionMap = keyBy(interRegions, 'code');

    const dataError = [];
    const dataInsert = [];
    const dataUpdate = [];
    dataToInsert.forEach((item) => {
      if (has(regionInsertMap, item.code)) {
        dataError.push(item);
      } else if (!has(interRegionMap, item.interRegionCode)) {
        dataError.push(item);
      } else {
        dataInsert.push(item);
      }
    });
    dataToUpdate.forEach((item) => {
      if (!has(regionUpdateMap, item.code)) {
        dataError.push(item);
      } else if (!has(interRegionMap, item.interRegionCode)) {
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
        interRegionId: interRegionMap[doc.interRegionCode]._id,
      },
      upsert: true,
    }));

    const dataSuccess = await this.regionRepository.import(bulkOps);

    return {
      dataError,
      dataSuccess: [...dataSuccess],
    };
  }

  async detail(
    request: DetailRegionRequest,
  ): Promise<ResponsePayload<DetailRegionResponse | any>> {
    const { id } = request;
    const response = await this.regionRepository.findOneById(id);
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.REGION_NOT_FOUND'))
        .build();
    }
    const interRegion = await this.interRegionRepository.findOneById(
      response.interRegionId,
    );
    if (!interRegion) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.INTER_REGION_NOT_FOUND'))
        .build();
    }

    const result = plainToInstance(
      DetailRegionResponse,
      {
        ...response['_doc'],
        interRegion,
      },
      {
        excludeExtraneousValues: true,
      },
    );
    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async list(request: GetListRegionQuery): Promise<ResponsePayload<any>> {
    const { data, count } = await this.regionRepository.list(request);

    const dataReturn = plainToInstance(DetailRegionResponse, data, {
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
