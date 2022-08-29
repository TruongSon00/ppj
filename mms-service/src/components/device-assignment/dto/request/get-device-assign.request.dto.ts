import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { BaseDto } from '@core/dto/base.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class GetDeviceAssignRequestBody extends BaseDto {
  @IsNotEmpty()
  user: UserInforRequestDto;
}
export class GetDeviceAssignRequestDto extends GetDeviceAssignRequestBody {
  @IsMongoId()
  @IsNotEmpty()
  id: string;

}
