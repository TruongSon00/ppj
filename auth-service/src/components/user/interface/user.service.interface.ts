export interface UserServiceInterface {
  getDetail(id, accessToken): Promise<any>;
}
