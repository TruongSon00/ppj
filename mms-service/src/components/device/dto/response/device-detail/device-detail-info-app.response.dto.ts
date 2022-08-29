import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

class DeviceGroupDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;
}
class SupplyDto {
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

class DeviceSupplyDto {
  @ApiProperty()
  @Expose()
  @Type(() => SupplyDto)
  supply: SupplyDto;

  @ApiProperty()
  @Expose()
  quantity: number;

  @ApiProperty()
  @Expose()
  useDate: number;
}

class MaintenanceAccessoryDto {
  @ApiProperty()
  @Expose()
  @Type(() => SupplyDto)
  supply: SupplyDto;

  @ApiProperty()
  @Expose()
  quantity: number;
}

class DeviceInformationDto {
  @ApiProperty()
  @Expose()
  @Transform(({ value }) => `${value}`)
  vendor: string;

  @ApiProperty()
  @Expose()
  brand: string;

  @ApiProperty()
  @Expose()
  importDate: Date;

  @ApiProperty()
  @Expose()
  productionDate: Date;

  @ApiProperty()
  @Expose()
  warrantyPeriod: number;
}

export class DeviceDetailInfoAppResponseDto {
  @ApiProperty({ example: '123', description: 'Id' })
  @Expose()
  id: string;

  @ApiProperty({ example: '123', description: 'Model' })
  @Expose()
  model: string;

  @ApiProperty({
    example: {
      name: 'abc12345',
      code: 'ABC1234',
    },
    description: 'Nhóm thiết bị',
  })
  @Expose()
  @Type(() => DeviceGroupDto)
  deviceGroup: DeviceGroupDto;

  @ApiProperty({
    example: {
      vendor: 'HP',
      brand: 'HP',
      importDate: '2021-12-20T06:30:42.225Z',
      productionDate: '2021-12-20T06:30:42.225Z',
      warrantyPeriod: 0,
    },
    description: 'Thông tin thiết bị',
  })
  @Expose()
  @Type(() => DeviceInformationDto)
  information: DeviceInformationDto;

  @ApiProperty({
    example: {
      supply: {
        id: '61c2a5ffcebafc0c50a9bfd0',
        code: 'VNSA43',
        name: 'demo 2',
        unit: 'phuoc test 1',
      },
      quantity: 10,
      useDate: 10,
    },
    description: 'Vật tư',
  })
  @Expose()
  @Type(() => DeviceSupplyDto)
  supplies: DeviceSupplyDto[];

  @ApiProperty({
    example: {
      supply: {
        id: '61c2a5ffcebafc0c50a9bfd0',
        code: 'VNSA43',
        name: 'demo 2',
        unit: 'phuoc test 1',
      },
      quantity: 10,
    },
    description: 'Phụ Tùng',
  })
  @Expose()
  @Type(() => MaintenanceAccessoryDto)
  accessories: MaintenanceAccessoryDto[];

  @ApiProperty({ example: 0, description: 'loại thiết bị' })
  @Expose()
  type: string;
}
