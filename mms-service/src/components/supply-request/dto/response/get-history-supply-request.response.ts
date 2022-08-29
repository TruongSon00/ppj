import { BaseResponseDto } from '@core/dto/base.response.dto';
import { Expose, Type } from 'class-transformer';

class User {
  @Expose()
  id: string;

  @Expose()
  fullName: string;
}

export class GetHistorySupplyResponse extends BaseResponseDto {
  @Expose()
  createdAt: string;

  @Type(() => User)
  @Expose()
  user: User;

  @Expose()
  status: number;

  @Expose()
  action: number;

  @Expose()
  content: string;
}
