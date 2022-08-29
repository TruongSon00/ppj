export enum SupplyTypeConstant {
  SUPPLY,
  ACCESSORY,
}

export enum SupplyStatusConstant {
  AWAITING,
  CONFIRMED,
  COMPLETED,
}
export const STATUS_TO_DELETE_OR_UPDATE_SUPPLY = [
  SupplyStatusConstant.AWAITING,
];
export enum GetAllConstant {
  NO,
  YES,
}
export const SUPPLY_CONST = {
  DESCRIPTION: {
    MAX_LENGTH: 255,
    COLUMN: 'description',
  },
  CODE: {
    MAX_LENGTH: 7,
    COLUMN: 'code',
    PAD_CHAR: '0',
    PRE_FIX: '02',
    REGEX: /^[a-zA-Z0-9]+$/
  },
  NAME: {
    MAX_LENGTH: 255,
    COLUMN: 'name',
    REGEX: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ 0-9]+$/
  },
  SUPPLY_GROUP: {
    COLUMN: 'groupSupplyId',
  },
};
export const SUPPLY_NAME = 'supply';
export const SUPPLY_HEADER = [
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
    from: 'supplyGroup',
  },
  {
    from: 'type',
  },
  {
    from: 'itemUnit',
  },
  {
    from: 'price',
  },
  {
    from: 'status',
  },
  {
    from: 'createdAt',
  },
  {
    from: 'updatedAt',
  },
  {
    from: 'responsibleUser',
  },
];
