import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@core/dto/base.dto';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';

export class JobImplementParam extends BaseDto {}
export class JobImplementRequestDto extends JobImplementParam {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  user: UserInforRequestDto;

  @ApiProperty()
  @IsOptional()
  history: any;
}
