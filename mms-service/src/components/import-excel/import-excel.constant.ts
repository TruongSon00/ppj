import { INSTALLATION_TEMPLATE_CONST } from './../installation-template/installation-template.constant';
import { MAINTENANCE_ATTRIBUTE_CONST } from '@components/maintenance-attribute/maintenance-attribute.constant';
import { SUPPLY_GROUP_CONST } from '@components/supply-group/supply-group.constant';
import { SUPPLY_CONST } from '@components/supply/supply.constant';
import { CHECK_LIST_TEMPLATE_CONST } from '@components/checklist-template/checklist-template.constant';
import { MAINTENANCE_TEAM_CONST } from '@components/maintenance-team/maintenance-team.constant';

export const TEMPLATE_DEVICE_GROUP = {
  action: {
    key: 'action',
    notNull: true,
  },
  code: {
    key: 'code',
    type: 'string',
    maxLength: 7,
    notNull: true,
  },
  name: {
    key: 'name',
    type: 'string',
    maxLength: 255,
    notNull: true,
  },
  description: {
    key: 'description',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
  assign: {
    key: 'assign',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
};

export const TEMPLATE_DEFECTS = {
  action: {
    key: 'action',
    notNull: true,
  },
  code: {
    key: 'code',
    type: 'string',
    maxLength: 9,
    notNull: true,
  },
  name: {
    key: 'name',
    type: 'string',
    maxLength: 255,
    notNull: true,
  },
  description: {
    key: 'description',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
  deviceCode: {
    key: 'deviceCode',
    type: 'string',
    maxLength: 9,
    notNull: true,
  },
  priorityStr: {
    key: 'priority',
    type: 'string',
    maxLength: 25,
    notNull: true,
  },
};

export const DefectPriority = {
  Trivial: 1,
  Minor: 2,
  Major: 3,
  Critical: 4,
  Blocker: 5,
};

export const TEMPLATE_MAINTENANCE_ATTRIBUTE = {
  action: {
    key: 'action',
    notNull: true,
  },
  code: {
    key: 'code',
    type: 'string',
    maxLength: MAINTENANCE_ATTRIBUTE_CONST.CODE.MAX_LENGTH,
    notNull: true,
  },
  name: {
    key: 'name',
    type: 'string',
    maxLength: 255,
    notNull: true,
  },
  description: {
    key: 'description',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
};

export const TEMPLATE_ATTRIBUTE_TYPE = {
  action: {
    key: 'action',
    notNull: true,
  },
  code: {
    key: 'code',
    type: 'string',
    maxLength: 8,
    notNull: true,
  },
  name: {
    key: 'name',
    type: 'string',
    maxLength: 255,
    notNull: true,
  },
  description: {
    key: 'description',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
  unitCode: {
    key: 'unit',
    type: 'string',
    maxLength: 9,
    notNull: true,
  },
};

export const TEMPLATE_SUPPLY = {
  action: {
    key: 'action',
    notNull: true,
  },
  code: {
    key: 'code',
    type: 'string',
    maxLength: SUPPLY_CONST.CODE.MAX_LENGTH,
    notNull: true,
  },
  name: {
    key: 'name',
    type: 'string',
    maxLength: SUPPLY_CONST.NAME.MAX_LENGTH,
    notNull: true,
  },
  supplyGroupCode: {
    key: 'supplyGroupCode',
    type: 'string',
    maxLength: SUPPLY_GROUP_CONST.CODE.MAX_LENGTH,
    notNull: true,
  },
  type: {
    key: 'type',
    type: 'string',
    maxLength: 10,
    notNull: true,
  },
  unitCode: {
    key: 'unitCode',
    type: 'string',
    maxLength: 20,
    notNull: true,
  },
  price: {
    key: 'price',
    type: 'number',
    notNull: true,
  },
  description: {
    key: 'description',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
  assign: {
    key: 'assign',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
};

export const TEMPLATE_CHECK_LIST = {
  action: {
    key: 'action',
    notNull: true,
  },
  code: {
    key: 'code',
    type: 'string',
    maxLength: CHECK_LIST_TEMPLATE_CONST.CODE.MAX_LENGTH,
    notNull: true,
  },
  name: {
    key: 'name',
    type: 'string',
    maxLength: CHECK_LIST_TEMPLATE_CONST.NAME.MAX_LENGTH,
    notNull: true,
  },
  description: {
    key: 'description',
    type: 'string',
    maxLength: CHECK_LIST_TEMPLATE_CONST.DESCRIPTION.MAX_LENGTH,
    notNull: false,
  },
  checkType: {
    key: 'checkType',
    type: 'string',
    maxLength: 50,
    notNull: true,
  },
};

export const TEMPLATE_CHECK_LIST_DETAIL = {
  templateCode: {
    key: 'templateCode',
    type: 'string',
    maxLength: CHECK_LIST_TEMPLATE_CONST.CODE.MAX_LENGTH,
    notNull: true,
  },
  title: {
    key: 'title',
    type: 'string',
    maxLength: CHECK_LIST_TEMPLATE_CONST.TITLE.MAX_LENGTH,
    notNull: true,
  },
  description: {
    key: 'description',
    type: 'string',
    maxLength: CHECK_LIST_TEMPLATE_CONST.DESCRIPTION.MAX_LENGTH,
    notNull: true,
  },
  obligatoryStr: {
    key: 'obligatoryStr',
    type: 'string',
    maxLength: 25,
    notNull: true,
  },
};

export const TEMPLATE_INSTALLATION = {
  action: {
    key: 'action',
    notNull: true,
  },
  code: {
    key: 'code',
    type: 'string',
    maxLength: INSTALLATION_TEMPLATE_CONST.CODE.MAX_LENGTH,
    notNull: true,
  },
  name: {
    key: 'name',
    type: 'string',
    maxLength: INSTALLATION_TEMPLATE_CONST.NAME.MAX_LENGTH,
    notNull: true,
  },
  description: {
    key: 'description',
    type: 'string',
    maxLength: INSTALLATION_TEMPLATE_CONST.DESCRIPTION.MAX_LENGTH,
    notNull: false,
  },
};

export const TEMPLATE_INSTALLATION_DETAIL = {
  templateCode: {
    key: 'templateCode',
    type: 'string',
    maxLength: INSTALLATION_TEMPLATE_CONST.CODE.MAX_LENGTH,
    notNull: true,
  },
  title: {
    key: 'title',
    type: 'string',
    maxLength: INSTALLATION_TEMPLATE_CONST.TITLE.MAX_LENGTH,
    notNull: true,
  },
  description: {
    key: 'description',
    type: 'string',
    maxLength: INSTALLATION_TEMPLATE_CONST.DESCRIPTION.MAX_LENGTH,
    notNull: true,
  },
  obligatoryStr: {
    key: 'obligatoryStr',
    type: 'string',
    maxLength: 25,
    notNull: true,
  },
};

export const TEMPLATE_UNIT = {
  action: {
    key: 'action',
    notNull: true,
  },
  code: {
    key: 'code',
    type: 'string',
    minLength: 6,
    maxLength: 8,
    notNull: true,
  },
  name: {
    key: 'name',
    type: 'string',
    minLength: 8,
    maxLength: 255,
    notNull: true,
  },
  description: {
    key: 'description',
    type: 'string',
    maxLength: 255,
    notNull: true,
  },
};

export const MAINTENANCE_TEAM = {
  action: {
    key: 'action',
    notNull: true,
  },
  code: {
    key: 'code',
    type: 'string',
    maxLength: MAINTENANCE_TEAM_CONST.CODE.MAX_LENGTH,
    minLength: MAINTENANCE_TEAM_CONST.CODE.MIN_LENGTH,
    notNull: true,
  },
  name: {
    key: 'name',
    type: 'string',
    maxLength: MAINTENANCE_TEAM_CONST.NAME.MAX_LENGTH,
    minLength: MAINTENANCE_TEAM_CONST.NAME.MIN_LENGTH,
    notNull: true,
  },
  description: {
    key: 'description',
    type: 'string',
    maxLength: MAINTENANCE_TEAM_CONST.DESCRIPTION.MAX_LENGTH,
    notNull: false,
  },
  member: {
    key: 'member',
    type: 'number',
    notNull: true,
  },
  role: {
    key: 'role',
    type: 'number',
    notNull: true,
  },
};

export const TEMPLATE_INTER_REGION = {
  action: {
    key: 'action',
    notNull: true,
  },
  code: {
    key: 'code',
    type: 'string',
    minLength: 6,
    maxLength: 8,
    notNull: true,
  },
  name: {
    key: 'name',
    type: 'string',
    minLength: 8,
    maxLength: 255,
    notNull: true,
  },
  description: {
    key: 'description',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
};

export const TEMPLATE_REGION = {
  action: {
    key: 'action',
    notNull: true,
  },
  code: {
    key: 'code',
    type: 'string',
    minLength: 6,
    maxLength: 8,
    notNull: true,
  },
  name: {
    key: 'name',
    type: 'string',
    minLength: 8,
    maxLength: 255,
    notNull: true,
  },
  description: {
    key: 'description',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
  interRegionCode: {
    key: 'interRegionCode',
    type: 'string',
    minLength: 6,
    maxLength: 8,
    notNull: true,
  },
};

export const TEMPLATE_AREA = {
  action: {
    key: 'action',
    notNull: true,
  },
  code: {
    key: 'code',
    type: 'string',
    minLength: 6,
    maxLength: 8,
    notNull: true,
  },
  name: {
    key: 'name',
    type: 'string',
    minLength: 8,
    maxLength: 255,
    notNull: true,
  },
  description: {
    key: 'description',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
  factoryCode: {
    key: 'factoryCode',
    type: 'string',
    minLength: 6,
    maxLength: 8,
    notNull: true,
  },
};

export const TEMPLATE_ERROR_TYPE = {
  action: {
    key: 'action',
    notNull: true,
  },
  code: {
    key: 'code',
    type: 'string',
    minLength: 6,
    maxLength: 8,
    notNull: true,
  },
  name: {
    key: 'name',
    type: 'string',
    minLength: 8,
    maxLength: 255,
    notNull: true,
  },
  description: {
    key: 'description',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
  priority: {
    key: 'priority',
    type: 'number',
    notNull: true,
  },
};

export const TEMPLATE_VENDOR = {
  action: {
    key: 'action',
    notNull: true,
  },
  code: {
    key: 'code',
    type: 'string',
    minLength: 6,
    maxLength: 8,
    notNull: true,
  },
  name: {
    key: 'name',
    type: 'string',
    minLength: 8,
    maxLength: 255,
    notNull: true,
  },
  description: {
    key: 'description',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
  address: {
    key: 'address',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
  email: {
    key: 'email',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
  phone: {
    key: 'phone',
    type: 'string',
    maxLength: 13,
    notNull: false,
  },
  bank: {
    key: 'bank',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
  assignUser: {
    key: 'contactUser',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
};
