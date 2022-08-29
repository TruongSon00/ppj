import { FORMAT_CODE_PERMISSION, StatusPermission } from "@constant/common";

export const DEFECT_GROUP_PERMISSION = {
  name: 'Định nghĩa lỗi',
  code: FORMAT_CODE_PERMISSION + 'DEFECT_GROUP',
  status: StatusPermission.ACTIVE,
};

const STATUS = StatusPermission.ACTIVE;
const GROUP = DEFECT_GROUP_PERMISSION.code;


export const CREATE_DEFECT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_DEFECT',
  name: 'Tạo lỗi',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_DEFECT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_DEFECT',
  name: 'Sửa lỗi',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DELETE_DEFECT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_DEFECT',
  name: 'Xóa lỗi',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DETAIL_DEFECT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_DEFECT',
  name: 'Chi tiết lỗi',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_DEFECT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_DEFECT',
  name: 'Danh sách lỗi',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DEFECT_PERMISSION = [
  CREATE_DEFECT_PERMISSION,
  UPDATE_DEFECT_PERMISSION,
  DELETE_DEFECT_PERMISSION,
  DETAIL_DEFECT_PERMISSION,
  LIST_DEFECT_PERMISSION
];
