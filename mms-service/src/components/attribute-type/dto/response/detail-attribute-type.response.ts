import { DetailUnitResponse } from '@components/unit/dto/response/detail-unit.response';
import { BaseResponseDto } from '@core/dto/base.response.dto';
import { Expose, Type } from 'class-transformer';

export class DetailAttributeTypeResponse extends BaseResponseDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;

  @Type(() => DetailUnitResponse)
  @Expose()
  unit: DetailUnitResponse;
}
