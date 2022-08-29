import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ApiError } from '@utils/api.error';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToInstance } from 'class-transformer';
import { has, keyBy } from 'lodash';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { CreateErrorTypeRequest } from './dto/request/create-error-type.request';
import { DetailErrorTypeRequest } from './dto/request/detail-error-type.request';
import { GetListErrorTypeQuery } from './dto/request/get-list-error-type.query';
import { UpdateErrorTypeRequest } from './dto/request/update-error-type.request';
import { DetailErrorTypeResponse } from './dto/response/detail-error-type.response';
import { ErrorTypeRepositoryInterface } from './interface/error-type.repository.interface';
import { ErrorTypeServiceInterface } from './interface/error-type.service.interface';

@Injectable()
export class ErrorTypeService implements ErrorTypeServiceInterface {
  constructor(
    @Inject('ErrorTypeRepositoryInterface')
    private readonly errorTypeRepository: ErrorTypeRepositoryInterface,

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

    const errorTypeCodeInsertExists =
      await this.errorTypeRepository.findAllByCondition({
        code: { $in: codesInsert },
      });
    const errorTypeCodeUpdateExists =
      await this.errorTypeRepository.findAllByCondition({
        code: { $in: codesUpdate },
      });
    const errorTypeInsertMap = keyBy(errorTypeCodeInsertExists, 'code');
    const errorTypeUpdateMap = keyBy(errorTypeCodeUpdateExists, 'code');

    const dataError = [];
    const dataInsert = [];
    const dataUpdate = [];
    dataToInsert.forEach((item) => {
      if (has(errorTypeInsertMap, item.code)) {
        dataError.push(item);
      } else {
        dataInsert.push(item);
      }
    });
    dataToUpdate.forEach((item) => {
      if (!has(errorTypeUpdateMap, item.code)) {
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

    const dataSuccess = await this.errorTypeRepository.import(bulkOps);

    return {
      dataError,
      dataSuccess: [...dataSuccess],
    };
  }

  async create(request: CreateErrorTypeRequest): Promise<ResponsePayload<any>> {
    try {
      const errorTypeExists = await this.errorTypeRepository.findOneByCode(
        request.code,
      );
      if (errorTypeExists) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.CODE_IS_ALREADY_EXISTS'),
        ).toResponse();
      }

      const errorTypeEntity = this.errorTypeRepository.createEntity(request);
      await errorTypeEntity.save();
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

  async update(request: UpdateErrorTypeRequest): Promise<ResponsePayload<any>> {
    try {
      let errorTypeEntity = await this.errorTypeRepository.findOneById(
        request.id,
      );

      if (!errorTypeEntity) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.NOT_FOUND'),
        ).toResponse();
      }

      errorTypeEntity = await this.errorTypeRepository.updateEntity(
        errorTypeEntity,
        request,
      );

      await errorTypeEntity.save();

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

  async detail(request: DetailErrorTypeRequest): Promise<ResponsePayload<any>> {
    try {
      const errorTypeEntity = await this.errorTypeRepository.findOneById(
        request.id,
      );

      if (!errorTypeEntity) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.NOT_FOUND'),
        ).toResponse();
      }

      const dataReturn = plainToInstance(
        DetailErrorTypeResponse,
        errorTypeEntity,
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

  async list(request: GetListErrorTypeQuery): Promise<ResponsePayload<any>> {
    const { data, count } = await this.errorTypeRepository.list(request);

    const dataReturn = plainToInstance(DetailErrorTypeResponse, data, {
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
}
