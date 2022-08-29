import { DeviceGroupStatusConstant } from '@components/device-group/device-group.constant';

export const DEFECT_CONST = {
  DESCRIPTION: {
    MAX_LENGTH: 255,
    COLUMN: 'description',
  },
  CODE: {
    MAX_LENGTH: 9,
    COLUMN: 'code',
    PAD_CHAR: '0',
    REGEX: /^[a-zA-Z0-9]+$/
  },
  NAME: {
    MAX_LENGTH: 255,
    COLUMN: 'name',
    REGEX: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ 0-9]+$/
  },
  DEVICE: {
    COLUMN: 'deviceId',
  },
};
export enum DefectStatusConstant {
  AWAITING,
  CONFIRMED,
  COMPLETED,
}
export const STATUS_TO_DELETE_OR_UPDATE_DEFECT = [
  DeviceGroupStatusConstant.AWAITING,
];
export enum DefectPriorityConstant {
  BLOCKER = 5,
  CRITICAL = 4,
  MAJOR = 3,
  MINOR = 2,
  TRIVIAL = 1,
}
export const DEFECT_NAME = 'defect';
export const DEFECT_HEADER = [
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
    from: 'deviceName',
  },
  {
    from: 'priority',
  },
  {
    from: 'createdAt',
  },
  {
    from: 'updatedAt',
  },
];
