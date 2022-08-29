import { ResponsePayload } from '@utils/response-payload';
import { CreateFactoryRequestDto } from '../dto/request/create-factory.request.dto';
import { FactoryDataResponseDto } from '../dto/response/factory-data.response.dto';
import { UpdateFactoryRequestDto } from '../dto/request/update-factory.request.dto';
import { GetListFactoryRequestDto } from '../dto/request/get-list-factory.request.dto';
import { GetListFactoryResponseDto } from '../dto/response/get-list-factory.response.dto';
import { SetStatusRequestDto } from '../dto/request/set-status.request.dto';
import { FactoryResponseDto } from '../dto/response/factory.response.dto';
import { FileUpdloadRequestDto } from '@core/dto/file-upload.request';
import { DeleteMultipleDto } from '@core/dto/multiple/delete-multiple.dto';
import { CreateFactoriesRequestDto } from '../dto/request/create-factories.request.dto';

export interface FactoryServiceInterface {
  getFactoriesByNameKeyword(nameKeyword: any): Promise<any>;
  create(
    factoryDto: CreateFactoryRequestDto,
  ): Promise<ResponsePayload<FactoryDataResponseDto | any>>;
  importFactory(request: FileUpdloadRequestDto): Promise<any>;
  update(
    factoryDto: UpdateFactoryRequestDto,
  ): Promise<ResponsePayload<FactoryDataResponseDto | any>>;
  delete(id: number): Promise<ResponsePayload<any>>;
  deleteMultiple(request: DeleteMultipleDto): Promise<ResponsePayload<any>>;
  getDetail(id: number): Promise<ResponsePayload<FactoryDataResponseDto | any>>;
  getList(
    request: GetListFactoryRequestDto,
  ): Promise<ResponsePayload<GetListFactoryResponseDto | any>>;
  confirm(
    request: SetStatusRequestDto,
  ): Promise<ResponsePayload<FactoryResponseDto | any>>;
  reject(
    request: SetStatusRequestDto,
  ): Promise<ResponsePayload<FactoryResponseDto | any>>;
  isExist(
    request: SetStatusRequestDto,
  ): Promise<ResponsePayload<FactoryResponseDto | any>>;
  saveFactories(
    request: CreateFactoriesRequestDto[],
  ): Promise<ResponsePayload<any>>;
}
