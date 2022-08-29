export enum MAINTAIN_REQUEST_STATUS_ENUM {
  CREATED = 1, // cho xac nhan
  CONFIRMED_1 = 2, // xac nhan 1
  CONFIRMED_2 = 3, // xac nhan 2
  NOT_EXECUTED = 4, // chua thuc hien
  REJECTED = 5, // tu choi
  IN_PROGRESS = 6, // dang thuc hien
  EXECUTED = 7, // da thuc hien
  COMPLETED = 8, // hoan thanh
}

export enum MAINTAIN_REQUEST_TYPE_ENUM {
  USER_REQUEST = 3,
  WARNING = 1,
  SCHEDULE_MAINTAIN = 2,
  PERIOD_CHECK = 4,
}

export enum MAINTAIN_REQUEST_PRIORITY_ENUM {
  BLOCKER = 5,
  CRITICAL = 4,
  MAJOR = 3,
  MINOR = 2,
  TRIVIAL = 1,
}

export const STATUS_TO_DELETE_OR_REJECT_MAINTAIN_REQUEST = [
  MAINTAIN_REQUEST_STATUS_ENUM.CREATED,
  MAINTAIN_REQUEST_STATUS_ENUM.CONFIRMED_1,
  MAINTAIN_REQUEST_STATUS_ENUM.CONFIRMED_2,
];

export const STATUS_TO_APPROVE_MAINTAIN_REQUEST = [
  MAINTAIN_REQUEST_STATUS_ENUM.CREATED,
  MAINTAIN_REQUEST_STATUS_ENUM.REJECTED,
  MAINTAIN_REQUEST_STATUS_ENUM.CONFIRMED_1,
];

export enum HISTORY_ACTION {
  CREATED = 'created',
  UPDATED = 'updated',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  RE_DO = 're_doing',
}

export const CODE_PREFIX_MAINTAIN_REQUEST = 'M';

export const MAINTAIN_REQUEST_CODE_CONST = {
  MAX_LENGTH: 12,
  COLUMN: 'code',
  PAD_CHAR: '0',
  DEFAULT_CODE: '0',
};

export const MAINTAIN_REQUEST_CONST = {
  DESCRIPTION: {
    MAX_LENGTH: 255,
    COLUMN: 'description',
  },
  NAME: {
    MAX_LENGTH: 50,
    COLUMN: 'name',
    REGEX: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ 0-9]+$/
  }
};