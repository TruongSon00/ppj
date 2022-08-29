import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  fullName: string;

  @Expose()
  code: string;

  @Expose()
  email: string;
}
