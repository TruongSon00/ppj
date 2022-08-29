import Big from 'big.js';
import { isArray, isNaN, join, uniq } from 'lodash';
import { Like } from 'typeorm';
import { PaginationQuery } from './pagination.query';

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

export const convertToWhereCondition = (
  paging: PaginationQuery,
  keys: string[],keySearch: string[]
): any => {
  const filter = {};
  if (paging.keyword) {
    return keySearch.map((key) => {
      return { [key]: Like(`%${paging.keyword}%`) };
    });
  }
  if (paging.filter && isArray(paging.filter)) {
    paging.filter.forEach((cond) => {
      if (!keys.includes(cond.column)) return;
      const key = cond.column.split('.');
      if(key.length == 1) {
        filter[key[0]] = Like(`%${cond.text}%`);
      } else {
        filter[key[0]] = {[key[1]]: Like(`%${cond.text}%`)};
      }
    });
  }
  return filter;
};

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
