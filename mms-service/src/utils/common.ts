import {
  DEVICE_ASIGNMENTS_STATUS_ENUM,
  WorkTimeDataSourceEnum,
} from '@components/device-assignment/device-assignment.constant';
import { DEVICE_STATUS_ENUM } from '@components/device-status/device-status.constant';
import { PLAN_MODE } from '@components/plan/plan.constant';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { IT_DEPARTMENT_ID } from '@constant/common';
import Big from 'big.js';
import { isArray, isEmpty, isNaN, isUndefined, uniq } from 'lodash';
import { PaginationQuery } from './pagination.query';
import { DEPARTMENT_PERMISSION_SETTING } from './permissions/department-permission-setting';
import { USER_ROLE_SETTING_NAME } from './permissions/user-role-setting';

export const minus = (first: number, second: number): number => {
  return Number(new Big(first).minus(new Big(second)));
};

export const plus = (first: number, second: number): number => {
  return Number(new Big(first).plus(new Big(second)));
};

export const mul = (first: number, second: number): number => {
  return Number(new Big(first).mul(new Big(second)));
};

export const div = (first: number, second: number): number => {
  return Number(new Big(first).div(new Big(second)));
};

export const decimal = (x: number, y: number): number => {
  const mathOne = Number(new Big(10).pow(Number(new Big(x).minus(new Big(y)))));
  const mathTwo = Number(new Big(10).pow(Number(new Big(y).mul(new Big(-1)))));
  return Number(mathOne - mathTwo);
};

export const escapeCharForSearch = (str: string): string => {
  return str.toLowerCase().replace(/[?%\\_]/gi, function (x) {
    return '\\' + x;
  });
};

export const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

export const convertArrayToMap = (array, key: string[]) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    const keyBuilt = key.reduce((res, i) => {
      return `${res}_${item[i]}`;
    }, '');
    return {
      ...obj,
      [keyBuilt]: item,
    };
  }, initialValue);
};

export const convertInputToInt = (str: any): number => {
  const number = Number(str);
  if (isNaN(number) || number - parseInt(str) !== 0) {
    return 0;
  }
  return number;
};

export enum EnumSort {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const convertToOrderCondition = (
  paging: PaginationQuery,
  keys: string[],
): any => {
  const sorts = {};
  if (paging.sort && isArray(paging.sort)) {
    paging.sort.forEach((sort) => {
      if (!keys.includes(sort.column)) return;
      sorts[sort.column] = sort.order;
    });
  }
  return sorts;
};

export const convertToSkip = (paging: PaginationQuery): number => {
  const page = (Number(paging.page) || 1) - 1;
  const take = convertToTake(paging);
  return (page < 0 ? 0 : page) * take;
};

export const convertToTake = (paging: PaginationQuery): number => {
  const limit = Number(paging.limit) || 10;
  return limit > 0 && limit <= 200 ? limit : 10;
};

export const distinctArray = (arr: number[]): number[] => {
  return uniq(arr.filter((e, i, []) => e));
};

export const serilizeData = (arrData: number[], column: string): number[] => {
  if (arrData.length > 0) {
    const serilize = [];
    arrData.forEach((record) => {
      serilize[record[column]] = record;
    });

    return serilize;
  }

  return arrData;
};

export const convertOrderMongo = (orderText: string): number => {
  if (orderText.toLowerCase() === 'desc') return -1;
  return 1;
};

export const dynamicSort = (property) => {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    const result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
};

export const paginate = (
  unPaginatedList: any[],
  limit: number,
  page: number,
): any[] => unPaginatedList.slice((page - 1) * limit, page * limit);

export function checkRuleItOrAdmin(
  user: UserInforRequestDto,
  mode: string,
  createdBy?: number,
): { status: boolean; id?: number } {
  if (user.username === 'admin') {
    return { status: true };
  }
  let count = 0;
  for (let i = 0; i < user.departmentSettings.length; i++) {
    const department = user.departmentSettings[i];
    if (DEPARTMENT_PERMISSION_SETTING.ADMIN === department.id)
      return { status: true };
    else if (DEPARTMENT_PERMISSION_SETTING.IT !== department.id) count++;
  }

  if (count === user.departmentSettings.length) return { status: false };

  for (let i = 0; i < user.userRoleSettings.length; i++) {
    const role = user.userRoleSettings[i];

    switch (role.name) {
      case USER_ROLE_SETTING_NAME.PM:
        switch (mode) {
          case PLAN_MODE.CREATE:
          case PLAN_MODE.DETAIL:
            return { status: true };
          case PLAN_MODE.UPDATE:
            if (user.id !== createdBy) return { status: false };
            return { status: true };
          default:
            break;
        }
        break;
      case USER_ROLE_SETTING_NAME.LEADER:
        switch (mode) {
          case PLAN_MODE.CREATE:
          case PLAN_MODE.UPDATE:
          case PLAN_MODE.DETAIL:
          case PLAN_MODE.APPROVE:
          case PLAN_MODE.REJECT:
            return { status: true };
          default:
            break;
        }
        break;
      case USER_ROLE_SETTING_NAME.EMPLOYEE:
        switch (mode) {
          case PLAN_MODE.LIST:
          case PLAN_MODE.DETAIL:
            return { status: true, id: user.id };
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  return { status: false };
}

export const mapStatusDeviceStatus = (
  workTimeDataSource: number,
  oldStatus: number,
  assignStatus: number,
): number => {
  if (isUndefined(assignStatus) || isUndefined(oldStatus)) {
    if (workTimeDataSource === WorkTimeDataSourceEnum.MES)
      return DEVICE_STATUS_ENUM.IN_USE;
    return DEVICE_STATUS_ENUM.ACTIVE;
  }

  if (workTimeDataSource === WorkTimeDataSourceEnum.MES) {
    if (assignStatus === DEVICE_ASIGNMENTS_STATUS_ENUM.IN_USE)
      return DEVICE_STATUS_ENUM.ACTIVE;
    if (assignStatus === DEVICE_ASIGNMENTS_STATUS_ENUM.IN_MAINTAINING)
      return DEVICE_STATUS_ENUM.MAINTENANCE;
  }
  return oldStatus;
};

export const getUserRoleSettingName = (user: any): string => {
  const userRole = user?.userRoles?.find(
    (role) => role.departmentId === IT_DEPARTMENT_ID,
  );
  if (isEmpty(userRole)) return '';
  const userRoleSetting = user?.userRoleSettings?.find(
    (role) => role.id === userRole.userRoleId,
  );
  if (isEmpty(userRoleSetting)) return '';
  return userRoleSetting.name;
};

export const getDataDuplicate = (array: any[]): any => {
  return array.filter((value, index, arr) => {
    return arr.indexOf(value) !== index;
  });
};
