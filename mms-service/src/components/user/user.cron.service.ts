import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserCronService {
  constructor(
    @Inject('USER_SERVICE_CLIENT')
    private readonly userServiceClient: ClientProxy,

  ) {}

  async insertPermission(permissions): Promise<any> {
    
    return await this.userServiceClient
      .send('insert_permission', permissions)
      .toPromise()
  }

  async deletePermissionNotActive(): Promise<any> {
    return await this.userServiceClient
      .send('delete_permission_not_active', {})
      .toPromise();

  }
}