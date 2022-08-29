import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
export class ApproveJobParam extends BaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class ApproveJobRequestDto extends ApproveJobParam {
  @ApiProperty()
  @IsNotEmpty()
  user: UserInforRequestDto;

  @ApiProperty()
  @IsOptional()
  history: any;
}
