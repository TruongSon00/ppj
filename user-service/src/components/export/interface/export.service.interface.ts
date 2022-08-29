import { ExportRequestDto } from '../dto/request/export.request.dto';
import { Response } from 'express';

export interface ExportServiceInterface {
  export(request: ExportRequestDto, res: Response): Promise<any>;
}
