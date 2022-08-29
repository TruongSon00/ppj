import { FORMAT_CODE_PERMISSION, StatusPermission } from "@constant/common";

export const DEVICE_GROUP_PERMISSION2 = {
  name: 'Định nghĩa thiết bị',
  code: FORMAT_CODE_PERMISSION + 'DEVICE_GROUP',
  status: StatusPermission.ACTIVE,
};

const STATUS = StatusPermission.ACTIVE;
const GROUP = DEVICE_GROUP_PERMISSION2.code;


export const CREATE_DEVICE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_DEVICE',
  name: 'Tạo thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_DEVICE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_DEVICE',
  name: 'Sửa thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DELETE_DEVICE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_DEVICE',
  name: 'Xóa thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DETAIL_DEVICE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_DEVICE',
  name: 'Chi tiết thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_DEVICE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_DEVICE',
  name: 'Danh sách thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const IMPORT_DEVICE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'IMPORT_DEVICE',
  name: 'Nhập thiết bị ',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
}

export const EXPORT_DEVICE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'EXPORT_DEVICE',
  name: 'Xuất thiết bị ',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
}

export const CONFIRM_DEVICE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_DEVICE',
  name: 'Xác nhận lệnh xuất nhập thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};


export const DEVICE_PERMISSION = [
  CREATE_DEVICE_PERMISSION,
  UPDATE_DEVICE_PERMISSION,
  DELETE_DEVICE_PERMISSION,
  DETAIL_DEVICE_PERMISSION,
  LIST_DEVICE_PERMISSION,
  IMPORT_DEVICE_PERMISSION,
  EXPORT_DEVICE_PERMISSION,
  CONFIRM_DEVICE_PERMISSION
];
