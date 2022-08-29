import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { JOB_CONST } from '@components/job/job.constant';
export class UpdateStatusJobBodyDto extends BaseDto {}
export class UpdateStatusJobRequestDto extends UpdateStatusJobBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  user: UserInforRequestDto;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(JOB_CONST.DESCRIPTION.MAX_LENGTH)
  reason: string;
}
