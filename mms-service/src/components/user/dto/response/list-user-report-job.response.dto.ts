import { getUserRoleSettingName } from '@utils/common';
import { Expose, Transform } from 'class-transformer';

export class ListUserReportJobResponse {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  fullName: string;

  @Expose()
  code: string;

  @Expose({ name: 'createdAt' })
  startWork: Date;

  @Transform(({ obj }) => getUserRoleSettingName(obj))
  @Expose()
  userRole: string;
}
