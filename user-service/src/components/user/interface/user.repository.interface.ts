import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { UserWarehouse } from '@entities/user-warehouse/user-warehouse.entity';
import { User } from '@entities/user/user.entity';
import { UserDepartment } from '@entities/user-department/user-department.entity';
import { UserRole } from '@entities/user-role/user-role.entity';
import { UserFactory } from '@entities/user-factory/user-factory.entity';

export interface UserRepositoryInterface extends BaseInterfaceRepository<User> {
  checkUniqueUser(condition: any): Promise<any>;
  validateUser(username: string, password: string): Promise<any>;
  getListUser(request, arrWarehouseIdFilter?): Promise<any>;
  createEntity(userData: any): User;
  createUserWarehouseEntity(userId: number, warehouseId: number): UserWarehouse;
  createUserRoleEntity(
    userId: number,
    departmentId: number,
    userRoleId: number,
  ): UserRole;
  createUserDepartmentEntity(
    userId: number,
    departmentId: number,
  ): UserDepartment;
  createUserFactoryEntity(userId: number, factoryId: number): UserFactory;
  getDetail(id: number, withoutExtraInfo?: boolean): Promise<any>;
  delete(id: number): Promise<any>;
  isSuperAdmin(code: string): boolean;
  getUserNotInRoleCodes(roleCodes: string[]): Promise<any>;
  getCount(): Promise<any>;
  getUsersByCondition(condition: string): Promise<any[]>;
}
