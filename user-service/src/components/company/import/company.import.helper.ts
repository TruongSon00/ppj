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
import { CompanyRequestDto } from '../dto/request/company.request.dto';
import { CompanyRepositoryInterface } from '../interface/company.repository.interface';
import { REGEX_MAIL, REGEX_PHONE } from '@constant/common';

@Injectable()
export class CompanyImport extends ImportDataAbstract {
  private readonly FIELD_TEMPLATE_CONST = {
    CODE: {
      DB_COL_NAME: 'companyCode',
      COL_NAME: ['Mã', 'Code', '会社コード'],
      MAX_LENGTH: 4,
      ALLOW_NULL: false,
      REGEX: /^([a-zA-Z0-9]+)$/,
    },
    NAME: {
      DB_COL_NAME: 'companyName',
      COL_NAME: ['Tên', 'Name', '会社名'],
      MAX_LENGTH: 255,
      ALLOW_NULL: false,
    },
    DESCRIPTION: {
      DB_COL_NAME: 'description',
      COL_NAME: ['Mô tả', 'Description', '説明'],
      MAX_LENGTH: 255,
      ALLOW_NULL: true,
    },
    ADDRESS: {
      DB_COL_NAME: 'address',
      COL_NAME: ['Địa chỉ', 'Address', '住所'],
      MAX_LENGTH: 255,
      ALLOW_NULL: true,
    },
    PHONE: {
      DB_COL_NAME: 'phone',
      COL_NAME: ['Số điện thoại', 'Phone number', '電話番号'],
      MAX_LENGTH: 20,
      ALLOW_NULL: true,
      REGEX_PHONE: REGEX_PHONE,
    },
    FAX: {
      DB_COL_NAME: 'fax',
      COL_NAME: 'FAX',
      MAX_LENGTH: 255,
      ALLOW_NULL: true,
    },
    EMAIL: {
      DB_COL_NAME: 'email',
      COL_NAME: ['Email', 'メールアドレス'],
      MAX_LENGTH: 255,
      ALLOW_NULL: true,
      REGEX_MAIL: REGEX_MAIL,
    },
    TAXNO: {
      DB_COL_NAME: 'taxNo',
      COL_NAME: ['Mã thuế', 'Tax code', '納税者番号'],
      MAX_LENGTH: 255,
      ALLOW_NULL: true,
    },
    BANK_ACCOUNT: {
      DB_COL_NAME: 'bankAccount',
      COL_NAME: ['STK Ngân Hàng', 'Bank account number', '銀行の口座番号'],
      MAX_LENGTH: 255,
      ALLOW_NULL: true,
    },
    BANK_ACCOUNT_OWNER: {
      DB_COL_NAME: 'bankAccountOwner',
      COL_NAME: ['Chủ tài khoản', 'Bank owner name', '口座名義人'],
      MAX_LENGTH: 255,
      ALLOW_NULL: true,
    },
    BANK: {
      DB_COL_NAME: 'bank',
      COL_NAME: ['Tên ngân hàng', 'Bank name', ' 銀行名'],
      MAX_LENGTH: 255,
      ALLOW_NULL: true,
    },
    REQUIRED_COL_NUM: 12,
  };

  constructor(
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
      [2, 3, 4, 5, 6, 7, 8, 9],
      [
        this.FIELD_TEMPLATE_CONST.CODE,
        this.FIELD_TEMPLATE_CONST.NAME,
        this.FIELD_TEMPLATE_CONST.DESCRIPTION,
        this.FIELD_TEMPLATE_CONST.ADDRESS,
        this.FIELD_TEMPLATE_CONST.PHONE,
        this.FIELD_TEMPLATE_CONST.FAX,
        this.FIELD_TEMPLATE_CONST.EMAIL,
        this.FIELD_TEMPLATE_CONST.TAXNO,
        this.FIELD_TEMPLATE_CONST.BANK_ACCOUNT,
        this.FIELD_TEMPLATE_CONST.BANK_ACCOUNT_OWNER,
        this.FIELD_TEMPLATE_CONST.BANK,
      ],
    );
  }

  protected async saveImportDataDto(
    dataDto: any[],
    logs: ImportResultDto[],
    error: number,
    total: number,
  ): Promise<ImportResponseDto> {
    const findByCode = await this.companyRepository.findWithRelations({
      where: {
        code: In(dataDto.map((i) => i.companyCode)),
      },
    });
    const findByName = await this.companyRepository.findWithRelations({
      where: {
        name: In(dataDto.map((i) => i.companyName)),
      },
    });

    findByCode.forEach((i) => Object.assign(i, { type: 'old' }));

    const findByCodeMap = keyBy(findByCode, 'code');
    const findByNameMap = keyBy(findByName, 'name');
    const entities = [];
    const valid = [];
    const {
      duplicateCodeMsg,
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
        companyCode,
        companyName,
        description,
        address,
        phone,
        fax,
        email,
        taxNo,
        bankAccount,
        bankAccountOwner,
        bank,
      } = data;
      const logRow = {
        id: i,
        row: i,
        action: action,
      } as ImportResultDto;
      const msgLogs = [];

      const formatedData = new CompanyRequestDto();
      formatedData.code = companyCode?.trim();
      formatedData.name = companyName?.trim();
      formatedData.description = description?.trim() || '';
      formatedData.address = address?.trim();
      formatedData.phone = phone?.trim();
      formatedData.fax = fax?.trim();
      formatedData.email = email?.trim();
      formatedData.taxNo = taxNo?.trim();
      formatedData.bankAccount = bankAccount?.trim() || '';
      formatedData.bankAccountOwner = bankAccountOwner?.trim() || '';
      formatedData.bank = bank?.trim() || '';

      if (action.toLowerCase() === addText) {
        if (findByCodeMap[companyCode]) {
          msgLogs.push(duplicateCodeMsg);
        } else {
          const entity = this.companyRepository.createEntity(formatedData);
          entities.push(entity);
          Object.assign(entity, { type: 'new' });
          findByCodeMap[companyCode] = entity;
          findByNameMap[companyName] = entity;
        }
      } else if (action.toLowerCase() === updateText) {
        if (
          findByCodeMap[companyCode] &&
          findByCodeMap[companyCode]?.['type'] === 'old'
        ) {
          const entity = this.companyRepository.updateEntity(
            findByCodeMap[companyCode],
            formatedData,
          );
          entities.push(entity);
          Object.assign(entity, { type: 'new' });
          findByCodeMap[companyCode] = entity;
          findByNameMap[companyName] = entity;
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
