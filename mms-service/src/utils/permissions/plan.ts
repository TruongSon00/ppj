import { FORMAT_CODE_PERMISSION, StatusPermission } from "@constant/common";

export const PLAN_GROUP_PERMISSION = {
  name: 'Kế hoạch',
  code: FORMAT_CODE_PERMISSION + 'PLAN_GROUP',
  status: StatusPermission.ACTIVE,
};

const STATUS = StatusPermission.ACTIVE;
const GROUP = PLAN_GROUP_PERMISSION.code;


export const CREATE_PLAN_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_PLAN',
  name: 'Tạo kế hoạch',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_PLAN_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_PLAN',
  name: 'Cập nhật kế hoạch',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DELETE_PLAN_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_PLAN',
  name: 'Xóa kế hoạch',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DETAIL_PLAN_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_PLAN',
  name: 'Chi tiết kế hoạch',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_PLAN_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_PLAN',
  name: 'Danh sách kế hoạch',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const PLAN_PERMISSION = [
  CREATE_PLAN_PERMISSION,
  UPDATE_PLAN_PERMISSION,
  DELETE_PLAN_PERMISSION,
  DETAIL_PLAN_PERMISSION,
  LIST_PLAN_PERMISSION
];
