export enum JOB_STATUS_ENUM {
  NON_ASSIGN = 1, // Chưa đc phân công
  WAITING_TO_CONFIRMED = 2, // Chờ xác nhận
  REJECTED = 3, // Từ chối
  TO_DO = 4, // Chưa thực hiện
  IN_PROGRESS = 5, // Đang thực hiện
  COMPLETED = 6, // Đã thực hiện
  OUT_OF_DATE = 7, // Quá hạn chưa thực hiện
  LATE = 8, // Quá hạn đang thực hiện
  RESOLVED = 9, // hoàn thành,
  PLANNING = 10,
}

export enum JOB_STATUS_RESPONSE_ENUM {
  ALL = 1, // Tất cả công việc
  COMPLETED = 2, // Hoàn thành
  NOT_COMPLETED = 3, // Chưa hoàn thành
  LATE = 4, // Quá hạn
}

export enum STATUS_JOB_PROGRESS_ENUM {
  COMPLETED,
  LATE,
  IN_PROGRESS,
  WAITING_CONFIRM,
}

export enum STATUS_MAINTAIN_REQUEST_ENUM {
  WAITING_CONFIRM,
  IN_PROGRESS,
  COMPLETED,
}

export enum INDEX_ENUM {
  MTTR,
  MTTA,
}

export const LIST_JOB_STATUS_RESPONSE = [
  JOB_STATUS_RESPONSE_ENUM.ALL,
  JOB_STATUS_RESPONSE_ENUM.COMPLETED,
  JOB_STATUS_RESPONSE_ENUM.NOT_COMPLETED,
  JOB_STATUS_RESPONSE_ENUM.LATE,
];

export enum JOB_TYPE_ENUM {
  WARNING = 1,
  PERIOD_MAINTAIN = 2,
  MAINTENANCE_REQUEST = 3,
  PERIOD_CHECKLIST = 4,
  INSTALLATION = 5,
}

export const CAN_UPDATE_JOB_TYPE_EXECUTE: number[] = [
  JOB_TYPE_ENUM.WARNING,
  JOB_TYPE_ENUM.MAINTENANCE_REQUEST,
  JOB_TYPE_ENUM.PERIOD_MAINTAIN,
  JOB_TYPE_ENUM.INSTALLATION,
];

export const CAN_UPDATE_JOB_TYPE_CHECKLIST: number[] = [
  JOB_TYPE_ENUM.PERIOD_CHECKLIST,
];

export enum CHECKLIST_STATUS_ENUM {
  CREATED = 1,
  CONFIRMED = 2,
  REJECTED = 3,
}

export const CODE_PREFIX_JOB = 'P';

export const CAN_UPDATE_JOB_IMPLEMENT: number[] = [
  JOB_STATUS_ENUM.WAITING_TO_CONFIRMED,
];

export const CAN_UPDATE_JOB_ASSIGNMENTS: number[] = [
  JOB_STATUS_ENUM.NON_ASSIGN,
  JOB_STATUS_ENUM.REJECTED,
];

export const CAN_UPDATE_JOB_REJECT: number[] = [
  JOB_STATUS_ENUM.WAITING_TO_CONFIRMED,
];

export enum JOB_TYPE_MAINTENANCE_ENUM {
  MAINTENANCE = 1,
  REPLACE = 0,
}
export const STATUS_TO_APPROVE_CHECKLIST = [
  CHECKLIST_STATUS_ENUM.CREATED,
  CHECKLIST_STATUS_ENUM.REJECTED,
];

export enum HISTORY_ACTION {
  CREATED = 'created',
  UPDATED = 'updated',
}

export enum WARNING_STATUS_ENUM {
  CREATED = 1,
  CONFIRMED = 2,
  REJECTED = 3,
  IN_PROGRESS = 4,
  COMPLETED = 5,
  NOT_EXECUTED = 6,
  EXECUTED = 7,
}

export const STATUS_TO_APPROVE_WARNING: number[] = [
  WARNING_STATUS_ENUM.CREATED,
];

export enum PERIOD_WARNING_STATUS_ENUM {
  CREATED = 1,
  CONFIRMED = 2,
  REJECTED = 3,
  IN_PROGRESS = 4,
  COMPLETED = 5,
}

export const STATUS_TO_APPROVE_PERIOD_WARNING = [
  PERIOD_WARNING_STATUS_ENUM.CREATED,
  PERIOD_WARNING_STATUS_ENUM.REJECTED,
];

export const JOB_CODE_PREFIX = 'P';

export enum checklistConcludeEnum {
  REPLACE = 0,
  MAINTAIN = 1,
}

export const JOB_CODE_CONST = {
  MAX_LENGTH: 12,
  COLUMN: 'code',
  PAD_CHAR: '0',
  DEFAULT_CODE: '0',
};

export const JOB_STATUS_CAN_UPDATE_TO_INPROGRESS_OR_LATE = [
  JOB_STATUS_ENUM.TO_DO,
  JOB_STATUS_ENUM.OUT_OF_DATE,
  JOB_STATUS_ENUM.COMPLETED,
];

export enum ASSIGN_TYPE {
  USER,
  TEAM,
}

export enum RESULT_ENUM {
  FAILD,
  PASS,
}

export const LIST_VIRTUAL_KEY = [
  'maintainRequest',
  'checklistTemplate',
  'warning',
  'maintenancePeriodWarning',
  'installationTemplate',
];

export const JOB_TYPE_UPDATE_DEVICE_ASSIGN_HISTORY = [
  JOB_TYPE_ENUM.PERIOD_CHECKLIST,
  JOB_TYPE_ENUM.PERIOD_MAINTAIN,
  JOB_TYPE_ENUM.WARNING,
];

export const JOB_STATUS_CAN_CREATE_SUPPLY_REQUEST = [
  JOB_STATUS_ENUM.IN_PROGRESS,
  JOB_STATUS_ENUM.LATE,
];

export enum JOB_PRIORITY_ENUM {
  TRIVIAL = 1,
}

export enum MANDATORY_ENUM {
  NO,
  YES,
}

export const JOB_CONST = {
  DESCRIPTION: {
    MAX_LENGTH: 255,
    COLUMN: 'description',
  },
  CODE: {
    MAX_LENGTH: 8,
    COLUMN: 'code',
    REGEX: /^[a-zA-Z0-9]+$/,
  },
  NAME: {
    MAX_LENGTH: 50,
    COLUMN: 'name',
    REGEX:
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ 0-9]+$/,
  },
};
export const JOB_STATUS_CAN_DELETE = [
  JOB_STATUS_ENUM.NON_ASSIGN,
  JOB_STATUS_ENUM.REJECTED,
  JOB_STATUS_ENUM.WAITING_TO_CONFIRMED,
];
