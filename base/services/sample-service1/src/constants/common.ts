import * as dotenv from 'dotenv';
dotenv.config();

export enum APIPrefix {
  Version = 'api/v1',
}

export enum OrderTypeEnum {
  Import = 0,
  Export = 1,
}

export const ORDER_TYPES = [OrderTypeEnum.Export, OrderTypeEnum.Import];

export enum OrderStatusEnum {
  Pending = 0,
  Confirmed = 1,
  InProgress = 2,
  Approved = 3,
  Completed = 4,
}

export const ORDER_STATUSES = [
  OrderStatusEnum.Pending,
  OrderStatusEnum.Confirmed,
  OrderStatusEnum.InProgress,
  OrderStatusEnum.Approved,
  OrderStatusEnum.Completed,
];

export const jwtConstants = {
  acessTokenSecret: process.env.JWT_ACESS_TOKEN_SECRET,
  acessTokenExpiresIn: process.env.JWT_ACESS_TOKEN_EXPIRES_IN || 1800,
  refeshTokenSecret: process.env.JWT_RESFRESH_TOKEN_SECRET,
  refeshTokenExpiresIn: process.env.JWT_RESFRESH_TOKEN_EXPIRES_IN || 2000,
};

export enum QrcCodeType {
  ITEM = '02',
  BLOCK = '03',
  PACKAGE = '04',
}

export enum WorkOrderStatus {
  REJECTED = 0,
  CREATED = 1,
  CONFIRMED = 2,
  IN_PROGRESS = 3,
  COMPLETED = 4,
}

export const HTTP_HEADER = {
  KEY: {
    CONTENT_DISPOSITION: 'Content-Disposition',
    CONTENT_TYPE: 'Content-Type',
  },
  VALUE: {
    ATTACHMENT: 'attachment; filename=',
    TEXT_CSV: 'text/csv',
    OCTET_STREAM: 'application/octet-stream',
  },
};
