import { FORMAT_CODE_PERMISSION } from '@constant/common';
import { StatusPermission } from '@utils/constant';

export const FACTORY_GROUP_PERMISSION = {
  name: 'Định nghĩa nhà máy',
  code: FORMAT_CODE_PERMISSION + 'FACTORY_GROUP',
  status: StatusPermission.ACTIVE,
};

export const CREATE_FACTORY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_FACTORY',
  name: 'Tạo nhà máy',
  groupPermissionSettingCode: FACTORY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const UPDATE_FACTORY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_FACTORY',
  name: 'Sửa nhà máy',
  groupPermissionSettingCode: FACTORY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const DELETE_FACTORY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_FACTORY',
  name: 'Xóa nhà máy',
  groupPermissionSettingCode: FACTORY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const DETAIL_FACTORY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_FACTORY',
  name: 'Chi tiết nhà máy',
  groupPermissionSettingCode: FACTORY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const LIST_FACTORY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_FACTORY',
  name: 'Danh sách nhà máy',
  groupPermissionSettingCode: FACTORY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const CONFIRM_FACTORY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_FACTORY',
  name: 'Xác nhận nhà máy',
  groupPermissionSettingCode: FACTORY_GROUP_PERMISSION.code,
  status: StatusPermission.INACTIVE,
};

export const REJECT_FACTORY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'REJECT_FACTORY',
  name: 'Từ chối xác nhận nhà máy',
  groupPermissionSettingCode: FACTORY_GROUP_PERMISSION.code,
  status: StatusPermission.INACTIVE,
};

export const IMPORT_FACTORY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'IMPORT_FACTORY',
  name: 'Nhập danh sách nhà máy',
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
  IMPORT_FACTORY_PERMISSION,
];
