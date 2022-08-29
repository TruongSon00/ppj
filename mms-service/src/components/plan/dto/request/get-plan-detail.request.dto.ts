import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '@utils/pagination.query';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
export class DetailPlanQueryDto extends PaginationQuery {}
export class DetailPlanRequestDto extends DetailPlanQueryDto {
  @IsNotEmpty()
  user: UserInforRequestDto;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
