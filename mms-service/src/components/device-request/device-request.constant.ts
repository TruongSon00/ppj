export enum DEVICE_REQUEST_STATUS_ENUM {
  WAITING_LEADER_APPROVE,
  WAITING_ME_APPROVE,
  REJECTED,
  WAITING_WAREHOUSE_EXPORT,
  WAITING_WAREHOUSE_IMPORT,
  WAITING_ASSIGNMENT,
  WAITING_INSTALLATION,
  INSTALLED,
  CONFIRMED,
  COMPLETED,
}

export const DEVICE_REQUEST_CONST = {
  CODE: {
    MAX_LENGTH: 8,
    COLUMN: 'code',
    PAD_CHAR: '0',
    DEFAULT_CODE: 0,
    GAP: 1,
  },
  NAME: {
    MAX_LENGTH: 255,
    MIN_LENGTH: 8,
    COLUMN: 'name',
    REGEX:
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ 0-9]+$/,
  },
  STATUS: {
    COLUMN: 'status',
    ENUM: DEVICE_REQUEST_STATUS_ENUM,
  },
  TYPE: {
    COLUMN: 'type',
  },
  DESCRIPTION: {
    MAX_LENGTH: 255,
    COLUMN: 'description',
  },
  DEVICE_GROUP: {
    COLUMN: 'deviceGroupIds',
  },
  DEVICE: {
    COLUMN: 'deviceIds',
  },
  REQUEST_TICKET: {
    COLL: 'deviceRequestTickets',
  },
  QUANTITY: {
    COLUMN: 'quantity',
  },
};

export enum DEVICE_REQUEST_TYPE_ENUM {
  REQUEST,
  RETURN,
}

export enum ListDeviceRequestStatus {
  AwaitingConfirmation,
  AwaitingITConfirmation,
  Confirmed,
  AwaitingAssignment,
  Assigned,
  AwaitingReturn,
  Returned,
  Rejected,
  WaitingExport,
  Installed,
}

export const DEVICE_REQUEST_PREFIX_NAME = 'Yêu cầu cấp';

export const DEVICE_REQUEST_ACTION_LEADER_APPROVE = 'leader-approve';
export const DEVICE_REQUEST_ACTION_ME_APPROVE = 'me-approve';
export const DEVICE_REQUEST_ACTION_CONFIRMED = 'confirmed';
export const DEVICE_REQUEST_ACTION_REJECTED = 'rejected';

export const DEVICE_REQUEST_ACTION = [
  DEVICE_REQUEST_ACTION_LEADER_APPROVE,
  DEVICE_REQUEST_ACTION_ME_APPROVE,
  DEVICE_REQUEST_ACTION_CONFIRMED,
  DEVICE_REQUEST_ACTION_REJECTED,
];

export const DEVICE_REQUEST_STATUS_CAN_DELETE = [
  DEVICE_REQUEST_STATUS_ENUM.WAITING_LEADER_APPROVE,
];
