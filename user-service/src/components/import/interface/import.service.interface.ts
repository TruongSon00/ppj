import { ImportRequestDto } from '../dto/request/import.request.dto';

export interface ImportServiceInterface {
  import(request: ImportRequestDto): Promise<any>;
}
