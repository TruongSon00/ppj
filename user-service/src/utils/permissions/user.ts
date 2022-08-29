import { FORMAT_CODE_PERMISSION } from '@constant/common';
import { StatusPermission } from '@utils/constant';

export const USER_GROUP_PERMISSION = {
  name: 'Quản lý người dùng',
  code: FORMAT_CODE_PERMISSION + 'USER_GROUP',
  status: StatusPermission.ACTIVE,
};

export const CREATE_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_USER',
  name: 'Tạo người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const UPDATE_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_USER',
  name: 'Sửa người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const DELETE_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_USER',
  name: 'Xóa người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const DETAIL_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_USER',
  name: 'Chi tiết người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const LIST_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_USER',
  name: 'Danh sách người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const CHANGE_PASSWORD_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CHANGE_PASSWORD_USER',
  name: 'Thay đổi mật khẩu tài khoản người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const USER_PERMISSION = [
  CREATE_USER_PERMISSION,
  UPDATE_USER_PERMISSION,
  DELETE_USER_PERMISSION,
  DETAIL_USER_PERMISSION,
  LIST_USER_PERMISSION,
  CHANGE_PASSWORD_USER_PERMISSION,
];
