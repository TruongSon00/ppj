import { CreateUserRoleSettingRequestDto } from '@components/settings/user-role-setting/dto/request/create-user-role-setting.request.dto';
import { ResponsePayload } from '@utils/response-payload';
import { CreateUserRoleSettingResponseDto } from '@components/settings/user-role-setting/dto/response/create-user-role-setting.response.dto';
import { CreateUserPermissionRequestDto } from '@components/settings/user-role-setting/dto/request/create-user-permission.request.dto';
import { CreateUserPermissionResponseDto } from '@components/settings/user-role-setting/dto/response/create-user-permission.response.dto';
import { GetDepartmentIdsRequestDto } from '@components/settings/user-role-setting/dto/request/get-department-ids.request.dto';
import { GetUserRoleDepartmentRequestDto } from '@components/settings/user-role-setting/dto/request/get-user-role-department.request.dto';
import { CheckUserPermissionRequestDto } from '@components/settings/user-role-setting/dto/request/check-user-permission.request.dto';
import { FinalCheckUserPermissionRequestDto } from '@components/settings/user-role-setting/dto/request/final-check-user-permission.request.dto';
import { PermissionForListRequestDto } from '@components/settings/user-role-setting/dto/request/permission-for-list.request.dto';
import { CheckPermissionDepartmentRequestDto } from '@components/settings/user-role-setting/dto/request/check-permission-department.request.dto';
import { CheckPermissionDepartmentResponseDto } from '@components/settings/user-role-setting/dto/response/check-permission-department.response.dto';
import { DeleteRequestDto } from '@components/settings/user-role-setting/dto/request/delete.request.dto';
import { DeleteSuccessfullyResponseDto } from '@components/settings/user-role-setting/dto/response/delete-successfully.response.dto';
import { GetPermissionIdRequestDto } from '@components/settings/user-role-setting/dto/request/get-permission-id.request.dto';
import { GetPermissionIdResponseDto } from '@components/settings/user-role-setting/dto/response/get-permission-id.response.dto';
import { GetDepartmentIdRequestDto } from '@components/settings/user-role-setting/dto/request/get-department-id.request.dto';
import { GetDepartmentIdResponseDto } from '@components/settings/user-role-setting/dto/response/get-department-id.response.dto';
import { GetListRolePermissionOfDepartmentResponseDto } from '../dto/response/get-list-role-permission-department.response.dto';
import { GetPermissionByConditionRequestDto } from '../dto/request/get-permission-by-condition.request.dto';

export interface UserRoleSettingServiceInterface {
  createUserRole(
    request: CreateUserRoleSettingRequestDto,
  ): Promise<ResponsePayload<CreateUserRoleSettingResponseDto | any>>;
  getAllUserRole(request?: any): Promise<any>;
  setUserPermission(
    request: CreateUserPermissionRequestDto,
  ): Promise<ResponsePayload<CreateUserPermissionResponseDto>>;
  getDepartmentIds(request: GetDepartmentIdsRequestDto): Promise<any>;
  getUserRoleDepartment(request: GetUserRoleDepartmentRequestDto): Promise<any>;
  checkUserPermission(request: CheckUserPermissionRequestDto): Promise<any>;
  checkUserPermissionForList(
    request: PermissionForListRequestDto,
  ): Promise<any>;
  finalCheckUserPermission(
    request: FinalCheckUserPermissionRequestDto,
  ): Promise<ResponsePayload<any>>;
  checkPermissionDepartment(
    request: CheckPermissionDepartmentRequestDto,
  ): Promise<CheckPermissionDepartmentResponseDto | any>;
  deletePermission(
    request: DeleteRequestDto,
  ): Promise<ResponsePayload<DeleteSuccessfullyResponseDto | any>>;
  getAllGroupPermission(request: any): Promise<ResponsePayload<any>>;
  getPermissionIdByCode(
    condition: GetPermissionIdRequestDto,
  ): Promise<ResponsePayload<GetPermissionIdResponseDto | any>>;
  getDepartmentIdByPermission(
    condition: GetDepartmentIdRequestDto,
  ): Promise<ResponsePayload<GetDepartmentIdResponseDto | any>>;
  getPermissionCodeByName(request: string): Promise<ResponsePayload<any>>;
  getPermissionByUser(
    userRoleIds: number[],
    userDepartmentIds: number[],
  ): Promise<any>;
  insertPermission(permisions): Promise<any>;
  deletePermissionNotActive(): Promise<any>;
  getPermissionsByCondition(
    request: GetPermissionByConditionRequestDto,
  ): Promise<
    ResponsePayload<GetListRolePermissionOfDepartmentResponseDto | any>
  >;
}
