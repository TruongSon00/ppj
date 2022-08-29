import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class SupplyDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  unit: string;
}

export class DeviceSupplyDto {
  @ApiProperty()
  @Expose()
  supply: SupplyDto;

  @ApiProperty()
  @Expose()
  quantity: number;

  @ApiProperty()
  @Expose()
  useDate: number;
}

export class MaintenanceAccessoryDto {
  @ApiProperty()
  @Expose()
  supply: SupplyDto;

  @ApiProperty()
  @Expose()
  quantity: number;
}

export class DetailInfoResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  vendor: string;

  @ApiProperty()
  @Expose()
  brand: string;

  @ApiProperty()
  @Expose()
  deviceGroup: any;

  @ApiProperty()
  @Expose()
  model: string;

  @ApiProperty()
  @Expose()
  manufacturingDate: string;

  @ApiProperty()
  @Expose()
  importDate: string;

  @ApiProperty()
  @Expose()
  warrantyPeriod: number;

  @ApiProperty({ type: DeviceSupplyDto, isArray: true })
  @Expose()
  @Type(() => DeviceSupplyDto)
  supplies: DeviceSupplyDto[];

  @ApiProperty({ type: MaintenanceAccessoryDto, isArray: true })
  @Expose()
  @Type(() => MaintenanceAccessoryDto)
  accessories: MaintenanceAccessoryDto[];
}
