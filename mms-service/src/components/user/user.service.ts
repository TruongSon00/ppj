import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserServiceInterface } from './interface/user.service.interface';
import { lastValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { GetUserListResponseDto } from '@components/user/dto/response/get-user-list.response.dto';
import { ResponseBuilder } from '@utils/response-builder';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { REQUEST } from '@nestjs/core';
import { ListUserReportJobResponse } from './dto/response/list-user-report-job.response.dto';
import { Filter, Sort } from '@utils/pagination.query';
import { isEmpty } from 'lodash';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @Inject('USER_SERVICE_CLIENT')
    private readonly userServiceClient: ClientProxy,

    private readonly i18n: I18nRequestScopeService,

    @Inject(REQUEST)
    private readonly request: any,
  ) {}
  async insertPermission(permissions): Promise<any> {
    return await this.userServiceClient
      .send('insert_permission', permissions)
      .toPromise();
  }
  async deletePermissionNotActive(): Promise<any> {
    return await this.userServiceClient
      .send('delete_permission_not_active', {})
      .toPromise();
  }
  async detailUser(id: number, isGetData = false): Promise<any> {
    const res = await this.userServiceClient
      .send('detail', {
        id,
      })
      .toPromise();
    if (isGetData) {
      return res?.data;
    }
    return res;
  }

  async getListUserByIds(userIds: any): Promise<any> {
    return await this.userServiceClient
      .send('get_users_by_ids', userIds)
      .toPromise();
  }

  async detailFactory(id: number): Promise<any> {
    return await this.userServiceClient
      .send('detail_factory', {
        id: id,
        userId: this.request.userId,
      })
      .toPromise();
  }

  async getUserList(): Promise<any> {
    try {
      const response = await this.userServiceClient
        .send('list', {})
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      const result = plainToInstance(
        GetUserListResponseDto,
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
  async getFactoryList(filter?: any): Promise<any> {
    const params = {
      isGetAll: '1',
      filter: JSON.stringify(filter),
    };
    try {
      const response = await this.userServiceClient
        .send('list_factories', params)
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response.data.items;
    } catch (err) {
      return [];
    }
  }

  async getFactoryById(id: number): Promise<any> {
    try {
      const response = await this.userServiceClient
        .send('detail_factory', { id })
        .toPromise();
      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return null;
      }
      return response.data;
    } catch (err) {
      return null;
    }
  }

  async detailCompany(id: number): Promise<any> {
    return await this.userServiceClient
      .send('company_detail', {
        id: id,
        userId: this.request.userId,
      })
      .toPromise();
  }

  async listUserByIds(userIds: number[]): Promise<any> {
    return await this.userServiceClient
      .send('get_users_by_ids', { userIds })
      .toPromise();
  }

  async getListByIDs(ids: number[], relation?: string[]): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.userServiceClient.send('get_users_by_ids', {
          userIds: ids,
          relation,
        }),
      );

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response.data;
    } catch (err) {
      return [];
    }
  }

  async getUserById(id: number): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.userServiceClient.send('detail', {
          id: id,
          userId: 1, //@TODO: pass userId login
        }),
      );

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return null;
      }
      return response.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async getUserListByDepartment(): Promise<any> {
    try {
      const departmentNameFilter = 'IT';
      const request = {
        isGetAll: '1',
        filter: [
          {
            column: 'departmentName',
            text: departmentNameFilter.trim(),
          },
        ],
      };
      const response = await this.userServiceClient
        .send('list', request)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }

      const result = plainToInstance(
        GetUserListResponseDto,
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

  async getUserListByDepartmentWithPagination(
    filter: Filter[],
    page = 1,
    limit = 10,
    sort: Sort[],
    keyword: string,
    department = 'IT',
  ): Promise<any> {
    try {
      const request = {
        page,
        limit,
        keyword,
        filter: [
          {
            column: 'departmentName',
            text: department.trim(),
          },
        ],
        sort: sort ?? [],
      };

      if (!isEmpty(filter)) {
        request.filter.push(...filter);
      }
      const response = await this.userServiceClient
        .send('list', request)
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return {
          items: [],
          meta: {
            page,
            limit,
          },
        };
      }

      const result = plainToInstance(
        ListUserReportJobResponse,
        response.data.items,
        {
          excludeExtraneousValues: true,
        },
      );

      return {
        items: result,
        meta: response.data.meta,
      };
    } catch (err) {
      return {
        items: [],
        meta: {
          page,
          limit,
        },
      };
    }
  }

  async getUsersByUsernames(usernames: string[]): Promise<any[]> {
    try {
      const response = await this.userServiceClient
        .send('list', {
          filter: [{ column: 'usernames', text: usernames }],
          isGetAll: '1',
        })
        .toPromise();

      if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
        return [];
      }
      return response.data.items;
    } catch (err) {
      return [];
    }
  }
}
