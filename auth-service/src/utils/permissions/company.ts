import { FORMAT_CODE_PERMISSION } from '@constant/common';
import { StatusPermission } from '@utils/common';

export const COMPANY_GROUP_PERMISSION = {
  name: 'Định nghĩa thông tin công ty',
  code: FORMAT_CODE_PERMISSION + 'COMPANY_GROUP',
  status: StatusPermission.ACTIVE,
};

export const CREATE_COMPANY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_COMPANY',
  name: 'Tạo thông tin công ty',
  groupPermissionSettingCode: COMPANY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const UPDATE_COMPANY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_COMPANY',
  name: 'Sửa thông tin công ty',
  groupPermissionSettingCode: COMPANY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const DELETE_COMPANY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_COMPANY',
  name: 'Xóa thông tin công ty',
  groupPermissionSettingCode: COMPANY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const DETAIL_COMPANY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_COMPANY',
  name: 'Chi tiết thông tin công ty',
  groupPermissionSettingCode: COMPANY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const LIST_COMPANY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_COMPANY',
  name: 'Danh sách thông tin công ty',
  groupPermissionSettingCode: COMPANY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const CONFIRM_COMPANY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_COMPANY',
  name: 'Xác nhận thông tin công ty',
  groupPermissionSettingCode: COMPANY_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const REJECT_COMPANY_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'REJECT_COMPANY',
  name: 'Từ chối xác nhận thông tin công ty',
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
];
