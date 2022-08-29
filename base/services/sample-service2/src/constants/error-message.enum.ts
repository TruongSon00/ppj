export enum ErrorMessageEnum {
  // ================= General error message ===============================
  NOT_FOUND = 'Data not found',
  INTERNAL_SERVER_ERROR = 'Internal server error',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Access denied',
  BAD_REQUEST = 'Bad request',
  SUCCESS = 'Success',
  TOKEN_EXPIRED = 'Token expired',

  // ================= General User error message ===============================
  UNIQUE_DATA_USER = 'Username or Email or Code already exists',
  DEPARMENT_NOT_FOUND = 'Deparment not found',
  USER_ROLE_NOT_FOUND = 'User role not found',
  COMPANY_NOT_FOUND = 'Company not found',
  FACTORY_NOT_FOUND = 'Factory not found',
  WAREHOUSE_NOT_FOUND = 'Warehouse not found',
}
