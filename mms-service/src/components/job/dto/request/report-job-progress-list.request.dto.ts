import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { PaginationQuery } from '@utils/pagination.query';
import { IsNotEmpty } from 'class-validator';

export class ListJobProgressRequestDto extends PaginationQuery {
  @IsNotEmpty()
  user: UserInforRequestDto;
}
