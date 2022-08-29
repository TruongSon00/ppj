import { InsertDataRequestDto } from '../dto/request/insert-data.request.dto';

export interface InitDataRepositoryInterface {
  insertData(payload: InsertDataRequestDto, queryRunner: any): Promise<any>;
}
