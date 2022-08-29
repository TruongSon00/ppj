import { ResponsePayload } from '@utils/response-payload';
import { GetListDefectRequestDto } from '@components/defect/dto/request/get-list-defect.request.dto';
import { DetailDefectResponse } from '@components/defect/dto/response/detail-defect.response.dto';
import { UpdateDefectRequestDto } from '@components/defect/dto/request/update-defect.request.dto';
import { ExportDefectRequestDto } from '@components/defect/dto/request/export-defect.request.dto';
import { DetailDefectRequestDto } from '../dto/request/detail-defect.request.dto';
import { DeleteDefectRequestDto } from '../dto/request/delete-defect.request.dto';

export interface DefectServiceInterface {
  getDetail(
    request: DetailDefectRequestDto,
  ): Promise<ResponsePayload<DetailDefectResponse | any>>;
  create(request: any): Promise<any>;
  getList(request: GetListDefectRequestDto): Promise<any>;
  delete(request: DeleteDefectRequestDto): Promise<any>;
  update(request: UpdateDefectRequestDto): Promise<any>;
  exportDefect(request: ExportDefectRequestDto): Promise<any>;
  createMany(
    data: any,
    userId: number,
  ): Promise<{ dataSuccess: any[]; dataError: any[] }>;
}
