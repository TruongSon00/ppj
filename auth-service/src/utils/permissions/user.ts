import { FORMAT_CODE_PERMISSION } from '@constant/common';
import { StatusPermission } from '@utils/common';

export const USER_GROUP_PERMISSION = {
  name: 'Định nghĩa thông tin người dùng',
  code: FORMAT_CODE_PERMISSION + 'USER_GROUP',
  status: StatusPermission.ACTIVE,
};

export const CREATE_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_USER',
  name: 'Tạo thông tin người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const UPDATE_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_USER',
  name: 'Sửa thông tin người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const DELETE_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_USER',
  name: 'Xóa thông tin người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const DETAIL_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_USER',
  name: 'Chi tiết thông tin người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const LIST_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_USER',
  name: 'Danh sách thông tin người dùng',
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
