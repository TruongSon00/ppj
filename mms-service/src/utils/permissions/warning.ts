import { FORMAT_CODE_PERMISSION, StatusPermission } from "@constant/common";

export const WARNING_GROUP_PERMISSION = {
  name: 'Cảnh báo hệ thống',
  code: FORMAT_CODE_PERMISSION + 'WARNING_GROUP',
  status: StatusPermission.ACTIVE,
};

const STATUS = StatusPermission.ACTIVE;
const GROUP = WARNING_GROUP_PERMISSION.code;


export const DETAIL_WARNING_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_WARNING',
  name: 'Chi tiết cảnh báo',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_WARNING_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_WARNING',
  name: 'Danh sách cảnh báo',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const APPROVE_WARNING_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'APPROVE_WARNING',
  name: 'Xác nhận cảnh báo',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const REJECT_WARNING_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'REJECT_WARNING',
  name: 'Từ chối cảnh báo',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const WARNING_PERMISSION = [
  DETAIL_WARNING_PERMISSION,
  LIST_WARNING_PERMISSION,
  APPROVE_WARNING_PERMISSION,
  REJECT_WARNING_PERMISSION
];