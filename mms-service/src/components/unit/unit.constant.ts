import { ACTIVE_ENUM } from '@constant/common';

export const UNIT_CONST = {
  DESCRIPTION: {
    MAX_LENGTH: 255,
    COLUMN: 'description',
  },
  CODE: {
    MAX_LENGTH: 8,
    MIN_LENGTH: 6,
    COLUMN: 'code',
    REGEX: /^[a-zA-Z0-9]+$/,
  },
  NAME: {
    MAX_LENGTH: 255,
    MIN_LENGTH: 1,
    COLUMN: 'name',
    REGEX:
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ 0-9]+$/,
  },
  ACTIVE: {
    COLUMN: 'active',
    ENUM: ACTIVE_ENUM,
  },
};
