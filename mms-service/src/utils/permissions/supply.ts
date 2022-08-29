import { FORMAT_CODE_PERMISSION, StatusPermission } from "@constant/common";

export const SUPPLY_GROUP_PERMISSION2 = {
  name: 'Định nghĩa vật tư phụ tùng',
  code: FORMAT_CODE_PERMISSION + 'SUPPLY_GROUP',
  status: StatusPermission.ACTIVE,
};

const STATUS = StatusPermission.ACTIVE;
const GROUP = SUPPLY_GROUP_PERMISSION2.code;


export const CREATE_SUPPLY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_SUPPLY',
  name: 'Tạo vật tư phụ tùng',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_SUPPLY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_SUPPLY',
  name: 'Sửa vật tư phụ tùng',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DELETE_SUPPLY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_SUPPLY',
  name: 'Xóa vật tư phụ tùng',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DETAIL_SUPPLY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_SUPPLY',
  name: 'Chi tiết vật tư phụ tùng',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_SUPPLY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_SUPPLY',
  name: 'Danh sách vật tư phụ tùng',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const IMPORT_SUPPLY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'IMPORT_SUPPLY',
  name: 'Nhập vật tư phụ tùng ',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
}

export const EXPORT_SUPPLY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'EXPORT_SUPPLY',
  name: 'Xuất vật tư phụ tùng ',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
}

export const CONFIRM_SUPPLY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_SUPPLY',
  name: 'Xác nhận lệnh xuất nhập vật tư phụ tùng',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};


export const SUPPLY_PERMISSION = [
  CREATE_SUPPLY_PERMISSION,
  UPDATE_SUPPLY_PERMISSION,
  DELETE_SUPPLY_PERMISSION,
  DETAIL_SUPPLY_PERMISSION,
  LIST_SUPPLY_PERMISSION,
  IMPORT_SUPPLY_PERMISSION,
  EXPORT_SUPPLY_PERMISSION,
  CONFIRM_SUPPLY_PERMISSION
];
