import { FinalCheckUserPermissionRequestDto } from '@components/auth/dto/request/final-check-user-permission.request.dto';
import { ResponsePayload } from '@utils/response-payload';
import { CheckUserPermissionRequestDto } from '../dto/request/check-user-permission.request.dto';

export interface UserRoleServiceInterface {
  checkUserPermission(request: CheckUserPermissionRequestDto): Promise<any>;
  finalCheckUserPermission(
    request: FinalCheckUserPermissionRequestDto,
  ): Promise<ResponsePayload<any>>;
}
