import { FORMAT_CODE_PERMISSION } from '@constant/common';
import { StatusPermission } from '@utils/constant';

export const COMPANY_GROUP_PERMISSION = {
  name: 'Định nghĩa công ty',
  code: FORMAT_CODE_PERMISSION + 'COMPANY_GROUP',
  status: StatusPermission.ACTIVE,
};

export const CREATE_COMPANY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_COMPANY',
  name: 'Tạo công ty',
  groupPermissionSettingCode: COMPANY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const UPDATE_COMPANY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_COMPANY',
  name: 'Sửa công ty',
  groupPermissionSettingCode: COMPANY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const DELETE_COMPANY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_COMPANY',
  name: 'Xóa công ty',
  groupPermissionSettingCode: COMPANY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const DETAIL_COMPANY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_COMPANY',
  name: 'Chi tiết công ty',
  groupPermissionSettingCode: COMPANY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const LIST_COMPANY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_COMPANY',
  name: 'Danh sách công ty',
  groupPermissionSettingCode: COMPANY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const CONFIRM_COMPANY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_COMPANY',
  name: 'Xác nhận công ty',
  groupPermissionSettingCode: COMPANY_GROUP_PERMISSION.code,
  status: StatusPermission.INACTIVE,
};

export const REJECT_COMPANY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'REJECT_COMPANY',
  name: 'Từ chối xác nhận công ty',
  groupPermissionSettingCode: COMPANY_GROUP_PERMISSION.code,
  status: StatusPermission.INACTIVE,
};

export const IMPORT_COMPANY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'IMPORT_COMPANY',
  name: 'Nhập danh sách công ty',
  groupPermissionSettingCode: COMPANY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const COMPANY_PERMISSION = [
  CREATE_COMPANY_PERMISSION,
  UPDATE_COMPANY_PERMISSION,
  DELETE_COMPANY_PERMISSION,
  DETAIL_COMPANY_PERMISSION,
  LIST_COMPANY_PERMISSION,
  CONFIRM_COMPANY_PERMISSION,
  REJECT_COMPANY_PERMISSION,
  IMPORT_COMPANY_PERMISSION,
];
