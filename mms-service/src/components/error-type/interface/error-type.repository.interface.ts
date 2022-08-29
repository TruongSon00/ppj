import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { ErrorTypeModel } from 'src/models/error-type/error-type.model';
import { CreateErrorTypeRequest } from '../dto/request/create-error-type.request';
import { GetListErrorTypeQuery } from '../dto/request/get-list-error-type.query';
import { UpdateErrorTypeRequest } from '../dto/request/update-error-type.request';
import { ListErrorTypeResponse } from '../dto/response/list-error-type.response';

export interface ErrorTypeRepositoryInterface
  extends BaseAbstractRepository<ErrorTypeModel> {
  createEntity(request: CreateErrorTypeRequest): ErrorTypeModel;
  updateEntity(
    entity: ErrorTypeModel,
    request: UpdateErrorTypeRequest,
  ): ErrorTypeModel;
  list(request: GetListErrorTypeQuery): Promise<ListErrorTypeResponse>;
  import(bulkOps: any): Promise<any>;
}
