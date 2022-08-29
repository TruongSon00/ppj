import { CompanyRepositoryInterface } from '@components/company/interface/company.repository.interface';
import { ImportDataAbstract } from '@core/abstracts/import-data.abstract';
import { ImportRequestDto } from '@core/dto/import/request/import.request.dto';
import { ImportResponseDto } from '@core/dto/import/response/import.response.dto';
import { ImportResultDto } from '@core/dto/import/response/import.result.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty, keyBy } from 'lodash';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { DataSource, In } from 'typeorm';
import { FactoryRepositoryInterface } from '../interface/factory.repository.interface';
import { CreateFactoryRequestDto } from '../dto/request/create-factory.request.dto';
@Injectable()
export class FactoryImport extends ImportDataAbstract {
  private readonly FIELD_TEMPLATE_CONST = {
    CODE: {
      DB_COL_NAME: 'factoryCode',
      COL_NAME: 'Mã nhà máy',
      MAX_LENGTH: 9,
      ALLOW_NULL: false,
      REGEX: /^([a-zA-Z0-9]+)$/,
    },
    NAME: {
      DB_COL_NAME: 'factoryName',
      COL_NAME: 'Tên nhà máy',
      MAX_LENGTH: 255,
      ALLOW_NULL: false,
    },
    COMPANY: {
      DB_COL_NAME: 'companyName',
      COL_NAME: 'Tên công ty',
      MAX_LENGTH: 255,
      ALLOW_NULL: false,
    },
    DESCRIPTION: {
      DB_COL_NAME: 'description',
      COL_NAME: 'Mô tả',
      MAX_LENGTH: 255,
      ALLOW_NULL: true,
    },
    LOCATION: {
      DB_COL_NAME: 'location',
      COL_NAME: 'Địa chỉ',
      MAX_LENGTH: 255,
      ALLOW_NULL: true,
    },
    PHONE: {
      DB_COL_NAME: 'phone',
      COL_NAME: 'Số điện thoại',
      MAX_LENGTH: 20,
      ALLOW_NULL: true,
    },
    REQUIRED_COL_NUM: 7,
  };

  constructor(
    @Inject('FactoryRepositoryInterface')
    private readonly factoryRepository: FactoryRepositoryInterface,
    @Inject('CompanyRepositoryInterface')
    private readonly companyRepository: CompanyRepositoryInterface,
    @InjectDataSource()
    private readonly connection: DataSource,
    protected readonly i18n: I18nRequestScopeService,
    protected readonly configService: ConfigService,
  ) {
    super(i18n);
    this.init();
  }

  private init() {
    this.fieldsMap.groupSet(
      [2, 3, 4, 5, 6, 7],
      [
        this.FIELD_TEMPLATE_CONST.CODE,
        this.FIELD_TEMPLATE_CONST.NAME,
        this.FIELD_TEMPLATE_CONST.COMPANY,
        this.FIELD_TEMPLATE_CONST.DESCRIPTION,
        this.FIELD_TEMPLATE_CONST.LOCATION,
        this.FIELD_TEMPLATE_CONST.PHONE,
      ],
    );
  }

  protected async saveImportDataDto(
    dataDto: any[],
    logs: ImportResultDto[],
    error: number,
    total: number,
  ): Promise<ImportResponseDto> {
    const findByCode = await this.factoryRepository.findWithRelations({
      where: {
        code: In(dataDto.map((i) => i.factoryCode)),
      },
    });
    const findByName = await this.factoryRepository.findWithRelations({
      where: {
        name: In(dataDto.map((i) => i.factoryName)),
      },
    });
    const findByCompany = await this.companyRepository.findWithRelations({
      where: {
        name: In(dataDto.map((i) => i.companyName)),
      },
    });

    findByCode.forEach((i) => Object.assign(i, { type: 'old' }));
    findByName.forEach((i) => Object.assign(i, { type: 'old' }));

    const findByCodeMap = keyBy(findByCode, 'code');
    const findByNameMap = keyBy(findByName, 'name');
    const findByCompanyMap = keyBy(findByCompany, 'name');
    const entities = [];
    const valid = [];
    const {
      duplicateCodeOrNameMsg,
      invalidCompanyMsg,
      codeNotExistMsg,
      successMsg,
      unsuccessMsg,
      addText,
      updateText,
    } = await this.getMessage();
    dataDto.forEach((data) => {
      const {
        i,
        action,
        factoryCode,
        factoryName,
        companyName,
        description,
        location,
        phone,
      } = data;
      const logRow = {
        id: i,
        row: i,
        action: action,
      } as ImportResultDto;
      const msgLogs = [];

      const formatedData = new CreateFactoryRequestDto();
      formatedData.code = factoryCode;
      formatedData.name = factoryName;
      formatedData.description = description;
      formatedData.location = location;
      formatedData.phone = phone;
      formatedData.companyId = findByCompanyMap[companyName]?.id;

      if (!findByCompanyMap[companyName]) {
        msgLogs.push(invalidCompanyMsg);
      } else if (action.toLowerCase() === addText) {
        // truong hop tao (Create)
        if (findByCodeMap[factoryCode] || findByNameMap[factoryName])
          msgLogs.push(duplicateCodeOrNameMsg);
        else {
          const entity = this.factoryRepository.createEntity(formatedData);
          entities.push(entity);
          Object.assign(entity, { type: 'new' });
          findByCodeMap[factoryCode] = entity;
          findByNameMap[factoryName] = entity;
        }
      } else if (action.toLowerCase() === updateText) {
        // truong hop sua (edit)
        if (
          findByCodeMap[factoryCode] &&
          findByCodeMap[factoryCode]?.['type'] === 'old'
        ) {
          if (
            findByNameMap[factoryName] &&
            findByNameMap[factoryName].id != findByCodeMap[factoryCode].id
          )
            msgLogs.push(duplicateCodeOrNameMsg);
          else {
            const entity = this.factoryRepository.updateEntity(
              findByCodeMap[factoryCode],
              formatedData,
            );
            entities.push(entity);
            Object.assign(entity, { type: 'new' });
            findByCodeMap[factoryCode] = entity;
            findByNameMap[factoryName] = entity;
          }
        } else {
          msgLogs.push(codeNotExistMsg);
        }
      }

      if (isEmpty(msgLogs)) {
        logRow.log = [successMsg];
        valid.push(logRow);
      } else {
        logRow.log = msgLogs;
        logs.push(logRow);
      }
    });
    const response = new ImportResponseDto();
    if (!isEmpty(entities)) {
      const queryRunner = this.connection.createQueryRunner();
      await queryRunner.startTransaction();
      try {
        await queryRunner.manager.save(entities);
        await queryRunner.commitTransaction();
        response.successCount = valid.length;
      } catch (error) {
        queryRunner.rollbackTransaction();
        response.successCount = 0;
        valid.forEach((l) => (l.log = [unsuccessMsg]));
      } finally {
        await queryRunner.release();
        logs.push(...valid);
      }
    }
    response.result = logs;
    response.totalCount = total;
    response.result;
    return response;
  }

  public async importUtil(
    request: ImportRequestDto,
  ): Promise<ResponsePayload<ImportResponseDto | any>> {
    return super.importUtil(
      request,
      this.FIELD_TEMPLATE_CONST.REQUIRED_COL_NUM,
    );
  }
}
