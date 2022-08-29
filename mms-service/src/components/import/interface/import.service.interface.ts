import { ImportRequestDto } from '@components/import/dto/request/import.request.dto';
import { Row, Worksheet } from 'exceljs';
import { ResponsePayload } from '@utils/response-payload';
import { ImportResultBaseDto } from '@components/import/dto/response/import-result.base.dto';
import { ImportResponseDto } from '@components/import/dto/response/import.response.dto';
import { ImportBaseDto } from '@components/import/dto/request/import.base.dto';

export interface ImportServiceInterface {
  validateColumns(
    worksheet: Worksheet,
    headers: string[],
    entityKey: string,
  ): Promise<ResponsePayload<any>>;

  validateRequiredFields<TRequest extends ImportBaseDto>(
    rowDto: TRequest,
    columnMap: Map<string, string>,
    requiredFields: string[],
  ): Promise<string>;

  validateAction(action: string, availableActions: string[]): Promise<string>;

  loadXlsx(request: ImportRequestDto): Promise<Worksheet>;

  getAvailableActions(): Promise<Map<string, string>>;

  assignProperty<TRequest extends ImportBaseDto>(
    properties: string[],
    row: Row,
    rowDto: TRequest,
  ): void;

  assignRowImportResult<TResult extends ImportResultBaseDto>(
    result: TResult,
    response: ImportResponseDto<TResult>,
    errMsg?: string,
  ): void;

  validateRowData<
    TRequest extends ImportBaseDto,
    TResult extends ImportResultBaseDto,
  >(
    rowDto: TRequest,
    columnMap: Map<string, string>,
    requiredFields: string[],
    availableActions: string[],
    result: TResult,
    response: ImportResponseDto<TResult>,
  ): Promise<void>;

  getImportTemplate(IMPORT_CONST: any): Promise<ArrayBuffer>;
}
