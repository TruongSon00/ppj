import {
  Body,
  Controller,
  Get,
  Inject,
  Injectable,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { GeneralMaintenanceParameterServiceInterface } from '@components/general-maintenance-parameter/interface/general-maintenance-parameter.service.interface';
import { MessagePattern } from '@nestjs/microservices';
import { isEmpty } from 'lodash';
import { CreateGeneralMaintenanceParameterRequestDto } from '@components/general-maintenance-parameter/dto/request/create-general-maintenance-parameter.request.dto';
import { ListGeneralMaintenanceParameterRequestDto } from '@components/general-maintenance-parameter/dto/request/list-general-maintenance-parameter.request.dto';
import {
  UpdateGeneralMaintenaceParameterBodyDto,
  UpdateGeneralMaintenaceParameterRequestDto,
} from '@components/general-maintenance-parameter/dto/request/update-general-maintenace-parameter.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessResponse } from '@utils/success.response.dto';
import { UpdateGeneralMaintenanceParameterResponseDto } from './dto/response/update-general-maintenance-parameter.response.dto';
import { ListGeneralMaintenanceParameterResponseDto } from './dto/response/list-general-maintenance-parameter.response.dto';

@Injectable()
@Controller('general-maintenance-parameters')
export class GeneralMaintenanceParameterController {
  constructor(
    @Inject('GeneralMaintenanceParameterServiceInterface')
    private readonly generalMaintenanceParameterService: GeneralMaintenanceParameterServiceInterface,
  ) {}

  @Post('')
  @ApiOperation({
    tags: ['General Maintenance Parameter'],
    summary: 'Create General Maintenance Parameter',
    description: 'Create a new General Maintenance Parameter',
  })
  @ApiResponse({
    status: 200,
    description: 'Created successfully',
    type: SuccessResponse,
  })
  // @MessagePattern('create_general_maintenance_parameter')
  async create(
    @Body() payload: CreateGeneralMaintenanceParameterRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.generalMaintenanceParameterService.create(request);
  }

  // @MessagePattern('list_general_maintenance_parameter')
  @Get('')
  @ApiOperation({
    tags: ['List General Maintenance Parameter'],
    summary: 'List General Maintenance Parameter',
    description: 'List General Maintenance Parameter',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ListGeneralMaintenanceParameterResponseDto,
  })
  async getList(
    @Query() payload: ListGeneralMaintenanceParameterRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.generalMaintenanceParameterService.getList(request);
  }

  // @MessagePattern('update_general_maintenance_parameter')
  @Put('/:id')
  @ApiOperation({
    tags: ['General Maintenance Parameter'],
    summary: 'Update General Maintenance Parameter',
    description: 'Update an existing General Maintenance Parameter',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: UpdateGeneralMaintenanceParameterResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateGeneralMaintenaceParameterBodyDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request._id = id;
    return await this.generalMaintenanceParameterService.update(request);
  }
}
