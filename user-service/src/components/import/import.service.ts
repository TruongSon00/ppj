import { Inject, Injectable } from '@nestjs/common';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ImportServiceInterface } from './interface/import.service.interface';
import { ImportRequestDto } from './dto/request/import.request.dto';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { TypeEnum } from '@components/export/export.constant';
import { Workbook } from 'exceljs';
import { TEMPLATE_FACTORY } from './import.constant';
import { isNotEmpty } from 'class-validator';
import { isEmpty, uniq } from 'lodash';
import { toStringTrim } from '@utils/object.util';
import { FactoryServiceInterface } from '@components/factory/interface/factory.service.interface';
import { getDataDuplicate } from '@utils/common';

@Injectable()
export class ImportService implements ImportServiceInterface {
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,

    @Inject('FactoryServiceInterface')
    private readonly factoryService: FactoryServiceInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async handleWorkbook(
    workbook: any,
    template: any,
    header: any,
    sheetName: any,
    userId: any,
  ) {
    const sizeHeader = Object.keys(header).length;
    const templateMap = new Map(
      Object.keys(template).map((key) => [key, template[key]]),
    );
    const templateKeyMap = new Map(
      Object.keys(template).map((key, index) => [index, key]),
    );
    const worksheet = workbook.getWorksheet(sheetName);
    return await this.getDataWorksheet(
      worksheet,
      templateMap,
      templateKeyMap,
      sizeHeader,
      header,
      userId,
    );
  }

  async getDataWorksheet(
    worksheet,
    templateMap,
    templateKeyMap,
    sizeHeader,
    header,
    userId,
  ) {
    const data: any[] = [];
    const dataError: any[] = [];
    let isData = false;
    for (let i = 0; i <= worksheet?.rowCount; i++) {
      const row = worksheet.getRow(i);
      if (isData) {
        const obj: any = {};
        let error = '';
        obj['createdBy'] = userId;
        obj['line'] = i;
        for (let j = 0; j < row.cellCount; j++) {
          const cell = row.getCell(j + 1);
          obj[templateKeyMap.get(j)] = cell.value;
          error = await this.validateDataCell(
            header,
            templateMap.get(templateKeyMap.get(j)),
            cell.value,
          );
          if (isNotEmpty(error)) {
            break;
          }
        }
        if (isNotEmpty(error)) {
          dataError[i] = error;
          error = '';
        } else data.push(obj);
      }
      if (row.cellCount === sizeHeader && !isData) {
        isData = true;
        for (let j = 0; j < row.cellCount; j++) {
          const cell = row.getCell(j + 1);
          if (header[templateKeyMap.get(j)] !== cell.value) {
            return [
              [
                {
                  statusCode: ResponseCodeEnum.NOT_FOUND,
                  message: await this.i18n.translate(
                    'error.HEADER_TEMPLATE_ERROR',
                  ),
                },
              ],
              [],
            ];
          }
        }
      }
    }
    return await this.validateDataUniqueCode(data, dataError);
  }

  async validateDataCell(header, template, value) {
    let error: any = '';
    // check not null
    if (template.notNull) {
      error = isNotEmpty(value)
        ? error
        : await this.i18n.translate('import.error.notNull', {
            args: {
              value: header[template.key],
            },
          });
    }

    // check key
    if (
      template.key === TEMPLATE_FACTORY.action.key &&
      !(
        value === (await this.i18n.translate('import.common.add')) ||
        value === (await this.i18n.translate('import.common.edit'))
      )
    ) {
      error = this.i18n.translate('import.error.acction');
    }

    // check string max length
    if (template.maxLength && template.type === 'string') {
      error =
        value && toStringTrim(value)?.length > template.maxLength
          ? await this.i18n.translate('import.error.maxLength', {
              args: {
                value: header[template.key],
                number: template.maxLength,
              },
            })
          : error;
    }

    return error;
  }

  async validateDataUniqueCode(data: any[], dataError: any[]) {
    const listCode = data.map((i) => {
      return i?.code;
    });
    if (isEmpty(listCode)) return [data, dataError];
    let dataDuplicate = getDataDuplicate(listCode);
    dataDuplicate = uniq(dataDuplicate);
    if (dataDuplicate.length > 0) {
      const newData: any[] = [];
      const newDataError: any[] = [...dataError];
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (dataDuplicate.includes(item.code)) {
          newDataError[item.line] = await this.i18n.translate(
            'import.error.duplicateCode',
            {
              args: {
                value: item.code,
              },
            },
          );
        } else {
          newData.push(item);
        }
      }
      return [newData, newDataError];
    }

    return [data, dataError];
  }

  async import(request: ImportRequestDto): Promise<any> {
    const { type, files, userId } = request;

    const workbook = new Workbook();
    await workbook.xlsx.load(Buffer.from(files[0].data));
    switch (type) {
      case TypeEnum.FACTORY:
        return this.importFactories(workbook, userId);
      default:
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .build();
    }
  }

  async importFactories(workbook: any, userId) {
    let result: any[] = [];
    const resultError: any[] = [];
    const header = {
      action: await this.i18n.translate('import.common.action'),
      code: await this.i18n.translate('import.factory.code'),
      name: await this.i18n.translate('import.factory.name'),
      company: await this.i18n.translate('import.factory.company'),
      region: await this.i18n.translate('import.factory.region'),
      location: await this.i18n.translate('import.factory.location'),
      phone: await this.i18n.translate('import.common.phone'),
      description: await this.i18n.translate('import.common.description'),
    };

    const [data, dataError] = await this.handleWorkbook(
      workbook,
      TEMPLATE_FACTORY,
      header,
      await this.i18n.translate('import.sheetName.factory'),
      userId,
    );

    if (data[0]?.statusCode === ResponseCodeEnum.NOT_FOUND) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(data[0]?.message)
        .build();
    }

    const resultSave = await this.factoryService.saveFactories(data);
    if (resultSave.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(resultSave.message)
        .build();
    }
    const [resultSaveData, resultSaveError] = resultSave.data;
    result = resultSaveData;
    for (let i = 0; i < dataError.length; i++) {
      if (dataError[i]) resultError[i] = dataError[i];
    }
    for (let i = 0; i < resultSaveError.length; i++) {
      if (resultSaveError[i]) resultError[i] = resultSaveError[i];
    }

    return new ResponseBuilder({ result, resultError })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  // async fileImportResult(
  //   workbook,
  //   sheetName,
  //   columnResultReason,
  //   firstIndexData,
  //   resultSaveError,
  // ) {
  //   const worksheet = workbook.getWorksheet(sheetName);
  //   const headers = worksheet.getRow(3);
  //   headers.getCell(columnResultReason[0]).value = await this.i18n.translate(
  //     'import.factory.result',
  //   );
  //   headers.getCell(columnResultReason[1]).value = await this.i18n.translate(
  //     'import.factory.reason',
  //   );

  //   for (let i = firstIndexData; i < resultSaveError.length; i++) {
  //     const element = resultSaveError[i];
  //     const row = worksheet.getRow(i);
  //     if (!element)
  //       row.getCell(columnResultReason[0]).value = await this.i18n.translate(
  //         'import.common.success',
  //       );
  //     else {
  //       row.getCell(columnResultReason[0]).value = await this.i18n.translate(
  //         'import.common.fail',
  //       );
  //       row.getCell(columnResultReason[1]).value = element;
  //     }
  //   }

  //   await workbook.xlsx.writeFile('file-import-result.xlsx');

  //   return workbook;
  // }
}
