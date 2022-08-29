import { ExportRequestDto } from '../dto/request/export.request.dto';

export interface ExportServiceInterface {
  export(request: ExportRequestDto): Promise<any>;
}
