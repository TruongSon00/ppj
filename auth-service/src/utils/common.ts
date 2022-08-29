import Big from 'big.js';

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

export const escapeCharForSearch = (str: string): string => {
  return str.toLowerCase().replace(/[?%\\_]/gi, function (x) {
    return '\\' + x;
  });
};

export enum EnumSort {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum RememberPassword {
  active = 1,
  inactive = 0,
}

export enum StatusPermission {
  ACTIVE = 1,
  INACTIVE = 0,
}
