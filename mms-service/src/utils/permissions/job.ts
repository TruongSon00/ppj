import { FORMAT_CODE_PERMISSION } from '@constant/common';
import { StatusPermission } from '@constant/common';

export const JOB_GROUP_PERMISSION = {
  name: 'BÁO CÁO TIẾN ĐỘ CÔNG VIỆC',
  code: FORMAT_CODE_PERMISSION + 'JOB_GROUP',
  status: StatusPermission.ACTIVE,
};

const STATUS = StatusPermission.ACTIVE;
const GROUP = JOB_GROUP_PERMISSION.code;

export const REPORT_DETAIL_JOB_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'REPORT_DETAIL_JOB',
  name: 'Báo cáo tiến độ công việc',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const JOB_PERMISSION = [
  REPORT_DETAIL_JOB_PERMISSION
]

