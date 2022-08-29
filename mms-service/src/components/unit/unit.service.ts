import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ApiError } from '@utils/api.error';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToInstance } from 'class-transformer';
import { has, keyBy } from 'lodash';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { GetListUnitQuery } from './dto/request/get-list-unit.query';
import { CreateUnitRequest } from './dto/request/create-unit.request';
import { DetailUnitRequest } from './dto/request/detail-unit.request';
import { UpdateUnitRequest } from './dto/request/update-unit.request';
import { DetailUnitResponse } from './dto/response/detail-unit.response';
import { UnitRepositoryInterface } from './interface/unit.repository.interface';
import { UnitServiceInterface } from './interface/unit.service.interface';
import { UpdateUnitActiveStatusPayload } from './dto/request/update-unit-status.request';

@Injectable()
export class UnitService implements UnitServiceInterface {
  constructor(
    @Inject('UnitRepositoryInterface')
    private readonly unitRepository: UnitRepositoryInterface,

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

    const unitCodeInsertExists = await this.unitRepository.findAllByCondition({
      code: { $in: codesInsert },
    });
    const unitCodeUpdateExists = await this.unitRepository.findAllByCondition({
      code: { $in: codesUpdate },
    });
    const unitInsertMap = keyBy(unitCodeInsertExists, 'code');
    const unitUpdateMap = keyBy(unitCodeUpdateExists, 'code');

    const dataError = [];
    const dataInsert = [];
    const dataUpdate = [];
    dataToInsert.forEach((item) => {
      if (has(unitInsertMap, item.code)) {
        dataError.push(item);
      } else {
        dataInsert.push(item);
      }
    });
    dataToUpdate.forEach((item) => {
      if (!has(unitUpdateMap, item.code)) {
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

    const dataSuccess = await this.unitRepository.import(bulkOps);

    return {
      dataError,
      dataSuccess: [...dataSuccess],
    };
  }

  async create(request: CreateUnitRequest): Promise<ResponsePayload<any>> {
    try {
      const unitExists = await this.unitRepository.findOneByCode(request.code);
      if (unitExists) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.CODE_IS_ALREADY_EXISTS'),
        ).toResponse();
      }

      const unitEntity = this.unitRepository.createEntity(request);
      await unitEntity.save();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async update(request: UpdateUnitRequest): Promise<ResponsePayload<any>> {
    try {
      let unitEntity = await this.unitRepository.findOneById(request.id);

      if (!unitEntity) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.NOT_FOUND'),
        ).toResponse();
      }

      unitEntity = await this.unitRepository.updateEntity(unitEntity, request);

      await unitEntity.save();

      return new ResponseBuilder()
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

  async detail(request: DetailUnitRequest): Promise<ResponsePayload<any>> {
    try {
      const unitEntity = await this.unitRepository.findOneById(request.id);

      if (!unitEntity) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.NOT_FOUND'),
        ).toResponse();
      }

      const dataReturn = plainToInstance(DetailUnitResponse, unitEntity, {
        excludeExtraneousValues: true,
      });

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

  async list(request: GetListUnitQuery): Promise<ResponsePayload<any>> {
    const { data, count } = await this.unitRepository.list(request);

    const dataReturn = plainToInstance(DetailUnitResponse, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder({
      result: dataReturn,
      meta: { total: count, page: request.page, size: request.limit },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async updateStatus(request: UpdateUnitActiveStatusPayload): Promise<any> {
    const { id, status } = request;
    const unit = await this.unitRepository.findOneById(id);
    if (!unit) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'));
    }
    unit.active = status;
    unit.save();
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'));
  }
}
