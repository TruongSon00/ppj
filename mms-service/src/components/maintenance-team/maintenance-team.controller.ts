import {
  Controller,
  Injectable,
  Inject,
  Post,
  Get,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { Body } from '@nestjs/common';
import { MaintenanceTeamServiceInterface } from '@components/maintenance-team/interface/maintenance-team.service.interface';
import { CreateMaintenanceTeamRequestDto } from '@components/maintenance-team/dto/request/create-maintenance-team.request.dto';
import { isEmpty } from 'lodash';
import { UpdateMaintenanceTeamBodyDto } from '@components/maintenance-team/dto/request/update-maintenance-team.request.dto';
import { GetListMaintenaceTeamRequestDto } from '@components/maintenance-team/dto/request/get-list-maintenace-team.request.dto';
import { GetListAllMaintenanceTeamAndUserRequestDto } from '@components/maintenance-team/dto/request/get-list-all-maintenance-team-and-user.request.dto';
import { DetailMaintenanceTeamRequestDto } from './dto/request/detail-maintenance-team.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateMaintenanceTeamResponseDto } from './dto/response/update-maintenance-team.response.dto';
import { SuccessResponse } from '@utils/success.response.dto';
import {
  CREATE_MAINTENANCE_TEAM_PERMISSION,
  DETAIL_MAINTENANCE_TEAM_PERMISSION,
  LIST_MAINTENANCE_TEAM_PERMISSION,
  UPDATE_MAINTENANCE_TEAM_PERMISSION,
} from '@utils/permissions/maintenance-team';
import { PermissionCode } from '@core/decorator/get-code.decorator';
import { ActiveUnitPayload } from '@components/unit/dto/request/active-unit.request';
import { ACTIVE_ENUM } from '@constant/common';

@Injectable()
@Controller()
export class MaintenanceTeamController {
  constructor(
    @Inject('MaintenanceTeamServiceInterface')
    private readonly maintenanceTeamService: MaintenanceTeamServiceInterface,
  ) {}

  // @MessagePattern('create_maintenance_team')
  @PermissionCode(CREATE_MAINTENANCE_TEAM_PERMISSION.code)
  @Post('/maintenance-teams')
  @ApiOperation({
    tags: ['Maintenance Team'],
    summary: 'Create Maintenance Team',
    description: 'Create Maintenance Team',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async create(@Body() payload: CreateMaintenanceTeamRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.maintenanceTeamService.create(request);
  }

  @PermissionCode(LIST_MAINTENANCE_TEAM_PERMISSION.code)
  @Get('/maintenance-teams/list')
  @ApiOperation({
    tags: ['Maintenance Team'],
    summary: 'List Of MaintenanceTeam',
    description: 'List Of Maintenance Team',
  })
  @ApiResponse({
    status: 200,
    description: 'Get List successfully',
    type: null,
  })
  async getList(
    @Query() payload: GetListMaintenaceTeamRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.maintenanceTeamService.list(request);
  }

  @Get('/maintenance-teams-and-users/list')
  @ApiOperation({
    tags: ['Maintenance Team And User'],
    summary: 'List Of MaintenanceTeam and User',
    description: 'List Of Maintenance Team and User',
  })
  @ApiResponse({
    status: 200,
    description: 'Get List successfully',
    type: null,
  })
  async getListAllMaintenanceTeamsAndUsers(
    @Query() payload: GetListAllMaintenanceTeamAndUserRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.maintenanceTeamService.getListAllUserAndAllMaintenanceTeam(
      request,
    );
  }

  @PermissionCode(DETAIL_MAINTENANCE_TEAM_PERMISSION.code)
  @Get('/maintenance-teams/:id')
  @ApiOperation({
    tags: ['Maintenance Team'],
    summary: 'Detail Maintenance Team',
    description: 'Detail Maintenance Team',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: null,
  })
  async detail(@Param() param: DetailMaintenanceTeamRequestDto): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.maintenanceTeamService.detail(request);
  }

  @PermissionCode(UPDATE_MAINTENANCE_TEAM_PERMISSION.code)
  @Put('/maintenance-teams/:id')
  @ApiOperation({
    tags: ['Maintenance Team'],
    summary: 'Update MaintenanceTeam',
    description: 'Update an existing Maintenance Team',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: UpdateMaintenanceTeamResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateMaintenanceTeamBodyDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request._id = id;
    return await this.maintenanceTeamService.update(request);
  }

  @Put('/maintenance-teams/:id/active')
  @ApiOperation({
    tags: ['Supply Group'],
    summary: 'Active Supply Group',
    description: 'Active an existing Supply Group',
  })
  @ApiResponse({
    status: 200,
    description: 'Active successfully',
    type: SuccessResponse,
  })
  async active(@Param() payload: ActiveUnitPayload): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.maintenanceTeamService.updateStatus({
      ...request,
      status: ACTIVE_ENUM.ACTIVE,
    });
  }

  @Put('/maintenance-teams/:id/inactive')
  @ApiOperation({
    tags: ['Supply Group'],
    summary: 'InActive Supply Group',
    description: 'InActive an existing Supply Group',
  })
  @ApiResponse({
    status: 200,
    description: 'InActive successfully',
    type: SuccessResponse,
  })
  async inactive(@Param() payload: ActiveUnitPayload): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.maintenanceTeamService.updateStatus({
      ...request,
      status: ACTIVE_ENUM.INACTIVE,
    });
  }
}
