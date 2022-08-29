import { BaseResponseDto } from '@core/dto/base.response.dto';
import { Expose } from 'class-transformer';

export class DetailErrorTypeResponse extends BaseResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  priority: number;

  @Expose()
  createdAt: Date;
}
