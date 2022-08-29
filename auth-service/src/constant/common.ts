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

export const DATA_NOT_CHANGE = {
  DEFAULT_USERS: [
    {
      code: '000000001',
      username: 'admin',
      password: 'snp1234567',
      email: 'admin@smartwms.vti.com.vn',
      fullName: 'Admin',
    },
  ],
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
  ],
};

export const SUPER_ADMIN = {
  code: '000000001',
  username: 'admin',
  password: 'snp1234567',
  email: 'admin@smartwms.vti.com.vn',
  fullName: 'Admin',
};

export const FORMAT_CODE_PERMISSION = 'USER_';
