import { div, minus, mul } from '@utils/common';
import { CollationOptions } from 'mongodb';

export enum APIPrefix {
  Version = 'api/v1',
}

export const DATA_NOT_CHANGE = {};

export const enum MoPlanStatus {
  REJECTED = 0,
  CREATED = 1,
  CONFIRMED = 2,
  IN_PROGRESS = 3,
  COMPLETED = 4,
}

export const enum ChecklistTemplateStatus {
  REJECTED = 0,
  CREATED = 1,
  CONFIRMED = 2,
  IN_PROGRESS = 3,
}

export const CAN_DELETE_MO_PLAN_STATUS: number[] = [
  MoPlanStatus.CREATED,
  MoPlanStatus.REJECTED,
];

export enum Progress {
  LATE = 'Trễ',
  NORMAL = 'Đúng tiến độ',
  DONE = 'Hoàn thành',
  NOTHING = 'Chưa thực hiện',
}

export enum OrderStatusEnum {
  Pending = 0,
  Confirmed = 1,
  InProgress = 2,
  Approved = 3,
  Completed = 4,
  Reject = 5,
}

export const startCommandChars = '^XA';
export const endCommandChars = '^XZ';
export const CAN_UPDATE_JOB_STATUS: number[] = [MoPlanStatus.CREATED];

export enum JobType {
  WARNING = 1,
  SCHEDULE_MAINTAIN = 2,
  REQUEST = 3,
  PERIOD_CHECK = 4,
  PLAN_MAINTENANCE = 5,
  PLAN_PERIOD_CHECK = 6,
  PLAN_INSTALLATION = 7,
}

export enum ReportType {
  WEEK = 0,
  MONTH = 1,
  QUARTER = 2,
}

export enum HISTORY_ACTION {
  CREATED = 'created',
  UPDATED = 'updated',
  COMPLETED = 'completed',
}

export const DEFAULT_COLLATION: CollationOptions = {
  locale: 'vi',
};

export const SEPARATOR = ',';

export const MILISECOND_TO_MINUTE = 1000 * 60;
export const DATE_FORMAT = 'YYYY/MM/DD HH:mm:ss';
export const DATE_FORMAT_WITHOUT_HOUR = 'YYYY/MM/DD';
export const DATE_FORMAT_REGEX =
  /^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/;

export enum IS_GET_ALL {
  NO,
  YES,
}

export const DEFAULT_WARNING_SAFE_TIME = 2; // days

export const IT_DEPARTMENT_ID = 4;

export const FORMAT_CODE_PERMISSION = 'MMS_';

//permission
export enum StatusPermission {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum ACTIVE_ENUM {
  INACTIVE,
  ACTIVE,
}
