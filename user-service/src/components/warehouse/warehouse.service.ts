import { CreatePermissionResponseDto } from '@components/user/dto/response/create-permission.response.dto';
import { ResponsePayload } from '@utils/response-payload';
import { CheckPermissionDepartmentRequestDto } from '@components/warehouse/dto/request/check-permission-department.request.dto';
import { DeleteRequestDto } from '@components/user/dto/request/delete.request.dto';
import { flatMap, isEmpty, map, uniq } from 'lodash';
import { escapeCharForSearch } from '@utils/common';
import { ResponseCodeEnum } from './../../constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { WarehouseServiceInterface } from './interface/warehouse.service.interface';

@Injectable()
export class WarehouseService implements WarehouseServiceInterface {
  constructor(
    @Inject('WAREHOUSE_SERVICE_CLIENT')
    private readonly warehouseServiceClient: ClientProxy,
  ) {}

  async getListByIDs(ids: number[], relation?: string[]): Promise<any> {
    try {
      const response = await this.warehouseServiceClient
        .send('get_warehouses_by_ids', { warehouseIds: ids, relation })
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response.data;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async getWarehouseListByConditions(
    request: any,
    serilize?: boolean,
  ): Promise<any> {
    const response = await this.warehouseServiceClient
      .send('get_warehouses_by_conditions', request)
      .toPromise()
      .catch((e) => {
        console.log(e);
      });

    if (serilize) {
      const serilizeWarehouses = {};
      if (!response) return [];
      response.forEach((warehouse) => {
        serilizeWarehouses[warehouse.id] = warehouse;
      });
      return serilizeWarehouses;
    }

    return response;
  }

  async getWarehouseListByCompanyIds(request: any): Promise<any> {
    const response = await this.warehouseServiceClient
      .send('get_warehouses_by_company_ids', request)
      .toPromise()
      .catch((e) => {
        console.log(e);
      });

    return response;
  }

  async getWarehousesByName(filterByWarehouseName, onlyId?): Promise<any> {
    if (isEmpty(filterByWarehouseName)) {
      return [];
    }

    const warehouses = await this.getWarehouseListByConditions(
      'LOWER(name)LIKE ' +
        `LOWER(unaccent('%${escapeCharForSearch(
          filterByWarehouseName.text,
        )}%')) escape '\\'`,
    );

    if (!isEmpty(warehouses) && onlyId === true) {
      return uniq(map(flatMap(warehouses), 'id'));
    }

    return warehouses;
  }

  // Permission Setting

  async getPermissionCodeByName(request): Promise<any> {
    return await this.warehouseServiceClient
      .send('get_permission_code_by_name', request)
      .toPromise();
  }

  async createNewPermission(
    request,
  ): Promise<ResponsePayload<CreatePermissionResponseDto>> {
    return await this.warehouseServiceClient
      .send('create_new_permission', request)
      .toPromise();
  }

  async deletePermission(request: DeleteRequestDto): Promise<any> {
    return await this.warehouseServiceClient
      .send('delete_permission', request)
      .toPromise();
  }

  // Group Permission Setting
  async createGroupPermission(request): Promise<any> {
    return await this.warehouseServiceClient
      .send('create_group_permission', request)
      .toPromise();
  }

  async checkPermissionDepartment(
    request: CheckPermissionDepartmentRequestDto,
  ): Promise<any> {
    return await this.warehouseServiceClient
      .send('check_permission_department', request)
      .toPromise();
  }

  async getPermissionIdByCode(request: string): Promise<any> {
    return await this.warehouseServiceClient
      .send('get_permission_id_by_code', request)
      .toPromise();
  }

  async getDepartmentIdByPermission(request: number): Promise<any> {
    return await this.warehouseServiceClient
      .send('get_department_id_by_permission', request)
      .toPromise();
  }

  async getAllGroupPermission(request: any): Promise<any> {
    return await this.warehouseServiceClient
      .send('get_all_group_permission', request)
      .toPromise();
  }
}
