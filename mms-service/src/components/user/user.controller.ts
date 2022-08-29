import { Body, Controller, Get, Inject } from '@nestjs/common';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { MessagePattern } from '@nestjs/microservices';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetListFactoryResponseDto } from './dto/response/get-list-factory.response.dto';

@Controller('')
export class UserController {
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) {}

  // @MessagePattern('get_factory_list_for_supply')
  @Get('/factory/supplies/list')
  @ApiOperation({
    tags: ['Factories'],
    summary: 'Get factory list',
    description: 'Get factory',
  })
  @ApiResponse({
    status: 200,
    description: 'Get item list successfully',
    type: GetListFactoryResponseDto,
  })
  async getFactoryList(): Promise<any> {
    return await this.userService.getFactoryList();
  }

  // @MessagePattern('get_user_list')
  @Get('/user/list')
  @ApiOperation({
    tags: ['Users'],
    summary: 'Get users list',
    description: 'Get user',
  })
  @ApiResponse({
    status: 200,
    description: 'Get user list successfully',
    type: null,
  })
  async getUserList(): Promise<any> {
    return await this.userService.getUserList();
  }

  // @MessagePattern('get_user_list_by_department')
  @Get('/maintenance-team/users/list')
  @ApiOperation({
    tags: ['Users'],
    summary: 'Get users list',
    description: 'Get user',
  })
  @ApiResponse({
    status: 200,
    description: 'Get user list successfully',
    type: null,
  })
  async getUserListByDepartment(): Promise<any> {
    return await this.userService.getUserListByDepartment();
  }
}
