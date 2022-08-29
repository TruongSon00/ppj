import { Inject, Injectable } from '@nestjs/common';
import { ResponsePayload } from '@utils/response-payload';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { plainToClass } from 'class-transformer';
import { PagingResponse } from '@utils/paging.response';
import { Company } from '@entities/company/company.entity';
import { CompanyServiceInterface } from '@components/company/interface/company.service.interface';
import { CompanyRepositoryInterface } from '@components/company/interface/company.repository.interface';
import { CompanyRequestDto } from '@components/company/dto/request/company.request.dto';
import { GetListCompanyRequestDto } from '@components/company/dto/request/get-list-company.request.dto';
import { CompanyDataResponseDto } from '@components/company/dto/response/company-data.response.dto';
import { UpdateCompanyRequestDto } from '@components/company/dto/request/update-company.request.dto';
import { GetListCompanyResponseDto } from '@components/company/dto/response/get-list-company.response.dto';
import { CompanyResponseDto } from '@components/company/dto/response/company.response.dto';
import { In, Not, ILike } from 'typeorm';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { WarehouseService } from '@components/warehouse/warehouse.service';
import {
  CAN_DELETE_COMPANY_STATUS,
  CAN_UPDATE_COMPANY_STATUS,
  CompanyStatusEnum,
} from '@components/company/company.constant';
import { ApiError } from '@utils/api.error';
import { SetStatusRequestDto } from './dto/request/set-status.request.dto';
import { FactoryRepositoryInterface } from '@components/factory/interface/factory.repository.interface';
import { serilize } from '@utils/helper';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { GetUsersRequestDto } from '@components/user/dto/request/get-users-request.dto';
import { flatMap, map, uniq } from 'lodash';
import { FileUpdloadRequestDto } from '@core/dto/file-upload.request';
import { ImportRequestDto } from '@core/dto/import/request/import.request.dto';
import { CompanyImport } from './import/company.import.helper';
import { UserRepositoryInterface } from '@components/user/interface/user.repository.interface';
import { DeleteMultipleDto } from '@core/dto/multiple/delete-multiple.dto';
import isEmpty from '@utils/helper';
import { stringFormat } from '@utils/object.util';
@Injectable()
export class CompanyService implements CompanyServiceInterface {
  constructor(
    @Inject('CompanyRepositoryInterface')
    private readonly companyRepository: CompanyRepositoryInterface,

    @Inject('CompanyImport')
    private readonly companyImport: CompanyImport,

    private readonly i18n: I18nRequestScopeService,

    @Inject('WarehouseServiceInterface')
    private readonly warehouseService: WarehouseService,

    @Inject('FactoryRepositoryInterface')
    private readonly factoryRepository: FactoryRepositoryInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,

    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async create(
    companyDto: CompanyRequestDto,
  ): Promise<ResponsePayload<CompanyDataResponseDto | any>> {
    const codeCondition = [{ code: ILike(companyDto.code) }];
    const checkExistCode = await this.checkUniqueCompany(codeCondition);

    if (checkExistCode) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CODE_ALREADY_EXISTS'))
        .build();
    }

    const companyEntity = await this.companyRepository.createEntity(companyDto);

    return await this.save(
      companyEntity,
      companyDto,
      'message.defineCompany.createSuccess',
    );
  }

  public async update(
    companyDto: UpdateCompanyRequestDto | any,
  ): Promise<ResponsePayload<CompanyDataResponseDto | any>> {
    const company = await this.companyRepository.findOneById(companyDto.id);

    if (!company) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.COMPANY_NOT_FOUND'))
        .build();
    }

    if (!CAN_UPDATE_COMPANY_STATUS.includes(company.status)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.COMPANY_WAS_CONFIRMED'),
      ).toResponse();
    }

    const codeCondition = [
      { code: ILike(companyDto.code), id: Not(companyDto.id) },
    ];
    const checkExistCode = await this.checkUniqueCompany(codeCondition);

    if (checkExistCode) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CODE_ALREADY_EXISTS'))
        .build();
    }

    company.code = companyDto.code;
    company.name = companyDto.name;
    company.address = companyDto.address;
    company.phone = companyDto.phone;
    company.taxNo = companyDto.taxNo;
    company.email = companyDto.email;
    company.fax = companyDto.fax;
    company.description = companyDto.description;
    company.status = CompanyStatusEnum.CREATED;
    company.approverId = null;
    company.approvedAt = null;
    company.bank = companyDto.bank;
    company.bankAccount = companyDto.bankAccount;
    company.bankAccountOwner = companyDto.bankAccountOwner;

    return await this.save(
      company,
      companyDto,
      'message.defineCompany.updateSuccess',
    );
  }

  public async delete(id: number): Promise<ResponsePayload<any>> {
    const company = await this.companyRepository.findOneByCondition({
      id: id,
      deletedAt: null,
    });

    if (!company) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.COMPANY_NOT_FOUND'))
        .build();
    }

    if (!CAN_DELETE_COMPANY_STATUS.includes(company.status)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.COMPANY_WAS_CONFIRMED'),
      ).toResponse();
    }

    const factories = await this.factoryRepository.findByCondition({
      companyId: id,
    });

    if (factories.length > 0) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.MUST_DELETE_FACTORY'),
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

    try {
      await this.companyRepository.remove(id);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(
          await this.i18n.translate('message.defineCompany.deleteSuccess'),
        )
        .build();
    } catch (error) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CAN_NOT_DELETE'),
      ).toResponse();
    }
  }

  async deleteMultiple(
    request: DeleteMultipleDto,
  ): Promise<ResponsePayload<any>> {
    const failIdsList = [];
    const ids = request.ids.split(',').map((id) => parseInt(id));

    const companies = await this.companyRepository.findByCondition({
      id: In(ids),
    });
    const companyIds = companies.map((company) => company.id);
    if (companies.length !== ids.length) {
      ids.forEach((id) => {
        if (!companyIds.includes(id)) failIdsList.push(id);
      });
    }

    const factories = await this.factoryRepository.findByCondition({
      companyId: In(ids),
    });
    if (factories.length > 0) {
      const factoryCompanyIds = factories.map((factory) => factory.companyId);
      companies.forEach((company) => {
        if (factoryCompanyIds.includes(company.id))
          failIdsList.push(company.id);
      });
    }
    const companyWarehouses =
      await this.warehouseService.getWarehouseListByCompanyIds({
        companyId: ids,
      });

    if (companyWarehouses.length > 0) {
      const warehouseCompanyIds = companyWarehouses.map(
        (warehouse) => warehouse.companyId,
      );
      companies.forEach((company) => {
        if (warehouseCompanyIds.includes(company.id))
          failIdsList.push(company.id);
      });
    }

    const validIds = companies
      .filter((company) => !failIdsList.includes(company.id))
      .map((company) => company.id);

    try {
      if (!isEmpty(validIds)) {
        await this.companyRepository.multipleRemove(validIds);
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
  ): Promise<ResponsePayload<CompanyDataResponseDto | any>> {
    const result = await this.companyRepository.getDetail(id);
    if (!result) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.COMPANY_NOT_FOUND'))
        .build();
    }

    result.approver = {};

    if (result.approverId !== null) {
      const payload = new GetUsersRequestDto();
      payload.userIds = [result.approverId];
      const user = await this.userService.getListByIds(payload);
      result.approver = user.data[0] ? user.data[0] : {};
    }

    const user = await this.userRepository.getDetail(result.createdBy);
    result.createdBy = {
      id: user?.id,
      username: user?.username,
    };

    const response = plainToClass(CompanyResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async getList(
    request: GetListCompanyRequestDto,
  ): Promise<ResponsePayload<GetListCompanyResponseDto | any>> {
    const { result, count } = await this.companyRepository.getList(request);

    const userIds = uniq(map(flatMap(result), 'approverId'));
    const payload = new GetUsersRequestDto();
    payload.userIds = userIds;
    const userData = await this.userService.getListByIds(payload);
    const users =
      userData.statusCode !== ResponseCodeEnum.NOT_FOUND
        ? serilize(userData.data)
        : [];

    const companyResult = result.map((company) => ({
      ...company,
      approver: users[company.approverId] ? users[company.approverId] : {},
    }));

    const response = plainToClass(CompanyResponseDto, companyResult, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: { total: count, page: request.page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  importCompany(request: FileUpdloadRequestDto): Promise<any> {
    const file = request.file[0];
    const importRequestDto = {
      buffer: file.data,
      fileName: file.filename,
      mimeType: file.mimetype,
    } as ImportRequestDto;
    return this.companyImport.importUtil(importRequestDto);
  }

  public async save(
    companyEntity: Company,
    payload: any,
    message?: string,
  ): Promise<ResponsePayload<CompanyDataResponseDto> | any> {
    try {
      const result = await this.companyRepository.create(companyEntity);
      const response = plainToClass(CompanyResponseDto, result, {
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

  private async checkUniqueCompany(condition: any): Promise<boolean> {
    const result = await this.companyRepository.findByCondition(condition);
    return result.length > 0;
  }

  public async confirm(
    request: any,
  ): Promise<ResponsePayload<CompanyResponseDto | any>> {
    const { userId, id } = request;

    const company = await this.companyRepository.findOneById(id);

    if (!company) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.COMPANY_NOT_FOUND'))
        .build();
    }

    company.approverId = userId;
    company.approvedAt = new Date(Date.now());
    company.status = CompanyStatusEnum.CONFIRMED;
    const result = await this.companyRepository.create(company);
    const response = plainToClass(CompanyResponseDto, result, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  public async reject(
    request: SetStatusRequestDto,
  ): Promise<ResponsePayload<CompanyResponseDto | any>> {
    const { userId, id } = request;
    const company = await this.companyRepository.findOneById(id);

    if (!company) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.COMPANY_NOT_FOUND'))
        .build();
    }

    if (company.status === CompanyStatusEnum.CONFIRMED) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.COMPANY_WAS_CONFIRMED'),
      ).toResponse();
    }

    company.approverId = userId;
    company.approvedAt = new Date(Date.now());
    company.status = CompanyStatusEnum.REJECT;
    const result = await this.companyRepository.create(company);
    const response = plainToClass(CompanyResponseDto, result, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  public async getListCompanyByCodes(
    codes: string[],
  ): Promise<ResponsePayload<CompanyResponseDto | any>> {
    const companies = await this.companyRepository.findByCondition({
      code: In(codes),
    });
    const response = plainToClass(CompanyResponseDto, companies, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }
}
