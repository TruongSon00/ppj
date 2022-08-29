import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { BaseDto } from '@core/dto/base.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DeletePlanRequestDto extends BaseDto {
  @IsNotEmpty()
  user: UserInforRequestDto;

  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
