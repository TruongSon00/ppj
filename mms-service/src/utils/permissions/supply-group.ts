import { FORMAT_CODE_PERMISSION, StatusPermission } from "@constant/common";

export const SUPPLY_GROUP_GROUP_PERMISSION = {
  name: 'Định nghĩa nhóm vật tư',
  code: FORMAT_CODE_PERMISSION + 'SUPPLY_GROUP_GROUP',
  status: StatusPermission.ACTIVE,
};

const STATUS = StatusPermission.ACTIVE;
const GROUP = SUPPLY_GROUP_GROUP_PERMISSION.code;


export const CREATE_SUPPLY_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_SUPPLY_GROUP',
  name: 'Tạo nhóm vật tư',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_SUPPLY_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_SUPPLY_GROUP',
  name: 'Sửa nhóm vật tư',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DELETE_SUPPLY_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_SUPPLY_GROUP',
  name: 'Xóa nhóm vật tư',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DETAIL_SUPPLY_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_SUPPLY_GROUP',
  name: 'Chi tiết nhóm vật tư',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_SUPPLY_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_SUPPLY_GROUP',
  name: 'Danh sách nhóm vật tư',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const IMPORT_SUPPLY_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'IMPORT_SUPPLY_GROUP',
  name: 'Nhập nhóm vật tư ',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
}

export const EXPORT_SUPPLY_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'EXPORT_SUPPLY_GROUP',
  name: 'Xuất nhóm vật tư ',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
}

export const CONFIRM_SUPPLY_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_SUPPLY_GROUP',
  name: 'Xác nhận lệnh xuất nhập nhóm vật tư',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};


export const SUPPLY_GROUP_PERMISSION = [
  CREATE_SUPPLY_GROUP_PERMISSION,
  UPDATE_SUPPLY_GROUP_PERMISSION,
  DELETE_SUPPLY_GROUP_PERMISSION,
  DETAIL_SUPPLY_GROUP_PERMISSION,
  LIST_SUPPLY_GROUP_PERMISSION,
  IMPORT_SUPPLY_GROUP_PERMISSION,
  EXPORT_SUPPLY_GROUP_PERMISSION,
  CONFIRM_SUPPLY_GROUP_PERMISSION
];
