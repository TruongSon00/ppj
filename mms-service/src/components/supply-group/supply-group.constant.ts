export const SUPPLY_GROUP_CONST = {
  DESCRIPTION: {
    MAX_LENGTH: 255,
  },
  CODE: {
    MAX_LENGTH: 8,
    MIN_LENGTH: 6,
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
  COLL: 'supplyGroups',
  ID: {
    COLUMN: '_id',
  },
};

export const IMPORT_SUPPLY_GROUP_CONST = {
  FILE_NAME: 'import_supply_group_template.xlsx',
  ENTITY_KEY: 'supply-group',
  COLUMNS: ['code', 'name', 'description', 'responsibleUser'],
  REQUIRED_FIELDS: ['code', 'name', 'responsibleUser'],
};
