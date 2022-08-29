import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';

export class InprogressJobRequestDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  user: UserInforRequestDto;

  @ApiProperty()
  @IsOptional()
  history: any;
}
