import { Body, Controller, Get, Inject } from '@nestjs/common';
import { ItemServiceInterface } from '@components/item/interface/item.service.interface';
import { MessagePattern } from '@nestjs/microservices';
import { GetListFactoryResponseDto } from '@components/user/dto/response/get-list-factory.response.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class ItemController {
  constructor(
    @Inject('ItemServiceInterface')
    private readonly itemService: ItemServiceInterface,
  ) {}
  // @MessagePattern('get_item_unit_list_for_supply')
  @Get('/item-unit/supplies/list')
  @ApiOperation({
    tags: ['Item Unit Setting'],
    summary: 'Get item unit setting list',
    description: 'Get item unit setting',
  })
  @ApiResponse({
    status: 200,
    description: 'Get item unit setting list successfully',
    type: GetListFactoryResponseDto,
  })
  async getItemUnitSettingList(): Promise<any> {
    return await this.itemService.getItemUnitSettingList();
  }
}
