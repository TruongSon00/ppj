export enum PLAN_STATUS_ENUM {
  WAITING_TO_CONFIRMED = 1, // Chờ xác nhận
  CONFIRMED = 2, // Xác nhận
  REJECTED = 3, // Từ chối
}

export const PLAN_MODE = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  REJECT: 'REJECT',
  APPROVE: 'APPROVE',
  DETAIL: 'DETAIL',
  LIST: 'LIST',
};

export const PLAN_CONST = {
  DESCRIPTION: {
    MAX_LENGTH: 255,
    COLUMN: 'description',
  },
  CODE: {
    MAX_LENGTH: 8,
    COLUMN: 'code',
    REGEX: /^[a-zA-Z0-9]+$/
  },
  NAME: {
    MAX_LENGTH: 50,
    COLUMN: 'name',
    REGEX: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ 0-9]+$/
  }
};