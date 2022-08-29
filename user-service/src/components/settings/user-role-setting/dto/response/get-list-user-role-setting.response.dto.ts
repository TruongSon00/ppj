import { Expose } from 'class-transformer';

export class GetListUserRoleSettingResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  code: string;
}
