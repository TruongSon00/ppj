import { Inject, Injectable } from '@nestjs/common';
import { ResponsePayload } from '@utils/response-payload';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { plainToClass } from 'class-transformer';
import { PagingResponse } from '@utils/paging.response';
import { CreateFactoryRequestDto } from './dto/request/create-factory.request.dto';
import { FactoryDataResponseDto } from './dto/response/factory-data.response.dto';
import { FactoryServiceInterface } from './interface/factory.service.interface';
import { FactoryRepositoryInterface } from './interface/factory.repository.interface';
import { Factory } from '@entities/factory/factory.entity';
import { FactoryResponseDto } from './dto/response/factory.response.dto';
import { ApiError } from '@utils/api.error';
import { UpdateFactoryRequestDto } from './dto/request/update-factory.request.dto';
import { GetListFactoryRequestDto } from './dto/request/get-list-factory.request.dto';
import { GetListFactoryResponseDto } from './dto/response/get-list-factory.response.dto';
import { CompanyRepositoryInterface } from '@components/company/interface/company.repository.interface';
import { ILike, Not, In, DataSource } from 'typeorm';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { WarehouseService } from '@components/warehouse/warehouse.service';
import { SetStatusRequestDto } from './dto/request/set-status.request.dto';
import {
  CAN_DELETE_FACTORY_STATUS,
  CAN_UPDATE_FACTORY_STATUS,
  FactoryStatusEnum,
} from './factory.constant';
import { CompanyStatusEnum } from '@components/company/company.constant';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { GetUsersRequestDto } from '@components/user/dto/request/get-users-request.dto';
import isEmpty, { serilize } from '@utils/helper';
import { flatMap, has, keyBy, map, uniq } from 'lodash';
import { UserFactoryRepositoryInterface } from '@components/user-factory/interface/user-factory.repository.interface';
import { FileUpdloadRequestDto } from '@core/dto/file-upload.request';
import { ImportRequestDto } from '@core/dto/import/request/import.request.dto';
import { FactoryImport } from './import/factory.import.helper';
import { UserRepositoryInterface } from '@components/user/interface/user.repository.interface';
import { DeleteMultipleDto } from '@core/dto/multiple/delete-multiple.dto';
import { stringFormat } from '@utils/object.util';
import { CreateFactoriesRequestDto } from './dto/request/create-factories.request.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { ProduceServiceInterface } from '@components/produce/interface/produce.service.interface';
import { MmsServiceInterface } from '@components/mms/interface/mms.service.interface';

@Injectable()
export class FactoryService implements FactoryServiceInterface {
  constructor(
    @Inject('FactoryRepositoryInterface')
    private readonly factoryRepository: FactoryRepositoryInterface,

    @Inject('FactoryImport')
    private readonly factoryImport: FactoryImport,

    @Inject('CompanyRepositoryInterface')
    private readonly companyRepository: CompanyRepositoryInterface,

    @Inject('UserFactoryRepositoryInterface')
    private readonly userFactoryRepository: UserFactoryRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,

    @Inject('WarehouseServiceInterface')
    private readonly warehouseService: WarehouseService,

    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,

    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceServiceInterface,

    @Inject('MmsServiceInterface')
    private readonly mmsService: MmsServiceInterface,

    @InjectDataSource()
    private readonly connection: DataSource,
  ) {}

  async getFactoriesByNameKeyword(nameKeyword: any): Promise<any> {
    const factories = await this.factoryRepository.findFactoriesByNameKeyword(
      nameKeyword,
    );

    return new ResponseBuilder(factories)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async create(
    factoryDto: CreateFactoryRequestDto,
  ): Promise<ResponsePayload<FactoryDataResponseDto | any>> {
    try {
      const company = await this.companyRepository.findOneById(
        factoryDto.companyId,
      );
      if (!company) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.COMPANY_NOT_FOUND'),
        ).toResponse();
      }
      const region = await this.mmsService.detailRegion(factoryDto.regionId);
      if (!region) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.REGION_NOT_FOUND'),
        ).toResponse();
      }
      // if (company.status !== CompanyStatusEnum.CONFIRMED) {
      //   return new ApiError(
      //     ResponseCodeEnum.BAD_REQUEST,
      //     await this.i18n.translate('error.COMPANY_NOT_CONFIRM'),
      //   ).toResponse();
      // }
      const checkUniqueCode = await this.factoryRepository.findOneByCondition({
        code: ILike(factoryDto.code),
      });
      if (checkUniqueCode) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.CODE_ALREADY_EXISTS'))
          .build();
      }

      const factoryEntity = await this.factoryRepository.createEntity(
        factoryDto,
      );
      return await this.save(
        factoryEntity,
        factoryDto,
        'message.defineFactory.createSuccess',
      );
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage('error.CAN_NOT_CREATE')
        .build();
    }
  }

  public async update(
    factoryDto: UpdateFactoryRequestDto,
  ): Promise<ResponsePayload<FactoryDataResponseDto | any>> {
    const factory = await this.factoryRepository.findOneById(factoryDto.id);

    if (!factory) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.FACTORY_NOT_FOUND'))
        .build();
    }

    if (!CAN_UPDATE_FACTORY_STATUS.includes(factory.status)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.FACTORY_WAS_CONFIRMED'),
      ).toResponse();
    }

    const company = await this.companyRepository.findOneById(
      factoryDto.companyId,
    );

    if (!company) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.COMPANY_NOT_FOUND'),
      ).toResponse();
    }

    const region = await this.mmsService.detailRegion(factoryDto.regionId);
    if (!region) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.REGION_NOT_FOUND'),
      ).toResponse();
    }

    const checkUniqueCode = await this.factoryRepository.findOneByCondition({
      code: ILike(factoryDto.code),
      id: Not(factoryDto.id),
    });

    if (checkUniqueCode) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CODE_ALREADY_EXISTS'))
        .build();
    }

    factory.name = factoryDto.name;
    factory.code = factoryDto.code;
    factory.companyId = factoryDto.companyId;
    factory.regionId = factoryDto.regionId;
    factory.description = factoryDto.description;
    factory.location = factoryDto.location;
    factory.phone = factoryDto.phone;
    factory.status = FactoryStatusEnum.CREATED;
    factory.approverId = null;
    factory.approvedAt = null;

    return await this.save(
      factory,
      factoryDto,
      'message.defineFactory.updateSuccess',
    );
  }

  public async delete(id: number): Promise<ResponsePayload<any>> {
    try {
      const factory = await this.factoryRepository.findOneById(id);

      if (!factory) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.FACTORY_NOT_FOUND'))
          .build();
      }

      if (!CAN_DELETE_FACTORY_STATUS.includes(factory.status)) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.FACTORY_WAS_CONFIRMED'),
        ).toResponse();
      }

      const companyWarehouse =
        await this.warehouseService.getWarehouseListByConditions({
          companyId: id,
        });

      if (companyWarehouse.length > 0) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.MUST_DELETE_WAREHOUSE'),
        ).toResponse();
      }

      await this.factoryRepository.delete(id);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(
          await this.i18n.translate('message.defineFactory.deleteSuccess'),
        )
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }

  async deleteMultiple(
    request: DeleteMultipleDto,
  ): Promise<ResponsePayload<any>> {
    const failIdsList = [];
    const ids = request.ids.split(',').map((id) => parseInt(id));

    const factories = await this.factoryRepository.findByCondition({
      id: In(ids),
    });
    const factoryIds = factories.map((factory) => factory.id);
    if (factories.length !== ids.length) {
      ids.forEach((id) => {
        if (!factoryIds.includes(id)) failIdsList.push(id);
      });
    }

    const validIds = factories
      .filter((factory) => !failIdsList.includes(factory.id))
      .map((factory) => factory.id);

    try {
      if (!isEmpty(validIds)) {
        await this.factoryRepository.multipleRemove(validIds);
      }
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_DELETE'))
        .build();
    }

    if (isEmpty(failIdsList))
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.BAD_REQUEST)
      .withMessage(
        stringFormat(
          await this.i18n.t('error.DELETE_MULTIPLE_FAIL'),
          validIds.length,
          ids.length,
        ),
      )
      .build();
  }

  public async getDetail(
    id: number,
  ): Promise<ResponsePayload<FactoryDataResponseDto | any>> {
    const result = await this.factoryRepository.getDetail(id);

    if (!result) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.FACTORY_NOT_FOUND'))
        .build();
    }

    result.approver = {};

    if (result.approverId !== null) {
      const payload = new GetUsersRequestDto();
      payload.userIds = [result.approverId];
      const user = await this.userService.getListByIds(payload);
      result.approver = !isEmpty(user.data[0]) ? user.data[0] : {};
    }

    const user = await this.userRepository.getDetail(result.createdBy);
    result.createdBy = {
      id: user?.id,
      username: user?.username,
    };

    const company = await this.companyRepository.getDetail(result.companyId);
    result.companyName = company?.name;

    const region = await this.mmsService.detailRegion(result.regionId);
    result.region = region;
    const response = plainToClass(FactoryResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  importFactory(request: FileUpdloadRequestDto): Promise<any> {
    const file = request.file[0];
    const importRequestDto = {
      buffer: file.data,
      fileName: file.filename,
      mimeType: file.mimetype,
    } as ImportRequestDto;
    return this.factoryImport.importUtil(importRequestDto);
  }

  public async save(
    factoryEntity: Factory,
    payload: any,
    message?: string,
  ): Promise<ResponsePayload<FactoryDataResponseDto> | any> {
    try {
      const result = await this.factoryRepository.create(factoryEntity);

      const response = plainToClass(FactoryResponseDto, result, {
        excludeExtraneousValues: true,
      });

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate(message || 'message.success'))
        .withData(response)
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }

  public async getList(
    request: GetListFactoryRequestDto,
  ): Promise<ResponsePayload<GetListFactoryResponseDto | any>> {
    const { saleOrderIds } = request;
    if (saleOrderIds && !isEmpty(saleOrderIds)) {
      const factoryIds = await this.produceService.getFactoryIdsBySaleOrderIds(
        saleOrderIds,
      );
      if (!isEmpty(factoryIds)) {
        request.filter = [].concat(request.filter || [], {
          column: 'factoryIds',
          text: factoryIds,
        });
      }
    }

    const { result, count } = await this.factoryRepository.getList(request);

    const userIds = uniq(map(flatMap(result), 'approverId'));
    const payload = new GetUsersRequestDto();
    payload.userIds = userIds;
    const userData = await this.userService.getListByIds(payload);

    const users =
      userData.statusCode !== ResponseCodeEnum.NOT_FOUND
        ? serilize(userData.data)
        : [];

    const regions = await this.mmsService.listRegion();
    const regionMap = keyBy(regions, 'id');
    const factoryResult = result.map((factory) => ({
      ...factory,
      region: regionMap[factory.regionId],
      approver: users[factory.approverId] ? users[factory.approverId] : {},
    }));

    const response = plainToClass(FactoryResponseDto, factoryResult, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: { total: count, page: request.page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async checkUniqueFactoryByCondition(
    condition: any,
  ): Promise<boolean> {
    const result = await this.factoryRepository.findByCondition(condition);

    return result.length > 0;
  }

  public async confirm(
    request: SetStatusRequestDto,
  ): Promise<ResponsePayload<FactoryResponseDto | any>> {
    const { userId, id } = request;
    const factory = await this.factoryRepository.findOneById(id);

    if (!factory) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.FACTORY_NOT_FOUND'))
        .build();
    }

    const company = await this.companyRepository.findOneByCondition({
      id: factory.companyId,
      status: CompanyStatusEnum.CONFIRMED,
    });

    if (!company) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.COMPANY_NOT_CONFIRM'))
        .build();
    }

    factory.approverId = userId;
    factory.approvedAt = new Date(Date.now());
    factory.status = FactoryStatusEnum.CONFIRMED;
    const result = await this.factoryRepository.create(factory);

    const response = plainToClass(FactoryResponseDto, result, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  public async reject(
    request: SetStatusRequestDto,
  ): Promise<ResponsePayload<FactoryResponseDto | any>> {
    const { userId, id } = request;
    const factory = await this.factoryRepository.findOneById(id);

    if (!factory) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.FACTORY_NOT_FOUND'))
        .build();
    }

    if (factory.status === CompanyStatusEnum.CONFIRMED) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.FACTORY_WAS_CONFIRMED'),
      ).toResponse();
    }

    factory.approverId = userId;
    factory.approvedAt = new Date(Date.now());
    factory.status = FactoryStatusEnum.REJECT;
    const result = await this.factoryRepository.create(factory);

    const response = plainToClass(FactoryResponseDto, result, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async isExist(request: SetStatusRequestDto): Promise<ResponsePayload<any>> {
    const { id, userId } = request;

    const factory = await this.factoryRepository.findOneById(id);

    if (!factory) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.EXIST_FACTORY)
        .build();
    }

    const userFactorys = await this.userFactoryRepository.isExist({
      factoryId: id,
      userId: userId,
    });

    if (userFactorys.length == 0) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_EXIST_USER_FACTORY)
        .build();
    }
    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
  }

  async saveFactories(
    request: CreateFactoriesRequestDto[],
  ): Promise<ResponsePayload<any>> {
    const dataCreate: any[] = [];
    const dataEdit: any[] = [];
    const codeError: any[] = [];
    const companyNames: any[] = [];
    const regionCodes: any[] = [];
    const factoryEntities: any[] = [];
    let result: any[] = [];
    const error: any[] = [];

    const dataKeyCompanyMap = keyBy(request, 'company');
    const dataKeyRegionMap = keyBy(request, 'region');

    for (let i = 0; i < request.length; i++) {
      const element = request[i];
      companyNames.push(element.company);
      regionCodes.push(element.region);
      if (element.action === (await this.i18n.translate('import.common.add'))) {
        delete element.action;
        dataCreate.push(element);
      }
      if (
        element.action === (await this.i18n.translate('import.common.edit'))
      ) {
        delete element.action;
        dataEdit.push(element);
      }
    }

    const companies = await this.companyRepository.findByCondition({
      name: In(companyNames),
    });
    const companyMap = keyBy(companies, 'name');

    const regions = await this.mmsService.listRegion({ codes: regionCodes });
    const regionMap = uniq(map(regions, 'code'));

    // create
    if (dataCreate.length > 0) {
      const listCode = dataCreate.map((i) => {
        return i.code;
      });

      const factories = await this.factoryRepository.findByCondition({
        code: In(listCode),
      });
      const factoryMap = keyBy(factories, 'code');
      if (factories.length > 0) {
        for (let i = 0; i < dataCreate.length; i++) {
          const data = dataCreate[i];
          if (has(factoryMap, data.code)) {
            codeError.push(data.code);
            error[data.line] = await this.i18n.translate(
              'import.error.codeExist',
              {
                args: {
                  value: data.code,
                },
              },
            );
          }
          if (!has(companyMap, data.company)) {
            codeError.push(dataKeyCompanyMap[data.company].code);
            error[data.line] = await this.i18n.translate(
              'import.error.notFound',
              {
                args: {
                  value: data.company,
                },
              },
            );
          }
          if (!has(regionMap, data.region)) {
            codeError.push(dataKeyRegionMap[data.region].code);
            error[data.line] = await this.i18n.translate(
              'import.error.notFound',
              {
                args: {
                  value: data.region,
                },
              },
            );
          }
        }
      }

      const dataDto = dataCreate.filter((e) => !codeError.includes(e.code));
      for (let i = 0; i < dataDto.length; i++) {
        const factory = dataDto[i];
        const factoryDto = new CreateFactoryRequestDto();
        factoryDto.code = factory.code;
        factoryDto.name = factory.name;
        factoryDto.description = factory.description;
        factoryDto.location = factory.location;
        factoryDto.phone = factory.phone;
        factoryDto.userId = factory.createdBy;
        factoryDto.companyId = companyMap[factory.company]?.id;
        factoryDto.regionId = regionMap[factory.region]?.id;
        factoryEntities.push(
          await this.factoryRepository.createEntity(factoryDto),
        );
      }
    }

    // edit
    if (dataEdit.length > 0) {
      const dataMap = keyBy(dataEdit, 'code');
      const listCode = dataEdit.map((i) => {
        return i.code;
      });
      const factories = await this.factoryRepository.findByCondition({
        code: In(listCode),
      });
      const factoryMap = keyBy(factories, 'code');
      for (let i = 0; i < dataEdit.length; i++) {
        const data = dataEdit[i];
        const factory = has(factoryMap, data.code)
          ? factoryMap[data.code]
          : ({} as any);
        if (isEmpty(factory)) {
          codeError.push(data.code);
          error[data.line] = await this.i18n.translate(
            'import.error.codeNotExist',
            {
              args: {
                value: data.code,
              },
            },
          );
        } else if (!has(companyMap, data.company)) {
          codeError.push(dataKeyCompanyMap[data.company].code);
          error[data.line] = await this.i18n.translate(
            'import.error.notFound',
            {
              args: {
                value: data.company,
              },
            },
          );
        } else if (!has(regionMap, data.region)) {
          codeError.push(dataKeyRegionMap[data.region].code);
          error[data.line] = await this.i18n.translate(
            'import.error.notFound',
            {
              args: {
                value: data.region,
              },
            },
          );
        } else if (!CAN_UPDATE_FACTORY_STATUS.includes(factory.status)) {
          codeError.push(factory.code);
          error[data.line] = await this.i18n.translate(
            'import.error.factoryWasConfirm',
            {
              args: {
                value: factory.code,
              },
            },
          );
        } else {
          const factoryDto = new CreateFactoryRequestDto();
          factoryDto.code = dataMap[factory.code].code;
          factoryDto.name = dataMap[factory.code].name;
          factoryDto.description = dataMap[factory.code].description;
          factoryDto.location = dataMap[factory.code].location;
          factoryDto.phone = dataMap[factory.code].phone;
          factoryDto.userId = dataMap[factory.code].createdBy;
          factoryDto.companyId = companyMap[dataMap[factory.code].company].id;
          factoryDto.regionId = regionMap[dataMap[factory.code].region].id;
          factoryEntities.push(
            await this.factoryRepository.updateEntity(factory, factoryDto),
          );
        }
      }
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      result = await queryRunner.manager.save(factoryEntities);
      await queryRunner.commitTransaction();
    } catch (error) {
      queryRunner.rollbackTransaction();
      return new ResponseBuilder(error)
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .build();
    } finally {
      await queryRunner.release();
    }

    return new ResponseBuilder([result, error])
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }
}
