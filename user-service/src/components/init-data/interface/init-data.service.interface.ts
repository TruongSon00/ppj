import { InsertDataRequestDto } from '../dto/request/insert-data.request.dto';

export interface InitDataServiceInterface {
  insertData(payload: InsertDataRequestDto[]): Promise<any>;
}
