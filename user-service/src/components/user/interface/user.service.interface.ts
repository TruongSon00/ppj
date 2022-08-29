import { CreateUserRequestDto } from '@components/user/dto/request/create-user.request.dto';
import { GetListUserRequestDto } from '@components/user/dto/request/get-list-user.request.dto';
import { UpdateUserRequestDto } from '@components/user/dto/request/update-user.request.dto';
import { ResponsePayload } from '@utils/response-payload';
import { GetListUserResponseDto } from '@components/user/dto/response/get-list-user.response.dto';
import { GetListUserRoleSettingResponseDto } from '@components/settings/user-role-setting/dto/response/get-list-user-role-setting.response.dto';
import { GetListDepartmentSettingResponseDto } from '@components/settings/department-setting/dto/response/get-list-department-setting.response.dto';
import { GetListWarehouseByConditionsResponseDto } from '@components/warehouse/dto/response/get-list-warehouse-by-conditions.response.dto';
import { UserResponseDto } from '../dto/response/user.response.dto';
import { GetListFactoryByCompanyIdResponseDto } from '@components/factory/dto/response/get-list-factory-by-id.response.dto';
import { GetUsersRequestDto } from '../dto/request/get-users-request.dto';
import { SuccessResponse } from '@utils/success.response.dto';
import { ForgotPasswordGenerateRequestDto } from '@components/user/dto/request/forgot-password-generate.request.dto';
import { ForgotPasswordCheckOtpRequestDto } from '@components/user/dto/request/forgot-password-check-otp.request.dto';
import { ForgotPasswordResetPasswordRequestDto } from '@components/user/dto/request/forgot-password-reset-password.request.dto';
import { ForgotPasswordResponseDto } from '@components/user/dto/response/forgot-password.response.dto';
import { GetWarehouseByUserRequest } from '@components/user-warehouse/dto/request/get-warehouse-by-user.request.dto';
import { GetEnvRequest } from '@components/user-warehouse/dto/request/get-env.request.dto';
import { ChangePasswordRequestDto } from '../dto/request/change-password.request.dto';
import { ChangePasswordResponseDto } from '../dto/response/change-password.response.dto';
import { DeleteMultipleDto } from '@core/dto/multiple/delete-multiple.dto';
import { ChangeStatusNotificationRequestDto } from '../dto/request/change-status-notification.request.dto';
export interface UserServiceInterface {
  create(
    request: CreateUserRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>>;
  runSeeders(): Promise<any>;
  getEnv(request: GetEnvRequest): Promise<any>;
  getListByIds(payload: GetUsersRequestDto | any): Promise<any>;
  remove(id: number): Promise<ResponsePayload<SuccessResponse | any>>;
  getList(
    request: GetListUserRequestDto,
  ): Promise<ResponsePayload<GetListUserResponseDto | any>>;
  getListSync(): Promise<ResponsePayload<GetListUserResponseDto | any>>;
  getDetail(
    id: number,
    withExtraInfo?: boolean,
  ): Promise<ResponsePayload<UserResponseDto | any>>;
  update(
    request: UpdateUserRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>>;
  changeStatusUserNotification(
    request: ChangeStatusNotificationRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>>;
  getFactoryListByCompanyId(
    companyId: number,
  ): Promise<ResponsePayload<GetListFactoryByCompanyIdResponseDto | any>>;
  getUserRoleSettingList(): Promise<
    ResponsePayload<GetListUserRoleSettingResponseDto | any>
  >;
  getDepartmentSettingList(): Promise<
    ResponsePayload<GetListDepartmentSettingResponseDto | any>
  >;
  getWarehouseListByConditions(
    request,
  ): Promise<ResponsePayload<GetListWarehouseByConditionsResponseDto | any>>;
  getFactoriesByCondition(condition): Promise<any>;
  getCompaniesByCondition(condition): Promise<any>;
  generateOpt(
    request: ForgotPasswordGenerateRequestDto,
  ): Promise<ResponsePayload<ForgotPasswordResponseDto | any>>;
  checkOtp(
    request: ForgotPasswordCheckOtpRequestDto,
  ): Promise<ResponsePayload<ForgotPasswordResponseDto> | any>;
  forgotPasswordResetPassword(
    request: ForgotPasswordResetPasswordRequestDto,
  ): Promise<ResponsePayload<any>>;
  getFactoriesByIds(ids): Promise<any>;
  getCompaniesByIds(ids): Promise<any>;
  deleteRecordUserWarehouses(condition: any);
  getListByCondition(condition: any): Promise<ResponsePayload<any>>;
  getListByRelations(relation: any): Promise<ResponsePayload<any>>;
  getWarehouseListByUser(
    request: GetWarehouseByUserRequest,
  ): Promise<ResponsePayload<any>>;
  changePassword(
    request: ChangePasswordRequestDto,
  ): Promise<ResponsePayload<ChangePasswordResponseDto | any>>;
  deleteMultiple(request: DeleteMultipleDto): Promise<ResponsePayload<any>>;
  getUsersByRoleCodes(roleCodes?: string[]): Promise<any>;
  getGroupPermissions(): Promise<any>;
  getDepartments(): Promise<any>;
}
