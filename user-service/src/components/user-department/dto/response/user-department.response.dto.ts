import { Expose } from 'class-transformer';

export class UserDepartmentResponseDto {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  departmentId: number;
}
