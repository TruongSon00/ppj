import { FORMAT_CODE_PERMISSION } from '@constant/common';
import { StatusPermission } from '@utils/constant';

export const PERMISSION_USER_GROUP_PERMISSION = {
  name: 'Phân quyền',
  code: FORMAT_CODE_PERMISSION + 'PERMISSION_GROUP',
  status: StatusPermission.ACTIVE,
};

export const SET_PERMISSION_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'SET_PERMISSION_USER',
  name: 'Phân quyền cho người dùng',
  groupPermissionSettingCode: PERMISSION_USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const LIST_PERMISSION_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_PERMISSION_USER',
  name: 'Danh sách quyền của người dùng',
  groupPermissionSettingCode: PERMISSION_USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const PERMISSION_USER_PERMISSION = [
  SET_PERMISSION_USER_PERMISSION,
  LIST_PERMISSION_USER_PERMISSION,
];
