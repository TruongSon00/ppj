import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@core/dto/base.dto';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { JOB_CONST } from '@components/job/job.constant';

export class JobRejectParam extends BaseDto {}
export class JobRejectRequestDto extends JobRejectParam {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(JOB_CONST.DESCRIPTION.MAX_LENGTH)
  reason: string;

  @ApiProperty()
  @IsNotEmpty()
  user: UserInforRequestDto;

  @ApiProperty()
  @IsOptional()
  history: any;
}
