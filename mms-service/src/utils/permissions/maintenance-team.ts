import { FORMAT_CODE_PERMISSION, StatusPermission } from "@constant/common";

export const MAINTENANCE_TEAM_GROUP_PERMISSION = {
  name: 'Định nghĩa đội bảo trì',
  code: FORMAT_CODE_PERMISSION + 'MAINTENANCE_TEAM_GROUP',
  status: StatusPermission.ACTIVE,
};

const STATUS = StatusPermission.ACTIVE;
const GROUP = MAINTENANCE_TEAM_GROUP_PERMISSION.code;


export const CREATE_MAINTENANCE_TEAM_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_MAINTENANCE_TEAM',
  name: 'Tạo đội bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_MAINTENANCE_TEAM_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_MAINTENANCE_TEAM',
  name: 'Sửa đội bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DELETE_MAINTENANCE_TEAM_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_MAINTENANCE_TEAM',
  name: 'Xóa đội bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DETAIL_MAINTENANCE_TEAM_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_MAINTENANCE_TEAM',
  name: 'Chi tiết đội bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_MAINTENANCE_TEAM_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_MAINTENANCE_TEAM',
  name: 'Danh sách đội bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const MAINTENANCE_TEAM_PERMISSION = [
  CREATE_MAINTENANCE_TEAM_PERMISSION,
  UPDATE_MAINTENANCE_TEAM_PERMISSION,
  DELETE_MAINTENANCE_TEAM_PERMISSION,
  DETAIL_MAINTENANCE_TEAM_PERMISSION,
  LIST_MAINTENANCE_TEAM_PERMISSION
];
