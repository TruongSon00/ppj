import * as dotenv from 'dotenv';
dotenv.config();

export enum APIPrefix {
  Version = 'api/v1',
}
export const jwtConstants = {
  acessTokenSecret: process.env.JWT_ACESS_TOKEN_SECRET,
  acessTokenExpiresIn: process.env.JWT_ACESS_TOKEN_EXPIRES_IN || 1800,
  refeshTokenSecret: process.env.JWT_RESFRESH_TOKEN_SECRET,
  refeshTokenExpiresIn: process.env.JWT_RESFRESH_TOKEN_EXPIRES_IN || 2000,
  refeshTokenExpiresMaxIn:
    process.env.JWT_RESFRESH_TOKEN_EXPIRES_MAX_IN || 432000,
};

export const SUPER_ADMIN = {
  code: '000000001',
  username: 'admin',
  password: 'snp1234567',
  email: 'admin@smartwms.vti.com.vn',
  fullName: 'Admin',
};

export const ROLE_SUPER_ADMIN = {
  code: '01',
  name: 'super-admin',
};

export const DEPARMENT_SUPER_ADMIN = {
  name: 'super-admin',
};

export const DATA_NOT_CHANGE = {
  DEFAULT_USERS: [SUPER_ADMIN],
  DEFAULT_COMPANIES: [
    {
      code: '000000001',
      name: 'VTI SnP',
    },
  ],
  DEFAULT_DEPARMENTS: [
    {
      name: 'SALE',
    },
    {
      name: 'Kho',
    },
    DEPARMENT_SUPER_ADMIN,
  ],
  DEFAULT_ROLES: [ROLE_SUPER_ADMIN],
};

export const FORMAT_CODE_PERMISSION = 'USER_';
export const REGEX_MAIL =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const REGEX_PHONE =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
