import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { BaseDto } from '@core/dto/base.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DetailJobDraftRequestDto extends BaseDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  user: UserInforRequestDto;
}
