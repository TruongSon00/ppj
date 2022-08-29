import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { IsNoSqlId } from '../../../../validator/is-nosql-id.validator';

export class GetDetailDeviceAppInfoRequestDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  id: string;
}
