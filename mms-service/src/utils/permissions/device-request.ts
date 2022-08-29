import { FORMAT_CODE_PERMISSION, StatusPermission } from "@constant/common";

export const DEVICE_REQUEST_GROUP_PERMISSION = {
  name: 'Yêu cầu thiết bị',
  code: FORMAT_CODE_PERMISSION + 'DEVICE_REQUEST',
  status: StatusPermission.ACTIVE,
};

const STATUS = StatusPermission.ACTIVE;
const GROUP = DEVICE_REQUEST_GROUP_PERMISSION.code;


export const CREATE_RETURN_TICKET_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_RETURN_TICKET',
  name: 'Tạo yêu cầu trả thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DETAIL_RETURN_TICKET_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_RETURN_TICKET',
  name: 'Chi tiết yêu cầu trả thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_RETURN_TICKET_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_RETURN_TICKET',
  name: 'Sửa yêu cầu trả thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DELETE_RETURN_TICKET_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_RETURN_TICKET',
  name: 'Xóa yêu cầu trả thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const CONFIRM_RETURN_TICKET_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_RETURN_TICKET',
  name: 'Xác nhận trả thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const REJECT_RETURN_TICKET_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'REJECT_RETURN_TICKET',
  name: 'Từ chối trả thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const CREATE_REQUEST_TICKET_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_REQUEST_TICKET',
  name: 'Tạo yêu cầu cấp thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DETAIL_REQUEST_TICKET_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_REQUEST_TICKET',
  name: 'Chi tiết yêu cầu cấp thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_REQUEST_TICKET_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_REQUEST_TICKET',
  name: 'Sửa yêu cầu cấp thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DELETE_REQUEST_TICKET_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_REQUEST_TICKET',
  name: 'Xóa yêu cầu cấp thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const CONFIRM_REQUEST_TICKET_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_REQUEST_TICKET',
  name: 'Xác nhận cấp thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const REJECT_REQUEST_TICKET_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'REJECT_REQUEST_TICKET',
  name: 'Từ chối cấp thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_DEVICE_REQUEST_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_DEVICE_REQUEST',
  name: 'Danh sách yêu cầu thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DEVICE_REQUEST_PERMISSION = [
  CREATE_REQUEST_TICKET_PERMISSION,
  CREATE_RETURN_TICKET_PERMISSION,
  UPDATE_REQUEST_TICKET_PERMISSION, 
  UPDATE_RETURN_TICKET_PERMISSION,
  DELETE_REQUEST_TICKET_PERMISSION,
  DELETE_RETURN_TICKET_PERMISSION,
  DETAIL_REQUEST_TICKET_PERMISSION,
  DETAIL_RETURN_TICKET_PERMISSION,
  CONFIRM_REQUEST_TICKET_PERMISSION,
  CONFIRM_RETURN_TICKET_PERMISSION,
  REJECT_REQUEST_TICKET_PERMISSION,
  REJECT_RETURN_TICKET_PERMISSION,
  LIST_DEVICE_REQUEST_PERMISSION
];
