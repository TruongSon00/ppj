export const MAINTENANCE_TEAM_CONST = {
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
    MAX_LENGTH: 255,
    MIN_LENGTH: 8,
    COLUMN: 'name',
    REGEX:
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ 0-9]+$/,
  },
  TYPE: {
    EXTERNAL: 0,
    INTERNAL: 1,
  },
};

export enum MaintenanceTeamMemberRoleConstant {
  LEADER,
  MEMBER,
}
