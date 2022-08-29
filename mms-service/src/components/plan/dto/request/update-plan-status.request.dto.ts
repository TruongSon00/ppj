import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
export class UpdatePlanRequestBodyDto extends BaseDto {
  @ApiProperty({ example: 'reason' })
  @IsString()
  @IsOptional()
  @MaxLength(225)
  reason: string;

  @IsNotEmpty()
  user: UserInforRequestDto;
}
export class UpdatePlanStatusRequestDto extends UpdatePlanRequestBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
