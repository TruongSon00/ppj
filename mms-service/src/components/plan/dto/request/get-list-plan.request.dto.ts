import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { BaseDto } from '@core/dto/base.dto';
import { PaginationQuery } from '@utils/pagination.query';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
export class GetListPlanQueryRequestDto extends PaginationQuery {
}
export class GetListPlanRequestDto extends GetListPlanQueryRequestDto {
  @IsNotEmpty()
  user: UserInforRequestDto;
}
