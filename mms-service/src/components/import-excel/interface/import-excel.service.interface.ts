import { ImportExcelRequest } from '../dto/import-excel.request';

export interface ImportExcelServiceInterface {
  import(request: ImportExcelRequest): Promise<any>;
}
