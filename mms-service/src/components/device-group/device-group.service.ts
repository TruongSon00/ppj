import { DeviceGroupServiceInterface } from '@components/device-group/interface/device-group.service.interface';
import { DeviceGroupRepositoryInterface } from '@components/device-group/interface/device-group.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { CreateDeviceGroupRequestDto } from '@components/device-group/dto/request/create-device-group.request.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { has, keyBy } from 'lodash';
import { UpdateDeviceGroupRequestDto } from '@components/device-group/dto/request/update-device-group.request.dto';
import { GetListDeviceGroupRequestDto } from '@components/device-group/dto/request/get-list-device-group.request.dto';
import { PagingResponse } from '@utils/paging.response';
import { CreateDeviceGroupResponseDto } from '@components/device-group/dto/response/create-device-group.response.dto';
import { plainToInstance } from 'class-transformer';
import { GetDetailDeviceGroupResponseDto } from '@components/device-group/dto/response/get-detail-device-group.response.dto';
import { GetAllConstant } from '@components/supply/supply.constant';
import { GetListDeviceGroup } from '@components/device-group/dto/response/get-all-device-group';
import { DetailDeviceGroupRequestDto } from './dto/request/detail-device-group.request.dto';
import { UpdateUnitActiveStatusPayload } from '@components/unit/dto/request/update-unit-status.request';
@Injectable()
export class DeviceGroupService implements DeviceGroupServiceInterface {
  constructor(
    @Inject('DeviceGroupRepositoryInterface')
    private readonly deviceGroupRepository: DeviceGroupRepositoryInterface,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly i18n: I18nRequestScopeService,
  ) {}

  async create(request: CreateDeviceGroupRequestDto): Promise<any> {
    try {
      const { code, name, description, supplies } = request;
      const existedCode = await this.deviceGroupRepository.findOneByCode(code);
      if (!existedCode) {
        const deviceGroupDocument = this.deviceGroupRepository.createDocument({
          code: code,
          name: name,
          description: description,
          supplies: supplies,
        });
        const response = await deviceGroupDocument.save();
        const result = plainToInstance(CreateDeviceGroupResponseDto, response, {
          excludeExtraneousValues: true,
        });
        return new ResponseBuilder(result)
          .withCode(ResponseCodeEnum.SUCCESS)
          .withMessage(await this.i18n.translate('success.SUCCESS'))
          .build();
      } else {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.DEVICE_GROUP_CODE_INVALID'),
          )
          .build();
      }
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_CREATE'))
        .build();
    }
  }

  async getList(request: GetListDeviceGroupRequestDto): Promise<any> {
    if (parseInt(request.isGetAll) == GetAllConstant.YES) {
      const response = await this.deviceGroupRepository.findAll();

      const result = plainToInstance(GetListDeviceGroup, response, {
        excludeExtraneousValues: true,
      });
      return new ResponseBuilder(result)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } else {
      const { result, count } = await this.deviceGroupRepository.getList(
        request,
      );
      const response = plainToInstance(
        GetDetailDeviceGroupResponseDto,
        result,
        {
          excludeExtraneousValues: true,
        },
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
  async detail(request: DetailDeviceGroupRequestDto): Promise<any> {
    const { id } = request;
    const response = await this.deviceGroupRepository.findOneById(id);
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.DEVICE_GROUP_NOT_FOUND'))
        .build();
    }
    const result = plainToInstance(GetDetailDeviceGroupResponseDto, response, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async update(request: UpdateDeviceGroupRequestDto): Promise<any> {
    const { id } = request;
    const deviceGroup = await this.deviceGroupRepository.findOneById(id);
    if (!deviceGroup) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEVICE_GROUP_NOT_FOUND'))
        .build();
    }
    try {
      const result = await this.deviceGroupRepository.findByIdAndUpdate(
        id,
        request,
      );
      const updateResult = await result.save();
      return new ResponseBuilder(updateResult)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
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

    const deviceGroupCodeInsertExists =
      await this.deviceGroupRepository.findAllByCondition({
        code: {
          $in: codesInsert,
        },
      });

    const deviceGroupCodeUpdateExists =
      await this.deviceGroupRepository.findAllByCondition({
        code: {
          $in: codesUpdate,
        },
      });

    const deviceGroupInsertMap = keyBy(deviceGroupCodeInsertExists, 'code');
    const deviceGroupUpdateMap = keyBy(deviceGroupCodeUpdateExists, 'code');

    const dataError = [];
    const dataInsert = [];
    const dataUpdate = [];

    dataToInsert.forEach((item) => {
      if (has(deviceGroupInsertMap, item.code)) {
        dataError.push(item);
      } else {
        dataInsert.push(item);
      }
    });

    dataToUpdate.forEach((item) => {
      if (!has(deviceGroupUpdateMap, item.code)) {
        dataError.push(item);
      } else {
        dataUpdate.push(item);
      }
    });

    const bulkOps = [...dataInsert, ...deviceGroupCodeUpdateExists].map(
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

    const dataSuccess = await this.deviceGroupRepository.import(bulkOps);

    return {
      dataError,
      dataSuccess,
    };
  }

  async updateStatus(request: UpdateUnitActiveStatusPayload): Promise<any> {
    const { id, status } = request;
    const unit = await this.deviceGroupRepository.findOneById(id);
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
