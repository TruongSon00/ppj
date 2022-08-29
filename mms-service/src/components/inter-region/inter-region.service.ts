import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ApiError } from '@utils/api.error';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToInstance } from 'class-transformer';
import { has, keyBy } from 'lodash';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { GetListInterRegionQuery } from './dto/request/get-list-inter-region.query';
import { DetailInterRegionRequest } from './dto/request/detail-inter-region.request';
import { DetailInterRegionResponse } from './dto/response/detail-inter-region.response';
import { InterRegionRepositoryInterface } from './interface/inter-region.repository.interface';
import { InterRegionServiceInterface } from './interface/inter-region.service.interface';

@Injectable()
export class InterRegionService implements InterRegionServiceInterface {
  constructor(
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

    const interRegionCodeInsertExists =
      await this.interRegionRepository.findAllByCondition({
        code: { $in: codesInsert },
      });
    const interRegionCodeUpdateExists =
      await this.interRegionRepository.findAllByCondition({
        code: { $in: codesUpdate },
      });
    const interRegionInsertMap = keyBy(interRegionCodeInsertExists, 'code');
    const interRegionUpdateMap = keyBy(interRegionCodeUpdateExists, 'code');

    const dataError = [];
    const dataInsert = [];
    const dataUpdate = [];
    dataToInsert.forEach((item) => {
      if (has(interRegionInsertMap, item.code)) {
        dataError.push(item);
      } else {
        dataInsert.push(item);
      }
    });
    dataToUpdate.forEach((item) => {
      if (!has(interRegionUpdateMap, item.code)) {
        dataError.push(item);
      } else {
        dataUpdate.push(item);
      }
    });

    const bulkOps = [...dataInsert, ...dataUpdate].map((doc) => ({
      updateOne: {
        filter: {
          code: doc.code,
        },
      },
      update: doc,
      upsert: true,
    }));

    const dataSuccess = await this.interRegionRepository.import(bulkOps);

    return {
      dataError,
      dataSuccess: [...dataSuccess],
    };
  }

  async detail(
    request: DetailInterRegionRequest,
  ): Promise<ResponsePayload<any>> {
    try {
      const interRegionEntity = await this.interRegionRepository.findOneById(
        request.id,
      );

      if (!interRegionEntity) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.NOT_FOUND'),
        ).toResponse();
      }

      const dataReturn = plainToInstance(
        DetailInterRegionResponse,
        interRegionEntity,
        {
          excludeExtraneousValues: true,
        },
      );

      return new ResponseBuilder(dataReturn)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.INTENAL_ERROR'))
        .build();
    }
  }

  async list(request: GetListInterRegionQuery): Promise<ResponsePayload<any>> {
    const { data, count } = await this.interRegionRepository.list(request);

    const dataReturn = plainToInstance(DetailInterRegionResponse, data, {
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
