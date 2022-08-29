import { SetMetadata } from '@nestjs/common';

export const PERMISSION_CODE = 'messagePattern';
export const PermissionCode = (msg: string) =>
  SetMetadata(PERMISSION_CODE, msg);
