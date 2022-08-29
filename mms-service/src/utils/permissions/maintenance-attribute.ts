import { FORMAT_CODE_PERMISSION, StatusPermission } from "@constant/common";

export const MAINTENANCE_ATTRIBUTE_GROUP_PERMISSION = {
  name: 'Định nghĩa thuộc tính bảo trì',
  code: FORMAT_CODE_PERMISSION + 'MAINTENANCE_ATTRIBUTE_GROUP',
  status: StatusPermission.ACTIVE,
};

const STATUS = StatusPermission.ACTIVE;
const GROUP = MAINTENANCE_ATTRIBUTE_GROUP_PERMISSION.code;


export const CREATE_MAINTENANCE_ATTRIBUTE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_MAINTENANCE_ATTRIBUTE',
  name: 'Tạo thuộc tính bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_MAINTENANCE_ATTRIBUTE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_MAINTENANCE_ATTRIBUTE',
  name: 'Sửa thuộc tính bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DELETE_MAINTENANCE_ATTRIBUTE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_MAINTENANCE_ATTRIBUTE',
  name: 'Xóa thuộc tính bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DETAIL_MAINTENANCE_ATTRIBUTE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_MAINTENANCE_ATTRIBUTE',
  name: 'Chi tiết thuộc tính bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_MAINTENANCE_ATTRIBUTE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_MAINTENANCE_ATTRIBUTE',
  name: 'Danh sách thuộc tính bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const MAINTENANCE_ATTRIBUTE_PERMISSION = [
  CREATE_MAINTENANCE_ATTRIBUTE_PERMISSION,
  UPDATE_MAINTENANCE_ATTRIBUTE_PERMISSION,
  DELETE_MAINTENANCE_ATTRIBUTE_PERMISSION,
  DETAIL_MAINTENANCE_ATTRIBUTE_PERMISSION,
  LIST_MAINTENANCE_ATTRIBUTE_PERMISSION
];
