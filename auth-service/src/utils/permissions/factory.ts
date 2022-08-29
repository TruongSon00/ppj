import { FORMAT_CODE_PERMISSION } from '@constant/common';
import { StatusPermission } from '@utils/common';

export const FACTORY_GROUP_PERMISSION = {
  name: 'Định nghĩa thông tin nhà máy',
  code: FORMAT_CODE_PERMISSION + 'FACTORY_GROUP',
  status: StatusPermission.ACTIVE,
};

export const CREATE_FACTORY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_FACTORY',
  name: 'Tạo thông tin nhà máy',
  groupPermissionSettingCode: FACTORY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const UPDATE_FACTORY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_FACTORY',
  name: 'Sửa thông tin nhà máy',
  groupPermissionSettingCode: FACTORY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const DELETE_FACTORY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_FACTORY',
  name: 'Xóa thông tin nhà máy',
  groupPermissionSettingCode: FACTORY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const DETAIL_FACTORY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_FACTORY',
  name: 'Chi tiết thông tin nhà máy',
  groupPermissionSettingCode: FACTORY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const LIST_FACTORY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_FACTORY',
  name: 'Danh sách thông tin nhà máy',
  groupPermissionSettingCode: FACTORY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const CONFIRM_FACTORY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_FACTORY',
  name: 'Xác nhận thông tin nhà máy',
  groupPermissionSettingCode: FACTORY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const REJECT_FACTORY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'REJECT_FACTORY',
  name: 'Từ chối xác nhận thông tin nhà máy',
  groupPermissionSettingCode: FACTORY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const FACTORY_PERMISSION = [
  CREATE_FACTORY_PERMISSION,
  UPDATE_FACTORY_PERMISSION,
  DELETE_FACTORY_PERMISSION,
  DETAIL_FACTORY_PERMISSION,
  LIST_FACTORY_PERMISSION,
  CONFIRM_FACTORY_PERMISSION,
  REJECT_FACTORY_PERMISSION,
];
