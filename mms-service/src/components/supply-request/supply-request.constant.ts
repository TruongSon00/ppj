export const SUPPLY_REQUEST_CODE_CONST = {
  MAX_LENGTH: 10,
  COLUMN: 'code',
  PAD_CHAR: '0',
  DEFAULT_CODE: '0',
  DEFAULT_NAME: 'Yêu cầu vật tư phụ tùng cho công việc',
};

export enum SUPPLY_REQUEST_STATUS_ENUM {
  WAITING_CONFIRM,
  WAITING_EXPORT,
  COMPLETED,
  REJECT,
}

export enum SUPPLY_REQUEST_TYPE_ENUM {
  RETURN_REQUEST = 1,
  REQUEST = 2,
}

export const SUPPLY_REQUEST_CODE_PREFIX = 'VT';
export const SUPPLY_REQUEST_NAME_DEFAULT = 'text.supplyRequestName';
