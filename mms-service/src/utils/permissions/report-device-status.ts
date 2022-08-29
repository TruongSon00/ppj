import { FORMAT_CODE_PERMISSION } from '@constant/common';
import { StatusPermission } from '@constant/common';

export const DEVICE_STATUS_GROUP_PERMISSION = {
  name: 'Báo cáo trạng thái thiết bị',
  code: FORMAT_CODE_PERMISSION + 'DEVICE_STATUS_GROUP',
  status: StatusPermission.ACTIVE,
};

const STATUS = StatusPermission.ACTIVE;
const GROUP = DEVICE_STATUS_GROUP_PERMISSION.code;

export const LIST_DEVICE_STATUS_ACTIVITY_INFO_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_DEVICE_STATUS_ACTIVITY_INFO',
  name: 'Thông tin hoạt động của trạng thái thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_DEVICE_STATUS_BY_SERIAL_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_DEVICE_STATUS_BY_SERIAL',
  name: 'Thông tin hoạt động theo serial thiết bị',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DEVICE_STATUS_PERMISSION = [
  LIST_DEVICE_STATUS_ACTIVITY_INFO_PERMISSION,
  LIST_DEVICE_STATUS_BY_SERIAL_PERMISSION
]
