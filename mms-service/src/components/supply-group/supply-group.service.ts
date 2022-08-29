import { Inject, Injectable } from '@nestjs/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { SupplyGroupServiceInterface } from '@components/supply-group/interface/supply-group.service.interface';
import { SupplyGroupRepositoryInterface } from '@components/supply-group/interface/supply-group.repository.interface';
import { plainToInstance } from 'class-transformer';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { PagingResponse } from '@utils/paging.response';
import { CreateSupplyGroupRequestDto } from '@components/supply-group/dto/request/create-supply-group.request.dto';
import { GetListSupplyGroupRequestDto } from '@components/supply-group/dto/request/get-list-supply-group.request.dto';
import { GetDetailSupplyGroupResponseDto } from '@components/supply-group/dto/response/get-detail-supply-group.response.dto';
import { keyBy, has } from 'lodash';
import { GetAllConstant } from '@components/maintenance-attribute/maintenance-attribute.constant';
import { GetAllSupplyGroupResponseDto } from '@components/supply-group/dto/response/get-all-supply-group.response.dto';
import { GetDetailDeviceGroupResponseDto } from '@components/device-group/dto/response/get-detail-device-group.response.dto';
import { DetailSupplyGroupRequestDto } from './dto/request/detail-supply-group.request.dto';
import { UpdateSupplyGroupRequestDto } from './dto/request/update-supply-group.request.dto';
import { UpdateUnitActiveStatusPayload } from '@components/unit/dto/request/update-unit-status.request';

@Injectable()
export class SupplyGroupService implements SupplyGroupServiceInterface {
  constructor(
    @Inject('SupplyGroupRepositoryInterface')
    private readonly supplyGroupRepository: SupplyGroupRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async create(request: CreateSupplyGroupRequestDto): Promise<any> {
    try {
      const { code, name, description } = request;
      const existedCode = await this.supplyGroupRepository.findOneByCode(code);
      if (existedCode) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.SUPPLY_GROUP_CODE_INVALID'),
          )
          .build();
      }
      const supplyGroup = this.supplyGroupRepository.createDocument({
        code: code,
        name: name,
        description: description,
      });
      await supplyGroup.save();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  async getList(request: GetListSupplyGroupRequestDto): Promise<any> {
    if (parseInt(request.isGetAll) == GetAllConstant.YES) {
      const response = await this.supplyGroupRepository.findAll();
      if (!response) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.SUPPLY_GROUP_NOT_FOUND'),
          )
          .build();
      }
      const result = plainToInstance(GetAllSupplyGroupResponseDto, response, {
        excludeExtraneousValues: true,
      });
      return new ResponseBuilder(result)
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    } else {
      const { result, count } = await this.supplyGroupRepository.getList(
        request,
      );
      const response = plainToInstance(
        GetDetailDeviceGroupResponseDto,
        result,
        { excludeExtraneousValues: true },
      );
      return new ResponseBuilder<PagingResponse>({
        items: response,
        meta: { total: count, page: request.page },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    }
  }

  async detail(request: DetailSupplyGroupRequestDto): Promise<any> {
    const { id } = request;
    const response = await this.supplyGroupRepository.findOneById(id);
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.SUPPLY_GROUP_NOT_FOUND'))
        .build();
    }

    const result = plainToInstance(GetDetailSupplyGroupResponseDto, response, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async update(request: UpdateSupplyGroupRequestDto): Promise<any> {
    try {
      const { id } = request;
      let supplyGroup = await this.supplyGroupRepository.findOneById(id);
      if (!supplyGroup) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.SUPPLY_GROUP_NOT_FOUND'),
          )
          .build();
      }
      supplyGroup = this.supplyGroupRepository.updateEntity(
        supplyGroup,
        request,
      );
      await supplyGroup.save();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_UPDATE'))
        .build();
    }
  }

  async createMany(
    data: any,
  ): Promise<{ dataSuccess: any[]; dataError: any[] }> {
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

    const supplyGroupCodeInsertExists =
      await this.supplyGroupRepository.findAllByCondition({
        code: { $in: codesInsert },
      });
    const supplyGroupCodeUpdateExists =
      await this.supplyGroupRepository.findAllByCondition({
        code: { $in: codesUpdate },
      });

    const supplyGroupInsertMap = keyBy(supplyGroupCodeInsertExists, 'code');
    const supplyGroupUpdateMap = keyBy(supplyGroupCodeUpdateExists, 'code');
    const dataError = [];
    const dataInsert = [];
    const dataUpdate = [];
    dataToInsert.forEach((item) => {
      if (has(supplyGroupInsertMap, item.code)) {
        dataError.push(item);
      } else {
        dataInsert.push(item);
      }
    });
    dataToUpdate.forEach((item) => {
      if (!has(supplyGroupUpdateMap, item.code)) {
        dataError.push(item);
      } else {
        dataUpdate.push(item);
      }
    });

    const bulkOps = [...dataInsert, ...supplyGroupCodeUpdateExists].map(
      (doc) => ({
        updateOne: {
          filter: {
            code: doc.code,
          },
        },
        update: doc,
        upsert: true,
      }),
    );

    const dataSuccess = await this.supplyGroupRepository.import(bulkOps);

    return {
      dataError,
      dataSuccess,
    };
  }

  async updateStatus(request: UpdateUnitActiveStatusPayload): Promise<any> {
    const { id, status } = request;
    const supplyGroup = await this.supplyGroupRepository.findOneById(id);
    if (!supplyGroup) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'));
    }
    supplyGroup.active = status;
    await supplyGroup.save();
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'));
  }
}
