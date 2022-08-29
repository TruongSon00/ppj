import { FORMAT_CODE_PERMISSION, StatusPermission } from "@constant/common";

export const DEVICE_GROUP_GROUP_PERMISSION = {
  name: 'Định nghĩa nhóm thiết bị',
  code: FORMAT_CODE_PERMISSION + 'DEVICE_GROUP_GROUP',
  status: StatusPermission.ACTIVE,
};

const STATUS = StatusPermission.ACTIVE;
const GROUP = DEVICE_GROUP_GROUP_PERMISSION.code;


export const CREATE_DEVICE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_DEVICE_GROUP',
  name: 'Tạo nhóm thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_DEVICE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_DEVICE_GROUP',
  name: 'Sửa nhóm thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DELETE_DEVICE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_DEVICE_GROUP',
  name: 'Xóa nhóm thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DETAIL_DEVICE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_DEVICE_GROUP',
  name: 'Chi tiết nhóm thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_DEVICE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_DEVICE_GROUP',
  name: 'Danh sách nhóm thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const IMPORT_DEVICE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'IMPORT_DEVICE_GROUP',
  name: 'Nhập nhóm thiết bị ',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
}

export const EXPORT_DEVICE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'EXPORT_DEVICE_GROUP',
  name: 'Xuất nhóm thiết bị ',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
}

export const CONFIRM_DEVICE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_DEVICE_GROUP',
  name: 'Xác nhận lệnh xuất nhập nhóm thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};


export const DEVICE_GROUP_PERMISSION = [
  CREATE_DEVICE_GROUP_PERMISSION,
  UPDATE_DEVICE_GROUP_PERMISSION,
  DELETE_DEVICE_GROUP_PERMISSION,
  DETAIL_DEVICE_GROUP_PERMISSION,
  LIST_DEVICE_GROUP_PERMISSION,
  IMPORT_DEVICE_GROUP_PERMISSION,
  EXPORT_DEVICE_GROUP_PERMISSION,
  CONFIRM_DEVICE_GROUP_PERMISSION
];
