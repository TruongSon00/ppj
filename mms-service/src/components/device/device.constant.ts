export const DEVICE_CONST = {
  CODE: {
    MAX_LENGTH: 7,
    COLUMN: 'code',
    PAD_CHAR: '0',
    PRE_FIX: '02',
    REGEX: /^[a-zA-Z0-9]+$/,
  },
  NAME: {
    MAX_LENGTH: 255,
    COLUMN: 'name',
    REGEX:
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ 0-9]+$/,
  },
  STATUS: {
    COLUMN: 'status',
  },
  MODEL: {
    MAX_LENGTH: 255,
    COLUMN: 'model',
  },
  DESCRIPTION: {
    MAX_LENGTH: 255,
    COLUMN: 'description',
  },
  DEVICE_GROUP: {
    COLUMN: 'deviceGroup',
  },
  DEVICE_GROUP_ID: {
    COLUMN: 'deviceGroupId',
  },
  VENDOR: {
    MAX_LENGTH: 255,
    COLUMN: 'vendor',
  },
  BRAND: {
    MAX_LENGTH: 255,
    COLUMN: 'brand',
  },
  COLL: 'devices',
  ID: {
    COLUMN: '_id',
  },
};

export enum ResponsibleSubjectType {
  User,
  MaintenanceTeam,
}
export const DEVICE_NAME = 'device';
export const DEVICE_HEADER = [
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
    from: 'status',
  },
  {
    from: 'model',
  },
  {
    from: 'deviceGroupName',
  },
  {
    from: 'periodicInspectionTime',
  },
  {
    from: 'frequency',
  },
  {
    from: 'price',
  },
  {
    from: 'maintenanceAttribute',
  },
  {
    from: 'type',
  },
  {
    from: 'vendor',
  },
  {
    from: 'brand',
  },
  {
    from: 'importDate',
  },
  {
    from: 'productionDate',
  },
  {
    from: 'warrantyPeriod',
  },
  {
    from: 'maintenancePeriod',
  },
  {
    from: 'mttaIndex',
  },
  {
    from: 'mttfIndex',
  },
  {
    from: 'mtbfIndex',
  },
  {
    from: 'mttrIndex',
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

export const IMPORT_DEVICE_CONST = {
  FILE_NAME: 'import_device_template.xlsx',
  ENTITY_KEY: 'device',
  COLUMNS: [
    'code',
    'name',
    'description',
    'price',
    'deviceGroupName',
    'isForManufacturing',
    'maintenanceAttributeName',
    'frequency',
    'periodicInspectionTime',
    'responsibleUser',
    'responsibleMaintenanceTeam',
  ],
  REQUIRED_FIELDS: [
    'code',
    'name',
    'deviceGroupName',
    'isForManufacturing',
    'maintenanceAttributeName',
    'frequency',
    'periodicInspectionTime',
  ],
};

export const DEVICE_DETAIL_HEADER = [
  {
    from: 'i',
  },
  {
    from: 'code',
  },
  {
    from: 'supply',
  },
  {
    from: 'supplyType',
  },
  {
    from: 'quantity',
  },
  {
    from: 'useDate',
  },
  {
    from: 'maintenancePeriod',
  },
  {
    from: 'mttaIndex',
  },
  {
    from: 'mttfIndex',
  },
  {
    from: 'mtbfIndex',
  },
  {
    from: 'mttrIndex',
  },
];

export enum DeviceType {
  Normal,
  ForManufacture,
}

export enum DeviceStatus {
  AwaitingConfirmation,
  Confirmed,
}
