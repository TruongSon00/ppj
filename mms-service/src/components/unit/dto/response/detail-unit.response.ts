import { BaseResponseDto } from '@core/dto/base.response.dto';
import { Expose } from 'class-transformer';

export class DetailUnitResponse extends BaseResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  active: number;
}
