export const MAINTENANCE_ATTRIBUTE_CONST = {
  DESCRIPTION: {
    MAX_LENGTH: 255,
  },
  CODE: {
    MAX_LENGTH: 7,
    COLUMN: 'code',
    REGEX: /^[a-zA-Z0-9]+$/
  },
  NAME: {
    MAX_LENGTH: 255,
    COLUMN: 'name',
    REGEX: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ 0-9]+$/
  },
};
export enum GetAllConstant {
  NO,
  YES,
}
