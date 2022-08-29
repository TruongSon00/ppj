export enum ACTION_IMPORT {
  CREATE = 'Tạo',
  UPDATE = 'Sửa',
}

export const TEMPLATE_COMPANY = {
  code: {
    key: 'code',
    maxLength: 5,
    notNull: true,
  },
  name: {
    key: 'name',
    maxLength: 255,
    notNull: true,
  },
  address: {
    key: 'address',
    maxLength: 255,
    notNull: true,
  },
  phone: {
    key: 'phone',
    maxLength: 20,
    notNull: false,
  },
  taxNo: {
    key: 'taxNo',
    maxLength: 20,
    notNull: false,
  },
  email: {
    key: 'email',
    maxLength: 255,
    notNull: false,
  },
  fax: {
    key: 'fax',
    maxLength: 255,
    notNull: false,
  },
  description: {
    key: 'description',
    maxLength: 255,
    notNull: false,
  },
  createdBy: {
    key: 'createdBy',
    notNull: false,
  },
  createdAt: {
    key: 'createdAt',
    notNull: false,
  },
};

export const TEMPLATE_FACTORY = {
  action: {
    key: 'action',
    notNull: true,
  },
  code: {
    key: 'code',
    type: 'string',
    maxLength: 20,
    notNull: true,
  },
  name: {
    key: 'name',
    type: 'string',
    maxLength: 255,
    notNull: true,
  },
  company: {
    key: 'company',
    type: 'string',
    maxLength: 255,
    notNull: true,
  },
  region: {
    key: 'region',
    type: 'string',
    minLength: 6,
    maxLength: 8,
    notNull: true,
  },
  location: {
    key: 'location',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
  phone: {
    key: 'phone',
    type: 'string',
    maxLength: 20,
    notNull: false,
  },
  description: {
    key: 'description',
    type: 'string',
    maxLength: 255,
    notNull: false,
  },
};
