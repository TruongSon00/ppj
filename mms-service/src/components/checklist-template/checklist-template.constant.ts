export const CHECK_LIST_TEMPLATE_CONST = {
  DESCRIPTION: {
    MAX_LENGTH: 255,
    COLUMN: 'description',
  },
  CODE: {
    MAX_LENGTH: 50,
    COLUMN: 'code',
    REGEX: /^[a-zA-Z0-9]+$/,
  },
  NAME: {
    MAX_LENGTH: 255,
    COLUMN: 'name',
    REGEX:
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ 0-9]+$/,
  },
  TITLE: {
    MAX_LENGTH: 50,
    COLUMN: 'title',
  },
  DEVICE: {
    COLUMN: 'deviceId',
  },
};
export enum CheckTypeEnum {
  PassFail,
}
export enum checklistResultEnum {
  Fail = 0,
  Pass = 1,
}
export const CHECK_LIST_TEMPLATE_NAME = 'check-list-template';
export const CHECK_LIST_TEMPLATE_HEADER = [
  {
    from: 'i',
  },
  {
    from: '_id',
  },
  {
    from: 'code',
  },
  {
    from: 'name',
  },
  {
    from: 'description',
  },
  {
    from: 'checkType',
  },
  {
    from: 'deviceName',
  },
  {
    from: 'details',
  },
  {
    from: 'createdAt',
  },
  {
    from: 'updatedAt',
  },
];
export const CHECK_LIST_TEMPLATE_DETAIL_HEADER = [
  {
    from: 'i',
  },
  {
    from: 'code',
  },
  {
    from: 'title',
  },
  {
    from: 'description',
  },
  {
    from: 'obligatory',
  },
];

export enum CheckListTemplateObligatoryConstant {
  NO = 0,
  YES = 1,
}

export const CheckTypeImport = {
  'Pass-Fail': CheckTypeEnum.PassFail,
};
