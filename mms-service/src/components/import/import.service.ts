import { Injectable } from '@nestjs/common';
import { ImportServiceInterface } from '@components/import/interface/import.service.interface';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { isEmpty } from 'lodash';
import { I18N_KEY_CONST } from '@constant/i18n.constant';
import { ImportRequestDto } from '@components/import/dto/request/import.request.dto';
import { Row, Workbook, Worksheet, CellValue } from 'exceljs';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import {
  IMPORT_ACTION_CONST,
  JSON_KEY,
} from '@components/import/import.constant';
import { ResponsePayload } from '@utils/response-payload';
import { ResponseBuilder } from '@utils/response-builder';
import { EOL } from 'os';
import { getCellValueByRow } from '@utils/extensions/excel.extension';
import { ImportResponseDto } from '@components/import/dto/response/import.response.dto';
import { ImportResultBaseDto } from '@components/import/dto/response/import-result.base.dto';
import { ImportBaseDto } from '@components/import/dto/request/import.base.dto';

@Injectable()
export class ImportService implements ImportServiceInterface {
  constructor(private readonly i18n: I18nRequestScopeService) {}

  async validateColumns(
    worksheet: Worksheet,
    columns: string[],
    entityKey: string,
  ): Promise<ResponsePayload<any>> {
    const headerRow = worksheet.getRow(1);
    const correctActionValue = await this.i18n.translate(
      IMPORT_ACTION_CONST.JSON_KEY,
    );

    const columnMap = new Map<string, string>([
      [IMPORT_ACTION_CONST.SECTION, correctActionValue],
    ]);

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      columnMap.set(column, getCellValueByRow(headerRow, i + 2));
    }

    for (const [propertyKey, value] of columnMap) {
      let correctValue;

      if (propertyKey == IMPORT_ACTION_CONST.SECTION)
        correctValue = correctActionValue;
      else
        correctValue = await this.i18n.translate(
          `header-csv.${entityKey}.${propertyKey}`,
        );

      if (correctValue != value)
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.IMPORT.INVALID_TEMPLATE'),
          )
          .build();
    }

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(columnMap)
      .build();
  }

  async validateAction(
    action: string,
    availableActions: string[],
  ): Promise<string> {
    if (isEmpty(action)) return null;

    if (availableActions.includes(action)) return null;

    return await this.i18n.translate('error.IMPORT.INVALID_ACTION');
  }

  async validateRequiredFields<T>(
    rowDto: T,
    columnMap: Map<string, string>,
    requiredFields: string[],
  ): Promise<string> {
    const errors: string[] = [];

    const propertyKeyConst = I18N_KEY_CONST.PROPERTY;

    const msgPattern = await this.i18n.translate(
      'validation.PROPERTY_IS_REQUIRED',
    );

    const requiredFieldsMap = new Map<string, string>(columnMap);

    requiredFieldsMap.forEach((value, key) => {
      if (!requiredFields.includes(key) && key != IMPORT_ACTION_CONST.SECTION)
        requiredFieldsMap.delete(key);
    });

    for (const [propertyName, translatedPropertyName] of requiredFieldsMap) {
      const propertyValue = rowDto[propertyName];

      if (isEmpty(propertyValue) && isNaN(propertyValue))
        errors.push(
          msgPattern.replace(translatedPropertyName, propertyKeyConst),
        );
    }

    return errors.join(EOL);
  }

  async loadXlsx(request: ImportRequestDto): Promise<Worksheet> {
    const { fileData } = request;

    let workbook = new Workbook();

    workbook = await workbook.xlsx.load(Buffer.from(fileData));

    return workbook.worksheets[0];
  }

  async getAvailableActions(): Promise<Map<string, string>> {
    const actionMap = new Map<string, string>();

    for (const key of IMPORT_ACTION_CONST.OPTION_KEYS) {
      actionMap.set(
        key,
        await this.i18n.translate(
          `header-csv.${IMPORT_ACTION_CONST.SECTION}.${key}`,
        ),
      );
    }

    return actionMap;
  }

  assignProperty<T>(columns: string[], row: Row, rowDto: T): void {
    for (let i = 0; i < columns.length; i++) {
      const property = columns[i];
      const cellValue = getCellValueByRow(row, i + 2);
      const cellValueAsNumber = Number.parseInt(cellValue);

      if (isNaN(cellValueAsNumber)) rowDto[property] = cellValue;
      else rowDto[property] = cellValueAsNumber;
    }
  }

  assignRowImportResult<TResult extends ImportResultBaseDto>(
    result: TResult,
    response: ImportResponseDto<TResult>,
    errMsg?: string,
  ): void {
    if (!isEmpty(errMsg)) {
      result.isSuccess = false;
      result.reason = errMsg;
      response.isSuccess = false;
      response.fail++;
    } else {
      result.isSuccess = true;
    }
  }

  async validateRowData<
    TRequest extends ImportBaseDto,
    TResult extends ImportResultBaseDto,
  >(
    rowDto: TRequest,
    columnMap: Map<string, string>,
    requiredFields: string[],
    availableActions: string[],
    result: TResult,
    response: ImportResponseDto<TResult>,
  ): Promise<void> {
    const validateActionErrResponse = await this.validateAction(
      rowDto.action,
      availableActions,
    );

    if (!isEmpty(validateActionErrResponse)) {
      this.assignRowImportResult(result, response, validateActionErrResponse);
    } else {
      const validateFieldErrResponse = await this.validateRequiredFields(
        rowDto,
        columnMap,
        requiredFields,
      );

      this.assignRowImportResult(result, response, validateFieldErrResponse);
    }
  }

  async getImportTemplate(IMPORT_CONST: any): Promise<ArrayBuffer> {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet();
    const { ENTITY_KEY, COLUMNS, FILE_NAME } = IMPORT_CONST;
    const headerJsonKey = JSON_KEY.HEADER;
    const importSampleJsonKey = JSON_KEY.SAMPLE;

    const translateColumnsTasks = [
      this.i18n.translate(
        `${headerJsonKey}.${IMPORT_ACTION_CONST.SECTION}.${IMPORT_ACTION_CONST.HEADER}`,
      ),
      ...COLUMNS.map((column) =>
        this.i18n.translate(`${headerJsonKey}.${ENTITY_KEY}.${column}`),
      ),
    ];

    worksheet.columns = (await Promise.all(translateColumnsTasks)).map(
      (header) => ({
        header: header,
      }),
    );

    const translateCellValuesTasks = [
      this.i18n.translate(
        `${importSampleJsonKey}.${ENTITY_KEY}.${IMPORT_ACTION_CONST.SECTION}`,
      ),
      ...COLUMNS.map((column) =>
        this.i18n.translate(`${importSampleJsonKey}.${ENTITY_KEY}.${column}`),
      ),
    ];

    const sampleRow = worksheet.getRow(2);

    sampleRow.values = (await Promise.all(
      translateCellValuesTasks,
    )) as CellValue[];

    return workbook.xlsx.writeBuffer({ filename: FILE_NAME });
  }
}
