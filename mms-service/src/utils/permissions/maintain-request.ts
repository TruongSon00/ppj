import { FORMAT_CODE_PERMISSION, StatusPermission } from "@constant/common";

export const MAINTAIN_REQUEST_GROUP_PERMISSION = {
  name: 'Yêu cầu bảo trì người dùngs',
  code: FORMAT_CODE_PERMISSION + 'MAINTAIN_REQUEST',
  status: StatusPermission.ACTIVE,
};

const STATUS = StatusPermission.ACTIVE;
const GROUP = MAINTAIN_REQUEST_GROUP_PERMISSION.code;


export const CREATE_MAINTAIN_REQUEST_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_MAINTAIN_REQUEST',
  name: 'Tạo yêu cầu bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_MAINTAIN_REQUEST_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_MAINTAIN_REQUEST',
  name: 'Cập nhật yêu cầu bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DETAIL_MAINTAIN_REQUEST_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_MAINTAIN_REQUEST',
  name: 'Chi tiết yêu cầu bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DESTROY_MAINTAIN_REQUEST_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DESTROY_MAINTAIN_REQUEST',
  name: 'Xóa yêu cầu bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_MAINTAIN_REQUEST_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_MAINTAIN_REQUEST',
  name: 'Danh sách yêu cầu bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const APPROVE_MAINTAIN_REQUEST_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'APPROVE_MAINTAIN_REQUEST',
  name: 'Phê duyệt yêu cầu bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const REJECT_MAINTAIN_REQUEST_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'REJECT_MAINTAIN_REQUEST',
  name: 'Từ chối yêu cầu bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const COMPLETED_MAINTAIN_REQUEST_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'COMPLETED_MAINTAIN_REQUEST',
  name: 'Hoàn thành yêu cầu bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const REDO_MAINTAIN_REQUEST_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'REDO_MAINTAIN_REQUEST',
  name: 'Làm lại yêu cầu bảo trì',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const MAINTAIN_REQUEST_PERMISSION = [
  CREATE_MAINTAIN_REQUEST_PERMISSION,
  UPDATE_MAINTAIN_REQUEST_PERMISSION,
  DESTROY_MAINTAIN_REQUEST_PERMISSION,
  DETAIL_MAINTAIN_REQUEST_PERMISSION,
  LIST_MAINTAIN_REQUEST_PERMISSION,
  REJECT_MAINTAIN_REQUEST_PERMISSION,
  APPROVE_MAINTAIN_REQUEST_PERMISSION,
  COMPLETED_MAINTAIN_REQUEST_PERMISSION,
  REDO_MAINTAIN_REQUEST_PERMISSION
]





