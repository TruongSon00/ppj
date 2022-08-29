import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FactoryResponseDto } from '@components/factory/dto/response/factory.response.dto';
import { GetListUserRoleSettingResponseDto } from '@components/settings/user-role-setting/dto/response/get-list-user-role-setting.response.dto';
import { GetListDepartmentSettingResponseDto } from '@components/settings/department-setting/dto/response/get-list-department-setting.response.dto';

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
class UserResponse {
  @ApiProperty({ example: 1, description: '' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'admin', description: '' })
  @Expose()
  username: string;

  @ApiProperty({ example: 'admin', description: '' })
  @Expose()
  fullName: string;
}
class GetListUserRoleResponseDto {
  @Expose()
  id: number;

  @Expose()
  userRoleId: number;

  @Expose()
  departmentId: number;
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

  @ApiProperty({ example: '1970-01-01T00:00:00.000Z', description: '' })
  @Transform((v) => new Date(v.value).toISOString())
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

  @ApiProperty({ example: true, description: '' })
  @Expose()
  statusNotification: boolean;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @ApiProperty({ type: UserResponse })
  @Expose()
  @Type(() => UserResponse)
  createdBy: UserResponse;

  @ApiProperty({
    type: WarehouseResponse,
    example: [{ id: 1, name: 'warehouse 1' }],
    description: '',
  })
  @Expose()
  @Type(() => WarehouseResponse)
  userWarehouses: WarehouseResponse[];

  @ApiProperty({
    type: GetListUserRoleSettingResponseDto,
    example: [{ id: 1, name: 'role 1' }],
    description: '',
  })
  @Expose()
  @Type(() => GetListUserRoleSettingResponseDto)
  userRoleSettings: GetListUserRoleSettingResponseDto[];

  @ApiProperty({
    type: GetListUserRoleResponseDto,
    example: [{ id: 1, name: 'role 1' }],
    description: '',
  })
  @Expose()
  @Type(() => GetListUserRoleResponseDto)
  userRoles: GetListUserRoleResponseDto[];

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
