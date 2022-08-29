import { Inject, Injectable } from '@nestjs/common';
import { MaintenanceAttributeServiceInterface } from '@components/maintenance-attribute/interface/maintenance-attribute.service.interface';
import { MaintenanceAttributeRepositoryInterface } from '@components/maintenance-attribute/interface/maintenance-attribute.repository.interface';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { plainToInstance } from 'class-transformer';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { PagingResponse } from '@utils/paging.response';
import { HistoryActionEnum } from '@components/history/history.constant';
import { CreateMaintenanceAttributeRequestDto } from '@components/maintenance-attribute/dto/request/create-maintenance-attribute.request.dto';
import { CreateMaintenanceAttributeResponseDto } from '@components/maintenance-attribute/dto/response/create-maintenance-attribute.response.dto';
import { GetDetailMaintenanceAttributeResponseDto } from '@components/maintenance-attribute/dto/response/get-detail-maintenance-attribute.response.dto';
import { UpdateMaintenanceAttributeRequestDto } from '@components/maintenance-attribute/dto/request/update-maintenance-attribute.request.dto';
import { UpdateMaintenanceAttributeResponseDto } from '@components/maintenance-attribute/dto/response/update-maintenance-attribute.response.dto';
import { HistoryServiceInterface } from '@components/history/interface/history.service.interface';
import { GetListMaintenanceAttributeRequestDto } from '@components/maintenance-attribute/dto/request/get-list-maintenance-attribute.request.dto';
import { GetAllConstant } from '@components/maintenance-attribute/maintenance-attribute.constant';
import { GetListAllMaintenanceAttributeResponseDto } from '@components/maintenance-attribute/dto/response/get-list-all-maintenance-attribute.response.dto';
import { isEmpty, keyBy, has } from 'lodash';
import { DeviceRepositoryInterface } from '@components/device/interface/device.repository.interface';
import { ResponsePayload } from '@utils/response-payload';
import { DetailMaintenanceAttributeRequestDto } from './dto/request/detail-maintenance-attribute.request.dto';
import { DeleteMaintenanceAttributeRequestDto } from './dto/request/delete-maintenance-attribute.request.dto';

@Injectable()
export class MaintenanceAttributeService
  implements MaintenanceAttributeServiceInterface
{
  constructor(
    @Inject('MaintenanceAttributeRepositoryInterface')
    private readonly maintenanceAttributeRepository: MaintenanceAttributeRepositoryInterface,
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
    @Inject('HistoryServiceInterface')
    private readonly historyService: HistoryServiceInterface,
    @Inject('DeviceRepositoryInterface')
    private readonly deviceRepository: DeviceRepositoryInterface,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly i18n: I18nRequestScopeService,
  ) {}
  async create(request: CreateMaintenanceAttributeRequestDto): Promise<any> {
    try {
      const { code, name, description, userId } = request;
      const codeInput = code ? code.trim() : null;
      const nameInput = name ? name.trim() : null;
      if (isEmpty(codeInput) || isEmpty(nameInput)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.MISSING_REQUIRED_FIELDS'),
          )
          .build();
      }
      const existedCode =
        await this.maintenanceAttributeRepository.findOneByCode(code);
      if (!existedCode) {
        const maintenanceAttributeDocument =
          this.maintenanceAttributeRepository.createDocument({
            code: code,
            name: name,
            description: description,
            isDeleted: false,
          });
        const maintenanceAttribute =
          await this.maintenanceAttributeRepository.create(
            maintenanceAttributeDocument,
          );
        maintenanceAttribute.histories.push({
          userId: userId,
          action: HistoryActionEnum.CREATE,
          createdAt: new Date(),
        });
        const response = await maintenanceAttribute.save();
        const result = plainToInstance(
          CreateMaintenanceAttributeResponseDto,
          response,
          {
            excludeExtraneousValues: true,
          },
        );
        return new ResponseBuilder(result)
          .withCode(ResponseCodeEnum.SUCCESS)
          .withMessage(await this.i18n.translate('success.SUCCESS'))
          .build();
      } else {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate(
              'error.MAINTENANCE_ATTRIBUTE_CODE_INVALID',
            ),
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

  async getList(request: GetListMaintenanceAttributeRequestDto): Promise<any> {
    if (parseInt(request.isGetAll) == GetAllConstant.YES) {
      const response =
        await this.maintenanceAttributeRepository.findAllByCondition({
          isDeleted: false,
        });
      if (!response) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }
      const result = plainToInstance(
        GetListAllMaintenanceAttributeResponseDto,
        response,
        {
          excludeExtraneousValues: true,
        },
      );
      return new ResponseBuilder(result)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } else {
      const { result, count } =
        await this.maintenanceAttributeRepository.getList(request);
      const response = plainToInstance(
        GetDetailMaintenanceAttributeResponseDto,
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

  async delete(request: DeleteMaintenanceAttributeRequestDto) {
    const { id } = request;
    const maintenanceAttribute =
      await this.maintenanceAttributeRepository.findOneById(id);
    if (!maintenanceAttribute) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.MAINTENANCE_ATTRIBUTE_NOT_FOUND'),
        )
        .build();
    }
    const deviceUsed =
      await this.deviceRepository.findMaintenanceAttributeExist(id);
    if (deviceUsed) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.MAINTENANCE_ATTRIBUTE_USED'),
        )
        .build();
    }
    const result = await this.maintenanceAttributeRepository.findByIdAndUpdate(
      id,
      { isDeleted: true },
    );
    if (!result) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async detail(request: DetailMaintenanceAttributeRequestDto): Promise<any> {
    const { id } = request;
    const response = await this.maintenanceAttributeRepository.detail(id);
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    await this.historyService.mapUserHistory(response.histories);
    await this.historyService.sortHistoryDesc(response.histories);
    const result = plainToInstance(
      GetDetailMaintenanceAttributeResponseDto,
      response,
      {
        excludeExtraneousValues: true,
      },
    );
    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async findOneByCode(code: string): Promise<any> {
    const response = await this.maintenanceAttributeRepository.findOneByCode(
      code,
    );
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
  }

  async update(request: UpdateMaintenanceAttributeRequestDto): Promise<any> {
    const { _id, userId, name } = request;
    const nameInput = name ? name.trim() : null;
    if (isEmpty(nameInput)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.MISSING_REQUIRED_FIELDS'))
        .build();
    }
    const maintenanceAttribute =
      await this.maintenanceAttributeRepository.detail(_id);
    if (!maintenanceAttribute) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    try {
      await this.maintenanceAttributeRepository.update({
        ...request,
        history: {
          userId: userId,
          action: HistoryActionEnum.UPDATE,
          createdAt: new Date(),
        },
      });
      const response = await this.maintenanceAttributeRepository.detail(_id);
      if (!response) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }
      const result = plainToInstance(
        UpdateMaintenanceAttributeResponseDto,
        response,
        { excludeExtraneousValues: true },
      );
      return new ResponseBuilder(result)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_UPDATE'))
        .build();
    }
  }

  async findOneByCondition(
    condition: any,
  ): Promise<ResponsePayload<GetDetailMaintenanceAttributeResponseDto>> {
    const maintenanceAttribute =
      await this.maintenanceAttributeRepository.findOneByCondition(condition);

    const result = plainToInstance(
      GetDetailMaintenanceAttributeResponseDto,
      maintenanceAttribute,
      { excludeExtraneousValues: true },
    );

    return new ResponseBuilder<GetDetailMaintenanceAttributeResponseDto>()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .withData(result)
      .build();
  }

  async createMany(
    data: any,
    userId: number,
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

    const maintenanceAttributeCodeInsertExists =
      await this.maintenanceAttributeRepository.findAllByCondition({
        code: { $in: codesInsert },
      });
    const maintenanceAttributeCodeUpdateExists =
      await this.maintenanceAttributeRepository.findAllByCondition({
        code: { $in: codesUpdate },
      });
    const maintenanceAttributeInsertMap = keyBy(
      maintenanceAttributeCodeInsertExists,
      'code',
    );
    const maintenanceAttributeUpdateMap = keyBy(
      maintenanceAttributeCodeUpdateExists,
      'code',
    );

    const dataError = [];
    const dataInsert = [];
    const dataUpdate = [];
    dataToInsert.forEach((item) => {
      if (has(maintenanceAttributeInsertMap, item.code)) {
        dataError.push(item);
      } else {
        dataInsert.push(item);
      }
    });
    dataToUpdate.forEach((item) => {
      if (!has(maintenanceAttributeUpdateMap, item.code)) {
        dataError.push(item);
      } else {
        dataUpdate.push(item);
      }
    });

    const maintenanceAttributeDocuments = dataInsert.map((item) => {
      const maintenanceAttribute =
        this.maintenanceAttributeRepository.createDocument({
          code: item.code,
          name: item.name,
          description: item.description,
          isDeleted: false,
        });
      maintenanceAttribute.histories.push({
        userId: userId,
        action: HistoryActionEnum.CREATE,
        createdAt: new Date(),
      });
      return maintenanceAttribute;
    });
    const dataSuccess = await this.maintenanceAttributeRepository.createMany(
      maintenanceAttributeDocuments,
    );
    const dataUpdateMap = keyBy(dataUpdate, 'code');

    await Promise.all(
      maintenanceAttributeCodeUpdateExists.map((maintenanceAttribute) => {
        maintenanceAttribute.name =
          dataUpdateMap[maintenanceAttribute.code]?.name;
        maintenanceAttribute.description =
          dataUpdateMap[maintenanceAttribute.code]?.description;
        maintenanceAttribute.histories.push({
          userId: userId,
          action: HistoryActionEnum.UPDATE,
          createdAt: new Date(),
        });
        return maintenanceAttribute.save();
      }),
    );

    return {
      dataError,
      dataSuccess: [...dataSuccess, ...maintenanceAttributeCodeUpdateExists],
    };
  }
}
