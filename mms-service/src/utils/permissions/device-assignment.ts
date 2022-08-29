import { FORMAT_CODE_PERMISSION, StatusPermission } from "@constant/common";

export const DEVICE_ASSIGNMENT_GROUP_PERMISSION = {
  name: 'Phân công thiết bị',
  code: FORMAT_CODE_PERMISSION + 'DEVICE_ASSIGNMENT_GROUP',
  status: StatusPermission.ACTIVE,
};

const STATUS = StatusPermission.ACTIVE;
const GROUP = DEVICE_ASSIGNMENT_GROUP_PERMISSION.code;


export const CREATE_DEVICE_ASSIGNMENT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_DEVICE_ASSIGNMENT',
  name: 'Tạo phân công thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_DEVICE_ASSIGNMENT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_DEVICE_ASSIGNMENT',
  name: 'Sửa phân công thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DELETE_DEVICE_ASSIGNMENT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_DEVICE_ASSIGNMENT',
  name: 'Xóa phân công thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DETAIL_DEVICE_ASSIGNMENT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_DEVICE_ASSIGNMENT',
  name: 'Chi tiết phân công thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_DEVICE_ASSIGNMENT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_DEVICE_ASSIGNMENT',
  name: 'Danh sách phân công thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const GENERATE_QR_CODE_SERIAL_DEVICE_ASSIGNMENT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'GENERATE_QR_CODE_SERIAL_DEVICE_ASSIGNMENT',
  name: 'Tạo mã qr code serial',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};


export const DEVICE_ASSIGNMENT_PERMISSION = [
  CREATE_DEVICE_ASSIGNMENT_PERMISSION,
  UPDATE_DEVICE_ASSIGNMENT_PERMISSION,
  DELETE_DEVICE_ASSIGNMENT_PERMISSION,
  DETAIL_DEVICE_ASSIGNMENT_PERMISSION,
  LIST_DEVICE_ASSIGNMENT_PERMISSION,
  GENERATE_QR_CODE_SERIAL_DEVICE_ASSIGNMENT_PERMISSION
];
