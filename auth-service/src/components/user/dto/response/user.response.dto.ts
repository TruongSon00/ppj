import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetListDepartmentSettingResponseDto {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;
}
export class FactoryResponseDto {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;
}
export class GetListUserRoleSettingResponseDto {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;
}

class WarehouseResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ name: 'id' })
  @Expose()
  warehouseId: number;

  @ApiProperty()
  @Expose()
  factoryId: number;

  @ApiProperty()
  @Expose()
  factoryName: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;
}
class UserPermission {
  @ApiProperty()
  @Expose()
  code: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 1, description: '' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'abc@gmail.com', description: '' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'abc', description: '' })
  @Expose()
  username: string;

  @ApiProperty({ example: 'abc', description: '' })
  @Expose()
  fullName: string;

  @ApiProperty({ example: 1, description: '' })
  @Expose()
  companyId: string;

  @ApiProperty({ example: '2021-07-01', description: '' })
  @Expose()
  dateOfBirth: string;

  @ApiProperty({ example: 'abc', description: '' })
  @Expose()
  code: string;

  @ApiProperty({ example: '0987-1254-125', description: '' })
  @Expose()
  phone: string;

  @ApiProperty({ example: 1, description: '' })
  @Expose()
  status: number;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @ApiProperty({
    type: WarehouseResponse,
    example: [{ id: 1, name: 'warehouse 1' }],
    description: '',
  })
  @Expose()
  @Type(() => WarehouseResponse)
  userWarehouses: WarehouseResponse[];

  @ApiProperty({
    example: [{ id: 1, name: 'role 1' }],
    description: '',
  })
  @Expose()
  @Type(() => GetListUserRoleSettingResponseDto)
  userRoleSettings: GetListUserRoleSettingResponseDto[];

  @ApiProperty({
    type: GetListDepartmentSettingResponseDto,
    example: [{ id: 1, name: 'department 1' }],
    description: '',
  })
  @Expose()
  @Type(() => GetListDepartmentSettingResponseDto)
  departmentSettings: GetListDepartmentSettingResponseDto[];

  @ApiProperty({
    type: FactoryResponseDto,
    example: [{ id: 1, name: 'factory 1' }],
    description: '',
  })
  @Expose()
  @Type(() => FactoryResponseDto)
  factories: FactoryResponseDto[];

  @ApiProperty({
    type: UserPermission,
  })
  @Expose()
  @Type(() => UserPermission)
  userPermissions: UserPermission[];
}
