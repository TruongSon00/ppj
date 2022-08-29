import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { MessagePattern } from '@nestjs/microservices';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { CreateUserRequestDto } from '@components/user/dto/request/create-user.request.dto';
import { UpdateUserRequestDto } from '@components/user/dto/request/update-user.request.dto';
import { GetListUserRequestDto } from '@components/user/dto/request/get-list-user.request.dto';
import { UserResponseDto } from '@components/user/dto/response/user.response.dto';
import { GetListUserResponseDto } from '@components/user/dto/response/get-list-user.response.dto';
import { GetListUserRoleSettingResponseDto } from '@components/settings/user-role-setting/dto/response/get-list-user-role-setting.response.dto';
import { GetListDepartmentSettingResponseDto } from '@components/settings/department-setting/dto/response/get-list-department-setting.response.dto';
import { GetListWarehouseByConditionsResponseDto } from '@components/warehouse/dto/response/get-list-warehouse-by-conditions.response.dto';
import { CompanyResponseDto } from '@components/company/dto/response/company.response.dto';
import { FactoryResponseDto } from '@components/factory/dto/response/factory.response.dto';
import isEmpty from '@utils/helper';
import { ResponsePayload } from '@utils/response-payload';
import { GetListFactoryByCompanyIdResponseDto } from '@components/factory/dto/response/get-list-factory-by-id.response.dto';
import { Body } from '@nestjs/common';
import { GetUsersRequestDto } from './dto/request/get-users-request.dto';
import { SuccessResponse } from '@utils/success.response.dto';
import { ForgotPasswordGenerateRequestDto } from '@components/user/dto/request/forgot-password-generate.request.dto';
import { ForgotPasswordCheckOtpRequestDto } from '@components/user/dto/request/forgot-password-check-otp.request.dto';
import { ForgotPasswordResetPasswordRequestDto } from '@components/user/dto/request/forgot-password-reset-password.request.dto';
import { ForgotPasswordResponseDto } from '@components/user/dto/response/forgot-password.response.dto';
import { GetWarehouseByUserRequest } from '@components/user-warehouse/dto/request/get-warehouse-by-user.request.dto';
import { ChangePasswordRequestDto } from './dto/request/change-password.request.dto';
import { PermissionCode } from '@core/decorator/get-code.decorator';
import {
  CHANGE_PASSWORD_USER_PERMISSION,
  CREATE_USER_PERMISSION,
  UPDATE_USER_PERMISSION,
  DELETE_USER_PERMISSION,
  DETAIL_USER_PERMISSION,
  LIST_USER_PERMISSION,
} from '@utils/permissions/user';
import { DetailRequestDto } from '@utils/common.request.dto';
import { DeleteMultipleDto } from '@core/dto/multiple/delete-multiple.dto';
import { GetUsersByRoleCodesRequestDto } from './dto/request/get-users-by-roles.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '@core/decorator/set-public.decorator';
import {
  Department,
  EnvResponseDto,
  GroupPermisions,
} from '@components/auth/dto/response/env.response.dto';
import { ChangePasswordResponseDto } from './dto/response/change-password.response.dto';
import { GetWarehouseByUserResponseDto } from '@components/user-warehouse/dto/response/get-warehouse-by-user.response.dto';

@Controller('')
export class UserController {
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) {}

  // @MessagePattern('ping')
  @Get('ping')
  public async get(): Promise<any> {
    return new ResponseBuilder('PONG')
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  @PermissionCode(CREATE_USER_PERMISSION.code)
  // @MessagePattern('create')
  @Post('create')
  @ApiOperation({
    tags: ['User'],
    summary: 'Register User',
    description: 'Register User',
  })
  @ApiResponse({
    status: 200,
    description: 'Register successfully',
    type: UserResponseDto,
  })
  public async register(
    @Body() data: CreateUserRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    const { request, responseError } = data;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.create(request);
  }

  @PermissionCode(DELETE_USER_PERMISSION.code)
  // @MessagePattern('delete')
  @Delete('/:id')
  @ApiOperation({
    tags: ['User'],
    summary: 'Delete User',
    description: 'Delete User',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete successfully',
    type: SuccessResponse,
  })
  public async delete(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    return await this.userService.remove(id);
  }

  @PermissionCode(DELETE_USER_PERMISSION.code)
  // @MessagePattern('delete_multiple')
  @Delete('/multiple')
  @ApiOperation({
    tags: ['User'],
    summary: 'Delete multiple User',
    description: 'Delete multiple User',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete successfully',
    type: SuccessResponse,
  })
  public async deleteMultiple(
    @Query() payload: DeleteMultipleDto,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userService.deleteMultiple(request);
  }

  @PermissionCode(UPDATE_USER_PERMISSION.code)
  // @MessagePattern('update')
  @Put('/:id')
  @ApiOperation({
    tags: ['User'],
    summary: 'Update User',
    description: 'Update User',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: UserResponseDto,
  })
  public async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdateUserRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.update({ ...request, id });
  }

  // @TODO: remove when refactor done
  @MessagePattern('change_status_user_notification')
  public async changeStatusUserNotificationTcp(
    data: UpdateUserRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    const { request, responseError } = data;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.changeStatusUserNotification(request);
  }

  @PermissionCode(UPDATE_USER_PERMISSION.code)
  @MessagePattern('change_status_user_notification')
  public async changeStatusUserNotification(
    data: UpdateUserRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    const { request, responseError } = data;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.changeStatusUserNotification(request);
  }

  // @MessagePattern('get_users_by_ids')
  public async getWarehouseByIds(
    @Body() payload: GetUsersRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.getListByIds(request);
  }
  // @TODO: remove when refactor done
  @MessagePattern('get_users_by_ids')
  public async getWarehouseByIdsTcp(
    @Body() payload: GetUsersRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.getListByIds(request);
  }

  @PermissionCode(DETAIL_USER_PERMISSION.code)
  @Get('/:id')
  public async detail(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    return await this.userService.getDetail(id, false);
  }

  @PermissionCode(LIST_USER_PERMISSION.code)
  // @MessagePattern('list')
  @Get('/list')
  @ApiOperation({
    tags: ['User'],
    summary: 'List User',
    description: 'List User',
  })
  @ApiResponse({
    status: 200,
    description: 'List successfully',
    type: GetListUserResponseDto,
  })
  public async getList(
    @Query() requests: GetListUserRequestDto,
  ): Promise<ResponsePayload<GetListUserResponseDto | any>> {
    const { request, responseError } = requests;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.getList(request);
  }

  // @MessagePattern('list_sync')
  @Get('/list-sync')
  @ApiOperation({
    tags: ['User'],
    summary: 'List User',
    description: 'List User',
  })
  @ApiResponse({
    status: 200,
    description: 'List successfully',
    type: GetListUserResponseDto,
  })
  public async getListSync(): // request: BaseDto,
  Promise<ResponsePayload<GetListUserResponseDto | any>> {
    return await this.userService.getListSync();
  }

  // @MessagePattern('get_factory_list_by_company_id')
  @Get('/company/:companyId/factory/list')
  @ApiOperation({
    tags: ['Factory'],
    summary: 'List Factory',
    description: 'List Factory',
  })
  @ApiResponse({
    status: 200,
    description: 'List successfully',
    type: GetListFactoryByCompanyIdResponseDto,
  })
  public async getfactoryListByCompanyId(
    payload: DetailRequestDto,
    @Param('companyId', new ParseIntPipe()) companyId: number,
  ): Promise<ResponsePayload<GetListFactoryByCompanyIdResponseDto | any>> {
    return await this.userService.getFactoryListByCompanyId(companyId);
  }

  // @MessagePattern('user_role_setting_list')
  @Get('/role/list')
  @ApiOperation({
    tags: ['UserRoleSetting'],
    summary: 'List UserRoleSetting',
    description: 'List UserRoleSetting',
  })
  @ApiResponse({
    status: 200,
    description: 'List successfully',
    type: GetListUserRoleSettingResponseDto,
  })
  public async getUserRoleSettingList(): Promise<
    ResponsePayload<GetListUserRoleSettingResponseDto | any>
  > {
    return await this.userService.getUserRoleSettingList();
  }

  // @MessagePattern('departemnt_setting_list')
  @Get('/department/list')
  @ApiOperation({
    tags: ['Department'],
    summary: 'List Department',
    description: 'List Department',
  })
  @ApiResponse({
    status: 200,
    description: 'List successfully',
    type: GetListDepartmentSettingResponseDto,
  })
  public async getDepartmentSettingList(): Promise<
    ResponsePayload<GetListDepartmentSettingResponseDto | any>
  > {
    return await this.userService.getDepartmentSettingList();
  }

  // @MessagePattern('get_warehouse_list_by_conditions')
  @Get('/warehouse/list')
  @ApiOperation({
    tags: ['Warehouse'],
    summary: 'List Warehouse',
    description: 'List FWarehouse',
  })
  @ApiResponse({
    status: 200,
    description: 'List successfully',
    type: GetListWarehouseByConditionsResponseDto,
  })
  public async getWarehouseListByConditions(
    @Query() request,
  ): Promise<ResponsePayload<GetListWarehouseByConditionsResponseDto | any>> {
    return await this.userService.getWarehouseListByConditions(request);
  }

  // @MessagePattern('run_seeders')
  @Public()
  @Get('/seeders/nagf8gCudw=2313ndnkfjy24091u30932gsjknkjn2i3y1293820k,cn,')
  public async runSeeders(): Promise<any> {
    return await this.userService.runSeeders();
  }

  @MessagePattern('get_companies')
  public async getCompanyByCondition(
    request,
  ): Promise<ResponsePayload<CompanyResponseDto | any>> {
    return await this.userService.getCompaniesByCondition(request.condition);
  }
  // @TODO: remove when refactor done
  @MessagePattern('get_companies')
  public async getCompanyByConditionTcp(
    request,
  ): Promise<ResponsePayload<CompanyResponseDto | any>> {
    return await this.userService.getCompaniesByCondition(request.condition);
  }

  @MessagePattern('get_companies_by_ids')
  public async getCompaniesByIds(
    request,
  ): Promise<ResponsePayload<CompanyResponseDto | any>> {
    return await this.userService.getCompaniesByIds(request.ids);
  }
  // @TODO: remove when refactor done
  @MessagePattern('get_companies_by_ids')
  public async getCompaniesByIdsTcp(
    request,
  ): Promise<ResponsePayload<CompanyResponseDto | any>> {
    return await this.userService.getCompaniesByIds(request.ids);
  }

  @MessagePattern('get_factories')
  public async getFactoryByCondition(
    request,
  ): Promise<ResponsePayload<FactoryResponseDto | any>> {
    return await this.userService.getFactoriesByCondition(request.condition);
  }
  // @TODO: remove when refactor done
  @MessagePattern('get_factories')
  public async getFactoryByConditionTcp(
    request,
  ): Promise<ResponsePayload<FactoryResponseDto | any>> {
    return await this.userService.getFactoriesByCondition(request.condition);
  }

  @MessagePattern('get_factory_by_ids')
  public async getFactoriesByIds(
    request,
  ): Promise<ResponsePayload<FactoryResponseDto | any>> {
    return await this.userService.getFactoriesByIds(request.ids);
  }
  // @TODO: remove when refactor done
  @MessagePattern('get_factory_by_ids')
  public async getFactoriesByIdsTcp(
    request,
  ): Promise<ResponsePayload<FactoryResponseDto | any>> {
    return await this.userService.getFactoriesByIds(request.ids);
  }

  // @MessagePattern('get_env')
  // @TODO: get env
  @Get('/env')
  @ApiOperation({
    tags: ['App', 'Enviroment'],
    summary: 'Env',
    description: 'Lấy dữ liệu khởi tạo',
  })
  @ApiResponse({
    status: 200,
    description: 'Create successfully',
    type: EnvResponseDto,
  })
  public async getEnv(request): Promise<any> {
    return await this.userService.getEnv(request);
  }

  // @MessagePattern('forgot_password_generate')
  @Public()
  @Post('/forgot-password/generate')
  @ApiOperation({
    tags: ['User'],
    summary: 'Generate opt code',
    description: 'tạo opt code',
  })
  @ApiResponse({
    status: 200,
    description: 'Generate opt code successfully',
    type: ForgotPasswordResponseDto,
  })
  public async forgotPasswordGenerate(
    @Body() payload: ForgotPasswordGenerateRequestDto,
  ): Promise<ResponsePayload<ForgotPasswordResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userService.generateOpt(request);
  }

  // @MessagePattern('forgot_password_check_opt')
  @Public()
  @Post('/forgot-password/otp')
  @ApiOperation({
    tags: ['User'],
    summary: 'Check opt code',
    description: 'kiểm tra opt code',
  })
  @ApiResponse({
    status: 200,
    description: 'Check opt code successfully',
    type: ForgotPasswordResponseDto,
  })
  public async forgotPasswordCheckOtp(
    @Body() payload: ForgotPasswordCheckOtpRequestDto,
  ): Promise<ResponsePayload<ForgotPasswordResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userService.checkOtp(request);
  }

  // @MessagePattern('forgot_password_reset_password')
  @Public()
  @Post('/forgot-password/password')
  @ApiOperation({
    tags: ['User'],
    summary: 'Reset password',
    description: 'Thay đổi password',
  })
  @ApiResponse({
    status: 200,
    description: 'Reset password successfully',
    type: SuccessResponse,
  })
  public async forgotPasswordResetPassword(
    @Body() payload: ForgotPasswordResetPasswordRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.forgotPasswordResetPassword(request);
  }

  @PermissionCode(CHANGE_PASSWORD_USER_PERMISSION.code)
  // @MessagePattern('change_password')
  @Put('/change-password')
  @ApiOperation({
    tags: ['User'],
    summary: 'Change password',
    description: 'Thay đổi password',
  })
  @ApiResponse({
    status: 200,
    description: 'Change password successfully',
    type: ChangePasswordResponseDto,
  })
  public async changePassword(
    @Body() payload: ChangePasswordRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.changePassword(request);
  }

  @MessagePattern('delete_user_warehouse_by_condition')
  public async deleteRecordUserWarehouses(
    request: any,
  ): Promise<ResponsePayload<any>> {
    return await this.userService.deleteRecordUserWarehouses(request.condition);
  }
  // @TODO: remove when refactor done
  @MessagePattern('delete_user_warehouse_by_condition')
  public async deleteRecordUserWarehousesTcp(
    request: any,
  ): Promise<ResponsePayload<any>> {
    return await this.userService.deleteRecordUserWarehouses(request.condition);
  }

  @MessagePattern('get_users_by_conditions')
  public async getUsersByConditions(
    request: any,
  ): Promise<ResponsePayload<any>> {
    return await this.userService.getListByCondition(request.condition);
  }
  // @TODO: remove when refactor done
  @MessagePattern('get_users_by_conditions')
  public async getUsersByConditionsTcp(
    request: any,
  ): Promise<ResponsePayload<any>> {
    return await this.userService.getListByCondition(request.condition);
  }

  @MessagePattern('get_users_by_relations')
  public async getUsersByRelations(
    request: any,
  ): Promise<ResponsePayload<any>> {
    return await this.userService.getListByRelations(request.relation);
  }
  // @TODO: remove when refactor done
  @MessagePattern('get_users_by_relations')
  public async getUsersByRelationsTcp(
    request: any,
  ): Promise<ResponsePayload<any>> {
    return await this.userService.getListByRelations(request.relation);
  }

  // @MessagePattern('get_warehouse_list_by_user')
  @Get('/warehouse/list-by-user')
  @ApiOperation({
    tags: ['Warehouse'],
    summary: 'List Warehouse by user',
    description: 'List Warehouse by user',
  })
  @ApiResponse({
    status: 200,
    description: 'List successfully',
    type: GetWarehouseByUserResponseDto,
  })
  public async getWarehouseListByUser(
    @Query() payload: GetWarehouseByUserRequest,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.getWarehouseListByUser(request);
  }

  @MessagePattern('get_users_by_role_codes')
  public async getUsersByRoleCodes(
    @Body() payload: GetUsersByRoleCodesRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userService.getUsersByRoleCodes(request);
  }
  // @TODO: remove when refactor done
  @MessagePattern('get_users_by_role_codes')
  public async getUsersByRoleCodesTcp(
    @Body() payload: GetUsersByRoleCodesRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userService.getUsersByRoleCodes(request);
  }

  // @MessagePattern('get_group_permissions')
  @Get('/group-permissions')
  @ApiOperation({
    tags: ['App', 'Group Permissions'],
    summary: 'Env',
    description: 'Lấy dữ liệu group permissions',
  })
  @ApiResponse({
    status: 200,
    type: GroupPermisions,
  })
  public async getGroupPermissions(): Promise<any> {
    return await this.userService.getGroupPermissions();
  }

  // @MessagePattern('get_departments')
  @Get('/departments')
  @ApiOperation({
    tags: ['App', 'Departments'],
    summary: 'Env',
    description: 'Lấy dữ liệu departments',
  })
  @ApiResponse({
    status: 200,
    type: Department,
  })
  public async getDepartments(): Promise<any> {
    return await this.userService.getDepartments();
  }

  // TODO: Remove dupplicated TCP after refactor done
  @PermissionCode(DETAIL_USER_PERMISSION.code)
  @MessagePattern('detail')
  public async detailTCP(
    @Body() payload: DetailRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    const { request, responseError } = payload;
    console.log({ payload });

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userService.getDetail(request.id, false);
  }

  @MessagePattern('get_warehouse_list_by_user')
  public async getWarehouseListByUserTcp(
    payload: GetWarehouseByUserRequest,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.getWarehouseListByUser(request);
  }

  @PermissionCode(LIST_USER_PERMISSION.code)
  @MessagePattern('list')
  public async getListTcp(
    requests: GetListUserRequestDto,
  ): Promise<ResponsePayload<GetListUserResponseDto | any>> {
    const { request, responseError } = requests;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.getList(request);
  }
}
