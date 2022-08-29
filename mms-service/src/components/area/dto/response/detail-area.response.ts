import { BaseResponseDto } from '@core/dto/base.response.dto';
import { Expose, Type } from 'class-transformer';

export class InterRegion {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;
}

export class Region {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Type(() => InterRegion)
  @Expose()
  interRegion: InterRegion;
}

export class Factory {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  phone: string;

  @Expose()
  location: string;

  @Type(() => Region)
  @Expose()
  region: Region;
}
export class DetailAreaResponse extends BaseResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Type(() => Factory)
  @Expose()
  factory: Factory;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
