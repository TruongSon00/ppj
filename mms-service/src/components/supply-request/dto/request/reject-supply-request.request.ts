import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { IsNotEmpty } from 'class-validator';
import { DetailSupplyRequestRequest } from './detail-supply-request.request';

export class RejectSupplyRequestRequest extends DetailSupplyRequestRequest {
  @IsNotEmpty()
  user: UserInforRequestDto;
}
