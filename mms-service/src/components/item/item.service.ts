import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ItemServiceInterface } from '@components/item/interface/item.service.interface';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { plainToInstance } from 'class-transformer';
import { GetListItemUnitSettingResponseDto } from '@components/item/dto/response/get-list-item-unit-setting.response.dto';
import { ResponseBuilder } from '@utils/response-builder';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { isEmpty } from 'lodash';

@Injectable()
export class ItemService implements ItemServiceInterface {
  constructor(
    @Inject('ITEM_SERVICE_CLIENT')
    private readonly itemServiceClient: ClientProxy,
    private readonly i18n: I18nRequestScopeService,
  ) {}
  async getDetailItemUnit(id: number): Promise<any> {
    try {
      const payload = { id: id };
      const response = await this.itemServiceClient
        .send('get_item_unit_setting_detail', payload)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return;
      }
      return response.data;
    } catch (err) {
      return;
    }
  }

  async getItemUnitSettingList(): Promise<any> {
    try {
      const response = await this.itemServiceClient
        .send('get_list_item_unit_setting', {})
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      const result = plainToInstance(
        GetListItemUnitSettingResponseDto,
        response.data.items,
        {
          excludeExtraneousValues: true,
        },
      );
      return new ResponseBuilder(result)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      return [];
    }
  }

  async getItemUnitByIds(ids: number[]): Promise<any> {
    try {
      const payload = { filter: [{ column: 'ids', text: ids.join(',') }] };
      const response = await this.itemServiceClient
        .send('get_list_item_unit_setting', payload)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return;
      }
      return response.data.items;
    } catch (err) {
      return;
    }
  }

  async getItemUnitByCodes(codes: string[]): Promise<any> {
    try {
      const payload = { filter: [{ column: 'codes', text: codes }] };
      const response = await this.itemServiceClient
        .send('get_list_item_unit_setting', payload)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return;
      }
      return response.data.items;
    } catch (err) {
      return;
    }
  }

  async getItemQuantityInWarehouses(code: string): Promise<any> {
    try {
      const item = await this.detailItem(code);

      if (isEmpty(item)) {
        return null;
      }

      const response = await this.itemServiceClient
        .send('get_all_item_stock', {
          id: item.id,
        })
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return null;
      }

      return !isEmpty(response?.data) ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async getItemQuantityInWarehouseByCode(codes: string[]): Promise<any> {
    const response: any = await this.itemServiceClient
      .send('get_all_item_stock_by_codes', { codes })
      .toPromise();
    if (response?.statusCode !== ResponseCodeEnum.SUCCESS) {
      return null;
    }

    return response.data;
  }

  async createItem(
    code: string,
    name: string,
    description: string,
    itemUnitId: string,
    itemTypeId: number,
    itemGroupId: number,
    createdByUserId: number,
    price = 1,
  ): Promise<any> {
    try {
      return await this.itemServiceClient
        .send('create_item', {
          code,
          name,
          description,
          itemUnitId,
          itemTypeId,
          itemGroupId,
          createdByUserId,
          hasStorageSpace: 0,
          isLocation: false,
          itemDetails: [],
          price,
          isProductionObject: '0',
        })
        .toPromise();
    } catch (err) {
      return err;
    }
  }

  async update(
    id: number,
    code: string,
    name: string,
    description: string,
    itemUnitId: string,
    itemTypeId: number,
    itemGroupId: number,
    createdByUserId: number,
    price: number,
  ): Promise<any> {
    try {
      return await this.itemServiceClient
        .send('update_item', {
          id,
          code,
          name,
          description,
          itemUnitId,
          itemTypeId,
          itemGroupId,
          createdByUserId,
          hasStorageSpace: 0,
          isLocation: false,
          itemDetails: [],
          price,
          isProductionObject: '0',
          isMmsRequest: true,
        })
        .toPromise();
    } catch (err) {
      return err;
    }
  }

  async detailItemGroupSetting(code: string): Promise<any> {
    try {
      const response = await this.itemServiceClient
        .send('get_list_item_group_setting', {
          filter: [
            {
              column: 'code',
              text: code,
            },
          ],
        })
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return null;
      }

      return !isEmpty(response?.data?.items)
        ? response.data.items.find((item) => item.code === code)
        : null;
    } catch (err) {
      return null;
    }
  }

  async detailItemTypeSetting(code: string): Promise<any> {
    try {
      const response = await this.itemServiceClient
        .send('item_type_setting_list', {
          filter: [
            {
              column: 'code',
              text: code,
            },
          ],
        })
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return null;
      }
      return !isEmpty(response?.data?.items)
        ? response.data.items.find((item) => item.code === code)
        : null;
    } catch (err) {
      return null;
    }
  }

  async detailItemUnitSetting(code: string): Promise<any> {
    try {
      const response = await this.itemServiceClient
        .send('get_list_item_unit_setting', {
          filter: [
            {
              column: 'code',
              text: code,
            },
          ],
        })
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return null;
      }
      return !isEmpty(response?.data?.items)
        ? response.data.items.find((item) => item.code === code)
        : null;
    } catch (err) {
      return null;
    }
  }

  async detailItem(code: string): Promise<any> {
    const response = await this.itemServiceClient
      .send('get_item_list', {
        filter: [
          {
            column: 'code',
            text: code,
          },
        ],
      })
      .toPromise();

    if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
      return null;
    }

    return !isEmpty(response?.data?.items)
      ? response.data.items.find((item) => item.code === code)
      : null;
  }

  async deleteItem(id: number, userId: number): Promise<any> {
    try {
      return await this.itemServiceClient
        .send('delete_item', {
          id,
          userId,
          isMmsRequest: true,
        })
        .toPromise();
    } catch (err) {
      return err;
    }
  }
}
