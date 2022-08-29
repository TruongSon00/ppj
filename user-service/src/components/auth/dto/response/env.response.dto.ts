import { IsArray } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ItemType {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  hasItemDetail: boolean;
}

class Role {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

export class Department {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  role: DeparmentRole[];
}

class ItemGroup {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;
}
class ItemUnit {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;
}

export class WarehouseType {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;
}

class Company {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  fax: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  updatedAt: string;

  @ApiProperty()
  @Expose()
  createdAt: string;
}

class Factory {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  companyId: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  fax: string;

  @ApiProperty()
  @Expose()
  location: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  updatedAt: string;

  @ApiProperty()
  @Expose()
  createdAt: string;
}

class UserPermisions {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;
}

export class GroupPermisions {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty({
    type: UserPermisions,
    isArray: true,
  })
  @Expose()
  @Type(() => UserPermisions)
  permissionSetting: UserPermisions[];
}

class DeparmentRole {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: number;

  @ApiProperty()
  @Expose()
  code: number;
}

export class EnvResponseDto {
  @ApiProperty({
    type: ItemType,
    isArray: true,
  })
  @Expose()
  @Type(() => ItemType)
  @IsArray()
  itemTypes: ItemType[];

  @ApiProperty({
    type: ItemType,
    isArray: true,
  })
  @Expose()
  @Type(() => Role)
  @IsArray()
  roles: Role[];

  @ApiProperty({
    type: ItemType,
    isArray: true,
  })
  @Expose()
  @Type(() => Department)
  @IsArray()
  deparments: Department[];

  @ApiProperty({
    type: ItemGroup,
    isArray: true,
  })
  @Expose()
  @Type(() => ItemGroup)
  itemGroups: ItemGroup[];

  @ApiProperty({
    type: ItemType,
    isArray: true,
  })
  @Expose()
  @Type(() => ItemUnit)
  itemUnits: ItemUnit[];

  @ApiProperty({
    type: WarehouseType,
    isArray: true,
  })
  @Expose()
  @Type(() => WarehouseType)
  warehouseTypes: WarehouseType[];

  @ApiProperty({
    type: Company,
    isArray: true,
  })
  @Expose()
  @Type(() => Company)
  companies: Company[];

  @ApiProperty({
    type: Factory,
    isArray: true,
  })
  @Expose()
  @Type(() => Factory)
  factories: Factory[];

  @ApiProperty({
    type: UserPermisions,
    isArray: true,
  })
  @Expose()
  @Type(() => UserPermisions)
  userPermisions: UserPermisions[];

  @ApiProperty({
    type: GroupPermisions,
    isArray: true,
  })
  @Expose()
  @Type(() => GroupPermisions)
  groupPermisions: GroupPermisions[];
}
