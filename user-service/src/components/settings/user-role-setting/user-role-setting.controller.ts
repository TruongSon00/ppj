import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserRoleSettingServiceInterface } from '@components/settings/user-role-setting/interface/user-role-setting.service.interface';
import { MessagePattern } from '@nestjs/microservices';
import isEmpty from '@utils/helper';
import { CreateUserRoleSettingRequestDto } from '@components/settings/user-role-setting/dto/request/create-user-role-setting.request.dto';
import { CreateUserPermissionRequestDto } from '@components/settings/user-role-setting/dto/request/create-user-permission.request.dto';
import { ResponsePayload } from '@utils/response-payload';
import { CreateUserPermissionResponseDto } from '@components/settings/user-role-setting/dto/response/create-user-permission.response.dto';
import { GetDepartmentIdsRequestDto } from '@components/settings/user-role-setting/dto/request/get-department-ids.request.dto';
import { GetUserRoleDepartmentRequestDto } from '@components/settings/user-role-setting/dto/request/get-user-role-department.request.dto';
import { CheckUserPermissionRequestDto } from '@components/settings/user-role-setting/dto/request/check-user-permission.request.dto';
import { FinalCheckUserPermissionRequestDto } from '@components/settings/user-role-setting/dto/request/final-check-user-permission.request.dto';
import { PermissionForListRequestDto } from '@components/settings/user-role-setting/dto/request/permission-for-list.request.dto';
import { DeleteRequestDto } from '@components/settings/user-role-setting/dto/request/delete.request.dto';
import { PermissionCode } from '@core/decorator/get-code.decorator';
import {
  LIST_PERMISSION_USER_PERMISSION,
  SET_PERMISSION_USER_PERMISSION,
} from '@utils/permissions/permission-setting';
import { GetPermissionByConditionRequestDto } from './dto/request/get-permission-by-condition.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetPermissionsByConditionResponseDto } from './dto/response/get-permissions-by-condition.response.dto';

@Controller('')
export class UserRoleSettingController {
  constructor(
    @Inject('UserRoleSettingServiceInterface')
    private readonly userRoleSettingService: UserRoleSettingServiceInterface,
  ) {}

  // @MessagePattern('create_user_role')
  public async createUserRole(
    @Body() body: CreateUserRoleSettingRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.createUserRole(request);
  }
  // @TODO: remove when refactor done
  public async createUserRoleTcp(
    @Body() body: CreateUserRoleSettingRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.createUserRole(request);
  }

  // @MessagePattern('get_all_user_roles')
  async getAllUserRole(@Body() request: any): Promise<any> {
    return await this.userRoleSettingService.getAllUserRole(request);
  }
  // @TODO: remove when refactor done
  async getAllUserRoleTcp(@Body() request: any): Promise<any> {
    return await this.userRoleSettingService.getAllUserRole(request);
  }

  @PermissionCode(SET_PERMISSION_USER_PERMISSION.code)
  // @MessagePattern('set_user_permission')
  @Post('user-permission-settings/set-user-permission')
  @ApiOperation({
    tags: ['User Permission Setting'],
    summary: 'Set user permission',
    description: 'Phan quyen cho user',
  })
  @ApiResponse({
    status: 200,
    description: 'Create user permission successfully',
    type: CreateUserPermissionResponseDto,
  })
  async setUserPermission(
    @Body() body: CreateUserPermissionRequestDto,
  ): Promise<ResponsePayload<CreateUserPermissionResponseDto>> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.permissionSettings = [...request];

    return await this.userRoleSettingService.setUserPermission(request);
  }

  @MessagePattern('get_user_permission')
  async getUserPermission(request: any): Promise<any> {
    return await this.userRoleSettingService.getAllGroupPermission(request);
  }
  // @TODO: remove when refactor done
  @MessagePattern('get_user_permission')
  async getUserPermissionTcp(request: any): Promise<any> {
    return await this.userRoleSettingService.getAllGroupPermission(request);
  }

  @MessagePattern('get_department_ids')
  public async getDepartmentIds(
    body: GetDepartmentIdsRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.getDepartmentIds(request);
  }
  // @TODO: remove when refactor done
  @MessagePattern('get_department_ids')
  public async getDepartmentIdsTcp(
    body: GetDepartmentIdsRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.getDepartmentIds(request);
  }

  @MessagePattern('get_user_role_department')
  public async getUserRoleDepartment(
    body: GetUserRoleDepartmentRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.getUserRoleDepartment(request);
  }
  // Remove when refactor done
  @MessagePattern('get_user_role_department')
  public async getUserRoleDepartmentTcp(
    body: GetUserRoleDepartmentRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.getUserRoleDepartment(request);
  }

  @MessagePattern('check_user_permission')
  public async checkUserPermission(
    body: CheckUserPermissionRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.checkUserPermission(request);
  }
  // @TODO: remove when refactor done
  @MessagePattern('check_user_permission')
  public async checkUserPermissionTcp(
    body: CheckUserPermissionRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.checkUserPermission(request);
  }

  @MessagePattern('check_user_permission_for_list')
  public async checkUserPermissionForList(
    body: PermissionForListRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.checkUserPermissionForList(
      request,
    );
  }
  // @TODO: remove when refactor done
  @MessagePattern('check_user_permission_for_list')
  public async checkUserPermissionForListTcp(
    body: PermissionForListRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.checkUserPermissionForList(
      request,
    );
  }
  @MessagePattern('final_check_user_permission')
  public async finalCheckUserPermission(
    body: FinalCheckUserPermissionRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.finalCheckUserPermission(request);
  }
  // @TODO: remove when refactor done
  @MessagePattern('final_check_user_permission')
  public async finalCheckUserPermissionTcp(
    body: FinalCheckUserPermissionRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.finalCheckUserPermission(request);
  }

  @MessagePattern('delete_permission')
  public async deletePermission(@Body() body: DeleteRequestDto): Promise<any> {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.deletePermission(request);
  }
  // @TODO: remove when refactor done
  @MessagePattern('delete_permission')
  public async deletePermissionTcp(
    @Body() body: DeleteRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userRoleSettingService.deletePermission(request);
  }

  // @MessagePattern('get_all_group_permission')
  @Get('/get-user-permission')
  @ApiOperation({
    tags: ['User Permission Setting'],
    summary: 'Get User Permisison',
    description: 'Lay thong tin phan quyen user',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully',
  })
  public async getAllGroupPermission(@Param() param: any): Promise<any> {
    return await this.userRoleSettingService.getAllGroupPermission(param);
  }

  // For Guard Policy
  @MessagePattern('get_permission_code_by_name')
  public async getPermissionCodeByName(request: string): Promise<any> {
    return await this.userRoleSettingService.getPermissionCodeByName(request);
  }
  // @TODO: remove when refactor done
  @MessagePattern('get_permission_code_by_name')
  public async getPermissionCodeByNameTcp(request: string): Promise<any> {
    return await this.userRoleSettingService.getPermissionCodeByName(request);
  }

  @MessagePattern('insert_permission')
  public async insertPermissionTcp(request): Promise<any> {
    return await this.userRoleSettingService.insertPermission(request);
  }

  @MessagePattern('delete_permission_not_active')
  public async deletePermissionNotActiveTcp(): Promise<any> {
    return await this.userRoleSettingService.deletePermissionNotActive();
  }

  @PermissionCode(LIST_PERMISSION_USER_PERMISSION.code)
  // @MessagePattern('get_permissions_by_condition')
  @Get('user-permission-settings/departments/:departmentId/roles/:roleId')
  @ApiOperation({
    tags: ['User Permission Setting'],
    summary: 'Get list user permission by department_id and role_id',
    description: 'Danh sách quyền theo role và department',
  })
  @ApiResponse({
    status: 200,
    description: 'Get list user permission by department_id and role_id',
    type: GetPermissionsByConditionResponseDto,
  })
  public async getPermissionsByCondition(
    @Param('departmentId', new ParseIntPipe()) departmentId,
    @Param('roleId', new ParseIntPipe()) roleId,
  ): Promise<any> {
    return await this.userRoleSettingService.getPermissionsByCondition({
      departmentId,
      roleId,
    } as GetPermissionByConditionRequestDto);
  }
}
