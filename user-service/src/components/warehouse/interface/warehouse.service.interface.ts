import { CreatePermissionResponseDto } from '@components/user/dto/response/create-permission.response.dto';
import { ResponsePayload } from '@utils/response-payload';
import { CheckPermissionDepartmentRequestDto } from '@components/warehouse/dto/request/check-permission-department.request.dto';
import { DeleteRequestDto } from '@components/user/dto/request/delete.request.dto';

import { WarehouseResponseDto } from '@components/warehouse/dto/response/warehouse.response.dto';

export interface WarehouseServiceInterface {
  getListByIDs(idList: []): Promise<any>;
  getWarehouseListByConditions(
    condition: any,
    serilize?: boolean,
  ): Promise<WarehouseResponseDto | any>;
  getWarehousesByName(filterByWarehouseName, onlyId?): Promise<any>;
  getPermissionCodeByName(request): Promise<any>;
  createNewPermission(
    request,
  ): Promise<ResponsePayload<CreatePermissionResponseDto>>;
  deletePermission(request: DeleteRequestDto): Promise<any>;
  createGroupPermission(request): Promise<any>;
  checkPermissionDepartment(
    request: CheckPermissionDepartmentRequestDto,
  ): Promise<any>;
  getPermissionIdByCode(request: string): Promise<any>;
  getDepartmentIdByPermission(request: number): Promise<any>;
  getAllGroupPermission(request: any): Promise<any>;
}
