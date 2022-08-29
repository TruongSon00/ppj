import { ResponsePayload } from '@utils/response-payload';
import { CompanyRequestDto } from '@components/company/dto/request/company.request.dto';
import { GetListCompanyRequestDto } from '@components/company/dto/request/get-list-company.request.dto';
import { CompanyDataResponseDto } from '@components/company/dto/response/company-data.response.dto';
import { UpdateCompanyRequestDto } from '@components/company/dto/request/update-company.request.dto';
import { GetListCompanyResponseDto } from '@components/company/dto/response/get-list-company.response.dto';
import { SetStatusRequestDto } from '../dto/request/set-status.request.dto';
import { CompanyResponseDto } from '../dto/response/company.response.dto';
import { FileUpdloadRequestDto } from '@core/dto/file-upload.request';
import { DeleteMultipleDto } from '@core/dto/multiple/delete-multiple.dto';

export interface CompanyServiceInterface {
  create(
    companyDto: CompanyRequestDto,
  ): Promise<ResponsePayload<CompanyDataResponseDto | any>>;
  importCompany(request: FileUpdloadRequestDto): Promise<any>;
  update(
    companyDto: UpdateCompanyRequestDto,
  ): Promise<ResponsePayload<CompanyDataResponseDto | any>>;
  delete(id: number): Promise<ResponsePayload<any>>;
  deleteMultiple(request: DeleteMultipleDto): Promise<ResponsePayload<any>>;
  getDetail(id: number): Promise<ResponsePayload<CompanyDataResponseDto | any>>;
  getList(
    request: GetListCompanyRequestDto,
  ): Promise<ResponsePayload<GetListCompanyResponseDto | any>>;
  confirm(
    request: SetStatusRequestDto,
  ): Promise<ResponsePayload<CompanyResponseDto | any>>;
  reject(
    request: SetStatusRequestDto,
  ): Promise<ResponsePayload<CompanyResponseDto | any>>;
  getListCompanyByCodes(
    codes: string[],
  ): Promise<ResponsePayload<CompanyResponseDto | any>>;
}
