export const DEVICE_GROUP_CONST = {
  ID: {
    COLUMN: '_id',
  },
  DESCRIPTION: {
    MAX_LENGTH: 255,
    COLUMN: 'description',
  },
  CODE: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 8,
    COLUMN: 'code',
    REGEX: /^[a-zA-Z0-9]+$/,
  },
  NAME: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 255,
    COLUMN: 'name',
    REGEX:
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ 0-9]+$/,
  },
  QUANTITY: {
    MIN: 1,
    MAX: 999,
  },
  COLL: 'deviceGroups',
};
export enum DeviceGroupStatusConstant {
  AWAITING,
  CONFIRMED,
  COMPLETED,
}
export const STATUS_TO_DELETE_OR_UPDATE_DEVICE_GROUP = [
  DeviceGroupStatusConstant.AWAITING,
];
export const DEVICE_GROUP_NAME = 'device-group';
export const DEVICE_GROUP_HEADER = [
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
    from: 'active',
  },
  {
    from: 'createdAt',
  },
  {
    from: 'updatedAt',
  },
];

export const IMPORT_DEVICE_GROUP_CONST = {
  FILE_NAME: 'import_device_group_template.xlsx',
  ENTITY_KEY: 'device-group',
  COLUMNS: ['code', 'name', 'description'],
  REQUIRED_FIELDS: ['code', 'name'],
};
