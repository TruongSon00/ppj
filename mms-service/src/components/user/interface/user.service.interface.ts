import { Filter, Sort } from '@utils/pagination.query';

export interface UserServiceInterface {
  getListByIDs(idList: number[]): Promise<any>;
  detailFactory(id: number): Promise<any>;
  detailUser(id: number): Promise<any>;
  detailCompany(id: number): Promise<any>;
  getUserList(): Promise<any>;
  getFactoryList(filter?: any): Promise<any>;
  getFactoryById(id: number): Promise<any>;
  getUserById(id: number): Promise<any>;
  getUserListByDepartment(): Promise<any>;
  getUsersByUsernames(usernames: string[]): Promise<any[]>;
  getUserListByDepartmentWithPagination(
    filter: Filter[],
    page: number,
    limit: number,
    sort: Sort[],
    keyword: string,
    department: string,
  ): Promise<any>;
  insertPermission(permissions): Promise<any>;
  deletePermissionNotActive(): Promise<any>;
}
