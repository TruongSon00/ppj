import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ApiError } from '@utils/api.error';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToInstance } from 'class-transformer';
import { has, keyBy } from 'lodash';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { DetailVendorRequestDto } from './dto/request/detail-vendor.request.dto';
import { GetListVendorRequestDto } from './dto/request/get-list-vendor.request.dto';
import { VendorResponseDto } from './dto/response/vendor.response.dto';
import { VendorRepositoryInterface } from './interface/vendor.repository.interface';
import { VendorServiceInterface } from './interface/vendor.service.interface';

@Injectable()
export class VendorService implements VendorServiceInterface {
  constructor(
    @Inject('VendorRepositoryInterface')
    private readonly vendorRepository: VendorRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async getList(request: GetListVendorRequestDto): Promise<any> {
    const { data, count } = await this.vendorRepository.list(request);

    const dataReturn = plainToInstance(VendorResponseDto, data, {
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

  async detail(request: DetailVendorRequestDto): Promise<ResponsePayload<any>> {
    const vendor = await this.vendorRepository.findOneById(request.id);

    if (!vendor) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const dataReturn = plainToInstance(VendorResponseDto, vendor, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

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

    const unitCodeInsertExists = await this.vendorRepository.findAllByCondition(
      {
        code: { $in: codesInsert },
      },
    );
    const unitCodeUpdateExists = await this.vendorRepository.findAllByCondition(
      {
        code: { $in: codesUpdate },
      },
    );
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

    const bulkOps = [...dataInsert, ...unitCodeUpdateExists].map((doc) => ({
      updateOne: {
        filter: {
          code: doc.code,
        },
      },
      update: doc,
      upsert: true,
    }));

    const dataSuccess = await this.vendorRepository.import(bulkOps);

    return {
      dataError,
      dataSuccess: [...dataSuccess],
    };
  }
}
