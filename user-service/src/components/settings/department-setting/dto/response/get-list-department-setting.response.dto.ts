import { Expose } from 'class-transformer';

export class GetListDepartmentSettingResponseDto {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;
}
